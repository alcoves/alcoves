package tidal

import (
	"fmt"

	"github.com/go-resty/resty/v2"
)

type tidalBody struct {
	RcloneSource string `json:"rcloneSource"`
	RcloneDest   string `json:"rcloneDest"`
}

// CreateVideo sends a post request to tidal which starts the encoding process
func CreateVideo(rcloneSource string, rcloneDest string) *resty.Response {
	client := resty.New()
	requestBody := tidalBody{
		RcloneSource: rcloneSource,
		RcloneDest:   rcloneDest,
	}
	resp, err := client.R().
		// SetHeader("Authorization", os.Getenv("TIDAL_API_KEY")).
		SetBody(requestBody).
		Post("https://bk-det1.bken.dev/tidal/videos")
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println("CreateVideo", resp)
	return resp
}

// CreateThumbnail invokes the tidal api to create a video thumbnail
func CreateThumbnail(rcloneSource string, rcloneDest string) *resty.Response {
	client := resty.New()
	requestBody := tidalBody{
		RcloneSource: rcloneSource,
		RcloneDest:   rcloneDest,
	}
	resp, err := client.R().
		// SetHeader("Authorization", os.Getenv("TIDAL_API_KEY")).
		SetBody(requestBody).
		Post("https://bk-det1.bken.dev/tidal/videos/thumbnails")
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println("CreateVideo", resp)
	return resp
}
