/**
 *
 * Copyright: Copyright (c) 2020 by AQUENT, L.L.C.
 * Company: AQUENT, L.L.C.
 * @created 08-09-2020
 */
require("./util/react-shim");
const CopyToRHView = require("./components/views/copyToRH/CopyToRHView");
const MyWorkView = require("./components/views/myWork/MyWorkPanelView");
const PanelController = require("./controllers/PanelController");
const CopyToRHViewPanel = new PanelController(CopyToRHView);
const MyWorkPanel = new PanelController(MyWorkView);
const { shell } = require("uxp");
const ApplicationConstants = require("./constants/ApplicationConstants");
/**
 * To open online help URL
 */
function SupportView() {
  shell.openExternal(ApplicationConstants.HELP_URL);
}

module.exports = {
  panels: {
    copyToRH: CopyToRHViewPanel,
    myWork:MyWorkPanel
  },
  commands: {
    SupportView,
  },
};
