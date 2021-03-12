package routes

import (
	"fmt"
	"time"

	"github.com/bken-io/api/internal/db"
	"github.com/bken-io/api/internal/models"
	"github.com/gofiber/fiber/v2"
)

// CreateView registers a video view
func CreateView(c *fiber.Ctx) error {
	id := c.Params("id")

	requestingIPHeader := c.Get("cf-connecting-ip")
	if requestingIPHeader == "" {
		return c.Status(400).SendString("Unable to parse CF-Connecting-IP header")
	}

	db := db.DBConn
	var video models.Video
	db.Where("video_id", id).Find(&video)

	currentTime := time.Now()
	backdate := time.Duration(-video.Duration * 1000 * 1000 * 1000)
	timeOffset := currentTime.Add(backdate)

	var recentView models.VideoView
	db.
		Where("video_id = ?", video.VideoID).
		Where("ip = ?", requestingIPHeader).
		Where("created_at >= ?", timeOffset).
		Find(&recentView)

	if recentView.IP != "" {
		return c.SendString("video was recently viewed")
	}

	view := models.VideoView{
		VideoID: id,
		IP:      requestingIPHeader,
	}
	fmt.Println("creating video view record")
	db.Create(&view)
	fmt.Println("increment video view count")
	video.Views++
	db.Save(&video)
	return c.SendString("video view counted")
}
