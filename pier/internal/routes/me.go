package routes

import (
	jwt "github.com/form3tech-oss/jwt-go"
	"github.com/gofiber/fiber/v2"
)

// GetMe returns 200 if the user is logged in
func GetMe(c *fiber.Ctx) error {
	user := c.Locals("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	userID := claims["id"].(string)

	if userID == "" {
		return c.SendStatus(401)
	}

	return c.SendStatus(200)
}
