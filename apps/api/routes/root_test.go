package routes

import (
	"io"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/stretchr/testify/assert"
)

func TestGetRoot(t *testing.T) {
	app := fiber.New()
	Initialize(app)

	req := httptest.NewRequest("GET", "/", nil)
	resp, _ := app.Test(req)

	body, _ := io.ReadAll(resp.Body)
	assert.Equal(t, http.StatusOK, resp.StatusCode)
	assert.Equal(t, "hello", string(body))
}

func TestGetHealth(t *testing.T) {
	app := fiber.New()
	Initialize(app)

	req := httptest.NewRequest("GET", "/health", nil)
	resp, _ := app.Test(req)

	body, err := io.ReadAll(resp.Body)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, resp.StatusCode)
	assert.Equal(t, "ok", string(body))
}
