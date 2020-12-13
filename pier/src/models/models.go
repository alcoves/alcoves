package models

import (
	"time"

	"github.com/dgrijalva/jwt-go"
	"gorm.io/gorm"
)

// Video is the video struct 🤷‍♂️
type Video struct {
	ID        string         `gorm:"primaryKey;default:uuid_generate_v4()" json:"id"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deletedAt"`

	URL        string  `json:"url"`
	Title      string  `json:"title"`
	Duration   float32 `json:"duration"`
	UserID     string  `gorm:"index" json:"userId"`
	Views      int     `gorm:"default:0" json:"views"`
	Visibility string  `gorm:"default:unlisted" json:"visibility"`
	Thumbnail  string  `gorm:"default:https://cdn.bken.io/files/default-thumbnail-sm.jpg" json:"thumbnail"`
}

// VideoView 🎥
type VideoView struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deletedAt"`

	IP      string `json:"ip"`
	UserID  string `json:"userId"`
	VideoID string `json:"videoId"`
}

// VideoVersion is the representation of a single preset ▶
type VideoVersion struct {
	Name             string `json:"name"`
	Status           string `json:"status"`
	PercentCompleted uint8  `json:"percentCompleted"`
}

// RegisterUserInput is the input for a new user account
type RegisterUserInput struct {
	Username string
	Email    string
	Password string
}

// LoginInput is what the user sends on login
type LoginInput struct {
	Email    string
	Password string
}

// LoginResponse contains a token used for auth
type LoginResponse struct {
	Token string `json:"token"`
}

// UserTokenClaims is the JWT that is sent to the user
type UserTokenClaims struct {
	ID       string `json:"id"`
	Email    string `json:"email"`
	Avatar   string `json:"avatar"`
	Username string `json:"username"`
	jwt.StandardClaims
}

// User is a user 👴
type User struct {
	ID        string         `gorm:"unique;index;primaryKey;default:uuid_generate_v4()" json:"id"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deletedAt"`

	Role          string `json:"role"`
	Password      string `json:"password"`
	Nickname      string `json:"nickname"`
	Email         string `gorm:"unique" json:"email"`
	Username      string `gorm:"unique" json:"username"`
	Plan          string `gorm:"default:alpha" json:"plan"`
	EmailVerified bool   `gorm:"default:true" json:"emailVerified"`
	Avatar        string `gorm:"default:https://s3.us-east-2.wasabisys.com/cdn.bken.io/files/favicon.png" json:"avatar"`
}
