package routes

import "github.com/gofiber/fiber/v2"

func Initialize(app *fiber.App) {
	app.Get("/", root)
	app.Get("/health", health)
}
