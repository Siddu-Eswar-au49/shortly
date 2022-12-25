import {
  setup,
  hide,
  unHide,
  isFreeUser,
  shortDate,
} from "../common/common.js";
setup();
let globalBackHalf;
const listEle = document.querySelector("#list");
const createFirstLink = document.querySelector("#no-results");
const detailEle = document.querySelector("#details");
const pageNavigationEle = document.querySelector(".page-navigation");
const qrcodeUpgradeEle = document.querySelector("#upgrade-qrcode");
const BaseURL = location.host;

document.querySelector("#copy").addEventListener("click", (e) => {
  navigator.clipboard.writeText(detailsShortUrl.innerText);
});

const searchInput = document.querySelector("#search-box");
const searchButton = document.querySelector("#search");
searchButton.addEventListener("click", () => {
  getUrls();
});

function updateList(list) {
  if (list.length == 0) {
    unHide(createFirstLink);
    hide(listEle);
    hide(detailEle);
    hide(pageNavigationEle);
    return;
  }
  hide(createFirstLink);
  unHide(detailEle);
  unHide(pageNavigationEle);
  listEle.innerHTML = "";
  unHide(listEle);
  for (let urlData of list) {
    listEle.append(createTile(urlData));
  }
}

function createDiv(className, ...children) {
  const divEle = document.createElement("div");
  divEle.className = className;
  divEle.append(...children);
  return divEle;
}

function createTextPara(text, className) {
  const pEle = document.createElement("p");
  pEle.className = className;
  pEle.innerText = text;
  return pEle;
}

function createTile(data) {
  const fullDate = data.createdDate;
  const shortURL = `${BaseURL}/${data.backHalf}`;
  const totalHits = data.hits + data.scans;
  const title = data.title || shortURL;
  const tileEle = createDiv(
    "url-tile",
    createTextPara(shortDate(fullDate), "time"),
    createTextPara(title, "title"),
    createDiv(
      "bottom",
      createTextPara(
        shortURL.length > 37 ? shortURL.slice(0, 37) + "..." : shortURL,
        "shorturl"
      ),
      createHitsBlock(totalHits)
    )
  );
  tileEle.selected = (_backHalf) => {
    if (_backHalf == data.backHalf) {
      tileEle.classList.add("active");
    } else {
      tileEle.classList.remove("active");
    }
  };
  tileEle.filter = (name) => {
    if (
      data.backHalf.toLowerCase().includes(name) ||
      data.fullUrl.toLowerCase().includes(name) ||
      (data.title && data.title.toLowerCase().includes(name))
    ) {
      unHide(tileEle);
    } else {
      hide(tileEle);
    }
  };
  tileEle.addEventListener("click", (e) => {
    showDetails(data.backHalf);
  });
  return tileEle;
}

const fulltimeEle = document.querySelector("#full-time");
const ulrTitleEle = document.querySelector("#url-title");
const totalHitsDetail = document.querySelector("#details-hits");
const detailsShortUrl = document.querySelector("#details-url");
const clicksEle = document.querySelector("#details-clicks");
const fullUrlEle = document.querySelector("#details-full-url");
const qrcodeBlock = document.querySelector("#qrcode");
const qrcodeImg = document.querySelector("#qrcode img");
const downloadButton = document.querySelector("#download");
const scansEle = document.querySelector("#details-scan");
const baseQrImageURL =
  "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=";
const baseQrDownloadImageURL =
  "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=";
let qrCodeImageUrl = "";
let qrCodeImageDownloadURL = "";

const activeInputEle = document.querySelector("#active-input");
const activeTextEle = document.querySelector("#active-text");
const confirmationBlock = document.querySelector(".confirmation");
const noBtn = document.querySelector("#no");
const yesBtn = document.querySelector("#yes");
const upgradeActiveText = document.querySelector(".upgrade-active");

activeInputEle.addEventListener("click", () => {
  if (isFreeUser()) {
    unHide(confirmationBlock);
  } else {
    updateActiveStatus();
  }
});

