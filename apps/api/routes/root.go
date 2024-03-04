package routes

import (
	"github.com/gofiber/fiber/v2"
)

func root(c *fiber.Ctx) error {
	return c.SendString("hello")
}

func health(c *fiber.Ctx) error {
	return c.SendString("ok")
}
