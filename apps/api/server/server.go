package server

import (
	"github.com/alcoves/alcoves/apps/api/database"
	"github.com/alcoves/alcoves/apps/api/routes"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/requestid"
)

func ProductionServer() *fiber.App {
	print("Starting Alcoves API Server...\n")
	database.Connect()

	app := fiber.New()
	app.Use(logger.New())
	app.Use(requestid.New())

	print("Registering routes...")
	routes.Initialize(app)

	return app
}
