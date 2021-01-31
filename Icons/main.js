/**
 *  Icons
 * 
 *  Get access to the entire Font Awesome Pro icon library without ever leaving Adobe XD,
 *  search by name or type, and find the right icon for the job in a matter of seconds.
 *  The use of this plugin requires an active Font Awesome Pro license, and the respective 
 *  fonts installed on this device.
 *
 *  LICENSE: These source files should not be copied, destributed, modified,
 *  altered or used in any way, other than running the original install package,
 *  and using the plugin on a licensed and updated copy of Adobe XD. The plugin
 *  is provided as is and we take no responsibily for any malfunction on both
 *  the plugin and the software itself, nor any loss of data that may follow.
 *
 *  @package    Icons
 *  @author     Unykvis <info@unykvis.com>
 *  @copyright  Unykvis
 *  @since      File available since Release 1.0.0
 */

const {Artboard, BooleanGroup, Color, Ellipse, GraphicNode, Group, Line, LinkedGraphic, Path, Rectangle, RepeatGrid, RootNode, SceneNode, SymbolInstance, Text} = require("scenegraph");             
const $   = sel => document.querySelector(sel);
const LS  = require("uxp").storage;
const LFS = require("uxp").storage.localFileSystem;
const _ = require("./js/lodash.min");
const viewport = require("viewport");
let commands = require("commands");
let dialog;
let dialogID = 'iconsGenerator';
let rowClasses  = 'class="row"';
let itemsperColumn      = 4;
let maxItemsVisible           = 52;  // Safety Switch
let maxItemsVisibleSearch     = 52;  // Safety Switch
let rowNumber           = 0;
let iconsList           = '';
let db;
let dialogWrap;
let iconsJsonKeys;
let all;
let path = 0;

async function iconsGen(selection,documentRoot) {    
    if(!dialog){
        let pluginFolder = await LFS.getPluginFolder();
        let dbFile = await pluginFolder.getEntry("db/icons.json");
        let jsonData = await dbFile.read();
        dialog = createDialog(selection,documentRoot);
        db =  extractFeaturedIcons(JSON.parse(jsonData)); 
        drawDialog(selection,documentRoot,jsonData);  
        all= JSON.parse(jsonData);
    }
    try {
        const r = await dialog.showModal();
        if (r) {
        }
    } catch (err) {
        console.log("ESC dismissed dialog.");
    }   
}

