export function lazyLoader(lazyImages) {
  const options = {
    root: null,
    rootMargin: "150px 0px",
    threshold: 0,
  };

  const lazyImageObserver = new IntersectionObserver(callbackObserver, options);

  function presetImgSizeStyles(img) {
    if (
      img.nodeName === "SOURCE" ||
      img.nodeName === "DIV" ||
      img.classList.contains("bg-img") ||
      typeof img.dataset.presets !== "undefined"
    ) {
      return;
    }

    img.style.width = "100%";
    img.style.height = "auto";
    img.style.display = "block";
    img.decoding = "async";
  }

  function presetImgLoader(img) {
    if (img.dataset.load === "fadeIn") {
      img.style.opacity = "0";
      img.style.transition = "all 250ms ease-in";
    }
  }

  function setImageViewportWidth(img) {
    const windowWidth = window.innerWidth;
    const imgWidth = img.clientWidth;
    const imgViewportWidth = Math.floor((imgWidth / windowWidth) * 100) + "vw";
    img.sizes = imgViewportWidth;
  }

  function setImageLoader(img) {
    img.style.opacity = "1";
  }

  function handleImgSrcset(img) {
    setImageViewportWidth(img);
    setImageLoader(img);
    img.srcset = img.dataset.srcset;
    img.src = img.dataset.src;
    delete img.dataset.srcset;
    delete img.dataset.src;
    lazyImageObserver.unobserve(img);
  }

  function handleImgTag(img) {
    img.src = img.dataset.src;
    delete img.dataset.src;
    lazyImageObserver.unobserve(img);
  }

  function handleBackgroundImg(img) {
    img.style = img.dataset.style;
    delete img.dataset;
    lazyImageObserver.unobserve(img);
  }

  function handlePictureElement(img) {
    if (img.nextElementSibling.nodeName === "IMG") {
      img.nextElementSibling.src = img.nextElementSibling.dataset.src;
      delete img.nextElementSibling.dataset.src;
    }

    img.srcset = img.dataset.srcset;
    delete img.dataset.srcset;
    img.parentElement.classList.remove("lazy");
    lazyImageObserver.unobserve(img);
  }

  function callbackObserver(entries) {
    entries.forEach(function (entry) {
      const img = entry.target;

      if (!entry.isIntersecting) return;

      if (img.parentElement.nodeName === "PICTURE") {
        handlePictureElement(img);
      }

      if (img.nodeName === "IMG" && typeof img.dataset.srcset !== "undefined") {
        handleImgSrcset(img);
      }

      if (img.nodeName === "IMG" && typeof img.dataset.srcset === "undefined") {
        handleImgTag(img);
      }

      if (img.nodeName === "DIV") {
        handleBackgroundImg(img);
      }

      lazyImageObserver.unobserve(img);
    });
  }

  lazyImages.forEach((img) => {
    presetImgLoader(img);
    presetImgSizeStyles(img);
  });

  lazyImages.forEach((img) => {
    lazyImageObserver.observe(img);
  });
}
