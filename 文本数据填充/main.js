let panel;
var selectedShapesArray = null;
const {Text,RepeatGrid} = require("scenegraph");
const {editDocument} = require("application");
const Mock = require('/utils/mock-min')
const $ = require("/utils/jquery");
const {alert} = require("/utils/dialogs");
var _wen = '文家齐提供技术支持';
function changeText(selectedShapesArray,f) {
    if (selectedShapesArray.hasArtwork){
    selectedShapesArray.items.forEach(node => {
        // let repeatGrid = selectedShapesArray.items[0].parent.parent;
        // let selectedTextNode = selectedShapesArray.items[0];
        // repeatGrid.attachTextDataSeries(selectedTextNode, stringsArray);
        if (node instanceof Text) {
            let repeatGrid = selectedShapesArray.items[0].parent.parent;
            if(repeatGrid instanceof RepeatGrid){
                let selectedTextNode = selectedShapesArray.items[0];
                let stringsArray = new Array();
                
                if(f.indexOf('@') === 0){
                    for(var i=0;i<10;i++){
                        stringsArray.push(Mock.mock(f));
                    }
                }else{
                    let reg = new RegExp(f);
                    for(var i=0;i<20;i++){
                        stringsArray.push(Mock.mock(reg));
                    }
                }
                repeatGrid.attachTextDataSeries(selectedTextNode, stringsArray);
            }else{
                if(f.indexOf('@') === 0){
                    node.text = Mock.mock(f);
                }else{
                    let reg = new RegExp(f);
                    node.text = Mock.mock(reg);
                }
            }
        }
    });
    }else{
        alert("未选择文本","至少需要选中一个文本（支持重复网格中的文本）");
    }
}
function cusChangeText(selectedShapesArray,stringsArray) {
    var iii = 0;
    if (selectedShapesArray.hasArtwork){
    selectedShapesArray.items.forEach(node => {
        if (node instanceof Text) {
            let repeatGrid = selectedShapesArray.items[0].parent.parent;
            if(repeatGrid instanceof RepeatGrid){
                let selectedTextNode = selectedShapesArray.items[0];
                repeatGrid.attachTextDataSeries(selectedTextNode, stringsArray);
            }else{
                if(stringsArray[iii]){
                    node.text = stringsArray[iii];
                }
                iii++;
            }
        }
    });
    }else{
        alert("未选择文本","至少需要选中一个文本（支持重复网格中的文本）");
    }
}
function create(){
        const HTML =
            `<style>
                .box{border-bottom:#eaeaea solid 1px;margin-top:10px;padding-bottom:20px;}
                ul{display: flex;flex-wrap:wrap;justify-content:space-around;text-align:center;}
                ul li{width: 45%;font-size:12px;line-height:22px;height:22px;border:1px solid #d1d1d1;border-radius:4px;margin-top:10px;color:#999;}
                ul li:hover{color:#3B88FD;border-color:#3B88FD;cursor: pointer;}
                .customize{margin:4px;}
                .customize textarea{width:100%;min-height:80px;}
                .customize p{width:100%;display:flex;padding-right:8px;}
                .customize p span{flex:1;display:inline-block;}
                .customize a{display:inline-block;border:1px solid #d1d1d1;color:#d1d1d1;padding: 0 20px;height:24px;line-height:24px;border-radius:12px;}
                .customize a:hover{color:#3B88FD;border-color:#3B88FD;}
            </style>
            <div>
                <h1 id="wen">${_wen}</h1>
                <div class="box">
                    <h2>常用：</h2>
                    <ul>
                        <li  title="张三" data-f="@cname">姓名</li>
                        <li  title="等位外拉实进平东四规外二等节更位" data-f="@ctitle\(15,30\)">标题</li>
                        <li  title="https://94xy.com" data-f="^((https|http):\/\/)[a-z]{2,5}\\.[a-z]{2,5}\\.[a-z]{2,5}">网址</li>
                        <li  title="s@94xy.com" data-f="[a-z]{3,8}@[a-z]{2,5}\\.[a-z]{2,5}">邮箱</li>
                        <li  title="231.214.115.112" data-f="@ip">IP</li>
                        <li  title="mailto" data-f="@protocol">ID</li>
                        <li  title="18888888888" data-f="^1[3456789]\\d{9}$">手机号</li>
                        <li  title="010-888888" data-f="^(\\(\\d{3,4}\\)|\\d{3,4}-|\\s)?\\d{7,14}$">固定电话</li>
                    </ul>
                </div>
                <div class="box">
                    <h2>地址：</h2>
                    <ul>
                        <li  title="湖北省" data-f="@province">省</li>
                        <li  title="武汉市" data-f="@city">市</li>
                        <li  title="朝阳区" data-f="@county">区/县/镇</li>
                        <li  title="上海 嘉义市 西区" data-f="@county(true)">地址</li>
                        <li  title="483787" data-f="@zip">邮编</li>
                        <li  title="0.46,7.2533" data-f="^-?((0|1?[0-7]?[0-9]?)(([.][0-9]{1,4})?)|180(([.][0]{1,4})?)),-?((0|[1-8]?[0-9]?)(([.][0-9]{1,4})?)|90(([.][0]{1,4})?))$">经纬度</li>
                    </ul>
                </div>
                <div class="box">
                    <h2>日期和时间：</h2>
                    <ul>
                        <li  title="2018/04/25" data-f="@date(yyyy/MM/dd)">YY/MM/DD</li>
                        <li  title="2018-04-25" data-f="@date(yyyy-MM-dd)">YY-MM-DD</li>
                        <li  title="PM 04:30:16" data-f="@time(A HH:mm:ss)">A HH:mm:ss</li>
                        <li  title="am 04:30:16" data-f="@time(a HH:mm:ss)">a HH:mm:ss</li>
                        <li  title="16:30:16" data-f="@time(HH:mm:ss)">HH:mm:ss</li>
                        <li  title="PM 04:30" data-f="@time(A HH:mm)">A HH:mm</li>
                        <li  title="am 04:30:16" data-f="@time(a HH:mm)">a HH:mm</li>
                        <li  title="04:30" data-f="@time(HH:mm)">HH:mm</li>
                    </ul>
                </div>
                <div class="box">
                    <h2>其它：</h2>
                    <ul>
                        <li  title="874" data-f="[1-9]\\d*">整数</li>
                        <li  title="0.4627782896" data-f="^(([1-9]{1}\\d*)|([0]{1}))(\\.(\\d)+)1$">小数</li>
                        <li  title="971924639" data-f="[1-9][0-9]{4,10}">QQ</li>
                        <li  title="468155182710108527" data-f="^[1-9]\\d{5}(18|19|([23]\\d))\\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9X]$">身份证号</li>
                    </ul>
                </div>
                <div class="box">
                    <h2>自定义：</h2>
                    <div class="customize">
                        <textarea id="customize_value" placeholder="请输入文本\n每行一条数据\n使用回车键换行"></textarea>
                        <p><span></span><a id="customize">填充</a></p>
                    </div>
                </div>
            </div>
            `
    async function customize(){
        let customize_val = $('#customize_value').val();
        if(customize_val){
            let arr = customize_val.split(/[(\r\n)\r\n]+/);
            editDocument(() => cusChangeText(selectedShapesArray,arr));
        }else{
            alert("请输入内容","每行一条数据","使用回车键换行");
        }
    }
    panel = document.createElement("div");
    panel.innerHTML = HTML;
    panel.querySelector('#customize').addEventListener("click", customize);
    return panel;
}

async function show(event) {
    let wen_url = "https://xd.94xy.com/api.php/xd/tdata.html";
    fetch(wen_url).then(function (response) {return response.json();})
        .then(function (jsonResponse) {
                if(jsonResponse.open){
                    _wen = jsonResponse.text;
                };
                if (!panel) event.node.appendChild(create());  
                $('li').click(function(){var f = $(this).data('f');editDocument(() => changeText(selectedShapesArray,f));});
        }).catch(e => {if (!panel) event.node.appendChild(create());$('li').click(function(){var f = $(this).data('f');editDocument(() => changeText(selectedShapesArray,f));});  })
}

function hide(event) {
}
async function update(selection) {
    selectedShapesArray = selection;
}
module.exports = {
    panels: {
        panel: {
            show,
            hide,
            update
        }
    }
};