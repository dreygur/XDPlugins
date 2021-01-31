/*
 * Copyright (c) 2018. by Pablo Klaschka
 */

const showModal = require('./src/modals/mainTATModal');
const debugHelper = require("./src/helpers/debug");

async function modal(selection, root) {
    try {
        await showModal(selection, root);
        debugHelper.log('TAT is done.')
    } catch (e) {
        debugHelper.log('TAT aported');
    }
}

async function replaceText(selection) {
    try {
        debugHelper.log('replaceText()');
        await (require('./src/modals/findAndReplaceModal'))(selection);
    } catch (e) {
        debugHelper.log('replaceText() aported');
    }
}

async function exportText(selection, root) {
    try {
        debugHelper.log('exportText()');
        await (require('./src/functions/exportText'))(root);
    } catch (e) {
        debugHelper.log('exportText() aported');
    }
}

async function capitalize(selection) {
    try {
        debugHelper.log('capitalize()');
        await (require('./src/functions/capitalize'))(selection);
    } catch (e) {
        debugHelper.log('capitalize() aported');
    }
}

function trimHeight(selection) {
    try {
        debugHelper.log('trimHeight()');
        const trim = require('./src/functions/trimHeight');
        trim(selection);
    } catch (e) {
        debugHelper.log('trimHeight() aported');
    }
}

async function lorem(selection) {
    debugHelper.log('lorem()');
    const lorem = require('./src/modals/loremModal');
    await lorem(selection);
}

async function copyHTML(selection) {
    debugHelper.log('copyHTML()');
    const copyHTML = require('./src/modals/copyHTMLModal');
    await copyHTML(selection);
}

async function settings(selection) {
    debugHelper.log('settings()');
    const settings = require('./src/modals/settingsModal');
    await settings(selection);
}

async function help() {
    (require('./src/functions/help'))();
    debugHelper.log('help()');
}

// noinspection JSUnusedGlobalSymbols
module.exports = {
    commands: {
        modal: modal,
        replaceText: replaceText,
        exportText: exportText,
        capitalize: capitalize,
        lorem: lorem,
        trimHeight: trimHeight,
        copyHTML: copyHTML,
        settings: settings,
        help: help,
    }
};