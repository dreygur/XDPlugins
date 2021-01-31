function toRGB(num) {
    num >>>= 0;
    const b = num & 0xFF,
        g = (num & 0xFF00) >>> 8,
        r = (num & 0xFF0000) >>> 16;
    // a = ( (num & 0xFF000000) >>> 24 ) / 255 ;
    return "rgb(" + [r, g, b].join(",") + ")";
}

function deleteSpaces(name) {
    return name.replace(/ /g, '');
}

function filterImages(items){
    let outputArray = [];
    items.forEach(item => {
        if(item.name.includes("img")){
            outputArray.push(item);
        }
    });
    return outputArray;
}

function textWithBreaks(text){
    let outputString = "";
    if(text.includes('\n')){
        let lineArray = text.split('\n');
        lineArray.forEach(line => {
            if(lineArray.indexOf(line) === 0){
                outputString += line;
            } else if(lineArray.indexOf(line) === lineArray.length-1){
                outputString += line;
            } else {
                outputString += line + "<br>";
            }
        });
        return outputString;
    } else {
        return text;
    }
}

/**
 * Gets a reference to a subfolder from a folder object. Creates it if it doesn't exist.
 * Does not support nested directories at this time
 * @param {File} folder file of type folder
 * @param {String} subfolderName name of sub folder
 * @param {Boolean} create if true creates the directory if it doesn't exist
 * @returns {File|Error} returns the folder or an error object
 */
async function createSubFolder(folder, subfolderName) {
    let subfolder = null;

    try {
        subfolder = (await folder.getEntries()).find(entry => entry.name.includes(subfolderName));

        if (subfolder == null || subfolder.isFolder === false) {
            subfolder = await folder.createFolder(subfolderName);
            return subfolder;
        } else {
            return subfolder;
        }
    } catch (fileError) {
        return fileError;
    }
}

function item1isUnderItem2(item1, item2) {

    let leftTop1 = [item1.boundsInParent.x, item1.boundsInParent.y];
    let rightTop1 = [leftTop1[0] + item1.localBounds.width, leftTop1[1]];

    let leftTop2 = [item2.boundsInParent.x, item2.boundsInParent.y];
    let leftButtom2 = [leftTop2[0], leftTop2[1] + item2.localBounds.height];
    let rightButtom2 = [leftTop2[0] + item2.localBounds.width, leftTop2[1] + item2.localBounds.height];

    return leftTop1[1] >= leftButtom2[1] && rightTop1[1] >= rightButtom2[1];
}

function item1isOverItem2(item1, item2) {
    let leftTop1 = [item1.boundsInParent.x, item1.boundsInParent.y];
    let leftButtom1 = [leftTop1[0], leftTop1[1] + item1.localBounds.height];
    let rightButtom1 = [leftTop1[0] + item1.localBounds.width, leftTop1[1] + item1.localBounds.height];

    let leftTop2 = [item2.boundsInParent.x, item2.boundsInParent.y];
    let rightTop2 = [leftTop2[0] + item2.localBounds.width, leftTop2[1]];

    return leftButtom1[1] <= leftTop2[1] && rightButtom1[1] <= rightTop2[1];
}

function item1isOntheRightSideofItem2(item1, item2) {
    let leftTop1 = [item1.boundsInParent.x, item1.boundsInParent.y];
    let leftButtom1 = [leftTop1[0], leftTop1[1] + item1.localBounds.height];

    let leftTop2 = [item2.boundsInParent.x, item2.boundsInParent.y];
    let leftButtom2 = [leftTop2[0], leftTop2[1] + item2.localBounds.height];
    let rightTop2 = [leftTop2[0] + item2.localBounds.width, leftTop2[1]];
    let rightButtom2 = [leftTop2[0] + item2.localBounds.width, leftTop2[1] + item2.localBounds.height];

    if(item1.name.includes("img")){
        return leftTop1[0] >= rightTop2[0] && leftButtom1[0] >= rightButtom2[0];
    } else {
        return leftTop1[0] >= rightTop2[0] && leftButtom1[0] >= rightButtom2[0] && leftTop1[1] >= rightTop2[1] && leftButtom1[1] <= leftButtom2[1];
    }
}

function item1isOnTheLeftSideOfItem2(item1, item2) {
    let leftTop1 = [item1.boundsInParent.x, item1.boundsInParent.y];
    let rightTop1 = [leftTop1[0] + item1.localBounds.width, leftTop1[1]];
    let rightButtom1 = [leftTop1[0] + item1.localBounds.width, leftTop1[1] + item1.localBounds.height];

    let leftTop2 = [item2.boundsInParent.x, item2.boundsInParent.y];
    let leftButtom2 = [leftTop2[0], leftTop2[1] + item2.localBounds.height];

    if(item2.name.includes("img")){
        return rightTop1[0] <= leftTop2[0] && rightButtom1[0] <= leftButtom2[0];
    } else {
        return rightTop1[0] <= leftTop2[0] && rightButtom1[0] <= leftButtom2[0] && leftButtom2[1] <= rightButtom1[1];
    }
}

