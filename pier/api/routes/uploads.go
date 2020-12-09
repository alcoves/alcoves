package routes

import (
	"context"
	"fmt"
	"mime"
	"time"

	"github.com/bken-io/api/api/s3"
	"github.com/gofiber/fiber/v2"
	"github.com/teris-io/shortid"
)

// CreateUploadInput is used for creating signed urls
type CreateUploadInput struct {
	FileType string `json:"fileType"`
}

// CreateUploadPayload instructs the client how to call the /videos endpoint
type CreateUploadPayload struct {
	ID  string `json:"id"`
	URL string `json:"url"`
}

// CreateUpload initiates the upload process
func CreateUpload(c *fiber.Ctx) error {
	u := new(CreateUploadInput)

	if err := c.BodyParser(u); err != nil {
		return err
	}

	// TODO :: Check videos table for id collision
	id, sidErr := shortid.Generate()
	if sidErr != nil {
		return c.SendStatus(400)
	}
	extensions, mErr := mime.ExtensionsByType(u.FileType)
	if mErr != nil {
		return c.SendStatus(400)
	}

	s3Path := fmt.Sprintf("%s/source%s", id, extensions[0])
	fiveMinutes := time.Duration(300 * 1000 * 1000 * 1000)
	uploadURLRes, err := s3.Doco().PresignedPutObject(
		context.Background(),
		"tidal",
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
