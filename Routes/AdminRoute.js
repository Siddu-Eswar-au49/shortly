const { Router, urlencoded } = require("express");
const adminRouter = Router();
const adminModel = require("../Models/AdminUsersModel");
const jwt = require("jsonwebtoken");
const cookieKeys = require("../Enums/CookieKeys");

function generateAdminJWTCookie(res, userName, role) {
  const admintoken = jwt.sign({ userName, role }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });
  res.cookie(cookieKeys.ADMINJWT, admintoken);
}

adminRouter.post("/login", urlencoded({ extended: true }), async (req, res) => {
  const { userName, password } = req.body;
  const admin = await adminModel.findOne({ userName, password });
  if (admin) {
    generateAdminJWTCookie(res, admin.userName, admin.role);
    res.send("login successful");
  } else {
    res.status(400).send("invalid credentials");
  }
});

adminRouter.post(
  "/signup",
  urlencoded({ extended: true }),
  async (req, res) => {
    const admin = new adminModel(req.body);
    try {
      await admin.validate();
      await admin.save();
      res.json({
        msg: "sign up sucesfull",
        redirect: "admin/login",
      });
    } catch (e) {
      res.status(500).json({
        errmsg: "username already exists",
      });
    }
  }
);

adminRouter.post("/plans", urlencoded({ extended: true }), async (req, res) => {
  const freeplan = new SubscriptionModel();
  await freeplan.save();
  res.send("plan created");
});

module.exports = adminRouter;
