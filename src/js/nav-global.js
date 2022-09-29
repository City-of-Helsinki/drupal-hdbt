const MobilePanel = require('./nav-global/mobilepanel.js');
const OtherLangsDropdown = require('./nav-global/otherlangs');
const SearchDropdown = require('./nav-global/search');
const ToggleWidgets = require('./nav-global/toggle-widgets');

/**
 * Init Menus and bind them together so that only one menu is open at a time.
 */

const closeFromLang = ()=> {
  MobilePanel.close();
  SearchDropdown.close();
  ToggleWidgets.close();
};

const closeFromMenu = ()=> {
  OtherLangsDropdown.close();
  SearchDropdown.close();
  ToggleWidgets.close();
};

const closeFromSearch = ()=> {
  OtherLangsDropdown.close();
  MobilePanel.close();
  ToggleWidgets.close();
};

const closeFromOutside = ({target})=> {
  if(target.closest('.header') === null) {
    MobilePanel.close();
    SearchDropdown.close();
    OtherLangsDropdown.close();
    ToggleWidgets.open();
  }
};

OtherLangsDropdown.init({
  onOpen:closeFromLang,
  onClose:ToggleWidgets.open
});

MobilePanel.init({
  onOpen:closeFromMenu,
  onClose:ToggleWidgets.open
});

SearchDropdown.init({
  onOpen:closeFromSearch,
  onClose:ToggleWidgets.open
});

/**
 * Attach outside click listener to the whole branding navigation area
 * so that OtherLangs Menu and Mega menu
 * can be closed when clicking outside of branding navi block
 */
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click',closeFromOutside);
});

