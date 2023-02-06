/**
 * 3rd party Widgets are hidden using [data-] selectors
 * See _menu_toggle.scss, _mobile_navigation.scss
 */

const HIDE_SELECTORS = [
  '#chat-leijuke-wrapper', // Chat Leijuke for loading specific chats
  '.si-toggle-container', // Siteimprove accessibility tool
  '.cx-theme-helsinki-blue', // Genesys chat in kymp and sote
  '#smartti-wrapper',
  // Smartti chatbot in kymp
  '.aca--button--desktop, .aca--button--mobile, .aca--widget--mobile, .aca--widget--desktop, #aca--widget-button-close', // Watson chatbot in asuminen
  '#block-kuurahealthchat', // Kuurahealth in sote
  '#ed11y-panel', // Editoria11y accessibility tool
  '#sliding-popup', // Cookie banner
];

const close = () => {
  document.querySelectorAll(HIDE_SELECTORS.join(',')).forEach((widget) => {
    widget.dataset.cssmenuHide = true;
  });
};

const open = () => {
  document.querySelectorAll(HIDE_SELECTORS.join(',')).forEach((widget) => {
    delete widget.dataset.cssmenuHide;
  });
};

const setHide = (hide) => {
  (hide === true ? close : open)();
};

module.exports = {
  setHide,
  close,
  open,
  HIDE_SELECTORS,
};
