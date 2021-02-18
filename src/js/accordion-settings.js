document.addEventListener('DOMContentLoaded', function () {
  // Find all gallery paragraphs.
  const accordions = document.getElementsByClassName('accordion');

  for (let accordion of accordions) {
    /* global handorgel */
    const singleAccordion = new handorgel(
      accordion.querySelector('.handorgel'),
      {
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
      }
    );

    const closeButtons = accordion.querySelectorAll(
      '.accordion-item__button--close'
    );

    for (let closeButton of closeButtons) {
      closeButton.addEventListener('click', function () {
        singleAccordion.close();
      });
    }
  }
});
