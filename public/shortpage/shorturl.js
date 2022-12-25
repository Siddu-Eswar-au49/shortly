(async () => {
  const res = await fetch(`api${location.pathname}${location.search}`);
  const data = await res.json();
  if (res.status == 404) {
    location.replace(data.replace);
    return;
  }
  if (data.wait == false) {
    location.replace(data.replace);
    return;
  }
  let seconds = 10;
  const secondsEle = document.querySelector("#ad-time");
  const interval = setInterval(() => {
    seconds--;
    secondsEle.innerText = seconds;
    if (seconds == 0) {
      clearInterval(interval);
      location.replace(data.replace);
    }
  }, 1000);
})();
