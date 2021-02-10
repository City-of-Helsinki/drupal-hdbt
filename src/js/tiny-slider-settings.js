document.addEventListener(
  'DOMContentLoaded',
  function () {
    // Find all gallery paragraphs.
    const galleries = document.getElementsByClassName('gallery');
    for (let gallery of galleries) {
      const galleryThumbnails = gallery.getElementsByClassName(
        'gallery__thumbnails__list'
      )[0];

      /* global tns */
      const tinySlider = new tns({
        container: galleryThumbnails,
        mouseDrag: true,
        items: 6,
        center: false,
        loop: false,
        slideBy: 1,
        autoplay: false,
        gutter: 16,
        nav: false,
        edgePadding: 0,
        responsive: {
          0: {
            disable: true,
          },
          992: {
            disable: false,
          },
        },
      });

      // I don't think we need this but if it is not added I create variable that
      // is not used above.
      tinySlider.play();
    }
  },
  { once: true }
);
