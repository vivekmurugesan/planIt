# Build stage
FROM node:20-slim AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Generate Prisma client from schema
RUN npx prisma generate

# Compile TypeScript
RUN npm run build

# Production stage
FROM node:20-slim

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

# Copy Prisma schema and client
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copy compiled code
COPY --from=builder /app/dist ./dist

EXPOSE 3001

CMD ["npm", "start"]
