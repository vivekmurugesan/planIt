FROM node:18-bullseye-slim

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --legacy-peer-deps

COPY . .

RUN npm run build

# Ensure node_modules is ready at runtime
RUN npm rebuild

EXPOSE 3000

CMD ["npm", "start"]
