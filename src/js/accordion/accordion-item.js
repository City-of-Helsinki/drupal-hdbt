export default class AccordionItem {

  constructor(element, ariaElements, isOpen = false) {
    this.isOpen = isOpen;
    this.element = element;
    this.ariaElements = ariaElements;
    this.ariaOperations();
  }

  open() {
    this.isOpen = true;
    this.ariaOperations();
  }

  close() {
    this.isOpen = false;
    this.ariaOperations();
  }

  toggle(event) {
    if (!this.constructor.isClick(event.which)) return;
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  static isClick(buttonKey) {
    return buttonKey === 1 || buttonKey === 13 || buttonKey === 32;
  }

  ariaOperations() {
    this.ariaExpanded = this.isOpen;
    this.element.getElementsByClassName(this.ariaElements['aria-expanded'])[0].setAttribute('aria-expanded', this.ariaExpanded);
  }

}
