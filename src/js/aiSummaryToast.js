/**
 * AI summary info toast.
 *
 * Toggles the toast above/below the info-circle button in the AI summary header.
 * Positioning is done in toastPositioner library (hdbt/toast-positioner).
 */

((Drupal, once) => {
  const POSITION_OPTIONS = { flipVertical: true, defaultAbove: true };

  Drupal.behaviors.aiSummaryToast = {
    attach(context) {
      once('ai-summary-toast', '.ai-summary__info-button', context).forEach((button) => {
        const toastId = button.getAttribute('aria-controls');
        const toastWrapper = document.getElementById(toastId);

        if (!toastWrapper) return;

        const container = button.closest('.ai-summary__info-wrapper');
        const closeButton = toastWrapper.querySelector('.ai-summary__toast-close');

        const isOpen = () => button.getAttribute('aria-expanded') === 'true';

        // returnFocus: true only when closing with keyboard (ESC) or pressing the close button.
        // It is not used for focus-out and outside-click so that we don't steal focus from
        // wherever the user has intentionally moved to.
        const close = (returnFocus = false) => {
          if (!isOpen()) return;
          toastWrapper.setAttribute('hidden', '');
          button.setAttribute('aria-expanded', 'false');
          if (returnFocus) button.focus();
          Drupal.toastPositioner.unregisterOpen(toastWrapper);
        };

        const open = () => {
          // Neat trick to position the toast: make the wrapper layout-visible
          // but not user-visible so the toastPositioner can measure it before
          // the user sees it.
          toastWrapper.style.visibility = 'hidden';
          toastWrapper.removeAttribute('hidden');
          Drupal.toastPositioner.positionToast(button, toastWrapper, POSITION_OPTIONS);

          toastWrapper.style.removeProperty('visibility');
          button.setAttribute('aria-expanded', 'true');
          Drupal.toastPositioner.registerOpen(button, toastWrapper, POSITION_OPTIONS);

          if (container) {
            Drupal.toastPositioner.attachFocusOut(container, close, [button]);
          }
        };

        // Button event listener to toggle between open and close.
        button.addEventListener('click', () => {
          isOpen() ? close() : open();
        });

        // Close actions so that we can return focus to the trigger.
        closeButton?.addEventListener('click', () => close(true));

        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && isOpen()) {
            close(true);
          }
        });

        // Outside-click handler: If the user clicks anything on the page
        // that isn't the toast itself or the trigger.
        document.addEventListener('click', (e) => {
          if (isOpen() && !button.contains(e.target) && !toastWrapper.contains(e.target)) {
            close();
          }
        });
      });
    },
  };
})(Drupal, once);
