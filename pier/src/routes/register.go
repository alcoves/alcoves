package routes

import (
	"github.com/bken-io/api/src/db"
	"github.com/bken-io/api/src/models"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

func getHashedPassword(password string) string {
	rawPassword := []byte(password)
	hashedPassword, err := bcrypt.GenerateFromPassword(rawPassword, bcrypt.DefaultCost)
	if err != nil {
		panic(err)
	}
	err = bcrypt.CompareHashAndPassword(hashedPassword, rawPassword)
	return string(hashedPassword)
}

// Register creates a user account
func Register(c *fiber.Ctx) error {
	db := db.DBConn
	userInput := new(models.RegisterUserInput)
	if err := c.BodyParser(userInput); err != nil {
		return c.Status(400).SendString("user input failed unmarshalling")
	}

	user := models.User{
		Email:    userInput.Email,
		Username: userInput.Username,
		Nickname: userInput.Username,
		Password: getHashedPassword(userInput.Password),
	}

	db.Create(&user)
	return c.Status(200).SendString("user account created")
}
