/**
  * @file 整列・分布の実際の動作
  * @author sttk3.com
  * @copyright (c) 2020 sttk3.com
*/

const { selection, root } = require('scenegraph') ;
const { XDAlignOptions, XDDistributeOptions, XDAlignBasis, XDBoundsType } = require('./constants.js') ;

/**
  * keyObjectを取得する
  * @param {String} basis relative to (XDAlignBasis.PARENT | XDAlignBasis.SELECTION | XDAlignBasis.FRONTMOST_ITEM | XDAlignBasis.BACKMOST_ITEM | XDAlignBasis.LAST_SELECTED_ITEM)
  * @return {SceneNode} 
*/
function getKeyObject(basis) {
  let res ;
  switch(basis) {
    case XDAlignBasis.PARENT :
      res = selection.editContext ;
      if(res.constructor.name == 'RootNode') {
        res = selection.focusedArtboard ;
      }
      break ;
    case XDAlignBasis.SELECTION :
      res = null ;
      break ;
    case XDAlignBasis.TEXT :
      res = getFrontmostItem(root.children, makeGuidSet(new Set(['Text']))) ;
      if(res == null) {throw new Error('Please select the text and then execute this plugin.') ;}
      break ;
    case XDAlignBasis.FRONTMOST_ITEM :
      res = getFrontmostItem(root.children, makeGuidSet()) ;
      break ;
    case XDAlignBasis.BACKMOST_ITEM :
      res = getBackmostItem(root.children, makeGuidSet()) ;
      break ;
    case XDAlignBasis.LAST_SELECTED_ITEM :
      // 最後に選択したものをkey objectとする
      res = selection.items[selection.items.length - 1] ;
      break ;
  }

  return res ;
}

/**
  * 選択アイテムの中で最前面にあるものを返す
  * @param {Array} targetItems 対象の配列
  * @param {Set} guidSet 選択アイテムのguidのset
  * @return {Scenenode}
*/
function getFrontmostItem(targetItems, guidSet) {
  let res ;
  for(let i = targetItems.length - 1 ; i >= 0 ; i--) {
    let currentItem = targetItems.at(i) ;
    if(guidSet.has(currentItem.guid)) {
      res = currentItem ;
      break ;
    } else {
      if(currentItem.children.length) {
        let retval = getFrontmostItem(currentItem.children, guidSet) ;
        if(retval) {
          res = retval ;
          break ;
        }
      }
    }
  }
  return res ;
}

/**
  * 選択アイテムの中で最背面にあるものを返す
  * @param {Array} targetItems 対象の配列
  * @param {Set} guidSet 選択アイテムのguidのset
  * @return {Scenenode}
*/
function getBackmostItem(targetItems, guidSet) {
  let res ;
  for(var i = 0, len = targetItems.length ; i < len ; i++) {
    let currentItem = targetItems.at(i) ;
    if(guidSet.has(currentItem.guid)) {
      res = currentItem ;
      break ;
    } else {
      if(currentItem.children.length) {
        let retval = getBackmostItem(currentItem.children, guidSet) ;
        if(retval) {
          res = retval ;
          break ;
        }
      }
    }
  }
  return res ;
}

/**
  * 選択アイテムのguidの一覧を作る
  * @param {Set} [includeSet] 一覧に含める型('Text'など)のホワイトリストのset
  * @return {Set}
*/
function makeGuidSet(includeSet = null) {
  let targetItems = selection.items ;
  if(includeSet) {targetItems = targetItems.filter((aItem) => {return includeSet.has(aItem.constructor.name)}) ;}
  const arr = targetItems.map((aItem) => {
    return aItem.guid ;
  }) ;
  
  return new Set(arr) ;
}

