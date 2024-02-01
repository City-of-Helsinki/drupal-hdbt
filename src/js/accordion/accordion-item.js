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
    this._id = element.querySelector('.helfi-accordion__header').id;
    this._isOpen = this.localState.loadItemState(this._id);

    this.element.style = '--js-accordion-open-time:0s'; // do not animate accordions on pageload
    this.setHidden();
    this.addEventListeners();
    this.handleLinkAnchor(urlHash);
    this.setAriaOpen();
    this.element.style = null; // allow animating accordions after pageload
  }

  open = () => {
    this._isOpen = true;
    this.setAriaOpen();
    this.setHidden();
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
    if (!urlHash) return;
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

  setHidden = () => {
    const contentElement = this.element.getElementsByClassName(AccordionItem.contentElement)[0];
    // eslint-disable-next-line no-unused-expressions
    this.isOpen ? contentElement.classList.remove('is-hidden') : contentElement.classList.add('is-hidden');
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
