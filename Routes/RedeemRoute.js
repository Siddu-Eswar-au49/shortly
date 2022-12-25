const { Router, urlencoded } = require("express");
const SubscriptionEnum = require("../Enums/SubscriptionEnum");
const redeemRouter = Router();
const redeemModel = require("../Models/RedeemModel");
const userModel = require("../Models/UserModel");

redeemRouter.get("/", async (req, res) => {
  const user = await userModel.findOne({ emailId: req.emailId });
  const data = {};
  data.currentRevenue = user.currentRevenue;
  data.totalRevenue = user.totalRevenue;
  data.paypalEmailId = user.paypalEmailId;
  data.redeemedAmount = user.redeemedAmount;
  data.redeemThreshold =
    user.subscription === SubscriptionEnum.FREE ? 1000 : 500;
  data.canRedeem = data.currentRevenue >= data.redeemThreshold;
  data.history = (
    await redeemModel.aggregate([
      {
        $match: {
          emailId: req.emailId,
        },
      },
      {
        $project: {
          _id: false,
          __v: false,
          emailId: false,
        },
      },
    ])
  ).reverse();
  res.json(data);
});

redeemRouter.put("/", urlencoded({ extended: false }), async (req, res) => {
  const { paypalEmailId } = req.body;
  await userModel.findOneAndUpdate({ emailId: req.emailId }, { paypalEmailId });
  res.json({
    msg: "updated paypal email",
  });
});

module.exports = redeemRouter;
