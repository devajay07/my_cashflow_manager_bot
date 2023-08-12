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
  const message = req.body.message;
  axios
    .post(
      "https://api.telegram.org/bot6428164643:AAES3HyVV_IAQREcm-MYZ58LRI72F4fcCag/sendMessage",
      {
        chat_id: message.chat_id,
        text: "Whatsuppp Bitchhhhh??????",
      }
    )
    .then((response) => {
      console.log("message posted", response);
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
