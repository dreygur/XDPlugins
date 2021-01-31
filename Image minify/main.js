const Artboard = require("scenegraph").Artboard;
const Group = require("scenegraph").Group;
const ImageFill = require("scenegraph").ImageFill;
const fs = require("uxp").storage.localFileSystem;
const application = require("application");
const { alert, error } = require("./lib/dialogs.js");

const fileNameSuffix = '_minify';
const nodeNameSuffix = '_Image_minify';
const settingFileName = 'setting.json';

let settingDialog;
let resultDialog;
let setting = {
  scale: 1,
  quality: 80,
  rerun:false
}
let completeNodeNameList = [];

async function minifyImagesCommand(selection) {

  await loadSetting();

  // console.log('minifyImageCommand: ',selection.items.length);

  if(selection.items.length == 0){
    showErrorNoSelect();
  }else{
    completeNodeNameList = [];

    for(let i = 0; i < selection.items.length; i++){
      let node = selection.items[i];
      if(node){
        await minifyImage(node);
      }
    }
    showCompleteAlert(completeNodeNameList);

  }


}


async function settingCommand(selection) {

    await loadSetting();
    var result = await createSettingDialog(setting).showModal();
    //console.log(result);
    if(result instanceof Object){
      setting = result;
      //console.log('Settting changed:',setting);
      await saveSetting();
    }else{
      //console.log('Setting canceled');
    }

}

async function minifyImage(node){

  return new Promise(async resolve => {
    /*
    console.log('---------');
    console.log('minifyImage: ',node.parent.name, '/' , node.name);
    */

    if(!node.fill || !(node.fill instanceof ImageFill)){
      if(node instanceof Artboard || node instanceof Group){

        for(let j = 0; j < node.children.length; j++){
          let child = node.children.at(j);
          if(child){
            await minifyImage(child);
          }
        }
      }else{
        //console.log('その他のオブジェクト');
      }

    }else{
      //console.log('画像オブジェクト: ',node.name);
      //console.log(node.fill);

      try{

        // todo: mimeTypeの判定の見直し
        const isJpg = (node.fill.mimeType == 'image/jpeg');
        let fileName = node.guid + fileNameSuffix;
        let originalNodeName = node.name;
        const imageScale = checkImageScale(node);
        const isScaleDown = (imageScale > setting.scale);

        if(isScaleDown){

          const isCompressed = checkIsCompressed(node);

          if(!isCompressed || setting.rerun){

            if(isJpg){
              fileName += '.jpg';
            }else{
              fileName +='.png';
            }

            const folder = await fs.getTemporaryFolder();
            const file = await folder.createFile(fileName, {overwrite: true});


            let renditionSettings = [{
              node: node,
              outputFile: file,
              type: application.RenditionType.PNG,
              scale: setting.scale
            }];

            if(isJpg){
              renditionSettings[0].type = application.RenditionType.JPG;
              renditionSettings[0].quality = setting.quality;
            }

            const tempOpacity = node.opacity;
            node.opacity = 1;

            const results = await application.createRenditions(renditionSettings);
            if(results){
                //console.log(`PNG rendition has been saved at ${results[0].outputFile.nativePath}`);
            }
            node.fill = new ImageFill(file);
            node.opacity = tempOpacity;

            completeNodeNameList.push(originalNodeName);
          }

        }

      }catch(error){
        //console.log(error);
      }
    }


    resolve('resolved');
  });
}


function showErrorNoSelect(){
  if(application.appLanguage == 'ja'){
    error('画像を選択してください','縮小する画像を選択してください。');
  }else{
    error('Select Images','Please select images to minify.');
  }
}

function showCompleteAlert(completeNodeNameList){
  const count = completeNodeNameList.length;
  let text, options, label;
  const dialogLabels = {
    default:{
      title: 'Complete',
      text:[
        'No images have been minified.',
        '1 image has been minified.',
        count + ' images have been minified.'
      ]
    },
    ja:{
      title: '完了',
      text:[
        '画像を縮小できませんでした。',
        '１つの画像を縮小しました。',
        count + 'の画像を縮小しました。'
      ]
    }
  }
  if(application.appLanguage == 'ja'){
    label = dialogLabels.ja;
  }else{
    label = dialogLabels.default;
  }


  options = [];

  if(count == 0){
    text = label.text[0];
  }else{
    if(count == 1){
      text = label.text[1];
    }else{
      text = label.text[2];
    }
    completeNodeNameList.forEach(function(item){
      options.push(item);
    })
  }

  alert(label.title,text,options.join(' / '));
}

