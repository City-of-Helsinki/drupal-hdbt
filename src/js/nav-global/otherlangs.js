const ToggleButton = {
  selectors:{
    id:'.js-otherlangs-button',
  },
  instance:null,
  toggle:function(isOpen){
    let oldState;
    let newState;
    if(isOpen){
      delete this.instance.dataset.target;
      this.instance.setAttribute('aria-expanded', 'false');
    } else {
      this.instance.setAttribute('aria-expanded', 'true');
    }
  },
  init: function() {
    this.instance = document.querySelector(this.selectors.id);
    if(!this.instance) {
      throw `OtherLangsDropdown button missing. Looking for ${this.selectors.id}`;
    }
  }
};

const OtherLangsDropdown = {
  HASH_ID: '#otherlangs',
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
    if(this.onClose) {
      this.onClose();
    }
  },
  open:function(){
    this.toggleButton.toggle(false);
    this.targetNode.dataset.target = 'true';
    if(this.onOpen) {
      this.onOpen();
    }
  },
  toggle:function(){
    const isOpen = this.isOpen(); //when toggle is called. next state will be opposite
    if(isOpen) { //close it.
      this.close();
    }
    else { //menu is closed, open it and call onOpen
      this.open();
    }
    this.toggleButton.toggle(isOpen);
  },
  addListeners: function(){
    /**
     * Close menu on ESC
     */
    document.addEventListener('keydown', (e) => {
      if ((e.key == 'Escape' || e.key == 'Esc' || e.keyCode == 27) && this.isOpen()) {
        this.close();
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
  init:function({onOpen,onClose}){
    if(this.running) {
      console.warn('Lang menu already initiated. Is it included more than once?');
      return;
    }
    this.onOpen = onOpen;
    this.onClose = onClose;
    document.addEventListener('DOMContentLoaded', () => {
      // Enhance nojs version with JavaScript
      this.targetNode = document.querySelector(this.HASH_ID);
      if(!this.targetNode) {
        throw `OtherLangsDropdown target node missing. Looking for ${this.HASH_ID}`;
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

module.exports = OtherLangsDropdown;
