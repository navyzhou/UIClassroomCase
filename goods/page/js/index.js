//打开登录窗口
function showLogin(){
    $("#uname").val("");
    $("#pwd").val("");
    $("#loginpages").mywin({left:"center",top:"center"});
    $("#zcpages").hide();
    $(".bg").fadeIn("200","linear");
}

//关闭层
function hidenloginpage(){
    $("#loginpages").hide();
    $(".bg").fadeOut();
}

//打开注册窗口
function showRegister(){
    $("#zcuname").val("");
    $("#zcpwd").val("");
    $("#zcpwdagain").val("");
    $("#zcpages").mywin({left:"center",top:"center"});
    $("#loginpages").hide();
    $(".bg").fadeIn("200","linear");
    $("#registertishi").html("");
}

//关闭注册窗口
function hidenzcpage(){
    $("#zcpages").hide();
    $(".bg").fadeOut();
}

//用户注册
function userzc(){
    var uname= $.trim($("#zcuname").val());
    var pwd=$.trim($("#zcpwd").val());
    var pwdagain=$.trim($("#zcpwdagain").val());

    $.post("userRegister",{uname:uname,pwd:pwd,pwdagain:pwdagain},function(data){
        data=$.trim(data);
        switch(data){
            case "1":$("#registertishi").text("用户名不能为空...");break;
            case "2":$("#registertishi").text("密码不能为空...");break;
            case "3":$("#registertishi").text("两次密码输入不一致...");break;
            case "4":$("#registertishi").text("数据库连接失败...");break;
            case "5":$("#registertishi").text("数据添加失败...");break;
            case "6":$("#registertishi").text("注册成功..");hidenzcpage();
                break;
            default:$("#registertishi").text("注册失败..");break;
        }
    },"text");
}