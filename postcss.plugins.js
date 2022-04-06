// Custom css plugin to strip inline comments from distributed css.
module.exports = () => {
  return {
    postcssPlugin: 'strip-inline-comments',
    Once (root, { result }) {
      root.walkComments(i => {
        if ( i.raws.inline ) i.remove();
      });
    }
  };
}
module.exports.postcss = true
