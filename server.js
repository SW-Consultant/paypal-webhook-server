import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const app = express();
app.use(bodyParser.json());

// Проверочный маршрут — можно открыть в браузере
app.get("/", (req, res) => {
  res.send("✅ PayPal Webhook Server is running!");
});

// Основной webhook PayPal
app.post("/paypal/webhook", async (req, res) => {
  console.log("💳 Webhook event received:");
  console.log(req.body);

  try {
    // Если ты хочешь уведомлять своего бота:
    if (process.env.BOT_NOTIFY_URL) {
      await axios.post(process.env.BOT_NOTIFY_URL, {
        type: "payment",
        status: "success",
        data: req.body,
      });
    }
  } catch (err) {
    console.error("Ошибка при уведомлении бота:", err.message);
  }

  res.sendStatus(200);
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
