FROM node:18-slim

WORKDIR /app

RUN apt-get update && apt-get install -y libssl1.1 && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npx prisma generate

EXPOSE 3001

CMD ["npm", "start"]
