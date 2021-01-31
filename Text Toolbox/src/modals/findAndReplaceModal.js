/*
 * Copyright (c) 2018. by Pablo Klaschka
 */

const storage = require('../helpers/storage');
const debugHelper = require('../helpers/debug');
const lang = require('../helpers/language');
const SelectionChecker = require('../helpers/check-selection');
const errorHelper = require("../helpers/error");
const translationHelper = require("../helpers/language");
const analytics = require("../helpers/analytics");

/**
 * @param {Selection} selection
 */
async function showModal(selection) {
    await analytics.verifyAcceptance({
        pluginName: 'Text Toolbox',
        privacyPolicyLink: 'https://xdplugins.pabloklaschka.de/privacy-policy'
    });
    const selectionChecker = new SelectionChecker(selection);
    if (selectionChecker.oneOrMore('Text')) {
        debugHelper.log('Showing Find and Replace modal');
        let options = await modalAsync(selection);
        const replace = require('../functions/replace');
        await replace(selection, options);
        return true;
    } else {
        errorHelper.showErrorDialog(translationHelper.getString('replaceSelectionErrorTitle'),
            translationHelper.getString('replaceSelectionErrorText'));
        return false;
    }
}

/**
 * @param {Selection} selection
 */
async function modalAsync(selection) {
    return new Promise((resolve, reject) => {
        storage.get('replaceTextOptions', {
            search: '',
            replace: '',
            regex: false
        }).then(uiOptions => {

            // Removing old instances
            document.body.innerHTML = '';

            const dialog = document.createElement('dialog');
            dialog.id = 'loremModal';
            dialog.innerHTML = `
    <style>    
    [uxp-variant="cta"] {
    }
    
    form {
        width: 360px;
    }
    
    header {
        background: #2D4E64;
        height: 16px;
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
    }
    
    input[type="checkbox"] {
    width: 18px;
    }
    
    input[type="text"] {
        width: 100%;
    }
    </style>
    `;

            const form = document.createElement('form');
            form.method = 'dialog';

            form.appendChild(document.createElement('header'));


            const heading = document.createElement('h1');
            heading.innerHTML = lang.getString('replaceText');
            form.appendChild(heading);

            const description = document.createElement('p');
            description.innerHTML = lang.getString('replaceDescription');
            form.appendChild(description);

            const search = textInput(lang.getString('replaceSearchLabel'), uiOptions.search);
            const replace = textInput(lang.getString('replaceReplaceWithLabel'), uiOptions.replace);
            const regex = checkBox(lang.getString('replaceUseRegex'), uiOptions.regex);

            form.appendChild(search);
            form.appendChild(replace);
            form.appendChild(regex);


            const footer = document.createElement('footer');
            const btnOk = document.createElement('button');
            btnOk.id = "ok";
            btnOk.type = "submit";
            btnOk.innerHTML = lang.getString('replaceTextButton');
            btnOk.setAttribute('uxp-variant', 'cta');
            btnOk.onclick = () => {
                const replaceTextOptions = {
                    search: search.childNodes.item(1).value,
                    replace: replace.childNodes.item(1).value,
                    regex: regex.childNodes.item(0).checked
                };
                storage.set('replaceTextOptions', replaceTextOptions).then(() => {
                    debugHelper.log("Replace text");
                    dialog.close();
                    resolve(replaceTextOptions);
                    document.body.innerHTML = '';
                });
            };
            btnOk.setAttribute('autofocus', 'autofocus');
            const btnCancel = document.createElement('button');
            btnCancel.id = "insertText";
            btnCancel.innerHTML = lang.getString('cancel');
            btnCancel.onclick = () => {
                debugHelper.log("Closing Find and Replace");
                dialog.close();
                reject();
                document.body.innerHTML = '';
            };
            footer.appendChild(btnCancel);
            footer.appendChild(btnOk);
            form.appendChild(footer);
            dialog.appendChild(form);
            document.body.appendChild(dialog);

            dialog.showModal().then(() => resolve()).catch(() => reject());
        });
    });
}
function checkBox(label, defaultChecked) {
    const lblCheck = document.createElement("label");
    Object.assign(lblCheck.style, {flexDirection: "row", alignItems: "center"});
    // lblCheck.class = 'row';
    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.id = label;
    checkBox.placeholder = label;
    if (defaultChecked) {
        checkBox.checked = true;
    }
    lblCheck.appendChild(checkBox);
    const spanLblCheck = document.createElement('span');
    spanLblCheck.innerHTML = label;
    lblCheck.appendChild(spanLblCheck);

    return lblCheck;
}

function textInput(label, defaultValue) {
    let lblText = document.createElement("label");
    //Object.assign(lblText.style, {flexDirection: "row", alignItems: "center"});
    const txtInput = document.createElement('input');
    txtInput.type = 'text';
    txtInput.id = label;
    txtInput.placeholder = label;
    txtInput.value = defaultValue;
    const spanLblCheck = document.createElement('span');
    spanLblCheck.innerHTML = label + '<br>';
    lblText.appendChild(spanLblCheck);
    lblText.appendChild(txtInput);

    return lblText;
}

module.exports = showModal;