FROM node:18-slim

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install --legacy-peer-deps && npm list next

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
