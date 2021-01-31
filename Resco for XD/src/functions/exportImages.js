const application = require("application");
const storage = require("uxp").storage;
const fs = storage.localFileSystem;
const { alert, confirm, error } = require("../lib/dialogs.js");
const createProgressBar = require("../modals/progress_modal.js");
const createColorizeModal = require("../modals/colorize_modal.js");
const JSZip = require("../helpers/jszip.js");

async function exportImages(selection, rootNode) {
    const icons = [], categories = [];

    if (selection.items.length) { //if selection, find icons from selection, otherwise from rootNode
        selection.children = selection.items;
        findIcons(selection, icons, categories); //find icons in selection
    } else {
        findIcons(rootNode, icons, categories); //find icons in rootNode
    }
    console.log('Icons length: ' + icons.length);

    if (!icons.length) { //no icons found, probably invalid .xd file...
        await error('There are no icons to export', 'Please use valid adobe xd file.');
        return;
    }

    const feedback = await confirm('Select output location', `This will create the file woodford-images.zip with all project images and icons.`, ["Cancel", "Ok"]);
    if (!feedback.which) return; //user clicks cancel btn

    const rootFolder = await fs.getFolder();
    if (rootFolder == null) return; //no rootFolder selected

    let colorizeCategoriesCached = await getColorizeCache(); //settings.json colorize info retrieve
    let colorizeModal = createColorizeModal(categories, colorizeCategoriesCached);
    await colorizeModal.showModal();
    let toColorizeCategories = getColorizeCategories();
    savePrefs(toColorizeCategories); //save to settings.json new preferences
    colorizeModal.close();

    let zipFile = await rootFolder.createFile('woodford-images.zip', { overwrite: true });

    let progressDialog = createProgressBar(icons.length);
    progressDialog.showModal();
    await createIcons(icons, toColorizeCategories, zipFile);

    document.querySelector('#progressBar').value = 0;
    progressDialog.close();
    await alert('Export successful',
        'Your project data is ready. You can now import the file woodford-images.zip to Woodford.',
        'File location: ' + rootFolder.nativePath);
}

async function createIcons(icons, toColorizeCategories, zipFile) {
    let files = [];
    const settingsFolder = await fs.getDataFolder();
    for (let i = 0; i < icons.length; i++) {
        let icon = icons[i];
        const tempFile = await settingsFolder.createFile('tempFile.png', { overwrite: true });
        const renditionsSettings = [{
            node: icon.data,
            outputFile: tempFile,
            type: application.RenditionType.PNG,
            scale: 2
        }];
        let file = await application.createRenditions(renditionsSettings);
        try {
            if (toColorizeCategories.includes(icon.category)) {
                let IE = new ImagesEditor;

                let outputFile = file[0].outputFile;
                let arrBuff = await outputFile.read({ format: storage.formats.binary });

                let arr = [];
                var view = new Uint8Array(arrBuff);

                for (let key in view) {
                    arr.push(view[key]);
                }

                let base64Colorized = IE.SetColorize(arr, true);

                arrBuff = Base64Binary.decodeArrayBuffer(base64Colorized);

                await outputFile.write(arrBuff, { format: storage.formats.binary });
            }

            let fileContentArrBuff = await tempFile.read({ format: storage.formats.binary });
            let fileContentBase64 = base64ArrayBuffer(fileContentArrBuff);
            files.push({
                path: icons[i].path,
                content: fileContentBase64
            });

            document.querySelector('#progressBar').value = i + 1;
            document.querySelector('#percentageValue').innerHTML = Math.round(((i + 1) / icons.length) * 100) + "%";
        } catch (err) {
            console.log(err);
        }

    }
    let output = await zipProject(files, true);
    await zipFile.write(output, { format: storage.formats.binary });
}

async function zipProject(files, inputInBase64) {
    const options = {
        base64: inputInBase64
    };

    const zip = new JSZip();
    files.forEach(f => {
        zip.file(f.path, f.content, options);
    });
    return await zip.generateAsync({ type: "uint8array", compression: 'deflate' });
}

function base64ArrayBuffer(arrayBuffer) { //ArrayBuffer to base64
    var base64 = '';
    var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    var bytes = new Uint8Array(arrayBuffer);
    var byteLength = bytes.byteLength;
    var byteRemainder = byteLength % 3;
    var mainLength = byteLength - byteRemainder;

    var a, b, c, d;
    var chunk;

    for (var i = 0; i < mainLength; i = i + 3) {
        chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];

        a = (chunk & 16515072) >> 18;
        b = (chunk & 258048) >> 12;
        c = (chunk & 4032) >> 6;
        d = chunk & 63;

        base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
    }

    if (byteRemainder == 1) {
        chunk = bytes[mainLength];

        a = (chunk & 252) >> 2;
        b = (chunk & 3) << 4;

        base64 += encodings[a] + encodings[b] + '==';
    } else if (byteRemainder == 2) {
        chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];

        a = (chunk & 64512) >> 10;
        b = (chunk & 1008) >> 4;
        c = (chunk & 15) << 2;

        base64 += encodings[a] + encodings[b] + encodings[c] + '=';
    }

    return base64;
}

