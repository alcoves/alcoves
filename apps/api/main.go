package main

import (
	"github.com/alcoves/alcoves/apps/api/database"
	"github.com/alcoves/alcoves/apps/api/env"
	"github.com/alcoves/alcoves/apps/api/server"
	"github.com/alcoves/alcoves/apps/api/workers"
)

func main() {
	isWorker := env.GetEnv("ALCOVES_API_WORKER_MODE", "false")

	if isWorker == "true" || isWorker == "1" {
		workers.RegisterWorkers()
	} else {
		app := server.ProductionServer()
		app.Listen(":4000")
	}

	defer func() {
		print("Shutting down Alcoves Server...\n")
		database.AsynqClient.Close()
		database.AsynqInspector.Close()
	}()
}
