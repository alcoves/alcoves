data_dir  = "/var/lib/nomad"
bind_addr = "{{ GetInterfaceIP \"eth1\" }}"

advertise {
  rpc  = "{{ GetInterfaceIP \"eth1\" }}"
  http = "{{ GetInterfaceIP \"eth1\" }}"
  serf = "{{ GetInterfaceIP \"eth1\" }}"
}

server {
  bootstrap_expect = 1
  enabled          = true
}

acl {
  enabled = true
}

client { enabled = false }

plugin "raw_exec" {
  config {
    enabled = true
  }
}