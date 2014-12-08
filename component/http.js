var PORT = 1024;
var SITE_BASE = './';
var http = require('http');
var url=require('url');
var grunt = require('grunt');
var fs = require('fs');
var querystring = require("querystring");

var server = http.createServer(function (request, response) {
  if(request.url.indexOf('/favicon.ico') != -1){
    response.end();
    return;
  }
   var parsed = url.parse(request.url);
   var query = querystring.parse(parsed.query);
   var comp = query['u'], debug = query['debug'];
   var buildTask,filePath;
   //need package
   if(comp){ 
        grunt.tasks('motionCust:'+comp, {}, function(){
            buildTask = debug == 1 ? 'motionDynamic' : 'motionDynamicUglify';
            filePath = 'build/'+comp.replace(/\|/g,'_') + (debug == 1 ?'':'.min')+'.js';
            grunt.tasks(buildTask, {}, function(){
                fs.readFile(filePath, function(err, data){
                    response.writeHead(200, {
                        'Content-Type': 'application/javascript'
                    });
                    if(err){
                        response.write('alert('+JSON.stringify(err).replace(/\\\\/g,'\\')+')');
                    }else{
                        response.write(data);
                    }
                    response.end();
                });
            })
        })
   }else{
        buildTask = debug == 1 ? 'motion' : 'motionUglify';
        filePath = 'build/motion' + (debug == 1 ? '' : '.min') + '.js'
        grunt.tasks(buildTask, {}, function(){
            fs.readFile(filePath, function(err, data){
                response.writeHead(200, {
                    'Content-Type': 'application/javascript'
                });
                if(err){
                    response.write('alert('+JSON.stringify(err).replace(/\\\\/g,'\\')+')');
                }else{
                    response.write(data);
                }
                response.end();
            });
        })
   }
});
server.listen(PORT, function(){
    console.log("Server runing at port: " + PORT + ".");
});