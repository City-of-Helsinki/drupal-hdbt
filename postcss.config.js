const isDev = process.env.NODE_ENV !== 'production';

module.exports = {
  parser: 'postcss-scss',
  plugins: [
    // Plugins for PostCSS
    ['autoprefixer', { sourceMap: isDev }], // Parses CSS and adds vendor prefixes.
    [
      'postcss-preset-env', // Convert modern CSS into something most browsers can understand.
      {
        stage: 2, // Use stage 2 CSS features.
        features: {
          'logical-properties-and-values': false // Disable the conversion of css logical properties such as padding-inline.
        },
      },
    ],
    'postcss-nested', // Unwrap nested rules like how Sass does it.
    'postcss-nesting', // Nest style rules inside each other, following the CSS Nesting specification.
    require('./postcss.plugins'), // Strip inline comments.
  ],
};
