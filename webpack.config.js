const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('@nuxt/friendly-errors-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const SvgToSprite = require('./webpack.svgToSprite');
const { merge } = require('webpack-merge');

// Entries for React searches.
const REACT_SEARCHES = {
  linkedevents:['./src/js/react/apps/linkedevents/index.tsx'],
  'school-search':['./src/js/react/apps/school-search/index.tsx']
};

// Handle entry points.
const Entries = () => {
  let entries = {
    ...REACT_SEARCHES,
    styles: ['./src/scss/styles.scss'],
    nav_local: ['./src/scss/nav-local.scss'],
    nav_global: ['./src/scss/nav-global.scss'],
    nav_toggle: ['./src/scss/nav-toggle.scss'],
    ckeditor: ['./src/scss/ckeditor.scss'],
    'color-palette': [
      './src/scss/color-palette.scss'
    ],
    'environment-indicator': [
      './src/scss/environment-indicator.scss'
    ],
  };

  // Take all root level js files and create entries with matching names.
  const pattern = './src/js/**/*.js';
  const ignore = [];

  glob.globSync(pattern, {ignore: ignore}).map((item) => {
    entries[path.parse(item).name] = './' + item; }
  );
  return entries;
};


module.exports = (env, argv) => {
  const isDev = (argv.mode === 'development');

  // Set the base config.
  const config = {
    entry() {
      return Entries();
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      chunkFilename: 'js/async/[name].chunk.js',
      pathinfo: isDev,
      filename: 'js/[name].min.js',
      publicPath: 'auto',
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.svg$/,
          include: [
            path.resolve(__dirname, 'src/icons')
          ],
          type: 'asset/resource',
        },
        {
          test: /\.(woff|ttf|eot|svg)$/,
          include: [
            path.resolve(__dirname, 'src/fonts')
          ],
          generator: {
            filename: 'fonts/[name][ext]'
          },
          type: 'asset/resource',
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: ['babel-loader'],
          type: 'javascript/auto',
        },
        {
          test: /\.jsx$/,
          exclude: /node_modules/,
          use: ['babel-loader'],
        },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: ['ts-loader'],
        },
        {
          test: /\.(css|sass|scss)$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: isDev,
                importLoaders: 2,
                esModule: false,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                'postcssOptions': {
                  'config': path.join(__dirname, 'postcss.config.js'),
                },
                sourceMap: isDev,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: isDev,
                additionalData: '$debug_mode: ' + isDev + ';',
              },
            },
          ],
          type: 'javascript/auto',
        },
      ],
    },
    resolve: {
      fallback: {
        // Fix hds-react import bugs.
        path: require.resolve('path-browserify')
      },
      modules: [
        path.join(__dirname, 'node_modules'),
      ],
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        '@/react/common': path.resolve(__dirname, 'src/js/react/common/'),
        '@/types/': path.resolve(__dirname, 'src/js/types/'),
      },
    },
    plugins: [
      // Fix hds-react import bugs.
      new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer'],
      }),
      new SvgToSprite(
        path.resolve(__dirname, 'src/icons/**/*.svg'),
        'icons/sprite.svg',
        'icons.json'
      ),
      new FriendlyErrorsWebpackPlugin(),
      new RemoveEmptyScriptsPlugin(),
      new CopyPlugin({
        'patterns': [
          {
            'from': 'node_modules/handorgel/lib/js/umd/handorgel.min.js',
            'to': path.resolve(__dirname, 'dist') + '/js/handorgel/',
            'force': true,
          }, {
            'from': 'node_modules/handorgel/lib/css/handorgel.min.css',
            'to': path.resolve(__dirname, 'dist') + '/css/handorgel/',
            'force': true,
          }, {
            'from': 'node_modules/hyphenopoly/min/Hyphenopoly_Loader.js',
            'to': path.resolve(__dirname, 'dist') + '/js/hyphenopoly/',
            'force': true,
          }, {
            'from': 'node_modules/hyphenopoly/min/Hyphenopoly.js',
            'to': path.resolve(__dirname, 'dist') + '/js/hyphenopoly/',
            'force': true,
          }, {
            'from': 'node_modules/hyphenopoly/min/patterns/{fi,sv}.wasm',
            'to': path.resolve(__dirname, 'dist', 'js/hyphenopoly/patterns', '[name][ext]'),
            'force': true,
          }
        ]
      }),
      new MiniCssExtractPlugin({
        filename: 'css/[name].min.css',
      })
    ],
    watchOptions: {
      aggregateTimeout: 300,
      ignored: ['**/node_modules','**/templates','**/translations/','**/modules', '**/dist/','**/config'],
    },
    // Tell us only about the errors.
    stats: 'errors-only',
    // Suppress performance errors.
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    }
  };

  if (argv.mode === 'production') {
    const TerserPlugin = require('terser-webpack-plugin');

    const full_config = merge(config, {
      mode: 'production',
      devtool: false,
      optimization: {
        minimize: true,
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              ecma: 2020,
              format: {
                comments: false,
              },
            },
            extractComments: false,
          }),
        ],
      },
    });

    return full_config;

  } else if (argv.mode === 'development') {
    const SourceMapDevToolPlugin = require('webpack/lib/SourceMapDevToolPlugin');

    const full_config = merge(config, {
      mode: 'development',
      devtool: 'eval-source-map',
      plugins: [
        new SourceMapDevToolPlugin({
          filename: '[file].map',
          exclude: [/node_modules/, /images/, /spritemap/, /svg-sprites/],
        })
      ]
    });

    return full_config;

  }
};
