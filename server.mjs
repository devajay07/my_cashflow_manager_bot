import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import User from "./utils/db.mjs";
import handleUserLogin from "./botFunctions/login.mjs";
import parseExpenseMessage from "./utils/parseExpenseMessage.mjs";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.post("/new-message", async (req, res) => {
  console.log("Incoming request body:", req.body);
  const chatId = req.body.message.chat.id || req.body.my_chat_member.chat.id;
  const name =
    req.body.message.chat.first_name || req.body.my_chat_member.from.first_name;
  const text = req.body.message.text;
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
  axios
    .post(
      `https://api.telegram.org/bot6428164643:AAES3HyVV_IAQREcm-MYZ58LRI72F4fcCag
/sendMessage`,
      {
        chat_id: chatId,
        text: botResponse,
      }
    )
    .then((response) => {
      res.end(botResponse);
    })
    .catch((err) => {
      console.log("oooops!!!", err);
      res.end("Error" + err);
    });
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