function extractFeaturedIcons(iconsJson){
    let smb = '';
    iconsJsonKeys = Object.keys(iconsJson);
    console.log(db);
    let iconsJsonSelKey;
    let iconCell;
    let iconList = '';
    for (let e = 0; e < maxItemsVisible; e++) {    
        iconsJsonSelKey = iconsJsonKeys[e];
        for (let d = 0; d < iconsJson[iconsJsonSelKey].styles.length; d++) {
            switch (iconsJson[iconsJsonSelKey].styles[d]) {
                case 'brands':
                    iconCell = ''+
                    '<div class="column thumb-grid--cell"><div class="thumb-selector icon-selector" data-index="'+[e]+'" data-code="'+iconsJsonKeys[e]+'" data-style="'+iconsJson[iconsJsonSelKey].styles[d]+'">'+ 
                        '<p class="font-family-fa-brands">'+iconsJsonKeys[e]+'</p>'+
                        // '<img src="/db/pngs/sd/brands/'+iconsJsonKeys[e]+'.svg" style="max-height:20px;max-width:20px;"/>'+
                        // '<div style="background: url(\'/db/pngs/sd/brands/'+iconsJsonKeys[e]+'.svg\');background-size:cover;background-position:center;max-height:20px;max-width:20px;"></div>'+
                    '</div>'+
                    '<div class="image-name">'+iconsJsonKeys[e]+'</div>'+
                    '<div class="image-style">('+iconsJson[iconsJsonSelKey].styles[d]+')</div>'+
                    '</div>';
                    break;
                case 'regular':
                    iconCell = ''+
                    '<div class="column thumb-grid--cell"><div class="thumb-selector icon-selector" data-index="'+[e]+'" data-code="'+iconsJsonKeys[e]+'" data-style="'+iconsJson[iconsJsonSelKey].styles[d]+'">'+ 
                        '<p class="font-family-fa-regular">'+iconsJsonKeys[e]+'</p>'+
                        // '<img src="/db/pngs/sd/regular/'+iconsJsonKeys[e]+'.svg" style="max-height:20px;max-width:20px;"/>'+
                    '</div>'+
                    '<div class="image-name">'+iconsJsonKeys[e]+'</div>'+
                    '<div class="image-style">('+iconsJson[iconsJsonSelKey].styles[d]+')</div>'+
                    '</div>';
                    break;
                case 'solid':
                    iconCell = ''+
                    '<div class="column thumb-grid--cell"><div class="thumb-selector icon-selector" data-index="'+[e]+'" data-code="'+iconsJsonKeys[e]+'" data-style="'+iconsJson[iconsJsonSelKey].styles[d]+'">'+ 
                        '<p class="font-family-fa-solid">'+iconsJsonKeys[e]+'</p>'+
                        // '<img src="/db/pngs/sd/solid/'+iconsJsonKeys[e]+'.svg" style="max-height:20px;max-width:20px;"/>'+
                    '</div>'+
                    '<div class="image-name">'+iconsJsonKeys[e]+'</div>'+
                    '<div class="image-style">('+iconsJson[iconsJsonSelKey].styles[d]+')</div>'+
                    '</div>';
                    break;
                case 'light':
                    iconCell = ''+
                    '<div class="column thumb-grid--cell"><div class="thumb-selector icon-selector" data-index="'+[e]+'" data-code="'+iconsJsonKeys[e]+'" data-style="'+iconsJson[iconsJsonSelKey].styles[d]+'">'+ 
                        '<p class="font-family-fa-light">'+iconsJsonKeys[e]+'</p>'+
                        // '<img src="/db/pngs/sd/light/'+iconsJsonKeys[e]+'.svg" style="max-height:20px;max-width:20px;"/>'+
                        // '<div style="background: url(\'/db/pngs/sd/light/'+iconsJsonKeys[e]+'.svg\');background-size:cover;background-position:center;max-height:20px;max-width:20px;"></div>'+
                    '</div>'+
                    '<div class="image-name">'+iconsJsonKeys[e]+'</div>'+
                    '<div class="image-style">('+iconsJson[iconsJsonSelKey].styles[d]+')</div>'+
                    '</div>';
                    break;    
                default:
                    break;
            }              
        }
        if(e % itemsperColumn == 0 && rowNumber == 0 ){
            iconsList += '<div '+rowClasses+'>';
            iconsList += iconCell;
            rowNumber++;
        }else if(e % itemsperColumn == 0 && rowNumber != 0){
            iconsList += '</div>';
            iconsList += '<div '+rowClasses+'>';
            iconsList += iconCell;
            rowNumber++;
        }else if( iconsJsonKeys.length == e + 1  ){
            iconsList += iconCell;
            iconsList += '</div>';
        }else{
            iconsList += iconCell;
        }
    }     
}

