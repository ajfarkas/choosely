var path = require('path')
var webpack = require('webpack')

module.exports = {
  // fast sourcemap, refs compiled code
  devtool: 'eval',
  entry: {
    login: './src/login.js',
    reset: './src/reset.js',
    create: './src/create.js',
    choose: './src/choose.js',
    test: './tests/testAll.js'},
  output: {
    path: path.join(__dirname, './public/dist'),
    filename: '[name].js',
    sourceMapFilename: '[name]-map.js'
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