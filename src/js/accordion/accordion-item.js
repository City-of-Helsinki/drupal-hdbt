export default class AccordionItem {

  static accordionItemElement = 'helfi-accordion-item';

  static toggleElement = 'accordion-item__button--toggle';

  static closeElement = 'accordion-item__button--close';

  static ariaExpandedElements = [
    'accordion-item__button--toggle', 'accordion-item__button--close'
  ];

  static contentElement = 'accordion-item__content';

  constructor(element, state) {
    this.element = element;
    // Use header id as this objects id since header id is unique.
    this.id = element.querySelector('.helfi-accordion__header').id;
    this.localState = state;
    this.isOpen = this.localState.loadItemState(this.id);
    this.setHidden();
    this.addEventListeners();
    // Open accordion element by anchor link.
    // TODO: UHF-8775 Figure out why javascript cannot find elements at this point (https://helsinkisolutionoffice.atlassian.net/browse/UHF-8775).
    // Possibly due to other timeouts
    setTimeout(()=>{
      this.handleLinkAnchor();
      // Update element aria-expanded.
      this.setAriaOpen();
    }, 100);
  }

  open = () => {
    this.isOpen = true;
    this.setAriaOpen();
    this.setHidden();
    this.localState.saveItemState(this.id, this.isOpen);
  };

  close = () => {
    this.isOpen = false;
    this.setAriaOpen();
    this.changeFocus();
    this.setHidden();
    this.localState.saveItemState(this.id, this.isOpen);
  };

  toggle = (event) => {
    if (!AccordionItem.isClick(event.which)) return;
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  };

  handleLinkAnchor = () => {
    const {hash} = window.location;
    if (!hash) return;
    const item = this.element.querySelector(hash);
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
    if (this.isOpen) {
      contentElement.classList.remove('is-hidden');
    }
    else {
      contentElement.classList.add('is-hidden');
    }
  };

  changeFocus = () => {
    this.element.querySelector(`.${AccordionItem.toggleElement}`).focus();
  };

  addEventListeners = () => {
    this.element.getElementsByClassName(AccordionItem.toggleElement)[0].addEventListener('mouseup', this.toggle);
    this.element.getElementsByClassName(AccordionItem.toggleElement)[0].addEventListener('keypress', this.toggle);

    this.element.getElementsByClassName(AccordionItem.closeElement)[0].addEventListener('mouseup', this.close);
    this.element.getElementsByClassName(AccordionItem.closeElement)[0].addEventListener('keypress', this.close);
  };

  static isClick(buttonKey) {
    return buttonKey === 1 || buttonKey === 13 || buttonKey === 32;
  };

  getId = () => this.id;

}
