const jwt = require("jsonwebtoken");
const cookieKeys = require("../Enums/CookieKeys");
const SubscriptionEnum = require("../Enums/SubscriptionEnum");
const {isInternalRoute} = require("../Constants");

function authenticationMiddleware(req, res, next) {
  const token = req.cookies[cookieKeys.JWT];
  const internalRoute = isInternalRoute(req.path);
  if (token) {
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.emailId = decode.emailId;
      req.subscription = decode.subscription;
      next();
      return;
    } catch (e) {
      if (!internalRoute) {
        next();
        return;
      }
      if (e.name === "JsonWebTokenError") {
        res.status(400).json({
          msg: "error",
          errormsg: "invalid signature",
          redirect: "/login",
        });
      } else {
        res.status(500).json({
          msg: "error",
          errormsg: "system error",
        });
      }
      return;
    }
  } else {
    if (internalRoute) {
      if (req.url == "/login" || req.url == "/signup") {
        next();
      } else {
        res.status(400).json({
          msg: "error",
          errormsg: "not authenticated",
          redirect: "/login",
        });
      }
    } else {
      next();
    }
  }
}

module.exports = { authenticationMiddleware };