function extractSearchedIcons(filteredJson){
    let smb = '';
    let testRead = filteredJson;
    let i=0;
    let iconCell;
    while(testRead[i] != undefined && i < maxItemsVisibleSearch){
        for (let d = 0; d < testRead[i].styles.length; d++) {
            switch (testRead[i].styles[d]) {
                case 'brands':
                    iconCell = ''+
                    '<div class="column thumb-grid--cell"><div class="thumb-selector icon-selector" data-index="'+[i]+'" data-code="'+testRead[i].name+'" data-style="'+testRead[i].styles+'">'+ 
                        '<p class="font-family-fa-brands">'+testRead[i].name+'</p>'+
                        // '<img src="/db/pngs/sd/brands/'+testRead[i].name+'.svg" style="max-height:20px;max-width:20px;"/>'+
                    '</div>'+
                    '<div class="image-name">'+testRead[i].name+'</div>'+
                    '<div class="image-style">('+testRead[i].styles[d]+')</div>'+
                    '</div>';
                    break;
                case 'regular':
                    iconCell = ''+
                    '<div class="column thumb-grid--cell"><div class="thumb-selector icon-selector" data-index="'+[i]+'" data-code="'+testRead[i].name+'" data-style="'+testRead[i].styles+'">'+ 
                        '<p class="font-family-fa-regular">'+testRead[i].name+'</p>'+
                        // '<img src="/db/pngs/sd/regular/'+testRead[i].name+'.svg" style="max-height:20px;max-width:20px;"/>'+
                    '</div>'+
                    '<div class="image-name">'+testRead[i].name+'</div>'+
                    '<div class="image-style">('+testRead[i].styles[d]+')</div>'+
                    '</div>';
                    break;
                case 'solid':
                    iconCell = ''+
                    '<div class="column thumb-grid--cell"><div class="thumb-selector icon-selector" data-index="'+[i]+'" data-code="'+testRead[i].name+'" data-style="'+testRead[i].styles+'">'+ 
                        '<p class="font-family-fa-solid">'+testRead[i].name+'</p>'+
                        // '<img src="/db/pngs/sd/solid/'+testRead[i].name+'.svg" style="max-height:20px;max-width:20px;"/>'+
                    '</div>'+
                    '<div class="image-name">'+testRead[i].name+'</div>'+
                    '<div class="image-style">('+testRead[i].styles[d]+')</div>'+
                    '</div>';
                    break;
                case 'light':
                    iconCell = ''+
                    '<div class="column thumb-grid--cell"><div class="thumb-selector icon-selector" data-index="'+[i]+'" data-code="'+testRead[i].name+'" data-style="'+testRead[i].styles+'">'+ 
                        '<p class="font-family-fa-light">'+testRead[i].name+'</p>'+
                        // '<img src="/db/pngs/sd/light/'+testRead[i].name+'.svg" style="max-height:20px;max-width:20px;"/>'+
                    '</div>'+
                    '<div class="image-name">'+testRead[i].name+'</div>'+
                    '<div class="image-style">('+testRead[i].styles[d]+')</div>'+
                    '</div>';
                    break;    
                default:
                    break;
            }
        }
        if(i % itemsperColumn == 0 && rowNumber == 0 ){
            iconsList += '<div '+rowClasses+'>';
            iconsList += iconCell;
            rowNumber++;
        }else if(i % itemsperColumn == 0 && rowNumber != 0){
            iconsList += '</div>';
            iconsList += '<div '+rowClasses+'>';
            iconsList += iconCell;
            rowNumber++;
        }else if( testRead.length == i + 1  ){
            iconsList += iconCell;
            iconsList += '</div>';
        }else{
            iconsList += iconCell;
        }
        i++;
    }
}

function createDialog(){
    const sel = `#${dialogID}`;  
    document.body.innerHTML =  
        `<dialog id="${dialogID}">
            <div class='dialog-wrap'>
            <div>
        </dialog>`;
    dialog = document.querySelector(sel);
    return dialog;
}

