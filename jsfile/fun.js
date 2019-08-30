var fileName = "index.json";//指标000001.XSHE_index.json
var fileName_2="stra.json";//策略
var fileName_eval="eval.json";//评价
var fileName_table="jw.json";//统计表格
function $$(element) {
    return document.getElementById(element);
}
var getRandomColor = function () {
    return '#' +
        (function (color) {
            return (color += '0123456789abcdef'[Math.floor(Math.random() * 16)])
                && (color.length == 6) ? color : arguments.callee(color);
        })('');
}
window.onresize=function(){
    echarts.init($$('bar_chart')).resize();
    echarts.init($$("index_frequency")).resize();
    echarts.init($$("bar_chart_2")).resize();
}
window.onload = function () {
    //var objSelectet_index_type = $$("index_type");
    //var objSelectet_table_index_type = $$("table_index_type");
    var code_name = $$("code_name");
    
    $.ajax({
        type: "GET",
        url: fileName,
        dataType: "json",
        success: function (data_ori) {
            
            var dataArrays1 = data_ori;
            //var json_text = JSON.stringify(dataArrays1, null, "\t");
            //var data_length = Object.keys(dataArrays1).length
            //设置指标种类复选框选项
            var data_key = new Array;
            for (i = 0; i < Object.keys(dataArrays1).length; i++) {
                data_key.push(Object.keys(dataArrays1)[i]);
            };
            //alert(data_key)
            for (i = 0; i < data_key.length; i++) {
                var objOption = document.createElement("OPTION");
                objOption.text = data_key[i];
                objOption.value = data_key[i];
                code_name.options.add(objOption);
            };

            //获取code种类 添加指标复选框
            initialize_index();
            set_Object_setting();
            //初始化策略价格曲线
            celuefileopen();
            //初始化统计表格的复选框
            initialize_table();
        },

    });
}

//-------------------------------指标---------------------------------begin
function initialize_index(){
    indexfileopen();
    //初始化价格曲线
    initialize();
}
//打开指标文件添加指标复选框
function indexfileopen(){
    var objSelectet_index_type = $$("index_type");
    var code_name = $$("code_name").value;
    DeleteOptions(objSelectet_index_type);
    $.ajax({
        type: "GET",
        url: fileName,
        dataType: "json",
        success: function (data_ori) {
            var dataArrays1 = data_ori[code_name];
            
            //var json_text = JSON.stringify(dataArrays1, null, "\t");
            var data_length = Object.keys(dataArrays1).length
            //设置指标种类复选框选项
            var data_key = new Array;
            for (i = 0; i < Object.keys(dataArrays1).length; i++) {
                data_key.push(Object.keys(dataArrays1)[i]);
            };
            //alert(dataArrays1);
            for (i = 0; i < data_key.length; i++) {
                var objOption = document.createElement("OPTION");
                objOption.text = data_key[i];
                objOption.value = data_key[i];
                objSelectet_index_type.options.add(objOption);
            };
        },

    });
}



function initialize(){
    //clearCanvas();
    $.ajax({
        type: "GET",
        url: fileName,
        dataType: "json",
        success: function (data_ori) {
            var code_name=$$("code_name").value;
            var dataArrays1 = data_ori[code_name]["close"];
            var data_length = Object.keys(dataArrays1).length;
            //alert(data_length)
             //坐标轴（日期）和指标值
            var date =Object.keys(dataArrays1);
            var data_key = new Array;
            var data_value = new Array;

            for (i = 0; i < data_length; i++) {
                data_key.push(date[i]);
                data_value.push(dataArrays1[date[i]]);
            };
            //绘价格曲线
            plotPrice(data_key,data_value);
        },
    });
}

