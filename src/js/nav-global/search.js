const SearchDropdown = {
  HASH_ID: '#search',
  buttonSelector: '.js-header-search__button',
  buttonInstance: null,
  running: false,
  targetNode: null,
  onOpen: null,
  isOpen:function(){
    return window.location.hash === this.HASH_ID || this.targetNode.dataset.target === 'true';
  },
  close:function(){
    this.buttonInstance.setAttribute('aria-expanded', 'false');
    this.targetNode.dataset.target = 'false';
    if(this.onClose) {
      this.onClose();
    }
  },
  open:function(){
    this.buttonInstance.setAttribute('aria-expanded', 'true');
    this.targetNode.dataset.target = 'true';
    if(this.onOpen) {
      this.onOpen();
    }
  },
  toggle:function(){
    if(this.isOpen()) { 
      this.close();
    } else { 
      this.open();
    }
    this.buttonInstance.focus();
  },
  addListeners: function(){
    // Close menu on ESC
    document.addEventListener('keydown', (e) => {
      if ((e.key == 'Escape' || e.key == 'Esc' || e.keyCode == 27) && this.isOpen()) {
        this.close();
      }
    });

    // Toggle menu from button
    this.buttonInstance.addEventListener('click',()=> {
      this.toggle();
    });
  },
  init:function({onOpen,onClose}){
    if(this.running) {
      console.warn('Search menu already initiated. Is it included more than once?');
      return;
    }
    this.onOpen = onOpen;
    this.onClose = onClose;
    document.addEventListener('DOMContentLoaded', () => {
      // Enhance nojs version with JavaScript
      this.targetNode = document.querySelector(this.HASH_ID);
      if(!this.targetNode) {
        throw `Search target node missing. Looking for ${this.HASH_ID}`;
      }
      // Hide nojs menu links, show button instead.
      this.targetNode.dataset.js = true;
      this.addListeners();
    });

    this.running=true;

    this.buttonInstance = document.querySelector(this.buttonSelector);
    if(!this.buttonInstance) {
      throw `Search button missing. Looking for ${this.buttonSelector}`;
    }
  }
};

module.exports = SearchDropdown;
