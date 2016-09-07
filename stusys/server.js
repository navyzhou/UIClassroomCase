/**
 * Created by Administrator on 16-9-7.
 */
var http=require("http");
var mysql=require("mysql");
var querystring=require("querystring");
var fs=require("fs");
var url=require("url");

var server=http.createServer().listen(6666,function(){
    console.info("服务器已经启动...");
});

var pool=mysql.createPool({ //创建数据库连接池
    host:"127.0.0.1",
    port:3306,
    database:"stusys",
    user:"root",
    password:"a",
    connectionLimit:20,
    queueLimit:10
});

server.on("request",function(req,res){
   if(req.url!="/favicon.ico"){
        var urlObj=url.parse(req.url); //将url变成一个json对象
        var path=urlObj.pathname;
        console.info(path);
        if(path=="/"){
            readFile("./login.html",res);
        }else if(path=="/getAllClassInfo"){ //获取所有班级信息
            pool.getConnection(function(err,connection){
               if(err){
                   res.write("{code:0}");
                   res.end();
               }else{
                    connection.query("select * from classInfo order by cid asc",function(err,rows){
                       if(err){
                           res.write("{code:1}");
                           res.end();
                       }else{
                           res.write(JSON.stringify(rows));
                           res.end();
                       }
                    });
               }
            });
        }else{
            readFile("."+path,res);
        }
   }else{
       res.end();
   }
});

//读取指定路径的文件
function readFile(path,res){
    var file=fs.createReadStream(path);
    file.on("data",function(data){
       res.write(data);
    });

    file.on("end",function(){
        res.end();
    });
    //如果是fileRead读文件的话，必须判断要读取的文件类型
    //fs.readFile(path,"binary",function(err,data){});
    //fs.readFile(path,"utf8",function(err,data){});
}
