const { Router, urlencoded } = require("express");
const urlRouter = Router();
const urlModel = require("../Models/UrlModel");
const SubscriptionEnum = require("../Enums/SubscriptionEnum");
const { isInternalRoute } = require("../Constants");

urlRouter.use(urlencoded({ extended: true }));

urlRouter.post("/", async (req, res) => {
  const url = new urlModel(req.body);
  url.emailId = req.emailId;
  const internalRoute = isInternalRoute("/" + req.body.backHalf);
  if (internalRoute) {
    res.status(400).json({ errmsg: "select different back half" });
    return;
  }
  try {
    await url.validate();
    await url.save();
    res.json({ msg: "validate true" });
  } catch (e) {
    if (e.code === 11000 && e.keyPattern.backHalf) {
      res.status(400).json({ errmsg: "select different back half" });
    } else {
      const path = Object.keys(e.errors)[0];
      if (path) {
        res.status(400).json({ errmsg: e.errors[path].properties.message });
      } else {
        res.status(500).json({ errmsg: "system error" });
      }
    }
  }
});

urlRouter.get("/", async (req, res) => {
  let { page, size, search } = req.query;
  page = Number(page || 1);
  size = Number(size || 10);
  const pipeline = [
    {
      $match: {
        emailId: req.emailId,
      },
    },
    {
      $sort: {
        dateOfCreation: -1,
      },
    },
    {
      $project: {
        _id: false,
        __v: false,
        emailId: false,
        qrcode: false,
      },
    },
  ];
  if (search) {
    let urls = await urlModel.aggregate(pipeline);

    const filteredUrls = urls.filter(
      ({ title, backHalf, fullUrl }) =>
        title & title.includes(search) ||
        backHalf.includes(search) ||
        fullUrl.includes(search)
    );
    const startIndex = (page - 1) * size;
    const endIndex = page * size;
    res.json({
      urls: filteredUrls.slice(startIndex, endIndex),
      next: endIndex < filteredUrls.length,
      prev: page != 1,
    });
    return;
  }

  pipeline.splice(
    2,
    0,
    {
      $skip: (page - 1) * size,
    },
    {
      $limit: size,
    }
  );
  urls = await urlModel.aggregate(pipeline);

  const nextUrl = await urlModel
    .findOne({ emailId: req.emailId })
    .lean()
    .skip(page * size);
  res.json({ urls, next: nextUrl ? true : false, prev: page != 1 });
});

urlRouter.get("/:backHalf", async (req, res) => {
  const { backHalf } = req.params;
  const url = await urlModel.findOne({ backHalf }, { _id: false, __v: false });
  if (url) {
    if (url.emailId === req.emailId) {
      res.json(url);
    } else {
      res.status(404).json({
        errmsg: "page not found",
      });
    }
  } else {
    res.status(404).json({
      errmsg: "page not found",
    });
  }
});

urlRouter.put("/:backHalf/open", async (req, res) => {
  const { backHalf } = req.params;
  const url = await urlModel.findOne({ backHalf });
  if (!url && url.emailId != req.emailId) {
    res.status(404).json({
      errmsg: "invalid backhalf",
    });
    return;
  }
  if (req.subscription === SubscriptionEnum.PREMIUM) {
    url.isClosed = false;
    await url.save();
    res.json({
      msg: "url re opened",
    });
  } else {
    res.status(400).json({
      msg: "error",
      errormsg: "user is not a premium subscriber",
    });
  }
});

urlRouter.put("/:backHalf/close", async (req, res) => {
  const { backHalf } = req.params;
  const url = await urlModel.findOne({ backHalf });
  if (!url && url.emailId != req.emailId) {
    res.status(404).json({
      errmsg: "page not found",
    });
    return;
  }
  url.isClosed = true;
  await url.save();
  res.json({
    msg: "url closed",
  });
});

module.exports = urlRouter;
