const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const User = require("./model/user");
const Contact = require("./model/contact");

const url = "mongodb://0.0.0.0:27017/ContactsDB";
const statusCode = {
  "Bad Request": 400,
  Error: 400,
  Unauthorized: 401,
  Forbidden: 403,
  "Not Found": 404,
  Conflict: 409,
  "Username Conflict": 409,
  "Email Conflict": 409,
  "Phone number Conflict": 409,
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/api/signup", async (req, res) => {
  try {
    await mongoose.connect(url);

    const username = await User.findOne({
      username: req.body.username,
    });
    const email = await User.findOne({
      email: req.body.email,
    });
    const phoneNumber = await User.findOne({
      phoneNumber: req.body.phoneNumber,
    });

    if (username) {
      throw new Error("Username Conflict");
    }
    if (email) {
      throw new Error("Email Conflict");
    }
    if (phoneNumber) {
      throw new Error("Phone Number Conflict");
    }

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      password: req.body.password,
      sessionID: "",
    });

    salt = await bcrypt.genSalt(saltRounds);

    hashedPassword = await bcrypt.hash(newUser.password, saltRounds);

    if (!hashedPassword) {
      throw new Error("Error");
    }

    newUser.password = hashedPassword;
    newUser.save();

    return res.status(200).json({
      status: "success",
      data: newUser,
    });
  } catch (err) {
    return res.status(statusCode[err.message]).json({
      status: "fail",
      message: err.message,
    });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    await mongoose.connect(url);

    key = "";
    const sessionID = sessionIDGenerator();

    const username = await User.findOne({
      username: req.body.user,
    });
    const email = await User.findOne({
      email: req.body.user,
    });
    const phoneNumber = await User.findOne({
      phoneNumber: req.body.user,
    });

    if (username) {
      key = "username";
    } else if (email) {
      key = "email";
    } else if (phoneNumber) {
      key = "phoneNumber";
    }

    const user = await User.findOneAndUpdate(
      { [key]: req.body.user },
      { sessionID: sessionID }
    );

    if (!user) {
      throw new Error("Not Found");
    }

    samePassword = await bcrypt.compare(req.body.password, user.password);

    if (!samePassword) {
      throw new Error("Unauthorized");
    }

    res.status(200).json({
      status: "success",
      data: sessionID,
    });
  } catch (err) {
    return res.status(statusCode[err.message] ?? 400).json({
      status: "fail",
      message: err.message,
    });
  }
});

app.post("/api/logout", async (req, res) => {
  try {
    await mongoose.connect(url);

    const user = await sessionCheck(req.headers.authorization);

    if (!user) {
      throw new Error("Not Found");
    }

    user.sessionID = "";
    user.save();

    res.status(200).json({
      status: "success",
      data: "Log out",
    });
  } catch (err) {
    return res.status(statusCode[err.message] ?? 400).json({
      status: "fail",
      message: err.message,
    });
  }
});

app.get("/api/contacts", async (req, res) => {
  try {
    await mongoose.connect(url);

    const user = await sessionCheck(req.headers.authorization);

    if (!user) {
      throw new Error("Unauthorized");
    }

    const contacts = user.contacts;

    return res.status(200).json({
      status: "success",
      data: contacts,
    });
  } catch (err) {
    return res.status(statusCode[err.message] ?? 400).json({
      status: "fail",
      message: err.message,
    });
  }
});

app.get("/api/details/:id", async (req, res) => {
  try {
    await mongoose.connect(url);

    const user = await sessionCheck(req.headers.authorization);

    if (!user) {
      throw new Error("Unauthorized");
    }

    const contact = user.contacts.find(
      (contact) => contact._id == req.params.id // contact._id = object; req.params.id = string
    );

    if (!contact) {
      throw new Error("Not Found");
    }

    return res.status(200).json({
      status: "success",
      data: contact,
    });
  } catch (err) {
    return res.status(statusCode[err.message] ?? 400).json({
      status: "fail",
      message: err.message,
    });
  }
});

app.post("/api/add", async (req, res) => {
  try {
    await mongoose.connect(url);

    const user = await sessionCheck(req.headers.authorization);

    if (!user) {
      throw new Error("Unauthorized");
    }

    existingPhoneNumber = user.contacts.find(
      (contact) => contact.phoneNumber === req.body.phoneNumber
    );
    existingEmail = user.contacts.find(
      (contact) => contact.email === req.body.email
    );

    if (existingPhoneNumber) {
      throw new Error("Phone number Conflict");
    }
    if (existingEmail) {
      throw new Error("Email Conflict");
    }

    const newContact = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      addressCity: req.body.addressCity,
      addressStreet: req.body.addressStreet,
      isFavorite: req.body.isFavorite,
    };

    user.contacts.push(newContact);
    user.save();

    return res.status(200).json({
      status: "success",
      data: newContact,
    });
  } catch (err) {
    return res.status(statusCode[err.message] ?? 400).json({
      status: "fail",
      message: err.message,
    });
  }
});

app.post("/api/edit/:id", async (req, res) => {
  try {
    await mongoose.connect(url);

    const user = await sessionCheck(req.headers.authorization);

    if (!user) {
      throw new Error("Unauthorized");
    }

    user.contacts.find((contact) => contact._id == req.params.id).firstName =
      req.body.firstName;
    user.contacts.find((contact) => contact._id == req.params.id).lastName =
      req.body.lastName;
    user.contacts.find((contact) => contact._id == req.params.id).email =
      req.body.email;
    user.contacts.find((contact) => contact._id == req.params.id).phoneNumber =
      req.body.phoneNumber;
    user.contacts.find(
      (contact) => contact._id == req.params.id
    ).addressStreet = req.body.addressStreet;
    user.contacts.find((contact) => contact._id == req.params.id).addressCity =
      req.body.addressCity;

    user.save();
    return res.status(200).json({
      status: "success",
      data: user.contacts.find((contact) => contact._id == req.params.id),
    });
  } catch (err) {
    return res.status(statusCode[err.message] ?? 400).json({
      status: "fail",
      message: err.message,
    });
  }
});

app.post("/api/favorite/:id", async (req, res) => {
  try {
    await mongoose.connect(url);

    const user = await sessionCheck(req.headers.authorization);

    if (!user) {
      throw new Error("Unauthorized");
    }

    user.contacts.find((contact) => contact._id == req.params.id).isFavorite =
      req.body.isFavorite;

    user.save();
    return res.status(200).json({
      status: "success",
      data: user.contacts.find((contact) => contact._id == req.params.id),
    });
  } catch (err) {
    return res.status(statusCode[err.message] ?? 400).json({
      status: "fail",
      message: err.message,
    });
  }
});

app.delete("/api/delete/:id", async (req, res) => {
  try {
    await mongoose.connect(url);

    const user = await sessionCheck(req.headers.authorization);

    if (!user) {
      throw new Error("Unauthorized");
    }

    index = user.contacts.findIndex((contact) => contact._id == req.params.id);
    user.contacts.splice(index, 1);

    user.save();
    return res.status(200).json({
      status: "success",
      data: "Successful",
    });
  } catch (err) {
    return res.status(statusCode[err.message] ?? 400).json({
      status: "fail",
      message: err.message,
    });
  }
});

app.listen(3000, () => console.log("blog server running on port 3000!"));

function sessionIDGenerator() {
  return Math.random() + "" + +new Date();
}

function sessionCheck(session) {
  if (!!session) {
    return User.findOne({ sessionID: session }).then((user) => user);
  }
  return Promise.resolve(null);
}
