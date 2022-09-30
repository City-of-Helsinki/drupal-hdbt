class NavToggleDropdown {
  HASH_ID = null;
  buttonSelector = null;
  buttonInstance = null;
  running = false;
  targetNode = null;
  onOpen = null;
  isOpen() {
    return window.location.hash === this.HASH_ID || this.targetNode.dataset.target === 'true';
  };
  close() {
    this.buttonInstance.setAttribute('aria-expanded', 'false');
    this.targetNode.dataset.target = 'false';
    if(this.onClose) {
      this.onClose();
    }
  };
  open(){
    this.buttonInstance.setAttribute('aria-expanded', 'true');
    this.targetNode.dataset.target = 'true';
    if(this.onOpen) {
      this.onOpen();
    }
  };
  toggle(){
    if(this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
    this.buttonInstance.focus();
  };
  addListeners() {
    // Close menu on ESC
    document.addEventListener('keydown', (e) => {
      if ((e.key == 'Escape' || e.key == 'Esc' || e.keyCode == 27) && this.isOpen()) {
        this.close();
      }
    });

    // Toggle menu from button
    this.buttonInstance.addEventListener('click', () => {
      this.toggle();
    });
  };
  init= function ({ name, buttonSelector, targetSelector, onOpen, onClose }) {
    if(this.running) {
      console.warn(`${name} already initiated. Is it included more than once?`);
      return;
    }
    this.buttonSelector = buttonSelector;
    this.HASH_ID = targetSelector;
    this.onOpen = onOpen;
    this.onClose = onClose;
    document.addEventListener('DOMContentLoaded', () => {
      // Enhance nojs version with JavaScript
      this.targetNode = document.querySelector(this.HASH_ID);
      if(!this.targetNode) {
        throw `${name} target node missing. Looking for ${this.HASH_ID}`;
      }
      // Hide nojs menu links, show button instead.
      this.targetNode.dataset.js = true;
      this.addListeners();
    });

    this.running=true;

    this.buttonInstance = document.querySelector(this.buttonSelector);
    if(!this.buttonInstance) {
      throw `${name} button missing. Looking for ${this.buttonSelector}`;
    }
  }
};

module.exports = () => new NavToggleDropdown();
