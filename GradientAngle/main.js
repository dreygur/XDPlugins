/**
  * @file LinearGradientFillの角度をget/setする
  * @version 1.0.1
  * @author sttk3.com
  * @copyright (c) 2019 sttk3.com
*/

let panel ;

/**
  * 指定したアイテムの線形グラデーションの角度を取得する
  * @param {Scenenode} targetItem 対象のnode
  * @return {Number} 角度(ラジアン)
*/
function getGradientAngle(targetItem) {
  // 縦横比を取得する
  const ratio = getHVRatio(targetItem) ;
  
  /*
    線形グラデーションからはgetEndPoints()で制御点の座標 [0: startX, 1: startY, 2: endX, 3: endY] が取れる。
    これはアイテムの幅・高さをそれぞれ1とした比率で表しているため，正方形でないと角度が正しくならない。
    比率から縦横比を考慮した座標に変換し，その角度を取得する
  */
  const points = targetItem.fill.getEndPoints() ;
  const res = Math.atan2((points[3] - points[1]) * -1, (points[2] - points[0]) * ratio) ;
  
  return res ;
}

/**
  * 指定したアイテムの線形グラデーションの角度をセットする
  * @param {Scenenode} targetItem 対象のnode
  * @param {Number} dstAngle 傾き角度(ラジアン)
  * @return なし
*/
function setGradientAngle(targetItem, dstAngle) {
  const oldAngle = getGradientAngle(targetItem) ;
  const rotationAngle = oldAngle - radians(dstAngle) ;
  const ratio = getHVRatio(targetItem) ;
  
  // 比率から縦横比を考慮した座標に変換し，目標の角度まで回転した後に比率に戻す
  let targetColor = targetItem.fill ;
  const points = targetColor.getEndPoints() ; // [0: startX, 1: startY, 2: endX, 3: endY]
  const centerAnchor = [0.5 * ratio, 0.5] ;
  const newStartAnchor = rotateAnchor([centerAnchor[0], centerAnchor[1]], [points[0] * ratio, points[1]], rotationAngle) ;
  const newEndAnchor = rotateAnchor([centerAnchor[0], centerAnchor[1]], [points[2] * ratio, points[3]], rotationAngle) ;
  const ratio2 = 1 / ratio ;
  targetColor.setEndPoints(newStartAnchor[0] * ratio2, newStartAnchor[1], newEndAnchor[0] * ratio2, newEndAnchor[1]) ;
  
  // グラデーションを再セットする
  targetItem.fill = targetColor ;
}

/**
  * 指定したアイテムの 幅/高さ 比率を算出する
  * @param {Scenenode} targetItem 対象のnode
  * @return {Number}
*/
function getHVRatio(targetItem) {
  const bounds = targetItem.boundsInParent ;
  const res = bounds.width / bounds.height ;
  return res ;
}

/**
  * 座標を回転した時の新しい座標を取得する
  * @param {Array} origin 中心点座標
  * @param {Array} p1 回転対象座標
  * @param {Number} angle 回転角度(ラジアン)
  * @return {Array} [x, y]
*/
function rotateAnchor(origin, p1, angle) {
  var vx = p1[0] - origin[0] ;
  var vy = p1[1] - origin[1] ;
  
  var cosNum = Math.cos(angle) ;
  var sinNum = Math.sin(angle) ;
  
  var x = vx * cosNum - vy * sinNum ;
  var y = vx * sinNum + vy * cosNum ;
  
  return [origin[0] + x, origin[1] + y] ;
}

/**
  * ラジアンから角度に変換
  * @param {Number} rad 角度(ラジアン)
  * @return {Number} 角度(度)
*/
function degrees(rad) {
  return rad * 180 / Math.PI ;
}

/**
  * 角度からラジアンに変換
  * @param {Number} deg 角度(度)
  * @return {Number} 角度(ラジアン)
*/
function radians(deg) {
  return deg * Math.PI / 180 ;
}

/**
  * パネルを生成する
  * @return {Panel}
*/
function create() {
  const html = `
<style>
    .break {
        flex-wrap: wrap;
    }
    label.row > span {
      color: #8E8E8E;
      width: 16px;
      text-align: right;
      font-size: 9px;
    }
    label.row input {
        flex: 1 1 auto;
    }
    form {
        width:100%;
        margin: 0px;
        padding: 0px;
    }
    .show {
      display: block;
    }
    .hide {
      display: none;
    }
</style>

<form method="dialog" id="main">
    <div class="row break">
        <label class="row">
            <span>angle</span>
            <input type="number" uxp-quiet="true" id="txtO" value="-90" placeholder="offset" />
        </label>
    </div>
</form>
<p id="warning">This plugin requires you to select a object with linear gradients in the document.</p>
`;

  /**
    * パネルのフォーム送信時実行するアクション
  */
  function panelAction() {
    const dstAngle = Number(document.querySelector('#txtO').value) ;
    
    require('application').editDocument({editLabel: 'Set gradient angle'}, function() {
      const {selection} = require('scenegraph') ;
      const targetItem = selection.items[0] ;
      setGradientAngle(targetItem, dstAngle) ;
    }) ;
  }

  panel = document.createElement('div') ;
  panel.innerHTML = html ;
  panel.querySelector('form').addEventListener('submit', panelAction) ;

  return panel ;
}

/**
  * パネルを表示する
*/
function show(event) {
  if(!panel) event.node.appendChild(create()) ;
}

/**
  * パネルを隠す
*/
function hide(event) {}

/**
  * 選択変更時パネルをアップデートする
*/
function update(selection) {
  const form = document.querySelector("form") ;
  const warning = document.querySelector("#warning") ;
  
  if(selection && selection.items[0] && selection.items[0].fill.constructor.name == 'LinearGradientFill') {
    let oldAngle = degrees(getGradientAngle(selection.items[0])).toFixed(3).replace(/\.0+$/, '') ;
    document.querySelector('#txtO').value = oldAngle ;
    form.className = 'show' ;
    warning.className = 'hide' ;
  } else {
    form.className = 'hide' ;
    warning.className = 'show' ;
  }
}

module.exports = {
  panels: {
    gradientAngle: {
      show,
      hide,
      update
    }
  }
} ;