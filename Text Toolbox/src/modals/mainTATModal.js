/*
 * Copyright (c) 2019. by Pablo Klaschka
 */

const debugHelper = require("../helpers/debug");
const help = require('../functions/help');
const language = require("../helpers/language");
const analytics = require('../helpers/analytics');

/**
 * @param {Selection} selection
 * @param {RootNode} root
 */
async function showModal(selection, root) {
    await analytics.verifyAcceptance({
        pluginName: 'Text Toolbox',
        privacyPolicyLink: 'https://xdplugins.pabloklaschka.de/privacy-policy'
    });
    debugHelper.log('Showing TAT main modal');
    let result = await modalAsync(selection);
    switch (result) {
        case 'trimHeight':
            const trimHeight = require('../functions/trimHeight');
            await trimHeight(selection);
            break;
        case 'replaceText':
            const replaceModal = require('./findAndReplaceModal');
            await replaceModal(selection);
            break;
        case 'exportText':
            const exportText = require('../functions/exportText');
            await exportText(root);
            break;
        case 'capitalize':
            const capitalize = require('../functions/capitalize');
            await capitalize(selection);
            break;
        case 'lorem':
            const lorem = require('./loremModal');
            await lorem(selection);
            break;
        case 'copyHTML':
            const copyHTML = require('./copyHTMLModal');
            await copyHTML(selection);
            break;
        case 'settings':
            const settings = require('./settingsModal');
            await settings(selection);
            break;
        case 'help':
            help();
            break;
    }
    return true;
}

/**
 * @param {Selection} selection
 */
