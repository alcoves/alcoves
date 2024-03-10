package routes

import (
	"github.com/alcoves/alcoves/apps/api/database"
	"github.com/alcoves/alcoves/apps/api/models"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

func login(c *fiber.Ctx) error {
	type UserLoginBody struct {
		Email    string `json:"email" validate:"required,email"`
		Password string `json:"password" validate:"required"`
	}

	body := UserLoginBody{}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}

	validate := validator.New()
	if err := validate.Struct(body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	user := models.User{}
	if err := database.DB.Where("email = ?", body.Email).First(&user).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid credentials, Please try again."})
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password)); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid credentials, Please try again."})
	}

	session := models.UserSession{}
	existingSession := models.UserSession{}
	if err := database.DB.Where("user_id = ? AND ip = ?", user.ID, c.IP()).First(&existingSession).Error; err != nil {
		// Session does not exist, create a new one
		session = models.UserSession{
			UserID:    user.ID,
			SessionID: uuid.New().String(),
			IP:        c.IP(),
			UserAgent: c.Get("User-Agent"),
		}
	} else {
		// Session exists, update it with new ID, IP, and UserAgent
		existingSession.SessionID = uuid.New().String()
		existingSession.IP = c.IP()
		existingSession.UserAgent = c.Get("User-Agent")
		session = existingSession
	}

	if err := database.DB.Save(&session).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "There was an error creating/updating the user session"})
	}

	return c.JSON(fiber.Map{
		"status":     "ok",
		"message":    "success",
		"session_id": session.SessionID,
	})
}

func register(c *fiber.Ctx) error {
	type UserRegistrationBody struct {
		Email    string `json:"email" validate:"required,email"`
		Password string `json:"password" validate:"required,min=6"`
	}

	body := UserRegistrationBody{}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cannot parse JSON"})
	}

	validate := validator.New()
	if err := validate.Struct(body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(body.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Cannot hash password"})
	}

	user := models.User{Email: body.Email, Password: string(hashedPassword)}
	result := database.DB.Create(&user)
	if result.Error != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "There was an error creating the user"})
	}

	return c.JSON(fiber.Map{
		"status":        "ok",
		"message":       "success",
		"session_token": "123",
	})
}
