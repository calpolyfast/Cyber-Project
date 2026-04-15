FROM node:20-alpine

WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build
RUN rm -rf ./web

EXPOSE 3000

CMD ["npm", "run", "api:run"]
