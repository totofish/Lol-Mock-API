const path = require('path');

module.exports = {
  entry: {
    'broswer/xhr-mock': './src/broswer/xhr-mock.js',
    'extension/content': './src/extension/content.js',
    'extension/mock-api': './src/extension/mock-api.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'Lol')
  }
};