/**
  * 3rd party Widgets are hidden using [data-] selectors
  * See _menu_toggle.scss, _mobile_navigation.scss
  */

const HIDE_SELECTORS = [
  'chat-leijuke-wrapper',
  '.si-toggle-container', // Siteimprove accessibility tool
  '.cx-theme-helsinki-blue', // Genesys chat in kymp and sote
  '#smartti-wrapper', // Smartti chatbot in kymp
  '.aca--button--desktop, .aca--button--mobile, .aca--widget--mobile, .aca--widget--desktop, #aca--widget-button-close', // Watson chatbot in asuminen
  '#block-kuurahealthchat', // Kuurahealth in sote
  '#ed11y-panel' // Editoria11y accessibility tool
];
  
function toggle(hide) {
  const SELECTORS = HIDE_SELECTORS.join(',');
  console.log(SELECTORS);
  document.querySelectorAll(SELECTORS).forEach(widget => {
    if(hide) {
      widget.dataset.cssmenuHide = true;
    } else {
      delete widget.dataset.cssmenuHide;
    }
  });
}
  

module.exports =  {
  toggle,
  HIDE_SELECTORS
};