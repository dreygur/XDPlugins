const application = require("application");
const fs = require("uxp").storage.localFileSystem;
const storage = require("uxp").storage;
const { alert, confirm, error } = require("../lib/dialogs.js");
const createProgressBar = require("../modals/progress_modal.js");
const JSZip = require("../helpers/jszip.js");

async function exportAppIcons(selection, rootNode) {
    let icons = [];
    findIcons(rootNode, icons);
    if (icons.length == 0) {
        await error("There are no icons to export",
            "Please use valid adobe xd file.");
        return;
    }

    const feedback = await confirm("Select output location",
        "This will create the file woodford-appicon.zip with your app store icons.",
        ["Cancel", "Ok"]);
    if (!feedback.which) return; //user selects cancel btn

    const rootFolder = await fs.getFolder();
    if (rootFolder == null) return; //no rootFolder selected, cancel

    let zipFile = await rootFolder.createFile('woodford-appicon.zip', { overwrite: true });

    setTimeout(async () => { //modal dialogs closing timeout bug
        let progressDialog = createProgressBar(icons.length);
        progressDialog.showModal();
        await createIcons(icons, zipFile);

        progressDialog.close();
        setTimeout(async () => { //modal dialogs closing timeout bug
            await alert('Export successful',
                'Your project data is ready. You can now import the file woodford-appicon.zip into Woodford',
                'File location: ' + rootFolder.nativePath);
        }, 700);
    }, 700);
}

async function createIcons(icons, zipFile) {
    let files = [];
    const settingsFolder = await fs.getDataFolder();
    for (let i = 0; i < icons.length; i++) {
        let icon = icons[i];
        const tempFile = await settingsFolder.createFile('tempFile.png', { overwrite: true });
        const renditionsSettings = [{
            node: icon.data,
            outputFile: tempFile,
            type: application.RenditionType.PNG,
            scale: 1
        }];
        await application.createRenditions(renditionsSettings);

        let fileContentArrBuff = await tempFile.read({ format: storage.formats.binary });
        let fileContentBase64 = base64ArrayBuffer(fileContentArrBuff);
        files.push({
            path: icons[i].path,
            content: fileContentBase64
        });

        document.querySelector('#progressBar').value = i + 1;
        document.querySelector('#percentageValue').innerHTML = Math.round(((i + 1) / icons.length) * 100) + "%";
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

function findIcons(node, icons) {
    node.children.forEach(child => {
        if (child.isContainer) findIcons(child, icons);
        if (child.name.includes('appicon') && child.name.includes(' / ') && !child.name.includes('bkg')) {
            let icon = new Icon(child, child.name);
            icons.push(icon);
        }
    });
}

class Icon {
    constructor(iconData, name) {
        this.data = iconData,
            this.name = name
        this.createPath(name);
    }
    createPath(name) {
        let textArr = name.split(' / ');
        textArr[textArr.length - 1] += '.png'
        textArr.shift();
        textArr.unshift('App Images');
        this.path = "";
        for (let i = 0; i < textArr.length; i++) {
            this.path += textArr[i] + '/';
        }
        this.path = this.path.substring(0, this.path.length - 1);
    }
}

module.exports = exportAppIcons;