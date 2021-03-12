package routes

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"path/filepath"
	"strings"

	"github.com/bken-io/api/internal/db"
	"github.com/bken-io/api/internal/models"
	"github.com/bken-io/api/internal/s3"
	"github.com/bken-io/api/internal/tidal"
	jwt "github.com/form3tech-oss/jwt-go"
	"github.com/gofiber/fiber/v2"
	"github.com/minio/minio-go/v7"
	"gorm.io/gorm/clause"
)

// CreateVideoInput is used for creating videos
type CreateVideoInput struct {
	ID       string  `json:"id"`
	Title    string  `json:"title"`
	Duration float32 `json:"duration"`
}

func hydrateVideoMeta(path string, video *models.Video) {
	db := db.DBConn
	object, err := s3.Wasabi().GetObject(
		context.Background(),
		"cdn.bken.io",
		path,
		minio.GetObjectOptions{})
	if err != nil {
		fmt.Println(err)
		log.Fatal("failed to get meta.json from cdn")
	}

	buf := new(bytes.Buffer)
	buf.ReadFrom(object)
	myFileContentAsString := buf.String()
	decoder := json.NewDecoder(strings.NewReader(myFileContentAsString))
	var videoMeta models.TidalMeta
	err = decoder.Decode(&videoMeta)
	if err != nil {
		fmt.Println("Error getting video metadata", err)
	}

	for i := 0; i < len(videoMeta.Renditions); i++ {
		rendition := models.VideoRendition{
			VideoID:          video.ID,
			Type:             videoMeta.Renditions[i].Type,
			Name:             videoMeta.Renditions[i].Name,
			PercentCompleted: videoMeta.Renditions[i].PercentCompleted,
		}
		if db.Model(&rendition).Where("video_id = ? and name = ?", video.ID, rendition.Name).Updates(&rendition).RowsAffected == 0 {
			db.Create(&rendition)
		}
	}

	video.Status = videoMeta.Status
	video.Duration = videoMeta.Duration
	video.Thumbnail = videoMeta.Thumbnail
	video.HLSMasterLink = videoMeta.HLSMasterLink
	video.SourceSegmentsCount = videoMeta.SourceSegmentsCount
}

// GetVideo returns a video
func GetVideo(c *fiber.Ctx) error {
	id := c.Params("id")
	db := db.DBConn
	var video models.Video
	result := db.Where("video_id", id).Find(&video)

	if result.Error != nil {
		return c.SendStatus(500)
	}
	if video.VideoID == "" {
		return c.SendStatus(404)
	}
	hydrateVideoMeta(fmt.Sprintf("v/%s/meta.json", video.VideoID), &video)
	db.Save(&video)
	result = db.Preload(clause.Associations).Where("video_id", id).Find(&video)
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

	video.VideoID = input.ID
	video.Duration = input.Duration

	user := c.Locals("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	userID := claims["id"].(string)

	video.UserID = userID
	video.Title = filenameWithoutExtension
	video.Thumbnail = fmt.Sprintf("https://cdn.bken.io/v/%s/thumb.webp", video.VideoID)
	res := db.Create(&video)

	if res.Error != nil {
		return c.SendStatus(500)
	}

	rcloneSourceFile := fmt.Sprintf("wasabi:cdn.bken.io/v/%s/%s%s", video.VideoID, video.VideoID, extension)
	rcloneDestinationDir := fmt.Sprintf("wasabi:cdn.bken.io/v/%s", video.VideoID)
	tidal.CreateVideo(rcloneSourceFile, rcloneDestinationDir)
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
	db.Where("video_id and user_id = ?", id, userID).Find(&video)

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
	db.Where("video_id", id).Find(&video)
	if video.Title == "" {
		return c.SendStatus(404)
	}
	if video.UserID != userID {
		return c.SendStatus(403)
	}

	// Delete all objects from s3
	deleteObjects("wasabi", "cdn.bken.io", fmt.Sprintf("v/%s/", id))

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
