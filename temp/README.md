# Next.js + PostgreSQL Dev Container

A development environment using VS Code Dev Containers with Next.js and PostgreSQL.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [VS Code](https://code.visualstudio.com/)
- [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

## Getting Started

### 1. Create Your Next.js App

Before opening in a dev container, create your Next.js app in this directory:

```bash
# From this directory, run:
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

Or if you prefer to start fresh:

```bash
# Answer the prompts as desired
npx create-next-app@latest . 
```

### 2. Open in Dev Container

1. Open this folder in VS Code
2. Press `Ctrl/Cmd + Shift + P` → "Dev Containers: Reopen in Container"
3. Wait for the container to build (first time takes a few minutes)

### 3. Start Developing

Once inside the container:

```bash
# Start the dev server
npm run dev

# Access at http://localhost:3000
```

## Database Access

### From Inside the Container (Next.js app, Claude Code, terminal)

```
Host: db
Port: 5432
Database: myapp
User: postgres
Password: postgres

Connection string: postgresql://postgres:postgres@db:5432/myapp
```

### From Your Host Machine (GUI tools like pgAdmin, TablePlus)

```
Host: localhost
Port: 5432
Database: myapp
User: postgres
Password: postgres

Connection string: postgresql://postgres:postgres@localhost:5432/myapp
```

### Using psql

```bash
# Inside the dev container terminal:
psql $DATABASE_URL

# Or connect directly:
psql -h db -U postgres -d myapp
```

## Adding a Database ORM

### Prisma (Recommended)

```bash
npm install prisma @prisma/client
npx prisma init

# After defining your schema:
npx prisma migrate dev --name init
npx prisma generate
```

### Drizzle

```bash
npm install drizzle-orm postgres
npm install -D drizzle-kit
```

## Project Structure

```
.
├── .devcontainer/
│   ├── devcontainer.json    # Dev container config
│   ├── docker-compose.yml   # Services (app + db)
│   └── init-db/             # DB initialization scripts
├── Dockerfile.dev           # Development image
├── .env.example             # Environment template
└── ... (Next.js app files)
```

## Useful Commands

```bash
# Rebuild the container (after Dockerfile changes)
# Ctrl/Cmd + Shift + P → "Dev Containers: Rebuild Container"

# View PostgreSQL logs
docker logs <project>-db-1

# Reset database (from host)
docker volume rm <project>_postgres_data

# Connect to db container directly
docker exec -it <project>-db-1 psql -U postgres -d myapp
```

## Claude Code

Claude Code works seamlessly inside this dev container:

- Full filesystem access to your project
- Direct database access via `psql` or your ORM
- All npm/node commands work natively
- No need for `docker exec` workarounds

## Ports

| Service    | Container Port | Host Port |
|------------|----------------|-----------|
| Next.js    | 3000           | 3000      |
| PostgreSQL | 5432           | 5432      |
