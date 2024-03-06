package routes

import "github.com/gofiber/fiber/v2"

func login(c *fiber.Ctx) error {
	// Stubbed right now. Should return 200 and a valid session token.

	return c.JSON(fiber.Map{
		"status":  "ok",
		"message": "success",
	})
}

func register(c *fiber.Ctx) error {
	// Stubbed right now. Should return 200 and a valid session token.

	return c.JSON(fiber.Map{
		"status":  "ok",
		"message": "success",
	})
}
