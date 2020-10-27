const merge = require('webpack-merge');
const webpackConfig = require('./webpack.config');
const MinifyPlugin = require('babel-minify-webpack-plugin');

module.exports = merge(webpackConfig, {
  mode: 'production',
  devtool: '',
  plugins: [
    new MinifyPlugin({}, {
      comments: false,
      sourceMap: '',
    })
  ]
});
