((Drupal, drupalSettings, once) => {
  // Cache the fetch per language so re-focusing doesn't refetch.
  const suggestionsByLang = {};

  function fetchSuggestions(lang) {
    if (!suggestionsByLang[lang]) {
      suggestionsByLang[lang] = fetch(`/${lang}/api/v1/search-suggestions`)
        .then((response) => (response.ok ? response.json() : []))
        .catch(() => []);
    }
    return suggestionsByLang[lang];
  }

  Drupal.behaviors.hdbtSearchSuggestions = {
    attach(context) {
      once('hdbt-search-suggestions', '[data-search-suggestions]', context).forEach((input) => {
        const form = input.closest('.helfi-search__form');
        const anchor = input.closest('.hds-search-input__input') || input;
        if (!form) return;

        // Close suggestions once focus leaves the input and its buttons,
        // not the whole dropdown/form.
        const boundary = input.parentElement || form;

        const list = document.createElement('ul');
        list.className = 'hdbt-search-suggestions';
        list.hidden = true;
        anchor.insertAdjacentElement('afterend', list);

        const close = () => {
          list.hidden = true;
          list.innerHTML = '';
        };

        // Clicking blank space in the list (not a suggestion, not the
        // scrollbar) closes it, so it doesn't stay open over whatever
        // is behind it.
        list.addEventListener('mousedown', (event) => {
          const clickedScrollbar = event.target === list && event.offsetX >= list.clientWidth;
          if (!clickedScrollbar && !event.target.closest('button')) {
            close();
          }
        });

        const open = (suggestions) => {
          list.innerHTML = '';
          if (!suggestions.length) {
            close();
            return;
          }
          suggestions.forEach(({ term }) => {
            const item = document.createElement('li');
            const button = document.createElement('button');
            item.className = 'hdbt-search-suggestions__option';
            button.type = 'button';
            button.className = 'hdbt-search-suggestions__option__button';
            button.textContent = term;
            button.addEventListener('click', () => {
              input.value = term;
              close();
              form.requestSubmit();
            });
            item.appendChild(button);
            list.appendChild(item);
          });
          list.hidden = false;
        };

        const showSuggestions = () => {
          fetchSuggestions(drupalSettings.path?.currentLanguage || 'fi').then(open);
        };

        // Suggestions are not autocomplete dropdown: they only make sense
        // for an empty input, whether that's on focus, after clearing, or
        // after typing something and then deleting it again.
        input.addEventListener('focus', () => {
          if (input.value === '') {
            showSuggestions();
          }
        });

        input.addEventListener('input', () => {
          if (input.value === '') {
            showSuggestions();
          } else {
            close();
          }
        });

        // No trigger buttons here, so there's nothing to wait for Safari to
        // settle focus onto - skip the default 300ms margin.
        Drupal.toastPositioner.attachFocusOut(boundary, close, [], { delay: 10 });
      });
    },
  };
})(Drupal, drupalSettings, once);
