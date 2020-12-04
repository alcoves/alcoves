package login

import (
	"os"
	"time"

	"github.com/bken-io/api/api/db"
	"github.com/bken-io/api/api/models"
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

func getHashedPassword(password string) string {
	rawPassword := []byte(password)
	hashedPassword, err := bcrypt.GenerateFromPassword(rawPassword, bcrypt.DefaultCost)
	if err != nil {
		panic(err)
	}
	err = bcrypt.CompareHashAndPassword(hashedPassword, rawPassword)
	return string(hashedPassword)
}

// Login checks password and mints a token
func Login(c *fiber.Ctx) error {
	db := db.DBConn
	loginInput := new(models.LoginInput)
	if err := c.BodyParser(loginInput); err != nil {
		return c.Status(400).SendString("failed unmarshalling")
	}

	var user models.User
	db.Where("email = ?", loginInput.Email).First(&user)
	if user.Email == "" {
		return c.Status(401).SendString("failed")
	}

	if !passwordVerified(user.Password, loginInput.Password) {
		return c.Status(401).SendString("failed")
	}

	currentTime := time.Now()
	oneWeekInNS := time.Duration(604800000000000)

	claims := models.UserTokenClaims{
		ID:       user.ID,
		Email:    user.Email,
		Username: user.Username,
		StandardClaims: jwt.StandardClaims{
			Issuer:    "bken.io",
			ExpiresAt: currentTime.Add(oneWeekInNS).Unix(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString([]byte(os.Getenv("JWT_KEY")))
	if err != nil {
		return c.Status(401).SendString("failed")
	}

	response := models.LoginResponse{
		Token: signedToken,
	}
	return c.JSON(response)
}
