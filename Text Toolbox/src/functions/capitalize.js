/*
 * Copyright (c) 2019. by Pablo Klaschka
 */

const debugHelper = require('../helpers/debug');
const SelectionChecker = require('../helpers/check-selection');
const analytics = require("../helpers/analytics");

/**
 * Converts text node's text to uppercase
 * @param {Selection} selection
 */
function capitalize(selection) {
    for (let element of selection.items) {
        if (SelectionChecker.checkForType(element, 'Text')) {
            element.textTransform = 'uppercase'
        } else {
            debugHelper.log('Node ', element, ' is not a text.');
        }
    }

    analytics.verifyAcceptance({
        pluginName: 'Text Toolbox',
        privacyPolicyLink: 'https://xdplugins.pabloklaschka.de/privacy-policy'
    }).then(() => analytics.send('capitalize', {}));

}

module.exports = capitalize;
