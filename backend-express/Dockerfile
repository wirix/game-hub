# Этап 1: Билд
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm ci --only=production

# Этап 2: Финальный образ
FROM node:20-alpine

WORKDIR /app

# Устанавливаем production зависимости
COPY --from=builder /app/node_modules ./node_modules

# Копируем исходный код
COPY . .

# Создаем папки для загрузок
RUN mkdir -p uploads/avatars uploads/backgrounds

# Устанавливаем переменные окружения
ENV NODE_ENV=production
ENV PORT=7000

# Открываем порт
EXPOSE 7000

# Запускаем приложение
CMD ["node", "src/index.js"]