function plotPrice(date, price) {
    var data=price;
    
    var myChart = echarts.init($$('bar_chart'));
    myChart.clear();
    option = {
        legend:{
            y:'20',
            x:'left',
            data: ['收盘价']
        },
        tooltip: {
            trigger: 'axis',
            position: function (pt) {
                return [pt[0], '10%'];
            }
        },
        title: {
            left: 'center',
            text: '价格-指标图',
        },
        toolbox: {
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                restore: {},
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: date
        },
        yAxis: {
            type: 'value',
            //boundaryGap: [0, '100%'],
            scale:true,
        },
        dataZoom: [{
            type: 'inside',
            start: 0,
            end: 100,
        }, {
            start: 0,
            end: 10,
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%',
            handleStyle: {
                color: '#fff',
                shadowBlur: 3,
                shadowColor: 'rgba(0, 0, 0, 0.6)',
                shadowOffsetX: 2,
                shadowOffsetY: 2
            }
        }],
        series: [
            {
                name: '收盘价',
                type: 'line',
                smooth: false,
                symbol: 'none',
                sampling: 'average',
                itemStyle: {
                    color: '#c0c0c0'
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgb(255,255,255)'
                    }, {
                        offset: 1,
                        color: 'rgb(255,255,255)'
                    }])
                },
                data: data
            },
        ]
    };
    myChart.setOption(option);
}

function show() {
    var code_name=$$("code_name").value;
    var index_type = $$("index_type").value;
    $.ajax({
        type: "GET",
        url: fileName,
        dataType: "json",
        success: function (data_ori) {
            var dataArrays1 = data_ori[code_name][index_type];
            //console.log(dataArrays1)
            var data_length = Object.keys(dataArrays1).length;
            var date =Object.keys(dataArrays1);
            var data_key = new Array;
            var data_value = new Array;

            for (i = 0; i < data_length; i++) {
                data_key.push(date[i]);
                data_value.push(dataArrays1[date[i]]);
            };
            plotIndex(data_key, data_value, index_type);

        },
    });
}
function plotIndex(date,data,index){
    var newList = [];
    var color=getRandomColor();
    for (i = 0; i < data.length; i++) {
        newList.push([date[i], data[i]]);
    }
    option.legend.data.push(index);
    option.series.push({
        name: index,
        type: 'line',
        smooth: false,
        symbol: 'none',
        sampling: 'average',
        itemStyle: {
            color: color,
        },
        areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgb(255,255,255)',
            }, {
                offset: 1,
                color: 'rgb(255,255,255)',
            }])
        },
        data: newList
    });
    plot_again();
}
function plot_again() {
    var myChart = echarts.init($$('bar_chart'));
    myChart.setOption(option);
}
//-------------------------------指标---------------------------------end


//-------------------------------策略---------------------------------begin
//打开策略文件添加股票种类选项框
function celuefileopen(){
    var code_name_2=$$("code_name_2");
    $.ajax({
        type: "GET",
        url: fileName_2,
        dataType: "json",
        success: function (data_ori) {
            //添加策略股票种类
            var dataArrays1 = data_ori;
            var data_key = new Array;
            //alert(Object.keys(dataArrays1)[0]);
            for (i = 0; i < Object.keys(dataArrays1).length; i++) {
                data_key.push(Object.keys(dataArrays1)[i]);
            };
            //alert(data_key)
            //alert(data_key);
            for (i = 0; i < data_key.length; i++) {
                var objOption = document.createElement("OPTION");
                objOption.text = data_key[i];
                objOption.value = data_key[i];
                code_name_2.options.add(objOption);
            };

            celue_type_set();
            
            
            initialize_2();
        },

    });
}

function celue_type_set(){
    var celue_type = $$("celue_type");
    var day_length=$$("day_length");
    $.ajax({
        type: "GET",
        url: fileName_2,
        dataType: "json",
        success: function (data_ori) {
            var dataArrays1 = data_ori[$$("code_name_2").value];
            //设置策略种类复选框选项
            DeleteOptions(celue_type);
            for (i = 0; i < Object.keys(dataArrays1).length ; i++) {
                
                var objOption = document.createElement("OPTION");

                objOption.text = Object.keys(dataArrays1)[i];
                objOption.value = Object.keys(dataArrays1)[i];
                celue_type.options.add(objOption);
            };
            DeleteOptions(day_length);
            for(i=0;i<Object.keys(dataArrays1[celue_type.value]).length;i++){
                var objOption = document.createElement("OPTION");
                objOption.text = Object.keys(dataArrays1[celue_type.value])[i];
                objOption.value = Object.keys(dataArrays1[celue_type.value])[i];
                day_length.options.add(objOption);
            }
        },

    });
}
function DeleteOptions(obj)  
    {  
        var selectOptions = obj.options;  
        var optionLength = selectOptions.length;  
        for(var i=0;i <optionLength;i++)  
        {  
            obj.removeChild(selectOptions[0]);  
        }  
    } 
