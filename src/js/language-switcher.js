// Set constants.
const languageSwitcherButton = document.querySelector(
  '#language-switcher-toggle'
);
const languageSwitcherDropdown = document.querySelector(
  '#language-switcher-dropdown'
);

// Button event handler.
function handleDropdown(event) {
  const withinBoundaries = event
    .composedPath()
    .includes(languageSwitcherButton);

  // If language switcher button has been clicked.
  if (withinBoundaries) {
    // Handle classes for the language switcher buttons.
    if (languageSwitcherButton.classList.contains('is-active')) {
      languageSwitcherButton.classList.remove('is-active');
    } else {
      languageSwitcherButton.classList.add('is-active');
    }

    // Handle classes for the language switcher dropdowns.
    if (languageSwitcherDropdown.classList.contains('is-active')) {
      languageSwitcherDropdown.classList.remove('is-active');
      languageSwitcherDropdown.setAttribute('aria-hidden', 'true');
    } else {
      languageSwitcherDropdown.classList.add('is-active');
      languageSwitcherDropdown.setAttribute('aria-hidden', 'false');
    }
  }
  // If there was an outside click.
  else {
    // Check if something in the dropdown was clicked, before removing the active classes.
    const linkClicked = event.composedPath().includes(languageSwitcherDropdown);

    // Handle classes for the language switcher buttons.
    if (
      languageSwitcherButton.classList.contains('is-active') &&
      !linkClicked
    ) {
      languageSwitcherButton.classList.remove('is-active');
    }

    // Handle classes for the language switcher dropdowns.
    if (
      languageSwitcherDropdown.classList.contains('is-active') &&
      !linkClicked
    ) {
      languageSwitcherDropdown.classList.remove('is-active');
    }
  }
}

// Add event listeners.
document.addEventListener('DOMContentLoaded', function () {
  // Check if language switcher button exists and add the event listeners.
  if (languageSwitcherButton) {
    document.addEventListener('click', handleDropdown);
  }
});
