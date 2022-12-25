import { setup } from "../common/common.js";
setup();
const freebtn = document.querySelector(".free-table");
const premiumbtn = document.querySelector(".premium-table");

freebtn.addEventListener("click", async (e) => {
  const freeres = await fetch("/payment/free", { method: "put" });
  const freedata = await freeres.json();
  location.replace(freedata.redirect);
});

premiumbtn.addEventListener("click", () => {
  location.replace("/payment/upgrade");
});

document
  .querySelector("nav p")
  .addEventListener("click", () => location.replace("/dashboard"));
