const {Object} = require("../objects/object");
const {Text} = require("../objects/text");
const {Line} = require("../objects/line");
const {deleteSpaces} = require("../helper");
const {getMarginLeftFromItem1, getMarginTop, getMarginRight} = require("../helper.js");
const {mapItemsLyingInEachOther, sortItemsfromLeftToRight} = require("../selectionHandler.js");
const {selection} = require("scenegraph");

function createCssforObjects(objekt, marginLeft, marginRight, marginTop, cssString) {
    if(cssString.length !== undefined) {
        let lastIndex = cssString.length - 1;
        if (lastIndex >= 0 && cssString[lastIndex].includes("list")) {
            marginTop *= -1;
        }
    }
    return `
      #` + deleteSpaces(objekt.getID()) + ` {
      height: ` + objekt.getHeight() + `px;
      width: ` + objekt.getWidth() + `px;
      background-color: ` + objekt.getFillColor() + `;
      margin-left: ` + marginLeft + `px;
      margin-right: ` + marginRight + `px;
      margin-top: ` + marginTop + `px;
      }
      `;
}

function createCssforLine(line, marginLeft, marginRight, marginTop, cssString) {
    if(cssString.length !== undefined) {
        let lastIndex = cssString.length - 1;
        if (lastIndex >= 0 && cssString[lastIndex].includes("list")) {
            marginTop *= -1;
        }
    }
    return `
      #` + deleteSpaces(line.getID()) + ` {
      width: ` + line.getWidth() + `px;
      border-color: ` + line.getStrokeColor() + `;
      margin-left: ` + marginLeft + `px;
      margin-right: ` + marginRight + `px;
      margin-top: ` + marginTop + `px;
      }
      `;
}

function createCSSforText(text, marginLeft, marginRight, marginTop, cssString) {
    if(cssString.length !== undefined) {
        let lastIndex = cssString.length - 1;
        if (lastIndex >= 0 && cssString[lastIndex].includes("list")) {
            marginTop *= -1;
        }
    }
    return `
    #` + deleteSpaces(text.getID()) + ` {
    font-family: ` + text.getFontFamily() + `;
    color: ` + text.getFontColor() + `;
    font-weight: ` + text.getFontStyle() + `;
    font-size: ` + text.getFontSize() + `px;
    text-align: ` + text.getAlignment() + `;
    margin-left: ` + marginLeft + `px;
    margin-right: ` + marginRight + `px;
    margin-top: ` + marginTop + `px;
    display: inline-block;
    }
    `;
}

function createCssforSpezialGroup(group, marginLeft, marginRight, marginTop, cssString) {
    if(cssString.length !== undefined) {
        let lastIndex = cssString.length - 1;
        if (lastIndex >= 0 && cssString[lastIndex].includes("list")) {
            marginTop *= -1;
        }
    }
    let children = group.children;
    let outputString = `#` + deleteSpaces(group.name) + ` {
    `;
    children.forEach(child => {
        if (child.constructor.name === "Text") {
            let text = new Text(child);
            outputString += `font-family: ` + text.getFontFamily() + `;
         color: ` + text.getFontColor() + `;
         font-style: ` + text.getFontStyle() + `;
         font-size: ` + text.getFontSize() + `px;
         text-align: ` + text.getAlignment() + `;
         `;
        } else {
            let field = new Object(child);
            outputString += `height: ` + field.getHeight() + `px;
         width: ` + field.getWidth() + `px;
         background-color: ` + field.getFillColor() + `;
         margin-left: ` + marginLeft + `px;
         margin-right: ` + marginRight + `px;
         margin-top: ` + marginTop + `px;
         `;
        }
    });
    outputString += `}
    `;
    return outputString;
}

function getCssForItems(item, marginLeft, marginRight, marginTop, cssString) {
    let description = item.constructor.name;
    let name = item.name;
    if (description.includes("Text")) {
        let text = new Text(item);
        return createCSSforText(text, marginLeft, marginRight, marginTop, cssString);
    } else if ((name.includes("input") || name.includes("button")) && description === "Group") {
        return createCssforSpezialGroup(item, marginLeft, marginRight, marginTop, cssString);
    } else if (description.includes("Line")) {
        let line = new Line(item);
        return createCssforLine(line, marginLeft, marginRight, marginTop, cssString);
    } else {
        let objekt = new Object(item);
        return createCssforObjects(objekt, marginLeft, marginRight, marginTop, cssString);
    }
}

