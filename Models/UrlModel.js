const mongoose = require("mongoose");
const constants = require("../Constants");

const urlSchema = new mongoose.Schema(
  {
    fullUrl: {
      type: String,
      required: true,
    },
    backHalf: {
      type: String,
      required: true,
      unique: true,
    },
    dateOfCreation: {
      type: Number,
      required: true,
      default: Date.now,
    },
    createdDate: {
      type: String,
      required: true,
      default: new Date().toISOString(),
    },
    emailId: {
      type: String,
      required: true,
      ref: "users",
    },
    hits: {
      type: Number,
      required: true,
      default: 0,
    },
    isClosed: {
      type: Boolean,
      required: true,
      default: false,
    },
    title: {
      type: String,
    },
    scans: {
      type: Number,
      required: true,
      default: 0,
    },
    feedBack: {
      type: String,
    },
  },
  {
    virtuals: {
      shortUrl: {
        get() {
          return `${constants.DOMAIN_NAME}/${this.backHalf}`;
        },
      },
      totalHits: {
        get() {
          return this.hits + this.scans;
        },
      },
    },
  }
);

const urlModel = mongoose.model("urls", urlSchema);
module.exports = urlModel;
