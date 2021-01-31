var scenegraph = require("scenegraph");
var fs = require("uxp").storage.localFileSystem;
var sm = require("./selectionManagement.js"),
    fm = require("./fileManagement.js");


// Generate a random int from the interval [min, max]
function getRandomIntInARange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function getData(fileName) {
    var pluginFolder = await fs.getPluginFolder(),
        pluginEntries = await pluginFolder.getEntries(),
        dataEntries = await fm.getFilesFromSpecificFolder(pluginEntries, 'data');
    var data = await fm.readSpecificFile(dataEntries, fileName);
    return data;
}

function insertText(selection, node, content) {
    if (node instanceof scenegraph.Text) 
        node.text = content;
    else {
        var textNode = new scenegraph.Text();
        textNode.text = content;
        textNode.styleRanges = [{fill: new scenegraph.Color('#707070'), fontSize: 20}];
        selection.insertionParent.addChild(textNode);
        textNode.placeInParentCoordinates(textNode.globalBounds, node.globalBounds);
    }
}

// Generate NAMES as a combination of the data found in 'names.json'
async function names(selection, gender) {
    var data = await getData('names.json'),
        forename;
    if (gender == 'male') {
        forename = data.forename.male;
    } else if (gender == 'female') {
        forename = data.forename.female;
    } else {
        forename = data.forename.male.concat(data.forename.female);
    }
    selection.items.forEach(function(node) {
        var content = forename[getRandomIntInARange(0, forename.length - 1)] + ' ' + 
                   data.surname[getRandomIntInARange(0, data.surname.length - 1)];
        insertText(selection, node, content);
    });
}

// MALE NAMES
async function maleNames(selection) {
    await names(selection, 'male');
}

// FEMALE NAMES
async function femaleNames(selection) {
    await names(selection, 'female');
}

// MIXED NAMES
async function mixedNames(selection) {
    await names(selection, 'mixed');
}

// Generate EMAIL as a combination of data found in 'names.json'
async function email(selection) {
    var data = await getData('names.json'),
        forename = data.forename.male.concat(data.forename.female);
    selection.items.forEach(function(node) {
        var name = forename[getRandomIntInARange(0, forename.length - 1)] + ' ' + 
                   data.surname[getRandomIntInARange(0, data.surname.length - 1)];
        name = name.toLowerCase().split(' ');
        var content = name[0] + '.' + name[1] + '@mail.com';
        insertText(selection, node, content);
    });
}

// COUNTRY
async function country(selection) {
    var data = await getData('location.json');
    selection.items.forEach(function(node) {
        var content = data.country[getRandomIntInARange(0, data.country.length - 1)];
        insertText(selection, node, content);
    });
}

// CITY
async function city(selection) {
    var data = await getData('location.json');
    selection.items.forEach(function(node) {
        var content = data.city[getRandomIntInARange(0, data.city.length - 1)];
        insertText(selection, node, content);
    });
}

// Generate a phone number by randomly generating each digit
function generatePhoneNumber() {
    var phoneNumber = "(";
    for (var i = 1; i <= 10; i++) {
        phoneNumber = phoneNumber + getRandomIntInARange(0, 9);
        phoneNumber = i == 3 ? phoneNumber + ')' : phoneNumber;
        phoneNumber = i == 6 ? phoneNumber + '-' : phoneNumber;
    }
    return phoneNumber;
}

// PHONE NUMBER
function phoneNumber(selection) {
    selection.items.forEach(function(node) {
        var content = generatePhoneNumber();
        insertText(selection, node, content);
    });
}

// PERCENTAGE (a number between 1 and 100)
function percentage(selection) {
    selection.items.forEach(function(node) {
        var content = getRandomIntInARange(0, 100).toString() + '%';
        insertText(selection, node, content);
    });
}

// SIMPLE NUMBER (a number in the range 0 - 5000)
function simpleNumber(selection) {
    selection.items.forEach(function(node) {
        var content = getRandomIntInARange(0, 5000).toString();
        insertText(selection, node, content);
    });
}

