/**
 * Created by Administrator on 16-9-21.
 */
var express=require("express");
var cookieparser=require("cookie-parser");
var bodyparser=require("body-parser");

var app=express();
app.use(express.static(__dirname));
app.use(bodyparser.urlencoded({extended:false}));
app.use(cookieparser()); //启用cookie

app.post("/userLogin",function(req,res){
    if(req.body.uname=="yc" && req.body.pwd=="123"){
        res.writeHead(200,"OK",{"Set-cookie":"uname=yc;expires=Wed, 21-Sep-16 17:00:00 GMT;"});
        res.end("1"); //说明登录成功，则保存到cookie中
    }else {
        res.send("0"); //登录失败，不保存到cookie中
    }

    //获取客户端传过来的cookie信息
    for(var key in req.cookies){
        console.info(key+":"+req.cookies[key]);
    }
});

app.listen(80,function(err){
    if(err){
        console.info(err);
    } else{
        console.info("服务器启动成功...");
    }
});

