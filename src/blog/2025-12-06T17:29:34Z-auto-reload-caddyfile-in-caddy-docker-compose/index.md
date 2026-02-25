---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Auto reload Caddyfile in Caddy docker compose"
pubDate: 2025-12-06T17:29:34Z
tags: [caddy, tip, ci]
---

NOTE: I will be investigating using [docker labels](https://github.com/lucaslorentz/caddy-docker-proxy) with this soon...

[Caddy](https://caddyserver.com) supports `--watch`ing and automatically reloading the Caddyfile but unfortunately, this isn't enabled in various [docker images](https://github.com/caddyserver/caddy-docker).

This means you need to refresh (or poke the docker container) everytime you change the "Caddyfile".

Thankfully, docker allows you to [overwrite](https://docs.docker.com/reference/compose-file/services/#command) the `ENTRYPOINT` defined in the running docker container with your own command. 

The `ENTRYPOINT` is defined in the [existing Dockerfile](https://github.com/caddyserver/caddy-docker/blob/cf30c98da75019494eedf13b00efc7c75956b099/Dockerfile.tmpl#L61) as "CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]" so to reproduce the existing behaviour _and_ get automatic reloading of Caddy file add the following to the `caddy` service in your "docker-compose.yaml" (the existing `ENTRYPOINT` and the new "--watch" argument):

```yaml
    command:
      [
        "caddy",
        "run",
        "--config",
        "/etc/caddy/Caddyfile",
        "--adapter",
        "caddyfile",
        "--watch",
      ]
```

As an example, assume the following "compose.yaml":

```yaml
services:
  caddy:
    container_name: caddy
    image: ghcr.io/caddybuilds/caddy-cloudflare:latest
    command:
      [
        "caddy",
        "run",
        "--config",
        "/etc/caddy/Caddyfile",
        "--adapter",
        "caddyfile",
        "--watch",
      ]
    restart: no
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./caddy-config:/config
      - ./caddy-data:/data
      - ./Caddyfile:/etc/caddy/Caddyfile
```

with the following "Caddyfile":

```caddy
localhost {
    respond "Hello, world"
}
```

`docker compose up` in the directory containing the "compose.yaml":

```bash
➜  caddy docker compose up
[+] Running 1/1
 ✔ Container caddy  Running                                          0.0s 
Attaching to caddy
```

Viewing (with a browser or curl, whatever):

``` bash
➜  caddy curl --insecure https://localhost
Hello, world%     
```

Change the HTML returned by the "Caddyfile":

``` caddy
localhost {
    respond "Hello, world - wootage!"
}
```

and you _should_ see your log (in the terminal you ran `docker compose up`) reload the file:

``` log
caddy  | {"level":"info","ts":1765042844.273521,"msg":"autosaved config (load with --resume flag)","file":"/config/caddy/autosave.json"}
```

Visit the page again and rejoice:

``` bash
➜  caddy curl --insecure https://localhost
Hello, world - wootage!%         
```

Wootage.
