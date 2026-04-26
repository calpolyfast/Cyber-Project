FROM node:20-alpine

WORKDIR /app
COPY ./backend ./backend
COPY ./frontend ./frontend
COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm ci
RUN npm run build
RUN rm -rf ./frontend

RUN cd ./backend && npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "backend:run"]
