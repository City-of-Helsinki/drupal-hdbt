export default class AccordionItem {
  static accordionItemElement = 'helfi-accordion-item';

  static toggleElement = 'accordion-item__button--toggle';

  static closeElement = 'accordion-item__button--close';

  static ariaExpandedElements = ['accordion-item__button--toggle'];

  static contentElement = 'accordion-item__content';

  constructor(element, state, urlHash, parentCallback) {
    this.element = element;
    this.localState = state;
    // Allow updating the accordion state when the item's state changes.
    this.parentCallback = parentCallback;

    // Use header id as this objects id since header id is unique.
    this._id = element.dataset.accordionId;
    this._isOpen = this.localState.loadAccordionItemState(this._id);

    // Do not animate accordions on page load so adding the noAnimation to true.
    this.setHidden(true);
    this.addEventListeners();
    this.handleLinkAnchor(urlHash);
    this.setAriaOpen();
  }

  open = () => {
    this._isOpen = true;
    this.setAriaOpen();
    this.setHidden();
    this.parentCallback();
    this.localState.saveAccordionItemState(this.id, this.isOpen);
  };

  close = () => {
    this._isOpen = false;
    this.setAriaOpen();
    this.changeFocus();
    this.setHidden();
    this.parentCallback();
    this.localState.saveAccordionItemState(this.id, this.isOpen);
  };

  closeWithoutFocus = () => {
    this._isOpen = false;
    this.setAriaOpen();
    this.setHidden();
    this.parentCallback();
    this.localState.saveAccordionItemState(this.id, this.isOpen);
  };

  toggle = (event) => {
    if (!AccordionItem.isClick(event.which)) {
      return;
    }
    this.isOpen ? this.close() : this.open();
  };

  handleLinkAnchor = (urlHash) => {
    if (!urlHash || urlHash.length === 0) return;
    const item = this.element.querySelector(urlHash);
    if (item) {
      this.open();
      item.scrollIntoView();
    }
  };

  setAriaOpen = () => {
    AccordionItem.ariaExpandedElements.forEach((className) => {
      this.element
        .getElementsByClassName(className)[0]
        .setAttribute('aria-expanded', this.isOpen);
    });
  };

  // Show/hide the accordion content with the hidden-attribute.
  setHidden = (noAnimation) => {
    const accordionElement = this.element.closest('.accordion');
    const accordionItemContent = this.element.getElementsByClassName(
      AccordionItem.contentElement,
    )[0];

    // No animation version of show/hide functionality.
    if (noAnimation) {
      // Set the animation duration with css-variable to 0 before adjusting the hidden-attribute.
      accordionElement.style.setProperty('--js-accordion-open-time', '0s');

      // Force a reflow to ensure the style change takes effect
      void document.body.offsetHeight;

      this.isOpen
        ? accordionItemContent.removeAttribute('hidden')
        : // biome-ignore lint/suspicious/noAssignInExpressions: @todo UHF-12066
          (accordionItemContent.hidden = 'until-found');

      // Remove the css-property to enable animations again.
      setTimeout(() => {
        accordionElement.style.removeProperty('--js-accordion-open-time');
      }, 10);

      return;
    }

    if (!this.isOpen) {
      // Get the show/hide animation duration from the css.
      const accordionAnimationDuration =
        parseInt(
          getComputedStyle(accordionElement).getPropertyValue(
            '--js-accordion-open-time',
          ),
          10,
        ) || 200;

      // Delay the attribute change until the animation has been completed.
      setTimeout(() => {
        accordionItemContent.hidden = 'until-found';
      }, accordionAnimationDuration);
    } else {
      accordionItemContent.removeAttribute('hidden');
    }
  };

  changeFocus = () =>
    this.element.querySelector(`.${AccordionItem.toggleElement}`).focus();

  addEventListeners = () => {
    const toggleElement = this.element.getElementsByClassName(
      AccordionItem.toggleElement,
    )[0];
    toggleElement.addEventListener('mouseup', this.toggle);
    toggleElement.addEventListener('keypress', this.toggle);

    // There might be multiple closeElements inside an AccordionItem
    // if there is accordions nested. There is however just one close
    // button inside an accordion so we should select the last one
    // since it is the correct one that we want to bind the event
    // listeners.
    const closeElements = this.element.getElementsByClassName(
      AccordionItem.closeElement,
    );
    const closeElement = closeElements[closeElements.length - 1];
    closeElement.addEventListener('mouseup', this.close);
    closeElement.addEventListener('keypress', this.close);
  };

  static isClick(buttonKey) {
    return buttonKey === 1 || buttonKey === 13 || buttonKey === 32;
  }

  get id() {
    return this._id;
  }

  get isOpen() {
    return this._isOpen;
  }
}
