FROM node:18-bullseye-slim

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --legacy-peer-deps && npm list next && ls -la node_modules/.bin/next

COPY . .

RUN npm run build

EXPOSE 3000

# Use shell form to ensure node_modules exists and start the app
CMD ["sh", "-c", "if [ ! -d 'node_modules' ]; then echo 'Installing dependencies...'; npm ci --legacy-peer-deps; fi && npm start"]
