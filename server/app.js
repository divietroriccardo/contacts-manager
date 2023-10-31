const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const User = require("./model/user");
const Contact = require("./model/contact");

const url = "mongodb://0.0.0.0:27017/ContactsDB";

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

    if (username || email || phoneNumber) {
      if (username) {
        return res.status(200).json({
          status: "success",
          data: "Username already exist",
        });
      } else if (email) {
        return res.status(200).json({
          status: "success",
          data: "Email already exist",
        });
      } else {
        return res.status(200).json({
          status: "success",
          data: "Phone number already exist",
        });
      }
    } else {
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        password: req.body.password,
      });

      bcrypt.genSalt(saltRounds).then(() => {
        bcrypt
          .hash(newUser.password, saltRounds)
          .then((hashedPassword) => {
            newUser.password = hashedPassword;
            return newUser.save();
          })
          .then(() => res.send())
          .catch((error) => {
            console.log("Error saving user: ");
            console.log(error);
          });
      });

      return res.status(200).json({
        status: "success",
        data: newUser,
      });
    }
  } catch {
    return res.status(400).json({
      status: "fail",
      data: "Signup error",
    });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    await mongoose.connect(url);

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
      User.findOne({ username: req.body.user })
        .then((user) => bcrypt.compare(req.body.password, user.password))
        .then((samePassword) =>
          !samePassword
            ? res.status(401).json({
                status: "fail",
                data: "Login error",
              })
            : res.status(200).json({
                status: "success",
                data: "Login",
              })
        )
        .catch((error) => {
          res.status(401).json({
            status: "fail",
            data: "Login error",
          });

          console.log("Error authenticating user: ");
          console.log(error);
        });
    } else if (email) {
      User.findOne({ email: req.body.user })
        .then((user) => bcrypt.compare(req.body.password, user.password))
        .then((samePassword) =>
          !samePassword
            ? res.status(401).json({
                status: "fail",
                data: "Login error",
              })
            : res.status(200).json({
                status: "success",
                data: "Login",
              })
        )
        .catch((error) => {
          res.status(401).json({
            status: "fail",
            data: "Login error",
          });

          console.log("Error authenticating user: ");
          console.log(error);
        });
    } else if (phoneNumber) {
      User.findOne({ phoneNumber: req.body.user })
        .then((user) => bcrypt.compare(req.body.password, user.password))
        .then((samePassword) =>
          !samePassword
            ? res.status(401).json({
                status: "fail",
                data: "Login error",
              })
            : res.status(200).json({
                status: "success",
                data: "Login",
              })
        )
        .catch((error) => {
          res.status(401).json({
            status: "fail",
            data: "Login error",
          });

          console.log("Error authenticating user: ");
          console.log(error);
        });
    } else {
      return res.status(401).json({
        status: "fail",
        data: "Login error",
      });
    }
  } catch {
    return res.status(400).json({
      status: "fail",
      data: "Server error",
    });
  }
});

app.get("/api/contacts", async (req, res) => {
  try {
    await mongoose.connect(url);

    const contacts = await Contact.find({});

    return res.status(200).json({
      status: "success",
      data: contacts,
    });
  } catch (err) {
    return res.status(400).json({
      status: "fail",
      data: [],
      error: err.message,
    });
  }
});

app.get("/api/details/:id", async (req, res) => {
  try {
    await mongoose.connect(url);

    const contact = await Contact.findById(req.params.id);

    return res.status(200).json({
      status: "success",
      data: contact,
    });
  } catch (err) {
    return res.status(400).json({
      status: "fail",
      data: [],
    });
  }
});

app.post("/api/add", async (req, res) => {
  try {
    await mongoose.connect(url);

    Contact.findOne({ phoneNumber: req.body.phoneNumber }).then((contact) => {
      if (contact) {
        return res.status(200).json({
          status: "success",
          data: "Phone number already exist",
        });
      } else {
        const newContact = new Contact({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phoneNumber: req.body.phoneNumber,
          email: req.body.email,
          addressCity: req.body.addressCity,
          addressStreet: req.body.addressStreet,
          isFavorite: req.body.isFavorite,
        });

        newContact.save();
        return res.status(200).json({
          status: "success",
          data: newContact,
        });
      }
    });
  } catch {
    return res.status(400).json({
      status: "fail",
      data: "Insert error",
      error: err.message,
    });
  }
});

app.post("/api/edit/:id", async (req, res) => {
  try {
    await mongoose.connect(url);

    const filter = { _id: req.params.id };
    const update = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      addressCity: req.body.addressCity,
      addressStreet: req.body.addressStreet,
      isFavorite: req.body.isFavorite,
    };

    const updatedContact = await Contact.findOneAndUpdate(filter, update, {
      new: true,
    });

    return res.status(200).json({
      status: "success",
      data: updatedContact,
    });
  } catch {
    return res.status(400).json({
      status: "fail",
      data: "Update error",
    });
  }
});

app.post("/api/favorite/:id", async (req, res) => {
  try {
    await mongoose.connect(url);

    const filter = { _id: req.params.id };
    const update = { isFavorite: req.body.isFavorite };

    const updatedFavoriteContact = await Contact.findOneAndUpdate(
      filter,
      update,
      { upsert: true }
    );

    return res.status(200).json({
      status: "success",
      data: updatedFavoriteContact,
    });
  } catch {
    return res.status(400).json({
      status: "fail",
      data: "Update favorite error",
    });
  }
});

app.delete("/api/delete/:id", async (req, res) => {
  try {
    await mongoose.connect(url);

    const deleted = await Contact.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      status: "success",
      data: deleted,
    });
  } catch (err) {
    return res.status(400).json({
      status: "fail",
      data: "Delete error",
      error: err.message,
    });
  }
});

app.listen(3000, () => console.log("blog server running on port 3000!"));
