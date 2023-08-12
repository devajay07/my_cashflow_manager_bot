import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.post("/new-message", (req, res) => {
  const chatId = req.body.message.chat.id; // Corrected
  const text = "Whatsuppp Bitchhhhh??????"; // Replace with your desired text

  axios
    .post(`https://api.telegram.org/bot<YOUR_BOT_TOKEN>/sendMessage`, {
      chat_id: chatId,
      text: text,
    })
    .then((response) => {
      console.log("message posted", response.data);
      res.end("ok");
    })
    .catch((err) => {
      console.log("oooops!!!", err);
      res.end("Error" + err);
    });
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
