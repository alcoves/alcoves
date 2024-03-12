package workers

import (
	"log"

	"github.com/alcoves/alcoves/apps/api/env"
	"github.com/alcoves/alcoves/apps/api/tasks"
	"github.com/hibiken/asynq"
)

func RegisterWorkers() {
	redisAddr := env.GetEnv("ALCOVES_API_REDIS_ADDR", "redis:6379")
	srv := asynq.NewServer(
		asynq.RedisClientOpt{Addr: redisAddr},
		asynq.Config{
			// Specify how many concurrent workers to use
			Concurrency: 10,
			// Optionally specify multiple queues with different priority.
			Queues: map[string]int{
				"critical": 6,
				"default":  3,
				"low":      1,
			},
			// See the godoc for other configuration options
		},
	)

	// mux maps a type to a handler
	mux := asynq.NewServeMux()
	mux.HandleFunc(tasks.TypeEmailDelivery, tasks.HandleEmailDeliveryTask)
	mux.Handle(tasks.TypeImageResize, tasks.NewImageProcessor())

	if err := srv.Run(mux); err != nil {
		log.Fatalf("could not run server: %v", err)
	}
}
