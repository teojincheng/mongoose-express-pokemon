const express = require("express");
const router = express.Router();
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const Trainer = require("../models/trainer.model");
const { protectRoute } = require("../middlewares/auth");

router.post("/", async (req, res, next) => {
  try {
    const trainer = new Trainer(req.body);
    await Trainer.init();
    const newTrainer = await trainer.save();
    res.status(201).send(newTrainer);
  } catch (err) {
    next(err);
  }
});

const createJWTToken = username => {
  const payload = { name: username };
  //console.log("secret key is" + process.env.JWT_SECRET_KEY);
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
  return token;
};

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const trainer = await Trainer.findOne({ username });
    const result = await bcrypt.compare(password, trainer.password);

    if (!result) {
      throw new Error("Login failed");
    }

    const token = createJWTToken(username);

    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = oneDay * 7;
    const expiryDate = new Date(Date.now() + oneWeek);

    res.cookie("token", token, {
      expires: expiryDate,
      httpOnly: true
    });

    res.status(200).send("You are now logged in!");
  } catch (err) {
    if (err.message === "Login failed") {
      err.statusCode = 400;
    }
    next(err);
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token").send("You are now logged out!");
});

router.get("/:username", protectRoute, async (req, res, next) => {
  const INCORRECT_USER_ERR_MG = "incorrect trainer";
  try {
    const username = req.params.username;
    if (req.user.name !== username) {
      throw new Error(INCORRECT_USER_ERR_MG);
    }
    const trainers = await Trainer.find({ username });
    res.send(trainers);
  } catch (err) {
    if (err.message === INCORRECT_USER_ERR_MG) {
      err.statusCode = 403;
    }
    next(err);
  }
});

module.exports = router;
