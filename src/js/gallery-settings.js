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

    const galleryThumbnails = gallery.getElementsByClassName(
      'gallery__thumbnails__list'
    )[0];

    const thumbnailsVisibleAtOnce = 6;

    /* global tns */
    const tinySlider = new tns({
      container: galleryThumbnails,
      mouseDrag: true,
      items: thumbnailsVisibleAtOnce,
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

    const allThumbnails = gallery.querySelectorAll(
      '.gallery__thumbnails__item'
    );

    let firstVisibleSlide = 0;
    // We start from 0 so we need to substract 1 from the thumbnails visible
    // at once.
    let lastVisibleSlide = thumbnailsVisibleAtOnce - 1;
    let splideMoved = false;

    splide.on('moved', function () {
      for (let selectedThumbnail of allThumbnails) {
        if (selectedThumbnail.classList.contains('is-active')) {
          let activeThumbnailIndex = splide.index;

          if (activeThumbnailIndex === lastVisibleSlide + 1) {
            splideMoved = true;
            tinySlider.goTo('next');
            firstVisibleSlide = firstVisibleSlide + 1;
            lastVisibleSlide = lastVisibleSlide + 1;
          } else if (activeThumbnailIndex < firstVisibleSlide) {
            splideMoved = true;
            tinySlider.goTo(activeThumbnailIndex);
            firstVisibleSlide = activeThumbnailIndex;
            lastVisibleSlide =
              activeThumbnailIndex + (thumbnailsVisibleAtOnce - 1);
          }

          if (
            firstVisibleSlide > 0 &&
            activeThumbnailIndex + 1 === firstVisibleSlide
          ) {
            splideMoved = true;
            tinySlider.goTo('prev');
            firstVisibleSlide = firstVisibleSlide - 1;
            lastVisibleSlide = lastVisibleSlide - 1;
          } else if (activeThumbnailIndex > lastVisibleSlide) {
            splideMoved = true;
            tinySlider.goTo(activeThumbnailIndex);
            firstVisibleSlide =
              activeThumbnailIndex - (thumbnailsVisibleAtOnce - 1);
            lastVisibleSlide = activeThumbnailIndex;
          }
        }
      }
    });

    tinySlider.events.on('indexChanged', function () {
      if (splideMoved === false) {
        firstVisibleSlide = tinySlider.getInfo().index;
        lastVisibleSlide =
          thumbnailsVisibleAtOnce - 1 + tinySlider.getInfo().index;
      }
      splideMoved = false;
    });

    splide.mount();
  }
});
