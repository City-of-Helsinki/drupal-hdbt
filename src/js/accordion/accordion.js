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
    const accordionItemToOpen = anchorElement.closest(`.${AccordionItem.accordionItemElement}`);
    if (accordionItemToOpen) {
      window.helfiAccordions.forEach((accordion) => {
        const accordionItem = accordion.getAccordionItemById(accordionItemToOpen.dataset.accordionId);
        if (accordionItem) {
          accordionItem.handleLinkAnchor();
        }
      });
    }
  }
});

// Initialize the accordions
window.helfiAccordions = [];

const state = new State();
setTimeout(()=>{
  document.querySelectorAll(`.${HelfiAccordion.accordionWrapper}`).forEach((accordionElement) => {
    const accordion = new HelfiAccordion(accordionElement, state);
    window.helfiAccordions.push(accordion);
  });
}, 50);


