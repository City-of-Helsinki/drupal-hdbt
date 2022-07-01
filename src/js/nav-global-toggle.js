document.addEventListener('DOMContentLoaded', () => {
  const widgetsToHideSelector = [
    '.cx-theme-helsinki-blue', // Genesys chat in kymp and sote
    '#smartti-wrapper', // Smartti chatbot in kymp
    '.aca--button--desktop, .aca--button--mobile, .aca--widget--mobile, .aca--widget--desktop', // Watson chatbot in asuminen
    '#block-kuurahealthchat', // Kuurahealth in sote
    '#ed11y-panel' // Editoria11y accessibility tool
  ];

  let toggle = document.querySelector('.js-menu-toggle-button');
  let menu = document.querySelector('#menu');

  function toggleWidgets(hide) {
    const widgets = document.querySelectorAll(widgetsToHideSelector.join(','));
    for (let i = 0; i < widgets.length; i++) {
      const widget = widgets[i];
      if (hide) {
        widget.dataset.cssmenuHide = true;
      } else {
        delete widget.dataset.cssmenuHide;
      }
    }
  }

  // Helper function to check if menu is open or not
  function isMenuOpen() {
    return window.location.hash === '#menu' || toggle.getAttribute('aria-expanded') === 'true';
  }

  function menuToggle() {
    if (isMenuOpen()) {
      toggle.setAttribute('aria-expanded', 'false');
      menu.dataset.target = 'false';
      window.location.hash = '';
      toggleWidgets(false);
    } else {
      toggleWidgets(true);
      menu.dataset.target = 'true';
      toggle.setAttribute('aria-expanded', 'true');
    }
    toggle.focus(); // We should always focus the menu button after toggling the menu
  }

  if (toggle) {
    toggle.addEventListener('click', menuToggle);

    // When url says that menu should be open and we have js enabled, switch to use js version instead.
    if (window.location.hash === '#menu') {
      window.location.hash = '';
      toggleWidgets(true);
      menu.dataset.target = 'true';
      toggle.setAttribute('aria-expanded', 'true');
    }
  }

  document.addEventListener('keydown', function (e) {
    if ((e.key == 'Escape' || e.key == 'Esc' || e.keyCode == 27) && isMenuOpen()) {
      menuToggle();
    }
  });

  if (menu) {
    menu.dataset.js = true; // Switch to use js-enhanced version instead of pure css version
  }
});
