import {
  hide,
  setup,
  unHide,
  showErrorMsg,
  hideErrorMsg,
} from "../common/common.js";
setup();

const minRedeemEle = document.querySelector("#min-redeem");
const amountEle = document.querySelector("#amount");
const amountErrorEle = document.querySelector("#amount+.input-error");
const redeemWarningEle = document.querySelector("#redeem-Warning");

const editBtn = document.querySelector("#edit");
const updateBtn = document.querySelector("#update");
const redeemBtn = document.querySelector("#redeem-button");

const payPalEle = document.querySelector("#paypal-email");
const currentAmountEle = document.querySelector("#current-amount");
const totalAmountEle = document.querySelector("#total-amount");
const redeemedAmountEle = document.querySelector("#redeemed-amount");

let minredeem = 1000;
async function runDefault() {
  const redeemRes = await fetch("/api/redeem");
  const {
    canRedeem,
    currentRevenue,
    totalRevenue,
    paypalEmailId,
    redeemedAmount,
    redeemThreshold,
  } = await redeemRes.json();
  minredeem = redeemThreshold;
  currentAmountEle.innerText = currentRevenue;
  totalAmountEle.innerText = totalRevenue;
  redeemedAmountEle.innerText = redeemedAmount;
  if (paypalEmailId) {
    payPalEle.value = paypalEmailId;
    changeUpdateBtnDisplay();
  } else {
    payPalEle.value = "";
    payPalEle.focus();
    changeEditBtnDisplay();
  }

  if (canRedeem) {
    hide(redeemWarningEle);
    amountEle.disabled = false;
    redeemBtn.disabled = false;
    redeemBtn.classList.remove("disabled");
  } else {
    unHide(redeemWarningEle);
    amountEle.disabled = true;
    redeemBtn.disabled = true;
    redeemBtn.classList.add("disabled");
    minRedeemEle.innerText = redeemThreshold;
  }
}

function changeUpdateBtnDisplay() {
  payPalEle.disabled = true;
  editBtn.disabled = false;
  editBtn.classList.remove("disabled");
  updateBtn.disabled = true;
  updateBtn.classList.add("disabled");
}

function changeEditBtnDisplay() {
  payPalEle.disabled = false;
  editBtn.disabled = true;
  editBtn.classList.add("disabled");
  updateBtn.disabled = false;
  updateBtn.classList.remove("disabled");
}
runDefault();

function validateForm() {
  hideErrorMsg(amountErrorEle);
  if (Number(amountEle.value) < minredeem) {
    showErrorMsg(amountErrorEle, `Amount Should be greater than ${minredeem}`);
    return false;
  }
  return true;
}

const formEle = document.querySelector("form");
formEle.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(formEle);
  if (e.submitter.id === "update") {
    formData.delete("amount");
    const emailUpdateRes = await fetch("/api/redeem", {
      method: "put",
      body: new URLSearchParams(formData),
    });
    if (emailUpdateRes.status == 200) {
      changeUpdateBtnDisplay();
    }
  } else if (e.submitter.id === "edit") {
    changeEditBtnDisplay();
  } else {
    if (!validateForm()) return;
    if (!formData.get("paypalEmailId")) {
      formData.set("paypalEmailId", payPalEle.value);
    }
    const redeemRes = await fetch("/payment/checkout", {
      method: "put",
      body: new URLSearchParams(formData),
    });
    location.reload();
  }
});
