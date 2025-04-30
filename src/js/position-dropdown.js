/**
 * General purpose dropdown positioner.
 * Use this class if you need to position dropdown so that it won't
 * go under the browser window when close to it.
 */


const positionDropdown = (button, gutter = 16) => {
  const buttonParent = button.parentElement;
  const dropDown = buttonParent.nextElementSibling;

  // Get button and toast dimensions and position relative to the viewport.
  const rect = button.getBoundingClientRect();
  const buttonWidth = button.offsetWidth;
  const dropDownWidth = dropDown.offsetWidth;
  const viewportWidth = document.documentElement.clientWidth;

  // Positioning if the toast doesn't fit on the right side.
  if ((viewportWidth - rect.right) < ((dropDownWidth / 2) - (buttonWidth / 2) + gutter)) {
    const right = viewportWidth - rect.right - gutter;
    const toastArrowRight = ((viewportWidth - rect.right) - gutter) + (buttonWidth / 2);

    dropDown.style.left = 'auto';
    dropDown.style.transform = 'none';
    dropDown.style.right = `-${right}px`;
    dropDown.style.setProperty('--toast-arrow-left', 'auto');
    dropDown.style.setProperty('--toast-arrow-right', `${toastArrowRight}px`);
    dropDown.style.setProperty('--toast-arrow-transform', '50%');
  }

  // Positioning if the toast doesn't fit on the left side.
  if ((rect.left) < ((dropDownWidth / 2) - (buttonWidth / 2) + gutter)) {
    const left = rect.left - gutter;
    const toastArrowLeft = (rect.left - gutter) + (buttonWidth / 2);

    dropDown.style.left = `-${left}px`;
    dropDown.style.transform = 'none';
    dropDown.style.setProperty('--toast-arrow-left', `${toastArrowLeft}px`);
  }
};

module.exports = {
  positionDropdown,
};