function drawDialog(selection,documentRoot, jsonData) {
    dialogWrap = document.querySelector('.dialog-wrap');    
    let dialogContent = 
    '<style>'+
        // 'img{border:solid 1px red;}'+
        '.o-hidden{overflow:hidden;}'+
        '.o-x-scroll{overflow-x:scroll;}'+
        '.o-y-scroll{overflow-y:scroll;}'+
        '.m-0{magin:0;}'+
        '.p-0{padding:0;}'+
        '.p-5{padding:20px;}'+
        '.thumb-grid--cell{overflow:hidden; background:#fff; width:80px; height:100px;margin-right:10px;margin-left:10px;margin-bottom:20px;border-radius:5px;border: solid 1px #E1E1E1;position:relative;}'+
        '.thumb-selector{width:78px;height:55px;overflow:hidden;border-color:orange;background:#eee;text-align:center;padding:10px 1px;border-radius:5px;position:relative;text-transform:capitalize;border-bottom:1px #e1e1e1;display: flex;flex-direction: row;flex-wrap: nowrap;justify-content:center ;align-items: center;text-align:center;position:relative;}'+
        '.thumb-text{font-size:10px;margin:0; width:70px; display: flex; flex-direction: column ; color:#d0d0d0;}'+
        '.thumb-alt{ overflow:hidden; height:30px;font-size:10px;margin:0;padding-top:0;padding-bottom:0;padding-right:5px;padding-left:5px;line-height:5px;}'+ 
        '.thumb-caption{width:78px; min-height:40px;text-align:left;position:relative;display: block;display: flex; flex-direction: row;justify-content:center ;align-items: center;text-align:center;position:relative;border-top: 1px #e1e1e1;color:#ABABAB;}'+
        '.thumb-size {text-align:left;}'+
        '.image-name{color:#707070;font-size:10px;text-align:center; }'+
        '.image-style{color:#707070;font-size:10px;text-align:center; font-weight:bold;}'+
        '.thumb-width {text-align:right;}'+
        '.bg-dark{display:none}'+
        '.darkbg .bg-dark{display:block}'+
        '.darkbg .bg-light{display:none}'+
        '.darkbg .thumb-selector{background:#282828;}'+
        '.bg_image_200{position:absolute;top:0;left:0;width: 115px;height: 115px;}'+
        '.svg-badge{background:#ed6363; padding:3px; border-radius:5px; font-weight:bold; font-size:10px; position:absolute; top:5px; right:5px;}'+
        '.jpg-badge{background:#3a99ff; padding:3px; border-radius:5px; font-weight:bold; font-size:10px; position:absolute; top:5px; right:5px;}'+
        '.png-badge{background:#50e595; padding:3px; border-radius:5px; font-weight:bold; font-size:10px; position:absolute; top:5px; right:5px;}'+
        '.svg-notice{padding:15px; text-align:center; font-weight:bold; color:red; font-size:12px; position:absolute; bottom:5px; right:5px;}'+
        '.scrollsection{width:420px;height:250px; background:#fff;padding:15px 10px;border-radius:5px;}'+
        '.copyright-text{font-size:10px;margin:0;margin-right:25px;margin-bottom:0px;margin-bottom:0px;}'+
        '.copyright-wrapper{position:relative;}'+
        '.copyright-container{justify-self:left;padding:0;left:0;}'+
        '.font-family-fa-regular {font-size:20px;font-family:"Font Awesome 5 Pro";font-style:regular;font-weight:regular;}'+
        '.font-family-fa-solid   {font-size:20px;font-family:"Font Awesome 5 Pro";font-style:solid;font-weight:solid;}'+
        '.font-family-fa-light   {font-size:20px;font-family:"Font Awesome 5 Pro";font-style:right;font-weight:light;}'+
        '.font-family-fa-brands  {font-size:20px;font-family:"Font Awesome 5 Brands";}'+
        '#iconFam,#iconType{width:100%;}'+
        '#search{display:inline;width:298px;}'+
        // '#iconFam,#iconType{display:inline-block;}'+
    '</style>'+
    '<form method="dialog" id="formSubmitURL">' + 
        '<div class="o-hidden">'+
            '<div class="row">'+
                '<h1>'+
                    'Icons'+
                '</h1>'+
            '</div>'+
            // '<div class="row">'+
            //     '<label>'+
            //         '<span>Select an icon family:</span>'+
            //         '<select disabled id="iconFam">'+
            //             '<option value="fontawesome">Font Awesome (Free)</option>'+
            //             '<option selected value="fontawesome-pro">Font Awesome Pro</option>'+
            //             '<option value="other">Other</option>'+
            //         '</select>'+
            //     '</label>'+
            // '</div>'+
            '<div class="row">'+
                '<label>'+
                    '<span>Filter by style:</span>'+
                    '<select id="iconType">'+
                        '<option selected value="all">All styles</option>'+
                        '<option value="brands">Brands</option>'+
                        '<option value="solid">Solid</option>'+
                        '<option value="regular">Regular</option>'+
                        '<option value="light">Light</option>'+
                    '</select>'+
                '</label>'+
            '</div>'+
            '<div class="row">'+
                '<label>'+
                    '<span>Search your icon:</span><br>'+
                    '<div><input type="text" uxp-quiet="false" id="search" placeholder="Type a Name or Type"/></div>'+
                '</label>'+
            '</div>'+
            // '<label><span>Select an Icon:</span></label>'+
            '<div class="row">'+
                '<div class="o-v scrollsection o-y-scroll m-0 p-0">' + 
                    '<div id="result-list" class="icon-list"><div>'+iconsList+'</div></div>'+
                '</div>'+
            '</div>'+
        '</div>'+
        '<footer class="m-0 p-0 copyright-wrapper">'+
            '<div class="copyright-container">'+
                '<div class="row">'+
                    '<input type="checkbox" uxp-quiet="false" id="path"/>'+
                    '<label>'+
                        '<span>Place icon as shape</span>'+
                    '</label>'+
                '</div>'+
                '<p class="copyright-text">Font Awesome\'s brand and font copyrights belong to Fonticons, Inc.<br>'+
                'Notice: This plugin requires an active Font Awesome Pro license and<br>'+ 
                'the fonts installed in this device in order to work.</p>'+
            '</div>'+
            '<button uxp-variant="secondary" id="cancel" class="cancelbutton">Cancel</button>'+
        '</footer>'+
    '</form>'
    let form = document.createElement('form');
    form.innerHTML = dialogContent;
    dialog.appendChild(form);
    const cancel = document.getElementById('cancel');
    const submit = () => {dialog.close();}
    var anchors = document.getElementsByClassName('icon-selector');
    for(var i = 0; i < anchors.length; i++) {
        let elem = anchors[i];
        elem.addEventListener("click", (e) => {
            let code = elem.getAttribute("data-code");
            let style = elem.getAttribute("data-style");
            createStyledTextHandlerFunction(selection,documentRoot,code, style);
            submit();
        });
    }
    cancel.addEventListener("click", () => {dialog.close();});
    
    const fashape = document.getElementById('path'); 
    fashape.addEventListener("change", () =>{
        if(path == 0){
            path = 1
        }
        else{
            path = 0
        }
    })
    // cancel.addEventListener("click", () => {dialog.close();});
    const fatype = document.getElementById('iconType');
    fatype.addEventListener("change", () =>{     
        let iteArry = 0;
        let finalFiltered = [];
        let resultList = document.getElementById('result-list');
        if (searchInput.value == null || searchInput.value == ""){
            resultList.innerHTML = "";
            iteArry = 0;
            iconsList = "";
            for (let k = 0; k < Object.keys(all).length; k++) {
                let arrayKey = Object.keys(all)[k];
                for (let y = 0; y < all[arrayKey].styles.length; y++) {
                    if (all[arrayKey].styles[y]==fatype.value) { 
                        finalFiltered[iteArry] = _.cloneDeep(all[arrayKey]);
                        finalFiltered[iteArry].name = arrayKey;
                        console.log(fatype.value);
                        finalFiltered[iteArry].styles = [fatype.value];
                        iteArry++;
                    }
                }
            }
            extractSearchedIcons(finalFiltered);
            resultList.innerHTML = iconsList;
            anchors = document.getElementsByClassName('icon-selector');
            for(var i = 0; i < anchors.length; i++) {
                let elem = anchors[i];
                elem.addEventListener("click", (e) => {
                    let code = elem.getAttribute("data-code");
                    let style = elem.getAttribute("data-style");
                    createStyledTextHandlerFunction(selection,documentRoot,code, style);
                    submit();
                });
            }
        }
        else{
            resultList.innerHTML = "";
            iconsList = "";
            var filteredJson=iconsJsonKeys.filter(function(item){
                if (item==searchInput.value || (item).indexOf(searchInput.value) > -1 ) {
                    return item;
                }    
            });
            for (let x = 0; x < filteredJson.length; x++) {
                let ite = filteredJson[x];
                finalFiltered[x] = _.cloneDeep(all[ite]);
                finalFiltered[x].name = ite;  
                if (fatype.value != 'brands' && !all[ite].styles.includes('brands')){
                    finalFiltered[x].styles=[fatype.value];
                }
            }
            extractSearchedIcons(finalFiltered);
            resultList.innerHTML = iconsList;
            anchors = document.getElementsByClassName('icon-selector');
            for(var i = 0; i < anchors.length; i++) {
                let elem = anchors[i];
                elem.addEventListener("click", (e) => {
                    let code = elem.getAttribute("data-code");
                    let style = elem.getAttribute("data-style");
                    let pathpath = fashape.value;
                    createStyledTextHandlerFunction(selection,documentRoot,code, style, pathpath);
                    submit();
                });
            }
        }
    });

    const searchInput = document.getElementById('search');
    searchInput.addEventListener("input", () =>{     
        
        if (fatype.value == null || fatype.value == ""){
            let finalFiltered = [];
            let resultList = document.getElementById('result-list');
            resultList.innerHTML = "";
            iconsList = "";
            var filteredJson=iconsJsonKeys.filter(function(item){
                if (item==searchInput.value || (item).indexOf(searchInput.value) > -1 ) {
                    return item;
                }    
            });
            for (let x = 0; x < filteredJson.length; x++) {
                let ite = filteredJson[x];
                finalFiltered.push(all[ite]); 
                finalFiltered[x].name = ite;          
            }
            extractSearchedIcons(finalFiltered);
            resultList.innerHTML = iconsList;
            anchors = document.getElementsByClassName('icon-selector');
            for(var i = 0; i < anchors.length; i++) {
                let elem = anchors[i];
                elem.addEventListener("click", (e) => {
                    let code = elem.getAttribute("data-code");
                    let style = elem.getAttribute("data-style");
                    createStyledTextHandlerFunction(selection,documentRoot,code, style);
                    submit();
                });
            }
        }
        else{
            let finalFiltered = [];
            let resultList = document.getElementById('result-list');
            resultList.innerHTML = "";
            iconsList = "";
            var filteredJson=iconsJsonKeys.filter(function(item){
                if (item==searchInput.value || (item).indexOf(searchInput.value) > -1 ) {
                    if(all[item].styles.includes(fatype.value)){
                        return item;
                    }
                }     
            });
            for (let x = 0; x < filteredJson.length; x++) {
                let ite = filteredJson[x];
                finalFiltered.push(all[ite]); 
                finalFiltered[x].name = ite;                 
            }
            extractSearchedIcons(finalFiltered);
            resultList.innerHTML = iconsList;
            anchors = document.getElementsByClassName('icon-selector');
            for(var i = 0; i < anchors.length; i++) {
                let elem = anchors[i];
                elem.addEventListener("click", (e) => {
                    let code = elem.getAttribute("data-code");
                    let style = elem.getAttribute("data-style");
                    createStyledTextHandlerFunction(selection,documentRoot,code, style);
                    submit();
                });
            }
        }
    });
    return dialog;
}

