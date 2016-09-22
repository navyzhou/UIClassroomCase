var express=require("express"); //创建服务器的
var cookieparser=require("cookie-parser");//cookie
var session=require("express-session"); //session
var mysql=require("mysql"); //操作数据库
var fs=require("fs"); //操作文件或目录的
var bodyparser=require("body-parser"); //处理请求的
var multer=require("multer"); //处理文件上传的

var app=express(); //创建一个应用程序

//使用静态中间件
app.use(express.static("page")); //默认到page文件夹下查找静态资源

app.listen(80,function(err){
    if(err){
        console.info(err);
    }else{
        console.info("应用程序启动成功...");
    }
});