require("dotenv").config();
const express = require("express");
const app = express();
const authRouter = require("./Routes/AuthenticationRoute");
const urlRouter = require("./Routes/UrlRoute");
const userRouter = require("./Routes/UserRouter");
const paymentRouter = require("./Routes/PaymentRoute");
const redeemRouter = require("./Routes/RedeemRoute");
const adminRouter = require("./Routes/AdminRoute");
const { authenticationMiddleware } = require("./MiddleWares/Authentication");
const sendShortUrlPage = require("./controllers/sendBackHalfPage");
const { sendHtmlFile } = require("./Constants");
const getBackHalfController = require("./controllers/getBackHalfController");
const cookieParser = require("cookie-parser");
require("./dbConfig")
  .config()
  .then(() => {
    require("./Constants")
      .config()
      .then(() => {
        const listener = app.listen(process.env.PORT || 8000, () => {
          console.log(`server started on port ${listener.address().port}`);
        });
      })
      .catch(() => {
        console.log("Cannot initialize Cloudinary");
      });
  });
app.use(express.static("public"));
app.use(cookieParser());
app.use("/admin", adminRouter);

app.get("/pages/terms", sendHtmlFile("pages", "terms.html"));
app.get("/pages/privacy", sendHtmlFile("pages", "privacy.html"));
app.get("/redeem", sendHtmlFile("payment", "checkout.html"));
app.get("/dashboard", sendHtmlFile("dashboard", "Dashboard.html"));
app.get("/subscription", sendHtmlFile("subscription", "Subscription.html"));
app.get("/payment/upgrade", sendHtmlFile("payment", "Upgrade.html"));
app.get("/profile", sendHtmlFile("profile", "Profile.html"));
app.get("/create", sendHtmlFile("create", "Create.html"));
app.get("/logout", sendHtmlFile("logout", "logout.html"));
app.get("/", sendHtmlFile("home", "Home.html"));
app.get("/signup", sendHtmlFile("signup", "Signup.html"));
app.get("/login", sendHtmlFile("login", "login.html"));
app.get("/nopage", sendHtmlFile("pagenotfound", "pageNotFound.html"));
app.use(authenticationMiddleware);
app.use("/url", urlRouter);
app.use("/api/profile", userRouter);
app.use("/payment", paymentRouter);
app.use("/api/redeem", redeemRouter);
app.get("/:backHalf", sendShortUrlPage);
app.get("/api/:backHalf", getBackHalfController);
app.use("/", authRouter);
