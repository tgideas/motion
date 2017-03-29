const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const fs = require('fs-extra');
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

let entry = './src/motion.js';

if (process.env.npm_config_pkg) {
  entry = {}
  let packages = process.env.npm_config_pkg.split('+')
  let importStr = ''
  packages.forEach((item) => {
    importStr += `import {${item.replace(/^\S/, function(s){return s.toUpperCase()})}, ${item}} from '../src/${item}';\r\n`;
  })
  let exportStr = `export default {\r\n`;
  packages.forEach((item) => {
    exportStr += `${item.replace(/^\S/, function(s){return s.toUpperCase()})},${item},\r\n`;
  })
  exportStr += `};`;
  let fileContent = importStr + exportStr
  entry = './.tmp/' + packages.join('|') + '.js';
  fs.outputFileSync(entry, fileContent, 'utf8');
}

let plugins = [];
if(env === 'build'){ //build resource
  plugins.push(
    new UglifyJsPlugin({
      sourceMap: true,
      compress: { warnings: false }
    })
  )
}

module.exports = {
  // entry   : entries(`${__dirname}/src/*.js`),
  entry : entry,
  output  : {
    path  : `${__dirname}/dist`,
    // filename : '[name].js',
    filename : 'motion.js',
    library : 'Motion',
    libraryTarget : 'umd',
    umdNamedDefine : true
  },
  devtool: 'source-map',
  watch : true,
  module : {
    rules: [
      {
        test: /\.js$/,
        enforce: "pre",
        exclude:/node_modules/,
        use:[
          {
            loader: "jshint-loader",
            options: {
              esversion: 6,
              expr: true
            }
          }
        ]
      },
      {
        test: /\.js$/,
        exclude:/node_modules/,
        use: [
          {
            loader :'babel-loader'
          }
        ]
      }
    ]
  },
  plugins : plugins
};
