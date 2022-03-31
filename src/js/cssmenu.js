document.addEventListener('DOMContentLoaded', () => {
  var toggle = document.querySelector('.js-cssmenu-toggle-button');
  var checkbox = document.querySelector('.js-cssmenu-toggle-checkbox');

  function checkboxToggle() {
    if (checkbox.checked) {
      toggle.setAttribute('aria-expanded', 'false');
      checkbox.checked = false;
      toggle.focus();
    } else {
      checkbox.checked = true;
      toggle.setAttribute('aria-expanded', 'true');
    }
  }

  toggle.addEventListener('click', checkboxToggle);

  document.addEventListener('keydown', function (e) {
    if ((e.key == 'Escape' || e.key == 'Esc' || e.keyCode == 27) && checkbox.checked) {
      checkboxToggle();
    }
  });

  checkbox.dataset.js = true; // Switch to use js-enhanced version instead of pure css version
});
