package routes

import (
	"fmt"
	"sync"

	"github.com/bken-io/api/internal/db"
	"github.com/bken-io/api/internal/models"
	"github.com/bken-io/api/internal/tidal"
	jwt "github.com/form3tech-oss/jwt-go"
	"github.com/gofiber/fiber/v2"
)

func processVideo(v *models.Video, wg *sync.WaitGroup) {
	defer wg.Done()
	fmt.Println("reprocessing", v.VideoID)
	rcloneSourceFile := fmt.Sprintf("wasabi:cdn.bken.io/v/%s/%s%s", v.VideoID, v.VideoID, ".mp4")
	rcloneDestinationDir := fmt.Sprintf("wasabi:cdn.bken.io/v/%s/hls", v.VideoID)
	tidal.CreateVideo(rcloneSourceFile, rcloneDestinationDir)
}

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

	var wg sync.WaitGroup
	for i := 0; i < len(videos); i++ {
		wg.Add(1)
		go processVideo(&videos[i], &wg)
	}
	wg.Wait()
	return c.SendStatus(202)
}
