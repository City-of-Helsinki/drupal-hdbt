// Replace micromatch with picomatch to drop the vulnerable braces package.
const picomatch = require('picomatch');

/**
 * Filter the list with the given glob patterns.
 */
function micromatch(list, patterns, options) {
  const all = [].concat(patterns);
  const positive = all.filter((pattern) => !pattern.startsWith('!'));
  const negative = all.filter((pattern) => pattern.startsWith('!')).map((pattern) => pattern.slice(1));
  const isPositive = positive.length ? picomatch(positive, options) : () => true;
  const isNegative = negative.length ? picomatch(negative, options) : () => false;
  return list.filter((item) => isPositive(item) && !isNegative(item));
}

micromatch.isMatch = (str, patterns, options) => picomatch(patterns, options)(str);
micromatch.makeRe = picomatch.makeRe;
micromatch.scan = picomatch.scan;

// Leave brace patterns unexpanded since picomatch matches them directly.
micromatch.braces = (pattern) => [pattern];

module.exports = micromatch;
