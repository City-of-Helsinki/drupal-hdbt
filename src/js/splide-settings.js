document.addEventListener('DOMContentLoaded', function () {
  /* global Splide */
  const splide = new Splide('.splide', {
    pagination: false,
  });

  // Collect elements of thumbnails.
  const images = document.querySelectorAll(
    '.js-gallery__thumbnails .gallery__thumbnails__item'
  );

  let activeImage;
  const activeClass = 'is-active';

  // Listen a click event and toggle a class.
  for (let i = 0, len = images.length; i < len; i++) {
    let image = images[i];

    splide.on(
      'click',
      function () {
        if (activeImage !== image) {
          activeImage.classList.remove(activeClass);
          image.classList.add(activeClass);
          splide.go(i);
          activeImage = image;
        }
      },
      image
    );
  }

  splide.on('mounted move', function (newIndex) {
    // newIndex will be undefined through the "mounted" event.
    const image = images[newIndex !== undefined ? newIndex : splide.index];

    if (image && activeImage !== image) {
      if (activeImage) {
        activeImage.classList.remove(activeClass);
      }

      image.classList.add(activeClass);
      activeImage = image;
    }
  });

  splide.mount();

  /* global tns */
  const tinySlider = new tns({
    container: '.gallery__thumbnails__list',
    mouseDrag: true,
    items: 6,
    center: false,
    loop: false,
    slideBy: 1,
    autoplay: false,
    gutter: 16,
    nav: false,
    edgePadding: 0,
  });

  // This is obsolete - remove it
  tinySlider.mount();
});
