package main

import (
	"fmt"
	"log"
	"os"

	"github.com/bken-io/api/api/db"
	"github.com/bken-io/api/api/root"
	"github.com/bken-io/api/api/videos"
	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func loadEnv() {
	// load .env file from given path
	// we keep it empty it will load .env from current directory
	err := godotenv.Load(".env")

	if err != nil {
		log.Panic("Error loading .env file")
	}
}

func initDatabase() {
	var err error

	dsn := os.Getenv("PG_CONNECTION_STRING")
	db.DBConn, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		panic("Failed to connect to database")
	}

	fmt.Println("Connected to database successfully")
	db.DBConn.AutoMigrate(&videos.Video{})
	fmt.Println("Database Migrated")
}

func setupRoutes(app *fiber.App) {
	app.Get("/", root.GetRoot)
	app.Get("/videos", videos.GetVideos)
	app.Post("/videos", videos.CreateVideo)
	app.Get("/videos/:id", videos.GetVideo)
	app.Delete("/videos/:id", videos.DeleteVideo)
}

func main() {
	loadEnv()
	initDatabase()

	app := fiber.New()
	setupRoutes(app)
	log.Panic(app.Listen(":4000"))
}
