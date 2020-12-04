job "api2" {
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

    task "api2" {
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

          APOLLO_GRAPH_VARIANT=current
          APOLLO_SCHEMA_REPORTING=true
          APOLLO_KEY= "{{key "secrets/APOLLO_KEY"}}"

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
        port = "http"
        tags = ["urlprefix-/api2"]

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