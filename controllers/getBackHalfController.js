const userModel = require("../Models/UserModel");
const urlModel = require("../Models/UrlModel");
const hitModel = require("../Models/HitsModel");
const hitEnum = require("../Enums/HitEnum");
const SubscriptionEnum = require("../Enums/SubscriptionEnum");

async function getBackHalf(req, res) {
  const { backHalf } = req.params;
  const url = await urlModel.findOne({ backHalf });
  if (url == null) {
    res.status(404).json({
      errmsg: "page not found",
      redirect: "/nopage",
    });
    return;
  }
  const data = {};
  data.replace = url.fullUrl;
  data.wait = true;
  if (req.emailId) {
    if (req.admin) {
      data.wait = false;
    } else {
      data.wait = url.emailId != req.emailId;
    }
  }
  res.json(data);
  if (!data.wait) return;
  if (req.query.r == "qr") {
    url.scans++;
    hitModel.create({ backHalf, typeofHit: hitEnum.SCAN });
  } else {
    url.hits++;
    hitModel.create({ backHalf, typeofHit: hitEnum.HIT });
  }
  url.save();
  const user = await userModel.findOne({ emailId: url.emailId });
  // if(user.expiryTime < Date.now())
  user.currentRevenue = Number(
    (
      user.currentRevenue +
      (user.subscription === SubscriptionEnum.FREE ? 0.001 : 0.002)
    ).toFixed(3)
  );
  user.save();
}

module.exports = getBackHalf;
