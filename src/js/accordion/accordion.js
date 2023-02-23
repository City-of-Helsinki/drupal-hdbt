import HelfiAccordion from './helfi-accordion';
import State from './state';
import AccordionItem from './accordion-item';

// Listen to hash change.
window.addEventListener('hashchange', (event) => {
  const {hash} = window.location;

  let accordionItemFound = false;
  window.helfiAccordions.forEach((accordion) => {
    const accordionItem = accordion.getAccordionItemById(hash.replace('#', ''));
    if (accordionItem) {
      accordionItemFound = true;
      accordionItem.open();
    }
  });

  if (!accordionItemFound) {
    const anchorElement = document.querySelector(hash);
    const accordionItemToFind = anchorElement.closest(`.${AccordionItem.accordionItemElement}`);
    if (accordionItemToFind) {
      window.helfiAccordions.forEach((accordion) => {
        const accordionItem = accordion.getAccordionItemById(accordionItemToFind.getId());
        if (accordionItem) {
          accordionItem.open();
        }
      });
    }
  }
});

// Initialize the accordions
window.helfiAccordions = [];

const state = new State();
document.querySelectorAll(`.${HelfiAccordion.accordionWrapper}`).forEach((accordionElement) => {
  const accordion = new HelfiAccordion(accordionElement, state);
  window.helfiAccordions.push(accordion);
});

