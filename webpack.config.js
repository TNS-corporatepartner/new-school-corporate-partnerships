var path = require('path');
var webpack = require('webpack');
 
module.exports = {
  entry: ['./scripts/index.js'],
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
      'jquery': 'jquery/src/jquery',
      'eventEmitter/EventEmitter': 'wolfy87-eventemitter/EventEmitter',
      'get-style-property': 'desandro-get-style-property',
      'matches-selector': 'desandro-matches-selector',
      'classie': 'desandro-classie',
      'masonry': 'masonry-layout',
      'isotope': 'isotope-layout',
      'isotope/js/layout-mode': 'isotope'      
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      Isotope: 'isotope-layout',
      Packery: 'isotope-packery'
    })
  ]
};