async function updateActiveStatus(status) {
  if (status == undefined) {
    status = activeInputEle.checked;
    await fetch(`/url/${globalBackHalf}/${status ? "open" : "close"}`, {
      method: "put",
    });
  } else {
    activeInputEle.checked = status;
  }

  activeTextEle.innerText = status ? "Active" : "Disabled";
  upgradeActiveText.style.setProperty("display", "none");
  if (isFreeUser()) {
    if (status) {
      activeInputEle.disabled = false;
    } else {
      activeInputEle.disabled = true;
      upgradeActiveText.style.setProperty("display", "flex");
    }
  } else {
    activeInputEle.disabled = false;
  }
}

yesBtn.addEventListener("click", async () => {
  hide(confirmationBlock);
  activeInputEle.checked = false;
  updateActiveStatus();
});

noBtn.addEventListener("click", () => {
  hide(confirmationBlock);
  activeInputEle.checked = true;
  updateActiveStatus();
});

downloadButton.addEventListener("click", async () => {
  let url = qrCodeImageDownloadURL;
  const response = await fetch(url);
  const blob = await response.blob();
  let blobUrl = URL.createObjectURL(blob);
  let a = document.createElement("a");
  let fileName = url.replace(/^.*[\\\/]/, "");
  fileName = fileName.slice(0, fileName.length - 5);
  a.download = fileName;
  a.href = blobUrl;
  document.body.appendChild(a);
  a.click();
  a.remove();
});

async function showDetails(backHalf) {
  const elements = listEle.querySelectorAll(".url-tile");
  elements.forEach((element) => {
    element.selected(backHalf);
  });
  const urlRes = await fetch(`/url/${backHalf}`);
  const urlData = await urlRes.json();
  updateActiveStatus(!urlData.isClosed);
  globalBackHalf = backHalf;
  const shortURL = `${BaseURL}/${backHalf}`;
  const totalHits = urlData.hits + urlData.scans;
  const title = urlData.title || shortURL;
  const fullrurl =
    urlData.fullUrl.length > 73
      ? `${urlData.fullUrl.slice(0, 72 - 3)}...`
      : urlData.fullUrl;

  fulltimeEle.innerHTML = urlData.createdDate;
  ulrTitleEle.innerText = title;
  totalHitsDetail.innerText = totalHits;
  detailsShortUrl.innerText = shortURL;
  detailsShortUrl.href = `http://${shortURL}`;
  clicksEle.innerText = urlData.hits;
  fullUrlEle.innerText = fullrurl;

  fullUrlEle.href = urlData.fullUrl;
  if (isFreeUser()) {
    hide(qrcodeBlock);
    unHide(qrcodeUpgradeEle);
  } else {
    hide(qrcodeUpgradeEle);
    unHide(qrcodeBlock);
    qrCodeImageUrl = `${baseQrImageURL}${shortURL}?r=qr`;
    qrCodeImageDownloadURL = `${baseQrDownloadImageURL}${shortURL}?r=qr`;
    qrcodeImg.src = qrCodeImageUrl;
    scansEle.innerText = urlData.scans;
  }
}

function createHitsBlock(hits) {
  const p = document.createElement("p");
  p.className = "hits-block";

  const span = document.createElement("span");
  span.className = "hits";
  span.innerText = hits;

  const i = document.createElement("i");
  i.className = "fa-solid fa-chart-column";

  p.append(span, i);
  return p;
}
const leftArrowEle = document.querySelector("#left");
const rightArrowEle = document.querySelector("#right");
const pageNoEle = document.querySelector("#page-no");

leftArrowEle.addEventListener("click", ({ target }) => {
  if (target.classList.contains("arrow-disable")) return;
  pageNoEle.innerText = Number(pageNoEle.innerText) - 1;
  getUrls();
});

rightArrowEle.addEventListener("click", ({ target }) => {
  if (target.classList.contains("arrow-disable")) return;
  pageNoEle.innerText = Number(pageNoEle.innerText) + 1;
  getUrls();
});
const size = 10;
async function getUrls() {
  const page = Number(pageNoEle.innerText);
  const search = searchInput.value;
  const urlsres = await fetch(
    `/url?page=${page}&size=${size}&search=${search}`
  );
  const { urls, next, prev } = await urlsres.json();

  rightArrowEle.classList.toggle("arrow-disable", !next);
  leftArrowEle.classList.toggle("arrow-disable", !prev);

  updateList(urls);
  if (urls.length > 0) {
    showDetails(urls[0].backHalf);
  }
}
getUrls();
