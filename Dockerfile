# Этап 1: Билд
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm ci

# Копируем исходный код и собираем приложение
COPY . .
RUN npm run build

# Этап 2: Сервер Nginx
FROM nginx:alpine

# Копируем собранные файлы
COPY --from=builder /app/dist /usr/share/nginx/html

# Копируем конфигурацию Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порт
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]