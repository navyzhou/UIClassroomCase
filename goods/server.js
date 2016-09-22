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

//配置和使用body-parser中间件
app.use(bodyparser.urlencoded({extended:false}));

//配置和使用session中间件
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: {secure:false,maxAge:1000*60*2}
}));

//配置文件上传的中间件
var upload =multer({dest:"./page/pic"}); //上传图片的目录设定

//配置数据库连接池
var pool =mysql.createPool({
    host:"127.0.0.1",
    port:3306,
    database:"goods",
    user:"root",
    password:"a"
});

//处理用户注册的方法
app.post("/userRegister",function(req,res){
    var result="0";
    if(req.body.uname==""){
        res.send("1"); //说明用户名为空
    }else if(req.body.pwd==""){
        res.send("2"); //说明密码为空
    }else if(req.body.pwd!=req.body.pwdagain){
        res.send("3"); //说明两次密码不一致
    }else{//访问数据库
        pool.getConnection(function(err,connection){
           if(err){
               res.send("4"); //说明数据库连接失败
           } else {
               connection.query("insert into adminInfo values(0,?,?)",[req.body.uname,req.body.pwd],function(err,result){
                   if(err){
                       res.send("5"); //说明添加数据失败
                   }else{
                       res.send("6"); //注册成功
                   }
               })
           }
        });
    }
});

app.listen(80,function(err){
    if(err){
        console.info(err);
    }else{
        console.info("应用程序启动成功...");
    }
});