const path = require("path");
const isDev = (process.env.NODE_ENV !== "production");

const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const SVGSpritemapPlugin = require("svg-spritemap-webpack-plugin");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const globImporter = require("node-sass-glob-importer");
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");

module.exports = {
  entry: {
    styles: ["./src/scss/styles.scss"],
    "bundle": ["./src/js/common.js"],
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
    new MiniCssExtractPlugin({
      filename: "css/[name].min.css",
    }),
  ],
  watchOptions: {
    aggregateTimeout: 300,
  }
};
