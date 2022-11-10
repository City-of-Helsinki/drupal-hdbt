document.addEventListener('DOMContentLoaded', function accordionListeners() {
  // Bind closing function to the additional close button at the bottom of
  // the content. For reasons unknown to man the close button cannot be
  // actual button. If you change it from span to button the click event
  // is no longer registered and the functionality doesn't work.
  function closeFold(folds) {
    const closeButton = folds.content.querySelector('.accordion-item__button--close');

    function moveFocus(element) {
      element.closest('.accordion__wrapper').querySelector('.accordion-item__button--toggle').focus();
    }

    function closeFolds(e) {
      folds.close();
      e.preventDefault();
      moveFocus(this);
    }
    closeButton.addEventListener('mousedown', closeFolds);

    closeButton.addEventListener('keypress', function closeFoldsOnKey(e) {
      if (e.which === 13 || e.which === 32) {
        closeFolds(e);
      }
    });
  }

  // Find all accordions.
  const accordions = document.getElementsByClassName('handorgel');
  window.handorgel_accordions = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const singleAccordion of accordions) {
    /* global handorgel */
    // eslint-disable-next-line new-cap
    const accordion = new handorgel(singleAccordion, {
      // whether multiple folds can be opened at once
      multiSelectable: false,
      // whether the folds are collapsible
      collapsible: true,

      // whether ARIA attributes are enabled
      ariaEnabled: true,
      // whether W3C keyboard shortcuts are enabled
      keyboardInteraction: true,
      // whether to loop header focus (sets focus back to first/last header when end/start reached)
      carouselFocus: true,

      // attribute for the header or content to open folds at initialization
      initialOpenAttribute: 'data-open',
      // whether to use transition at initial open
      initialOpenTransition: true,
      // delay used to show initial transition
      initialOpenTransitionDelay: 200,

      // header/content class if fold is open
      headerOpenClass: 'handorgel__header--open',
      contentOpenClass: 'handorgel__content--open',

      // header/content class if fold has been opened (transition finished)
      headerOpenedClass: 'handorgel__header--opened',
      contentOpenedClass: 'handorgel__content--opened',

      // header/content class if fold has been focused
      headerFocusClass: 'handorgel__header--focus',
      contentFocusClass: 'handorgel__content--focus',

      // header/content class if fold is disabled
      headerDisabledClass: 'handorgel__header--disabled',
      contentDisabledClass: 'handorgel__content--disabled',
    });

    // Add a global variable so that we can open accordions with anchor links where needed
    window.handorgel_accordions.push(accordion);

    // Get all the folds associated to the accordion.
    const { folds } = accordion;

    // Go through each fold.
    folds.forEach(closeFold);
  }
});
