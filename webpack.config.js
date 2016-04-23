var path = require('path')
var webpack = require('webpack')

module.exports = {
  // fast sourcemap, refs compiled code
  devtool: 'eval',
  entry: ['./src/main.js'],
  output: {
    path: path.join(__dirname, './public/dist'),
    filename: 'bundled_es6.js',
    sourceMapFilename: 'bundle-map.js'
  },
  // no plugins right now
  plugins: [],
  // use babel-loader es6 => es5, with caching for speed
  module: {
    preloaders: [{
      test: /\.js$/,
      exclude: /node-modules/,
      loader: 'eslint-loader'
    }],
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015'],
        cacheDirectory: true
      }
    }],
    eslint: {
      failOnWarning: false,
      failOnError: true
    }
  }
}