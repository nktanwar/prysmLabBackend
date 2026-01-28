# ---------- BUILD STAGE ----------
FROM node:20-bullseye AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y netcat-openbsd

COPY package*.json ./
RUN npm install


COPY prisma ./prisma
RUN npx prisma generate

COPY . .
RUN npm run build


# ---------- PRODUCTION STAGE ----------
FROM node:20-bullseye

WORKDIR /app

RUN apt-get update && apt-get install -y netcat-openbsd


COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

COPY wait-for-postgres.sh .

EXPOSE 3000

CMD ["node", "dist/main.js"]
