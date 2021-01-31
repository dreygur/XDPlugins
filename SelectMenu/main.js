/**
  * @file 選択：共通，選択：オブジェクト
  * @version 2.0.0
  * @author sttk3.com
  * @copyright (c) 2020 sttk3.com
*/

const { alert, error } = require('./lib/dialogs.js') ;
const { selection, root } = require('scenegraph') ;

/**
  * selection.itemsが空かどうかを返す
  * @return {Boolean} 
*/
function isEmpty() {
  let res = false ;
  if(selection.items.length <= 0) {
    error('Error : ', 'Please select the object, and then execute this plugin.') ;
    res = true ;
  }
  return res ;
}

/**
  * 配列の要素数が指定した数，またはそれ以下かどうかを返す
  * @param {Array} arr 対象の配列
  * @param {Integer} value 個数
  * @return {Boolean} 
*/
function lessThanOrEquals(arr, value) {
  let res = false ;
  if(arr.length <= value) {
    alert('SelectMenu : ', 'There were no items to select.') ;
    res = true ;
  }
  return res ;
}

/**
  * 配下のnodeを取得する
  * @param {SceneNodeList} objs 探索開始位置
  * @param {Boolean} accessibleOnly trueの場合，EditContextが編集可能な範囲にあるアイテムのみ取得する
  * @param {Set} [excludeSet] childrenの探索を除外する種類のセット
  * @return {Array}
*/
function entireContents(objs, accessibleOnly = true, excludeSet = new Set([])) {
  let res = [] ;
  let children, itemClass ;
  objs.forEach((aItem) => {
    itemClass = aItem.constructor.name ;
    if(accessibleOnly) {
      if(selection.isInEditContext(aItem)) {res.push(aItem) ;}
    } else {
      res.push(aItem) ;
    }
    children = aItem.children ;
    if(children && !excludeSet.has(itemClass)) {
      res = res.concat(entireContents(children, excludeSet)) ;
    }
  }) ;
  return res ;
}

/**
  * 配列にグループ本体とそのグループの配下が同時にある場合，グループ本体だけを残す
  * @param {Array} targetItems 対象の配列
  * @return {Array}
*/
function rejectDescendants(targetItems) {
  const ancestorSet = new Set() ;
  
  let isInAncestors ;
  const res = targetItems.filter((aNode) => {
    isInAncestors = ancestorSet.has(aNode.parent) ;
    if(/Group/.test(aNode.constructor.name)) {
      ancestorSet.add(aNode) ;
    }
    return (!isInAncestors) ;
  }) ;

  return res ;
}

/**
  * 同じ名前のアイテムを選択する
  * @return 
*/
function selectSameNameMenuItem() {
  if(isEmpty()) {return ;}
  const itemName = selection.items[0].name ;
  let targetItems = entireContents(root.children, true).filter((aNode) => {
    return (aNode.name === itemName) ;
  }) ;
  if(lessThanOrEquals(targetItems, 1)) {return ;}

  targetItems = rejectDescendants(targetItems) ;
  if(lessThanOrEquals(targetItems, 1)) {return ;}
  selection.items = targetItems ;
}

/**
  * 同じ名前と種類のアイテムを選択する
  * @return 
*/
function selectSameNameAndClassMenuItem() {
  if(isEmpty()) {return ;}
  const itemName = selection.items[0].name ;
  const itemClass = selection.items[0].constructor.name ;
  let targetItems = entireContents(root.children, true).filter((aNode) => {
    return (aNode.name === itemName && aNode.constructor.name === itemClass) ;
  }) ;
  if(lessThanOrEquals(targetItems, 1)) {return ;}

  targetItems = rejectDescendants(targetItems) ;
  if(lessThanOrEquals(targetItems, 1)) {return ;}
  selection.items = targetItems ;
}

/**
  * 同じ種類のアイテムを選択する
  * @return 
*/
function selectSameClassMenuItem() {
  if(isEmpty()) {return ;}
  const itemClass = selection.items[0].constructor.name ;
  let targetItems = entireContents(root.children, true).filter((aNode) => {
    return (aNode.constructor.name === itemClass) ;
  }) ;
  if(lessThanOrEquals(targetItems, 1)) {return ;}

  targetItems = rejectDescendants(targetItems) ;
  if(lessThanOrEquals(targetItems, 1)) {return ;}
  selection.items = targetItems ;
}

