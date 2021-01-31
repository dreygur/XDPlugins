const { Text } = require("scenegraph")
const { alert, error } = require("./lib/dialogs.js");
const clipboard = require("clipboard")
const application = require("application")

/**
 * Textオブジェクトからフォントのデータを取得
 * @param {*} item 
 */
function getFontStyle (item) {
    return `
        font-style: ${item.fontFamily};
        font-weight: ${item.fontStyle};
        font-size: ${item.fontSize}px;
        color: #${item.fill.value.toString(16).slice(2)};
        letter-spacing: ${item.charSpacing / 1000}em;
        line-height: ${item.lineSpacing / item.fontSize};
    ` 
}

/**
 * フォントのデータを全て取得
 * @param {*} selection 
 * @param {*} documentRoot 
 */
function getFontDataAll (selection, documentRoot) {
    try {
        if (selection.items.length == 0) {
            if (application.appLanguage == 'ja') {
                error('Convert font data to CSS', 'コピーに失敗しました! テキストを選択してください。')
            } else {
                error('Convert font data to CSS', 'Copy failed! Please select text.')
            }
            return
        }
        for (let i = 0; i < selection.items.length; i++) {
            let item = selection.items[i]
            if (item instanceof Text) {
                const results = getFontStyle(item)
                console.log(item.styleRanges)
                console.log(results)
                clipboard.copyText(results)
                if (application.appLanguage == 'ja') {
                    alert('Convert font data to CSS', '全てのフォントスタイルのコピーに成功しました!')
                } else {
                    alert('Convert font data to CSS', 'Successfully copied all font style!')
                }
            } else {
                if (application.appLanguage == 'ja') {
                    error('Convert font data to CSS', 'コピーに失敗しました! テキストを選択してください。')
                } else {
                    error('Convert font data to CSS', 'Copy failed! Please select text.')
                }
            }
        }
    } catch (e) {
        if (application.appLanguage == 'ja') {
            error('Convert font data to CSS', 'エラーが発生しました。', e)
        } else {
            error('Convert font data to CSS', 'An error has occured', e)
        }
    }
}

/**
 * フォントのletter-spacingを計算して取得
 * @param {*} selection 
 * @param {*} documentRoot 
 */
function getCharSpacing (selection, documentRoot) {
    try {
        if (selection.items.length == 0) {
            if (application.appLanguage == 'ja') {
                error('Convert font data to CSS', 'コピーに失敗しました! テキストを選択してください。')
            } else {
                error('Convert font data to CSS', 'Copy failed! Please select text.')
            }
            return
        }
        for (let i = 0; i < selection.items.length; i++) {
            let item = selection.items[i]
            if (item instanceof Text) {
                const result = item.charSpacing / 1000
                const resultText = `letter-spacing: ${result}em;`
                console.log(resultText)
                clipboard.copyText(resultText)
                if (application.appLanguage == 'ja') {
                    alert('Convert font data to CSS', 'letter-spacingのコピーに成功しました!')
                } else {
                    alert('Convert font data to CSS', 'Successfully copied all font style!')
                }
            } else {
                if (application.appLanguage == 'ja') {
                    error('Convert font data to CSS', 'コピーに失敗しました! テキストを選択してください。')
                } else {
                    error('Convert font data to CSS', 'Copy failed! Please select text.')
                }
            }
        }
    } catch (e) {
        if (application.appLanguage == 'ja') {
            error('Convert font data to CSS', 'エラーが発生しました。', e)
        } else {
            error('Convert font data to CSS', 'An error has occured', e)
        }
    }
}

/**
 * フォントのline-heightを計算して取得
 * @param {*} selection 
 * @param {*} documentRoot 
 */
function getLineHeight (selection, documentRoot) {
    try {
        if (selection.items.length == 0) {
            if (application.appLanguage == 'ja') {
                error('Convert font data to CSS', 'コピーに失敗しました! テキストを選択してください。')
            } else {
                error('Convert font data to CSS', 'Copy failed! Please select text.')
            }
            return
        }
        for (let i = 0; i < selection.items.length; i++) {
            let item = selection.items[i]
            if (item instanceof Text) {
                const result = item.lineSpacing / item.fontSize;
                const resultText = `line-height: ${result};`
                console.log(resultText)
                clipboard.copyText(resultText)
                if (application.appLanguage == 'ja') {
                    alert('Convert font data to CSS', 'line-heightのコピーに成功しました!')
                } else {
                    alert('Convert font data to CSS', 'Successfully copied line-height!')
                }
            } else {
                if (application.appLanguage == 'ja') {
                    error('Convert font data to CSS', 'コピーに失敗しました! テキストを選択してください。')
                } else {
                    error('Convert font data to CSS', 'Copy failed! Please select text.')
                }
            }
        }
    } catch (e) {
        if (application.appLanguage == 'ja') {
            error('Convert font data to CSS', 'エラーが発生しました。', e)
        } else {
            error('Convert font data to CSS', 'An error has occured', e)
        }
    }
}

module.exports = {
    commands: {
        getFontDataAll: getFontDataAll,
        getCharSpacing: getCharSpacing,
        getLineHeight: getLineHeight
    }
}