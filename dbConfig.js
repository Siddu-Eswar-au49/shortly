const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

async function config() {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: process.env.DB_NAME,
    });
    console.log("Connected to DB Successfully");
  } catch (err) {
    console.log("Error connecting to Data Base");
    process.exit();
  }
}

module.exports = {
  config,
};