function getCssForImg(key, keyindex, parentNode, list, i, group, cssString) {
    let itemWidth;
    let itemHeight;
    if (group) {
        itemHeight = key.localBounds.height;
        itemWidth = key.localBounds.width;
    } else {
        itemHeight = key.height;
        itemWidth = key.width;
    }
    if (list[i].length !== undefined) {
        if (keyindex === list[i].length - 1) {
            let float = "right";
            let marginRight = getMarginRight(key, parentNode);
            let marginTop = getFinalMarginTopForIndexElement(key, keyindex, parentNode, list, i);
            let lastIndex = cssString.length -1;
            if(cssString.length !== undefined) {
                if (lastIndex >= 0 && cssString[lastIndex].includes("list")) {
                    marginTop *= -1;
                }
            }
            return `
      #` + deleteSpaces(key.name) + ` {
      height: ` + itemHeight + `px;
      width: ` + itemWidth + `px;
      margin-left: ` + 0 + `px;
      margin-right: ` + marginRight + `px;
      margin-top: ` + marginTop + `px;
      float: ` + float + `;
      }`;
        } else if (keyindex === 0) {
            let float = "left";
            let marginTop = getFinalMarginTopForIndexElement(key, keyindex, parentNode, list, i);
            let marginLeft = getFinalMarginLeftForIndexElement(key, keyindex, parentNode, list, i);
            if(cssString.length !== undefined) {
                let lastIndex = cssString.length - 1;
                if (lastIndex >= 0 && cssString[lastIndex].includes("list")) {
                    marginTop *= -1;
                }
            }
            return `
      #` + deleteSpaces(key.name) + ` {
      height: ` + itemHeight + `px;
      width: ` + itemWidth + `px;
      margin-left: ` + marginLeft + `px;
      margin-top: ` + marginTop + `px;
      float: ` + float + `;
      }`
        }
    } else {
        if (key.globalDrawBounds.x - parentNode.globalDrawBounds.x <= parentNode.width / 2) {
            let float = "left";
            let marginTop = getFinalMarginTopForIndexElement(key, keyindex, parentNode, list, i);
            let marginLeft = getFinalMarginLeftForIndexElement(key, keyindex, parentNode, list, i);
            if(cssString.length !== undefined) {
                let lastIndex = cssString.length - 1;
                if (lastIndex >= 0 && cssString[lastIndex].includes("list")) {
                    marginTop *= -1;
                }
            }
            return `
      #` + deleteSpaces(key.name) + ` {
      height: ` + itemHeight + `px;
      width: ` + itemWidth + `px;
      margin-left: ` + marginLeft + `px;
      margin-top: ` + marginTop + `px;
      float: ` + float + `;
      }`;
        } else {
            let float = "right";
            let marginRight = getMarginRight(key, parentNode);
            let marginTop = getFinalMarginTopForIndexElement(key, keyindex, parentNode, list, i);
            if(cssString.length !== undefined) {
                let lastIndex = cssString.length - 1;
                if (lastIndex >= 0 && cssString[lastIndex].includes("list")) {
                    marginTop *= -1;
                }
            }
            return `
      #` + deleteSpaces(key.name) + ` {
      height: ` + itemHeight + `px;
      width: ` + itemWidth + `px;
      margin-left: ` + 0 + `px;
      margin-right: ` + marginRight + `px;
      margin-top: ` + marginTop + `px;
      float: ` + float + `;
      }`;
        }
    }
}

function getFinalMarginLeftForIndexList(key, keyindex, parentNode, list, i) {
    if (keyindex === 0 && i === 0) {
        return getMarginLeftFromItem1(key, parentNode);
    } else if (keyindex > 0 && i === 0) {
        return getMarginLeftFromItem1(key, list[i][(list[i].indexOf(key) - 1)]);
    } else if (keyindex === 0 && i > 0) {
        return getMarginLeftFromItem1(key, parentNode);
    } else if (keyindex > 0 && i > 0) {
        return getMarginLeftFromItem1(key, list[i][(list[i].indexOf(key) - 1)]);
    } else {
        return 0;
    }
}

