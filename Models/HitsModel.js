const mongoose = require("mongoose");
const hitEnum = require("../Enums/HitEnum");

const hitsSchema = new mongoose.Schema({
  backHalf: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: new Date().toISOString(),
  },
  typeofHit: {
    type: String,
    enum: [hitEnum.HIT, hitEnum.SCAN],
    required: true,
    default: hitEnum.HIT,
  },
});
module.exports = mongoose.model("hits", hitsSchema);
