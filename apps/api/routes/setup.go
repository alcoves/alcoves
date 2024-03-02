package routes

import "github.com/gofiber/fiber/v2"

func Initialize(app *fiber.App) {
	app.Get("/", root)
	app.Get("/health", health)

	app.Get("/users", getUsers)
	app.Get("/users/:id", getUser)
	app.Post("/users", createUser)
	app.Put("/users/:id", updateUser)
	app.Delete("/users/:id", deleteUser)
}
