const Panel = require('./nav-global/mobilepanel.js');
const OtherLangsDropdown = require('./nav-global/otherlangs');


/**
 * Init otherlangs menu and Mobile panel menu.
 * Bind them together so that only one menu is open at a time.  
 */

OtherLangsDropdown.init({
  onOpen:()=>{
    if( Panel.menuIsOpen()) {
      console.log('menu is open');
      Panel.menuToggle();
    }
  }
});

Panel.init({
  onOpen:()=>{
    if( OtherLangsDropdown.isOpen()) {
      OtherLangsDropdown.toggle(false);
    }
  }
});

/**
 * Attach outside click listener to the whole branding navigation area
 * so that OtherLangs Menu and Mega menu 
 * can be closed when clicking outside of branding navi block
 */
document.addEventListener('click',function({target}){
 
  if(target.closest('.header') === null) {
    // Funky little shortcut here: Panel.menuIsOpen will respond to 
    // megamenu as well as mobilemenu so this works.
    if(Panel.menuIsOpen()) {
      Panel.menuToggle();
    }
    
    if(OtherLangsDropdown.isOpen()) {
      OtherLangsDropdown.toggle(true);
    }
  }

});