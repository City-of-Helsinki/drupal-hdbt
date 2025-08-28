(function focusSearchResultsBehavior(Drupal) {
  function focusElement(element) {
    if (!element) return;
    element.setAttribute('tabindex', '-1');
    element.focus();
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  Drupal.behaviors.focusSearchResults = {
    attach: function attachFocusSearchResults(context, settings) {
      // Focus the first results title in the current context
      const titles = context.querySelectorAll('.hdbt-search__results__title');
      if (titles.length) {
        focusElement(titles[0]);
      }

      // Handle result count from Views AJAX
      if (settings.views && settings.views.ajaxViews) {
        Object.values(settings.views.ajaxViews).forEach((viewDataArray) => {
          viewDataArray.forEach((viewData) => {
            const resultsContainer = context.querySelector(
              `[data-id-number="${viewData.view_dom_id}"]`
            );
            if (resultsContainer) {
              const resultCountEl = resultsContainer.querySelector('[class$="__count-container"]');
              focusElement(resultCountEl);
            }
          });
        });
      }
    }
  };
})(Drupal);
