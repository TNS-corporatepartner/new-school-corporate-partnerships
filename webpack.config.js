var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require("extract-text-webpack-plugin")
const autoprefixer = require('autoprefixer')

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
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style-loader', ['css-loader', 'postcss-loader', 'sass-loader'])        
      }      
    ]
  },
  postcss: [ 
    autoprefixer({ browsers: ['last 2 versions'] }) 
  ],
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
    new ExtractTextPlugin('bundle.css'),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      Isotope: 'isotope-layout',
      Packery: 'isotope-packery',
      platform: 'platform'
    })
  ]
}