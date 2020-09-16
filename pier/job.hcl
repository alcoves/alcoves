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

          WASABI_ACCESS_KEY_ID = "{{key "secrets/WASABI_ACCESS_KEY_ID"}}"
          WASABI_SECRET_ACCESS_KEY = "{{key "secrets/WASABI_SECRET_ACCESS_KEY"}}"
          WASABI_ENDPOINT = "{{key "secrets/WASABI_ENDPOINT"}}"

          DO_ACCESS_KEY_ID = "{{key "secrets/DO_ACCESS_KEY_ID"}}"
          DO_SECRET_ACCESS_KEY = "{{key "secrets/DO_SECRET_ACCESS_KEY"}}"
          DO_ENDPOINT = "{{key "secrets/DO_ENDPOINT"}}"

          MG_API_KEY = "{{key "secrets/MG_API_KEY"}}"

          NOMAD_TOKEN = "{{key "secrets/NOMAD_TOKEN"}}"
          NOMAD_ADDRESS = "{{key "secrets/NOMAD_ADDRESS"}}"

          JWT_KEY = "{{key "secrets/JWT_KEY"}}"
          DB_CONNECTION_STRING = "{{key "secrets/DB_CONNECTION_STRING"}}"
        EOH
        
        env         = true
        destination = ".env"
      }

      config {
        force_pull = true
        image      = "registry.digitalocean.com/bken/api:latest"

        auth {
          username = "${DO_API_KEY}"
          password = "${DO_API_KEY}"
        }

        port_map {
          http = 4000
        }
      }

      service {
        tags = ["api"]
        port = "http"

        connect {
          sidecar_service {}
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
            static = "80"
          }
        }
      }
    }
  }
}