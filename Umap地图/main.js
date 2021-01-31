let panel,lat=39.913138,lng=116.405338;
const { ImageFill } = require("scenegraph");
const {editDocument} = require("application");
const {alert} = require("/utils/dialogs.js");
const uxp = require("uxp");
const fs = uxp.storage.localFileSystem;
const $ = require("/utils/jquery");
var selectedShapesArray = null;
var photoUrl=null;
var zoom = 14;
var _wen = '文家齐提供技术支持';
const { appLanguage } = require("application");
const supportedLanguages = require("./manifest.json").languages;
const strings = require("./strings.json");
const uiLang = supportedLanguages.includes(appLanguage)
    ? appLanguage
    : supportedLanguages[0];
function create() {
    const HTML =
        `<style>
            .spread { justify-content: space-between; }
            .ser_box{position: relative;}
            .ser_box .ser{
                line-height:24px;
                height:24px;
                box-sizing: border-box;
                border:1px solid #3597EC;
                padding: 0 10px;
                color: #3597EC;
                border-radius:4px;
                font-size:10px;
            }
            label{max-width:100%;}
            .ser_box .ser:hover{
                color:#2393F3;
                border-color:#2393F3;
            }
            .ser_box ul{
                margin-right:100px;
                position: absolute;
                top:29px;
                left:8px;
                line-height:24px;
                padding:10px;
                box-sizing: border-box;
                background: #FBFCFB;
            }
            #zom{width:90%;}
        </style>
        <form method="dialog" id="main">
            <h1 id="wen">${_wen}</h1>
            <label class="row">
                <span>${strings[uiLang].map}</span>
                <select id="map">
                     <option value="1" selected>${strings[uiLang].tencent}</option>
                     <option value="2">${strings[uiLang].amap}</option>
                     <option value="3">${strings[uiLang].baidu}</option>
                     <option value="4">${strings[uiLang].google}</option>
                </select>
            </label>
            <label>
                <div class="row spread">
                    <span>${strings[uiLang].zom}</span>
                    <span id="zom_num">14</span>
                </div>
                <input id="zom" type="range" min=4 max=17 value=14 />
            </label>
            <label class="row ser_box">
                <input id="key_word" type="text" placeholder="${strings[uiLang].val}"/>
                <span class="ser" id="ser">${strings[uiLang].ser}</span>
                <ul class="location_list">
                </ul>
            </label>
            <footer><button id="ok" type="submit" uxp-variant="cta">${strings[uiLang].apply}</button></footer>
        </form>
        <div id="ts"></div>
        `
    async function zom(){
        $('#zom_num').html(($('#zom').val()).toFixed());
        zoom = ($('#zom').val()).toFixed();
    }
    async function ser(){
        let str_html = '';
        let url = '';
        let key_word = $('#key_word').val()?$('#key_word').val():'北京';
        if(($('#map').val())[1]==2){
            url = encodeURI("https://restapi.amap.com/v3/place/text?city=beijing&key=ed0042177b0072f634ca954acb79a133&scale=2&keywords="+key_word);
            fetch(url).then(function (response) {
                return response.json();
            }).then(function (jsonResponse) {
                for(var i = 0;i<jsonResponse.pois.length;i++){
                    str_html=str_html+"<li>"+jsonResponse.pois[i].name+"</li>";
                }
                $('ul').html(str_html);
                for(var i = 0;i<jsonResponse.pois.length;i++){
                    $('li')[i].setAttribute('title', jsonResponse.pois[i].name);
                    $('li')[i].setAttribute('lat', jsonResponse.pois[i].location.split(",")[1]);
                    $('li')[i].setAttribute('lng', jsonResponse.pois[i].location.split(",")[0]);
                    $('li')[i].addEventListener("click", sel_loca,false);
                }
                $('ul').show();               
            });
        }else if(($('#map').val())[1]==3){
            url = encodeURI("https://api.map.baidu.com/place/v2/suggestion?query="+key_word+"&region=北京&output=json&ak=H4S4C28HW2G225ekepBTkAfVy3YnRsLw&scale=2");
            fetch(url).then(function (response) {
                return response.json();
            }).then(function (jsonResponse) {
                for(var i = 0;i<jsonResponse.result.length;i++){
                    str_html=str_html+"<li>"+jsonResponse.result[i].name+"</li>";
                }
                $('ul').html(str_html);
                for(var i = 0;i<jsonResponse.result.length;i++){
                    $('li')[i].setAttribute('title', jsonResponse.result[i].name);
                    $('li')[i].setAttribute('lat', jsonResponse.result[i].location.lat);
                    $('li')[i].setAttribute('lng', jsonResponse.result[i].location.lng);
                    $('li')[i].addEventListener("click", sel_loca,false);
                }
                $('ul').show();               
            });
        }else if(($('#map').val())[1]==4){
            url = encodeURI("https://maps.googleapis.com/maps/api/place/textsearch/json?query="+key_word+"&key=AIzaSyC__JDjdZ7cgznfFRwG2ptMpKczk8LpExw");
            fetch(url).then(function (response) {
                return response.json();
            }).then(function (jsonResponse) {
                for(var i = 0;i<jsonResponse.results.length;i++){
                    str_html=str_html+"<li>"+jsonResponse.results[i].name+"</li>";
                }
                $('ul').html(str_html);
                for(var i = 0;i<jsonResponse.results.length;i++){
                    $('li')[i].setAttribute('title', jsonResponse.results[i].name);
                    $('li')[i].setAttribute('lat', jsonResponse.results[i].geometry.location.lat);
                    $('li')[i].setAttribute('lng', jsonResponse.results[i].geometry.location.lng);
                    $('li')[i].addEventListener("click", sel_loca,false);
                }
                $('ul').show();               
            });
        }else{
            url = encodeURI("https://apis.map.qq.com/ws/place/v1/search?boundary=region(北京,1)&key=46VBZ-TTHWX-LSP4Q-7YOET-T5KB7-5UFL4&scale=2&keyword="+key_word);
            fetch(url).then(function (response) {
                return response.json();
            }).then(function (jsonResponse) {
                for(var i = 0;i<jsonResponse.data.length;i++){
                    str_html=str_html+"<li>"+jsonResponse.data[i].title+"</li>";
                }
                $('ul').html(str_html);

                for(var i = 0;i<jsonResponse.data.length;i++){
                    $('li')[i].setAttribute('title', jsonResponse.data[i].title);
                    $('li')[i].setAttribute('lat', jsonResponse.data[i].location.lat);
                    $('li')[i].setAttribute('lng', jsonResponse.data[i].location.lng);
                    $('li')[i].addEventListener("click", sel_loca,false);
                }
                $('ul').show();               
            });
        }
    }
    async function wen(){
        if (selectedShapesArray.items.length) {
            let {width, height} = selectedShapesArray.items[0];
            if(!width|!height){
                width = 500;
                height = 500;
            }
            if(($('#map').val())[1]==2){
                photoUrl = "https://restapi.amap.com/v3/staticmap?key=ed0042177b0072f634ca954acb79a133&zoom="+zoom+"&location="+lng+","+lat+"&size="+(width.toFixed())+"*"+(height.toFixed());
            }else if(($('#map').val())[1]==3){
                photoUrl = "https://api.map.baidu.com/staticimage/v2?ak=H4S4C28HW2G225ekepBTkAfVy3YnRsLw&zoom="+zoom+"&center="+lng+","+lat+"&width="+(width.toFixed())+"&height="+(height.toFixed());
            }else if(($('#map').val())[1]==4){
                photoUrl = "https://maps.googleapis.com/maps/api/staticmap?key=AIzaSyC__JDjdZ7cgznfFRwG2ptMpKczk8LpExw&zoom="+zoom+"&center="+lat+","+lng+"&size="+(width.toFixed())+"x"+(height.toFixed())+"&scale=2";
            }else{
                photoUrl = "https://apis.map.qq.com/ws/staticmap/v2/?key=46VBZ-TTHWX-LSP4Q-7YOET-T5KB7-5UFL4&zoom="+zoom+"&center="+lat+","+lng+"&size="+(width.toFixed())+"*"+(height.toFixed());
            }
            editDocument(() => downloadImage(selectedShapesArray, photoUrl));
        }else{
            alert(`${strings[uiLang].sel}`);
        }
    }
    async function sel_loca(){
        // this.getAttribute('lat')
        lat = this.getAttribute('lat');
        lng = this.getAttribute('lng');
        $('#key_word').val(this.getAttribute('title'));
        $('ul').hide();
    }
    panel = document.createElement("div");
    panel.innerHTML = HTML;
    panel.querySelector('#zom').addEventListener("change", zom);
    panel.querySelector('#ser').addEventListener("click", ser);
    panel.querySelector("form").addEventListener("submit", wen);
    return panel;
}

 async function show(event) {
    let wen_url = "https://xd.94xy.com/api.php/xd.html";
    fetch(wen_url).then(function (response) {return response.json();})
        .then(function (jsonResponse) {
                if(jsonResponse.open){
                    _wen = jsonResponse.text;
                };
                if (!panel) event.node.appendChild(create());  
                $('ul').hide(); 
        }).catch(e => {if (!panel) event.node.appendChild(create());$('ul').hide();  })
}

