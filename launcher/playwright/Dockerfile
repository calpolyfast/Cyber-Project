FROM mcr.microsoft.com/playwright:v1.58.0-noble

WORKDIR /scripts

COPY ./package*.json ./
RUN npm i

COPY ./scripts/ ./