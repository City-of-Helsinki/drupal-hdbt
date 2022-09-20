
const Panel = require('./nav-global/mobilepanel.js');
const OtherLangsDropdown = require('./nav-global/otherlangs');


OtherLangsDropdown.init();
Panel.init();

/**
 * Attach outside click listener to the whole branding navigation area
 * so that OtherLangs Menu and Mega menu 
 * can be closed when clicking outside of branding navi block
 */
document.addEventListener('click',function(e){
  console.log(e.target);

});