package routes

import (
	"os"
	"time"

	"github.com/bken-io/api/src/db"
	"github.com/bken-io/api/src/models"
	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

func passwordVerified(hashedPwd string, password string) bool {
	hashedPwdByte := []byte(hashedPwd)
	rawPasswordByte := []byte(password)
	err := bcrypt.CompareHashAndPassword(hashedPwdByte, rawPasswordByte)
	if err != nil {
		return false
	}
	return true
}

// Login checks password and mints a token
func Login(c *fiber.Ctx) error {
	db := db.DBConn
	loginInput := new(models.LoginInput)
	if err := c.BodyParser(loginInput); err != nil {
		return c.SendStatus(fiber.StatusUnauthorized)
	}

	var user models.User
	db.Where("email = ?", loginInput.Email).First(&user)
	if user.Email == "" {
		return c.SendStatus(fiber.StatusUnauthorized)
	}

	if !passwordVerified(user.Password, loginInput.Password) {
		return c.SendStatus(fiber.StatusUnauthorized)
	}

	claims := models.UserTokenClaims{
		ID:       user.ID,
		Email:    user.Email,
		Username: user.Username,
		StandardClaims: jwt.StandardClaims{
			Issuer:    "bken.io",
			ExpiresAt: time.Now().Add(time.Hour * 168).Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString([]byte(os.Getenv("JWT_KEY")))
	if err != nil {
		return c.SendStatus(fiber.StatusUnauthorized)
	}
	response := models.LoginResponse{
		Token: signedToken,
	}
	return c.JSON(response)
}
