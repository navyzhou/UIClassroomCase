/**
 * Created by Administrator on 16-9-5.
 */
var mysql=require("mysql");
var connection=mysql.createConnection({
    host:'127.0.0.1',
    port:3306,
    database:'stusys',
    user:'root',
    password:'a',
    multipleStatements:true
});

exports.conn=connection;