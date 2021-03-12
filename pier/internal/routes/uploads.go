package routes

import (
	"context"
	"fmt"
	"path/filepath"
	"time"

	"github.com/bken-io/api/internal/s3"
	jwt "github.com/form3tech-oss/jwt-go"
	"github.com/gofiber/fiber/v2"
	"github.com/teris-io/shortid"
)

// CreateUploadInput is used for creating signed urls
type CreateUploadInput struct {
	FileName string `json:"filename"`
}

// CreateUploadPayload instructs the client how to call the /videos endpoint
type CreateUploadPayload struct {
	ID  string `json:"id"`
	URL string `json:"url"`
}

// CreateUpload initiates the upload process
func CreateUpload(c *fiber.Ctx) error {
	user := c.Locals("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	userID := claims["id"].(string)

	if userID == "" {
		return c.SendStatus(403)
	}

	input := new(CreateUploadInput)
	if err := c.BodyParser(input); err != nil {
		return err
	}
	extension := filepath.Ext(input.FileName)
	if extension == "" {
		return c.Status(400).SendString("failed to infer file extension")
	}

	// TODO :: Check videos table for id collision
	id, sidErr := shortid.Generate()
	if sidErr != nil {
		return c.SendStatus(400)
	}

	// For length of requested urls
	// Create signed urls
	// Start multipart upload

	s3Path := fmt.Sprintf("v/%s/%s%s", id, id, extension)
	fiveMinutes := time.Duration(300 * 1000 * 1000 * 1000)
	uploadURLRes, err := s3.Wasabi().PresignedPutObject(
		context.Background(),
		"cdn.bken.io",
		s3Path,
		fiveMinutes,
	)
	if err != nil {
		return c.SendStatus(500)
	}

	signedURL := fmt.Sprintf("%s://%s%s?%s",
		uploadURLRes.Scheme,
		uploadURLRes.Host,
		uploadURLRes.Path,
		uploadURLRes.RawQuery,
	)

	dataResponse := CreateUploadPayload{
		ID:  id,
		URL: signedURL,
	}

	return c.JSON(fiber.Map{
		"message": "created upload url",
		"payload": dataResponse,
	})
}
