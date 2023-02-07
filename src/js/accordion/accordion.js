import HelfiAccordion from './helfi-accordion';
import {createListOfUniqueIds} from './unique-id';

const accordionElements = document.querySelectorAll(HelfiAccordion.accordionWrapper);

// Add suffix to duplicate ids.
const uniqueListOfIds = createListOfUniqueIds([...accordionElements]);

accordionElements.forEach((element, index) => {
  element.firstChild('h2').setAttribute('id', uniqueListOfIds[index]);
});

// Initialize the accordions
window.helfiAccordions = [];
document.querySelectorAll(`.${HelfiAccordion.accordionWrapper}`).forEach((accordionElement) => {
  const accordion = new HelfiAccordion(accordionElement, uniqueListOfIds);
  window.helfiAccordions.push(accordion);
});
