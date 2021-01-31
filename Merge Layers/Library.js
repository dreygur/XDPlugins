/////////////////////////////////
// Why are you reading this? 
// ...reused project. todo clean up
/////////////////////////////////

const {Artboard, BooleanGroup, Blur, Matrix, Color, Ellipse, GraphicNode, Group, Line, LinkedGraphic, Path, Rectangle, RepeatGrid, SymbolInstance, Text} = require("scenegraph");
const {object, log, getClassName, getFunctionName, getStackTrace, getChangedProperties, getPx, DebugSettings} = require("./log");

class GlobalModel {

  constructor() {
    this.id = "*";
    /** @type {Selection} */
    this.selection = null;
    /** @type {RootNode} */
    this.documentRoot = null;
    /** @type {Artboard} */
    this.focusedArtboard = null;
    /** @type {Artboard} */
    this.selectedArtboard = null;
    this.selectedArtboards = [];
    this.userSelectedArtboards = [];
    this.nonSelectedArtboards = [];
    this.allArtboards = [];
    
    this.showBasicScreen = true;
    this.createExportingFile = true; // used with auto refresh
    this.showingElementDialog = false;
    this.showingPanel = false;
    this.showLabelsInPanel = false;
    this.imageExportFormat = XDConstants.PNG; // XDConstants.JPG;
    this.imageExportQuality = 100;
    this.exportFromElementPanel = false;
    this.panelVisible = false;
    this.showWarnings = true;
    this.useTemplate = false;
    this.lastFileLocation = null;
    this.selectedElement = null;
    this.lastSelectedElement = null;
    this.lastFormElement = null;
    this.skipThisUpdate = false;
    /** @type {Object} */
    this.selectedModelData = null;
    this.originalModelPreferences = null;
    this.selectedModels = [];
    /** @type {Model} */
    this.selectedModel = null;
    this.minDebugScale = 5;
    this.maxDebugScale = 400;
    this.hideArtboardsUsingDisplay = true;
    this.useRotation2 = true;
    this.showImageSizeOnChange = true;
    this.temporaryImageFilename = "imageSize";
    this.liveExport = false;
    this.exportOnUpdate = false;
    this.liveExportLabel = "(live)";
    this.exporting = false;
    this.exportType = null;
    this.exportList = null;
    this.exportButtonLabel = "Export";
    this.exportButtonLiveLabel = "Export Live";
    this.exportArtboardLabel = "Export Artboard";
    this.exportSelectedArtboardsToPageLabel = "Export selected artboards to a single page";
    this.exportSelectedArtboardsToPagesLabel = "Export selected artboards to multiple pages";
    this.exportAllArtboardsToPageLabel = "Export all artboards to a single page";
    this.exportAllArtboardsToPagesLabel = "Export all artboards to multiple pages";
    this.stylesheetId = "applicationStylesheet";
    this.scriptId = "applicationScript";
    this.typesDictionary = {};
    this.scriptOutput = "";
    this.cssOutput = "";
    this.markupOutput = "";
    this.innerMarkup = "";
    this.pageOutput = "";
    this.artboards = null;
    this.artboardModels = {};// new WeakMap(); is not iterable
    this.ids = {};
    this.artboardGUIDs = {};
    this.artboardIds = [];
    this.artboardIdsObject = {};
    this.artboardWidths = [];
    this.artboardWidthsCounts = 0;
    this.nonArtboards = [];
    this.cssArray = [];
    this.markupArray = [];
    this.exportedItems = [];
    this.warnings = [];
    this.messages = [];
    this.errors = [];
    this.files = [];
    this.renditions = [];
    this.isOnRootNode = false;
    this.exportAllArtboards = false;
    this.exportMultipleArtboards = false;
    this.exportArtboardsRange = null;
    this.exportArtboardsList = [];
    this.exportToSinglePage = false;
    this.showArtboardsByMediaQuery = false;
    this.showArtboardsByControls = false;
    this.exportAsSinglePageApplication = false;
    this.navigationControls = null;
    this.pageControlsScript = null;
    this.zoomSliderControls = null;
    this.applicationDescriptor = null;
    this.requestingFolder = false;
    this.version = 0;
    this.exportedThisSession = false;
    this.exportDuration = 0;
    this.startTime = 0;
    this.quickExportNotificationDuration = 3000;
    this.quickExportIconDuration = 500;
    this.runPauseDuration = 250;
    this.numberOfDesignViewItems = 0;
    this.numberOfArtboards = 0;
    this.numberOfSelectedArtboards = 0;
    this.hasSelection = false;
    this.preferencesExtension = ".txt";
    this.settingsFilename = "user_settings.txt";

    // PROPERTIES WE WANT TO SAVE
    this.preferenceProperties = [
      "version",
      "applicationVersion",
      "showBasicScreen"]

    this.template = ``;

  }
  
