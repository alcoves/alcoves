job "api" {
  datacenters = ["dc1"]

  group "api" {
    task "api" {
      driver = "docker"

      config {
        image = "registry.digitalocean.com/bken/api"

        auth {
          username = "bken"
          password = "dockerhub_password"
        }
      }

      env {
        "DB_USER" = "web"
        "DB_PASS" = "loremipsum"
        "DB_HOST" = "db01.example.com"
      }

      resources {
        cpu    = 100
        memory = 300

        network {
          mbits = 100

          port "http" {
            static = "4000"
          }
        }
      }
    }
  }
}