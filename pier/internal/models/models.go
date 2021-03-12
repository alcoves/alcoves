package models

import (
	"time"

	"github.com/dgrijalva/jwt-go"
	"gorm.io/gorm"
)

// VideoRendition represents an individual video preset
type VideoRendition struct {
	ID        uint           `gorm:"primaryKey" json:"-"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deletedAt"`

	VideoID          uint    `json:"videoId"` // FK to Video.ID
	Type             string  `json:"type"`
	Name             string  `json:"name"`
	PercentCompleted float64 `json:"percentCompleted"`
}

// Video is the video struct 🤷‍♂️
type Video struct {
	ID        uint           `gorm:"primaryKey" json:"-"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deletedAt"`

	VideoID    string `gorm:"primaryKey;default:uuid_generate_v4()" json:"id"`
	Title      string `json:"title"`
	UserID     string `gorm:"index" json:"userId"`
	Views      int    `gorm:"default:0" json:"views"`
	Visibility string `gorm:"default:unlisted" json:"visibility"`

	// These fields are sourced from tidal and should only ever be overwritten when
	// new data is availible

	// TODO :: Remove these from the API during video create
	Duration  float32 `gorm:"default:0" json:"duration"`
	Thumbnail string  `gorm:"default:https://cdn.bken.io/files/default-thumbnail-sm.jpg" json:"thumbnail"`

	Status              string           `gorm:"default:queued" json:"status"`
	Renditions          []VideoRendition `json:"renditions"`
	HLSMasterLink       string           `json:"hlsMasterLink"`
	SourceSegmentsCount int              `gorm:"default:0" json:"sourceSegmentsCount"`
}

type TidalMetaRendition struct {
	Type             string  `json:"type"`
	Name             string  `json:"name"`
	PercentCompleted float64 `json:"percentCompleted"`
}

type TidalMeta struct {
	ID                  string               `json:"id"`
	Duration            float32              `json:"duration"`
	Thumbnail           string               `json:"thumbnail"`
	Status              string               `json:"status"`
	Renditions          []TidalMetaRendition `json:"renditions"`
	HLSMasterLink       string               `json:"hlsMasterLink"`
	SourceSegmentsCount int                  `json:"sourceSegmentsCount"`
}

// VideoView 🎥
type VideoView struct {
	ID        uint           `gorm:"primaryKey" json:"-"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deletedAt"`

	IP      string `json:"ip"`
	UserID  string `json:"userId"`
	VideoID string `json:"videoId"`
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
	// ID        uint `gorm:"primaryKey"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deletedAt"`

	// TODO make userID the id we care about, not ID
	ID            string `gorm:"unique;index;primaryKey;default:uuid_generate_v4()" json:"id"`
	Role          string `json:"role"`
	Password      string `json:"password"`
	Nickname      string `json:"nickname"`
	Email         string `gorm:"unique" json:"email"`
	Username      string `gorm:"unique" json:"username"`
	Plan          string `gorm:"default:alpha" json:"plan"`
	EmailVerified bool   `gorm:"default:true" json:"emailVerified"`
	Avatar        string `gorm:"default:https://cdn.bken.io/files/favicon.png" json:"avatar"`
}
