job "reef_dev" {
  priority    = 100
  datacenters = ["nyc3"]
  type        = "service"

  group "services" {
    count = 1

    network {
      port "bken_reef_port" { to = 3000 }
    }

    task "reef_dev" {
      driver = "docker"

      template {
        data = <<EOH
DO_API_KEY="{{key "secrets/DO_API_KEY"}}"
        EOH
        
        env         = true
        destination = ".env"
      }

      template {
        env         = true
        destination = "secrets/reef/.env"
        data        = "{{ key \"secrets/reef/.env.dev\" }}"
      }

      constraint {
        operator  = "regexp"
        value     = "[/app/]"
        attribute = "${attr.unique.hostname}"
      }

      config {
        force_pull = true
        ports      = ["bken_reef_port"]
        image      = "registry.digitalocean.com/bken/reef:latest"

        auth {
          username = "${DO_API_KEY}"
          password = "${DO_API_KEY}"
        }
      }

      service {
        name = "bken-reef"
        port = "bken_reef_port"
        tags = ["urlprefix-dev.bken.io/"]

        check {
          path     = "/"
          timeout  = "2s"
          interval = "10s"
          type     = "http"
          name     = "bken_reef_port alive"
        }
      }

      resources {
        memory = 300
        cpu    = 300
      }
    }
  }
}