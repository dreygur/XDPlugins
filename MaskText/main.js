/**
  * @file テキストをアウトラインに合わせてマスクする
  * @version 1.0.1
  * @author sttk3.com
  * @copyright (c) 2020 sttk3.com
*/

const { selection, Rectangle } = require('scenegraph') ;
const commands = require('commands') ;
const fs = require('uxp').storage.localFileSystem ;
const { alert, error } = require('./lib/dialogs.js') ;

const errorTitle = 'Error : ' ;
const msgEmptySelection = 'Please select the text, and then execute this plugin.' ;
const resultTitle = 'Result : ' ;
const msgfinishedSafely = 'The text has been masked.' ;
const defaultSettings = {
  "displayResult": true
} ;

async function fitWidthMenuItem() {
  await maskText(true, false) ;
}

async function fitHeightMenuItem() {
  await maskText(false, true) ;
}

async function fitBoundsMenuItem() {
  await maskText(true, true) ;
}

/**
  * Textをアウトラインの大きさの枠でマスクする
  * @param {Boolean} changeWidth widthをフィットする
  * @param {Boolean} changeHeight heightをフィットする
*/
async function maskText(changeWidth, changeHeight) {
  const targetItems = selection.items.filter(aItem => {return /^Text$/.test(aItem.constructor.name) ;}) ;
  if(targetItems.length <= 0) {
    await error(errorTitle, msgEmptySelection) ;
    return ;
  }
  
  const newSelection = [] ;
  let origBounds, outlineBounds, outlinedText, clippingRect ;
  for(let aItem of targetItems) {
    origBounds = aItem.boundsInParent ;
    
    // 複製してアウトライン化する
    selection.items = [aItem] ;
    commands.duplicate() ;
    commands.convertToPath() ;
    
    // サイズを測る。用が済んだら削除する
    outlinedText = selection.items[0] ;
    outlineBounds = outlinedText.boundsInParent ;
    outlinedText.removeFromParent() ;
    
    // マスク枠用の四角を作り，もとのアイテムの上に置く
    const pos = {x: Math.floor(outlineBounds.x), y: Math.floor(outlineBounds.y)} ;
    clippingRect = new Rectangle() ;
    if(changeWidth) {
      clippingRect.width = Math.ceil(outlineBounds.width) + 1 ;
    } else {
      clippingRect.width = origBounds.width ;
      pos.x = origBounds.x ;
    }
    if(changeHeight) {
      clippingRect.height = Math.ceil(outlineBounds.height) + 1 ;
    } else {
      clippingRect.height = origBounds.height ;
      pos.y = origBounds.y ;
    }
    clippingRect.placeInParentCoordinates(getRefPoint(clippingRect, 0), pos) ;
    selection.insertionParent.addChildAfter(clippingRect, aItem) ;
    
    // マスクグループを作り，それを配列に収める
    selection.items = [clippingRect, aItem] ;
    commands.createMaskGroup() ;
    newSelection.push(selection.items[0]) ;
  }
  
  // 作ったマスクグループを選択する
  selection.items = newSelection ;
  
  if(await getAlertSetting()) {
    alert(resultTitle, msgfinishedSafely) ;
  }
}

/**
  * オブジェクトの変形基準点の座標を取得する
  * @param {Scenenode} targetItem 対象のnode
  * @param {Number} refPoint 変形基準点  
  * 0  1  2
  * 3  4  5
  * 6  7  8
  * @return {Object} {x: number, y: number}
*/
function getRefPoint(targetItem, refPoint) {
  const bounds = targetItem.localBounds ;
  const center = targetItem.localCenterPoint ;
  
  let res ;
  switch(refPoint) {
    case 0 :
      res = {x: bounds.x, y: bounds.y} ;
      break ;
    case 1 :
      res = {x: center.x, y: bounds.y} ;
      break ;
    case 2 :
      res = {x: bounds.x + bounds.width, y: bounds.y} ;
      break ;
    case 3 :
      res = {x: bounds.x, y: center.y} ;
      break ;
    case 4 :
      res = center ;
      break ;
    case 5 :
      res = {x: bounds.x + bounds.width, y: center.y} ;
      break ;
    case 6 :
      res = {x: bounds.x, y: bounds.y + bounds.height} ;
      break ;
    case 7 :
      res = {x: center.x, y: bounds.y + bounds.height} ;
      break ;
    case 8 :
      res = {x: bounds.x + bounds.width, y: bounds.y + bounds.height} ;
      break ;
  }
  
  return res ;
}

/**
  * プラグイン設定のJSONから結果をalertするかどうかの項目を取得する
  * @return {Boolean}
*/
async function getAlertSetting() {
  const json = await readSettings(defaultSettings) ;
  return json.displayResult ;
}

/**
  * 設定をJSONファイルとして保存する
  * @param {Object | String} obj 保存したいObjectまたはJSON String
  * @param {String} [fileName] 書き出すJSONファイル名。省略時はsettings.json
  * @return {Entry} 
*/
async function saveSettings(obj, fileName = 'settings.json') {
  // ファイルに書き込む
  const pluginDataFolder = await fs.getDataFolder() ;
  const newFile = await pluginDataFolder.createEntry(fileName, {overwrite: true}) ;
  let str = obj ;
  if(obj.constructor.name == 'Object') {str = JSON.stringify(obj) ;}
  newFile.write(str.toString()) ;
  
  return newFile ;
}

/**
  * JSONファイルとして保存した設定を読み込む
  * @param {Object | String} defaultObj 読み込めなかったときに生成するObject
  * @param {String} [fileName] 読み込むJSONファイル名。省略時はsettings.json
  * @return {Object} 
*/
async function readSettings(defaultObj, fileName = 'settings.json') {
  // 設定ファイルを見つける
  const pluginDataFolder = await fs.getDataFolder() ;
  const entries = await pluginDataFolder.getEntries() ;
  let aFile ;
  for(const aItem of entries) {
    if(aItem.name == fileName) {
      aFile = aItem ;
      break ;
    }
  }
  
  let res ;
  if(aFile) {
    // ファイルがあれば情報を読み出す
    const contents = await aFile.read() ;
    res = JSON.parse(contents) ;
  } else {
    // なければデフォルト設定を返し，ファイルに保存する
    res = defaultObj ;
    if(defaultObj.constructor.name == 'String') {
      res = JSON.parse(defaultObj) ;
    }
    
    saveSettings(res) ;
  } 
  
  return res ;
}

module.exports = {
  commands: {
    fitWidth: fitWidthMenuItem,
    fitHeight: fitHeightMenuItem,
    fitBounds: fitBoundsMenuItem
  }
} ;