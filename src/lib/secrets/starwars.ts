export function enableStarWarsTheme() {
  localStorage.setItem("starWarsThemeEnabled", "true");
  window.document.documentElement.classList.add("star-wars");

  const body = document.querySelector("body");
  if (!body) return;
  body.classList.add("dark");
  body.style.backgroundImage = "url(/stars.jpeg)";
  body.style.backgroundSize = "cover";
  body.style.position = "fixed";
  body.style.overflow = "hidden";
  body.style.top = "0";
  body.style.left = "0";
  body.style.width = "100vw";
  body.style.height = "100vh";
  const bodyContent = Array(body.children)[0][0] as HTMLDivElement;

  const scrollContainer = document.createElement("div");
  scrollContainer.style.overflow = "auto";
  scrollContainer.style.maxHeight = "100vh";
  scrollContainer.style.position = "absolute";
  scrollContainer.style.top = "0";
  scrollContainer.style.left = "0";
  scrollContainer.style.width = "150vw";
  scrollContainer.style.height = "100vh";
  scrollContainer.style.pointerEvents = "none";
  body.appendChild(scrollContainer);

  bodyContent.addEventListener("wheel", (e) => {
    scrollContainer.scrollBy({ top: e.deltaY });
  });
  let previousTouchY: number | null = null;
  bodyContent.addEventListener("touchmove", (e: TouchEvent) => {
    if (previousTouchY !== null) {
      scrollContainer.scrollBy({
        top: previousTouchY - e.changedTouches[0].clientY,
      });
    }
    previousTouchY = e.changedTouches[0].clientY;
  });
  bodyContent.addEventListener("touchend", (e: TouchEvent) => {
    previousTouchY = null;
  });

  const scrollContainerContent = document.createElement("div");
  scrollContainer.appendChild(scrollContainerContent);

  scrollContainerContent.style.height =
    String(bodyContent.scrollHeight) + "0px";
  bodyContent.addEventListener("resize", () => {
    scrollContainerContent.style.height =
      String(bodyContent.scrollHeight) + "0px";
  });

  const baseStarWarsTransform =
    "translateX(-50%) scale(2) perspective(1000px) rotateX(45deg)";

  scrollContainer.addEventListener("scroll", () => {
    bodyContent.style.transform = `${baseStarWarsTransform} translateY(-${scrollContainer.scrollTop}px)`;
  });

  bodyContent.style.paddingBottom = "100vh";
  bodyContent.style.transform = baseStarWarsTransform;
  bodyContent.style.position = "absolute";
  bodyContent.style.top = "0";
  bodyContent.style.left = "50%";
  bodyContent.style.width = "100%";
}

export function disableStarWarsTheme() {
  localStorage.removeItem("starWarsThemeEnabled");
  window.document.documentElement.classList.remove("star-wars");
  window.location.reload();
}
