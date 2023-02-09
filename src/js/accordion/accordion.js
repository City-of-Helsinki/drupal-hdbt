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
    element.querySelector('h2').setAttribute('id', uniqueListOfIds[index]);
  });


// listen to hash change
window.addEventListener('hashchange', (event) => {
  const {hash} = window.location;

  const element = [...accordionElements]
    .map(accordion => Array.from(accordion.getElementsByClassName('helfi-accordion-item')))
    .reduce((accumulator, currentValue) => accumulator.concat(...currentValue), [])
    .filter((el) => el.querySelector('h2').dataset.accordionId === hash.replace('#', ''));

  let accordionItem;
  window.helfiAccordions.forEach((accordion)=>{
    accordionItem = accordion.getAccordionItemById(hash.replace('#', ''));
    accordionItem[0].open();
  });

});

// Initialize the accordions
window.helfiAccordions = [];

const state = new State();
document.querySelectorAll(`.${HelfiAccordion.accordionWrapper}`).forEach((accordionElement) => {
  const accordion = new HelfiAccordion(accordionElement, state);
  window.helfiAccordions.push(accordion);
});

