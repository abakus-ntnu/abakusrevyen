"use client";
import React, { useEffect, useState } from "react";
import { Sun, MoonStar } from "lucide-react";

export default function ThemeSwitcher() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("darkTheme");
    if (storedTheme === "true") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  function switchTheme() {
    const newTheme = !isDark;
    setIsDark(newTheme);

    if (newTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("darkTheme", String(newTheme));
  }

  return (
    <button
      id="themeSwitcher"
      onClick={switchTheme}
      className="text-foreground transition-colors hover:text-accent"
      aria-label="Bytt mellom lyst og mørkt tema"
    >
      {isDark ? <Sun className="hover:text-yellow-500" /> : <MoonStar />}
    </button>
  );
}
