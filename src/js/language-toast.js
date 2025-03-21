document.addEventListener('DOMContentLoaded', function () {
  const buttons = document.querySelectorAll('.nav-toggle__button.has-toast');

  function positionToast(button, toast) {
    if (!toast || !toast.classList.contains('nav-toggle-dropdown--language-toast')) {
      return;
    }

    // Get button and toast dimensions and position relative to the viewport.
    const rect = button.getBoundingClientRect();
    const buttonWidth = button.offsetWidth;
    const toastWidth = toast.offsetWidth;
    const viewportWidth = document.documentElement.clientWidth;
    const gutter = 16;

    // Positioning if the toast doesn't fit on the right side.
    if ((viewportWidth - rect.right) < ((toastWidth / 2) - (buttonWidth / 2) + gutter)) {
      const right = viewportWidth - rect.right - gutter;
      const toastArrowRight = ((viewportWidth - rect.right) - gutter) + (buttonWidth / 2);
      toast.style.left = 'auto';
      toast.style.transform = 'none';
      toast.style.right = `-${right}px`;
      toast.style.setProperty('--toast-arrow-left', 'auto');
      toast.style.setProperty('--toast-arrow-right', `${toastArrowRight}px`);
      toast.style.setProperty('--toast-arrow-transform', '50%');
    }

    // Positioning if the toast doesn't fit on the left side.
    if ((rect.left) < ((toastWidth / 2) - (buttonWidth / 2))) {
      const left = rect.left - gutter;
      const toastArrowLeft = (rect.left - gutter) + (buttonWidth / 2);
      toast.style.left = `-${left}px`;
      toast.style.transform = 'none';
      toast.style.setProperty('--toast-arrow-left', `${toastArrowLeft}px`);
    }
  }

  buttons.forEach(button => {
    button.addEventListener('click', function () {
      const buttonParent = button.parentElement; // Get parent of the button
      const toast = buttonParent.nextElementSibling;

      if (!toast || !toast.classList.contains('nav-toggle-dropdown--language-toast')) {
        return;
      }

      // Reset inline styles before applying new ones
      toast.removeAttribute('style');

      // Position and after that show the toast.
      positionToast(button, toast);
    });
  });

  // Handle resize event to reposition open toasts.
  window.addEventListener('resize', function () {
    document.querySelectorAll('.nav-toggle__button.has-toast').forEach(button => {
      const buttonParent = button.parentElement; // Get parent of the button
      const toast = buttonParent.nextElementSibling;
      if (toast && !toast.classList.contains('nav-toggle-dropdown--closed')) {
        toast.removeAttribute('style');
        positionToast(button, toast);
      }
    });
  });
});
