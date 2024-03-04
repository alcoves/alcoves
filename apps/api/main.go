package main

import "github.com/alcoves/alcoves/apps/api/server"

func main() {
	app := server.ProductionServer()
	app.Listen(":4000")
}
