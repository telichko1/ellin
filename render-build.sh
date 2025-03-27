#!/usr/bin/env bash
# exit on error
set -o errexit

# Установка зависимостей основного проекта
npm install

# Сборка React-приложения
npm run build 