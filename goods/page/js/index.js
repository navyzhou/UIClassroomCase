$(function(){
   $("#loginpages input").focus(function(){
       $(this).css("border-color","#c1e2be");
   });

    userIsLogin(); //发送请求判断用户是否已经登录
    getGoodsInfoByPageOne(1,7);
});

function getGoodsInfoByPageOne(pageNo,pageSize){
    $.post("/getGoodsInfoByPageOne",{pageNo:pageNo,pageSize:pageSize},function(data){
        $.each(data.objs,function(index,item){
            var pic=item.pic;
            if(pic.indexOf(",")>0){
                pic=pic.split(",")[0];
            }else if(pic==""){
                pic="images/zanwu.jpg";
            }

            var str='<li><dl><dt><img src="'+pic+'"/></dt><dd class="goods_price">商品价格：&yen;'+item.price
                +' </dd><dd>商品名称：考点开放</dd>' + '<dd>商品类型：'+item.tname+'</dd></dl></li>';
            $("#goodsInfo").append($(str));
        });

        var total=parseInt(data.total); //获取总记录数
        var totalPage=Math.ceil(total/pageSize);
        for(var i=1;i<=totalPage;i++){
            if(i==1){
                $("#pageInfo").append($('<li><a href="javascript:showGoodsInfoByPage('+i+','+pageSize+')" class="checked">'+i+'</a></li>'));
            }else {
                $("#pageInfo").append($('<li><a href="javascript:showGoodsInfoByPage(' + i + ',' + pageSize + ')" class="unchecked">' + i + '</a></li>'));
            }
        }
    },"json");
}

/*
分页查询商品信息
pageNo:查第几页
pageSize:每页有多少条
 */
function showGoodsInfoByPage(pageNo,pageSize){
    $.post("/getGoodsInfoByPage",{pageNo:pageNo,pageSize:pageSize},function(data){
        $("#goodsInfo").html("");
        $.each(data,function(index,item){
            var pic=item.pic;
            if(pic.indexOf(",")>0){
                pic=pic.split(",")[0];
            }else if(pic==""){
                pic="images/zanwu.jpg";
            }

            var str='<li><dl><dt><img src="'+pic+'"/></dt><dd class="goods_price">商品价格：&yen;'+item.price
                +' </dd><dd>商品名称：考点开放</dd>' + '<dd>商品类型：'+item.tname+'</dd></dl></li>';
            $("#goodsInfo").append($(str));
        });

        $("#pageInfo li a").attr("class","unchecked");
        $("#pageInfo li a").eq(pageNo-1).attr("class","checked");

    },"json");
}

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

//用户登录
function userlogin(){
    //获取登录信息
    var uname= $.trim( $("#uname").val() );
    var pwd= $.trim( $("#pwd").val() );
    if(uname==""){
        $("#uname").css("border-color","red")
        return;
    }
    if(pwd==""){
        $("#pwd").css("border-color","red")
        return;
    }
    //发请求到服务器检验用户信息是否合法
    $.post("userLogin",{uname:uname,pwd:pwd},function(data){
        //获取服务器的响应信息并提示给用户
        data= $.trim(data);
        switch(data){
            case "1":$("#uname").css("bodrder-color","red");break;
            case "2":$("#pwd").css("bodrder-color","red");break;
            case "3":alert("数据库连接失败...");break;
            case "4":alert("数据查询失败...");break;
            case "5":alert("用户名或密码错误...");break;
            case "6":
                hidenloginpage();
                var str='尊敬的会员：<a href="">['+uname+']</a>&nbsp;&nbsp<a href="javascript:userOutLogin()">[注销]</a>&nbsp;<a href="back/goods.html">[后台管理]</a>';
                $("header").html(str);break;
            default:alert("登录失败....");break;
        }

    },"text");
}

function checkInfos(obj,tabName,colName){ //信息检验
    var info= obj.value ;
    if(info!=""){
        //发送请求到服务器看该用户名是否已经被注册
        $.get("checkUserName",{uname:info,tabName:tabName,colName:colName},function(data){
            data=$.trim(data);
            if(data=="0"){
                $(obj).css("bodrder-color","green");
                $(obj).next().eq(0).text("用户名检验成功...").css("color","green");
            }else{
                $(obj).css("bodrder-color","red");
                $(obj).next().eq(0).text("改用户已被占用...");
            }
        });
    }else{
        $(obj).css("bodrder-color","red");
    }
}

function userIsLogin(){ //判断用户是否已经登录
    $.get("userIsLogin",null,function(data){
        data= $.trim(data);
        var str;
        if(data!="0"){
            str='尊敬的会员：<a href="">['+data+']</a>&nbsp;&nbsp<a href="javascript:userOutLogin()">[注销]</a>&nbsp;<a href="back/goods.html">[后台管理]</a>';
        }else{
            str='<a href="javascript:showLogin()">[请先登录]</a>&nbsp;<a href="javascript:showRegister()">[立即注册]</a>';
        }
        $("header").html(str);
    })
}

//在线客服事件
function showcustomerservice(){
    if($('#showli').css('display')=='none'){
        $('#showli').css('display','block');
    }else{
        return;
    }
}

function hidecustomerservice(){
    if($('#showli').css('display')=='block'){
        $('#showli').css('display','none');
    }else{
        return;
    }
}
