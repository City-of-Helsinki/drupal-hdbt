const BRANDING_ELEMENTS = {};

if (drupalSettings.hdbt.profile_dropdown === true) {
  BRANDING_ELEMENTS.ProfileDropdown = 'profile';
}

if (drupalSettings.hdbt.search_dropdown === true) {
  BRANDING_ELEMENTS.SearchDropdown = 'search';
}

if (drupalSettings.hdbt.otherlangs_dropdown === true) {
  BRANDING_ELEMENTS.OtherLangsDropdown = 'otherlangs';
}

module.exports = {
  BRANDING_ELEMENTS
};
