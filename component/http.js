var PORT = 1024;
var SITE_BASE = './';
var http = require('http');
var url=require('url');
var grunt = require('grunt');
var fs = require('fs');
var querystring = require("querystring");
var exec = require("child_process").exec;

function mkdirSync(url,mode,cb){
    var path = require("path"), arr = url.split("/");
    mode = mode || 0755;
    cb = cb || function(){};
    if(arr[0]==="."){//处理 ./aaa
        arr.shift();
    }
    if(arr[0] == ".."){//处理 ../ddd/d
        arr.splice(0,2,arr[0]+"/"+arr[1])
    }
    function inner(cur){
        if(!path.existsSync(cur)){//不存在就创建一个
            fs.mkdirSync(cur, mode)
        }
        if(arr.length){
            inner(cur + "/"+arr.shift());
        }else{
            cb();
        }
    }
    arr.length && inner(arr.shift());
}
var server = http.createServer(function (request, response) {
   var parsed = url.parse(request.url);
   var query = querystring.parse(parsed.query);
   var comp = [],debug=false;
   if(query['u']){ //有u这个参数
    comp = query['u'].split('|'); 
    var fileName = comp.join('_')+".js";
    debug = query['debug'];
    var str = ''; 
    str += 'define(function(require, exports, module){\n';
        for (var i = 0; i < comp.length; i++) {
            str += '  mo["'+comp[i]+'"] = mo["'+comp[i]+'"] || require("../main/'+comp[i]+'/'+comp[i]+'");\n';
        };
    str +='});\n';

    //写入文件
    mkdirSync('src/dynamicBuild', 0, function(e){
      fs.writeFile("src/dynamicBuild/"+fileName,str,function(e){
       grunt.tasks('uglifyCust:'+fileName,{}, function(){
            grunt.tasks(['dynamicBuild'],{}, function(){
                fs.readFile("dist/dynamicBuild/"+fileName, function(err, data){
                    response.writeHead(200, {
                        'Content-Type': 'application/javascript'
                    });
                    if(err){
                        response.write('alert('+JSON.stringify(err).replace(/\\\\/g,'\\')+')');
                    }else{
                        response.write(data);
                    }
                    //删除构建的临时文件
                    fs.unlink('src/dynamicBuild/'+fileName, function(){});
                    fs.unlink('.dynamicBuild/dynamicBuild/'+fileName, function(){});
                    fs.unlink('.dynamicBuild/dynamicBuild/'+fileName.replace('.js','-debug.js'), function(){});
                    response.end();
                })
            })
        });
        if(e) throw e;
      })
    })
   }else{
    response.write('alert("未指明需要用到的组件")')
    response.end();
   }
});
server.listen(PORT, function(){
    console.log("Server runing at port: " + PORT + ".");
});