/**
  * 整列動作を設定ごとに振り分ける
  * @param {Object} settings 環境設定オブジェクト
  * @param {String} alignOption 整列位置。XDAlignOptions.LEFT_EDGES など
  * @param {Scenenode} keyObj キーオブジェクト
  * @return {} 
*/
async function align(settings, alignOption, keyObj) {
  /*
    1　Align to area with keep original spacing | (settings.syncMultipleItems) && ((settings.basis == XDAlignBasis.SELECTION) || (settings.basis == XDAlignBasis.PARENT))
    2　Align to key object with keep original spacing | (settings.syncMultipleItems) && ((settings.basis != XDAlignBasis.SELECTION) && (settings.basis != XDAlignBasis.PARENT))
    3　Align to area | (!settings.syncMultipleItems) && ((settings.basis == XDAlignBasis.SELECTION) || (settings.basis == XDAlignBasis.PARENT))
    4　Align to key object | (!settings.syncMultipleItems) && ((settings.basis != XDAlignBasis.SELECTION) && (settings.basis != XDAlignBasis.PARENT))
  */
  
  const targetItems = selection.items ;
  const targetLength = targetItems.length ;
  switch(settings.basis) {
    case XDAlignBasis.PARENT :
      if((keyObj == null) || (keyObj && selection.hasArtboards)) {
        // アートボードまたはペーストボードのアイテムだけを選択している場合，XDAlignBasis.SELECTIONと同じ動作
        alignToArea(targetItems, alignOption, getBoundsOfItems(selection.items), settings.syncMultipleItems) ;
      } else {
        // [√]syncMultipleItems => 1
        // [ ]syncMultipleItems => 3
        alignToArea(targetItems, alignOption, makeGeometricBounds(keyObj[XDBoundsType.GLOBAL_BOUNDS]), settings.syncMultipleItems) ;
      }
      break ;
    case XDAlignBasis.SELECTION :
      if(selection.hasArtwork && (targetLength == 1 || settings.syncMultipleItems)) {
        // 選択がアートボードでない，かつ選択が1つまたはsyncがONの場合，XDAlignBasis.PARENTと同じ動作
        alignToArea(targetItems, alignOption, makeGeometricBounds(getKeyObject(XDAlignBasis.PARENT)[XDBoundsType.GLOBAL_BOUNDS]), settings.syncMultipleItems) ;
      } else {
        // [√]syncMultipleItems => 1
        // [ ]syncMultipleItems => 3
        alignToArea(targetItems, alignOption, getBoundsOfItems(selection.items), settings.syncMultipleItems) ;
      }
      break ;
    case XDAlignBasis.TEXT :
    case XDAlignBasis.FRONTMOST_ITEM :
    case XDAlignBasis.BACKMOST_ITEM :
    case XDAlignBasis.LAST_SELECTED_ITEM :
      if(settings.syncMultipleItems) {
        if(selection.hasArtwork && targetLength <= 2) {
          // 選択がアートボードでなく数が2つまでの場合，XDAlignBasis.PARENTと同じ動作
          alignToArea(targetItems, alignOption, makeGeometricBounds(getKeyObject(XDAlignBasis.PARENT)[XDBoundsType.GLOBAL_BOUNDS]), settings.syncMultipleItems) ;
        } else {
          // [√]syncMultipleItems => 2
          const targetItemsSinKeyObject = targetItems.filter((aItem) => {return aItem !== keyObj}) ;
          if(targetItemsSinKeyObject.length < 2) {return ;}
          alignToArea(targetItemsSinKeyObject, alignOption, makeGeometricBounds(keyObj[XDBoundsType.GLOBAL_BOUNDS]), true) ;
        }
      } else {
        if(selection.hasArtwork && targetLength == 1) {
          // 選択がアートボードでなく数が1つの場合，XDAlignBasis.PARENTと同じ動作
          alignToArea(targetItems, alignOption, makeGeometricBounds(getKeyObject(XDAlignBasis.PARENT)[XDBoundsType.GLOBAL_BOUNDS]), settings.syncMultipleItems) ;
        } else {
          // [ ]syncMultipleItems => 4
          const oldPos = keyObj[XDBoundsType.GLOBAL_BOUNDS] ;
          alignToArea(targetItems, alignOption, getBoundsOfItems(selection.items), false) ;

          // keyObjが動いた距離を出す
          const newPos = keyObj[XDBoundsType.GLOBAL_BOUNDS] ;
          const gap = [oldPos.x - newPos.x, oldPos.y - newPos.y] ;
          
          // keyObjが元の位置に戻るよう，すべてのアイテムを移動する
          for(const aItem of selection.items) {
            aItem.moveInParentCoordinates(gap[0], gap[1]) ;
          }
        }
      }
      break ;
  }
}

