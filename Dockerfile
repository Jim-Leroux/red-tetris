# Étape 1 : build frontend
FROM node:20-alpine as frontend-build
WORKDIR /app
COPY frontend ./frontend
RUN cd frontend && npm install && npm run build

# Étape 2 : backend
FROM node:20-alpine
WORKDIR /app

COPY backend ./backend
COPY --from=frontend-build /app/frontend/build ./backend/frontend/build

WORKDIR /app/backend
RUN npm install --production

EXPOSE 3000
CMD ["node", "index.js"]
