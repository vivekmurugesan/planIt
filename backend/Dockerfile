FROM node:20-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Set a dummy DATABASE_URL for build-time Prisma generation
ENV DATABASE_URL="postgresql://user:password@localhost:5432/db"

RUN npm run build && npx prisma generate

EXPOSE 3001

CMD ["npm", "start"]
