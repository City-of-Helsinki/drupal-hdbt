import AccordionItem from './accordion-item';

export default class HelfiAccordion {

  constructor(accordion, actionElements, ariaElements) {
    this.accordion = accordion;
    this.actionElements = actionElements;
    this.ariaElements = ariaElements;

    this.accordionItems = [];
    this.initializeAccordion();
  }

  initializeAccordion() {
    Array.from(this.accordion.getElementsByClassName(this.actionElements.accordionItem)).forEach((element) => {
      const item = new AccordionItem(element, this.ariaElements);
      this.addEventListeners(element, item);
      this.accordionItems.push(element.getElementsByTagName('h2')[0].id = item);
    });
  }

  addEventListeners(element, item) {
    element.getElementsByClassName(this.actionElements.toggleElement)[0].addEventListener('click', item.toggle);
    element.getElementsByClassName(this.actionElements.toggleElement)[0].addEventListener('keypress', item.toggle);

    element.getElementsByClassName(this.actionElements.closeElement)[0].addEventListener('click', item.close);
    element.getElementsByClassName(this.actionElements.closeElement)[0].addEventListener('keypress', item.close);
  }

  getAccordionItems() {
    return this.accordionItems;
  }

}
