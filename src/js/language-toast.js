import { positionDropdown } from './position-dropdown';

document.addEventListener('DOMContentLoaded', function languageToastPositioning() {
  const buttons = document.querySelectorAll('.nav-toggle__button.has-toast');

  // Handle click event and position the toast correctly before opening it.
  buttons.forEach(button => {
    button.addEventListener('click', function languageToastClick() {
      const buttonParent = button.parentElement;
      const toast = buttonParent.nextElementSibling;

      if (!toast || !toast.classList.contains('nav-toggle-dropdown--language-toast')) {
        return;
      }

      // Reset inline styles before applying new ones.
      toast.removeAttribute('style');

      // Position and after that show the toast.
      positionDropdown(button);
    });
  });

  // Handle resize event to reposition open toasts.
  window.addEventListener('resize', function languageToastResize() {
    document.querySelectorAll('.nav-toggle__button.has-toast').forEach(button => {
      const buttonParent = button.parentElement;
      const toast = buttonParent.nextElementSibling;

      if (toast && !toast.classList.contains('nav-toggle-dropdown--closed')) {
        toast.removeAttribute('style');
        positionDropdown(button);
      }
    });
  });
});
