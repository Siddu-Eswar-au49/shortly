const { Router, urlencoded } = require("express");
const authRouter = Router();
const userModel = require("../Models/UserModel");
const jwt = require("jsonwebtoken");
const cookieKeys = require("../Enums/CookieKeys");
const SubscriptionEnum = require("../Enums/SubscriptionEnum");

authRouter.use(urlencoded({ extended: true }));

authRouter.post("/signup", async (req, res) => {
  req.body.password = encryptPassword(req.body.password);
  const model = new userModel(req.body);
  model
    .validate()
    .then(async () => {
      await model.save();
      generateJWTCookie(res, model.emailId, model.subscription);
      res.json({
        msg: "Signup successful",
        redirect: "/subscription",
      });
    })
    .catch((err) => {
      let errorMsg = "unexpected error";
      let statusCode = 500;
      if (err.code == 11000 && err.keyPattern.emailId) {
        statusCode = 401;
        errorMsg = "Email already exists";
      }
      res.status(statusCode).json({
        msg: "Error",
        errorMsg,
      });
    });
});

authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  const user = await userModel.findOne({ emailId });
  let statusCode = 200;
  let msg = "";
  let errormsg = "";
  let redirect = "";
  if (user) {
    if (checkPassword(user.password, password)) {
      statusCode = 200;
      msg = "login sucessful";
      if (user.subscription == SubscriptionEnum.NONE) {
        redirect = "/subscription";
      } else {
        redirect = "/dashboard";
      }
    } else {
      statusCode = 400;
      msg = "error";
      errormsg = "incorrect password";
    }
  } else {
    statusCode = 400;
    msg = "error";
    errormsg = "email not registered";
  }

  if (statusCode == 200) {
    generateJWTCookie(res, emailId, user.subscription);
    res.json({ msg, redirect });
  } else {
    res.status(statusCode).json({
      msg,
      errormsg,
    });
  }
});

authRouter.put("/logout", (req, res) => {
  res.clearCookie(cookieKeys.JWT);
  res.json({
    msg: "user logged out",
    redirect: "/login",
  });
});

function generateJWTCookie(res, emailId, subscription) {
  const token = jwt.sign({ emailId, subscription }, process.env.JWT_SECRET);
  res.cookie(cookieKeys.JWT, token);
}

function checkPassword(source, copy) {
  return source === copy;
}

function encryptPassword(source) {
  return source;
}

authRouter.generateJWTCookie = generateJWTCookie;

module.exports = authRouter;
