FROM node:20-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Prisma client generation (uses schema.prisma, doesn't need working DB)
RUN npx prisma generate

RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
