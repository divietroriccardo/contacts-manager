const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// create a schema
const contactSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    addressCity: { type: String },
    addressStreet: { type: String },
    phoneNumber: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    isFavorite: { type: Boolean }
  },
  { collection: "contacts" }
);
const Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;
