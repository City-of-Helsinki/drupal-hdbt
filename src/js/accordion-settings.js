document.addEventListener('DOMContentLoaded', function () {
  const accordions = document.getElementsByClassName('accordion-item');

  // Function used to save the accordion open state to localStorage.
  function saveToLocalStorage(accordion) {
    let accordionId = accordion.getAttribute('id');
    if (accordion.hasAttribute('open')) {
      localStorage.setItem(accordionId, 'false');
    } else {
      localStorage.setItem(accordionId, 'true');
    }
  }

  // Moving the focus to accordion summary when clicking the close button.
  function moveFocus(element) {
    element
      .closest('.accordion-item')
      .querySelector('.accordion-item__summary')
      .focus();
  }

  for (let singleAccordion of accordions) {
    // Get accordion id so we can assign open value on it in localStorage.
    let singleAccordionId = singleAccordion.getAttribute('id');

    // Find the summary element of the accordion.
    let summary = singleAccordion.querySelector(
      '.accordion-item__summary'
    );

    // Find also the associated close button of the accordion.
    let closeButton = singleAccordion.querySelector(
      '.accordion-item__button--close'
    );

    // Open accordions that have been open previously.
    if (localStorage.getItem(singleAccordionId) === 'true') {
      singleAccordion.open = true;
    }

    // Opening the accordion from the summary text should trigger saving of the open state of the accordion.
    summary.addEventListener('mousedown', function (e) {
      saveToLocalStorage(this.parentElement);
    });

    summary.addEventListener('keypress', function (e) {
      if (e.which === 13 || e.which === 32) {
        saveToLocalStorage(this.parentElement);
      }
    });

    // Close button should close the accordion and save the state of that accordion to localStorage.
    closeButton.addEventListener('mousedown', function (e) {
      let parentAccordion = this.closest('.accordion-item');

      e.preventDefault();
      saveToLocalStorage(parentAccordion);
      parentAccordion.open = false;
      moveFocus(this);
    });

    closeButton.addEventListener('keypress', function (e) {
      if (e.which === 13 || e.which === 32) {
        let parentAccordion = this.closest('.accordion-item');

        e.preventDefault();
        saveToLocalStorage(parentAccordion);
        parentAccordion.open = false;
        moveFocus(this);
      }
    });
  }
});
