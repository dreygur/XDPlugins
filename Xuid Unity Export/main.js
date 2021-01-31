/**
 * 良いCSSとは - Qiita
 * https://qiita.com/horikowa/items/7e6eb7c4bbb422241d9d
 *
 * CSSテストサイト
 * https://www.w3schools.com/css/tryit.asp?filename=trycss_sel_attribute_end
 * https://codepen.io/pen/
 */
// XD拡張APIのクラスをインポート
const {
  Artboard,
  Color,
  ImageFill,
  Rectangle,
  GraphicNode,
  SceneNode,
  ScrollableGroup,
  SymbolInstance,
  root,
  selection,
} = require('scenegraph')
const scenegraph = require('scenegraph')
const application = require('application')
const fs = require('uxp').storage.localFileSystem
const commands = require('commands')
const strings = require('./strings.json')

// 全体にかけるスケール
let globalScale = 1.0

//
/**
 * 出力するフォルダ
 * @type {Folder|null}
 */
let globalOutputFolder = null

let globalAddtionalCssFolder = null

// エキスポートフラグを見るかどうか
let globalCheckMarkedForExport = false

// 画像を出力するかどうか
let globalFlagImageNoExport = false

// コンテンツの変更のみかどうか
let globalFlagChangeContentOnly = false

// SymbolInstanceをPrefabにするかどうか
let globalFlagSymbolInstanceAsPrefab = false

// 初期状態の可視情報
// globalVisibleInfo[node.guid]
let globalVisibleInfo = null

// コンバートファイル依存関係
let globalOutputFileDependency = {}

/**
 * レスポンシブパラメータを保存する
 * @type {BoundsToRectTransform[]}
 */
let globalResponsiveBounds = null

/**
 * @type {{selector:CssSelector, declarations:CssDeclarations, at_rule:string }[]}
 */
let globalCssRules = null

let globalCssVars = {}

let globalErrorLog = []

let cacheParseNodeName = {}

let cacheNodeNameAndStyle = {}

/**
 * グローバル変数をリセットする 再コンバートに必要なものだけのリセット
 * Rootをコンバートする前にリセットする
 */
function resetGlobalVariables() {
  globalVisibleInfo = {}
  globalResponsiveBounds = {}
  globalCssRules = null
  globalCssVars = {}
  cacheParseNodeName = {}
  cacheNodeNameAndStyle = {}
  // こちらの値はRootをまたいで必要になる情報のためリセットしない
  // globalSymbolIdToPrefabGuid = {}
  // globalErrorLog = []
  // globalExternalCssFolder = null
}

const STR_CONTENT = 'content'
const STR_VERTICAL = 'vertical'
const STR_HORIZONTAL = 'horizontal'
const STR_PREFERRED = 'preferred'
const STR_GRID = 'grid'

// オプション文字列　全て小文字 数字を含まない
// OPTION名に H V　X Yといった、高さ方向をしめすものはできるだけ出さないようにする
const STYLE_ALIGN = 'align' // テキストの縦横のアライメントの設定が可能　XDの設定に上書き
const STYLE_BLANK = 'blank'
const STYLE_BUTTON = 'button'
const STYLE_BUTTON_TRANSITION = 'button-transition'
const STYLE_BUTTON_TRANSITION_TARGET_GRAPHIC =
  'button-transition-target-graphic'
const STYLE_BUTTON_TRANSITION_HIGHLIGHTED_SPRITE =
  'button-transition-highlighted-sprite'
const STYLE_BUTTON_TRANSITION_PRESSED_SPRITE =
  'button-transition-pressed-sprite'
const STYLE_BUTTON_TRANSITION_SELECTED_SPRITE =
  'button-transition-selected-sprite'
const STYLE_BUTTON_TRANSITION_DISABLED_SPRITE =
  'button-transition-disabled-sprite'
const STYLE_CANVAS_GROUP = 'canvas-group' // 削除予定
const STYLE_COMMENT_OUT = 'comment-out'
const STYLE_COMPONENT = 'component'
const STYLE_CONTENT_SIZE_FITTER = 'content-size-fitter' //自身のSizeFitterオプション
const STYLE_CONTENT_SIZE_FITTER_HORIZONTAL_FIT =
  'content-size-fitter-horizontal-fit'
const STYLE_CONTENT_SIZE_FITTER_VERTICAL_FIT =
  'content-size-fitter-vertical-fit'
const STYLE_FIX = 'fix'
const STYLE_IMAGE = 'image'
const STYLE_IMAGE_SCALE = 'image-scale'
const STYLE_IMAGE_SLICE = 'image-slice' // 9スライス ドット数を指定する
const STYLE_IMAGE_TYPE = 'image-type' // sliced/tiled/simple/filled
const STYLE_IMAGE_FIT_PARENT_BOUNDS = 'image-fit-parent-bounds' // 親と同じ大きさで画像を作成する
const STYLE_LAYER = 'layer'
const STYLE_LAYOUT_ELEMENT = 'layout-element'
const STYLE_LAYOUT_ELEMENT_IGNORE_LAYOUT = 'layout-element-ignore-layout'
const STYLE_LAYOUT_ELEMENT_PREFERRED_WIDTH = 'layout-element-preferred-width'
const STYLE_LAYOUT_ELEMENT_PREFERRED_HEIGHT = 'layout-element-preferred-height'
const STYLE_LAYOUT_GROUP = 'layout-group' //子供を自動的にどうならべるかのオプション
const STYLE_LAYOUT_GROUP_CHILD_ALIGNMENT = 'layout-group-child-alignment'
const STYLE_LAYOUT_GROUP_CHILD_FORCE_EXPAND = 'layout-group-child-force-expand'
const STYLE_LAYOUT_GROUP_CHILD_CONTROL_SIZE = 'layout-group-child-control-size'
const STYLE_LAYOUT_GROUP_SPACING_X = 'layout-group-spacing-x'
const STYLE_LAYOUT_GROUP_SPACING_Y = 'layout-group-spacing-y'
const STYLE_LAYOUT_GROUP_CELL_SIZE_X = 'layout-group-cell-size-x'
const STYLE_LAYOUT_GROUP_CELL_SIZE_Y = 'layout-group-cell-size-y'
const STYLE_LAYOUT_GROUP_START_AXIS = 'layout-group-start-axis'
const STYLE_LAYOUT_GROUP_USE_CHILD_SCALE = 'layout-group-use-child-scale'
const STYLE_LAYOUT_GROUP_CHILDREN_ORDER = 'layout-group-children-order'
const STYLE_MATCH_LOG = 'match-log'
const STYLE_PRESERVE_ASPECT = 'preserve-aspect'
const STYLE_LOCK_ASPECT = 'lock-aspect' // preserve-aspectと同じ動作にする　アスペクト比を維持する
const STYLE_RAYCAST_TARGET = 'raycast-target' // 削除予定
const STYLE_RECT_MASK_2D = 'rect-mask-twod'
const STYLE_RECT_TRANSFORM_ANCHORS_OFFSETS_X =
  'rect-transform-anchors-offsets-x' // offset-min offset-max anchors-min anchors-maxの順
const STYLE_RECT_TRANSFORM_ANCHORS_OFFSETS_Y =
  'rect-transform-anchors-offsets-y' // offset-min offset-max anchors-min anchors-maxの順
const STYLE_RECT_TRANSFORM_ANCHORS_X = 'rect-transform-anchors-x' // anchors-min anchors-maxの順
const STYLE_RECT_TRANSFORM_ANCHORS_Y = 'rect-transform-anchors-y' // anchors-min anchors-maxの順
const STYLE_REPEATGRID_ATTACH_TEXT_DATA_SERIES =
  'repeatgrid-attach-text-data-series'
const STYLE_REPEATGRID_ATTACH_IMAGE_DATA_SERIES =
  'repeatgrid-attach-image-data-series'
const STYLE_SCROLLBAR = 'scrollbar'
const STYLE_SCROLLBAR_DIRECTION = 'scrollbar-direction'
const STYLE_SCROLLBAR_HANDLE_TARGET = 'scrollbar-handle-target'
const STYLE_SCROLL_RECT = 'scroll-rect'
const STYLE_SCROLL_RECT_CONTENT = 'scroll-rect-content'
const STYLE_SCROLL_RECT_HORIZONTAL = 'scroll-rect-horizontal'
const STYLE_SCROLL_RECT_VERTICAL = 'scroll-rect-vertical'
const STYLE_SCROLL_RECT_HORIZONTAL_SCROLLBAR =
  'scroll-rect-horizontal-scrollbar'
const STYLE_SCROLL_RECT_VERTICAL_SCROLLBAR = 'scroll-rect-vertical-scrollbar'
const STYLE_SLIDER = 'slider'
const STYLE_SLIDER_DIRECTION = 'slider-direction'
const STYLE_SLIDER_FILL_RECT_TARGET = 'slider-fill-rect-target'
const STYLE_SLIDER_HANDLE_RECT_TARGET = 'slider-handle-rect-target'
const STYLE_TEXT = 'text'
const STYLE_TEXTMP = 'textmp' // TextMeshPro
const STYLE_TEXT_SET_TEXT = 'text-set-text'
const STYLE_TOGGLE = 'toggle'
const STYLE_TOGGLE_TRANSITION = 'toggle-transition'
const STYLE_TOGGLE_TRANSITION_TARGET_GRAPHIC =
  'toggle-transition-target-graphic'
const STYLE_TOGGLE_TRANSITION_HIGHLIGHTED_SPRITE =
  'toggle-transition-highlighted-sprite'
const STYLE_TOGGLE_TRANSITION_PRESSED_SPRITE =
  'toggle-transition-pressed-sprite'
const STYLE_TOGGLE_TRANSITION_SELECTED_SPRITE =
  'toggle-transition-selected-sprite'
const STYLE_TOGGLE_TRANSITION_DISABLED_SPRITE =
  'toggle-transition-disabled-sprite'
const STYLE_TOGGLE_ON_GRAPHIC = 'toggle-on-graphic'
const STYLE_TOGGLE_GRAPHIC_SWAP = 'toggle-graphic-swap' // on/off でイメージを変更する
const STYLE_TOGGLE_GROUP = 'toggle-group'
const STYLE_INPUT = 'input'
const STYLE_INPUT_TRANSITION = 'input-transition'
const STYLE_INPUT_GRAPHIC_NAME = 'input-graphic-target'
const STYLE_INPUT_TARGET_GRAPHIC_NAME = 'input-transition-target-graphic-target'
const STYLE_INPUT_TRANSITION_HIGHLIGHTED_SPRITE_TARGET =
  'input-transition-highlighted-sprite-target'
const STYLE_INPUT_TRANSITION_PRESSED_SPRITE_TARGET =
  'input-transition-pressed-sprite-target'
const STYLE_INPUT_TRANSITION_SELECTED_SPRITE_TARGET =
  'input-transition-selected-sprite-target'
const STYLE_INPUT_TRANSITION_DISABLED_SPRITE_TARGET =
  'input-transition-disabled-sprite-target'
const STYLE_INPUT_TEXT_TARGET = 'input-text-target'
const STYLE_INPUT_PLACEHOLDER_TARGET = 'input-placeholder-target'
const STYLE_CREATE_CONTENT = 'create-content'
const STYLE_CREATE_CONTENT_BOUNDS = 'create-content-bounds'
const STYLE_CREATE_CONTENT_NAME = 'create-content-name'
const STYLE_V_ALIGN = 'v-align' //テキストの縦方向のアライメント XDの設定に追記される
const STYLE_ADD_COMPONENT = 'add-component'
const STYLE_MASK = 'mask'
const STYLE_SHOW_MASK_GRAPHIC = 'mask-show-mask-graphic'
const STYLE_UNITY_NAME = 'unity-name'
const STYLE_CHECK_LOG = 'check-log'
const STYLE_INSTANCE_IF_POSSIBLE = 'instance-if-possible'
const STYLE_WRAP_VERTICAL_ITEM = 'wrap-vertical-item'
const STYLE_WRAP_HORIZONTAL_ITEM = 'wrap-horizontal-item'
const STYLE_WRAP_MOVE_LAYOUT_ELEMENT = 'wrap-move-layout-element'

const appLanguage = application.appLanguage

//const appLanguage = 'en'

/**
 *
 * @returns {string}
 */
function getString(multiLangStr) {
  /**
   * @type {string[]}
   */
  if (!multiLangStr) {
    return 'no text(strings.json problem)'
  }
  let str = multiLangStr[appLanguage]
  if (str) return str
  // 英語にフォールする
  str = multiLangStr['en']
  if (str) return str
  // 日本語にフォールする
  str = multiLangStr['ja']
  if (str) return str
  return 'no text(strings.json problem)'
}

/**
 * @param {Folder} currentFolder
 * @param {string} filename
 * @return {Promise<{selector: CssSelector, declarations: CssDeclarations, at_rule: string}[]>}
 */
async function loadCssRules(currentFolder, filename) {
  if (!currentFolder) return null
  // console.log(`${filename}の読み込みを開始します`)
  let file
  try {
    file = await currentFolder.getEntry(filename)
  } catch (e) {
    // console.log(`${currentFolder.nativePath}/${filename}が読み込めません`)
    return null
  }
  const contents = await file.read()
  let parsed = parseCss(contents)
  for (let parsedElement of parsed) {
    const atRule = parsedElement.at_rule
    if (atRule) {
      const importTokenizer = /\s*@import\s*url\("(?<file_name>.*)"\);/
      let token = importTokenizer.exec(atRule)
      const importFileName = token.groups.file_name
      if (importFileName) {
        const p = await loadCssRules(currentFolder, importFileName)
        //TODO: 接続する位置とループ対策
        parsed = parsed.concat(p)
      }
    }
  }
  // console.log(`${file.name} loaded.`)
  return parsed
}

/**
 * cssRules内、　:root にある --ではじまる変数定期を抽出する
 * @param  {{selector:CssSelector, declarations:CssDeclarations, at_rule:string }[]} cssRules
 */
function createCssVars(cssRules) {
  const vars = {}
  for (let cssRule of cssRules) {
    if (cssRule.selector && cssRule.selector.isRoot()) {
      // console.log("root:をみつけました")
      const properties = cssRule.declarations.properties()
      for (let property of properties) {
        if (property.startsWith('--')) {
          const values = cssRule.declarations.values(property)
          // console.log(`変数${property}=${values}`)
          vars[property] = values[0]
        }
      }
    }
  }
  return vars
}

/**
 * CSS Parser
 * ruleブロック selectorとdeclaration部に分ける
 * 正規表現テスト https://regex101.com/r/QIifBs/
 * @param {string} text
 * @param errorThrow
 * @return {{selector:CssSelector, declarations:CssDeclarations, at_rule:string }[]}
 */
function parseCss(text, errorThrow = true) {
  // コメントアウト処理 エラー時に行数を表示するため、コメント内の改行を残す
  //TODO: 文字列内の /* */について正しく処理できない
  text = text.replace(/\/\*[\s\S]*?\*\//g, str => {
    let replace = ''
    for (let c of str) {
      if (c === '\n') replace += c
    }
    return replace
  })
  // declaration部がなくてもSelectorだけで取得できるようにする　NodeNameのパースに使うため
  // const tokenizer = /(?<at_rule>\s*@[^;]+;\s*)|((?<selector>(("([^"\\]|\\.)*")|[^{"]+)+)({(?<decl_block>(("([^"\\]|\\.)*")|[^}"]*)*)}\s*)?)/gi
  // シングルクオーテーション
  const tokenizer = /(?<at_rule>\s*@[^;]+;\s*)|((?<selector>(('([^'\\]|\\.)*')|[^{']+)+)({(?<decl_block>(('([^'\\]|\\.)*')|[^}']*)*)}\s*)?)/gi
  const rules = []
  let token
  while ((token = tokenizer.exec(text))) {
    try {
      const tokenAtRule = token.groups.at_rule
      const tokenSelector = token.groups.selector
      const tokenDeclBlock = token.groups.decl_block
      if (tokenAtRule) {
        rules.push({ at_rule: tokenAtRule })
      } else if (tokenSelector) {
        const selector = new CssSelector(tokenSelector)
        let declarations = null
        if (tokenDeclBlock) {
          declarations = new CssDeclarations(tokenDeclBlock)
        }
        rules.push({
          selector,
          declarations,
        })
      }
    } catch (e) {
      if (errorThrow) {
        // エラー行の算出
        const parsedText = text.substr(0, token.index) // エラーの起きた文字列までを抜き出す
        const lines = parsedText.split(/\n/)
        //const errorIndex = text.indexOf()
        //const errorLastIndex = text.lastIndexOf("\n",token.index)
        const errorLine = text.substring(token.index - 30, token.index + 30)
        const errorText =
          `CSSのパースに失敗した: ${lines.length}行目:${errorLine}\n` +
          e.message
        console.log(errorText)
        // console.log(e.stack)
        // console.log(text)
        throw errorText
      }
    }
  }
  return rules
}

class CssDeclarations {
  /**
   * @param {null|string} declarationBlock
   */
  constructor(declarationBlock = null) {
    /**
     * @type {string[][]}
     */
    if (declarationBlock) {
      this.declarations = parseCssDeclarationBlock(declarationBlock)
    } else {
      this.declarations = {}
    }
  }

  /**
   * @return {string[]}
   */
  properties() {
    return Object.keys(this.declarations)
  }

  /**
   * @param property
   * @return {string[]}
   */
  values(property) {
    return this.declarations[property]
  }

  /**
   * @param {string} property
   * @return {*|null}
   */
  first(property) {
    const values = this.values(property)
    if (values == null) return null
    return values[0]
  }

  setFirst(property, value) {
    let values = this.values(property)
    if (!values) {
      values = this.declarations[property] = []
    }
    values[0] = value
  }

  firstAsBool(property) {
    return asBool(this.first(property))
  }

  /**
   * @param property
   * @return {null|boolean}
   */
  firstAsNullOrBool(property) {
    const first = this.first(property)
    if (first === null) return null
    return asBool(first)
  }
}

/**
 * @param {string} declarationBlock
 * @return {string[][]}
 */
