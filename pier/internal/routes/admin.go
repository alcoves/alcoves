package routes

import (
	"fmt"

	"github.com/bken-io/api/internal/db"
	"github.com/bken-io/api/internal/models"
	"github.com/bken-io/api/internal/tidal"
	jwt "github.com/form3tech-oss/jwt-go"
	"github.com/gofiber/fiber/v2"
)

func ReprocessVideos(c *fiber.Ctx) error {
	user := c.Locals("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	userID := claims["id"].(string)

	if userID != "7ec2aafd-1998-40ab-a812-d08baced3b9a" {
		c.SendStatus(403)
	}

	db := db.DBConn
	videos := []models.Video{}

	db.
		Order("created_at desc").
		Find(&videos)

	for i := 0; i < len(videos); i++ {
		video := videos[i]
		fmt.Println("video", video.ID)
		rcloneSourceFile := fmt.Sprintf("wasabi:cdn.bken.io/v/%s/%s%s", video.ID, video.ID, ".mp4")
		rcloneDestinationDir := fmt.Sprintf("wasabi:cdn.bken.io/v/%s/hls", video.ID)
		tidal.CreateVideo(rcloneSourceFile, rcloneDestinationDir)

		thumbnailDestinationPath := fmt.Sprintf("wasabi:cdn.bken.io/v/%s/thumb.webp", video.ID)
		tidal.CreateThumbnail(rcloneSourceFile, thumbnailDestinationPath)
	}

	return c.SendStatus(202)
}
