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

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const name = msg.from.first_name;
  const text = msg.text.toLowerCase();
  let botResponse;

  if (text === "/start") {
    try {
      const responseCode = await handleUserLogin(chatId, name);

      if (responseCode === 200) {
        // User login/registration successful
        botResponse =
          "Welcome to CashFlow Bot!\n" +
          "You are good to go🥳\n\n" +
          "To track expenses, type a message like:\n" +
          "'200 on foods' or simply '200 foods'\n\n" +
          "For more commands, type '/help'.";
      } else {
        // An error occurred during user login/registration
        botResponse = "Sorry, something went wrong during registration.";
      }
    } catch (error) {
      console.error("Error during user login:", error);
      botResponse = "An error occurred during user registration.";
    }
  } else if (
    text.includes("hi") ||
    text.includes("hello") ||
    text.includes("hey")
  ) {
    botResponse = "Hello there! How can I assist you today?";
  } else {
    const parsedMessage = parseExpenseMessage(text);
    if (parsedMessage === 400) {
      botResponse = `Invalid message. Type '/start' to get instructions.`;
    } else {
      const user = await User.findOne({ chatId });
      if (user) {
        const date = Date.now();
        parsedMessage.date = date;
        user.expense.push(parsedMessage);
        botResponse = "recorded";
        user.save();
      } else {
        botResponse = "Please register first using /start command.";
      }
    }
  }
  bot.sendMessage(chatId, botResponse);
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
