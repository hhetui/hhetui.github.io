function show(){
    var index_type=document.getElementById("index_type").value
    var days=document.getElementById("days").value
    var line_type = document.getElementById("line_type").value
    var intro_picture=document.getElementById("intro")
    intro_picture.innerHTML="上图指标为："+index_type+"，"+
    "天数为："+days+"。"
    $.ajax({
        type: "GET",
        //文件位置
        url: "test_data.json",
        //返回数据格式为json,也可以是其他格式如
        dataType: "json",
        success: function (data) {
            // console.log(data)
            var dataArrays1 = data;
            console.log(dataArrays1)
            document.getElementById("json_show").innerHTML=
            JSON.stringify(dataArrays1,null,"\t");
            
        },
        
    },
        
    )
    
}












            /*
var mjson=$.ajax({url:"test_data.json",async:false});
    var temp=JSON.parse(mjson.responseText);
    window.alert(temp.apilp)
    var ipAddress = null;

    $(document).ready(function () {
        $.ajax({
            url: 'test_data.json',
            async: false,
            success: function (data) {
                ipAddress = data.ip;
            }
        });
    });
    
*/
/* 
window.onload = function () {
    var url = "test_data.json"/*json文件url，本地的就写本地的位置，如果是服务器的就写服务器的路径
var request = new XMLHttpRequest();
request.open("get", url);/*设置请求方法与路径
request.send(null);/*不发送数据到服务器
alert(request.status)
request.onload = function () {/*XHR对象获取到返回信息后执行
    if (request.status == 200) {/*返回状态为200，即为数据获取成功
        var json = JSON.parse(request.responseText);
        for (var i = 0; i < json.length; i++) {
            console.log(json[i].name);
        }
        console.log(json);
    }
}
}
*/