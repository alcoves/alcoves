package tests

import (
	"io"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/alcoves/alcoves/apps/api/server"
	"github.com/stretchr/testify/assert"
)

func TestGetRoot(t *testing.T) {
	app := server.ProductionServer()

	req := httptest.NewRequest("GET", "/", nil)
	resp, _ := app.Test(req)

	body, _ := io.ReadAll(resp.Body)
	assert.Equal(t, http.StatusOK, resp.StatusCode)
	assert.Equal(t, `{"message":"hello world!","status":"ok"}`, string(body))
}

func TestGetHealth(t *testing.T) {
	app := server.ProductionServer()

	req := httptest.NewRequest("GET", "/health", nil)
	resp, _ := app.Test(req)

	body, err := io.ReadAll(resp.Body)
	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, resp.StatusCode)
	assert.Equal(t, `{"message":"Server is running","status":"ok"}`, string(body))
}
