// 包装函数
module.exports = function(grunt) {
    var transport = require('grunt-cmd-transport');
    var style = transport.style.init(grunt);
    var text = transport.text.init(grunt);
    var script = transport.script.init(grunt);
    var seajs = grunt.file.read('sea.js');
    var footer = '';
  // 任务配置
  grunt.initConfig({
        pkg : grunt.file.readJSON("package.json"),
        transport : {
            options : {
                paths : ['src'],
                parsers : {
                    '.js' : [script.jsParser],
                    '.css' : [style.css2jsParser],
                    '.html' : [text.html2jsParser]
                }
            },
            main : {
                options : {
                    idleading : 'dist/main/'
                },
                files : [
                    {
                        cwd : 'src/main',
                        src : '**/*',
                        filter : 'isFile',
                        dest : '.build/main'
                    }
                ]
            },
            resource : {
                options : {
                    idleading : 'dist/resource/'
                },
                files : [
                    {
                        cwd : 'src/resource',
                        src : '**/*',
                        filter : 'isFile',
                        dest : '.build/resource'
                    }
                ]
            },
            dynamicBuild : {
                options : {
                    idleading : 'dist/'
                },
                files : [
                    {
                        cwd : 'src/',
                        src : ['**/*','**/**/*'],
                        filter : 'isFile',
                        dest : '.dynamicBuild/'
                    }
                ]
            }
        },
        concat : {
            main : {
                options : {
                    paths : ['./dist/'],
                    include : 'relative'
                },
                files: [
                    {
                        expand: true,
                        cwd: '.build/',
                        src: ['main/**/*.js'],
                        dest: 'dist/',
                        ext: '.js'
                    }
                ]
            },
            resource : {
                files: [
                    {
                        expand: true,
                        cwd: '.build/',
                        src: ['resource/**/*.js'],
                        dest: 'dist/',
                        ext: '.js'
                    }
                ]
            },
            dynamicBuild : {
                options : {
                    paths : ['.'],
                    include : 'relative'
                },
                files: [
                    {
                        expand: true,
                        cwd: '.dynamicBuild/dynamicBuild/',
                        src: ['*.js'],
                        dest: 'dist/dynamicBuild',
                        ext: '.js'
                    }
                ]
            }
        },
        uglify : {
            main : {
                options : {
                    banner : seajs,
                    sourceMapIn : function(){ //借用一下sourceMap来获取ID
                        var id = arguments[0];
                        footer = 'if(!("mo" in window)){mo={}};seajs.use("'+id+'", function(args){mo["'+id.substring(10, id.lastIndexOf('/'))+'"]=args});';
                    },
                    footer : function(){
                        return '\n'+footer;
                    }
                },
                files: [
                    {
                        expand: true,
                        cwd: 'dist/',
                        src: ['main/**/*.js', '!main/**/*-debug.js'],
                        dest: 'dist/',
                        ext: '.js'
                    }
                ]
            },
            resource : {
                files: [
                    {
                        expand: true,
                        cwd: 'dist/',
                        src: ['resource/**/*.js', '!resource/**/*-debug.js'],
                        dest: 'dist/',
                        ext: '.js'
                    }
                ]
            },
            dynamicBuild : {
                options : {
                    banner : seajs,
                    sourceMapIn : function(){ //借用一下sourceMap来获取ID
                        var id = arguments[0];
                        footer = 'if(!("mo" in window)){mo={}};seajs.use("'+id+'");';
                    },
                    footer : function(){
                        return '\n'+footer;
                    }
                },
                files: [
                    {
                        expand: true,
                        cwd: 'dist/',
                        src: ['dynamicBuild/*.js', '!dynamicBuild/*-debug.js'],
                        dest: 'dist/',
                        ext: '.js'
                    }
                ]
            }
        },
        clean : {
            spm : ['.build']
        }
    });
    grunt.loadNpmTasks('grunt-cmd-transport');
    grunt.loadNpmTasks('grunt-cmd-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('usetheforce_on',
     'force the force option on if needed', 
     function() {
      if ( !grunt.option( 'force' ) ) {
        grunt.config.set('usetheforce_set', true);
        grunt.option( 'force', true );
      }
    });
    grunt.registerTask('usetheforce_restore', 
      'turn force option off if we have previously set it', 
      function() {
      if ( grunt.config.get('usetheforce_set') ) {
        grunt.option( 'force', false );
      }
    });

    grunt.registerTask('setFile','set file name', function(){
        grunt.config.set('uglify.dynamicBuild.files.0.src.0', 'dynamicBuild/'+arguments[0]);
    })

    grunt.registerTask('uglifyCust','custom uglify js', function(){
        var fileName = arguments[0];
        // updateConfig(fileName);
        grunt.registerTask('dynamicBuild',['usetheforce_on','setFile:'+fileName,'transport:dynamicBuild', 'concat:dynamicBuild', 'uglify:dynamicBuild','usetheforce_restore']);
    })

    grunt.registerTask('main', ['transport:main', 'concat:main', 'uglify:main', 'clean']);
    grunt.registerTask('resource', ['transport:resource', 'concat:resource', 'uglify:resource', 'clean']);
    grunt.registerTask('default', ['transport:main', 'transport:resource', 'concat:main', 'concat:resource', 'uglify:main', 'uglify:resource']);
};