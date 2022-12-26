import { showErrorMsg, hideErrorMsg, hide, unHide } from "../common/common.js";
const formEle = document.querySelector("form");

const fullNameEle = document.querySelector("#name");
const fullNameErrorEle = document.querySelector("#name+.input-error");
const emailErrorEle = document.querySelector("#email+.input-error");
const passwordEle = document.querySelector("#password-box");
const passwordErrorEle = document.querySelector("#password-box+.input-error");
const phoneELe = document.querySelector("#phone");
const phoneErrorEle = document.querySelector("#phone+.input-error");
const loaderEle = document.querySelector("#loader");
const signupText = document.querySelector("#signup-text");

const lowerCase = "qwertyuiopasdfghjklzxcvbnm";
const upperCase = "QWERTYUIOPASDFGHJKLZXCVBNM";
const numbers = "1234567890";
const specialCharacters = "@!$%*?&_";

function checkPassword() {
  const password = passwordEle.value;
  if (password.length > 16 || password.length < 8) return false;
  let upper = false,
    lower = false,
    num = false,
    special = false;
  for (let i of passwordEle.value) {
    if (!upper) {
      upper = upperCase.includes(i);
    }
    if (!lower) {
      lower = lowerCase.includes(i);
    }
    if (!num) {
      num = numbers.includes(i);
    }
    if (!special) {
      special = specialCharacters.includes(i);
    }
    if (upper && lower && num && special) {
      return true;
    }
  }
  return upper && lower && num && special;
}

function validateForm() {
  hideErrorMsg(emailErrorEle);
  hideErrorMsg(fullNameErrorEle);
  hideErrorMsg(passwordErrorEle);
  if (fullNameEle.length > 30 || fullNameEle.length < 5) {
    showErrorMsg(fullNameErrorEle, "name should be between 5-30 characters");
    return false;
  }
  if (!checkPassword()) {
    showErrorMsg(
      passwordErrorEle,
      "8-16 characters, atleast 1 Uppercase, 1 lowercase, 1 Number, 1 special character"
    );
    return false;
  }
  return true;
}

function hideSignupText() {
  hide(signupText);
  loaderEle.style.setProperty("display", "flex");
}

function displaySignupText() {
  unHide(signupText);
  loaderEle.style.setProperty("display", "none");
}

formEle.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!validateForm()) return;
  hideSignupText();
  const response = await fetch("/signup", {
    method: "post",
    body: new URLSearchParams(new FormData(formEle)),
  });
  const data = await response.json();
  if (response.status == 200) {
    location.replace(data.redirect);
  } else {
    displaySignupText();
    showErrorMsg(emailErrorEle, data.errorMsg);
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

const showEle = document.querySelector("#show");
const showText = showEle.querySelector("span");

showEle.addEventListener("click", () => {
  if (passwordEle.type == "password") {
    passwordEle.type = "text";
    showText.innerText = "Hide";
  } else {
    passwordEle.type = "password";
    showText.innerText = "Show";
  }
});
