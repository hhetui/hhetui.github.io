function show(){
    var index_type=document.getElementById("index_type").value;
    var begin_day = document.getElementById("begin_day").value;
    var over_day = document.getElementById("over_day").value;
    var intro_index=document.getElementById("intro_index");
    var intro_date = document.getElementById("intro_date");
    intro_index.innerHTML=index_type;
    intro_date.innerHTML = begin_day + "~" + over_day;
    $.ajax({
        type: "GET",
        //文件位置
        url: "code.json",
        //返回数据格式为json,也可以是其他格式如
        dataType: "json",
        success: function (data_ori) {
            var dataArrays1 = data_ori;
            console.log(dataArrays1)
            var json_text = JSON.stringify(dataArrays1, null, "\t");
            var temp_picture={};
            var data_length = Object.keys(dataArrays1).length
            for (i = 0; i < data_length;i++){
                var date_now=dataArrays1[i]["time"];
                var date_1 = new Date(date_now.substr(0, 4) + "-" 
                + date_now.substr(4, 2) + "-" 
                + date_now.substr(6, 2));
                var date_2 = new Date(begin_day);
                var date_3 = new Date(over_day);
                if (date_1>=date_2&&date_1<=date_3){
                    temp_picture[date_now]=dataArrays1[i][index_type]
                    };
            };
            data_key=new Array;
            data_value = new Array;
            for(var key in temp_picture){
                data_value.push(temp_picture[key])
            };
            for (i = 0; i < Object.keys(temp_picture).length;i++){
                data_key.push(Object.keys(temp_picture)[i]);
            };
            var data={
                labels: data_key,
                datasets: [
                    {
                        label: "指标值",
                        backgroundColor: "rgba(0, 0, 0, 0.1)",//线条填充色
                        pointBackgroundColor: "rgba(255,48,48,0.2)",//定点填充色
                        data:data_value
                    }
                ]
            };
            var options={};
            var ctx = document.getElementById("currentWeekChart").getContext("2d");
            var currentWeekChart = new Chart(ctx, {
                type: 'line',
                data: data,
                options: options
            });

            document.getElementById("json_show").innerHTML =
                json_text;


        },

    },
    );

}


            
            





/* Object.keys(dataArrays1).length
            var date_year_begin = parseInt(begin_day.substr(0, 4));
            var date_month_begin = parseInt(begin_day.substr(4, 2));
            var date_day_begin = parseInt(begin_day.substr(6, 2));
            var date_year_over = parseInt(over_day.substr(0, 4));
            var date_month_over = parseInt(over_day.substr(4, 2));
            var date_day_over = parseInt(over_day.substr(6, 2));
*/













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