import HelfiAccordion from './helfi-accordion';
import {createListOfUniqueIds} from './unique-id';

const actionElements = {
  accordion: 'component--accordion',
  accordionItem: 'helfi-accordion-item',
  toggleElement: 'accordion-item__button--toggle',
  closeElement: 'accordion-item__button--close',
};

// Elements which require changes on different actions.
const ariaElements = {
  'aria-expanded': 'accordion-item__button--toggle',
};

window.helfiAccordions = [];

const accordionElements = document.querySelectorAll(`.${actionElements.accordionItem}`);

// Add suffix to duplicate ids.
const uniqueListOfIds = createListOfUniqueIds([...accordionElements]);
accordionElements.forEach((element, index) => {
  element.setAttribute('id', uniqueListOfIds[index]);
});

document.querySelectorAll(`.${actionElements.accordion}`).forEach((accordionElement) => {


  const accordion = new HelfiAccordion(accordionElement, actionElements, ariaElements, uniqueListOfIds);
  window.helfiAccordions.push(accordion);
});

