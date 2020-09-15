job "api" {
  priority    = 100
  datacenters = ["dc1"]
  type        = "service"

  group "services" {
    task "api" {
      driver = "docker"

      config {
        image = "docker.pkg.github.com/bken-io/api/api:latest"

        auth {
          username = "rustyguts"
          password = "${NOMAD_META_GITHUB_ACCESS_TOKEN}"
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