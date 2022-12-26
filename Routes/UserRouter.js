const userModel = require("../Models/UserModel");
const { Router, urlencoded } = require("express");
const userRouter = Router();
const { generateJWTCookie } = require("./AuthenticationRoute");
const { UploadPhoto, upload } = require("../Constants");

// route api/profile
userRouter.get("/", async (req, res) => {
  const emailId = req.emailId;
  const user = await userModel
    .findOne(
      { emailId },
      {
        _id: false,
        password: false,
        subscription: false,
        redeemedAmount: false,
        totalRevenue: false,
        currentRevenue: false,
        urlsCount: false,
        __v: false,
      }
    )
    .lean();
  if (user) {
    res.json(user);
  } else {
    res.status(400).json({ msg: "no user found" });
  }
});

userRouter.put(
  "/",
  urlencoded({ extended: true }),
  upload.single("profilePicture"),
  async (req, res) => {
    const emailId = req.emailId;
    const user = await userModel.findOne({ emailId });
    if (req.file) {
      try {
        user.profilePicture = await UploadPhoto(req.file);
        user.save();
        res.json({ msg: "updated sucesfully" });
      } catch (e) {
        res.status(400).json({ errmsg: "cannot upload image right now" });
      }
      return;
    }
    Object.assign(user, req.body);
    try {
      await user.validate();
      await user.save();
      if (req.body.emailId) {
        generateJWTCookie(res, req.body.emailId, user.subscription);
      }
      res.json({ msg: "updated sucesfully" });
    } catch (e) {
      res.status(400).send("email already exists");
    }
  }
);

userRouter.get("/info", async (req, res) => {
  const emailId = req.emailId;
  const user = await userModel
    .findOne(
      { emailId },
      {
        _id: false,
        password: false,
        emailId: false,
        phoneNumber: false,
        redeemedAmount: false,
        totalRevenue: false,
        urlsCount: false,
        __v: false,
      }
    )
    .lean();
  if (user) {
    res.json(user);
  } else {
    res.status(400).json({ msg: "no user found" });
  }
});

module.exports = userRouter;
