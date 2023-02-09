import AccordionItem from './accordion-item';

export default class HelfiAccordion {

  static accordionWrapper = 'component--accordion';

  constructor(accordion, state) {
    this.accordion = accordion;
    this.localState = state;
    this.accordionItems = [];
    this.getAccordionLocalState();
    this.initializeAccordion();
  }

  initializeAccordion = () => {
    Array.from(this.accordion.getElementsByClassName(AccordionItem.accordionItemElement)).forEach((element) => {
      const item = new AccordionItem(element, this.localState);
      this.accordionItems.push(item);
    });
  };

  getAccordionLocalState = () => {
    this.state = localStorage.getItem(HelfiAccordion.localStateKey);
  };

}
