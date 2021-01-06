const path = require('path');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');

module.exports = {
  entry: {
    'broswer/xhr-mock': './src/broswer/xhr-mock.ts',
    'extension/content': './src/extension/content.ts',
    'extension/mock-api': './src/extension/mock-api.ts',
    'extension/background': './src/extension/background.ts',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'Lol')
  },
  devtool: false, //'source-map',
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(css|s[ac]ss)$/,
        use: [
          MiniCSSExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            },
          }, {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              postcssOptions: {
                plugins: [
                  [
                    "autoprefixer",
                    { overrideBrowserslist: ['last 2 versions'] },
                  ],
                ],
              },
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