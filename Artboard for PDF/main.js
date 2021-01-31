const { Artboard, Color} = require("scenegraph");
const application = require("application");
const viewport = require("viewport");

const printingSize = {
  a4:{width:842, height:595, name:'A4'},
  a3:{width:1191, height:842, name:'A3'},
  b5:{width:729, height:516, name:'B5'},
  b4:{width:1032, height:729, name:'B4'}
};
const kArtboardMargin = 70;
const kArtboardColumn = 10;
const kMaxPageCount = 100;

let dialog;
let defaultFormat = 'a4';
let defaultOrientation = 'landscape';
let defaultPageCount = 1;

function createDialog(){
  let createButton, cancelButton, formatSelect, orientationSelect, pageCountInput;
  if(!dialog){
    dialog = document.createElement("dialog");
    let html = '<style>form {width: 360px;}.h1 {align-items: center;justify-content: space-between;display: flex;flex-direction: row;}.icon {border-radius: 4px;width: 24px;height: 24px;overflow: hidden;}</style>';

    if(application.appLanguage == 'ja'){
      html += '<form method="dialog"><h1 class="h1"><span>PDF用アートボードの作成</span><img class="icon" src="./assets/icon.png" /></h1><hr /><label><span>用紙のサイズ</span><select id="formatSelect"><option value="a4" selected>A4</option><option value="a3">A3</option><option value="b5">B5</option><option value="b4">B4</option></select></label><label><span>用紙の向き</span><select id="orientationSelect"><option value="landscape">横向き</option><option value="portrait">縦向き</option></select></label><label><span>ページ数 (1 - ' + kMaxPageCount + ')</span><input type="number" min="1" max="100" value="1" id="pageCount" /></label><footer><button uxp-variant="primary" id="cancelButton">キャンセル</button><button type="submit" uxp-variant="cta" id="createButton">作成</button></footer></form>';
    }else{
      html += '<form method="dialog"><h1 class="h1"><span>New Artboard for PDF</span><img class="icon" src="./assets/icon.png" /></h1><hr /><label><span>Size</span><select id="formatSelect"><option value="a4" selected>A4</option><option value="a3">A3</option><option value="b5">B5</option><option value="b4">B4</option></select></label><label><span>Orientation</span><select id="orientationSelect"><option value="landscape">Landscape</option><option value="portrait">Portrait</option></select></label><label><span>Page Count (1 - ' + kMaxPageCount + ')</span><input type="number" min="1" max="100" value="1" id="pageCount" /></label><footer><button uxp-variant="primary" id="cancelButton">Cancel</button><button type="submit" uxp-variant="cta" id="createButton">Create</button></footer></form>';
    }

    dialog.innerHTML = html;
    document.body.appendChild(dialog);

    }

    createButton  = document.getElementById("createButton");
    cancelButton = document.getElementById("cancelButton");
    formatSelect = document.getElementById("formatSelect");
    orientationSelect = document.getElementById("orientationSelect");
    pageCountInput = document.getElementById("pageCount");

    createButton.addEventListener('click', function(e){
      dialog.close({format:formatSelect.value, orientation:orientationSelect.value, pageCount:pageCountInput.value });
      defaultFormat = formatSelect.value;
      defaultOrientation = orientationSelect.value;
      e.preventDefault();
    });
    cancelButton.addEventListener('click', function(e){
      dialog.close(false);
      e.preventDefault();
    });

  formatSelect.value = defaultFormat;
  orientationSelect.value = defaultOrientation;
  pageCountInput.value = defaultPageCount;

  return dialog;

}


async function newArtboardCommand(selection,documentRoot) {

  let result = await createDialog().showModal();

  if(result){
    let _size = printingSize[result.format];
    let size = {width: 0, height: 0, name: _size.name};
    if(result.orientation == 'landscape'){
      size.width = _size.width;
      size.height = _size.height;
    }else{
      size.width = _size.height;
      size.height = _size.width;
    }
    let pageCount = checkPageCount(result.pageCount);

    let firstPositon;
    let artboard;
    for(var i = 0; i < pageCount; i++){
      let name = generateArtboadName(size.name, documentRoot);
      artboard = createArtboard(size, name);
      documentRoot.addChild(artboard);

      let position;
      if(i == 0){
        position = getNewArtboardPosition(documentRoot);
        firstPositon = position;
      }else{
        position = {
          x: firstPositon.x + (size.width + kArtboardMargin) * (i % kArtboardColumn),
          y: firstPositon.y + (size.height + kArtboardMargin) * Math.floor(i / kArtboardColumn)
        };
      }
      artboard.placeInParentCoordinates({x:0, y:0}, {x:position.x, y:position.y});
    }
    viewport.scrollIntoView(artboard);
  }
}


function createArtboard(size, name){
  const artboard = new Artboard();
  artboard.width = size.width;
  artboard.height = size.height;
  artboard.name = name;
  artboard.fill = new Color('#FFFFFF');
  return artboard;

}



function getNewArtboardPosition(documentRoot){
  let result = {x:0, y:0};

  documentRoot.children.forEach(function(child,i){
    if(i == 0){
      result.x = child.globalBounds.x;
      result.y = child.globalBounds.y + child.height + kArtboardMargin;
    }else{
      let __y = child.globalBounds.y + child.height + kArtboardMargin;
      if(result.y < __y){
        result.y = __y;
      }
    }

  });
  return result;
}



function generateArtboadName(originalName, documentRoot){
  let name = originalName;
  let num = 0;
  documentRoot.children.forEach(function(child,i){
    let ary = child.name.split(' - ');
    if(ary[0] == originalName){
      if(ary.length > 1){
        let _num = (ary[1]-0);
        if(_num >= num){
          num = _num + 1;
        }
      }else{
        num = 1;
      }
    }
  });
  if(num == 0){
    return name;
  }else{
    return name + ' - ' + num;
  }
}


function checkPageCount(pageCount){
  let result;
  if(isNaN(pageCount)){
    result = 1;
  }else if(pageCount < 1){
    result = 1;
  }else if(pageCount > kMaxPageCount){
    result = kMaxPageCount;
  }else{
    result = pageCount;
  }
  return result;
}



module.exports = {
    commands: {
        newArtboardCommand: newArtboardCommand
    }
};
