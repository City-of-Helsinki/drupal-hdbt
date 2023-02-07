/**
 * Recursively recreate an id until a unique id has been created.
 *
 * @param {String} id Id which is not unique.
 * @param {String[]} array Array of existing ids.
 * @param {Number} index Number of iteration.
 *
 * @return {String} Unique id.
 */
export function generateUniqueId(id, array, index = 1) {
  let newValue = '';

  // Create suffix for id.
  const lastCharacters = id.match('.{2}$');
  const suffixes = ['_1','_2','_3','_4','_5','_6','_7','_8','_9'];
  if (lastCharacters !== null && suffixes.includes(lastCharacters[0])) {
    // Overwrite existing suffix with a new one.
    newValue = `${id.slice(0,-2)}_${index}`;
  } else {
    newValue = `${id}_${index}`;
  }

  // Recreate id with new suffix if necessary.
  if (array.includes(newValue)) {
    return generateUniqueId(newValue, array, index+1);
  }
  return newValue;
};

/**
 * Create list of unique ids by rewriting duplicates with suffix.
 *
 * @param {Object[]} accordions of html elements.
 *
 * @return {String[]} Array of unique ids.
 */
export function createListOfUniqueIds(accordions) {
  return accordions.map(accordion => Array.from(accordion.getElementsByClassName('helfi-accordion-item')).map(item => item.dataset.accordionId))
    .reduce((accumulator, currentValue) => accumulator.concat(...currentValue), [])
    .reduce((accumulator, currentValue) => {
      const newId = accumulator.includes(currentValue) ? generateUniqueId(currentValue, accumulator) : currentValue;
      accumulator.push(newId);
      return accumulator;
    }, []);
};
