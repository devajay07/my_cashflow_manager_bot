import mongoose from "mongoose";
import dotenv from "dotenv";
import { Timestamp } from "mongodb";
dotenv.config();

const databaseURI = process.env.DATABASE_URI; // Use the environment variable

mongoose
  .connect(databaseURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((response) => {
    console.log("Connected to MongoDB");
  });

const userSchema = new mongoose.Schema(
  {
    chatId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      require: true,
    },
    expense: {
      type: [Object],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
