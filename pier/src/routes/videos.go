package routes

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"path/filepath"
	"strings"

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

// TidalMetaRendition represents an individual video preset
type TidalMetaRendition struct {
	Type             string  `json:"type"`
	Name             string  `json:"name"`
	PercentCompleted float64 `json:"percent_completed"`
}

// TidalMeta is a struct that contains relevant metadata about a video encode
type TidalMeta struct {
	ID                  string               `json:"id"`
	Status              string               `json:"status"`
	Renditions          []TidalMetaRendition `json:"renditions"`
	HLSMasterLink       string               `json:"hls_master_link"`
	SourceSegmentsCount int                  `json:"source_segments_count"`
}

type GetVideoResponse struct {
	Tidal      TidalMeta `json:"tidal"`
	ID         string    `json:"id"`
	Title      string    `json:"title"`
	Views      int       `json:"views"`
	Duration   float32   `json:"duration"`
	UserID     string    `json:"userId"`
	Thumbnail  string    `json:"thumbnail"`
	Visibility string    `json:"visibility"`
}

func getVideoMeta(path string) TidalMeta {
	fmt.Println(path)
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
	var tm TidalMeta
	err = decoder.Decode(&tm)
	if err != nil {
		fmt.Println("twas an error")
	}
	return tm
}

func constructVideoResponse(v models.Video, meta TidalMeta) GetVideoResponse {
	res := GetVideoResponse{
		Tidal:      meta,
		ID:         v.ID,
		Title:      v.Title,
		Views:      v.Views,
		UserID:     v.UserID,
		Duration:   v.Duration,
		Thumbnail:  v.Thumbnail,
		Visibility: v.Visibility,
	}
	return res
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

	tidalMeta := getVideoMeta(fmt.Sprintf("v/%s/meta.json", video.ID))
	res := constructVideoResponse(video, tidalMeta)
	return c.JSON(res)
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
	video.Thumbnail = fmt.Sprintf("https://cdn.bken.io/v/%s/thumb.webp", video.ID)
	res := db.Create(&video)

	if res.Error != nil {
		return c.SendStatus(500)
	}

	rcloneSourceFile := fmt.Sprintf("wasabi:cdn.bken.io/v/%s/%s%s", video.ID, video.ID, extension)
	rcloneDestinationDir := fmt.Sprintf("wasabi:cdn.bken.io/v/%s", video.ID)
	tidal.CreateVideo(rcloneSourceFile, rcloneDestinationDir)

	thumbnailDestinationPath := fmt.Sprintf("wasabi:cdn.bken.io/v/%s/thumb.webp", video.ID)
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
