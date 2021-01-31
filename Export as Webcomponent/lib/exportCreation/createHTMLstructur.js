const {deleteSpaces, textWithBreaks} = require("../helper");
const {mapItemsLyingInEachOther, sortItemsfromLeftToRight} = require("../selectionHandler.js");
const {Group} = require(".././objects/group");

function getStartTag(item) {
    let constname = item.constructor.name;
    let description = item.name;
    if (constname.includes("Text")) {
        return `<label id="${deleteSpaces(description)}">`;
    } else if (description.includes("checkbox")) {
        return `<input type="checkbox" id="${deleteSpaces(description)}">`;
    } else if (description.includes("radiobutton")) {
        return `<input type="radio" id="${deleteSpaces(description)}">`;
    } else if (description.includes("input")) {
        return `<input id="${deleteSpaces(description)}">`;
    } else {
        return `<div id="${deleteSpaces(description)}">`;
    }
}

function getEndTag(item) {
    let constname = item.constructor.name;
    let description = item.name;
    if (constname.includes("Text")) {
        return "</label>";
    } else if (description.includes("input") || description.includes("checkbox") || description.includes("radiobutton")) {
        return "";
    } else {
        return "</div>";
    }
}

function getSeperatTag(item) {
    let constname = item.constructor.name;
    let description = item.name;
    if (constname.includes("Text")) {
        if (description.includes("list")) {
            let text = item.text;
            let listEntries = text.split("\n");
            let listHTML = `<ul id="${deleteSpaces(description)}">
`;
            listEntries.forEach(entry => {
                let firstLetterIndex = entry.search(/[a-zA-Z0-9]/);
                let finalEntry = entry.slice(firstLetterIndex);
                listHTML += `<li>${finalEntry.trim()}</li>
`;
            });
            listHTML += "</ul>";
            return listHTML;
        } else if (description.includes("link")) {
            return `<a href="url" id="${deleteSpaces(description)}">${item.text}</a>`
        } else {
            return `<label id="${deleteSpaces(description)}"'>${textWithBreaks(item.text)}</label>`;
        }
    } else if (description.includes("checkbox")) {
        return `<input type="checkbox" id="${deleteSpaces(description)}">`;
    } else if (description.includes("radiobutton")) {
        return `<input type="radio" id="${deleteSpaces(description)}">`;
    } else if (description.includes("input")) {
        return `<input id="${deleteSpaces(description)}">`;
    } else if (constname.includes("Line")) {
        return `<hr id="${deleteSpaces(description)}">`
    } else if (description.includes("img")) {
        return `<img id="${deleteSpaces(description)}" src="_mat/${description}.png" alt="${description}">`;
    } else {
        return `<div id="${deleteSpaces(description)}"></div>`;
    }
}

function getTagforSpecificGroups(item) {
    let description = item.name;
    if (description.includes("input")) {
        let group = new Group(item);
        let children = group.getChildren(item.children);
        return `<input id="${deleteSpaces(description)}" type='text' placeholder="${children[1].text}">`;
    } else if (description.includes("button")) {
        let group = new Group(item);
        let children = group.getChildren(item.children);
        return `<button id="${deleteSpaces(description)}">${children[1].text}</button>`;

    }
}

function createHTML(list, map, startTag) {
    let htmlString = "";
    for (let i = 0; i < list.length; i++) {
        let keyItem = list[i];
        //Elemente liegen nebeneinander
        if (list[i].length !== undefined) {
            list[i].forEach(key => {
                if (startTag[startTag.length - 1] !== undefined && !startTag[startTag.length - 1].includes("div id") && list[i].indexOf(key) === 0 && key.constructor.name !== "Line") {
                    startTag.push("<div>");
                }
                //div einfügen, wenn neuen Zeile!
                //KeyItem beinhaltet Values
                if (map.get(key) !== "seperat") {
                    let valueItems1 = map.get(key);
                    let valueMap1 = mapItemsLyingInEachOther(valueItems1);
                    let newKeyArray1 = [];
                    for (let key of valueMap1.keys()) {
                        newKeyArray1.push(key);
                    }
                    let sortedValueList1 = sortItemsfromLeftToRight(newKeyArray1);
                    createHTML(sortedValueList1, valueMap1, startTag);
                } else {
                    //Auswahl beinhaltet eine Gruppe
                    if (key.constructor.name === "Group") {
                        if (key.name.includes("img")) {
                            let imgTag = getSeperatTag(key);
                            startTag.push(imgTag);
                        } else {
                            let tag = getTagforSpecificGroups(key);
                            startTag.push(tag);
                        }
                    } else {
                        //Auswahl ist ein einzeldes Element
                        let tag = getSeperatTag(key);
                        startTag.push(tag);
                    }
                }
                if (list[i].length - 1 === list[i].indexOf(key) && i !== 0) {
                    startTag.push("</div>");
                }
            });
            //IndexElement beinhaltet KEINE Liste
        } else if (map.get(list[i]) !== "seperat") {
            //KeyItem beinhaltet Values
            let keyTag = getStartTag(keyItem);
            startTag.push(keyTag);
            let valueItems = map.get(list[i]);
            let valueMap = mapItemsLyingInEachOther(valueItems);
            let newKeyArray = [];
            for (let key of valueMap.keys()) {
                newKeyArray.push(key);
            }
            let sortedValueList = sortItemsfromLeftToRight(newKeyArray);
            createHTML(sortedValueList, valueMap, startTag);
            startTag.push(getEndTag(keyItem));
        } else if (keyItem.constructor.name === "Group") {
            //Element ist einzelnd Auswahl beinhaltet eine Gruppe
            if (startTag[startTag.length - 1] !== undefined && !startTag[startTag.length - 1].includes("div id")) {
                startTag.push("<div>");
            }
            if (keyItem.name.includes("img")) {
                let imgTag = getSeperatTag(keyItem);
                startTag.push(imgTag);
            } else {
                let tag = getTagforSpecificGroups(keyItem);
                startTag.push(tag);
            }
            if (startTag[startTag.length - 2] !== undefined && !startTag[startTag.length - 2].includes("div id")) {
                startTag.push("</div>");
            }
        } else {
            //Einzelndes Element
            if (startTag[startTag.length - 1] !== undefined && !startTag[startTag.length - 1].includes("div id") && keyItem.constructor.name !== "Line") {
                startTag.push("<div>");
            }
            let keyTag = getSeperatTag(keyItem);
            startTag.push(keyTag);
            if (startTag[startTag.length - 2] !== undefined && !startTag[startTag.length - 2].includes("div id") && keyItem.constructor.name !== "Line") {
                startTag.push("</div>");
            }
        }
    }
    //Formatierung bzw. untereinandershcreiben der Tags
    for (let j = 0; j < startTag.length; j++) {
        if (j === startTag.length - 1) {
            htmlString += startTag[j];
        } else {
            htmlString += startTag[j] + "\n";
        }
    }
    return htmlString;
}

module.exports = {
    createHTML,
};