function createStyledTextHandlerFunction(selection,documentRoot,code, style) {
    const node = new Text();   
    if (code.includes("_")){
        let codeFix = code.replace("_", "-")
        node.text = codeFix;
    }
    else{
        node.text = code;
    }
    if(style=='brands'){
        console.log('brands');
        node.styleRanges = [{                     
            length: node.text.length,
            fill: new Color("#FF0000"),
            fontFamily: 'Font Awesome 5 Brands',       
            fontSize: 24
        }];
    }         
    else if (style=='regular'){
        console.log('regular');
        node.styleRanges = [{                     
            length: node.text.length,
            fill: new Color("#FF0000"),
            fontFamily: 'Font Awesome 5 Pro',
            fontStyle:  'Regular',
            fontSize: 24
        }];
    }   
    else if (style=='solid'){
        console.log('solid');
        node.styleRanges = [{                     
            length: node.text.length,
            fill: new Color("#FF0000"),
            fontFamily: 'Font Awesome 5 Pro',
            fontStyle:  'Solid',
            fontSize: 24
        }];
    }   
    else if (style=='light'){
        console.log('light');
        node.styleRanges = [{                     
            length: node.text.length,
            fill: new Color("#FF0000"),
            fontFamily: 'Font Awesome 5 Pro',
            fontStyle:  'Light',
            fontSize: 24
        }];
    } 
    else{
        node.styleRanges = [{                     
            length: node.text.length,
            fill: new Color("#FF0000"),
            fontFamily: 'Font Awesome 5 Pro',
            fontStyle:  'Regular',
            fontSize: 24
        }];
    }     
    selection.insertionParent.addChild(node); 
    node.moveInParentCoordinates(20, 50);   
    viewport.zoomToRect(node.parent);
    console.log(path);
    if( path == 1){
        selection.items = [node];
        commands.convertToPath();
    }
}

module.exports = {
    commands: {
        iconsGenerator: iconsGen
    }
};