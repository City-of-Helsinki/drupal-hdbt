import AccordionItem from './accordion-item.js';

export default class HelfiAccordion {

  static accordionWrapper = 'component--accordion';

  static toggleAllElement = 'accordion__button--toggle-all';

  constructor(accordion, state, hash, headerless = false) {
    this.accordion = accordion;

    this.headerless = headerless;
    this.localState = state;
    this.accordionItems = [];
    this.childAccordions = [];
    this.initializeAccordion(hash);
    this.addEventListeners();

    if (headerless) {this.accordion.getElementsByClassName(HelfiAccordion.toggleAllElement)[0].classList.add('is-hidden')}
    this.updateToggleButtonLabel();
  }

  initializeAccordion = (hash) => {
    Array.from(this.accordion.getElementsByClassName(AccordionItem.accordionItemElement)).forEach((element) => {
      this.accordionItems.push(new AccordionItem(element, this.localState, this.updateToggleButtonLabel, hash));
    });
  }

  addEventListeners = () => {
    const toggleAllElement = this.accordion.getElementsByClassName(HelfiAccordion.toggleAllElement)[0];
    toggleAllElement.addEventListener('mouseup', this.toggleItems);
    toggleAllElement.addEventListener('keypress', this.toggleItems);
  }

  addChildAccordion =  (accordion) => {
    this.childAccordions.push(accordion);
  }

  /**
   * Callback for single accordion item to invoke changes in whole accordion.
   */
  updateToggleButtonLabel = () => {
    if (!this.headerless) { return }
    const toggleAllElement = this.accordion.getElementsByClassName(HelfiAccordion.toggleAllElement)[0];
    this.allItemsOpen() ?
      toggleAllElement.querySelector('span').textContent = 'Close all' :
      toggleAllElement.querySelector('span').textContent = 'Open all';
  }

  getAccordionItemById = (id) => this.accordionItems.find(accordionItem => accordionItem.id === id)

  toggleItems = () => this.allItemsOpen() ? this.closeAll() : this.openAll()

  openAll = () => {
    this.accordionItems.forEach(item=> item.open())
    this.childAccordions.forEach(accordion => accordion.openAll())
  }

  closeAll = () => {
    this.accordionItems.forEach(item => item.close())
    this.childAccordions.forEach(accordion => accordion.closeAll())
  }

  allItemsOpen = () => this.accordionItems.every(item => item.isOpen)

}
