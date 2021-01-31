/*
 * Copyright (c) 2018. by Pablo Klaschka
 */

const storage = require('../helpers/storage');
const debugHelper = require('../helpers/debug');
const lang = require('../helpers/language');
const SelectionChecker = require('../helpers/check-selection');
const errorHelper = require("../helpers/error");
const analytics = require("../helpers/analytics");
const translationHelper = require("../helpers/language");

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
        debugHelper.log('Showing Lorem Ipsum modal');
        let options = await modalAsync(selection);
        const lorem = require('../functions/lorem');
        await lorem(selection, options);
        return true;
    } else {
        errorHelper.showErrorDialog(translationHelper.getString('loremSelectionErrorTitle'), translationHelper.getString('loremSelectionErrorText'));
        return false;
    }
}

/**
 * @param {Selection} selection
 */
async function modalAsync(selection) {
    return new Promise((resolve, reject) => {
        storage.get('loremOptions', {
            text: 'lorem-lat',
            terminate: true,
            includeLineBreaks: true,
            trim: false
        }).then(uiOptions => {

            // Removing old instances
            document.body.innerHTML = '';

            const dialog = document.createElement('dialog');
            dialog.id = 'loremModal';
            dialog.innerHTML = `
    <style>
    header {
        background: #2D4E64;
        height: 16px;
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
    }
    
    form {
        width: 360px;
    }
    
    input[type="checkbox"] {
    width: 18px;
    }
    </style>
    `;

            const form = document.createElement('form');
            form.method = 'dialog';

            form.appendChild(document.createElement('header'));


            const heading = document.createElement('h1');
            heading.innerHTML = 'Lorem Ipsum';
            form.appendChild(heading);

            const description = document.createElement('p');
            description.innerHTML = lang.getString('modal-lorem-description');
            form.appendChild(description);

            const text = selectBox(lang.getString('modal-lorem-text-label'), [
                {value: 'lorem-lat', label: 'Lorem Ipsum (Latin, Standard)'},
                {value: 'cicero-lat', label: 'Cicero (Latin)'},
                {value: 'cicero-en', label: 'Cicero (English)'},
                {value: 'pangram-en', label: 'Pangram (English)'},
                {value: 'pangram-de', label: 'Pangram (German)'},
                {value: 'pangram-es', label: 'Pangram (Espagnol)'},
                {value: 'pangram-fr', label: 'Pangram (Français)'},
            ], uiOptions.text);
            const terminate = checkBox(lang.getString('modal-lorem-terminate-label'), uiOptions.terminate);
            const includeLineBreaks = checkBox(lang.getString('modal-lorem-includeLineBreaks-label'), uiOptions.includeLineBreaks);
            const trim = checkBox(lang.getString('modal-lorem-trim-label'), uiOptions.trim);

            form.appendChild(text);
            form.appendChild(terminate);
            form.appendChild(includeLineBreaks);
            form.appendChild(trim);



            const footer = document.createElement('footer');
            const btnOk = document.createElement('button');
            btnOk.id = "ok";
            btnOk.type = "submit";
            btnOk.innerHTML = lang.getString('modal-lorem-btn-ok');
            btnOk.setAttribute('uxp-variant', 'cta');
            btnOk.onclick = () => {
                const loremOptions = {
                    text: text.childNodes.item(1).value,
                    terminate: terminate.childNodes.item(0).checked,
                    includeLineBreaks: includeLineBreaks.childNodes.item(0).checked,
                    trim: trim.childNodes.item(0).checked
                };
                storage.set('loremOptions', loremOptions).then(() => {
                    debugHelper.log("Lorem Ipsum");
                    dialog.close();
                    resolve(loremOptions);
                    document.body.innerHTML = '';
                });
            };
            btnOk.setAttribute('autofocus', 'autofocus');
            const btnCancel = document.createElement('button');
            btnCancel.id = "insertText";
            btnCancel.innerHTML = lang.getString('cancel');
            btnCancel.onclick = () => {
                debugHelper.log("Closing Lorem Ipsum");
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

function selectBox(label, entries, defaultValue) {
    const lblSelect = document.createElement("label");
    const spanLblSelect = document.createElement('span');
    spanLblSelect.innerHTML = label;
    lblSelect.appendChild(spanLblSelect);
    const select = document.createElement('select');

    for (let entry of entries) {
        let optEntry = document.createElement("option");
        optEntry.value = entry.value;
        optEntry.innerHTML = entry.label;
        select.appendChild(optEntry);
    }
    if (defaultValue) {
        select.value = defaultValue;
    }
    lblSelect.appendChild(select);

    return lblSelect;
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

module.exports = showModal;