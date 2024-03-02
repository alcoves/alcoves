package routes

// import (
// 	"io"
// 	"net/http"
// 	"net/http/httptest"
// 	"strings"
// 	"testing"

// 	"github.com/alcoves/alcoves/apps/api/database"
// 	"github.com/alcoves/alcoves/apps/api/server"
// 	"github.com/stretchr/testify/assert"
// )

// func TestCreateUser(t *testing.T) {
// 	// Initialize the app
// 	app := server.ProductionServer()

// 	// Prepare the request body
// 	body := `{"email": "test@example.com", "password": "testpassword"}`

// 	// Clean up after the test
// 	defer func() {
// 		// Assuming you have a function to drop the test data
// 		database.DB.Exec("DELETE FROM users WHERE email LIKE 'test@example.com'")
// 	}()

// 	// Create a new request
// 	req := httptest.NewRequest("POST", "/users", strings.NewReader(body))
// 	req.Header.Set("Content-Type", "application/json")

// 	// Record the response
// 	resp, _ := app.Test(req)

// 	// Check the status code
// 	assert.Equal(t, http.StatusOK, resp.StatusCode)

// 	// Check the response body
// 	bodyBytes, _ := io.ReadAll(resp.Body)
// 	bodyString := string(bodyBytes)
// 	assert.Contains(t, bodyString, "test@example.com")
// 	assert.NotContains(t, bodyString, "testpassword")
// }
