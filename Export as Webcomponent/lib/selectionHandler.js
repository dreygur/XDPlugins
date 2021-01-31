const {selection} = require("scenegraph");
const {item1isUnderItem2, item1isOnTheLeftSideOfItem2, item1ContainsItem2} = require("./helper");

/**
 * Insert Search
 * @param inputArr: Selection or Children-Array from Groups or Value-Array from da Map
 * @returns {*} sorted Array
 */
function sortItemsOboveAnother(inputArr) {
    for (let i = 1; i < inputArr.length; i++) {
        let j = i - 1;
        let temp = inputArr[i];
        while (j >= 0 && item1isUnderItem2(inputArr[j], temp)) {
            inputArr[j + 1] = inputArr[j];
            j--;
        }
        inputArr[j + 1] = temp;
    }
    return inputArr
}

/**
 *
 * @param inputArr
 * @returns {Map<any, any>}: Key: items, which contain other items ot none item -
 *                           Value: all items a key-item contains or just "seperat" to mark that this key-item contains nothing.
 */
function mapItemsLyingInEachOther(inputArr) {
    let map = new Map();
    let mapKey = 0;
    let valueArray = [];
    let itemEdit = [];
    let compare = 0;
    for (let i = 1; i < inputArr.length; i++) {
        if (item1ContainsItem2(inputArr[compare], inputArr[i])) {
            valueArray.push(inputArr[i]);
            mapKey = compare;
            if (!itemEdit.includes(inputArr[compare])) {
                itemEdit.push(inputArr[compare]);
            }
            itemEdit.push(inputArr[i]);
            map.set(inputArr[mapKey], valueArray);
        } else {
            valueArray = [];
            if (!itemEdit.includes(inputArr[compare])) {
                itemEdit.push(inputArr[compare]);
                map.set(inputArr[compare], "seperat");
            }
            compare = i;
            //letztes Element allein stehend
            if (i === inputArr.length - 1) {
                if (!itemEdit.includes(inputArr[compare])) {
                    map.set(inputArr[compare], "seperat");
                } else {
                    itemEdit.push(inputArr[i]);
                    map.set(inputArr[i], "seperat");
                }
            }
        }
    }
    if(compare===0 && !itemEdit.includes(inputArr[compare])){
        map.set(inputArr[compare], "seperat");
    }

    for (let key of map.keys()) {
    }
    for (let value of map.values()) {
    }
    return map;
}

/**
 *
 * @param inputArr: "value"-Array from a map
 * @returns {Array}: Sorted multidimensional Array -> items, which are lying next to each other are separated in an "extra" array
 */
function sortItemsfromLeftToRight(inputArr) {
    let outputArray = [];
    let extraArray = [];
    let itemEdit = [];
    let compare = 0;
    for (let i = 1; i < inputArr.length; i++) {
        if (item1isOnTheLeftSideOfItem2(inputArr[compare], inputArr[i])) {
            if (!extraArray.includes(inputArr[compare])) {
                itemEdit.push(inputArr[compare]);
                extraArray.push(inputArr[compare]);
            }
            extraArray.push(inputArr[i]);
            itemEdit.push(inputArr[i]);
        } else {
            if (extraArray.length !== 0) {
                outputArray.push(extraArray);
                extraArray = [];
            }
            if (!itemEdit.includes(inputArr[compare])) {
                itemEdit.push(inputArr[compare]);
                outputArray.push(inputArr[compare]);
            }
            compare = i;
            if (i === inputArr.length - 1) {
                if (!itemEdit.includes(inputArr[compare])) {
                    outputArray.push(inputArr[compare]);
                    itemEdit.push(inputArr[compare]);
                } else if(itemEdit.includes(inputArr[i])) {
                    outputArray.push(inputArr[i]);
                    itemEdit.push(inputArr[i]);
                }
            }
        }
    }
    if (extraArray.length !== 0) {
        outputArray.push(extraArray);
    }
    if(compare===0 && !itemEdit.includes(inputArr[compare])){
        outputArray.push(inputArr[compare]);
        itemEdit.push(inputArr[compare]);
    }
    return outputArray;
}

module.exports = {
    sortItemsOboveAnother,
    mapItemsLyingInEachOther,
    sortItemsfromLeftToRight
};