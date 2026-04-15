FROM node:20-alpine

WORKDIR /app
COPY ./api ./api
COPY ./web ./web
COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm ci
RUN npm run build
RUN rm -rf ./web

EXPOSE 3000

CMD ["npm", "run", "api:run"]
