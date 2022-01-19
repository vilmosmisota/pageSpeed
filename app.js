$(document).ready(() => {
  lazyLoadImages();
  heroSlider();
});

function heroSlider() {
  $(".hero-slider").slick({
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
  });
}

function lazyLoadImages() {
  const lazyImages = Array.from($(".lazy > source, .lazy-img, .lazy-bg"));

  const options = {
    root: null,
    rootMargin: "150px 0px",
    threshold: 0,
  };
  const lazyImageObserver = new IntersectionObserver(callbackObserver, options);

  function setWidthAndHeight(img) {
    img.width = img.clientWidth;
    img.height = img.clientHeight;
  }

  function setImageViewportWidth(img) {
    const windowWidth = window.innerWidth;
    const imgWidth = img.clientWidth;

    const imgViewportWidth = Math.floor((imgWidth / windowWidth) * 100) + "vw";

    return imgViewportWidth;
  }

  function handlePictureElement(img) {
    if (img.nextElementSibling.nodeName === "IMG") {
      img.nextElementSibling.src = img.nextElementSibling.dataset.src;
      setWidthAndHeight(img.nextElementSibling);
      delete img.nextElementSibling.dataset.src;
    }

    img.srcset = img.dataset.srcset;
    delete img.dataset.srcset;

    img.parentElement.classList.remove("lazy");
    lazyImageObserver.unobserve(img);
  }

  function handleImgSrcset(img) {
    img.sizes = setImageViewportWidth(img);
    setWidthAndHeight(img);
    img.srcset = img.dataset.srcset;
    img.src = img.dataset.src;
    delete img.dataset.srcset;
    delete img.dataset.src;
    lazyImageObserver.unobserve(img);
  }

  function handleBackgroundImg(img) {
    const value = img.attributes.lazybackground.nodeValue;
    const sources = value.split(",").map((el) => el.trim());
    if (window.innerWidth < 500) {
      img.style.backgroundImage = `url("${sources[0]}")`;
    }
    if (window.innerWidth > 500 && window.innerWidth < 1000) {
      img.style.backgroundImage = `url("${sources[1]}")`;
    }

    if (window.innerWidth > 1000) {
      img.style.backgroundImage = `url("${sources[2]}")`;
    }

    lazyImageObserver.unobserve(img);
  }

  function callbackObserver(entries) {
    entries.forEach((entry) => {
      const img = entry.target;

      if (!entry.isIntersecting) return;

      if (img.parentElement.nodeName === "PICTURE") {
        handlePictureElement(img);
      }
      if (img.nodeName === "IMG") {
        handleImgSrcset(img);
      }
      if (img.nodeName === "DIV") {
        handleBackgroundImg(img);
      }
    });
  }

  lazyImages.forEach((img) => {
    lazyImageObserver.observe(img);
  });
}
