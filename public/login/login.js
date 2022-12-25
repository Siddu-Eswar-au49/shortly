import { showErrorMsg, hideErrorMsg } from "../common/common.js";

const emailEle = document.querySelector("#email");
const emailErrorEle = document.querySelector("#email+.input-error");
const passwordBox = document.querySelector("#password-box");
const passwordErrorBox = document.querySelector("#password-box+.input-error");
const showEle = document.querySelector("#show");
const showText = showEle.querySelector("span");
const formEle = document.querySelector("form");

emailEle.focus();

function validateForm() {
  hideErrorMsg(emailErrorEle);
  hideErrorMsg(passwordErrorBox);
  return true;
}

formEle.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!validateForm()) return;
  const response = await fetch("/login", {
    method: "post",
    body: new URLSearchParams(new FormData(formEle)),
  });
  const data = await response.json();
  if (response.status == 200) {
    location.replace(data.redirect);
  } else if (response.status == 400) {
    if (data.errormsg.includes("email")) {
      showErrorMsg(emailErrorEle, data.errormsg);
    } else {
      showErrorMsg(passwordErrorBox, data.errormsg);
    }
  }
});

document.querySelector("nav p").addEventListener("click", () => {
  location.replace("/");
});

async function runDefault() {
  const res = await fetch("/api/profile/info");
  if (res.status == 200) {
    location.replace("/dashboard");
  }
}
runDefault();

showEle.addEventListener("click", () => {
  if (passwordBox.type == "password") {
    passwordBox.type = "text";
    showText.innerText = "Hide";
  } else {
    passwordBox.type = "password";
    showText.innerText = "Show";
  }
});
