const ToggleButton = {
  selectors:{
    id:'#js-header-search__button',
    openClassName :'header-search__button--open',
    closeClassName:'header-search__button--close'
  },
  instance:null,
  toggle:function(isOpen){
    let oldState;
    let newState;
    if(isOpen){
      oldState = this.selectors.closeClassName;
      newState = this.selectors.openClassName;
      delete this.instance.dataset.target;
      this.instance.setAttribute('aria-expanded', 'false');
    } else {
      oldState = this.selectors.openClassName;
      newState = this.selectors.closeClassName;
      this.instance.setAttribute('aria-expanded', 'true');
    }
    this.instance.classList.remove(oldState);
    this.instance.classList.add(newState);
  },
  init: function() {
    this.instance = document.querySelector(this.selectors.id);
    if(!this.instance) {
      throw `OtherLangsDropdown button missing. Looking for ${this.selectors.id}`;
    }
  }
};

const SearchDropdown = {
  HASH_ID: '#search',
  toggleButton:ToggleButton,
  running:false,
  targetNode:null,
  onOpen:null,
  isOpen:function(){
    return window.location.hash === this.HASH_ID || this.targetNode.dataset.target === 'true';
  },
  close:function(){
    this.toggleButton.toggle(true);
    this.targetNode.dataset.target = 'false';
  },
  toggle:function(){
    const isOpen = this.isOpen(); //when toggle is called. next state will be opposite
    if(isOpen) { //close it.
      window.location.hash = '';
      this.targetNode.dataset.target = 'false';
    }
    else { //menu is closed, open it and call onOpen
      this.targetNode.dataset.target = 'true';
      if(this.onOpen) {
        this.onOpen();
      }
    }
    this.toggleButton.toggle(isOpen);
  },
  addListeners: function(){
    /**
     * Close menu on ESC
     */
    document.addEventListener('keydown', (e) => {
      if ((e.key == 'Escape' || e.key == 'Esc' || e.keyCode == 27) && this.isOpen()) {
        this.toggle();
      }
    });
    /**
     * toggle menu from button
     *
     */
    this.toggleButton.instance.addEventListener('click',()=> {
      this.toggle();
    });
  },
  init:function({onOpen}){
    if(this.running) {
      console.warn('Search menu already initiated. Is it included more than once?');
      return;
    }
    this.onOpen = onOpen;
    document.addEventListener('DOMContentLoaded', () => {
      // Enhance nojs version with JavaScript
      this.targetNode = document.querySelector(this.HASH_ID);
      if(!this.targetNode) {
        throw `Search target node missing. Looking for ${this.HASH_ID}`;
      }
      /**
       * hide nojs menu links, show button instead.
       */
      this.targetNode.dataset.js = true;
      this.toggleButton.init();
      this.addListeners();
    });
    this.running=true;
  }
};

module.exports = SearchDropdown;
