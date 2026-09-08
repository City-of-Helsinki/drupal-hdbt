/**
 * 3rd party Widgets are hidden using [data-] selectors
 * See _nav-toggle.scss
 */

const HIDE_SELECTORS = [
  '.si-toggle-container', // Siteimprove accessibility tool
  '.aca--button--desktop, .aca--button--mobile, .aca--widget--mobile, .aca--widget--desktop, #aca--widget-button-close', // Watson chatbot in asuminen
  '#telia-ace-leijuke', // Telia ACE chat leijuke
  '.humany-trigger, .humany-widget', // Telia ACE chat button and widget
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

module.exports = { close, open, HIDE_SELECTORS };
