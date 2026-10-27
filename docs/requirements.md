# Requirements

Development needs only three tools on the machine: git, Bun, and Docker. PostgreSQL runs in Docker, and packages install with Bun.

## Needed for development

- **git**: clones the repository.
- **Bun 1.4.0 or a later 1.4 patch release**: installs packages and runs every project command. Install it from [bun.sh](https://bun.sh).
- **Docker with Compose v2**: runs the database. Install it from [docs.docker.com](https://docs.docker.com/get-docker/).

## Optional or other cases

- **lsof**: optional. The startup check falls back to a socket probe when it is missing, so a minimal system still works.
- **Node 22.9 or newer**: needed only for `bun run start`, the local production run. `bun run dev` never needs Node, and the Docker production path needs no Node.
- **Nix**: on NixOS, the end-to-end tests build the libraries their browsers need with `nix`.

## Operating systems

- **Linux**: supported.
- **macOS**: supported.
- **Windows**: supported only through WSL2. Run every command inside a WSL2 Linux distribution. Windows without WSL2 is not supported.
- **NixOS**: supported on the host, or through the [devcontainer](devcontainer.md).

After installing, go to [get-started](get-started.md).
