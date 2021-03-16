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

    network {
      port "bken_web_port" { to = 3000 }
    }

    task "web" {
      driver = "docker"

      template {
        data = <<EOH
          NEXTAUTH_URL="https://bken.io"
          GOOGLE_ID="{{key "secrets/GOOGLE_ID"}}"
          DO_API_KEY="{{key "secrets/DO_API_KEY"}}"
          GOOGLE_SECRET="{{key "secrets/GOOGLE_SECRET"}}"
          PG_CONNECTION_STRING="{{key "secrets/GOOGLE_SECRET"}}"
        EOH
        
        env         = true
        destination = ".env.local"
      }

      constraint {
        operator  = "regexp"
        value     = "[/app/]"
        attribute = "${attr.unique.hostname}"
      }

      config {
        force_pull = true
        ports      = ["bken_web_port"]
        image      = "registry.digitalocean.com/bken/web:latest"

        auth {
          username = "${DO_API_KEY}"
          password = "${DO_API_KEY}"
        }
      }

      service {
        name = "bken-web"
        port = "bken_web_port"
        tags = ["urlprefix-/"]

        connect {
          sidecar_service {}
        }

        check {
          path     = "/"
          timeout  = "2s"
          interval = "10s"
          type     = "http"
          name     = "bken_web_port alive"
        }
      }

      resources {
        memory = 300
        cpu    = 100
      }
    }
  }
}