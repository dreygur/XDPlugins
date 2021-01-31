/**
  * @file 整列・分布機能
  * @version 2.0.3
  * @author sttk3.com
  * @copyright (c) 2020 sttk3.com
*/

const { selection } = require('scenegraph') ;
const app = require('application') ;
const fs = require('uxp').storage ;
const { prompt, error } = require('./lib/dialogs.js') ;
const { XDAlignOptions, XDDistributeOptions, XDAlignLabels, XDAlignBasis, XDBoundsType } = require('./lib/constants.js') ;
const { getKeyObject, align, distribute } = require('./lib/align.js') ;
const { base64ArrayBuffer } = require('./lib/base64.js') ;

const SettingFileName = 'settings.json' ;
const PreviewFileName = 'preview.png' ;

let panel, distributeOffsetValue ;

/**
  * プラグインメニューに空欄を入れるための何もしないfunction
*/
function ignoreMenuItem() {
  
}

/**
  * メニューごとに整列・分布動作を振り分ける
  * @param {String} alignDistributeOption 整列または分布位置。XDAlignOptions.LEFT_EDGES など
*/
async function handleAlignMenu(alignDistributeOption) {
  if(isEmpty(selection)) {return ;}

  // 環境設定を取得する
  const settings = await readSettings() ;
  
  // key objectを取得する
  let keyObj ;
  try {
    keyObj = getKeyObject(settings.basis) ;
  } catch(e) {
    error('Error : ', e) ;
    return ;
  }
  
  if(/^XDAlignOptions\./.test(alignDistributeOption)) {
    return await align(settings, alignDistributeOption, keyObj) ;
  } else {
    // パネルのoffset項目を確定する前に実行したときの対策。入力1文字ごとに記録しておいた値を参照して使う
    if(distributeOffsetValue != null) {
      const tempOffset = asNumber(distributeOffsetValue) ;
      if(tempOffset != settings.distributeOffset) {
        settings.distributeOffset = tempOffset ;
        distributeOffsetValue = null ;
        await saveSettings(settings) ;
      }
    }
    return await distribute(settings, alignDistributeOption, keyObj) ;
  }
}

/**
  * selection.itemsが空かどうかを返す
  * @param {Selection} selection
  * @return {Boolean} 
*/
function isEmpty(selection) {
  let res = false ;
  if(selection.items.length <= 0) {
    error('Error : ', 'Please select the object, and then execute this plugin.') ;
    res = true ;
  }
  return res ;
}

/**
  * Align Left
*/
async function alignLeftMenuItem() {
  return handleAlignMenu(XDAlignOptions.LEFT_EDGES) ;
}

/**
  * Align Horizontal Centers
*/
async function alignHorizontalCentersMenuItem() {
  return handleAlignMenu(XDAlignOptions.HORIZONTAL_CENTERS) ;
}

/**
  * Align Right
*/
async function alignRightMenuItem() {
  return handleAlignMenu(XDAlignOptions.RIGHT_EDGES) ;
}

/**
  * Align Top
*/
async function alignTopMenuItem() {
  return handleAlignMenu(XDAlignOptions.TOP_EDGES) ;
}

/**
  * Align Vertical Centers
*/
async function alignVerticalCentersMenuItem() {
  return handleAlignMenu(XDAlignOptions.VERTICAL_CENTERS) ;
}

/**
  * Align Bottom
*/
async function alignBottomMenuItem() {
  return handleAlignMenu(XDAlignOptions.BOTTOM_EDGES) ;
}

/**
  * Align Top Left
*/
async function alignTopLeftMenuItem() {
  return handleAlignMenu(XDAlignOptions.TOP_LEFT) ;
}

/**
  * Align Top Middle
*/
async function alignTopMiddleMenuItem() {
  return handleAlignMenu(XDAlignOptions.TOP_MIDDLE) ;
}

/**
  * Align Top Right
*/
async function alignTopRightMenuItem() {
  return handleAlignMenu(XDAlignOptions.TOP_RIGHT) ;
}

