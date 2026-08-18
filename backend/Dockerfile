FROM node:18-bullseye-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Generate Prisma client from schema
RUN npx prisma generate

# Compile TypeScript
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
