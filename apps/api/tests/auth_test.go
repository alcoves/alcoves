package tests

import (
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/alcoves/alcoves/apps/api/database"
	"github.com/alcoves/alcoves/apps/api/server"
	"github.com/stretchr/testify/assert"
)

func TestLoginUser(t *testing.T) {
	app := server.ProductionServer()
	body := `{"email": "test@example.com", "password": "testpassword"}`
	err := database.DB.Exec("INSERT INTO users (email, password) VALUES (?, ?)", "test@example.com", "testpassword")
	if err != nil {
		t.Fatalf("Failed to insert user into database: %v", err)
	}

	defer func() {
		database.DB.Exec("DELETE FROM users WHERE email LIKE 'test@example.com'")
	}()

	req := httptest.NewRequest("POST", "/auth/login", strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	resp, _ := app.Test(req)

	assert.Equal(t, http.StatusOK, resp.StatusCode)

	bodyBytes, _ := io.ReadAll(resp.Body)
	bodyString := string(bodyBytes)
	assert.Contains(t, bodyString, "test@example.com")
	assert.NotContains(t, bodyString, "testpassword")
}
