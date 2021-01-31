const { Artboard, Text, Color, Rectangle } = require("scenegraph"); // XD拡張APIのクラスをインポート
let clipboard = require("clipboard");
let { openAlert } = require('./modules/alert-helper');
let colorBgcCodeDic = {};
let colorFcCodeDic = {};
let fSizeDic = {};
let fFamilyDic = {};

const CTYPE = {
    ARTBOARD: 'Artboard',
    WRAPPERLIST: 'WrapperList',
    RECTANGLE: 'Rectangle',
    Text: 'Text',
    ELLIPSE: 'Ellipse'
};
const CLASS_FORMAT = {
    BACKGROUND_COLOR: '$o-bgColor--{0} : #{0};',
    FONT_COLOR: '$o-fColor--{0} : #{0};',
    FONT_SIZE: '$o-fSize--{0} : {0}px;',
    FONT_FAMILY: '$o-fFamily : {0}'
}
let cTypeFormatChange = {}
cTypeFormatChange[CTYPE.RECTANGLE] = function(child) {
    let hexCode = subStringColorCode(convertToHex(child.fill.value));
    colorBgcCodeDic[hexCode] = CLASS_FORMAT.BACKGROUND_COLOR.format(hexCode);
}
cTypeFormatChange[CTYPE.Text] = function(child) {
    let hexCode = subStringColorCode(convertToHex(child.fill.value));
    colorFcCodeDic[hexCode] = CLASS_FORMAT.FONT_COLOR.format(hexCode);
    fSizeDic[child.styleRanges[0].fontSize] = CLASS_FORMAT.FONT_SIZE.format(child.styleRanges[0].fontSize);
    fFamilyDic[child.styleRanges[0].fontFamily] = child.styleRanges[0].fontFamily;
}
cTypeFormatChange[CTYPE.ELLIPSE] = function(child) {
    let hexCode = subStringColorCode(convertToHex(child.fill.value));
    colorBgcCodeDic[hexCode] = CLASS_FORMAT.BACKGROUND_COLOR.format(hexCode);
}

function myCommand(selection, documentRoot) {
    if (documentRoot && documentRoot.children && documentRoot.children.length > 0) {
        documentRoot.children.forEach(element => {
            search(element);
        });

        let outputString = '';
        Object.keys(colorBgcCodeDic).forEach(function(key) {
            outputString += colorBgcCodeDic[key] + '\n';
        });
        Object.keys(colorFcCodeDic).forEach(function(key) {
            outputString += colorFcCodeDic[key] + '\n';
        });
        Object.keys(fSizeDic).forEach(function(key) {
            outputString += fSizeDic[key] + '\n';
        });

        let fFamilyString = '';
        Object.keys(fFamilyDic).forEach(function(key) {
            if(fFamilyString.length > 0) {
                fFamilyString += ',"' + fFamilyDic[key] + '"';
            }
            else{
                fFamilyString += '"' + fFamilyDic[key] + '"';
            }
        });
        if(fFamilyString.length > 0) {
            outputString += CLASS_FORMAT.FONT_FAMILY.format(fFamilyString) + '\n';
        }
        if (outputString.length > 0) {
            clipboard.copyText(outputString);
            const oAlert = openAlert('successTitle', 'successMessage');
            oAlert.showModal();
            return false;
        } else {
            const oAlert = openAlert('objectExistTitle', 'objectExistMessage');
            oAlert.showModal();
            return false;
        }
    } else {
        const oAlert = openAlert('artboardExistTitle', 'artboardExistMessage');
        oAlert.showModal();
        return false;
    }
}

function search(element) {
    if (element.constructor.name === CTYPE.ARTBOARD) {
        search(element.children);
    } else if (element.constructor.name === CTYPE.WRAPPERLIST) {
        element.forEach(child => {
            if (cTypeFormatChange[child.constructor.name]) {
                cTypeFormatChange[child.constructor.name](child);
            }
        });
    } else if (element.constructor.name === CTYPE.Text ||
        element.constructor.name === CTYPE.ELLIPSE ||
        element.constructor.name === CTYPE.RECTANGLE) {
        if (cTypeFormatChange[element.constructor.name]) {
            cTypeFormatChange[element.constructor.name](element);
        }
    }
    return;
}

function convertToHex(target) {
    if (typeof(target) === 'number') {
        return target.toString(16);
    }
    return '';
}

function subStringColorCode(target) {
    if (target && target.length > 0) {
        return target.substring(2, 8);
    }
    return '';
}

// 存在チェック
if (String.prototype.format == undefined) {
    /**
     * フォーマット関数
     */
    String.prototype.format = function(arg) {
        // 置換ファンク
        var rep_fn = undefined;

        // オブジェクトの場合
        if (typeof arg == "object") {
            rep_fn = function(m, k) { return arg[k]; }
        }
        // 複数引数だった場合
        else {
            var args = arguments;
            rep_fn = function(m, k) { return args[parseInt(k)]; }
        }

        return this.replace(/\{(\w+)\}/g, rep_fn);
    }
}

module.exports.commands = { myCommandId: myCommand };