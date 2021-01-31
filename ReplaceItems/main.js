/**
  * @file 選択したアイテムをキーオブジェクトで置き換える。最後に選択したものをキーオブジェクトとみなす
  * @version 1.0.1
  * @author sttk3.com
  * @copyright (c) 2020 sttk3.com
*/

const { selection } = require('scenegraph') ;
const commands = require('commands') ;
const viewport = require('viewport') ;
const fs = require('uxp').storage.localFileSystem ;
const { alert, error } = require('./lib/dialogs.js') ;

const XDReferencePoint = {
  TOP_LEFT: 0,
  TOP_MIDDLE: 1,
  TOP_RIGHT: 2,
  MIDDLE_LEFT: 3,
  CENTER: 4,
  MIDDLE_RIGHT: 5,
  BOTTOM_LEFT: 6,
  BOTTOM_MIDDLE: 7,
  BOTTOM_RIGHT: 8
} ;

const errorTitle = 'Error : ' ;
const msgEmptySelection = 'Please select at least two objects before running this plugin.' ;
const resultTitle = 'Result : ' ;
const msgfinishedSafely = 'Process has finished.' ;
const defaultSettings = {
  "mainRefPoint": XDReferencePoint.TOP_LEFT, 
  "subRefPoint": XDReferencePoint.TOP_LEFT, 
  "offsetX": 0, 
  "offsetY": 0, 
  "displayResult": true
} ;

async function replaceItemsMenuItem() {
  await duplicateItems(true) ;
}

async function duplicateItemsMenuItem() {
  await duplicateItems(false) ;
}

/**
  * オブジェクトを複製または置換する
  * @param {Boolean} [replacing] 置換するかどうか。省略時はtrue
  * @return {}
*/
async function duplicateItems(replacing = true) {
  let targetItems = selection.items ;
  if(targetItems.length < 2) {
    await error(errorTitle, msgEmptySelection) ;
    return ;
  }
  const keyObj = targetItems.pop() ;
  const pref = await getSettings() ;
  
  // 環境設定が有効な値か確認し，必要に応じて修正する
  const whiteList = Object.values(XDReferencePoint) ;
  ['mainRefPoint', 'subRefPoint'].forEach((key) => {
    pref[key] = validateValue(pref[key], whiteList, defaultSettings[key]) ;
  }) ;
  ['offsetX', 'offsetY'].forEach((key) => {
    pref[key] = validateNumber(pref[key], defaultSettings[key]) ;
  }) ;
  
  // 選択アイテムがアートボードの場合，viewportが関係ない場所に移動することがあるので記録しておく
  let doScroll, viewBounds ;
  if(keyObj.constructor.name === 'Artboard') {
    doScroll = true ;
    viewBounds = viewport.bounds ;
  }
  
  // 置換を実行する
  const newSelection = [] ;
  let aItem, srcPos, dstPos, dupItem ;
  for(var i = targetItems.length - 1 ; i >= 0 ; i--) {
    aItem = targetItems[i] ;
    dstPos = getGlobalPosition(aItem, pref.subRefPoint) ;
    dstPos.x += pref.offsetX ;
    dstPos.y += pref.offsetY ;
    if(replacing) {aItem.removeFromParent() ;}
    
    // キーオブジェクトを複製する
    selection.items = [keyObj] ;
    commands.duplicate() ;
    dupItem = selection.items[0] ;
    srcPos = getGlobalPosition(keyObj, pref.mainRefPoint) ;
  
    /*
      複製したキーオブジェクトを各アイテムの座標に移動する。ここでplaceInParentCoordinatesを使わないこと。
      MaskGroupのlocal座標がparent座標になっているバグ(v28.6.12.3現在)があり，正しい位置に移動できない
    */
    dupItem.moveInParentCoordinates(dstPos.x - srcPos.x, dstPos.y - srcPos.y) ;
    
    // アートボードの場合移動できていないことがあるので再移動する
    srcPos = getGlobalPosition(dupItem, pref.mainRefPoint) ;
    dupItem.moveInParentCoordinates(dstPos.x - srcPos.x, dstPos.y - srcPos.y) ;
    
    newSelection.push(dupItem) ;
  }
  
  // 複製したアイテムを選択する
  newSelection.push(keyObj) ;
  selection.items = newSelection ;
  
  // viewportをもとの位置に戻す
  if(doScroll) {
    viewport.scrollIntoView(viewBounds.x, viewBounds.y, viewBounds.width, viewBounds.height) ;
  }
  
  if(pref.displayResult) {
    alert(resultTitle, msgfinishedSafely) ;
  }
}

