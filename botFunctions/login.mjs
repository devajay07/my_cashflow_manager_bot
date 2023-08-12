import User from "../utils/db.mjs";

const handleUserLogin = async (chatId, name) => {
  try {
    let user = await User.findOne({ chatId });
    if (!user) {
      user = new User({ chatId, name });
      await user.save();
    }
    return 200;
  } catch (error) {
    console.error("Error handling user login:", error);
    return 400;
  }
};

export default handleUserLogin;
