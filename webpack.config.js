const path = require('path');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');

module.exports = {
  entry: {
    'broswer/xhr-mock': './src/broswer/xhr-mock.js',
    'extension/content': './src/extension/content.js',
    'extension/mock-api': './src/extension/mock-api.js',
    'extension/background': './src/extension/background.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'Lol')
  },
  devtool: false, //'source-map',
  module: {
    rules: [
      {
        test: /\.(css|s[ac]ss)$/,
        use: [
          MiniCSSExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              minimize: true,
              sourceMap: true
            },
          }, {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              sourceMap: true,
              plugins: () => [
                autoprefixer({
                  browsers: ['last 2 versions']
                }),
              ],
            },
          }, {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            }
          }
        ],
      }
    ]
  },
  plugins: [
    new MiniCSSExtractPlugin({
      filename: '[name].css',
    }),
  ]
};