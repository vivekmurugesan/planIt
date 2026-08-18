FROM node:18-bullseye-slim

WORKDIR /app

COPY package.json package-lock.json ./

# Install with verbose output and explicit error checking
RUN npm install --legacy-peer-deps --verbose 2>&1 | tail -20 && \
    test -d node_modules || (echo "ERROR: node_modules not created!" && exit 1) && \
    test -f node_modules/.bin/next || (echo "ERROR: next binary not found!" && exit 1) && \
    echo "SUCCESS: npm install completed, next binary exists"

COPY . .

RUN npm run build

EXPOSE 3000

# Use full path to ensure next is found
CMD ["/app/node_modules/.bin/next", "start"]