/**
  * 同じコンポーネントのインスタンスを選択する
  * @return 
*/
function selectSameComponentsMenuItem() {
  if(isEmpty()) {return ;}
  const itemClass = selection.items[0].constructor.name ;
  if(itemClass !== 'SymbolInstance') {return ;}
  const itemSymbol = selection.items[0].symbolId ;
  let targetItems = entireContents(root.children, true).filter((aNode) => {
    return (aNode.constructor.name === itemClass && aNode.symbolId === itemSymbol) ;
  }) ;
  if(lessThanOrEquals(targetItems, 1)) {return ;}

  targetItems = rejectDescendants(targetItems) ;
  if(lessThanOrEquals(targetItems, 1)) {return ;}
  selection.items = targetItems
}

/**
  * 同じローカル座標のアイテムを選択する
  * @return 
*/
function selectSameLocalPositionMenuItem() {
  if(isEmpty()) {return ;}
  const masterPos = selection.items[0].topLeftInParent ;
  let itemPos ;
  let targetItems = entireContents(root.children, true).filter((aNode) => {
    itemPos = aNode.topLeftInParent ;
    return (masterPos.x === itemPos.x && masterPos.y === itemPos.y) ;
  }) ;
  if(lessThanOrEquals(targetItems, 1)) {return ;}

  targetItems = rejectDescendants(targetItems) ;
  if(lessThanOrEquals(targetItems, 1)) {return ;}
  selection.items = targetItems ;
}

/**
  * 表のように規則的に並ぶアイテムを座標でフィルタし選択する。RepeatGridの中身には対応していない
  * @param {Function} filterCallback フィルタ関数
  * @return
*/
function selectGridData(filterCallback) {
  if(isEmpty()) {return ;}
  
  const hasArtwork = selection.hasArtwork ;
  const oldSel = selection.items[0] ;
  const masterPos = oldSel.globalBounds ;
  let tempItems ;
  if(hasArtwork) {
    // オブジェクトを選択している場合
    tempItems = entireContents(root.children, true) ;
  } else {
    // アートボードを選択している場合
    tempItems = root.children.filter((aNode) => {
      return (aNode.constructor.name === 'Artboard') ;
    }) ;
  }
  
  // 座標で絞る
  let targetItems = tempItems.filter((aItem) => {
    return filterCallback(aItem, masterPos) ;
  }) ;
  if(lessThanOrEquals(targetItems, 1)) {return ;}
  
  // グループ本体とそのグループの配下が同時にある場合，グループ本体だけを残す
  if(hasArtwork) {
    targetItems = rejectDescendants(targetItems) ;
    if(lessThanOrEquals(targetItems, 1)) {return ;}
  }
  
  // Singariと連携しやすくするため，元の選択アイテムを末尾に送る(最後のアイテムをキーオブジェクトとみなすから)
  for(let i = 0, len = targetItems.length ; i < len ; i++) {
    if(targetItems[i] === oldSel) {
      targetItems.splice(i, 1) ;
      break ;
    }
  }
  targetItems.push(oldSel) ;
  selection.items = targetItems ;
}

/**
  * 同じ列(同じLeft座標)のアイテムを選択する
  * @return 
*/
function selectSameColumnMenuItem() {
  let itemPos ;
  selectGridData((aNode, masterPos) => {
    itemPos = aNode.globalBounds ;
    return (itemPos.x === masterPos.x) ;
  }) ;
}

/**
  * 選択アイテムと同じ列の先頭までを選択する
  * @return
*/
function selectAboveOfColumnMenuItem() {
  let itemPos ;
  selectGridData((aNode, masterPos) => {
    itemPos = aNode.globalBounds ;
    return ((itemPos.x === masterPos.x) && (itemPos.y <= masterPos.y)) ;
  }) ;
}

/**
  * 選択アイテムと同じ列の末尾までを選択する
  * @return
*/
function selectBelowOfColumnMenuItem() {
  let itemPos ;
  selectGridData((aNode, masterPos) => {
    itemPos = aNode.globalBounds ;
    return ((itemPos.x === masterPos.x) && (itemPos.y >= masterPos.y)) ;
  }) ;
}

/**
  * 同じ行(同じTop座標)のアイテムを選択する
  * @return 
*/
function selectSameRowMenuItem() {
  let itemPos ;
  selectGridData((aNode, masterPos) => {
    itemPos = aNode.globalBounds ;
    return (itemPos.y === masterPos.y) ;
  }) ;
}

/**
  * 選択アイテムと同じ行の先頭までを選択する
  * @return
*/
function selectLeftOfRowMenuItem() {
  let itemPos ;
  selectGridData((aNode, masterPos) => {
    itemPos = aNode.globalBounds ;
    return ((itemPos.y === masterPos.y) && (itemPos.x <= masterPos.x)) ;
  }) ;
}

/**
  * 選択アイテムと同じ行の末尾までを選択する
  * @return
*/
function selectRightOfRowMenuItem() {
  let itemPos ;
  selectGridData((aNode, masterPos) => {
    itemPos = aNode.globalBounds ;
    return ((itemPos.y === masterPos.y) && (itemPos.x >= masterPos.x)) ;
  }) ;
}

