package controllers

import (
	"github.com/gofiber/fiber/v2"
)

func UsersConrtoller(app *fiber.App) {
	users := app.Group("/users")

	users.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World")
	})

	users.Get("/health", func(c *fiber.Ctx) error {
		return c.SendString("ok")
	})
}
