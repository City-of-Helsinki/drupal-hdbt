import AccordionItem from './accordion-item';

export default class HelfiAccordion {

  static accordionWrapper = 'component--accordion';

  static localStateKey = 'helfi-accordion-state';

  constructor(accordion) {
    this.accordion = accordion;
    this.accordionItems = [];
    this.state = [];
    this.getAccordionLocalState();
    this.initializeAccordion();
  }

  initializeAccordion = () => {
    Array.from(this.accordion.getElementsByClassName(AccordionItem.accordionItemElement)).forEach((element) => {
      const item = new AccordionItem(element);
      this.accordionItems.push(item);
    });
  };

  getAccordionLocalState = () => {
    this.state = localStorage.getItem(HelfiAccordion.localStateKey);
  };

}
