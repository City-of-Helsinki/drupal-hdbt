import HelfiAccordion from './helfi-accordion';
import State from './state';
import { createListOfUniqueIds } from './unique-id';

const accordionElements = document.querySelectorAll(`.${HelfiAccordion.accordionWrapper}`);

const allAccordionItemIds = [...accordionElements]
  .map(accordion => Array.from(accordion.getElementsByClassName('helfi-accordion-item')).map(item => item.dataset.accordionId))
  .reduce((accumulator, currentValue) => accumulator.concat(...currentValue), []);

// Add suffix to duplicate ids.
const uniqueListOfIds = createListOfUniqueIds(allAccordionItemIds);

// Replace all duplicate ids across all accordions.
[...accordionElements].map(accordion => Array.from(accordion.getElementsByClassName('helfi-accordion-item')))
  .reduce((accumulator, currentValue) => accumulator.concat(...currentValue), [])
  .forEach((element, index) => {
    console.log(uniqueListOfIds[index]);
    element.querySelector('.helfi-accordion__header').setAttribute('id', uniqueListOfIds[index]);
  });


// Listen to hash change.
window.addEventListener('hashchange', (event) => {
  const {hash} = window.location;

  window.helfiAccordions.forEach((accordion) => {
    const accordionItem = accordion.getAccordionItemById(hash.replace('#', ''));
    if (accordionItem) {
      accordionItem.open();
    }
  });
});

// Initialize the accordions
window.helfiAccordions = [];

const state = new State();
document.querySelectorAll(`.${HelfiAccordion.accordionWrapper}`).forEach((accordionElement) => {
  const accordion = new HelfiAccordion(accordionElement, state);
  window.helfiAccordions.push(accordion);
});

