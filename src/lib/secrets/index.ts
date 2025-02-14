import { enableOnlineTheme, disableOnlineTheme } from "./online";

export const SECRETS = [
  {
    id: "online",
    phrase: "jegeroffline",
    activate: enableOnlineTheme,
    deactivate: disableOnlineTheme,
  },
];

const longestPhrase = Math.max(
  ...SECRETS.map((secret) => secret.phrase.length),
);
let currentString = "";

function onKeyDown(e: KeyboardEvent) {
  currentString += e.key;
  if (currentString.length > longestPhrase) {
    currentString = currentString.slice(currentString.length - longestPhrase);
  }

  for (const secret of SECRETS) {
    if (currentString.includes(secret.phrase)) {
      localStorage.setItem(secret.id, "enabled");
      secret.activate();
    } else {
      if (localStorage.getItem(secret.id) === "enabled") {
        secret.deactivate();
      }
      localStorage.removeItem(secret.id);
    }
  }
}

function onLoad() {
  for (const secret of SECRETS) {
    if (localStorage.getItem(secret.id) === "enabled") {
      secret.activate();
    }
  }
}

export function activate() {
  window.addEventListener("DOMContentLoaded", onLoad);
  window.addEventListener("keydown", onKeyDown);
}
