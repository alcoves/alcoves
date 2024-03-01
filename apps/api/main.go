package main

import "github.com/gofiber/fiber/v2"

func main() {
	app := fiber.New()
	print("Starting Alcoves API Server")

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World")
	})

	app.Get("/health", func(c *fiber.Ctx) error {
		return c.SendString("ok")
	})

	app.Listen(":4000")
}
