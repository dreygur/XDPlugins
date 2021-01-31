
/////////////////////////////////
// Class Models
/////////////////////////////////

const platforms = require("./platforms");

if (platforms.isXD) {
  var {Artboard, BooleanGroup, Blur, Matrix, Color, Ellipse, GraphicNode, Group, Line, LinkedGraphic, Path, Rectangle, RepeatGrid, SymbolInstance, Text} = require("scenegraph");
}

const {object, log, getClassName, getFunctionName, getStackTrace, getChangedProperties, getPx, DebugSettings} = require("./log");

class GlobalModel {

  constructor() {
    this.id = "*";
    /** @type {Model} */
    this.model = new Model();
    /** @type {Selection} */
    this.selection = null;
    /** @type {RootNode} */
    this.documentRoot = null;
    /** @type {Artboard} */
    this.focusedArtboard = null;
    /** @type {Artboard} */
    this.selectedArtboard = null;
    /** @type {Artboard} */
    this.originalArtboard = null;
    /** @type {Artboard} */
    this.currentArtboard = null;
    /** @type {Artboard} */
    this.firstArtboard = null;
    /** @type {Artboard} */
    this.homeArtboard = null;
    /** @type {ArtboardModel} */
    this.selectedArtboardModel = null;
    /** @type {ArtboardModel} */
    this.currentArtboardModel = null;
    /** @type {ArtboardModel} */
    this.originalArtboardModel = null;
    /** @type {ArtboardModel} */
    this.artboardModel = null;
    /** @type {ArtboardModel} */
    this.lastArtboardModel = null;
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
    this.embedImageColorLimit = 3;
    this.exportFromElementPanel = false;
    this.panelVisible = false;
    this.showWarnings = true;
    this.useTemplate = false;
    this.lastFileLocation = null;
    this.selectedElement = null;
    this.lastSelectedElement = null;
    this.lastFormElement = null;
    this.skipThisUpdate = false;
    this.preventDialogInEditContext = false;
    /** @type {Object} */
    this.selectedModelData = null;
    this.originalModelPreferences = null;
    this.selectedModels = [];
    this.selectedModelChanges = false;
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
    this.itemCount = 0;
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
    this.exportedRenditions = [];
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
    this.imagesExportFolder = null;
    this.image2x = null;
    this.embedImages = false;
    this.tagNames = [];
    this.navigationControls = null;
    this.pageControlsScript = null;
    this.zoomSliderControls = null;
    this.applicationDescriptor = null;
    this.requestingFolder = false;
    this.version = 0;
    this.applicationVersion = 0;
    this.exportedThisSession = false;
    this.exportDuration = 0;
    this.startTime = 0;
    this.quickExportNotificationDuration = 4000;
    this.quickExportIconDuration = 500;
    this.runPauseDuration = 250;
    this.numberOfDesignViewItems = 0;
    this.numberOfArtboards = 0;
    this.numberOfSelectedArtboards = 0;
    this.isPasteboardItem = false;
    this.hasSelection = false;
    this.preferencesExtension = ".txt";
    this.settingsFilename = "user_settings.txt";
    this.hostField1 = null;
    this.hostField2 = null;
    this.hostField3 = null;
    this.hostField4 = null;
    this.token = null;
    this.site = null;
    this.userSite = null;
    this.previousSiblingLabel = "";
    this.nextSiblingLabel = "";
    this.descendantLabel = "";
    this.previousSiblingIcon = "";
    this.nextSiblingIcon = "";
    this.descendantIcon = "";

    // PROPERTIES WE WANT TO SAVE
    this.preferenceProperties = [
      "version",
      "applicationVersion",
      "showBasicScreen",
      "hostField1",
      "hostField2",
      "hostField3",
      "hostField4"]

    this.template = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><!--page_title--></title>
<!--styles_content-->
<!--scripts-->
</head>
<body>
<!--application_content-->
</body>
</html>`;

  }
  
  static get documentationURL() { return "https://velara-3.gitbook.io/web-export/"; }
  static get forumURL() { return "https://discuss.velara3.com"; }
  //static get redirectHost() { return "https://www.velara3.com/launcher.html?l="; }
  static get redirectHost() { return "https://velara3.github.io/WebExport/index.html?l="; }
  static get host() { return "https://www.velara3.com/a"; }
  static get rest() { return "/wp-json"; }
  static get route() { return "/wp-json"; }
  static get endPoint() { return "/wp/v2/posts/"; }
  static get linkEndPoint() { return "/wp/v2/posts"; }
  static get postPath() { return "/?p="; }
  static get jwt() { return "/jwt-auth/v1/token"; }
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

class Model {
  constructor(item = null) {
    this.guid = null;
    this.id = null;
    this.elementId = null;
    this.name = null;
    this.artboard = null;
    this.artboardModel = null;
    this.sanitizedID = null;
    this.type = "";
    this.displayType = "";
    this.elementTagName = null;
    this.elementSubTagName = null;
    this.componentName = "";
    this.singleTag = false; // is composite component or singleton (svg>rect) or (span)
    this.tagName = "";
    this.svgTagName = "svg";
    this.containerTagName = "div";
    this.anchorTagName = "a";
    this.classNamePost = "_Class";
    this.addedAsMask = false;
    this.selector = null;
    this.javascript = null;
    this.useClasses = false; // use classes versus ids - see document model.useClassesForElements
    this.svgUseClasses = true; // use classes on svg tags
    this.exportSVGStylesAsAttributes = false;
    this.useSelector = false;
    this.isBooleanGroup = false;
    this.isGroup = false;
    this.isLayoutGroup = false;
    this.bounds = {}; // relative bounds inside group using second method
    this.groupBounds = {}; // relative bounds inside group
    this.parentBounds = {}; // parent bounds
    this.cssStyles = {}; // store tag inline style value
    this.svgStyles = {}; // store svg tag inline style value
    this.cssProperties = {}; // store tag css values
    this.svgAttributes = {}; // store svg css values
    this.attributes = {}; // store tag attribute values
    this.containerClassesArray = []; // store container classes values
    this.containerAttributes = {}; // store container tag attribute values
    this.containerStyles = {}; // store container styles values
    this.nestLevel = 0; // how many groups it is nested in
    this.index = 0; // index in container
    this.currentIndent = 0; // indentation indicator
    this.markup = ""; // usually generated markup with body tag surrounding
    this.innerMarkup = ""; // generated markup without body tag
    this.mask = ""; // mask generated tag
    this.maskCloseTag = ""; // mask generated close tag
    this.imageFolder = "";
    this.definitionBefore = "";
    this.definitionAfter = "";
    this.containerBefore = "";
    this.containerAfter = "";
    this.svgBefore = "";
    this.svgAfter = "";
    this.cssBefore = "";
    this.cssAfter = "";
    this.svgCSSBefore = "";
    this.svgCSSAfter = "";
    this.hyperlinkBefore = "";
    this.hyperlinkAfter = "";
    this.cssText = "";
    this.svgCSS = "";
    this.cssArray = [];
    this.styleRules = [];
    this.classesArray = [];
    this.subClassesArray = [];
    this.svgClassesArray = [];
    this.colorStops = [];
    /** @type {Definition} */
    this.definition = null;
    this.renditions = [];
    this.fill = "";
    this.beforeContent = null;
    this.afterContent = null;
    this.innerContent = null;
    this.setContainer = false;// not used?
    this.addContainer = false;
    this.setAdditionalClassesOnContainer = false;
    this.setAdditionalAttributesOnContainer = false;
    this.addSVGContainer = false;
    this.exportRectangleAsDiv = false;
    this.addEndTag = false;
    this.addCloseTag = false;
    this.addContainerCloseTag = true;
    this.linebreakInnerContent = true;
    this.markupCloseTag = null;
    this.markupOpenTag = null;
    this.useCrispEdges = false;
    this.liftTextUp = false;
    this.cssOnly = false;
    this.originalPreferencesDataValue = null;
    this.originalPreferencesData = null;
    this.isHTML = false;
    this.imageDefinition = null;
    this.propertyChanges = [];
    
    // SETTABLE OPTIONS
    this.additionalAttributes = "";
    this.additionalClasses = "";
    this.additionalStyles = "";
    this.alternateWidth = null;
    this.alternateHeight = null;
    this.alternateTagName = null;
    this.constrainTop = false;
    this.constrainLeft = false;
    this.constrainRight = false;
    this.constrainBottom = false;
    this.centerHorizontally = false;
    this.centerVertically = false;
    this.consolidateStyles = false;
    this.cursor = "default";
    this.debug = false;
    this.displayed = true;
    this.embedImage = false;
    this.embedColorLimit = null;
    this.enabled = true;
    this.export = true;
    this.exportAsImage = false;
    this.exportAsString = false;
    this.exportImageRectanglesAsImages = true;
    this.hoverElementGUID = null;
    this.hoverStyles = null;
    this.hyperlink = "";
    this.hyperlinkElement = "";
    this.hyperlinkTarget = "";
    this.hyperlinkedArtboardGUID = null;
    this.inheritPrototypeLink = true;
    this.imageFormat = XDConstants.PNG;
    this.imageQuality = 100;
    this.image2x = true;
    this.layout = "default";
    this.layoutVerticalAlign = Styles.STRETCH;
    this.layoutHorizontalAlign = Styles.STRETCH;
    this.layoutWrapping = Styles.NO_WRAP;
    this.layoutSpacing = Styles.FLEX_START;
    this.markupInside = "";
    this.markupBefore = "";
    this.markupAfter = "";
    this.overflow = item ? this.getDefaultOverflowValue(item) : Styles.DEFAULT;
    this.position = Styles.DEFAULT;
    this.positionBy = Styles.DEFAULT;
    this.scriptTemplate = null;
    this.selfAlignment = Styles.AUTO;
    this.showOutline = false;
    this.sizing = Styles.DEFAULT;
    this.subAttributes = "";
    this.subClasses = "";
    this.subStyles = "";
    this.subTagName = null;
    this.stylesheetTemplate = "";
    this.template = null;
    this.textIds = "";
    this.textTokens = "";
    this.useAsGroupBackground = false;
    this.useBase64Data = false;
    this.version = null;

    // PROPERTIES WE WANT TO SAVE
    this.preferenceProperties = [
      "id",
      "type",
      "additionalAttributes",
      "additionalClasses",
      "additionalStyles",
      "alternateTagName",
      "alternateWidth",
      "alternateHeight",
      "constrainLeft",
      "constrainTop",
      "constrainBottom",
      "constrainRight",
      "centerHorizontally",
      "centerVertically",
      "consolidateStyles",
      "cursor",
      "debug",
      "displayed",
      "embedImage",
      "embedColorLimit",
      "enabled",
      "export",
      "exportAsImage",
      "exportAsString",
      "hoverElementGUID",
      "hoverStyles",
      "hyperlink",
      "hyperlinkElement",
      "hyperlinkTarget",
      "hyperlinkedArtboardGUID",
      "image2x",
      "imageFormat",
      "imageQuality",
      "inheritPrototypeLink",
      "layout",
      "layoutVerticalAlign",
      "layoutHorizontalAlign",
      "layoutWrapping",
      "layoutSpacing",
      "markupInside",
      "markupBefore",
      "markupAfter",
      "overflow",
      "position",
      "positionBy",
      "scriptTemplate",
      "selfAlignment",
      "showOutline",
      "sizing",
      "stylesheetTemplate",
      "subAttributes",
      "subClasses",
      "subStyles",
      "subTagName",
      "useBase64Data",
      "template",
      "textIds",
      "textTokens",
      "useAsGroupBackground",
      "version"
    ];

    this.nonUserProperties = [
      "type",
      "version"
    ]
  }

  /**
   * Get an array of properties that you want to store
   **/
  getPreferencesProperties(userProperties = false) {
    if (userProperties) {
      var userArray = this.preferenceProperties.slice();
      userArray = userArray.filter(x => !this.nonUserProperties.includes(x) )
      return userArray;
    }
    return this.preferenceProperties.slice();
  }

  /**
   * Get an object containing all the properties and values that you want to store
   **/
  getPreferencesData() {
    var data = {};
    var property = "";
    var properties = this.getPreferencesProperties();
    var numOfProperties = properties.length;

    for (var i=0;i<numOfProperties;i++) {
      property = properties[i];
      data[property] = this[property];
    }

    return data;
  }

  /**
   * Get an object containing all the properties and values that have changed from the default value
   **/
  getChangedPropertiesData(userData = false, item = null) {
    var isArtboardModel = "artboardPreferenceProperties" in this;
    var defaultModel = isArtboardModel ? new ArtboardModel() : new Model();
    var property = "";
    var overflowValue = this.getDefaultOverflowValue(item);
    defaultModel.overflow = overflowValue;
    var properties = this.getPreferencesProperties(userData);
    var numOfProperties = properties.length;
    var changeList = {};

    for (var i=0;i<numOfProperties;i++) {
      property = properties[i];

      if (defaultModel[property] != this[property]) {
        changeList[property] = this[property];
      }
    }

    return changeList;
  }


  /**
   * Returns default overflow values.
   * Area text is visible unless being clipped
   * @param {SceneNode} item 
   */
  getDefaultOverflowValue(item) {
    var type = item && item.constructor.name;
    var {Text} = require("scenegraph");
    var value = null;

    switch(type) {
    
      case XDConstants.TEXT:
        if (item instanceof Text && item.areaBox && item.clippedByArea) {
          value = OverflowOptions.HIDDEN;
        }
        else {
          value = OverflowOptions.VISIBLE;
        }
        break;
      case XDConstants.ELLIPSE:
      case XDConstants.RECTANGLE:
      case XDConstants.PATH:
      case XDConstants.POLYGON:
      case XDConstants.LINE:
      case XDConstants.GROUP:
      case XDConstants.BOOLEAN_GROUP:
      case XDConstants.SYMBOL_INSTANCE:
        value = OverflowOptions.VISIBLE;
          break;
      case XDConstants.SCROLLABLE_GROUP:
      case XDConstants.REPEAT_GRID:
      case XDConstants.ARTBOARD:
        value = OverflowOptions.HIDDEN;
          break;
      default:
        value = OverflowOptions.HIDDEN;
    }
    return value;
  }

  /**
   * Copies values from an object into this instance
   * @param {Object} object
   **/
  parse(object) {

    for (const key in object) {
      if (key in this) {
        if (key=="type") continue;
        //log("Setting:" + key + " to " + object[key]);
        this[key] = object[key];
      }
    }
  }

  /**
   * Resets values in this object to the default values
   * @param {SceneNode} item
   **/
  reset(item) {
    var data = new Model(item).getPreferencesData();
    this.parse(data);
  }
}

class ArtboardModel extends Model {
  constructor(item = null) {
    super(item);
    // used when adding multiple artboards to a page to add the index of the artboard to the name
    this.index = 0;
    this.guid = null;
    this.additionalStyles = "";
    this.alternativeFont = null;
    this.userStyles = "";
    this.markup = "";
    this.innerMarkup = "";
    this.css = "";
    this.cssOutput = "";
    this.markupOutput = "";
    this.pageOutput = "";
    this.svg = "";
    this.markupArray = [];
    this.cssArray = [];
    this.svgArray = [];
    this.definitionsArray = [];
    this.warnings = [];
    this.messages = [];
    this.errors = [];
    this.files = [];
    this.renditions = [];
    this.exportedRenditions = [];
    this.exportScaledRenditions = true;
    this.exportBooleanGroupsAsPaths = true;
    this.scriptOutput = null;
    this.scripts = null;
    this.documents = [];
    this.ids = {};
    this.idsArray = [];
    this.duplicateIds = {};
    this.defaultRenditionScales = [1, 2];
    this.maxDecimalPlaces = 3;
    this.hasDuplicateIds = false;
    this.artboard = null;
    this.currentNestLevel = 0;
    this.nameCounter = 0;
    this.nestLevel = 0;
    this.startingIndent = 0;
    this.startingStylesIndent = 1;
    this.additionalTextWidth = 1;
    this.scaleFactor = 1;
    this.scaleToFit = false;
    this.scaleToFitType = null;
    this.enableScaleUp = false;
    this.scaleOnResize = true;
    this.scaleOnDoubleClick = false;
    this.actualSizeOnDoubleClick = false;
    this.navigateOnKeypress = false;
    this.transformOrigin = "0 0";
    this.addSpaceBetweenStyleAndValue = true;
    this.useStyleLineBreaks = true;
    this.overflow = null;
    this.lastMaskID = null;
    this.convertMasksToImages = true;
    this.supportLightFonts = true; // if font typeface is thin or light 
    this.items = {};
    this.models = {};
    this.model = new Model();
    this.globalModel = new Model();
	  this.launchInBrowser = true;
    this.setSVGDefinitionsInline = false;
    this.hoistSVGDefinitions = false;
    this.generator = "Web Export";
    this.generatorTag = "<!-- Generator: [name] [version], [language] Exporter, http://www.velara3.com -->";
    this.outlineStyle = "1px dashed red";
    this.borderStyle = "1px solid #A1A1A1";
    this.bodyBackgroundStyle = "#E5E5E5";
    this.setBodyBackgroundStyle = false; // only true when adding root container
    this.setBorderOnDocument = false;
    this.setSizeOnDocument = false;
	  this.setBorderByOutline = false; // sometimes content overflows border - outline fixes this
    this.centerUsingTransform = true;
    this.itemToExport = null;
    this.extension = "html";
    this.cssExtension = "css";
    this.jsExtension = "js";
    this.exportArtboardList = [];
    this.totalImageSize = 0;
    this.totalImage2xSize = 0;
    this.totalExportSize = 0;
    this.totalPageSize = 0;
    this.totalPagesSize = 0;
    this.imageExportFormat = XDConstants.JPG;
    this.upDirectorySymbol = "..";
    this.upDirectorySymbolSlash = "../";
    
    this.preferencesData = {};
    
    // SETTABLE OPTIONS
    this.addDataNames = false;
    this.addImageComparison = false;
    this.addRootContainer = true;
    this.alternateWidth = null;
    this.alternateHeight = null;
    this.customDomain = false;
    this.enableDeepLinking = true;
    this.exportFolder = null;
    this.exportList = null;
    /** @type {String} */
    this.exportArtboardsRange = null;
    this.exportToSinglePage = false;
    this.expectedOutput = null;
    this.expectedCSSOutput = null;
    this.expectedScriptOutput = null;
    this.externalScript = false;
    this.externalStylesheet = false;
    this.exportType = null;
    this.filename = null;
    this.imageComparisonDuration = 5;
    this.imagesExportFolder = null;
    this.embedImages = false;
    this.imagesPrefix = null;
    this.inheritCommonStyles = false;
    this.isGlobalArtboard = false;
    this.markupOnly = false;
    this.postLinkID = null;
    this.uploadOnExport = false;
    this.refreshPage = false;
    this.scriptFilename = null;
    this.scriptSubFolder = null;
    this.server = null;
    this.setStylesInline = false;
    this.showArtboardsByControls = false;
    this.singlePageApplication = false;
    this.showArtboardsByMediaQuery = false;
    this.showOutline = false;
    this.showScaleSlider = false;
    this.stylesheetFilename = null;
    this.stylesheetSubFolder = null;
    this.subFolder = null;
    this.templateFile = null;
    this.title = null;
    this.type = "Artboard";
    this.useClassesToStyleElements = false;

    // ARTBOARD PROPERTIES WE WANT TO SAVE
    this.artboardPreferenceProperties = [
      "name",
      "type",
      "actualSizeOnDoubleClick",
      "additionalStyles",
      "addRootContainer",
      "alternateHeight",
      "alternateWidth",
      "alternativeFont",
      "addImageComparison",
      "addDataNames",
      "centerHorizontally",
      "centerVertically",
      "customDomain",
      "debug",
      "embedImages",
      "enableScaleUp",
      "enableDeepLinking",
      "expectedOutput",
      "expectedCSSOutput",
      "expectedScriptOutput",
      "exportArtboardsRange",
      "exportFolder",
      "exportList",
      "exportToSinglePage",
      "exportType",
      "externalScript",
      "externalStylesheet",
      "extension",
      "filename",
      "imagesExportFolder",
      "imagesPrefix",
      "inheritCommonStyles",
      "isGlobalArtboard",
      "markupOnly",
      "navigateOnKeypress",
      "overflow",
      "postLinkID",
      "refreshPage",
      "scaleFactor",
      "scaleToFit",
      "scaleToFitType",
      "scaleOnDoubleClick",
      "scaleOnResize",
      "scriptSubFolder",
      "scriptFilename",
      "server",
      "setStylesInline",
      "singlePageApplication",
      "showArtboardsByMediaQuery",
      "showArtboardsByControls",
      "showScaleSlider",
      "showOutline",
      "stylesheetFilename",
      "stylesheetSubFolder",
      "subFolder",
      "templateFile",
      "title",
      "uploadOnExport",
      "useClassesToStyleElements",
    ];
  }

  /**
   * Return the names of the properties that we want to save
   */
  getPreferencesProperties() {
    return this.artboardPreferenceProperties.concat(this.preferenceProperties.slice());
  }

  /**
   * An object containing name value pair of the preferences
   **/
  getPreferencesData() {
    var properties = this.getPreferencesProperties();
    var numOfProperties = properties.length;
    var data = {};
    var property = "";

    for (var i=0;i<numOfProperties;i++) {
      property = properties[i];
      data[property] = this[property];
    }

    return data;
  }
  
  /**
   * Resets values in this object to the default values
   **/
  reset(item) {
    var data = new ArtboardModel(item).getPreferencesData();
    this.parse(data);
  }

  toString() {
    return this.type + " - " + this.name;
  }

  getFilename() {
    if (this.filename!=null) {
      if (this.filename.indexOf(".")!=-1) {
        return this.filename;
      }
      else {
        return this.filename + "." + this.extension;
      }
    }
    else {
      let value = this.name;
      value = value.replace(/\s/gs, "_");
      value = value.replace(/\W/gs, "_");
      return value + "." + this.extension;
    }
  }

  getSubdirectoryPath() {
    if (this.subFolder!=null && this.subFolder!="") {
      return this.subFolder;
    }
    else {
      return "";
    }
  }

  hasSubdirectory() {
    if (this.subFolder!=null && this.subFolder!="") {
      return true;
    }
    else {
      return false;
    }
  }

  getDiffContent(diffHTML) {
    return `<html><head><meta charset="utf-8"/>
    <style>
    * {font-size:10px;font-family: monospace; white-space:pre-wrap; -moz-tab-size:3; -o-tab-size:3; tab-size:3; letter-spacing: .1rem; line-height:1.2rem}
    ins {background:#e6ffe6;text-decoration:none;}
    del {background:#ffe6e6;}
    .style {font-style:italic;outline:.5px dotted rgba(0,0,0,.35);text-decoration:underline;}
    .style:before {content:'\\25BA';display:block;position:absolute;margin-top:-1.2rem; margin-left:-1rem;}
    .style:after {content:'\\25C4';display:block;position:absolute;margin-top:-1.2rem;margin-left:-1rem;right:1rem;}
    .title {background: rgba(0,0,0,.1); display: block; padding: 1rem; margin-bottom: 2em; margin-top: 2em}
    .header {position: fixed; top:0;right:0; margin-right: 2em; margin-top: 2em}
    body {margin:2rem;margin-top:2rem;outline:1px solid rgba(0,0,0,.1)}
    </style>
    <script>
    var current = -1;
    var nodes = null;
    var lastElement = null;

    function scrollIntoView(element, index) {
      element.scrollIntoView({behavior:'smooth', block:'center'});
      if (lastElement) {
        lastElement.classList.remove("style");
      }
      lastElement = element;
      if (index!=0) {
        lastElement.classList.add("style");
      }
    }
    
    window.addEventListener("keyup", function (e) {
      if (nodes==null) {
        var editor = document.getElementById("editor");
        nodes = [];
        editor.childNodes.forEach((item,i) => {
          var name = item.nodeName.toLowerCase();
          if (name=="ins" || name=="del" || i==0) {
            nodes.push(item);
          }
        })
      }

      var insCount = nodes.length;

      if (e.keyCode==13 && insCount) {
        if (e.shiftKey) {
          if (current-1<0) {
            current = insCount-1;
          }
          else {
            current = current-1;
          }
        }
        else {
          current = current+1>=insCount ? 0 : current+1;
        }
        element = nodes[current];
        scrollIntoView(element, current);
      }
    });
    </script>
    <body><div id="editor">`+diffHTML+`</div></body>
    <div class="header">CHANGES - Press enter to step through changes</div>
    </html>`;
  }

  getEditorContent(diffHTML) {
    var editor = `<html><head><style>#editor{position:absolute;top:0;left:0;right:0;bottom:0}</style>
      <body>
      <div id="editor">`+diffHTML+`</div>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.3/ace.js" type="text/javascript" charset="utf-8"></script>
      <script>
      var editor = ace.edit("editor");
      editor.setTheme("ace/theme/monokai");
      editor.session.setMode("ace/mode/html");
      </script>
      </body></html>`;
    return editor;
  }

  getDiffFilename() {
    var diff = "_diff";
    if (this.filename!=null) {
      if (this.filename.indexOf(".")!=-1) {
        return this.filename.split(".").slice(0, -1).join(".") + diff + "." + this.extension;
      }
      else {
        return this.filename + diff + "." + this.extension;
      }
    }
    else {
      let value = this.name + diff;

      if (value.indexOf(".")!=-1) {
        value = value.replace(/\.[^/.]+$/, "");
      }

      value = value.replace(/\s/gs, "_");
      value = value.replace(/\W/gs, "_");
      return value + "." + this.extension;
    }
  }

  getStylesheetFilename() {
    if (this.stylesheetFilename!=null) {
      if (this.stylesheetFilename.indexOf(".")!=-1) {
        return this.stylesheetFilename;
      }
      else {
        return this.stylesheetFilename + "." + this.cssExtension;
      }
    }
    else {
      let value = this.filename!=null ? this.filename : this.name;

      if (value.indexOf(".")!=-1) {
        value = value.replace(/\.[^/.]+$/, "");
      }

      value = value.replace(/\s/gs, "_");
      value = value.replace(/\W/gs, "_");

      return value + "." + this.cssExtension;
    }
  }

  getStylesheetFullPath() {
    var value = this.getStylesheetFilename();
    var prefix = this.hasSubdirectory() ? this.upDirectorySymbolSlash : "";

    if (this.stylesheetSubFolder!="" && this.stylesheetSubFolder!=null) {
      return prefix + this.stylesheetSubFolder + "/" + value;
    }
    return value;
  }
  
  getJavaScriptFilename() {
    if (this.scriptFilename!=null) {
      if (this.scriptFilename.indexOf(".")!=-1) {
        return this.scriptFilename;
      }
      else {
        return this.scriptFilename + "." + this.jsExtension;
      }
    }
    else {
      let value = this.filename!=null ? this.filename : this.name;
      
      if (value.indexOf(".")!=-1) {
        value = value.replace(/\.[^/.]+$/, "");
      }

      value = value.replace(/\s/gs, "_");
      value = value.replace(/\W/gs, "_");
      return value + "." + this.jsExtension;
    }
  }

  getJavaScriptFullPath() {
    var value = this.getJavaScriptFilename();
    var prefix = this.hasSubdirectory() ? this.upDirectorySymbolSlash : "";

    if (this.scriptSubFolder!="" && this.scriptSubFolder!=null) {
      return prefix + this.scriptSubFolder + "/" + value;
    }
    return value;
  }

  getPageTitle() {

    if (this.title!="" && this.title!=null) {
      return this.title;
    }

    return this.name;
  }
}

class HTMLAttributes {

  // ATTRIBUTES 
  static get DATA_NAME () { return "data-name"; }
  static get DATA_TYPE () { return "data-type"; }
  static get DATA_STATE () { return "data-state"; }
  static get SRC () { return "src"; }
  static get SRCSET () { return "srcset"; }
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
  static get H1 () { return "h1"; }
  static get H2 () { return "h2"; }
  static get H3 () { return "h3"; }
  static get HR () { return "hr"; }
  static get IMAGE () { return "img"; }
  static get IMAGE_FILL () { return "image"; }
  static get INPUT () { return "input"; }
  static get ITALIC () { return "i"; }
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

  /// Spectrum Components
  static get SPECTRUM_ACTION_MENU () { return "sp-action-menu"; }
  static get SPECTRUM_CHECKBOX () { return "sp-checkbox"; }
  static get SPECTRUM_DROPDOWN () { return "sp-dropdown"; }
  static get SPECTRUM_ICON () { return "sp-icon"; }
  static get SPECTRUM_MENU () { return "sp-menu"; }
  static get SPECTRUM_MENU_ITEM () { return "sp-menu-item"; }
  static get SPECTRUM_THEME () { return "sp-theme"; }
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
  static get HTML_TEMPLATE () { return "HTMLTemplate"; }
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
  static get SCROLLABLE_GROUP () { return "ScrollableGroup"; }
  static get SCENE_NODE () { return "SceneNode"; }
  static get SYMBOL_INSTANCE () { return "SymbolInstance"; }
  static get TEXT() { return "Text"; }

  // methods to position 
  static get CONSTRAINT() { return "constraint"; }
  static get HORIZONTAL_MARGIN() { return "horizontalMargin"; }
  static get VERTICAL_MARGIN() { return "verticalMargin"; }
  static get HORIZONTAL_PADDING() { return "horizontalPadding"; }
  static get VERTICAL_PADDING() { return "verticalPadding"; }
  static get HORIZONTAL_CONSTRAINT() { return "horizontalConstraint"; }
  static get VERTICAL_CONSTRAINT() { return "verticalConstraint"; }

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

  static get BOTH() { return "both"; }
  static get DEFAULT() { return "default"; }
  static get STACK() { return "stack"; }
  static get NONE() { return "none"; }
  
}

class MessageConstants {
  static get TOTAL_PAGE_SIZE () { return "Page size"; }
  static get FILE_DELETED () { return "File deleted"; }
  static get EXCLUDED_IMAGE () { return "Excluded image"; }
  static get EMBED_IMAGE () { return "Embed image"; }
  static get IMAGE_EMBEDDED () { return "Image embedded"; }
  static get EXPORTED_IMAGE () { return "Exported image"; }
  static get EXPORTED_ELEMENT () { return "Exported element"; }
  static get EXPORTED_FILE () { return "Exported file"; }
  static get FILE_EXISTS () { return "File exists"; }
  static get FOLDER_ERROR () { return "Folder error"; }
  static get ELEMENT_TYPE_NOT_FOUND () { return "Element type not found"; }
  static get MODEL_ALREADY_ADDED () { return "Model already added"; }
  static get ROTATION_SUPPORT () { return "Rotation support"; }
  static get BORDER_SUPPORT () { return "Border support"; }
  static get IMAGE_FILL_SUPPORT () { return "Image Fill support"; }
  static get MISSING_TOKEN () { return "Missing token"; }
  static get MASK_SUPPORT () { return "Mask support"; }
  static get SAME_ARTBOARD_WIDTHS () { return "Single page export"; }
  static get DUPLICATE_ID () { return "Duplicate ID"; }
  static get DUPLICATE_TEXT_ID () { return "Duplicate Text ID"; }
  static get INDETERMINATE_COLONS () { return "Indeterminate Colons"; }
  static get ID_TRUNCATED () { return "ID truncated"; }
  static get ID_INVALID () { return "Custom ID"; }
  static get LINK_TO_ARTBOARD () { return "Artboard Link"; }
  static get EDITING_CONTEXT () { return "Editing context"; }
  static get NO_HOVER_EFFECT () { return "No hover effect"; }

  /**
   * Get rotation support message
   **/
  static get rotationSupportMessage () {
    return "Rotation not fully supported on all elements. Confirm valid rotation, remove rotation, commit the rotation, adjust the position manually or use the export as image feature";
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
  static get BASELINE () { return "baseline"; }
  static get BOX_SIZING() { return "box-sizing"; }
  static get BORDER() { return "border"; }
  static get BORDER_RADIUS() { return "border-radius"; }
  static get BOTTOM() { return "bottom"; }
  static get CLIP_PATH() { return "clip-path"; }
  static get COLOR() { return "color"; }
  static get CURSOR() { return "cursor"; }
  static get DASHED() { return "dashed"; }
  static get DEFAULT() { return "default"; }
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
  static get MIX_BLEND_MODE() { return "mix-blend-mode"; }
  static get OPACITY() { return "opacity"; }
  static get OUTLINE() { return "outline"; }
  static get OVERFLOW() { return "overflow"; }
  static get OVERFLOW_X() { return "overflow-x"; }
  static get OVERFLOW_Y() { return "overflow-y"; }
  static get PADDING() { return "padding"; }
  static get PADDING_LEFT() { return "padding-left"; }
  static get PADDING_RIGHT() { return "padding-right"; }
  static get PADDING_TOP() { return "padding-top"; }
  static get PADDING_BOTTOM() { return "padding-bottom"; }
  static get POINTER() { return "pointer"; }
  static get POINTER_EVENTS() { return "pointer-events"; }
  static get POSITION() { return "position"; }
  static get RIGHT() { return "right"; }
  static get SHAPE_RENDERING() { return "shape-rendering"; }
  static get SOLID () { return "solid"; }
  static get STRETCH () { return "stretch"; }
  static get STRIKE_THROUGH () { return "strike"; }
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
  static get TEXT_TRANSFORM() { return "text-transform"; }
  static get TOP() { return "top"; }
  static get TRANSFORM() { return "transform"; }
  static get TRANSITION() { return "transition"; }
  static get TRANSFORM_ORIGIN() { return "transform-origin"; }
  static get WIDTH() { return "width"; }
  static get WHITE_SPACE() { return "white-space"; }
  static get VERTICAL_ALIGN () { return "vertical-align"; }
  static get VIEW_BOX() { return "viewBox"; }
  static get VISIBILITY() { return "visibility"; }

  // values
  static get ABSOLUTE () { return "absolute"; }
  static get ALL_SCROLL () { return "all-scroll"; }
  static get ALIAS () { return "alias"; }
  static get AUTO () { return "auto"; }
  static get BLOCK () { return "block"; }
  static get BORDER_BOX () { return "border-box"; }
  static get CAPITALIZE() { return "capitalize"; }
  static get CELL() { return "cell"; }
  static get CENTER() { return "center"; }
  static get COLUMN() { return "column"; }
  static get COLUMN_RESIZE() { return "column-resize"; }
  static get COLUMN_REVERSE() { return "column-reverse"; }
  static get CONTEXT_MENU() { return "context-menu"; }
  static get COPY() { return "copy"; }
  static get CRISP_EDGES() { return "crispedges"; }
  static get CROSSHAIR() { return "crosshair"; }
  static get END () { return "end"; }
  static get GEOMETRIC_PRECISION() { return "geometricPrecision"; }
  static get GRAB() { return "grab"; }
  static get GRABBING() { return "grabbing"; }
  static get FIXED () { return "fixed"; }
  static get FLEX () { return "flex"; }
  static get FLEX_DIRECTION () { return "flex-direction"; }
  static get FLEX_END () { return "flex-end"; }
  static get FLEX_START () { return "flex-start"; }
  static get FONT_STYLE_NORMAL () { return "normal"; }
  static get FONT_STYLE_ITALIC () { return "italic"; }
  static get FONT_WEIGHT_LIGHT () { return "lighter"; }
  static get FONT_WEIGHT_NORMAL () { return "normal"; }
  static get FONT_WEIGHT_BOLD () { return "bold"; }
  static get HELP () { return "help"; }
  static get HIDDEN () { return "hidden"; }
  static get HORIZONTAL() { return "horizontal"; }
  static get INHERIT () { return "inherit"; }
  static get INLINE_BLOCK () { return "inline-block"; }
  static get LINE_THROUGH () { return "line-through"; }
  static get LOWER_CASE () { return "lowercase"; }
  static get MOVE () { return "move"; }
  static get NO_DROP () { return "no-drop"; }
  static get NO_WRAP () { return "nowrap"; }
  static get NONE () { return "none"; }
  static get NOT_ALLOWED () { return "not-allowed"; }
  static get PIXEL () { return "px"; }
  static get PROGRESS () { return "progress"; }
  static get RELATIVE () { return "relative"; }
  static get ROW() { return "row"; }
  static get ROW_RESIZE() { return "row-resize"; }
  static get ROW_REVERSE() { return "row-reverse"; }
  static get SCROLL () { return "scroll"; }
  static get START () { return "start"; }
  static get SIZING_ELEMENT () { return "sizingElement"; }
  static get STICKY () { return "sticky"; }
  static get SUB_SCRIPT () { return "sub"; }
  static get SUPER_SCRIPT () { return "super"; }
  static get TEXT () { return "text"; }
  static get TEXT_DECORATION_UNDERLINE () { return "underline"; }
  static get TITLE_CASE () { return "titlecase"; }
  static get UPPER_CASE () { return "uppercase"; }
  static get VERTICAL_TEXT () { return "vertical-text"; }
  static get VISIBLE () { return "visible"; }
  static get VERTICAL() { return "vertical"; }
  static get WAIT() { return "wait"; }
  static get WRAP() { return "wrap"; }
  static get ZOOM_IN() { return "zoom-in"; }
  static get ZOOM_OUT() { return "zoom-out"; }
  
  // CUSTOM CSS VARIABLES
  // must use two dashes to store in css 
  static get PROPERTY_PREFIX () { return "--web-"; }
  static get ACTUAL_SIZE_ON_DOUBLE_CLICK () { return Styles.PROPERTY_PREFIX + "actual-size-on-double-click"; }
  static get STYLESHEET_ID () { return Styles.PROPERTY_PREFIX + "stylesheet-id"; }
  static get ARTBOARD_NAME () { return Styles.PROPERTY_PREFIX + "view-name"; }
  static get ARTBOARD_ID () { return Styles.PROPERTY_PREFIX + "view-id"; }
  static get ARTBOARD_IDS () { return Styles.PROPERTY_PREFIX + "view-ids"; }
  static get NAVIGATE_ON_KEYPRESS () { return Styles.PROPERTY_PREFIX + "navigate-on-keypress"; }
  static get CENTER_HORIZONTALLY () { return Styles.PROPERTY_PREFIX + "center-horizontally"; }
  static get CENTER_VERTICALLY () { return Styles.PROPERTY_PREFIX + "center-vertically"; }
  static get SCALE_ON_DOUBLE_CLICK () { return Styles.PROPERTY_PREFIX + "scale-on-double-click"; }
  static get SCALE_TO_FIT () { return Styles.PROPERTY_PREFIX + "scale-to-fit"; }
  static get SCALE_TO_FIT_TYPE () { return Styles.PROPERTY_PREFIX + "scale-to-fit-type"; }
  static get ENABLE_SCALE_UP () { return Styles.PROPERTY_PREFIX + "enable-scale-up"; }
  static get SCALE_ON_RESIZE () { return Styles.PROPERTY_PREFIX + "scale-on-resize"; }
  static get REFRESH_FOR_CHANGES () { return Styles.PROPERTY_PREFIX + "refresh-for-changes"; }
  static get ADD_IMAGE_COMPARE () { return Styles.PROPERTY_PREFIX + "add-image-compare"; }
  static get SHOW_NAVIGATION_CONTROLS () { return Styles.PROPERTY_PREFIX + "show-navigation-controls"; }
  static get ENABLE_DEEP_LINKING () { return Styles.PROPERTY_PREFIX + "enable-deep-linking"; }
  static get IS_OVERLAY () { return Styles.PROPERTY_PREFIX + "is-overlay"; }
  static get SHOW_SCALE_CONTROLS () { return Styles.PROPERTY_PREFIX + "show-scale-controls"; }
  static get STATE () { return Styles.PROPERTY_PREFIX + "state"; }
  static get PAGE_FONT () { return Styles.PROPERTY_PREFIX + "page-font"; }
  static get SHOW_BY_MEDIA_QUERY () { return Styles.PROPERTY_PREFIX + "show-by-media-query"; }
  static get SINGLE_PAGE_APPLICATION () { return Styles.PROPERTY_PREFIX + "application"; }
  static get COMPARE_IMAGE_NAME () { return "_snapshot"; }
  static get ACTION_TARGET () { return Styles.PROPERTY_PREFIX + "action-target"; }
  static get ACTION_TYPE () { return Styles.PROPERTY_PREFIX + "action-type"; }
  static get ANIMATION_DATA () { return Styles.PROPERTY_PREFIX + Styles.ANIMATION; }

  static get TEXT_STYLES () { return [this.FONT_FAMILY, this.FONT_SIZE, this.FONT_STYLE, this.LETTER_SPACING, this.TEXT_DECORATION, this.COLOR]; }
  static get HOVER_STYLES () { return [this.ACTION_TARGET, this.ACTION_TYPE, this.ANIMATION_DATA]; }

}

class CapsStyle {
  static get NONE() { return "none"; }
  static get ROUND() { return "round"; }
  static get SQUARE() { return "square"; }
  static get NORMAL() { return "butt"; }
}

class OverflowOptions {
  static get HIDDEN () { return "hidden"; }
  static get AUTO () { return "auto"; }
  static get VISIBLE () { return "visible"; }
  static get ON () { return "on"; }
  static get VERTICAL_ON () { return "verticalOn"; }
  static get VERTICAL_AUTO () { return "verticalAuto"; }
  static get HORIZONTAL_ON () { return "horizontalOn"; }
  static get HORIZONTAL_AUTO () { return "horizontalAuto"; }
}

class FileInfo {
  constructor() {
    this.content = "";
    this.id = null;
    this.fileName = null;
    this.diffFileName = null;
    this.diffHTML = null;
    this.hasVerifyCheck = false;
    this.fileExtension = null;
    this.nativePath = null;
    this.url = null;
    this.folder = null;
    this.subFolder = null;
    this.exclude = false;
    this.name = "";
  }

  toString() {
    return this.getFilename();
  }

  getFilename() {
    if (this.fileName!=null && this.fileName.indexOf(".")!=-1) {
      return this.fileName;
    }
    return this.fileName + "." + this.fileExtension;
  }

}

class Warning {
  constructor() {
    this.description = "";
    this.label = "";
    this.line = 0;
    this.column = 0;
  }
  toString() {
    return this.label + ": " + this.description;
  }
}

class PageToken {
  stylesheetReplacement(stylesheetTokenMultiline, stylesheetReplacement) {
    throw new Error("Method not implemented.");
  }
  constructor() {
    this.stylesheetTokenMultiline = /([\t| ]*)(<!--stylesheets_start-->)(.*)(^\s+)(<!--stylesheets_end-->)/ism;
    this.stylesheetTokenSingleline = /([\t| ]*)(<!--stylesheets-->)/i;
    this.stylesheetTokenReplace = "$1$2$3[stylesheets]\n$4$5";
    this.stylesheetTokenStart = "<!--stylesheets_start-->";
    this.stylesheetTokenEnd = "<!--stylesheets_end-->";
    
    this.dateYearToken = /<!--year-->/gm;
    this.dateMonthToken = /<!--month-->/gm;
    this.dateDayToken = /<!--day-->/gm;
    this.timeToken = /<!--time-->/gm;
    this.dateToken = /<!--date-->/gm;
    this.generatorToken = "<!--generator-->";
    this.generatorVersionToken = "<!--generator_version-->";
    this.pageTitleToken = "<!--page_title-->";
    this.scriptsToken = /(\n)?<!--scripts-->/m;
    this.fileListToken = "<!--file_list-->";
    this.fileListArrayToken = "<!--file_array_list-->";
    
    this.applicationTokenSingleline = /([\t| ]*)(<!--application_content-->)/i;
    this.contentTokenSingleline = /([\t| ]*)(<!--body_content-->)/i;
		this.contentTokenReplace = "$1$2$3[content]\n$4$5";
		this.contentTokenStart = "<!--template_content_start-->";
    this.contentTokenEnd = "<!--template_content_end-->";
    this.contentTokenMultiline = /([\t| ]*)(<!--body_start-->)(.*)(^\s*)(<!--body_end-->)/ism;
		
		this.stylesValueToken = "[styles_value]";
		this.stylesTokenMultiline = /([\t| ]*)(<!--styles_start-->)(.*)(^\s+)(<!--styles_end-->)/ism;
		this.stylesTokenSingleline = /([\t| ]*)(<!--styles_content-->)/i;
		this.stylesTokenReplace = "$1$2$3[styles]\n$4$5";
		this.noStylesToken = "<!--no_styles-->";
		this.stylesTokenStart = "<!--styles_start-->";
    this.stylesTokenEnd = "<!--styles_end-->";
    this.viewIdToken = "<!--view_id-->";
    this.viewIdsToken = "<!--view_ids-->";
    this.viewIdsCSSToken = "<!--view_ids_css-->";
    this.viewIdsArrayToken = "<!--view_ids_array-->";
		this.viewNameToken = "<!--view_name-->";
		this.innerHTMLToken = /{INNER_HTML}/;
		this.selectorToken = /{SELECTOR}/g;
		this.subSelectorToken = /{SELECTOR2}/g;
		this.percentWidthToken = /{PERCENT_WIDTH}/g;
		this.percentHeightToken = /{PERCENT_HEIGHT}/g;
		this.pixelWidthToken = /{PIXEL_WIDTH}/g;
		this.pixelHeightToken = /{PIXEL_HEIGHT}/g;
		this.widthToken = /{WIDTH}/g;
		this.heightToken = /{HEIGHT}/g;
		this.topToken = /{TOP}/g;
		this.leftToken = /{LEFT}/g;
		this.rightToken = /{RIGHT}/g;
		this.bottomToken = /{BOTTOM}/g;
		this.fillColorToken = /{FILL_COLOR}/g;
		this.strokeToken = /{STROKE}/g;
		this.strokeStyleToken = /{STROKE_STYLE}/g;
		this.strokeColorToken = /{STROKE_COLOR}/g;
		this.strokeWidthToken = /{STROKE_WIDTH}/g;
		this.rotationToken = /{ROTATION}/g;
		this.transformToken = /{TRANSFORM}/g;
		this.imageSourceToken = /{IMAGE_SOURCE}/g;
		this.imageSourceSetToken = /{IMAGE_SOURCE_SET}/g;
    
    this.osNeutralLinebreaks = /(\t|\r?\n)+/gm;

    this.removeStyle = /\S*-/;
    this.addStyle = /\S*\+/;
  }

  static get SELECTOR_TOKEN () { return "{SELECTOR}"; }
  static get SELECTOR2_TOKEN () { return "{SELECTOR2}"; }
}

class MoreRoomForm {
  constructor() {
    this.form = null;
    this.cancelButton = null;
    this.okButton = null;
    this.backButton = null;
    this.defaultButton = null;
    this.resetButton = null;
    this.object = null;
	  this.property = null;
	  this.value = null;
	  this.defaultValue = null;
	  this.description = null;
    this.headerLabel = null;
    this.descriptionLabel = null;
    this.title = null;
    this.editLabel = null;
    this.messagesTextarea = null;
    this.referringView = null;
    this.referringDialog = null;
    this.window = null;
    this.callback = null;
    this.parameters = null;
    this.nullIfDefault = true;
    this.addTabOnTab = true;
  }

  defaultButtonHandler() {
    this.messagesTextarea.value = this.defaultValue;
    this.messagesTextarea.innerHTML = this.defaultValue;
  }

  resetButtonHandler() {
    this.messagesTextarea.value = "";
    this.messagesTextarea.innerHTML = "";
  }

  cancelButtonHandler() {
    this.restoreView();
  }
  
  okButtonHandler() {
    this.commitForm();
  }

  commitForm() {

    try {

      var isEmptyString = this.messagesTextarea.value=="";
  
      if (this.object) {
        if (this.defaultValue===this.messagesTextarea.value || (this.defaultValue==null && isEmptyString)) {
    
          if (this.nullIfDefault) {
            this.object[this.property] = null;
          }
          else {
            this.object[this.property] = this.defaultValue;
          }
        }
        else {
          this.object[this.property] = this.messagesTextarea.value;
        }
      }
      
      if (this.callback) {
        
        if (this.parameters && this.parameters.length) {
          this.callback(...this.parameters);
        }
        else {
          this.callback();
        }
      }
  
      this.restoreView();
    }
    catch (error) {
      log(error)
      this.restoreView();
    }
  }
  
  backButtonHandler() {
      
    if (this.callback) {
      
      if (this.parameters && this.parameters.length) {
        this.callback(...this.parameters);
      }
      else {
        this.callback();
      }
    }

    this.restoreView();
  }

  restoreView() {
    this.messagesTextarea.value = "";
    this.messagesTextarea.innerHTML = "";
    this.removeView();
    this.referringDialog.appendChild(this.referringView);
    this.isVisible = false;
  }
  
  removeView() {
    if (this.form.parentNode) {
      this.referringDialog.removeChild(this.form);
    }
  }

  showView() {
    var height = getPx(this.referringView.clientHeight);
    var width = getPx(this.referringView.clientWidth);
    
    this.form.style.minWidth = width;
    this.form.style.width = "100%";
    this.form.style.height = height;

    try {
      this.referringDialog.appendChild(this.form);
      this.referringDialog.removeChild(this.referringView);
    }
    catch(error) {
      // Plugin NotFoundError: Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.
      // todo: debug this error
    }

    this.messagesTextarea.focus();
    //this.window.addEventListener("keydown", this.escKeyDownHandler);

    this.isVisible = true;
  }

  escKeyDownHandler(event) {

    if (event.keyCode==27) {
      this.restoreView();
      //window.removeEventListener("keydown", this.escKeyDownHandler);
    }
  }

  messagesTextareaOnInput(e) {

    if (e.keyCode==27) {
      this.restoreView();
      return;
    }

    if (this.addTabOnTab) {
      var textarea = this.messagesTextarea;
      var after, before, end, lastNewLine, changeLength, re, replace, selection, start, value;

      if ((e.charCode === 9 || e.keyCode === 9) && !e.altKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        return;

        start = textarea.selectionStart;
        end = textarea.selectionEnd;
        value = textarea.value;
        before = value.substring(0, start);
        after = value.substring(end);
        replace = true;

        if (start !== end) {
          selection = value.substring(start, end);

          if (~selection.indexOf('\n')) {
            replace = false;
            changeLength = 0;
            lastNewLine = before.lastIndexOf('\n');

            if (!~lastNewLine) {
              selection = before + selection;
              changeLength = before.length;
              before = '';
            }
            else {
              selection = before.substring(lastNewLine) + selection;
              changeLength = before.length - lastNewLine;
              before = before.substring(0, lastNewLine);
            }

            if (e.shiftKey) {
              re = /(\n|^)(\t|[ ]{1,8})/g;

              if (selection.match(re)) {
                start--;
                changeLength--;
              }

              selection = selection.replace(re, '$1');
            } else {
              selection = selection.replace(/(\n|^)/g, '$1\t');
              start++;
              changeLength++;
            }
            textarea.value = before + selection + after;
            textarea.selectionStart = start;
            textarea.selectionEnd = start + selection.length - changeLength;
          }
        }

        if (replace && !e.shiftKey) {
          textarea.value = before + '\t' + after;
          textarea.selectionStart = textarea.selectionEnd = start + 1;
        }
      }
    }
  }
  
  setTitle(value) {
    this.headerLabel.value = value;
    this.headerLabel.innerHTML = value;
  }

  setDescription(value = null) {

    if (value==null) {
      this.descriptionLabel.textContent = "";
    }
    else {
      this.descriptionLabel.textContent = value;
    }
  }
  
  setTextarea(value) {
    try {
      this.messagesTextarea.value = value;
      this.messagesTextarea.innerHTML = value;
    }
    catch(e) {
      log("error", e)
    }
  }
  
  showResetButton(visible) {
    this.resetButton.style.display = visible ? "block" : "none";
  }
  
  showCancelButton(visible) {
    this.cancelButton.style.display = visible ? "block" : "none";
  }

  showOKButton(visible) {
    this.okButton.style.display = visible ? "block" : "none";
  }

  showBackButton(visible) {
    this.backButton.style.display = visible ? "block" : "none";
  }

  showDefaultButton(visible) {
    this.defaultButton.style.display = visible ? "block" : "none";
  }
}

class HostForm {
  constructor() {
    this.form = null;
    this.cancelButton = null;
    this.okButton = null;
    this.backButton = null;
    this.defaultButton = null;
    this.resetButton = null;
    this.headerLabel = null;
    this.descriptionLabel = null;
    this.clearConsoleButton = null;
    this.clearFormButton = null;
    this.cloudLink = null;
    this.uploadLink = null;
    this.linkLabel = null;
    this.removeCloudLink = null;
    this.linkToPostButton = null;
    this.uploadOnExportCheckbox = null;
    this.testAuthButton = null;
    this.testURLButton = null;
    this.urlInput = null;
    this.postLinkInput = null;
    this.endPointInput = null;
    this.usernameInput = null;
    this.usernameLabel = null;
    this.loggingInLabel = null;
    this.siteNameLabel = null;
    this.siteDescriptionLabel = null;
    this.artboardURLLabel = null;
    this.customDomainTypeRadio = null;
    this.defaultDomainTypeRadio = null;
    this.passwordInput = null;
    this.registerButton = null;
    this.loginButton = null;
    this.logoutButton = null;
    this.debugCheckbox = null;
    this.messagesLabel = null;
    this.resultsTextarea = null;
    this.uploadButton = null;
    this.referringView = null;
    this.referringDialog = null;
    this.window = null;
    this.callback = null;
    this.parameters = null;
    this.defaultValue = "";
    this.username = null;
    this.password = null;
    this.url = null;
    this.serverVerifyIcon = null;
  }

  showView() {
    var height = getPx(this.referringView.clientHeight);
    var width = getPx(this.referringView.clientWidth);
    
    this.form.style.minWidth = width;
    this.form.style.width = "100%";
    this.form.style.height = height;

    try {
      this.referringDialog.appendChild(this.form);
      this.referringDialog.removeChild(this.referringView);
    }
    catch(error) {
      // Plugin NotFoundError: Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.
      // todo: debug this error
    }

    this.usernameInput.focus();
    //this.window.addEventListener("keydown", this.escKeyDownHandler);

    this.isVisible = true;
  }

  commitForm() {

    try {

      if (this.callback) {
        
        if (this.parameters && this.parameters.length) {
          this.callback(...this.parameters);
        }
        else {
          this.callback();
        }
      }
  
      this.restoreView();
    }
    catch (error) {
      log(error)
      this.restoreView();
    }
  }

  defaultButtonHandler() {

  }

  resetButtonHandler() {

  }

  cancelButtonHandler() {
    if (this.resultsTextarea) {
      this.resultsTextarea.innerHTML = "";
    }
    this.restoreView();
  }
  
  okButtonHandler() {
    this.commitForm();
  }

  restoreView() {
    this.removeView();
    this.referringDialog.appendChild(this.referringView);
    this.isVisible = false;
  }
  
  removeView() {
    if (this.form.parentNode) {
      this.referringDialog.removeChild(this.form);
    }
  }
}

class Form {
  constructor() {
    this.mainDialogWidth = 700;
    this.settingsDialogWidth = 600;
    this.mainDialogLabelWidth = 175;
    this.mainDialogLabelWidth2 = 145;
    this.labelBeforeCheckboxWidth = 182;
    this.checkboxLabelWidth = 200;
    this.hostFormLabelWidth = 145;
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
    this.errorIconPath = "icons/Not Found 2 Icon.png";
    this.serverIconPath = "icons/Server Icon.png";
    this.hostIconPath = "icons/Host Icon.png";
    this.closeIconPath = "icons/Close Icon.png";
    this.notFoundIconPath = "icons/Not Found Icon.png";
    this.notFoundAltIconPath = "icons/Not Found 2 Icon.png";
    this.warningIconPath = "icons/Warning Icon.png";
    this.folderIconPath = "icons/Folder Icon.png";
    this.copyURLIconPath = "icons/Copy URL Icon.png";
    this.changedPropertiesIconPath = "icons/Changed Properties Icon.png";
    this.changedPropertiesDarkIconPath = "icons/Changed Properties Dark Icon.png";
    this.resetIconPath = "icons/Reset Icon.png";
    this.resetDarkIconPath = "icons/Reset Dark Icon.png";
    this.verifyIconPath = "icons/Verify Icon.png";
    this.verifyDarkIconPath = "icons/Verify Dark Icon.png";
    this.verifyEllipsisIconPath = "icons/Verify Ellipse Icon.png";
    this.verifyEllipsisAltIconPath = "icons/Verify Ellipse 2 Icon.png";
    this.templateIconPath = "icons/HTML Document Icon.png";
    this.styleTemplateIconPath = "icons/CSS Document Icon.png";
    this.hiddenIconPath = "icons/Hidden Icon.png";
    this.visibleIconPath = "icons/Visible Icon.png";
    this.scriptTemplateIconPath = "icons/JS Document Icon.png";
    this.templateDarkIconPath = "icons/HTML Document Dark Icon.png";
    this.styleTemplateDarkIconPath = "icons/CSS Document Dark Icon.png";
    this.scriptTemplateDarkIconPath = "icons/JS Document Dark Icon.png";
    this.globalArtboardIconPath = "icons/Global Artboard Icon.png";
    this.artboardIconPath = "icons/Artboard Icon.png";
    this.prototypeLinkIconPath = "icons/Prototype Link Icon.png";
    this.linkIconPath = "icons/Link Icon.png";
    this.artboardsIconPath = "icons/Artboards Icon.png";
    this.ellipsisIconPath = "icons/Ellipsis Icon.png";
    this.interactionButtonPath = "icons/Interaction Button Icon.png";
    this.rightChevron = "icons/Right Chevron Icon.png";
    this.doubleRightChevron = "icons/Double Right Chevron Icon.png";
    this.clearChevron = "icons/Clear Chevron Icon.png";
    this.exportIconPath = "icons/Export Icon.png";
    this.toggleOff = "icons/ToggleOff.png";
    this.toggleOn = "icons/ToggleOn.png";
    this.rowAlignPath = "icons/Row Align Icon.png";
    this.columnAlignPath = "icons/Column Align Icon.png";
    this.dropdownChevron = "icons/Dropdown Chevron Icon.png";
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
    this.footerButtonStyle = { border:"0px solid #888888", paddingLeft:"4px", paddingRight:"4px", paddingBottom:"0px", marginRight:"8px", borderRadius: "0",
      opacity:1, fontWeight:"normal", textAlign:"center", cursor:"pointer", color:"#686868"};
    this.navigationStyle = { marginRight: getPx(5), paddingBottom: getPx(2), color: "#AFAFAF", fontWeight: "bold", fontSize: "13px"};
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
    this.scaleScreen = null;
    this.globalArtboardIcon = null;
    this.artboardIcon = null;
    this.artboardPreviewIcon = null;
    this.previousArtboardIcon = null;
    this.nextArtboardIcon = null;
    this.exportLabel = null;
    this.exportMessageTimeout = null;
    this.exportingRow = null;
    this.messageRow = null;
    this.linksRow = null;
    this.exportFolderInput = null;
    this.imagesFolderInput = null;
    this.imagesPrefixInput = null;
    this.image2xCheckbox = null;
    this.embedColorLimitInput = null;
    this.embedColorLimitLabel = null;
    this.embedImagesCheckbox = null;
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
    this.hostButton = null;
    this.serverTestButton = null;
    this.alternativeFontInput = null;
    this.titleInput = null;
    this.pageNameInput = null;
    this.pageFolderInput = null;
    this.stylesheetNameInput = null;
    this.stylesheetFolderInput = null;
    this.scriptNameInput = null;
    this.scriptFolderInput = null;
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
    this.templateIcon = null;
    this.styleTemplateIcon = null;
    this.scriptTemplateIcon = null;
    this.expectedHTMLIcon = null;
    this.expectedStyleIcon = null;
    this.expectedScriptIcon = null;

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
    this.uploadLink = null;
    this.openURLLink = null;
    this.openRURLLink = null;
    this.openFolderLink = null;
    this.copyURLLink = null;
    this.closeMessagesButton = null;
    this.verifyDiffIcon = null;
    this.diffLink = null;
    this.openHostLink = null;
    this.exportErrorsIcon = null;
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
    this.nameLabelSpacer = null;
    this.notExportedLabel = null;
    this.nameInput = null;
    this.mainDialog = null;
    this.mainForm = null;
    this.mainFormFieldset = null;
    this.elementIcon = null;
    this.selectedArtboardsSelector = null;
    this.idInput = null;
    this.idInputWarning = null;
    this.additionalStylesInput = null;
    this.subStylesInput = null;
    this.subStylesListIcon = null;
    this.classesInput = null;
    this.subClassesInput = null;
    this.subClassesListIcon = null;
    this.attributesInput = null;
    this.subAttributesInput = null;
    this.subAttributesListIcon = null;
    this.cursorList = null;
    this.tagNameInput = null;
    this.subTagNameInput = null;
    this.subTagNameListIcon = null;
    this.markupInsideInput = null;
    this.markupBeforeInput = null;
    this.markupAfterInput = null;
    this.textIDsInput = null;
    this.textTokensInput = null;
    this.hyperlinkInput = null;
    this.hyperlinkArtboardIcon = null;
    this.hyperlinkTargetInput = null;
    this.hyperlinkElementInput = null;
    this.hyperlinkElementsList = null;
    this.interactionButton = null;
    this.vectorizeButton = null;
    this.heightInput = null;
    this.widthInput = null;
    this.hoverEffectsList = null;
    this.hoverEffectsSelector = null;
    this.copyChangesToTemplateButton = null;
    this.sizeList = null;
    this.overflowList = null;
    this.overflowListInput = null;
    this.positionList = null;
    this.positionByList = null;
    this.textIDsGroup = null;
    this.textTokensGroup = null;
    this.imageOptionsGroup = null;
    this.imageFormatList = null;
    this.imageQualitySlider = null;
    this.image2xCheckbox = null;
    this.imageSizeLabel = null;
    this.embedColorLimitInput = null;
    this.embedImageCheckbox = null;
    this.embedImageResetIcon = null;
    this.groupLayoutGroup = null;
    this.groupItemGroup = null;
    this.groupLayoutIcon = null;
    this.groupLayoutIcon2 = null;
    this.groupLayoutInput = null;
    this.groupVerticalLayoutInput = null;
    this.groupHorizontalLayoutInput = null;
    this.groupLayoutList = null;
    this.selfAlignmentGroup = null;
    this.hoverEffectsGroup = null;
    this.revealDescendentsGroup = null;
    this.revealCheckbox = null;
    this.revealOnEventList = null;
    this.useAsBackgroundGroup = null;
    this.groupHorizontalAlignmentList = null;
    this.groupVerticalAlignmentList = null;
    this.groupSpacingInput = null;
    this.groupSpacingList = null;
    this.groupWrapList = null;
    this.groupWrapInput = null;
    this.selfAlignmentList = null;
    this.selfAlignmentListInput = null;
    this.wrapTagsList = null;
    this.hyperlinkPagesList = null;
    this.tagNameList = {};
    this.subTagNameList = {};
    this.hyperlinkTargetsList = null;
    this.selectionIcon = null;
    this.selectionLabel = null;
    this.selectParentLabel = null;
    this.selectPreviousSiblingLabel = null;
    this.selectNextSiblingLabel = null;
    this.selectDescendentLabel = null;
    
    this.convertToImageCheckbox = null;
    this.useBase64DataCheckbox = null;
    this.displayedIcon = null;
    this.displayCheckbox = null;
    this.exportCheckboxLabel = null;
    this.exportCheckbox = null;
    this.constrainLeftCheckbox = null;
    this.constrainRightCheckbox = null;
    this.constrainBottomCheckbox = null;
    this.constrainTopCheckbox = null;
    this.centerHorizontallyCheckbox = null;
    this.centerVerticallyCheckbox = null;
    this.useAsBackgroundCheckbox = null;
    this.consolidateStylesCheckbox = null;
    this.exportAsStringCheckbox = null;
    this.showOutlineCheckbox = null;
    this.debugElementCheckbox = null;
    this.exportOnUpdateCheckbox = null;
    this.exportOnUpdateToggle = null;
    this.templateIcon = null;
    this.styleTemplateIcon = null;
    this.scriptTemplateIcon = null;
    this.resetElementIcon = null;
    this.changedPropertiesIcon = null;
    this.styleTransferLabel = null;
    this.exportMessageRow = null;
    this.exportMessageItemsRow = null;
    this.exportMessageRowBorder = null;
    this.exportMessageLabel = null;
    this.copyURLLink = null;
    this.openFolderLink = null;
    this.openHostLink = null;
    this.openRURLLink = null;
    this.openURLLink = null;
    this.uploadLink = null;
    this.diffLink = null;
    this.exportErrorsIcon = null;
    this.verifyDiffIcon = null;
    this.helpIcon = null;
    this.exportingIcon = null;
    
    this.helpButton = null;
    this.resetElementButton = null;
    this.copyElementButton = null;
    this.copyMarkupButton = null;
    this.copyCSSButton = null;
    this.cancelButton = null;
    this.submitButton = null;
    this.exportLabel = null;
    this.showMarkupLabel = null;
    this.showCSSLabel = null;
    this.beforeExportLabel = null;

    this.dialog = null;

    this.copyPageLabel = "Copy as Page";
    this.copyMarkupLabel = "Copy Markup";
    this.copyCSSLabel = "Copy CSS";

    this.elementPanelWidth = "100%";
    this.panelLabelWidth = 95;
    this.panelCheckboxesSpacerWidth = 20;
    this.panelExportMessageTimeout = null;
    this.panelExportIconTimeout = null;
    this.panelIconTimeout = null;

    this.elementDialogWidth = 760;
    this.labelWidth = 120;
    this.labelBeforeCheckboxWidth = 125;
    this.elementCheckboxesSpacerWidth = 100;
    this.elementCheckboxRowHeight = 22;
    this.elementRowHeight = 25;
    this.disclosureIconWidth = 20;
    this.flexDirection = "row";
  }
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

class NotificationForm {
  constructor() {
    this.form = null;
    this.timeout = null;
    this.openURLLink = null;
    this.openRURLLink = null;
    this.openHostLink = null;
    this.openFolderLink = null;
    this.copyURLLink = null;
    // shown when the output does not match the expected output value 
    this.openDiffLink = null;
    // shown when the output matches the expected output value 
    this.verifyDiffIcon = null;
    this.exportErrorsIcon = null;
  }
}

class AlertForm {
  constructor() {
    this.header = null;
    this.message = null;
  }
}

class Definition {
  constructor() {
    this.id = null;
    this.tagName = null;
    this.imageTagName = null;
    this.imageAttributes = null;
    this.imageData = null;
    this.colorStops = null;
    this.properties = null;
    this.filename = null;
    this.fullFilename = null;
    this.extension = null;
    this.backgroundImage = false;
    this.scale = 1;
    this.type = null;
    this.quality = 100;
    this.colorStopTagName = null;
    this.node = null;
    this.exportName = null;
    this.exportFolder = "";
    this.outputFile = null;
    this.base64 = null;
    this.numberOfColors = null;
    this.embedded = false;
    this.prefix = "";
    this.exclude = false;
    this.excludeReason = null;
    this.size = 0;
    this.kbSize = 0;
    this.mbSize = 0;
    this.size2x = 0;
    this.kbSize2x = 0;
    this.mbSize2x = 0;
  }

  getFilename() {
    var path = "";
    if (this.filename!=null) {
      if (this.filename.indexOf(".")!=-1) {
        path = this.prefix + this.filename;
        return path;
      }
      else {
        path = this.prefix + this.filename;
        return path;
      }
    }
    else {
      let value = this.exportName;
      path = this.prefix + value;
      return path;
    }
  }
}

class Gradient {
  constructor() {
    this.id = "";
    this.spreadMethod = "";
    this.x1 = 0;
    this.x2 = 0;
    this.y1 = 0;
    this.y2 = 0;
  }
}

class ColorStop {
  constructor() {
    this.offset = null;
    this["stop-color"] = null;
    this["stop-opacity"]= null;
  }
}

class Duplicates {
  constructor(_name, _type, _newName) {
    this.elementName = _name;
    this.type = _type;
    this.newName = _newName;
  }
}

class Diff {
  constructor(diff, prettyDiff, lines) {
    this.diff = diff;
    this.prettyDiff = prettyDiff;
    this.lines = lines;
    this.lastLine = null; // last changed line
    this.row = 0;
    this.column = 0;
  }

  firstLocation () {

  }
}

class StyleDeclaration {
  constructor() {

  }

  getPropertyPriority(propertyName) {
    return this[propertyName];
  }
  removeProperty(propertyName) {
    delete this[propertyName];
  }
  item(index) {

  }
  getPropertyValue(propertyName) {
    return this[propertyName];
  }
  setProperty(propertyName, value, priority = 1) {
    this[propertyName] = value;
  }
  setProperties(object, priority = 1) {
    if (object) {
      for (const key in object) {
        if (object.hasOwnProperty(key)) {
          this[key] = object[key];
        }
      }
    }
  }
}

class Trigger {
  constructor() {
    this.cssText = "";
    this.type = 1;
	  this.cssArray = [];
    this.parentRule = null;
    this.parentStyleSheet = null;
    this.type = 0;
  }
  static get TAP() { return 2 };
  static get COUNTER_STYLE_RULE() { return 11 }
}

class TriggerType {
  static get TAP() { return "tap" };
}

class ActionType {
  static get GO_TO_ARTBOARD() { return "goToArtboard" };
  static get GO_BACK() { return "goBack" };
  static get OVERLAY() { return "overlay" };
}

class TransitionType {
  static get AUTO_ANIMATE() { return "autoAnimate" };
  static get DISSOLVE() { return "dissolve" };
  static get SLIDE() { return "slide" };
}

class Events {
  static get ON_CLICK() { return "onclick" };
}

class Rule {
  constructor() {
    this.cssText = "";
    this.type = 1;
	  this.cssArray = [];
    this.parentRule = null;
    this.parentStyleSheet = null;
    this.type = 0;
  }
  static get CHARSET_RULE() { return 2 };
  static get COUNTER_STYLE_RULE() { return 11 };
  static get DOCUMENT_RULE() { return 13 };
  static get FONT_FACE_RULE() { return 5 };
  static get FONT_FEATURE_VALUES_RULE() { return 14 };
  static get IMPORT_RULE() { return 3 };
  static get KEYFRAMES_RULE() { return 7 };
  static get KEYFRAME_RULE() { return 8 };
  static get MEDIA_RULE() { return 4 };
  static get NAMESPACE_RULE() { return 10 };
  static get PAGE_RULE() { return 6 };
  static get STYLE_RULE() { return 1 };
  static get SUPPORTS_RULE() { return 12 };
  static get UNKNOWN_RULE() { return 0 };
  static get VIEWPORT_RULE() { return 15 };
}

class StyleRule extends Rule {
  constructor() {
    super();
    this.selectorText = "";
    this.style = new StyleDeclaration();
    this.type = Rule.STYLE_RULE;
  }
}

class KeyframeRule extends Rule {
  constructor() {
    super();
    this.keyText = "";
    this.style = new StyleDeclaration();
    this.type = Rule.KEYFRAME_RULE;
  }
}

class KeyframesRule extends Rule {
  constructor() {
    super();
    this.cssRules = [];
    this.name = "";
    this.type = Rule.KEYFRAMES_RULE;
  }

  static get KEYFRAMES() { return "keyframes"; }

  /**
   * Adds a rule to css rules 
   * @param {KeyframeRule} rule 
   */
  appendRule(rule) {
    this.cssRules.push(rule);
  }
}

class DiffObject {

	constructor() {
    this.hasDiff    = false;
    this.pageDiff   = null;
    this.cssDiff    = null;
    this.scriptDiff = null;
    this.diffOutput = null;
  }
}

class UserGlobalPreferences {

	constructor() {
    this.version              = null;
    this.applicationVersion   = null;
    this.showBasicScreen      = true;
    this.hostField1           = null;
    this.hostField2           = null;
    this.hostField3           = null;
    this.hostField4           = null;
  }
}

class DebugModel {

	constructor() {
    this.addInteractions          = false;
    this.addToExport              = false;
    this.addStylesFromString      = false;
    this.browseForFolder          = false;
    this.canInherit               = false;
    this.copyToClipboard          = false;
    this.colorFill                = false;
    this.createModel              = false;
    this.createUniqueName         = false;
    this.exportSelectedItem       = false;
    this.exportDocument           = false;
    this.exportItem               = false;
    this.exportingLastArtboard    = false;
    this.getBounds                = false;
    this.fills                    = false;
    this.flexAlignSelf            = false;
    this.getMediaQuery            = false;
    this.getTextValue             = false;
    this.getPageControls          = false;
    this.getPageScript            = false;
    this.getTagNamesList          = false;
    this.getTag                   = false;
    this.getApplicationDescriptor = false;
    this.setPosition              = false;
    this.imageFill                = false;
    this.initializeGlobalModel    = false;
    this.lastFileLocation         = false;
    this.linearFill               = false;
    this.muteConsoleLogs          = false;
    this.openURL                  = false;
    this.preferences              = false;
    this.saveRenditions           = false;
    this.replaceTokens            = false;
    this.exportare                = false;
    this.saveToDisk               = false;
    this.setWidth                 = false;
    this.setHeight                = false;
    this.showLinearOutput         = false;
    this.showAlertDialog          = false;
    this.showCSS                  = false;
    this.showElementDialog        = false;
    this.showMainDialog           = false;
    this.showHelpDialog           = false;
    this.showMarkup               = false;
    this.showPage                 = false;
    this.showWarnings             = false;
    this.strokeStyle              = false;
    this.submitMainForm           = false;
    this.submitElementForm        = false;
    this.updateFileLocation       = false;
    this.useTemplate              = false;
    this.updateSelectedArtboards     = false;
    this.updateExportArtboardsLabel  = false;
    this.verticalStack               = false;
    this.exportSelectedArtboard                   = false;
    this.exportSelectedArtboardsToMultiplePages   = false;
    this.exportSelectedArtboardsToSinglePage      = false;
    
    // values during parsing
    this.ignoreDuplicateIDs       = false;
    this.ignoreStrokeNotSupported = false;
    this.ignoreFileExists         = true;
	}
	
}

module.exports = {Definition, Diff, Duplicates, KeyframesRule, KeyframeRule, StyleRule, Rule, HTMLAttributes, DebugModel, MessageConstants, 
  Form, MainForm, SupportForm, NotificationForm, ElementForm, SettingsForm, MoreRoomForm, AlertForm, GlobalModel, ArtboardModel, Model, 
  HostForm, HTMLConstants, XDConstants, DiffObject, Events, UserGlobalPreferences, Styles, TriggerType, Trigger, ActionType, ColorStop, 
  Gradient, CapsStyle, FileInfo, Warning, PageToken, OverflowOptions, TransitionType};
