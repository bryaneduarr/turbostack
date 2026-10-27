# GitHub Codespaces

Run the stack in a cloud codespace, with nothing installed on your machine. A codespace uses the same dev container described in [dev container](devcontainer.md).

Codespaces itself has not been run with this template; these steps follow the dev container configuration.

## Open a codespace

1. On the repository page, choose **Code**, then **Codespaces**, then **Create codespace on main**.
2. When the terminal opens, run:

```sh
bun run dev
```

## Ports

- **3000** web client and **3001** API: open them from the **Ports** panel.
- PostgreSQL is not exposed outside the codespace.
