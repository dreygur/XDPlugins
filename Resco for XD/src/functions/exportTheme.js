const fs = require("uxp").storage.localFileSystem;
const { alert, confirm, error } = require("../lib/dialogs.js");

async function exportTheme(sel, rootNode) {
    const elements = [];
    getColorElements(rootNode, elements);

    if (!elements.length) { //no colors found, probably invalid .xd file...
        await error('There is no theme to export', 'Please use valid Adobe xd file.');
        return;
    }

    const feedback = await confirm('Select output location', 'This will create a custom theme file with rendered palette data.', ["Cancel", "Ok"]);
    if (!feedback.which) return;

    const rootFolder = await fs.getFolder();
    if (!rootFolder) return; //no rootFolder selected

    const outputFile = await rootFolder.createEntry('woodford-theme.wtheme', { overwrite: true });

    const fileContent = createOutputContent(elements);
    outputFile.write(fileContent);

    await alert('Export successful', 'Your theme data is ready. You can now import the file woodford-theme.wtheme into Woodford', `File location: ${outputFile.nativePath}`);
}

function createOutputContent(elements) {
    const paletteColors = [];
    elements.forEach(h => {
        h.children.forEach(item => {
            if (!paletteColors.includes(item.fill.value)) {
                paletteColors.push(item.fill.value);
            }
            h.reference = paletteColors.indexOf(item.fill.value);
        });
    });
    const outputHeader = `<ThemeItem Version="4"><IsCustom>false</IsCustom><Label>All Platforms</Label>`;
    const outputFooter = `</ThemeItem>`;

    const outputMain = getColors(elements) + getPalettes(paletteColors);

    return outputHeader + outputMain + outputFooter;
}

function getColors(elements) {
    let content = '';
    for (let i = 0; i < elements.length; i++) {
        let textArr = elements[i].name.split('/');
        let name = textArr[textArr.length - 1];
        content += `<colors name="${name.trim()}" color="PAL:${elements[i].reference}"/>`
    }
    return content;
}

function getPalettes(paletteColors) {
    let content = '';
    for (let i = 0; i < paletteColors.length; i++) {
        content += `<palette>${paletteColors[i]}</palette>`;
    }
    return content;
}

function getColorElements(rootNode, elements) {
    rootNode.children.forEach(artBoard => {
        if (artBoard.isContainer) {
            elementRecursion(artBoard, elements);
        }
    });
}

function elementRecursion(node, elements) {
    if (node.isContainer) {
        node.children.forEach(item => {
            if (item.isContainer) elementRecursion(item, elements);
            else {
                if (node.name.includes('color / ')) {
                    return elements.push(node);
                }
            }
        });
    } else {
        if (node.name.includes('color / ')) {
            return elements.push(node);
        }
    }
}

module.exports = exportTheme;