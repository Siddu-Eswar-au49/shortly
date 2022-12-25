async function rundefault() {
  const res = await fetch("/logout", { method: "put" });
  console.log(res);
  if (res.status == 200) {
    location.replace("/");
  } else {
    location.replace("/login");
  }
}

rundefault();
