package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Username string `json:"username"`
	Password string `json:"password"`
	Email    string `json:"email" gorm:"uniqueIndex"`
	Sessions []UserSession
}

type UserSession struct {
	gorm.Model
	UserID    uint   `json:"user_id"` // FK
	SessionID string `json:"session_id" gorm:"uniqueIndex"`
	IP        string `json:"ip"`
	UserAgent string `json:"user_agent"`
}
