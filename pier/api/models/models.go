package models

import (
	"time"

	"gorm.io/gorm"
)

// This file contains types that should only exist in the database

// Video is the video struct 🤷‍♂️
type Video struct {
	ID         string         `gorm:"primaryKey;default:uuid_generate_v4()" json:"id"`
	Title      string         `json:"title"`
	Duration   float32        `json:"duration"`
	CreatedAt  time.Time      `json:"createdAt"`
	UpdatedAt  time.Time      `json:"updatedAt"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"deletedAt"`
	User       string         `gorm:"index" json:"user"`
	Views      int            `gorm:"default:0" json:"views"`
	Visibility string         `gorm:"default:unlisted" json:"visibility"`
}

type TidalVideo struct {
	link     string
	status   string
	versions Version
}

type Version struct {
	name string
}

type User struct {
}

type View struct {
}