/**
  * Align Middle Left
*/
async function alignMiddleLeftMenuItem() {
  return handleAlignMenu(XDAlignOptions.MIDDLE_LEFT) ;
}

/**
  * Align Center
*/
async function alignCenterMenuItem() {
  return handleAlignMenu(XDAlignOptions.CENTER) ;
}

/**
  * Align Middle Right
*/
async function alignMiddleRightMenuItem() {
  return handleAlignMenu(XDAlignOptions.MIDDLE_RIGHT) ;
}

/**
  * Align Bottom Left
*/
async function alignBottomLeftMenuItem() {
  return handleAlignMenu(XDAlignOptions.BOTTOM_LEFT) ;
}

/**
  * Align Bottom Middle
*/
async function alignBottomMiddleMenuItem() {
  return handleAlignMenu(XDAlignOptions.BOTTOM_MIDDLE) ;
}

/**
  * Align Bottom Right
*/
async function alignBottomRightMenuItem() {
  return handleAlignMenu(XDAlignOptions.BOTTOM_RIGHT) ;
}

/**
  * Distribute Horizontal Space
*/
async function distributeHorizontalSpaceMenuItem() {
  await handleAlignMenu(XDDistributeOptions.HORIZONTAL_SPACE) ;
}

/**
  * Distribute Vertical Space
*/
async function distributeVerticalSpaceMenuItem() {
  await handleAlignMenu(XDDistributeOptions.VERTICAL_SPACE) ;
}

/**
  * Distribute Left
*/
async function distributeLeftMenuItem() {
  await handleAlignMenu(XDDistributeOptions.LEFT_EDGES) ;
}

/**
  * Distribute Horizontal Centers
*/
async function distributeHorizontalCentersMenuItem() {
  await handleAlignMenu(XDDistributeOptions.HORIZONTAL_CENTERS) ;
}

/**
  * Distribute Right
*/
async function distributeRightMenuItem() {
  await handleAlignMenu(XDDistributeOptions.RIGHT_EDGES) ;
}

/**
  * Distribute Top
*/
async function distributeTopMenuItem() {
  await handleAlignMenu(XDDistributeOptions.TOP_EDGES) ;
}

/**
  * Distribute Vertical Centers
*/
async function distributeVerticalCentersMenuItem() {
  await handleAlignMenu(XDDistributeOptions.VERTICAL_CENTERS) ;
}

/**
  * Distribute Bottom
*/
async function distributeBottomMenuItem() {
  await handleAlignMenu(XDDistributeOptions.BOTTOM_EDGES) ;
}

/**
  * ダイアログ分布間隔を指定する
*/
async function setDistributeOffsetMenuItem() {
  // ダイアログで数値を指定する
  const settings = await readSettings() ;
  const defaultValue = settings.distributeOffset ;
  const retval = await prompt('Distribute Offset', '', String(defaultValue)) ;
  if(!retval.which) {return ;}
  
  // 取得した文字が数値でないときは終了
  let num ;
  if(retval.value == '') {
    num = Number(defaultValue) ;
  } else {
    num = Number(retval.value) ;
  }
  if(isNaN(num)) {
    error('Error : ', 'Please enter a numeric value.') ;
    return ;
  }

  // ファイルに保存する
  settings.distributeOffset = num ;
  await saveSettings(settings) ;
}

/**
  * syncMultipleItemsのON/OFFを交互に切り替える
*/
async function toggleSyncMenuItem() {
  const settings = await readSettings() ;
  settings.syncMultipleItems = !settings.syncMultipleItems ;
  await saveSettings(settings) ;
}

/**
  * 整列基準をParentに変更する
*/
async function relativeToParentMenuItem() {
  setAlignBasis(XDAlignBasis.PARENT) ;
}

/**
  * 整列基準をSelectionに変更する
*/
async function relativeToSelectionMenuItem() {
  setAlignBasis(XDAlignBasis.SELECTION) ;
}