/**
  * 整列する
  * @param {Array} targetItems 対象のアイテム
  * @param {String} alignOption 整列位置。XDAlignOptions.LEFT_EDGES など
  * @param {Array} areaBounds 整列対象アイテム全体の最大領域と中心点 [left, top, right, bottom, horizontal center, vertical center]
  * @return {}
*/
function alignToArea(targetItems, alignOption, areaBounds, syncMultipleItems) {
  let indexPosition ;
  switch(alignOption) {
    case XDAlignOptions.LEFT_EDGES :
      indexPosition = [0, null] ;
      break ;
    case XDAlignOptions.HORIZONTAL_CENTERS :
      indexPosition = [4, null] ;
      break ;
    case XDAlignOptions.RIGHT_EDGES :
      indexPosition = [2, null] ;
      break ;
   
    case XDAlignOptions.TOP_EDGES :
      indexPosition = [null, 1] ;
      break ;
    case XDAlignOptions.VERTICAL_CENTERS :
      indexPosition = [null, 5] ;
      break ;
    case XDAlignOptions.BOTTOM_EDGES :
      indexPosition = [null, 3] ;
      break ;

    case XDAlignOptions.TOP_LEFT :
      indexPosition = [0, 1] ;
      break ;
    case XDAlignOptions.TOP_MIDDLE :
      indexPosition = [4, 1] ;
      break ;
    case XDAlignOptions.TOP_RIGHT :
      indexPosition = [2, 1] ;
      break ;
    case XDAlignOptions.MIDDLE_LEFT :
      indexPosition = [0, 5] ;
      break ;
    case XDAlignOptions.CENTER :
      indexPosition = [4, 5] ;
      break ;
    case XDAlignOptions.MIDDLE_RIGHT :
      indexPosition = [2, 5] ;
      break ;
    case XDAlignOptions.BOTTOM_LEFT :
      indexPosition = [0, 3] ;
      break ;
    case XDAlignOptions.BOTTOM_MIDDLE :
      indexPosition = [4, 3] ;
      break ;
    case XDAlignOptions.BOTTOM_RIGHT :
      indexPosition = [2, 3] ;
      break ;
　　default :
      throw new Error('Requested option does not exist') ;
  }

  // [left, top, right, bottom, horizontal center, vertical center]を取得する
  const alignDistributeItems = [] ;
  for(const aItem of targetItems) {
    alignDistributeItems.push(new AlignDistributeItem(aItem, XDBoundsType.GLOBAL_BOUNDS)) ;
  }
  
  // 移動する
  if(syncMultipleItems) {
    const targetBounds = getBoundsOfItems(targetItems, XDBoundsType.GLOBAL_BOUNDS) ;
    for(const aItem of alignDistributeItems) {
      indexPosition.forEach((v, i) => {
        if(v != null) {aItem.gap[i] = areaBounds[v] - targetBounds[v] ;}
      }) ;
      aItem.item.moveInParentCoordinates(aItem.gap[0], aItem.gap[1]) ;
    }
  } else {
    for(const aItem of alignDistributeItems) {
      indexPosition.forEach((v, i) => {
        if(v != null) {aItem.gap[i] = areaBounds[v] - aItem.bounds[v] ;}
      }) ;
      aItem.item.moveInParentCoordinates(aItem.gap[0], aItem.gap[1]) ;
    }
  }
}

