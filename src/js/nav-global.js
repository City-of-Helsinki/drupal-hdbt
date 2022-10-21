const MenuDropdown = require('./nav-global/menu.js');
const ToggleWidgets = require('./nav-global/toggle-widgets');
const NavToggleDropdown = require('./nav-global/nav-toggle-dropdown');



let scrollP = null;
function scrollSave() {
  if (scrollP != null) {
    console.log('Skipping save');
  } else {
    scrollP = document.documentElement.scrollTop || document.body.scrollTop;
    console.log('Scroll saved:', scrollP);
  }
}
function scrollMove() {
  if (scrollP != null) {
    document.documentElement.scrollTop = document.body.scrollTop = scrollP;
    console.log('Scrolled to:', scrollP, 'resetting now to null');
    scrollP = null;
  } else {
    console.log('Was null, ignoring move');
  }
}

/**
 * Init Menus and bind them together so that only one menu is open at a time.
 */

MenuDropdown.init({
  beforeOpen: () => {
    scrollSave();
  },
  onOpen: () => {
    const scrollP2 = scrollP;
    scrollP = null;
    console.log('menu',scrollP2);
    OtherLangsDropdown.close();
    SearchDropdown.close();
    ToggleWidgets.close();
    scrollP = scrollP2;
    console.log('restoring from menu to', scrollP);
  },
  onClose: () => {
    scrollMove();
    ToggleWidgets.open();
  }
});

const OtherLangsDropdown = NavToggleDropdown();
OtherLangsDropdown.init({
  name: 'Other languages dropdown',
  buttonSelector: '.js-otherlangs-button',
  targetSelector: '#otherlangs',
  beforeOpen: () => {
    scrollSave();
  },
  onOpen: () => {
    const scrollP2 = scrollP;
    scrollP = null;
    console.log('otherlang', scrollP2);
    MenuDropdown.close();
    SearchDropdown.close();
    ToggleWidgets.close();
    scrollP = scrollP2;
    console.log('restoring from otherlang to', scrollP);

  },
  onClose: () => {
    scrollMove();
    ToggleWidgets.open();
  }
});

const SearchDropdown = NavToggleDropdown();
SearchDropdown.init({
  name: 'Search dropdown',
  buttonSelector: '.js-header-search__button',
  targetSelector: '#search',
  beforeOpen: () => {
    scrollSave();
  },
  onOpen: () => {
    const scrollP2 = scrollP;
    scrollP = null;
    console.log('search', scrollP2);
    MenuDropdown.close();
    OtherLangsDropdown.close();
    ToggleWidgets.close();
    window.setTimeout(() => document.querySelector('#search-form')?.focus(), 10); // Delay focus until element is focusable
    scrollP = scrollP2;
    console.log('restoring from search to', scrollP);
  },
  onClose: () => {
    scrollMove();
    ToggleWidgets.open();
  }
});


const closeFromOutside = ({ target }) => {
  if (target.closest('.desktop-menu, .header-top') || target.closest('.header') === null) {

    const scrollP2 = scrollP;
    scrollP = null;
    console.log('outside', scrollP2);
    MenuDropdown.close();
    OtherLangsDropdown.close();
    SearchDropdown.close();
    ToggleWidgets.open();
    scrollP = scrollP2;
    console.log('restoring from outside to', scrollP);
    scrollMove();
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

