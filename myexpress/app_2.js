var express=require("express");
//var querystring=require("querystring");
var app=express(); //通过express模块创建一个应用程序对象

//static中间件
app.use( express.static(__dirname) );//指定这个应用程序使用express模块中的static中间件，并指定一当前服务器文件所在的目录为基址（app2.js）

app.get("/userLogin",function(req,res){
    /*var urlstr=req.url;
    urlstr=urlstr.replace("/?","");
    var obj=querystring.parse( urlstr );
    console.info(obj);*/

    console.info(req);

    console.info( req.url );
    console.info( req.query ); //获取请求中的查询字符串，即请求中的数据
    res.send();
});

app.listen(0,function(err){
    if(err){
        console.info(err);
    }else{
        console.info("应用程序启动成功...");
    }
});
