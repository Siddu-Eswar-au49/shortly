DOMAIN_NAME = "http://localhost:8000";
EXPIRY_TIME_MILLI_SECONDS = 30 * 24 * 60 * 60 * 1000;
const path = require("path");
const sendHtmlFile =
  (...paths) =>
  (_, res) =>
    res.sendFile(path.join(__dirname, "public", ...paths));

const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { Base64 } = require("js-base64");

const upload = multer({
  storage: multer.memoryStorage(),
});

async function UploadPhoto(fileData) {
  try {
    const Base64Data = Base64.encode(fileData.buffer);
    const response = await cloudinary.uploader.upload(
      `data:${fileData.mimetype};base64,${Base64Data}`
    );
    if (response) {
      return response.secure_url;
    }
  } catch (e) {}
  return "";
}

async function config() {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true,
  });
}

function isInternalRoute(route) {
  const paths = [
    "/api/profile/info",
    "/login",
    "/url",
    "/signup",
    "/payment/free",
    "payment/upgrade",
    "api/profile",
    "/logout",
    "/api/redeem",
  ];
  for (let path of paths) {
    if (path == route) return true;
  }
  if (route.slice(0, 5) == "/url/") return true;
  return false;
}

module.exports = {
  DOMAIN_NAME,
  EXPIRY_TIME_MILLI_SECONDS,
  sendHtmlFile,
  UploadPhoto,
  config,
  upload,
  isInternalRoute,
};
