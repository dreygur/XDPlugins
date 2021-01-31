// Windows or Mac
const platform = require("os").platform();
window.platform = platform;
window.isWindows = platform.toLowerCase().substr(0,3) === "win";

const manifest = require('./manifest.json');
// Shim: Needed for Vue/Webpack bundle with multiple chunks
global.window.navigator = { userAgent: '' };

// Next Flag
global.heroNext = true;

// Dependencies
const vendors = require('./vendors~main.plugin.js');
const plugin = require('./plugin.js');
const XDC = require('./libs/xdc.js');
XDC.pluginId = manifest.id;
XDC.manifest = manifest;
global.XDC = XDC;
const jQuery = require('./libs/jquery-3.4.1.min.js');
global.jQuery = jQuery;

// Module Export
module.exports = {
  commands: plugin.commands(),
  panels: plugin.panels()
};