  static get documentationURL() { return "https://discuss.velara3.com"; }
  static get forumURL() { return "https://discuss.velara3.com"; }
  //static get redirectHost() { return "https://www.velara3.com/launcher.html?l="; }
  static get redirectHost() { return "https://velara3.github.io/WebExport/index.html?l="; }
  static get maxIDLength() { return 30; }
  static get characterSpacingFactor() { return 100; }
  static get supportOpenFolders() { return false; }

  static get lastFileLocation () {
    if (GlobalModel.hasOwnProperty("_lastFileLocation")===false) {
      GlobalModel._lastFileLocation = null;
    }
    
    return GlobalModel._lastFileLocation;
  }

  static set lastFileLocation (value) {
    GlobalModel._lastFileLocation = value;
  }

  /**
   * The URL in the form file://directory/page.html
   **/
  static get lastURLLocation () {
    if (GlobalModel.hasOwnProperty("_lastURLLocation")===false) {
      GlobalModel._lastURLLocation = null;
    }
    
    return GlobalModel._lastURLLocation;
  }

  static set lastURLLocation (value) {
    GlobalModel._lastURLLocation = value;
  }

  /**
   * The URL in the form http://site.com/launcher.html?l=file://directory/page.html
   **/
  static get lastRURLLocation () {
    if (GlobalModel.hasOwnProperty("_lastRURLLocation")===false) {
      GlobalModel._lastRURLLocation = null;
    }
    
    return GlobalModel._lastRURLLocation;
  }

  static set lastRURLLocation (value) {
    GlobalModel._lastRURLLocation = value;
  }
  
  /**
   * The URL encoded in the form http://site.com/launcher.html?l=file://directory/page.html
   **/
  static get lastRURLLocationEnc () {
    if (GlobalModel.hasOwnProperty("_lastRURLLocationEnc")===false) {
      GlobalModel._lastRURLLocationEnc = null;
    }
    
    return GlobalModel._lastRURLLocationEnc;
  }

  static set lastRURLLocationEnc (value) {
    GlobalModel._lastRURLLocationEnc = value;
  }

  /**
   * The URL to the diff in the form file://directory/page_diff.html
   **/
  static get lastDiffLocation () {
    if (GlobalModel.hasOwnProperty("_lastDiffLocation")===false) {
      GlobalModel._lastDiffLocation = null;
    }
    
    return GlobalModel._lastDiffLocation;
  }

  static set lastDiffLocation (value) {
    GlobalModel._lastDiffLocation = value;
  }

  /**
   * Indicates there is expected output to compare output to
   **/
  static get hasVerifyCheck () {
    if (GlobalModel.hasOwnProperty("_hasVerifyCheck")===false) {
      GlobalModel._hasVerifyCheck = false;
    }
    
    return GlobalModel._hasVerifyCheck;
  }

  /**
   * Indicates if the export has verification output
   * @param {Boolean} value
   */
  static set hasVerifyCheck (value) {
    GlobalModel._hasVerifyCheck = value;
  }

  /**
   * Indicates if host is defined
   **/
  static get hasHost () {
    if (GlobalModel.hasOwnProperty("_hasHost")===false) {
      GlobalModel._hasHost = false;
    }
    
    return GlobalModel._hasHost;
  }

  /**
   * Indicates if host is defined
   * @param {Boolean} value
   */
  static set hasHost (value) {
    GlobalModel._hasHost = value;
  }

  /**
   * The name of the last exported file name and extension, page.html
   **/
  static get lastFilename () {
    if (GlobalModel.hasOwnProperty("_lastFilename")===false) {
      GlobalModel._lastFilename = null;
    }
    
    return GlobalModel._lastFilename;
  }

  static set lastFilename (value) {
    GlobalModel._lastFilename = value;
  }
  
  /**
   * The name of the last location on localhost, http://localhost/page.html
   **/
  static get lastHostPath () {
    if (GlobalModel.hasOwnProperty("_lastHostPath")===false) {
      GlobalModel._lastHostPath = null;
    }
    
    return GlobalModel._lastHostPath;
  }

