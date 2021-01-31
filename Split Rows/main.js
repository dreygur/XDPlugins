/**
  * @file テキストを段落ごとに分割する
  * @version 2.0.3
  * @author sttk3.com
  * @copyright (c) 2019 sttk3.com
*/

const commands = require('commands') ;
const app = require('application') ;
const fs = require('uxp').storage.localFileSystem ;
const { alert, error } = require('./lib/dialogs.js') ;

const errorTitle = 'Error : ' ;
const msgEmptySelection = 'Please select the text, and then execute this plugin.' ;
const resultTitle = 'Result : ' ;
const msgDidNotSplit = 'There was no text to split.' ;
const msgfinishedSafely = 'The text has been split.' ;
const defaultSettings = {
  "displayResult": true
} ;

async function splitRowsSimpleMenuItem(selection) {
  //const sDate = new Date() ;
  if(selection.items.length <= 0) {
    await error(errorTitle, msgEmptySelection) ;
    return ;
  }
  let targetItem = selection.items[0] ;
  
  let newSelection ;
  switch(targetItem.constructor.name) {
    case 'Text' :
      newSelection = await splitRowsSimple(selection, targetItem) ;
      break ;
    case 'Group' :
      // バージョン17でGroupのEdit Context Ruleが緩和されたので，グループ解除と再グループ化はいらなくなった
      // aItem instanceof Textを使うと結果が空になることがあるので，aItem.constructor.nameを推奨する
      const itemChildren = targetItem.children.filter(aItem => {return /^Text$/.test(aItem.constructor.name) ;}) ;
      if(itemChildren.length <= 0) {
        await error(errorTitle, msgEmptySelection) ;
        return ;
      }
      
      newSelection = await splitRowsSimple(selection, itemChildren[0]) ;
      break ;
    default :
      await error(errorTitle, msgEmptySelection) ;
      return ;
  }
  
  if(newSelection[0] != null) {selection.items = newSelection ;}
  if(await getAlertSetting()) {
    alert(resultTitle, msgfinishedSafely) ;
  }
  //console.log(new Date() - sDate) ;
}

