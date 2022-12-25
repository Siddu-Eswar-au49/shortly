const { FREE, PREMIUM, NONE } = require("../Enums/SubscriptionEnum");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    maxLength: 30,
    minLength: 5,
  },
  emailId: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  subscription: {
    type: String,
    enum: [FREE, NONE, PREMIUM],
    required: true,
    default: NONE, //TODO: convert free into none after adding upgrade route
  },
  redeemedAmount: {
    type: Number,
    required: true,
    default: 0,
  },
  totalRevenue: {
    type: Number,
    required: true,
    default: 0,
  },
  currentRevenue: {
    type: Number,
    required: true,
    default: 0,
  },
  urlsCount: {
    type: Number,
    required: true,
    default: 0,
  },
  paypalEmailId: String,
  expiryTime: Date,
  phoneNumber: String,
  profilePicture: String,
});

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
