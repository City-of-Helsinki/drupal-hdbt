import { positionDropdown } from './position-dropdown';

((Drupal) => {
  Drupal.behaviors.languageToastPositioning = {
    attach(context) {
      if (context !== document || window.languageToastInitialized) {
        return;
      }

      // Handle click event and position the toast correctly before opening it.
      const buttons = context.querySelectorAll('.nav-toggle__button.has-toast');

      buttons.forEach(button => {
        // Prevent attaching multiple listeners (important for AJAX/BigPipe re-runs)
        if (button.dataset.toastInitialized) return;

        button.addEventListener('click', () => {
          const buttonParent = button.parentElement;
          const toast = buttonParent?.nextElementSibling;

          if (!toast || !toast.classList.contains('nav-toggle-dropdown--language-toast')) {
            return;
          }

          positionDropdown(button, button, { isToast: true });
        });

        button.dataset.toastInitialized = 'true'; // Mark as initialized
      });

      // Ensure only one resize listener is added globally.
      if (!window.__toastResizeBound) {
        window.addEventListener('resize', () => {
          document.querySelectorAll('.nav-toggle__button.has-toast').forEach(button => {
            const buttonParent = button.parentElement;
            const toast = buttonParent?.nextElementSibling;

            if (toast && !toast.classList.contains('nav-toggle-dropdown--closed')) {
              positionDropdown(button, button, { isToast: true });
            }
          });
        });

        window.__toastResizeBound = true;
      }

      window.languageToastInitialized = true;
    }
  };
})(Drupal);