  static set lastHostPath (value) {
    GlobalModel._lastHostPath = value;
  }
  
  /**
   * The name of the last folder, file://directory/
   **/
  static get lastFolderPath () {
    if (GlobalModel.hasOwnProperty("_lastFolderPath")===false) {
      GlobalModel._lastFolderPath = null;
    }
    
    return GlobalModel._lastFolderPath;
  }

  static set lastFolderPath (value) {
    GlobalModel._lastFolderPath = value;
  }

  static get supportsPluginData() {
    return parseInt(require("application").version)>=14;
  }

  /**
   * Get if the operating system is Mac, "darwin"
   **/
  static get isMac () {
    if (GlobalModel.hasOwnProperty("_isMac")===false) {
      GlobalModel._isMac = require("os").platform()=="darwin";
    }
    
    return GlobalModel._isMac;
  }

  /**
   * Get an array of properties that you want to store
   **/
  getPreferencesProperties() {
    return this.preferenceProperties.slice();
  }

  /**
   * An object containing name value pair to save to as preferences for the user
   **/
  getPreferencesData() {
    var properties = this.getPreferencesProperties();
    var numberOfProperties = properties.length;
    var data = new UserGlobalPreferences();
    var property;

    for (var i=0;i<numberOfProperties;i++) {
      property = properties[i];
      data[property] = this[property];
    }

    return data;
  }

  /**
   * An object containing export paths for debugging
   **/
  getLocationObject() {
    var properties = ["lastFolderPath","lastHostPath","lastFilename","lastDiffLocation","lastRURLLocationEnc", 
      "lastRURLLocation", "lastURLLocation", "lastFileLocation", "hasHost"];
    var numberOfProperties = properties.length;
    var data = new Object();
    var property;

    for (var i=0;i<numberOfProperties;i++) {
      property = properties[i];
      data[property] = this[property];
    }

    return data;
  }

  /**
   * Copies values from an object into this instance
   * @param {Object} object
   **/
  setPreferencesData(object) {
    var properties = this.getPreferencesProperties();

    for (const key in object) {
      if (key in this && properties.includes(key)) {
        this[key] = object[key];
      }
    }
  }
}



class HTMLConstants {
  // HTML Element Constants
  static get HTML () { return "html"; }
  static get BITMAP_FILL () { return "bitmapFill"; }
  static get ANCHOR () { return "a"; }
  static get BODY () { return "body"; }
  static get BUTTON () { return "button"; }
  static get CLIP_PATH () { return "clipPath"; }
  static get DEFINITIONS () { return "defs"; }
  static get DIVISION () { return "div"; }
  static get ELLIPSE () { return "ellipse"; }
  static get FORM () { return "form"; }
  static get FOOTER () { return "footer"; }
  static get HR () { return "hr"; }
  static get IMAGE () { return "img"; }
  static get IMAGE_FILL () { return "image"; }
  static get INPUT () { return "input"; }
  static get LINE () { return "line"; }
  static get LINEAR_GRADIENT () { return "linearGradient"; }
  static get LIST_ITEM () { return "li"; }
  static get MASK () { return "mask"; }
  static get OPTION () { return "option"; }
  static get ORDERED_LIST () { return "ol"; }
  static get PARAGRAPH () { return "p"; }
  static get PATH () { return "path"; }
  static get PATTERN () { return "pattern"; }
  static get RADIAL_GRADIENT () { return "radialGradient"; }
  static get RECTANGLE () { return "rect"; }
  static get STYLE () { return "style"; }
  static get SCRIPT () { return "script"; }
  static get SELECT () { return "select"; }
  static get SPAN () { return "span"; }
  static get STOP () { return "stop"; }
  static get SVG () { return "svg"; }
  static get TABLE () { return "table"; }
  static get TABLE_HEAD () { return "thead"; }
  static get TABLE_HEADER () { return "th"; }
  static get TABLE_ROW () { return "tr"; }
  static get TABLE_COLUMN () { return "td"; }
  static get UNORDERED_LIST () { return "ul"; }
  
  // SVG
  static get STOP_COLOR () { return "stop-color"; }
  static get STOP_OPACITY () { return "stop-opacity"; }
  static get OFFSET () { return "offset"; }

  /// HTML Attributes
  static get HREF () { return "href"; }
  static get XLINK_HREF () { return "xlink:href"; }
}

class XDConstants {

