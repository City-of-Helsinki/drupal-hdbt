// This script replaces a chat trigger placeholder element with a button that opens the chat.
(function chatTriggerWrapper() {
  const triggerTranslations = {
    fallBack: {
      fi: 'Chatti ei ole saatavilla.',
      sv: 'Chatten är inte tillgänglig.',
      en: 'The chat is not available.'
    },
    openChat: {
      fi: 'Avaa chat',
      sv: 'Öppna chatten',
      en: 'Open the chat'
    }
  };

  /**
   * Waits for an element to appear in the DOM and resolves with the element.
   *
   * @param {string} selector - The CSS selector of the element to wait for.
   * @return {Promise<Element>} A promise that resolves with the element once it appears in the DOM.
   */
  function waitForElement(selector) {
    return new Promise(resolve => {
      // First check, if the element exists already.
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
      } else { // If not, wait for it to appear.
        const observer = new MutationObserver(() => {
          const elem = document.querySelector(selector);
          if (elem) {
            observer.disconnect();
            resolve(elem);
          }
        });
        observer.observe(document.documentElement, { childList: true, subtree: true, });
      }
    });
  }

  /**
   * Try to find the chat trigger placeholder element and replace it with a button that opens the chat.
   */
  function init() {

    // Find the chat trigger placeholder element.
    let placeholder = document.querySelector('p[data-chat-trigger]');

    // If the chat trigger placeholder is not found, do nothing.
    if (!placeholder) {
      return;
    }

    // Get target selector from attribute
    const targetSelector = placeholder.dataset.chatTrigger;

    // Get the language, fallback to english.
    const lang = window?.drupalSettings?.path?.currentLanguage || 'en';

    // The trigger is present but the chat is not available, show fallback until chat is available.
    if (!document.querySelector(targetSelector)) {
      const fallBack = document.createElement('span');
      fallBack.textContent = triggerTranslations.fallBack[lang];
      placeholder.replaceWith(fallBack);
      placeholder = fallBack;
    }

    // Wait for the target element to appear in the DOM and replace the trigger with a button that opens the chat.
    waitForElement(targetSelector).then((chatButton) => {
      const triggerButton = document.createElement('button');
      triggerButton.textContent = triggerTranslations.openChat[lang];
      triggerButton.setAttribute('data-hds-component', 'button');
      triggerButton.setAttribute('data-hds-variant', 'secondary');
      triggerButton.addEventListener('click', () => {
        chatButton.click();
      });
      placeholder.replaceWith(triggerButton);
    });
  }

  window.addEventListener('DOMContentLoaded', init);
})();
