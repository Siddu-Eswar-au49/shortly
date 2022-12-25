import { setup, hide, unHide } from "../common/common.js";
setup();
const expiryDateEle = document.querySelector("#expiry-date");

expiryDateEle.addEventListener("keyup", (e) => {
  let date = expiryDateEle.value.replaceAll("/", "");
  if (e.key === "Backspace" && date.length == 2) {
    expiryDateEle.value = date;
    return;
  }
  if (date.length > 1) {
    date = date.slice(0, 2) + "/" + date.slice(2);
  }
  expiryDateEle.value = date;
});
const NUMBERS = "1234567890";
const cardNumberEle = document.querySelector("#card-number");
cardNumberEle.addEventListener("keyup", (e) => {
  const input = cardNumberEle.value.replaceAll("-", "");
  let number = "";
  for (let i of input) {
    if (NUMBERS.includes(i)) {
      number += i;
    }
  }
  let newNumber = "";
  if (number.length > 0) {
    for (let i = 0; i < number.length / 4; i++) {
      newNumber += number.slice(i * 4, (i + 1) * 4);
      if ((i + 1) * 4 <= number.length) {
        newNumber += "-";
      }
    }
  }
  if (newNumber.length > 19) {
    newNumber = newNumber.slice(0, 19);
  }
  if (e.key === "Backspace" && newNumber.at(-1) == "-") {
    newNumber = newNumber.slice(0, newNumber.length - 1);
  }
  cardNumberEle.value = newNumber;
});

const formEle = document.querySelector("form");
const purchaseText = document.querySelector("#after-purchase");
const secondsEle = document.querySelector("#seconds");
formEle.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(formEle);
  const paymentres = await fetch("/payment/upgrade", {
    method: "post",
    body: new URLSearchParams(formData),
  });
  const paymentdata = await paymentres.json();
  unHide(purchaseText);
  hide(formEle);
  let seconds = 5;
  secondsEle.innerText = seconds;
  const interval = setInterval(() => {
    seconds--;
    secondsEle.innerText = seconds;
    if (seconds == 0) {
      clearInterval(interval);
      location.replace(paymentdata.redirect);
    }
  }, 1000);
});
