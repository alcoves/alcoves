package models

import (
	"time"

	"gorm.io/gorm"
)

// Video is the video struct 🤷‍♂️
type Video struct {
	ID         string         `gorm:"primaryKey;default:uuid_generate_v4()" json:"id"`
	URL        string         `json:"url"`
	Title      string         `json:"title"`
	Duration   float32        `json:"duration"`
	CreatedAt  time.Time      `json:"createdAt"`
	UpdatedAt  time.Time      `json:"updatedAt"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"deletedAt"`
	User       string         `gorm:"index" json:"user"`
	Views      int            `gorm:"default:0" json:"views"`
	Visibility string         `gorm:"default:unlisted" json:"visibility"`
}

// VideoView 🎥
type VideoView struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	IP        string         `json:"ip"`
	Video     string         `json:"video"`
	User      string         `json:"user"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deletedAt"`
}

// VideoVersion is the representation of a single preset ▶
type VideoVersion struct {
	Name             string `json:"name"`
	Status           string `json:"status"`
	PercentCompleted uint8  `json:"percentCompleted"`
}

// User is a user 👴
type User struct {
	ID string `gorm:"primaryKey;default:uuid_generate_v4()" json:"id"`
}