function code_name_change(){
    //eval_table();
    //alert("变动");
    celue_type_set();
    initialize_2();
}
//变动策略 时 重新绘制表格
function eval_table(){
    var celue_type=$$("celue_type").value;
    var code_name_2=$$("code_name_2").value;
    var day_length=$$("day_length").value;
    $$("eval_intro").innerHTML="股票："+code_name_2+" 策略："+celue_type+'_'+day_length+"的eval表格";
    var dataObject_eval = [

    ];
    var evalSettings = {
        data: dataObject_eval,
        columns: [
    
        ],
        stretchH: 'all',
        width: '80%',
        autoWrapRow: true,
        height: 487,
        maxRows: 22,
        manualRowResize: true,
        manualColumnResize: true,
        rowHeaders: true,
        colHeaders: [
    
        ],
        manualRowMove: true,
        manualColumnMove: true,
        contextMenu: true,
        dropdownMenu: true,
        filters: true
    };
    $.ajax({
        type: "GET",
        url: fileName_eval,
        dataType: "json",
        success: function (data_ori) {
            var dataArrays1 = data_ori;
            
            var code_celue=dataArrays1[code_name_2][celue_type+'_'+day_length];
            //alert(code_name_2)
            //alert(celue_type)
            //alert(code_celue["long"][Object.keys(code_celue["long"])[1]]);
            
            for(i=0;i<Object.keys(code_celue["long"]).length;i++){
                var temp_count_table={};
                temp_count_table["1"] = Object.keys(code_celue["long"])[i];
                //var data_length = Object.keys(dataArrays1).length;
                //alert(countList);
                slist=["short","long"];
                for(j=0;j<2;j++){
                    temp_count_table["100"+j]=code_celue[slist[j]][temp_count_table["1"]];
                };
                dataObject_eval.push(temp_count_table);
            };

            
            var countElement = document.querySelector('#celue_eval');
            var countElementContainer = countElement.parentNode;
            var columnsNew = [];
            columnsNew.push({
                data: "1",
                type: "text",
            });
            var colHeadersNew = ["种类","short","long"];
            for (i = 0; i < 2; i++) {
                columnsNew.push({
                    data: "100"+i,
                    type: "text",
                });
            };
            evalSettings.columns = columnsNew;
            evalSettings.colHeaders = colHeadersNew;
            var eval_Table = new Handsontable(countElement, evalSettings);
        },
    },
    );
}
//初始化策略价格曲线
function initialize_2(){
    //clearCanvas();
    $.ajax({
        type: "GET",
        url: fileName_2,
        dataType: "json",
        success: function (data_ori) {
            var dataArrays1 = data_ori[$$("code_name_2").value][$$("celue_type").value][$$("day_length").value];
            var data_length = Object.keys(dataArrays1).length
            
            var data_key = new Array;
            var data_value = new Array;
            for(i=0;i<data_length;i++){
                data_key.push(dataArrays1[i]["time"]);
                data_value.push(dataArrays1[i]["close"])
            }
            //绘价格曲线
            plotPrice_2(data_key,data_value);
            //初始化eval表格 此时刚可以读取到初始化的code_name_2和celue_type
            eval_table();
        },
    });
}

//策略价格绘制函数
function plotPrice_2(date, price) {
    var data=price;
    var myChart = echarts.init($$('bar_chart_2'));
    myChart.clear();
    option_2 = {
        legend:{
            y:'20',
            x:'left',
            data: ['收盘价']
        },
        tooltip: {
            trigger: 'axis',
            position: function (pt) {
                return [pt[0], '10%'];
            }
        },
        title: {
            left: 'center',
            text: '价格-策略图',
        },
        toolbox: {
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                restore: {},
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: date
        },
        yAxis: {
            type: 'value',
            //boundaryGap: [0, '100%'],
            scale:true,
        },
        dataZoom: [{
            type: 'inside',
            start: 0,
            end: 100,
        }, {
            start: 0,
            end: 10,
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%',
            handleStyle: {
                color: '#fff',
                shadowBlur: 3,
                shadowColor: 'rgba(0, 0, 0, 0.6)',
                shadowOffsetX: 2,
                shadowOffsetY: 2
            }
        }],
        series: [
            {
                name: '收盘价',
                type: 'line',
                smooth: false,
                symbol: 'none',
                sampling: 'average',
                itemStyle: {
                    color: '#c0c0c0'
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgb(255,255,255)'
                    }, {
                        offset: 1,
                        color: 'rgb(255,255,255)'
                    }])
                },
                data: data
            }
        ]
    };
    //alert(option_2.series.length);
    myChart.setOption(option_2);
    
    
}

