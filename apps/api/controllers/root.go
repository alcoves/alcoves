package controllers

import (
	"github.com/gofiber/fiber/v2"
)

func RootController(app *fiber.App) {
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World")
	})

	app.Get("/health", func(c *fiber.Ctx) error {
		return c.SendString("ok")
	})
}
