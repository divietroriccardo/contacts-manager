const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    sessionID: { type: String },
    contacts: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          auto: true,
        },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        addressCity: { type: String },
        addressStreet: { type: String },
        phoneNumber: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        isFavorite: { type: Boolean },
      },
    ],
  },
  { collection: "user" }
);
const User = mongoose.model("User", userSchema);
module.exports = User;
