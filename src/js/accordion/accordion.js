import HelfiAccordion from './helfi-accordion';
import AccordionState from './accordion-state';
import Events from './events';

window.helfiAccordions = [];

const state = new AccordionState();
// eslint-disable-next-line no-unused-vars
const events = new Events();
const {hash} = window.location;

const getAccordionType = (classes) => {
  if (classes.includes('component--no-header')) {
    return 'headerless';
  }
  if (classes.includes('component--hardcoded')) {
    return 'hardcoded';
  }
  return 'default';
};

const callback = (mutations, observer) => {
  const items = document.querySelectorAll(`.${HelfiAccordion.accordionWrapper}`);

  if (items.length > window.helfiAccordions.length) {
    try {
      items.forEach((accordionElement, index) => {
        const type = getAccordionType(Array.from(accordionElement.classList));
        const isHeaderless = HelfiAccordion.isHeaderless(type);

        // Special case.
        const actualType = (index === 0 && type !== 'hardcoded') ? 'default' : type;
        const accordion = new HelfiAccordion(accordionElement, state, hash, actualType);
        window.helfiAccordions.push(accordion);

        // Allow the previous accordion to control the next headerless accordion's toggle functionality.
        // Should skip hardcoded accordions.
        if (!accordion.isHardcoded(type) && isHeaderless && index > 0) {
          window.helfiAccordions[index-1].addChildAccordion(accordion);
        }
      });
    }
    catch(e) {
      console.error(e);
      observer.disconnect();
    }
  }
};

const targetNode = document.body;
const config = { attributes: true, childList: true, subtree: true };

const observer = new MutationObserver(callback);
observer.observe(targetNode, config);
