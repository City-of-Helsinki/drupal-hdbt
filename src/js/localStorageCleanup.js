function localStorageCleanup(keys) {
  keys.forEach(key => {
    // Check if the item exists in local storage
    if (localStorage.getItem(key) !== null) {
      // Item exists, so remove it
      localStorage.removeItem(key);
      console.log(`Item with key '${key}' was removed from local storage.`);
    }
  });
}

// Instance specific accordion local storage rows.
const instanceName = `${window.drupalSettings.helfi_instance_name  }-accordion` || '';

// Run the cleanup and remove also the hidden-helfi-announcements row if found.
localStorageCleanup([instanceName, 'hidden-helfi-announcements']);
