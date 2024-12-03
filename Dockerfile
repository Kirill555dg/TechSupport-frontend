# Используем официальный образ Nginx
FROM nginx:alpine

# Копируем содержимое фронтенда
COPY src/ /usr/share/nginx/html/

# Открываем порт
EXPOSE 8080

# Запуск Nginx
CMD ["nginx", "-g", "daemon off;"]
