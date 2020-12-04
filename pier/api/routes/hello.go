package routes

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
)

// Hello returns a health check
func Hello(c *fiber.Ctx) error {
	msg := fmt.Sprintf("⚓ ahoy! ⚓")
	return c.SendString(msg)
}
