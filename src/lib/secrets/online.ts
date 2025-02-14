export function enableOnlineTheme() {
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

  const aboutBranding = window.document.getElementById("about-branding");
  if (aboutBranding) {
    aboutBranding.innerHTML = "Onlinerevyen";
  }
}

export function disableOnlineTheme() {
  localStorage.removeItem("onlineThemeEnabled");
  window.document.documentElement.classList.remove("online");

  // Cant be bothered to fix all the sources and texts manually,
  // just refresh the page instead. Same thing.
  window.location.reload();
}
