var fileName = "000001.XSHE.json";//指标
var fileName_2="price_track_mean_cross.json";//策略
function $$(element) {
    return document.getElementById(element);
}
window.onresize=function(){
    echarts.init($$('bar_chart')).resize();
    echarts.init($$("index_frequency")).resize();
    echarts.init($$("bar_chart_2")).resize();
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
            //设置起始日期
            var date_now = dataArrays1[0]["time"];
            date_begin = (date_now.substr(0, 4) + "-"
                + date_now.substr(4, 2) + "-"
                + date_now.substr(6, 2));
            var date_now = dataArrays1[data_length-1]["time"];
            date_over = (date_now.substr(0, 4) + "-"
                + date_now.substr(4, 2) + "-"
                + date_now.substr(6, 2));
            $$("table_begin_day").value = date_begin;
            $$("table_over_day").value = date_over;
            begin_old=date_begin;
            over_old=date_over;
            set_Object_setting();
            //初始化价格曲线
            initialize();
            //初始化策略价格曲线
            celuefileopen();
            pgshow();
        },

    });
 
}
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
    
    $.ajax({
        type: "GET",
        url: fileName_2,
        dataType: "json",
        success: function (data_ori) {
            var dataArrays1 = data_ori[$$("code_name_2").value];
            //设置策略种类复选框选项
            var data_key = new Array;
            for (i = 0; i < Object.keys(dataArrays1[0]).length; i++) {
                data_key.push(Object.keys(dataArrays1[0])[i]);
            };
            DeleteOptions();
            for (i = 1; i < data_key.length ; i++) {
                
                var objOption = document.createElement("OPTION");

                objOption.text = data_key[i];
                objOption.value = data_key[i];
                celue_type.options.add(objOption);
            };
        },

    });
}
function DeleteOptions()  
    {  
        var obj = $$("celue_type");  
        var selectOptions = obj.options;  
        var optionLength = selectOptions.length;  
        for(var i=0;i <optionLength;i++)  
        {  
            obj.removeChild(selectOptions[0]);  
        }  
    } 
function code_name_change(){
    //alert("变动");
    celue_type_set();
    initialize_2();
}

//日期变化则初始化指标价格曲线
function initialize(){
    //clearCanvas();
    $.ajax({
        type: "GET",
        url: fileName,
        dataType: "json",
        success: function (data_ori) {
            var dataArrays1 = data_ori;
            var data_length = Object.keys(dataArrays1).length
            //获取起始日期
            var temp_picture = {};
            for (i = 0; i < data_length; i++) {
                var date_now = dataArrays1[i]["time"];
                if (1) {
                    temp_picture[date_now] = dataArrays1[i]["close"];
                };
            };
            //坐标轴（日期）和指标值
            var data_key = new Array;
            var data_value = new Array;

            for (var key in temp_picture) {
                data_value.push(temp_picture[key])
            };
            for (i = 0; i < Object.keys(temp_picture).length; i++) {
                data_key.push(Object.keys(temp_picture)[i]);
            };
            //绘价格曲线
            plotPrice(data_key,data_value);
        },
    });
}

//初始化策略价格曲线
function initialize_2(){
    //clearCanvas();
    $.ajax({
        type: "GET",
        url: fileName_2,
        dataType: "json",
        success: function (data_ori) {
            var dataArrays1 = data_ori[$$("code_name_2").value];
            var data_length = Object.keys(dataArrays1).length
            //获取起始日期
            var temp_picture = {};
            for (i = 0; i < data_length; i++) {
                var date_now = dataArrays1[i]["time"];
                if (1) {
                    temp_picture[date_now] = dataArrays1[i]["close"];
                };
            };
            //坐标轴（日期）和指标值
            var data_key = new Array;
            var data_value = new Array;

            for (var key in temp_picture) {
                data_value.push(temp_picture[key])
            };
            for (i = 0; i < Object.keys(temp_picture).length; i++) {
                data_key.push(Object.keys(temp_picture)[i]);
            };
            //绘价格曲线
            plotPrice_2(data_key,data_value);
        },
    });
}

