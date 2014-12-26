(function (window) {
   window.GDot=function (dataSourceFrom){

        if(dataSourceFrom.officeSite){

            whatPlat("officeSite");

        }
        if(dataSourceFrom.app){
             whatPlat("app");
        }
        if(dataSourceFrom.weiChat){
            whatPlat("weichat");
        }
        if(dataSourceFrom.gameBoard){
            whatPlat("gameBoard");
        }
       if(typeof(pgvMain) == 'function')pgvMain();
   }
   function whatPlat(o){
      // console.log(window.location);
       var query=window.location.href;//window.location.href;
       //var query="http://pao.qq.com/act/a202140503sdf/index.html";
      // var query= "http://pao.qq.com/cp/act/a202140503sdf/index.html";
       if(query.indexOf("webplat")!=-1){
           var newsID=query.split("/").pop().split(".")[0];
           pgvSendClick({hottag:o+'.webplat.news.'+newsID});
       }else if(query.indexOf("act")!=-1&&query.indexOf("cp")==-1) {
           var actID=query.split("/")[4];
           pgvSendClick({hottag:o+'webplat.act.'+actID});

       }else if(query.indexOf("act")==-1&&query.indexOf("cp")!=-1) {
           var actID=query.split("/")[5];
           pgvSendClick({hottag:o+'webplat.cpAct.'+actID});

       }else{
           pgvSendClick({hottag:o+'webplat.other'});
       }
   }

})(window);