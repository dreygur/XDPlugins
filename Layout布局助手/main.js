let panel;
var keyword,num,align = false,selectedShapesArray = null;
const application = require("application");
const { Group,Rectangle } = require("scenegraph");
const $ = require("/utils/jquery");
var _wen = '文家齐提供技术支持';
const { appLanguage } = require("application");
const supportedLanguages = require("./manifest.json").languages;
const strings = require("./strings.json");
const uiLang = supportedLanguages.includes(appLanguage)
    ? appLanguage
    : supportedLanguages[0];
function create(){
	const HTML =
        `<style>
            .box{
                display:flex;
            }
            .box div{
                padding:8px;
                flex:1
            }
            h2{
                margin-bottom:10px;
            }
            #jianju{
                margin:0;
                margin-bottom:10px;
                height:24px;
            }
            ul{
                display:flex;
                flex-wrap:wrap;
                justify-content:space-between;
                padding:10px 8px;
            }
            ul li{
                width:40px;
                height:40px;
                background-size:contain;
                background-repeat:no-repeat;
                margin-bottom:30px;
                margin-right:20px;
                cursor: pointer;
            }
            
            .lr{
                background-image:url(images/lr.png);
            }
            .lr.cur{
                background-image:url(images/lr2.png);
            }
            .hc{
                background-image:url(images/hc.png);
            }
            .hc.cur{
                background-image:url(images/hc2.png);
            }
            .rl{
                background-image:url(images/rl.png);
            }
            .rl.cur{
                background-image:url(images/rl2.png);
            }
            .tb{
                background-image:url(images/tb.png);
            }
            .tb.cur{
                background-image:url(images/tb2.png);
            }
            .vc{
                background-image:url(images/vc.png);
            }
            .vc.cur{
                background-image:url(images/vc2.png);
            }
            .bt{
                background-image:url(images/bt.png);
            }
            .bt.cur{
                background-image:url(images/bt2.png);
            }
            #merge{
                width:100%;
                border:1px solid #1492E6;
                text-align:center;
                height:30px;
                line-height:28px;
                border-radius:15px;
                font-size:14px;
                box-sizing: border-box;
                color:#1492E6;
                cursor:pointer;
            }
            #merge:hover{
                background:#1492E6;
                color:#fff;
                cursor:pointer;
            }
        </style>
        <div>
            <h1 id="wen">${_wen}</h1>
            <div class="box">
                <div class="jianju_box">
                    <h2>${strings[uiLang].spacing}</h2>
                    <input id="jianju" placeholder="${strings[uiLang].spacing2}" type="text" />
                </div>
                <div class="duiqi_box">
                    <h2>${strings[uiLang].align}</h2>
                    <input type="checkbox" id="duiqi"/>
                </div>
            </div>
            
            <h2>${strings[uiLang].title}</h2>
            <ul>
                <li class="list lr" data-keyword="lr" title="从左往右"></li>
                <li class="list hc" data-keyword="hc" title="水平居中"></li>
                <li class="list rl" data-keyword="rl" title="从右往左"></li>
                <li class="list tb" data-keyword="tb" title="从上往下"></li>
                <li class="list vc" data-keyword="vc" title="垂直居中"></li>
                <li class="list bt" data-keyword="bt" title="从下往上"></li>
            </ul>
        	<div id="des" style="display:none"><p style='color:red'>${strings[uiLang].group}</p></div>
        </div>
        `
    function cla(){
        $('.list').removeClass('cur');
        $(this).addClass('cur');
        if(selectedShapesArray.items[0] != undefined&selectedShapesArray.items[0] instanceof Group){
            application.editDocument(() => auto())
        }else{
            $('#des').show();
        }
    }
    function align2(){
        align?align=false:align=true;
    }
    panel = document.createElement("div");
    panel.innerHTML = HTML;
    panel.querySelector('#duiqi').addEventListener("click", align2);
    panel.querySelector('.lr').addEventListener("click", cla);
    panel.querySelector('.hc').addEventListener("click", cla);
    panel.querySelector('.rl').addEventListener("click", cla);
    panel.querySelector('.tb').addEventListener("click", cla);
    panel.querySelector('.vc').addEventListener("click", cla);
    panel.querySelector('.bt').addEventListener("click", cla);
    return panel;
}
async function auto(){
    let newArr,aArr;
    var par = selectedShapesArray.items[0];
    if( par instanceof Group){
        let fir = par.name.indexOf("<");
        if(fir == -1){
            par['name'] = par.name+'< '+ $('.list.cur').data('keyword') +' '+Number($('#jianju').val())+' >';
        }else{
            let tt = par.name.slice(fir);
            par['name'] = par.name.replace(tt,'< '+ $('.list.cur').data('keyword') +' '+Number($('#jianju').val())+' >')
        }
            keyword = $('.list.cur').data('keyword');
            num     = Number($('#jianju').val());
            newArr  = [];
            await par.children.forEach(function (e, i) {
                aArr      = [];
                aArr['x'] = e.globalBounds.x;
                aArr['y'] = e.globalBounds.y;
                aArr['w'] = e.localBounds.width;
                aArr['h'] = e.localBounds.height;
                aArr['e'] = e;
                newArr.push(aArr);
            });
            let l,r;
            switch (keyword){
                // 从左至右布局
                case 'lr':
                    newArr.sort(function(a, b){return a.x - b.x}); 
                    l = Number(newArr[0].x);
                    await newArr.forEach(function (e,i){
                        if(align){r = newArr[0].y-e.y}else{r=0};
                        if(i>0){
                            l = l+Number(newArr[(i-1)].w) + Number(num);
                            e.e.moveInParentCoordinates(l-e.x,r);
                        }
                    })
                    break;
                // 水平居中布局
                case 'hc':
                    newArr.sort(function(a, b){return a.x - b.x}); 
                    l = Number(newArr[0].x);
                    await newArr.forEach(function (e,i){
                        if(align){r = newArr[0].y-e.y}else{r=0};
                        if(i>0){
                            l = l+Number(newArr[(i-1)].w) + Number(num);
                            e.e.moveInParentCoordinates(l-e.x,r);
                        }
                    })
                    let oldXCenter = (newArr[(newArr.length-1)].x+newArr[(newArr.length-1)].w - newArr[0].x)/2+newArr[0].x;
                    let newXCenter = (l+newArr[(newArr.length-1)].w-newArr[0].x)/2+newArr[0].x;
                    par.moveInParentCoordinates(oldXCenter-newXCenter,r);
                    break;
                case 'rl':
                    newArr.sort(function(a, b){return b.x - a.x}); 
                    l = Number(newArr[0].x);
                    await newArr.forEach(function (e,i){
                        if(align){r = newArr[0].y-e.y}else{r=0};
                        if(i>0){
                            l = l - Number(num)-Number(e.w);
                            e.e.moveInParentCoordinates(l-e.x,r);
                        }
                    })
                    break;
                case 'tb':
                    newArr.sort(function(a, b){return a.y - b.y}); 
                    l = Number(newArr[0].y);
                    await newArr.forEach(function (e,i){
                        if(align){r = newArr[0].x-e.x}else{r=0};
                        if(i>0){
                            l = l+Number(newArr[(i-1)].h) + Number(num);
                            e.e.moveInParentCoordinates(r,l-e.y);
                        }
                    })
                    break;
                case 'vc':
                    newArr.sort(function(a, b){return a.y - b.y}); 
                    l = Number(newArr[0].y);
                    await newArr.forEach(function (e,i){
                        if(align){r = newArr[0].x-e.x}else{r=0};
                        if(i>0){
                            l = l+Number(newArr[(i-1)].h) + Number(num);
                            e.e.moveInParentCoordinates(r,l-e.y);
                        }
                    })
                    let oldYCenter = (newArr[(newArr.length-1)].y+newArr[(newArr.length-1)].h - newArr[0].y)/2+newArr[0].y;
                    let newYCenter = (l+newArr[(newArr.length-1)].h-newArr[0].y)/2+newArr[0].y;
                    par.moveInParentCoordinates(r,oldYCenter-newYCenter);
                    break;
                case 'bt':
                    newArr.sort(function(a, b){return b.y - a.y}); 
                    l = Number(newArr[0].y);
                    await newArr.forEach(function (e,i){
                        if(align){r = newArr[0].x-e.x}else{r=0};
                        if(i>0){
                            l = l - Number(num)-Number(e.h);
                            e.e.moveInParentCoordinates(r,l-e.y);
                        }
                    })
                    break;
            }
    }
}
async function show(event,docRoot) {
    let wen_url = "https://xd.94xy.com/api.php/xd/layout.html";
    fetch(wen_url).then(function (response) {return response.json();})
        .then(function (jsonResponse) {
                if(jsonResponse.open){
                    _wen = jsonResponse.text;
                };
                if (!panel) event.node.appendChild(create());  
        }).catch(e => {if (!panel) event.node.appendChild(create());})
}
function hide(event) {}
async function update(selection,documentRoot) {
	selectedShapesArray = selection;
    $('#des').hide();
    if(selectedShapesArray.items[0] != undefined&selectedShapesArray.items[0] instanceof Group){
        var par = selectedShapesArray.items[0];
        let fir = par.name.indexOf("<");
        $('#des').html('');
        if(fir == -1){
            $('ul li').removeClass('cur');
            $('#jianju').val(0);
        }else{
            let tt = par.name.slice(fir,-1);
            let arr = tt.split(" ");
            keyword = arr[1];
            $('ul li').removeClass('cur');
            $('.'+arr[1]).addClass('cur');
            num = arr[2];
            $('#jianju').val(arr[2]);
        }  
    }else{
        $('ul li').removeClass('cur');
        $('#jianju').val('');
    }
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
