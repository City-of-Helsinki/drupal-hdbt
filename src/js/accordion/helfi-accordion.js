import AccordionItem from './accordion-item';

export default class HelfiAccordion {

  static accordionWrapper = 'component--accordion';

  constructor(accordion) {
    this.accordion = accordion;
    this.accordionItems = [];
    this.initializeAccordion();
  }

  initializeAccordion() {
    Array.from(this.accordion.getElementsByClassName(AccordionItem.accordionItemElement)).forEach((element) => {
      const item = new AccordionItem(element);
      this.accordionItems.push(element.getElementsByTagName('h2')[0].id = item);
    });
  }

}
