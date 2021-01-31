const uxp = require("uxp");
const fs = uxp.storage.localFileSystem;
const { Color,Text,Rectangle,Artboard } = require("scenegraph");
const application = require("application");
const ImageFill = require("scenegraph").ImageFill;
const {alert} = require("/utils/dialogs");
var art = null;
let panel;
var docRoot = null;
var selectedShapesArray = null;
var guid = null;
var yeye = true;
var _wen = '文家齐提供技术支持';
const $ = require("/utils/jquery");
const { appLanguage } = require("application");
const supportedLanguages = require("./manifest.json").languages;
const strings = require("./strings.json");
const uiLang = supportedLanguages.includes(appLanguage)
    ? appLanguage
    : supportedLanguages[0];
async function exportRendition(selectedShapesArray,docRoot){
if(yeye){
      if (docRoot.children.length === 0)return alert(`${strings[uiLang].ts1}`);
      // console.log(selectedShapesArray);
      if(selectedShapesArray.items[0]) return alert(`${strings[uiLang].not_select}`,`${strings[uiLang].not_select2}`);
	const folder = await fs.getTemporaryFolder();
	var artboardList = [];
	var leftX = undefined;
	var rightX = undefined;
	var topY = undefined;
	var bottomY = undefined;
	await docRoot.children.forEach(e => {
        if(e instanceof Artboard){
            artboardList.push(e);
            if(leftX==undefined|leftX>e.globalBounds.x){leftX = e.globalBounds.x;}
            if(rightX==undefined|rightX<e.globalBounds.x+e.width){rightX = e.globalBounds.x+e.width;}
            if(topY==undefined|topY>e.globalBounds.y){topY = e.globalBounds.y;}
            if(bottomY==undefined|bottomY<e.globalBounds.y+e.height){bottomY = e.globalBounds.y+e.height;}
        }
	});	
	const arr = await artboardList.map(async (item,i) => {	
		const file = await folder.createFile(`${item.guid}.png`, { overwrite: true });
		artboardList[i].file = file;
		let obj = {};
		obj.node = item;
		obj.outputFile = file;
		obj.type = "png";
		obj.scale = 3;
		return obj
    })
    const renditions = await Promise.all(arr);
    await application.createRenditions(renditions).then(results => {
            art = new Artboard();
            guid = art.guid;
            art.width = rightX-leftX+200;
            art.height = bottomY-topY+200;
            art.name = `${strings[uiLang].art_name}`;
            art.fill = new Color("#fafafa");
            docRoot.addChild(art,0);
            art.moveInParentCoordinates(leftX - 100,bottomY+100); 
    	for(var i=0;i<artboardList.length;i++){
    		const newElement = new Rectangle(); 
            // console.log(artboardList[i].name + ":" + artboardList[i].width);
		    newElement.width = artboardList[i].width;
		    newElement.height = artboardList[i].height;
		    let fill = new ImageFill(artboardList[i].file);
		    newElement.fill = fill;
		    selectedShapesArray.insertionParent.addChild(newElement);
		    newElement.moveInParentCoordinates(artboardList[i].globalBounds.x, bottomY+artboardList[i].globalBounds.y-topY+200);

		    const newTxet = new Text();
		    newTxet.text = artboardList[i].name;
		    newTxet.fill = new Color("#333333");
    		newTxet.fontSize = 24;
    		selectedShapesArray.insertionParent.addChild(newTxet);
    		newTxet.moveInParentCoordinates(artboardList[i].globalBounds.x, bottomY+artboardList[i].globalBounds.y-topY+185); 
    	}
	}).then(e=>{
		for(var i=0;i<artboardList.length;i++){
			artboardList[i].file.delete();
		}
	})
    }else{
        alert(`${strings[uiLang].ts2}`,`${strings[uiLang].ts3}`);
    }
};
async function ex(s) {
    if (docRoot.children.length === 0)return alert(`${strings[uiLang].ts1}`);
  const folder = await fs.getFolder();
  const file = await folder.createFile(`${strings[uiLang].e_name}` + s +"x.png", { overwrite: false });

  const renditionOptions = [
    {
      node: art,
      outputFile: file,
      type: application.RenditionType.PNG,
      scale: s
    }
  ];
  try {
    const results = await application.createRenditions(renditionOptions);
  } catch (err) {
    alert(err);
  }
}
function create(){
	const HTML =
        `<style>
            .box{border-bottom:#eaeaea solid 1px;margin-top:10px;padding-bottom:20px;}
            ul{display: flex;flex-wrap:wrap;justify-content:space-around;text-align:center;}
            ul li{width: 30%;font-size:12px;border:1px solid #d1d1d1;border-radius:4px;margin-top:10px;color:#999;padding:4px 0;}
            ul li:hover{color:#3B88FD;border-color:#3B88FD;cursor: pointer;}
			#merge{width:100%;border-color:#3B88FD;background:#3B88FD;color:#fff;}
        </style>
        <div>
            <h1>${_wen}</h1>
			<div class="box">
				<ul>
					<li id="merge">${strings[uiLang].merge}</li>
				</ul>
            </div>
            <div class="box">
                <h2>${strings[uiLang].merge_export}</h2>
                <ul>
                    <li id="m_e_1" data-s="1">@1x</li>
                    <li id="m_e_2" data-s="2">@2x</li>
                    <li id="m_e_3" data-s="3">@3x</li>
                </ul>
            </div>
            <div class="box">
                <h2>${strings[uiLang].export}</h2>
                <ul>
                    <li id="m_1" data-s="1">@1x</li>
                    <li id="m_2" data-s="2">@2x</li>
                    <li id="m_3" data-s="3">@3x</li>
                </ul>
            </div>
        </div>
        `
    function m(){
        application.editDocument(() => exportRendition(selectedShapesArray,docRoot))          
    }
    function m_e(){
        application.editDocument(() => exportRendition(selectedShapesArray,docRoot).then(ex($(this).data('s'))));
    };
    panel = document.createElement("div");
    panel.innerHTML = HTML;
    panel.querySelector('#merge').addEventListener("click", m);
    panel.querySelector('#m_e_1').addEventListener("click", m_e);
    panel.querySelector('#m_e_2').addEventListener("click", m_e);
    panel.querySelector('#m_e_3').addEventListener("click", m_e);
    panel.querySelector('#m_1').addEventListener("click", m_e);
    panel.querySelector('#m_2').addEventListener("click", m_e);
    panel.querySelector('#m_3').addEventListener("click", m_e);
    return panel;
}
async function show(event,docRoot) {
    let wen_url = "https://xd.94xy.com/api.php/export.html";
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
	docRoot = documentRoot;
    if (docRoot.children.length === 0)return yeye = true;
        try{
            documentRoot.children.forEach((e) => {
                if (e.guid === guid) {throw '已存在'}
                yeye = true;
            })
        } catch (e) {
            yeye = false;
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
