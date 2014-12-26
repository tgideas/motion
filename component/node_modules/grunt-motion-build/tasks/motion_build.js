/*
 * grunt-motion-build
 * https://github.com/aidenxiong/node_modules
 *
 * Copyright (c) 2014 Aiden Xiong
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

   /**
   * util-deps.js - The parser for dependencies
   * ref: tests/research/parse-dependencies/test.html
   */

  var REQUIRE_RE = /"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|\/\*[\S\s]*?\*\/|\/(?:\\\/|[^\/\r\n])+\/(?=[^\/])|\/\/.*|\.\s*require|(?:^|[^$])\brequire\s*\(\s*(["'])(.+?)\1\s*\)/g
  var SLASH_RE = /\\\\/g

  function parseDependencies(code) {
    var ret = []

    code.replace(SLASH_RE, "")
        .replace(REQUIRE_RE, function(m, m1, m2) {
          if (m2) {
            ret.push(m2)
          }
        })

    return ret
  }

/**
 * util-path.js - The utilities for operating path such as id, uri
 */

var DIRNAME_RE = /[^?#]*\//

var DOT_RE = /\/\.\//g
var DOUBLE_DOT_RE = /\/[^/]+\/\.\.\//
var MULTI_SLASH_RE = /([^:/])\/+\//g

// Extract the directory portion of a path
// dirname("a/b/c.js?t=123#xx/zz") ==> "a/b/"
// ref: http://jsperf.com/regex-vs-split/2
function dirname(path) {
  return path.match(DIRNAME_RE)[0]
}

// Canonicalize a path
// realpath("http://test.com/a//./b/../c") ==> "http://test.com/a/c"
function realpath(path) {
  // /a/b/./c/./d ==> /a/b/c/d
  path = path.replace(DOT_RE, "/")

  /*
    @author wh1100717
    a//b/c ==> a/b/c
    a///b/////c ==> a/b/c
    DOUBLE_DOT_RE matches a/b/c//../d path correctly only if replace // with / first
  */
  path = path.replace(MULTI_SLASH_RE, "$1/")

  // a/b/c/../../d  ==>  a/b/../d  ==>  a/d
  while (path.match(DOUBLE_DOT_RE)) {
    path = path.replace(DOUBLE_DOT_RE, "/")
  }

  return path
}

// Normalize an id
// normalize("path/to/a") ==> "path/to/a.js"
// NOTICE: substring is faster than negative slice and RegExp
function normalize(path) {
  var last = path.length - 1
  var lastC = path.charAt(last)

  // If the uri ends with `#`, just return it without '#'
  if (lastC === "#") {
    return path.substring(0, last)
  }

  return (path.substring(last - 2) === ".js" ||
      path.substring(last - 3) === ".css" ||
      path.indexOf("?") > 0 ||
      lastC === "/") ? path : path + ".js"
}


var PATHS_RE = /^([^/:]+)(\/.+)$/
var VARS_RE = /{([^{]+)}/g

function parseAlias(id, data) {
  var alias = data.alias
  return alias && isString(alias[id]) ? alias[id] : id
}

function parsePaths(id, data) {
  var paths = data.paths
  var m

  if (paths && (m = id.match(PATHS_RE)) && isString(paths[m[1]])) {
    id = paths[m[1]] + m[2]
  }

  return id
}

function parseVars(id, data) {
  var vars = data.vars

  if (vars && id.indexOf("{") > -1) {
    id = id.replace(VARS_RE, function(m, key) {
      return isString(vars[key]) ? vars[key] : m
    })
  }

  return id
}

function parseMap(uri, data) {
  var map = data.map
  var ret = uri

  if (map) {
    for (var i = 0, len = map.length; i < len; i++) {
      var rule = map[i]

      ret = isFunction(rule) ?
          (rule(uri) || uri) :
          uri.replace(rule[0], rule[1])

      // Only apply the first matched rule
      if (ret !== uri) break
    }
  }

  return ret
}


  var ABSOLUTE_RE = /^\/\/.|:\//
  var ROOT_DIR_RE = /^.*?\/\/.*?\//

  function addBase(id, refUri, data) {
    var ret
    var first = id.charAt(0)

    // Absolute
    if (ABSOLUTE_RE.test(id)) {
      ret = id
    }
    // Relative
    else if (first === ".") {
      ret = realpath((refUri ? dirname(refUri) : data.cwd) + id)
    }
    // Root
    else if (first === "/") {
      var m = data.cwd.match(ROOT_DIR_RE)
      ret = m ? m[0] + id.substring(1) : id
    }
    // Top-level
    else {
      ret = data.base + id
    }

    // Add default protocol when uri begins with "//"
    if (ret.indexOf("//") === 0) {
      ret = location.protocol + ret
    }

    return ret
  }

  function id2Uri(id, refUri, data) {
    if (!id) return ""

    id = parseAlias(id, data)
    id = parsePaths(id, data)
    id = parseVars(id, data)
    id = normalize(id, data)

    var uri = addBase(id, refUri, data)
    uri = parseMap(uri, data)

    return uri
  }

  var CSSFILE_HOLDER = 'cssloader_placeholder';
  /**
   * get all dependencies by one file path
   * @param  {String} filepath file path
   * @return {Array}          dependencies list
   */
  var parseDependenciesTree = function(filepath, data){
      filepath = [].concat(filepath);
      var buf=[].concat(filepath);
      function parse(fileId, refUri, data) {
        var filepath = id2Uri(fileId, refUri, data);
        if(!grunt.file.exists(filepath)){ //file not found
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return;
        }
        buf.unshift(filepath);
        if(filepath.indexOf('.css') != -1){ //if depend a css file
          buf.unshift(CSSFILE_HOLDER);
          return;
        }

        var dependencies = parseDependencies(grunt.file.read(filepath));
        if (dependencies.length) {
          var i = dependencies.length;
          while (i--) {
            parse(dependencies[i], filepath, data);
          }
        }
      }
      filepath.forEach(function(filepath){
        var fileContent = grunt.file.read(filepath);
        parseDependencies(fileContent).forEach(function(id){
          parse(id, filepath, data);
        })
      })
      //filter the same file
      return buf.filter(function(value, index, self){
        return self.indexOf(value) === index;
      });
  }


  var DEFINE_RE = /\bdefine\s*\(\s*?function[\w\W]*?\{/
  var END_RE = /\}\s*\)\s*;?$/
  var REQ_RE = /\brequire\s*\([\w\W]+?\)\s*;?/g
  var cleanCMD = function(str){
    var str = str.trimRight();
    return str.replace(DEFINE_RE,'(function(){').replace(END_RE,'})();').replace(REQ_RE,'');
  }

  grunt.registerMultiTask('motion_build', 'build motion as your wish', function(filename) {
    filename = filename ? (filename+'.js') : 'motion.js';
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      base : 'src/',
      dest : 'build/'
    });
    // Iterate over all specified file groups.
    var dependencies = [];
    this.files.forEach(function(f) {
      // Concat specified files.
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          if(filepath.indexOf('.css') != -1){
            dependencies.unshift(CSSFILE_HOLDER);
          }
          return true;
        }
      })
      dependencies = dependencies.concat(parseDependenciesTree(src, options)).filter(function(value, index, self){
        return self.indexOf(value) === index;
      });
    });
    dependencies = dependencies.map(function(filepath){
      var code = '';
      if(filepath === CSSFILE_HOLDER){
        code = require('./importStyle.js').importStyle;
      }else{
        code = cleanCMD(grunt.file.read(filepath));
        if(filepath.indexOf('.css') != -1){ // load css file
          code = code.split(/\r\n|\r|\n/).map(function(line) {
            return line.replace(/\\/g, '\\\\');
          }).join('\\\n').replace(/\'/g, '\\\'');
          code = "importStyle('" + code + "');";
        }
      }
      return '/*===================filePath:['+filepath+']======================*/\n'+code;
    });

    dependencies.unshift('(function(){')
    dependencies.push('})();');

    var str = dependencies.join(grunt.util.normalizelf('\n\r'));

    // Write the destination file.
    grunt.file.write(options.dest + filename, str);

    // Print a success message.
    grunt.log.writeln('File "'+options.dest + filename + '" created.');
  });

};
