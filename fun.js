function show(){
    var index_type=document.getElementById("index_type").value
    var days=document.getElementById("days").value
    var line_type = document.getElementById("line_type").value
    var intro_picture=document.getElementById("intro")
    intro_picture.innerHTML="上图指标为："+index_type+"，"+
    "天数为："+days+"。"
}