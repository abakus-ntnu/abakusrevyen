function enableOnlineTheme() {
  localStorage.setItem("onlineThemeEnabled", "true");
  window.document.documentElement.classList.add("online");
}

function disableOnlineTheme() {
  localStorage.removeItem("onlineThemeEnabled");
  window.document.documentElement.classList.remove("online");
}

function onLoad() {
  const enabled = localStorage.getItem("onlineThemeEnabled") === "true";
  if (enabled) {
    enableOnlineTheme();
  }
}

const PHRASE = "jegeroffline";
let currentString = "";

function onKeyDown(e: KeyboardEvent) {
  currentString += e.key;
  if (currentString.length > PHRASE.length) {
    currentString = currentString.slice(currentString.length - PHRASE.length);
  }
  console.log(currentString);
  if (currentString === PHRASE) {
    enableOnlineTheme();
    alert("La oss få deg online! :)");
  } else {
    disableOnlineTheme();
  }
}

onLoad();
window.addEventListener("keydown", onKeyDown);