  // XD Fill Constants
  static get COLOR_FILL () { return "Color"; }
  static get IMAGE_FILL () { return "ImageFill"; }
  static get LINEAR_GRADIENT_FILL () { return "LinearGradientFill"; }
  static get RADIAL_GRADIENT_FILL () { return "RadialGradientFill"; }

  static get MAC_PLATFORM () { return "darwin"; }

  static get SELECTED_ARTBOARD () { return "selectedArtboard"; }
  static get SELECTED_ARTBOARDS () { return "selectedArtboards"; }
  static get ALL_ARTBOARDS () { return "allArtboards"; }

  static get MULTIPAGE () { return "multipage"; }
  static get SINGLE_PAGE () { return "singlepage"; }
  static get SINGLE_PAGE_MEDIA_QUERY () { return "singlePageMediaQuery"; }
  static get SINGLE_PAGE_NAVIGATION () { return "singlePageNavigation"; }
  static get SINGLE_PAGE_APPLICATION () { return "singlePageApplication"; }

  static get MEDIA_QUERY () { return "mediaQuery"; }
  static get NAVIGATION_CONTROLS () { return "navigationControls"; }
  
  static get LINE_BREAK () { return "\n"; }
  static get LINE_BREAK_FULL () { return "\n\r"; }
  static get SPACE () { return " "; }
  static get TAB () { return "\t"; }
  static get AT_SYMBOL () { return "@"; }
  static get PERIOD () { return "."; }
  static get HASH () { return "#"; }
  static get COMMA () { return ","; }

  static get PNG () { return "png"; }
  static get JPG () { return "jpg"; }
  
  static get AREA_TEXT () { return "AreaText"; }
  static get ARTBOARD () { return "Artboard"; }
  static get BOOLEAN_GROUP () { return "BooleanGroup"; }
  static get COMPONENT () { return "Component"; }
  static get ELLIPSE () { return "Ellipse"; }
  static get IMAGE () { return "Image"; }
  static get HTML () { return "HTML"; }
  static get GRAPHICS_NODE () { return "GraphicsNode"; }
  static get GROUP () { return "Group"; }
  static get LINE () { return "Line"; }
  static get LINKED_GRAPHIC () { return "LinkedGraphic"; }
  static get PATH () { return "Path"; }
  static get POINT_TEXT () { return "PointText"; }
  static get POLYGON() { return "Polygon"; }
  static get RECTANGLE () { return "Rectangle"; }
  static get REPEAT_GRID () { return "RepeatGrid"; }
  static get ROOT_NODE () { return "RootNode"; }
  static get SCENE_NODE () { return "SceneNode"; }
  static get SYMBOL_INSTANCE () { return "SymbolInstance"; }
  static get TEXT() { return "Text"; }

  // self align items in flexbox group
  static get PUSH_LEFT() { return "pushLeft"; }
  static get PUSH_RIGHT() { return "pushRight"; }
  static get PUSH_TOP() { return "pushTop"; }
  static get PUSH_BOTTOM() { return "pushBottom"; }
  static get PUSH_LEFT_RIGHT() { return "pushLeftRight"; }
  static get PUSH_TOP_BOTTOM() { return "pushTopBottom"; }
  static get PUSH_ALL() { return "pushAll"; }

  static get VIEW() { return "view"; }
  static get PAGE() { return "page"; }
  
}