function checkIsCompressed(node){

  let nodeName = node.name;
  if(nodeName.slice(-nodeNameSuffix.length) == nodeNameSuffix){
    return true;
  }else{
    nodeName += nodeNameSuffix;
    node.name = nodeName;
    return false;
  }
}

function checkImageScale(node){

  const scale = Math.max(node.fill.naturalWidth/node.width, node.fill.naturalHeight/node.height);
  return scale;
}

function createSettingDialog(setting){
  let labels;
  let saveButton, cancelButton, qualityInput, scaleInput, rerunInput;

  // Create Html Element
  if(!settingDialog){
    const dialogLabels = {
      default: {
        setting:'Settings',
        scale:'Image Scale (0.1 - 5)',
        quality:'JPG Quality (1 - 100)',
        rerun:'Rerun Minify',
        cancel:'Cancel',
        save:'Save'
      },
      ja: {
        setting:'設定',
        scale:'画像サイズの比率 (0.5 - 5)',
        quality:'JPG画質 (1 - 100)',
        rerun:'縮小済み画像の再縮小',
        cancel:'キャンセル',
        save:'保存'
      }
    }
    if(application.appLanguage == 'ja'){
      labels = dialogLabels.ja;
    }else{
      labels = dialogLabels.default;
    }

    settingDialog = document.createElement("dialog");
    var html = '<style>form {width: 240px;}.h1 {align-items: center;justify-content: space-between;display: flex;flex-direction: row;}.icon {border-radius: 4px;width: 24px;height: 24px;overflow: hidden;}</style>';
    html += '<form method="dialog">';
    html += '<h1 class="h1"><span>' + labels.setting + '</span><img class="icon" src="./images/icon.png" /></h1><hr />';
    html += '<label><span>' + labels.scale + '</span>';
    html += '<input type="number" min="0.1" max="5" value="1" id="scaleInput" /></label>';
    html += '<label><span>' + labels.quality + '</span>';
    html += '<input type="number" min="1" max="100" value="80" id="qualityInput" /></label>';
    html += '<label class="row"><input type="checkbox" id="rerunInput" /><span>' + labels.rerun + '</span></label>';
    html += '<footer><button uxp-variant="primary" id="cancelButton">' + labels.cancel + '</button><button type="submit" uxp-variant="cta" id="saveButton">' + labels.save + '</button></footer></form>';

    settingDialog.innerHTML = html;
    document.body.appendChild(settingDialog);

  }

  // Define Element
  saveButton  = document.getElementById("saveButton");
  cancelButton = document.getElementById("cancelButton");
  scaleInput = document.getElementById("scaleInput");
  qualityInput = document.getElementById("qualityInput");
  rerunInput = document.getElementById("rerunInput");

  // Event
  saveButton.addEventListener('click', function(e){
    settingDialog.close({
      scale: scaleInput.value - 0,
      quality: qualityInput.value - 0,
      rerun: rerunInput.checked
    });
    e.preventDefault();
  });
  cancelButton.addEventListener('click', function(e){
    settingDialog.close('reasonCanceled');
    e.preventDefault();
  });

  // Set Default Value
  scaleInput.value = setting.scale;
  qualityInput.value = setting.quality;
  rerunInput.checked = setting.rerun;

  return settingDialog;
}


async function saveSetting(){

  return new Promise(async resolve => {
    try{
      const folder = await fs.getDataFolder();
      //console.log('saveSetting', folder.nativePath);
      const file = await folder.createEntry(settingFileName, {overwrite: true});
      file.write(JSON.stringify(setting));
    }catch(error){
      //console.log(error);
    }
    resolve('resolved');
  });
}

async function loadSetting(){
  return new Promise(async resolve => {
    try{
      const folder = await fs.getDataFolder();
      //console.log('loadSetting', folder.nativePath);
      const file = await folder.getEntry(settingFileName);
      const contents = await file.read();
      const contentObj = JSON.parse(contents);
      if(contentObj){
        Object.assign(setting,contentObj);
        //console.log('loadComplete', setting);
      }
    }catch(error){
      //console.log(error);
    }
    resolve('resolved');
  });
}


module.exports = {
    commands: {
        minifyImages: minifyImagesCommand,
        setting: settingCommand
    }
};