//指标价格绘制函数
function plotPrice(date, price) {
    var data=price;
    
    var myChart = echarts.init($$('bar_chart'));
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
            }
        ]
    };
    myChart.setOption(option);
    
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
function show() {
    var index_type = $$("index_type").value;
    $.ajax({
        type: "GET",
        url: fileName,
        dataType: "json",
        success: function (data_ori) {
            var dataArrays1 = data_ori;
            console.log(dataArrays1)
            
            var data_length = Object.keys(dataArrays1).length
            
            intMax=0;
            for (i = 0; i < data_length; i++){
                if (dataArrays1[i][index_type]>intMax){
                    intMax = dataArrays1[i][index_type];
                };
            };

            for(indexNumber=1;indexNumber<=intMax;indexNumber++){
                var temp_picture = {};
                for (i = 0; i < data_length; i++) {
                    var date_now = dataArrays1[i]["time"];
                    if (dataArrays1[i][index_type] == indexNumber) {
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
                var index_type_now = index_type;
                if(intMax>1){
                    index_type_now = index_type+"_"+indexNumber;
                };
                
                plotIndex(data_key, data_value, index_type_now);
            }

        },
    });
}
function plotIndex(date,data,index){
    var newList = [];
    for (i = 0; i < data.length; i++) {
        newList.push([date[i], data[i]]);
    }
    option.legend.data.push(index);
    option.series.push({
        name: index,
        type: 'scatter',
        data: newList,
        symbolSize: 10,
        itemStyle: {
            color: getRandomColor(),
        },
    });
    plot_again();
}

function plot_again() {
    var myChart = echarts.init($$('bar_chart'));
    myChart.setOption(option);
}

function celue_show(){
    var celue_type = $$("celue_type").value;
    $.ajax({
        type: "GET",
        url: fileName_2,
        dataType: "json",
        success: function (data_ori) {
            var dataArrays1 = data_ori[$$("code_name_2").value];
            console.log(dataArrays1)
            
            var data_length = Object.keys(dataArrays1).length
            
            
            typeList=['short','long'];

            for(var indexNumber=0;indexNumber<typeList.length;indexNumber++){
                var temp_picture = {};
                var type=typeList[indexNumber];
                for (i = 0; i < data_length; i++) {
                    var date_now = dataArrays1[i]["time"];
                    if (dataArrays1[i][celue_type] == type) {
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
                var index_type_now = type;
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

function pgshow(){
    $.ajax({
        type: "GET",
        url: "price_track_mean_cross_eval.json",
        dataType: "json",
        success: function (data_ori) {
            dataArrays1=data_ori;
            document.getElementById("json_show").innerHTML=
            JSON.stringify(dataArrays1,null,"\t");

        },
    });
}




var getRandomColor = function () {
    return '#' +
        (function (color) {
            return (color += '0123456789abcdef'[Math.floor(Math.random() * 16)])
                && (color.length == 6) ? color : arguments.callee(color);
        })('');
}



var indexList=[];
function addTable(){
    //alert(dataObject);
    //alert(over_old==date_over);
    var index_type = $$("table_index_type").value;
    var begin_day = $$("table_begin_day").value;
    var over_day = $$("table_over_day").value;
    //alert(over_old==date_over);
    //alert(begin_old==date_begin);
    //alert(begin_old);
    //alert(begin_day);
    //alert(begin_old==begin_day);

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
function changeTable(){
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

function makeTable(index_type,begin_day,over_day){
    
    $.ajax({
        type: "GET",
        url: fileName,
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
            //添加统计表格
            var countList=[0,0,0];
            for (i = 0; i <data_value.length; i++) {
                if(data_value[i]==0){
                    countList[0]+=1;
                }
                else if(data_value[i]==1){
                    countList[1]+=1;
                }
                else if(data_value[i]==2){
                    countList[2]+=1;
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
            for (i = 0; i < 3; i++) {
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
        url: fileName,
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
/* 
dataObject.push(temp_table);
            //alert(Object.keys(dataObject).length);
            var hotElement = document.querySelector('#hot');
            var hotElementContainer = hotElement.parentNode;
            var columnsNew = [];
            var colHeadersNew = [];
            colHeadersNew.push("种类")
            for (i = 0; i < data_key.length; i++) {
                columnsNew.push({
                    data: ""+data_key[i],
                    type: "text",
                });
                if(i>0){
                    colHeadersNew.push(data_key[i]);
                }
                
            };
            columnsNew.push({
                data: "1",
                type: "text",
            });
            hotSettings.columns = columnsNew;
            hotSettings.colHeaders = colHeadersNew;
            var hot = new Handsontable(hotElement, hotSettings);
*/
