// This script replaces chat trigger placeholder elements with buttons that open the chat.
(function chatTriggerWrapper() {
  const triggerTranslations = {
    fallback: {
      fi: 'Chatti ei ole saatavilla.',
      sv: 'Chatten är inte tillgänglig.',
      en: 'The chat is not available.',
    },
    openChat: { fi: 'Avaa chat', sv: 'Öppna chatten', en: 'Open the chat' },
  };

  /**
   * Waits for an element to appear in the DOM and resolves with the element.
   *
   * @param {string} selector - The CSS selector of the element to wait for.
   * @return {Promise<Element>} A promise that resolves with the element once it appears in the DOM.
   */
  function waitForElement(selector) {
    return new Promise((resolve) => {
      // First check, if the element exists already.
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
      } else {
        // If not, wait for it to appear.
        const observer = new MutationObserver(() => {
          const elem = document.querySelector(selector);
          if (elem) {
            observer.disconnect();
            resolve(elem);
          }
        });
        observer.observe(document.documentElement, {
          childList: true,
          subtree: true,
        });
      }
    });
  }

  /**
   * Try to find the chat trigger placeholder elements and replace them with buttons that open the chat.
   */
  function init() {
    // Find all chat trigger placeholder elements.
    const placeholders = document.querySelectorAll('p[data-chat-trigger]');

    // Get the language, fallback to english.
    const lang = window?.drupalSettings?.path?.currentLanguage || 'en';

    // Iterate over each placeholder.
    placeholders.forEach((placeholder) => {
      // Get target selector from attribute
      const targetSelector = placeholder.dataset.chatTrigger;

      // The trigger is present but the chat is not available, show fallback until chat is available.
      if (!document.querySelector(targetSelector)) {
        const content =
          triggerTranslations.fallback[lang] || triggerTranslations.fallback.en;
        placeholder.textContent = content;
      }

      // Wait for the target element to appear in the DOM and replace the trigger with a button that opens the chat.
      waitForElement(targetSelector).then(() => {
        const triggerButton = document.createElement('button');
        triggerButton.textContent =
          triggerTranslations.openChat[lang] || triggerTranslations.openChat.en;
        triggerButton.dataset.hdsComponent = 'button';
        triggerButton.dataset.hdsVariant = 'secondary';
        triggerButton.dataset.clickSelector = targetSelector;
        triggerButton.addEventListener('click', (event) => {
          const selector = event.target?.dataset?.clickSelector;
          if (selector) {
            const clickTarget = document.querySelector(selector);
            if (clickTarget) {
              clickTarget.click();
            }
          }
        });
        placeholder.removeAttribute('data-chat-trigger');
        placeholder.innerHTML = '';
        placeholder.appendChild(triggerButton);
      });
    });
  }

  window.addEventListener('DOMContentLoaded', init);
})();