async function splitRowsPreserveAppearanceMenuItem(selection) {
  //const sDate = new Date() ;
  if(selection.items.length <= 0) {
    await error(errorTitle, msgEmptySelection) ;
    return ;
  }
  let targetItem = selection.items[0] ;
  
  let newSelection ;
  switch(targetItem.constructor.name) {
    case 'Text' :
      newSelection = await splitRowsPreserveAppearance(selection, targetItem) ;
      break ;
    case 'Group' :
      // バージョン17でGroupのEdit Context Ruleが緩和されたので，グループ解除と再グループ化はいらなくなった
      // aItem instanceof Textを使うと結果が空になることがあるので，aItem.constructor.nameを推奨する
      const itemChildren = targetItem.children.filter(aItem => {return /^Text$/.test(aItem.constructor.name) ;}) ;
      if(itemChildren.length <= 0) {
        await error(errorTitle, msgEmptySelection) ;
        return ;
      }
      
      newSelection = await splitRowsPreserveAppearance(selection, itemChildren[0]) ;
      break ;
    default :
      await error(errorTitle, msgEmptySelection) ;
      return ;
  }
  
  if(newSelection[0] != null) {selection.items = newSelection ;}
  if(await getAlertSetting()) {
    alert(resultTitle, msgfinishedSafely) ;
  }
  //console.log(new Date() - sDate) ;
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

/**
  * テキストを段落ごとに分解する。スタイルや位置を保持しないかわりに速い
  * @param {Selection} selection selectionをそのまま渡す
  * @param {Text} textNode 分解するText
  * @return {Array} 
*/
function splitRowsSimple(selection, textNode) {
  // 元のテキストの情報を取得する
  const rows = textNode.text.split(/[\r\n]/g) ;
  let leading = textNode.lineSpacing ;
  let isAutoLeading = false ;
  const spaceAfter = textNode.paragraphSpacing ;
  const charSize = textNode.styleRanges[0].fontSize ;
  const halfCharSize = Math.ceil(charSize / 2) ;
  if(rows.length <= 1) {
    alert(resultTitle, msgDidNotSplit) ;
    return [textNode] ;
  }

  // 情報を取得したあとはデータを軽くしておく
  textNode.text = 'a' ;

  // areaTextの場合は高さを文字と合わせる
  const box = textNode.areaBox ;
  if(box) {
    textNode.resize(box.width, charSize) ;
  }

  // lineSpacingが0，つまり行送り自動の場合は文字サイズの1.7倍（小数点以下切り上げ）にする
  if(leading <= 0) {
    isAutoLeading = true ;
    leading = Math.ceil(charSize * 1.7) ;
  }

  // テキストを段落ごとに分割する。repeatGridを使いたかったが，現状ではプラグインから作成できないらしい
  const patternInvisibleLine = /^[\s]*$/m ;
  const offset = leading + spaceAfter ;
  let narrowAmount = 0 ;
  let currentNode ;
  let res = [] ;
  rows.forEach((row, i) => {
    if(patternInvisibleLine.test(row)) {
      if(isAutoLeading) {
        narrowAmount -= halfCharSize ;
      }
    } else {  
      selection.items = [textNode] ;
      commands.duplicate() ; // selection.itemsに対して行われる
      currentNode = selection.items[0] ;
      currentNode.text = row ;
      currentNode.moveInParentCoordinates(0, (offset * i) + narrowAmount) ;
      res.push(currentNode) ;
    }
  }) ;
  
  // areaTextの場合はフレームから溢れた文字を表示し，重複しないように移動する
  if(box) {
    let currentItem = res[0] ;
    trimText(currentItem) ;
    let dstY = getBottom(currentItem) + leading ;
    for(var i = 1, len = res.length ; i < len ; i++) {
      currentItem = res[i] ;
      setPosition(currentItem, undefined, dstY) ;
      trimText(currentItem) ;
      dstY = getBottom(currentItem) + leading ;
    }
  }
  
  // 元のテキストを削除する
  textNode.removeFromParent() ;
  
  return res ;
}

/**
  * 指定したオブジェクトのbottom座標を取得する
  * @param {SceneNode} targetItem 対象のアイテム
  * @return {Number}
*/
function getBottom(targetItem) {
  const bounds = targetItem.boundsInParent ;
  const res = bounds.y + bounds.height ;
  return res ;
}

/**
  * アイテムのtopLeftを指定して移動する
  * @param {SceneNode} targetItem 対象のアイテム
  * @param {Number} dstX 移動先のx座標。省略された場合はもとの数値を使用
  * @param {Number} dstY 移動先のy座標。省略された場合はもとの数値を使用
  * @return {}
*/
function setPosition(targetItem, dstX, dstY) {
  const srcPos = targetItem.topLeftInParent ;
  if(dstX == null) {dstX = srcPos.x ;}
  if(dstY == null) {dstY = srcPos.y ;}
  const deltaX = dstX - srcPos.x ;
  const deltaY = dstY - srcPos.y ;
  if(!(deltaX || deltaY)) {return ;}
  targetItem.moveInParentCoordinates(deltaX, deltaY)
}

/**
  * テキストを段落ごとに分解する。スタイルと位置を保持するが遅い
  * @param {Selection} selection selectionをそのまま渡す
  * @param {Text} textNode 分解するText
  * @return {Array} 
*/
async function splitRowsPreserveAppearance(selection, textNode) {
  // 元のテキストの情報を取得する
  const styleRanges = textNode.styleRanges ;
  showOverflows(textNode) ;
  let areaWidth ;
  let isAreaText = false ;
  if(textNode.areaBox) {
    isAreaText = true ;
    areaWidth = textNode.areaBox.width ;
  }
  const {rows, leadings} = await getRows(textNode) ;
  if(rows.length <= 1) {
    alert(resultTitle, msgDidNotSplit) ;
    return [textNode] ;
  }
  
  // styleRangesを段落ごとに分割する
  const newstyleRanges = splitStyles(styleRanges, rows) ;
  
  // areaTextだったらpointTextに変更する。areaTextのままだとベースラインがずれる
  if(isAreaText) {textNode.areaBox = null ;}

  // 情報を取得したあとはデータを軽くしておく
  textNode.text = 'a' ;
  
  // テキストを段落ごとに分割する
  const re_invisibleLine = /^[\s]+$/ ;
  const re_endsWithReturn = /[\r\n]$/ ;
  let currentNode = textNode ;
  let offset = 0 ;
  let res = [] ;
  rows.forEach((row, i) => {
    if(re_invisibleLine.test(row)) {
      offset += leadings[i] ;
    } else {  
      selection.items = [currentNode] ;
      commands.duplicate() ; // selection.itemsに対して行われる
      commands.sendBackward() ;
      currentNode = selection.items[0] ;
      
      currentNode.text = row.replace(re_endsWithReturn, '') ;
      currentNode.moveInParentCoordinates(0, leadings[i] + offset) ;
      currentNode.styleRanges = newstyleRanges[i] ;
      offset = 0 ;
      
      res.push(currentNode) ;
    }
  }) ;
  
  // 元がareaTextだったらareaTextに戻す
  if(isAreaText) {
    res.forEach((aItem) => {
      aItem.areaBox = {width : areaWidth, height : aItem.styleRanges[0].fontSize} ;
      trimText(aItem) ;
    }) ;
  }
  
  // 元のテキストを削除する
  textNode.removeFromParent() ;
  
  return res ;
}

/**
  * areaTextから溢れている文字が表示されるまで枠を広げる
  * @param {Text} textNode 対象のText
  * @return {}
*/
function showOverflows(textNode) {
  let box ;
  while(textNode.clippedByArea) {
    box = textNode.areaBox ;
    textNode.resize(box.width, Math.trunc(box.height * 2)) ;
  }
}

/**
  * 対象のTextから段落ごとの文字と行送りを取得する
  * @param {Text} textNode 対象のText
  * @return {Object} {rows, leadings}
*/
async function getRows(textNode) {
  // 元のテキストを記録する
  const srcStr = textNode.text ;
  
  // svgからテキストとy座標を取得する正規表現
  const re_tspan = /<tspan .*?y="([0-9.]+)".*?>(.*?)<\/tspan>/g ;
  
  // textNodeをsvgに変換し，そのソースコードをパースする
  const svgCode = await getSVG(textNode) ;
  //console.log(svgCode) ;
  const tempRows = [] ;
  const yList = [] ;
  let i = -1 ;
  let m, str, currentNum, lastNum ;
  while(m = re_tspan.exec(svgCode)) {
    str = unescapeHtml(m[2]) ;
    
    currentNum = Number(m[1]) ;
    if(lastNum == currentNum) {
      tempRows[i] += str ;
    } else {
      i++ ;
      tempRows.push(str) ;
      yList.push(currentNum) ;
    }
    lastNum = currentNum ;
  }
  
  // 各行の行送りを配列にする
  const tempLeadings = [0] ;
  for(let i = 1, len = yList.length ; i < len ; i++) {
    tempLeadings.push(yList[i] - yList[i - 1]) ;
  }
  
  // 省略された改行を復元する
  const returnCode = '\n' ;
  currentNum = 0 ;
  tempRows.forEach((row, i) => {
    if(row == '') {
      tempRows[i] = returnCode ;
      currentNum += 1 ;
    } else {
      currentNum += row.length ;
      
      if(srcStr[currentNum] == returnCode) {
        tempRows[i] += returnCode ;
        currentNum += 1 ;
      }
    }
  }) ;
  
  // 改行文字ごとにtempRowsとtempLeadingsをまとめる
  const rows = [] ;
  const leadings = [0] ;
  let currentStr = '' ;
  currentNum = 0 ;
  const lastRowIndex = tempRows.length - 1 ;
  const re_endsWithReturn = /[\r\n]$/ ;
  tempRows.forEach((row, i) => {
    currentStr += row ;
    currentNum += (tempLeadings[i + 1] || 0) ;
    if(re_endsWithReturn.test(row) || i == lastRowIndex) {
      rows.push(currentStr) ;
      leadings.push(currentNum) ;
      currentStr = '' ;
      currentNum = 0 ;
    }
  }) ;
  
  return {rows, leadings} ;
}

/**
  * 対象のアイテムのsvgコードを取得する    
  * https://forums.adobexdplatform.com/t/api-to-get-the-svg-of-an-element-as-a-string/965/2
  * @param {SceneNode} targetNode 対象のアイテム
  * @return {String} 
*/
async function getSVG(targetNode) {
  const tempFolder = await fs.getTemporaryFolder() ;
  const tempSVGFile = await tempFolder.createFile('sttk3_temp.svg') ;

  await app.createRenditions([{
    type: 'svg', 
    node: targetNode, 
    outputFile: tempSVGFile, 
    minify: true, 
    embedImages: false
  }]) ;

  const res = await tempSVGFile.read() ;
  tempSVGFile.delete() ;
  return res ;
}

/**
  * &amp;などhtmlの文字参照をデコードする
  * @param {String} str 対象の文字
  * @return {String} 
*/
function unescapeHtml(str) {
  const patterns = {
    '&lt;'   : `<`,
    '&gt;'   : `>`,
    '&amp;'  : `&`,
    '&quot;' : `"`,
    '&apos;' : `'`
  } ;
  const re = /&(?:lt|gt|amp|quot|apos);/g ;
  
  let res = str ;
  if(re.test(str)) {
    res = str.replace(re, function(m) {return patterns[m] ;}) ;
  }
  
  return res ;
} ;

/**
  * styleRangesを段落ごとに分割する
  * @param {Array} styleRanges 対象のstyleRanges
  * @param {Array} rows 段落ごとに分割された文字の配列
  * @return {Array} 
*/
function splitStyles(styleRanges, rows) {
  // どのスタイルが適用されているか1文字ごとにindexを取得する。結果は配列として記録する。例　[0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2]
  let styleLength = 0 ;
  let indexList = [] ;
  let styleIndex ;
  styleRanges.forEach((aItem, i) => {
    styleLength += aItem.length ;
    indexList = indexList.concat(Array(aItem.length).fill(i)) ;
    styleIndex = i ;
  }) ;
  const lengthGap = (rows.join('').length) - styleLength ;
  if(lengthGap > 0) {
    // 最後のstyleRangeはlengthを数えるのを途中でやめていることがあるので，
    // 文字数とstyleRangesのlengthに差があった場合は自力で埋める
    indexList = indexList.concat(Array(lengthGap).fill(styleIndex)) ;
  }
  //console.log(indexList) ;
  
  // indexを行ごとに分割する。例　[[0, 0, 0, 1, 1], [1, 1, 1, 1], [1, 2, 2]]
  let indexListRows = [] ;
  let currentNum = 0 ;
  let len ;
  rows.forEach((row) => {
    len = row.length ;
    indexListRows.push(indexList.slice(currentNum, currentNum + len)) ;
    currentNum += len ;
  }) ;
  //console.log(indexListRows) ;
  
  // index配列をstyleRangesに変換する
  let currentArr, currentStyle ;
  const newStyleRanges = indexListRows.map((row) => {
    currentArr = [] ;
    new Set(row).forEach((index) => {
      currentStyle = JSON.parse(JSON.stringify(styleRanges[index])) ;
      currentStyle.length = row.filter((aItem) => {return aItem == index ;}).length ;
      currentArr.push(currentStyle) ;
    }) ;
    return currentArr ;
  }) ;
  //console.log(newStyleRanges) ;
  
  return newStyleRanges ;
}

/**
  * 内容に合わせてareaTextのフレームの高さをフィットさせる。TrimItより改変<br/>
  * Copyright (c) 2018 Peter Flynn    
  *
  * Permission is hereby granted, free of charge, to any person obtaining a
  * copy of this software and associated documentation files (the "Software"),
  * to deal in the Software without restriction, including without limitation
  * the rights to use, copy, modify, merge, publish, distribute, sublicense,
  * and/or sell copies of the Software, and to permit persons to whom the
  * Software is furnished to do so, subject to the following conditions:    
  *    
  * The above copyright notice and this permission notice shall be included in
  * all copies or substantial portions of the Software.    
  *    
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
  * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
  * DEALINGS IN THE SOFTWARE.
  * @param {Text} textNode 対象のText
  * @return {}
*/
function trimText(textNode) {
  const style = textNode.styleRanges[0] ;
  let i = style.lineSpacing || style.fontSize ;
  if(!textNode.clippedByArea) {i = -i ;}
  
  const w = textNode.areaBox.width ;
  let h = textNode.areaBox.height ;
  let origClippedByArea ;
  while(Math.abs(i) >= 1) {
    origClippedByArea = textNode.clippedByArea ;
    while(textNode.clippedByArea === origClippedByArea) {
      h += i ;
      textNode.resize(w, h) ;
    }
    i = -Math.trunc(i / 2) ;
  }
  
  if(textNode.clippedByArea) {textNode.resize(w, h + 1) ;}
}

module.exports = {
  commands: {
    splitRowsSimple: splitRowsSimpleMenuItem, 
    splitRowsPreserveAppearance: splitRowsPreserveAppearanceMenuItem
  }
} ;