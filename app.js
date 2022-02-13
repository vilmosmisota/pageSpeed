import { getAll } from "./utils/selector.js";

const selectors = {
  lazyImages: getAll("[data-style], .lazy > source, .lazy-img "),
};

async function mainLoader() {
  if (selectors.lazyImages.length !== 0) {
    const { lazyLoader } = await import("./utils/lazyloader.js");
    lazyLoader(selectors.lazyImages);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mainLoader);
} else {
  mainLoader();
}
