/**
 * Created by Administrator on 16-9-21.
 */
var express=require("express");
var bodyparser=require("body-parser");
var session=require("express-session");

var app=express();
app.use(express.static(__dirname));
app.use(bodyparser.urlencoded({extended:false}));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

app.post("/userLogin",function(req,res){
    req.session.uname=req.body.uname;
    console.info(req.session);
    console.info(req.session.uname);
    res.send("1");
});

app.get("/currentUserNname",function(req,res){
    res.send("当前登录用户："+req.session.uname);
});

app.listen(8888,function(err){
    if(err){
        console.info(err);
    } else{
        console.info("服务器启动成功...");
    }
});

