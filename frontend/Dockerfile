FROM node:20-slim

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN rm -rf node_modules/.swc && npm run build

EXPOSE 3000

CMD ["npm", "start"]
