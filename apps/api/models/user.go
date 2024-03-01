package models

import "time"

type User struct {
	ID        uint   `json:"id" gorm:"primary_key"`
	Email     string `json:"email" gorm:"type:varchar(320);unique_index"`
	Username  string `json:"username" gorm:"type:varchar(64);unique_index"`
	CreatedAt time.Time
	UpdatedAt time.Time
}
