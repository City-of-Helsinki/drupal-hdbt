/**
 * Search monitor helper functions.
 */
((Drupal) => {
  Drupal.behaviors.searchMonitorHelper = {
    attach: (context) => {
      const buttons = context.querySelectorAll('.hdbt-search__search-monitor__button[data-hds-component="button"]');
      buttons.forEach((button) => {
        if (button.dataset.searchMonitorAttached) return;
        button.dataset.searchMonitorAttached = '1';

        button.addEventListener('click', (e) => {
          e.preventDefault();
          const openEvent = new CustomEvent('hdbt:search-monitor:open', { detail: { button } });
          window.dispatchEvent(openEvent);
          button.setAttribute('aria-expanded', 'true');
        });
      });
    },
  };
})(Drupal);
