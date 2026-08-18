FROM node:18-bullseye-slim

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

EXPOSE 3000

# Use full path to ensure next is found
CMD ["/app/node_modules/.bin/next", "start"]
