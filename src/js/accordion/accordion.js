import HelfiAccordion from './helfi-accordion';
import State from './state';
import { createListOfUniqueIds } from './unique-id';
import AccordionItem from './accordion-item';

// const accordionElements = document.querySelectorAll(`.${HelfiAccordion.accordionWrapper}`);

/*
const allAccordionItemIds = [...accordionElements]
  .map(accordion => Array.from(accordion.getElementsByClassName('helfi-accordion-item')).map(item => item.dataset.accordionId))
  .reduce((accumulator, currentValue) => accumulator.concat(...currentValue), []);
*/

// Add suffix to duplicate ids.
// const uniqueListOfIds = createListOfUniqueIds(allAccordionItemIds);

// Replace all duplicate ids across all accordions.
/*
[...accordionElements].map(accordion => Array.from(accordion.getElementsByClassName('helfi-accordion-item')))
  .reduce((accumulator, currentValue) => accumulator.concat(...currentValue), [])
  .forEach((element, index) => {
    element.querySelector('.helfi-accordion__header').setAttribute('id', uniqueListOfIds[index]);
  });
*/

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

