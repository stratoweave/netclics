# netclics - NETCONF <> CLI Conversion System
[![REUSE Compliance Check](https://github.com/stratoweave/netclics/actions/workflows/reuse-compliance.yml/badge.svg)](https://github.com/stratoweave/netclics/actions/workflows/reuse-compliance.yml)

NETCLICS helps you turn familiar network CLI configuration into the structured data your automation needs. Choose a device platform, paste a CLI snippet, and convert it to NETCONF XML, RESTCONF JSON, or Acton code for StratoWeave transforms. You can also start with NETCONF XML and convert it back to CLI, making it easier to see how device commands map to YANG-based configuration.

Use the web interface to explore a single change or build a sequence of configuration steps. For each step, inspect either the changes or the full resulting configuration, then copy or download the output for use in your own tools. NETCLICS applies your input to virtual devices such as Juniper cRPD and Cisco XRd, so the conversion reflects how the device interprets the configuration.

Try the hosted version at [netclics.stratoweave.org](https://netclics.stratoweave.org) directly in your browser, or build and run your own NETCLICS instance on your own infrastructure.

## Endpoints

By default, NETCLICS listens on HTTP `:8080`.

To enable HTTPS, start with:

```bash
out/bin/netclics --https-port 8443 --tls-cert /path/to/cert.pem --tls-key /path/to/key.pem
```

Notes:
- `--http-port 0` disables HTTP.
- HTTPS is enabled only when `--https-port`, `--tls-cert`, and `--tls-key` are all provided.

## Static file server, ACME HTTP-01 challenge

To serve static files under an explicit URL prefix:

```bash
out/bin/netclics --static-dir /path/to/public_html
```

By default, NETCLICS serves that directory under `/static/...`. Use `--static-prefix` to change the mount point:

```bash
out/bin/netclics --static-dir /path/to/public_html --static-prefix /assets
```

This is also useful for integrating NETCLICS with [certbot](https://certbot.eff.org). Configure NETCLICS and certbot to use the same web root:

```bash
out/bin/netclics --static-dir /path/to/public_html --static-prefix /.well-known
certbot certonly --webroot -w /path/to/public_html ...
```

Certbot will then create files under `/path/to/public_html/.well-known/...`, and NETCLICS will serve them at `/.well-known/...`.

## Configuration File

NETCLICS loads configuration from `config/netclics.json` by default.

Use a different file with:

```bash
out/bin/netclics --config /path/to/netclics.json
```

After editing the config file, save it and it will be automatically reloaded.

## Web interface

Open `http://localhost:8080/` (or your configured HTTPS listener) to convert
configuration and monitor platforms and instances. The interface is embedded
in the binary, using the same stack and StratoWeave styling as SORESPO.
See [webui/README.md](webui/README.md) for frontend development and regeneration.
