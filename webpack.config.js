const path = require('path');
const glob = require('glob');
const webpack = require('webpack');

function entries (globPath) {
    let files = glob.sync(globPath);
    let entries = {};
    for (var i = 0; i < files.length; i++) {
        let entry = files[i];
        let dirname = path.dirname(entry);
        let basename = path.basename(entry, '.js');
        entries[basename] = [entry];
    }
    return entries;
}

console.log(`${__dirname}`);
module.exports = {
  entry   : entries(`${__dirname}/src/*.js`),
  output  : {
    path  : `${__dirname}/dist`,
    filename : '[name].js'
  },
  devtool: 'source-map',
  watch : true,
  module : {
    preLoaders: [
      {
        test: /\.js$/,
        loader: "jshint-loader",
        include: "src"
      }
    ],
    loaders : [
      {
        loader: 'expose?Motion',
        test : require.resolve('./src/core/motion')
      },
      {
        loader: 'babel-loader',
        test: /\.js$/,
        exclude:/node_modules/
      }
    ]
  },
  plugins : [
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    })
  ]
};
