package database

import (
	"fmt"

	"github.com/alcoves/alcoves/apps/api/env"
	"github.com/alcoves/alcoves/apps/api/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	var err error
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=UTC",
		env.GetEnv("DB_HOST", "postgres"),
		env.GetEnv("DB_USER", "postgres"),
		env.GetEnv("DB_PASSWORD", "postgres"),
		env.GetEnv("DB_NAME", "alcoves"),
		env.GetEnv("DB_PORT", "5432"),
	)
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	DB.AutoMigrate(&models.User{})
}
