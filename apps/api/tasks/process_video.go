package tasks

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/hibiken/asynq"
)

const (
	TypeVideoProcess = "video:process"
)

type VideoProcessPayload struct {
	SourceURL string
}

func NewVideoProcessTask(src string) (*asynq.Task, error) {
	payload, err := json.Marshal(VideoProcessPayload{SourceURL: src})
	if err != nil {
		return nil, err
	}

	return asynq.NewTask(TypeVideoProcess, payload, asynq.MaxRetry(5), asynq.Timeout(48*time.Hour)), nil
}

func HandleVideoProcessTask(ctx context.Context, t *asynq.Task) error {
	var p VideoProcessPayload
	if err := json.Unmarshal(t.Payload(), &p); err != nil {
		return fmt.Errorf("json.Unmarshal failed: %v: %w", err, asynq.SkipRetry)
	}
	log.Printf("Processing video: %s", p.SourceURL)
	time.Sleep(300 * time.Second)

	// cmd := exec.Command("ffmpeg", "-y", "-i", p.SourceURL, "-c:v", "libx264", "-preset", "fast", "-crf", "22", "-c:a", "aac", "-b:a", "128k", "./output.mp4")
	// err := cmd.Run()
	// if err != nil {
	// 	return fmt.Errorf("ffmpeg command failed: %v", err)
	// }

	log.Printf("Finished processing video: %s", p.SourceURL)
	return nil
}
