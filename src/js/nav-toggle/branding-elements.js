const BRANDING_ELEMENTS = {};
// TODO: This should be required only when the global menu is enabled.
const MenuDropdown = require('../nav-global/menu');

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
  MENU = MenuDropdown;
}

module.exports = {
  BRANDING_ELEMENTS,
  MENU
};
