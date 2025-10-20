import HelfiAccordion from './helfi-accordion';
import AccordionState from './accordion-state';
import Events from './events';

window.helfiAccordions = [];

const state = new AccordionState();
// eslint-disable-next-line no-unused-vars
const events = new Events();
const {hash} = window.location;

/**
 * Determines accordion type based on its CSS class names.
 * - `component--no-header` → headerless accordion (no visible toggle-all button).
 * - `component--hardcoded` → static accordion, fully rendered in HTML.
 * - otherwise → standard (default) accordion.
 */
const getAccordionType = (classes) => {
  if (classes.includes('component--no-header')) {
    return 'headerless';
  }
  if (classes.includes('component--hardcoded')) {
    return 'hardcoded';
  }
  return 'default';
};

/**
 * MutationObserver callback.
 * Fired when new DOM nodes are added — this allows initializing accordions
 * dynamically.
 */
const callback = (mutations, observer) => {
  const items = document.querySelectorAll(`.${HelfiAccordion.accordionWrapper}`);

  // Initialize any new accordions that haven’t yet been processed.
  if (items.length > window.helfiAccordions.length) {
    try {
      items.forEach((accordionElement, index) => {
        // Detect accordion type based on CSS classes.
        const type = getAccordionType(Array.from(accordionElement.classList));
        const isHeaderless = HelfiAccordion.isHeaderless(type);

        /**
         * Special case:
         * The very first accordion on the page (index === 0) should always use
         * type “default”, unless it’s explicitly “hardcoded”.
         * This ensures that the first accordion gets full toggle-all functionality.
         */
        const actualType = (index === 0 && type !== 'hardcoded') ? 'default' : type;

        // Create the accordion instance.
        const accordion = new HelfiAccordion(accordionElement, state, hash, actualType);
        window.helfiAccordions.push(accordion);

        /**
         * Connect headerless accordions to their parent accordion.
         * This allows the previous accordion to control a following headerless accordion
         * as a “child” (for nested toggle-all behavior).
         *
         * Skip “hardcoded” accordions — they are standalone and do not participate
         * in parent/child relationships.
         */
        if (!accordion.isHardcoded(type) && isHeaderless && index > 0) {
          window.helfiAccordions[index - 1].addChildAccordion(accordion);
        }
      });
    }
    catch(e) {
      console.error(e);
      observer.disconnect();
    }
  }
};

/**
 * Observe the entire document for dynamically added accordions.
 * This ensures any accordions added after page load (e.g., via AJAX) are also initialized.
 */
const targetNode = document.body;
const config = { attributes: true, childList: true, subtree: true };

const observer = new MutationObserver(callback);
observer.observe(targetNode, config);