function getFinalMarginTopForIndexList(key, keyindex, parentNode, list, i) {
    if (keyindex === 0 && i === 0) {
        return getMarginTop(parentNode, key);
    } else if (keyindex > 0 && i === 0) {
        return getMarginTop(parentNode, key);
    } else if (keyindex === 0 && i > 0) {
        if (list[i - 1][keyindex] !== undefined) {
            return getMarginTop(key, list[i - 1][keyindex]);
        } else {
            return getMarginTop(key, list[i - 1]);
        }
    } else if (keyindex > 0 && i > 0) {
        if (list[i - 1][keyindex] !== undefined) {
            return getMarginTop(key, list[i - 1][keyindex]);
        } else if (list[i - 1].length < list[i].length) {
            return getMarginTop(key, parentNode);
        } else {
            return getMarginTop(key, list[i - 1]);
        }
    } else {
        return 0;
    }
}

function getFinalMarginLeftForIndexElement(key, keyindex, parentNode, list, i) {
    if (i === 0) {
        return getMarginLeftFromItem1(key, parentNode);
    } else {
        if (list[i - 1].length === undefined) {
            if (keyindex === i && i !== 0) {
                return getMarginLeftFromItem1(key, parentNode);
            } else if (keyindex !== 0 && i === 0) {
                return getMarginLeftFromItem1(key, list[i - 1]);
            } else {
                return getMarginLeftFromItem1(key, parentNode);
            }
        } else {
            if (keyindex === i && i !== 0) {
                return getMarginLeftFromItem1(key, parentNode);
            } else if (keyindex !== 0 && i === 0) {
                return getMarginLeftFromItem1(key, list[i - 1][list.indexOf(key)]);
            } else {
                return getMarginLeftFromItem1(key, parentNode);
            }
        }
    }
}

function getFinalMarginTopForIndexElement(key, keyindex, parentNode, list, i) {
    if (i === 0) {
        return getMarginTop(parentNode, key);
    } else {
        if (list[i - 1].length === undefined) {
            if (keyindex === i && i !== 0) {
                return getMarginTop(key, list[i - 1]);
            } else if (keyindex !== 0 && i === 0) {
                return getMarginTop(parentNode, key);
            } else {
                return getMarginTop(parentNode, key);
            }
        } else {
            if (keyindex === i && i !== 0) {
                return getMarginTop(key, list[i - 1][list.indexOf(key)]);
            } else if (keyindex !== 0 && i === 0) {
                return getMarginTop(parentNode, key);
            } else {
                return getMarginTop(parentNode, key);
            }
        }
    }
}