class Form {
  constructor() {
    this.mainDialogWidth = 700;
    this.settingsDialogWidth = 600;
    this.mainDialogLabelWidth = 185;
    this.labelBeforeCheckboxWidth = 192;
    this.checkboxLabelWidth = 200;
    this.spacerWidth = 60;
    this.mainDialogRowHeight = 28;
    this.moreDetailsTextareaHeight = 400;
    this.inputWidth = 480;
    this.borderWeight = 0;
    this.dialogPadding = 34;
    this.elementPanelPadding = 26;
    this.exportFolder = null;
    this.exportImage = "icons/Export Image 01.png";
    this.exportImage2 = "icons/Export Image 02.png";
    this.exportImageArrow = "icons/Export Arrow.png";
    this.serverIconPath = "icons/Server Icon.png";
    this.closeIconPath = "icons/Close Icon.png";
    this.notFoundIconPath = "icons/Not Found Icon.png";
    this.notFoundAltIconPath = "icons/Not Found 2 Icon.png";
    this.folderIconPath = "icons/Folder Icon.png";
    this.copyURLIconPath = "icons/Copy URL Icon.png";
    this.verifyIconPath = "icons/Verify Icon.png";
    this.verifyEllipsisIconPath = "icons/Verify Ellipse Icon.png";
    this.verifyEllipsisAltIconPath = "icons/Verify Ellipse 2 Icon.png";
    this.templateIconPath = "icons/Document Icon.png";
    this.globalArtboardIconPath = "icons/Global Artboard Icon.png";
    this.artboardIconPath = "icons/Artboard Icon.png";
    this.prototypeLinkIconPath = "icons/Prototype Link Icon.png";
    this.linkIconPath = "icons/Link Icon.png";
    this.artboardsIconPath = "icons/Artboards Icon.png";
    this.ellipsisIconPath = "icons/Ellipsis Icon.png";
    this.interactionButtonPath = "icons/Interaction Button Icon.png";
    this.rightChevron = "icons/Right Chevron Icon.png";
    this.clearChevron = "icons/Clear Chevron Icon.png";
    this.exportIconPath = "icons/Export Icon.png";
    this.toggleOff = "icons/ToggleOff.png";
    this.toggleOn = "icons/ToggleOn.png";
    this.rowAlignPath = "icons/Row Align Icon.png";
    this.columnAlignPath = "icons/Column Align Icon.png";
    this.dropdownChevron = "icons/Dropdown Chevron Icon.png";
    this.completeIconPath = "icons/Complete Icon.png";
    this.instructions = "Select the folder to export to and then press the export button (or press enter)";
    this.basicInstructions = "Press the export button to save to a folder";
    this.RowTagName = "div";
    this.formFontSize = 11;
    this.iconWidth = 15;
    this.moreDetailsLabelWidth = 20;
    this.moreDetailsLabelOpacity = .23;
    this.dropdownListOpacity = .5;
    this.cursor = "pointer";
    this.buttonStyle = { border:"0px solid #888888", paddingLeft:"6px", paddingRight:"6px", paddingBottom:"1px", marginRight:"10px", borderRadius: "10px",
      opacity:1, fontSize: "11px", fontWeight:"normal", color:"#686868", textAlign:"center", cursor:"pointer"};
    this.smallButtonStyle = { border:"0px solid #888888", paddingLeft:"4px", paddingRight:"4px", paddingBottom:"0px", marginRight:"8px", borderRadius: "0",
      opacity:1, fontWeight:"normal", textAlign:"center", cursor:"pointer", color:"#686868"};
    this.helpButtonStyle = { border:"2px solid #585858", overflow: "visible",
      paddingLeft: "6px", paddingRight: "6.5px", paddingBottom: "3px", paddingTop: "3px", marginRight:"12px", marginTop: "0.5px", borderRadius: "12px",
      opacity:1, fontSize: "12px", fontWeight:"bold", color:"#585858", textAlign:"center", cursor:"pointer"};
    this.footerButtonStyle = { border:"0px solid #888888", paddingLeft:"0px", paddingRight:"4px", paddingBottom:"0px", marginRight:"8px", borderRadius: "0",
      opacity:1, fontWeight:"normal", textAlign:"center", cursor:"pointer", color:"#686868"};
  }
}

