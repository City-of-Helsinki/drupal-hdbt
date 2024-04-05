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

// Due to current ckeditor rules the custom element
// or custom property button are not available,
// this will insert the chat trigger element to page.
function addCustomTrigger(working = true) {
    const trigger = document.createElement('chat-trigger');
    if (working) {
        trigger.setAttribute('data-chat-trigger', 'aca-wbc-chat-app-button');
    } else {
        trigger.setAttribute('data-chat-trigger', 'this does not work');
    }
    trigger.textContent = 'Trigger element content; I will disappear';
    document.querySelector('.component__content.columns--50-50 div').appendChild(trigger);
}

function init() {
    // Get the language, fallback to english.
    const lang = window?.drupalSettings?.path?.currentLanguage || 'fi';

    // There could be a possibility of using a custom HTML tag.
    const chatTrigger = document.querySelector('chat-trigger');

    if (!chatTrigger) {
        // This page doesn't have a chat trigger.
        return;
    }

    // Search for trigger target element - a chatbox.
    const targetElementName = chatTrigger.dataset.chatTrigger;
    if (typeof targetElementName !== 'string') {
        // The target element name is somehow invalid
        return;
    }

    const chatElement = document.querySelector(targetElementName);
    if (!chatElement) {
        // The trigger is present but the chat is not available,
        // show fallback.
        const fallBack = document.createElement('p');
        fallBack.textContent = triggerTranslations.fallBack[lang];
        chatTrigger.replaceWith(fallBack);
        return;
    }

    // Create a function for clicking the chat open. Could be moved
    // to the eventListener when the workaround becomes redundant.
    const clickChatBox = () => {
        // Due to the chat being live and connected, we shall not
        // actually click the button. Using alert for feedback.
        alert('*BLOCKS YOUR PATH*');
        console.log(chatElement.querySelector('button'));
        // chatElement.querySelector('button').click();
    };

    // Target element found, turn chat-trigger into a button
    // and add an eventListener for it.
    const chatButton = document.createElement('button');
    chatButton.textContent = triggerTranslations.openChat[lang];
    chatButton.addEventListener('click', clickChatBox);

    // Possibly wrong styling
    chatButton.setAttribute('data-hds-component', 'button');
    chatTrigger.replaceWith(chatButton);
}

// The load event might not be the optimal one in production.
// We need to make sure that the chat has time to initialize
// before the trigger script is evaluated.
window.addEventListener('load', () => {
    // The console is filled with all kinds of messages,
    // use delay to clear it before debugging.
    const DELAY = 0;
    setTimeout(() => {
        console.clear();
        init();
    }, DELAY);
});

// Development helper to bypass ckeditor filtering.
// Remove this and the addCustomTrigger -function
// when the feature is finished.
window.addEventListener('DOMContentLoaded', () => {
    // Add trigger for correct or incorrect selector
    addCustomTrigger(true);
    // addCustomTrigger(false);
});
