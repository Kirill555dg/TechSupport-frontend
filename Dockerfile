# Используем официальный образ Node.js для сборки фронтенда
FROM node:20 AS build
# Указываем рабочую директорию
WORKDIR /app
# Копируем package.json и package-lock.json для установки зависимостей
COPY package.json package-lock.json ./
# Устанавливаем зависимости
RUN npm install
# Копируем исходный код проекта
COPY . .
# Сборка проекта с использованием Webpack
RUN npm run build

# Используем минимальный образ Nginx для развертывания фронтенда
FROM nginx:stable
# Копируем собранные файлы из этапа сборки
COPY --from=build /app/build /usr/share/nginx/html
# Копируем конфигурационный файл Nginx
COPY nginx.conf /etc/nginx/nginx.conf
# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]
