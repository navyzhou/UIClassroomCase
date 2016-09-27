$(function(){
    $.get("/getAllTypes",null,function(data){//发送请求获取所有的商品类型信息
        if(data.err){
            if(data.err=="0") {
                alert("数据库连接失败...");
            }else if(data.err=="1"){
                alert("查询数据失败...");
            }else{
                alert("获取数据失败...");
            }
        }else{
            $.each(data,function(index,item){
                $("#tid").append( $("<option value='"+item.tid+"'>"+item.tname+"</option>") );
            });
        }
    });
});

function addGoods(){ //添加商品信息
    //获取所有的数据
    var tid= $.trim( $("#tid").val() );
    var pname= $.trim( $("#pname").val() );
    var price= $.trim( $("#price").val() );

    //发异步请求到服务器
    $.ajaxFileUpload({
        url:'/addGoods',
        secureuri:false, //SSL用于https协议
        fileElementId:"pic", //要上传的文本框的id
        data:{tid:tid,pname:pname,price:price},
        dataType:"json",
        success:function(data,status){
            data= $.trim(data);
            if(data=="1"){
                $("#tid").val("");
                $("#pname").val("");
                $("#price").val("");
                $("#pic").val("");
                $("#showpic").html("");
                alert("商品信息添加成功...");
            }else{
                alert("商品信息添加失败...");
            }
        },
        error:function(data,status,e){
            alert(e);
        }
    });
}

