import HelfiAccordion from './helfi-accordion.js';
import State from './state.js';
import Events from "./events.js";

window.helfiAccordions = [];

const targetNode = document.body
const config = { attributes: true, childList: true, subtree: true };

const state = new State();
const events = new Events();
let {hash} = window.location;

const callback = (mutations, observer) => {
  const items = document.querySelectorAll(`.${HelfiAccordion.accordionWrapper}`);
  if (items.length > window.helfiAccordions.length) {
    try {

      // component--no-header
      items.forEach((accordionElement, index) => {
        const headerless = accordionElement.classList.contains('component--no-header');
        const accordion = new HelfiAccordion(accordionElement, state, hash, headerless);
        window.helfiAccordions.push(accordion);

        // Allow the first accordion to control the upcoming headerless accordion's toggle functionality.
        if (headerless) {
          window.helfiAccordions[index-1].addChildAccordion(accordion);
        }
      });

    }
    catch(e) {
      console.log(e);
      observer.disconnect();
    }
  }
}

var observer = new MutationObserver(callback);
observer.observe(targetNode, config);