function item1IsInItem2(item1, item2) {
    let leftTop1 = [item1.boundsInParent.x, item1.boundsInParent.y];
    let rightTop1 = [leftTop1[0] + item1.localBounds.width, leftTop1[1]];
    let leftButtom1 = [leftTop1[0], leftTop1[1] + item1.localBounds.height];
    let rightButtom1 = [leftTop1[0] + item1.localBounds.width, leftTop1[1] + item1.localBounds.height];

    let leftTop2 = [item2.boundsInParent.x, item2.boundsInParent.y];
    let rightTop2 = [leftTop2[0] + item2.localBounds.width, leftTop2[1]];
    let leftButtom2 = [leftTop2[0], leftTop2[1] + item2.localBounds.height];
    let rightButtom2 = [leftTop2[0] + item2.localBounds.width, leftTop2[1] + item2.localBounds.height];

    return (leftTop1[0] >= leftTop2[0] && leftTop1[1] >= leftTop2[1]) && (leftButtom1[0] >= leftButtom2[0] && leftButtom1[1] <= leftButtom2[1])
        && (rightTop1[0] <= rightTop2[0] && rightTop1[1] >= rightTop2[1]) && (rightButtom1[0] <= rightButtom2[0] && rightButtom1[1] <= rightButtom2[1]);
}

function item1ContainsItem2(item1, item2) {
    let leftTop1 = [item1.boundsInParent.x, item1.boundsInParent.y];
    let rightTop1 = [leftTop1[0] + item1.localBounds.width, leftTop1[1]];
    let leftButtom1 = [leftTop1[0], leftTop1[1] + item1.localBounds.height];
    let rightButtom1 = [leftTop1[0] + item1.localBounds.width, leftTop1[1] + item1.localBounds.height];

    let leftTop2 = [item2.boundsInParent.x, item2.boundsInParent.y];
    let rightTop2 = [leftTop2[0] + item2.localBounds.width, leftTop2[1]];
    let leftButtom2 = [leftTop2[0], leftTop2[1] + item2.localBounds.height];
    let rightButtom2 = [leftTop2[0] + item2.localBounds.width, leftTop2[1] + item2.localBounds.height];

    return leftTop1[0] <= leftTop2[0] && leftTop1[1] <= leftTop2[1] && leftButtom1[0] <= leftButtom2[0] && leftButtom1[1] >= leftButtom2[1]
        && rightTop1[0] >= rightTop2[0] && rightTop1[1] <= rightTop2[1] && rightButtom1[0] >= rightButtom2[0] && rightButtom1[1] >= rightButtom2[1];
}

function getMarginRight(item1, item2) {
    let leftTop1 = [item1.boundsInParent.x, item1.boundsInParent.y];
    let rightTop1 = [leftTop1[0] + item1.localBounds.width, leftTop1[1]];
    let leftTop2 = [item2.boundsInParent.x, item2.boundsInParent.y];
    let rightTop2 = [leftTop2[0] + item2.localBounds.width, leftTop2[1]];
    if (item1ContainsItem2(item1, item2)) {
        return rightTop1[0] - rightTop2[0];
    } else if (item1IsInItem2(item1, item2)) {
        return rightTop2[0] - rightTop1[0];
    } else if (item1isOnTheLeftSideOfItem2(item1, item2)) {
        return leftTop2[0] - rightTop1[0];
    } else {
        return 0;
    }
}

function getMarginLeftFromItem1(item1, item2) {
    let leftTop1 = [item1.boundsInParent.x, item1.boundsInParent.y];
    let leftTop2 = [item2.boundsInParent.x, item2.boundsInParent.y];
    let rightTop2 = [leftTop2[0] + item2.localBounds.width, leftTop2[1]];
    if (item1IsInItem2(item1, item2)) {
        return leftTop1[0] - leftTop2[0];
    } else if (item1ContainsItem2(item1, item2)) {
        return leftTop2[0] - leftTop1[0];
    } else if (item1isOntheRightSideofItem2(item1, item2)) {
        return leftTop1[0] - rightTop2[0];
    } else {
        return 0;
    }
}

//MERKE: Items werden automatisch geordnet, ob wie übereinander liegen
function getMarginBottomFromItem1(item1, item2) {

    let leftTop1 = [item1.boundsInParent.x, item1.boundsInParent.y];
    let leftButtom1 = [leftTop1[0], leftTop1[1] + item1.localBounds.height];

    let leftTop2 = [item2.boundsInParent.x, item2.boundsInParent.y];

    if (item1isOverItem2(item1, item2)) {
        return leftTop2[1] - leftButtom1[1];
    } else {
        return 0;
    }
}

function getMarginTop(item1, item2) {

    let leftTop1 = [item1.boundsInParent.x, item1.boundsInParent.y];

    let leftTop2 = [item2.boundsInParent.x, item2.boundsInParent.y];
    let leftButtom2 = [leftTop2[0], leftTop2[1] + item2.localBounds.height];

    if (item1ContainsItem2(item1, item2)) {
        return leftTop2[1] - leftTop1[1];
    } else if(item1IsInItem2(item1, item2)) {
        return leftTop1[1] - leftTop2[1];
    } else if(item1isUnderItem2(item1,item2)) {
        return leftTop1[1] - leftButtom2[1];
    } else {
        return 0;
    }
}

module.exports = {
    toRGB,
    deleteSpaces,
    filterImages,
    textWithBreaks,
    createSubFolder,
    item1isUnderItem2,
    item1isOnTheLeftSideOfItem2,
    item1ContainsItem2,
    getMarginBottomFromItem1,
    getMarginLeftFromItem1,
    getMarginRight,
    item1isOverItem2,
    getMarginTop
};