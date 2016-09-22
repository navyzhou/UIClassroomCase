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
}

//关闭注册窗口
function hidenzcpage(){
    $("#zcpages").hide();
    $(".bg").fadeOut();
}