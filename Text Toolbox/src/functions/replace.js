/*
 * Copyright (c) 2018. by Pablo Klaschka
 */

const {Text} = require("scenegraph");
const trimHeight = require('./trimHeight');
const debugHelper = require('../helpers/debug');
const SelectionChecker = require('../helpers/check-selection');
const analytics = require("../helpers/analytics");

/**
 * @param {Selection} selection
 * @param {object} options
 * @param {boolean} options.regex
 * @param {string} options.search
 * @param {string} options.replace
 */
function replaceText(selection, options) {
    debugHelper.log('Lorem ipsum with options ', (options));
    let terminationString = options.terminate ? '.' : '';
    for (let element of selection.items) {
        if (SelectionChecker.checkForType(element, 'Text')) {
            let currentText = element.text;
            if (options.regex) {
                const regex = new RegExp(options.search);
                currentText = currentText.replace(regex, options.replace);
            } else {
                currentText = currentText.split(options.search).join(options.replace);
            }
            element.text = currentText;
        } else {
            debugHelper.log('Node ', element, ' is not a text area.');
        }
    }
    analytics.send('replaceText', {regex: options.regex});
}

/**
 * @param oldCount The highest count that was clipped
 * @param newCount The lowest count that wasn't clipped
 * @param {function(count:number): boolean} isClipped
 */
function checkBetween(oldCount, newCount, isClipped) {

    debugHelper.log('Checking between ', oldCount, ' and ', newCount);
    {
        if (Math.abs(oldCount - newCount) < 2) {
            return oldCount;
        }
    }

    let half = Math.floor((oldCount + newCount) / 2);

    return isClipped(half) ? checkBetween(oldCount, half, isClipped) : checkBetween(half, newCount, isClipped);
}

function loremText(count, text, includeLineBreaks) {
    function trimToNWords(strText, n, includeLineBreaks) {
        // Ensure text is long enough:
        while (strText.split(" ").length < n) {
            strText = includeLineBreaks ? (strText + "\n" + strText) : (strText + " " + strText);
        }
        return strText
            .split(" ")
            .splice(0, n)
            .join(" ");
    }

    let originalString = texts[text];
    let strReturn = trimToNWords(originalString, count, includeLineBreaks).trim();
    if (strReturn.endsWith('.') || strReturn.endsWith(',') || strReturn.endsWith('?') || strReturn.endsWith(';') || strReturn.endsWith(':') || strReturn.endsWith('-') || strReturn.endsWith('–') || strReturn.endsWith('!'))
        strReturn = strReturn.substr(0, strReturn.length - 1);
    return strReturn;
}

module.exports = replaceText;