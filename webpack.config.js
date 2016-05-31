var path = require('path');
var webpack = require('webpack');
 
module.exports = {
  entry: './public/index.js',
  output: { path: __dirname, filename: 'bundle.js' },
  module: {
    loaders: [
      {
        test: /.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  resolve: {
    alias: {
      'eventEmitter/EventEmitter': 'wolfy87-eventemitter/EventEmitter',
      'get-style-property': 'desandro-get-style-property',
      'matches-selector': 'desandro-matches-selector',
      'classie': 'desandro-classie'
    }
  }
};