function celue_show(){
    var code_name_2=$$("code_name_2").value;
    var celue_type = $$("celue_type").value;
    var day_length=$$('day_length').value;

    $.ajax({
        type: "GET",
        url: fileName_2,
        dataType: "json",
        success: function (data_ori) {
            var dataArrays1 = data_ori[code_name_2][celue_type][day_length];
            //console.log(dataArrays1)
            //alert(dataArrays1[0])
            var data_length = dataArrays1.length;
            
            
            var typeList=['short','long','short_sell','long_sell'];
            

            for(var indexNumber=0;indexNumber<typeList.length;indexNumber++){
                var type=typeList[indexNumber];
                var data_key = new Array;
                var data_value = new Array;
                for (i = 0; i < data_length; i++) {
                    if (dataArrays1[i]['operation_'+day_length] == type) {
                        data_key.push(dataArrays1[i]["time"]);
                        data_value.push(dataArrays1[i]["close"])
                    };
                };

                

                var index_type_now = celue_type+"_"+day_length+'_'+type;
                plotIndex_2(data_key, data_value, index_type_now);

            };

        },
    });
    
}
function plotIndex_2(date,data,index){
    var newList = [];
    for (i = 0; i < data.length; i++) {
        newList.push([date[i], data[i]]);
    }
    option_2.legend.data.push(index);
    option_2.series.push({
        name: index,
        type: 'scatter',
        data: newList,
        symbolSize: 10,
        itemStyle: {
            color: getRandomColor(),
        },
    });
    //alert(option_2.series.length);
    plot_again_2();
}

function plot_again_2() {
    var myChart = echarts.init($$('bar_chart_2'));
    myChart.setOption(option_2);
}

//-------------------------------策略---------------------------------end


//-------------------------------表格展示---------------------------------begin
//初始化股票类别
function initialize_table(){
    var code_name_table = $$("code_name_table");
    $.ajax({
        type: "GET",
        url: fileName_table,
        dataType: "json",
        success: function (data_ori) {
            var dataArrays1 = data_ori;
            var data_key = new Array;
            for (i = 0; i < Object.keys(dataArrays1).length; i++) {
                data_key.push(Object.keys(dataArrays1)[i]);
            };
            //alert(data_key)
            for (i = 0; i < data_key.length; i++) {
                var objOption = document.createElement("OPTION");
                objOption.text = data_key[i];
                objOption.value = data_key[i];
                code_name_table.options.add(objOption);
            };
            table_index_set();
        },

    });
}

function table_index_set(){
    var code_name_table = $$("code_name_table").value;
    var index_type = $$("table_index_type");
    DeleteOptions(index_type);
    $.ajax({
        type: "GET",
        url: fileName_table,
        dataType: "json",
        success: function (data_ori) {
            var dataArrays1 = data_ori[code_name_table];
            //设置指标种类复选框选项
            var data_key = new Array;
            for (i = 0; i < Object.keys(dataArrays1).length; i++) {
                data_key.push(Object.keys(dataArrays1)[i]);
            };
            for (i = 0; i < data_key.length; i++) {
                var objOption = document.createElement("OPTION");
                objOption.text = data_key[i];
                objOption.value = data_key[i];
                index_type.options.add(objOption);
            };
            table_date_set();
            //清空表格
            set_Object_setting();
            indexList=[];
        },
        
    });
}

