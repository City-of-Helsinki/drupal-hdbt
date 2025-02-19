class NavToggleDropdown {
  constructor() {
    this.HASH_ID = null;
    this.buttonSelector = null;
    this.buttonInstance = null;
    this.running = false;
    this.targetNode = null;
    this.onOpen = null;
  }

  isOpen() {
    return window.location.hash === this.HASH_ID || this.targetNode.dataset.target === 'true';
  }

  close() {
    if (this.running) {
      this.buttonInstance.setAttribute('aria-expanded', 'false');
      this.targetNode.dataset.target = 'false';
      if (this.onClose) {
        this.onClose();
      }
    }
  }

  open() {
    if (this.running) {
      this.buttonInstance.setAttribute('aria-expanded', 'true');
      this.targetNode.dataset.target = 'true';
      if (this.onOpen) {
        this.onOpen();
      }
    }
  }

  toggle() {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
    this.buttonInstance.focus();
  }

  addListeners() {
    // Close menu on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
        this.buttonInstance.focus();
      }
    });

    // Toggle menu from button
    this.buttonInstance.addEventListener('click', () => {
      this.toggle();
    });
  }

  init({ name, buttonSelector, targetSelector, onOpen, onClose }) {
    this.name = name;
    this.buttonSelector = buttonSelector;
    this.buttonInstance = document.querySelector(this.buttonSelector);
    if (!this.buttonInstance) {
      this.running = false;
      console.warn(`${name} button missing. Looking for ${this.buttonSelector}`);
      return;
    }
    if (this.running) {
      console.warn(`${name} already initiated. Is it included more than once?`);
      return;
    }

    this.HASH_ID = targetSelector;
    this.onOpen = onOpen;
    this.onClose = onClose;

    // This used to load after DOM was loaded, but we added defer for the javascript.
    // so the check was removed.

    // Enhance nojs version with JavaScript
    this.targetNode = document.querySelector(this.HASH_ID);
    if (!this.targetNode) {
      throw new Error(`${name} target node missing. Looking for ${this.HASH_ID}`);
    }
    // Hide nojs menu links, show button instead.
    this.targetNode.dataset.js = true;
    this.addListeners();

    this.running = true;
  }
}

module.exports = () => new NavToggleDropdown();
