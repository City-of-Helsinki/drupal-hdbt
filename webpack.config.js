const path = require('path');
const glob = require('glob');

const CopyPlugin = require('copy-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('@nuxt/friendly-errors-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const SvgToSprite = require('./webpack.svgToSprite');
const { merge } = require('webpack-merge');

// Handle entry points.
const Entries = () => {
  let entries = {
    styles: ['./src/scss/styles.scss'],
    ckeditor: ['./src/scss/ckeditor.scss'],
    'component-library': [
      './src/scss/component-library.scss',
      './src/js/component-library.js',
    ],
    'color-palette': [
      './src/scss/color-palette.scss'
    ],
    'hds': [
      './src/scss/_hds.scss'
    ],
  };

  const pattern = './src/js/**/*.js';
  const ignore = [
    './src/js/component-library.js'
  ];

  glob.sync(pattern, {ignore: ignore}).map((item) => {
    entries[path.parse(item).name] = item }
  );
  return entries;
};


module.exports = (env, argv) => {

  const isDev = (argv.mode === 'development');

  // Set the base config
  const config = {
    entry() {
      return Entries();
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      chunkFilename: 'js/async/[name].chunk.js',
      pathinfo: true,
      filename: 'js/[name].min.js',
      publicPath: '../',
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
                additionalData: "$debug_mode: " + isDev + ";",
              },
            },
          ],
          type: 'javascript/auto',
        },
      ],
    },
    resolve: {
      modules: [
        path.join(__dirname, 'node_modules'),
      ],
      extensions: ['.js', '.json'],
    },
    plugins: [
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
            'from': 'node_modules/@splidejs/splide/dist/js/splide.min.js',
            'to': path.resolve(__dirname, 'dist') + '/js/splide/',
            'force': true,
          }, {
            'from': 'node_modules/@splidejs/splide/dist/css/splide-core.min.css',
            'to': path.resolve(__dirname, 'dist') + '/css/splide/',
            'force': true,
          }, {
            'from': 'node_modules/tiny-slider/dist/min/tiny-slider.js',
            'to': path.resolve(__dirname, 'dist') + '/js/tiny-slider/',
            'force': true,
          }, {
            'from': 'node_modules/tiny-slider/dist/tiny-slider.css',
            'to': path.resolve(__dirname, 'dist') + '/css/tiny-slider/',
            'force': true,
          }, {
            'from': 'node_modules/handorgel/lib/js/umd/handorgel.min.js',
            'to': path.resolve(__dirname, 'dist') + '/js/handorgel/',
            'force': true,
          }, {
            'from': 'node_modules/handorgel/lib/css/handorgel.min.css',
            'to': path.resolve(__dirname, 'dist') + '/css/handorgel/',
            'force': true,
          }, {
            'from': 'node_modules/mmenu-js/dist/mmenu.js',
            'to': path.resolve(__dirname, 'dist') + '/js/mmenu/',
            'force': true,
          }, {
            'from': 'node_modules/mmenu-js/dist/mmenu.css',
            'to': path.resolve(__dirname, 'dist') + '/css/mmenu/',
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
