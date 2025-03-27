#!/bin/bash

# Установка зависимостей для основного проекта
echo "Установка зависимостей для React-приложения..."
npm install

# Установка зависимостей для сервера Telegram бота
echo "Установка зависимостей для сервера Telegram бота..."
cd telegram-bot-server && npm install
cd ..

# Запуск проекта
echo "Запуск проекта..."
npm start 