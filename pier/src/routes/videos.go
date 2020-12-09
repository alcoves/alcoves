package routes

import (
	"fmt"
	"mime"

	"github.com/bken-io/api/src/db"
	"github.com/bken-io/api/src/models"
	"github.com/bken-io/api/src/tidal"
	jwt "github.com/form3tech-oss/jwt-go"
	"github.com/gofiber/fiber/v2"
)

// CreateVideoInput is used for creating videos
type CreateVideoInput struct {
	ID       string  `json:"id"`
	Title    string  `json:"title"`
	FileType string  `json:"fileType"`
	Duration float32 `json:"duration"`
}

// GetVideo returns a video
func GetVideo(c *fiber.Ctx) error {
	id := c.Params("id")
	db := db.DBConn
	var video models.Video
	result := db.Where("id = ?", id).Find(&video)

	if video.Visibility != "public" {
		// TODO :: Make sure that the user requesting is the owner
		// return c.SendStatus(403)
	}

	if result.Error != nil {
		return c.SendStatus(500)
	}

	if video.ID == "" {
		return c.SendStatus(404)
	}

	// video.URL = fmt.Sprintf("https://cdn.bken.io/v/%s/hls/master.m3u8", video.ID)
	video.URL = fmt.Sprintf("https://s3.us-east-2.wasabisys.com/cdn.bken.io/v/%s/hls/master.m3u8", video.ID)
	return c.JSON(video)
}

// GetVideos returns all videos
func GetVideos(c *fiber.Ctx) error {
	userID := c.Query("userId")

	db := db.DBConn
	videos := []models.Video{}

	if userID != "" {
		visibility := c.Query("visibility")

		if visibility == "all" {
			// TODO :: check that they have permissions
			fmt.Println("querying for all videos", userID)
			db.
				Where("user_id = ?", userID).
				Order("created_at desc").
				Find(&videos)
		} else {
			fmt.Println("querying for public videos", userID)
			db.
				Where("visibility = 'public' and user_id = ?", userID).
				Order("created_at desc").
				Find(&videos)
		}
	} else {
		fmt.Println("returning all videos query")
		db.Where("visibility = 'public'").Order("created_at desc").Find(&videos)
	}

	return c.JSON(videos)
}

// CreateVideo creates a new video
func CreateVideo(c *fiber.Ctx) error {
	db := db.DBConn
	video := new(models.Video)
	input := new(CreateVideoInput)

	if err := c.BodyParser(input); err != nil {
		return c.Status(400).SendString("video input failed unmarshalling")
	}

	extensions, mErr := mime.ExtensionsByType(input.FileType)
	if mErr != nil {
		fmt.Println("mErr", mErr)
		return c.SendStatus(400)
	}

	video.ID = input.ID
	video.Duration = input.Duration

	user := c.Locals("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	userID := claims["id"].(string)

	video.UserID = userID
	video.Title = input.Title
	video.Thumbnail = fmt.Sprintf("https://cdn.bken.io/i/%s/t/thumb.webp", video.ID)
	res := db.Create(&video)

	if res.Error != nil {
		return c.SendStatus(500)
	}

	tidal.DispatchThumbnailJob(
		"thumbnail",
		"-vf scale=854:480:force_original_aspect_ratio=increase,crop=854:480 -vframes 1 -q:v 50",
		fmt.Sprintf("s3://tidal/%s/source%s", video.ID, extensions[0]),
		fmt.Sprintf("s3://cdn.bken.io/i/%s/t/thumb.webp", video.ID),
	)

	tidal.DispatchIngestJob(
		"ingest",
		fmt.Sprintf("s3://tidal/%s/source%s", video.ID, extensions[0]),
	)

	return c.JSON(video)
}

// PatchVideo creates a new video
func PatchVideo(c *fiber.Ctx) error {
	id := c.Params("id")
	db := db.DBConn

	inputVideo := new(models.Video)
	c.BodyParser(inputVideo)

	video := new(models.Video)
	db.Where("id = ?", id).Find(&video)

	if inputVideo.Title != "" {
		video.Title = inputVideo.Title
	}

	if inputVideo.Visibility != "" {
		video.Visibility = inputVideo.Visibility
	}

	db.Save(&video)
	return c.SendString("Video successfully updated")
}

// DeleteVideo creates a new video
func DeleteVideo(c *fiber.Ctx) error {
	id := c.Params("id")
	db := db.DBConn

	var video models.Video
	db.Where("id = ?", id).Find(&video)

	fmt.Println(video)

	if video.Title == "" {
		return c.SendStatus(404)
	}

	db.Delete(&video)
	return c.SendString("Video successfully deleted")
}
