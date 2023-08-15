import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import TelegramBot from "node-telegram-bot-api";
import User from "./utils/db.mjs";
import {
  generateWeekChart,
  generateYearChart,
  generateCategoryChart,
  generateMonthChart,
} from "./utils/chart.mjs";
import spending_breakdown from "./utils/spendingBreakdown.mjs";
import calculatedExpense from "./utils/calculateExpense.mjs";
import handleUserLogin from "./botFunctions/login.mjs";
import parseExpenseMessage from "./utils/parseExpenseMessage.mjs";

const app = express();
const token = process.env.BOT_TOKEN;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 8000;
let expense;

const bot = new TelegramBot(token, {
  polling: { interval: 300, autoStart: true },
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const name = msg.from.first_name;
  const text = msg.text?.toLowerCase();
  let botResponse;
  const user = await User.findOne({ chatId });
  switch (true) {
    case text === "/start":
      try {
        const responseCode = await handleUserLogin(chatId, name);

        if (responseCode === 200) {
          // User login/registration successful
          botResponse =
            `Welcome ${name} to CashFlow Bot!\n` +
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
      break;

    case text?.includes("hi") ||
      text?.includes("hello") ||
      text?.includes("hey"):
      botResponse = "Hello there! How can I assist you today?";
      break;

    case text === "/total": {
      if (user) {
        expense = calculatedExpense(user);
        botResponse = `
📊 <b>Expense Overview</b> 📊\n
<i>Today's</i> expenses: <b>${expense.today} ₹</b>\n
This <i>week</i> expenses: <b>${expense.week} ₹</b>\n
This <i>month</i> expenses: <b>${expense.month} ₹</b>\n
This <i>year</i> expenses: <b>${expense.year} ₹</b>\n\n
Total Expense: <b>${expense.total} ₹</b>
`;

        bot.sendMessage(chatId, botResponse, {
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [
              [
                { text: "This Week Chart📈", callback_data: "view_chart_week" },
                {
                  text: "This Month Chart📈",
                  callback_data: "view_chart_month",
                },
              ],
              [
                {
                  text: "This Year Chart📈",
                  callback_data: "view_chart_year",
                },
              ],
            ],
          },
        });
        return;
      } else {
        botResponse = "Please register first using /start command.";
      }

      break;
    }

    case text === "/spending_breakdown": {
      if (user) {
        const spendingBreakdownData = spending_breakdown(user);
        const chartImage = generateCategoryChart(spendingBreakdownData);
        bot.sendPhoto(chatId, chartImage, {
          caption: "Category chart",
          contentType: "image/png",
        });
      } else {
        botResponse = "Please register first using /start command.";
      }
      break;
    }

    default:
      const parsedMessage = parseExpenseMessage(text);
      if (parsedMessage === 400) {
        botResponse = `Invalid message. Type '/start' to get instructions.`;
      } else {
        if (user) {
          const date = new Date().toLocaleString();
          console.log(date);
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

bot.on("callback_query", (query) => {
  const { data } = query;
  const chatId = query.message.chat.id;

  if (data === "view_chart_week") {
    try {
      const chartImage = generateWeekChart(expense);
      bot.sendPhoto(chatId, chartImage, {
        caption: "This week expense chart:",
        contentType: "image/png",
      });
    } catch (error) {
      console.error("Error generating or sending chart image:", error);
    }
  } else if (data === "view_chart_month") {
    try {
      const chartImage = generateMonthChart(expense);
      bot.sendPhoto(chatId, chartImage, {
        caption: "This month expense chart:",
        contentType: "image/png",
      });
    } catch (error) {
      console.error("Error generating or sending chart image:", error);
    }
  } else if (data === "view_chart_year") {
    try {
      const chartImage = generateYearChart(expense);
      bot.sendPhoto(chatId, chartImage, {
        caption: "This year expense chart:",
        contentType: "image/png",
      });
    } catch (error) {
      console.error("Error generating or sending chart image:", error);
    }
  }
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