async function modalAsync(selection) {
    return new Promise((resolve, reject) => {
        // Removing old instances
        document.body.innerHTML = '';

        const dialog = document.createElement('dialog');
        dialog.id = 'mainTATModal';
        dialog.innerHTML = `
    <style>
    dialog {
        width: 720px;
    }
    
    header {
        background: #2D4E64;
        height: 16px;
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
    }
    
    main {
        margin-top: 16px;
        display: flex;
        justify-content: space-between;
    }
    
    .pseudoInput {
        width: 0;
        height: 0;
    }
    
    .cmdButton,
     .pseudoButton {
        flex-basis: 116px;
        max-width: 116px;
        flex-grow: 0;
        height: 102px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;        
        text-align: center;
        padding: 16px;
     }
    
    .cmdButton {
        font-family: "SF Pro Display", sans-serif;
        cursor: pointer;
        background: #EFEFEF;    
    }
    
    .cmdButton:hover {
        background: #E1E1E1;
    }
    
    .cmdButton img {
       width: 32px;
       height: auto;
    }
    
    .cmdButton .label {
        font-size: 10px;
        font-weight: bold;
        color: #797979;
        font-family: "SF Pro Display", sans-serif;
        display: block;
        width: 100px;
        margin-top: 4px;
    }
    
    .cmdButton .key {
        font-size: 18px;
        color: #2C2C2C;
        display: block;
        width: 100%;
        margin-top: 2px;
    }
    
    .cmdButton + .cmdButton,
     .pseudoButton + .pseudoButton,
      .cmdButton + .pseudoButton,
      .pseudoButton + .cmdButton {
        margin-left: 16px;
    }
    </style>
    `;

        const form = document.createElement('form');
        form.method = 'dialog';

        form.appendChild(document.createElement('header'));

        const heading = document.createElement('h1');
        heading.innerHTML = 'Text Toolbox';
        form.appendChild(heading);

        const commands = [
            {
                key: '1',
                label: language.getString('replaceText'),
                image: 'img/icons/replace.png',
                id: 'btnReplaceText',
                action: () => {
                    resolve('replaceText');
                }
            },
            {
                key: '2',
                label: language.getString('exportText'),
                image: 'img/icons/text-export.png',
                id: 'btnExportText',
                action: () => {
                    resolve('exportText');
                }
            },
            {
                key: '3',
                label: language.getString('capitalize'),
                image: 'img/icons/capitalize.png',
                id: 'btnCapitalize',
                action: () => {
                    resolve('capitalize');
                }
            },
            {},
            {},
            {
                key: 'Q',
                label: language.getString('trimHeight'),
                image: 'img/icons/trim.png',
                id: 'btnTrimHeight',
                action: () => {
                    resolve('trimHeight');
                }
            },
            {
                key: 'W',
                label: language.getString('lorem'),
                image: 'img/icons/lorem.png',
                id: 'btnLorem',
                action: () => {
                    resolve('lorem');
                }
            },
            {
                key: 'E',
                label: language.getString('copyHTML'),
                image: 'img/icons/copy-html.png',
                id: 'btnTrimHeight',
                action: () => {
                    resolve('copyHTML');
                }
            },
            {
                key: 'R',
                label: language.getString('settings'),
                image: 'img/icons/preferences.png',
                id: 'btnTrimHeight',
                action: () => {
                    resolve('settings');
                }
            },
            {
                key: 'T',
                label: language.getString('help'),
                image: 'img/icons/help.png',
                id: 'btnTrimHeight',
                action: () => {
                    resolve('help');
                }
            }
        ];

        // noinspection JSCheckFunctionSignatures
        buttonGroups(commands, dialog).forEach(buttonGroup => form.appendChild(buttonGroup));

        dialog.addEventListener("keydown", evt => {
            debugHelper.log('KeyDown: ', evt.key);
            const command = commands.find(value => value.key && value.key.toLowerCase() === evt.key.toLowerCase());
            if (command) {
                debugHelper.log('Key registered command: ', JSON.stringify(command));
                command.action();
                dialog.close();
            }
        });


        const pseudoInput = document.createElement('input');
        pseudoInput.className = 'pseudoInput';
        form.appendChild(pseudoInput);
        const pExperimental = document.createElement('p');
        pExperimental.innerHTML = language.getString('experimental');
        form.appendChild(pExperimental);

        const footer = document.createElement('footer');


        const btnCancel = document.createElement('button');
        btnCancel.id = "cancel";
        btnCancel.innerHTML = language.getString('cancel');
        btnCancel.onclick = () => {
            debugHelper.log("Closing Text Tools");
            dialog.close();
            reject();
            document.body.innerHTML = '';
        };
        footer.appendChild(btnCancel);
        form.appendChild(footer);
        dialog.appendChild(form);
        document.body.appendChild(dialog);
        dialog.showModal().then(() => resolve()).catch(() => reject());
    });

}

class Button {
    /**
     * @param {string} id
     * @param {string} image
     * @param {string} label
     * @param {string} key
     * @param {function} action
     */
    constructor(id, image, label, key, action) {
        this.id = id;
        this.image = image;
        this.label = label;
        this.key = key;
        this.action = action;
    }
}

/**
 * @param {Button[]} buttons
 * @param {HTMLDialogElement} dialog
 */
function buttonGroups(buttons, dialog) {
    let returnArray = [];
    let main = document.createElement('main');
    buttons.forEach((button, index) => {
        if (index % 5 === 0 && index > 1) {
            // Make new row
            returnArray.push(main);
            main = document.createElement('main');
        }
        let btn = document.createElement('div');
        if (button.action) {
            btn.className = 'cmdButton';
            btn.id = button.id;

            btn.onclick = () => {
                button.action();
                dialog.close();
            };

            btn.innerHTML = `
            <img alt="${button.label}" src="${button.image}" />
            <span class="label">${button.label}</span>
            <span class="key">${button.key}</span>
            `;
        } else {
            btn.className = 'pseudoButton';
            btn.innerHTML = '&nbsp;'
        }
        main.appendChild(btn);
    });
    returnArray.push(main);
    return returnArray;
}

module.exports = showModal;