/**
  * 分布する
  * @param {Object} settings 環境設定オブジェクト
  * @param {Object} distributeOption 分布位置。XDDistributeOptions.TOP_EDGES など
  * @param {Scenenode} keyObj キーオブジェクト
  * @return {} 
*/
async function distribute(settings, distributeOption, keyObj) {
  let keyOffset ;
  if(keyObj == null) {
    keyOffset = undefined ;
  } else {
    keyOffset = settings.distributeOffset ;
  }

  let areaBounds ;
  if(settings.basis == XDAlignBasis.PARENT) {
    if(selection.hasArtboards) {
      // アートボードを選択していたらXDAlignBasis.SELECTIONと同じ動作
      keyObj = keyOffset = undefined ;
      areaBounds = getBoundsOfItems(selection.items) ;
    } else {
      areaBounds = makeGeometricBounds(getKeyObject(XDAlignBasis.PARENT)[XDBoundsType.GLOBAL_BOUNDS]) ;
    }
  } else {
    areaBounds = getBoundsOfItems(selection.items) ;
  }

  let indexHead, indexTail, indexMiddle, indexDirection ;
  switch(distributeOption) {
    case XDDistributeOptions.TOP_EDGES :
      // オブジェクトの分布 垂直上
      indexHead = 1 ;
      indexTail = 3 ;
      indexMiddle = indexHead ;
      indexDirection = 1 ;
      break ;
    case XDDistributeOptions.VERTICAL_CENTERS :
      // オブジェクトの分布 垂直中央
      indexHead = 1 ;
      indexTail = 3 ;
      indexMiddle = 5 ;
      indexDirection = 1 ;
      break ;
    case XDDistributeOptions.BOTTOM_EDGES :
      // オブジェクトの分布 垂直下
      indexHead = 1 ;
      indexTail = 3 ;
      indexMiddle = indexTail ;
      indexDirection = 1 ;
      break ;
      
    case XDDistributeOptions.LEFT_EDGES :
      // オブジェクトの分布 水平左
      indexHead = 0 ;
      indexTail = 2 ;
      indexMiddle = indexHead ;
      indexDirection = 0 ;
      break ;
    case XDDistributeOptions.HORIZONTAL_CENTERS :
      // オブジェクトの分布 水平中央
      indexHead = 0 ;
      indexTail = 2 ;
      indexMiddle = 4 ;
      indexDirection = 0 ;
      break ;
    case XDDistributeOptions.RIGHT_EDGES :
      // オブジェクトの分布 水平右
      indexHead = 0 ;
      indexTail = 2 ;
      indexMiddle = indexTail ;
      indexDirection = 0 ;
      break ;
      
    case XDDistributeOptions.HORIZONTAL_SPACE :
      // 等間隔に分布 水平
      indexHead = 0 ;
      indexTail = 2 ;
      indexMiddle = indexHead ;
      indexDirection = 0 ;
      break ;
    case XDDistributeOptions.VERTICAL_SPACE :
      // 等間隔に分布 垂直
      indexHead = 1 ;
      indexTail = 3 ;
      indexMiddle = indexHead ;
      indexDirection = 1 ;
      break ;
    default :
      throw new Error('Requested option does not exist') ;
  }

  // boundsなどの情報を取り出しArrayにする
  const itemLength = selection.items.length ;
  let sortingArray = [] ;
  let refKeyObj ;
  selection.items.forEach((aItem, i) => {
    sortingArray.push(new AlignDistributeItem(aItem, XDBoundsType.GLOBAL_BOUNDS)) ;
    if(aItem == keyObj) {refKeyObj = sortingArray[i] ;}
  }) ;

  // 一番先頭側にあるアイテムとそのindexを取得する
  let firstItemIndex ;
  const firstItem = sortingArray.reduce((a, b, i) => {
    if(a.bounds[indexHead] < b.bounds[indexHead]) {
      return a ;
    } else {
      firstItemIndex = i ;
      return b ;
    }
  }) ;
  
  // 最初のアイテムを，最後のアイテム探索対象から外す
  sortingArray.splice(firstItemIndex, 1) ;

  // 一番末尾側にあるアイテムとそのindexを取得する
  let lastItemIndex ;
  const lastItem = sortingArray.reduce((a, b, i) => {
    if(a.bounds[indexTail] > b.bounds[indexTail]) {
      return a ;
    } else {
      lastItemIndex = i ;
      return b ;
    }
  }) ;

  // 最後のアイテムを，間のアイテム並べかえ対象から外す
  sortingArray.splice(lastItemIndex, 1) ;

  // 間のアイテムを座標順（左/下→右/上）で並べかえる。LEFT_EDGESの場合は左，HORIZONTAL_CENTERSの場合は水平中央の数値を使う。
  // 同じ数値のときは背面にある方が左/上になるようにする。日本人が普通に作業していると背面のほうが左/上になるはず
  let middleItems = sortingArray ;
  if(middleItems.length >= 2) {
    middleItems = middleItems.sort((a, b) => {
      if(a.bounds[indexMiddle] > b.bounds[indexMiddle]) {
        return 1 ;
      } else {
        return -1 ;
      }
    }) ;
  }
  
  // ソート済みのArrayを生成する
  const targetItems = [firstItem].concat(middleItems) ;
  targetItems.push(lastItem) ;

  // 両端のアイテムの移動先を指定
  firstItem.gap[indexDirection] = areaBounds[indexHead] - firstItem.bounds[indexHead] ;
  const lastGap = areaBounds[indexTail] - lastItem.bounds[indexTail] ;
  lastItem.gap[indexDirection] = lastGap ;

  // firstItemからlastItemまでの距離とアイテム同士の間隔を出す
  const spaceLength = itemLength - 1 ;
  let startPos, endPos, distanceWhole, offset ;
  switch(distributeOption) {
    case XDDistributeOptions.HORIZONTAL_SPACE :
    case XDDistributeOptions.VERTICAL_SPACE :
      startPos = firstItem.bounds[indexTail] + firstItem.gap[indexDirection] ;
      endPos = lastItem.bounds[indexHead] + lastItem.gap[indexDirection] ;
      distanceWhole = endPos - startPos ;
      let middleSize = 0 ;
      middleItems.forEach((aItem) => {
        middleSize += aItem.size[indexDirection] ;
      }) ;
      offset = (distanceWhole - middleSize) / spaceLength ;
      break ;
    default :
      startPos = firstItem.bounds[indexMiddle] + firstItem.gap[indexDirection] ;
      endPos = lastItem.bounds[indexMiddle] + lastItem.gap[indexDirection] ;
      distanceWhole = endPos - startPos ;
      offset = distanceWhole / spaceLength ;
      break ;
  }
  let calcLength = spaceLength ;
  if(refKeyObj && keyOffset != undefined) {
    offset = keyOffset ;
    lastItem.gap[indexDirection] -= lastGap ;
    calcLength = itemLength ;
  }

  // 各アイテムの移動位置を計算する
  let currentPos = startPos ;
  let currentItem ;
  for(let i = 1 ; i < calcLength ; i++) {
    currentItem = targetItems[i] ;
    currentPos += offset ;
    currentItem.gap[indexDirection] += currentPos - currentItem.bounds[indexMiddle] ;
    switch(distributeOption) {
      case XDDistributeOptions.HORIZONTAL_SPACE :
      case XDDistributeOptions.VERTICAL_SPACE :
        currentPos += currentItem.size[indexDirection] ;
        break ;
    }
  }
  
  // keyObjがある場合は，keyObjがもともとあった位置に合わせてgapを調整する
  if(refKeyObj) {
    const keyGap = refKeyObj.gap[indexDirection] ;
    for(let i = 0 ; i < itemLength ; i++) {
      targetItems[i].gap[indexDirection] -= keyGap ;
    }
  }
  
  // 実際に移動する
  targetItems.forEach((aItem) => {
    aItem.item.moveInParentCoordinates(aItem.gap[0], aItem.gap[1]) ;
  }) ;
  
  //return true ;
}

