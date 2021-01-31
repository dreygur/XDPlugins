// Shim: Needed for Vue/Webpack bundle with multiple chunks
global.window.navigator = { userAgent: '' };

// Dependencies
const vendors = require('./vendors~main.plugin.js');
const plugin = require('./plugin.js');
const XDC = require('./libs/xdc.js');
global.XDC = XDC;

// Module Export
module.exports = {
  commands: plugin.commands(),
  panels: plugin.panels()
};
