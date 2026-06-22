/**
 * AI summary expander.
 *
 * Collapses AI summary content behind a gradient and a toggle button.
 */

((Drupal, once) => {
  // Must match $ai-summary-collapsed-height in _ai-summary.scss.
  const COLLAPSE_HEIGHT = 80;

  Drupal.behaviors.aiSummaryExpander = {
    attach(context) {
      once('ai-summary-expander', '.ai-summary', context).forEach((summary) => {
        const body = summary.querySelector('.ai-summary__body');
        const toggleButton = summary.querySelector('.ai-summary__toggle');
        const label = summary.querySelector('.ai-summary__toggle-label');
        const description = summary.querySelector('.ai-summary__toggle-description');

        if (!body || !toggleButton || !label) return;

        const isExpanded = () => toggleButton.getAttribute('aria-expanded') === 'true';

        // Fetch the UI-texts that are provided in the template as data-attributes.
        const labelCollapsed = toggleButton.dataset.labelCollapsed;
        const labelExpanded = toggleButton.dataset.labelExpanded;
        const descCollapsed = toggleButton.dataset.descriptionCollapsed;
        const descExpanded = toggleButton.dataset.descriptionExpanded;

        const updateLabel = (expanded) => {
          label.textContent = expanded ? labelExpanded : labelCollapsed;
          if (description) {
            description.textContent = expanded ? descExpanded : descCollapsed;
          }
          toggleButton.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        };

        const expand = () => {
          body.style.height = `${body.scrollHeight}px`;
          body.addEventListener('transitionend', () => {
            body.classList.remove('ai-summary__body--collapsed');
            body.style.height = '';
          }, { once: true });
        };

        const collapse = () => {
          body.classList.add('ai-summary__body--collapsed');
          // Set the current rendered height. This way the transition starts
          // from the correct value since body might be set to auto after expanding.
          body.style.height = `${body.offsetHeight}px`;
          // requestAnimationFrame defers setting the target height by one animation frame
          // so the browser has time to register the exact starting height set on the line above.
          // Without it, both height assignments happen in the same JavaScript task and this
          // would cause the summary to just jump straight to COLLAPSE_HEIGHT without animation.
          requestAnimationFrame(() => {
            body.style.height = `${COLLAPSE_HEIGHT}px`;
          });
        };

        // Initialize collapsed state without triggering the CSS transition.
        // Temporarily override transition, set height, force a reflow so the
        // browser registers the new value, then re-enable the transition.
        body.style.transition = 'none';
        body.style.height = `${COLLAPSE_HEIGHT}px`;
        body.classList.add('ai-summary__body--collapsed');
        // eslint-disable-next-line no-unused-expressions
        body.offsetHeight; // force layout
        body.style.transition = '';

        toggleButton.removeAttribute('hidden');
        updateLabel(false);

        toggleButton.addEventListener('click', () => {
          const expanding = !isExpanded();
          updateLabel(expanding);
          // Run animation.
          expanding ? expand() : collapse();
        });
      });
    },
  };
})(Drupal, once);
