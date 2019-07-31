var fileName = "000001.XSHE.json";
function $$(element) {
    return document.getElementById(element);
}
function clearCanvas() {
    $$("currentWeekChart").remove();
    var canvasList = $$('bar_chart');
    var canvas = document.createElement('canvas');
    canvasList.appendChild(canvas);
    canvas.id = "currentWeekChart";
    canvas.width = 400;
    canvas.height = 200;
}  

window.onload = function () {
    var objSelectet_index_type = $$("index_type");
    var objSelectet_table_index_type = $$("table_index_type");
    $.ajax({
        type: "GET",
        url: fileName,
        dataType: "json",
        success: function (data_ori) {
            var dataArrays1 = data_ori;
            var json_text = JSON.stringify(dataArrays1, null, "\t");
            var data_length = Object.keys(dataArrays1).length
            //设置指标种类复选框选项
            data_key = new Array;
            for (i = 0; i < Object.keys(dataArrays1[0]).length; i++) {
                data_key.push(Object.keys(dataArrays1[0])[i]);
            };
            for (i = 1; i < data_key.length - 1; i++) {
                var objOption = document.createElement("OPTION");
                objOption.text = data_key[i];
                objOption.value = data_key[i];
                objSelectet_index_type.options.add(objOption);
            };
            for (i = 1; i < data_key.length - 1; i++) {
                var objOption = document.createElement("OPTION");
                objOption.text = data_key[i];
                objOption.value = data_key[i];
                objSelectet_table_index_type.options.add(objOption);
            };
            //设置起始日期控件
            var begin_day = $$("begin_day");
            var over_day = $$("over_day");
            var date_now = dataArrays1[0]["time"];
            var date_1 = (date_now.substr(0, 4) + "-"
                + date_now.substr(4, 2) + "-"
                + date_now.substr(6, 2));
            begin_day.value = date_1;
            var date_now = dataArrays1[data_length-1]["time"];
            var date_2 = (date_now.substr(0, 4) + "-"
                + date_now.substr(4, 2) + "-"
                + date_now.substr(6, 2));
            over_day.value = date_2;

            //初始化价格曲线
            initialize();
            $$("json_show").innerHTML =
                json_text;
        },

    });
}
//日期变化则初始化价格曲线
var data={};
var options = {
    responsive: true,
    animation: {
        duration: 0
    },
    hover: {
        animationDuration: 0
    },
    responsiveAnimationDuration: 0,

};
function initialize(){
    clearCanvas();
    $.ajax({
        type: "GET",
        url: fileName,
        dataType: "json",
        success: function (data_ori) {
            var dataArrays1 = data_ori;
            var data_length = Object.keys(dataArrays1).length
            var temp_picture = {};
            var begin_day = $$("begin_day").value;
            var over_day = $$("over_day").value;
            for (i = 0; i < data_length; i++) {
                var date_now = dataArrays1[i]["time"];
                var date_1 = new Date(date_now.substr(0, 4) + "-"
                    + date_now.substr(4, 2) + "-"
                    + date_now.substr(6, 2));
                var date_2 = new Date(begin_day);
                var date_3 = new Date(over_day);
                if (date_1 >= date_2 && date_1 <= date_3) {
                    temp_picture[date_now] = dataArrays1[i]["close"];
                };
            };
            data_key = new Array;
            data_value = new Array;
            for (var key in temp_picture) {
                data_value.push(temp_picture[key])
            };
            for (i = 0; i < Object.keys(temp_picture).length; i++) {
                data_key.push(Object.keys(temp_picture)[i]);
            };
            data = {
                labels: data_key,
                datasets: [
                    {
                        label: "收盘价",
                        backgroundColor: "rgba(0, 0, 0, 0.1)",//线条填充色
                        pointBackgroundColor: getRandomColor(),//定点填充色
                        data: data_value,
                        pointRadius: 2,
                        
                    }
                ]
            };
            
            var ctx = $$("currentWeekChart").getContext("2d");
            var currentWeekChart = new Chart(ctx, {
                type: 'line',
                data: data,
                options: options
            });
            
        },

    });
}
function show() {
    var index_type = $$("index_type").value;
    var begin_day = $$("begin_day").value;
    var over_day = $$("over_day").value;
    
    $.ajax({
        type: "GET",
        url: fileName,
        dataType: "json",
        success: function (data_ori) {
            var dataArrays1 = data_ori;
            console.log(dataArrays1)
            var temp_picture = {};
            var data_length = Object.keys(dataArrays1).length
            for (i = 0; i < data_length; i++) {
                var date_now = dataArrays1[i]["time"];
                var date_1 = new Date(date_now.substr(0, 4) + "-"
                    + date_now.substr(4, 2) + "-"
                    + date_now.substr(6, 2));
                var date_2 = new Date(begin_day);
                var date_3 = new Date(over_day);
                if (date_1 >= date_2 && date_1 <= date_3) {
                    temp_picture[date_now] = dataArrays1[i][index_type];
                };
            };
            data_key = new Array;
            data_value = new Array;
            for (var key in temp_picture) {
                data_value.push(temp_picture[key])
            };
            for (i = 0; i < Object.keys(temp_picture).length; i++) {
                data_key.push(Object.keys(temp_picture)[i]);
            };
            
            data.datasets.push({
                label: index_type,
                backgroundColor: "rgba(0, 0, 0, 0.1)",//线条填充色
                pointBackgroundColor: getRandomColor(),//定点填充色
                data: data_value,
            })
            var ctx = $$("currentWeekChart").getContext("2d");
            var currentWeekChart = new Chart(ctx, {
                type: 'line',
                data: data,
                options: options,
            });
        },
    });
}

