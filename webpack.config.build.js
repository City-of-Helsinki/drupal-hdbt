const { merge } = require('webpack-merge');
const webpackConfig = require('./webpack.config');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(webpackConfig, {
  mode: 'production',
  devtool: false,
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          ecma: 2015,
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  },
});
