var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport('smtps://<发送邮箱>:<授权码>@smtp.qq.com');

var mailOptions={
    from :"<发送邮箱>", //发信邮箱
    to :"<接收者邮箱1>,<接收者邮箱2>,...", //接收者邮箱
    subject: "邮箱测试", //邮件主题
    text : "您好！",
    html : "<h1>这是封测试邮件...</h1>"
};

transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
});