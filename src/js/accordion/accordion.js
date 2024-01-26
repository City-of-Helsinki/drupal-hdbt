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
      items.forEach((accordionElement) => {
        const accordion = new HelfiAccordion(accordionElement, state, hash);
        window.helfiAccordions.push(accordion);
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

