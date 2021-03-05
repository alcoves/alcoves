package tidal

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/go-resty/resty/v2"
)

type CreateVideoBody struct {
	TidalDir             string `json:"tidalDir"`
	NomadToken           string `json:"nomadToken"`
	RcloneConfig         string `json:"rcloneConfig"`
	RcloneSourceFile     string `json:"rcloneSourceFile"`
	RcloneDestinationDir string `json:"rcloneDestinationDir"`
}

// CreateVideo sends a post request to tidal which starts the encoding process
func CreateVideo(rcloneSourceFile string, rcloneDestinationDir string) *resty.Response {
	client := resty.New()
	requestBody := CreateVideoBody{
		TidalDir:             "",
		NomadToken:           os.Getenv("TIDAL_NOMAD_TOKEN"),
		RcloneConfig:         "",
		RcloneSourceFile:     rcloneSourceFile,
		RcloneDestinationDir: rcloneDestinationDir,
	}
	requestMeta, _ := json.Marshal(requestBody)
	resp, err := client.R().
		// SetHeader("Authorization", os.Getenv("TIDAL_API_KEY")).
		SetBody(requestMeta).
		Post("https://bk-det1.bken.dev/ingest")
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println("resp", resp)
	return resp
}
