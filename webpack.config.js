var path = require('path')
var webpack = require('webpack')

const config = {
  entry: path.join(__dirname, './src/index.js'),
  output: {
    filename: 'ajax-manager.js',
    library: 'ajaxManager',
    libraryTarget: 'umd',
    path: path.join(__dirname, './dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          { loader: 'babel-loader' }
        ]
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    })
  ]
}

module.exports = config
