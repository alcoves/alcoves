package videos

import (
	"fmt"
	"time"

	"github.com/bken-io/api/api/db"
	"github.com/gofiber/fiber/v2"
	"github.com/teris-io/shortid"
	"gorm.io/gorm"
)

type Video struct {
	ID         string         `gorm:"primaryKey;default:uuid_generate_v4()" json:"id"`
	Title      string         `json:"title"`
	Duration   float32        `json:"duration"`
	CreatedAt  time.Time      `json:"createdAt"`
	UpdatedAt  time.Time      `json:"updatedAt"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"deletedAt"`
	User       string         `gorm:"index" json:"user"`
	Views      int            `gorm:"default:0" json:"views"`
	Visibility string         `gorm:"default:unlisted" json:"visibility"`
}

// GetVideo returns a video
func GetVideo(c *fiber.Ctx) error {
	id := c.Params("id")
	db := db.DBConn
	var video Video
	result := db.Where("id = ?", id).Find(&video)

	if result.Error != nil {
		return c.SendStatus(500)
	}

	if video.ID == "" {
		return c.SendStatus(404)
	}

	return c.JSON(video)
}

// GetVideos returns all videos
func GetVideos(c *fiber.Ctx) error {
	db := db.DBConn
	var videos []Video
	db.Find(&videos)
	return c.JSON(videos)
}

// CreateVideo creates a new video
func CreateVideo(c *fiber.Ctx) error {
	db := db.DBConn
	video := new(Video)

	if err := c.BodyParser(video); err != nil {
		return c.Status(400).SendString("video input failed unmarshalling")
	}

	id, sidErr := shortid.Generate()
	if sidErr != nil {
		return c.Status(500).SendString("failed to create video short id")
	}

	video.ID = id
	db.Create(&video)
	return c.JSON(video)
}

// DeleteVideo creates a new video
func DeleteVideo(c *fiber.Ctx) error {
	id := c.Params("id")
	db := db.DBConn

	var video Video
	db.Where("id = ?", id).Find(&video)

	fmt.Println(video)

	if video.Title == "" {
		return c.SendStatus(404)
	}

	db.Delete(&video)
	return c.SendString("Video successfully deleted")
}
