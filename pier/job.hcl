job "api" {
  priority    = 100
  datacenters = ["dc1"]
  type        = "service"

  group "services" {
    task "api" {
      driver = "docker"

      template {
        data = <<EOH
          DO_API_KEY = "{{key "secrets/DO_API_KEY"}}"
        EOH
        
        env         = true
        destination = "secrets/do.env"
      }

      config {
        force_pull = true
        image      = "registry.digitalocean.com/bken/api:latest"

        auth {
          username = "${DO_API_KEY}"
          password = "${DO_API_KEY}"
        }
      }

      env {
        "DB_USER" = "web"
        "DB_PASS" = "loremipsum"
        "DB_HOST" = "db01.example.com"
      }

      service {
        # https://www.nomadproject.io/docs/job-specification/service

        tags = ["api"]
        port = "http"

        meta {
          meta = "for your service"
        }

        check {
          type     = "tcp"
          port     = "http"
          interval = "10s"
          timeout  = "2s"
        }
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