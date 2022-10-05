const MenuDropdown = require('./nav-global/menu.js');
const ToggleWidgets = require('./nav-global/toggle-widgets');
const NavToggleDropdown = require('./nav-global/nav-toggle-dropdown');

/**
 * Init Menus and bind them together so that only one menu is open at a time.
 */

MenuDropdown.init({
  onOpen: () => {
    OtherLangsDropdown.close();
    SearchDropdown.close();
    ToggleWidgets.close();
  },
  onClose: ToggleWidgets.open,
});

const OtherLangsDropdown = NavToggleDropdown();
OtherLangsDropdown.init({
  name: 'Other languages dropdown',
  buttonSelector: '.js-otherlangs-button',
  targetSelector: '#otherlangs',
  onOpen: () => {
    MenuDropdown.close();
    SearchDropdown.close();
    ToggleWidgets.close();
  },
  onClose: ToggleWidgets.open,
});

const SearchDropdown = NavToggleDropdown();
SearchDropdown.init({
  name: 'Search dropdown',
  buttonSelector: '.js-header-search__button',
  targetSelector: '#search',
  onOpen: () => {
    MenuDropdown.close();
    OtherLangsDropdown.close();
    ToggleWidgets.close();
    window.setTimeout(
      () => document.querySelector('#search-form')?.focus(),
      10
    ); // Delay focus until element is focusable
  },
  onClose: ToggleWidgets.open,
});

const closeFromOutside = ({ target }) => {
  if (
    target.closest('.desktop-menu, .header-top') ||
    target.closest('.header') === null
  ) {
    MenuDropdown.close();
    OtherLangsDropdown.close();
    SearchDropdown.close();
    ToggleWidgets.open();
  }
};

/**
 * Attach outside click listener to the whole branding navigation area
 * so that OtherLangs Menu and Mega menu
 * can be closed when clicking outside of branding navi block
 */
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', closeFromOutside);
});
