package main

import (
	"alcoves_api/routers"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/requestid"
)

func main() {
	print("Starting Alcoves API Server...\n")
	app := fiber.New()
	app.Use(logger.New())
	app.Use(requestid.New())

	print("Registering routes...")
	routers.RootRoutes(app)

	app.Listen(":4000")
}
