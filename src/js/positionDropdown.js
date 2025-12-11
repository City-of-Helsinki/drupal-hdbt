/**
 * General purpose dropdown positioner.
 * Use this class if you need to position dropdown so that it won't
 * go under the browser window when close to it.
 */

const positionDropdown = (button, relativeElement, options = {}) => {
  const { isToast = false } = options;
  const { gutter = 16 } = options;
  const buttonParent = button.parentElement;
  const dropDown = buttonParent.nextElementSibling;

  // Get button, relative element and dropdown dimensions and position
  // relative to the viewport.
  const dropDownRect = dropDown.getBoundingClientRect();
  const relativeElementRect = relativeElement.getBoundingClientRect();
  const buttonRect = button.getBoundingClientRect();
  const buttonWidth = button.offsetWidth;
  const viewportWidth = document.documentElement.clientWidth;

  // Positioning if the dropdown doesn't fit on the RIGHT side.
  if (viewportWidth - dropDownRect.right < gutter) {
    const right = viewportWidth - relativeElementRect.right - gutter;
    dropDown.style.left = 'auto';
    dropDown.style.transform = 'none';
    dropDown.style.right = `-${right}px`;

    // If the dropdown is a toast handle the css variables.
    if (isToast) {
      const toastArrowRight = viewportWidth - buttonRect.right - gutter + buttonWidth / 2;
      dropDown.style.setProperty('--toast-arrow-left', 'auto');
      dropDown.style.setProperty('--toast-arrow-right', `${toastArrowRight}px`);
      dropDown.style.setProperty('--toast-arrow-transform', '50%');
    }
  }

  // Positioning if the dropdown doesn't fit on the LEFT side.
  if (dropDownRect.left < gutter) {
    const left = relativeElementRect.left - gutter;
    dropDown.style.left = `-${left}px`;
    dropDown.style.transform = 'none';

    // If the dropdown is a toast handle the css variables.
    if (isToast) {
      const toastArrowLeft = buttonRect.left - gutter + buttonWidth / 2;
      dropDown.style.setProperty('--toast-arrow-left', `${toastArrowLeft}px`);
    }
  }
};

module.exports = { positionDropdown };
