@echo off
echo Установка зависимостей для React-приложения...
call npm install

echo Установка зависимостей для сервера Telegram бота...
cd telegram-bot-server
call npm install
cd ..

echo Запуск проекта...
call npm start 