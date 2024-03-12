package env

import "os"

func GetEnv(key, def string) string {
	val := os.Getenv(key)
	if val != "" {
		return val
	}
	return def
}
