var express=require("express"); //创建服务器的
var cookieparser=require("cookie-parser");//cookie
var session=require("express-session"); //session
var mysql=require("mysql"); //操作数据库
var fs=require("fs"); //操作文件或目录的
var bodyparser=require("body-parser"); //处理请求的
var multer=require("multer"); //处理文件上传的
var log4js=require("log4js"); //日志

var app=express(); //创建一个应用程序

//配置和使用body-parser中间件
app.use(bodyparser.urlencoded({extended:false}));

//配置和使用session中间件
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: {secure:false,maxAge:1000*60*20}
}));

var fileUploadPath="/page/pic"; //存入服务器的路径
var fileUploadPathData="/pic"; //存入数据库中路径，主要要除掉static中的路径

//配置文件上传的中间件
var upload =multer({dest:"."+fileUploadPath}); //上传图片的目录设定

//配置数据库连接池
var pool =mysql.createPool({
    host:"127.0.0.1",
    port:3306,
    database:"goods",
    user:"root",
    password:"a"
});

//监听所有类型的请求，注意此时要将静态中间件放到这个的后面，否则当我们访问静态资源时，不会被这个监听拦截
app.all("/back/*",function(req,res,next){//back/goods.html
    if(req.session.currentLoginUser==undefined){
        res.send("<script>alert('请先登录...');location.href='/index.html';</script>");
    }else{ //说明已经登录
        next(); //将请求往下传递给对应的处理方法
    }
});

app.post("/userRegister",function(req,res){//处理用户注册的方法
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
                   connection.release(); //释放连接给连接池
                   if(err){
                       res.send("5"); //说明添加数据失败
                   }else{
                       res.send("6"); //注册成功
                   }
               });
           }
        });
    }
});

app.post("/userLogin",function(req,res){ //处理用户登录的请求
    if(req.body.uname==""){
        res.send("1");
    }else if(req.body.pwd==""){
        res.send("2");
    }else{
        pool.getConnection(function(err,conn){
            if(err){
                res.send("3");
            } else{
                conn.query("select aid,aname,pwd from adminInfo where aname=? and pwd=?",[req.body.uname,req.body.pwd],function(err,result){
                    conn.release(); //释放连接给连接池
                    if(err){
                        res.send("4");
                    } else{
                        if(result.length>0){ //说明用户登录成功，则需要将当前用户信息存到session中
                            req.session.currentLoginUser=result[0];
                            res.send("6");
                        }else{
                            res.send("5");
                        }
                    }
                });
            }
        });
    }
});

app.get("/checkUserName",function(req,res){ //检验用户名是否可用
    //console.info( req.body.uname );
    if( req.query.uname=="" ){
        res.send("1");
    }else(
         pool.getConnection(function(err,conn){
            if(err){
                res.send("1");
            }else{
                //参数占位符用一个？ 非参数占位符用两个 ??
                conn.query("select * from ?? where ??=?",[req.query.tabName,req.query.colName,req.query.uname],function(err,result){
                    conn.release(); //释放连接给连接池
                    if(err){
                        logger.info(err.message.toString());
                        res.send("1");
                    }else{
                        if(result.length>0) { //说明找到了数据
                            res.send("1");
                        }else{
                            res.send("0");
                        }
                    }
                })
            }
         })
    )
});

app.get("/userIsLogin",function(req,res){ //处理用户是否已经登录的请求
   if(req.session.currentLoginUser==undefined){
       res.send("0");
   } else{
       res.send(req.session.currentLoginUser.aname);
   }
});

app.get("/getAllTypes",function(req,res){ //处理获取所有商品类型的请求
    pool.getConnection(function(err,conn){
        res.header("Content-Type","application/json");
        if(err){
            res.send('{"err":"0"}');
        }else{
            conn.query("select tid,tname,status from goodstype where status=1",function(err,result){
                conn.release();
                if(err){
                    res.send('{"err":"0"}');
                } else{
                    res.send(result);
                }
            });
        }
    });
});

app.post("/addGoodsType",function(req,res){ //添加商品类型
   if(req.body.tname==""){
       res.send("0");
   } else{
       pool.getConnection(function(err,conn){
          if(err){
              res.send("0");
          } else{
              conn.query("insert into goodsType values(0,?,1)",[req.body.tname],function(err,result){
                  conn.release();
                  if(err){
                      res.send("0");
                  }else{
                      res.send(result.insertId+"");
                  }
              });
          }
       });
   }
});

app.post("/delGoodsType",function(req,res){ //删除商品类型信息
    if(req.body.tid==""){
        res.send("0");
    } else{
        pool.getConnection(function(err,conn){
            if(err){
                res.send("2");
            } else{
                conn.query("update goodsType set status=0 where tid=?",[req.body.tid],function(err,result){
                    conn.release();
                    if(err){
                        res.send("3");
                    }else{
                        res.send("1");
                    }
                });
            }
        });
    }
});

app.post("/addGoods",upload.array("pic"),function(req,res){//处理获取所有商品信息的请求
    if(req.body.tid=="" || req.body.pname=="" || req.body.price==""){
        res.send("0");
    } else{
        pool.getConnection(function(err,conn){
            if(err){
                res.send("2");
            } else{
                var fileName="";
                var filePath="";
                var file;
                if(req.files!=undefined){
                    for(var i in req.files){
                        file=req.files[i];
                        fileName=new Date().getTime()+"_"+file.originalname;
                        fs.renameSync(file.path,__dirname+fileUploadPath+"/"+fileName);
                        if(filePath!=""){
                            filePath+=",";
                        }
                        filePath+=fileUploadPathData+"/"+fileName; //1.jpg,2.jpg
                    }
                }
                conn.query("insert into goodsInfo values(0,?,?,?,?)",[req.body.pname,req.body.price,filePath,req.body.tid],function(err,result){
                    conn.release();
                    if(err){
                        console.info(err);
                        res.send("3");
                    }else{
                        res.send("1");
                    }
                });
            }
        });
    }
});

app.get("/getAllGoodsInfo",function(req,res){ //获取所有商品信息
    pool.getConnection(function(err,conn){
        res.header("Content-Type","application/json");
        if(err){
            res.send('{"err":"0"}');
        }else{
            conn.query("select g.*,tname from goodsInfo g,goodstype t where g.tid=t.tid",function(err,result){
                conn.release();
                if(err){
                    res.send('{"err":"0"}');
                } else{
                    res.send(result);
                }
            });
        }
    });
});

//使用静态中间件
app.use(express.static("page")); //默认到page文件夹下查找静态资源

app.listen(80,function(err){
    if(err){
        console.info(err);
    }else{
        console.info("应用程序启动成功...");
    }
});