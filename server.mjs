import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import TelegramBot from "node-telegram-bot-api";
import User from "./utils/db.mjs";
import handleUserLogin from "./botFunctions/login.mjs";
import parseExpenseMessage from "./utils/parseExpenseMessage.mjs";

const app = express();
const token = process.env.BOT_TOKEN;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 8000;

const bot = new TelegramBot(token, { polling: true });

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  if (msg.text.includes("hi")) {
    bot.sendMessage(chatId, "Hey from this side");
  }
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
