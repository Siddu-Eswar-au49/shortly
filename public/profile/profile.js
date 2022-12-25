import { setup, hide, unHide, shortDate } from "../common/common.js";
setup();

const fields = {
  fullName: { title: "Full Name", type: "text" },
  emailId: { title: "Email Address", type: "email" },
  phoneNumber: { title: "Phone", type: "tel" },
};

const mainEle = document.querySelector("#profile-info-data");
const profileImageEle = document.querySelector("#profile-image");
const bigFirstCharacterEle = document.querySelector("#big-first-character");

const changeImageLabel = document.querySelector('label[for="profile-picture"]');

const imageFileInput = document.querySelector("#profile-picture");
const formEle = document.querySelector("form");
const loader = document.querySelector(".change-image div");
imageFileInput.addEventListener("change", async (e) => {
  const len = imageFileInput.value.len;
  const fileType = imageFileInput.value.slice(len - 4, len);
  if (fileType == ".png" || fileType == "jpeg") {
    changeImageLabel.style.setProperty(
      "--content",
      '"upload only png,jpg,jpeg"'
    );
    return;
  }
  changeImageLabel.style.setProperty("--content", "");
  loader.className = "loader";
  hide(changeImageLabel);
  const formData = new FormData(formEle);

  const updateRes = await fetch("/api/profile", {
    method: "put",
    body: formData,
  });
  if (updateRes.status == 200) {
    location.reload();
  } else {
    const updateData = await updateRes.json();
    loader.className = "hide";
    unHide(changeImageLabel);
    changeImageLabel.style.setProperty("--content", `"${updateData.errmsg}"`);
  }
});

const expiryTimeText = document.querySelector(".expiry-time-text");
const expiryDateSpan = document.querySelector("#expiry-date");

async function rundefault() {
  const profileres = await fetch("/api/profile");
  const profiledata = await profileres.json();
  const { profilePicture, expiryTime } = profiledata;
  if (profileres.status == 200) {
    unHide(profileImageEle);
    if (profilePicture) {
      profileImageEle.src = profilePicture;
      hide(bigFirstCharacterEle);
    } else {
      profileImageEle.src =
        "https://www.pngmagic.com/product_images/plain-soid-Rebecca-Purple-bhackground-images.jpg";
      bigFirstCharacterEle.innerHTML = profiledata.fullName[0];
      unHide(bigFirstCharacterEle);
    }
    if (expiryTime) {
      unHide(expiryTimeText);
      expiryDateSpan.innerText = shortDate(expiryTime);
    } else {
      hide(expiryTimeText);
    }
    for (let field in fields) {
      mainEle.append(createField(field, profiledata[field]));
    }
  } else {
    if (profiledata.redirect) {
      location.replace(profiledata.replace);
    }
  }
}

function createField(field, data) {
  const fieldDiv = createDiv();
  fieldDiv.append(createP(fields[field].title, "field"));

  const displayDiv = createDiv();
  const displayContentDiv = createDiv("display-content");
  const nameP = createP(data || "");
  displayContentDiv.append(nameP);

  const editDiv = createDiv("hide");
  const editContentDiv = createDiv("edit-content");
  const divEle = createDiv("");
  const inputBox = document.createElement("input");
  const errorTextEle = document.createElement("p");
  errorTextEle.className = "error-text hide";
  inputBox.type = fields[field].type;
  divEle.append(inputBox);
  editContentDiv.append(divEle, errorTextEle);

  const cancelBtn = createButton("Cancel", "cancel", () => {
    inputBox.value = "";
    displayDiv.classList.remove("hide");
    editDiv.classList.add("hide");
  });

  const updateBtn = createButton("Update", "update", async () => {
    const formData = new FormData();
    formData.append(field, inputBox.value);
    const updateRes = await fetch("/api/profile", {
      method: "put",
      body: new URLSearchParams(formData),
    });
    if (updateRes.status == 200) {
      location.reload();
    } else {
      errorTextEle.innerText = "email already exists";
      errorTextEle.classList.remove("hide");
    }
  });

  divEle.append(cancelBtn, updateBtn);
  editDiv.append(editContentDiv);

  const editBtn = createButton(data ? "Edit" : "Add", "edit", () => {
    inputBox.value = data;
    displayDiv.classList.add("hide");
    editDiv.classList.remove("hide");
  });
  displayContentDiv.append(editBtn);
  displayDiv.append(displayContentDiv);
  fieldDiv.append(displayDiv, editDiv);
  return fieldDiv;
}

function createDiv(className) {
  const div = document.createElement("div");
  div.className = className || "";
  return div;
}

function createP(text, className) {
  const p = document.createElement("p");
  p.className = className || "";
  p.innerText = text;
  return p;
}

function createButton(text, className, eventCallBack) {
  const button = document.createElement("button");
  button.className = className || "";
  button.innerText = text;
  button.addEventListener("click", eventCallBack);
  return button;
}

rundefault();
