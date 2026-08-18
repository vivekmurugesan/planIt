# Build stage
FROM node:20-slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

# Production stage
FROM node:20-slim

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --legacy-peer-deps --omit=dev

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/app ./app

EXPOSE 3000

CMD ["npm", "start"]
