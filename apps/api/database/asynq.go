package database

import (
	"github.com/alcoves/alcoves/apps/api/env"
	"github.com/hibiken/asynq"
)

var redisAddr = env.GetEnv("ALCOVES_API_REDIS_ADDR", "redis:6379")

var AsynqClient *asynq.Client
var AsynqInspector *asynq.Inspector

func InitializeAsyncClient() {
	client := asynq.NewClient(asynq.RedisClientOpt{Addr: redisAddr})
	AsynqClient = client
}

func InitializeAsyncInspector() {
	inspector := asynq.NewInspector(asynq.RedisClientOpt{Addr: redisAddr})
	AsynqInspector = inspector
}