/**
  * 基準点を指定してアイテムのglobal positionを取得する
  * @param {SceneNode} targetItem 対象のアイテム
  * @param {Number} refPoint 基準点  
  * 0  1  2  
  * 3  4  5  
  * 6  7  8
  * @return {Point} {x: Number, y: Number}
*/
function getGlobalPosition(targetItem, refPoint) {
  const globalBounds = targetItem.globalBounds ;
  const localPos = getLocalPosition(targetItem, refPoint) ;
  return {x: globalBounds.x + localPos.x, y: globalBounds.y + localPos.y} ;
}

/**
  * オブジェクトの変形基準点の座標を取得する
  * @param {Scenenode} targetItem 対象のnode
  * @param {Number} refPoint 変形基準点  
  * 0  1  2
  * 3  4  5
  * 6  7  8
  * @return {Point} {x: number, y: number}
*/
function getLocalPosition(targetItem, refPoint) {
  const bounds = targetItem.localBounds ;
  
  let res ;
  switch(refPoint) {
    case 0 :
      // TOP_LEFT
      res = {x: 0, y: 0} ;
      break ;
    case 1 :
      // TOP_MIDDLE
      res = {x: bounds.width / 2, y: 0} ;
      break ;
    case 2 :
      // TOP_RIGHT
      res = {x: bounds.width, y: 0} ;
      break ;
    case 3 :
      // MIDDLE_LEFT
      res = {x: 0, y: bounds.height / 2} ;
      break ;
    case 4 :
      // CENTER
      res = {x: bounds.width / 2, y: bounds.height / 2} ;
      break ;
    case 5 :
      // MIDDLE_RIGHT
      res = {x: bounds.width, y: bounds.height / 2} ;
      break ;
    case 6 :
      // BOTTOM_LEFT
      res = {x: 0, y: bounds.height} ;
      break ;
    case 7 :
      // BOTTOM_MIDDLE
      res = {x: bounds.width / 2, y: bounds.height} ;
      break ;
    case 8 :
      // BOTTOM_RIGHT
      res = {x: bounds.width, y: bounds.height} ;
      break ;
  }
  
  return res ;
}

/**
  * 対象の値が有効かどうかリストで確かめ，そうでなければ代替の値を返す
  * @param {Any} targetValue 検証する値
  * @param {Array} whiteList 有効とする値の配列
  * @param {Any} alternativeValue Numberではなかったときに返す値
  * @return {Any}
*/
function validateValue(targetValue, whiteList, alternativeValue) {
  let res ;
  if(whiteList.includes(targetValue)) {
    res = targetValue ;
  } else {
    res = alternativeValue ;
  }
  return res ;
}

/**
  * 対象の値が数値かどうか確かめ，そうでなければ代替の値を返す
  * @param {Any} targetValue 検証する値
  * @param {Number} alternativeValue Numberではなかったときに返す値
  * @return {Number}
*/
function validateNumber(targetValue, alternativeValue) {
  let res = Number(targetValue) ;
  if(isNaN(res)) {res = alternativeValue ;}
  return res ;
}

/**
  * プラグイン設定のJSONを読み出す
  * @return {Object}
*/
async function getSettings() {
  return await readSettings(defaultSettings) ;
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
  if(obj.constructor.name == 'Object') {str = JSON.stringify(obj, null, 2) ;}
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
    try {
      res = JSON.parse(contents) ;
    } catch(e) {
      res = defaultObj ;
    }
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
    replaceItems: replaceItemsMenuItem,
    duplicateItems: duplicateItemsMenuItem
  }
} ;