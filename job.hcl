job "web" {
  priority    = 100
  datacenters = ["dc1"]
  type        = "service"

  group "services" {
    update {
      max_parallel     = 1
      canary           = 1
      auto_revert      = true
      auto_promote     = true
      healthy_deadline = "5m"
      min_healthy_time = "30s"
    }

    task "web" {
      constraint {
        operator  = "regexp"
        value     = "[/app/]"
        attribute = "${attr.unique.hostname}"
      }

      driver = "docker"

      template {
        data = <<EOH
          DO_API_KEY = "{{key "secrets/DO_API_KEY"}}"

          BUGSNAG_API_KEY={{key "secrets/BUGSNAG_API_KEY"}}
        EOH
        
        env         = true
        destination = ".env.local"
      }

      config {
        force_pull = true
        image      = "registry.digitalocean.com/bken/web:latest"

        auth {
          username = "${DO_API_KEY}"
          password = "${DO_API_KEY}"
        }

        port_map {
          http = 3000
        }
      }

      service {
        port = "http"
        tags = ["urlprefix-/"]

        connect {
          sidecar_service {}
        }

        check {
          name     = "alive"
          type     = "tcp"
          port     = "http"
          timeout  = "5s"
          interval = "10s"
          path     = "/"
        }
      }

      resources {
        memory = 100
        cpu    = 50

        network {
          mbits = 50
          port "http" {}
        }
      }
    }
  }
}