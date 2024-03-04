package routes

import "github.com/gofiber/fiber/v2"

func login(c *fiber.Ctx) error {
	return c.SendString("done")
}

func register(c *fiber.Ctx) error {
	return c.SendString("done")
}