/**
  * 整列基準をTextに変更する
*/
async function relativeToTextMenuItem() {
  setAlignBasis(XDAlignBasis.TEXT) ;
}

/**
  * 整列基準をFrontmost itemに変更する
*/
async function relativeToFrontmostItemMenuItem() {
  setAlignBasis(XDAlignBasis.FRONTMOST_ITEM) ;
}

/**
  * 整列基準をBackmost itemに変更する
*/
async function relativeToBackmostItemMenuItem() {
  setAlignBasis(XDAlignBasis.BACKMOST_ITEM) ;
}

/**
  * 整列基準をLast selected itemに変更する
*/
async function relativeToLastSelectedItemMenuItem() {
  setAlignBasis(XDAlignBasis.LAST_SELECTED_ITEM) ;
}

/**
  * 整列基準を指定する
  * @param {String} targetBasis relative to (XDAlignBasis.PARENT | XDAlignBasis.SELECTION | XDAlignBasis.FRONTMOST_ITEM | XDAlignBasis.BACKMOST_ITEM | XDAlignBasis.LAST_SELECTED_ITEM)
  * @return {}
*/
async function setAlignBasis(targetBasis) {
  const settings = await readSettings() ;

  // ファイルに保存する
  settings.basis = targetBasis ;
  await saveSettings(settings) ;
}

/**
  * 環境設定をファイルに保存する
  * @param {Object} obj JSONをパースした状態のオブジェクト
  * @return {}
*/
async function saveSettings(obj) {
  // ファイルに書き込む
  const pluginDataFolder = await fs.localFileSystem.getDataFolder() ;
  const newFile = await pluginDataFolder.createEntry(SettingFileName, {overwrite: true}) ;
  await newFile.write(JSON.stringify(obj, null, 2)) ;
}