function table_date_set(){
    var code_name_table = $$("code_name_table").value;
    var index_type = $$("table_index_type").value;
    $.ajax({
        type: "GET",
        url: fileName_table,
        dataType: "json",
        success: function (data_ori) {
            var dataArrays1 = data_ori[code_name_table][index_type];
            data_length=Object.keys(dataArrays1).length;
            
            var date_now=Object.keys(dataArrays1)[0];
            var date_begin = (date_now.substr(0, 4) + "-"
                + date_now.substr(4, 2) + "-"
                + date_now.substr(6, 2));

            var date_now = Object.keys(dataArrays1)[data_length-1];
            var date_over = (date_now.substr(0, 4) + "-"
                + date_now.substr(4, 2) + "-"
                + date_now.substr(6, 2));
            
            $$("table_begin_day").min=date_begin;
            $$("table_begin_day").max=date_over;
            $$("table_over_day").min=date_begin;
            $$("table_over_day").max=date_over;  

            var date_now=Object.keys(dataArrays1)[Math.max(0,data_length-100)];
            var date_begin = (date_now.substr(0, 4) + "-"
                + date_now.substr(4, 2) + "-"
                + date_now.substr(6, 2));

            $$("table_begin_day").value = date_begin;
            $$("table_over_day").value = date_over;
            begin_old=$$("table_begin_day").value;
            over_old=$$("table_over_day").value;
        },

    }); 
}

var indexList=[];
function addTable(){
    var index_type = $$("table_index_type").value;
    var begin_day = $$("table_begin_day").value;
    var over_day = $$("table_over_day").value;
    //可以更改起始日期使得其不卡顿
    //alert(date_over==over_day)
    if(begin_old==begin_day & over_old==over_day){
        makeTable(index_type,begin_day,over_day);
        indexList.push(index_type);
        //alert("添加成功");
        //alert(indexList);
    }
    else{
        alert("日期变更，请保存日期！")
    }
    
}


function savedate(){
    var begin_day = $$("table_begin_day").value;
    var over_day = $$("table_over_day").value;
    set_Object_setting();
    begin_old=begin_day;
    over_old=over_day;
    //frequency();
    for(i=0;i<indexList.length;i++){
        var index_type = indexList[i];
        makeTable(index_type,begin_day,over_day);
    }
    //alert("保存成功");
}

function clearTable(){
    var begin_day = $$("table_begin_day").value;
    var over_day = $$("table_over_day").value;
    set_Object_setting();
    indexList=[];
    begin_old=begin_day;
    over_old=over_day;
    addTable();
    alert("清空成功");
}

function set_Object_setting(){
    dataObject = [

    ];
    hotSettings = {
        data: dataObject,
        columns: [
    
        ],
        stretchH: 'all',
        width: '80%',
        autoWrapRow: true,
        height: 487,
        maxRows: 22,
        manualRowResize: true,
        manualColumnResize: true,
        rowHeaders: true,
        colHeaders: [
    
        ],
        manualRowMove: true,
        manualColumnMove: true,
        contextMenu: true,
        dropdownMenu: true,
        filters: true
    };
    dataObject_count = [

    ];
    hotSettings_count = {
        data: dataObject_count,
        columns: [
    
        ],
        stretchH: 'all',
        width: '40%',
        autoWrapRow: true,
        height: 487,
        maxRows: 22,
        manualRowResize: true,
        manualColumnResize: true,
        rowHeaders: true,
        colHeaders: [
    
        ],
        manualRowMove: true,
        manualColumnMove: true,
        contextMenu: true,
        dropdownMenu: true,
        filters: true
    };
    
}

