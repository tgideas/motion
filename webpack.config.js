const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

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

const env = process.env.WEBPACK_ENV;

let plugins = [];
if(env === 'build'){ //build resource
  plugins.push(
    new UglifyJsPlugin({
      compress: { warnings: false }
    })
  )
}

module.exports = {
  // entry   : entries(`${__dirname}/src/*.js`),
  entry : './src/motion.js',
  output  : {
    path  : `${__dirname}/dist`,
    // filename : '[name].js',
    filename : 'motion.js',
    library : 'Motion',
    libraryTarget : 'umd',
    umdNamedDefine : true
  },
  devtool: 'source-map',
  // watch : true,
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
        loader: 'babel-loader',
        test: /\.js$/,
        exclude:/node_modules/
      }
    ]
  },
  plugins : plugins
};
