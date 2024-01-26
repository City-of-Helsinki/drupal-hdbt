import AccordionItem from './accordion-item.js';

export default class HelfiAccordion {

  static accordionWrapper = 'component--accordion';

  static toggleAllElement = 'accordion__button--toggle-all';

  constructor(accordion, state, hash) {
    this.accordion = accordion;

    this.localState = state;
    this.accordionItems = [];
    this.initializeAccordion(hash);
    this.addEventListeners();
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

  /**
   * Callback for single accordion item to invoke changes in whole accordion.
   */
  updateToggleButtonLabel = () => {
    const toggleAllElement = this.accordion.getElementsByClassName(HelfiAccordion.toggleAllElement)[0];
    this.allItemsOpen() ? this.changeLabelToClose(toggleAllElement) : this.changeLabelToOpen(toggleAllElement);
  }

  changeLabelToOpen = (element) => element.querySelector('span').textContent = 'Open all'

  changeLabelToClose = (element) => element.querySelector('span').textContent = 'Close all'

  getAccordionItemById = (id) => this.accordionItems.find(accordionItem => accordionItem.id === id)

  toggleItems = () => this.allItemsOpen() ? this.closeAll() : this.openAll()

  openAll = () => this.accordionItems.forEach(item=> item.open())

  closeAll = () => this.accordionItems.forEach(item => item.close())

  allItemsOpen = () => this.accordionItems.every(item => item.isOpen)

}
