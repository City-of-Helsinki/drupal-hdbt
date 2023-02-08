export default class AccordionItem {

  static accordionItemElement = 'helfi-accordion-item';

  static toggleElement = 'accordion-item__button--toggle';

  static closeElement = 'accordion-item__button--close';

  static ariaExpandedElements = [
    'accordion-item__button--toggle', 'helfi-accordion__content', 'accordion-item__button--close'
  ];

  constructor(element, isOpen = false) {
    this.isOpen = isOpen;
    this.element = element;
    this.addEventListeners();

    // Open accordion element by anchor link.
    // TODO: Figure out why javascript cannot find elements at this point.
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
  };

  close = ()  => {
    this.isOpen = false;
    this.setAriaOpen();
    this.changeFocus();
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
    if (this.element.querySelector(hash)) {
      this.isOpen = true;
      this.setAriaOpen();
      this.element.scrollIntoView();
    }
  };

  setAriaOpen = () => {
    AccordionItem.ariaExpandedElements.forEach((className) => {
      this.element.getElementsByClassName(className)[0].setAttribute('aria-expanded', this.isOpen);
    });
  };

  changeFocus = () => {
    this.element.querySelector(`.${AccordionItem.toggleElement}`).focus();
  };

  addEventListeners = () => {
    this.element.getElementsByClassName(AccordionItem.toggleElement)[0].addEventListener('mousedown', this.toggle);
    this.element.getElementsByClassName(AccordionItem.toggleElement)[0].addEventListener('keypress', this.toggle);

    this.element.getElementsByClassName(AccordionItem.closeElement)[0].addEventListener('mousedown', this.close);
    this.element.getElementsByClassName(AccordionItem.closeElement)[0].addEventListener('keypress', this.close);
  };

  static isClick(buttonKey) {
    return buttonKey === 1 || buttonKey === 13 || buttonKey === 32;
  };

}
