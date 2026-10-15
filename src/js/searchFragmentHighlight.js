/**
 * Highlight a content section when arriving from site search.
 *
 * Search result links append an ":hl" marker to the fragment
 * (e.g. #my-heading:hl). On arrival we strip the marker, scroll to
 * the heading, and use the CSS Highlight API from that heading through the
 * end of the wrapping .component__container.
 */

((Drupal) => {
  const HIGHLIGHT_MARKER = ':hl';
  const HIGHLIGHT_NAME = 'search-fragment';

  /**
   * Parse location.hash for a search highlight request.
   *
   * @returns {{ id: string } | null}
   */
  const parseHighlightHash = () => {
    const raw = window.location.hash.replace(/^#/, '');
    if (!raw.endsWith(HIGHLIGHT_MARKER)) {
      return null;
    }

    const id = raw.slice(0, -HIGHLIGHT_MARKER.length);
    if (!id) {
      return null;
    }

    return { id };
  };

  /**
   * Replace the URL hash with the clean fragment id (no :hl marker).
   *
   * @param {string} id
   */
  const cleanHash = (id) => {
    const url = new URL(window.location.href);
    url.hash = id;
    window.history.replaceState(window.history.state, '', url);
  };

  /**
   * Highlight from the fragment element through the end of its container.
   *
   * @param {HTMLElement} start
   * @param {HTMLElement} container
   */
  const applyHighlight = (start, container) => {
    if (window.Highlight && CSS.highlights) {
      const range = document.createRange();
      range.setStartBefore(start);
      range.setEnd(container, container.childNodes.length);
      CSS.highlights.set(HIGHLIGHT_NAME, new Highlight(range));
      return;
    }

    // Coarse fallback when Highlight API is unavailable.
    container.classList.add('search-fragment-highlight');
  };

  /**
   * Scroll to heading and highlight from it to the end of its container.
   *
   * @param {string} id
   */
  const highlightFragment = (id) => {
    const heading = document.getElementById(id);
    if (!heading) {
      return;
    }

    cleanHash(id);
    heading.scrollIntoView({ block: 'start' });

    const container = heading.closest('.component__container');
    if (!container) {
      return;
    }

    applyHighlight(heading, container);
  };

  Drupal.behaviors.searchFragmentHighlight = {
    attach: (context) => {
      if (context !== document) {
        return;
      }

      const request = parseHighlightHash();
      if (!request) {
        return;
      }

      highlightFragment(request.id);
    },
  };
})(Drupal);
