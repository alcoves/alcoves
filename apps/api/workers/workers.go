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
			Concurrency: 1,
		},
	)

	mux := asynq.NewServeMux()
	mux.HandleFunc(tasks.TypeVideoProcess, tasks.HandleVideoProcessTask)

	if err := srv.Run(mux); err != nil {
		log.Fatalf("could not run server: %v", err)
	}
}
