FROM node:20-alpine

WORKDIR /app
COPY ./backend ./backend
COPY ./frontend ./frontend
COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm ci
RUN npm run build
RUN rm -rf ./frontend

RUN npx prisma generate --schema ./backend/prisma/schema.prisma

EXPOSE 3000

CMD ["npm", "run", "backend:run"]
