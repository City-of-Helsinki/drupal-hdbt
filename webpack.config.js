const isDev = (process.env.NODE_ENV !== "production");

const path = require("path");
const glob = require("glob");
const globImporter = require("node-sass-glob-importer");

const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const SVGSpritemapPlugin = require("svg-spritemap-webpack-plugin");
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const SvgToJson = require('./webpack.svgToJson');

module.exports = {
  entry: {
    styles: ["./src/scss/styles.scss"],
    bundle: glob.sync("./src/js/**/*.js",{
      ignore: [
        './src/js/component-library.js',
        './src/js/gallery-settings.js',
        './src/js/accordion-settings.js',
      ]
    }),
    "component-library": [
      "./src/js/component-library.js",
      "./src/scss/component-library.scss"
    ],
    "ckeditor": [
      "./src/scss/ckeditor.scss"
    ],
    "gallery-settings": [
      "./src/js/gallery-settings.js"
    ],
    "accordion-settings": [
      "./src/js/accordion-settings.js"
    ],
  },
  output: {
    devtoolLineToLine: true,
    path: path.resolve(__dirname, "dist"),
    chunkFilename: "js/async/[name].chunk.js",
    pathinfo: true,
    filename: "js/[name].min.js",
    publicPath: "../",
  },
  module: {
    rules: [{
      test: /\.(config.js)$/,
      use: [
        {
          loader: "file-loader",
          options: {
            name: "[path][name].[ext]",
            outputPath: "./"
          }
        }
      ]
    },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: [{
          loader: "file-loader",
          options: {
            name: "media/[name].[ext]?[hash]",
          },
        },
        ],
      },
      {
        test: /\.svg$/,
        include: [
          path.resolve(__dirname, "src/icons")
        ],
        use: [
          {
            loader: "file-loader",
          },
          {
            loader: "image-webpack-loader",
            options: {
              bypassOnDebug: true, // webpack@1.x
              disable: true, // webpack@2.x and newer
            },
          },
        ],
      },
      {
        test: /\.(woff|ttf|eot|svg)$/,
        include: [
          path.resolve(__dirname, "src/fonts")
        ],
        use: [{
          loader: "file-loader",
          options: {
            name: "fonts/[name].[ext]",
          },
        }],
      },
      {
        test: /modernizrrc\.js$/,
        loader: "expose-loader?Modernizr!webpack-modernizr-loader",
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(css|sass|scss)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              name: "[name].[ext]?[hash]",
            }
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: isDev,
              importLoaders: 2,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              "postcssOptions": {
                "config": path.join(__dirname, "postcss.config.js"),
              },
              sourceMap: isDev,
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: isDev,
              sassOptions: {
                importer: globImporter()
              },
            },
          },
        ],
      },
    ],
  },
  resolve: {
    modules: [
      path.join(__dirname, "node_modules"),
    ],
    extensions: [".js", ".json"],
  },
  plugins: [
    new SvgToJson(path.resolve(__dirname, "src/icons/**/*.svg"),"icons.json"),
    new FriendlyErrorsWebpackPlugin(),
    new FixStyleOnlyEntriesPlugin(),
    new CleanWebpackPlugin(["dist"], {
      root: path.resolve(__dirname),
    }),
    new SVGSpritemapPlugin([
      path.resolve(__dirname, "src/icons/**/*.svg"),
    ], {
      output: {
        filename: "./icons/sprite.svg",
        svg: {
          sizes: false
        }
      },
      sprite: {
        prefix: false,
        gutter: 0,
        generate: {
          title: false,
          symbol: true,
          use: true,
          view: "-view"
        }
      },
    }),
    new CopyPlugin({
      "patterns": [
        {
          "context": "./",
          "from": "node_modules/hyphenopoly/min/{Hyphenopoly_Loader,Hyphenopoly}.js",
          "to": path.resolve(__dirname, "dist") + "/js/hyphenopoly/",
          "force": true,
          "flatten": true
        }, {
          "context": "./",
          "from": "node_modules/hyphenopoly/min/patterns/{fi,sv,en-gb,ru}.wasm",
          "to": path.resolve(__dirname, "dist") + "/js/hyphenopoly/patterns/",
          "globOptions": {
            "extglob": true
          },
          "force": true,
          "flatten": true
        }, {
          "context": "./",
          "from": "node_modules/@splidejs/splide/dist/js/splide.min.js",
          "to": path.resolve(__dirname, "dist") + "/js/splide/",
          "force": true,
          "flatten": true
        }, {
          "context": "./",
          "from": "node_modules/@splidejs/splide/dist/css/splide-core.min.css",
          "to": path.resolve(__dirname, "dist") + "/css/splide/",
          "force": true,
          "flatten": true
        }, {
          "context": "./",
          "from": "node_modules/tiny-slider/dist/min/tiny-slider.js",
          "to": path.resolve(__dirname, "dist") + "/js/tiny-slider/",
          "force": true,
          "flatten": true
        }, {
          "context": "./",
          "from": "node_modules/tiny-slider/dist/tiny-slider.css",
          "to": path.resolve(__dirname, "dist") + "/css/tiny-slider/",
          "force": true,
          "flatten": true
        }, {
          "context": "./",
          "from": "node_modules/handorgel/lib/js/umd/handorgel.min.js",
          "to": path.resolve(__dirname, "dist") + "/js/handorgel/",
          "force": true,
          "flatten": true
        }, {
          "context": "./",
          "from": "node_modules/handorgel/lib/css/handorgel.min.css",
          "to": path.resolve(__dirname, "dist") + "/css/handorgel/",
          "force": true,
          "flatten": true
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name].min.css",
    }),
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
