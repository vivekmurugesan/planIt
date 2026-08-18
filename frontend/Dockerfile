FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps --prefer-offline --no-audit

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node_modules/.bin/next", "start"]
