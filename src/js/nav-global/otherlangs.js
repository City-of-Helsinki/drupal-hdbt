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
    console.log({oldState,newState});
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
    const isOpen = this.isOpen();
    console.log({isOpen},this.targetNode.dataset);
    if(isOpen) {
      window.location.hash = '';
      this.targetNode.dataset.target = 'false';
    }
    else {
      this.targetNode.dataset.target = 'true';
    }
    console.log('toggled');
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
    this.toggleButton.instance.addEventListener('click',(e)=>{
      console.log(e,this);
      
      this.toggle();
    });

  },

  init:function(){
    console.log('init otherlangs menu');
    document.addEventListener('DOMContentLoaded', () => {
      // Enhance nojs version with JavaScript
      this.targetNode = document.querySelector(this.HASH_ID);
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