class MainForm {
  constructor() {
    this.nameLabel = null;
    this.headerLabel = null;
    this.mainForm = null;
    this.mainDialog = null;
    this.screenContainer = null;
    this.messagesForm = null;
    this.basicScreen = null;
    this.advancedScreen = null;
    this.globalArtboardIcon = null;
    this.artboardIcon = null;
    this.previousArtboardIcon = null;
    this.nextArtboardIcon = null;
    this.exportLabel = null;
    this.exportMessageTimeout = null;
    this.exportingRow = null;
    this.messageRow = null;
    this.linksRow = null;
    this.exportFolderInput = null;
    this.imagesFolderInput = null;
    this.templateFileInput = null;
    this.scriptsFolderInput = null;
    this.stylesheetFolderInput = null;
    this.scaleInput = null;
    this.enableScaleUpCheckbox = null;
    this.globalArtboardLabel = null;
    this.globalArtboardCheckbox = null;
    this.scaleToFitCheckbox = null;
    this.scaleToFitInput = null;
    this.scaleToFitList = null;
    this.scaleOnDoubleClickCheckbox = null;
    this.actualSizeOnDoubleClickCheckbox = null;
    this.additionalStylesInput = null;
    this.subStylesInput = null;
    this.externalStylesheetCheckbox = null;
    this.externalScriptCheckbox = null;
    this.serverInput = null;
    this.serverVerifyIcon = null;
    this.serverTestButton = null;
    this.alternativeFontInput = null;
    this.titleInput = null;
    this.pageNameInput = null;
    this.stylesheetNameInput = null;
    this.scriptNameInput = null;
    this.messagesLabel = null;
    this.warningsTextarea = null;
    this.messagesTitleLabel = null;
    this.messageDescriptionLabel = null;
    this.errorLabel = null;
    this.artboardSelectionSelect = null;
    this.exportPluralitySelect = null;
    this.overflowList = null;
    this.exportToPagesRow = null;
    this.exportRangeRow = null;
    this.exportSelectionTypeRow = null;
    this.exportRangeInput = null;
    this.exportControlsSelect = null;
    this.navigateOnKeypressCheckbox = null;
    this.scaleOnResizeCheckbox = null;

    this.setStylesInlineCheckbox = null;
    this.useClassesToStyleElementsCheckbox = null;
    this.showScaleSliderCheckbox = null;
    this.addRootContainerCheckbox = null;
    this.centerHorizontallyCheckbox = null;
    this.centerVerticallyCheckbox = null;
    this.showOutlineCheckbox = null;
    this.refreshPageCheckbox = null;
    this.imageComparisonCheckbox = null;
    this.addDataNamesCheckbox = null;
    this.markupOnlyCheckbox = null;
    this.heightInput = null;
    this.widthInput = null;
    
    // not used yet
    this.setWidthOnTextFieldsCheckbox = null;
    this.inheritCommonsStylesCheckbox = null;

    this.openLocationButton = null;
    this.openURLLink = null;
    this.openRURLLink = null;
    this.openFolderLink = null;
    this.copyURLLink = null;
    this.closeMessagesButton = null;
    this.verifyDiffIcon = null;
    this.diffLink = null;
    this.openHostLink = null;
    this.helpButton = null;
    this.switchScreenButton = null;
    this.resetArtboardButton = null;
    this.copyPageButton = null;
    this.copyMarkupButton = null;
    this.copyCSSButton = null;
    this.copyURLButton = null;
    this.cancelButton = null;
    this.submitButton = null;

    this.dialog = null;
  }
}

class ElementForm {
  constructor() {
    this.messageLabel = null;
    this.nameLabel = null;
    this.pathLabel = null;
    this.mainDialog = null;
    this.mainForm = null;
    this.mainFormFieldset = null;
    this.elementIcon = null;
    this.idInput = null;
    this.additionalStylesInput = null;
    this.subStylesInput = null;
    this.classesInput = null;
    this.subClassesInput = null;
    this.attributesInput = null;
    this.subAttributesInput = null;
    this.tagNameInput = null;
    this.subTagNameInput = null;
    this.markupInsideInput = null;
    this.markupBeforeInput = null;
    this.markupAfterInput = null;
    this.textIDsInput = null;
    this.textTokensInput = null;
    this.hyperlinkInput = null;
    this.hyperlinkArtboardIcon = null;
    this.optionsInput = null;
    this.presetsList = null;
    this.hyperlinkElementInput = null;
    this.interactionButton = null;
    this.cancelMergeButton = null;
    this.completeIcon = null;
    this.mergeButton = null;
    this.heightInput = null;
    this.widthInput = null;
    this.overflowList = null;
    this.textIDsGroup = null;
    this.textTokensGroup = null;
    this.imageOptionsGroup = null;
    this.imageFormatList = null;
    this.imageQualitySlider = null;
    this.imageSizeLabel = null;
    this.groupLayoutGroup = null;
    this.groupItemGroup = null;
    this.groupLayoutIcon = null;
    this.groupLayoutInput = null;
    this.groupVerticalLayoutInput = null;
    this.groupHorizontalLayoutInput = null;
    this.groupLayoutList = null;
    this.selfAlignmentGroup = null;
    this.useAsBackgroundGroup = null;
    this.groupHorizontalAlignmentList = null;
    this.groupVerticalAlignmentList = null;
    this.groupSpacingInput = null;
    this.groupSpacingList = null;
    this.groupWrapList = null;
    this.groupWrapInput = null;
    this.selfAlignmentList = null;
    this.wrapTagsList = null;
    this.hyperlinkPagesList = null;
    this.tagNameList = {};
    this.subTagNameList = {};
    this.hyperlinkTargetsList = null;
    this.selectParentElement = null;
    
    this.convertToImageCheckbox = null;
    this.useBase64DataCheckbox = null;
    this.displayCheckbox = null;
    this.exportCheckbox = null;
    this.constrainLeftCheckbox = null;
    this.constrainRightCheckbox = null;
    this.constrainBottomCheckbox = null;
    this.constrainTopCheckbox = null;
    this.centerHorizontallyCheckbox = null;
    this.centerVerticallyCheckbox = null;
    this.useAsBackgroundCheckbox = null;
    this.consolidateStylesCheckbox = null;
    this.showOutlineCheckbox = null;
    this.debugElementCheckbox = null;
    this.exportOnUpdateCheckbox = null;
    this.exportOnUpdateToggle = null;
    this.exportMessageRow = null;
    this.exportMessageRowBorder = null;
    this.exportMessageLabel = null;
    this.copyURLLink = null;
    this.openFolderLink = null;
    this.openHostLink = null;
    this.openRURLLink = null;
    this.openURLLink = null;
    this.diffLink = null;
    this.verifyDiffIcon = null;
    this.exportingIcon = null;
    
    this.helpButton = null;
    this.resetElementButton = null;
    this.copyElementButton = null;
    this.copyMarkupButton = null;
    this.copyCSSButton = null;
    this.cancelButton = null;
    this.closeButton = null;
    this.exportLabel = null;
    this.beforeExportLabel = null;

    this.dialog = null;

    this.copyPageLabel = "Copy as Page";
    this.copyMarkupLabel = "Copy Markup";
    this.copyCSSLabel = "Copy CSS";

    this.elementPanelWidth = "100%";
    this.panelLabelWidth = 95;
    this.panelCheckboxesSpacerWidth = 20;
    this.panelExportMessageTimeout = null;
    this.iconTimeout = null;
    this.panelExportIconTimeout = null;

    this.elementDialogWidth = 580;
    this.labelWidth = 100;
    this.labelBeforeCheckboxWidth = 125;
    this.elementCheckboxesSpacerWidth = 100;
    this.elementCheckboxRowHeight = 22;
    this.elementRowHeight = 25;
    this.disclosureIconWidth = 20;
    this.flexDirection = "row";
  }
}