/**
  * 複数のアイテムの全体のboundsを返す
  * @param {Array | Collection} targetItems 対象のSceneNode
  * @return {Array} [left, top, right, bottom, horizontal center, vertical center]
*/
function getBoundsOfItems(targetItems, boundsType = XDBoundsType.GLOBAL_BOUNDS) {
  const outputBounds = makeGeometricBounds(targetItems[0][boundsType]) ;
  targetItems.shift() ;
  
  let currentBounds ;
  targetItems.forEach((aItem) => {
    currentBounds = makeGeometricBounds(aItem[boundsType]) ;
    if(outputBounds[0] > currentBounds[0]) {outputBounds[0] = currentBounds[0] ; }
    if(outputBounds[1] > currentBounds[1]) {outputBounds[1] = currentBounds[1] ; }
    if(outputBounds[2] < currentBounds[2]) {outputBounds[2] = currentBounds[2] ; }
    if(outputBounds[3] < currentBounds[3]) {outputBounds[3] = currentBounds[3] ; }
  }) ;
  outputBounds[4] = (outputBounds[0] + outputBounds[2]) / 2 ;
  outputBounds[5] = (outputBounds[1] + outputBounds[3]) / 2 ;

  return outputBounds ;
}

/**
  * geometricBoundsを生成する
  * @param {Bounds} itemBounds 対象のbounds {x, y, width, height}
  * @return {Array} [left, top, right, bottom, horizontal center, vertical center]
*/
function makeGeometricBounds(itemBounds) {
  const res = [itemBounds.x, itemBounds.y, itemBounds.x + itemBounds.width, itemBounds.y + itemBounds.height, itemBounds.x + (itemBounds.width / 2), itemBounds.y + (itemBounds.height / 2)] ;
  return res ;
}

/**
  * 整列・分布に関わる情報を管理するためのclass
  * @class 
  * @param {Scenenode} targetItem 対象のアイテム
  * @param {String} [XDBoundsType] globalBounds | localBounds | boundsInParent | globalDrawBounds
*/
class AlignDistributeItem {
  constructor(targetItem, XDBoundsType = XDBoundsType.GLOBAL_BOUNDS) {
    const itemBounds = targetItem[XDBoundsType] ;

    this.item = targetItem ;
    this.bounds = makeGeometricBounds(itemBounds) ;
    this.size = [itemBounds.width, itemBounds.height] ;
    this.gap = [0, 0] ;
  }
}

module.exports = {
  getKeyObject, 
  align, 
  distribute
} ;