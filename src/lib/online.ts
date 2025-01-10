function enableOnlineTheme() {
  localStorage.setItem("onlineThemeEnabled", "true");
  window.document.documentElement.classList.add("online");

  const navbarTitle = window.document.getElementById("navbar-title");
  if (navbarTitle) {
    navbarTitle.innerHTML = "Onlinerevyen";
  }

  const footerTitle = window.document.getElementById("footer-title");
  if (footerTitle) {
    footerTitle.innerHTML = "Onlinerevyen";
  }

  const navbarLogo: HTMLImageElement = window.document.getElementById(
    "navbar-logo",
  ) as HTMLImageElement;
  if (navbarLogo) {
    navbarLogo.src =
      "https://wiki.online.ntnu.no/attachments/680-Online_bla_o.png";
  }
}

function disableOnlineTheme() {
  localStorage.removeItem("onlineThemeEnabled");
  window.document.documentElement.classList.remove("online");

  // Cant be bothered to fix all the sources and texts manually,
  // just refresh the page instead. Same thing.
  window.location.reload();
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
