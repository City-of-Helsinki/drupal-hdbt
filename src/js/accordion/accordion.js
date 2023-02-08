import HelfiAccordion from './helfi-accordion';
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
    element.querySelector('h2').setAttribute('id', uniqueListOfIds[index]);
  });

// Initialize the accordions
window.helfiAccordions = [];
document.querySelectorAll(`.${HelfiAccordion.accordionWrapper}`).forEach((accordionElement) => {
  const accordion = new HelfiAccordion(accordionElement, uniqueListOfIds);
  window.helfiAccordions.push(accordion);
});

