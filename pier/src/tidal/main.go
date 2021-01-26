package tidal

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/go-resty/resty/v2"
)

type DispatchThumbnailJobBody struct {
	Meta struct {
		S3In  string `json:"s3_in"`
		S3Out string `json:"s3_out"`
	} `json:"Meta"`
}

type DispatchIngestJobBody struct {
	Meta struct {
		S3In string `json:"s3_in"`
	} `json:"Meta"`
}

// DispatchThumbnailJob asks tidal to create a thumbnail
func DispatchThumbnailJob(
	jobName string,
	s3In string,
	s3Out string) *resty.Response {

	client := resty.New()
	nomadAddress := os.Getenv("NOMAD_ADDRESS")
	requestURL := fmt.Sprintf("%s/v1/job/%s/dispatch", nomadAddress, jobName)

	meta := DispatchThumbnailJobBody{}
	meta.Meta.S3In = s3In
	meta.Meta.S3Out = s3Out
	requestMeta, _ := json.Marshal(meta)

	resp, err := client.R().
		SetHeader("X-Nomad-Token", os.Getenv("NOMAD_TOKEN")).
		SetBody(requestMeta).
		Post(requestURL)
	if err != nil {
		fmt.Println(err)
		panic("error dispatching job")
	}

	fmt.Println("resp", resp)
	return resp
}

// DispatchIngestJob asks tidal to transcode a video
func DispatchIngestJob(jobName string, s3In string) *resty.Response {
	client := resty.New()
	nomadAddress := os.Getenv("NOMAD_ADDRESS")
	requestURL := fmt.Sprintf("%s/v1/job/%s/dispatch", nomadAddress, jobName)

	meta := DispatchIngestJobBody{}
	meta.Meta.S3In = s3In
	requestMeta, _ := json.Marshal(meta)

	resp, err := client.R().
		SetHeader("X-Nomad-Token", os.Getenv("NOMAD_TOKEN")).
		SetBody(requestMeta).
		Post(requestURL)
	if err != nil {
		fmt.Println(err)
		panic("error dispatching job")
	}

	return resp
}
