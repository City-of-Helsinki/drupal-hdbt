/**
 * Gallery functionality
 *
 * The gallery needs the Splide and Tiny Slider libraries to work.
 *
 * Splide library controls the main part of the gallery and is connected to the
 * thumbnails below using the code written here.
 *
 * Tiny Slideshow library is used to provide the users possiblity to browse the
 * thumbnails if there is more than thumbnailsVisibleAtOnce items in the
 * gallery.
 */

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

    // This variable decides maximum amount of thumbnails visible at once in
    // the gallery.
    const thumbnailsVisibleAtOnce = 6;

    // Collect all the thumbnails related to the gallery.
    const galleryThumbnails = gallery.getElementsByClassName(
      'gallery__thumbnails__list'
    )[0];

    // Initiate the tiny slider for the thumbnails so that users are able
    // to browse the available thumbnails independently.
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

    // Add tns-disabled class if there is less slides than the
    // thumbnailsVisibleAtOnce
    if (tinySlider.getInfo().slideCount < thumbnailsVisibleAtOnce) {
      const thumbnailContainer = gallery.getElementsByClassName(
        'gallery__thumbnails'
      )[0];
      thumbnailContainer.classList.add('tns-disabled');
    }

    // Find the slide count element inside the gallery.
    const slideCount = gallery.getElementsByClassName(
      'gallery__slide-count'
    )[0];

    // Functionality that needs to be triggered when the user clicks on the
    // arrows on the Splide (main part of the gallery) area is written here.
    splide.on('mounted move', function (newIndex) {
      // newIndex will be undefined through the "mounted" event.
      const thumbnail =
        thumbnails[newIndex !== undefined ? newIndex : splide.index];

      // When page is loaded the gallery is in slide 1. This is why we give
      // the active count value 1 when newIndex is undefined. Else we add
      // one to the newIndex value to have the number of slide we are looking
      // at.
      if (newIndex === undefined) {
        activeCount = 1;
      } else {
        activeCount = newIndex + 1;
      }

      // The text that will be printed for the mobile user to see.
      slideCount.innerText = activeCount + '/' + thumbnails.length;

      // Add and remove the activeClass according depending on the selected
      // thumbnail.
      if (thumbnail && activeThumb !== thumbnail) {
        if (activeThumb) {
          activeThumb.classList.remove(activeClass);
        }

        thumbnail.classList.add(activeClass);
        activeThumb = thumbnail;
      }
    });

    // Get node list of all gallery thumbnail items inside the gallery.
    const allThumbnails = gallery.querySelectorAll(
      '.gallery__thumbnails__item'
    );

    // First visible slide when the gallery is mounted is of index 0.
    let firstVisibleSlide = 0;

    // Last visible slide on the gallery. Since we start from 0 so we need to
    // subtract 1 from the number of thumbnails visible.
    let lastVisibleSlide = thumbnailsVisibleAtOnce - 1;

    // Setting a variable that indicates if we have already gone on the
    // splide.on('moved') event.
    let splideMoved = false;

    splide.on('moved', function () {
      for (let selectedThumbnail of allThumbnails) {
        if (selectedThumbnail.classList.contains('is-active')) {
          let activeThumbnailIndex = splide.index;

          // Move the thumbnail container forward to show the active thumbnail.
          if (activeThumbnailIndex === lastVisibleSlide + 1) {
            // The order here is crucial for the functionality of the code.
            // First assign the splideMoved variable before moving the
            // tiny slider so that the functions bind to tiny slider events are
            // NOT run.
            splideMoved = true;
            tinySlider.goTo('next');
            firstVisibleSlide = firstVisibleSlide + 1;
            lastVisibleSlide = lastVisibleSlide + 1;
          } else if (activeThumbnailIndex < firstVisibleSlide) {
            // The order here is crucial for the functionality of the code.
            // First assign the splideMoved variable before moving the
            // tiny slider so that the functions bind to tiny slider events are
            // NOT run.
            splideMoved = true;
            tinySlider.goTo(activeThumbnailIndex);
            firstVisibleSlide = activeThumbnailIndex;
            lastVisibleSlide =
              activeThumbnailIndex + (thumbnailsVisibleAtOnce - 1);
          }

          // Move the thumbnail container backwards to show the active thumbnail.
          if (
            firstVisibleSlide > 0 &&
            activeThumbnailIndex + 1 === firstVisibleSlide
          ) {
            // The order here is crucial for the functionality of the code.
            // First assign the splideMoved variable before moving the
            // tiny slider so that the functions bind to tiny slider events are
            // NOT run.
            splideMoved = true;
            tinySlider.goTo('prev');
            firstVisibleSlide = firstVisibleSlide - 1;
            lastVisibleSlide = lastVisibleSlide - 1;
          } else if (activeThumbnailIndex > lastVisibleSlide) {
            // The order here is crucial for the functionality of the code.
            // First assign the splideMoved variable before moving the
            // tiny slider so that the functions bind to tiny slider events are
            // NOT run.
            splideMoved = true;
            tinySlider.goTo(activeThumbnailIndex);
            firstVisibleSlide =
              activeThumbnailIndex - (thumbnailsVisibleAtOnce - 1);
            lastVisibleSlide = activeThumbnailIndex;
          }
        }
      }
    });

    // Code that is triggered when the tiny slider is moved using the small
    // arrows on each end of the thumbnail container.
    tinySlider.events.on('indexChanged', function () {
      // Make sure that the splide.on('moved') event isn't triggered before
      // running the code.
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
