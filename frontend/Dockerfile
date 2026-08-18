FROM node:18-bullseye-slim

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --legacy-peer-deps && npm list next && ls -la node_modules/.bin/next

COPY . .

RUN npm run build

EXPOSE 3000

# Ensure .next build exists before starting
CMD ["sh", "-c", "if [ ! -d '.next' ]; then echo 'Building application...'; npm run build; fi && npm start"]
