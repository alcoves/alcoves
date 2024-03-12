package database

import (
	"fmt"

	"github.com/alcoves/alcoves/apps/api/env"
	"github.com/alcoves/alcoves/apps/api/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitializeGormPostgreSQL() {
	var err error
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=UTC",
		env.GetEnv("ALCOVES_API_DB_HOST", "postgres"),
		env.GetEnv("ALCOVES_API_DB_USER", "postgres"),
		env.GetEnv("ALCOVES_API_DB_PASSWORD", "postgres"),
		env.GetEnv("ALCOVES_API_DB_NAME", "alcoves"),
		env.GetEnv("ALCOVES_API_DB_PORT", "5432"),
	)
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic(err)
	}

	DB.AutoMigrate(&models.User{}, &models.UserSession{})
}