function parseCssDeclarationBlock(declarationBlock) {
  declarationBlock = declarationBlock.trim()
  // const tokenizer = /(?<property>[^:";\s]+)\s*:\s*|(?<value>"(?<string>([^"\\]|\\.)*)"|var\([^\)]+\)|[^";:\s]+)/gi
  const tokenizer = /(?<property>[^:';\s]+)\s*:\s*|(?<value>'(?<string>([^'\\]|\\.)*)'|var\([^\)]+\)|[^';:\s]+)/gi
  /** @type {string[][]}　*/
  let values = {}
  /** @type {string[]}　*/
  let currentValues = null
  let token
  while ((token = tokenizer.exec(declarationBlock))) {
    const property = token.groups.property
    if (property) {
      currentValues = []
      values[property] = currentValues
    }
    let value = token.groups.value
    if (value) {
      if (token.groups.string) {
        value = token.groups.string
      }
      if (!currentValues) {
        // Propertyが無いのに値がある場合
        throw 'DeclarationBlockのパースに失敗した'
      }
      currentValues.push(value)
    }
  }
  return values
}

/**
 * folder/name{css-declarations} でパースする
 * 例
 * MainMenu/vertex#scroller.image {fix:t v a}
 * folder:MainMenu id:scroller name:vertex#scroller.image name_without_class:vertex#scroller
 * folderの最後の文字に"/"は付かないようにする
 * @param {string} nodeName
 * @return {{css_declarations: string|null, name: string|null, name_without_class: string|null, folder: string|null}}
 */
function parseNodeName(nodeName) {
  // https://regex101.com/r/MdGDaC/3
  const pattern = /(?<comment_out>\/\/)?((?<folder>[^{]*)\/)?(?<name>[^{\/]*)(?<css_declarations>{.*})?/g
  const r = pattern.exec(nodeName)
  if (r.groups.comment_out) {
    return {}
  }
  let name = r.groups.name ? r.groups.name.trim() : null
  let name_without_class = name
  if (name) {
    // name の中にはクラス名もはいっている
    const firstDotIndex = name.indexOf('.')
    if (firstDotIndex > 0) {
      name_without_class = name.substring(0, firstDotIndex).trim()
    }
  }
  let folder = r.groups.folder ? r.groups.folder.trim() : null
  let css_declarations = r.groups.css_declarations
  return {
    folder,
    name,
    name_without_class,
    css_declarations,
  }
}

function getSubFolderNameFromNode(node) {
  const { folder } = parseNodeName(node.name)
  return folder
}

/**
 * 拡張子なし
 * @param node
 * @return {string}
 */
function getLayoutFileNameFromNode(node) {
  const unityName = getUnityName(node)
  return replaceToFileName(unityName)
}

function getLayoutPathFromNode(node) {
  const masterSubFolderName = getSubFolderNameFromNode(node)
  const masterName =
    (masterSubFolderName ? masterSubFolderName + '/' : '') +
    getLayoutFileNameFromNode(node)

  return masterName
}

/**
 * 自身がインスタンスであり、PrefabになるNodeがいる場合True
 * @param {SymbolInstance} node
 * @return {boolean}
 */
function isPrefabInstanceNode(node) {
  if (!node) return false
  const masterNode = getPrefabNodeFromNode(node)
  return !!masterNode
}

/**
 * Prefabを作成できる条件
 * - Componentのマスターである
 *   - マスターの指定がないと、どれが基準かわからなくなるため
 * - 出力サブフォルダーが指定してある
 * @param {SceneNodeClass} node
 * @return {boolean}
 */
function isPrefabNode(node) {
  if (!node) return false
  if (!node.symbolId || !node.isMaster) return false
  const subFolderName = getSubFolderNameFromNode(node)
  // console.log('subfoldername', subFolderName)
  if (!subFolderName) return false
  return true
}

/**
 * NodeNameをCSSパースする　これによりローカルCSSも取得する
 * WARN: ※ここの戻り値を変更するとキャッシュも変更されてしまう
 * NodeNameとは node.nameのこと
 * tagNameはCSSパースにより取得される名前 2バイト文字は"_"になる
 * // によるコメントアウト処理もここでする
 * folder/name{css-declarations} でパースする
 * @param {string} nodeName
 * @param nodeName
 * @return {{folder:string, classNames:string[], id:string, tagName:string, declarations:CssDeclarations}}
 */
function cssParseNodeName(nodeName) {
  nodeName = nodeName.trim()
  const cache = cacheParseNodeName[nodeName]
  if (cache) {
    return cache
  }
  // コメントアウトチェック
  let result = null
  if (nodeName.startsWith('//')) {
    // コメントアウトのスタイルを追加する
    const declarations = new CssDeclarations()
    declarations.setFirst(STYLE_COMMENT_OUT, true)
    result = { declarations }
  } else {
    // folder/name{css-declarations} でパースする
    let { name, folder, css_declarations, name_without_class } = parseNodeName(
      nodeName,
    )
    if (!name) name = nodeName
    if (!css_declarations) css_declarations = ''
    // console.log(`parseNodeName: folder:${folder} name:${name} css_decl:${r.groups.css_declarations}`)

    try {
      // 名前をできるだけパースできる文字列に変換する
      // そうしないと名前の後ろにつけたローカルCSSの変換ができない
      const asciiName = name
        .replace(/[^\x01-\x7E]/g, function(s) {
          return '_'
        }) // - ascii文字以外(2バイト文字、漢字など) _ に変換
        .replace(/[^0-9a-zA-Z\-\.]/g, '_') // パース出来ない文字を _に変換する
        .replace(/^[^a-zA-Z_\.]/, '_') // 行頭の数字を _に変換する
        .replace(/[ ]/g, '') // - スペースはつめる '.class1 .class2' を '.class1.class2' として、クラスのパースができるようにする
      // console.log(`parseCss(${asciiName})`)

      // name部分とcss-declarationsを結合パースする
      const cssString = (asciiName + css_declarations).trim()
      let rules = parseCss(cssString, false)
      if (cssString.length !== 0 && (!rules || rules.length === 0)) {
        // parse 失敗
        globalErrorLog.push(`waring: css parse error.(${cssString})`)
      }
      if (!rules || rules.length === 0 || !rules[0].selector) {
        // パースできなかった場合はそのまま返す
        result = { folder, name, name_without_class, tagName: nodeName }
      } else {
        // 一番外側の｛｝をはずす ここで tagNameがくる tagNameはasciiNameをパースしてくるものなのでマルチバイト文字が_になる
        result = rules[0].selector.json['rule']
        Object.assign(result, {
          folder,
          name,
          name_without_class,
          declarations: rules[0].declarations,
        })
      }
    } catch (e) {
      console.log(`***exception: parseNodeName(${nodeName})`)
      result = { folder, name, name_without_class, tagName: nodeName }
    }
  }
  cacheParseNodeName[nodeName] = result
  return result
}

class MinMaxSize {
  constructor() {
    this.minWidth = null
    this.minHeight = null
    this.maxWidth = null
    this.maxHeight = null
  }

  addSize(w, h) {
    if (this.minWidth == null || this.minWidth > w) {
      this.minWidth = w
    }
    if (this.maxWidth == null || this.maxWidth < w) {
      this.maxWidth = w
    }
    if (this.minHeight == null || this.minHeight > h) {
      this.minHeight = h
    }
    if (this.maxHeight == null || this.maxHeight < h) {
      this.maxHeight = h
    }
  }
}

class CalcBounds {
  constructor() {
    this.sx = null
    this.sy = null
    this.ex = null
    this.ey = null
  }

  addBoundsParam(x, y, w, h) {
    if (this.sx == null || this.sx > x) {
      this.sx = x
    }
    if (this.sy == null || this.sy > y) {
      this.sy = y
    }
    const ex = x + w
    const ey = y + h
    if (this.ex == null || this.ex < ex) {
      this.ex = ex
    }
    if (this.ey == null || this.ey < ey) {
      this.ey = ey
    }
  }

  /**
   * @param {Bounds} bounds
   */
  addBounds(bounds) {
    this.addBoundsParam(bounds.x, bounds.y, bounds.width, bounds.height)
  }

  /**
   * @returns {Bounds}
   */
  get bounds() {
    return {
      x: this.sx,
      y: this.sy,
      width: this.ex - this.sx,
      height: this.ey - this.sy,
      ex: this.ex,
      ey: this.ey,
    }
  }
}

class GlobalBounds {
  /**
   * @param {SceneNodeClass} node
   */
  constructor(node) {
    if (node == null) return
    this.visible = globalVisibleInfo[node.guid]
    this.global_bounds = getGlobalBounds(node)
    this.global_draw_bounds = getGlobalDrawBounds(node)
    if (hasContentBounds(node)) {
      // Mask（もしくはViewport）をふくむ、含まないで、それぞれのBoundsが必要
      //  マスクありでBoundsが欲しいとき → 全体コンテンツBoundsがほしいとき　とくに、Childrenが大幅にかたよっているときなど
      //  マスク抜きでBoundsが欲しいとき → List内コンテンツのPaddingの計算
      const { style } = getNodeNameAndStyle(node)
      const contents = node.children.filter(child => {
        return isContentChild(child)
      })
      const contentBounds = calcGlobalBounds(contents)
      this.content_global_bounds = contentBounds.global_bounds
      this.content_global_draw_bounds = contentBounds.global_draw_bounds

      const viewport = getViewport(node)
      if (viewport) {
        const viewportContents = contents.concat(viewport)
        const viewportContentsBounds = calcGlobalBounds(viewportContents)
        this.viewport_content_global_bounds =
          viewportContentsBounds.global_bounds
        this.viewport_content_global_draw_bounds =
          viewportContentsBounds.global_draw_bounds
      }
    }
  }
}

class BoundsToRectTransform {
  constructor(node) {
    this.node = node
  }

  updateBeforeBounds() {
    // Before
    this.before = new GlobalBounds(this.node)
  }

  updateAfterBounds() {
    this.after = new GlobalBounds(this.node)

    {
      const beforeX = this.before.global_bounds.x
      const beforeDrawX = this.before.global_draw_bounds.x
      const beforeDrawSizeX = beforeDrawX - beforeX

      const afterX = this.after.global_bounds.x
      const afterDrawX = this.after.global_draw_bounds.x
      const afterDrawSizeX = afterDrawX - afterX

      // global
      if (!approxEqual(beforeDrawSizeX, afterDrawSizeX)) {
        console.log(
          `${this.node.name} ${beforeDrawSizeX -
            afterDrawSizeX}リサイズ後のBounds.x取得が正確ではないようです`,
        )
        // beforeのサイズ差をもとに、afterを修正する
        this.after.global_draw_bounds.x =
          this.after.global_bounds.x + beforeDrawSizeX
      }
    }
    {
      const beforeY = this.before.global_bounds.y
      const beforeDrawY = this.before.global_draw_bounds.y
      const beforeDrawSizeY = beforeDrawY - beforeY

      const afterY = this.after.global_bounds.y
      const afterDrawY = this.after.global_draw_bounds.y
      const afterDrawSizeY = afterDrawY - afterY

      if (!approxEqual(beforeDrawSizeY, afterDrawSizeY)) {
        console.log(
          `${this.node.name} ${beforeDrawSizeY -
            afterDrawSizeY}リサイズ後のBounds.y取得がうまくいっていないようです`,
        )
        // beforeのサイズ差をもとに、afterを修正する
        this.after.global_draw_bounds.y =
          this.after.global_bounds.y + beforeDrawSizeY
      }
    }
    {
      const beforeX = this.before.global_bounds.ex
      const beforeDrawX = this.before.global_draw_bounds.ex
      const beforeDrawSizeX = beforeDrawX - beforeX

      const afterX = this.after.global_bounds.ex
      const afterDrawX = this.after.global_draw_bounds.ex
      const afterDrawSizeX = afterDrawX - afterX

      if (!approxEqual(beforeDrawSizeX, afterDrawSizeX)) {
        console.log(
          `${this.node.name} ${beforeDrawSizeX -
            afterDrawSizeX}リサイズ後のBounds.ex取得がうまくいっていないようです`,
        )
        // beforeのサイズ差をもとに、afterを修正する
        this.after.global_draw_bounds.ex =
          this.after.global_bounds.ex + beforeDrawSizeX
      }
    }
    {
      const beforeY = this.before.global_bounds.ey
      const beforeDrawY = this.before.global_draw_bounds.ey
      const beforeDrawSizeY = beforeDrawY - beforeY

      const afterY = this.after.global_bounds.ey
      const afterDrawY = this.after.global_draw_bounds.ey
      const afterDrawSizeY = afterDrawY - afterY

      if (!approxEqual(beforeDrawSizeY, afterDrawSizeY)) {
        console.log(
          `${this.node.name} ${beforeDrawSizeY -
            afterDrawSizeY}リサイズ後のBounds.ey取得がうまくいっていないようです`,
        )
        // beforeのサイズ差をもとに、afterを修正する
        this.after.global_draw_bounds.ey =
          this.after.global_bounds.ey + beforeDrawSizeY
      }
    }
    this.after.global_draw_bounds.width =
      this.after.global_draw_bounds.ex - this.after.global_draw_bounds.x
    this.after.global_draw_bounds.height =
      this.after.global_draw_bounds.ey - this.after.global_draw_bounds.y
  }

  updateRestoreBounds() {
    this.restore = new GlobalBounds(this.node)
  }

  calcRectTransform() {
    // DrawBoundsでのレスポンシブパラメータ(場合によっては不正確)
    this.responsiveParameter = calcRectTransform(this.node)
    // GlobalBoundsでのレスポンシブパラメータ(場合によっては不正確)
    this.responsiveParameterGlobal = calcRectTransform(this.node, false)
  }
}

/**
 * ファイル名につかえる文字列に変換する
 * @param {string} name
 * @param {boolean} convertDot ドットも変換対象にするか
 * @return {string}
 */
function replaceToFileName(name, convertDot = false) {
  if (convertDot) {
    return name.replace(/[\\/:*?"<>|#\x00-\x1F\x7F\.]/g, '_')
  }
  return name.replace(/[\\/:*?"<>|#\x00-\x1F\x7F]/g, '_')
}

/**
 * 誤差範囲での差があるか
 * epsの値はこのアプリケーション内では共通にする
 * after-bounds before-boundsの変形で誤差が許容範囲と判定したにもかかわらず、
 * 後のcalcRectTransformで許容範囲外と判定してまうなどの事故を防ぐため
 * @param {number} a
 * @param {number} b
 */
function approxEqual(a, b) {
  const eps = 0.001 // リサイズして元にもどしたとき､これぐらいの誤差がでる
  return Math.abs(a - b) < eps
}

/**
 * ラベル名につかえる文字列に変換する
 * @param {string} name
 * @return {string}
 */
function convertToLabel(name) {
  return name.replace(/[\\/:*?"<>|# \x00-\x1F\x7F]/g, '_')
}

/**
 * Alphaを除きRGBで6桁16進の色の値を取得する
 * @param {number} color
 */
function getRGB(color) {
  return ('000000' + color.toString(16)).substr(-6)
}

/**
 * 親をさかのぼり､Artboardを探し出す
 * @param {SceneNode|SceneNodeClass} node
 * @returns {Artboard|null}
 */
function getArtboard(node) {
  let parent = node
  while (parent != null) {
    if (parent.constructor.name === 'Artboard') {
      return parent
    }
    parent = parent.parent
  }
  return null
}

/**
 * @param node
 * @returns {RepeatGrid}
 */
function getAncestorRepeatGrid(node) {
  let parent = node
  while (parent != null) {
    if (parent.constructor.name === 'RepeatGrid') {
      return parent
    }
    parent = parent.parent
  }
  return null
}

/**
 * nodeからスケールを考慮したglobalBoundsを取得する
 * Artboardであった場合の、viewportHeightも考慮する
 * ex,eyがつく
 * ハッシュをつかわない
 * @param node
 * @return {{ex: number, ey: number, x: number, width: number, y: number, height: number}}
 */
function getGlobalBounds(node) {
  const bounds = node.globalBounds
  // Artboardにあるスクロール領域のボーダー
  const viewPortHeight = node.viewportHeight
  if (viewPortHeight != null) bounds.height = viewPortHeight
  return {
    x: bounds.x * globalScale,
    y: bounds.y * globalScale,
    width: bounds.width * globalScale,
    height: bounds.height * globalScale,
    ex: (bounds.x + bounds.width) * globalScale,
    ey: (bounds.y + bounds.height) * globalScale,
  }
}

/**
 * nodeからスケールを考慮したglobalDrawBoundsを取得する
 * Artboardであった場合の、viewportHeightも考慮する
 * ex,eyがつく
 * ハッシュをつかわないで取得する
 * Textのフォントサイズ情報など、描画サイズにかかわるものを取得する
 * アートボードの伸縮でサイズが変わってしまうために退避できるように
 * @param {SceneNode|SceneNodeClass} node
 * @return {{ex: number, ey: number, x: number, width: number, y: number, height: number}}
 */
function getGlobalDrawBounds(node) {
  let bounds = node.globalDrawBounds
  const viewPortHeight = node.viewportHeight
  if (viewPortHeight != null) bounds.height = viewPortHeight
  let b = {
    x: bounds.x * globalScale,
    y: bounds.y * globalScale,
    width: bounds.width * globalScale,
    height: bounds.height * globalScale,
    ex: (bounds.x + bounds.width) * globalScale,
    ey: (bounds.y + bounds.height) * globalScale,
  }

  // console.log('node.constructor.name:' + node.constructor.name)
  if (node.constructor.name === 'Text') {
    Object.assign(b, {
      text: {
        fontSize: node.fontSize,
      },
    })
  }
  return b
}

/**
 * リサイズされる前のグローバル座標とサイズを取得する
 * @param {SceneNode|SceneNodeClass} node
 * @return {{ex: number, ey: number, x: number, width: number, y: number, height: number}}
 */
function getBeforeGlobalBounds(node) {
  const hashBounds = globalResponsiveBounds
  let bounds = null
  if (hashBounds != null) {
    const hBounds = hashBounds[node.guid]
    if (hBounds && hBounds.before) {
      bounds = Object.assign({}, hBounds.before.global_bounds)
    }
  }
  if (bounds) return bounds
  console.log(
    '**error** リサイズ前のGlobalBoundsの情報がありません' + node.name,
  )
  return null
}

function getBeforeTextFontSize(node) {
  const hBounds = globalResponsiveBounds[node.guid]
  return hBounds.before.global_draw_bounds.text.fontSize
}

/**
 * リサイズされる前のグローバル座標とサイズを取得する
 * ハッシュからデータを取得する
 * @param {SceneNode|SceneNodeClass} node
 * @return {{ex: number, ey: number, x: number, width: number, y: number, height: number}}
 */
function getBeforeGlobalDrawBounds(node) {
  // レスポンシブパラメータ作成用で､すでに取得した変形してしまう前のパラメータがあった場合
  // それを利用するようにする
  let bounds = null
  const hashBounds = globalResponsiveBounds
  if (hashBounds) {
    const hBounds = hashBounds[node.guid]
    if (hBounds && hBounds.before) {
      bounds = Object.assign({}, hBounds.before.global_draw_bounds)
    }
  }
  if (bounds) return bounds
  // throw `リサイズ前のGlobalDrawBoundsの情報がありません: ${node}`
  return null
}

/**
 * @param {SceneNode|SceneNodeClass} node
 * @return {Bounds}
 */
function getBeforeContentGlobalBounds(node) {
  const hashBounds = globalResponsiveBounds
  let bounds = null
  if (hashBounds != null) {
    const hBounds = hashBounds[node.guid]
    if (hBounds && hBounds.before) {
      bounds = Object.assign({}, hBounds.before.content_global_bounds)
    }
  }
  if (bounds) return bounds
  console.log(
    '**error** リサイズ前のGlobalBoundsの情報がありません' + node.name,
  )
  return null
}

/**
 * @param {SceneNode|SceneNodeClass} node
 * @return {Bounds}
 */
function getBeforeContentGlobalDrawBounds(node) {
  const hashBounds = globalResponsiveBounds
  let bounds = null
  if (hashBounds != null) {
    const hBounds = hashBounds[node.guid]
    if (hBounds && hBounds.before) {
      bounds = Object.assign({}, hBounds.before.content_global_draw_bounds)
    }
  }
  if (bounds) return bounds
  console.log(
    '**error** リサイズ前のGlobalBoundsの情報がありません' + node.name,
  )
  return null
}

/**
 * @param {SceneNode|SceneNodeClass} node
 * @return {Bounds}
 */
function getBeforeViewportContentGlobalBounds(node) {
  const hashBounds = globalResponsiveBounds
  let bounds = null
  if (hashBounds != null) {
    const hBounds = hashBounds[node.guid]
    if (hBounds && hBounds.before) {
      bounds = Object.assign({}, hBounds.before.viewport_content_global_bounds)
    }
  }
  if (bounds) return bounds
  console.log(
    '**error** リサイズ前のGlobalBoundsの情報がありません' + node.name,
  )
  return null
}

/**
 * @param {SceneNode|SceneNodeClass} node
 * @return {Bounds}
 */
function getBeforeViewportContentGlobalDrawBounds(node) {
  const hashBounds = globalResponsiveBounds
  let bounds = null
  if (hashBounds != null) {
    const hBounds = hashBounds[node.guid]
    if (hBounds && hBounds.before) {
      bounds = Object.assign(
        {},
        hBounds.before.viewport_content_global_draw_bounds,
      )
    }
  }
  if (bounds) return bounds
  console.log(
    '**error** リサイズ前のGlobalBoundsの情報がありません' + node.name,
  )
  return null
}

/**
 * 相対座標のBoundsを返す
 * @param {Bounds} bounds
 * @param {Bounds} baseBounds
 * @returns {Bounds}
 */
function getBoundsInBase(bounds, baseBounds) {
  return {
    x: bounds.x - baseBounds.x,
    y: bounds.y - baseBounds.y,
    width: bounds.width,
    height: bounds.height,
  }
}

/**
 * @param renditions
 * @param fileName
 * @return {*|number|bigint}
 */
function searchFileName(renditions, fileName) {
  return renditions.find(entry => {
    return entry.fileName === fileName
  })
}

/**
 * @param r
 * @returns {boolean}
 */
function asBool(r) {
  if (typeof r == 'string') {
    const val = r.toLowerCase()
    if (val === 'false' || val === '0' || val === 'null') return false
  }
  return !!r
}

/**
 * 線分の衝突
 * @param {number} as
 * @param {number} ae
 * @param {number} bs
 * @param {number} be
 */
function testLine(as, ae, bs, be) {
  if (as >= bs) {
    return as < be
  }
  return ae > bs
}

/**
 * バウンディングボックスの衝突検知
 * @param {Bounds} a
 * @param {Bounds} b
 */
function testBounds(a, b) {
  return (
    testLine(a.x, a.x + a.width, b.x, b.x + b.width) &&
    testLine(a.y, a.y + a.height, b.y, b.y + b.height)
  )
}

/**
 * @param {Style} style
 * @return {{}|null}
 */
function getContentSizeFitterParam(style) {
  if (style == null) return null

  let param = {}
  const styleHorizontalFit = style.first(
    STYLE_CONTENT_SIZE_FITTER_HORIZONTAL_FIT,
  )
  if (styleHorizontalFit) {
    Object.assign(param, {
      horizontal_fit: styleHorizontalFit.trim(),
    })
  }
  const styleVerticalFit = style.first(STYLE_CONTENT_SIZE_FITTER_VERTICAL_FIT)
  if (styleVerticalFit) {
    Object.assign(param, {
      vertical_fit: styleVerticalFit.trim(),
    })
  }

  if (Object.keys(param).length === 0) {
    return null
  }

  return param
}

/**
 * Viewportの子供の整理をする
 * ･Y順に並べる
 * @param jsonElements
 */
function sortElementsByPositionAsc(jsonElements) {
  // 子供のリスト用ソート 上から順に並ぶように　(コンポーネント化するものをは一番下 例:Image Component)
  if (jsonElements == null) return
  jsonElements.sort((elemA, elemB) => {
    const a_y =
      elemA['component'] || !elemA['global_draw_bounds']
        ? Number.MAX_VALUE
        : elemA['global_draw_bounds']['y']
    const b_y =
      elemB['component'] || !elemB['global_draw_bounds']
        ? Number.MAX_VALUE
        : elemB['global_draw_bounds']['y']
    if (a_y === b_y) {
      //TODO: 誤差範囲の確認必要か
      const a_x =
        elemA['component'] || !elemA['global_draw_bounds']
          ? Number.MAX_VALUE
          : elemA['global_draw_bounds']['x']
      const b_x =
        elemB['component'] || !elemB['global_draw_bounds']
          ? Number.MAX_VALUE
          : elemB['global_draw_bounds']['x']
      return b_x - a_x
    }
    return b_y - a_y
  })
}

function sortElementsByPositionDesc(jsonElements) {
  // 子供のリスト用ソート 上から順に並ぶように　(コンポーネント化するものをは一番下 例:Image Component)
  jsonElements.sort((elemA, elemB) => {
    const a_y = elemA['component']
      ? Number.MAX_VALUE
      : elemA['global_draw_bounds']['y']
    const b_y = elemB['component']
      ? Number.MAX_VALUE
      : elemB['global_draw_bounds']['y']
    if (b_y === a_y) {
      const a_x = elemA['component']
        ? Number.MAX_VALUE
        : elemA['global_draw_bounds']['x']
      const b_x = elemB['component']
        ? Number.MAX_VALUE
        : elemB['global_draw_bounds']['x']
      return a_x - b_x
    }
    return a_y - b_y
  })
}

/**
 * リピートグリッドから、レイアウト情報を設定する
 * @param {RepeatGrid} repeatGrid
 * @param {Style} style
 */
function addLayoutFromRepeatGrid(json, repeatGrid, style) {
  if (style == null) return

  const styleLayoutGroup = style.first(STYLE_LAYOUT_GROUP)
  if (!asBool(styleLayoutGroup)) return

  let method = null
  switch (styleLayoutGroup) {
    case 'x':
    case STR_HORIZONTAL:
      method = STR_HORIZONTAL
      break
    case 'y':
    case STR_VERTICAL:
      method = STR_VERTICAL
      break
    default:
      method = STR_GRID
      break
  }

  let layoutJson = {}
  const repeatGridBounds = getBeforeGlobalBounds(repeatGrid)
  const nodesBounds = calcGlobalBounds(repeatGrid.children.filter(node => true))
  Object.assign(layoutJson, {
    method,
    padding: {
      left: nodesBounds.global_bounds.x - repeatGridBounds.x,
      right: 0,
      top: nodesBounds.global_bounds.y - repeatGridBounds.y,
      bottom: 0,
    },
    spacing_x: repeatGrid.paddingX * globalScale, // 横の隙間
    spacing_y: repeatGrid.paddingY * globalScale, // 縦の隙間
    cell_max_width: repeatGrid.cellSize.width * globalScale,
    cell_max_height: repeatGrid.cellSize.height * globalScale,
  })
  addLayoutGroupParam(layoutJson, style)

  json['layout'] = layoutJson
}

/**
 * 子供(コンポーネント化するもの･withoutNodeを除く)の全体サイズと
 * 子供の中での最大Width、Heightを取得する
 * 注意：保存されたBounds情報をつかわず、現在のサイズを取得する
 * @param {SceneNode[]} nodes
 * @returns {{node_max_height: number, node_max_width: number, global_bounds: Bounds, global_draw_bounds: Bounds}}
 */
function calcGlobalBounds(nodes) {
  // console.log(`calcGlobalBounds(${nodes})`)
  if (!nodes || nodes.length === 0)
    return {
      global_bounds: null,
      global_draw_bounds: null,
      node_max_width: null,
      node_max_height: null,
    }
  let childrenCalcBounds = new CalcBounds()
  let childrenCalcDrawBounds = new CalcBounds()
  // セルサイズを決めるため最大サイズを取得する
  let childrenMinMaxSize = new MinMaxSize()

  function addNode(node) {
    /* 以下のコードは、nodeが、親のマスクにはいっているかどうかの判定のためのテストコード
    if (!testBounds(viewportBounds, childBounds)) {
      console.log(child.name + 'はViewportにはいっていない')
      return false // 処理しない
    }
     */
    const childBounds = node.globalDrawBounds
    childrenCalcBounds.addBounds(childBounds)
    const childDrawBounds = node.globalDrawBounds
    childrenCalcDrawBounds.addBounds(childDrawBounds)
    childrenMinMaxSize.addSize(childBounds.width, childBounds.height)
  }

  for (let node of nodes) {
    addNode(node)
  }

  return {
    global_bounds: childrenCalcBounds.bounds,
    global_draw_bounds: childrenCalcDrawBounds.bounds,
    node_max_width: childrenMinMaxSize.maxWidth * globalScale,
    node_max_height: childrenMinMaxSize.maxHeight * globalScale,
  }
}

/**
 * Viewport内の、オブジェクトリストから Paddingを計算する
 * @param {SceneNode|SceneNodeClass} node
 * @returns {{top: number, left: number, bottom: number, right: number}}
 */
function calcPadding(node) {
  let bounds = getBeforeGlobalDrawBounds(node) // 描画でのサイズを取得する　影など増えた分も考慮したPaddingを取得する
  const contentBounds = getBeforeContentGlobalDrawBounds(node)
  // Paddingの計算
  let paddingLeft = contentBounds.x - bounds.x
  let paddingTop = contentBounds.y - bounds.y
  let paddingRight =
    bounds.x + bounds.width - (contentBounds.x + contentBounds.width)
  let paddingBottom =
    bounds.y + bounds.height - (contentBounds.y + contentBounds.height)
  return {
    left: paddingLeft,
    right: paddingRight,
    top: paddingTop,
    bottom: paddingBottom,
  }
}

/**
 * Layoutパラメータを生成する
 * ※List､LayoutGroup､Viewport共通
 * AreaNode　と　json.elementsの子供情報から
 * Spacing､Padding､Alignment情報を生成する
 * Baum2にわたすにはmethodが必要
 * @param {*} json
 * @param {SceneNode|SceneNodeClass} viewportNode
 * @param {SceneNode|SceneNodeClass} maskNode
 * @param {SceneNodeList} nodeChildren
 */
function calcLayoutAlignmentSpace(json, viewportNode, maskNode, nodeChildren) {
  const padding = calcPadding(viewportNode)
  // console.log('padding:', padding)
  let jsonLayout = {
    padding,
  }
  // componentの無いelemリストを作成する
  let elements = []
  forEachReverseElements(json.elements, element => {
    //後ろから追加していく
    if (element && element['component'] == null) {
      elements.push(element)
    }
  })

  // spacingの計算
  // 最小の隙間をもつ elemV elemHを探す
  // TODO: elem0と一つにせず、最も左にあるもの、最も上にあるものを選出するとすると　ルールとしてわかりやすい
  const elem0 = elements[0]

  if (elem0 == null) return jsonLayout

  /** @type { {x:number, y:number, w:number, h:number}|null } */
  let elemV = null
  /** @type { {x:number, y:number, w:number, h:number}|null } */
  let elemH = null

  let spacing_x = null
  let spacing_y = null

  const elem0Top = elem0.y + elem0.h / 2
  const elem0Bottom = elem0.y - elem0.h / 2
  const elem0Left = elem0.x - elem0.w / 2
  const elem0Right = elem0.x + elem0.w / 2
  // 縦にそこそこ離れているELEMを探す
  for (let i = 1; i < elements.length; i++) {
    const elem = elements[i]
    const elemTop = elem.y + elem.h / 2
    const elemBottom = elem.y - elem.h / 2
    const elemLeft = elem.x - elem.w / 2
    const elemRight = elem.x + elem.w / 2

    // 縦ズレをさがす
    if (elem0Bottom >= elemTop) {
      let space = elem0Bottom - elemTop
      if (spacing_y == null || spacing_y > space) {
        elemV = elem
        spacing_y = space
      }
    }
    if (elem0Top <= elemBottom) {
      let space = elemBottom - elem0Top
      if (spacing_y == null || spacing_y > space) {
        elemV = elem
        spacing_y = space
      }
    }

    // 横ズレをさがす
    if (elem0Right < elemLeft) {
      let space = elemLeft - elem0Right
      if (spacing_x == null || spacing_x > space) {
        elemH = elem
        spacing_x = space
      }
    }
    if (elem0Left > elemRight) {
      let space = elem0Left - elemRight
      if (spacing_x == null || spacing_x > space) {
        elemH = elem
        spacing_x = space
      }
    }
  }

  if (spacing_x != null) {
    Object.assign(jsonLayout, {
      spacing_x: spacing_x,
    })
  }

  if (spacing_y != null) {
    Object.assign(jsonLayout, {
      spacing_y: spacing_y,
    })
  }

  let child_alignment = ''
  // 縦ズレ参考Elemと比較し、横方向child_alignmentを計算する
  if (elem0 && elemV) {
    // left揃えか
    if (approxEqual(elem0.x - elem0.w / 2, elemV.x - elemV.w / 2)) {
      child_alignment += 'left'
    } else if (approxEqual(elem0.x + elem0.w / 2, elemV.x + elemV.w / 2)) {
      child_alignment += 'right'
    } else if (approxEqual(elem0.x, elemV.x)) {
      child_alignment += 'center'
    }
  }

  // 横ズレ参考Elemと比較し、縦方向child_alignmentを計算する
  if (elem0 && elemH) {
    // left揃えか
    if (approxEqual(elem0.y - elem0.h / 2, elemH.y - elemH.h / 2)) {
      child_alignment += 'top'
    } else if (approxEqual(elem0.y + elem0.h / 2, elemH.y + elemH.h / 2)) {
      child_alignment += 'bottom'
    } else if (approxEqual(elem0.y, elemH.y)) {
      child_alignment += 'middle'
    }
  }

  if (child_alignment !== '') {
    Object.assign(jsonLayout, {
      child_alignment: child_alignment,
    })
  }

  return jsonLayout
}

/**
 * @param json
 * @param {SceneNode|SceneNodeClass} viewportNode
 * @param {SceneNode|SceneNodeClass} maskNode
 * @param {SceneNodeList} children
 * @returns {{padding: {top: number, left: number, bottom: number, right: number}, cell_max_height: number, cell_max_width: number}}
 */
function calcVLayout(json, viewportNode, maskNode, children) {
  // 子供のリスト用ソート 上から順に並ぶように　(コンポーネント化するものをは一番下 例:Image Component)
  sortElementsByPositionAsc(json.elements)
  let jsonVLayout = calcLayoutAlignmentSpace(
    json,
    viewportNode,
    maskNode,
    children,
  )
  jsonVLayout['method'] = STR_VERTICAL
  return jsonVLayout
}

/**
 * @param json
 * @param {SceneNode|SceneNodeClass} viewportNode
 * @param {SceneNode|SceneNodeClass} maskNode
 * @param {SceneNodeList} children
 * @returns {{padding: {top: number, left: number, bottom: number, right: number}, cell_max_height: number, cell_max_width: number}}
 */
function calcHLayout(json, viewportNode, maskNode, children) {
  // 子供のリスト用ソート 上から順に並ぶように　(コンポーネント化するものをは一番下 例:Image Component)
  let jsonHLayout = calcLayoutAlignmentSpace(
    json,
    viewportNode,
    maskNode,
    children,
  )
  jsonHLayout['method'] = STR_HORIZONTAL
  return jsonHLayout
}

/**
 * @param json
 * @param {SceneNode|SceneNodeClass} viewportNode
 * @param {SceneNode|SceneNodeClass} maskNode
 * @param {SceneNodeList} children
 * @returns {{padding: {top: number, left: number, bottom: number, right: number}, cell_max_height: number, cell_max_width: number}}
 */
function calcGridLayout(json, viewportNode, maskNode, children) {
  // 子供のリスト用ソート 上から順に並ぶように　(コンポーネント化するものをは一番下 例:Image Component)
  sortElementsByPositionAsc(json.elements)
  let jsonLayout
  if (viewportNode.constructor.name === 'RepeatGrid') {
    jsonLayout = getLayoutFromRepeatGrid(viewportNode, null)
  } else {
    // RepeatGridでなければ、VLayout情報から取得する
    jsonLayout = calcLayoutAlignmentSpace(
      json,
      viewportNode,
      maskNode,
      children,
    )
    jsonLayout['method'] = 'grid'
  }
  return jsonLayout
}

/**
 * @param json
 * @param viewportNode
 * @param maskNode
 * @param children
 * @param {Style} style
 * @return {spacing_x:string, spacing_y:string, child_alignment:string}
 */
function getLayoutJson(json, viewportNode, maskNode, children, style) {
  if (style == null) return null
  let styleLayout = style.values(STYLE_LAYOUT_GROUP)
  if (!styleLayout) return null
  let layoutJson = null
  // spacing_x spacing_y child_alignmentを取得する
  if (hasAnyValue(styleLayout, 'y', STR_VERTICAL)) {
    layoutJson = calcVLayout(json, viewportNode, maskNode, children)
  } else if (hasAnyValue(styleLayout, 'x', STR_HORIZONTAL)) {
    layoutJson = calcHLayout(json, viewportNode, maskNode, children)
  } else if (hasAnyValue(styleLayout, 'grid')) {
    layoutJson = calcGridLayout(json, viewportNode, maskNode, children)
  }
  if (layoutJson != null) {
    addLayoutGroupParam(layoutJson, style)
  }
  return layoutJson
}

/**
 * 逆順にForEach　コンポーネント化するものを省く
 * @param {*} elements
 * @param {*} func
 */
function forEachReverseElements(elements, func) {
  if (elements == null) return
  for (let i = elements.length - 1; i >= 0; i--) {
    //後ろから追加していく
    let elementJson = elements[i]
    if (elementJson && elementJson['component'] == null) {
      func(elementJson)
    }
  }
}

/**
 * @param {SceneNode|SceneNodeClass} node
 */
function getUnityName(node) {
  const { node_name: nodeName, style } = getNodeNameAndStyle(node)

  //スタイルで名前の指定がある場合
  let unityName = style.first(STYLE_UNITY_NAME)
  if (unityName) {
    //childIndexを子供番号で置き換え
    const childIndex = getChildIndex(node)
    unityName = unityName.replace(/\${childIndex}/, childIndex)
    //guidで置き換え
    unityName = unityName.replace(/\${guid}/, node.guid)

    return unityName
  }

  const parsed = cssParseNodeName(nodeName)
  if (parsed) {
    // console.log(parsed)
    // idを最優先
    if (parsed.id) return parsed.id
    // tagNameは名前に適さない マルチバイトは_に置き換えられた状態での名前になる
    // if (parsed.tagName) return parsed.tagName
    //
    if (parsed.name_without_class) return parsed.name_without_class
    // 全体の名前
    if (parsed.name) return parsed.name
    // クラスを名前とする　クラスは機能なので、名前にすることは優先順位として下位
    if (parsed.classNames && parsed.classNames.length > 0)
      return '.' + parsed.classNames.join('.')
  }

  return nodeName
}

/**
 * @param {[]} styleFix
 * @returns {null|{top: boolean, left: boolean, bottom: boolean, width: boolean, right: boolean, height: boolean}}
 */
function getStyleFix(styleFix) {
  if (styleFix == null) {
    return null
  }

  // null：わからない　true:フィックス　false:フィックスされていないで確定 いずれ数字に変わる
  // この関数はFixオプションで指定されているかどうかを返すので、TrueかFalse
  let styleFixWidth = false
  let styleFixHeight = false
  let styleFixTop = false
  let styleFixBottom = false
  let styleFixLeft = false
  let styleFixRight = false

  if (hasAnyValue(styleFix, 'w', 'width', 'size')) {
    styleFixWidth = true
  }
  if (hasAnyValue(styleFix, 'h', 'height', 'size')) {
    styleFixHeight = true
  }
  if (hasAnyValue(styleFix, 't', 'top')) {
    styleFixTop = true
  }
  if (hasAnyValue(styleFix, 'b', 'bottom')) {
    styleFixBottom = true
  }
  if (hasAnyValue(styleFix, 'l', 'left')) {
    styleFixLeft = true
  }
  if (hasAnyValue(styleFix, 'r', 'right')) {
    styleFixRight = true
  }
  if (hasAnyValue(styleFix, 'x')) {
    styleFixLeft = true
    styleFixRight = true
  }
  if (hasAnyValue(styleFix, 'y')) {
    styleFixTop = true
    styleFixBottom = true
  }

  return {
    left: styleFixLeft,
    right: styleFixRight,
    top: styleFixTop,
    bottom: styleFixBottom,
    width: styleFixWidth,
    height: styleFixHeight,
  }
}

function calcRect(
  parentBeforeBounds,
  beforeBounds,
  horizontalConstraints,
  verticalConstraints,
  style,
) {
  // null：わからない
  // true:フィックスで確定
  // false:フィックスされていないで確定 いずれ数字に変わる
  let styleFixWidth = null
  let styleFixHeight = null
  let styleFixTop = null
  let styleFixBottom = null
  let styleFixLeft = null
  let styleFixRight = null

  const styleFix = style.values(STYLE_FIX)
  if (styleFix != null) {
    // オプションが設定されたら、全ての設定が決まる(NULLではなくなる)
    const fix = getStyleFix(styleFix)
    // console.log('fix styleが設定されました-------------', fix)
    styleFixWidth = fix.width
    styleFixHeight = fix.height
    styleFixTop = fix.top
    styleFixBottom = fix.bottom
    styleFixLeft = fix.left
    styleFixRight = fix.right
  }

  if (!horizontalConstraints || !verticalConstraints) {
    // BooleanGroupの子供,RepeatGridの子供等、情報がとれないものがある
    // console.log(`${node.name} constraints情報がありません`)
  }

  //console.log(`${node.name} constraints`)
  //console.log(horizontalConstraints)
  //console.log(verticalConstraints)

  if (styleFixLeft === null && horizontalConstraints != null) {
    //styleFixLeft = approxEqual(beforeLeft, afterLeft)
    styleFixLeft =
      horizontalConstraints.position === SceneNode.FIXED_LEFT ||
      horizontalConstraints.position === SceneNode.FIXED_BOTH
  }

  if (styleFixRight === null && horizontalConstraints != null) {
    //styleFixRight = approxEqual(beforeRight, afterRight)
    styleFixRight =
      horizontalConstraints.position === SceneNode.FIXED_RIGHT ||
      horizontalConstraints.position === SceneNode.FIXED_BOTH
  }

  if (styleFixTop === null && verticalConstraints != null) {
    // styleFixTop = approxEqual(beforeTop, afterTop)
    styleFixTop =
      verticalConstraints.position === SceneNode.FIXED_TOP ||
      verticalConstraints.position === SceneNode.FIXED_BOTH
  }

  if (styleFixBottom === null && verticalConstraints != null) {
    // styleFixBottom = approxEqual(beforeBottom, afterBottom)
    styleFixBottom =
      verticalConstraints.position === SceneNode.FIXED_BOTTOM ||
      verticalConstraints.position === SceneNode.FIXED_BOTH
  }

  if (styleFixWidth === null && horizontalConstraints != null) {
    //styleFixWidth = approxEqual(beforeBounds.width, afterBounds.width)
    styleFixWidth = horizontalConstraints.size === SceneNode.SIZE_FIXED
  }

  if (styleFixHeight === null && verticalConstraints != null) {
    // styleFixHeight = approxEqual(beforeBounds.height, afterBounds.height)
    styleFixHeight = verticalConstraints.size === SceneNode.SIZE_FIXED
  }

  if (styleFixLeft === false) {
    // 親のX座標･Widthをもとに､Left値がきまる
    styleFixLeft =
      (beforeBounds.x - parentBeforeBounds.x) / parentBeforeBounds.width
  }

  if (styleFixRight === false) {
    // 親のX座標･Widthをもとに､割合でRight座標がきまる
    styleFixRight =
      (parentBeforeBounds.ex - beforeBounds.ex) / parentBeforeBounds.width
  }

  if (styleFixTop === false) {
    // 親のY座標･heightをもとに､Top座標がきまる
    styleFixTop =
      (beforeBounds.y - parentBeforeBounds.y) / parentBeforeBounds.height
  }

  if (styleFixBottom === false) {
    // 親のY座標･Heightをもとに､Bottom座標がきまる
    styleFixBottom =
      (parentBeforeBounds.ey - beforeBounds.ey) / parentBeforeBounds.height
  }

  // ここまでに
  // fixOptionWidth,fixOptionHeight : true || false
  // fixOptionTop,fixOptionBottom : true || number
  // fixOptionLeft,fixOptionRight : true || number
  // になっていないといけない

  // anchorの値を決める
  // null: 定義されていない widthかheightが固定されている
  // number: 親に対しての割合 anchorに割合をいれ､offsetを0
  // true: 固定されている anchorを0か1にし､offsetをピクセルで指定

  // console.log('left:' + styleFixLeft, 'right:' + styleFixRight)
  // console.log('top:' + styleFixTop, 'bottom:' + styleFixBottom)
  // console.log('width:' + styleFixWidth, 'height:' + styleFixHeight)

  let pivot_x = 0.5
  let pivot_y = 0.5
  let offsetMin = {
    x: null,
    y: null,
  } // left(x), bottom(h)
  let offsetMax = {
    x: null,
    y: null,
  } // right(w), top(y)
  let anchorMin = { x: null, y: null } // left, bottom
  let anchorMax = { x: null, y: null } // right, top

  // レスポンシブパラメータが不確定のままきた場合
  // RepeatGrid以下のコンポーネント,NULLになる
  if (styleFixWidth === null || styleFixHeight === null) {
    // console.log("fix情報がありませんでした", node.name)
    const beforeCenter = beforeBounds.x + beforeBounds.width / 2
    const parentBeforeCenter =
      parentBeforeBounds.x + parentBeforeBounds.width / 2
    anchorMin.x = anchorMax.x =
      (beforeCenter - parentBeforeCenter) / parentBeforeBounds.width + 0.5
    // サイズを設定　センターからの両端サイズ
    offsetMin.x = -beforeBounds.width / 2
    offsetMax.x = +beforeBounds.width / 2

    const beforeMiddle = beforeBounds.y + beforeBounds.height / 2
    const parentBeforeMiddle =
      parentBeforeBounds.y + parentBeforeBounds.height / 2
    anchorMin.y = anchorMax.y =
      -(beforeMiddle - parentBeforeMiddle) / parentBeforeBounds.height + 0.5
    offsetMin.y = -beforeBounds.height / 2
    offsetMax.y = +beforeBounds.height / 2

    return {
      fix: {
        left: styleFixLeft,
        right: styleFixRight,
        top: styleFixTop,
        bottom: styleFixBottom,
        width: styleFixWidth,
        height: styleFixHeight,
      },
      pivot: { x: 0.5, y: 0.5 },
      anchor_min: anchorMin,
      anchor_max: anchorMax,
      offset_min: offsetMin,
      offset_max: offsetMax,
    }
  }

  if (styleFixWidth) {
    // 横幅が固定されている
    // AnchorMin.xとAnchorMax.xは同じ値になる（親の大きさに左右されない）
    //   <-> これが違う値の場合、横幅は親に依存に、それにoffset値を加算した値になる
    //        -> pivotでoffsetの値はかわらない
    // offsetMin.yとoffsetMax.yの距離がHeight
    if (styleFixLeft !== true && styleFixRight !== true) {
      //左右共ロックされていない
      anchorMin.x = anchorMax.x = (styleFixLeft + 1 - styleFixRight) / 2
      offsetMin.x = -beforeBounds.width / 2
      offsetMax.x = beforeBounds.width / 2
    } else if (styleFixLeft === true && styleFixRight !== true) {
      // 親のX座標から､X座標が固定値できまる
      anchorMin.x = 0
      anchorMax.x = 0
      offsetMin.x = beforeBounds.x - parentBeforeBounds.x
      offsetMax.x = offsetMin.x + beforeBounds.width
    } else if (styleFixLeft !== true && styleFixRight === true) {
      // 親のX座標から､X座標が固定値できまる
      anchorMin.x = 1
      anchorMax.x = 1
      offsetMax.x = beforeBounds.ex - parentBeforeBounds.ex
      offsetMin.x = offsetMax.x - beforeBounds.width
    } else {
      // 不確定な設定
      // 1)サイズが固定、左右固定されている
      // 2)サイズが固定されているが、どちらも実数
      // サイズ固定で、位置が親の中心にたいして、絶対値できまるようにする
      // console.log( `${node.name} fix-right(${styleFixRight}) & fix-left(${styleFixLeft}) & fix-width(${styleFixWidth})`)
      anchorMin.x = anchorMax.x = 0.5
      const parentCenterX = parentBeforeBounds.x + parentBeforeBounds.width / 2
      const centerX = beforeBounds.x + beforeBounds.width / 2
      const offsetX = centerX - parentCenterX
      offsetMin.x = offsetX - beforeBounds.width / 2
      offsetMax.x = offsetX + beforeBounds.width / 2
    }
  } else {
    if (styleFixLeft === true) {
      // 親のX座標から､X座標が固定値できまる
      anchorMin.x = 0
      offsetMin.x = beforeBounds.x - parentBeforeBounds.x
    } else {
      anchorMin.x = styleFixLeft
      offsetMin.x = 0
    }

    if (styleFixRight === true) {
      // 親のX座標から､X座標が固定値できまる
      anchorMax.x = 1
      offsetMax.x = beforeBounds.ex - parentBeforeBounds.ex
    } else {
      anchorMax.x = 1 - styleFixRight
      offsetMax.x = 0
    }
  }

  // AdobeXD と　Unity2D　でY軸の向きがことなるため､Top→Max　Bottom→Min
  if (styleFixHeight) {
    // 高さが固定されている
    // AnchorMin.yとAnchorMax.yは同じ値になる（親の大きさに左右されない）
    //   <-> これが違う値の場合、高さは親に依存に、それにoffset値を加算した値になる　つまりpivotでoffsetの値はかわらない
    // offsetMin.yとoffsetMax.yの距離がHeight
    if (styleFixTop !== true && styleFixBottom !== true) {
      //両方共ロックされていない
      anchorMin.y = anchorMax.y = 1 - (styleFixTop + 1 - styleFixBottom) / 2
      offsetMin.y = -beforeBounds.height / 2
      offsetMax.y = beforeBounds.height / 2
    } else if (styleFixTop === true && styleFixBottom !== true) {
      // 親のY座標から､Y座標が固定値できまる
      anchorMax.y = 1
      anchorMin.y = 1
      offsetMax.y = -(beforeBounds.y - parentBeforeBounds.y)
      offsetMin.y = offsetMax.y - beforeBounds.height
    } else if (styleFixTop !== true && styleFixBottom === true) {
      // 親のY座標から､Y座標が固定値できまる
      anchorMin.y = 0
      anchorMax.y = anchorMin.y
      offsetMin.y = -(beforeBounds.ey - parentBeforeBounds.ey)
      offsetMax.y = offsetMin.y + beforeBounds.height
    } else {
      // 不正な設定
      // サイズが固定されて、上下固定されている
      // 上下共ロックされていない　と同じ設定をする
      anchorMin.y = anchorMax.y = 1 - (styleFixTop + 1 - styleFixBottom) / 2
      offsetMin.y = -beforeBounds.height / 2
      offsetMax.y = beforeBounds.height / 2

      // 不確定な設定
      // 1)サイズが固定、左右固定されている
      // 2)サイズが固定されているが、どちらも実数
      // サイズ固定で、位置が親の中心にたいして、絶対値できまるようにする
      // console.log(`${node.name} fix-right(${styleFixRight}) & fix-left(${styleFixLeft}) & fix-width(${styleFixWidth})`)
      anchorMin.y = anchorMax.y = 0.5
      const parentCenterY = parentBeforeBounds.y + parentBeforeBounds.height / 2
      const centerY = beforeBounds.y + beforeBounds.height / 2
      const offsetY = -centerY + parentCenterY
      offsetMin.y = offsetY - beforeBounds.height / 2
      offsetMax.y = offsetY + beforeBounds.height / 2
    }
  } else {
    if (styleFixTop === true) {
      // 親のY座標から､Y座標が固定値できまる
      anchorMax.y = 1
      offsetMax.y = -(beforeBounds.y - parentBeforeBounds.y)
    } else {
      anchorMax.y = 1 - styleFixTop
      offsetMax.y = 0
    }

    if (styleFixBottom === true) {
      // 親のY座標から､Y座標が固定値できまる
      anchorMin.y = 0
      offsetMin.y = -(beforeBounds.ey - parentBeforeBounds.ey)
    } else {
      anchorMin.y = styleFixBottom
      offsetMin.y = 0
    }
  }

  if (style.hasValue(STYLE_FIX, 'c', 'center')) {
    const beforeCenter = beforeBounds.x + beforeBounds.width / 2
    const parentBeforeCenter =
      parentBeforeBounds.x + parentBeforeBounds.width / 2
    anchorMin.x = anchorMax.x =
      (beforeCenter - parentBeforeCenter) / parentBeforeBounds.width + 0.5
    // サイズを設定　センターからの両端サイズ
    offsetMin.x = -beforeBounds.width / 2
    offsetMax.x = +beforeBounds.width / 2
  }

  if (style.hasValue(STYLE_FIX, 'm', 'middle')) {
    const beforeMiddle = beforeBounds.y + beforeBounds.height / 2
    const parentBeforeMiddle =
      parentBeforeBounds.y + parentBeforeBounds.height / 2
    anchorMin.y = anchorMax.y =
      -(beforeMiddle - parentBeforeMiddle) / parentBeforeBounds.height + 0.5
    offsetMin.y = -beforeBounds.height / 2
    offsetMax.y = +beforeBounds.height / 2
  }

  // pivotの設定 固定されている方向にあわせる
  if (styleFixLeft === true && styleFixRight !== true) {
    pivot_x = 0
  } else if (styleFixLeft !== true && styleFixRight === true) {
    pivot_x = 1
  }

  if (styleFixTop === true && styleFixBottom !== true) {
    pivot_y = 1
  } else if (styleFixTop !== true && styleFixBottom === true) {
    pivot_y = 0
  }

  return {
    fix: {
      left: styleFixLeft,
      right: styleFixRight,
      top: styleFixTop,
      bottom: styleFixBottom,
      width: styleFixWidth,
      height: styleFixHeight,
    },
    pivot: { x: pivot_x, y: pivot_y },
    anchor_min: anchorMin,
    anchor_max: anchorMax,
    offset_min: offsetMin,
    offset_max: offsetMax,
  }
}

/**
 * 本当に正確なレスポンシブパラメータは、シャドウなどエフェクトを考慮し、どれだけ元サイズより
 大きくなるか最終アウトプットのサイズを踏まえて計算する必要がある
 calcResonsiveParameter内で、判断する必要があると思われる
 * 自動で取得されたレスポンシブパラメータは､optionの @Pivot @StretchXで上書きされる
 fix: {
      // ロック true or ピクセル数
      left: fixOptionLeft,
      right: fixOptionRight,
      top: fixOptionTop,
      bottom: fixOptionBottom,
      width: fixOptionWidth,
      height: fixOptionHeight,
    },
 anchor_min: anchorMin,
 anchor_max: anchorMax,
 offset_min: offsetMin,
 offset_max: offsetMax,
 * @param {SceneNode|SceneNodeClass} node
 * @param calcDrawBounds
 * @return {null}
 */
function calcRectTransform(node, calcDrawBounds = true) {
  // console.log(`- calcRectTransform ${node.name}`)
  if (!node || !node.parent) return null

  const bounds = globalResponsiveBounds[node.guid]
  if (!bounds || !bounds.before || !bounds.after) return null

  const beforeGlobalBounds = bounds.before.global_bounds
  const beforeGlobalDrawBounds = bounds.before.global_draw_bounds
  const afterGlobalBounds = bounds.after.global_bounds
  const afterGlobalDrawBounds = bounds.after.global_draw_bounds

  const beforeBounds = calcDrawBounds
    ? beforeGlobalDrawBounds
    : beforeGlobalBounds
  const afterBounds = calcDrawBounds ? afterGlobalDrawBounds : afterGlobalBounds

  const parentBounds = globalResponsiveBounds[node.parent.guid]
  if (!parentBounds || !parentBounds.before || !parentBounds.after) return null

  const parentBeforeGlobalBounds =
    parentBounds.before.content_global_bounds ||
    parentBounds.before.global_bounds
  const parentBeforeGlobalDrawBounds =
    parentBounds.before.content_global_draw_bounds ||
    parentBounds.before.global_draw_bounds

  const parentAfterGlobalBounds =
    parentBounds.after.content_global_bounds || parentBounds.after.global_bounds
  const parentAfterGlobalDrawBounds =
    parentBounds.after.content_global_draw_bounds ||
    parentBounds.after.global_draw_bounds

  //content_global_boundsは、親がマスク持ちグループである場合、グループ全体のBoundsになる
  const parentBeforeBounds = calcDrawBounds
    ? parentBeforeGlobalDrawBounds
    : parentBeforeGlobalBounds
  const parentAfterBounds = calcDrawBounds
    ? parentAfterGlobalDrawBounds
    : parentAfterGlobalBounds

  // fix を取得するため
  // TODO: anchor スタイルのパラメータはとるべきでは
  const style = getNodeNameAndStyle(node).style
  // console.log(`  - style:`, style.style)

  const horizontalConstraints = node.horizontalConstraints
  const verticalConstraints = node.verticalConstraints

  return calcRect(
    parentBeforeBounds,
    beforeBounds,
    horizontalConstraints,
    verticalConstraints,
    style,
  )
}

/**
 * root以下のノードのレスポンシブパラメータ作成
 * @param {SceneNode|SceneNodeClass} root
 * @return {BoundsToRectTransform[]}
 */
async function makeGlobalBoundsRectTransform(root) {
  const parent = root.parent

  // 現在のboundsを取得する
  if (parent) {
    // 親がいるのなら、親の分も取得
    let param = new BoundsToRectTransform(parent)
    param.updateBeforeBounds()
    globalResponsiveBounds[parent.guid] = param
  }
  traverseNode(root, node => {
    let param = new BoundsToRectTransform(node)
    param.updateBeforeBounds()
    globalResponsiveBounds[node.guid] = param
  })

  const rootWidth = root.globalBounds.width
  const rootHeight = root.globalBounds.height
  // リサイズは大きくなるほうでする
  // リピートグリッドが小さくなったとき、みえなくなるものがでてくる可能性がある
  // そうなると、リサイズ前後での比較ができなくなる
  const resizePlusWidth = 0
  const resizePlusHeight = 0

  // rootのリサイズ
  const viewportHeight = root.viewportHeight // viewportの高さの保存
  // root.resize(rootWidth + resizePlusWidth, rootHeight + resizePlusHeight)
  if (viewportHeight) {
    // viewportの高さを高さが変わった分の変化に合わせる
    root.viewportHeight = viewportHeight + resizePlusHeight
  }

  // ここでダイアログをだすと、Artboardをひきのばしたところで、どう変化したか見ることができる
  // await fs.getFileForSaving('txt', { types: ['txt'] })

  // 変更されたboundsを取得する
  if (parent) {
    // 親がいるのなら、親の分も取得
    let bounds =
      globalResponsiveBounds[parent.guid] ||
      (globalResponsiveBounds[parent.guid] = new BoundsToRectTransform(parent))
    bounds.updateAfterBounds()
  }
  traverseNode(root, node => {
    let bounds =
      globalResponsiveBounds[node.guid] ||
      (globalResponsiveBounds[node.guid] = new BoundsToRectTransform(node))
    bounds.updateAfterBounds()
  })

  // Artboardのサイズを元に戻す
  // root.resize(rootWidth, rootHeight)
  if (viewportHeight) {
    root.viewportHeight = viewportHeight
  }

  // 元に戻ったときのbounds
  if (parent) {
    globalResponsiveBounds[parent.guid].updateRestoreBounds()
  }
  traverseNode(root, node => {
    globalResponsiveBounds[node.guid].updateRestoreBounds()
  })

  // レスポンシブパラメータの生成
  for (let key in globalResponsiveBounds) {
    globalResponsiveBounds[key].calcRectTransform() // ここまでに生成されたデータが必要
  }
}

/**
 * @param beforeBounds
 * @param restoreBounds
 * @return {boolean}
 */
function checkBounds(beforeBounds, restoreBounds) {
  return (
    approxEqual(beforeBounds.x, restoreBounds.x) &&
    approxEqual(beforeBounds.y, restoreBounds.y) &&
    approxEqual(beforeBounds.width, restoreBounds.width) &&
    approxEqual(beforeBounds.height, restoreBounds.height)
  )
}

function checkBoundsVerbose(beforeBounds, restoreBounds) {
  let result = true
  if (!approxEqual(beforeBounds.x, restoreBounds.x)) {
    console.log(`X座標が変わった ${beforeBounds.x} -> ${restoreBounds.x}`)
    result = false
  }
  if (!approxEqual(beforeBounds.y, restoreBounds.y)) {
    console.log(`Y座標が変わった ${beforeBounds.y} -> ${restoreBounds.y}`)
    result = false
  }
  if (!approxEqual(beforeBounds.width, restoreBounds.width)) {
    console.log(`幅が変わった ${beforeBounds.width} -> ${restoreBounds.width}`)
    result = false
  }
  if (!approxEqual(beforeBounds.height, restoreBounds.height)) {
    console.log(
      `高さが変わった ${beforeBounds.height} -> ${restoreBounds.height}`,
    )
    result = false
  }
  return result
}

/**
 * 描画サイズでのレスポンシブパラメータの取得
 * @param {SceneNode|SceneNodeClass} node
 * @returns {*}
 */
function getRectTransformDraw(node) {
  let bounds = globalResponsiveBounds[node.guid]
  return bounds ? bounds.responsiveParameter : null
}

/**
 * GlobalBoundsでのレスポンシブパラメータの取得
 * @param {SceneNode|SceneNodeClass} node
 */
function getRectTransform(node) {
  let bounds = globalResponsiveBounds[node.guid]
  return bounds ? bounds.responsiveParameterGlobal : null
}

/**
 *
 * @param node
 * @return {boolean}
 */
function getVisibleInfo(node) {
  let bounds = globalResponsiveBounds[node.guid]
  return bounds ? bounds.before.visible : true
}

/**
 * NodeNameはXDでつけられたものをTrimしただけ
 * @param {SceneNode|SceneNodeClass} node
 * @returns {string}
 */
function getNodeName(node) {
  return getNodeNameAndStyle(node).node_name
}

/**
 * IDを取得する #を削除する
 * @param {SceneNode|SceneNodeClass} node SceneNodeClassでないといけない
 * @return {string|null}
 */
function getCssIdFromNodeName(node) {
  if (node == null) {
    return null
  }
  const parsed = cssParseNodeName(getNodeName(node))
  if (parsed && parsed.id) return parsed.id
  return null
}

class Style {
  /**
   *
   * @param {*[][]} style
   */
  constructor(style = null) {
    if (style != null) {
      this.style = style
    } else {
      this.style = {}
    }
  }

  /**
   * スタイルへ宣言部を追加する
   * ここで VAR()など値に変わる
   * @param {CssDeclarations} declarations
   */
  addDeclarations(declarations) {
    const properties = declarations.properties()
    for (let property of properties) {
      const declValues = declarations.values(property)
      const values = []
      for (let declValue of declValues) {
        // console.log('declValue:', declValue)
        if (typeof declValue == 'string' && declValue.startsWith('var(')) {
          const tokenizer = /var\(\s*(?<id>\S*)\s*\)/
          let token = tokenizer.exec(declValue.trim())
          const id = token.groups.id
          let value = id ? globalCssVars[id] : null
          // console.log(`var(${id})をみつけました値は${value}`)
          values.push(value)
        } else {
          values.push(declValue)
        }
      }
      this.style[property] = values
    }
  }

  values(property) {
    return this.style[property]
  }

  /**
   * @param {string} property
   * @return {*|null}
   */
  first(property) {
    const values = this.values(property)
    if (values == null) return null
    return values[0]
  }

  /**
   *
   * @param {string} property
   * @param {*} value
   */
  setFirst(property, value) {
    let values = this.values(property)
    if (!values) {
      values = this.style[property] = []
    }
    values[0] = value
  }

  /**
   * @param {string} property
   * @return {boolean}
   */
  has(property) {
    let values = this.values(property)
    return !!values
  }

  /**
   * @param {string} property
   * @param checkValues
   * @return {boolean}
   */
  hasValue(property, ...checkValues) {
    //hasAnyValue(this.values(), checkValues)
    let values = this.values(property)
    if (!values) {
      return false
    }
    for (let value of values) {
      for (let checkValue of checkValues) {
        if (value === checkValue) return true
      }
    }
    return false
  }

  firstAsBool(property) {
    const first = this.first(property)
    return asBool(first)
  }

  firstAsNullOrBool(property) {
    const first = this.first(property)
    if (first == null) return null
    return asBool(first)
  }

  firstAsBoolParam(property, node) {
    const first = this.first(property)
    let result = false
    switch (first) {
      case 'not-has-layout-properties-preferred-size':
        result = !hasLayoutPropertiesPreferredSize(node)
        // console.log(`not-has-layout-properties:${result}`)
        break
      default:
        result = asBool(first)
        break
    }
    return result
  }

  /**
   * Valuesの値を連結した文字列を返す
   * @param {string} property
   * @return {string|null}
   */
  str(property) {
    const values = this.values(property)
    if (!values) return null
    let str = ''
    for (let value of values) {
      str += value.toString() + ' '
    }
    return str
  }

  forEach(callback) {
    for (let styleKey in this.style) {
      callback(styleKey, this.style[styleKey])
    }
  }
}

/**
 * @param {[]} values
 * @param {*} checkValues
 * @return {boolean}
 */
function hasAnyValue(values, ...checkValues) {
  if (!values) {
    return false
  }
  for (let value of values) {
    for (let checkValue of checkValues) {
      if (value === checkValue) return true
    }
  }
  return false
}

/**
 *
 * @param {{name:string, parent:*}} node
 * @returns {Style}
 */
function getStyleFromNode(node) {
  let style = new Style()
  let localCss = null
  try {
    localCss = cssParseNodeName(node.name)
  } catch (e) {
    //node.nameがパースできなかった
  }

  for (const rule of globalCssRules) {
    /** @type {CssSelector} */
    const selector = rule.selector
    const checkLog = rule.declarations.firstAsBool(STYLE_CHECK_LOG)
    if (selector && selector.matchRule(node, null, checkLog)) {
      if (checkLog) console.log('マッチした宣言をスタイルに追加', rule)
      style.addDeclarations(rule.declarations)
    }
  }

  if (localCss && localCss.declarations) {
    // console.log('nodeNameのCSSパースに成功した ローカル宣言部を持っている')
    style.addDeclarations(localCss.declarations)
  }

  if (style.has(STYLE_MATCH_LOG)) {
    console.log(`match-log:${style.values(STYLE_MATCH_LOG)}`)
  }

  //console.log('Style:',style)
  return style
}

/**
 * 自分が何番目の子供か
 * @param node
 * @return {number}
 */
function getChildIndex(node) {
  const parentNode = node.parent
  if (!parentNode) return -1
  for (
    let childIndex = 0;
    childIndex < parentNode.children.length;
    childIndex++
  ) {
    if (parentNode.children.at(childIndex) === node) {
      return childIndex
    }
  }
  return -1
}

/**
 * @param node
 * @return {boolean}
 */
function isFirstChild(node) {
  const parent = node.parent
  if (!parent) return false
  return parent.children.at(0) === node
}

function isLastChild(node) {
  const parent = node.parent
  if (!parent) return false
  const lastIndex = parent.children.length - 1
  return parent.children.at(lastIndex) === node
}

function isOnlyChild(node) {
  //TODO:　コンポーネントになるかどうかチェックが必要？　コンポーネントになるやつを省くかどうか明記するべきか
  const parent = node.parent
  if (!parent) return false
  return parent.children.length == 1
}

function hasOnlyChild(node) {
  //TODO:　コンポーネントになるかどうかチェックが必要？　コンポーネントになるやつを省くかどうか明記するべきか
  return node.children.length == 1
}

/**
 * 親と同じBoundsかどうか
 * Padding、*-Stackで、nodeが背景になっているかどうかの判定につかう
 * paddingがマイナスだと判定できない
 * @param node
 * @return {boolean|boolean}
 */
function sameParentBounds(node) {
  const parent = node.parent
  if (!parent) return false
  // 判定に使う値は、cacheにあるものを使わない
  // 同じかどうかわかれば良いので、getGlobalBounds関数もつかわなくて良い
  // ただ、Artboardのリサイズには対応できない
  // globalDrawBoundsでのチェックにする
  // Pathで、輪郭サイズを太くしている場合
  // 影の描画時、globalBoundsでは正確なチェックができない
  const bounds = node.globalDrawBounds
  const parentBounds = parent.globalDrawBounds
  if (!bounds || !parentBounds) return false
  // TODO:誤差を許容する判定をつかわなくてよいか
  // console.log(`sameParentBounds`, bounds, parentBounds)
  return (
    bounds.x === parentBounds.x &&
    bounds.y === parentBounds.y &&
    bounds.width === parentBounds.width &&
    bounds.height === parentBounds.height
  )
}

/**
 * node.nameをパースしオプションに分解する
 * この関数が基底にあり、正しくNodeName Styleが取得できるようにする
 * ここで処理しないと辻褄があわないケースがでてくる
 * 例：repeatgrid-child-nameで得られる名前
 * @param {SceneNode|SceneNodeClass} node ここのNodeはSceneNodeClassでないといけない
 * @returns {{node_name: string, name: string, style: Style}|null}
 */
function getNodeNameAndStyle(node) {
  if (node == null) {
    return null
  }

  // キャッシュ確認
  if (node.guid) {
    const cache = cacheNodeNameAndStyle[node.guid]
    if (cache) {
      return cache
    }
  }

  let parentNode = node.parent
  /**
   * @type {string}
   */
  let nodeName = node.name.trim()
  const style = getStyleFromNode(node)

  const value = {
    node_name: nodeName,
    name: nodeName, // 削除予定
    style,
  }
  // ここでキャッシュに書き込むことで、呼び出しループになることを防ぐ
  // 注意する箇所
  // 上： getStyleFromNodeName(nodeName, parentNode, cssRules, ...) で親への参照
  // 下： node.children.some(child => { const childStyle = getNodeNameAndStyle(child).style　で、子供への参照
  cacheNodeNameAndStyle[node.guid] = value

  if (parentNode && parentNode.constructor.name === 'RepeatGrid') {
    // 親がリピートグリッドの場合､名前が適当につけられるようです
    // Buttonといった名前やオプションが勝手につき､機能してしまうことを防ぐ
    // item_button
    // item_text
    // 2つセットをリピートグリッド化した場合､以下のような構成になる
    // リピートグリッド 1
    //   - item0
    //     - item_button
    //     - item_text
    //   - item1
    //     - item_button
    //     - item_text
    //   - item2
    //     - item_button
    //     - item_text
    // 以上のような構成になる
    nodeName = 'repeatgrid-child'

    value['node_name'] = nodeName
    value['name'] = nodeName

    // RepeatGridで、子供がすべてコメントアウトなら、子供を包括するグループもコメントアウトする
    style.setFirst(
      STYLE_COMMENT_OUT,
      !node.children.some(child => {
        // コメントアウトしてないものが一つでもあるか
        const childStyle = getNodeNameAndStyle(child).style
        return !childStyle.first(STYLE_COMMENT_OUT)
      }),
    )
  }

  return value
}

/**
 * @param root
 * @returns {{root: {name: *, type: string}, info: {version: string}}}
 */
function createInitialLayoutJson(root) {
  const dependency = []
  const dependNodes = globalOutputFileDependency[root.guid]
  for (let key in dependNodes) {
    const dependFileName = getLayoutPathFromNode(dependNodes[key])
    dependency.push(dependFileName)
  }
  return {
    info: {
      version: '0.9.8',
      dependency,
    },
    root: {
      type: 'Root',
      name: root.name,
    },
  }
}

/**
 * @param json
 * @param node:SceneNodeClass
 * @param {Style} style
 */
function addActive(json, node, style) {
  if (style.first('active')) {
    Object.assign(json, {
      active: style.firstAsBool('active'),
    })
  } else {
    Object.assign(json, {
      active: getVisibleInfo(node),
    })
  }
}

/**
 * CanvasGroupオプション
 * @param {*} json
 * @param {SceneNodeClass|SceneNode} node
 * @param style
 */
function addCanvasGroup(json, node, style) {
  let canvasGroup = style.first(STYLE_CANVAS_GROUP)
  if (canvasGroup != null) {
    Object.assign(json, {
      canvas_group: { alpha: 0 },
    })
  }
}

function addGlobalDrawBounds(json, node) {
  const global_draw_bounds = getBeforeGlobalDrawBounds(node)
  Object.assign(json, {
    global_draw_bounds,
  })
}

function overwriteRectTransform(rectTransformJson, style) {
  //TODO: 初期値はいらないだろうか
  if (!('anchor_min' in rectTransformJson)) rectTransformJson['anchor_min'] = {}
  if (!('anchor_max' in rectTransformJson)) rectTransformJson['anchor_max'] = {}
  if (!('offset_min' in rectTransformJson)) rectTransformJson['offset_min'] = {}
  if (!('offset_max' in rectTransformJson)) rectTransformJson['offset_max'] = {}
  // Styleで指定があった場合、上書きする
  const anchorX = style.values(STYLE_RECT_TRANSFORM_ANCHORS_X)
  if (anchorX) {
    // console.log(`anchorsX:${anchorOffsetX}`)
    rectTransformJson['anchor_min']['x'] = parseFloat(anchorX[0])
    rectTransformJson['anchor_max']['x'] = parseFloat(anchorX[1])
  }
  const anchorY = style.values(STYLE_RECT_TRANSFORM_ANCHORS_Y)
  if (anchorY) {
    // console.log(`anchorsY:${anchorOffsetY}`)
    rectTransformJson['anchor_min']['y'] = parseFloat(anchorY[0])
    rectTransformJson['anchor_max']['y'] = parseFloat(anchorY[1])
  }

  const anchorOffsetX = style.values(STYLE_RECT_TRANSFORM_ANCHORS_OFFSETS_X)
  if (anchorOffsetX) {
    // console.log(`anchorsX:${anchorOffsetX}`)
    rectTransformJson['anchor_min']['x'] = parseFloat(anchorOffsetX[0])
    rectTransformJson['anchor_max']['x'] = parseFloat(anchorOffsetX[1])
    rectTransformJson['offset_min']['x'] = parseFloat(anchorOffsetX[2])
    rectTransformJson['offset_max']['x'] = parseFloat(anchorOffsetX[3])
  }
  const anchorOffsetY = style.values(STYLE_RECT_TRANSFORM_ANCHORS_OFFSETS_Y)
  if (anchorOffsetY) {
    // console.log(`anchorsY:${anchorOffsetY}`)
    rectTransformJson['anchor_min']['y'] = parseFloat(anchorOffsetY[0])
    rectTransformJson['anchor_max']['y'] = parseFloat(anchorOffsetY[1])
    rectTransformJson['offset_min']['y'] = parseFloat(anchorOffsetY[2])
    rectTransformJson['offset_max']['y'] = parseFloat(anchorOffsetY[3])
  }
}

/**
 * オプションにpivot､stretchがあれば上書き
 * @param {*} json
 * @param {SceneNodeClass} node
 * @param style
 */
function addRectTransform(json, node, style) {
  let param = getRectTransformDraw(node)
  if (param) {
    Object.assign(json, {
      rect_transform: param,
    })
  }

  const rectTransformJson = json['rect_transform']
  overwriteRectTransform(rectTransformJson, style)
}

/**
 * @param json
 * @param {SceneNode|SceneNodeClass} node
 */
function addParsedNames(json, node) {
  const parsedName = cssParseNodeName(node.name)
  // console.log(`${node.name}からクラスを書き出す`)
  if (!parsedName) return

  const parsed_names = []

  if (parsedName.tagName) {
    parsed_names.push(parsedName.tagName)
  }

  if (parsedName.id) {
    parsed_names.push('#' + parsedName.id)
  }

  if (parsedName.classNames) {
    // console.log(`parsed_names: ${parsedName}`)
    for (let className of parsedName.classNames) {
      // クラスなので、「.」をつけるようにする
      parsed_names.push('.' + className)
    }
  }

  Object.assign(json, {
    parsed_names,
  })
}

/**
 * アスペクト比を固定する
 * 現状、イメージにしか適応できない
 * @param json
 * @param style
 */
function checkPreserveAspect(json, style) {
  const stylePreserveAspect = style.first(STYLE_PRESERVE_ASPECT)
  return stylePreserveAspect
}

function getImageSliceOptionJson(styleImageSliceValues, node) {
  let imageOptionJson = { slice: 'auto' }

  // 明確にfalseと指定してある場合にNO SLICEとする asBoolでは 0もFalseになっていまう
  if (styleImageSliceValues && styleImageSliceValues[0] === 'false') {
    Object.assign(imageOptionJson, { slice: 'none' })
  } else {
    // sliceのパラメータが明記してあるか
    if (styleImageSliceValues && styleImageSliceValues.length > 0) {
      if (node.rotation !== 0) {
        console.log(
          'warning*** 回転しているノードの9スライス指定は無効になります',
        )
      } else {
        /*
         省略については、CSSに準拠
         http://www.htmq.com/css3/border-image-slice.shtml
         上・右・下・左の端から内側へのオフセット量
         4番目の値が省略された場合には、2番目の値と同じ。
         3番目の値が省略された場合には、1番目の値と同じ。
         2番目の値が省略された場合には、1番目の値と同じ。
         */
        const paramLength = styleImageSliceValues.length
        let top = parseInt(styleImageSliceValues[0]) * globalScale
        let right =
          paramLength > 1
            ? parseInt(styleImageSliceValues[1]) * globalScale
            : top
        let bottom =
          paramLength > 2
            ? parseInt(styleImageSliceValues[2]) * globalScale
            : top
        let left =
          paramLength > 3
            ? parseInt(styleImageSliceValues[3]) * globalScale
            : right

        // DrawBoundsで大きくなった分を考慮する　(影などで大きくなる)
        const beforeBounds = getBeforeGlobalBounds(node)
        const beforeDrawBounds = getBeforeGlobalDrawBounds(node)

        //console.log('slice:' + top + 'px,' + right + 'px,' + bottom + 'px,' + left + 'px')
        top -= beforeDrawBounds.y - beforeBounds.y
        bottom += beforeDrawBounds.ey - beforeBounds.ey
        left -= beforeDrawBounds.x - beforeBounds.x
        right += beforeDrawBounds.ex - beforeBounds.ex

        Object.assign(imageOptionJson, {
          slice: 'border',
          slice_border: {
            top,
            bottom,
            right,
            left,
          },
        })
        // console.log('slice:' + offset)
      }
    }
  }

  return imageOptionJson
}

/**
 * 親のサイズで画像を生成する
 * ToDo:スライスや、ImageScaleをまだ考慮していない
 * @param {SceneNode|SceneNodeClass} node
 * @return {null|{copy_rect: {width: number, height: number}}}
 */
function getImageRectOptionJson(node) {
  const { style } = getNodeNameAndStyle(node)
  if (style.firstAsBool(STYLE_IMAGE_FIT_PARENT_BOUNDS)) {
    const bounds = getBeforeGlobalDrawBounds(node)
    const parentBounds = getBeforeGlobalDrawBounds(node.parent)
    return {
      copy_rect: {
        offset_x: bounds.x - parentBounds.x,
        offset_y: bounds.y - parentBounds.y,
        width: parentBounds.width,
        height: parentBounds.height,
      },
    }
  }
  return null
}

/**
 *
 * @param json
 * @param {SceneNode|SceneNodeClass} node
 * @param root
 * @param outputFolder
 * @param renditions
 * @param localStyle {Style}  後付できるスタイルパラメータ
 * @return {Promise<void>}
 */
async function addImage(
  json,
  node,
  root,
  outputFolder,
  renditions,
  localStyle = null,
) {
  let { node_name, style } = getNodeNameAndStyle(node)
  const unityName = getUnityName(node)
  // console.log('unity-name', unityName)

  // 今回出力するためのユニークな名前をつける
  let hashStringLength = 5
  // ファイル名が長すぎるとエラーになる可能性もある
  let fileName = replaceToFileName(unityName, true)
  fileName = fileName.substr(0, 20)
  while (true) {
    const guidStr = '+' + node.guid.slice(0, hashStringLength)
    // すでに同じものがあるか検索
    const found = searchFileName(renditions, fileName + guidStr)
    if (!found) {
      // みつからなかった場合完了
      fileName += guidStr
      break
    }
    hashStringLength++
  }

  Object.assign(json, {
    opacity: 100,
  })

  addGlobalDrawBounds(json, node)
  addRectTransform(json, node, style)

  Object.assign(json, {
    image: {},
  })
  let imageJson = json['image']

  if (style.firstAsBool(STYLE_PRESERVE_ASPECT)) {
    Object.assign(imageJson, {
      preserve_aspect: true,
    })
  }

  const styleRayCastTarget = style.first(STYLE_RAYCAST_TARGET)
  if (styleRayCastTarget != null) {
    Object.assign(imageJson, {
      raycast_target: asBool(styleRayCastTarget),
    })
  }

  // image type
  const styleImageType = style.first(STYLE_IMAGE_TYPE)
  if (styleImageType != null) {
    Object.assign(imageJson, {
      image_type: styleImageType,
    })
  }

  /**
   * @type {SceneNode}
   */
  let renditionNode = node
  let renditionScale = globalScale

  // console.log('9スライス以下の画像を出力するのに、ソース画像と同サイズが渡すことができるか調べる')
  if (!globalFlagImageNoExport && node.isContainer && node.rotation === 0) {
    // 回転している場合はできない
    node.children.some(child => {
      // source という名前で且つ、ImageFillを持ったノードを探す
      if (
        child.name === 'source' &&
        child.fill &&
        child.fill.constructor.name === 'ImageFill'
      ) {
        child.visible = true
        // 元のサイズにして出力対象にする
        child.resize(child.fill.naturalWidth, child.fill.naturalHeight)
        renditionNode = child
        return true // 見つけたので終了
      }
    })
  }

  if (style.first(STYLE_IMAGE_SCALE) != null) {
    const scaleImage = parseFloat(style.first(STYLE_IMAGE_SCALE))
    if (Number.isFinite(scaleImage)) {
      renditionScale = globalScale * scaleImage
    }
  }

  if (!asBool(style.first(STYLE_BLANK))) {
    Object.assign(imageJson, {
      source_image: fileName,
    })
    if (outputFolder && !globalFlagImageNoExport) {
      let fileExtension = '.png'
      // 画像出力登録
      // この画像サイズが、0になっていた場合出力に失敗する
      // 例：レスポンシブパラメータを取得するため、リサイズする→しかし元にもどらなかった
      // 出力画像ファイル
      const imageFile = await outputFolder.createFile(
        fileName + fileExtension,
        {
          overwrite: true,
        },
      )

      // mask イメージを出力する場合、maskをそのままRenditionできない
      if (renditionNode.parent && renditionNode.parent.mask === renditionNode) {
        // マスクグループをコピーし、ungroupし、マスクを選択してRendition
        // マスクそのものの選択は EditContext外であった（例外発生）
        selection.items = [renditionNode.parent]
        commands.duplicate()
        const duplicatedMaskNode = selection.items[0].mask
        commands.ungroup()
        selection.items[0] = '// duplicated mask node'
        renditionNode = duplicatedMaskNode
      }

      renditions.push({
        fileName: fileName,
        node: renditionNode,
        outputFile: imageFile,
        type: application.RenditionType.PNG,
        scale: renditionScale,
      })

      // image-sliceパラメータ　ローカル（名前内）で設定されたもの優先
      const styleImageSliceValues = localStyle
        ? localStyle.values(STYLE_IMAGE_SLICE)
        : style.values(STYLE_IMAGE_SLICE)

      const imageOptionJson = getImageSliceOptionJson(
        styleImageSliceValues,
        node,
      )
      const rectOptionJson = getImageRectOptionJson(node)
      Object.assign(imageOptionJson, rectOptionJson)

      const imageOptionFile = await outputFolder.createFile(
        fileName + fileExtension + '.json',
        {
          overwrite: true,
        },
      )
      await imageOptionFile.write(JSON.stringify(imageOptionJson, null, '  '))
    }
  }
}

/**
 *
 * @param json
 * @param {Style} style
 */
function addContentSizeFitter(json, style) {
  if (!style.firstAsBool(STYLE_CONTENT_SIZE_FITTER)) return
  const contentSizeFitterJson = getContentSizeFitterParam(style)
  if (contentSizeFitterJson != null) {
    Object.assign(json, {
      content_size_fitter: contentSizeFitterJson,
    })
  }
}

/**
 * @param json
 * @param {SceneNode|SceneNode} node
 * @param {Style} style
 */
function addScrollRect(json, node, style) {
  const styleScrollRect = style.first(STYLE_SCROLL_RECT)
  if (!styleScrollRect) return

  Object.assign(json, {
    scroll_rect: {},
  })
  const scrollRectJson = json['scroll_rect']

  let horizontal = null
  let vertical = null
  /*
  switch (node.scrollingType) {
    case ScrollableGroup.VERTICAL:
      horizontal = null
      vertical = true
      break
    case ScrollableGroup.HORIZONTAL:
      horizontal = true
      vertical = null
      break
    case ScrollableGroup.PANNING:
      horizontal = true
      vertical = true
      break
    default:
      break
  }
   */
  if (style.firstAsBool(STYLE_SCROLL_RECT_HORIZONTAL)) {
    Object.assign(scrollRectJson, {
      horizontal: true,
    })
  }
  if (style.firstAsBool(STYLE_SCROLL_RECT_VERTICAL)) {
    Object.assign(scrollRectJson, {
      vertical: true,
    })
  }
  const content_class = removeStartDot(style.first(STYLE_SCROLL_RECT_CONTENT))
  if (content_class) {
    Object.assign(scrollRectJson, {
      content_class,
    })
  }
  const vertical_scrollbar = style.first(STYLE_SCROLL_RECT_VERTICAL_SCROLLBAR)
  if (vertical_scrollbar) {
    Object.assign(scrollRectJson, {
      vertical_scrollbar,
    })
  }
  const horizontal_scrollbar = style.first(
    STYLE_SCROLL_RECT_HORIZONTAL_SCROLLBAR,
  )
  if (horizontal_scrollbar) {
    Object.assign(scrollRectJson, {
      horizontal_scrollbar,
    })
  }
}

/**
 * @param json
 * @param style
 */
function addRectMask2d(json, style) {
  const rect_mask_2d = style.first(STYLE_RECT_MASK_2D)
  if (rect_mask_2d === null) return
  Object.assign(json, {
    rect_mask_2d, // 受け取り側、boolで判定しているためbool値でいれる　それ以外は弾かれる
  })
}

/**
 * 描画スペースを取得する
 * @param {SceneNode[]|SceneNodeClass[]} nodes
 * @return {number[]}
 */
function getHorizontalDrawSpaces(nodes) {
  if (nodes.length <= 1) return []

  nodes.sort((a, b) => {
    const boundsA = getBeforeGlobalDrawBounds(a)
    const boundsB = getBeforeGlobalDrawBounds(b)
    return boundsA.x - boundsB.x
  })

  // Nodeを縦の順番に並べた状態で隙間を取得していく
  const spaces = []
  let rightX = getBeforeGlobalDrawBounds(nodes[0]).ex
  for (let i = 1; i < nodes.length; i++) {
    const nextBounds = getBeforeGlobalDrawBounds(nodes[i])
    const space = nextBounds.x - rightX
    spaces.push(space)
    rightX = nextBounds.ex
  }

  // console.log(spaces)
  return spaces
}

/**
 *
 * @param {SceneNode[]|SceneNodeClass[]} nodes
 * @return {number[]}
 */
function getVerticalDrawSpaces(nodes) {
  if (nodes.length <= 1) return []

  nodes.sort((a, b) => {
    const boundsA = getBeforeGlobalDrawBounds(a)
    const boundsB = getBeforeGlobalDrawBounds(b)
    return boundsA.y - boundsB.y
  })

  // Nodeを縦の順番に並べた状態で隙間を取得していく
  const spaces = []
  let bottomY = getBeforeGlobalDrawBounds(nodes[0]).ey
  for (let i = 1; i < nodes.length; i++) {
    const nextBounds = getBeforeGlobalDrawBounds(nodes[i])
    const space = nextBounds.y - bottomY
    spaces.push(space)
    bottomY = nextBounds.ey
  }

  // console.log(spaces)
  return spaces
}

function getCellDrawWidth(nodes) {
  if (nodes.length <= 1) return []

  const widths = []
  for (let node of nodes) {
    const bounds = getBeforeGlobalDrawBounds(node)
    widths.push(bounds.width)
  }

  return widths
}

function getCellDrawHeight(nodes) {
  if (nodes.length <= 1) return []

  const heights = []
  for (let node of nodes) {
    const bounds = getBeforeGlobalDrawBounds(node)
    heights.push(bounds.height)
  }

  return heights
}

/**
 *
 * @param json
 * @param {SceneNode|SceneNodeClass} viewportNode
 * @param {SceneNode|SceneNodeClass} maskNode
 * @param {SceneNodeList} children
 * @param {Style} style
 */
function addLayoutGroup(json, viewportNode, maskNode, children, style) {
  let styleLayout = style.values(STYLE_LAYOUT_GROUP)
  if (styleLayout == null) return

  const layoutGroupJson = {}

  let method = null
  if (hasAnyValue(styleLayout, 'x', STR_HORIZONTAL)) {
    method = 'horizontal'
  }
  if (hasAnyValue(styleLayout, 'y', STR_VERTICAL)) {
    method = 'vertical'
  }
  if (hasAnyValue(styleLayout, 'xy', STR_GRID)) {
    method = 'grid'
  }
  if (method != null) {
    Object.assign(layoutGroupJson, {
      method,
    })
    //　methodが確定でソートする
    sortElementsByPositionAsc(json.elements)
  }

  const paddingValues = style.values('layout-group-padding')
  if (paddingValues && paddingValues.length === 4) {
    Object.assign(layoutGroupJson, {
      padding: {
        left: parseFloat(paddingValues[0]),
        right: parseFloat(paddingValues[1]),
        top: parseFloat(paddingValues[2]),
        bottom: parseFloat(paddingValues[3]),
      },
    })
  } else {
    const padding = calcPadding(viewportNode)
    Object.assign(layoutGroupJson, {
      padding,
    })
  }

  // spacing を計算するノードだけ取り出す
  let childNodes = children.filter(child => {
    if (child === viewportNode && child === maskNode) return false
    const { style } = getNodeNameAndStyle(child)
    return !style.firstAsBool(STYLE_COMPONENT)
  })

  let rowNodes = childNodes
  let columnNodes = childNodes

  // RepeatGridの場合、縦・横Node配列を作成する
  if (viewportNode.constructor.name === 'RepeatGrid') {
    /**
     * @type {RepeatGrid}
     */
    const repeatGrid = viewportNode
    const numRows = repeatGrid.numRows
    const numColumns = repeatGrid.numColumns
    //console.log(`numRow:${numRows} numColumns:${numColumns}`)
    rowNodes = childNodes.slice(0, numColumns)
    // for (let rowNode of rowNodes) {
    //   console.log(rowNode.globalDrawBounds.x)
    // }
    columnNodes = []
    for (let i = 0; i < childNodes.length; i += numColumns) {
      //console.log(childNodes[i].globalDrawBounds.y)
      columnNodes.push(childNodes[i])
    }
  }

  let layoutSpacingX = style.first(STYLE_LAYOUT_GROUP_SPACING_X)
  if (layoutSpacingX !== null) {
    if (layoutSpacingX === 'average') {
      const spaces = getHorizontalDrawSpaces(rowNodes)
      // console.log(`spaces:`, spaces)
      if (spaces.length !== 0) {
        layoutSpacingX =
          spaces.reduce((previous, current) => previous + current) /
          spaces.length
      } else {
        layoutSpacingX = 0
      }
    }
    Object.assign(layoutGroupJson, {
      spacing_x: layoutSpacingX, //TODO: pxやenを無視している
    })
  }

  let layoutSpacingY = style.first(STYLE_LAYOUT_GROUP_SPACING_Y)
  if (layoutSpacingY !== null) {
    if (layoutSpacingY === 'average') {
      const spaces = getVerticalDrawSpaces(columnNodes)
      if (spaces.length !== 0) {
        layoutSpacingY =
          spaces.reduce((previous, current) => previous + current) /
          spaces.length
      } else {
        layoutSpacingY = 0
      }
    }
    Object.assign(layoutGroupJson, {
      spacing_y: layoutSpacingY, //TODO: 単位がない状態で渡している　単位はPixel数
    })
  }

  let cell_size_x = style.first(STYLE_LAYOUT_GROUP_CELL_SIZE_X)
  if (cell_size_x !== null) {
    if (cell_size_x === 'average') {
      const widths = getCellDrawWidth(childNodes)
      if (widths.length !== 0) {
        cell_size_x =
          widths.reduce((previous, current) => previous + current) /
          widths.length
      } else {
        cell_size_x = 100
      }
    }
    Object.assign(layoutGroupJson, {
      cell_size_x: cell_size_x, //TODO: 単位がない状態で渡している　単位はPixel数
    })
  }

  let cell_size_y = style.first(STYLE_LAYOUT_GROUP_CELL_SIZE_Y)
  if (cell_size_y !== null) {
    if (cell_size_y === 'average') {
      const widths = getCellDrawHeight(childNodes)
      if (widths.length !== 0) {
        cell_size_y =
          widths.reduce((previous, current) => previous + current) /
          widths.length
      } else {
        cell_size_y = 100
      }
    }
    Object.assign(layoutGroupJson, {
      cell_size_y, //TODO: 単位がない状態で渡している　単位はPixel数
    })
  }

  addLayoutGroupParam(layoutGroupJson, style)

  // 子供が位置でソートされているそれの順序を反転させる
  if (style.first(STYLE_LAYOUT_GROUP_CHILDREN_ORDER) === 'reverse') {
    json['elements'].reverse()
  }

  Object.assign(json, {
    layout_group: layoutGroupJson,
  })
}

/**
 * レイアウトコンポーネント各種パラメータをStyleから設定する
 * @param layoutGroupJson
 * @param {Style} style
 */
function addLayoutGroupParam(layoutGroupJson, style) {
  if (style == null) return
  const styleChildAlignment = style.first(STYLE_LAYOUT_GROUP_CHILD_ALIGNMENT)
  if (styleChildAlignment) {
    Object.assign(layoutGroupJson, {
      child_alignment: styleChildAlignment,
    })
  }

  const styleChildControlSize = style.values(
    STYLE_LAYOUT_GROUP_CHILD_CONTROL_SIZE,
  )
  if (styleChildControlSize) {
    Object.assign(layoutGroupJson, {
      child_control_size: styleChildControlSize,
    })
  }

  const styleUseChildScale = style.values(STYLE_LAYOUT_GROUP_USE_CHILD_SCALE)
  if (styleUseChildScale) {
    Object.assign(layoutGroupJson, {
      use_child_scale: styleUseChildScale,
    })
  }

  const styleChildForceExpand = style.values(
    STYLE_LAYOUT_GROUP_CHILD_FORCE_EXPAND,
  )
  if (styleChildForceExpand) {
    Object.assign(layoutGroupJson, {
      child_force_expand: styleChildForceExpand,
    })
  }

  // GridLayoutGroupのみ適応される
  const styleStartAxis = style.first(STYLE_LAYOUT_GROUP_START_AXIS)
  if (styleStartAxis) {
    // まず横方向へ並べる
    if (style.hasValue(STYLE_LAYOUT_GROUP_START_AXIS, 'x', STR_HORIZONTAL)) {
      Object.assign(layoutGroupJson, {
        start_axis: STR_HORIZONTAL,
      })
    }
    // まず縦方向へ並べる
    if (style.hasValue(STYLE_LAYOUT_GROUP_START_AXIS, 'y', STR_VERTICAL)) {
      Object.assign(layoutGroupJson, {
        start_axis: STR_VERTICAL,
      })
    }
  }
}

/**
 * @param node
 * @return {boolean}
 */
function hasLayoutPropertiesPreferredSize(node) {
  const { style } = getNodeNameAndStyle(node)
  /*
  console.log(`style_text: ${style.firstAsBool(STYLE_TEXT)}`)
  console.log(`style_textmp: ${style.firstAsBool(STYLE_TEXTMP)}`)
  console.log(`style_image: ${style.firstAsBool(STYLE_IMAGE)}`)
  console.log(`style_image_slice: ${style.firstAsBool(STYLE_IMAGE_SLICE)}`)
  console.log(`style_layout_group: ${style.firstAsBool(STYLE_LAYOUT_GROUP)}`)
  console.log(`style_layout_element: ${style.firstAsBool(STYLE_LAYOUT_ELEMENT)}`)
   */

  return (
    style.firstAsBool(STYLE_TEXT) ||
    style.firstAsBool(STYLE_TEXTMP) ||
    (style.firstAsBool(STYLE_IMAGE) &&
      style.firstAsNullOrBool(STYLE_IMAGE_SLICE) === false) || // Imageはスライス可とするとサイズが0になる
    style.firstAsBool(STYLE_LAYOUT_GROUP) ||
    // 明確な trueであるか　でのみ判定する　AsBoolだと not-has-layout-properties-preferred-sizeでもtrueになってしまう
    style.first(STYLE_LAYOUT_ELEMENT) === 'true' //TODO:LAYOUT_ELEMET PREFERREDサイズをもっているか確認せねばならない
  )
}

/**
 *
 * @param {{}} json
 * @param {SceneNode|SceneNode} node
 * @param {Style} style
 * @param overwriteGlobalDrawBounds 上書きするGlobalDrawBounds値
 */
function addLayoutElement(json, node, style, overwriteGlobalDrawBounds = null) {
  if (!style.firstAsBoolParam(STYLE_LAYOUT_ELEMENT, node)) return

  const layoutElementJson = {}

  const styleIgnoreLayout = style.first(STYLE_LAYOUT_ELEMENT_IGNORE_LAYOUT)
  if (styleIgnoreLayout != null) {
    Object.assign(layoutElementJson, {
      ignore_layout: asBool(styleIgnoreLayout),
    })
  }

  let drawBounds = overwriteGlobalDrawBounds
  if (drawBounds == null) drawBounds = getBeforeGlobalDrawBounds(node)

  function getValue(name) {
    switch (name) {
      case 'draw-bounds-width':
        return drawBounds.width
      case 'draw-bounds-height':
        return drawBounds.height
      case null:
        break
      default:
        console.log(`**error** unknown value ${name}`)
        break
    }
    return null
  }

  let preferred_width = getValue(
    style.first(STYLE_LAYOUT_ELEMENT_PREFERRED_WIDTH),
  )
  let preferred_height = getValue(
    style.first(STYLE_LAYOUT_ELEMENT_PREFERRED_HEIGHT),
  )
  Object.assign(layoutElementJson, {
    preferred_width,
    preferred_height,
  })

  Object.assign(json, {
    layout_element: layoutElementJson,
  })
}

/**
 *
 * @param json
 * @param node: SceneClassNode
 */
function addGuid(json, node) {
  Object.assign(json, { guid: node.guid })
}

/**
 *
 * @param json
 * @param {Style} style
 */
function addLayer(json, style) {
  const styleLayer = style.first(STYLE_LAYER)
  if (styleLayer != null) {
    Object.assign(json, { layer: styleLayer })
  }
}

/**
 * @param json
 * @param {Style} style
 */
function addComponents(json, style) {
  const components = []
  style.forEach((propertyName, value) => {
    // "add-component-XXXX"を探す
    if (propertyName.startsWith(STYLE_ADD_COMPONENT + '-')) {
      const properties = []
      // "XXX-YYYY" を探す
      const componentName = propertyName.substring(14) + '-'
      style.forEach((key, value) => {
        if (key.startsWith(componentName)) {
          properties.push({ path: value[0], values: value.slice(1) })
        }
      })
      const component = {
        type: style.first(propertyName),
        name: componentName,
        method: 'add',
        properties,
      }
      components.push(component)
    }
  })

  if (components.length > 0) {
    Object.assign(json, {
      components,
    })
  }
}

/**
 * nodeがnode.Boundsとことなる　content boundsをもつかどうか
 * Contentとは、Childrenをもっていて、なにかでMaskされているグループのこと
 * nodeと、ChildrenのDrawBoundsが異なる場合 Contentを持つという
 * ・MaskedGroup
 * ※RepeatGridはもたない node.Boundsの中で 子供ノードの位置を計算する
 * @param {SceneNode|SceneNodeClass} node
 * @return {boolean}
 */
function hasContentBounds(node) {
  const { style } = getNodeNameAndStyle(node)
  if (style.firstAsBool(STYLE_CREATE_CONTENT)) return true
  if (style.firstAsBool(STYLE_LAYOUT_GROUP)) return true
  if (node.mask) return true
  return false
}

/**
 * Contentになるかどうかチェック
 * - 親がコンテントを作成するか
 * - マスクは外れる
 * - コンポーネントになるものは外れる
 * @param {SceneNode|SceneNodeClass} node
 * @return {boolean}
 */
function isContentChild(node) {
  const { style } = getNodeNameAndStyle(node)
  // コンポーネントになるものは外れる
  if (style.firstAsBool(STYLE_COMPONENT)) return false
  // マスクになるものは外れる
  if (node.parent.mask === node) return false
  // 親がContentをまとめているか
  return hasContentBounds(node.parent)
}

/**
 * Viewportの役割をもつノードを返す
 * Maskをもっている場合はMask
 * @param node
 * @return {null|SceneNode|{show_mask_graphic: boolean}|string|*}
 */
function getViewport(node) {
  const { style } = getNodeNameAndStyle(node)
  const styleViewport = style.first(STYLE_CREATE_CONTENT)
  if (asBool(styleViewport)) return node
  if (node.mask) return node.mask
  if (node.constructor.name === 'RepeatGrid') return node
  return null
}

/**
 * Contentグループの作成
 * Content
 * - 主にスクロール用　アイテム用コンテナ
 * - Mask以下、ScrollGroup以下のコンポーネントをまとめるグループ
 * - サイズは固定
 * @param style
 * @param json
 * @param node
 */
function addContent(style, json, node) {
  if (!style.firstAsBool(STYLE_CREATE_CONTENT)) return
  const createContentName = style.first(STYLE_CREATE_CONTENT_NAME) || 'content'

  // contentのアサインと名前設定
  Object.assign(json, {
    content: {
      type: 'Group',
      name: createContentName,
      elements: [],
    },
  })

  const contentNode = {
    name: createContentName,
    parent: node,
  }
  let contentJson = json[STR_CONTENT]

  const contentStyle = getStyleFromNode(contentNode)

  const contentFix = style.style['content-fix']
  contentStyle.style['fix'] = contentFix

  // contentのBounds　RepeatGridか、Group・ScrollableGroupかで、作成方法がかわる
  if (
    node.constructor.name === 'Group' ||
    node.constructor.name === 'ScrollableGroup'
  ) {
    // 通常グループ､マスクグループでContentの作成
    // ContentのRectTransformは　場合によって異なる
    // ・通常グループで作成したとき親とぴったりサイズ
    // ・Maskグループで作成したときは親のサイズにしばられない →　座標はどうするか　センター合わせなのか
    // Groupでもスクロールウィンドウはできるようにするが、RepeatGridではない場合レイアウト情報が取得しづらい

    // 縦の並び順を正常にするため､Yでソートする
    // sortElementsByPositionAsc(json.elements) LayoutGroupで必要に応じてするためにここではいらないはず

    // これはコンテントのレイアウトオプションで実行すべき
    addLayoutGroup(
      contentJson,
      node,
      node.mask || node,
      node.children,
      contentStyle,
    )
  } else if (node.constructor.name === 'RepeatGrid') {
    // リピートグリッドでContentの作成
    // ContentのRectTransformは　場合によって異なるが、リピートグリッドの場合は確定できない
    // 縦スクロールを意図しているか　→ Content.RectTransformは横サイズぴったり　縦に伸びる
    // 横スクロールを意図しているか　→ Content.RectTransformは縦サイズぴったり　横に伸びる
    // こちらが確定できないため
    // addLayoutFromRepeatGrid(contentJson, node, contentStyle)
    // sortElementsByPositionAsc(json.elements)
    addLayoutGroup(
      contentJson,
      node,
      node.mask || node,
      node.children,
      contentStyle,
    )
  } else {
    console.log('**error** createContentで対応していない型です')
  }

  let contentDrawBounds = null
  const styleCreateContentBounds = style.first(STYLE_CREATE_CONTENT_BOUNDS)
  switch (styleCreateContentBounds) {
    case 'viewport-content-global-draw-bounds':
      contentDrawBounds = getBeforeViewportContentGlobalDrawBounds(node)
      break
    default:
      contentDrawBounds = getBeforeContentGlobalDrawBounds(node)
      break
  }

  Object.assign(contentJson, contentDrawBounds)

  // ContentのRectTransformを決める
  // addRectTransformができない　→ RectTransformのキャッシュをもっていないため
  const nodeBounds = getBeforeGlobalDrawBounds(node)
  const contentX = contentDrawBounds.x
  const contentY = contentDrawBounds.y
  const contentWidth = contentDrawBounds.width
  const contentHeight = contentDrawBounds.height

  const contentBounds = {
    x: contentX,
    y: contentY,
    width: contentWidth,
    height: contentHeight,
    ex: contentX + contentWidth,
    ey: contentX + contentWidth,
  }
  const contentRectTransform = calcRect(
    nodeBounds,
    contentBounds,
    null,
    null,
    contentStyle,
  )
  Object.assign(contentJson, {
    global_draw_bounds: contentBounds,
    rect_transform: contentRectTransform,
  })

  //TODO:GUIDを仮にでも生成できると良い
  addLayer(contentJson, contentStyle)
  overwriteRectTransform(contentRectTransform, contentStyle) // anchor設定を上書きする
  addContentSizeFitter(contentJson, contentStyle)
  addLayoutElement(contentJson, contentNode, contentStyle, contentDrawBounds) // DrawBoundsを渡す
}

/**
 *
 * @param {*} json
 * @param {SceneNode|SceneNodeClass} node
 * @param {*} root
 * @param {*} funcForEachChild
 * 出力構成
 * Viewport +Image(タッチ用透明)　+ScrollRect +RectMask2D
 *   - $Content ← 自動生成
 *      - Node
 * @scrollで、スクロール方向を指定することで、ScrollRectコンポーネントがつく
 * Content内のレイアウト定義可能
 * Content内、すべて変換が基本(XDの見た目そのままコンバートが基本)
 * Item化する場合は指定する
 */
async function createViewport(json, node, root, funcForEachChild) {
  let { style } = getNodeNameAndStyle(node)

  Object.assign(json, {
    type: 'Group',
    name: getUnityName(node),
    fill_color: '#ffffff00', // タッチイベント取得Imageになる
  })

  // ScrollRect
  addScrollRect(json, node, style)

  addContent(style, json, node, funcForEachChild, root)

  // 基本
  addGuid(json, node)
  addActive(json, node, style)
  addGlobalDrawBounds(json, style)
  addRectTransform(json, node, style)
  addLayer(json, style)
  addParsedNames(json, node)

  addContentSizeFitter(json, style)
  addScrollRect(json, node, style)
  addRectMask2d(json, style)

  if (json['content']) {
    json['content']['type'] = 'Group'
    json['content']['elements'] = json['elements']
    json['elements'] = [json['content']]
    delete json['content']
  }
}

/**
 * Stretch変形できるものへ変換コピーする
 * @param {SceneNode|SceneNodeClass} item
 */
function duplicateStretchable(item) {
  let fill = item.fill
  if (fill != null && item.constructor.name === 'Rectangle') {
    // ImageFillをもったRectangleのコピー
    let rect = new Rectangle()
    rect.name = item.name + '-stretch'
    SetGlobalBounds(rect, item.globalBounds) // 同じ場所に作成
    // 新規に作成することで、元のイメージがCCライブラリのイメージでもSTRETCH変形ができる
    let cloneFill = fill.clone()
    cloneFill.scaleBehavior = ImageFill.SCALE_STRETCH
    rect.fill = cloneFill
    selection.insertionParent.addChild(rect)
    return rect
  }
  // それ以外の場合は普通にコピー
  const selectionItems = [].concat(selection.items)
  selection.items = [item]
  commands.duplicate()
  const node = selection.items[0]
  //node.removeFromParent()
  selection.items = selectionItems
  return node
}

function SetGlobalBounds(node, newGlobalBounds) {
  const globalBounds = node.globalBounds
  const deltaX = newGlobalBounds.x - globalBounds.x
  const deltaY = newGlobalBounds.y - globalBounds.y
  node.moveInParentCoordinates(deltaX, deltaY)
  node.resize(newGlobalBounds.width, newGlobalBounds.height)
}

async function createInput(json, node, root, funcForEachChild) {
  let { style } = getNodeNameAndStyle(node)

  const type = 'Input'
  Object.assign(json, {
    type: type,
    name: getUnityName(node),
    elements: [], // Groupは空でもelementsをもっていないといけない
  })
  await funcForEachChild()
  let target_graphic_class = style.first(STYLE_INPUT_TARGET_GRAPHIC_NAME)
  let text_component_class = style.first(STYLE_INPUT_TEXT_TARGET)
  let placeholder_class = style.first(STYLE_INPUT_PLACEHOLDER_TARGET)
  Object.assign(json, {
    input: {
      target_graphic_class,
      text_component_class,
      placeholder_class,
    },
  })
  // 基本
  addGuid(json, node)
  addActive(json, node, style)
  addGlobalDrawBounds(json, style)
  addRectTransform(json, node, style)
  //addStyleRectTransform(json, style) // anchor設定を上書きする
  addLayer(json, style)
  addParsedNames(json, node)
}

/**
 * ノードに親を挿入する
 * pivotは子供のものをそのまま使用している要検討
 * @param json
 * @param style {Style}
 * @param node
 */
function addWrap(json, node, style) {
  const styleWrapSliderHandleX = style.first('wrap-slider-handle-x')
  if (styleWrapSliderHandleX) {
    // スライダーハンドル専用のWrap
    // スライダーハンドル移動領域を作成する
    let child = {}
    // プロパティの移動
    Object.assign(child, json)
    for (let member in json) delete json[member]
    // ラップするオブジェクトの作成
    // 作成できる条件
    // ・ハンドルがBarよりも高さがある
    // ・100％の位置にある
    // ・Barよりも右にはみでている
    const childBounds = getBeforeGlobalDrawBounds(node)
    const childRectTransform = child.rect_transform
    Object.assign(json, {
      type: 'Group',
      name: 'wrap-slider-handle-x',
      layer: child.layer,
      rect_transform: {
        pivot: {
          x: childRectTransform.pivot.x,
          y: childRectTransform.pivot.y,
        },
        anchor_min: {
          x: 0,
          y: 0,
        },
        anchor_max: {
          x: 1,
          y: 1,
        },
        offset_min: {
          x: 0,
          y: 0,
        },
        offset_max: {
          x: -childBounds.width / 2, // はみでている分ひっこめる
          y: 0,
        },
      },
      elements: [child],
    })
    childRectTransform.pivot.x = 0.5
    childRectTransform.pivot.y = 0.5
    if (
      approxEqual(
        childRectTransform.anchor_min.x,
        childRectTransform.anchor_max.x,
      )
    ) {
      const handleWidth =
        childRectTransform.offset_max.x - childRectTransform.offset_min.x
      console.log('handleWidth:', handleWidth)
      childRectTransform.offset_max.x = handleWidth / 2
      childRectTransform.offset_min.x = -handleWidth / 2
    }
    return
  }

  const styleWrap = style.firstAsBool('wrap')
  if (styleWrap) {
    let wrappedChild = {}
    // プロパティの移動
    Object.assign(wrappedChild, json)
    for (let member in json) delete json[member]
    Object.assign(json, {
      type: 'Group',
      name: 'wrap',
      layer: wrappedChild.layer,
      rect_transform: {
        pivot: {
          x: wrappedChild.rect_transform.pivot.x,
          y: wrappedChild.rect_transform.pivot.y,
        },
        anchor_min: {
          x: wrappedChild.rect_transform.anchor_min.x,
          y: wrappedChild.rect_transform.anchor_min.y,
        },
        anchor_max: {
          x: wrappedChild.rect_transform.anchor_max.x,
          y: wrappedChild.rect_transform.anchor_max.y,
        },
        offset_min: {
          x: wrappedChild.rect_transform.offset_min.x,
          y: wrappedChild.rect_transform.offset_min.y,
        },
        offset_max: {
          x: wrappedChild.rect_transform.offset_max.x,
          y: wrappedChild.rect_transform.offset_max.y,
        },
      },
      elements: [wrappedChild],
    })

    // 子供は縦横ともにピッタリさせる
    // pivotはそのまま
    wrappedChild.rect_transform.anchor_min.x = 0
    wrappedChild.rect_transform.anchor_max.x = 1
    wrappedChild.rect_transform.anchor_min.y = 0
    wrappedChild.rect_transform.anchor_max.y = 1
    wrappedChild.rect_transform.offset_min.x = 0
    wrappedChild.rect_transform.offset_max.x = 0
    wrappedChild.rect_transform.offset_min.y = 0
    wrappedChild.rect_transform.offset_max.y = 0

    return
  }

  // 縦に整列するアイテム用
  // - 縦のサイズがアイテムによってきまっている
  // - 横のサイズが親によって決められる
  const styleWrapY = style.first(STYLE_WRAP_VERTICAL_ITEM)
  if (styleWrapY) {
    let wrappedChild = {}
    // プロパティの移動
    Object.assign(wrappedChild, json)
    for (let member in json) delete json[member]
    // ラップするオブジェクトの作成
    Object.assign(json, {
      type: 'Group',
      name: `wrap-vertical-item(${node.guid})`,
      layer: wrappedChild.layer,
      global_draw_bounds: wrappedChild.global_draw_bounds, // 子供のBoundsをそのまま利用　Bounds.y でのソートに使われる
      rect_transform: {
        pivot: {
          x: 1,
          y: 0,
        },
        anchor_min: {
          x: 0,
          y: wrappedChild.rect_transform.anchor_min.y,
        },
        anchor_max: {
          x: 1,
          y: wrappedChild.rect_transform.anchor_max.y,
        },
        offset_min: {
          x: 0,
          y: wrappedChild.rect_transform.offset_min.y,
        },
        offset_max: {
          x: 0,
          y: wrappedChild.rect_transform.offset_max.y,
        },
      },
      elements: [wrappedChild],
    })
    wrappedChild.rect_transform.anchor_min.y = 0
    wrappedChild.rect_transform.anchor_max.y = 1
    wrappedChild.rect_transform.offset_min.y = 0
    wrappedChild.rect_transform.offset_max.y = 0

    if (style.firstAsBool(STYLE_WRAP_MOVE_LAYOUT_ELEMENT)) {
      if (wrappedChild.layout_element) {
        Object.assign(json, {
          layout_element: wrappedChild.layout_element,
        })
        delete wrappedChild.layout_element
      }
    }
    return
  }

  // 縦に整列するアイテム用
  // - 縦のサイズがアイテムによってきまっている
  // - 横のサイズが親によって決められる
  const styleWrapX = style.first(STYLE_WRAP_HORIZONTAL_ITEM)
  if (styleWrapX) {
    let wrappedChild = {}
    // プロパティの移動
    Object.assign(wrappedChild, json)
    for (let member in json) delete json[member]
    // ラップするオブジェクトの作成
    Object.assign(json, {
      type: 'Group',
      name: `wrap-horizontal-item(${node.guid})`,
      layer: wrappedChild.layer,
      rect_transform: {
        pivot: {
          x: 1,
          y: 0,
        },
        anchor_min: {
          x: wrappedChild.rect_transform.anchor_min.x,
          y: 0,
        },
        anchor_max: {
          x: wrappedChild.rect_transform.anchor_max.x,
          y: 1,
        },
        offset_min: {
          x: wrappedChild.rect_transform.offset_min.x,
          y: 0,
        },
        offset_max: {
          x: wrappedChild.rect_transform.offset_max.x,
          y: 0,
        },
      },
      elements: [wrappedChild],
    })
    wrappedChild.rect_transform.anchor_min.x = 0
    wrappedChild.rect_transform.anchor_max.x = 1
    wrappedChild.rect_transform.offset_min.x = 0
    wrappedChild.rect_transform.offset_max.x = 0

    if (style.firstAsBool(STYLE_WRAP_MOVE_LAYOUT_ELEMENT)) {
      if (wrappedChild.layout_element) {
        Object.assign(json, {
          layout_element: wrappedChild.layout_element,
        })
        delete wrappedChild.layout_element
      }
    }
    return
  }
}

/**
 *
 * @param json
 * @param {SceneNode|SceneNodeClass} node
 * @param {SceneNode|SceneNodeClass} root
 * @param funcForEachChild
 * @return {Promise<string>}
 */
async function createGroup(json, node, root, funcForEachChild) {
  let { style } = getNodeNameAndStyle(node)

  /** @type {Group} */
  const nodeGroup = node

  const type = 'Group'
  Object.assign(json, {
    type: type,
    name: getUnityName(node),
    elements: [], // Groupは空でもelementsをもっていないといけない
  })

  // funcForEachChildの前にContentを作成しておく
  // funcForEachChild実行時に、contentグループに入れていくため、事前準備が必要
  addContent(style, json, node)

  let maskNode = node.mask || node
  await funcForEachChild(null, child => {
    // TODO:AdobeXDの問題で　リピートグリッドの枠から外れているものもデータがくるケースがある そういったものを省くかどうか検討
    //return child !== maskNode // maskNodeはFalse 処理をしない 2020/8/24 なぜ処理をしなかったかわからなくなった・・・
    return true
  })

  // 基本
  addGuid(json, node)
  addActive(json, node, style)
  addGlobalDrawBounds(json, node)
  addRectTransform(json, node, style)
  addLayer(json, style)
  addParsedNames(json, node)
  //
  addComponents(json, style)
  addCanvasGroup(json, node, style)
  addLayoutElement(json, node, style)

  addLayoutGroup(json, node, node, node.children, style)
  addContentSizeFitter(json, style)
  addScrollRect(json, node, style)

  addMask(json, style)
  addRectMask2d(json, style)

  // Artboard特有
  addFillColor(json, node)

  addWrap(json, node, style) // エレメント操作のため、処理は最後にする

  // contentが作成されている時
  if (json['content']) {
    // 子供のレイアウトにまつわるStyleをContentに移動する
    // layout-groupが付与されている場合、contentに移動する
    if (style.firstAsBool('create-content-move-layout-group')) {
      if (json['layout_group']) {
        json['content']['layout_group'] = json['layout_group']
        delete json['layout_group']
      }
    }
    // content_size_fitter が付与されている場合、contentに移動する
    if (style.firstAsBool('create-content-move-content-size-fitter')) {
      if (json['content_size_fitter']) {
        json['content']['content_size_fitter'] = json['content_size_fitter']
        delete json['content_size_fitter']
      }
    }
    //contentが作成されていた場合、elementsにいれる
    json.elements.push(json['content'])
    delete json['content']
  }
}

/**
 * @param {string} name
 */
function removeStartDot(name) {
  if (name == null) return null
  if (name.startsWith('.')) {
    name = name.substring(1)
  }
  return name
}

/**
 * @param json
 * @param node
 * @param funcForEachChild
 * @returns {Promise<void>}
 */
async function createScrollbar(json, node, funcForEachChild) {
  let { style } = getNodeNameAndStyle(node)

  const type = 'Scrollbar'
  Object.assign(json, {
    type: type,
    name: getUnityName(node),
    scrollbar: {},
  })

  let scrollbarJson = json['scrollbar']
  let direction = style.first(STYLE_SCROLLBAR_DIRECTION)
  if (direction != null) {
    Object.assign(scrollbarJson, {
      direction,
    })
  }
  let handle_class = style.first(STYLE_SCROLLBAR_HANDLE_TARGET)
  if (handle_class != null) {
    Object.assign(scrollbarJson, {
      handle_class,
    })
  }

  const bounds = getBeforeGlobalBounds(node)
  /*
  const childrenBounds = getBeforeContentGlobalDrawBounds(node)
  const spacingX = bounds.width - childrenBounds.width
  const spacingY = bounds.height - childrenBounds.height
  Object.assign(scrollbarJson, {
    child_spacing_x: spacingX,
    child_spacing_y: spacingY,
  })
   */

  await funcForEachChild()

  // 基本
  addGuid(json, node)
  addActive(json, node, style)
  addGlobalDrawBounds(json, node)
  addRectTransform(json, node, style)
  addLayer(json, style)
  addParsedNames(json, node)
  //
  addCanvasGroup(json, node, style)
  addLayoutElement(json, node, style)
  addLayoutGroup(json, node, node, node.children, style)
  addContentSizeFitter(json, style)
}

/**
 * @param json
 * @param node
 * @param funcForEachChild
 * @returns {Promise<void>}
 */
async function createSlider(json, node, funcForEachChild) {
  let { style } = getNodeNameAndStyle(node)

  const type = 'Slider'
  Object.assign(json, {
    type: type,
    name: getUnityName(node),
    slider: {},
  })

  let sliderJson = json['slider']

  let direction = style.first(STYLE_SLIDER_DIRECTION)
  if (direction != null) {
    Object.assign(sliderJson, {
      direction,
    })
  }

  let fill_rect_name = style.first(STYLE_SLIDER_FILL_RECT_TARGET)
  if (fill_rect_name != null) {
    Object.assign(sliderJson, {
      fill_rect_name,
    })
  }
  let handle_rect_name = style.first(STYLE_SLIDER_HANDLE_RECT_TARGET)
  if (handle_rect_name != null) {
    Object.assign(sliderJson, {
      handle_rect_name,
    })
  }

  const bounds = getBeforeGlobalBounds(node)
  /*
  const childlenBounds = calcGlobalBounds(node.children.filter(_ => true))
  const spacingX = bounds.width - childlenBounds.bounds.width
  const spacingY = bounds.height - childlenBounds.bounds.height
  Object.assign(sliderJson, {
    child_spacing_x: spacingX,
    child_spacing_y: spacingY,
  })
   */

  await funcForEachChild()

  // 基本
  addGuid(json, node)
  addActive(json, node, style)
  addGlobalDrawBounds(json, node)
  addRectTransform(json, node, style)
  addLayer(json, style)
  addParsedNames(json, node)
  //
  addCanvasGroup(json, node, style)
  addLayoutElement(json, node, style)
  addLayoutGroup(json, node, node, node.children, style)
  addContentSizeFitter(json, style)
}

/**
 * @param json
 * @param node
 * @param root
 * @param funcForEachChild
 * @returns {Promise<void>}
 */
async function createToggle(json, node, root, funcForEachChild) {
  let { style } = getNodeNameAndStyle(node)

  Object.assign(json, {
    type: 'Toggle',
    name: getUnityName(node),
    toggle: {},
  })

  const toggleJson = json['toggle']

  // Toggle group
  const group = style.first(STYLE_TOGGLE_GROUP)
  if (group) {
    Object.assign(toggleJson, {
      group,
    })
  }

  const target_graphic = style.values(STYLE_TOGGLE_TRANSITION_TARGET_GRAPHIC)
  if (target_graphic) {
    Object.assign(toggleJson, {
      target_graphic,
    })
  }

  const on_graphic = style.values(STYLE_TOGGLE_ON_GRAPHIC)
  if (on_graphic) {
    Object.assign(toggleJson, {
      on_graphic,
    })
  }

  const graphic_swap = style.first(STYLE_TOGGLE_GRAPHIC_SWAP)
  if (graphic_swap) {
    Object.assign(toggleJson, {
      graphic_swap,
    })
  }

  let transition = style.first(STYLE_TOGGLE_TRANSITION)
  if (transition) {
    Object.assign(toggleJson, {
      transition,
    })
  }

  const highlighted_sprite = style.values(
    STYLE_TOGGLE_TRANSITION_HIGHLIGHTED_SPRITE,
  )
  const pressed_sprite = style.values(STYLE_TOGGLE_TRANSITION_PRESSED_SPRITE)
  const selected_sprite = style.values(STYLE_TOGGLE_TRANSITION_SELECTED_SPRITE)
  const disabled_sprite = style.values(STYLE_TOGGLE_TRANSITION_DISABLED_SPRITE)
  Object.assign(toggleJson, {
    sprite_state: {
      highlighted_sprite,
      pressed_sprite,
      selected_sprite,
      disabled_sprite,
    },
  })

  await funcForEachChild()

  // 基本パラメータ・コンポーネント
  addGuid(json, node)
  addActive(json, node, style)
  addGlobalDrawBounds(json, node)
  addRectTransform(json, node, style)
  addLayer(json, style)
  addParsedNames(json, node)
  //
  addLayoutElement(json, node, style)
  addContentSizeFitter(json, style)
}

/**
 *
 * @param json
 * @param node
 * @param root
 * @param {*|null} funcForEachChild
 * @returns {Promise<string>}
 */
async function createButton(json, node, root, funcForEachChild) {
  let { style } = getNodeNameAndStyle(node)

  const type = 'Button'
  Object.assign(json, {
    type: type,
    name: getUnityName(node),
  })

  if (funcForEachChild) await funcForEachChild() // 子供を作成するかどうか選択できる createImageから呼び出された場合は子供の処理をしない

  const target_graphic = style.values(STYLE_BUTTON_TRANSITION_TARGET_GRAPHIC)
  const highlighted_sprite = style.values(
    STYLE_BUTTON_TRANSITION_HIGHLIGHTED_SPRITE,
  )
  const pressed_sprite = style.values(STYLE_BUTTON_TRANSITION_PRESSED_SPRITE)
  const selected_sprite = style.values(STYLE_BUTTON_TRANSITION_SELECTED_SPRITE)
  const disabled_sprite = style.values(STYLE_BUTTON_TRANSITION_DISABLED_SPRITE)

  const buttonJson = {
    target_graphic,
    sprite_state: {
      highlighted_sprite,
      pressed_sprite,
      selected_sprite,
      disabled_sprite,
    },
  }

  const styleButtonTransition = style.first(STYLE_BUTTON_TRANSITION)
  if (styleButtonTransition) {
    Object.assign(buttonJson, {
      transition: styleButtonTransition,
    })
  }

  Object.assign(json, {
    button: buttonJson,
  })

  // 基本パラメータ
  addGuid(json, node)
  addActive(json, node, style)
  addGlobalDrawBounds(json, node)
  addRectTransform(json, node, style)
  addLayer(json, style)
  addParsedNames(json, node)
  addComponents(json, style)
  addLayoutElement(json, node, style)
}

/**
 * パスレイヤー(楕円や長方形等)の処理
 * @param {*} json
 * @param {SceneNode|SceneNodeClass} node
 * @param {Artboard} root
 * @param {*} outputFolder
 * @param {*} renditions
 * @param localStyle {Style}
 */
async function createImage(
  json,
  node,
  root,
  outputFolder,
  renditions,
  localStyle = null,
) {
  //TODO: 塗りチェック、シャドウチェック、輪郭チェック、全てない場合はイメージコンポーネントも無しにする
  let { style } = getNodeNameAndStyle(node)

  const unityName = getUnityName(node)
  // もしボタンオプションがついているのなら　ボタンを生成してその子供にイメージをつける
  if (style.firstAsBool(STYLE_BUTTON)) {
    // イメージはコンポーネントにするべき? -> グループの場合もあるのでコンポーネントにできない
    //TODO: ただし指定はできても良いはず
    await createButton(json, node, root, null)
    Object.assign(json, {
      elements: [
        {
          type: 'Image',
          name: unityName + ' image',
        },
      ],
    })

    // imageの作成
    await addImage(
      json.elements[0],
      node,
      root,
      outputFolder,
      renditions,
      localStyle,
    )
    //ボタン画像はボタンとぴったりサイズをあわせる
    let imageJson = json['elements'][0]
    Object.assign(imageJson, {
      rect_transform: {
        anchor_min: { x: 0, y: 0 },
        anchor_max: { x: 1, y: 1 },
        offset_min: { x: 0, y: 0 },
        offset_max: { x: 0, y: 0 },
      },
    })
    // レイヤーは親と同じ物を使用 activeかどうかは設定せず、親に依存するようにする
    addLayer(imageJson, style)
  } else {
    Object.assign(json, {
      type: 'Image',
      name: unityName,
    })
    // 基本パラメータ
    addGuid(json, node)
    addActive(json, node, style)
    addGlobalDrawBounds(json, node)
    addRectTransform(json, node, style)
    addLayer(json, style)
    addParsedNames(json, node)
    addLayoutElement(json, node, style)
    // assignComponent
    if (style.first(STYLE_COMPONENT) != null) {
      Object.assign(json, {
        component: {},
      })
    }
    await addImage(json, node, root, outputFolder, renditions, localStyle)
    addWrap(json, node, style) // エレメントに操作のため、処理は最後にする
  }

  //
  const imageDataValues = style.values(
    STYLE_REPEATGRID_ATTACH_IMAGE_DATA_SERIES,
  )
  if (imageDataValues && imageDataValues.length > 0) {
    console.log('image data series')
    let repeatGrid = getAncestorRepeatGrid(node)

    const dataSeries = []
    for (let value of imageDataValues) {
      if (value.startsWith('data:image/')) {
        let imageFill = new ImageFill(value)
        dataSeries.push(imageFill)
      } else {
        let imageNode = searchNode(value)
        dataSeries.push(imageNode.fill)
      }
    }
    repeatGrid.attachImageDataSeries(node, dataSeries)
  }
}

/**
 *
 * @param json
 * @param {SceneNode|SceneNodeClass} node
 * @param {SceneNode|SceneNodeClass} root
 * @param funcForEachChild
 * @return {Promise<string>}
 */
async function createPrefabInstance(json, node, root, funcForEachChild) {
  let { style } = getNodeNameAndStyle(node)
  const masterNode = getPrefabNodeFromNode(node)
  const masterPath = getLayoutPathFromNode(masterNode)

  Object.assign(json, {
    type: 'Instance',
    name: getUnityName(node),
    master: masterPath,
  })

  // instance以下の情報もlayout.jsonに渡す
  // addContentをここでもするかどうか検討
  let maskNode = node.mask || node
  await funcForEachChild(null, child => {
    // TODO:AdobeXDの問題で　リピートグリッドの枠から外れているものもデータがくるケースがある そういったものを省くかどうか検討
    //return child !== maskNode // maskNodeはFalse 処理をしない 2020/8/24 なぜ処理をしなかったかわからなくなった・・・
    return true
  })

  // 基本
  addGuid(json, node)
  addActive(json, node, style)
  addGlobalDrawBounds(json, node)
  addRectTransform(json, node, style)
  addLayer(json, style)
  addParsedNames(json, node)
  // このPrefabがVerticalLayoutの中にはいっている場合等
  // この情報が必要になる
  addLayoutElement(json, node, style)
}

/**
 * Root用のRectTransform
 * Rootの親のサイズにピッタリはまるようにする
 * @param layoutJson
 * @param node
 * @param funcForEachChild
 * @returns {Promise<void>}
 */
function addRectTransformRoot(layoutJson, node) {
  let { style } = getNodeNameAndStyle(node)
  Object.assign(layoutJson, {
    rect_transform: {
      // Artboardは親のサイズにぴったりはまるようにする
      anchor_min: {
        x: 0,
        y: 0,
      },
      anchor_max: {
        x: 1,
        y: 1,
      },
      offset_min: {
        x: 0,
        y: 0,
      },
      offset_max: {
        x: 0,
        y: 0,
      },
    },
  })
  if (
    node.fillEnabled === true &&
    node.fill != null &&
    node.fill instanceof Color
  ) {
    Object.assign(layoutJson, {
      fill_color: node.fill.toHex(true),
    })
  }
}

function addFillColor(layoutJson, node) {
  if (
    node.fillEnabled === true &&
    node.fill != null &&
    node.fill instanceof Color
  ) {
    Object.assign(layoutJson, {
      fill_color: node.fill.toHex(true),
    })
  }
}

/**
 * マスクの追加
 * @param json
 * @param style
 */
function addMask(json, style) {
  if (!style.firstAsBool(STYLE_MASK)) return
  json['mask'] = {}
  const jsonMask = json['mask']
  const show = style.firstAsNullOrBool(STYLE_SHOW_MASK_GRAPHIC)
  if (show !== null) {
    Object.assign(jsonMask, { show_mask_graphic: show })
  }
}

/**
 * TextNodeの処理
 * 画像になるか、Textコンポーネントをもつ
 * @param {*} json
 * @param {SceneNode|SceneNodeClass} node
 * @param {Artboard} artboard
 * @param {*} outputFolder
 * @param {[]} renditions
 */
async function createText(json, node, artboard, outputFolder, renditions) {
  let { style } = getNodeNameAndStyle(node)
  // console.log(`createText ${node.name} style:`, style.style)

  /** @type {scenegraph.Text} */
  let nodeText = node

  // コンテンツ書き換え対応
  const styleTextContent = style.first(STYLE_TEXT_SET_TEXT)
  if (styleTextContent) {
    /** @type {SymbolInstance} */
    const si = nodeText.parent
    // RepeatGrid内は操作できない
    // コンポーネント内は操作できない　例外としてインスタンスが生成されていないマスターは操作できる
    if (selection.isInEditContext(nodeText)) {
      nodeText.text = styleTextContent
    } else {
      // globalErrorLog.push(`error: コンテンツ書き換えができない ${node.name}`)
    }
  }

  const styleValuesAttachText = style.values(
    STYLE_REPEATGRID_ATTACH_TEXT_DATA_SERIES,
  )
  if (styleValuesAttachText) {
    let repeatGrid = getAncestorRepeatGrid(nodeText)
    if (repeatGrid) {
      repeatGrid.attachTextDataSeries(nodeText, styleValuesAttachText)
    }
  }

  let type = 'Text'
  if (style.firstAsBool(STYLE_TEXTMP)) {
    type = 'TextMeshPro'
  }

  let textType = 'point'
  let hAlign = nodeText.textAlign
  let vAlign = 'middle'
  if (nodeText.areaBox) {
    // エリア内テキストだったら
    textType = 'paragraph'
    // 上揃え
    vAlign = 'upper'
  }

  // @ALIGN オプションがあった場合､上書きする
  const styleAlign = style.first(STYLE_ALIGN)
  if (styleAlign != null) {
    hAlign = styleAlign
  }

  // @v-align オプションがあった場合、上書きする
  // XDでは、left-center-rightは設定できるため
  const styleVAlign = style.first(STYLE_V_ALIGN)
  if (styleVAlign != null) {
    vAlign = styleVAlign
  }

  // text.styleRangesの適応をしていない
  Object.assign(json, {
    type: type,
    name: getUnityName(node),
    text: {
      text: nodeText.text,
      textType: textType,
      font: nodeText.fontFamily,
      style: nodeText.fontStyle,
      size: getBeforeTextFontSize(nodeText) * globalScale, // アートボードの伸縮でfontSizeが変わってしまうため、保存してある情報を使う
      color: nodeText.fill.toHex(true),
      align: hAlign + vAlign,
      opacity: 100,
    },
  })

  // 基本パラメータ
  addGuid(json, node)
  addActive(json, node, style)
  addGlobalDrawBounds(json, node)
  //TODO:Drawではなく、通常のレスポンシブパラメータを渡すべきか　シャドウ等のエフェクトは自前でやる必要があるため
  addRectTransform(json, node, style)
  addLayer(json, style)
  addParsedNames(json, node)
}

/**
 * @param {string} nodeName
 * @return {SceneNode|null}
 */
function searchNode(nodeName) {
  let found = null
  traverseNode(root, node => {
    if (node.name === nodeName) {
      found = node
      return false
    }
  })
  return found
}

/**
 * func : node => {}  nodeを引数とした関数
 * @param {SceneNode|SceneNodeClass} node
 * @param {*} func
 */
function traverseNode(node, func) {
  let result = func(node)
  if (result === false) return // 明確なFalseの場合、子供へはいかない
  node.children.forEach(child => {
    traverseNode(child, func)
  })
}

/**
 * Root処理
 * @param {*} renditions
 * @param outputFolder
 * @param {SceneNode|SceneNodeClass} root
 */
async function createRoot(renditions, outputFolder, root) {
  let layoutJson = createInitialLayoutJson(root)

  let traverse = async (nodeStack, json, depth, enableWriteToLayoutJson) => {
    let node = nodeStack[nodeStack.length - 1]
    // レイヤー名から名前とオプションの分割
    let { style } = getNodeNameAndStyle(node)

    // コメントアウトチェック
    if (style.firstAsBool(STYLE_COMMENT_OUT)) {
      return
    }

    // 子Node処理関数
    /**
     * @param numChildren
     * @param funcFilter
     * @returns {Promise<void>}
     */
    let funcForEachChild = async (numChildren = null, funcFilter = null) => {
      // layoutJson,node,nodeStackが依存しているため、グローバル関数化しない
      const maxNumChildren = node.children.length
      if (numChildren == null) {
        numChildren = maxNumChildren
      } else if (numChildren > maxNumChildren) {
        numChildren = maxNumChildren
      }
      if (numChildren > 0) {
        json.elements = []
        // 後ろから順番に処理をする
        // 描画順に関わるので､非同期処理にしない
        for (let i = numChildren - 1; i >= 0; i--) {
          let child = node.children.at(i)
          if (funcFilter) {
            // Filter関数を呼び出し､Falseならばスキップ
            if (!funcFilter(child)) continue
          }
          let childJson = {}
          nodeStack.push(child)
          await traverse(
            nodeStack,
            childJson,
            depth + 1,
            enableWriteToLayoutJson,
          )
          nodeStack.pop()
          // なにも入っていない場合はelementsに追加しない
          if (enableWriteToLayoutJson && Object.keys(childJson).length > 0) {
            let pushTo = json.elements
            if (isContentChild(child) && json.content) {
              pushTo = json.content.elements
            }
            pushTo.push(childJson)
          }
        }
      }
    }

    if (root != node && isPrefabInstanceNode(node)) {
      // インスタンスノードをみつけた
      // console.log('find layout root node.')
      let { style } = getNodeNameAndStyle(node)
      if (style.firstAsNullOrBool(STYLE_INSTANCE_IF_POSSIBLE) !== false) {
        // 明確なFALSEでなければ
        await createPrefabInstance(json, node, root, funcForEachChild)
        return
      }
    }

    // nodeの型で処理の分岐
    let constructorName = node.constructor.name
    // console.log(`${node.name} constructorName:${constructorName}`)
    switch (constructorName) {
      case 'SymbolInstance':
        if (globalFlagSymbolInstanceAsPrefab) {
          if (json['type'] !== 'Root') {
            Object.assign(json, {
              symbolInstance: getUnityName(node),
            })
          }
        }
      case 'Artboard':
      case 'ScrollableGroup':
      case 'Group':
      case 'RepeatGrid':
      case 'BooleanGroup':
      case 'Line':
      case 'Ellipse':
      case 'Rectangle':
      case 'Path':
      case 'Polygon':
      case 'Text':
        {
          if (style.firstAsBool(STYLE_IMAGE)) {
            // console.log('groupでのSTYLE_IMAGE処理 子供のコンテンツ変更は行うが、イメージ出力はしない')
            enableWriteToLayoutJson = false //TODO: 関数にわたす引数にならないか
            let tempOutputFolder = outputFolder
            outputFolder = null
            await funcForEachChild()
            outputFolder = tempOutputFolder
            await createImage(json, node, root, outputFolder, renditions)
            return
          }
          if (
            style.firstAsBool(STYLE_TEXT) ||
            style.firstAsBool(STYLE_TEXTMP)
          ) {
            await createText(json, node, root, outputFolder, renditions)
            await funcForEachChild()
            break
          }
          if (style.firstAsBool(STYLE_BUTTON)) {
            await createButton(json, node, root, funcForEachChild)
            return
          }
          if (style.firstAsBool(STYLE_SLIDER)) {
            await createSlider(json, node, funcForEachChild)
            return
          }
          if (style.firstAsBool(STYLE_SCROLLBAR)) {
            await createScrollbar(json, node, funcForEachChild)
            return
          }
          if (style.firstAsBool(STYLE_TOGGLE)) {
            await createToggle(json, node, root, funcForEachChild)
            return
          }
          if (style.firstAsBool(STYLE_INPUT)) {
            await createInput(json, node, root, funcForEachChild)
            return
          }
          // 通常のグループ
          await createGroup(json, node, root, funcForEachChild)
        }
        break
      default:
        console.log('**error** type:' + constructorName)
        await funcForEachChild()
        break
    }
  }

  await traverse([root], layoutJson.root, 0, true)

  return layoutJson
}

/**
 *
 * @param node {SceneNode}
 * @returns {string}
 * @constructor
 */
function nodeToFolderName(node) {
  let name = node.name
  const parsed = cssParseNodeName(getNodeName(node))
  if (parsed) {
    if (parsed.id) name = parsed.id
    else if (parsed.tagName) name = parsed.tagName
  }

  // フォルダ名に使えない文字を'_'に変換
  return replaceToFileName(name, true)
}

async function createSubFolder(outputFolder, subFolderName) {
  let subFolderNames = subFolderName.split('/')
  for (let subFolderName of subFolderNames) {
    let entries = await outputFolder.getEntries()
    let subFolder = entries.find(entry => {
      return entry.name === subFolderName
    })
    if (subFolder && subFolder.isFile) {
      throw 'can not create output folder.'
    }
    if (!subFolder) {
      console.log(`- create output folder:${subFolderName}`)
      subFolder = await outputFolder.createFolder(subFolderName)
    }
    outputFolder = subFolder
  }
  return outputFolder
}

let globalSymbolIdToPrefabGuid = {}

function getPrefabNodeFromNode(node) {
  const symbolId = node.symbolId
  if (!symbolId) return null
  const guid = globalSymbolIdToPrefabGuid[symbolId]
  if (guid == null) return null
  return scenegraph.getNodeByGUID(guid)
}

/**
 * XdUnityUI export
 * @param {SceneNode[]} roots
 * @param outputFolder
 * @returns {Promise<void>}
 */
async function exportXuid(roots, outputFolder) {
  // ラスタライズする要素を入れる
  let renditions = []

  console.log(`## export ${roots.length} roots`)

  for (let root of roots) {
    console.log(`### ${root.name}`)
    console.log('- reset global variables')
    resetGlobalVariables()

    console.log('- load CSS')
    globalCssRules = await loadCssRules(
      await fs.getPluginFolder(),
      'default.css',
    )
    console.log(`  - loaded default.css (num rules:${globalCssRules.length})`)
    if (globalAddtionalCssFolder != null) {
      // console.log('  - load additional default.css')
      const additionalCssRules = await loadCssRules(
        globalAddtionalCssFolder,
        'default.css',
      )
      if (additionalCssRules) {
        console.log(
          `  - loaded additional default.css (num rules:${additionalCssRules.length})`,
        )
        globalCssRules = globalCssRules.concat(additionalCssRules)
      }
    }

    const rootName = getUnityName(root)
    const rootFilename = replaceToFileName(rootName)

    try {
      if (globalAddtionalCssFolder) {
        // 追加CSSフォルダが設定されているのなら、アートボード専用CSSを読み込む
        const rootCssFilename = rootFilename + '.css'
        const artboardCssRules = await loadCssRules(
          globalAddtionalCssFolder,
          rootCssFilename,
        )
        if (artboardCssRules) {
          globalCssRules = globalCssRules.concat(artboardCssRules)
        }
      }
    } catch (e) {
      // console.log(`**error** failed to load: ${artboardCssFilename}`)
      //console.log(e.message)
      //console.log(e.stack)
    }
    globalCssVars = createCssVars(globalCssRules)

    // createRenditionsの前にすべて可視にする
    // 正常なBoundsを得るために、makeBoundsの前にやる
    // TODO: これによりvisible情報が取得できなくなった
    console.log('- visible all nodes')
    for (let root of roots) {
      traverseNode(root, node => {
        const { node_name: nodeName, style } = getNodeNameAndStyle(node)
        if (style.firstAsBool(STYLE_COMMENT_OUT)) {
          return false // 子供には行かないようにする
        }
        globalVisibleInfo[node.guid] = node.visible
        if (!node.visible) {
          if (!selection.isInEditContext(node)) {
            const message = `warning: ${root.name}/${node.parent.name}/${node.name}<br>> May not output need image. Could not change visible parameter out edit context.`
            globalErrorLog.push(message)
            console.log(message)
          } else {
            node.visible = true
          }
        }
        // IMAGEであった場合、そのグループの不可視情報はそのまま活かすため
        // 自身は可視にし、子供の不可視情報は生かす
        // 本来は sourceImageをNaturalWidth,Heightで出力する
        // TODO: Pathなど、レンダリングされるものもノータッチであるべきではないか
        if (style.firstAsBool(STYLE_IMAGE)) {
          return false
        }
      })
    }

    console.log('- make GlobalBounds')
    await makeGlobalBoundsRectTransform(root)

    /** @type {Folder} */
    let subFolder
    // アートボード毎にフォルダを作成する
    if (!globalFlagChangeContentOnly && outputFolder) {
      console.log('- create sub folder')
      let subFolderName = rootFilename
      // サブフォルダ名を取得
      const parsedName = cssParseNodeName(root.name)
      if (parsedName.folder) {
        // subFolderName = replaceToFileName(parsedName.folder)
        subFolderName = parsedName.folder
      }
      subFolder = await createSubFolder(outputFolder, subFolderName)
    }

    console.log('- create layout json')
    const layoutJson = await createRoot(renditions, subFolder, root)

    if (!globalFlagChangeContentOnly) {
      const layoutJsonString = JSON.stringify(layoutJson, null, '  ')
      const layoutFileName = rootFilename + '.layout.json'
      if (subFolder) {
        const layoutFile = await subFolder.createFile(layoutFileName, {
          overwrite: true,
        })
        // レイアウトファイルの出力
        await layoutFile.write(layoutJsonString)
      }
    }
    console.log('- done')
  }

  const exportFile = await outputFolder.createFile('xuid-export.json', {
    overwrite: true,
  })
  await exportFile.write('{}')

  if (renditions.length !== 0 && !globalFlagImageNoExport) {
    console.log('## image export')

    // 一括画像ファイル出力
    await application
      .createRenditions(renditions)
      .then(() => {
        console.log(`- saved ${renditions.length} image file(s)`)
      })
      .catch(error => {
        //console.log(renditions)
        console.log('画像ファイル出力エラー:' + error)
        for (let rendition of renditions) {
          console.log(rendition)
        }
        // 出力失敗に関しての参考サイト
        // https://forums.adobexdplatform.com/t/details-for-io-failed/1185/14
        // Adobe ファイルのインポート・エキスポートについて
        // https://helpx.adobe.com/xd/kb/import-export-issues.html
        console.log(
          '1)access denied (disk permission)\n2)readonly folder\n3)not enough disk space\n4)maximum path\n5)image size 0px',
        )
        alert(getString(strings.ExportError), 'Export error')
      })
  } else {
    // 画像出力の必要がなければ終了
    // alert('no outputs')
  }
}

async function checkLatestVersion() {
  let xhr = new XMLHttpRequest()
  xhr.open('GET', 'http://i0pl.us/XdUnityUI', true)
  xhr.onload = function(e) {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        // console.log(xhr.responseText)
      } else {
        console.error(xhr.statusText)
      }
    }
  }
  xhr.onerror = function(e) {
    console.error(xhr.statusText)
  }
  xhr.send(null)
}

/**
 * 選択されたものがExportに適しているかチェックし
 * 適しているノードならば返す
 * ・ルート直下のノードを１つ選択している
 * ・ロックされていない
 * @param selection
 * @return {Promise<null|*>}
 */
async function getExportNodeFromSelection(selection) {
  if (selection.items.length !== 1) {
    return null
  }
  let node = selection.items[0]
  try {
    let parent = node.parent
    if (!(parent instanceof Artboard)) return null
  } catch (e) {
    return null
  }
  return node
}

/**
 * Shorthand for creating Elements.
 * @param {*} tag The tag name of the element.
 * @param {*} [props] Optional props.
 * @param {*} children Child elements or strings
 */
function h(tag, props, ...children) {
  let element = document.createElement(tag)
  if (props) {
    if (props.nodeType || typeof props !== 'object') {
      // 例えばTextであったりした場合、処理をchildrenに回す
      children.unshift(props)
    } else {
      for (const name in props) {
        let value = props[name]
        if (name === 'style') {
          Object.assign(element.style, value)
        } else {
          element.setAttribute(name, value)
          element[name] = value
        }
      }
    }
  }
  for (let child of children) {
    // 子供がTextであった場合、spanで作成する
    if (typeof child === 'object') {
      element.appendChild(child)
    } else {
      let e = document.createElement('span')
      e.innerHTML = child
      element.appendChild(e)
    }
  }
  return element
}

/**
 * alertの表示
 * @param {string} message
 * @param {string=} title
 */
async function alert(message, title) {
  if (title == null) {
    title = 'Xuid Unity Export'
  }
  let dialog = h(
    'dialog',
    h(
      'form',
      {
        method: 'dialog',
        style: {
          width: 500,
        },
      },
      h('h1', title),
      h('hr'),
      h('div', message),
      h(
        'footer',
        h(
          'button',
          {
            uxpVariant: 'primary',
            onclick(e) {
              dialog.close()
            },
          },
          'Close',
        ),
      ),
    ),
  )
  document.body.appendChild(dialog)
  return dialog.showModal()
}

/**
 *
 * @param {Selection} selection
 * @param {RootNode} root
 * @returns {Promise<void>}
 */
async function pluginExportXdUnityUI(selection, root) {
  console.log('# export plugin')

  // 開発者モードの判定
  // プラグインフォルダから判定する
  let pluginFolderPath = (await fs.getPluginFolder()).nativePath
  pluginFolderPath = pluginFolderPath.replace(/\\/g, '/')
  const isDeveloperMode = pluginFolderPath.endsWith('/develop/XuidUnityExport')

  checkLatestVersion().then(r => {})

  // エキスポートマークがついたものだけ出力するオプションは、毎回オフにする
  globalCheckMarkedForExport = false

  let optionOutputFolder
  let optionOutputScale
  let errorLabel
  let exportMessage
  let checkComponentInstanceAsPrefab
  let checkImageNoExport
  let checkCheckMarkedForExport
  let checkChangeContentOnly
  let optionExternalCssFolder

  const divStyle = {
    style: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: '2em',
      //alignItems: 'middle',
      //verticalAlign: 'middle',
      //textAlign: 'middle',
      //justifyContent: "space-between",
    },
  }
  let dialog = h(
    'dialog',
    h(
      'form',
      {
        method: 'dialog',
        style: {
          width: 500,
        },
      },
      h('h1', 'Xuid Unity Export'),
      h('hr'),
      h('label', getString(strings.ExportDialogSelected)),
      h('br'),
      h(
        'label',
        divStyle,
        (exportMessage = h(
          'textarea',
          { width: '400px', height: 140, readonly: true, userSelect: 'none' },
          createMessageFromExportRoot(getExportRoots(selection.items)),
        )),
      ),
      h('br'),
      h(
        'label',
        divStyle,
        (checkCheckMarkedForExport = h('input', {
          type: 'checkbox',
          async onclick(e) {
            globalCheckMarkedForExport = checkCheckMarkedForExport.checked
            exportMessage.value = createMessageFromExportRoot(
              getExportRoots(selection.items),
            )
          },
        })),
        getString(strings.ExportDialogOptionCheckExportMark),
      ),
      h('hr'),
      h('label', getString(strings.ExportDialogOutput)),
      h('br'),
      // input folder
      h(
        'label',
        divStyle,
        h('span', { width: '70' }, 'Folder'),
        (optionOutputFolder = h('input', {
          width: '250',
          readonly: true,
          border: 0,
        })),
        h(
          'button',
          {
            async onclick(e) {
              let folder = await fs.getFolder()
              if (folder != null) {
                optionOutputFolder.value = folder.nativePath
                globalOutputFolder = folder
              }
            },
          },
          '...',
        ),
      ),
      h('br'),
      h(
        'label',
        divStyle,
        h('span', { width: '70' }, 'Scale'),
        (optionOutputScale = h('input', {
          value: '4.0',
        })),
      ),
      h('br'),
      // no export image.
      h(
        'label',
        divStyle,
        (checkImageNoExport = h('input', {
          type: 'checkbox',
        })),
        getString(strings.ExportDialogOptionNotExportImage),
      ),
      !isDeveloperMode
        ? h('br')
        : h(
            'br',
            h('hr'),
            h('label', getString(strings.ExportDialogUnderDevelopmentOptions)),
            h('br'),
            h(
              'label',
              divStyle,
              h('span', { width: '70' }, 'Additional CSS folder'),
              (optionExternalCssFolder = h('input', {
                width: '150',
                readonly: true,
                border: 0,
              })),
              h(
                'button',
                {
                  async onclick(e) {
                    let folder = await fs.getFolder()
                    if (folder != null) {
                      optionExternalCssFolder.value = folder.nativePath
                      globalAddtionalCssFolder = folder
                    }
                  },
                },
                '...',
              ),
              h(
                'button',
                {
                  uxpVariant: 'primary',
                  onclick(e) {
                    dialog.close('change values')
                  },
                },
                'Change Values',
              ),
            ),
            h('hr'),
          ),
      (errorLabel = h('div', divStyle, '')),
      h(
        'footer',
        h(
          'button',
          {
            uxpVariant: 'primary',
            onclick(e) {
              dialog.close()
            },
          },
          'Cancel',
        ),
        h(
          'button',
          {
            uxpVariant: 'cta',
            onclick(e) {
              // 出力できる状態かチェック
              // スケールの値が正常か
              let tmpScale = Number.parseFloat(optionOutputScale.value)
              if (Number.isNaN(tmpScale)) {
                errorLabel.textContent = 'invalid scale value'
                return
              }

              globalScale = tmpScale
              // optionSymbolInstanceAsPrefab = checkComponentInstanceAsPrefab.checked
              globalFlagImageNoExport = checkImageNoExport.checked
              globalCheckMarkedForExport = checkCheckMarkedForExport.checked
              //optionChangeContentOnly = checkChangeContentOnly.checked

              // 出力フォルダは設定してあるか
              if (!globalFlagChangeContentOnly && globalOutputFolder == null) {
                errorLabel.textContent = 'invalid output folder'
                return
              }

              dialog.close('export')
            },
          },
          'Export',
        ),
      ),
      h('br'),
      h(
        'a',
        {
          href:
            'https://docs.google.com/document/d/1Y5kOxUkgc7bwztax4pNED8g-1XPgnoS0VwA0lb-2TpE/edit?usp=sharing',
        },
        'XuidUnity Document',
      ),
    ),
  )

  // 出力前にセッションデータをダイアログに反映する
  // Scale
  optionOutputScale.value = globalScale
  // Folder
  optionOutputFolder.value = ''
  if (globalOutputFolder != null) {
    optionOutputFolder.value = globalOutputFolder.nativePath
  }
  if (globalAddtionalCssFolder != null) {
    optionExternalCssFolder.value = globalAddtionalCssFolder.nativePath
  }
  // Responsive Parameter
  // checkComponentInstanceAsPrefab.checked = optionSymbolInstanceAsPrefab
  checkImageNoExport.checked = globalFlagImageNoExport
  checkCheckMarkedForExport.checked = globalCheckMarkedForExport
  // checkChangeContentOnly.checked = optionChangeContentOnly

  // Dialog表示
  document.body.appendChild(dialog)
  let result = await dialog.showModal()

  switch (result) {
    case 'export':
      globalFlagChangeContentOnly = false
      {
        let exportRoots = await getExportRoots(selection.items)

        if (exportRoots.length === 0) {
          await alert(getString(strings.ExportErrorNoTarget))
          return
        }

        try {
          // 出力ノードリスト
          /**
           * @type {SceneNode[]}
           */
          await exportXuid(exportRoots, globalOutputFolder)
          const log = [...new Set(globalErrorLog)].slice(0, 10).join('<br><br>')
          await alert(log ? log : 'Done.')
        } catch (e) {
          console.log(e)
          console.log(e.stack)
          await alert(e.message, 'error')
        }

        console.log('## end process')

        // データをもとに戻すため､意図的にエラーをスローする
        if (!globalFlagChangeContentOnly) {
          console.log('- throw error,undo changes')
          throw 'throw error for UNDO'
        }
        break
      }
    case 'change values':
      globalFlagChangeContentOnly = true
      let exportRoots = await getExportRoots(selection.items)

      if (exportRoots.length === 0) {
        await alert(getString(strings.ExportErrorNoTarget))
        return
      }

      try {
        // 出力ノードリスト
        /**
         * @type {SceneNode[]}
         */
        await exportXuid(exportRoots, null)
        const log = [...new Set(globalErrorLog)].slice(0, 10).join('<br><br>')
        await alert(log ? log : 'Done.')
      } catch (e) {
        console.log(e)
        console.log(e.stack)
        await alert(e.message, 'error')
      }

      console.log('## end process')
      break
    default:
      console.log(`unknown command: ${result}`)
      break
  }
}

/**
 *
 * @param selectionItems {SceneNode[]}
 * @returns SceneNode[]
 */
function getExportRoots(selectionItems) {
  if (!selectionItems) return null

  let exportRoots = new Set()

  for (let selectionItem of selectionItems) {
    if (globalCheckMarkedForExport && !selectionItem.markedForExport) {
    } else {
      exportRoots.add(selectionItem)
    }
  }

  // 全体から出力するPrefabノードを探す
  traverseNode(scenegraph.root, node => {
    if (node.constructor.name === 'SymbolInstance') {
      if (isPrefabNode(node)) {
        // console.log('found prefab', node.guid, node.symbolId)
        globalSymbolIdToPrefabGuid[node.symbolId] = node.guid
      }
    }
  })

  // 出力するノードから、必要なPrefabノードを選出し、出力リストに追加する
  for (let root of exportRoots) {
    globalOutputFileDependency[root.guid] = {}
    traverseNode(root, node => {
      if (root === node) return
      if (isPrefabInstanceNode(node)) {
        // console.log('found prefab instance:', prefabNode.name)
        const prefabNode = getPrefabNodeFromNode(node)
        exportRoots.add(prefabNode)
        globalOutputFileDependency[root.guid][prefabNode.guid] = prefabNode
      }
    })
  }

  return Array.from(exportRoots)
}

/**
 *
 * @param roots {SceneNodeClass[]}
 */
function createMessageFromExportRoot(roots) {
  let message = ''
  for (let root of roots) {
    let typeName = root.constructor.name
    if (isPrefabNode(root)) {
      typeName = 'Prefab'
    }
    message += `[${typeName}] ${root.name} \n`
  }
  return message
}

/**
 * レスポンシブパラメータを取得し､名前に反映する
 * @param {*} selection
 * @param {*} root
 */
async function pluginResponsiveParamName(selection, root) {
  let selectionItems = selection.items
  // レスポンシブパラメータの作成
  globalResponsiveBounds = {}
  // TODO: selectionItemsで、 for..of ループができるか、確認必要。 makeResponsiveBoundsで、await処理がないため、問題ないように見えてしまう可能性あり。
  for (const item of selectionItems) {
    // あとで一括変化があったかどうか調べるため､responsiveBoundsにパラメータを追加していく
    await makeGlobalBoundsRectTransform(item)
    let func = node => {
      if (node.symbolId) return
      const param = calcRectTransform(node)
      if (param) {
        let styleFix = []
        for (let key in param.fix) {
          if (param.fix[key] === true) {
            styleFix.push(key[0])
          }
        }
        if (styleFix.length > 0) {
          let name = node.name.replace(/ +@fix=[a-z_\-]+/, '')
          let fixStr = styleFix
            .join('-')
            .replace('l-r', 'x') // 左右固定
            .replace('t-b', 'y') // 上下固定
            .replace('w-h', 'size') // サイズ固定
            .replace('x-y-size', 'size') // グループのresizeをやったところ､topleftも動いてしまったケース sizeのみにする
          try {
            node.name = name + ' @fix=' + fixStr
          } catch (e) {}
        }
      }
      node.children.forEach(child => {
        func(child)
      })
    }
    func(item)
  }

  console.log('@fix:done')

  // データをもとに戻すため､意図的にエラーをスローすると､付加した情報も消えてしまう
  // Artboardをリサイズしてもとに戻しても、まったく同じ状態には戻らない
}

class CssSelector {
  /**
   * @param {string} selectorText
   */
  constructor(selectorText) {
    if (!selectorText) {
      throw 'CssSelectorがNULLで作成された'
    }
    // console.log("SelectorTextをパースします",selectorText)
    this.json = cssSelectorParser.parse(selectorText.trim())
    /*
      console.log(
        'SelectorTextをパースした',
        JSON.stringify(this.json, null, '  '),
      )
       */
  }

  /**
   * 擬似クラスの:rootであるか
   * @return {boolean}
   */
  isRoot() {
    const rule = this.json['rule']
    if (!rule) return false
    const pseudos = rule['pseudos']
    // console.log("isRoot() pseudos確認:", pseudos)
    return pseudos && pseudos[0].name === 'root'
  }

  /**
   *
   * @param {{name:string, parent:*}} node
   * @param {{type:string, classNames:string[], id:string, tagName:string, pseudos:*[], nestingOperator:string, rule:*, selectors:*[] }|null} rule
   * @param verboseLog
   * @return {null|*}
   */
  matchRule(node, rule = null, verboseLog = false) {
    if (verboseLog) console.log('# matchRule')
    if (!rule) {
      rule = this.json
    }
    if (!rule) {
      return null
    }
    let checkNode = node
    let ruleRule = rule.rule
    switch (rule.type) {
      case 'rule': {
        if (verboseLog) console.log('## type:rule')
        // まず奥へ入っていく
        if (ruleRule) {
          checkNode = this.matchRule(node, ruleRule, verboseLog)
          if (!checkNode) {
            return null
          }
        }
        break
      }
      case 'selectors': {
        if (verboseLog) console.log('## type:selectors')
        // 複数あり、どれかに適合するかどうか
        for (let selector of rule.selectors) {
          ruleRule = selector.rule
          checkNode = this.matchRule(node, ruleRule, verboseLog)
          if (checkNode) break
        }
        if (!checkNode) {
          return null
        }
        break
      }
      case 'ruleSet': {
        if (verboseLog) console.log('## type:ruleSet')
        return this.matchRule(node, ruleRule, verboseLog)
      }
      default:
        return null
    }
    if (ruleRule && ruleRule.nestingOperator === null) {
      if (verboseLog) console.log('nullオペレータ確認をする')
      while (checkNode) {
        let result = this.check(checkNode, rule, verboseLog)
        if (result) {
          if (verboseLog) console.log('nullオペレータで整合したものをみつけた')
          return checkNode
        }
        checkNode = checkNode.parent
      }
      if (verboseLog)
        console.log('nullオペレータで整合するものはみつからなかった')
      return null
    }
    let result = this.check(checkNode, rule, verboseLog)
    if (!result) {
      if (verboseLog) console.log('このruleは適合しなかった')
      return null
    }
    if (verboseLog) console.log('check成功')
    if (
      rule.nestingOperator === '>' ||
      (rule.nestingOperator == null && rule.nestingOperator !== undefined)
    ) {
      if (verboseLog)
        console.log(
          `nestingオペレータ${rule.nestingOperator} 確認のため、checkNodeを親にすすめる`,
        )
      checkNode = checkNode.parent
      if (verboseLog && !checkNode) {
        console.log(`checkNodeを親にすすめたがNullだった->失敗になる可能性`)
      }
    }
    return checkNode
  }

  /**
   * @param {{name:string, parent:*}} node マスクチェックのために node.maskとすることがある
   * @param {{type:string, classNames:string[], id:string, tagName:string, attrs:*[], pseudos:*[], nestingOperator:string, rule:*, selectors:*[] }|null} rule
   * @return {boolean}
   */
  check(node, rule, verboseLog = false) {
    if (!node) return false
    const nodeName = node.name.trim()
    const parsedNodeName = cssParseNodeName(nodeName)
    if (verboseLog) {
      console.log('# CssSelector.check')
      console.log('- name:', node.name)
      console.log(parsedNodeName)
      console.log('## 以下のruleと照らし合わせる')
      console.log(rule)
    }
    if (rule.tagName && rule.tagName !== '*') {
      if (
        rule.tagName !== parsedNodeName.tagName &&
        rule.tagName !== nodeName
      ) {
        if (verboseLog) console.log('tagNameが適合しない')
        return false
      }
    }
    if (rule.id && rule.id !== parsedNodeName.id) {
      if (verboseLog) console.log('idが適合しない')
      return false
    }
    if (rule.classNames) {
      if (!parsedNodeName.classNames) {
        if (verboseLog) console.log('ruleはclassを求めたがclassが無い')
        return false
      }
      for (let className of rule.classNames) {
        if (!parsedNodeName.classNames.find(c => c === className)) {
          if (verboseLog) console.log('classが適合しない')
          return false
        }
      }
    }
    if (rule.attrs) {
      // console.log('attrチェック')
      for (let attr of rule.attrs) {
        if (!this.checkAttr(node, parsedNodeName, attr)) {
          return false
        }
      }
    }
    if (rule.pseudos) {
      if (verboseLog) console.log('## 疑似クラスチェック')
      for (let pseudo of rule.pseudos) {
        if (!this.checkPseudo(node, pseudo)) {
          if (verboseLog) console.log(`- ${pseudo.name} が適合しません`)
          return false
        }
        if (verboseLog) console.log(`- ${pseudo.name} が適合した`)
      }
    }
    //console.log(nodeName)
    //console.log(JSON.stringify(parsedNodeName, null, '  '))
    if (verboseLog) console.log('このruleは適合した')
    return true
  }

  checkAttr(node, parsedNodeName, attr) {
    switch (attr.name) {
      case 'class': {
        if (
          !CssSelector.namesCheck(
            attr.operator,
            parsedNodeName.classNames,
            attr.value,
          )
        )
          return false
        break
      }
      case 'id': {
        if (
          !CssSelector.checkString(attr.operator, parsedNodeName.id, attr.value)
        )
          return false
        break
      }
      case 'tag-name': {
        if (
          !CssSelector.checkString(
            attr.operator,
            parsedNodeName.tagName,
            attr.value,
          )
        )
          return false
        break
      }
      case 'type-of':
      case 'typeof': {
        if (
          !CssSelector.checkString(
            attr.operator,
            node.constructor.name,
            attr.value,
          )
        )
          return false
        break
      }
      case 'scrolling-type':
      case 'scrollingtype':
        if (
          !CssSelector.checkString(
            attr.operator,
            node.scrollingType,
            attr.value,
          )
        )
          return false
        break
      default:
        console.log('**error** 未対応の要素名です:', attr.name)
        return false
    }
    return true
  }

  checkPseudo(node, pseudo) {
    //  console.log(`checkPseudo (${globalCssCheckDepth})${pseudo.name}`)
    globalCssCheckDepth++
    if (globalCssCheckDepth > 50) {
      throw 'CSS selector check too deep.'
    }
    let result = false
    switch (pseudo.name) {
      case 'nth-child':
        const nthChild = parseInt(pseudo.value)
        const nodeChildIndex = getChildIndex(node) + 1
        result = nthChild === nodeChildIndex
        break
      case 'first-child':
        result = isFirstChild(node)
        break
      case 'last-child':
        result = isLastChild(node)
        break
      case 'only-child':
        result = isOnlyChild(node)
        break
      case 'has-only-child':
        result = hasOnlyChild(node)
        break
      case 'same-parent-bounds':
        result = sameParentBounds(node)
        break
      case 'has-some-child':
        result = node.children.some(childNode => {
          return this.matchRule(childNode, pseudo.value, false)
        })
        break
      case 'dynamic-layout':
        // console.log('dynamic-layout', node.dynamicLayout)
        result = node.dynamicLayout
        break
      case 'top-node':
        // Artboardであったり、Artboardに入っていないNodeにマッチする
        result = node.parent === scenegraph.root // 親がscenegraph.rootならTopNode
        break
      case 'has-mask':
        result = node.mask != null
        break
      case 'is-mask':
        result = node.parent && node.parent.mask === node
        break
      case 'horizontal-layout':
        result = false
        if (node.constructor.name === 'RepeatGrid') {
          if (node.numRows === 1 && node.numColumns > 1) {
            result = true
          }
        }
        break
      case 'vertical-layout':
        result = false
        if (node.constructor.name === 'RepeatGrid') {
          if (node.numRows > 1 && node.numColumns === 1) {
            result = true
          }
        }
        break
      case 'grid-layout':
        result = false
        if (node.constructor.name === 'RepeatGrid') {
          if (node.numRows > 1 && node.numColumns > 1) {
            result = true
          }
        }
        break
      /*
      CSSが決定した後の値を取ろうとしているため、無限ループにはいる
      case 'has-layout-properties-preferred-size':
        result = hasLayoutPropertiesPreferredSize(node) //この関数の中でCSSスタイルを決定する処理が走る
        console.log(result)
        break
      */
      case 'not':
        // console.log('----------------- not')
        result = !this.matchRule(node, pseudo.value, false)
        break
      default:
        console.log('**error** 未対応の疑似要素です', pseudo.name)
        result = false
        break
    }
    globalCssCheckDepth--
    return result
  }

  /**
   * @param {string} op
   * @param {string[]} names
   * @param value
   */
  static namesCheck(op, names, value) {
    if (!op || names == null) return false
    for (let name of names) {
      if (this.checkString(op, name, value)) return true
    }
    return false
  }

  /**
   * @param {string} op
   * @param {string} name
   * @param value
   */
  static checkString(op, name, value) {
    if (!op || name == null || value == null) return false
    switch (op) {
      case '=':
        return name === value
      case '*=':
        return name.includes(value) > 0
      case '^=':
        return name.startsWith(value)
      case '$=':
        return name.endsWith(value)
      case '|=':
        if (name === value) return true
        return name.startsWith(value + '-')
    }
    return false
  }
}

let globalCssCheckDepth = 0

const CssSelectorParser = require('./node_modules/css-selector-parser/lib/css-selector-parser')
  .CssSelectorParser
let cssSelectorParser = new CssSelectorParser()
//cssSelectorParser.registerSelectorPseudos('has')
cssSelectorParser.registerNumericPseudos('nth-child')
cssSelectorParser.registerSelectorPseudos('has-some-child')
cssSelectorParser.registerSelectorPseudos('not')
cssSelectorParser.registerNestingOperators('>', '+', '~', ' ')
cssSelectorParser.registerAttrEqualityMods('^', '$', '*', '~')
cssSelectorParser.enableSubstitutes()

/**
 *
 * @param {Selection} selection
 * @param {RootNode} root
 * @return {Promise<void>}
 */
async function testParse(selection, root) {
  const folder = await fs.getPluginFolder()
  const file = await folder.getEntry('default.css')
  let text = await file.read()

  const selector =
    //'.a:nth-child(2)'
    //'[class$="-aaa"]'
    ':root'
  //'a.b,#c > d.e'
  //'a > #b1, #b2 {key:value}'
  //'#id.hello,hello'
  const cssSelector = new CssSelector(selector)

  //const result = cssSelector.matchRule(selection.items[0])
  console.log(result)
}

module.exports = {
  // コマンドIDとファンクションの紐付け
  commands: {
    pluginExportXdUnityUI,
  },
}
