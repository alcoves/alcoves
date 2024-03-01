package controllers

import "github.com/gofiber/fiber/v2"

func SetupRoutes(app *fiber.App) {
	RootController(app)
	UsersConrtoller(app)
}
