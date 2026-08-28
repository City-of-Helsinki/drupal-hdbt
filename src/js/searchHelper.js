(function focusSearchResultsBehavior(Drupal) {
  const PAGER_FLAG_KEY = 'hdbt_search_pager_clicked';

  function focusElement(element) {
    if (!element) return;
    element.setAttribute('tabindex', '-1');
    element.focus();
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  Drupal.behaviors.focusSearchResults = {
    attach: function attachFocusSearchResults(context) {
      // Focus to titles using the hdbt-search__results__title class.
      const titles = context.querySelectorAll('.hdbt-search__results__title');
      if (titles.length) {
        focusElement(titles[0]);
      }

      // Remember when the user clicks a pager link so the next page load
      // knows to focus the first result instead of the result count.
      context.querySelectorAll('.pager a').forEach((link) => {
        link.addEventListener('click', () => {
          sessionStorage.setItem(PAGER_FLAG_KEY, '1');
        });
      });

      // If the user just clicked a pager link, move focus to the first result
      // card on the new page. The flag is always cleared here so it never
      // carries over to an unrelated page visit.
      const pagerClicked = sessionStorage.getItem(PAGER_FLAG_KEY);
      sessionStorage.removeItem(PAGER_FLAG_KEY);
      if (pagerClicked && context.querySelector('.pager a')) {
        focusElement(context.querySelector('.card__link'));
        return;
      }

      // Skip focus management on the initial page load before the user has
      // submitted a search.
      if (!drupalSettings.theme?.searchActive) {
        return;
      }

      // Move focus to the result count heading after a search is completed.
      const resultCountEl = context.querySelector('[class$="__count"]');
      focusElement(resultCountEl);
    },
  };
})(Drupal);