/**
  * すべてのアートボードを選択する
  * @return  
*/
function selectAllArtboardMenuItem() {
  const targetItems = root.children.filter((aNode) => {
    return (aNode.constructor.name === 'Artboard') ;
  }) ;
  
  if(lessThanOrEquals(targetItems, 0)) {
    return ;
  } else {
    if(selection.isInEditContext(targetItems[0])) {
      selection.items = targetItems ;
    } else {
      error('Error : ', 'Please execute this plugin with nothing selected or an artboard selected.') ;
    }
  }
}

/**
  * すべてのテキストを選択する
  * @return 
*/
function selectAllTextMenuItem() {
  const itemClass = 'Text' ;
  const targetItems = entireContents(root.children, true).filter((aNode) => {
    return (aNode.constructor.name === itemClass) ;
  }) ;
  
  if(lessThanOrEquals(targetItems, 0)) {return ;}
  selection.items = targetItems ;
}

/**
  * エリアテキストを選択する
  * @return 
*/
function selectAreaTextsMenuItem() {
  const itemClass = 'Text' ;
  const targetItems = entireContents(root.children, true).filter((aNode) => {
    return (aNode.constructor.name === itemClass && aNode.areaBox !== null) ;
  }) ;
  
  if(lessThanOrEquals(targetItems, 0)) {return ;}
  selection.items = targetItems ;
}

/**
  * ポイントテキストを選択する
  * @return 
*/
function selectPointTextsMenuItem() {
  const itemClass = 'Text' ;
  const targetItems = entireContents(root.children, true).filter((aNode) => {
    return (aNode.constructor.name === itemClass && aNode.areaBox === null) ;
  }) ;
  
  if(lessThanOrEquals(targetItems, 0)) {return ;}
  selection.items = targetItems ;
}

/**
  * ロックされているアイテムを選択する
  * @return 
*/
function selectLockedItemsMenuItem() {
  let targetItems = entireContents(root.children, true).filter((aNode) => {
    return (aNode.locked) ;
  }) ;
  if(lessThanOrEquals(targetItems, 0)) {return ;}

  targetItems = rejectDescendants(targetItems) ;
  if(lessThanOrEquals(targetItems, 1)) {return ;}
  selection.items = targetItems ;
}

/**
  * 非表示のアイテムを選択する
  * @return 
*/
function selectHiddenItemsMenuItem() {
  let targetItems = entireContents(root.children, true).filter((aNode) => {
    return (!aNode.visible) ;
  }) ;
  if(lessThanOrEquals(targetItems, 0)) {return ;}

  targetItems = rejectDescendants(targetItems) ;
  if(lessThanOrEquals(targetItems, 1)) {return ;}
  selection.items = targetItems ;
}

/**
  * 書き出し用にマークされたアイテムを選択する
  * @return 
*/
function selectMarkedItemsMenuItem() {
  let targetItems = entireContents(root.children, true).filter((aNode) => {
    return (aNode.markedForExport) ;
  }) ;
  if(lessThanOrEquals(targetItems, 0)) {return ;}

  targetItems = rejectDescendants(targetItems) ;
  if(lessThanOrEquals(targetItems, 1)) {return ;}
  selection.items = targetItems ;
}

function ignoreMenuItem(selection) {
  
}

module.exports = {
  commands: {
    ignore: ignoreMenuItem, 
    
    selectSameName: selectSameNameMenuItem, 
    selectSameNameAndClass: selectSameNameAndClassMenuItem, 
    selectSameClass: selectSameClassMenuItem, 
    selectSameComponents: selectSameComponentsMenuItem, 
    selectSameLocalPosition: selectSameLocalPositionMenuItem, 
    
    selectSameRow: selectSameRowMenuItem, 
    selectLeftOfRow: selectLeftOfRowMenuItem, 
    selectRightOfRow: selectRightOfRowMenuItem, 
    selectSameColumn: selectSameColumnMenuItem, 
    selectAboveOfColumn: selectAboveOfColumnMenuItem, 
    selectBelowOfColumn: selectBelowOfColumnMenuItem, 
    
    selectAllArtboard: selectAllArtboardMenuItem, 
    selectAllText: selectAllTextMenuItem,
    selectAreaTexts: selectAreaTextsMenuItem,
    selectPointTexts: selectPointTextsMenuItem, 
    selectLockedItems: selectLockedItemsMenuItem, 
    selectHiddenItems: selectHiddenItemsMenuItem, 
    selectMarkedItems: selectMarkedItemsMenuItem
  }
} ;