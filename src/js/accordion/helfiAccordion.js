import AccordionItem from './accordionItem';
import Translations from './translations';
import ClientHelpers from '../clientHelpers';

export default class HelfiAccordion {

  static accordionWrapper = 'component--accordion';

  static toggleAllElement = 'js-accordion__button--toggle-all';

  static toggleAllOpen = 'accordion__button--is-open';

  static toggleAllClosed = 'accordion__button--is-closed';

  /**
   * Accordion types that don’t use toggle-all functionality.
   * “headerless” = accordion with no visible header.
   * “hardcoded” = accordion created in static HTML, not dynamically generated.
   */
  static headerlessTypes = ['headerless', 'hardcoded'];

  constructor(accordion, state, urlHash, type = 'default') {
    // “Headerless” and “hardcoded” accordions skip toggle-all functionality.
    this.type = type;

    this.isSingleItemAccordion = false;
    this.currentLanguage = ClientHelpers.getCurrentLanguage();
    this.accordion = accordion;
    this.localState = state;
    this.accordionItems = [];
    this.childAccordion = null;
    this.urlHash = urlHash;
    this.initializeAccordion(urlHash);
    this.addEventListeners();
    this.showToggleButton();
    this.updateToggleButtonLabel();
  }

  /**
   * Initialize accordion items and optional “hidden until found” support.
   */
  initializeAccordion = () => {
    const accordionItems = this.accordion.getElementsByClassName(AccordionItem.accordionItemElement);
    this.isSingleItemAccordion = accordionItems.length === 1;

    // Create AccordionItem instances for each item in this accordion.
    Array.from(accordionItems).forEach((element) => {
      this.accordionItems.push(new AccordionItem(element, this.localState, this.urlHash, this.updateToggleButtonLabel));
    });

    // Initialize hidden="until-found" functionality if it is supported.
    if ('onbeforematch' in document.body) {
      this.enableHiddenUntilFound();
    }
  };

  /**
   * Make it possible for the browser search find content inside the closed accordions.
   */
  enableHiddenUntilFound = () => {
    this.accordionItems.forEach(accordionItem => {
      accordionItem.element.classList.add('accordion-item--hidden-until-found');
      const accordionItemContent = accordionItem.element.querySelector('.accordion-item__content');

      // If item is defined in the state as open, don't close it.
      if (!accordionItem.isOpen) {
        accordionItemContent.hidden = 'until-found';
      }

      // Add event listener to the beforematch event what is triggered when browser finds something or
      // highlight is found on the url parameters.
      accordionItem.element.addEventListener('beforematch', () => {

        // Disable animations on the accordion on these events.
        accordionItem.element.style.setProperty('--js-accordion-open-time', '0s');

        // Force a reflow to ensure the style change takes effect.
        // eslint-disable-next-line no-void
        void accordionItem.element.offsetHeight;

        // Open the accordion that contains the found text.
        accordionItem.open();

        // Enable the animations again after the accordion has been opened.
        setTimeout(() => {
          accordionItem.element.style.removeProperty('--js-accordion-open-time');
        }, 10);
      });
    });
  };

  /**
   * Add event listeners for the toggle-all button (if applicable).
   * Headerless or single-item accordions skip this.
   */
  addEventListeners = () => {
    if (HelfiAccordion.isHeaderless(this.type) || this.isSingleItemAccordion) { return; }

    const toggleAllElement = this.accordion.getElementsByClassName(HelfiAccordion.toggleAllElement)[0];
    toggleAllElement.addEventListener('mouseup', this.toggleItems);
    toggleAllElement.addEventListener('keypress', this.toggleItems);
  };

  addChildAccordion = (accordion) => {
    this.childAccordion = accordion;
  };

  showToggleButton = () => {
    if (HelfiAccordion.isHeaderless(this.type) || this.isSingleItemAccordion) {
      this.accordion.getElementsByClassName(HelfiAccordion.toggleAllElement)[0]?.classList.add('is-hidden');
    } else {
      this.accordion.getElementsByClassName(HelfiAccordion.toggleAllElement)[0]?.classList.remove('is-hidden');
    }
  };

  /**
   * Update the toggle-all button label based on current accordion state.
   */
  updateToggleButtonLabel = () => {
    const toggleAllElement = this.accordion.getElementsByClassName(HelfiAccordion.toggleAllElement)[0];
    if (!toggleAllElement) { return; }

    // eslint-disable-next-line no-unused-expressions
    this.areAllItemsOpen() ?
      toggleAllElement.querySelector('span').textContent = Translations.close_all?.[this.currentLanguage] ?? Translations.close_all.en :
      toggleAllElement.querySelector('span').textContent = Translations.open_all?.[this.currentLanguage] ?? Translations.open_all.en;

    this.toggleAllLabelUpdate();
  };

  getAccordionItemById = (id) => this.accordionItems.find(accordionItem => accordionItem.id === id);

  toggleItems = () => this.areAllItemsOpen() ? this.closeAll() : this.openAll();

  /**
   * Opens all accordion items (including child accordions, if any).
   */
  openAll = () => {
    this.accordionItems.forEach(item => item.open());
    this.childAccordion?.openAll();
    this.updateToggleButtonLabel();
    this.toggleAllLabelUpdate();
  };

  /**
   * Closes all accordion items (including child accordions, if any).
   */
  closeAll = () => {
    this.accordionItems.forEach(item => item.closeWithoutFocus());
    this.childAccordion?.closeAll();
    this.updateToggleButtonLabel();
    this.toggleAllLabelUpdate();

    // Move focus back to the toggle-all button for accessibility.
    const toggleAllElement = this.accordion.getElementsByClassName(HelfiAccordion.toggleAllElement)[0];
    toggleAllElement.focus();
  };

  /**
   * Updates the toggle-all button’s open/closed CSS classes.
   */
  toggleAllLabelUpdate = () => {
    const toggleAllElement = this.accordion.getElementsByClassName(HelfiAccordion.toggleAllElement)[0];

    if (toggleAllElement && this.areAllItemsOpen()) {
      toggleAllElement.classList.remove(HelfiAccordion.toggleAllClosed);
      toggleAllElement.classList.add(HelfiAccordion.toggleAllOpen);
    } else {
      toggleAllElement.classList.remove(HelfiAccordion.toggleAllOpen);
      toggleAllElement.classList.add(HelfiAccordion.toggleAllClosed);
    }
  };

  areAllItemsOpen = () => (this.accordionItems?.every(item => item.isOpen)) && this.areChildItemsOpen();

  areChildItemsOpen = () => this.childAccordion?.areAllItemsOpen() ?? this.accordionItems?.every(item => item.isOpen);

  static isHeaderless = type => HelfiAccordion.headerlessTypes.includes(type);

  isHardcoded = () => this.type === 'hardcoded';

}
