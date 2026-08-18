FROM node:20-slim

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --legacy-peer-deps && npm list next && ls -la node_modules/.bin/next

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
