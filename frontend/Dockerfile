FROM node:18-bullseye-slim

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --legacy-peer-deps && npm list next && ls -la node_modules/.bin/next

COPY . .

RUN npm run build

COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/app/docker-entrypoint.sh"]