class Styles {
  
  // styles
  static get ALL () { return "all"; }
  static get ALIGN_ITEMS () { return "align-items"; }
  static get ALIGN_CONTENT () { return "align-content"; }
  static get ALIGN_SELF() { return "align-self"; }
  static get ANIMATION () { return "animation"; }
  static get BACKGROUND () { return "background"; }
  static get BACKGROUND_COLOR () { return "background-color"; }
  static get BOX_SIZING() { return "box-sizing"; }
  static get BORDER() { return "border"; }
  static get BORDER_RADIUS() { return "border-radius"; }
  static get BOTTOM() { return "bottom"; }
  static get CLIP_PATH() { return "clip-path"; }
  static get COLOR() { return "color"; }
  static get CURSOR() { return "cursor"; }
  static get DASHED() { return "dashed"; }
  static get DISPLAY() { return "display"; }
  static get FLEX_WRAP() { return "flex-wrap"; }
  static get FILTER() { return "filter"; }
  static get FONT_FAMILY() { return "font-family"; }
  static get FONT_STYLE () { return "font-style"; }
  static get FONT_WEIGHT () { return "font-weight"; }
  static get FONT_SIZE() { return "font-size"; }
  static get HEIGHT() { return "height"; }
  static get LETTER_SPACING() { return "letter-spacing"; }
  static get LEFT() { return "left"; }
  static get LINE_HEIGHT() { return "line-height"; }
  static get JUSTIFY_CONTENT() { return "justify-content"; }
  static get MARGIN() { return "margin"; }
  static get MARGIN_LEFT() { return "margin-left"; }
  static get MARGIN_RIGHT() { return "margin-right"; }
  static get MARGIN_TOP() { return "margin-top"; }
  static get MARGIN_BOTTOM() { return "margin-bottom"; }
  static get MAX_WIDTH() { return "max-width"; }
  static get MIDDLE() { return "middle"; }
  static get MIN_WIDTH() { return "min-width"; }
  static get OPACITY() { return "opacity"; }
  static get OVERFLOW() { return "overflow"; }
  static get OVERFLOW_X() { return "overflow-x"; }
  static get OVERFLOW_Y() { return "overflow-y"; }
  static get PADDING() { return "padding"; }
  static get POINTER() { return "pointer"; }
  static get POINTER_EVENTS() { return "pointer-events"; }
  static get POSITION() { return "position"; }
  static get RIGHT() { return "right"; }
  static get SHAPE_RENDERING() { return "shape-rendering"; }
  static get STROKE_WIDTH() { return "stroke-width"; }
  static get STROKE_LINE_JOIN() { return "stroke-linejoin"; }
  static get STROKE_LINE_CAP() { return "stroke-linecap"; }
  static get STROKE_DASH_ARRAY() { return "stroke-dasharray"; }
  static get STROKE_DASH_OFFSET() { return "stroke-dashoffset"; }
  static get STROKE_MITER_LIMIT() { return "stroke-miterlimit"; }
  static get STROKE_POSITION() { return "stroke-position"; }
  static get STROKE_ALIGNMENT() { return "stroke-alignment"; }
  static get STROKE_LOCATION() { return "stroke-location"; }
  static get TEXT_ALIGN() { return "text-align"; }
  static get TEXT_DECORATION() { return "text-decoration"; }
  static get TOP() { return "top"; }
  static get TRANSFORM() { return "transform"; }
  static get TRANSITION() { return "transition"; }
  static get TRANSFORM_ORIGIN() { return "transform-origin"; }
  static get WIDTH() { return "width"; }
  static get WHITE_SPACE() { return "white-space"; }
  static get VIEW_BOX() { return "viewBox"; }
  static get VISIBILITY() { return "visibility"; }