function makeTable(index_type,begin_day,over_day){
    var code_name_table=$$("code_name_table").value;
    $.ajax({
        type: "GET",
        url: fileName_table,
        dataType: "json",
        success: function (data_ori) {
            var dataArrays1 = data_ori[code_name_table][index_type];
            var temp_table = {};
            var temp_count_table={};
            temp_table["1"] = index_type;
            temp_count_table["1"] = index_type;
            var data_length = Object.keys(dataArrays1).length;
            for (i = 0; i < data_length; i++) {
                var date_now = Object.keys(dataArrays1)[i];
                var date_1 = new Date(date_now.substr(0, 4) + "-"
                    + date_now.substr(4, 2) + "-"
                    + date_now.substr(6, 2));
                var date_2 = new Date(begin_day);
                var date_3 = new Date(over_day);
                if (date_1 >= date_2 && date_1 <= date_3) {
                    temp_table[date_now] = dataArrays1[Object.keys(dataArrays1)[i]];
                };
            };
            var data_key = new Array;
            var data_value = new Array;
            var number=0;
            for (var key in temp_table) {
                data_value.push(temp_table[key]);
                
            };
            for (i = 0; i < Object.keys(temp_table).length; i++) {
                data_key.push(Object.keys(temp_table)[i]);
            };
            //添加统计表格
            var countList=[0,0];
            for (i = 0; i <data_value.length; i++) {
                if(data_value[i]=="short"){
                    countList[0]+=1;
                }
                else if(data_value[i]=="long"){
                    countList[1]+=1;
                }
            };
            //alert(countList);
            for(i=0;i<3;i++){
                temp_count_table["100"+i]=countList[i];
            };
            dataObject_count.push(temp_count_table);
            var countElement = document.querySelector('#index_count');
            var countElementContainer = countElement.parentNode;
            var columnsNew = [];
            columnsNew.push({
                data: "1",
                type: "text",
            });
            var colHeadersNew = [];
            colHeadersNew.push("种类");
            for (i = 0; i < 2; i++) {
                columnsNew.push({
                    data: "100"+i,
                    type: "text",
                });
                colHeadersNew.push(i);
            };
            
            hotSettings_count.columns = columnsNew;
            hotSettings_count.colHeaders = colHeadersNew;
            var hot_count = new Handsontable(countElement, hotSettings_count);






            //添加展示表格
            dataObject.push(temp_table);
            //alert(Object.keys(dataObject).length);
            var hotElement = document.querySelector('#hot');
            var hotElementContainer = hotElement.parentNode;
            var columnsNew = [];
            var colHeadersNew = [];
            columnsNew.push({
                data: "1",
                type: "text",
            });
            colHeadersNew.push("种类")
            //alert(data_key[1]);
            for (i = 1; i < data_key.length; i++) {
                columnsNew.push({
                    data: ""+data_key[i],
                    type: "text",
                });
                if(i>0){
                    colHeadersNew.push(data_key[i]);
                }
            };
            hotSettings.columns = columnsNew;
            hotSettings.colHeaders = colHeadersNew;
            var hot = new Handsontable(hotElement, hotSettings);


            
        },
    },
    );

}

function frequency(){
    var myChart = echarts.init($$('index_frequency'));
    var index_type = $$("table_index_type").value;
    var begin_day = $$("table_begin_day").value;
    var over_day = $$("table_over_day").value;

    $.ajax({
        type: "GET",
        url: fileName_table,
        dataType: "json",
        success: function (data_ori) {
            var dataArrays1 = data_ori;
            var temp_table = {};
            var temp_count_table={};
            temp_table["1"] = index_type;
            temp_count_table["1"] = index_type;
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
            var number=0;
            for (var key in temp_table) {
                data_value.push(temp_table[key]);
                
            };
            for (i = 0; i < Object.keys(temp_table).length; i++) {
                data_key.push(Object.keys(temp_table)[i]);
            };
            var gapList=[];
            var gap_day=0;
            
            for(i=0;i<data_value.length;i++){
                gap_day=gap_day+1;
                if(data_value[i]!=0){
                    //if(gap_day>100){
                    //    gap_day=99;
                    //};
                    gapList.push(gap_day);
                    gap_day=0;
                }

            };
            //alert(gapList);
            var girth =gapList;

            var bins = ecStat.histogram(girth);

            var option = {
                title: {
                    text: 'Girths of Black Cherry Trees',
                    left: 'center',
                    top: 20
                },
                color: ['rgb(25, 183, 207)'],
                grid: {
                    left: '3%',
                    right: '3%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [{
                    type: 'value',
                    scale: true, //这个一定要设，不然barWidth和bins对应不上
                }],
                yAxis: [{
                    type: 'value',
                }],
                series: [{
                    name: 'height',
                    type: 'bar',
                    barWidth: '50%',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideTop',
                            formatter: function(params) {
                                return params.value[1];
                            }
                        }
                    },
                    data: bins.data
                }]
            };
            myChart.setOption(option);
                
                
            },
        },
        );

    
}
//-------------------------------表格展示---------------------------------end