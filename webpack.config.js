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
  'district-and-project-search': ['./src/js/react/apps/district-and-project-search/index.tsx'],
  'job-search': ['./src/js/react/apps/job-search/index.tsx'],
  linkedevents: ['./src/js/react/apps/linkedevents/index.tsx'],
  'school-search': ['./src/js/react/apps/school-search/index.tsx'],
  'news-archive': ['./src/js/react/apps/news-archive/index.tsx'],
  'health-station-search': ['./src/js/react/apps/health-station-search/index.tsx'],
  'maternity-and-child-health-clinic-search': ['./src/js/react/apps/maternity-and-child-health-clinic-search/index.tsx'],
  'ploughing-schedule': ['./src/js/react/apps/ploughing-schedule/index.tsx'],
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
  const ignore = [
    // #UHF-9614 Ignore all files starting with underscore.
    // 'src/js/**/_*.js',

    // Ignore these files:
    'src/js/accordion/accordion-item.js',
    'src/js/accordion/events.js',
    'src/js/helfi-accordion.js',
    'src/js/accordion/state.js',
    'src/js/accordion/translations.js',
    'src/js/localStorageManager.js',
    'src/js/calculator/**/tests/**'
  ];

  glob.sync(pattern, {ignore: ignore}).map((item) => {
    entries[path.parse(item).name] = `./${item}` }
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
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify')
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
      new SvgToSprite(
        path.resolve(__dirname, 'src/icons/**/*.svg'),
        'icons/sprite.svg',
        'icons.json'
      ),
      new FriendlyErrorsWebpackPlugin({clearConsole: false}),
      new RemoveEmptyScriptsPlugin(),
      new CopyPlugin({
        'patterns': [
          {
            'from': 'node_modules/hyphenopoly/min/Hyphenopoly_Loader.js',
            'to': path.resolve(__dirname, 'dist') + '/js/hyphenopoly/',
            'force': true,
          }, {
            'from': 'node_modules/hyphenopoly/min/Hyphenopoly.js',
            'to': path.resolve(__dirname, 'dist') + '/js/hyphenopoly/',
            'force': true,
          }, {
            'from': 'node_modules/hyphenopoly/min/patterns/{fi,sv,en-us}.wasm',
            'to': path.resolve(__dirname, 'dist', 'js/hyphenopoly/patterns', '[name][ext]'),
            'force': true,
          }, {
            'from': 'node_modules/focus-trap/dist/focus-trap.umd.min.js',
            'to': path.resolve(__dirname, 'dist') + '/js/focus-trap/focus-trap.min.js',
            'force': true,
          }, {
            'from': 'node_modules/tabbable/dist/index.umd.min.js',
            'to': path.resolve(__dirname, 'dist') + '/js/tabbable/tabbable.min.js',
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
    },
    // Suppress the ResizeObserver loop limit exceeded error.
    devServer: {
      client: {
        overlay: {
          runtimeErrors: (error) => {
            if (error.message === 'ResizeObserver loop limit exceeded') {
              return false;
            }
            return true;
          },
        },
      },
    },
  };

  if (argv.mode === 'production') {
    const TerserPlugin = require('terser-webpack-plugin');

    const full_config = merge(config, {
      mode: 'production',
      devtool: false,
      optimization: {
        splitChunks: false,
        minimize: true,
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              ecma: 2020,
              mangle: {
                reserved:[
                  'Drupal',
                  'drupalSettings'
                ]
              },
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
