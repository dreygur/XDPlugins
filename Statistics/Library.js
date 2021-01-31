/////////////////////////////////
// Class Models
/////////////////////////////////

class MainForm {
  constructor() {
    this.nameLabel = null;
    this.headerLabel = null;
    this.messageList = null;
    this.selection = null;
    this.documentRoot = null;
    this.focusedArtboard = null;
    this.selectedArtboard = null;
    this.allArtboards = false;
    this.resultsLabel = null;
    this.exportLabel = null;
    this.mainDialogWidth = 380;
    this.selectItems = [];
    this.itemsDictionary = null;
    this.nestedItems = {};
    this.currentArtboard = null;
    this.sortedAscendingTypes = [];
    this.showIcon = true;
    this.iconWidth = 12;
    this.iconHeight = 12;
    this.closeIconPath = "icons/Close Icon.png";
    this.listHeight = 287;
    this.submitButton = null;
    this.isMac = false;
    this.rows = {};
  }
  
  // Constants
  static get ALL_TYPES() { return "all"; }
  static get TOTAL_GROUPS() { return "TotalGroup"; }
  static get TOTAL() { return "Total"; }
  static get HEADER() { return "Header"; }
  static get MAC_PLATFORM() { return "darwin"; }
  
  /**
   * Static getter setter 
   **/
  static get debug () {
    if (MainForm.hasOwnProperty("_debug")===false) {
      MainForm._debug = null;
    }
    
    return MainForm._debug;
  }

  static set debug (value) {
    MainForm._debug = value;
  }
}

class AlertForm {
  constructor() {
    this.header = null;
    this.message = null;
  }
}

class Items {
    constructor() {
      this.areaTexts = 0;
      this.artboards = 0;
      this.booleanGroups = 0;
      this.ellipses = 0;
      this.graphicsNodes = 0;
      this.groups = 0;
      this.lines = 0;
      this.linkedGraphics = 0;
      this.paths = 0;
      this.pointText = 0;
      this.polygons = 0;
      this.rectangles = 0;
      this.repeatGrids = 0;
      this.symbolInstances = 0;
      this.texts = 0;
      this.totalGroups = 0;
      this.totals = 0;
    } 
}


module.exports = { MainForm, AlertForm, Items };
