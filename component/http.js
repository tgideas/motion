var PORT = 1024;
var SITE_BASE = './';
var http = require('http');
var url=require('url');
var grunt = require('grunt');
var fs = require('fs');
var querystring = require("querystring");
var iconv = require("iconv-lite");

iconv.extendNodeEncodings();

var buildMotion = function(buildTask, filePath, response, charset, zepto, repackage){
  var readFromBuild = function(){
    fs.readFile(filePath, function(err, data){
        if(err){
            response.write('alert('+JSON.stringify(err).replace(/\\\\/g,'\\')+')');
        }else{
          data = iconv.encode(data, charset);
          if(zepto){
            fs.readFile('./src/zepto.js', function(err, zeptoData){
              response.write(iconv.encode(zeptoData+'\n', charset) + data);
              response.end();
            })
          }else{
            response.write(data);
            response.end();
          }
        }
    });
  }
  if(repackage){
    grunt.tasks(buildTask, {}, readFromBuild);
  }else{
    fs.exists(filePath, function(result){
      if(result){
        readFromBuild()
      }else{
        grunt.tasks(buildTask, {}, readFromBuild);
      }
    });
  }
}

var server = http.createServer(function (request, response) {
    if(request.url.indexOf('/favicon.ico') != -1){
      response.end();
      return;
    }
   var parsed = url.parse(request.url);
   var query = querystring.parse(parsed.query);
   var comp = query['u'],  //指定的打包组建
   debug = query['debug'], //是否为非打包模式
   charset = query['charset'] || 'utf-8', //文件编码格式
   repackage = query['r'], //是否重新打包 
   zepto = query['zepto'] || 0;
   if(!iconv.encodingExists(charset)){//判断传入的编码是否合法,不合法则指定为utf-8
    charset = 'utf-8';
   }

   request.setEncoding(charset);

   var buildTask,filePath;

   //deal with header
    var header = {
      'Content-Type': 'application/javascript; charset=' + charset
    }
    if(query['download'] == 1){ //if need to download file
      header['content-disposition'] = 'attachment;filename=motion.js'
    }
    response.writeHead(200, header);
   //need package
   if(comp){ 
        grunt.tasks('motionCust:'+comp, {}, function(){
            buildTask = debug == 1 ? 'motionDynamic' : 'motionDynamicUglify';
            filePath = 'build/'+comp.replace(/\|/g,'_') + (debug == 1 ?'':'.min')+'.js';
            buildMotion(buildTask, filePath, response, charset, zepto, repackage);
        })
   }else{
        buildTask = debug == 1 ? 'motion' : 'motionUglify';
        filePath = 'build/motion' + (debug == 1 ? '' : '.min') + '.js'
        buildMotion(buildTask, filePath, response, charset, zepto, repackage);
   }
});
server.listen(PORT, function(){
    console.log("Server runing at port: " + PORT + ".");
});
