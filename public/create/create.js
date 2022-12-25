import { setup, showErrorMsg, hideErrorMsg, hide } from "../common/common.js";
setup();
const domainNameEle = document.querySelector(".domain-name");
domainNameEle.value = location.host;
const formele = document.querySelector("form");
const destinationEle = document.querySelector("#fullUrl");
const destinationErrorEle = document.querySelector("#fullUrl+.input-error");
const backHalfEle = document.querySelector("#backHalf");
const backHalfErrorEle = document.querySelector("#backHalf+.input-error");
const titleEle = document.querySelector("#title");
const titleErrorEle = document.querySelector("#title+.input-error");

destinationEle.focus();

function validateData() {
  hideErrorMsg(destinationErrorEle);
  hideErrorMsg(titleErrorEle);
  hideErrorMsg(backHalfErrorEle);
  destinationEle.value = destinationEle.value.trim();
  backHalfEle.value = backHalfEle.value.trim();
  titleEle.value = titleEle.value.trim();
  if (
    destinationEle.value
      .slice(0, location.host.length + 10)
      .includes(location.host)
  ) {
    showErrorMsg(
      destinationErrorEle,
      `You cannot short a url from ${location.host}`
    );
    return false;
  }
  backHalfEle.value = backHalfEle.value.replaceAll(" ", "");

  if (!backHalfEle.value.match("^[a-zA-z0-9]*$")) {
    showErrorMsg(backHalfErrorEle, "only A-z, a-z, 0-9");
    return false;
  }
  if (backHalfEle.value.length > 30) {
    showErrorMsg(backHalfErrorEle, "maximum length is 30");
    return false;
  }

  if (titleEle.value) {
    if (titleEle.value.length > 30) {
      showErrorMsg(titleErrorEle, "maximum length is 30");
      return false;
    }
  }
  const checkHttp = destinationEle.value.slice(0, 7);
  if (checkHttp != "http://" && checkHttp != "https:/") {
    destinationEle.value = "http://" + destinationEle.value;
  }
  return true;
}
formele.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!validateData()) return;
  const responce = await fetch("/url", {
    method: "post",
    body: new URLSearchParams(new FormData(formele)),
  });
  const data = await responce.json();
  if (responce.status == 200) {
    formele.reset();
    location.replace("/dashboard");
  } else {
    showErrorMsg(backHalfErrorEle, data.errmsg);
  }
});
