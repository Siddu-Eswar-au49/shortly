async function runDefault() {
  const res = await fetch("/api/profile/info");
  if (res.status == 200) {
    location.replace("/dashboard");
  }
}
runDefault();
