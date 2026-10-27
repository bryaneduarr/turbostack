# Get started

Run the whole development stack from a fresh clone with three commands. Install the [requirements](requirements.md) first.

```sh
git clone <repository>
cd <repository>
bun run dev
```

Use the repository URL in the first line and the folder name it creates in the second.

No env file is copied by hand. The first `bun run dev` installs packages, writes the env files from their examples, checks the machine, starts PostgreSQL in Docker, creates the database roles, applies migrations, seeds two example profiles, and starts the apps. The first run takes longer than later ones.

## What you should see

A terminal view lists each service with its live logs. When startup finishes, these addresses answer:

- Web client: `http://localhost:3000`
- API server: `http://localhost:3001/health/live`

[Run the app](run-the-app.md) explains each address.

## Stop

Press Ctrl+C in the terminal. The apps stop, and the database container keeps running. Stop it with `bun run db:down`.

If startup stops early with a line naming a problem, follow the fix it prints and run `bun run dev` again. Common cases are in [troubleshooting](troubleshooting.md).
