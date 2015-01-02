module.exports = function(grunt) {

    var port = grunt.option('port') || 3000;
    // measures the time each task takes
    require('time-grunt')(grunt);

    // load grunt config
    require('load-grunt-config')(grunt,{
        data: { //data passed into config.  Can use with <%= test %>
            test: false,
            port:port,
            banner: '/*!\n'+
                ' *  <%= package.name %> v<%= package.version %> - <%= grunt.template.today("m/d/yyyy") %>\n' +
                ' *  <%= package.homepage %>\n' +
                ' *  Copyright (c) <%= grunt.template.today("yyyy") %> <%= package.author.name %>' +
                ' - Licensed <%= _.pluck(package.license, "type").join(", ") %> \n'+
                ' */\n'
        }});

    //watch
    grunt.event.on('watch', function(action, filepath, target) {
      grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
    });

};