function table_show() {
    var index_type = $$("table_index_type").value;
    var begin_day = $$("table_begin_day").value;
    var over_day = $$("table_over_day").value;
    var tbody = $$("tbMain");
    $.ajax({
        type: "GET",
        //文件位置
        url: fileName,
        //返回数据格式为json,也可以是其他格式如
        dataType: "json",
        success: function (data_ori) {
            var dataArrays1 = data_ori;
            console.log(dataArrays1);

            var temp_table = {};
            var data_length = Object.keys(dataArrays1).length;
            for (i = 0; i < data_length; i++) {
                var date_now = dataArrays1[i]["time"];
                var date_1 = new Date(date_now.substr(0, 4) + "-"
                    + date_now.substr(4, 2) + "-"
                    + date_now.substr(6, 2));
                var date_2 = new Date(begin_day);
                var date_3 = new Date(over_day);
                if (date_1 >= date_2 && date_1 <= date_3) {
                    temp_table[date_now] = dataArrays1[i][index_type]
                };
            };

            var data_key = new Array;
            var data_value = new Array;
            for (var key in temp_table) {
                data_value.push(temp_table[key])
            };
            for (i = 0; i < Object.keys(temp_table).length; i++) {
                data_key.push(Object.keys(temp_table)[i]);
            };
            //如果改变了日期则全部删掉
            if (tbody.rows.length > 0) {
                if ((tbody.rows[0].childNodes[2].innerText != data_key[0]) ||
                    (tbody.rows[0].childNodes[tbody.rows.item(0).cells.length - 1].innerText
                        != data_key[Object.keys(temp_table).length - 1])) {
                    while (tbody.rows.length > 0) {
                        tbody.removeChild(tbody.lastChild);
                    }
                };

            };
            //alert(data_key[Object.keys(temp_table).length - 1])
            /*if (tbody.rows.length > 0) {
                alert(data_key[0])
            }*/
            //如果没有日期则创建
            if (tbody.rows.length == 0) {
                var row = document.createElement('tr');

                var idCell = document.createElement('td');
                idCell.innerHTML = "";
                row.appendChild(idCell);
                var idCell = document.createElement('td');
                idCell.innerHTML = "日期";
                row.appendChild(idCell);
                for (i = 0; i < Object.keys(temp_table).length; i++) {
                    var idCell = document.createElement('td');
                    idCell.innerHTML = data_key[i];
                    row.appendChild(idCell);
                };
                tbody.appendChild(row);
            };
            //添加指标数据
            var row = document.createElement('tr');

            var idCell = document.createElement('td');
            row.appendChild(idCell);
            var btnDel = document.createElement('input'); //创建一个input控件  
            btnDel.setAttribute('type', 'button'); //type="button"  
            btnDel.setAttribute('value', '删除');
            btnDel.setAttribute('onclick', 'delete_fun()');
            //删除操作
            //btnDel.οnclick = 
            idCell.appendChild(btnDel);  //把删除按钮加入td，别忘了


            var idCell = document.createElement('td');
            idCell.innerHTML = index_type; //指标名
            row.appendChild(idCell);
            for (i = 0; i < Object.keys(temp_table).length; i++) {
                var idCell = document.createElement('td');
                idCell.innerHTML = data_value[i];
                row.appendChild(idCell);
            };
            tbody.appendChild(row);




        },
    },
    );
};
function delete_fun() {
    if (confirm("确定删除这一行嘛？")) {
        //找到按钮所在行的节点，然后删掉这一行
        event.srcElement.parentNode.parentNode.parentNode.removeChild(
            event.srcElement.parentNode.parentNode);
    };
};
var getRandomColor = function () {
    return '#' +
        (function (color) {
            return (color += '0123456789abcdef'[Math.floor(Math.random() * 16)])
                && (color.length == 6) ? color : arguments.callee(color);
        })('');
}