  // values
  static get AUTO () { return "auto"; }
  static get ABSOLUTE () { return "absolute"; }
  static get BLOCK () { return "block"; }
  static get BORDER_BOX () { return "border-box"; }
  static get CENTER() { return "center"; }
  static get COLUMN() { return "column"; }
  static get COLUMN_REVERSE() { return "column-reverse"; }
  static get CRISP_EDGES() { return "crispedges"; }
  static get GEOMETRIC_PRECISION() { return "geometricPrecision"; }
  static get FLEX () { return "flex"; }
  static get FLEX_DIRECTION () { return "flex-direction"; }
  static get FLEX_END () { return "flex-end"; }
  static get FLEX_START () { return "flex-start"; }
  static get FONT_STYLE_NORMAL () { return "normal"; }
  static get FONT_STYLE_ITALIC () { return "italic"; }
  static get FONT_WEIGHT_LIGHT () { return "lighter"; }
  static get FONT_WEIGHT_NORMAL () { return "normal"; }
  static get FONT_WEIGHT_BOLD () { return "bold"; }
  static get HIDDEN () { return "hidden"; }
  static get INHERIT () { return "inherit"; }
  static get INLINE_BLOCK () { return "inline-block"; }
  static get NO_WRAP () { return "nowrap"; }
  static get NONE () { return "none"; }
  static get PIXEL () { return "px"; }
  static get RELATIVE () { return "relative"; }
  static get ROW() { return "row"; }
  static get ROW_REVERSE() { return "row-reverse"; }
  static get SCROLL () { return "scroll"; }
  static get TEXT_DECORATION_UNDERLINE () { return "underline"; }
  static get VISIBLE () { return "visible"; }

}

class SettingsForm {
  constructor() {
    this.messageLabel = null;
    this.nameLabel = null;
    this.idInput = null;
    this.stylesInput = null;
    this.classesInput = null;
    this.attributesInput = null;
    this.tagNameInput = null;
    this.markupBeforeInput = null;
    this.markupAfterInput = null;
    this.hyperlinkInput = null;
    
    this.convertToImageCheckbox = null;
    this.useBase64DataCheckbox = null;
    this.constrainRightCheckbox = null;
    this.constrainBottomCheckbox = null;
    this.centerHorizontallyCheckbox = null;
    this.centerVerticallyCheckbox = null;
    this.consolidateStylesCheckbox = null;
    this.showOutlineCheckbox = null;
    
    this.copyElementButton = null;
    this.copyMarkupButton = null;
    this.copyCSSButton = null;
    this.cancelButton = null;
    this.submitButton = null;

    this.dialog = null;
  }
}

class SupportForm {
  constructor() {
    this.versionLabel = null;
  }
}

class AlertForm {
  constructor() {
    this.header = null;
    this.message = null;
  }
}

class UserGlobalPreferences {

	constructor() {
    this.version              = null;
    this.applicationVersion   = null;
    this.showBasicScreen      = true;
  }
}

module.exports = { Form, MainForm, SupportForm, ElementForm, SettingsForm, GlobalModel, Styles,
  HTMLConstants, XDConstants, UserGlobalPreferences, AlertForm };
