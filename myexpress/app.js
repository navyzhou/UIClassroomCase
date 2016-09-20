/**
var express=require("express");
var app=express();
 */

var app=require("express")();

/*app.get("/",function(req,res){
    res.writeHead(200,"OK",{"Content-Type":"text/html;charset=utf-8"});
    res.write("访问成功...");
    res.end();
});*/

app.get("/",function(req,res){
   //res.send("访问成功...");
    res.sendFile(__dirname+"/index.html");
});

app.listen(6868,function(err){
    if(err){
        console.info(err);
    }else{
        console.info("服务器启动成功...");
    }
});

