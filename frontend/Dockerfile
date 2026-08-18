FROM node:18-bullseye-slim

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --legacy-peer-deps && npm list next && ls -la node_modules/.bin/next

COPY . .

RUN npm run build

EXPOSE 3000

# Ensure node_modules and .next are valid before starting
CMD ["sh", "-c", "if [ ! -d 'node_modules' ]; then echo 'Installing dependencies...'; npm ci --legacy-peer-deps && npm run build; fi && npm start"]