// PRICE (a number in the range 1 - 2000)
function price(selection, coin) {
    selection.items.forEach(function(node) {
        var content = getRandomIntInARange(1, 2000).toString() + coin;
        insertText(selection, node, content);
    });
}

function price_dollar(selection) {
    price(selection, '$');
}

function price_euro(selection) {
    price(selection, '€');
}

function price_lira(selection) {
    price(selection, '£');
}

// Generate a date in the specified format
async function generateDate(dateFormat) {
    var data = await getData('months.json'),
        currentYear = (new Date()).getFullYear(),
        year = getRandomIntInARange(1950, currentYear),
        nrMonth = getRandomIntInARange(0, 11),
        nrDay = getRandomIntInARange(data.months[nrMonth].firstDay, data.months[nrMonth].lastDay),
        month = nrMonth < 9 ? '0' + (nrMonth + 1) : (nrMonth + 1).toString(),
        day = nrDay < 10 ? '0' + nrDay : nrDay.toString(),
        date;
    switch (dateFormat) {
        case 'MM/DD':
            date = month + '/' + day;
            break;
        case 'MMM DD':
            date = data.months[nrMonth].name + ' ' + day;
            break;
        case 'MM/DD/YY':
            date = month + '/' + day + '/' + year;
            break;
        case 'DD/MM':
            date = day + '/' + month;
            break;
        case 'DD MMM':
            date = day + ' ' + data.months[nrMonth].name;
            break;
        case 'DD/MM/YY':
            date = day + '/' + month + '/' + year;
            break;
        default:
            console.log("Invalid date format");
    }
    return date;
}

// Generate a set of dates (for all the items in the selection)
async function dateGenerator(selection, dateFormat) {
    for (var i = 0; i < selection.items.length; i++) {
        var content = await generateDate(dateFormat);
        insertText(selection, selection.items[i], content);
    }
}

// Different formats of 'date'
async function MM_DD_Date(selection) {
    await dateGenerator(selection, 'MM/DD');
}

async function MMM_DD_Date(selection) {
    await dateGenerator(selection, 'MMM DD');
}

async function MM_DD_YY_Date(selection) {
    await dateGenerator(selection, 'MM/DD/YY');
}

async function DD_MM_Date(selection) {
    await dateGenerator(selection, 'DD/MM');
}

async function DD_MMM_Date(selection) {
    await dateGenerator(selection, 'DD MMM');
}

async function DD_MM_YY_Date(selection) {
    await dateGenerator(selection, 'DD/MM/YY');
}

// Generate a PHARAGRAPH choosing from data found in 'loremipsum.json'
async function paragraph(selection) {
    var data = await getData('loremipsum.json');
    selection.items.forEach(function(node) {
        var content = data.paragraphs[getRandomIntInARange(0, data.paragraphs.length - 1)];
        insertText(selection, node, content);
    });
}

// Generate a TITLE choosing from data found in 'loremipsum.json'
async function title(selection) {
    var data = await getData('loremipsum.json');
    selection.items.forEach(function(node) {
        var nrWords = getRandomIntInARange(2, 3),
            title = '';
        for (var j = 0; j < nrWords; j++) {
            title = title + data.words[getRandomIntInARange(0, data.words.length - 1)] + ' ';
        }
        title = title.charAt(0).toUpperCase() + title.slice(1);
        insertText(selection, node, title);
    });
}

module.exports = {
    maleNames: maleNames,
    femaleNames: femaleNames,
    mixedNames: mixedNames,
    email: email,
    country: country,
    city: city,
    phoneNumber: phoneNumber,
    percentage: percentage,
    simpleNumber: simpleNumber,
    price_dollar: price_dollar,
    price_euro: price_euro,
    price_lira: price_lira,
    MM_DD_Date: MM_DD_Date,
    MMM_DD_Date: MMM_DD_Date,
    MM_DD_YY_Date: MM_DD_YY_Date,
    DD_MM_Date: DD_MM_Date,
    DD_MMM_Date: DD_MMM_Date,
    DD_MM_YY_Date: DD_MM_YY_Date,
    paragraph: paragraph,
    title: title,
}