const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    sessionID: { type: String },
  },
  { collection: "user" }
);
const User = mongoose.model("User", userSchema);
module.exports = User;
