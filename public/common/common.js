const nameEle = document.querySelector("#name");
const profileImageEle = document.querySelector("#avatar img");
const firstLetterEle = document.querySelector("#first-character");
const revenueEle = document.querySelector("#revenue");
const upgradeBtn = document.querySelector("#upgrade");

document.title = "Shortly";

const monthToText = {
  "01": "JAN",
  "02": "FEB",
  "03": "MAR",
  "04": "APR",
  "05": "MAY",
  "06": "JUN",
  "07": "JUL",
  "08": "AUG",
  "09": "SEP",
  10: "OCT",
  11: "NOV",
  12: "DEC",
};

function setUserInfo(userInfo) {
  const { fullName, subscription, currentRevenue, profilePicture } = userInfo;
  nameEle.innerHTML = fullName;
  if (revenueEle) revenueEle.innerHTML = currentRevenue;
  if (profilePicture) {
    profileImageEle.src = profilePicture;
    unHide(profileImageEle);
    hide(firstLetterEle);
  } else {
    hide(profileImageEle);
    firstLetterEle.innerHTML = fullName[0];
    unHide(firstLetterEle);
  }

  if (
    location.pathname != "/subscription/" &&
    location.pathname != "/payment/upgrade"
  ) {
    if (subscription == "none") {
      console.log("replace subscription");
      console.log(location.pathname);
      location.replace("/subscription");
    } else if (subscription == "free") {
      if (upgradeBtn) {
        unHide(upgradeBtn);
      }
    } else {
      if (upgradeBtn) {
        hide(upgradeBtn);
      }
    }
  }
}
let userInfo;
async function setup() {
  const userInfoRes = await fetch("/api/profile/info");
  userInfo = await userInfoRes.json();
  if (userInfoRes.status == 200) {
    setUserInfo(userInfo);
  } else {
    if (userInfo.redirect) {
      if (location.pathname != "/payment/upgrade/") {
        location.replace(userInfo.redirect);
      }
    }
  }
}
function hide(element) {
  element.classList.add("hide");
}
function unHide(element) {
  element.classList.remove("hide");
}

function isFreeUser() {
  return userInfo.subscription == "free";
}

function shortDate(fullDate) {
  const year = fullDate.slice(0, 4);
  const month = fullDate.slice(5, 7);
  const date = fullDate.slice(8, 10);
  return `${date} ${monthToText[month]} ${year}`;
}

function showErrorMsg(element, errorMsg) {
  element.innerText = errorMsg;
  unHide(element);
}

function hideErrorMsg(element) {
  hide(element);
}

export {
  setup,
  hide,
  unHide,
  isFreeUser,
  shortDate,
  showErrorMsg,
  hideErrorMsg,
};
