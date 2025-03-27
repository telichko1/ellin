require("dotenv").config({ path: "../.env" });

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Telegraf } = require("telegraf");
const multer = require("multer"); // Для работы с multipart/form-data
const fs = require("fs");
const path = require("path");

// Настройка multer для сохранения загруженных файлов
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadsDir = path.join(__dirname, "uploads");
    // Создаем папку, если она не существует
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Генерируем уникальное имя файла
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// Инициализация приложения Express
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Делаем папку uploads доступной статически
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Инициализация бота Telegram
const bot = new Telegraf(
  process.env.REACT_APP_TELEGRAM_BOT_TOKEN ||
    "8069414293:AAEGla5PH-mDwCitWkUEs4_PRFFD_X2LK_I"
);

// Замените заглушку на реальный ID администратора
const ADMIN_CHAT_ID = "750638552";

// Хранилище доступных слотов (в реальном приложении использовать базу данных)
const availableSlots = {};

// Обработка команды /start
bot.start((ctx) => {
  ctx.reply(
    "Добро пожаловать в бот EllinPrincess! Я помогу вам управлять заказами и расписанием."
  );
});

// Обработка команды /help
bot.help((ctx) => {
  ctx.reply(`
Список доступных команд:
/slots - Просмотреть занятые слоты
/addslot - Добавить занятый слот (формат: /addslot YYYY-MM-DD HH:MM)
/removeslot - Освободить слот (формат: /removeslot YYYY-MM-DD HH:MM)
  `);
});

// Просмотр занятых слотов
bot.command("slots", (ctx) => {
  const slots = Object.entries(availableSlots);

  if (slots.length === 0) {
    return ctx.reply("Нет занятых слотов.");
  }

  const message = slots
    .map(([date, times]) => {
      return `📅 ${date}: ${times.join(", ")}`;
    })
    .join("\n");

  ctx.reply(`Занятые слоты:\n${message}`);
});

// Добавление занятого слота
bot.command("addslot", (ctx) => {
  const args = ctx.message.text.split(" ").slice(1);

  if (args.length !== 2) {
    return ctx.reply("Неверный формат. Используйте: /addslot YYYY-MM-DD HH:MM");
  }

  const [date, time] = args;

  // Проверка формата даты и времени
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) {
    return ctx.reply(
      "Неверный формат даты или времени. Используйте: YYYY-MM-DD HH:MM"
    );
  }

  if (!availableSlots[date]) {
    availableSlots[date] = [];
  }

  if (availableSlots[date].includes(time)) {
    return ctx.reply(`Слот ${date} ${time} уже занят.`);
  }

  availableSlots[date].push(time);
  ctx.reply(`Слот ${date} ${time} помечен как занятый.`);
});

// Освобождение слота
bot.command("removeslot", (ctx) => {
  const args = ctx.message.text.split(" ").slice(1);

  if (args.length !== 2) {
    return ctx.reply(
      "Неверный формат. Используйте: /removeslot YYYY-MM-DD HH:MM"
    );
  }

  const [date, time] = args;

  if (!availableSlots[date] || !availableSlots[date].includes(time)) {
    return ctx.reply(`Слот ${date} ${time} не найден или уже свободен.`);
  }

  availableSlots[date] = availableSlots[date].filter((t) => t !== time);

  if (availableSlots[date].length === 0) {
    delete availableSlots[date];
  }

  ctx.reply(`Слот ${date} ${time} теперь свободен.`);
});

// API эндпоинт для получения свободных слотов
app.get("/api/slots/:date", (req, res) => {
  const { date } = req.params;
  const allPossibleSlots = [
    "10:00",
    "12:00",
    "14:00",
    "16:00",
    "18:00",
    "20:00",
  ];

  if (!availableSlots[date]) {
    return res.json({ availableSlots: allPossibleSlots });
  }

  const freeSlots = allPossibleSlots.filter(
    (time) => !availableSlots[date].includes(time)
  );
  res.json({ availableSlots: freeSlots });
});

// API эндпоинт для отправки уведомления о новом заказе с файлом
app.post("/api/orders", upload.single("screenshot"), async (req, res) => {
  try {
    const {
      serviceId,
      serviceName,
      price,
      name,
      telegramUsername,
      date,
      time,
    } = req.body;

    // Формируем текст сообщения
    let messageText = `
🔔 <b>Новый заказ!</b>

<b>Услуга:</b> ${serviceName} (ID: ${serviceId})
<b>Стоимость:</b> ${price} ₽
<b>Клиент:</b> ${name}
<b>Telegram:</b> ${telegramUsername}
<b>Дата и время:</b> ${date} в ${time}
    `;

    // Отправляем текстовое сообщение
    await bot.telegram.sendMessage(
      process.env.ADMIN_CHAT_ID || ADMIN_CHAT_ID,
      messageText,
      { parse_mode: "HTML" }
    );

    // Если есть скриншот, отправляем его
    if (req.file) {
      const filePath = req.file.path;
      await bot.telegram.sendPhoto(
        process.env.ADMIN_CHAT_ID || ADMIN_CHAT_ID,
        { source: filePath },
        { caption: "Скриншот оплаты" }
      );
    }

    // Помечаем слот как занятый
    if (!availableSlots[date]) {
      availableSlots[date] = [];
    }

    if (!availableSlots[date].includes(time)) {
      availableSlots[date].push(time);
    }

    res.status(200).json({ success: true, message: "Заказ успешно создан" });
  } catch (error) {
    console.error("Ошибка при создании заказа:", error);
    res
      .status(500)
      .json({ success: false, message: "Ошибка при создании заказа" });
  }
});

// Запуск сервера
const PORT = process.env.BOT_PORT || 3001;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

// Запуск бота
bot
  .launch()
  .then(() => console.log("Бот запущен"))
  .catch((err) => console.error("Ошибка при запуске бота:", err));

// Корректное завершение работы при остановке сервера
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
