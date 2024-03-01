package models

import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func InitializeDatabase() {
	dsn := "host=postgres user=postgres password=postgres dbname=alcoves port=5432 sslmode=disable TimeZone=America/Detroit"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		panic("failed to connect database")
	}

	db.AutoMigrate(&User{})
}
