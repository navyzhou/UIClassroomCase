/**
 * Created by Administrator on 16-9-7.
 */
var http=require("http");
var mysql=require("mysql");
var querystring=require("querystring");
var fs=require("fs");
var url=require("url");

var server=http.createServer().listen(5858,function(){
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

        if(path=="/"){
            readFile("./login.html",res);
        }else if(path=="/getAllClassInfo"){ //获取所有班级信息
            pool.getConnection(function(err,connection){
               if(err){
                   res.writeHeader(200,"OK",{"Content-Type":"text/json"});
                   res.write('{"code":"0"}');
                   res.end();
               }else{
                    connection.query("select * from classInfo order by cid asc",function(err,rows){
                       if(err){
                           res.writeHeader(200,"OK",{"Content-Type":"text/json"});
                           res.write('{"code":"1"}');
                           res.end();
                       }else{
                           res.write(JSON.stringify(rows));
                           res.end();
                       }
                    });
               }
            });
        }else if(path=="/adduser"){ //说明是学生注册
            //注意此时我们使用的是POST提交方式，数据不在url里面，所以不能直接从url中获取。
            //POST提交数据时，请求头信息和数据是分开传送的，先发送请求头信息，然后在发送数据，所以我们需要通过监听来完成数据接收
            //获取学生的注册信息
            req.on("data",function(data){
                var dataInfo=querystring.parse(data.toString());

                if(dataInfo.sex==""){
                    res.write("2"); //说明性别为空
                    res.end();
                }else {
                    dataInfo["sid"] = 0;

                    //将用户提交的注册信息存入数据库
                    pool.getConnection(function (err, connection) {
                        if (err) { //如果获取连接失败，则返回一个0
                            res.write("0");
                            res.end();
                        } else {
                            console.info(dataInfo);
                            connection.query("insert into stuInfo set ?", dataInfo, function (err, result) {
                                if (err) {
                                    res.write("1"); //数据添加失败
                                } else {
                                    res.write(result.insertId + "");
                                }
                                connection.release();
                                res.end();
                            });
                        }
                    });
                }
            });
        }else if(path=="/userLogin"){ //说明是学生登录
            //那么肯定有学号和密码传过来，所以我们必须监听它传过来的数据
            req.on("data",function(data){
                var dataInfo=querystring.parse(data.toString());

                if(dataInfo.sid==""){ //说明学号为空
                    res.write("1");
                    res.end();
                }else if(dataInfo.pwd==""){ //说明密码为空
                    res.write("2");
                    res.end();
                }else{ //说明学生输入了学号和密码，则我们需要从数据库里面查询有没有这样的学生，根据给定的学号和密码
                    pool.getConnection(function(err,connection){
                        if(err){
                            res.write("3"); //获取数据了连接失败
                            res.end();
                        }else{
                            connection.query("select * from stuInfo where sid=? and pwd=?",[dataInfo.sid,dataInfo.pwd],function(err,result){
                                if(err){
                                    res.write("4"); //说明查询数据失败
                                }else{
                                   if(result.length==0){ //说明学号或密码错误
                                       res.write("0");
                                   }else { //登录成功...
                                       res.write("5");
                                   }
                                }
                                connection.release();
                                res.end();
                            })
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
    //先判断文件是否存在
    fs.exists(path,function(exsits){
        if(exsits){
            var file = fs.createReadStream(path);
            file.on("data", function (data) {
                res.write(data);
            });

            file.on("end", function () {
                res.end();
            });
        }else{
            res.writeHeader(404,"Not Found",{"Content-Type":"text/html;charset=utf-8"});
            res.write("<h1>404页面未找到...</h1>");
            res.end();
        }
    })
    //如果是fileRead读文件的话，必须判断要读取的文件类型
    //fs.readFile(path,"binary",function(err,data){});
    //fs.readFile(path,"utf8",function(err,data){});
}