/**
  * 環境設定を読み出す
  * @return {Object}
*/
async function readSettings() {
  // 設定ファイルを見つける
  const pluginDataFolder = await fs.localFileSystem.getDataFolder() ;
  const entries = await pluginDataFolder.getEntries() ;
  let aFile ;
  for(const aItem of entries) {
    if(aItem.name == SettingFileName) {
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
    res = {
      "syncMultipleItems": false,
      "basis": XDAlignBasis.LAST_SELECTED_ITEM,
      "distributeOffset": 0
    } ;
    await saveSettings(res) ;
  } 
  
  return res ;
}

/**
  * パネルを生成する
  * @return {Element}
*/
function create() {
  const html = `
<link rel="stylesheet" href="ui/style.css" />

<form method="dialog" id="main">
	<div class="variables">
		<label class="dropdownGroup"><span>Relative to</span>
			<select id="relativeTo" title="Align/Distribute Basis">
				<option value="${XDAlignBasis.PARENT}" selected>${XDAlignBasis.PARENT}</option>
				<option value="${XDAlignBasis.SELECTION}">${XDAlignBasis.SELECTION}</option>
				<option value="${XDAlignBasis.TEXT}">${XDAlignBasis.TEXT}</option>
				<option value="${XDAlignBasis.FRONTMOST_ITEM}">${XDAlignBasis.FRONTMOST_ITEM}</option>
				<option value="${XDAlignBasis.BACKMOST_ITEM}">${XDAlignBasis.BACKMOST_ITEM}</option>
				<option value="${XDAlignBasis.LAST_SELECTED_ITEM}">${XDAlignBasis.LAST_SELECTED_ITEM}</option>
			</select>
      <span id="basisIconGroup">
        <img id="${XDAlignBasis.PARENT}" class="basisIcon" src="ui/icon-basis-parent.svg"></img>
        <img id="${XDAlignBasis.SELECTION}" class="basisIcon" src="ui/icon-basis-selection.svg"></img>
        <img id="${XDAlignBasis.TEXT}" class="basisIcon" src="ui/icon-basis-text.svg"></img>
        <img id="${XDAlignBasis.FRONTMOST_ITEM}" class="basisIcon" src="ui/icon-basis-frontmost.svg"></img>
        <img id="${XDAlignBasis.BACKMOST_ITEM}" class="basisIcon" src="ui/icon-basis-backmost.svg"></img>
        <img id="${XDAlignBasis.LAST_SELECTED_ITEM}" class="basisIcon" src="ui/icon-basis-last_selected.svg"></img>
      </span>
		</label>
	</div>
	
	<hr>
<div id="align">
	<h2 class="panelH2">ALIGN</h2>
	<div class="container">
		<label class="checkboxGroup">
			<input type="checkbox" id="sync" title="Sync Multiple Items ON/OFF"><span>Sync multiple items</span>
		</label>
		<div class="alignButtonArea">
			<div class="buttonGroup hori">
				<button class="panelButton" id="${XDAlignOptions.LEFT_EDGES}" title="${XDAlignLabels[XDAlignOptions.LEFT_EDGES]}"><img src="ui/icon-align-l.png" alt="L" /></button>
				<button class="panelButton" class="panelButton" id="${XDAlignOptions.HORIZONTAL_CENTERS}" title="${XDAlignLabels[XDAlignOptions.HORIZONTAL_CENTERS]}"><img src="ui/icon-align-h.png" alt="H" /></button>
				<button class="panelButton" id="${XDAlignOptions.RIGHT_EDGES}" title="${XDAlignLabels[XDAlignOptions.RIGHT_EDGES]}"><img src="ui/icon-align-r.png" alt="R" /></button>
			</div>
			<div class="buttonSet">	
				<div class="buttonGroup nine">
					<button class="panelButton" id="${XDAlignOptions.TOP_LEFT}" title="${XDAlignLabels[XDAlignOptions.TOP_LEFT]}"><img src="ui/icon-align-tl.png" alt="TL" /></button>
					<button class="panelButton" id="${XDAlignOptions.TOP_MIDDLE}" title="${XDAlignLabels[XDAlignOptions.TOP_MIDDLE]}"><img src="ui/icon-align-tm.png" alt="TM" /></button>
					<button class="panelButton" id="${XDAlignOptions.TOP_RIGHT}" title="${XDAlignLabels[XDAlignOptions.TOP_RIGHT]}"><img src="ui/icon-align-tr.png" alt="TR" /></button>
					
					<button class="panelButton" id="${XDAlignOptions.MIDDLE_LEFT}" title="${XDAlignLabels[XDAlignOptions.MIDDLE_LEFT]}"><img src="ui/icon-align-ml.png" alt="ML" /></button>
					<button class="panelButton" id="${XDAlignOptions.CENTER}" title="${XDAlignLabels[XDAlignOptions.CENTER]}"><img src="ui/icon-align-c.png" alt="C" /></button>
					<button class="panelButton" id="${XDAlignOptions.MIDDLE_RIGHT}" title="${XDAlignLabels[XDAlignOptions.MIDDLE_RIGHT]}"><img src="ui/icon-align-mr.png" alt="MR" /></button>
					
					<button class="panelButton" id="${XDAlignOptions.BOTTOM_LEFT}" title="${XDAlignLabels[XDAlignOptions.BOTTOM_LEFT]}"><img src="ui/icon-align-bl.png" alt="BL" /></button>
					<button class="panelButton" id="${XDAlignOptions.BOTTOM_MIDDLE}" title="${XDAlignLabels[XDAlignOptions.BOTTOM_MIDDLE]}"><img src="ui/icon-align-bm.png" alt="BM" /></button>
					<button class="panelButton" id="${XDAlignOptions.BOTTOM_RIGHT}" title="${XDAlignLabels[XDAlignOptions.BOTTOM_RIGHT]}"><img src="ui/icon-align-br.png" alt="BR" /></button>
				</div>
				<div class="buttonGroup vert">
					<button class="panelButton" id="${XDAlignOptions.TOP_EDGES}" title="${XDAlignLabels[XDAlignOptions.TOP_EDGES]}"><img src="ui/icon-align-t.png" alt="T" /></button>
					<button class="panelButton" id="${XDAlignOptions.VERTICAL_CENTERS}" title="${XDAlignLabels[XDAlignOptions.VERTICAL_CENTERS]}"><img src="ui/icon-align-v.png" alt="V" /></button>
					<button class="panelButton" id="${XDAlignOptions.BOTTOM_EDGES}" title="${XDAlignLabels[XDAlignOptions.BOTTOM_EDGES]}"><img src="ui/icon-align-b.png" alt="B" /></button>
				</div>
			</div>
		</div>
	</div><!-- .container -->
</div>	
	<hr>
<div id="distribute">	
	<h2 class="panelH2">DISTRIBUTE</h2>
		<div class="container">
			<label><span>Offset</span>
				<input title="Distribute Offset" type="text" uxp-quiet="false" id="distributeOffset" placeholder="0" />
			</label>
			<div class="distributeButtonArea">
				<div class="buttonSet">	
				<div class="buttonGroup hori">
						<button class="panelButton" id="${XDDistributeOptions.LEFT_EDGES}" title="${XDAlignLabels[XDDistributeOptions.LEFT_EDGES]}"><img src="ui/icon-distribute-l.png" alt="L" /></button>
						<button class="panelButton" id="${XDDistributeOptions.HORIZONTAL_CENTERS}" title="${XDAlignLabels[XDDistributeOptions.HORIZONTAL_CENTERS]}"><img src="ui/icon-distribute-h.png" alt="H" /></button>
						<button class="panelButton" id="${XDDistributeOptions.RIGHT_EDGES}" title="${XDAlignLabels[XDDistributeOptions.RIGHT_EDGES]}"><img src="ui/icon-distribute-r.png" alt="R" /></button>
					</div>
					<div class="buttonGroup hori">
						<button class="panelButton" id="${XDDistributeOptions.TOP_EDGES}" title="${XDAlignLabels[XDDistributeOptions.TOP_EDGES]}"><img src="ui/icon-distribute-t.png" alt="T" /></button>
						<button class="panelButton" id="${XDDistributeOptions.VERTICAL_CENTERS}" title="${XDAlignLabels[XDDistributeOptions.VERTICAL_CENTERS]}"><img src="ui/icon-distribute-v.png" alt="V" /></button>
						<button class="panelButton" id="${XDDistributeOptions.BOTTOM_EDGES}" title="${XDAlignLabels[XDDistributeOptions.BOTTOM_EDGES]}"><img src="ui/icon-distribute-b.png" alt="B" /></button>
					</div>
				</div>
				<div class="buttonGroup hori">
					<button class="panelButton" id="${XDDistributeOptions.HORIZONTAL_SPACE}" title="${XDAlignLabels[XDDistributeOptions.HORIZONTAL_SPACE]}"><img src="ui/icon-distribute-hs.png" alt="HS" /></button>
					<button class="panelButton" id="${XDDistributeOptions.VERTICAL_SPACE}" title="${XDAlignLabels[XDDistributeOptions.VERTICAL_SPACE]}"><img src="ui/icon-distribute-vs.png" alt="VS" /></button>
				</div>
			</div>
		</div>
	</div>
</div>
	<hr>
<div id="currentKeyObject">
	<h2 class="panelH2">CURRENT KEY OBJECT</h2>
	<div class="container">
		<div id="placeHolder" class="preview">
			<img id="keyObjectPreview" src="ui/icon-key_object-nothing.png" />
		</div>
	</div>
</form>
`;

  panel = document.createElement('div') ;
  panel.innerHTML = html ;

  // Relative to(整列基準)変更
  panel.querySelector('#relativeTo').addEventListener('change', async () => {
    const settings = await readSettings() ;
    const targetBasis = document.querySelector('#relativeTo').value ;
    settings.basis = targetBasis ;
    updateBasisIcon(settings) ;
    updateKeyObjectPreview(settings) ;
    //console.log(settings.basis) ;
    await saveSettings(settings) ;
  }) ;

  // Sync multiple items切り替え
  panel.querySelector('#sync').addEventListener('change', async () => {
    const settings = await readSettings() ;
    const syncChecked = document.querySelector('#sync').checked ;
    settings.syncMultipleItems = syncChecked ;
    //console.log(settings.syncMultipleItems) ;
    await saveSettings(settings) ;
  }) ;

  /* 
    Distribute offsetを環境設定に記録する。
    changeだけだと数値を確定する前に整列ボタンを押したとき，その数値通りに分布できない。
    そのためinputで1文字ごとに値を一時記録しておく
  */
  const inputOffset = panel.querySelector('#distributeOffset') ;
  inputOffset.addEventListener('change', async () => {
    const settings = await readSettings() ;
    const offset = asNumber(inputOffset.value) ;
    inputOffset.value = offset ;
    settings.distributeOffset = offset ;
    //console.log(settings.distributeOffset) ;
    await saveSettings(settings) ;
  }) ;
  inputOffset.addEventListener('input', () => {
    distributeOffsetValue = inputOffset.value ;
  }) ;

  // 整列・分布実行ボタン
  panel.querySelectorAll('button.panelButton').forEach((aButton) => {
    aButton.addEventListener('click', () => {
      app.editDocument({editLabel: XDAlignLabels[aButton.id]}, () => {
        return handleAlignMenu(aButton.id) ;
      }) ;
    }) ;
  }) ;

  return panel ;
}

/**
  * 文字列を数値に変換する。全角数値などいくつかの文字は半角に変換し，余計な文字は削除する。それでもNaNになったら0を返す
  * @param {String} str 対象の文字列
  * @return {Number} 
*/
function asNumber(str) {
  // 全角数字を半角に
  let tempStr = str.replace(/[０-９]/g, function(s) {return String.fromCharCode(s.charCodeAt(0) - 0xFEE0)}) ;

  // テキストを洗浄する
  const replaceList = [
    [/ー/g, '-'], 
    [/[。．]+/g, '.'], 
    [/[^0-9.-]+/g, '']
  ] ;
  replaceList.forEach((aItem) => {
    if(aItem[0].test(tempStr)) {
      tempStr = tempStr.replace(aItem[0], aItem[1]) ;
    }
  }) ;

  // 数値に変換する
  let res = Number(tempStr) ;
  if(isNaN(res)) {res = 0 ;}
  return res ;
}

/**
  * パネルを表示する
*/
function show(event) {
  if (!panel) event.node.appendChild(create()) ;
}

/**
  * パネルを隠す
*/
function hide(event) {}

/**
  * パネルを更新する
*/
async function update() {
  const settings = await readSettings() ;

  // Relative to
  const targetBasis = settings.basis ;
  const elementBasis = document.querySelector('#relativeTo') ;
  elementBasis.value = targetBasis ;

  // Sync multiple items
  const syncChecked = settings.syncMultipleItems ;
  const elementSync = document.querySelector('#sync') ;
  elementSync.checked = syncChecked ;

  // Offset
  const offset = settings.distributeOffset ;
  const elementOffset = document.querySelector('#distributeOffset') ;
  elementOffset.value = offset ;
  
  try {
    updateBasisIcon(settings) ;
    updateKeyObjectPreview(settings) ;
  } catch(e) {
    console.log(e) ;
  }
}

/**
  * Relative toのアイコンを切り替える
  * @param {Object} settings 現在の整列設定
  * @return {}
*/
function updateBasisIcon(settings) {
  document.querySelectorAll('img.basisIcon').forEach((aImg) => {
    let displayValue = 'none' ;
    if(aImg.id == settings.basis) {displayValue = 'block' ;}
    aImg.style.display = displayValue ;
  }) ;
}

/**
  * CURRENT KEY OBJECTの表示を更新する
  * @param {Object} settings 現在の整列設定
  * @return {}
*/
function updateKeyObjectPreview(settings) {
  const iconBoundingBox = 'ui/icon-key_object-bounding_box.png' ;
  const iconNothing = 'ui/icon-key_object-nothing.png' ;
  const targetLength = selection.items.length ;

  const placeHolder = document.querySelector('#placeHolder') ;
  while(placeHolder.firstChild) {
    placeHolder.removeChild(placeHolder.firstChild) ;
  }

  // キーオブジェクトを取得する。Relative toがTextなのにTextを選択していないときエラー
  let keyObj ;
  try {
    keyObj = getKeyObject(settings.basis) ;
  } catch(e) {
    keyObj = null ;
  }
  
  // 選択なしの場合必ずiconNothingを表示する
  if(targetLength == 0) {
    showKeyObjectIcon(placeHolder, iconNothing) ;
    return ;
  }

  // XDAlignBasis.PARENTの動作。選択状態によってたびたび呼び出すため定義
  const showParentPreview = () => {
    const keyObj = getKeyObject(XDAlignBasis.PARENT) ;
      if(keyObj) {
        showKeyObjectPreview(keyObj, placeHolder) ;
      } else {
        showKeyObjectIcon(placeHolder, iconNothing) ;
      }
  } ;
  
  // キーオブジェクトのプレビューを表示する
  // このへんの判定はgetKeyObjectとalignでも似たようなことをしているので，本当は1つにまとめたい
  switch(settings.basis) {
    case XDAlignBasis.PARENT :
      if((keyObj == null) || (keyObj && selection.hasArtboards)) {
        if(targetLength == 1) {
          showKeyObjectIcon(placeHolder, iconNothing) ;
        } else {
          // アートボードまたはペーストボードのアイテムだけを選択している場合，XDAlignBasis.SELECTIONと同じ動作
          showKeyObjectIcon(placeHolder, iconBoundingBox) ;
        }
      } else {
        showKeyObjectPreview(keyObj, placeHolder) ;
      }
      break ;
    case XDAlignBasis.SELECTION :
      if((selection.hasArtwork) && (targetLength == 1 || settings.syncMultipleItems)) {
        // 選択がアートボードでない，かつ選択が1つまたはsyncがONの場合，XDAlignBasis.PARENTと同じ動作
        showParentPreview() ;
      } else if((selection.hasArtboards) && (targetLength == 1)) {
        // 選択がアートボードかつ個数が1つの場合，特に何もしない
        showKeyObjectIcon(placeHolder, iconNothing) ;
      } else {
        showKeyObjectIcon(placeHolder, iconBoundingBox) ;
      }
      break ;
    case XDAlignBasis.TEXT :
      if(!keyObj) {
        showKeyObjectIcon(placeHolder, iconNothing) ;
        break ;
      } 
    case XDAlignBasis.FRONTMOST_ITEM :
    case XDAlignBasis.BACKMOST_ITEM :
    case XDAlignBasis.LAST_SELECTED_ITEM :
      if(settings.syncMultipleItems) {
        if(selection.hasArtwork && targetLength <= 2) {
          // 選択がアートボードでなく数が2つまでの場合，XDAlignBasis.PARENTと同じ動作
          showParentPreview() ;
        } else {
          showKeyObjectPreview(keyObj, placeHolder) ;
        }
      } else {
        if(selection.hasArtwork && targetLength == 1) {
          // 選択がアートボードでなく数が1つの場合，XDAlignBasis.PARENTと同じ動作
          showParentPreview() ;
        } else {
          showKeyObjectPreview(keyObj, placeHolder) ;
        }
      }
      break ;
  }
}

/**
  * CURRENT KEY OBJECTのプレビューをパネルに表示する
  * @param {Scenenode} targetItem 対象のアイテム（キーオブジェクト）
  * @param {Element} placeHolder 画像を表示する場所のelement
  * @return {}
*/
async function showKeyObjectPreview(targetItem, placeHolder) {
  // ファイルがなければ作る
  const tempFolder = await fs.localFileSystem.getTemporaryFolder() ;
  const newFile = await tempFolder.createFile(PreviewFileName, {overwrite: true}) ;

  // png書き出し設定
  const bounds = targetItem[XDBoundsType.GLOBAL_DRAW_BOUNDS] ;
  let imgScale = Math.min(100 / bounds.width, 56 / bounds.height) ;
  if(imgScale > 1) {imgScale = 1 ;}
  const renditions = [{
    node: targetItem,
    outputFile: newFile,
    type: 'png',
    scale: imgScale
  }] ;
  
  try {
    // 実際に保存する
    const renditionsFiles = await app.createRenditions(renditions) ;

    // 保存した画像をbase64にし，パネルに表示する
    renditionsFiles.forEach(async (aFile) => {
      const arrayBuffer = await aFile.outputFile.read({format: fs.formats.binary}) ;
      const base64 = base64ArrayBuffer(arrayBuffer) ;
      const img = document.createElement('img') ;
      img.setAttribute('src', `data:image/png;base64,${base64}`) ;
      placeHolder.appendChild(img) ;
    }) ;
  } catch(e) {
    console.log(e) ;
  }
}

/**
  * CURRENT KEY OBJECTの静的アイコンを表示する
  * @param {Element} placeHolder アイコンを表示する部分のdivタグ
  * @param {String} iconPath 表示するアイコンのパス
  * @return {}
*/
function showKeyObjectIcon(placeHolder, iconPath) {
  const img = document.createElement('img') ;
  img.src = iconPath ;
  placeHolder.appendChild(img) ;
}

module.exports = {
  commands: {
    ignore: ignoreMenuItem,

    alignLeftMenuItem: alignLeftMenuItem,
    alignHorizontalCentersMenuItem: alignHorizontalCentersMenuItem,
    alignRightMenuItem: alignRightMenuItem,

    alignTopMenuItem: alignTopMenuItem,
    alignVerticalCentersMenuItem: alignVerticalCentersMenuItem,
    alignBottomMenuItem: alignBottomMenuItem,

    alignTopLeftMenuItem: alignTopLeftMenuItem,
    alignTopMiddleMenuItem: alignTopMiddleMenuItem,
    alignTopRightMenuItem: alignTopRightMenuItem,
    alignMiddleLeftMenuItem: alignMiddleLeftMenuItem,
    alignCenterMenuItem: alignCenterMenuItem,
    alignMiddleRightMenuItem: alignMiddleRightMenuItem,
    alignBottomLeftMenuItem: alignBottomLeftMenuItem,
    alignBottomMiddleMenuItem: alignBottomMiddleMenuItem,
    alignBottomRightMenuItem: alignBottomRightMenuItem,
    
    distributeHorizontalSpaceMenuItem: distributeHorizontalSpaceMenuItem,
    distributeVerticalSpaceMenuItem: distributeVerticalSpaceMenuItem,

    distributeLeftMenuItem: distributeLeftMenuItem,
    distributeHorizontalCentersMenuItem: distributeHorizontalCentersMenuItem,
    distributeRightMenuItem: distributeRightMenuItem,

    distributeTopMenuItem: distributeTopMenuItem,
    distributeVerticalCentersMenuItem: distributeVerticalCentersMenuItem,
    distributeBottomMenuItem: distributeBottomMenuItem,

    relativeToParentMenuItem: relativeToParentMenuItem,
    relativeToSelectionMenuItem: relativeToSelectionMenuItem,
    relativeToTextMenuItem: relativeToTextMenuItem,
    relativeToFrontmostItemMenuItem: relativeToFrontmostItemMenuItem,
    relativeToBackmostItemMenuItem: relativeToBackmostItemMenuItem,
    relativeToLastSelectedItemMenuItem: relativeToLastSelectedItemMenuItem,
    
    toggleSyncMenuItem: toggleSyncMenuItem,
    setDistributeOffsetMenuItem: setDistributeOffsetMenuItem
  }, 
  panels: {
    showPanel: {
      show,
      hide,
      update
    }
  }
} ;