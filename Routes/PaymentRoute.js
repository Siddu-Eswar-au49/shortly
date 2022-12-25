const { Router, urlencoded } = require("express");
const paymentRoute = Router();
const userModel = require("../Models/UserModel");
const redeemModel = require("../Models/RedeemModel");
const SubscriptionEnum = require("../Enums/SubscriptionEnum");
const constants = require("../Constants");
const { generateJWTCookie } = require("./AuthenticationRoute");

paymentRoute.post("/upgrade", async (req, res) => {
  const user = await userModel.findOne({ emailId: req.emailId });
  user.subscription = SubscriptionEnum.PREMIUM;
  user.expiryTime = Date.now() + constants.EXPIRY_TIME_MILLI_SECONDS;
  generateJWTCookie(res, req.emailId, SubscriptionEnum.PREMIUM);
  await user.save();
  res.json({
    msg: "Thankyou for taking premium subscription",
    redirect: "/dashboard",
  });
});

paymentRoute.put(
  "/checkout",
  urlencoded({ extended: false }),
  async (req, res) => {
    const user = await userModel.findOne({ emailId: req.emailId });
    const amount = Number(req.body.amount);
    const paypalEmailId = req.body.paypalEmailId;
    console.log("paypalemail", paypalEmailId);
    if (amount <= user.currentRevenue) {
      user.currentRevenue -= amount;
      user.currentRevenue = Number(user.currentRevenue.toFixed(3));
      user.redeemedAmount += amount;
      user.redeemedAmount = Number(user.redeemedAmount.toFixed(3));
      await redeemModel.create({ emailId: req.emailId, amount, paypalEmailId });
      await user.save();
      res.json({ msg: "redeemed successful" });
      return;
    }
    res.status(400).json({ errmsg: "amount is greater than revenue" });
  }
);

paymentRoute.put("/free", async (req, res) => {
  const user = await userModel.findOne({ emailId: req.emailId });
  user.subscription = SubscriptionEnum.FREE;
  generateJWTCookie(res, req.emailId, SubscriptionEnum.FREE);
  await user.save();
  res.json({ msg: "Thankyou for taking free", redirect: "/dashboard" });
});

paymentRoute.get("/upgrade", (req, res) => {
  constants.sendHtmlFile(res, "payment", "Upgrade.html");
});

module.exports = paymentRoute;
