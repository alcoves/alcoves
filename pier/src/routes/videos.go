package routes

import (
	"context"
	"fmt"
	"log"
	"path/filepath"

	"github.com/bken-io/api/src/db"
	"github.com/bken-io/api/src/models"
	"github.com/bken-io/api/src/s3"
	"github.com/bken-io/api/src/tidal"
	jwt "github.com/form3tech-oss/jwt-go"
	"github.com/gofiber/fiber/v2"
	"github.com/minio/minio-go/v7"
)

// CreateVideoInput is used for creating videos
type CreateVideoInput struct {
	ID       string  `json:"id"`
	Title    string  `json:"title"`
	Duration float32 `json:"duration"`
}

// GetVideo returns a video
func GetVideo(c *fiber.Ctx) error {
	id := c.Params("id")
	db := db.DBConn
	var video models.Video
	result := db.Where("id = ?", id).Find(&video)

	if result.Error != nil {
		return c.SendStatus(500)
	}

	if video.ID == "" {
		return c.SendStatus(404)
	}

	// This logic can be used once private videos are a thing
	// user := c.Locals("user").(*jwt.Token)
	// claims := user.Claims.(jwt.MapClaims)
	// userID := claims["id"].(string)
	// if video.Visibility != "public" {
	// 	if video.UserID != userID {
	// 		return c.SendStatus(403)
	// 	}
	// }

	video.URL = fmt.Sprintf("https://cdn.bken.io/v/%s/hls/master.m3u8", video.ID)
	// video.URL = fmt.Sprintf("https://s3.us-east-2.wasabisys.com/cdn.bken.io/v/%s/hls/master.m3u8", video.ID)
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
			fmt.Println("user is querying for all videos", userID)
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

	extension := filepath.Ext(input.Title)
	filenameWithoutExtension := input.Title[0 : len(input.Title)-len(extension)]
	if extension == "" {
		return c.Status(400).SendString("failed to infer file extension")
	}

	video.ID = input.ID
	video.Duration = input.Duration

	user := c.Locals("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	userID := claims["id"].(string)

	video.UserID = userID
	video.Title = filenameWithoutExtension
	video.Thumbnail = fmt.Sprintf("https://cdn.bken.io/i/%s/t/thumb.webp", video.ID)
	res := db.Create(&video)

	if res.Error != nil {
		return c.SendStatus(500)
	}

	rcloneSourceFile := fmt.Sprintf("wasabi:cdn.bken.io/v/%s/%s%s", video.ID, video.ID, extension)
	rcloneDestinationDir := fmt.Sprintf("wasabi:cdn.bken.io/v/%s/hls", video.ID)
	tidal.CreateVideo(rcloneSourceFile, rcloneDestinationDir)

	thumbnailDestinationPath := fmt.Sprintf("wasabi:cdn.bken.io/i/%s/t/thumb.webp", video.ID)
	tidal.CreateThumbnail(rcloneSourceFile, thumbnailDestinationPath)
	return c.JSON(video)
}

// PatchVideo creates a new video
func PatchVideo(c *fiber.Ctx) error {
	id := c.Params("id")

	user := c.Locals("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	userID := claims["id"].(string)

	if userID == "" {
		c.SendStatus(403)
	}

	db := db.DBConn
	inputVideo := new(models.Video)
	c.BodyParser(inputVideo)

	video := new(models.Video)
	db.Where("id = ? and user_id = ?", id, userID).Find(&video)

	if inputVideo.Title != "" {
		video.Title = inputVideo.Title
	}

	if inputVideo.Visibility != "" {
		video.Visibility = inputVideo.Visibility
	}

	db.Save(&video)
	return c.SendString("Video successfully updated")
}

// HardDeleteVideo fully delete the video and all cdn resources
// Tidal resources will be retained
func HardDeleteVideo(c *fiber.Ctx) error {
	id := c.Params("id")
	db := db.DBConn

	user := c.Locals("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	userID := claims["id"].(string)

	var video models.Video
	db.Where("id = ?", id).Find(&video)
	if video.Title == "" {
		return c.SendStatus(404)
	}
	if video.UserID != userID {
		return c.SendStatus(403)
	}

	wasabiBucket := "cdn.bken.io"
	thumbnailsPrefix := fmt.Sprintf("i/%s/", id)
	videosPrefix := fmt.Sprintf("v/%s/", id)

	deleteObjects("wasabi", wasabiBucket, thumbnailsPrefix)
	deleteObjects("wasabi", wasabiBucket, videosPrefix)

	db.Unscoped().Delete(&video)
	return c.SendString("video successfully deleted")
}

func deleteObjects(client string, bucket string, prefix string) {
	var s3Client *minio.Client
	if client == "wasabi" {
		s3Client = s3.Wasabi()
	} else if client == "doco" {
		s3Client = s3.Doco()
	} else {
		panic("invalid s3 client")
	}

	objectsCh := make(chan minio.ObjectInfo)
	opts := minio.ListObjectsOptions{
		Recursive: true,
		Prefix:    prefix,
	}

	go func() {
		defer close(objectsCh)
		// List all objects from a bucket-name with a matching prefix.
		for object := range s3Client.ListObjects(context.Background(), bucket, opts) {
			if object.Err != nil {
				log.Fatalln(object.Err)
			}
			fmt.Println("object", object.Key)
			objectsCh <- object
		}
	}()

	opts2 := minio.RemoveObjectsOptions{
		GovernanceBypass: false,
	}

	for rErr := range s3Client.RemoveObjects(context.Background(), bucket, objectsCh, opts2) {
		fmt.Println("Error detected during deletion: ", rErr)
	}
}
