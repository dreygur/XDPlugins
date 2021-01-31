/*
 * Copyright (c) 2018. by Pablo Klaschka
 */

const shell = require('uxp').shell;
const analytics = require("../helpers/analytics");

/**
 * Opens the support website
 */
function help() {
    analytics.verifyAcceptance({
        pluginName: 'Text Toolbox',
        privacyPolicyLink: 'https://xdplugins.pabloklaschka.de/privacy-policy'
    }).then(() => analytics.send('help', {}));

    shell.openExternal('https://xdplugins.pabloklaschka.de/support#TextToolbox');
}


module.exports = help;