/*
 * Copyright (c) 2018. by Pablo Klaschka
 */

const storage = require('../helpers/storage');
const debugHelper = require("../helpers/debug");
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
    if (selectionChecker.oneOrMore('*')) {
        debugHelper.log('Showing TAT main modal');
        let options = await modalAsync(selection);
        const copyHTML = require('../functions/copyHTML');
        await copyHTML(selection, options);
        return true;
    } else {
        errorHelper.showErrorDialog(translationHelper.getString('copyHTMLSelectionErrorTitle'), translationHelper.getString('copyHTMLSelectionErrorText'));
        return false;
    }
}

/**
 * @param {Selection} selection
 */
async function modalAsync(selection) {
    return new Promise((resolve, reject) => {
        storage.get('copyHTMLOptions', {
            layerNameComments: true,
            bold: '<strong>$</strong>',
            italics: '<i>$</i>',
            underline: '<a href="#">$</a>'
        }).then(uiOptions => {

            // Removing old instances
            document.body.innerHTML = '';

            const dialog = document.createElement('dialog');
            dialog.id = 'loremModal';
            dialog.innerHTML = `
    <style>
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
    </style>
    `;

            const form = document.createElement('form');
            form.method = 'dialog';

            form.appendChild(document.createElement('header'));

            const heading = document.createElement('h1');
            heading.innerHTML = translationHelper.getString('copyHTMLTitle');
            form.appendChild(heading);

            const description = document.createElement('p');
            description.innerHTML = translationHelper.getString('copyHTMLText');
            form.appendChild(description);

            const layerNameComments = checkBox(translationHelper.getString('copyHTMLIncludeComments'), uiOptions.layerNameComments);
            form.appendChild(layerNameComments);

            // form.appendChild(checkBox('Sorround with layer name tags', false));
            const bold = selectBox('Bold-Tag', [
                {value: '<strong>$</strong>', label: '&lt;strong&gt;[…]&lt;/strong&gt;'},
                {value: '<b>$</b>', label: '&lt;b&gt;[…]&lt;/b&gt;'},
                {value: '<em>$</em>', label: '&lt;em&gt;[…]&lt;/em&gt;'},
            ], uiOptions.bold);
            form.appendChild(bold);

            const italics = selectBox('Italics-Tag', [
                {value: '<i>$</i>', label: '&lt;i&gt;[…]&lt;/strong&gt;'},
                {value: '<em>$</em>', label: '&lt;em&gt;[…]&lt;/em&gt;'},
            ], uiOptions.italics);
            form.appendChild(italics);

            const underline = selectBox(translationHelper.getString('copyHTMLUnderlineTag'), [
                {value: '<a href="#">$</a>', label: '&lt;a href="#"&gt;[…]&lt;/a&gt;'},
                {value: '<u>$</u>', label: '&lt;u&gt;[…]&lt;/u&gt;'},
            ], uiOptions.underline);
            form.appendChild(underline);

            const footer = document.createElement('footer');
            const btnOk = document.createElement('button');
            btnOk.id = "ok";
            btnOk.type = "submit";
            btnOk.innerHTML = translationHelper.getString('copyHTMLCTA');
            btnOk.setAttribute('uxp-variant', 'cta');
            btnOk.onclick = () => {
                const options = {
                    layerNameComments: layerNameComments.childNodes.item(0).checked,
                    bold: bold.childNodes.item(1).value,
                    italics: italics.childNodes.item(1).value,
                    underline: underline.childNodes.item(1).value,
                };
                storage.set('copyHTMLOptions', options);
                debugHelper.log("Lorem Ipsum");
                dialog.close();
                resolve(options);
                document.body.innerHTML = '';
            };
            btnOk.setAttribute('autofocus', 'autofocus');
            const btnCancel = document.createElement('button');
            btnCancel.id = "cancel";
            btnCancel.innerHTML = translationHelper.getString('cancel');
            btnCancel.onclick = () => {
                debugHelper.log("Closing Text Tools");
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