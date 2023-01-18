const BRANDING_ELEMENTS = {};
let MENU = {};

if (drupalSettings.hdbt.profile_dropdown === true) {
  BRANDING_ELEMENTS.ProfileDropdown = 'profile';
}

if (drupalSettings.hdbt.search_dropdown === true) {
  BRANDING_ELEMENTS.SearchDropdown = 'search';
}

if (drupalSettings.hdbt.otherlangs_dropdown === true) {
  BRANDING_ELEMENTS.OtherLangsDropdown = 'otherlangs';
}

if (drupalSettings.hdbt.global_menu === true) {
  import('../nav-global/menu').then((MenuDropdown)=>{
    MENU = MenuDropdown;
  });
}

module.exports = {
  BRANDING_ELEMENTS,
  MENU
};
