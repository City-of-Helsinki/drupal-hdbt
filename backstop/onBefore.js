module.exports = async (page) => {
  // Simulate the "prefers-reduced-motion: reduce" media query,
  // which is a user setting that reduces animations and transitions.
  // It will provide less distorted test images.
  await page.emulateMedia({ reducedMotion: 'reduce' });
};
