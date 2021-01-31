/*
 * Copyright (c) 2018. by Pablo Klaschka
 */

const storage = require('../helpers/storage');
const debugHelper = require("../helpers/debug");
const language = require("../helpers/language");
const analytics = require("../helpers/analytics");

/**
 * @param {Selection} selection
 */
async function showModal(selection) {
    await analytics.verifyAcceptance({
        pluginName: 'Text Toolbox',
        privacyPolicyLink: 'https://xdplugins.pabloklaschka.de/privacy-policy'
    });
    analytics.send('settings', {});
    debugHelper.log('Showing TAT settings modal');
    await modalAsync(selection);
    return true;
}

/**
 * @param {Selection} selection
 */
async function modalAsync(selection) {
    return new Promise((resolve, reject) => {
        storage.get('settings', {}).then(settings => {
            debugHelper.log('Found settings: ', JSON.stringify(settings));


            // Removing old instances
            document.body.innerHTML = '';

            const dialog = document.createElement('dialog');
            dialog.id = 'settingsModal';
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
    </style>
    `;

            const form = document.createElement('form');
            form.method = 'dialog';

            form.appendChild(document.createElement('header'));


            const heading = document.createElement('h1');
            heading.innerHTML = language.getString('settingsTitle');
            form.appendChild(heading);

            const hReset = document.createElement('h2');
            hReset.innerHTML = language.getString('settingsResetHeading');
            form.appendChild(hReset);

            const pReset = document.createElement('p');
            pReset.innerHTML = language.getString('settingsResetText');
            form.appendChild(pReset);

            const btnReset = document.createElement('button');
            btnReset.innerHTML = language.getString('settingsResetButtonText');
            btnReset.addEventListener('click', () => {
                storage.reset().then(() => {
                    btnReset.setAttribute('disabled', 'true');
                });
            });
            btnReset.setAttribute('uxp-variant', 'warning');
            form.appendChild(btnReset);

            const footer = document.createElement('footer');
            const btnOk = document.createElement('button');
            btnOk.id = "ok";
            btnOk.type = "submit";
            btnOk.innerHTML = language.getString('saveSettings');
            btnOk.setAttribute('uxp-variant', 'cta');
            btnOk.onclick = () => {
                storage.set('settings', {}).then(() => {
                    dialog.close();
                    resolve();
                    document.body.innerHTML = '';
                }).catch(reason => reject(reason));
            };
            btnOk.setAttribute('autofocus', 'autofocus');
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
            footer.appendChild(btnOk);
            form.appendChild(footer);
            dialog.appendChild(form);
            document.body.appendChild(dialog);
            dialog.showModal().then(() => resolve()).catch(() => reject());
        }).catch(reason => reject(reason));

    });
}
module.exports = showModal;