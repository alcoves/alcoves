package routes

import (
	"github.com/bken-io/api/internal/db"
	"github.com/bken-io/api/internal/models"
	"github.com/gofiber/fiber/v2"
)

// PublicUserQueryResponse returns public information about a user
type PublicUserQueryResponse struct {
	ID       string `json:"id"`
	Avatar   string `json:"avatar"`
	Username string `json:"username"`
}

// GetUser returns the public information of a user
func GetUser(c *fiber.Ctx) error {
	id := c.Params("id")
	db := db.DBConn
	var user models.User
	result := db.Where("id = ?", id).Find(&user)

	if result.Error != nil {
		return c.SendStatus(500)
	}

	if user.ID == "" {
		return c.SendStatus(404)
	}

	publicResponse := PublicUserQueryResponse{
		ID:       user.ID,
		Avatar:   user.Avatar,
		Username: user.Username,
	}

	return c.JSON(publicResponse)
}

// GetAccount returns the private information of a user
func GetAccount() {

}