var Base64Binary = { //base64 to ArrayBuffer
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    /* will return a  Uint8Array type */
    decodeArrayBuffer: function (input) {
        var bytes = (input.length / 4) * 3;
        var ab = new ArrayBuffer(bytes);
        this.decode(input, ab);

        return ab;
    },

    removePaddingChars: function (input) {
        var lkey = this._keyStr.indexOf(input.charAt(input.length - 1));
        if (lkey == 64) {
            return input.substring(0, input.length - 1);
        }
        return input;
    },

    decode: function (input, arrayBuffer) {
        //get last chars to see if are valid
        input = this.removePaddingChars(input);
        input = this.removePaddingChars(input);

        var bytes = parseInt((input.length / 4) * 3, 10);

        var uarray;
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        var j = 0;

        if (arrayBuffer)
            uarray = new Uint8Array(arrayBuffer);
        else
            uarray = new Uint8Array(bytes);

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        for (i = 0; i < bytes; i += 3) {
            //get the 3 octects in 4 ascii chars
            enc1 = this._keyStr.indexOf(input.charAt(j++));
            enc2 = this._keyStr.indexOf(input.charAt(j++));
            enc3 = this._keyStr.indexOf(input.charAt(j++));
            enc4 = this._keyStr.indexOf(input.charAt(j++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            uarray[i] = chr1;
            if (enc3 != 64) uarray[i + 1] = chr2;
            if (enc4 != 64) uarray[i + 2] = chr3;
        }

        return uarray;
    }
}

class ImagesEditor {
    SetColorize(data, colorize) {
        var aLFa = this.MakeID("aLFa");
        var IHDR = this.MakeID("IHDR");

        var byteArr = [137, 80, 78, 71, 13, 10, 26, 10];

        if (!(data[0] === 137 && data[1] === 80 && data[2] === 78 && data[3] === 71 && data[4] === 13 && data[5] === 10 && data[6] === 26 && data[7] === 10))
            console.log('error');

        var size = data.length;
        var pos = 8;

        while (pos < size) {
            var chunkLength = this.ReadLong([data[pos], data[pos + 1], data[pos + 2], data[pos + 3]]);  // zips uint8array format actually is not array so we cannot use slice method
            pos += 4;
            var chunkCode = this.ReadLong([data[pos], data[pos + 1], data[pos + 2], data[pos + 3]]);
            pos += 4;

            if (chunkCode !== aLFa && ((chunkCode & 0x20000000) === 0)) {
                for (var i = pos - 8; i < pos + chunkLength + 4; i++)
                    byteArr.push(data[i]);
            }

            if (chunkCode === IHDR && colorize)
                byteArr.push(...[0, 0, 0, 1, 97, 76, 70, 97, 0, 187, 67, 229, 241]);       // 0,0,0,1 - length 97,76,70,97 - aLFa, 0 - value, 187,67,229,241 - crc (3141789169)

            pos += chunkLength + 4;     // move on: DATA + CRC
        }
        return base64ArrayBuffer(byteArr); //returns base64 data
    }

    MakeID(input) {
        var r = 0;
        var len = Math.min(4, input.length);
        for (var i = 0; i < len; i++) {
            r = (r << 8);
            r |= input.charCodeAt(i);
        }
        return r;
    }

    ReadLong(data) {
        var r = 0;
        for (var i = 0; i < 4; i++) {
            var b = data[i];
            if (b === -1)
                b = 0;
            r = (r << 8);
            r |= b;
        }
        return r;
    }
}

function getColorizeCategories() {
    let toColorizeCategories = [];
    let checkboxEls = document.querySelectorAll('.checkbox');
    for (let i = 0; i < checkboxEls.length; i++) {
        let checkboxEl = checkboxEls[i];
        if (checkboxEl.checked) {
            let parentEl = checkboxEl.parentNode;
            parentEl.removeChild(checkboxEl);
            toColorizeCategories.push(parentEl.innerHTML);
        }
    }
    return toColorizeCategories;
}

async function getColorizeCache() {
    const settingsFolder = await fs.getDataFolder();
    try {
        var settingsFile = await settingsFolder.getEntry("settings.json");
    } catch (err) {
        if (!settingsFile) {
            await savePrefs([]);
        }
    }
    let data = await readPrefs();
    return data;
}

async function savePrefs(prefs) {
    const settingsFolder = await fs.getDataFolder();
    try {
        const settingsFile = await settingsFolder.createFile("settings.json", { overwrite: true });
        await settingsFile.write(JSON.stringify(prefs));
    } catch (err) {
        console.log(err);
    }
}

async function readPrefs() {
    const settingsFolder = await fs.getDataFolder();
    try {
        const settingsFile = await settingsFolder.getEntry("settings.json");
        let content = await settingsFile.read();
        return content;
    } catch (err) {
        console.log(err);
    }
}

function findIcons(node, icons, categories) {
    node.children.forEach(child => {
        if (child.isContainer) findIcons(child, icons, categories);
        if (child.name.includes('icon / ') && !child.name.includes('bkg')) {
            let childCategory = extractCategory(child);
            if (!categories.includes(childCategory) && childCategory != undefined)
                categories.push(childCategory);
            let icon = new Icon(child, childCategory, child.name);
            icons.push(icon);
        }
    });
}

function extractCategory(item) {
    let textArr = item.name.split('/');
    if (textArr.length < 3) {
        return;
    }
    let category = textArr[textArr.length - 2].trim();
    return category.charAt(0).toUpperCase() + category.slice(1); //first letter capitalize
}

class Icon {
    constructor(iconData, category, name) {
        this.data = iconData,
            this.category = category,
            this.name = name,
            this.createPath(name)
    }
    createPath(name) {
        let path;
        let textArr = name.split(' / ');
        textArr[textArr.length - 2] = textArr[textArr.length - 2].charAt(0).toUpperCase() + textArr[textArr.length - 2].slice(1);
        textArr[textArr.length - 1] += '@2x.png'
        textArr.shift();
        textArr.unshift('MobileCrm', 'Images.MonoTouch');
        this.path = "";
        for (let i = 0; i < textArr.length; i++) {
            this.path += textArr[i] + '/';
        }
        this.path = this.path.substring(0, this.path.length - 1);
    }
}

module.exports = exportImages;