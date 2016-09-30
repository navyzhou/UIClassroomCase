/**
 * Created by Administrator on 16-9-30.
 */
var nodemailer=require("nodemailer");
var express=require("express");
var session=require("express-session");
var bodyparser=require("body-parser");
var app=express();

app.use(bodyparser.urlencoded({extend:false}));

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: {secure:false,maxAge:1000*60*20}
}));

var transporter=nodemailer.createTransport({//邮件传输
    host:"smtp.qq.com", //qq smtp服务器地址
    secureConnection:false, //是否使用安全连接，对https协议的
    port:465, //qq邮件服务所占用的端口
    auth:{
        user:"1638868997@qq.com",//开启SMTP的邮箱，有用发送邮件
    pass:"vcrsxhrxieswfaaj"//授权码
}
});

app.post("/getlma",function(req,res){ //调用指定的邮箱给用户发送邮件
    if(req.body.eml==""){
        res.send("0");
    }else{
        var code="";
        while(code.length<5){
            code+=Math.floor(Math.random()*10);
        }
        var mailOption={
            from:"1638868997@qq.com",
            to:req.body.eml,//收件人
            subject:"XX注册校验码",//纯文本
            html:"<h1>欢迎注册XX系统，您本次的注册验证码为："+code+"</h1>"
        };

        transporter.sendMail(mailOption,function(error,info){
            if(error){
                res.send("1");
                return console.info(error);
            }else{
                req.session.yanzhengma=code;
                res.send("2");
                console.info("Message send"+code);
            }
        })
    }
})
app.post("/adduser",function(req,res){
    if(req.body.sname==""){
        res.send("1");
    }else if(req.body.pwd==""){
        res.send("2");
    }else if(req.body.eml==""){
        res.send("3");
    }else if(req.body.elma==""){
        res.send("4");
    }else{
        if(req.body.elma==req.session.yanzhengma){
            res.send("5"); //将注册信息添加到数据库
        }else{
            res.send("6");
        }
    }
})

app.use(express.static(__dirname));

app.listen(8082,function(err){
    if(err){
        console.info(err);
    }else{
        console.info("服务器开启成功。。。");
    }
})