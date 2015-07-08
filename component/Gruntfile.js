/*
 * grunt-motion-build
 * https://github.com/aidenxiong/node_modules
 *
 * Copyright (c) 2014 Aiden Xiong
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON( "package.json" ),
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Configuration to be run.
    motion_build: {
      dev: {
        options: {
        },
        files: [
          {
            expand: true,
            cwd: 'src/main/',
            filter : 'isFile',
            src: '**/*',
            dest: 'build/'
          }
        ]
      }
    },
    uglify: {
      dev : {
        options:{
          banner: "/*! motion v<%= pkg.version %> | " +
            "(c) <%= grunt.template.today('yyyy') %>, <%= grunt.template.today('yyyy/mm/dd') %> motion Foundation, Inc. */\r\n"
        },
        files: { 'build/motion.min.js': ['build/motion.js'] }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');

  //force the force option on if needed
  grunt.registerTask('usetheforce_on', 'force the force option on if needed', function() {
    if ( !grunt.option( 'force' ) ) {
      grunt.config.set('usetheforce_set', true);
      grunt.option( 'force', true );
    }
  });

  //turn force option off if we have previously set it
  grunt.registerTask('usetheforce_restore', 'turn force option off if we have previously set it',  function() {
    if ( grunt.config.get('usetheforce_set') ) {
      grunt.option( 'force', false );
    }
  });

  grunt.registerTask('setFile','set file name', function(file){
      var fileName = file.replace(/\|/g,'_');
      var plugReg = /(\S*?)\[(\S*?)\]/;
      var plugins = [];
      var filesSrc = file.split('|').map(function(src){
        var compName = src, compInfo,pluginName;
        if(compInfo = compName.match(plugReg)){//contains plugins
          compName = compInfo[1];
          var pluginNames = compInfo[2].split(',');
          while(pluginName=pluginNames.shift()){
            plugins.push(compName + '/plugins/' + pluginName + '.js');
          }
        }
        return compName + '/' + compName + '.js';
      });
      var uglifyOpt = {}
      uglifyOpt['build/'+fileName+'.min.js'] = ['build/'+fileName+'.js'];
      grunt.config.set('motion_build.dev.files.0.src', filesSrc.concat(plugins));
      grunt.config.set('uglify.dev.files', uglifyOpt);
      grunt.config.set('uglify.dev.options.banner', "/*! motion v<%= pkg.version %> | " +
            "(c) <%= grunt.template.today('yyyy') %>, <%= grunt.template.today('yyyy/mm/dd') %> | "+file.replace(/\|/g,' ')+" | motion Foundation, Inc. */\r\n");
  })

  grunt.registerTask('motionCust','custom build motion', function(file){
      var fileName = file.replace(/\|/g,'_');
      grunt.registerTask('motionDynamic',['usetheforce_on','setFile:'+file,'motion_build:dev:'+fileName,'usetheforce_restore']);
      grunt.registerTask('motionDynamicUglify',['usetheforce_on','setFile:'+file,'motion_build:dev:'+fileName,'uglify:dev','usetheforce_restore']);
  })

  // Actually load this plugin's task(s).
  grunt.loadNpmTasks('grunt-motion-build');

  grunt.registerTask('motion', ['usetheforce_on','motion_build:dev','usetheforce_restore']);
  grunt.registerTask('motionUglify', ['usetheforce_on','motion_build:dev','uglify:dev','usetheforce_restore']);

};
