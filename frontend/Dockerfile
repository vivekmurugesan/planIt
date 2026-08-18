FROM node:18-bullseye-slim

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --legacy-peer-deps && \
    echo "=== npm list next ===" && \
    npm list next && \
    echo "=== ls node_modules/.bin/next ===" && \
    ls -la node_modules/.bin/next && \
    echo "=== npm ls installed packages ===" && \
    npm ls --depth=0

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
