module.exports = async (page, scenario, vp, isReference) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
};
