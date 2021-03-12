package main

import (
	"fmt"
	"log"
	"os"

	"github.com/bken-io/api/internal/auth"
	"github.com/bken-io/api/internal/db"
	"github.com/bken-io/api/internal/models"
	"github.com/bken-io/api/internal/routes"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func initDatabase() {
	var err error

	dsn := os.Getenv("PG_CONNECTION_STRING")
	db.DBConn, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		panic("Failed to connect to database")
	}

	fmt.Println("Connected to database successfully")
	db.DBConn.AutoMigrate(&models.User{})
	db.DBConn.AutoMigrate(&models.Video{})
	db.DBConn.AutoMigrate(&models.VideoView{})
	db.DBConn.AutoMigrate(&models.VideoRendition{})
	fmt.Println("Database Migrated")
}

func setupRoutes(app *fiber.App) {
	api := app.Group("/api", logger.New())

	api.Get("/me", auth.Protected(), routes.GetMe)

	api.Get("/", routes.Hello)
	api.Post("/login", routes.Login)
	api.Post("/register", routes.Register)

	api.Get("/videos", routes.GetVideos)
	api.Get("/videos/:id", routes.GetVideo)
	api.Post("/videos/:id/views", routes.CreateView)

	api.Post("/videos", auth.Protected(), routes.CreateVideo)
	api.Patch("/videos/:id", auth.Protected(), routes.PatchVideo)
	api.Delete("/videos/:id", auth.Protected(), routes.HardDeleteVideo)

	api.Post("/uploads", auth.Protected(), routes.CreateUpload)

	api.Get("/users/:id", routes.GetUser)

	api.Post("/admin/videos/reprocess", auth.Protected(), routes.ReprocessVideos)
}

func main() {
	godotenv.Load(".env")
	initDatabase()

	app := fiber.New()
	app.Use(cors.New())
	app.Use(recover.New())

	setupRoutes(app)
	log.Panic(app.Listen(":4000"))
}
