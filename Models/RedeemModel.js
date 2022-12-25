const mongoose = require("mongoose");

const redeemSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  redeemedTime: {
    type: Number,
    required: true,
    default: Date.now,
  },
  emailId: {
    type: String,
    required: true,
  },
  paypalEmailId: {
    type: String,
    required: true,
  },
});

const redeemModel = mongoose.model("redeems", redeemSchema);
module.exports = redeemModel;
