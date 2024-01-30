import AccordionItem from './accordion-item';

export default class Events {

  constructor() {
    Events.handleTableOfContentsHash();
  }

  static handleTableOfContentsHash = () => {
    window.addEventListener('hashchange', () => {
      const {hash} = window.location;

      // Look for accordion headers for anchor links.
      let accordionItemFound = false;

      window.helfiAccordions.forEach((accordion) => {
        const accordionItem = accordion.getAccordionItemById(hash.replace('#', ''));
        if (accordionItem) {
          accordionItemFound = true;
          accordionItem.handleLinkAnchor();
        }
      });

      // If not found, look inside accordions for anchor links.
      if (!accordionItemFound) {
        const anchorElement = document.querySelector(`${hash}`);
        if (!anchorElement) {
          return;
        }
        const accordionItemToOpen = anchorElement.closest(`.${AccordionItem.accordionItemElement}`);
        if (accordionItemToOpen) {
          window.helfiAccordions.forEach((accordion) => {
            const idToSearch = accordionItemToOpen.querySelector('.helfi-accordion__header').id;
            const accordionItem = accordion.getAccordionItemById(idToSearch);
            if (accordionItem) {
              accordionItem.handleLinkAnchor();
            }
          });
        }
      }
    });
  };

}
