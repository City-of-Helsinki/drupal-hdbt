document.addEventListener('DOMContentLoaded', function () {
  // Find all gallery paragraphs.
  const galleries = document.getElementsByClassName('gallery');

  for (let gallery of galleries) {
    // Find the main part of the gallery inside the gallery paragraph.
    const galleryMain = gallery.getElementsByClassName('splide')[0];

    /* global Splide */
    const splide = new Splide(galleryMain, {
      pagination: false,
    });

    // Find all the thumbnails inside the gallery.
    const thumbnails = gallery.getElementsByClassName(
      'gallery__thumbnails__item'
    );

    let activeThumb;
    let activeCount;
    const activeClass = 'is-active';

    // Listen a click event and toggle the active class.
    for (let i = 0, len = thumbnails.length; i < len; i++) {
      let thumbnail = thumbnails[i];

      splide.on(
        'click',
        function () {
          if (activeThumb !== thumbnail) {
            activeThumb.classList.remove(activeClass);
            thumbnail.classList.add(activeClass);
            splide.go(i);
            activeThumb = thumbnail;
          }
        },
        thumbnail
      );
    }

    // Find the slide count element inside the gallery.
    const slideCount = gallery.getElementsByClassName(
      'gallery__slide-count'
    )[0];

    splide.on('mounted move', function (newIndex) {
      // newIndex will be undefined through the "mounted" event.
      const thumbnail =
        thumbnails[newIndex !== undefined ? newIndex : splide.index];

      if (newIndex === undefined) {
        activeCount = 1;
      } else {
        activeCount = newIndex + 1;
      }

      slideCount.innerText = activeCount + '/' + thumbnails.length;

      if (thumbnail && activeThumb !== thumbnail) {
        if (activeThumb) {
          activeThumb.classList.remove(activeClass);
        }

        thumbnail.classList.add(activeClass);
        activeThumb = thumbnail;
      }
    });

    splide.mount();
  }
});
