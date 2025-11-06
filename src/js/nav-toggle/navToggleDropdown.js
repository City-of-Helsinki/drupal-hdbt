class NavToggleDropdown {
  constructor() {
    this.HASH_ID = null;
    this.buttonSelector = null;
    this.buttonInstances = []; // Support multiple buttons
    this.dropdownSelector = null;
    this.dropdownInstance = null;
    this.running = false;
    this.targetNode = null;
    this.onOpen = null;
    this.onClose = null;
    this.lastClickedButton = null; // Track the last clicked button
    const params = new URLSearchParams(window.location.search);
    this.debug = params.has('debug') && params.get('debug') === '';
  }

  isOpen() {
    return (
      window.location.hash === this.HASH_ID ||
      this.targetNode.dataset.target === 'true'
    );
  }

  // The simpleClose function is for events such as closing all the
  // other open instances before opening a new one.
  simpleClose() {
    if (this.running) {
      this.buttonInstances.forEach((button) => {
        button.setAttribute('aria-expanded', 'false');
      });
      this.dropdownInstance?.classList.add('nav-toggle-dropdown--closed');
      this.dropdownInstance?.removeAttribute('style');
      this.targetNode.dataset.target = 'false';

      if (this.onClose) {
        this.onClose();
      }
    }
  }

  // The close function should be used on such occasions where you click on
  close() {
    // First call the simple close that can be called multiple times.
    this.simpleClose();

    // Then run the part where the button focus is determined.
    // This should be run only once or the button to focus is
    // lost and all kinds of unwanted behaviour will occur.
    if (this.running) {
      // Find the correct button to focus
      let buttonToFocus = this.lastClickedButton;

      // If the last clicked button is inside the dropdown, find another button outside of it
      if (this.dropdownInstance?.contains(buttonToFocus)) {
        buttonToFocus =
          this.buttonInstances.find(
            (button) => !this.dropdownInstance.contains(button),
          ) || null;
      }

      // Move focus if a valid button is found
      if (buttonToFocus) {
        buttonToFocus.focus();
      }

      if (this.onClose) {
        this.onClose();
      }
    }
  }

  open() {
    if (this.running) {
      this.buttonInstances.forEach((button) => {
        button.setAttribute('aria-expanded', 'true');
      });
      this.dropdownInstance?.classList.remove('nav-toggle-dropdown--closed');
      this.targetNode.dataset.target = 'true';
      if (this.onOpen) {
        this.onOpen();
      }
    }
  }

  toggle(button) {
    if (this.isOpen()) {
      this.close();
    } else {
      this.lastClickedButton = button;
      this.open();
    }
  }

  addListeners() {
    // Close element on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });

    // Toggle element from each button
    this.buttonInstances.forEach((button) => {
      button.addEventListener('click', () => {
        this.toggle(button); // Pass the clicked button
      });
    });
  }

  init({
    name,
    buttonSelector,
    dropdownSelector = null,
    targetSelector,
    onOpen,
    onClose,
  }) {
    this.name = name;
    this.buttonSelector = buttonSelector;
    this.buttonInstances = Array.from(
      document.querySelectorAll(this.buttonSelector),
    ); // Get all matching buttons

    if (this.buttonInstances.length === 0) {
      this.running = false;
      if (this.debug) {
        console.warn(
          `${name} buttons missing. Looking for ${this.buttonSelector}`,
        );
      }
      return;
    }
    if (this.running) {
      if (this.debug) {
        console.warn(
          `${name} already initiated. Is it included more than once?`,
        );
      }
      return;
    }

    this.dropdownSelector = dropdownSelector;
    this.dropdownInstance = this.dropdownSelector
      ? document.querySelector(this.dropdownSelector)
      : null;
    this.dropdownInstance?.classList.add('nav-toggle-dropdown--closed');
    this.HASH_ID = targetSelector;
    this.onOpen = onOpen;
    this.onClose = onClose;

    // Ensure the target node exists
    this.targetNode = document.querySelector(this.HASH_ID);
    if (!this.targetNode) {
      throw new Error(
        `${name} target node missing. Looking for ${this.HASH_ID}`,
      );
    }

    this.targetNode.dataset.js = true;
    this.addListeners();

    this.running = true;
  }
}

module.exports = () => new NavToggleDropdown();
