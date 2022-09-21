const ToggleButton = {
  selectors:{
    id:'#js-otherlangs-button',
    openClassName :'headerlanguagelinks__toggle--open',
    closeClassName:'headerlanguagelinks__toggle--close'
  },
  instance:null,
  toggle:function(isOpen){
    console.log('otherlang menu buttontoggle');
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
  }
};

const OtherLangsDropdown = {
  HASH_ID: '#otherlangs',
  toggleButton:ToggleButton,
  targetNode:null,
  isOpen:function(){
    return window.location.hash === this.HASH_ID || this.targetNode.dataset.target === 'true'; 
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
  onOpen:null,
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
    this.onOpen = onOpen;
    document.addEventListener('DOMContentLoaded', () => {
      // Enhance nojs version with JavaScript
      this.targetNode = document.querySelector(this.HASH_ID);
      if(!this.targetNode) {
        throw `OtherLangsDropdown target node  ${this.HASH_ID} missing.`;
      }
      /**
       * hide nojs menu links, show button instead.
       */
      this.targetNode.dataset.js = true;
      this.toggleButton.init();
      this.addListeners();
    });
  }
};


module.exports = OtherLangsDropdown;