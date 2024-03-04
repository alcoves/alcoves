package routes

import "github.com/gofiber/fiber/v2"

func Initialize(app *fiber.App) {
	// Root
	app.Get("/", root)
	app.Get("/health", health)

	// Users
	app.Get("/users", getUsers)
	app.Get("/users/:id", getUser)
	app.Post("/users", createUser)
	app.Put("/users/:id", updateUser)
	app.Delete("/users/:id", deleteUser)

	// Auth
	app.Post("/login", login)
	app.Post("/register", register)
}
