job "bken_api" {
  priority    = 100
  datacenters = ["nyc3"]
  type        = "service"

  group "services" {
    count = 2
    
    update {
      max_parallel     = 1
      canary           = 1
      auto_revert      = true
      auto_promote     = true
      healthy_deadline = "5m"
      min_healthy_time = "30s"
    }

    network {
      port "bken_api_port" { to = 3100 }
    }

    task "api_api" {
      driver = "docker"

      template {
        data = <<EOH
DO_API_KEY="{{key "secrets/DO_API_KEY"}}"
        EOH
        
        env         = true
        destination = "secrets/container/.env"
      }

      template {
        env         = true
        destination = "secrets/api/.env"
        data        = "{{ key \"secrets/api/.env.prod\" }}"
      }

      constraint {
        operator  = "regexp"
        value     = "[/app/]"
        attribute = "${attr.unique.hostname}"
      }

      config {
        force_pull = true
        ports      = ["bken_api_port"]
        image      = "registry.digitalocean.com/bken/api:latest"

        auth {
          username = "${DO_API_KEY}"
          password = "${DO_API_KEY}"
        }
      }

      service {
        name = "bken-api-api"
        port = "bken_api_port"
        tags = ["urlprefix-api.bken.io/"]

        check {
          path     = "/"
          timeout  = "2s"
          interval = "10s"
          type     = "http"
          name     = "bken_api_port alive"
        }
      }

      resources {
        memory = 300
        cpu    = 300
      }
    }
  }
}