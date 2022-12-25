const mongoose = require("mongoose");
const adminRolesEnum = require("../Enums/AdminRolesEnum");

const adminUsersSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    enum: [adminRolesEnum.ADMIN, adminRolesEnum.TESTER],
    default: adminRolesEnum.ADMIN,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
    default: "admin",
  },
  password: {
    type: String,
    required: true,
    default: "admin",
  },
});
const adminModel = mongoose.model("adminusers", adminUsersSchema);
module.exports = adminModel;
