export default class AccordionItem {

  static accordionItemElement = 'helfi-accordion-item';

  static toggleElement = 'accordion-item__button--toggle';

  static closeElement = 'accordion-item__button--close';

  static ariaExpandedElements = [
    'accordion-item__button--toggle'
  ];

  static contentElement = 'accordion-item__content';

  constructor(element, state, urlHash, parentCallback) {
    this.element = element;
    this.localState = state;
    // Allow updating the accordion state when the item's state changes.
    this.parentCallback = parentCallback;

    // Use header id as this objects id since header id is unique.
    this._id = element.dataset.accordionId;
    this._isOpen = this.localState.loadItemState(this._id);

    // Do not animate accordions on pageload.
    const accordionElement = this.element.closest('.accordion');
    accordionElement.style.setProperty('--js-accordion-open-time', '0s');

    this.setHidden();
    this.addEventListeners();
    this.handleLinkAnchor(urlHash);
    this.setAriaOpen();

    // Allow animating accordions after pageload.
    accordionElement.style.removeProperty('--js-accordion-open-time');
  }

  open = (hasBeenFound) => {
    this._isOpen = true;
    this.setAriaOpen();
    if (hasBeenFound) {
      this.setHidden(hasBeenFound);
    } else {
      this.setHidden();
    }
    this.parentCallback();
    this.localState.saveItemState(this.id, this.isOpen);
  };

  close = () => {
    this._isOpen = false;
    this.setAriaOpen();
    this.changeFocus();
    this.setHidden();
    this.parentCallback();
    this.localState.saveItemState(this.id, this.isOpen);
  };

  closeWithoutFocus = () => {
    this._isOpen = false;
    this.setAriaOpen();
    this.setHidden();
    this.parentCallback();
    this.localState.saveItemState(this.id, this.isOpen);
  };

  toggle = (event) => {
    if (!AccordionItem.isClick(event.which)) {
      return;
    }
    // eslint-disable-next-line no-unused-expressions
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
      this.element.getElementsByClassName(className)[0].setAttribute('aria-expanded', this.isOpen);
    });
  };

  setHidden = (hasBeenFound) => {
    const accordionContentElement = this.element.getElementsByClassName(AccordionItem.contentElement)[0];

    // First check if the accordion is opened by click or by search.
    if (hasBeenFound) {
      // Disable animation when the accordion opening is triggered by search.
      this.element.style.setProperty('--js-accordion-open-time', '0s');
      // eslint-disable-next-line no-unused-expressions
      this.isOpen ? accordionContentElement.removeAttribute('hidden') : accordionContentElement.hidden = 'until-found';
      // Restore the animation after the accordion is opened.
      setTimeout(() => {
        this.element.style.removeProperty('--js-accordion-open-time');
      }, 10);
    } else if (this.isOpen) {
      accordionContentElement.removeAttribute('hidden');
    } else {
      const accordionElement = this.element.closest('.accordion');
      // Get the animation duration from the css.
      const accordionAnimationDuration = parseInt(getComputedStyle(accordionElement).getPropertyValue('--js-accordion-open-time'), 10) || 200;
      // Delay the attribute change until the animation has been completed.
      setTimeout(() => {
        accordionContentElement.hidden = 'until-found';
      }, accordionAnimationDuration);
    }
  };

  changeFocus = () => this.element.querySelector(`.${AccordionItem.toggleElement}`).focus();

  addEventListeners = () => {
    const toggleElement = this.element.getElementsByClassName(AccordionItem.toggleElement)[0];
    toggleElement.addEventListener('mouseup', this.toggle);
    toggleElement.addEventListener('keypress', this.toggle);

    const closeElement = this.element.getElementsByClassName(AccordionItem.closeElement)[0];
    closeElement.addEventListener('mouseup', this.close);
    closeElement.addEventListener('keypress', this.close);
  };

  static isClick(buttonKey) {
    return buttonKey === 1 || buttonKey === 13 || buttonKey === 32;
  }

  get id() { return this._id; }

  get isOpen() { return this._isOpen; }

}
