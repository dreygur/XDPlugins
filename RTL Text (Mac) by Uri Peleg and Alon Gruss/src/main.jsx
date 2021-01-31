// shims, in case they aren't present in the current environment
require("./react-shim");

const React = require("react");
const ReactDOM = require("react-dom");

const App = require("./App");
const PanelController = require("./Controllers/PanelController");

const panelController = new PanelController(App);

module.exports = {
  panels: {
    main: panelController,
  },
};
