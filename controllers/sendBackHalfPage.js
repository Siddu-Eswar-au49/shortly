const urlModel = require("../Models/UrlModel");
const path = require("path");

async function sendBackHalfPage(req, res) {
  const { backHalf } = req.params;
  const url = await urlModel.findOne({ backHalf });
  let folderName = "pagenotfound",
    fileName = "pageNotFound.html";
  if (url && !url.isClosed) {
    folderName = "shortpage";
    fileName = "shorturl.html";
  }
  res.sendFile(path.join(__dirname, "..", "public", folderName, fileName));
}
module.exports = sendBackHalfPage;