function hide(event) {
}

async function update(selection) {
    selectedShapesArray = selection;
}
async function downloadImage(selectedShapesArray, photoUrl) {
    try {
        const photoObj = await xhrBinary(photoUrl);
        const tempFolder = await fs.getTemporaryFolder();
        const tempFile = await tempFolder.createFile("tmp", { overwrite: true });
        await tempFile.write(photoObj, { format: uxp.storage.formats.binary });
        applyImagefill(selectedShapesArray, tempFile);
    } catch (err) {
        if(err.message == undefined){
            alert(`${strings[uiLang].net}`);
        }else{
            alert(`${strings[uiLang].sel}`);
        }
    }
}

function xhrBinary(url) {
    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest();
        req.onload = () => {
            if (req.status === 200) {
                try {
                    const arr = new Uint8Array(req.response);
                    resolve(arr);
                } catch (err) {
                    reject('Couldnt parse response. ${err.message}, ${req.response}');
                }
            } else {
                reject('Request had an error: ${req.status}');
            }
        }
        req.onerror = reject;
        req.onabort = reject;
        req.open('GET', url, true);
        req.responseType = "arraybuffer";
        req.send();
    });
}

function applyImagefill(selectedShapesArray, file) {
    const imageFill = new ImageFill(file);
    selectedShapesArray.items[0].fill = imageFill;
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