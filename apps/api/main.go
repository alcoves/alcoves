package main

import (
	"alcoves_api/controllers"
	"alcoves_api/models"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/requestid"
)

func main() {
	print("Starting Alcoves API Server...\n")
	models.InitializeDatabase()

	app := fiber.New()
	app.Use(logger.New())
	app.Use(requestid.New())

	print("Registering routes...")
	controllers.SetupRoutes(app)

	app.Listen(":4000")
}
