package routes

import (
	"github.com/gofiber/fiber/v2"
)

func root(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"status":  "ok",
		"message": "hello world!",
	})
}

func health(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"status":  "ok",
		"message": "Server is running",
	})
}
