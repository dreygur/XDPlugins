/*
 * Sample plugin scaffolding for Adobe XD.
 *
 * Visit http://adobexdplatform.com/ for API docs and more sample code.
 */


const { selection } = require("scenegraph");
var commands = require("commands");
let application = require("application");
let panel;
let actionData;
let numReplaced
let clipboard;
let marked;
let status={
    copy:'',
    mark:'',
    global:''
};


function show(event) {
  if (!panel) {
      panel = document.createElement("div");
      event.node.appendChild(panel);
  }
}
function reset(){
        actionData=[];
        numReplaced=0
        clipboard=null;
        marked=null;
        status={
            copy:'',
            mark:'',
            global:''
        }
        update();
}
function globalFontReplace(){
    if(clipboard==undefined  ){
        status.global = `<img src="images/small-x.png" class="small-check" /> `+"You must copy a font first";
        return
    }
    if(marked==undefined  ){
        status.global = `<img src="images/small-x.png" class="small-check" /> `+"You must mark a font for replacement first";
        return

    }

    application.editDocument( function(selection, root){
        if(selection.items.length>0  ){
            status.global = `<img src="images/small-x.png" class="small-check" /> `+"Deselect all and try again";
            return
        }
        actionData = [];
        numReplaced = 0;
        walkDownTree(root, onGlobalFontReplaceNode, selection);
        let unaffectedArtboards = [];
        actionData.forEach(actionDataNode => {
            const unaffectedNodeAncestry = getNodeAncestry(actionDataNode);
            const unaffectedNodeArtboard = unaffectedNodeAncestry[unaffectedNodeAncestry.length - 2]
            if (unaffectedArtboards.indexOf(unaffectedNodeArtboard) === -1) {
                unaffectedArtboards.push(unaffectedNodeArtboard);
            }
            
        });
        selection.items = unaffectedArtboards;
        status.global = `<div class="hr row break">
        <div class="big-check-wrapper"><img src="images/big-check.png" /></div>
        <p class="large">${numReplaced} replacements made.</p>
        <div class="pos-r"><img src="images/small-alert.png" class="small-check alert-icon" />
        <div class="status-not-replaced">
        <p class="small"> &nbsp; &nbsp; There are ${actionData.length} instances that could not be replaced. Check the ${unaffectedArtboards.length} selected artboards.
        </p>
        </div>
        </div>
        <button id="reset" uxp-variant="secondary">Reset</button>
        </div>`;
    });

}
function onGlobalFontReplaceNode(node, selection, safe=true) {
    if (node.constructor.name == "Text") {
        if (node.fontFamily == marked.fontFamily && node.fontStyle == marked.fontStyle) {
            if (safe) {
                node.fontFamily = clipboard.fontFamily;
                node.fontStyle = clipboard.fontStyle;
                numReplaced++;
            } else {
                actionData.push(node);
            }
        } 
    }
}
function getNodeAncestry(node){
    let ancestors = [];
    let currentNode = node;
    while (currentNode.parent!=null) {
        ancestors.push(currentNode.parent);
        currentNode = currentNode.parent;
    }
    return ancestors;
}

function walkDownTree(node, command, value = null) {
    command(node, value);
    if (
        (!node.mask) &&
        (node.constructor.name != "RepeatGrid") &&
        (node.constructor.name != "BooleanGroup") &&
        (node.constructor.name != "LinkedGraphic")
    ) {
        node.children.forEach(childNode => {
            walkDownTree(childNode, command, value);
            
        });
    }else{
        node.children.forEach(childNode => {
            unsafeWalkDownTree(childNode, command, value);
        });       
    }
}
function unsafeWalkDownTree(node, command, value = null) {
    command(node, value, false); //Pass false to the command, so we can store the nodes that are out of edit context
        node.children.forEach(childNode => {
            unsafeWalkDownTree(childNode, command, value);

        });
}

function copyFont() {
     storeFont("clipboard");
}
function markForReplacement() {
    storeFont("mark");
}
function storeFont(store){
    application.editDocument(function(selection,root) {
        let validSelection = false;
      
        if(selection.items.length>0){
           if (selection.items[0].constructor.name == "Text"){
               validSelection = true;
               if (store=="clipboard"){
                    clipboard = {
                        fontFamily: selection.items[0].fontFamily,
                        fontStyle: selection.items[0].fontStyle
                    }
               }
               else if (store=="mark"){
                    marked = {
                        fontFamily: selection.items[0].fontFamily,
                        fontStyle: selection.items[0].fontStyle
                    }
               }
           }
        }
        if(validSelection) {
            if (store=="clipboard"){
                status.copy =`<img src="images/small-check.png" class="small-check" /> `+ clipboard.fontFamily + ' ' + clipboard.fontStyle;
           }
           else if (store=="mark"){
                status.mark = `<img src="images/small-check.png" class="small-check" /> `+marked.fontFamily + ' ' + marked.fontStyle;
           }
           selection.items=[];
        } else {
           if (store=="clipboard"){
                status.copy = `<img src="images/small-x.png" class="small-check" /> `+"Please select a text node";
           }
           else if (store=="mark"){
                status.mark = `<img src="images/small-x.png" class="small-check" /> `+"Please select a text node";
           }
           
        }
    });  
}
function hide(){

}
function update(){
    const isStepOne = clipboard==undefined && marked==undefined;
    const isStepTwo = clipboard!=undefined && marked==undefined;
    const isStepThree = clipboard!=undefined && marked!=undefined;
    let html=`
    <style>
        button {
            min-width:185px;
        }
        .row{
            width:100%;
        }
        .break {
            flex-wrap: wrap;
        }
        .show {
            display: block;
        }
        .hide {
            display: none;
        }
        .icon{
            width:16px;
            height:16px;
        }
        .big-check-wrapper{
            padding-left:75px;
        }
        .block{
            display:block;
        }
        .status {
            padding-left:10px;
            padding-bottom:5px;
        }
        .hr{
            border-top:1px solid #E0E0E0;
            padding-top:10px;
            margin-top:5px;
        }
        .pos-r{
            position:relative;
        }
        .alert-icon{
            position:absolute;
            top:8px;
            left:9px;
        }
    </style>
    
    <div class="row break">
    <button id="copyFont" uxp-variant="${( isStepOne ? "primary" : "secondary" )}">  Copy Font</button>
    <div class="row break status" id="copyStatus">${status.copy}</div>
    <button id="markForReplacement" uxp-variant="${( isStepTwo ? "primary" : "secondary" )}">Mark For Replacement</button>
    <div class="row break status" id="markStatus">${status.mark}</div>
    <button id="globalFontReplace" uxp-variant="${( isStepThree ? "cta" : "secondary" )}" ${( isStepThree ? "" : "disabled" )}>Global Font Replace</button>
    
    <div class="row break status global-status" id="status">${status.global}</div>
    </div>
    `;
    panel.innerHTML=html;
    panel.querySelector("#copyFont").addEventListener("click", copyFont);
    panel.querySelector("#markForReplacement").addEventListener("click", markForReplacement);
    panel.querySelector("#globalFontReplace").addEventListener("click", globalFontReplace);
    panel.querySelector("#reset").addEventListener("click", reset);
}
module.exports = {
    panels: {
        globalFontReplace: {
          show,
          hide,
          update
        }
      }
};
