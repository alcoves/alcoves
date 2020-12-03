package root

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
)

// GetRoot returns a health check
func GetRoot(c *fiber.Ctx) error {
	msg := fmt.Sprintf("⚓ ahoy! ⚓")
	return c.SendString(msg)
}
