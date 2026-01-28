# Docker & Render Deployment Guide (Mini CRM Backend)

This file documents how to run the Mini CRM backend using Docker locally
and deploy it to Render. All commands below are shell commands.

----------------------------------------------------------------
DOCKER SETUP (LOCAL)
----------------------------------------------------------------

1. Create Dockerfile

File: Dockerfile

Contents:

```dockerfile
# ---------- BUILD STAGE ----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ---------- PRODUCTION STAGE ----------
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["node", "dist/main.js"]
```

----------------------------------------------------------------

2. Create docker-compose.yml

File: docker-compose.yml

Contents:

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:15
    container_name: mini_crm_postgres
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: mini_crm_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  api:
    build: .
    container_name: mini_crm_api
    depends_on:
      - postgres
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/mini_crm_db
      JWT_SECRET: super-secret-key
    ports:
      - "3000:3000"
    command: sh -c "npx prisma db push && node dist/main.js"

volumes:
  postgres_data:
```

----------------------------------------------------------------

3. Run Docker locally

Shell commands:

```bash
docker compose up --build
```

Expected output:
- PostgreSQL starts
- Prisma runs db push
- NestJS starts on port 3000

Swagger URL (local):

http://localhost:3000/api

Stop containers:

```bash
Ctrl + C
```

----------------------------------------------------------------
RENDER DEPLOYMENT
----------------------------------------------------------------

1. Push Docker files to GitHub

Shell commands:

```bash
git add Dockerfile docker-compose.yml
git commit -m "Add Docker support for production deployment"
git push origin main
```

----------------------------------------------------------------

2. Create Render Web Service

Steps (Render UI):

- Go to https://render.com
- Login with GitHub
- Click: New → Web Service
- Select your repository
- Environment: Docker
- Branch: main
- Root Directory: mini-crm-backend
- Plan: Free

----------------------------------------------------------------

3. Configure Environment Variables (Render Dashboard)

Add the following variables:

DATABASE_URL
(postgres connection string from Render PostgreSQL)

JWT_SECRET
(super-secret-key)

IMPORTANT:
- Use Render’s managed PostgreSQL
- Do NOT use docker-compose Postgres in production

----------------------------------------------------------------

4. Deployment Result

After successful deploy, Render provides a URL like:

https://mini-crm-backend.onrender.com

Swagger URL:

https://mini-crm-backend.onrender.com/api

----------------------------------------------------------------

5. Update README.md (after deploy)

Add:

Deployment URL: https://mini-crm-backend.onrender.com
Swagger URL: https://mini-crm-backend.onrender.com/api

----------------------------------------------------------------
END OF FILE
----------------------------------------------------------------