function createCssWithMargin(list, map, parentNode) {
    let cssString = [];
    for (let i = 0; i < list.length; i++) {
        let keyItem = list[i];
        //Elemente liegen nebeneinander
        if (list[i].length !== undefined) {
            list[i].forEach(key => {
                //KeyItem beinhaltet Values
                if (map.get(key) !== "seperat") {
                    //CSS + Margin für übergeordnetes Item (keyItem)
                    let marginRight = 0;
                    let marginLeft = 0;
                    let marginTop = 0;
                    if (parentNode !== undefined) {
                        let keyindex = list[i].indexOf(key);
                        marginLeft = getFinalMarginLeftForIndexList(key, keyindex, parentNode, list, i);
                        marginTop = getFinalMarginTopForIndexList(key, keyindex, parentNode, list, i);
                    }
                    let cssForItem = getCssForItems(key, marginLeft, marginRight, marginTop, cssString);
                    cssString.push(cssForItem);
                    //CSS + Margin für Kinder von keyItem
                    let valueItems1 = map.get(key);
                    let valueMap1 = mapItemsLyingInEachOther(valueItems1);
                    let newKeyArray1 = [];
                    for (let key of valueMap1.keys()) {
                        newKeyArray1.push(key);
                    }
                    let sortedValueList1 = sortItemsfromLeftToRight(newKeyArray1);
                    cssString.push(createCssWithMargin(sortedValueList1, valueMap1, key));
                } else {
                    //Auswahl beinhaltet eine Gruppe
                    if (key.constructor.name === "Group") {
                        let keyindex = list[i].indexOf(key);
                        if (key.name.includes("img")) {
                            let imgCSS = getCssForImg(key, keyindex, parentNode, list, i, true, cssString);
                            cssString.push(imgCSS);
                        } else {
                            let marginRight = 0;
                            let marginLeft = getFinalMarginLeftForIndexList(key, keyindex, parentNode, list, i);
                            let marginTop = getFinalMarginTopForIndexList(key, keyindex, parentNode, list, i);
                            let cssForGroup = createCssforSpezialGroup(key, marginLeft, marginRight, marginTop, cssString);
                            cssString.push(cssForGroup);
                        }
                    } else {
                        //Auswahl ist ein einzeldes Element
                        let marginRight = 0;
                        let keyindex = list[i].indexOf(key);
                        if (key.name.includes("img")) {
                            let imgCSS = getCssForImg(key, keyindex, parentNode, list, i, false, cssString);
                            cssString.push(imgCSS);
                        } else {
                            let marginLeft = getFinalMarginLeftForIndexList(key, keyindex, parentNode, list, i);
                            let marginTop = getFinalMarginTopForIndexList(key, keyindex, parentNode, list, i);
                            let cssForItem = getCssForItems(key, marginLeft, marginRight, marginTop, cssString);
                            cssString.push(cssForItem);
                        }
                    }
                }
            });
            //IndexElement beinhaltet KEINE Liste
        } else if (map.get(list[i]) !== "seperat") {
            let marginRight = 0;
            let marginLeft = 0;
            let marginTop = 0;
            if (parentNode !== undefined) {
                let keyItemIndex = list.indexOf(keyItem);
                marginLeft = getFinalMarginLeftForIndexElement(keyItem, keyItemIndex, parentNode, list, i);
                marginTop = getFinalMarginTopForIndexElement(keyItem, keyItemIndex, parentNode, list, i);
            }
            let cssForItem = getCssForItems(keyItem, marginLeft, marginRight, marginTop, cssString);
            cssString.push(cssForItem);
            //KeyItem beinhaltet Values
            let valueItems = map.get(list[i]);
            let valueMap = mapItemsLyingInEachOther(valueItems);
            let newKeyArray = [];
            for (let key of valueMap.keys()) {
                newKeyArray.push(key);
            }
            let sortedValueList = sortItemsfromLeftToRight(newKeyArray);
            cssString.push(createCssWithMargin(sortedValueList, valueMap, keyItem));
        } else if (keyItem.constructor.name === "Group") {
            //Element ist einzelnd Auswahl beinhaltet eine Gruppe
            let keyItemIndex = list.indexOf(keyItem);
            if (keyItem.name.includes("img")) {
                let imgCSS = getCssForImg(keyItem, keyItemIndex, parentNode, list, i, true, cssString);
                cssString.push(imgCSS);
            } else {
                let marginRight = 0;
                let marginLeft = 0;
                let marginTop = 0;
                if (parentNode !== undefined) {
                    marginLeft = getFinalMarginLeftForIndexElement(keyItem, keyItemIndex, parentNode, list, i);
                    marginTop = getFinalMarginTopForIndexElement(keyItem, keyItemIndex, parentNode, list, i);
                }
                let cssForItem = getCssForItems(keyItem, marginLeft, marginRight, marginTop, cssString);
                cssString.push(cssForItem);
            }
        } else {
            //Einzelndes Element
            let marginRight = 0;
            let marginLeft = 0;
            let marginTop = 0;
            if (parentNode !== undefined) {
                let keyItemIndex = list.indexOf(keyItem);
                marginLeft = getFinalMarginLeftForIndexElement(keyItem, keyItemIndex, parentNode, list, i);
                marginTop = getFinalMarginTopForIndexElement(keyItem, keyItemIndex, parentNode, list, i);
            }
            let cssForItem = getCssForItems(keyItem, marginLeft, marginRight, marginTop, cssString);
            cssString.push(cssForItem);
        }
    }
    let finalString = "";
    cssString.forEach(string => {
        finalString += string;
    });
    return finalString;
}

function getStyleText(array) {
    let styleText = "";
    for (let i = 0; i < array.length; i++) {
        if (array[i].length !== undefined) {
            styleText += getStyleText(array[i]);
        } else {
            styleText += " - item" + i.toString();
        }
    }
    return styleText;
}

module.exports = {
    getStyleText,
    createCssWithMargin
};