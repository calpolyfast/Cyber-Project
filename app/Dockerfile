FROM node:20-alpine
WORKDIR /app

COPY ./backend/package*.json ./backend/
RUN cd backend && npm ci --omit=dev

COPY ./frontend/package*.json ./frontend/
RUN cd frontend && npm ci

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY ./frontend /app/frontend/
RUN cd frontend && npm run build -- --outDir ../backend/build

COPY ./backend/prisma ./backend/prisma/
RUN cd backend && npx prisma generate
COPY backend ./backend/

EXPOSE 3000
CMD ["node", "backend/src/app.mjs"]