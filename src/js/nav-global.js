const MobilePanel = require('./nav-global/mobilepanel.js');
const OtherLangsDropdown = require('./nav-global/otherlangs');
const SearchDropdown = require('./nav-global/search');

/**
 * Init Menus and bind them together so that only one menu is open at a time.
 */

const closeFromLang = ()=> {
  MobilePanel.close();
  SearchDropdown.close();
};

const closeFromMenu = ()=> {
  OtherLangsDropdown.close();
  SearchDropdown.close();
};

const closeFromSearch = ()=> {
  OtherLangsDropdown.close();
  MobilePanel.close();
};

OtherLangsDropdown.init({
  onOpen:closeFromLang
});

MobilePanel.init({
  onOpen:closeFromMenu
});

SearchDropdown.init({
  onOpen:closeFromSearch
});

/**
 * Attach outside click listener to the whole branding navigation area
 * so that OtherLangs Menu and Mega menu
 * can be closed when clicking outside of branding navi block
 */
document.addEventListener('click',function({target}){

  if(target.closest('.header') === null) {
    MobilePanel.close();
    SearchDropdown.close();
    OtherLangsDropdown.close();
  }

});
