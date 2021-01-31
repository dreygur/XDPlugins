/* ==========================================================
WakaTime
Description: Analytics for programmers.
Maintainer:  WakaTime <support@wakatime.com>
License:     BSD, see LICENSE for more details.
Website:     https://wakatime.com/
author:      @jvelezpo, @uziiuzair
===========================================================*/

'use strict';

let application = require('application');
const { shell } = require('uxp');

const Preferences = require('./lib/preferences');
const Libs = require('./lib/libs');
const { prompt, errorOpenWakatime } = require("./lib/dialog/dialogs");

const VERSION = '1.0.0';
let lastAction = 0,
    lastFile = undefined;

const openDashboardWebsite = async () => {
    const error = await errorOpenWakatime('Error', validation);
    if (error.which === 0) {
        const url = 'https://wakatime.com/';
        shell.openExternal(url)
    }
};

const getApiKey = async () => {
    const preferences = await Preferences.createFromSettings();
    const validation = Libs.validateKey(preferences.apiKey);
    if (validation !== '') {
        return '';
    }
    return preferences.apiKey;
}

const enoughTimePassed = () => {
    return lastAction + 120000 < Date.now();
}

const sendHeartbeat = async (file, time, project, language, isWrite, lines) => {
    const apiKey = await getApiKey();
    try {
        console.log('Testing 2');
        await fetch('https://wakatime.com/api/v1/heartbeats', {
            method: 'POST',
            body: JSON.stringify({
                time        : time / 1000,
                entity      : file,
                category    : "designing", 
                type        : "app",
                project     : file,
                language,
                is_write    : true,
                lines       : lines,
                plugin      : "adobexd-wakatime/" + VERSION,
            }),
            headers: {
                'Authorization': 'Basic ' + Libs.btoa(apiKey),
                'Content-Type': 'application/json'
            }
        });
    } catch (err) {
        console.log('Error(heartbeats):', err);
    }
    lastAction = time;
    lastFile = file;
};

const handleAction = (isWrite) => {
    const currentDocument = application.activeDocument;
    if (currentDocument) {
        var time = Date.now();
        if (isWrite || enoughTimePassed() || lastFile !== currentDocument.name) {
            sendHeartbeat(currentDocument.name, time, currentDocument.name, undefined, isWrite, null);
        }
    }
}

(() => {
    window.setInterval(async () => {
        handleAction(true);
        console.log('Testing');
    }, 5000);
}
)();

/**
 * Create the input modal where the user inputs his/her api key
 */
const openApiKeyDialog = async () => {

    const preferences = await Preferences.createFromSettings();

    const title = 'WakaTime';
    const message = 'Enter your wakatime.com api key:';

    const result = await prompt(title, message, 'api key', preferences.apiKey);

    if (result.which === 1) {

        const newApiKey = result.value;
        preferences.apiKey = newApiKey;
        const validation = Libs.validateKey(newApiKey)

        if (validation !== '') {
            openDashboardWebsite();
        } else {
            await prompt(title, 'api key set correctly');
        }
    }
};

module.exports = {
    commands: {
        apiKeyDialog: openApiKeyDialog
    }
};
