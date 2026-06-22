((Drupal) => {
  Drupal.behaviors.languageToastPositioning = {
    attach(context) {
      if (context !== document || window.languageToastInitialized) {
        return;
      }

      // Position the toast correctly whenever its trigger button is clicked.
      const buttons = context.querySelectorAll('.nav-toggle__button.has-toast');

      buttons.forEach((button) => {
        if (button.dataset.toastInitialized) return;

        button.addEventListener('click', () => {
          const navToggle = button.parentElement;
          const dropdown = navToggle?.nextElementSibling;

          if (!dropdown || !dropdown.classList.contains('nav-toggle-dropdown--language-toast')) {
            return;
          }

          Drupal.toastPositioner.positionToast(button, dropdown);
        });

        button.dataset.toastInitialized = 'true';
      });

      window.languageToastInitialized = true;
    },
  };
})(Drupal);
