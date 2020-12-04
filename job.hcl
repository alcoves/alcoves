job "web" {
  priority    = 100
  datacenters = ["dc1"]
  type        = "service"

  constraint {
    operator  = "regexp"
    value     = "[/app/]"
    attribute = "${attr.unique.hostname}"
  }

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
      driver = "docker"

      template {
        data = <<EOH
          DO_API_KEY = "{{key "secrets/DO_API_KEY"}}"
        EOH
        
        env         = true
        destination = ".env"
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
        memory = 200
        cpu    = 200

        network {
          mbits = 100
          port "http" {}
        }
      }
    }
  }
}