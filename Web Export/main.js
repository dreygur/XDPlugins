///////////////////////////////////////////////////////////////////////////
// Web Exportation 
///////////////////////////////////////////////////////////////////////////

/**
 * Elements refer to SceneNodes
 * There are a few ways to do this better - need the time and resources
 * Debugging some issues are difficult. Debugging support will be in a future iteration of XD
 * They say make the first edition knowing you'll rewrite it later. 
 * 
 * TODO: 
 * Use document object model if compatible with feature set
 * Replace original global variable 'artboardModel' with references to current artboard model 
 * Continue encapsulation
 **/

const Platforms = require("./platforms").Platforms;
const application = Platforms.application;


if (Platforms.isXD) {
	var scenegraph = require("scenegraph");
	var clipboard = require("clipboard");
	var interactions = require("interactions");
	var {Artboard, BooleanGroup, Blur, Matrix, Color, ImageFill, Ellipse, GraphicNode, Group, Line, LinkedGraphic, Path} = require("scenegraph");
	var {Rectangle, RepeatGrid, SymbolInstance, Text, Polygon} = require("scenegraph");
	var applicationVersion = parseFloat(application.version);
	var editDocument = require("application").editDocument;
}

const {Definition, Diff, Duplicates, Form, MainForm, MoreRoomForm, SupportForm, NotificationForm, KeyframesRule, KeyframeRule, StyleRule} = require("./library.js");
const {StyleDeclaration, Rule, MessageConstants, ElementForm, SettingsForm, AlertForm, HTMLAttributes, DebugModel, GlobalModel, ArtboardModel} = require("./library.js");
const {OverflowOptions, Model, HTMLConstants, XDConstants, Styles, CapsStyle, FileInfo, Warning, ColorStop, Gradient, PageToken, DiffObject} = require("./library.js");
const {Trigger, TriggerType, ActionType, TransitionType, Events, HostForm} = require("./library.js");
const {log, getTime, getString, getFirstDescendantNode, getItemIndex, getNumberOfItemsInParent, getNextSceneNode, getPreviousSceneNode, getBase64FromSceneNode} = require("./log");
const {getBase64ImageData, getArrayBufferFromSceneNode, getSceneNodeIndex, getIsArtboard, isSupportedExportFormat, sleep, centerHorizontally} = require("./log");
const {centerVertically, bottom, top, left, right, getAllArtboards, getTempImageFromSceneNode, getIsGraphicNode, getIsGraphicNodeWithImageFill} = require("./log");
const {isInEditContext, isDescendantNode, getIsPasteboardItem, isPortrait, isLandscape, isSiblingNode, isChildNode, getChildNodes, getItemAtIndex} = require("./log");
const {getNodeByGUID, FilterOptions, QuantizeFilterOptions, InvertFilterOptions, object, trim, getSceneNodeByGUID} = require("./log");
const {getPx, getArtboard, addString, addStrings, getShortNumber, getShortString, checkSubFolderExists, getChangedPropertiesObject} = require("./log");
const {checkFileExists, checkFileExists2, getClassName, getFunctionName, getStackTrace, logStackTrace, getBoundsInParent, getIsPointText} = require("./log");
const {getChangedProperties, deleteProperties, DebugSettings, indentMultiline, getSubFolder, getNumberOfFiles, getParentRepeatGrid} = require("./log");
const {getIndent, getBase64FromString, getNumberOfDirectories} = require("./log");
const diff_match_patch = require("./library/diff_match_patch").diff_match_patch;
const h = require("./h");
const shell = require("uxp").shell;
const platform = require("os").platform();
const fileSystem = require("uxp").storage.localFileSystem;
const UXPFile = require('uxp').storage.File;
const UPNG = require("./UPNG").UPNG;


DebugSettings.logFunctionName = true;

///////////////////////////////////////////////////////////////////////////
// DIALOGs and PANELs
///////////////////////////////////////////////////////////////////////////

var mainForm = new MainForm();
var elementForm = new ElementForm();
var settingsForm = new SettingsForm();
var moreRoomForm = new MoreRoomForm();
var hostForm = new HostForm();
var alertForm = new AlertForm();
var notificationForm = new NotificationForm();
var supportForm = new SupportForm();
var debugModel = new DebugModel();
var form = new Form();
var elementDialog = null;
var panelNode = null;
var lastMergedLayerFile = null;
var mouseDownElement = null;


function getList(list, id, uxpLabel, title, section, handler, ...options) {

	if (section==null) {
		section = elementForm;
	}

	var value = h("div", { style: { 
		display: Styles.INLINE_BLOCK, 
		position: Styles.RELATIVE, 
		width: getPx(14), 
		height: getPx(12), 
		opacity: 1 } },

		section[list] = h(HTMLConstants.SELECT, { 
			id: id, 
			uxpEditLabel: uxpLabel, 
			uxpQuiet: false, 
			title: title, 
			style: { 
				display: Styles.INLINE_BLOCK, 
				position:Styles.ABSOLUTE, 
				width: "120%", height: "120%", 
				cursor: "pointer", 
				overflow: Styles.HIDDEN,
				paddingTop: getPx(0), 
				backgroundColor: "green",
				opacity: .01, 
				top: "50%", left: "50%", transform: "translate(-90%, -90%)"},
			onchange(e) { handler(e) } }, ...options),

			h("img", {
				src: form.dropdownChevron, 
				title: "", 
				class: "disclosureHover isClickable",
				style: {
					height: "100%", width: "100%", 
					display: Styles.INLINE_BLOCK, 
					position:"absolute", 
					border:"0px solid green", 
					pointerEvents: "none"
			}}));

	return value;
}

let alertDialog =
	 h("dialog", {name:"Alert"},
		h("form", { method:"dialog", style: { width: getPx(380) }, },
		  alertForm.header = h("h2", "Header"),
		  h("label", { class: "row", style: {marginTop: getPx(12)} },
			 alertForm.message = h("span", { }, "Message"),
		  ),
		  h("footer",
			 h("button", { uxpVariant: "cta", type: "submit", onclick(e) { closeDialog(alertDialog) } }, "OK")
		  )
		)
	 )

let notificationDialog =
	 h("dialog", { style: { padding: getPx(10), margin: getPx(10) } },
	 notificationForm.form = h("form", { method:"dialog", style: { width: getPx(360), height: getPx(24), padding: getPx(0), margin: getPx(0) } },
		  h("label", { class: "row", style: { height: getPx(22), border: form.borderWeight + "px solid red", alignItems: "center", fontSize:getPx(11) }},
			 h("span", { }, "Export complete..."),
			 h("span", { style: { flex: "1"} }),
			 
			 notificationForm.exportErrorsIcon = h("img", { src: form.notFoundAltIconPath, height: getPx(form.iconWidth-3), width: getPx(form.iconWidth-3), title: "Export errors occured",
			 style: {marginLeft: getPx(5), marginRight: getPx(10)}}, ""),
			 notificationForm.verifyDiffIcon = h("img", { src: form.verifyEllipsisIconPath, height: getPx(form.iconWidth), width: getPx(form.iconWidth), title: "Passed verification", style: { marginRight: getPx(8)}}, ""),
			 notificationForm.openDiffLink = h("a", { href:"", style: form.smallButtonStyle }, "diff"),
			 notificationForm.copyURLLink = h("a", { href:"", style: form.smallButtonStyle, onclick(e) { copyURLtoClipboard(true, e)} }, "copy url"),
			 notificationForm.openHostLink = h("a", { href:"", style: form.smallButtonStyle }, "host"),
			 notificationForm.openFolderLink = h("a", { href:"", style: form.smallButtonStyle }, "folder"),
			 notificationForm.openRURLLink = h("a", { href:"", style: form.smallButtonStyle, 
				onclick(e) { openURLLocation(); } }, "url"),
			 notificationForm.openURLLink = h("a", { href:"", style: form.smallButtonStyle }, "url"),
			 h("img", { src:"icons/Close Icon.png", height: getPx(form.iconWidth), width: getPx(form.iconWidth), title: "Close notification dialog", 
				style: { cursor:"pointer"},
				onclick(e) { closeNotificationDialog() } }, "")
		  )
		)
	 )

var styleTag = document.createElement("style");
styleTag.innerHTML = `a:hover { text-decoration: underline }`;
notificationForm.form.insertAdjacentElement('beforeend', styleTag);

let helpDialog =
	h("dialog", {name:"Alert"},
		h("form", { method:"dialog", style: { width: getPx(380) } },
			
			h("label", { class: "row", style: { alignItems: "bottom" } },
				h("h2", "Community Support"),
				h("span", { style: { flex:"1" } }, ""),
				supportForm.versionLabel = h("span", { style: { } }, "Version")
			),
			h("label", { class: "row", style: { marginTop: getPx(24), marginLeft: getPx(8) } },
				h("a", { href:"https://discuss.velara3.com", title: "https://discuss.velara3.com", 
					style: {flex:"1", backgroundColor:"transparent", fontSize: getPx(12), fontWeight:"normal", color:"#686868" } }, 
					"Get support at the forums at https://discuss.velara3.com")
			),
			h("footer",
				h("span", { style: { flex:"1" } }, ""),
				h("button", { uxpVariant: "primary", title: "Copy the forum URL to the clipboard", 
					onclick(e){ copyForumURLtoClipboard(true) } }, "Copy URL"),
				h("button", { uxpVariant: "cta", type: "submit", onclick(e) { closeDialog(helpDialog) } }, "OK")
			)
		)
	)

mainForm.messagesForm = 
	h("form", { method:"dialog", class: "column", style: { fontSize: getPx(form.formFontSize), width: getPx(form.mainDialogWidth-100), flex: "1"}, 
		onsubmit(e) { preventClose(e) } },
		
		h(form.RowTagName, { class: "row", style: { alignItems: "center" } },
			mainForm.messagesTitleLabel = h("h2", "Messages"),

			h("span", { style: { flex: "1", marginTop: getPx(6) } }, ""),

		),

		h("hr", { style:{ paddingLeft: getPx(0), marginLeft: getPx(0) } }, ""),

		h(form.RowTagName, { class: "row", style: { border: form.borderWeight + "px solid blue" } },
			mainForm.warningsTextarea = h("textarea", { flex: "1", 
			style: { fontFamily: "monospace", fontSize: getPx(form.formFontSize), height: getPx(400), opacity: 1 }, 
			oninput(e) { warningsTextareaOnInput(e) } } )
		),
		
		h("footer", { class: "row", style: { alignItems: "center", paddingLeft: getPx(0), marginLeft: getPx(0), border: form.borderWeight + "px solid red"} },

			mainForm.messageDescriptionLabel = h("span", { style: { flex: "1", marginTop: getPx(0) } }, ""),

			h("button", { uxpVariant: "primary", 
				onclick(e) { showMainFormOrElementView() },
				onkeydown(e) { preventClose(e) } }, "Back")
		),
	)

moreRoomForm.form = 
	h("form", { method:"dialog", class: "column", style: { fontSize: getPx(form.formFontSize), width: getPx(form.mainDialogWidth)}, 
		onsubmit(e) { preventClose(e) } },
		
		h(form.RowTagName, { class: "row", style: { alignItems: "center" } },
			moreRoomForm.headerLabel = h("h2", "Messages"),

			h("span", { style: { flex: "1", marginTop: getPx(6) } }, ""),
		),

		h(HTMLConstants.HR, { style:{ paddingLeft: getPx(0), marginLeft: getPx(0) } }, ""),

		h(form.RowTagName, { class: "row", style: { flex:1, fontSize: getPx(form.formFontSize), border: form.borderWeight + "px solid blue" } },
			moreRoomForm.messagesTextarea = h("textarea", { id:"messagesTextarea", uxpEditLabel:"Edit value", 
				placeholder: "Enter more details here", 
				style: { flex:"1", opacity: 1, fontFamily: "monospace", minWidth: getPx(10), height: "100%" }, 
				onkeydown(e) { moreRoomForm.messagesTextareaOnInput(e) } } )
		),
		
		h("footer", { class: "row", style: { paddingLeft: getPx(0), marginLeft: getPx(0), marginTop: getPx(12), alignItems:"center", border: form.borderWeight + "px solid red"} },

			moreRoomForm.defaultButton = h("a", { id:"defaultButton", uxpEditLabel:"Set to default", uxpVariant: "primary", 
				style: form.smallButtonStyle, class:"smallButtonStyle",
				onclick(e) { moreRoomForm.defaultButtonHandler() },
				onkeydown(e) { preventClose(e) } }, "Default"),

			moreRoomForm.resetButton = h("a", { id:"resetButton", uxpEditLabel:"Reset value", uxpVariant: "primary", 
				style: form.smallButtonStyle,
				onclick(e) { moreRoomForm.resetButtonHandler() },
				onkeydown(e) { preventClose(e) } }, "Reset"),

			moreRoomForm.descriptionLabel = h("span", { 
				style: { flex: "1", marginTop: getPx(0), paddingLeft: getPx(6)} }, ""),

			moreRoomForm.cancelButton = h("a", { id:"cancelButton", uxpEditLabel:"Cancel value", uxpVariant: "primary", 
				style: form.smallButtonStyle,
				onclick(e) { moreRoomForm.cancelButtonHandler() },
				onkeydown(e) { preventClose(e) } }, "Cancel"),

			moreRoomForm.okButton = h("a", { id:"okButton", uxpEditLabel:"Edit value", uxpVariant: "primary", 
				style: form.smallButtonStyle,
				onclick(e) { moreRoomForm.okButtonHandler() },
				onkeydown(e) { preventClose(e) } }, "OK"),

			moreRoomForm.backButton = h("a", { id:"backButton", uxpEditLabel:"Back button", uxpVariant: "primary", 
				style: form.smallButtonStyle,
				onclick(e) { moreRoomForm.backButtonHandler() },
				onkeydown(e) { preventClose(e) } }, "Back")
		),
	)


hostForm.form = 
	h("form", { method:"dialog", class: "column", style: { fontSize: getPx(form.formFontSize), width: getPx(form.mainDialogWidth)}, 
		onsubmit(e) { preventClose(e) } },
		
		h(form.RowTagName, { class: "row", style: { alignItems: "center" } },
			hostForm.headerLabel = h("h2", "Upload to Host"),

			h("span", { style: { flex: "1", marginTop: getPx(6) } }, ""),
		),

		h(HTMLConstants.HR, { style:{ paddingLeft: getPx(0), marginLeft: getPx(0) } }, ""),

		h(form.RowTagName, { class: "row", style: { display: "flex", height: getPx(form.mainDialogRowHeight), alignItems: "center" } },
			h("span", { style: { width: getPx(form.hostFormLabelWidth) } }, 
			"Domain"),
			h("span", { style: { marginLeft:getPx(8), cursor: Styles.POINTER }, onclick(e) { domainTypeChangeHandler(e) } }, 
			"Default"),
			hostForm.defaultDomainTypeRadio = h(HTMLConstants.INPUT, { id: "defaultDomainType", 
				uxpEditLabel: "Edit Domain", uxpQuiet: true, title: "Edit Domain Type", name: "domainType", type:"radio",
				style: { marginRight:getPx(5)}, checked: true,
					onchange(e) { domainTypeChangeHandler(e) } }, "Default"),
			h("span", { style: {marginLeft:getPx(8), cursor: Styles.POINTER}, onclick(e) { domainTypeChangeHandler(e) } }, 
			"Custom"),
			hostForm.customDomainTypeRadio = h(HTMLConstants.INPUT, { id: "customDomainType", 
				uxpEditLabel: "Edit Domain", uxpQuiet: true, title: "Edit Domain Type", name: "domainType", type:"radio",
				style: { marginLeft:getPx(8), marginRight:0 },
					onchange(e) { domainTypeChangeHandler(e) } }, "Custom"),
			h("span", { style: { flex: 1} }, ""),
		),

		h(HTMLConstants.HR, { style:{ paddingLeft: getPx(0), marginLeft: getPx(0) } }, ""),

		h(form.RowTagName, { class: "row", style: { display: "flex", height: getPx(form.mainDialogRowHeight), alignItems: "center" } },
			h("span", { style: { width: getPx(form.hostFormLabelWidth) } }, 
			"Username"),
			hostForm.usernameInput = h("input", { uxpQuiet: true, placeholder: "username", value: "",
				style: { maxWidth: getPx(form.hostFormLabelWidth*1.5), width: getPx(form.hostFormLabelWidth) }, 
				title: "", 
				onchange(e) { updateArtboardModelAndSave(e) } }),
			hostForm.usernameLabel = h("span", { style: { marginLeft: getPx(8), cursor: Styles.POINTER } }, 
			""),
			h("span", { style: { flex: 1 } }, ""),
		),

		h(form.RowTagName, { class: "row", style: { display: "flex", height: getPx(form.mainDialogRowHeight), alignItems: "center" } },
			h("span", { style: { width: getPx(form.hostFormLabelWidth) } }, 
			"Password"),
			hostForm.passwordInput = h("input", { uxpQuiet: true, placeholder: "password", type: "password", value: "",
				style: { maxWidth: getPx(form.hostFormLabelWidth*2), width: getPx(form.hostFormLabelWidth) }, 
				title: "", 
				onchange(e) { updateArtboardModelAndSave(e) },
				onkeyup(e) { onHostFormKeypress(e) },
				onkeydown(e) { onHostFormKeypress(e) }}),
			h("span", { style: { flex:1 } }, "")
		),

		h(form.RowTagName, { class: "row", style: { display: "none", height: getPx(form.mainDialogRowHeight), alignItems: "center" } },
			h("span", { style: { width: getPx(form.hostFormLabelWidth) } }, 
			"Site name"),
			hostForm.siteNameLabel = h("a", { style: { marginLeft: getPx(8), cursor: Styles.POINTER } }, ""),
		),

		h(form.RowTagName, { class: "row", style: { display: "none", height: getPx(form.mainDialogRowHeight), alignItems: "center" } },
			h("span", { style: { width: getPx(form.hostFormLabelWidth) } }, 
			"User"),
			hostForm.usernameLabel = h("a", { style: { marginLeft: getPx(8), cursor: Styles.POINTER } }, "")
		),

		h(form.RowTagName, { class: "row", style: { display: Styles.NONE, height: getPx(form.mainDialogRowHeight), alignItems: "center" } },
			h("span", { style: { width: getPx(form.hostFormLabelWidth) } }, 
			"Artboard"),
			hostForm.postLinkInput = h("input", { uxpQuiet: true, placeholder: "Existing ID. Example: 25", 
				style: { width: getPx(form.mainDialogLabelWidth/1.20), display:"none"}, value:"",
				title: "", 
				onchange(e) { updateArtboardModelAndSave(e) } }),
			hostForm.linkToPostButton = h("a", { id:"linkArtboardButton", uxpEditLabel:"Link Artboard", 
				style:{ marginLeft: getPx(8), cursor: Styles.POINTER }, class: "smallButtonStyle", href: "https://",
				async onclick(e) { await linkArtboard(e) },
				onkeydown(e) { preventClose(e) } },
				"Link Artboard"),
			hostForm.removeCloudLink = h("a", { style: { marginLeft: getPx(8), cursor: Styles.POINTER, display: Styles.BLOCK,
				class: "smallButtonStyle" }, href: "https://",
				onclick(e) { unlinkArtboard(e) }, }, 
				"Unlink"),
			hostForm.cloudLink = h("a", { style: { marginLeft: getPx(8), cursor: Styles.POINTER, display: Styles.BLOCK,
				class: "smallButtonStyle" } }, 
				"Cloud Link"),
			hostForm.uploadLink = h("a", { style: { marginLeft: getPx(8), cursor: Styles.POINTER, display: Styles.BLOCK,
				class: "smallButtonStyle" }, href: "https://",
				onclick(e) { uploadArtboard(e) } }, 
				"Upload"),
			hostForm.linkLabel = h("span", { style: { textAlign:"left", marginLeft: getPx(6),
				width: getPx(form.mainDialogLabelWidth), flex: "1" } }, "")
		),

		h(form.RowTagName, { class: "row", style: { display: Styles.NONE, height: getPx(form.mainDialogRowHeight), alignItems: "center" } },
			h("span", { style: { width: getPx(form.hostFormLabelWidth) } }, 
			"Upload on Export"),
			hostForm.uploadOnExportCheckbox = h("input", { uxpQuiet: true, type: "checkbox", checked: false, 
				style: { marginRight: getPx(10), cursor: form.cursor },
				title: "Upload on export", 
				onchange(e) { uploadOnExportChange(e) } })
		),

		h(form.RowTagName, { class: "row", style: { display: "flex", height: getPx(form.mainDialogRowHeight), alignItems: "center" } },
			h("span", { style: { width: getPx(form.hostFormLabelWidth) } }, ""),
			hostForm.loginButton = h("button", { id:"loginButton", uxpEditLabel:"Login", uxpVariant: "primary", 
				style: {marginLeft: getPx(0)}, class:"smallButtonStyle", 
				async onclick(e) { await loginToHost(e, false) }}, 
			"Login"),
			hostForm.logoutButton = h("button", { id:"logoutButton", uxpEditLabel:"Logout", uxpVariant: "primary", 
				style: {display: "none"}, class:"smallButtonStyle", 
				onclick(e) { logoutOfHost(e) }}, 
			"Logout"),
			hostForm.loggingInLabel = h("a", { style: { marginLeft: getPx(0), cursor: Styles.POINTER,
				onclick(e) { logoutOfHost(e) } } }, ""),
			hostForm.registerButton = h("a", { id:"registerLink", uxpEditLabel:"Register", uxpVariant: "primary", 
				style: {display: "none"}, class:"smallButtonStyle", href:"https://www.velara3.com/a/wp-signup.php" }, 
			"Register"),
		),

		h(HTMLConstants.HR, { style:{ paddingLeft: getPx(0), marginLeft: getPx(0) } }, ""),

		h(form.RowTagName, { class: "row", style: { display: Styles.NONE, height: getPx(form.mainDialogRowHeight), alignItems: "center" } },
			h("span", { style: { width: getPx(form.hostFormLabelWidth) } }, 
			"URL"),
			hostForm.urlInput = h("input", { uxpQuiet: true, placeholder: "Example: https://www.example.com/wp-json", 
				style: { flex: 1 }, value:"",
				title: "", 
				onchange(e) { updateArtboardModelAndSave(e) } }),
			h("span", { style: { } }, "")
		),
		
		h(form.RowTagName, { class: "row", style: { display: Styles.NONE, height: getPx(form.mainDialogRowHeight), alignItems: "center" } },
			h("span", { style: { width: getPx(form.hostFormLabelWidth) } }, 
			"Route"),
			hostForm.endPointInput = h("input", { uxpQuiet: true, placeholder: "Example: /wp/v2/posts/", 
				style: { width: getPx(form.mainDialogLabelWidth/1.5) }, value:"",
				title: "", 
				onchange(e) { updateArtboardModelAndSave(e) } })
		),

		h(form.RowTagName, { class: "row", style: { display: Styles.NONE, height: getPx(form.mainDialogRowHeight), marginTop: getPx(8), alignItems: "center" } },
			h("span", { style: { width: getPx(form.hostFormLabelWidth) } }, 
			"Show log info"),
			hostForm.debugCheckbox = h("input", { uxpQuiet: true, type: "checkbox", checked: false, 
				title: "Show more results from calls", 
				style: { marginRight: getPx(10), cursor: form.cursor },
				onchange(e) { showHostTextarea() }  }, ""),
			h("span", { style: { flex: "1" } }, 
				""),
			hostForm.clearFormButton = h("a", { id:"clearFormButton", uxpEditLabel:"Clear Form", uxpVariant: "primary", 
				style: form.smallButtonStyle, class:"smallButtonStyle",
				onclick(e) { clearHostForm(e) },
				onkeydown(e) { preventClose(e) } }, 
			"Clear Form"),
		),

		h(form.RowTagName, { class: "row", style: { display: "flex", height: getPx(form.mainDialogRowHeight), alignItems: "center" } },
			h("span", { style: { width: getPx(form.hostFormLabelWidth) } }, 
			""),
		),

		h(form.RowTagName, { class: "row", style: { display: Styles.NONE, height: getPx(form.mainDialogRowHeight), alignItems: "center" } },
			h("span", { style: { width: getPx(form.hostFormLabelWidth) } }, 
			""),
			hostForm.clearConsoleButton = h("a", { id:"clearFormButton", uxpEditLabel:"Clear Console", uxpVariant: "primary", 
				style: form.smallButtonStyle, class:"smallButtonStyle",
				onclick(e) { clearHostConsole(e) },
				onkeydown(e) { preventClose(e) } }, 
			"Clear Console"),
				h("span", { style: { flex: "1" } }, ""),
			hostForm.serverVerifyIcon = h("img", { src: form.verifyEllipsisIconPath, height: getPx(form.iconWidth), width: getPx(form.iconWidth),  
				style: {display:"none", marginRight: getPx(8)},
				title: "",}, ""),
			hostForm.testURLButton = h("a", { id:"testButton", uxpEditLabel:"Test URL", uxpVariant: "primary", 
				style: form.smallButtonStyle, class:"smallButtonStyle",
				onclick(e) { testHostURL(e) },
				onkeydown(e) { preventClose(e) } }, 
			"Test URL"),
			hostForm.testAuthButton = h("a", { id:"uploadButton", uxpEditLabel:"Test Auth", uxpVariant: "primary", 
				style: form.smallButtonStyle, class:"smallButtonStyle",
				onclick(e) { uploadToHostURL(e, true, true) },
				onkeydown(e) { preventClose(e) } }, 
			"Test Auth"),
			hostForm.uploadButton = h("a", { id:"uploadButton", uxpEditLabel:"Test Upload", uxpVariant: "primary", 
				style: form.smallButtonStyle, class:"smallButtonStyle",
				onclick(e) { uploadToHostURL(e, true) },
				onkeydown(e) { preventClose(e) } }, 
			"Test Upload"),
		),

		h(form.RowTagName, { class: "row", style: { display: Styles.NONE, height: getPx(form.mainDialogRowHeight), alignItems: "center" } },
			h("span", { style: { width: getPx(form.hostFormLabelWidth) } }, 
			""),
			hostForm.messagesLabel = h("span", { style: { textAlign:"left", marginLeft: getPx(6),
				width: getPx(form.mainDialogLabelWidth), flex: "1" } }, "")
		),

		h(form.RowTagName, { class: "row", style: { flex:1, fontSize: getPx(form.formFontSize), border: form.borderWeight + "px solid blue" } },
			h("span", { style: { width: getPx(form.hostFormLabelWidth) } }, 
			""),
			hostForm.resultsTextarea = h("textarea", { style: { flex:"1", opacity: 1, fontFamily: "monospace", 
				minWidth: getPx(10), height: "100%", display: Styles.NONE } } )
		),

		h(HTMLConstants.HR, { style:{ paddingLeft: getPx(0), marginLeft: getPx(0) } }, ""),


		h("footer", { class: "row", style: { paddingLeft: getPx(0), marginLeft: getPx(0), marginTop: getPx(12), alignItems:"center", border: form.borderWeight + "px solid red"} },

			hostForm.descriptionLabel = h("span", { 
				style: { flex: "1", marginTop: getPx(0), paddingLeft: getPx(6)} }, ""),

			hostForm.cancelButton = h("button", { id:"cancelButton", uxpEditLabel:"Cancel value", uxpVariant: "primary", 
				style: {display: Styles.NONE },
				onclick(e) { hostForm.cancelButtonHandler() },
				onkeydown(e) { preventClose(e) } }, 
			"Cancel"),

			hostForm.okButton = h("button", { id:"okButton", uxpEditLabel:"Edit value", uxpVariant: "primary", 
				style: form.smallButtonStyle,
				onclick(e) { hostForm.okButtonHandler() },
				onkeydown(e) { preventClose(e) } }, 
			"OK")
		),
	)

var styleTag = document.createElement("style");
styleTag.innerHTML = `
.smallButtonStyle {
	border:"0px solid #888888",
	paddingLeft:"4px",
	paddingRight:"4px",
	paddingBottom:"0px",
	marginRight:"8px",
	borderRadius: "0";
	opacity:1;
	fontWeight:"normal";
	textAlign:"center";
	cursor:"pointer";
	color:"#686868";
	text-decoration: underline;
}`;
hostForm.form.insertAdjacentElement('beforeend', styleTag);

var styleTag = document.createElement("style");
styleTag.innerHTML = `a:hover { text-decoration: underline }`;
moreRoomForm.form.insertAdjacentElement('beforeend', styleTag);

/*
UNCOMMENT TO LOAD in the Ace Editor
var scriptTag = document.createElement("script");
scriptTag.src = "https://pagecdn.io/lib/ace/1.4.12/ace.js";
scriptTag.src = "ace-src-min-noconflict/ace.js";
scriptTag.type ="text/javascript";
scriptTag.charset ="utf-8";
document.head.insertAdjacentElement('beforeend', scriptTag);

scriptTag = document.createElement("script");
scriptTag.innerHTML = `
try {
	var editor = ace.edit("messagesTextarea");
	editor.setTheme("ace/theme/monokai");
	editor.session.setMode("ace/mode/javascript");
}
catch(e) {
	console.log("e:", e);
}
`;
moreRoomForm.form.insertAdjacentElement('beforeend', scriptTag);
*/

mainForm.mainDialog =
	 h("dialog", {name:"Main", id:"mainDialog", style: { padding: getPx(form.dialogPadding), overflow: "auto" } },

		mainForm.mainForm = h("form", { method:"dialog", style: { fontSize: getPx(form.formFontSize), width: getPx(form.mainDialogWidth)}, 
			onsubmit(e) { preventClose(e)} },

			h(form.RowTagName, { class: "row", style: { alignItems: "center" } },
				mainForm.headerLabel = h("h2", {style: { paddingLeft: getPx(0), marginLeft: getPx(0)},
					onclick(e) { headerLabelClick(e) } } ), 

				h("span", { style: { flex: "1", marginTop: getPx(6) } }, ""),

				mainForm.globalArtboardIcon = h("img", { src: form.globalArtboardIconPath, 
					height: getPx(14), width: getPx(14), 
					style: { marginTop: getPx(10), cursor: "pointer"},
					onclick(e) { showSelectedArtboardsInMessages() } }, ""),

				mainForm.artboardPreviewIcon = h("img", { src: form.artboardIconPath, height: getPx(16), 
					style: { marginTop: getPx(7), marginRight: getPx(4), outline: "1px solid #686868" },
					onclick(e) { } }, ""),

				mainForm.nameLabel = h("h2", { style: { marginLeft: getPx(5), marginTop: getPx(10), marginRight: getPx(10) }, 
					onclick(e) { showArtboardModelPreferencesInTextArea() } }, ""),

				mainForm.artboardIcon = h("img", { src: form.artboardIconPath, height: getPx(form.iconWidth), width: getPx(form.iconWidth), 
					style: { marginTop: getPx(7), cursor: "pointer"},
					onclick(e) { showSelectedArtboardsInMessages() } }, ""),

				mainForm.previousArtboardIcon = h("img", { src:"icons/Previous Icon.png", height: getPx(form.iconWidth), width: getPx(form.iconWidth), title: "Previous artboard", 
					style: { display:"block", marginTop: getPx(8), marginRight: getPx(7), cursor:"pointer"},
					async onclick(e) { await previousArtboard() } }, ""),
				mainForm.nextArtboardIcon = h("img", { src:"icons/Next Icon.png", height: getPx(form.iconWidth), width: getPx(form.iconWidth), title: "Next artboard", 
					style: { display:"block", marginTop: getPx(8), marginRight: getPx(10), cursor:"pointer"},
					async onclick(e) { await nextArtboard() } }, ""),
			),

		  	h("hr", { style:{ paddingLeft: getPx(0), marginLeft: getPx(0) } },""),

		/********************** MAIN FORM  **********************/

		/********************** SCREEN CONTAINER SECTION  **********************/
		mainForm.screenContainer = h(form.RowTagName, { class: "column", style: { border: "0px solid black" } },

			/********************** EXPORT SCREEN ART  **********************/
			mainForm.basicScreen = h(form.RowTagName, { class: "column", 
		 		style: { display:"none", width: "100%", justifyContent: "space-between", border: "0px solid black" } },

				h(form.RowTagName, { class: "row", style: { height: getPx(form.mainDialogRowHeight), alignItems:"center" } },
					h("span", { style: { } }, ""),
					h("span", { style: { flex:"1", textAlign: "center"} }, ""),
					h("span", { style: { } }, ""),
			  	),

				h(form.RowTagName, { class: "row", style: { flex: 1, alignItems:"center", justifyContent: "space-between" } },
					h("img", { src: form.exportImage, width: getPx(220), title: "", 
						style: { },
						onclick(e) { } }, ""),
					h("img", { src: form.exportImageArrow, width: getPx(120), title: "Export the artboard", 
						style: { cursor: form.cursor}, class: "isClickable",
						async onclick(e) { await submitMainForm(e)} }, ""),
					h("img", { src: form.exportImage2, width: getPx(220), title: "Choose the export folder", 
						style: { cursor: form.cursor}, class: "isClickable",
						onclick(e) { browseForExportFolder() } }, ""),
				),

				h(form.RowTagName, { class: "row", style: { height: getPx(form.mainDialogRowHeight), alignItems:"center" } },
					h("a", { style: { } }, ""),
					h("span", { style: { flex:"1", textAlign: "center"} }, ""),
					h("a", { href:"https://www.velara3.com/Web_Export.html", style: { marginRight: getPx(8)} }, "Click to purchase advanced license"),
			  	),
		 	),
			
		 /********************** ADVANCED SECTION  **********************/
		 mainForm.advancedScreen = h(form.RowTagName, { class: "column", style: {visibility:Styles.HIDDEN, border: "0px solid black" } },
			
		   /********************** PAGE NAME AND TITLE  **********************/
		   h(form.RowTagName, { class: "row", style: { marginTop: getPx(6), height: getPx(form.mainDialogRowHeight), alignItems:"center" } },
				h("span", { style: { width: getPx(form.mainDialogLabelWidth) } }, 
				"Name"),
				mainForm.pageNameInput = h("input", { uxpQuiet: true, placeholder: "File name (optional)", 
					style: { width: getPx(form.mainDialogLabelWidth2) }, title: "The file name of the document", 
					onchange(e) { updateArtboardModelAndSave(e) }  } ),
				mainForm.pageFolderInput = h("input", { uxpQuiet: true, placeholder: "Subdirectory", 
					style: {  width: getPx(form.mainDialogLabelWidth2) }, title: "Subdirectory in export folder (optional)", 
					onchange(e) { updateArtboardModelAndSave(e) } } ),
				mainForm.titleInput = h("input", { uxpQuiet: true, placeholder: "Page title (optional)", 
					style: { flex:"1" }, title: "The title of the document", 
					onchange(e) { updateArtboardModelAndSave(e) }  } ),
				h("span", { style: { flex: 1} },
					""),
				mainForm.templateIcon = h("img", { src: form.templateIconPath, class:"imageHover", width: getPx(form.iconWidth), title: "Set page template", 
					style: { marginBottom: getPx(3), marginRight: getPx(7), cursor: form.cursor},
					onclick(e) { templateIconHandler() } }, ""),
				mainForm.expectedHTMLIcon = h("img", { src: form.verifyIconPath, class:"imageHover", height: getPx(form.iconWidth), width: getPx(form.iconWidth), title: "Set expected output", 
					style: { marginTop: getPx(7), cursor: form.cursor},
					onclick(e) { expectedOutputIconHandler() } }, ""),
		   ),

			h(form.RowTagName, { class: "row", style: { display: "flex", height: getPx(form.mainDialogRowHeight), alignItems: "center" } },
				h("span", { style: { width: getPx(form.mainDialogLabelWidth) } }, 
				"Stylesheet"),
				mainForm.stylesheetNameInput = h("input", { uxpQuiet: true, placeholder: "Stylesheet name (optional)", 
					style: { width: getPx(form.mainDialogLabelWidth2) }, 
					title: "The name of the stylesheet when exporting an external stylesheet (optional)", 
					onchange(e) { updateArtboardModelAndSave(e) } }),
				mainForm.stylesheetFolderInput = h("input", { uxpQuiet: true, placeholder: "Subdirectory", 
					style: { width: getPx(form.mainDialogLabelWidth2) }, title: "Subdirectory in export folder (optional)", 
					onchange(e) { updateArtboardModelAndSave(e) } } ),
				h("span", { style: { marginRight: getPx(2), opacity: 1, minWidth: getPx(100), color: "#555555", textAlign: "right"}, 
				onclick(e) { mainFormCheckboxLabelClickHandler(mainForm.externalStylesheetCheckbox) } },
				"External stylesheet"),
				mainForm.externalStylesheetCheckbox = h("input", { uxpQuiet: true, type: "checkbox", checked: false, 
					title: "Export styles to external stylesheet", 
					style: { border: form.borderWeight + "px solid blue", marginRight: getPx(10), cursor: form.cursor },
					onchange(e) { updateArtboardModelAndSave(e) }  }, ""),
				h("span", { style: { flex: 1} },
					""),
				mainForm.styleTemplateIcon = h("img", { src: form.styleTemplateIconPath, class:"imageHover", width: getPx(form.iconWidth), title: "Set stylesheet template", 
					style: { marginBottom: getPx(3), marginRight: getPx(7), cursor: form.cursor},
					onclick(e) { stylesheetTemplateIconHandler(false) } }, ""),
				mainForm.expectedStyleIcon = h("img", { src: form.verifyIconPath, class:"imageHover", height: getPx(form.iconWidth), width: getPx(form.iconWidth), title: "Set expected CSS output", 
					style: { marginTop: getPx(0), cursor: form.cursor },
					onclick(e) { expectedCSSOutputIconHandler() } }, ""),
			),

			h(form.RowTagName, { class: "row", style: { display: "flex", height: getPx(form.mainDialogRowHeight), alignItems: "center" } },
				h("span", { style: { width: getPx(form.mainDialogLabelWidth) } }, 
				"Script"),
				mainForm.scriptNameInput = h("input", { uxpQuiet: true, placeholder: "Script name (optional)", 
					style: { width: getPx(form.mainDialogLabelWidth2) }, 
					title: "The file name of the script when exporting an external script (optional)", 
					onchange(e) { updateArtboardModelAndSave(e) } }),
				mainForm.scriptFolderInput = h("input", { uxpQuiet: true, placeholder: "Subdirectory", 
					style: { width: getPx(form.mainDialogLabelWidth2) }, title: "Subdirectory in export folder (optional)", 
					onchange(e) { updateArtboardModelAndSave(e) } } ),
				h("span", { style: { marginRight: getPx(2), color: "#555555", minWidth: getPx(100), textAlign: "left"}, 
				onclick(e) { mainFormCheckboxLabelClickHandler(mainForm.externalScriptCheckbox) } },
				"External script"),
				mainForm.externalScriptCheckbox = h("input", { uxpQuiet: true, type: "checkbox", checked: false, 
					title: "Export scripts to an external script", 
					style: { border: form.borderWeight + "px solid blue", marginRight: getPx(10), opacity: 1, cursor: form.cursor },
					onchange(e) { updateArtboardModelAndSave(e) }  }, ""),
				h("span", { style: { flex: 1} },
					""),
				mainForm.scriptTemplateIcon = h("img", { src: form.scriptTemplateIconPath, class:"imageHover", width: getPx(form.iconWidth), title: "Set script template", 
					style: { marginBottom: getPx(3), marginRight: getPx(7), cursor: form.cursor},
					onclick(e) { scriptTemplateIconHandler() } }, ""),
				mainForm.expectedScriptIcon = h("img", { src: form.verifyIconPath, class:"imageHover", height: getPx(form.iconWidth), width: getPx(form.iconWidth), title: "Set expected script output", 
				style: { marginTop: getPx(0), cursor: form.cursor},
				onclick(e) { expectedScriptOutputIconHandler() } }, ""),
			),

		   /********************** IMAGES  **********************/
		   h(form.RowTagName, { class: "row", style: { height: getPx(form.mainDialogRowHeight), alignItems:"center" } },
				h("span", { style: { width: getPx(form.mainDialogLabelWidth) } }, 
				"Images"),
				mainForm.imagesPrefixInput = h("input", { uxpQuiet: true, placeholder: "Path prefix", 
					style: { width: getPx(form.mainDialogLabelWidth2) }, title: "Text to place in front of image path", 
					onchange(e) { updateArtboardModelAndSave(e) }  } ),
				mainForm.imagesFolderInput = h("input", { uxpQuiet: true, placeholder: "Subdirectory", 
					style: { width: getPx(form.mainDialogLabelWidth2) }, title: "Subdirectory in export folder (optional)", 
					onchange(e) { updateArtboardModelAndSave(e) }  } ),
				h("span", { title: "Embed all artboard images in page", style: { overflow: "visible", whiteSpace: "nowrap", textOverflow: "ellipsis", cursor: form.cursor },
					onclick(e) { embedImagesLabel(e) } }, 
					"Embed"),
				mainForm.embedImagesCheckbox = h("input", { id:"embedImagesCheckbox", uxpEditLabel:"Embed Images", type: "checkbox", checked: false, 
					title: "Embed all artboard images into page", 
					onclick(e) { embedImagesLabel(e) }}),
				mainForm.embedColorLimitLabel = h("span", { 
					title: "Number of colors used in an embedded image", 
					style: { overflow: "visible", whiteSpace: "nowrap", textOverflow: "ellipsis", paddingLeft: getPx(6) } }, 
						"Colors"),
				mainForm.embedColorLimitInput = h("input", { uxpQuiet: true, type: "number", placeholder: "Max", 
					style: { width: getPx(35) }, title: "Number of colors in embedded images. Zero or blank for no limit", 
					onchange(e) { updateArtboardModelAndSave(e) }}),
				h("span", { style: { flex: 1 } },
					""),
				h("span", { style: { overflow: "visible", whiteSpace: "nowrap", textOverflow: "ellipsis" }, 
					onclick(e) { mainFormCheckboxLabelClickHandler(mainForm.image2xCheckbox) } }, 
					"@2x"),
				mainForm.image2xCheckbox = h("input", { id:"image2xCheckbox", uxpEditLabel:"Export 2x image sizes", type: "checkbox", checked: true, title: "Export 2x scaled images (for hi-dpi screens)", 
					onclick(e) { updateArtboardModelAndSave(e) }}),
		   ),

		  /********************** EXPORT FOLDER  **********************/

		  	h(form.RowTagName, { class: "row", style: { height: getPx(form.mainDialogRowHeight), alignItems:"center" } },
				h("span", { style: { width: getPx(form.mainDialogLabelWidth) } }, 
					"Export Folder"),
					mainForm.exportFolderInput = h("input", { required:true, uxpQuiet: true, disabled: false, placeholder: "Folder to export to (required)", 
					style: { width: getPx(430), flex: 1 }, 
					title: "The folder that the web page will be exported to. Required", 
					onclick(e) { browseForExportFolder(e) },
					onchange(e) { updateArtboardModelAndSave(e) },
					onkeyup(e) { onExportFolderKeypress(e) },
					onkeydown(e) { onExportFolderKeypress(e) } }),
				h("img", { src: form.copyURLIconPath, height: getPx(form.iconWidth), width: getPx(form.iconWidth), 
					title: "Copy export folder path to clipboard", class:"imageHover", 
					style: { marginTop: getPx(7), marginRight: getPx(7), cursor: form.cursor},
					onclick(e) { copyExportFolderURLtoClipboard() } }, ""),
				h("img", { src: form.folderIconPath, height: getPx(form.iconWidth), width: getPx(form.iconWidth), title: "Browse for export folder", 
					style: { marginTop: getPx(7), cursor: form.cursor}, class:"imageHover", 
					onclick(e) { browseForExportFolder() } }, "")
		  	),

		  /********************** SERVER **********************/

		  h(form.RowTagName, { class: "row", 
		  	style: { alignItems:"center", height: getPx(form.mainDialogRowHeight) } },
			h("span", { style: { width: getPx(form.mainDialogLabelWidth) } }, 
			"Server"),
			mainForm.serverInput = h("input", { uxpQuiet: true, placeholder: "Server name (ex http://localhost/ or http://127.0.0.1/)",
				style: { border: form.borderWeight + "px solid blue", flex:1, width: getPx(234) },
				onchange(e) { updateArtboardModelAndSave(e) } } ),
			mainForm.serverVerifyIcon = h("img", { src: form.verifyEllipsisIconPath, height: getPx(form.iconWidth), width: getPx(form.iconWidth),  
				style: {display:"none", marginRight: getPx(8)},
				title: "",}, ""),
			mainForm.serverTestButton = h("img", { src: form.serverIconPath, height: getPx(form.iconWidth), class:"imageHover", 
				style: {cursor:"pointer", marginRight: getPx(7)},
				title: "Verify server exists", onclick(e) { testServerPath(e) }}, ""),
			mainForm.hostButton = h("img", { src: form.hostIconPath, height: getPx(form.iconWidth+1), class:"imageHover", 
				style: {cursor:"pointer"},
				title: "Host options", onclick(e) { showHostOptions(e) }}, ""),
		  ),

		  /********************** STYLES  **********************/

		  h(form.RowTagName, { class: "row", 
		  	style: { alignItems:"center", height: getPx(form.mainDialogRowHeight), display: "none" } },
			h("span", { style: { width: getPx(form.mainDialogLabelWidth) } }, 
			"Styles"),
			mainForm.additionalStylesInput = h("input", { uxpQuiet: true, placeholder:"Styles (optional)",
				style: { border: form.borderWeight + "px solid blue", flex:1, width: getPx(234) },
				onchange(e) { updateArtboardModelAndSave(e) } } ),
			mainForm.subStylesInput = h("input", { uxpQuiet: true, placeholder:"Sub styles (optional)",
				style: { border: form.borderWeight + "px solid blue", flex:1, width: getPx(234), fontFamily: "Courier"},
				onchange(e) { updateArtboardModelAndSave(e) } } )
		  ),

		  /********************** FONTS  **********************/

		  h(form.RowTagName, { class: "row", style: { height: getPx(form.mainDialogRowHeight), alignItems:"center" } },
			 h("span", { style: { width: getPx(form.mainDialogLabelWidth) } }, 
			 "Alternative Fonts"),
			 mainForm.alternativeFontInput = h("input", { uxpQuiet: true, placeholder: "Alternative fonts",
			 	style: { border:"0px solid blue", width: getPx(form.inputWidth+22), flex: 1 }, 
				title: "The name of the font to use if the user does not have the font specified", 
				onchange(e) { updateArtboardModelAndSave(e) } })
		  ),

		  h(form.RowTagName, { class: "row", 
		  style: { display: "none", alignItems:"center", height: getPx(form.mainDialogRowHeight), border: form.borderWeight+ "px solid blue" } },
			h("span", { style: { width: getPx(form.mainDialogLabelWidth), border: form.borderWeight+ "px solid blue" } }, 
			"Size"),
			
			mainForm.widthInput = h("input", { uxpQuiet: true, placeholder: "Width (optional)", 
				style: { width: getPx(form.checkboxLabelWidth + 20), border: form.borderWeight + "px solid blue" },
				title: "Set an alternative page width", 
			onchange(e) { updateArtboardModelAndSave(e) } }),
			h("img", { src: form.closeIconPath, height: getPx(14), width: getPx(14), title: "Reset", 
				style: { display:"none", marginTop: getPx(7)},
				onclick(e) { resetDocumentWidthInput() } }, ""),
			h("span", { style: { width: getPx(form.spacerWidth-10) } }, ""),
			mainForm.heightInput = h("input", { uxpQuiet: true, placeholder: "Height (optional)", 
				style: { width: getPx(form.checkboxLabelWidth + 20) }, 
			 	title: "Set an alternative page height", 
				onchange(e) { updateArtboardModelAndSave(e) }}),
			h("img", { src: form.closeIconPath, height: getPx(14), width: getPx(14), title: "Reset", 
				style: { display:"none", marginTop: getPx(7) },
				onclick(e) { resetDocumentHeightInput() } }, ""),
		  ),

		  /********************** CHECKBOX SECTION  **********************/


		  h(form.RowTagName, { class: "row",  
		  	style: { alignItems:"center", paddingTop: getPx(0), marginTop: getPx(4), border: form.borderWeight + "px solid red" } },
			h("span", { style: { width: getPx(form.labelBeforeCheckboxWidth), border: form.borderWeight + "px solid red" } }, 
			"Scale"),

			mainForm.scaleToFitList = h(HTMLConstants.SELECT, { id: "scaleToFitList", 
				uxpEditLabel: "Edit Scale to Fit", uxpQuiet: true, title: "Edit Scale to fit", 
				style: { width: getPx(form.checkboxLabelWidth+20), marginLeft:0, marginRight:0},
					onchange(e) { scaleToFitListChange(e) } }, 
				h(HTMLConstants.OPTION, { value: {value: "default", label: "Default"} }, "Default"),
				h(HTMLConstants.OPTION, { value: {value: "fit", label: "Scale to fit"} }, "Scale to fit"),
				h(HTMLConstants.OPTION, { value: {value: "width", label: "Scale to width"} }, "Scale to width"),
				h(HTMLConstants.OPTION, { value: {value: "height", label: "Scale to height"} }, "Scale to height")),

			h("span", { style: { width: getPx(form.spacerWidth) } }, ""),
			h("span", { style: { width: getPx(form.checkboxLabelWidth) }, 
			onclick(e) { mainFormCheckboxLabelClickHandler(mainForm.scaleOnResizeCheckbox) } }, 
			"Scale on Resize"),
			mainForm.scaleOnResizeCheckbox = h("input", { type: "checkbox", checked: true, title: "Scale on resize", 
				style: { border: form.borderWeight + "px solid blue" },
				onchange(e) { updateArtboardModelAndSave(e) } }),
			h("span", { style: { flex:"1" } }, ""),
			mainForm.scaleInput = h("input", { uxpQuiet: true, placeholder: "1.0 (optional)", 
				style:{ display:"none", flex: "1" }, title: "The initial scale of the document", 
				onchange(e) { updateArtboardModelAndSave(e) }  }),
			 h("button", { uxpVariant: "primary", 
			 	style: { display:"none" }, 
			 	onclick(e) { resetDocumentScaleInput() }}, "Reset")
		  ),

		  mainForm.scaleScreen = h(form.RowTagName, { class: "column", style: {visibility:Styles.HIDDEN, border: "0px solid black" } },
			h(form.RowTagName, { class: "row", style: { height: getPx(form.mainDialogRowHeight), alignItems:"center", border: form.borderWeight + "px solid red" } },
				h("span", { style: { width: getPx(form.labelBeforeCheckboxWidth) } }, ""),
				h("span", { style: { width: getPx(form.checkboxLabelWidth) }, 
				onclick(e) { mainFormCheckboxLabelClickHandler(mainForm.scaleOnDoubleClickCheckbox) } }, 
				"Scale on double click"),
				mainForm.scaleOnDoubleClickCheckbox = h("input", { type: "checkbox", checked: true, 
					title: "Scale to fit on double click", 
					style: { border: form.borderWeight + "px solid blue" },
					onchange(e) { updateArtboardModelAndSave(e) }  }),
				h("span", { style: { width: getPx(form.spacerWidth) } }, ""),
				h("span", { style: { width: getPx(form.checkboxLabelWidth) }, 
				onclick(e) { mainFormCheckboxLabelClickHandler(mainForm.actualSizeOnDoubleClickCheckbox) } }, 
				"Reset scale on double click"),
				mainForm.actualSizeOnDoubleClickCheckbox = h("input", { type: "checkbox", checked: true, 
					title: "Set to actual size on double click", 
					style: { border: form.borderWeight + "px solid blue" },
					onchange(e) { updateArtboardModelAndSave(e) }  }),
			),

			h(form.RowTagName, { class: "row", style: { height: getPx(form.mainDialogRowHeight), alignItems:"center", border: form.borderWeight + "px solid red" } },
				h("span", { style: { width: getPx(form.labelBeforeCheckboxWidth) } }, ""),
				h("span", { style: { width: getPx(form.checkboxLabelWidth) }, 
				onclick(e) { mainFormCheckboxLabelClickHandler(mainForm.showScaleSliderCheckbox) } }, 
				"Show scale slider"),
				mainForm.showScaleSliderCheckbox = h("input", { type: "checkbox", checked: true, 
					title: "Display a slider on the web page to allow you to scale the page in and out", 
					style: { border: form.borderWeight + "px solid blue" },
					onchange(e) { updateArtboardModelAndSave(e) } }),
				h("span", { style: { width: getPx(form.spacerWidth) } }, ""),
				h("span", { style: { width: getPx(form.checkboxLabelWidth) }, 
				onclick(e) { mainFormCheckboxLabelClickHandler(mainForm.enableScaleUpCheckbox) } }, 
				"Enable scale up"),
				mainForm.enableScaleUpCheckbox = h("input", { type: "checkbox", checked: true, 
					title: "Enable scale up", 
					style: { border: form.borderWeight + "px solid blue" },
					onchange(e) { updateArtboardModelAndSave(e) }  })
			), 
		  ),

		  h(form.RowTagName, { class: "row", style: { height: getPx(form.mainDialogRowHeight), paddingTop: getPx(6), alignItems:"center" } },
			  h("span", { style: { width: getPx(form.labelBeforeCheckboxWidth) } }, 
			  "Options"),
			h("span", { style: { width: getPx(form.checkboxLabelWidth) }, 
			onclick(e) { mainFormCheckboxLabelClickHandler(mainForm.centerHorizontallyCheckbox) } }, 
			"Center Horizontally"),
			 mainForm.centerHorizontallyCheckbox = h("input", { type: "checkbox", checked: true, title: "Center the page horizontally", 
				onchange(e) { updateArtboardModelAndSave(e) } }),
			 h("span", { style: { width: getPx(form.spacerWidth) } }, ""),
			 h("span", { style: { width: getPx(form.checkboxLabelWidth) }, 
			 onclick(e) { mainFormCheckboxLabelClickHandler(mainForm.centerVerticallyCheckbox) } }, 
			 "Center Vertically"),
			 mainForm.centerVerticallyCheckbox = h("input", { type: "checkbox", checked: true, title: "Center the page vertically", 
				onchange(e) { updateArtboardModelAndSave(e) } })
		  ),

		  h(form.RowTagName, { class: "row", style: { height: getPx(form.mainDialogRowHeight), alignItems:"center", border:form.borderWeight + "px solid red" } },
			 h("span", { style: { width: getPx(form.labelBeforeCheckboxWidth) } }, ""),
			 h("span", { style: { width: getPx(form.checkboxLabelWidth) }, 
			 onclick(e) { mainFormCheckboxLabelClickHandler(mainForm.setStylesInlineCheckbox) } }, 
			 "Set styles inline"),
			 mainForm.setStylesInlineCheckbox = h("input", { type: "checkbox", checked: true, 
				title: "Set styles inline inside of the tag markup", 
				style : { border: form.borderWeight + "px solid blue" },
				onchange(e) { updateArtboardModelAndSave(e) } }),
			 h("span", { style: { width: getPx(form.spacerWidth) } }, ""),
			 h("span", { style: { width: getPx(form.checkboxLabelWidth) }, 
			 onclick(e) { mainFormCheckboxLabelClickHandler(mainForm.useClassesToStyleElementsCheckbox) } }, 
			 "Class stylization"),
			 mainForm.useClassesToStyleElementsCheckbox = h("input", { type: "checkbox", checked: true, title: "Set styles by class selector rather than ID selector", 
				onchange(e) { updateArtboardModelAndSave(e) }} )
		  ),

		  h(form.RowTagName, { class: "row", style: { height: getPx(form.mainDialogRowHeight), alignItems:"center" } },
			 h("span", { style: { width: getPx(form.labelBeforeCheckboxWidth) } }, ""),
			 h("span", { style: { width: getPx(form.checkboxLabelWidth) }, 
			 onclick(e) { mainFormCheckboxLabelClickHandler(mainForm.showOutlineCheckbox) } }, 
			 "Outline elements"),
			 mainForm.showOutlineCheckbox = h("input", { type: "checkbox", checked: true, title: "Show a red outline around all page elements", 
				onchange(e) { updateArtboardModelAndSave(e) } }),
			h("span", { style: { width: getPx(form.spacerWidth) } }, ""),
			h("span", { style: { width: getPx(form.checkboxLabelWidth) }, 
			onclick(e) { mainFormCheckboxLabelClickHandler(mainForm.addDataNamesCheckbox) } }, 
			"Add data names"),
			mainForm.addDataNamesCheckbox = h("input", { type: "checkbox", checked: true, title: "Adds the name and types of the layers to the elements", 
				onchange(e) { updateArtboardModelAndSave(e) } })
		  ),

		  h(form.RowTagName, { class: "row", style: { height: getPx(form.mainDialogRowHeight), alignItems:"center", border: form.borderWeight + "px solid red" } },
			h("span", { style: { width: getPx(form.labelBeforeCheckboxWidth) } }, ""),
			h("span", { style: { width: getPx(form.checkboxLabelWidth) }, 
			onclick(e) { mainFormCheckboxLabelClickHandler(mainForm.markupOnlyCheckbox) } }, 
			"Markup only"),
			mainForm.markupOnlyCheckbox = h("input", { type: "checkbox", checked: true, 
				title: "Export only markup", 
				onchange(e) { updateArtboardModelAndSave(e) } }, ""),
			h("span", { style: { width: getPx(form.spacerWidth) } }, ""),
			h("span", { style: { width: getPx(form.checkboxLabelWidth) } , 
			onclick(e) { mainFormCheckboxLabelClickHandler(mainForm.navigateOnKeypressCheckbox) }}, 
			"Keyboard Navigation"),
			mainForm.navigateOnKeypressCheckbox = h("input", { type: "checkbox", checked: true, 
				title: "Add keyboard support for Navigation Controls", 
				onchange(e) { updateArtboardModelAndSave(e) }  }, ""),
			h("span", { style: { flex:"1" } }, ""),
		  ),

		  h(form.RowTagName, { class: "row", style: { height: getPx(form.mainDialogRowHeight), alignItems:"center" } },
			h("span", { style: { width: getPx(form.labelBeforeCheckboxWidth) } }, ""),
			h("span", { style: { width: getPx(form.checkboxLabelWidth) }, 
			onclick(e) { mainFormCheckboxLabelClickHandler(mainForm.imageComparisonCheckbox) }}, 
			"Add image compare"),
			mainForm.imageComparisonCheckbox = h("input", { type: "checkbox", checked: true, title: "Adds an image of the artboard that fades in and out", 
				onchange(e) { updateArtboardModelAndSave(e) } }),
			h("span", { style: { width: getPx(form.spacerWidth) } }, ""),
			h("span", { style: { width: getPx(form.checkboxLabelWidth) }, 
			onclick(e) { mainFormCheckboxLabelClickHandler(mainForm.refreshPageCheckbox) } }, 
			"Auto refresh"),
			mainForm.refreshPageCheckbox = h("input", { type: "checkbox", checked: true, title: "Refresh pages to show changes", 
				onchange(e) { updateArtboardModelAndSave(e) } })
		  ),

		  h(form.RowTagName, { class: "row", style: { height: getPx(form.mainDialogRowHeight), display:"none", paddingTop: getPx(6), alignItems:"center", border: form.borderWeight + "px solid blue" } },
			h("span", { style: { width: getPx(form.mainDialogLabelWidth) } }, 
			"Artboard overflow"),
			mainForm.overflowList = h("select", { uxpQuiet: true, title: "Describes when to show scroll bars when content extends past artboard size", 
				style: { paddingTop: getPx(2), border: form.borderWeight + "px solid blue" },
				onchange(e) { updateArtboardModelAndSave(e) }},
				h(HTMLConstants.OPTION, { value: OverflowOptions.HIDDEN }, "Hidden - No scrollbars"),
				h(HTMLConstants.OPTION, { value: OverflowOptions.VISIBLE }, "Visible - Content can extend past container"),
				h(HTMLConstants.OPTION, { value: OverflowOptions.AUTO }, "Auto - Add Scrollbars if needed"),
				h(HTMLConstants.OPTION, { value: OverflowOptions.ON }, "On - Vertical and Horizontal Scrollbars on"),
				h(HTMLConstants.OPTION, { value: OverflowOptions.HORIZONTAL_ON }, "Horizontal Scrollbars on"),
				h(HTMLConstants.OPTION, { value: OverflowOptions.HORIZONTAL_AUTO }, "Horizontal Scrollbars if needed"),
				h(HTMLConstants.OPTION, { value: OverflowOptions.VERTICAL_ON }, "Vertical Scrollbars on"),
				h(HTMLConstants.OPTION, { value: OverflowOptions.VERTICAL_AUTO }, "Vertical Scrollbars if needed")),
			h("span", { style: {flex:"1" } }, ""),
		  ),

		  mainForm.exportToPagesRow = h(form.RowTagName, { class: "row", 
		  	style: { height: getPx(form.mainDialogRowHeight), alignItems:"center", overflow:"visible", flex: 1 } },
			h("span", { style: { width: getPx(form.mainDialogLabelWidth) } }, 
			"Export"),
			mainForm.artboardSelectionSelect = h("select", { uxpQuiet: true, 
				style:{ alignItems: "center", flex: 1}, title: "Export selected artboard, selected artboards or all artboards",
				onchange(e) { exportListSelectHandler(e) } },
				  h(HTMLConstants.OPTION, { value: XDConstants.SELECTED_ARTBOARD }, "Selected artboard"),
				  h(HTMLConstants.OPTION, { value: XDConstants.SELECTED_ARTBOARDS }, "Selected artboards"),
				  h(HTMLConstants.OPTION, { value: XDConstants.ALL_ARTBOARDS }, "All artboards")),
			mainForm.exportPluralitySelect = h("select", { uxpQuiet: true, 
				style:{ alignItems: "center"}, title: "Export to single page or multiple pages",
				onchange(e) { updateArtboardModelAndSave(e) } },
				  h(HTMLConstants.OPTION, { value: XDConstants.MULTIPAGE }, "Multiple pages"),
				  h(HTMLConstants.OPTION, { value: XDConstants.SINGLE_PAGE_APPLICATION }, "Single page application"),
				  h(HTMLConstants.OPTION, { value: XDConstants.SINGLE_PAGE_NAVIGATION }, "Single page (slideshow with navigation buttons)"),
				  h(HTMLConstants.OPTION, { value: XDConstants.SINGLE_PAGE_MEDIA_QUERY }, "Single page (show by size with media query)")),
			mainForm.globalArtboardLabel = h("span", { title: "(Deprecated: do not use)",
				style: {width: getPx(form.checkboxLabelWidth), marginRight: "4px", marginLeft: "auto", marginBottom: "1px" } }, 
				"Global"),
			mainForm.globalArtboardCheckbox = h("input", { type: "checkbox", checked: true, 
				title: "Make this artboard hold global project settings (Deprecated: do not use)", style: {marginRight: "9px"},
				onchange(e) { updateArtboardModelAndSave(e) }  }, "")
		  ),
		 ),

		  /********************** END ADVANCED SECTION  **********************/

		  h("hr", { style: { height: getPx(1), marginLeft: getPx(0)}}, ""),

		  mainForm.exportSelectionTypeRow = h(form.RowTagName, { class: "row", style: { height: getPx(form.mainDialogRowHeight), display:"none", alignItems:"center" } },
			 h("span", { style: { width: getPx(form.mainDialogLabelWidth) } }, "Show artboards by"),
			 mainForm.exportControlsSelect = h("select", { uxpQuiet: true, disabled: false, 
			 	style:{ alignItems:"center" }, title: "How to show artboards",
			 onchange(e) { updateArtboardModelAndSave(e) } },
				h(HTMLConstants.OPTION, { value: XDConstants.MEDIA_QUERY }, "Media Query"),
				h(HTMLConstants.OPTION, { value: XDConstants.NAVIGATION_CONTROLS }, "Navigation Controls")),
			h("span", { style: { flex:"1" } }, "")
		  ),

			/** EXPORT LINKS */
		  mainForm.linksRow = h(form.RowTagName, { class: "row", style: { alignItems:"center", height: getPx(18)} },
		  	 mainForm.exportErrorsIcon = h("img", { src: form.notFoundAltIconPath, height: getPx(form.iconWidth-3), width: getPx(form.iconWidth-3), title: "Export errors occured"}, ""),
			 mainForm.messagesLabel = h("a", { style: form.buttonStyle, title: "Click to display messages in the console",
				 onclick(e) { messageLabelClickHandler(e) } }, ""),
			 mainForm.verifyDiffIcon = h("img", { src: form.verifyEllipsisIconPath, height: getPx(form.iconWidth), width: getPx(form.iconWidth), title: "Passed expected output verification"}, ""),
			 mainForm.errorLabel = h("span", { style: {} }, ""),
			 mainForm.exportLabel = h("span", {
				style: { flex: "1" , border: form.borderWeight + "px solid red", textAlign: "center", marginTop: getPx(0), top: getPx(0) } }, 
				"Press enter to export"),
			 mainForm.diffLink = h("a", { href:"", style: form.buttonStyle }, "diff"),
			 mainForm.copyURLLink = h("a", { href:"", style: form.buttonStyle, onclick(e) { copyURLtoClipboard(true, e)}}, "copy url"),
			 mainForm.openFolderLink = h("a", { href:"", style: form.buttonStyle }, "folder"),
			 mainForm.openHostLink = h("a", { href:"", style: form.buttonStyle }, "server"),
			 mainForm.openRURLLink = h("a", { href:"", style: form.buttonStyle }, "url"),
			 mainForm.openURLLink = h("a", { href:"", style: form.buttonStyle }, "url"),
			 mainForm.uploadLink = h("a", { href:"", style: form.buttonStyle, 
			 	onclick(e) { uploadArtboard(e)} }, 
			 "upload"),
		  ),

		  h("hr", { style: { height: getPx(1), marginLeft: getPx(0) } }, ""),


		 h("footer", { class: "row", style: { padding: getPx(8), margin: getPx(0), paddingLeft: getPx(0), marginLeft: getPx(0), 
				alignItems: "center"} },

			mainForm.helpButton = h("a", { style: form.smallButtonStyle, title: "Open the help documentation", 
				onclick(e) { openDocumentation() } }, "Help"),
			mainForm.switchScreenButton = h("a", { style: form.smallButtonStyle,
					onclick(e) { switchToMainScreen() } }, "Advanced"),
			mainForm.resetArtboardButton = h("a", { title: "Reset artboard options", 
				style: form.smallButtonStyle,
				onclick(e) { resetArtboardModel2()} }, "Reset"),
			mainForm.copyPageButton = h("a", { style: form.smallButtonStyle, title: "Copy the full web page to the clipboard", 
				onclick(e) { copyPageToClipboard(false, e) } }, "Copy Page"),
			mainForm.copyMarkupButton = h("a", { style: form.smallButtonStyle, title: "Copy the web page markup to the clipboard", 
				onclick(e) { copyMarkupToClipboard(false, e) } }, "Copy Markup"),
			mainForm.copyCSSButton = h("a", { style: form.smallButtonStyle, title: "Copy the web page styles to the clipboard", 
				onclick(e) { copyCSStoClipboard(false, e)} }, "Copy CSS"),
			h("span", { style: { flex:1 } }, ""),
			h("button", { uxpVariant: "cta", type: "submit", title:"Export button makes form key events works",
				style: {width: 0, height: 0, visibility: "hidden"},
				async onclick(e) { await submitMainForm(e); } }, "Export"),
			mainForm.cancelButton = h("button", { uxpQuiet: false, uxpVariant: "primary",
				onclick(e) { cancelMainForm() } }, "Close"),
			mainForm.submitButton = h("button", { uxpQuiet: false, type: "submit", uxpVariant: "primary",
				async onclick(e) { await submitMainForm(e); } }, "Export"),
		 )
		)
	  ) /** screen container */
	)

/********************** ELEMENT OPTIONS  **********************/

function createElementDialogOrPanel(isPanel = false, showLabelsInPanel = false) {
	var dialogWidthNoPx = isPanel ? elementForm.elementPanelWidth : elementForm.elementDialogWidth + "px";
	var formWidthNoPx = isPanel ? elementForm.elementPanelWidth : elementForm.elementDialogWidth-68 + "px";
	var labelWidth = isPanel ? elementForm.panelLabelWidth : elementForm.labelWidth;
	var labelBeforeCheckboxesWidth = isPanel ? elementForm.panelLabelWidth : elementForm.labelBeforeCheckboxWidth;
	var labelBeforeCheckboxesMargin = isPanel ? 8 : 0;
	var checkboxLabelWidth = isPanel ? 95 : elementForm.labelBeforeCheckboxWidth;
	var spacerWidth = isPanel ? elementForm.panelCheckboxesSpacerWidth : elementForm.elementCheckboxesSpacerWidth;
	var margin = isPanel ? 0 : 0;
	var displayed = isPanel ? "none" : "flex";
	var formName = isPanel ? "Element Panel" : "Element options";
	var panelFooterDisplay = isPanel ? "flex" : "none";
	var inputWidth = 20;
	var listMinWidth = 40;
	var dropdownIconWidth = 12;
	var dialogPadding = isPanel ? form.elementPanelPadding : form.dialogPadding;
	var checkboxSpacerStyles = isPanel ? {flex: "1", width: getPx(spacerWidth) } : {width: getPx(spacerWidth)};
	var elementType = isPanel ? "form" : "form";
	var displayOnPanel = isPanel ? "block" : "none";
	var displayOnPanelFlex = isPanel ? "flex" : "none";
	var displayOnDialog = isPanel ? "none" : "block";
	var displayOnDialogFlex = isPanel ? "none" : "flex";

	if (isPanel) {
		if (showLabelsInPanel==false) {
			labelBeforeCheckboxesWidth = 0;
			labelWidth = 0;
		}
	}

	formName = "Element Options"; // XD may be using the element name ?

	elementDialog = h("dialog", {name:"Element", style: { padding: getPx(dialogPadding), margin: getPx(0), display: "block", width: dialogWidthNoPx } },
		elementForm.mainForm = h(elementType, { id:"formUpdate", name: formName, method: "dialog",
			style: { fontSize: getPx(form.formFontSize), width: formWidthNoPx, minWidth: getPx(100), 
				overflowX: "hidden", overflowY:"auto", padding: getPx(0), margin: getPx(margin) }, 
			onsubmit(e) { preventCloseFromEnter(e) } },

		elementForm.mainFormFieldset = h("fieldset", 
		  h("div", { class: elementForm.flexDirection, style: { alignItems: "center", height: getPx(26) } },
			 h("h2", { style: { display: displayOnDialogFlex, flex: 1, paddingLeft: getPx(0), marginLeft: getPx(0), textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" },
			 onclick(e) { elementHeaderClick() } },
			 "Element properties"),

			elementForm.elementIcon = h("img", { width: getPx(11), height:getPx(11),
				title: "Show element properties", class:"outlineHover",
				style: { display: displayOnPanel, marginLeft: getPx(6), cursor: "pointer" },
				onclick(e) { showElementModelPreferencesInConsole() } }, ""),
			
			elementForm.selectedArtboardsSelector = h("img", { src: form.doubleRightChevron, height: getPx(form.iconWidth-2), width: getPx(form.iconWidth-2), 
				title: "Select selected artboards", 
				style: { display: displayOnPanel, marginLeft: getPx(4), cursor: "pointer"},
				onclick(e) { selectSelectedArtboards(e) } }, ""),

			elementForm.displayedIcon = h("img", { src: form.hiddenIconPath, width: getPx(form.iconWidth), title: "Element is hidden", 
				style: { display:"none", marginLeft: getPx(4), cursor: form.cursor}, class:"imageHover", 
				onclick(e) { toggleLayerVisibility(true) } }, ""),

			elementForm.nameLabel = h("span", { title: "Edit layer name", class: "outlineHover",
				style: { marginTop: getPx(0), marginLeft: getPx(4), marginRight: getPx(5), display: displayOnPanel, 
				  minWidth: getPx(0), color: "#898989", marginBottom: getPx(0), fontSize: getPx(10), flex: ".5",
				  fontWeight: "normal", textOverflow: "ellipsis", cursor: "pointer", overflow: "hidden", whiteSpace: "nowrap"},
				onclick(e) { showSceneNodeNameInput() } }, ""),
			elementForm.nameInput = h("input", { uxpQuiet: true, id:"nameInput", uxpEditLabel:"Edit name", 
				 style: { display: "none", flex: ".5", marginTop: getPx(0), marginLeft: getPx(6), marginRight: getPx(5), fontSize: getPx(10), },
				 onchange(e) { updateSceneNodeName(e) }, onblur(e) { updateSceneNodeName(e); showSceneNodeNameInput(false) } }, ""),
			elementForm.notExportedLabel = h("span", { title: "Layer is excluded",
				style: { display: Styles.NONE, minWidth: getPx(0), color: "#EE0000", marginBottom: getPx(0), fontSize: getPx(10),
				fontWeight: "normal", textOverflow: "ellipsis", cursor: "pointer", overflow: "hidden", whiteSpace: "nowrap",
				title: "Layer is excluded."} ,
				onclick(e) { excludedElementLabel(e) } }, "(excluded)"),

			h("span", { style: { display: displayOnPanelFlex, flex: ".5", marginTop: getPx(0)} }, ""),

			elementForm.selectionIcon = h("img", { width: getPx(11), height:getPx(11),
				title: "Show element properties", class:"outlineHover",
				style: { marginRight: getPx(6), cursor: "pointer" }}, ""),
			elementForm.selectionLabel = h("span", { style: { display: displayOnPanelFlex,
				fontWeight:"bold", color: "#3890FA", maxWidth: "90%", marginRight: getPx(8), whiteSpace: "nowrap" } }, ""),

			elementForm.selectParentLabel = h("div", { style: { display: Styles.NONE, marginRight: getPx(5), color: "#AFAFAF", cursor: "pointer"},
				onclick(e) { selectParentElement(e) } }, "↖︎"),
			elementForm.selectPreviousSiblingLabel = h("div", { style: {display: displayOnPanel}, class: "navigationStyle",
				onclick(e) { selectPreviousSibling(e) }, onmouseover(e) { selectionMouseOver(e) }, onmouseout(e) { selectionMouseOut(e)} }, "←"),
			elementForm.selectNextSiblingLabel = h("div", { style: {display: displayOnPanel}, class: "navigationStyle",
				onclick(e) { selectNextSibling(e) }, onmouseover(e) { selectionMouseOver(e) }, onmouseout(e) { selectionMouseOut(e)}  }, "→"),
			elementForm.selectDescendentLabel = h("div", { style: {display: displayOnPanel}, class: "navigationStyle",
				onclick(e) { selectDescendentElement(e) }, onmouseover(e) { selectionMouseOver(e) }, onmouseout(e) { selectionMouseOut(e)}  }, "↘︎"),
		  ),

		  h("hr", { style: { display: displayed, height: getPx(1), paddingLeft: getPx(6), marginLeft: getPx(0) } }, ""),

		  h(form.RowTagName, { class: elementForm.flexDirection, 
			style: { height: getPx(elementForm.elementRowHeight), alignItems:"center" } },
			 h("span", { style: { width: getPx(labelWidth), overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" } }, 
			 "ID"),
			 elementForm.idInput = h("input", { uxpQuiet: true, placeholder:"Id on the page", id:"idInput", uxpEditLabel:"Edit Id", 
				style:{ flex: "1", minWidth: getPx(inputWidth) },
				onchange(e) { idInputChange(e) }, onkeydown(e) { idInputKeydown(e) }, onblur(e) { updateElementModelAndSaveBlurHandler(e) } } ),
				
			 elementForm.idInputWarning = h("img", { src: form.warningIconPath, height: getPx(form.iconWidth), width: getPx(form.iconWidth), title: "ID may not be supported", 
				style: { marginTop: getPx(7), cursor: "pointer"},
				onclick(e) { idInvalidClickHandler(e) } }, ""),
			 getList("cursorList", "cursorList", "Cursor to show", "Cursor", null, cursorListChange),
		  ),

		  h(form.RowTagName, { class: elementForm.flexDirection, style: { height: getPx(elementForm.elementRowHeight), alignItems:"center" } },
			h("span", { style: { width: getPx(labelWidth), overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" } }, 
			 "Tag name"),
			elementForm.tagNameInput = h("input", { id:"tagNameInput", uxpEditLabel:"Edit Tag name", uxpQuiet: true, placeholder:"Tag name", 
			 	style:{ flex: "1", minWidth: getPx(inputWidth) },
				 onchange(e) { updateElementModelAndSave(e) }, onblur(e) { updateElementModelAndSaveBlurHandler(e) } } ),

			getList("tagNameList", "tagNameList", "Edit Tag Name", "Tag name", null, tagNameListChange),

			elementForm.subTagNameInput = h("input", { id:"subTagNameInput", uxpEditLabel:"Edit Sub Tagname", uxpQuiet: true, placeholder:"Sub tag name", 
			 	style: { flex: "1", minWidth: getPx(inputWidth) },
				 onchange(e) { updateElementModelAndSave(e) }, onblur(e) { updateElementModelAndSaveBlurHandler(e) } } ),
				 
			getList("subTagNameList", "subTagNameList", "Edit Sub Tag Name", "sub tag name", null, tagNameListChange),
		  ),

		  h(form.RowTagName, { class: elementForm.flexDirection, style: { height: getPx(elementForm.elementRowHeight), alignItems:"center" } },
			 h("span", { style: { width: getPx(labelWidth), overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" } }, 
			 "Styles"),
			 elementForm.additionalStylesInput = h("input", { uxpQuiet: true, id:"additionalStylesInput", uxpEditLabel:"Edit Styles", placeholder:"Styles", 
			 	style:{ minWidth: getPx(inputWidth), flex: "1" },
			 	onchange(e) { updateElementModelAndSave(e) }, onblur(e) { updateElementModelAndSaveBlurHandler(e) } } ),

			h("img", { src: form.ellipsisIconPath, height: getPx(form.iconWidth), width: getPx(form.iconWidth), title: "Enter more details", 
				style: { marginTop: getPx(7), marginRight: getPx(3), cursor: "pointer"},
				onclick(e) { showMoreDetails(elementForm.additionalStylesInput) } }, ""),
			 elementForm.subStylesInput = h("input", { uxpQuiet: true, id:"subStylesInput", uxpEditLabel:"Edit Styles", placeholder:"Sub styles", 
			 	style:{ minWidth: getPx(inputWidth), flex: "1" },
				 onchange(e) { updateElementModelAndSave(e) }, onblur(e) { updateElementModelAndSaveBlurHandler(e) } } ),

			 elementForm.subStylesListIcon = h("img", { src: form.ellipsisIconPath, height: getPx(form.iconWidth), width: getPx(form.iconWidth), title: "Enter more details", 
				style: { marginTop: getPx(7), marginRight: getPx(3), cursor: "pointer"},
				onclick(e) { showMoreDetails(elementForm.subStylesInput) } }, "")
		  ),

		  h(form.RowTagName, { class: elementForm.flexDirection, style: {height: getPx(elementForm.elementRowHeight), alignItems:"center" } },
			 h("span", { style: { width: getPx(labelWidth), overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"  } }, 
			 "Classes"),
			 elementForm.classesInput = h("input", { id:"classesInput", uxpEditLabel:"Edit Classes", uxpQuiet: true, placeholder:"Classes", 
			 	style:{ minWidth: getPx(inputWidth), flex: "1" },
				 onchange(e) { updateElementModelAndSave(e) }, onblur(e) { updateElementModelAndSaveBlurHandler(e) } } ),
			 h("img", { src: form.ellipsisIconPath, height: getPx(form.iconWidth), width: getPx(form.iconWidth), title: "Enter more details", 
				style: { marginTop: getPx(7), marginRight: getPx(3), cursor: "pointer"},
				onclick(e) { showMoreDetails(elementForm.classesInput) } }, ""),
			 elementForm.subClassesInput = h("input", { id:"subClassesInput", uxpEditLabel:"Edit Sub Classes", uxpQuiet: true, placeholder:"Sub classes", 
			 	style:{ minWidth: getPx(inputWidth), flex: "1" },
			 	onchange(e) { updateElementModelAndSave(e) }, onblur(e) { updateElementModelAndSaveBlurHandler(e) } } ),
			 elementForm.subClassesListIcon = h("img", { src: form.ellipsisIconPath, height: getPx(form.iconWidth), width: getPx(form.iconWidth), title: "Enter more details", 
				style: { marginTop: getPx(7), marginRight: getPx(3), cursor: "pointer"},
				onclick(e) { showMoreDetails(elementForm.subClassesInput) } }, "")
		  ),

		  h(form.RowTagName, { class: elementForm.flexDirection, style: { height: getPx(elementForm.elementRowHeight), alignItems:"center" } },
			 h("span", { style: { width: getPx(labelWidth), overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"  } }, 
			 "Attributes"),
			 elementForm.attributesInput = h("input", { id:"attributesInput", uxpEditLabel:"Edit Sub Attributes", uxpQuiet: true, placeholder:"Attributes", 
			 	style:{ flex: "1", minWidth: getPx(inputWidth) },
				 onchange(e) { updateElementModelAndSave(e) }, onblur(e) { updateElementModelAndSaveBlurHandler(e) } } ),
			 h("img", { src: form.ellipsisIconPath, height: getPx(form.iconWidth), width: getPx(form.iconWidth), title: "Enter more details", 
				style: { marginTop: getPx(7), marginRight: getPx(3), cursor: "pointer"},
				onclick(e) { showMoreDetails(elementForm.attributesInput) } }, ""),
			 elementForm.subAttributesInput = h("input", { id:"subAttributesInput", uxpEditLabel:"Edit Sub Attributes", uxpQuiet: true, placeholder:"Sub attributes", 
			 	style:{ flex: "1", minWidth: getPx(inputWidth) },
				 onchange(e) { updateElementModelAndSave(e) }, onblur(e) { updateElementModelAndSaveBlurHandler(e) } } ),
			 elementForm.subAttributesListIcon = h("img", { src: form.ellipsisIconPath, height: getPx(form.iconWidth), width: getPx(form.iconWidth), title: "Enter more details", 
				style: { marginTop: getPx(7), marginRight: getPx(3), cursor: "pointer"},
				onclick(e) { showMoreDetails(elementForm.subAttributesInput) } }, "")
		  ),

		  /****************** HYPERLINK ****************/

		  h(form.RowTagName, { class: elementForm.flexDirection, style: { height: getPx(elementForm.elementRowHeight), alignItems:"center" } },
			 h("span", { style: { width: getPx(labelWidth), overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"  } }, 
			 "Hyperlink"),
			 elementForm.hyperlinkInput = h("input", { id:"hyperlinkInput", uxpEditLabel:"Edit Hyperlink", uxpQuiet: true, placeholder:"Hyperlink", 
			 	style: { flex: "1", minWidth: getPx(inputWidth) },
				onchange(e) { hyperlinkInputChange(e) },
				onkeydown(e) { hyperlinkInputKeypress(e) } }),
			 elementForm.hyperlinkArtboardIcon = h("img", { src: form.artboardIconPath, title: "Artboard linked to", height: getPx(form.iconWidth), width: getPx(form.iconWidth-2),
				style: { marginLeft: getPx(7) } }),
			 h("img", { src: form.ellipsisIconPath, height: getPx(form.iconWidth), width: getPx(form.iconWidth), title: "Enter more details", 
				style: { marginTop: getPx(7), marginRight: getPx(3), cursor: "pointer"},
				onclick(e) { showMoreDetails(elementForm.hyperlinkInput) } }, ""),
	
			 getList("hyperlinkPagesList", "hyperlinkPagesList", "Edit Hyperlink Page", "Artboards to link to", null, hyperlinkPagesListChange),

			 elementForm.interactionButton = h("img", { src: form.rightChevron, height: getPx(form.iconWidth), width: getPx(form.iconWidth), 
				title: "Apply prototype hyperlink", 
				style: { marginTop: getPx(7), marginRight: getPx(3), cursor: "pointer", opacity: .75 },
				onclick(e) { applyPrototypeHyperlink(e) } }, "")
		  ),

		  /****************** HYPERLINK OPTIONS ****************/
		  
		  h(form.RowTagName, { class: elementForm.flexDirection, style: { height: getPx(elementForm.elementRowHeight), alignItems:"center" } },
			 h("span", { style: { width: getPx(labelWidth), overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"  } }, 
			 ""),
			 elementForm.hyperlinkElementInput = h("input", { id:"hyperlinkElementInput", uxpEditLabel:"Edit Hyperlink state", uxpQuiet: true, placeholder:"Hyperlink state", 
			 	style: { flex: "1", minWidth: getPx(inputWidth) },
				onchange(e) { updateElementModelAndSave(e) },
				onkeydown(e) {  } }),
			 h("img", { src: form.ellipsisIconPath, height: getPx(form.iconWidth), width: getPx(form.iconWidth), title: "Enter more details", 
				style: { marginTop: getPx(7), marginRight: getPx(3), cursor: "pointer",},
				onclick(e) { showMoreDetails(elementForm.hyperlinkElementInput) } }, ""),
				
			 getList("hyperlinkElementsList", "hyperlinkElementsList", "Edit Hyperlink Element", "State name element belongs to", null, hyperlinkElementListChange),

			 h("img", { src: form.rightChevron, height: getPx(form.iconWidth-2), width: getPx(form.iconWidth-2), title: "Select artboards with same state name", 
				style: { marginTop: getPx(3), marginRight: getPx(3), cursor: "pointer"}, class: "imageHover",
				onclick(e) { selectArtboardsByStateName(e) } }, ""),

			 elementForm.hyperlinkTargetInput = h("input", { id:"hyperlinkTargetInput", uxpEditLabel:"Edit Hyperlink Target", uxpQuiet: true, placeholder:"Target", 
			 	style: { minWidth: getPx(inputWidth), flex: "1" },
				 onchange(e) { updateElementModelAndSave(e) }, onblur(e) { updateElementModelAndSaveBlurHandler(e) } } ),
				
			 getList("hyperlinkTargetsList", "hyperlinkTargetList", "Edit Hyperlink Target List", "Hyperlink target", null, hyperlinkTargetListChange,
					h(HTMLConstants.OPTION, { value: "_blank" }, "Blank"),
					h(HTMLConstants.OPTION, { value: "_parent" }, "Parent"),
					h(HTMLConstants.OPTION, { value: "_self" }, "Self"),
					h(HTMLConstants.OPTION, { value: "_top" }, "Top")
				),
		  ),

		  h(form.RowTagName, { class: elementForm.flexDirection, style: { height: getPx(elementForm.elementRowHeight), alignItems: "center" } },
			 h("span", { style: { width: getPx(labelWidth), overflow:"hidden" } }, 
			 "Size"),
			 elementForm.widthInput = h("input", { id:"widthInput", uxpEditLabel:"Edit Width", uxpQuiet: true, placeholder: "Width", 
			 	style: { minWidth: getPx(inputWidth), flex: "1" }, 
			 	title: "Set an alternative width value", 
				onchange(e) { updateElementModelAndSave(e) }, onblur(e) { updateElementModelAndSaveBlurHandler(e) } }),
			 elementForm.heightInput = h("input", { id:"heightInput", uxpEditLabel:"Edit Height", uxpQuiet: true, placeholder: "Height", 
			 	style: { minWidth: getPx(inputWidth), flex: "1" }, 
			 	title: "Set an alternative height value", 
				onchange(e) { updateElementModelAndSave(e) }, onblur(e) { updateElementModelAndSaveBlurHandler(e) }})
		  ),

		  h(form.RowTagName, { class: elementForm.flexDirection, style: { height: getPx(elementForm.elementRowHeight), alignItems: "center" } },
			 h("span", { style: { width: getPx(labelWidth), overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" } }, 
			 "Markup inside"),
			 elementForm.markupInsideInput = h("input", { id:"markupInsideInput", uxpEditLabel:"Edit Markup Inside", uxpQuiet: true, placeholder:"Markup inside", 
			 	style: { minWidth: getPx(inputWidth), flex: "1" },
			  	onchange(e) { updateElementModelAndSave(e) }, onblur(e) { updateElementModelAndSaveBlurHandler(e) } } ),

			h("img", { src: form.ellipsisIconPath, height: getPx(form.iconWidth), width: getPx(form.iconWidth), title: "Enter more details", 
				style: { marginTop: getPx(7), cursor: "pointer"},
				onclick(e) { showMoreDetails(elementForm.markupInsideInput) } }, ""),
		  ),

		  h(form.RowTagName, { class: elementForm.flexDirection, style: { height: getPx(elementForm.elementRowHeight), alignItems: "center" } },
			h("span", { style: { width: getPx(labelWidth), overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" },
			 title: "Markup before & after" }, 
			 "Markup before & after"),
			elementForm.markupBeforeInput = h("input", { id:"markupBeforeInput", uxpEditLabel:"Edit Markup Before", uxpQuiet: true, placeholder:"Markup before", 
			 	style: { flex: "1", minWidth: getPx(inputWidth) },
				  onchange(e) { updateElementModelAndSave(e) }, onblur(e) { updateElementModelAndSaveBlurHandler(e) } } ),
				  
				h("img", { src: form.ellipsisIconPath, height: getPx(form.iconWidth), width: getPx(form.iconWidth), title: "Enter more details", 
					style: { marginTop: getPx(7), cursor: "pointer"},
					onclick(e) { showMoreDetails(elementForm.markupBeforeInput) } }, ""),

				getList("wrapTagsList", "wrapTagsList", "Edit Markup Before", "Common tags", null, wrapTagsListChange,
					h(HTMLConstants.OPTION, { value: "header" }, "Header"),
					h(HTMLConstants.OPTION, { value: "main" }, "Main"),
					h(HTMLConstants.OPTION, { value: "nav" }, "Navigation"),
					h(HTMLConstants.OPTION, { value: "section" }, "Section"),
					h(HTMLConstants.OPTION, { value: "aside" }, "Aside"),
					h(HTMLConstants.OPTION, { value: "address" }, "Address"),
					h(HTMLConstants.OPTION, { value: "footer" }, "Footer"),
					h(HTMLConstants.OPTION, { value: "<!--Comment-->", singleton: true, addTags: false, clearMarkupAfter: true }, "Comment (above)"),
					h(HTMLConstants.OPTION, { value: "<!--Comment-->", singleton: false, addTags: false }, "Comment (above and below)"),
					h(HTMLConstants.OPTION, { value: "noscript" }, "No Script"),
					h(HTMLConstants.OPTION, { value: "(clear)", clear: true }, "Clear")
				),
				elementForm.markupAfterInput = h("input", { id:"markupAfterInput", uxpEditLabel:"Edit Markup After", uxpQuiet: true, placeholder:"Markup after", 
					style: { flex: "1", minWidth: getPx(inputWidth) },
				 onchange(e) { updateElementModelAndSave(e) }, onblur(e) { updateElementModelAndSaveBlurHandler(e) } } ),
  
				h("img", { src: form.ellipsisIconPath, height: getPx(form.iconWidth), width: getPx(form.iconWidth), title: "Enter more details", 
					style: { marginTop: getPx(7), cursor: "pointer"},
				  onclick(e) { showMoreDetails(elementForm.markupAfterInput) } }, ""),
		  ),

		  /****************** IMAGE OPTIONS ****************/

		  elementForm.imageOptionsGroup = h(form.RowTagName, { class: elementForm.flexDirection, 
				style: { minHeight: getPx(elementForm.elementRowHeight), flexWrap: Styles.WRAP, alignItems:"center" } },
			 h("span", { style: { width: getPx(labelWidth), overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" } }, 
			 "Image Options"),

				elementForm.imageFormatList = h(HTMLConstants.SELECT, {
					id:"imageFormatList", uxpEditLabel:"Edit Image Format", uxpQuiet: true, 
					title: "Image Format", 
					style: { paddingTop: getPx(0), opacity: .75,
					minWidth: getPx(45), cursor: form.cursor},
					
					async onchange(e) { await imageFormatChangeHandler(e) } },
						h(HTMLConstants.OPTION, { value: XDConstants.PNG }, "PNG"),
						h(HTMLConstants.OPTION, { value: XDConstants.JPG }, "JPG")
				),

				elementForm.imageQualitySlider = h(HTMLConstants.INPUT, { id:"imageQualitySlider", uxpEditLabel:"Image quality", 
					type:"range", uxpQuiet: true, placeholder:"Image quality", title: "Image quality", 
					min:"1", max:"100", value:"100", step: "5",
			 		style: { minWidth: getPx(60)},
					  async onchange(e) { await imageQualityChangeHandler(e) } }),
				h("span", { title: "Export 2x image size", 
					style: { cursor: "pointer", overflow: "visible", whiteSpace: "nowrap", textOverflow: "ellipsis"},
					onclick(e) { elementFormCheckboxLabelClickHandler(elementForm.image2xCheckbox) } }, 
					"2x"),
				elementForm.image2xCheckbox = h("input", { id:"image2xCheckbox", uxpEditLabel:"Export 2x", type: "checkbox", checked: true, title: "Export 2x of image", 
					onclick(e) { updateElementModelAndSave(e) }}),
				h("span", { title: "Embed image", style: { overflow: "visible", whiteSpace: "nowrap", cursor: "pointer", textOverflow: "ellipsis", paddingLeft: getPx(6) },
					onclick(e) { elementFormCheckboxLabelClickHandler(elementForm.embedImageCheckbox) } }, 
					"E"),
				elementForm.embedImageCheckbox = h(HTMLConstants.INPUT, 
					{ id:"embedImageCheckbox", uxpEditLabel:"Embed Image", type: "checkbox", checked: false, title: "Embed image into page", 
					onclick(e) { embedImagesCheckboxHandler(e) }}, "Embed"),
				elementForm.embedImageResetIcon = h("img", { src: form.ellipsisIconPath, height: getPx(form.iconWidth), width: getPx(form.iconWidth), title: "Reset embed image option", 
					  style: { marginTop: getPx(7), cursor: "pointer"},
					  onclick(e) { embedImageResetHandler(e) } }, "")
				/*,
				h(HTMLConstants.SPECTRUM_THEME, {scale:"medium", color:"light"}, 
					h(HTMLConstants.SPECTRUM_ACTION_MENU, {  }, 
						h(HTMLConstants.SPECTRUM_ICON, {size:"xxs", src:form.exportImageArrow}, ""),
						h(HTMLConstants.SPECTRUM_MENU, {}, 
							h(HTMLConstants.SPECTRUM_MENU_ITEM, {}, "Deselect"),
							h(HTMLConstants.SPECTRUM_MENU_ITEM, {}, "Select Inverse"),
						),
					),
				),
				*/
		  ),

		  elementForm.textIDsGroup = h(form.RowTagName, { class: elementForm.flexDirection, style: { height: getPx(elementForm.elementRowHeight), alignItems:"center" } },
			 h("span", { style: { width: getPx(labelWidth), overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" } }, 
			 "Text IDs"),
			 elementForm.textIDsInput = h(HTMLConstants.INPUT, { id:"textIDsInput", uxpEditLabel:"Text IDs", uxpQuiet: true, placeholder:"Text IDs", 
				title: "In a text field enter text and an id to add an span around the text token with the id. For example, 'John Smith:customerNameID'", 
			 	style: { minWidth: getPx(inputWidth), flex: "1" },
			  	onchange(e) { updateElementModelAndSave(e) }, onblur(e) { updateElementModelAndSaveBlurHandler(e) } } ),

			 h("img", { src: form.ellipsisIconPath, height: getPx(form.iconWidth), width: getPx(form.iconWidth), title: "Enter more details", 
				style: { marginTop: getPx(7), cursor: "pointer"},
				onclick(e) { showMoreDetails(elementForm.textIDsInput) } }, ""),

			 h("span", { style: { width: getPx(labelWidth), overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" } }, 
			 "Text Tokens"),
				elementForm.textTokensInput = h(HTMLConstants.INPUT, { id:"textTokensInput", uxpEditLabel:"Text Tokens", uxpQuiet: true, placeholder:"Text Tokens", 
				  title: "Enter text and then replacement. For example, 'name:replacement' or 'name::replacement' if either the values use colons.", 
					style: { minWidth: getPx(inputWidth), flex: "1" },
					 onchange(e) { updateElementModelAndSave(e) }, onblur(e) { updateElementModelAndSaveBlurHandler(e) } } ),
  
				h("img", { src: form.ellipsisIconPath, height: getPx(form.iconWidth), width: getPx(form.iconWidth), title: "Enter more details", 
				  style: { marginTop: getPx(7), cursor: "pointer"},
				  onclick(e) { showMoreDetails(elementForm.textTokensInput) } }, ""),
		  ),

		  h(form.RowTagName, { class: elementForm.flexDirection, 
			style: { height: getPx(elementForm.elementRowHeight), alignItems: "center" } },
			h("span", { style: { width: getPx(labelWidth), overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" } }, 
			 "Layout"),

			elementForm.groupLayoutInput = h("input", { id:"groupLayoutInput", uxpEditLabel:"Edit Group Layout", 
				uxpQuiet: true, placeholder:"Group Layout", disabled:true,
				style: { flex: "1", minWidth: getPx(inputWidth)},
				onchange(e) { updateElementModelAndSave(e) } } ),

			 getList("groupLayoutList", "groupLayoutAxisList", "Edit Group Layout", "Group items alignment", null, groupLayoutListChange,
				h(HTMLConstants.OPTION, { selected: true, value: "default" }, "Default"),
				h(HTMLConstants.OPTION, { value: Styles.ROW }, "Row"),
				h(HTMLConstants.OPTION, { value: Styles.ROW_REVERSE }, "Row (reverse)"),
				h(HTMLConstants.OPTION, { value: Styles.COLUMN }, "Column"),
				h(HTMLConstants.OPTION, { value: Styles.COLUMN_REVERSE }, "Column (reverse)"),
				h(HTMLConstants.OPTION, { value: XDConstants.STACK }, "Stack"),
				h(HTMLConstants.OPTION, { value: Styles.DEFAULT, separator: true }, "-------------"),
				h(HTMLConstants.OPTION, { value: "table" }, "Table"),
				h(HTMLConstants.OPTION, { value: "table-row" }, "Table Row"),
				h(HTMLConstants.OPTION, { value: "table-cell" }, "Table Cell"),
				h(HTMLConstants.OPTION, { value: "table-column" }, "Table Column"),
				h(HTMLConstants.OPTION, { value: "table-column-group" }, "Table Column Group"),
				h(HTMLConstants.OPTION, { value: "table-footer-group" }, "Table Footer Group"),
				h(HTMLConstants.OPTION, { value: "table-header-group" }, "Table Header Group"),
				h(HTMLConstants.OPTION, { value: "table-row-group" }, "Table Row Group"),
				h(HTMLConstants.OPTION, { value: "inline-table" }, "Inline Table"),
				h(HTMLConstants.OPTION, { value: "flex" }, "Flex"),
				h(HTMLConstants.OPTION, { value: "grid" }, "Grid"),
				h(HTMLConstants.OPTION, { value: "block" }, "Block"),
				h(HTMLConstants.OPTION, { value: "inline-block" }, "Inline Block"),
				h(HTMLConstants.OPTION, { value: "inline" }, "Inline")
			 ),
		  ),
		  
		  elementForm.groupLayoutGroup = h(form.RowTagName, { class: elementForm.flexDirection, 
				style: { height: getPx(elementForm.elementRowHeight), alignItems: "center" } },
				h("span", { style: { width: getPx(labelWidth), overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" } }, 
				"Items alignment"),

			 elementForm.groupVerticalLayoutInput = h("input", { id:"groupVerticalLayoutInput", uxpEditLabel:"Edit Group Vertical Layout", 
				uxpQuiet: true, placeholder:"Group Vertical Layout", disabled:true,
				style: { flex: "1", minWidth: getPx(inputWidth) },
				onchange(e) { updateElementModelAndSave(e) } } ),

			 elementForm.groupVerticalAlignmentList = h(HTMLConstants.SELECT, { 
				id:"groupVerticalAlignmentList", uxpEditLabel:"Edit Group Vertical Layout", uxpQuiet: true, 
				title: "Group vertical layout (default is stretched)", 
				style: { paddingTop: getPx(0), opacity: .5,
				width: getPx(elementForm.disclosureIconWidth), minWidth: getPx(0), flexShrink: 2, cursor: form.cursor },
				
				onchange(e) { groupLayoutListChange(e) } },
					h(HTMLConstants.OPTION, { value: {label: "top", style: Styles.FLEX_START }}, "Top"),
					h(HTMLConstants.OPTION, { value: {label: "center", style: Styles.CENTER }}, "Center"),
					h(HTMLConstants.OPTION, { value: {label: "bottom", style: Styles.FLEX_END }}, "Bottom"),
					h(HTMLConstants.OPTION, { value: {label: "baseline", style: Styles.BASELINE }}, "Baseline"),
					h(HTMLConstants.OPTION, { value: {label: "stretched", style: Styles.STRETCH }}, "Stretched")
			),

			elementForm.groupHorizontalLayoutInput = h("input", { id:"groupHorizontalLayoutInput", uxpEditLabel:"Edit Group Horizontal Layout", 
				uxpQuiet: true, placeholder:"Group Horizontal Layout", disabled:true,
				style: { flex: "1", display:"none", minWidth: getPx(inputWidth) },
				onchange(e) { updateElementModelAndSave(e) } } ),
			
			elementForm.groupHorizontalAlignmentList = h(HTMLConstants.SELECT, { uxpQuiet: true, 
				title: "Group horizontal layout (default is stretched)", 
				style: { paddingTop: getPx(0), display:"none", opacity: .5, 
				width: getPx(elementForm.disclosureIconWidth), minWidth: getPx(0), flexShrink: 2, cursor: form.cursor },
				onchange(e) { groupLayoutListChange(e) } },
					h(HTMLConstants.OPTION, { value: {label: "left", style: "flex-start" } }, "Left"),
					h(HTMLConstants.OPTION, { value: {label: "center", style: "center" } }, "Center"),
					h(HTMLConstants.OPTION, { value: {label: "right", style: "flex-end" } }, "Right"),
					h(HTMLConstants.OPTION, { value: {label: "baseline", style: "baseline" } }, "Baseline"),
					h(HTMLConstants.OPTION, { value: {label: "stretched", style: "stretch" } }, "Stretched")
				)
			),

			elementForm.groupItemGroup = h(form.RowTagName, { class: elementForm.flexDirection, 
				style: { height: getPx(elementForm.elementRowHeight), alignItems: "center" } },
				h("span", { style: { width: getPx(labelWidth), overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" } }, 
				"Item options"),

			elementForm.groupSpacingInput = h("input", { id:"groupSpacingInput", uxpEditLabel:"Edit Group Spacing", 
				uxpQuiet: true, placeholder:"Group Spacing", disabled:true,
				style: { flex: "1", minWidth: getPx(inputWidth) },
				onchange(e) { updateElementModelAndSave(e) } } ),

			getList("groupSpacingList", "groupSpacingList", "Edit Item spacing", "Item spacing (default is no space)", null, groupLayoutListChange,
				h(HTMLConstants.OPTION, { value: {label: "flexStart", style: "flex-start" } }, "Space at end"),
				h(HTMLConstants.OPTION, { value: {label: "flexEnd", style: "flex-end" } }, "Space at start"),
				h(HTMLConstants.OPTION, { value: {label: "center", style: "center" } }, "Center"),
				h(HTMLConstants.OPTION, { value: {label: "spaceBetween", style: "space-between" } }, "Space between"),
				h(HTMLConstants.OPTION, { value: {label: "spaceAround", style: "space-around" } }, "Space around"),
				h(HTMLConstants.OPTION, { value: {label: "spaceEvenly", style: "space-evenly" } }, "Space evenly"),
				h(HTMLConstants.OPTION, { value: {label: "stretched", style: "stretch" } }, "No space"),
			 ),

			elementForm.groupWrapInput = h("input", { id:"groupWrapInput", uxpEditLabel:"Edit Group Wrapping", 
				uxpQuiet: true, placeholder:"Group Wrapping", disabled:true,
				style: { flex: "1", minWidth: getPx(inputWidth) },
				onchange(e) { updateElementModelAndSave(e) } } ),
			
			getList("groupWrapList", "groupWrapList", "Edit Group Wrap", "Group wrap (default is no wrap)", null, groupLayoutListChange,
				h(HTMLConstants.OPTION, { selected: true, value: "nowrap" }, "No wrap"),
				h(HTMLConstants.OPTION, { value: "wrap" }, "Wrap"),
				h(HTMLConstants.OPTION, { value: "wrap-reverse" }, "Wrap reverse")
			 ),

		  ),

		  elementForm.selfAlignmentGroup = h(form.RowTagName, { class: elementForm.flexDirection, 
			style: { display:"none", height: getPx(elementForm.elementRowHeight+6), paddingTop: getPx(4), alignItems: "center" } },
			h("span", { style: { width: getPx(labelWidth), overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" } }, 
			 "Item alignment"),

			/*
			elementForm.selfAlignmentList = h(HTMLConstants.SELECT, { uxpQuiet: true, uxpEditLabel:"Edit Item Alignment", title: "Item alignment in a row or column layout", 
				style: { paddingTop: getPx(0), border:form.borderWeight + "px solid blue", 
				minWidth: getPx(55), flexShrink: 2, cursor: form.cursor },
				onchange(e) { groupLayoutListChange(e) } },
					h(HTMLConstants.OPTION, { value: {label: "flexStart", style: "flex-start" } }, "Start"),
					h(HTMLConstants.OPTION, { value: {label: "flexEnd", style: "flex-end" } }, "End"),
					h(HTMLConstants.OPTION, { value: {label: "center", style: "center" } }, "Center"),
					h(HTMLConstants.OPTION, { value: {label: "stretched", style: "stretch" } }, "Stretch"),
					h(HTMLConstants.OPTION, { value: {label: "pushLeft", style: XDConstants.PUSH_LEFT } }, "Push Left"),
					h(HTMLConstants.OPTION, { value: {label: "pushRight", style: XDConstants.PUSH_RIGHT } }, "Push Right"),
					h(HTMLConstants.OPTION, { value: {label: "pushTop", style: XDConstants.PUSH_TOP } }, "Push Top"),
					h(HTMLConstants.OPTION, { value: {label: "pushBottom", style: XDConstants.PUSH_BOTTOM } }, "Push Bottom"),
					h(HTMLConstants.OPTION, { value: {label: "pushLeftRight", style: XDConstants.PUSH_LEFT_RIGHT } }, "Push Left & Right"),
					h(HTMLConstants.OPTION, { value: {label: "pushTopBottom", style: XDConstants.PUSH_TOP_BOTTOM } }, "Push Top and Bottom"),
					h(HTMLConstants.OPTION, { value: {label: "pushAll", style: XDConstants.PUSH_ALL } }, "Push All"),
					h(HTMLConstants.OPTION, { value: {label: "default", style: "auto", selected:true} }, "Default"),
				)*/
			
			elementForm.selfAlignmentListInput = h("input", { id:"itemAlignmentInput", uxpEditLabel:"Edit Item Alignment", 
				uxpQuiet: true, placeholder:"Item Alignment", disabled:true,
				style: { minWidth: getPx(inputWidth) },
				onchange(e) { updateElementModelAndSave(e) } } ),
			
			getList("selfAlignmentList", "selfAlignmentList", "Edit Item Alignment Wrap", "Item alignment in a row or column layout", null, groupLayoutListChange,
				h(HTMLConstants.OPTION, { value: {label: "flexStart", style: "flex-start" } }, "Start"),
				h(HTMLConstants.OPTION, { value: {label: "flexEnd", style: "flex-end" } }, "End"),
				h(HTMLConstants.OPTION, { value: {label: "center", style: "center" } }, "Center"),
				h(HTMLConstants.OPTION, { value: {label: "stretched", style: "stretch" } }, "Stretch"),
				h(HTMLConstants.OPTION, { value: {label: "pushLeft", style: XDConstants.PUSH_LEFT } }, "Push Left"),
				h(HTMLConstants.OPTION, { value: {label: "pushRight", style: XDConstants.PUSH_RIGHT } }, "Push Right"),
				h(HTMLConstants.OPTION, { value: {label: "pushTop", style: XDConstants.PUSH_TOP } }, "Push Top"),
				h(HTMLConstants.OPTION, { value: {label: "pushBottom", style: XDConstants.PUSH_BOTTOM } }, "Push Bottom"),
				h(HTMLConstants.OPTION, { value: {label: "pushLeftRight", style: XDConstants.PUSH_LEFT_RIGHT } }, "Push Left & Right"),
				h(HTMLConstants.OPTION, { value: {label: "pushTopBottom", style: XDConstants.PUSH_TOP_BOTTOM } }, "Push Top and Bottom"),
				h(HTMLConstants.OPTION, { value: {label: "pushAll", style: XDConstants.PUSH_ALL } }, "Push All"),
				h(HTMLConstants.OPTION, { value: {label: "default", style: "auto", selected:true} }, "Default")
			 ),
		  ),

		  elementForm.useAsBackgroundGroup = h(form.RowTagName, { class: elementForm.flexDirection, 
			style: { display:"flex", height: getPx(elementForm.elementRowHeight+6), paddingTop: getPx(4), alignItems: "center" } },
				h("span", { style: { width: getPx(labelBeforeCheckboxesWidth), marginRight: getPx(labelBeforeCheckboxesMargin), overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"  } }, 
				"Use as"),
				h("span", { style: { width: getPx(checkboxLabelWidth), opacity: .75, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", cursor: Styles.POINTER }, title:"Center Horizontally",
					onclick(e) { elementFormCheckboxLabelClickHandler(elementForm.useAsBackgroundCheckbox) } }, 
				"Background"),
				elementForm.useAsBackgroundCheckbox = h("input", { id:"useAsBackgroundCheckbox", uxpEditLabel:"Use element as background", type: "checkbox", checked: false, title: "Use the element as a background in it's group", 
					onchange(e) { updateElementModelAndSave(e) }}),
		  ),

		  elementForm.hoverEffectsGroup = h(form.RowTagName, { class: elementForm.flexDirection, 
			style: { display:Styles.NONE, height: getPx(elementForm.elementRowHeight+6), paddingTop: getPx(4), alignItems: "center" } },
				h("span", { style: { width: getPx(labelBeforeCheckboxesWidth), marginRight: getPx(labelBeforeCheckboxesMargin), overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"  } }, 
				"Descendants"),
				h("span", { style: { width: getPx(checkboxLabelWidth), overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"  }, title:"Center Horizontally" }, 
				"Reveal"),
				elementForm.revealCheckbox = h("input", { id:"revealCheckbox", uxpEditLabel:"Show descendants", type: "checkbox", checked: false, 
					title: "Reveal an element in the group", 
					onchange(e) { updateElementModelAndSave(e) }}),
				h("span", { style: { width: getPx(labelWidth), overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" } }, 
				"Event"), 
				elementForm.revealOnEventList = h("select", { id:"revealOnEventList", uxpEditLabel:"Edit Reveal Effect", uxpQuiet: true, 
					title: "Reveal an element on the specified event", 
					style: { minWidth: getPx(inputWidth+20), paddingTop: getPx(0), opacity: .5, flex: "1" },
					onchange(e) {  }})
		  ),

		  elementForm.revealDescendentsGroup = h(form.RowTagName, { class: elementForm.flexDirection, 
			style: { display:Styles.FLEX, height: getPx(elementForm.elementRowHeight+6), paddingTop: getPx(4), alignItems: "center" } },
				h("span", { style: { width: getPx(labelWidth), overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" } }, 
				"Hover effects"), 
				elementForm.hoverEffectsList = h("select", { id:"hoverEffectsList", uxpEditLabel:"Edit Hover Effects", uxpQuiet: true, 
					title: "Select the element that has the hover effects you want to apply on hover", 
					style: { minWidth: getPx(inputWidth+20), paddingTop: getPx(0), opacity: .5, flex: "1" },
					onchange(e) { hoverEffectsListChange(e) }}),

				elementForm.hoverEffectsSelector = h("img", { src: form.rightChevron, height: getPx(form.iconWidth-2), width: getPx(form.iconWidth-2), title: "Select hover element", 
					style: { marginTop: getPx(3), marginRight: getPx(3), cursor: "pointer"}, class: "imageHover",
					onclick(e) { selectHoverEffectElement(e) } }, ""),

				elementForm.copyChangesToTemplateButton = h("img", { src: form.doubleRightChevron, height: getPx(form.iconWidth-2), width: getPx(form.iconWidth-2), 
					title: "Transfer unique styles to the last selected element and place in the styles field", 
					style: { marginTop: getPx(3), marginRight: getPx(3), cursor: "pointer"}, class: "imageHover",
					onclick(e) { copyUniqueStylesToCSSTemplate(e) } }, ""),

				elementForm.styleTransferLabel = h("span", { style: { flex: "1", marginTop: getPx(0) } }, ""),

				elementForm.scriptTemplateIcon = h("img", { src: form.scriptTemplateIconPath, width: getPx(form.iconWidth), title: "Set script template", 
					style: { marginRight: getPx(3), cursor: form.cursor}, class:"imageHover", 
					onclick(e) { scriptTemplateIconHandler(true) } }, ""),
				elementForm.styleTemplateIcon = h("img", { src: form.styleTemplateIconPath, width: getPx(form.iconWidth), title: "Set style template", 
					style: { marginRight: getPx(3), cursor: form.cursor}, class:"imageHover", 
					onclick(e) { stylesheetTemplateIconHandler(true) } }, ""),
				elementForm.templateIcon = h("img", { src: form.templateIconPath, width: getPx(form.iconWidth), title: "Set HTML template", 
					style: { marginRight: getPx(3), cursor: form.cursor}, class:"imageHover", 
					onclick(e) { templateIconHandler(true) } }, "")
		  ),

		  h(form.RowTagName, { class: elementForm.flexDirection, 
			style: { height: getPx(elementForm.elementRowHeight+6), paddingTop: getPx(4), alignItems:"center" } },
			h("span", { style: { width: getPx(labelWidth), overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"  } }, 
			"Overflow"),
			/*
			elementForm.overflowList = h("select", { id:"overflowList", uxpEditLabel:"Edit Overflow", uxpQuiet: true, title: "Describes when to show scroll bars when content extends past the element size", 
				style: { minWidth: getPx(inputWidth+20), paddingTop: getPx(0), border: form.borderWeight + "px solid blue", flex: "1" },
				onchange(e) { updateElementModelAndSave() }},
				h(HTMLConstants.OPTION, { value: OverflowOptions.HIDDEN }, "Hidden - No scrollbars"),
				h(HTMLConstants.OPTION, { value: OverflowOptions.VISIBLE }, "Visible - Content can extend past container"),
				h(HTMLConstants.OPTION, { value: OverflowOptions.AUTO }, "Auto - Add Scrollbars if needed"),
				h(HTMLConstants.OPTION, { value: OverflowOptions.ON }, "On - Vertical and Horizontal Scrollbars on"),
				h(HTMLConstants.OPTION, { value: OverflowOptions.HORIZONTAL_ON }, "Horizontal Scrollbars on"),
				h(HTMLConstants.OPTION, { value: OverflowOptions.HORIZONTAL_AUTO }, "Horizontal Scrollbars if needed"),
				h(HTMLConstants.OPTION, { value: OverflowOptions.VERTICAL_ON }, "Vertical Scrollbars on"),
				h(HTMLConstants.OPTION, { value: OverflowOptions.VERTICAL_AUTO }, "Vertical Scrollbars if needed")),*/

			elementForm.overflowListInput = h("input", { id:"overflowListInput", uxpEditLabel:"Edit Overflow", 
				uxpQuiet: true, placeholder:"Overflow", disabled:true,
				style: { minWidth: getPx(inputWidth), flex: 1 },
				onchange(e) { updateElementModelAndSave(e) } } ),
			
			getList("overflowList", "overflowList", "Edit Overflow", "Describes when to show scroll bars when content extends past the element size", 
				null, overflowListChange,
				h(HTMLConstants.OPTION, { value: OverflowOptions.HIDDEN }, "Hidden - No scrollbars"),
				h(HTMLConstants.OPTION, { value: OverflowOptions.VISIBLE }, "Visible - Content can extend past container"),
				h(HTMLConstants.OPTION, { value: OverflowOptions.AUTO }, "Auto - Add Scrollbars if needed"),
				h(HTMLConstants.OPTION, { value: OverflowOptions.ON }, "On - Vertical and Horizontal Scrollbars on"),
				h(HTMLConstants.OPTION, { value: OverflowOptions.HORIZONTAL_ON }, "Horizontal Scrollbars on"),
				h(HTMLConstants.OPTION, { value: OverflowOptions.HORIZONTAL_AUTO }, "Horizontal Scrollbars if needed"),
				h(HTMLConstants.OPTION, { value: OverflowOptions.VERTICAL_ON }, "Vertical Scrollbars on"),
				h(HTMLConstants.OPTION, { value: OverflowOptions.VERTICAL_AUTO }, "Vertical Scrollbars if needed")
			 ),

			 h("span", { style: { flex: ".25", marginTop: getPx(0) } }, ""),

			 elementForm.resetElementIcon = h("img", { src: form.resetDarkIconPath, width: getPx(form.iconWidth), title: "Reset element properties to default", 
				style: { cursor: form.cursor}, 
				onclick(e) { resetElementModel(globalModel.selectedElement, globalModel.selectedModel, false) } }, ""),
			 elementForm.changedPropertiesIcon = h("img", { src: form.changedPropertiesIconPath, width: getPx(form.iconWidth), title: "Show changed properties", 
				style: { marginLeft: getPx(6), cursor: form.cursor},
				onclick(e) { resetElementModel(globalModel.selectedElement, globalModel.selectedModel, true) } }, ""),
			 elementForm.groupLayoutIcon = h("img", { src: form.columnAlignPath, 
				 height: getPx(form.iconWidth-3), width: getPx(form.iconWidth-3), 
				 class: "fullOpacity",
				 title: "Space the selected items evenly up and down or space items in a group evenly up and down", 
				 style: { marginLeft: getPx(6), cursor: "pointer", opacity: .5},
				 onclick(e) { groupLayoutIconHandler(e, true) } }, ""),
			 elementForm.groupLayoutIcon2 = h("img", { src: form.rowAlignPath, 
				 height: getPx(form.iconWidth-3), width: getPx(form.iconWidth-3), 
				 class: "fullOpacity",
				 title: "Space the selected items evenly across or space items in a group evenly across", 
				 style: { marginLeft: getPx(8), marginRight: getPx(4), cursor: "pointer", opacity: .5},
				 onclick(e) { groupLayoutIconHandler(e, false) } }, "")
		  	),


		  	h(form.RowTagName, { class: elementForm.flexDirection, 
				style: { minHeight: getPx(elementForm.elementRowHeight+6), flexWrap: Styles.WRAP, paddingTop: getPx(4), alignItems:"center" } },
			h("span", { style: { width: getPx(labelWidth), overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"  } }, 
			"Layout"),
			
			elementForm.positionList = h(HTMLConstants.SELECT, { id:"positionList", uxpEditLabel:"Edit Position", uxpQuiet: true, 
				title: "Selects the layout type", 
				style: { minWidth: getPx(listMinWidth), paddingTop: getPx(0), opacity: .65, flex: "1" },
				onchange(e) { updateElementModelAndSave() }},
					h(HTMLConstants.OPTION, { value: XDConstants.DEFAULT }, "Default"),
					h(HTMLConstants.OPTION, { value: Styles.ABSOLUTE }, "Absolute"),
					h(HTMLConstants.OPTION, { value: Styles.FIXED }, "Fixed"),
					h(HTMLConstants.OPTION, { value: Styles.RELATIVE }, "Relative"),
					h(HTMLConstants.OPTION, { value: Styles.STICKY }, "Sticky"),
					h(HTMLConstants.OPTION, { value: Styles.NONE }, "No position type")
				),

			elementForm.positionByList = h(HTMLConstants.SELECT, { id:"positionByTypeList", uxpEditLabel:"Edit Position By Type", uxpQuiet: true, 
				title: "Position by absolute, padding, margin or none", 
				style: { minWidth: getPx(listMinWidth), paddingTop: getPx(0), opacity: .65, flex: "1" },
				onchange(e) { updateElementModelAndSave() }},
					h(HTMLConstants.OPTION, { value: XDConstants.DEFAULT }, "Default"),
					h(HTMLConstants.OPTION, { value: XDConstants.CONSTRAINT }, "Constraint"),
					h(HTMLConstants.OPTION, { value: XDConstants.HORIZONTAL_CONSTRAINT }, "Constraint (horizontal)"),
					h(HTMLConstants.OPTION, { value: XDConstants.VERTICAL_CONSTRAINT }, "Constraint (vertical)"),
					h(HTMLConstants.OPTION, { value: Styles.PADDING }, "Padding"),
					h(HTMLConstants.OPTION, { value: XDConstants.HORIZONTAL_PADDING }, "Padding (horizontal)"),
					h(HTMLConstants.OPTION, { value: XDConstants.VERTICAL_PADDING }, "Padding (vertical)"),
					h(HTMLConstants.OPTION, { value: Styles.MARGIN }, "Margin"),
					h(HTMLConstants.OPTION, { value: XDConstants.HORIZONTAL_MARGIN }, "Margin (horizontal)"),
					h(HTMLConstants.OPTION, { value: XDConstants.VERTICAL_MARGIN }, "Margin (vertical)"),
					h(HTMLConstants.OPTION, { value: Styles.NONE }, "No layout values")
				),

			elementForm.sizeList = h(HTMLConstants.SELECT, { id:"sizeList", uxpEditLabel:"Select sizing options", uxpQuiet: true, 
				title: "Set width, height, both or none", 
				style: { minWidth: getPx(listMinWidth), paddingTop: getPx(0), opacity:.65 },
				onchange(e) { updateElementModelAndSave(e) }},
					h(HTMLConstants.OPTION, { value: XDConstants.DEFAULT }, "Default"),
					h(HTMLConstants.OPTION, { value: XDConstants.BOTH }, "Both"),
					h(HTMLConstants.OPTION, { value: Styles.WIDTH }, "Width"),
					h(HTMLConstants.OPTION, { value: Styles.HEIGHT }, "Height"),
					h(HTMLConstants.OPTION, { value: Styles.NONE }, "No sizing")
				)
		  ),

		  /***************************  ELEMENT OPTIONS CHECKBOXES  ***********************/
		  
		  h(form.RowTagName, { class: elementForm.flexDirection, style: { marginTop: getPx(4), marginBottom: getPx(6), height:getPx(4), display: panelFooterDisplay } },
		  	h(HTMLConstants.HR, { style: { padding: getPx(0), margin: getPx(0), height:getPx(2), width: "100%"} },"")
		  ),

		  h(form.RowTagName, { class: elementForm.flexDirection, style: { height: getPx(elementForm.elementCheckboxRowHeight), alignItems:"center" } },
			 h("span", { style: { width: getPx(labelBeforeCheckboxesWidth), marginRight: getPx(labelBeforeCheckboxesMargin), overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"  } }, 
			 "Constraints"),
			 h("span", { style: { width: getPx(checkboxLabelWidth), overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", cursor: "pointer"  }, 
			 	title:"Center Horizontally\nShift+Click to center horizontally now",
			 	onclick(e) { e.shiftKey ? centerItemsHorizontally(e) : elementFormCheckboxLabelClickHandler(elementForm.centerHorizontallyCheckbox)} }, 
			 "Horizontal"),
			 elementForm.centerHorizontallyCheckbox = h("input", { id:"centerHorizontallyCheckbox", uxpEditLabel:"Set Horizontal Center", type: "checkbox", checked: false, title: "Center the element horizontally in it's container", 
					onchange(e) { updateElementModelAndSave() }}),
			 h("span", { style: checkboxSpacerStyles }, ""),
			 h("span", { style: { width: getPx(checkboxLabelWidth), overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", cursor: "pointer"  }, 
			 	title:"Center Vertically\nShift+Click to center vertically now",
			 	onclick(e) { e.shiftKey ? centerItemsVertically(e) : elementFormCheckboxLabelClickHandler(elementForm.centerVerticallyCheckbox) } }, 
			 "Vertical"),
			 elementForm.centerVerticallyCheckbox = h("input", { id:"centerVerticallyCheckbox", uxpEditLabel:"Set Vertical Center", type: "checkbox", checked: false, title: "Center the element vertically in it's container", 
			 	onchange(e) { updateElementModelAndSave() }}),
		  ),

		  /**  CONSTRAIN OPTIONS  ***********************/
		  h(form.RowTagName, { class: elementForm.flexDirection, style: { height: getPx(elementForm.elementCheckboxRowHeight), alignItems:"center" } },
			 h("span", { style: { width: getPx(labelBeforeCheckboxesWidth), marginRight: getPx(labelBeforeCheckboxesMargin) } }, ""),
			 h("span", { style: { width: getPx(checkboxLabelWidth), cursor: Styles.POINTER }, 
			 	title:"Anchor to the left\nShift+Click to anchor to the left edge now",
			 	onclick(e) { e.shiftKey ? leftItems(e) : elementFormCheckboxLabelClickHandler(elementForm.constrainLeftCheckbox) } }, 
			 "Left"),
			 elementForm.constrainLeftCheckbox = h("input", { id:"constrainLeftCheckbox", uxpEditLabel:"Edit Left Constraint", type: "checkbox", checked: false, title: "Anchor the element to the left of it's container", 
			 	onchange(e) { updateElementModelAndSave() } } ),
			 h("span", { style: checkboxSpacerStyles }, ""),
			 h("span", { style: { width: getPx(checkboxLabelWidth), cursor: Styles.POINTER }, 
			 	title:"Anchor to the top\nShift+Click to anchor to the top edge now",
			 	onclick(e) { e.shiftKey ? topItems(e) : elementFormCheckboxLabelClickHandler(elementForm.constrainTopCheckbox) }  }, 
			 "Top"),
			 elementForm.constrainTopCheckbox = h("input", { id:"constrainTopCheckbox", uxpEditLabel:"Edit Top Constraint", type: "checkbox", checked: false, title: "Anchor the element to the top edge of it's container", 
			 	onchange(e) { updateElementModelAndSave() }}),
		  ),

		  h(form.RowTagName, { class: elementForm.flexDirection, style: { height: getPx(elementForm.elementCheckboxRowHeight), alignItems:"center" } },
			 h("span", { style: { width: getPx(labelBeforeCheckboxesWidth), marginRight: getPx(labelBeforeCheckboxesMargin) } }, ""),
			 h("span", { style: { width: getPx(checkboxLabelWidth), cursor: Styles.POINTER }, 
			 	title:"Anchor to the bottom\nShift+Click to anchor to the bottom edge now",
			 	onclick(e) { e.shiftKey ? bottomItems(e) : elementFormCheckboxLabelClickHandler(elementForm.constrainBottomCheckbox) } }, 
			 "Bottom"),
			 elementForm.constrainBottomCheckbox = h("input", { id:"constrainBottomCheckbox", uxpEditLabel:"Edit Bottom Constraint", type: "checkbox", checked: false, title: "Anchor the element to the bottom of it's container", 
			 	onchange(e) { updateElementModelAndSave() }}),
			 h("span", { style: checkboxSpacerStyles }, ""),
			 h("span", { style: { width: getPx(checkboxLabelWidth), cursor: Styles.POINTER }, 
			 	title:"Anchor to the right\nShift+Click to anchor to the right edge now",
			 	onclick(e) { e.shiftKey ? rightItems(e) : elementFormCheckboxLabelClickHandler(elementForm.constrainRightCheckbox) } }, 
			 "Right"),
			 elementForm.constrainRightCheckbox = h("input", { id:"constrainRightCheckbox", uxpEditLabel:"Edit Right Constraint", type: "checkbox", checked: false, title: "Anchor the element to the right edge of it's container", 
			 	onchange(e) { updateElementModelAndSave() }}),
		  ),

		  h(form.RowTagName, { class: elementForm.flexDirection, style: { marginTop: getPx(4), marginBottom: getPx(6), height:getPx(4), display: panelFooterDisplay } },
		  	h(HTMLConstants.HR, { style: { padding: getPx(0), margin: getPx(0), height:getPx(2), width: "100%"} },"")
		  ),

		  /**  CONVERT TO IMAGE CONSOLIDATE OPTIONS  ***********************/
		  h(form.RowTagName, { class: elementForm.flexDirection, style: { height: getPx(elementForm.elementCheckboxRowHeight), alignItems:"center" } },
		  h("span", { style: { width: getPx(labelBeforeCheckboxesWidth), marginRight: getPx(labelBeforeCheckboxesMargin), overflow: "hidden", whiteSpace: "nowrap", textOverflow: "fade" } }, 
		  "Options"),
			 h("span", { style: { width: getPx(checkboxLabelWidth), overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", cursor: Styles.POINTER }, title:"",
			 	onclick(e) { elementFormCheckboxLabelClickHandler(elementForm.exportAsStringCheckbox) } }, 
			 "Export as string"), 
			 elementForm.exportAsStringCheckbox = h("input", { id:"exportAsStringCheckbox", uxpEditLabel:"Export as String", type: "checkbox", checked: false, title: "Export as string in a script", 
				onchange(e) { updateElementModelAndSave() }}),
			 elementForm.consolidateStylesCheckbox = h("input", { id:"consolidateStylesCheckbox", uxpEditLabel:"Set Consolidate Styles", type: "checkbox", checked: false, 
			 	title: "Allow text elements to inherit common styles from containers", style: {display: Styles.NONE},
				onchange(e) { updateElementModelAndSave() }}),
			 h("span", { style: checkboxSpacerStyles }, ""),
			 h("span", { style: { width: getPx(checkboxLabelWidth), overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", cursor: Styles.POINTER }, title:"Export as image",
				onclick(e) { elementFormCheckboxLabelClickHandler(elementForm.convertToImageCheckbox) } }, 
			 "Export as image"),
				elementForm.convertToImageCheckbox = h("input", { id:"convertToImageCheckbox", uxpEditLabel:"Export as Image", type: "checkbox", checked: false,
				onchange(e) { updateElementModelAndSave() } }),
		  ),

		  /**  DEBUG ELEMENT  ***********************/
		  h(form.RowTagName, { class: elementForm.flexDirection, style: { height: getPx(elementForm.elementCheckboxRowHeight), alignItems:"center" } },
			h("span", { style: { width: getPx(labelBeforeCheckboxesWidth), marginRight: getPx(labelBeforeCheckboxesMargin)  }}, ""),
			h("span", { style: { width: getPx(checkboxLabelWidth), overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", cursor: Styles.POINTER }, title:"",
				onclick(e) { elementFormCheckboxLabelClickHandler(elementForm.debugElementCheckbox) } }, 
			"Debug element"), 
			elementForm.debugElementCheckbox = h("input", { id:"debugElementCheckbox", uxpEditLabel:"Set Debug Element", type: "checkbox", checked: false, title: "Show debug information for selected element in the console", 
				onchange(e) { updateElementModelAndSave() }}),
			h("span", { style: checkboxSpacerStyles }, ""),
			h("span", { style: { width: getPx(checkboxLabelWidth), overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", cursor: Styles.POINTER }, title:"",
				onclick(e) { elementFormCheckboxLabelClickHandler(elementForm.showOutlineCheckbox) } }, 
			"Show outline"), 
			elementForm.showOutlineCheckbox = h("input", { id:"showOutlineCheckbox", uxpEditLabel:"Set Outline", type: "checkbox", checked: false, title: "Show a red dashed outline around the element", 
			  onchange(e) { updateElementModelAndSave() }}),
		  ),

		  /**  DISPLAY ELEMENT  ***********************/
		  h(form.RowTagName, { class: elementForm.flexDirection, style: { height: getPx(elementForm.elementCheckboxRowHeight), alignItems:"center" } },
			h("span", { style: { width: getPx(labelBeforeCheckboxesWidth), marginRight: getPx(labelBeforeCheckboxesMargin), overflow: "hidden", whiteSpace: "nowrap", textOverflow: "fade" } }, ""),
			h("span", { style: { width: getPx(checkboxLabelWidth), cursor: Styles.POINTER }, 
				title:"Show element\nShift+click to toggle visibility now", 
				onclick(e) { e.shiftKey ? toggleLayerVisibility(e) : elementFormCheckboxLabelClickHandler(elementForm.displayCheckbox)} }, 
			"Displayed"), 
			elementForm.displayCheckbox = h("input", { id:"displayCheckbox", uxpEditLabel:"Change display", type: "checkbox", checked: false, title: "Sets the display style to none when unchecked", 
				onchange(e) { updateElementModelAndSave() }}),
			h("span", { style: checkboxSpacerStyles }, ""),
			elementForm.exportCheckboxLabel = h("span", { style: { width: getPx(checkboxLabelWidth), cursor: Styles.POINTER }, title:"",
				onclick(e) { elementFormCheckboxLabelClickHandler(elementForm.exportCheckbox) } }, 
			"Export"), 
			elementForm.exportCheckbox = h("input", { id:"exportCheckbox", uxpEditLabel:"Export the element", type: "checkbox", checked: false, title: "When unchecked the element is not exported", 
			  onchange(e) { updateElementModelAndSave() }}),
		  ),
		  
		  /**  CONSTRAIN OPTIONS  ***********************/
		  h(form.RowTagName, { class: elementForm.flexDirection, style: { paddingTop: getPx(1), height:getPx(4), display: displayed } },
			 elementForm.messageLabel = h("span", { style: { textAlign:"center", width: getPx(labelWidth), flex: "1" } }, "")
		  ),

		  /**  ELEMENT OPTIONS FOOTER  ***********************/
		  h("footer", { class: elementForm.flexDirection, style: { display: displayed },  },

		  	 elementForm.helpButton = h("a", { style: form.helpButtonStyle, title: "Open the help documentation", 
				onclick(e) { openDocumentation() } }, "?"),
		    elementForm.resetElementButton = h("button", { id:"resetElementButton", uxpEditLabel:"Reset Element", uxpVariant: "primary", title: "Reset options", 
			   onclick(e){ resetElementModel(globalModel.selectedElement, globalModel.selectedModel) } }, "Reset"),
			 elementForm.copyElementButton = h("button", { id:"copyElementButton", uxpEditLabel:"Copy Page Markup", uxpVariant: "primary", title: "Copy both the markup and styles for this element to the clipboard", 
				onclick(e){ copyPageToClipboard(true, e) } }, elementForm.copyPageLabel),
			 elementForm.copyMarkupButton = h("button", { id:"copyMarkupButton", uxpEditLabel:"Copy Markup", uxpVariant: "primary", title: "Copy the element markup to the clipboard", 
				onclick(e){ copyMarkupToClipboard(true, e) } }, elementForm.copyMarkupLabel),
			 elementForm.copyCSSButton = h("button", { id:"copyCSSButton", uxpEditLabel:"Copy CSS", uxpVariant: "primary", title: "Copy the element styles to the clipboard ", 
				onclick(e){ copyCSStoClipboard(true, e)} }, elementForm.copyCSSLabel),
			 h("span", { style: { width: getPx(28), flex: "1" } }, ""),
			 elementForm.cancelButton = h("button", { id:"cancelButton", uxpEditLabel:"Cancel Form", uxpVariant: "primary", onclick(e) { cancelElementForm(e) } }, "Cancel"),
			 elementForm.submitButton = h("button", { id:"submitButton", uxpEditLabel:"Commit Form", uxpVariant: "cta", onclick(e){ submitElementForm(e); } }, "Close")
		  ),

		  /**  PANEL OPTIONS FOOTER  ***********************/
		  
		  h(form.RowTagName, { class: elementForm.flexDirection, style: { marginTop: getPx(4), marginBottom: getPx(6), height:getPx(4), display: panelFooterDisplay } },
		  	h(HTMLConstants.HR, { style: { padding: getPx(0), margin: getPx(0), height:getPx(2), width: "100%"} },"")
		  ),

		  h(HTMLConstants.FOOTER, { class: elementForm.flexDirection, 
				style: { flexWrap: Styles.WRAP, display: panelFooterDisplay, margin:getPx(4), padding:getPx(0) }  },
			h("span", { style: { minWidth:getPx(0), overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", cursor: Styles.POINTER },
				title:"Export on changes\nShift+Click to show panel UI labels",
				onclick(e) { togglePanelLabels(e) } }, 
			"Auto export"),
			
			elementForm.helpIcon = h("a", { style: {display:Styles.NONE}, title: "Open the help documentation", 
				onclick(e) { openDocumentation(e) } }, "?"),
			elementForm.exportOnUpdateToggle = h("img", { id:"exportOnUpdateToggle", uxpEditLabel: "Export on Update", 
				src: form.toggleOff, height: getPx(form.iconWidth), title: "Export on any changes", 
				style: { marginLeft:getPx(8), cursor: Styles.POINTER},
				onclick(e) { exportOnUpdateCheckbox(e) } }, ""),
			h("span", { style: { flex: "1" } }, ""),
			elementForm.exportingIcon = h("img", { id:"exportingIcon", uxpEditLabel: "Exporting Icon", 
				src: form.exportIconPath, height: getPx(form.iconWidth-4), title: "Exporting Icon", 
				style: { display: Styles.NONE, smarginLeft:getPx(12) }}, ""),
			elementForm.beforeExportLabel = h("span", { style: { flex: "1", marginRight: getPx(8) } }, ""),

			elementForm.exportLabel = h("a", { id:"exportLabel", uxpEditLabel:"Export", uxpVariant: "primary",
				title: "Export artboard", 
				style: {cursor: Styles.POINTER, color: "#585858", title: "Export artboard"},
				async onclick(e){ await exportFromElementPanel(e); } }, 
			"Export"),

			h("span", { style: { padding: "0px 8px" } }, "/"),

			elementForm.showMarkupLabel = h("a", { id:"markupLabel", uxpEditLabel:"Show markup", uxpVariant: "primary",
				title: "Show selected layer markup", 
				style: {cursor: Styles.POINTER, color: "#585858", title: "Show markup"},
				async onclick(e){ await showMarkupInPanel(); } }, "Markup"),

			h("span", { style: { padding: "0px 8px" } }, "/"),
			
			elementForm.showCSSLabel = h("a", { id:"cssLabel", uxpEditLabel:"Show CSS", uxpVariant: "primary",
				title: "Show selected layer CSS", 
				style: {cursor: Styles.POINTER, color: "#585858", title: "Show CSS"},
				async onclick(e){ await showMarkupInPanel(true); } }, "CSS"),

		  ),

		  elementForm.exportMessageRowBorder = h(form.RowTagName, { class: elementForm.flexDirection, 
				style: { marginTop: getPx(8), marginBottom: getPx(0), height:getPx(4), display: Styles.NONE } },
				h(HTMLConstants.HR, { style: { padding: getPx(0), margin: getPx(0), height:getPx(2), width: "100%"} },"")
		  ),

		  elementForm.exportMessageRow = h(form.RowTagName, { class: elementForm.flexDirection, 
					style: { display: Styles.NONE, fontSize: getPx(10.5), margin: getPx(0), padding: getPx(0), height: getPx(22), 
						alignItems: "center", color:"#686868" }  },

			  elementForm.exportErrorsIcon = h("img", { src: form.notFoundAltIconPath, height: getPx(form.iconWidth-3), width: getPx(form.iconWidth-3), title: "Export errors occured",
				style: {marginLeft: getPx(5), marginRight: getPx(10)}}, ""),
			  elementForm.verifyDiffIcon = h("img", { src: form.verifyEllipsisIconPath, 
					height: getPx(form.iconWidth), width: getPx(form.iconWidth), title: "Passed expected output verification",
					style: {display:"none"} }, ""),
			  elementForm.diffLink = h("a", { href:"", title: "Open diff link", style: form.smallButtonStyle, onclick(e) { copyDiffURLtoClipboard(e)} }, "diff"),
			  elementForm.copyURLLink = h("a", { href:"", title: "Copy URL to clipboard", style: form.smallButtonStyle, onclick(e) { copyURLtoClipboard(true, e)}}, "copy"),
			  elementForm.openHostLink = h("a", { href:"", title: "Open server", style: form.smallButtonStyle}, "server"),
			  elementForm.openFolderLink = h("a", { href:"", title: "Open folder", style: form.smallButtonStyle }, "folder"),
			  elementForm.openRURLLink = h("a", { href:"", title: "Open in browser", style: form.smallButtonStyle }, "url"),
			  elementForm.openURLLink = h("a", { href:"", title: "Open in browser", style: form.smallButtonStyle }, "url"),
			  elementForm.uploadLink = h("a", { href:"", style: form.buttonStyle, onclick(e) { uploadArtboard(e)} }, 
			  "upload"),
			  elementForm.exportMessageLabel = h("span", { style: { flex:"1", textAlign: "right", 
			  		overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" } }, ""),
		  ),

		  elementForm.exportMessageItemsRow = h(form.RowTagName, { class: elementForm.flexDirection, 
					style: { display: Styles.NONE, fontSize: getPx(10.5), margin: getPx(0), padding: getPx(0),  
						alignItems: "center", color: "#686868" }  }),
		)
		)
	);

	elementForm.mainDialog = elementDialog;

	var cssString = `input[type=checkbox] { cursor: pointer; border: 0px dashed red }`;
	cssString += ` .imageHover:hover { border: 1px solid gainsboro }`;
	cssString += ` .redFormItem { color: #EA0000 !important; fontWeight: normal}`;
	cssString += ` .isClickable { color: #3890FA !important; outline: 0px solid #3890FA; cursor: pointer  }`;
	cssString += ` .isClickable:hover { color: #ffffff !important; background-color: #3890FA; cursor: pointer }`;
	cssString += ` .tooltips:hover::after {
		position: absolute;
		content: attr(tooltip);
		top: 2.5em;
		right: 2em;
		background-color: #333;
		color: white;
		font-size: 12px;
		padding: .25em .5em;}`
	cssString += ` .fullOpacity:hover { opacity: 1 !important}`;
	cssString += ` .outlineHover:hover { outline: 1px solid gainsboro }`;
	cssString += ` input[type=checkbox]:hover { outline: 1px solid gainsboro }`;
	cssString += ` a:hover { text-decoration: underline }`;
	cssString += ` .footerRowLinks { text-decoration: none }`;
	cssString += ` .footerRowLinks:hover { text-decoration: underline }`;
	cssString += ` .small { color: rgba(0,0,0,.35); font-size: 10px; }`;
	cssString += ` span.changedProperties { font-weight: bold; }`;
	cssString += ` select.changedProperties,input.changedProperties { border-left:2.5px solid rgba(0,0,0,.20) !important; }`;
	cssString += ` .navigationStyle { 
		marginRight: 5px;
		paddingBottom: 2px;
		color: #AFAFAF;
		fontWeight: bold; 
		fontSize: 13px;}`;

	const styleTag = document.createElement("style");
	styleTag.innerHTML = cssString;
	//document.head.insertAdjacentElement('beforeend', styleTag);
	elementForm.mainForm.insertAdjacentElement('beforeend', styleTag);

	if (globalModel.exportOnUpdate) {
		enableToggleCheckbox(elementForm.exportOnUpdateToggle, true);
	}

	DebugSettings.outlineOnClick(elementDialog);

	return elementDialog;
}


  let settingsDialog =
	 h("dialog", {name:"Settings"},
		h("form", { method:"dialog", style: { width: getPx(form.settingsDialogWidth) }, submitSettingsForm },
		  h("label", { class: "row", alignItems:"bottom" },
			 h("h1", "Settings"),
			 h("span", { style: { flex: "1", marginTop:getPx(6) } }, ""),
			 settingsForm.nameLabel = h("span", { style: { marginTop:getPx(6)} }, ""),
		  ),
		  h("hr", ""),
		  h("label", { class: "row", alignItems:"center" },
			 h("span", { style: { width: getPx(form.mainDialogLabelWidth) } }, "ID"),
			 settingsForm.idInput = h("input", { uxpQuiet: true, placeholder:"Id on the page", style:{ flex: "1" },
			 onchange(e) { updateElementModelAndSave() } } ),
		  ),
		  h("footer",{ class: "row" },
			 settingsForm.copyElementButton = h("button", { uxpVariant: "primary", title: "Copy both the markup and styles for this element to the clipboard", 
				onclick(e){ copyPageToClipboard(true) } }, "Copy Element "),
			 settingsForm.copyMarkupButton = h("button", { uxpVariant: "primary", title: "Copy the element markup to the clipboard", 
				onclick(e){ copyMarkupToClipboard(true) } }, "Copy Markup "),
			 settingsForm.copyCSSButton = h("button", { uxpVariant: "primary", title: "Copy the element styles to the clipboard ", 
				onclick(e){ copyCSStoClipboard(true)} }, "Copy CSS "),
			 h("span", { style: { width: getPx(48) } }, ""),
			 settingsForm.cancelButton = h("button", { uxpVariant: "primary", onclick(e) { cancelElementForm() } }, "Cancel"),
			 settingsForm.submitButton = h("button", { uxpVariant: "cta", type: "submit", onclick(e){ submitSettingsForm(e); } }, "Close")
		  )
		)
	 );

async function browseForExportFolder(event = null, updateMainForm = true, saveChanges= true ) {
  	var b = debugModel.browseForFolder;
	var result = null;

  	try {

		if (globalModel.requestingFolder) {
			return false;
		}

		globalModel.requestingFolder = true;
		result = await fileSystem.getFolder();
		globalModel.requestingFolder = false;
		form.exportFolder = result;
		globalArtboardModel.exportFolder = form.exportFolder;
		var selectedFolder = globalArtboardModel.exportFolder;

		if (selectedFolder && mainForm.exportFolderInput!=null) {

			if (updateMainForm) {
				b && log("Updating main form export input");
				mainForm.exportFolderInput.value = selectedFolder.nativePath;
			}

			if (saveChanges) {
				b && log("Saving to artboard model and preferences");
				await updateArtboardModelAndSave(event);
			}
		}
		else {
			b && log("Export folder canceled");
		}
	}
	catch (error) {

		log(error.stack);
		addError("Export Folder Error", error);
		return result;	
	}

	return result;
}

async function resetDocumentScaleInput(event) {
  mainForm.scaleInput.value = "";
  mainForm.scaleInput.focus();
  await updateArtboardModelAndSave(event);
}

/**
 * Find an existing option in a list of options. 
 * Pass in an value to find and a property and an additional property if it's an object
 * @param {Array} options 
 * @param {*} value 
 * @param {String} property property on the existing option - looks like this may always be "value"?
 * @param {String} property2 additional property on the existing option
 **/
function getListOption(options, value, property = null, property2 = null) {

	for(var i=0;i<options.length;i++) {
		let option = options[i];

		if (property2) {
			if (option[property][property2]==value) {
				return option;
			}
		}
		else if (property) {
			if (option[property]==value) {
				return option;
			}
		}
		else if (option==value) {
			return option;
		}
	}

	return null;
}

/**
 * Select a list item
 * @param {HTMLSelectElement} list 
 **/
function selectListOption(list, option, value = null, property = null, property2 = null) {

	if (property2) {
		option = getListOption(list.options, value, property, property2);
		if (option) {
			list.value = option.value;
		}
	}
	else if (property) {
		option = getListOption(list.options, value, property);
		if (option) {
			list.value = option.value;
		}
	}
	else if (option) {
		list.value = option.value;
	}
	else {
		list.value = value;
	}

}

/**
 * Select the list option passed in
 * @param {HTMLSelectElement} list 
 **/
function clearListOptions(list) {
	list.innerHTML = "";
}

async function resetDocumentWidthInput(event) {
  mainForm.widthInput.value = "";
  mainForm.widthInput.focus();
  await updateArtboardModelAndSave(event);
}

async function resetDocumentHeightInput(event) {
	event.preventDefault();
	mainForm.heightInput.value = "";
	mainForm.heightInput.focus();
	await updateArtboardModelAndSave(event);
}

/////////////////////////////////
// UPDATE ELEMENT VALUES
/////////////////////////////////

async function resetElementHeightInput() {
  elementForm.heightInput.value = "";
  elementForm.heightInput.focus();
  await updateElementModelAndSave();
}

async function resetElementWidthInput() {
  elementForm.widthInput.value = "";
  elementForm.widthInput.focus();
  await updateElementModelAndSave();
}

async function resetElementOverflow() {
  elementForm.overflowList.value = getListOption(elementForm.overflowList.options, OverflowOptions.HIDDEN);
  elementForm.overflowList.focus();
  await updateElementModelAndSave();
}

async function headerLabelClick(event) {

	globalModel.liveExport = !globalModel.liveExport;
	updateExportArtboardsLabel();

	event.stopImmediatePropogation();
}

/**
 * Changes the behavior of the panel to export on document update
 * @param {Event} event 
 **/
async function exportOnUpdateCheckbox(event) {
	globalModel.exportOnUpdate = !globalModel.exportOnUpdate;

	// turn on
	if (globalModel.exportOnUpdate) {
		enableToggleCheckbox(elementForm.exportOnUpdateToggle);
		await exportFromAutoUpdate();
	}
	else {
		enableToggleCheckbox(elementForm.exportOnUpdateToggle, false);
	}

}

/**
 * Update the toggle UI
 * @param {Object} toggle image that is treated as a toggle switch 
 * @param {Boolean} enabled set to true to enable
 **/
function enableToggleCheckbox(toggle, enabled = true) {

	if (enabled) {
		toggle.src = form.toggleOn;
	}
	else {
		toggle.src = form.toggleOff;
	}
}

/**
 * Select the parent of the selected element 
 * @param {*} event 
 **/
async function selectParentElement(event) {
	var sceneNode = globalModel.selectedElement;

	if (sceneNode && sceneNode.parent) {

		showPanelMessage("Can't select parent element through panel")
		return;

		try {
			// Error: Cannot select node outside the current edit context’s scope

			editDocument( async() => {
				globalModel.selection.items = [sceneNode.parent];
				await initializeGlobalModel(globalModel.selection, globalModel.documentRoot, globalModel.showingElementDialog, globalModel.selectedArtboard, globalModel.showingPanel);
				updateElementForm(globalModel.selectedModel);
			})
		}
		catch(error) {
			log("Error:" + error.stack);
			// ignore error for now
		}
	}
}

/**
 * Select the previous sibling of the selected element 
 * @param {*} event 
 **/
async function selectPreviousSibling(event) {
	var sceneNode = globalModel.selectedElement;


	if (sceneNode) {
		var node = getPreviousSceneNode(sceneNode);

		if (node==null) {
			return null;
		}

		try {
			
			if (globalModel.showingPanel) {
				editDocument( async() => {
					// Error: Cannot select node outside the current edit context’s scope
					globalModel.selection.items = [node];
					await initializeGlobalModel(globalModel.selection, globalModel.documentRoot, globalModel.showingElementDialog, globalModel.selectedArtboard, globalModel.showingPanel);
					updateElementForm(globalModel.selectedModel);
				})
			}
			else {
				// not supported in dialog
				//globalModel.selection.items = [node];
				//await initializeGlobalModel(globalModel.selection, globalModel.documentRoot, globalModel.showingElementDialog, globalModel.selectedArtboard, globalModel.showingPanel);
				//updateElementForm(globalModel.selectedModel);
			}
		}
		catch(error) {
			log("Error:" + error.stack);
		}
	}
	await animate(100, 30, resetMoveSpan, moveSpan, elementForm.selectionLabel, event);
	//setSpan(elementForm.selectionLabel);

}

/**
 * Select the previous sibling of the selected element 
 * @param {*} event 
 **/
async function selectNextSibling(event) {
	var sceneNode = globalModel.selectedElement;

	if (sceneNode && sceneNode.parent) {
		var node = getNextSceneNode(sceneNode);

		if (node==null) {
			return null;
		}

		try {
			// Error: Cannot select node outside the current edit context’s scope
			if (globalModel.showingPanel) {
				editDocument( async() => {
					globalModel.selection.items = [node];
					await initializeGlobalModel(globalModel.selection, globalModel.documentRoot, globalModel.showingElementDialog, globalModel.selectedArtboard, globalModel.showingPanel);
					updateElementForm(globalModel.selectedModel);
				})
			}
			else {
				// not supported in dialog
				//globalModel.selection.items = [node];
				//await initializeGlobalModel(globalModel.selection, globalModel.documentRoot, true, globalModel.selectedArtboard, false);
				//updateElementForm(globalModel.selectedModel);
			}
		}
		catch(error) {
			// Cannot start another edit from UI event 'click' in panel plugin  while editDocument is already executing
			// object is selected but above error still occurs
			log("Error:" + error.stack);
		}
	}

	await animate(100, 30, resetMoveSpan, moveSpan, elementForm.selectionLabel, event);
	//setSpan(elementForm.selectionLabel);

}

/**
 * Select the previous sibling of the selected element 
 * @param {*} event 
 **/
async function selectDescendentElement(event) {
	var sceneNode = globalModel.selectedElement;

	if (globalModel.selectedElement.parent) {
		var node = getFirstDescendantNode(sceneNode);

		// if symbol then ignore error 
		if (node==null) {
			return null;
		}

		try {

			editDocument( async() => {

				try {
					if (globalModel.showingPanel) {
						globalModel.selection.items = [node];
						await initializeGlobalModel(globalModel.selection, globalModel.documentRoot, globalModel.showingElementDialog, globalModel.selectedArtboard, globalModel.showingPanel);
						updateElementForm(globalModel.selectedModel);
					}
					else {
						// not supported in dialog
						//globalModel.selection.items = [node];
						//await initializeGlobalModel(globalModel.selection, globalModel.documentRoot, globalModel.showingElementDialog, globalModel.selectedArtboard, globalModel.showingPanel);
						//updateElementForm(globalModel.selectedModel);
					}
				}
				catch(error) {
					var string = error.toString();

					if (string.includes("Cannot select node outside the current edit")) {	
						// ignore
					}
					else {
						log("Error:" + error.stack);
					}
				}
			})
		}
		catch(error) {
			var string = error.toString();

			// if symbol then ignore error 
			// Error: Cannot select node outside the current edit context’s scope
			if (string.includes("Cannot select node outside the current edit context’s scope")) {
				// ignore
			}
			else {
				log("Error:" + error.stack);
			}
		}
	}
	await animate(100, 30, resetMoveSpan, moveSpan, elementForm.selectionLabel, event);
	//setSpan(elementForm.selectionLabel);

}

/**
 * Show name of element to be selected when over selection buttons
 * @param {*} event 
 **/
function selectionMouseOver(event) {
	var selectedElement = globalModel.selectedElement;
	var target = event.target;
	var maxSizeOfLabel = 30;
	var message = "";
	
	if (target==elementForm.selectNextSiblingLabel) {
		message = getShortString(elementForm.selectNextSiblingLabel.style.title, maxSizeOfLabel);
		elementForm.selectionIcon.src = globalModel.nextSiblingIcon;
	}
	else if (target==elementForm.selectPreviousSiblingLabel) {
		message = getShortString(elementForm.selectPreviousSiblingLabel.style.title, maxSizeOfLabel);
		elementForm.selectionIcon.src = globalModel.previousSiblingIcon;
	}
	else if (target==elementForm.selectDescendentLabel) {
		message = getShortString(elementForm.selectDescendentLabel.style.title, maxSizeOfLabel);
		elementForm.selectionIcon.src = globalModel.descendantIcon;
	}
	else {
		elementForm.selectionIcon.src = "";
	}

	setSpan(elementForm.selectionLabel, message);

	if (elementForm.selectionIcon.src=="") {
		hideElement(elementForm.selectionIcon);
	}
	else {
		showBlockElement(elementForm.selectionIcon);
	}

}

/**
 * Show name of element to be selected when over selection buttons
 * @param {*} event 
 **/
function selectionMouseOut(event) {
	setSpan(elementForm.selectionLabel);
	hideElement(elementForm.selectionIcon);
}

/**
 * Set span content
 * @param {HTMLElement} span to set value to
 * @param {String} value value to set
 */
function setSpan(span, value = "") {
	span.innerHTML = getString(value);
}

function resetMoveSpan(span, event) {
	span.style.marginRight = getPx(8);
	setSpan(elementForm.nameLabel, span.style.title);

	if (event) {
		selectionMouseOver(event);
	}
	else {
		setSpan(span);
	}
}

function moveSpan(span) {
	//elementForm.nameLabel.innerHTML = "";
	var margin = span.style.marginRight;

	if (margin==null) {
		margin = 0;
	}
	else {
		margin = parseInt(margin);
	}

	margin += 8;

	span.style.marginRight = getPx(margin);
}

/**
 * Animate something. The complete event and the call forward event get the same arguments
 */
async function animate(duration, framerate, complete, callforward, ...args) {
	var time = getTime();
	var elapsed = 0;
	
	while (elapsed<duration) {
		elapsed = getTime() - time;

		callforward(...args);
		
		await sleep(framerate);
		
	}

	if (complete!=null) {
		complete(...args);
	}
}

/**
 * Export called from element panel
 * @param {*} event 
 **/
async function exportFromElementPanel(event) {

	if (event.shiftKey) {

		globalModel.exportFromElementPanel = true;

		await showExportAllMainDialog(globalModel.selection, globalModel.documentRoot);

		globalModel.exportFromElementPanel = false;

		event.stopPropogation();
		event.stopImmediatePropogation();
	}
	else {
		// export
		await quickExport(globalModel.selection, globalModel.documentRoot, true, true);
		
		// recreate the element form again 
		var waiting = await showElementDialog(globalModel.selection, globalModel.documentRoot, true);
		event.stopImmediatePropogation();
	}
}

async function submitElementForm(event) {
  var b = debugModel.submitElementForm;
  b && log("Save element form");

  event.preventDefault();
  
  try {
	  
	  if (GlobalModel.supportsPluginData==false) {
		  var selectedElementPreferences = getSelectedModelPreferences(globalModel.selectedElement, globalModel.selectedArtboardModel);
		}
		
		//log("Changed:" + getChangedProperties(globalModel.originalModelPreferences, globalModel.selectedModelPreferences));
		//log("Changed:" + getChangedProperties(globalModel.originalModelPreferences, selectedElementPreferences));
		var promise = await updateElementModelAndSave();
		
		/*
		if (panelNode) {
			await addElementOptionsPanel(panelNode);
		}
		*/

		closeDialog(elementForm.mainDialog);
  }
  catch (error) {
	  log(error.stack);
  }
}

async function submitSettingsForm(event) {
  var b = debugModel.submitMainForm && log("Submit Settings Form()");
  b && log("Submitting settings form");
  await updateSettingsModelAndSave();
  
  b && log("Closing settings form");
  closeDialog(settingsDialog);
}

async function preventClose(event) {
	//submitMainForm(event);
  	event.preventDefault();
}

function preventCloseFromEnter(event) {
  event.preventDefault();
}

async function cancelMainForm() {
  var b = debugModel.submitMainForm && log("Canceling Main Form()");


  closeDialog(mainForm.mainDialog);
}

async function cancelElementForm(event) {
  var b = debugModel.showElementDialog && log("Canceling element form()");
  
  try {
	//var changedProperties = getChangedProperties(globalModel.originalModelPreferences, globalModel.selectedModelPreferences);

		if (globalModel.selectedElement.pluginData!=globalModel.selectedModel.originalPreferencesDataValue) {

			setSceneNodePluginDataValue(globalModel.selectedElement, globalModel.selectedModel.originalPreferencesDataValue);
			//globalModel.selectedElement.pluginData = globalModel.selectedModel.originalPreferencesDataValue;
		}
  }
  catch (error) {
		log("Cancel Element Form Error" + error.stack);
		addError("Cancel Element Form Error", error);
  }

	closeDialog(elementForm.mainDialog);
}

/**
 * Export from main form
 * @param {Event} event 
 * @param {Boolean} browseForFolderIfNeeded 
 **/
async function submitMainForm(event, browseForFolderIfNeeded = false) {
	var b = debugModel.submitMainForm;
	var time = 0;
	var folderResult = null;

	if (globalModel.exporting) {
		return false;
	}
	
	// ignore if enter on text area
	if (event.currentTarget==mainForm.warningsTextarea) {
		b && log("Enter pressed on text area. Form submit prevented");
		event.preventDefault();
		return;
	}
	
	try {
		var isExportFolderFocused = (document.activeElement === mainForm.exportFolderInput);

		if (form.exportFolder==null && isBasicScreenDisplayed()) {
			folderResult = await browseForExportFolder();
			
			// user selected cancel
			if (folderResult==null) {
				return;
			}
		}
		else if (form.exportFolder==null) {
			b && log("No export folder selected");
			var exportMessage = "Please select an export folder";
			hideMainUIMessageControls();
			showExportingLabel(exportMessage);
			mainForm.exportFolderInput.focus();
			event.preventDefault();
			
			if (isExportFolderFocused) {
				b && log("Export input folder focused: " + mainForm.exportFolderInput.focused);
				await browseForExportFolder();
			}
			
			return true;
		}
		else {
			mainForm.messagesLabel.textContent = "";
		}
		
		// prevent dialog from closing
		// this has to be before any async calls
		event.preventDefault();
		
		hideMainUIMessageControls();

		// show label first
		var minimumExportLabelDisplayDuration = globalModel.runPauseDuration;
		 
		// this is returning true even when not connected
		var isConnected = document.isConnected;
		
		showExportingLabel("Exporting... Please wait...");

		mainForm.submitButton.disabled = true;

		await sleep(1);

		var message = "Exported \"" + globalArtboardModel.name + "\" (" + globalModel.exportDuration + "ms)\n";

		if (globalModel.exporting) {
			return false;
		}

		globalModel.exporting = true;
		
		globalModel.startTime = getTime();

		b && log("Step 1 Updating artboard model with form values");
		var update = await updateArtboardModelWithMainFormValues(globalArtboardModel);

		b && log("Step 2 Running");

		// exporting 
		var waiting = await exportare();

		updateHREFLinks();

		globalModel.exportDuration = getTime()-globalModel.startTime;

		if (form.exportFolder) {
			message += "Export directory: " + form.exportFolder.nativePath + "\n";
		}
		
		//message += "At " + new Date().toLocaleTimeString() + " (" + globalModel.exportDuration + "ms)\n";

		await showMainUIMessageControls();

		b && log("Step 3 Showing export messages");
		await showMessages(true, message);

		// TODO:  set to focusedArtboardModel to artboardModel after initializeGlobal()

		b && log("Step 4 Reseting artboard model");
		if (globalModel.selectedArtboard) {
			await resetGlobalModel(globalModel.selectedArtboard);
		}
		else {
			await resetGlobalModel();
		}

		b && log("Step 6 Enabling open location link to " + GlobalModel.lastURLLocation);


		//showLinks();
		
		mainForm.cancelButton.textContent = "Close";

		await showExportingLabel("Export complete", true, null, 1500);
		
		await showMainUIMessageControls();

		globalModel.exporting = false;
		
		mainForm.submitButton.disabled = false;
		
		
		// timeout workaround 
		// give a second to show a processing message 
		// isConnected is returning true even when not connected
		// so it doesn't work when not online - commenting out
		if (isConnected) {
			//request.open('GET', 'http://126.0.0.1', true);
			//request.send();

			var duration = 0;

			// loop for one second
			//while (true) {
			//	duration = getTime() - globalModel.startTime;
				
			//	if (duration>globalModel.runPauseDuration) {
			//		break;
			//	}
			//}
			//request.ontimeout(null);
		}
		else {
			//request.ontimeout(null);
		}

	}
	catch(error) {
		log("Error:" + error.stack);
		addError("Main Form Submit Error", error);
		globalModel.exporting = false;
	}
}

/**
 * Show a message in the main dialog or element dialog
 * @param {String} message 
 * @param {Boolean} timeout show for a specific time
 * @param {String} timeoutMessage message to show if any after a timeout
 * @param {Number} duration how long to show message
 **/
function showExportingLabel(message=null, timeout = false, timeoutMessage = null, duration = 0) {
	duration = duration!=0 ? duration : globalModel.quickExportNotificationDuration;

	if (globalModel.showingElementDialog==false) {
		if (message==null) {
			mainForm.exportLabel.textContent = "";
		}
		else {
			mainForm.exportLabel.innerHTML = message;

			if (timeout) {
				if (mainForm.exportMessageTimeout != null) clearTimeout(mainForm.exportMessageTimeout);
				
				mainForm.exportMessageTimeout = setTimeout(() => {
					mainForm.exportLabel.textContent = timeoutMessage ? timeoutMessage : "";
					
				}, duration);
			}
		}
	}
	else if (elementForm.messageLabel) {

		if (message==null) {
			elementForm.messageLabel.textContent = "";
		}
		else {
			elementForm.messageLabel.textContent = message;

			if (timeout) {
				
				if (elementForm.panelExportMessageTimeout != null) clearTimeout(elementForm.panelExportMessageTimeout);
				
				elementForm.panelExportMessageTimeout = setTimeout(() => {
					elementForm.messageLabel.textContent = timeoutMessage ? timeoutMessage : "";
					
				}, duration);
			}
		}
	}
}

function hideMainUIMessageControls() {
	hideLinks();
}

async function showMainUIMessageControls(showTextarea = false) {

	if (showTextarea && mainForm.warningsTextarea) {
		updateHREFLinks();
	}
}

/**
 * 
 **/
async function resetGlobalModel(selectedArtboard = null) {
  await initializeGlobalModel(globalModel.selection, globalModel.documentRoot, globalModel.showingElementDialog, selectedArtboard, globalModel.showingPanel);
}

function resetArtboardModel(artboardModel) {
  artboardModel.files = [];
  //artboardModel.ids = {};
}

/**
 * Update global values after updating artboard model in the main form
 * @param {ArtboardModel} model 
 */
function updateGlobalModelValues(model) {
  
	if (globalModel.exportToSinglePage) {
		globalModel.embedImages = model.embedImages;
		globalModel.image2x = model.image2x;
		globalModel.imagesExportFolder = model.imagesExportFolder;
	}
	
	globalModel.embedImageColorLimit = model.embedColorLimit;
}

/**
 * Show the artboard preferences in the console and text area
 **/
function showArtboardModelPreferencesInTextArea() {
	var aModel = globalModel.originalArtboardModel;
	var data;

	if (GlobalModel.supportsPluginData) {
		// show only artboard model preferences
		data = aModel.getPreferencesData();
	}
	else {
		// show full preferences
		data = aModel.preferencesData;
	}

	var value = JSON.stringify(data, null, XDConstants.TAB);
	value = object(data, null, 1, false);

	var defaultValue = null;

	try {
		updateArtboardModelAndSave();
	}
	catch(error) {
		log(error);
	}

  showMessagesView("Artboard Settings", value, "The values being saved for the artboard");
}

/**
 * Show the element preferencesin the console and text area
 **/
function showElementModelPreferencesInConsole() {
	if (globalModel.selectedModel==null) {
		return;
	}

	var item = globalModel.selectedElement;
	var selectedModel = globalModel.selectedModel;
	var defaultModel = new Model(item);
	var data = selectedModel.getPreferencesData();
	var value = JSON.stringify(data, null, XDConstants.TAB);
	var changedPropertiesObject = getChangedPropertiesObject(data, defaultModel, [], defaultModel.getPreferencesProperties(true), true, true);
	var numberOfChangedProperties = getNumberOfProperties(changedPropertiesObject);
	
	value = object(data, "Preferences", 1, false);

	if (numberOfChangedProperties<1) {
		value =  "No changed properties.\n\n" + value;
	}
	else {
		value = object(changedPropertiesObject, "Changed properties", 1, false) + "\n\n" + value;
	}

	showMessagesView("Element Settings", value, "The values being saved for the element");
}

/**
 * Returns true if has changed properties
 * @param {SceneNode} item 
 * @param {Model} model 
 */
function getItemHasChangedProperties(item, model) {

	if (model==null) {
		return false;
	}

	var defaultModel = new Model(item);
	var data = model.getPreferencesData();
	var changedPropertiesObject = getChangedPropertiesObject(data, defaultModel, [], defaultModel.getPreferencesProperties(true), true, true);
	var numberOfChangedProperties = getNumberOfProperties(changedPropertiesObject);

	if (numberOfChangedProperties<1) {
		return false;
	}
	
	return true;
}

/**
 * Show the element preferencesin the console and text area
 **/
async function elementHeaderClick() {

	if (globalModel.showingPanel) {
		removeElementForm(panelNode);
		await showElementDialog(globalModel.selection, globalModel.documentRoot, true, false);
		updateElementForm(globalModel.selectedModel);
	}
}

/**
 * Turn exporting back on the selected element
 **/
function excludedElementLabel(e) {
	elementForm.exportCheckbox.checked = true;
	
	updateElementModelAndSave(e);
}

function templateIconHandler(isPanel = false) {

	if (isPanel) {
		showMoreDetails(elementForm.templateIcon)
	}
	else {
		showMoreRoomView("Page Template", globalModel.selectedArtboardModel, "template", globalModel.selectedArtboardModel["template"], null, globalModel.template, null, true, true, true, false, updateArtboardModelAndSave);
	}
}

function stylesheetTemplateIconHandler(isPanel = false) {
	var selectedElement = globalModel.selectedElement;
	var selectedModel = globalModel.selectedModel;

	if (isPanel) {
		showMoreDetails(elementForm.styleTemplateIcon);
	}
	else {

		//if (getIsArtboard(selectedElement)) {
		showMoreRoomView("Stylesheet Template", globalModel.selectedArtboardModel, "stylesheetTemplate", globalModel.selectedArtboardModel["stylesheetTemplate"], null, null, null, true, true, true, false, updateArtboardModelAndSave);
		//}
		//else {
		//	showMoreRoomView("Styles Template", selectedModel, "stylesheetTemplate", selectedModel["stylesheetTemplate"], null, null, null, true, true, true, false, updateArtboardModelAndSave);
		//}
	}
}

function scriptTemplateIconHandler(isPanel = false) {
	if (isPanel) {
		showMoreDetails(elementForm.scriptTemplateIcon)
	}
	else {
		showMoreRoomView("Script Template", globalModel.selectedArtboardModel, "scriptTemplate", globalModel.selectedArtboardModel["scriptTemplate"], null, null, null, true, true, true, false, updateArtboardModelAndSave);
	}
}

function expectedOutputIconHandler() {
	showMoreRoomView("Expected Page Output", globalModel.selectedArtboardModel, "expectedOutput", globalModel.selectedArtboardModel["expectedOutput"], "What you expect the HTML output to be", null, null, true, true, true, false, updateArtboardModelAndSave);
}

function expectedCSSOutputIconHandler() {
	showMoreRoomView("Expected CSS Output", globalModel.selectedArtboardModel, "expectedCSSOutput", globalModel.selectedArtboardModel["expectedCSSOutput"], "What you expect the stylesheet output to be", null, null, true, true, true, false, updateArtboardModelAndSave);
}

function expectedScriptOutputIconHandler() {
	showMoreRoomView("Expected Script Output", globalModel.selectedArtboardModel, "expectedScriptOutput", globalModel.selectedArtboardModel["expectedScriptOutput"], "What you expect the script output to be", null, null, true, true, true, false, updateArtboardModelAndSave);
}

function showHostOptions(event) {

	showHostForm(event, closeHostForm);
}

function testServerPath(event) {
	var serverPath = mainForm.serverInput.value;
	mainForm.serverVerifyIcon.style.display = Styles.NONE;

	if (event.shiftKey) {
		showHostForm(event, closeHostForm);
		return;
	}

	fetch(serverPath).then(function(response) {
		//log("Response:", response)
		var status = response.status;
		var ok = response.ok;
		var statusText = response.statusText;

		if (ok==false) {
			mainForm.serverVerifyIcon.src = form.notFoundAltIconPath;
			showExportingLabel(statusText);
		}
		else {
			mainForm.serverVerifyIcon.src = form.verifyEllipsisAltIconPath;
			showExportingLabel("Server response: "+statusText);
		}
		mainForm.serverVerifyIcon.style.display = Styles.BLOCK;

		var timeout = setTimeout(() => {
			if (isBasicScreenDisplayed()) {
				showExportingLabel(form.basicInstructions);
			}
			else {
				showExportingLabel(form.instructions);
			}
			mainForm.serverVerifyIcon.style.display = Styles.NONE;
		}, globalModel.quickExportNotificationDuration);

		return response;
	}).catch(function(error) {
		var errorMessage = error.text ? error.text() : "" + error;
		mainForm.serverVerifyIcon.src = form.notFoundAltIconPath;
		mainForm.serverVerifyIcon.style.display = Styles.BLOCK;

		showExportingLabel(errorMessage);

		var timeout = setTimeout(() => {
			//elementForm.exportMessageLabel.textContent = "";
			if (isBasicScreenDisplayed()) {
				showExportingLabel(form.basicInstructions);
			}
			else {
				showExportingLabel(form.instructions);
			}
			mainForm.serverVerifyIcon.style.display = Styles.NONE;
		}, globalModel.quickExportNotificationDuration);

	})

	return;

	return new Promise((resolve, reject) => {
		const request = new XMLHttpRequest();
		request.onload = () => {
			log("request.status:" + request.status)
			log("request.ok:" + request.ok)
			log("req:", request)
			//log("reject:", reject)
			 if (request.status === 200) {
				  try {
						const arr = new Uint8Array(request.response);
						resolve(arr);
				  } catch (err) {
						reject('Couldnt parse response. ${err.message}, ${req.response}');
				  }
			 } else {
				  reject('Request had an error: ${req.status}');
			 }
		}
		
		request.onerror = () => {
			log("ERROR")
		}
		request.onabort = () => {
			log("abort")
		}
		request.open('GET', serverPath, true);
		request.responseType = "text";
		request.send();
  });

}

function clearHostConsole(event) {
	hostForm.resultsTextarea.value = "";
}

function clearHostForm(event) {
	hostForm.urlInput.value = "";
	hostForm.usernameInput.value = "";
	hostForm.passwordInput.value = "";
	hostForm.endPointInput.value = "";
	
	var messagesLabel = hostForm.messagesLabel;
	var message = "Form cleared...";

	globalModel.hostField1 = null;
	globalModel.hostField2 = null;
	globalModel.hostField3 = null;
	globalModel.hostField4 = null;

	//savePreferences();

	showSpan(messagesLabel, message)
}

function showHostTextarea(event) {

	if (hostForm.debugCheckbox.checked) {
		showBlockElement(hostForm.resultsTextarea);
		hideElement(hostForm.messagesLabel.parentNode);
	}
	else {
		hideElement(hostForm.resultsTextarea);
		showBlockElement(hostForm.messagesLabel.parentNode);
	}

}

function testHostURL(event) {
	var serverPath = hostForm.urlInput.value;
	var username = hostForm.usernameInput.value;
	var credential = hostForm.passwordInput.value;
	var route = hostForm.endPointInput.value;
	var messagesLabel = hostForm.messagesLabel;
	var useTextarea = hostForm.debugCheckbox.checked;
	var message = "Checking server...";
	var url = "";
	var customDomain = globalArtboardModel.customDomain;

	if (useTextarea) {
		messagesLabel = hostForm.resultsTextarea;
	}

	showSpan(messagesLabel, message);

	if (username=="") {
		//showSpan(messagesLabel, "Enter a username");
		//return;
	}

	if (credential=="") {
		//showSpan(messagesLabel, "Enter a password");
		//return;
	}
 	
	if (serverPath=="") {
		showSpan(messagesLabel, "Enter a URL to post to");
		return;
	}

	url = serverPath + route;
	
	showSpan(messagesLabel, "\nFetching " + url, null, false, 0, true);

	var results = fetch(url).then(function(response) {
		var status = response.status;
		var ok = response.ok;
		var statusText = response.statusText;
		var results1 = response.json().then((json) => {
			if (response.ok) {
			  //log("results:", json)
			}
		});

		if (useTextarea) {
			message = "\nResponse received";
			showSpan(messagesLabel, message, null, false, 0, true);
		}
		else {
			showSpan(messagesLabel, message);
		}

		if (ok==false) {
			hostForm.serverVerifyIcon.src = form.notFoundAltIconPath;
			message = "Not OK. Response: " + response.statusText;
		}
		else {
			hostForm.serverVerifyIcon.src = form.verifyEllipsisAltIconPath;
			message = "OK Response: " + response.statusText;
		}
		
		if (useTextarea) {
			message = "\n" + object(response, "response", 2, false);
			showSpan(messagesLabel, message, null, false, 0, true);
		}
		else {
			showSpan(messagesLabel, message);
		}

		showIcon(hostForm.serverVerifyIcon);

		return response;
	}).catch(function(error) {
		var errorMessage = error.text ? error.text() : "" + error;
		hostForm.serverVerifyIcon.src = form.notFoundAltIconPath;

		showIcon(hostForm.serverVerifyIcon);
		showSpan(messagesLabel, errorMessage);

	})
}

function getCloudUser(event) {
	var username = hostForm.usernameInput.value;
	var credential = hostForm.passwordInput.value;
	var messagesLabel = hostForm.messagesLabel;
	var useTextarea = hostForm.debugCheckbox.checked;
	var message = "Checking server...";
	var serverPath = "";
	var route = "";
	var url = "";

	serverPath = "https://www.velara3.com/a/wp-json"
	route = "/wp/v2/users/";
	url = serverPath + route + username;

	if (useTextarea) {
		messagesLabel = hostForm.resultsTextarea;
	}

	showSpan(messagesLabel, message);

	if (username=="") {
		showSpan(messagesLabel, "Enter a username");
		return;
	}

	if (credential=="") {
		//showSpan(messagesLabel, "Enter a password");
		//return;
	}
 	
	if (serverPath=="") {
		//showSpan(messagesLabel, "Enter a URL to post to");
		//return;
	}
	
	showSpan(messagesLabel, "\nFetching " + url, null, false, 0, true);

	var results = fetch(url).then(function(response) {
		var status = response.status;
		var ok = response.ok;
		var statusText = response.statusText;
		var results1 = response.json().then((json) => {
			if (response.ok) {
			  //log("results:", json)
			}
		});

		if (useTextarea) {
			message = "\nResponse received";
			showSpan(messagesLabel, message, null, false, 0, true);
		}
		else {
			showSpan(messagesLabel, message);
		}

		if (ok==false) {
			hostForm.serverVerifyIcon.src = form.notFoundAltIconPath;
			message = "Not OK. Response: " + response.statusText;
		}
		else {
			hostForm.serverVerifyIcon.src = form.verifyEllipsisAltIconPath;
			message = "OK Response: " + response.statusText;
		}
		
		if (useTextarea) {
			message = "\n" + object(response, "response", 2, false);
			showSpan(messagesLabel, message, null, false, 0, true);
		}
		else {
			showSpan(messagesLabel, message);
		}

		showIcon(hostForm.serverVerifyIcon);

		return response;
	}).catch(function(error) {
		var errorMessage = error.text ? error.text() : "" + error;
		hostForm.serverVerifyIcon.src = form.notFoundAltIconPath;

		showIcon(hostForm.serverVerifyIcon);
		showSpan(messagesLabel, errorMessage);

	})
}

/**
 * Upload to REST API
 * @param {Object} event 
 * @param {Boolean} testUpload test upload
 * @param {Boolean} testAuth test authorization
 * @param {Boolean} linkToPost save post id to artboard
 **/
async function uploadToHostURL(event, testUpload = false, testAuth = false, linkToPost = false) {
	var serverPath = hostForm.urlInput.value;
	var route = hostForm.endPointInput.value;
	var username = hostForm.usernameInput.value;
	var credential = hostForm.passwordInput.value;
	var messagesLabel = hostForm.messagesLabel;
	var debug = hostForm.debugCheckbox.checked;
	var customDomain = globalArtboardModel.customDomain;
	var jwt = '/jwt-auth/v1/token';
	var jwtValidate = '/jwt-auth/v1/token/validate';
	var wp = null;
	var exportMultipleArtboards = globalModel.exportMultipleArtboards;
	var postLinkID = globalModel.lastArtboardModel && globalModel.lastArtboardModel.postLinkID;
	var markupOutput = null;
	var pageTitle = null;
	var messagesLabel = hostForm.messagesLabel;
	var panelMessagesLabel = elementForm.messageLabel;
	var message = linkToPost ? "Linking..." : "Uploading...";
	var useTextarea = hostForm.debugCheckbox.checked;
	var authResult = null;
	var apiRoot = serverPath;
	// measure https://web.dev/measure/


	try {

		if (useTextarea) {
			messagesLabel = hostForm.resultsTextarea;
		}

		showSpan(messagesLabel, "")

		if (username=="") {
			showSpan(messagesLabel, "Enter a username");
			return;
		}
	
		if (credential=="") {
			showSpan(messagesLabel, "Enter a password");
			return;
		}
		
		if (serverPath=="") {
			showSpan(messagesLabel, "Enter a URL to post to");
			return;
		}
	
		if (exportMultipleArtboards) {
			markupOutput = globalModel.markupOutput;
			pageTitle = globalModel.selectedArtboardModel.getPageTitle();
		}
		else {
			markupOutput = globalModel.selectedArtboardModel && globalModel.selectedArtboardModel.markupOutput;
			pageTitle = globalModel.selectedArtboardModel.getPageTitle();
		}

		if (testUpload) {
			pageTitle = "Title";
			markupOutput = "Content created at " + new Date().toTimeString();
		}
		else if (globalModel.lastArtboardModel==null) {
			showSpan(messagesLabel, "Export an artboard before uploading");
			return;
		}
		else {
			markupOutput = globalModel.lastArtboardModel.pageOutput;
			pageTitle = globalModel.lastArtboardModel.getPageTitle();
		}


		if (testAuth==false) {

			if (useTextarea) {
				showSpan(messagesLabel, message, null, false, 0, true);
			}
			else {
				showSpan(messagesLabel, message);
			}
		}

		//log("Last Aartboard:", globalModel.lastArtboardModel)
		//log("markup: " + getShortString(markupOutput))
		//log("title: " + getShortString(pageTitle))

		// http://wp-api.org/node-wpapi/using-the-client/

		var getToken = true;
		var basicAuth = true;
		var token = null;

		if (getToken) {

			if (testAuth) {
				message = "Authorizing...";
			}
			else {
				message = "\nAuthorizing...";
			}

			if (useTextarea) {
				showSpan(messagesLabel, message, null, false, 0, true);
			}
			else {
				showSpan(messagesLabel, message);
			}

			var url = apiRoot + jwt;
			//log ("auth: "+ url)

			// authorize
			// https://ionicthemes.com/tutorials/about/ionic-wordpress-integration
			var results = await fetch(url, {
				method: "POST",
				headers: {
					'Content-Type': 'application/json',
					'accept': 'application/json',
				},
				body: JSON.stringify({
					username: username,
					password: credential
				})
			})

			//log("user:",results)
			
			// check if result is ok
			if (results.ok===false) {
				mainForm.uploadLink.disabled = false;
				message = "\n" + "Authorization failed: " + results.status + " " + results.statusText;
				//log("auth failure:", results)
				showExportingLabel(message, true);
				
				hostForm.serverVerifyIcon.src = form.notFoundAltIconPath;

				showIcon(hostForm.serverVerifyIcon);

				if (useTextarea) {
					message += "\n" + object(results, "Response", 3, false);
					showSpan(messagesLabel, message, null, false, 0, true);
				}
				else {
					showSpan(messagesLabel, message);
				}
				
				return;

				/*
				LOGIN ERRORS: 
				// E: error 404 incorrect url or jwt not installed
				// S: you must install and activate JWT by Enrique

				// E: Upload failed: 403 forbidden
				// S: Must add JWT secred key to wp-config

				// E: rest_cannot_create

				{
					code: 'rest_cannot_create',
					  message: 'Sorry, you are not allowed to create posts as this user.',
					data: { 
						status: 401 
					} 
				}
	
				// Cause: Had to update htaccess with rewrite
				# https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/
				RewriteEngine on
				RewriteCond %{HTTP:Authorization} ^(.*)
				RewriteRule ^(.*) - [E=HTTP_AUTHORIZATION:%1]

				*/
			}

			
			if (useTextarea) {
				message = "\n" + object(results, "Response", 3, false);
				showSpan(messagesLabel, message, null, false, 0, useTextarea);
			}

			//log("auth results 2", results)
			authResult = await results.json();


			//log("auth results", authResult);
			//var sites = getPropertiesAsArray(authResult.user_sites);
			//var firstSite = sites.length && authResult.user_sites[sites[0]];
			//log("sites", sites)
			//log("firstSite", firstSite)
			// save token
			token = authResult.token;
		}

		if (testAuth) {
			showSpan(messagesLabel, "\nAuthorization test complete", null, false, 0, true);
			hostForm.serverVerifyIcon.src = form.verifyEllipsisAltIconPath;

			showIcon(hostForm.serverVerifyIcon);
			return;
		}

		// build URL
		url = apiRoot + route;
		message = "\nUploading...";

		if (testUpload==false && postLinkID!=null && postLinkID!="") {
			url += "/" + postLinkID;
		}

		showExportingLabel(message);

		if (useTextarea) {
			if (linkToPost) {
				message = "\nLinking to... " + url;
			}
			else {
				message = "\nUploading to... " + url;
			}
			showSpan(messagesLabel, message, null, false, 0, true);
		}
		else {
			showSpan(messagesLabel, message);
		}

		disableElements(mainForm.uploadLink, elementForm.uploadLink);

		await sleep(1);

		//log("Upload URL: " + url)

		results = await fetch(url, {
			method: "POST",
			headers:{
				'Content-Type': 'application/json',
				'accept': 'application/json',
				'Authorization': 'Bearer '+ token
			},
			body: JSON.stringify({
				title: pageTitle,
				content: markupOutput,
				status: 'publish',
				meta: {
					my_meta_key: "test2",
					html_meta: markupOutput,
					html_meta_2: getShortString(markupOutput, 250)
				}
			})
		})

		enableElements(mainForm.uploadLink, elementForm.uploadLink);

		var result = await results.json();
		var postURL = result.link;

		//log("results", result)

		if (result && "content" in result && "raw" in result.content) {
			result.content.raw = getShortString(result.content.raw, 512);
			result.content.rendered = getShortString(result.content.rendered, 512);
		}

		if (linkToPost && result.id!=null) {
			hostForm.postLinkInput.value = result.id;
			hostForm.cloudLink.href = result.link;
			showBlockElement(hostForm.cloudLink);
			setTitleViaStyle(hostForm.cloudLink, result.link);
			//showLinkedArtboardForm(result.id, globalModel.userSite);
			updateArtboardModelAndSave();
		}

		/* 
		 Error caused by JWT configuration 

		 Response {
			code         jwt_auth_bad_config
			data: {
					status   403
			}
			message   JWT is not configurated properly, please contact the admin
		 }

		 Fix is to move define('JWT_AUTH') at the top of wp-config. 
		*/

		//log("results: ", result)
		message = linkToPost ? "\nLink complete!" : "\nUpload complete!";
		showExportingLabel(message, true);
		showPanelMessage(message);
		
		var array = ["title", "href"];

		for (let index = 0; index < array.length; index++) {
			const attribute = array[index];
			mainForm.copyURLLink.setAttribute(attribute, postURL);
			mainForm.openRURLLink.setAttribute(attribute, postURL);

			if (elementForm && elementForm.openRURLLink) {
				elementForm.copyURLLink.setAttribute(attribute, postURL);
				elementForm.openRURLLink.setAttribute(attribute, postURL);
			}
		}

		if (useTextarea) {
			message += "\n" + object(result, "Response", 3, false);
			showSpan(messagesLabel, message, null, false, 0, true);
		}
		else {
			showSpan(messagesLabel, message);
		}
		
		/*
		{  
			code: 'rest_cannot_create',
			message: 'Sorry, you are not allowed to create posts as this user.',
			data: { 
				status: 401 
			} 
		}

		Cause: Had to update htaccess with rewrite
		# See https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/
		RewriteEngine on
		RewriteCond %{HTTP:Authorization} ^(.*)
		RewriteRule ^(.*) - [E=HTTP_AUTHORIZATION:%1]
		*/

	}
	catch(error) {
		var errorMessage = error.text ? error.text() : "" + error;
		hostForm.serverVerifyIcon.src = form.notFoundAltIconPath;

		showIcon(hostForm.serverVerifyIcon);

		if (useTextarea) {
			showSpan(messagesLabel, "" + result, null, false, 0, true);
		}
		else {
			showSpan(messagesLabel, errorMessage);
		}

		log('Error:', errorMessage);
		var uploadFailMessage = "Upload failed. See developer console";
		enableElements(mainForm.uploadLink, elementForm.uploadLink);
		showExportingLabel(uploadFailMessage, true);
		showPanelMessage(uploadFailMessage, true);
	}

}

/**
 * Logout of host
 * @param {Object} event 
 **/
async function logoutOfHost(event) {
	globalModel.token = null;
	showLoginForm();
}

/**
 * Logout of host
 * @param {Object} event 
 **/
function uploadOnExportChange(event) {
	var artboardModel = globalModel.selectedArtboardModel;

	if (artboardModel==null) return;

	if (hostForm.uploadOnExportCheckbox.checked) {
		artboardModel.uploadOnExport = true;
	}
	else {
		artboardModel.uploadOnExport = false;
	}

	updateArtboardModelAndSave();
}

/**
 * Upload to REST API
 * @param {Object} event 
 * @param {Boolean} linkArtboard 
 **/
async function loginToHost(event, linkArtboard = false) {
	var serverPath = GlobalModel.host;
	var route = GlobalModel.route;
	var username = hostForm.usernameInput.value;
	var credential = hostForm.passwordInput.value;
	var messagesLabel = hostForm.messagesLabel;
	var debug = hostForm.debugCheckbox.checked;
	var customDomain = globalArtboardModel.customDomain;
	var jwt = '/jwt-auth/v1/token';
	var jwtValidate = '/jwt-auth/v1/token/validate';
	var wp = null;
	var exportMultipleArtboards = globalModel.exportMultipleArtboards;
	var postLinkID = null;
	var uploadOnExport = false;
	var markupOutput = null;
	var pageTitle = null;
	var panelMessagesLabel = elementForm.messageLabel;
	var message = "";
	var useTextarea = hostForm.debugCheckbox.checked;
	var authResult = null;
	var apiRoot = serverPath + route;

	//log("apiRoot:"+ apiRoot)

	try {

		messagesLabel = hostForm.loggingInLabel;

		//postLinkID = globalModel.lastArtboardModel && globalModel.lastArtboardModel.postLinkID;

		if (postLinkID==null) {
			postLinkID = globalModel.selectedArtboardModel.postLinkID;
		}
		uploadOnExport = globalModel.selectedArtboardModel.uploadOnExport;
		
		showSpan(messagesLabel, "");

		if (username=="") {
			showSpan(messagesLabel, "Enter a username");
			return;
		}
	
		if (credential=="") {
			showSpan(messagesLabel, "Enter a password");
			return;
		}
		
		if (serverPath=="") {
			showSpan(messagesLabel, "Enter a URL to post to");
			return;
		}

		if (useTextarea) {
			showSpan(messagesLabel, message, null, false, 0, true);
		}
		else {
			showSpan(messagesLabel, message);
		}


		// http://wp-api.org/node-wpapi/using-the-client/


		message = "Authorizing...";

		if (useTextarea) {
			showSpan(messagesLabel, message, null, false, 0, true);
		}
		else {
			showSpan(messagesLabel, message);
		}

		// if we use a link or button button doesn't show disabled state so hide
		disableElements(hostForm.loginButton);
		hideElements(hostForm.loginButton);

		await sleep(10);

		var url = GlobalModel.host + GlobalModel.route + jwt;

		//log("URL:" + url)
		// authorize
		// https://ionicthemes.com/tutorials/about/ionic-wordpress-integration
		var results = await loginUser(url, username, credential);

		//log("results:", results);
		
		enableElements(hostForm.loginButton);
		showBlockElement(hostForm.loginButton)

		globalModel.token = null;
		var token = null;
		
		// check if result is ok
		if (results.ok===false) {
			message = "\n" + "Authorization failed: " + results.status + " " + results.statusText;
			//log("auth failure:", results)

			if (useTextarea) {
				message += "\n" + object(results, "Response", 3, false);
				showSpan(messagesLabel, message, null, false, 0, true);
			}
			else {
				showSpan(messagesLabel, message);
			}

			logoutOfHost(event);
			
			return;

			/*
			// error 404 incorrect url or jwt not installed
			// check url and you must install and activate JWT by Enrique

			// Upload failed: 403 forbidden
			// Must add JWT secred key to wp-config

			// rest_cannot_create

			{ 
				code: 'rest_cannot_create',
					message: 'Sorry, you are not allowed to create posts as this user.',
				data: { 
					status: 401 
				} 
			}

			Cause: Had to update htaccess with rewrite
			# https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/
			RewriteEngine on
			RewriteCond %{HTTP:Authorization} ^(.*)
			RewriteRule ^(.*) - [E=HTTP_AUTHORIZATION:%1]

			*/
		}

		
		//log("auth results 2", results)
		authResult = await results.json();
		//log("auth results", authResult);
		var sites = getPropertiesAsArray(authResult.user_sites);
		var firstSite = sites.length && authResult.user_sites[sites[0]];
		//log("sites", sites)
		//log("firstSite", firstSite)
		
		// save token
		token = authResult.token;
		globalModel.token = token;
		globalModel.site = firstSite;
		globalModel.userSite = firstSite.siteurl;

		//log("first token:" + globalModel.token)

		// establish user site url and login
		url = globalModel.userSite + GlobalModel.route + jwt;

		var doubleLogin = true;

		// double login
		if (doubleLogin) {
			//log("login URL 2: "+url)
			results = await loginUser(url, username, credential);
			authResult = await results.json();
			//log("auth results 2", authResult);
			globalModel.token = token;
			//log("results 2:", results);
			//log("second token:" + globalModel.token)
		}

		url =  globalModel.userSite + GlobalModel.route + GlobalModel.linkEndPoint;

		//log("create URL 3: "+url)
		results = await createPost(url, "Title", "Body")

		//log("create results:", results)

		showSpan(messagesLabel);

		showLoggedInForm(sites, firstSite, authResult.user_display_name);
		showLinkedArtboardForm(postLinkID, firstSite.siteurl);
		
	}
	catch(error) {
		log(error);
	}

}

/**
 * Show linked artboard
 * @param {String} id
 * @param {String} siteURL
 */
function showLinkedArtboardForm(id=null, siteURL=null) {
	var postURL = siteURL + GlobalModel.postPath + id;

	if (siteURL) {
		showFlexElement(hostForm.cloudLink.parentNode);
	}
	else {
		hideElement(hostForm.cloudLink.parentNode);
	}
	
	// id found - show cloud link and unlink button
	if (id!=null) {
		hostForm.cloudLink.href = postURL;
		setTitleViaStyle(hostForm.cloudLink, postURL);
		showFlexElements(hostForm.cloudLink, hostForm.removeCloudLink);
		hideElement(hostForm.linkToPostButton);
	}
	else {
		showFlexElement(hostForm.linkToPostButton);
		hideElements(hostForm.cloudLink, hostForm.removeCloudLink);
		setTitleViaStyle(hostForm.cloudLink, "");
	}
}

/**
 * Unlink artboard
 */
function unlinkArtboard(event) {
	var id = null;
	var site = globalModel.site;
	var siteURL = site && site.siteurl;
	var model = globalModel.lastArtboardModel;


	id = globalModel.selectedArtboardModel.postLinkID;
	model = globalModel.selectedArtboardModel;

	try {

		if (model) {
			model.postLinkID = null;
			hostForm.postLinkInput.value = null;
			updateArtboardModelAndSave();
		}

		showLinkedArtboardForm(null);
	}
	catch (error) {
		log(error);
	}
}

/**
 * Link artboard
 */
async function linkArtboard(event=null) {
	var messagesLabel = hostForm.linkLabel;
	var panelMessagesLabel = elementForm.messageLabel;
	var serverPath = GlobalModel.host;
	var route = GlobalModel.route;
	var endPoint = GlobalModel.linkEndPoint;
	var username = hostForm.usernameInput.value;
	var credential = hostForm.passwordInput.value;
	var debug = hostForm.debugCheckbox.checked;
	var customDomain = globalArtboardModel.customDomain;
	var exportMultipleArtboards = globalModel.exportMultipleArtboards;
	var postLinkID = globalModel.lastArtboardModel && globalModel.lastArtboardModel.postLinkID;
	var pageTitle = "Cloud Document";
	var markupOutput = "Document not yet uploaded. " + new Date().toLocaleTimeString();
	var message = "";
	var authResult = null;
	var apiRoot = serverPath + route;
	

	if (globalModel.site) {
		serverPath = globalModel.site.siteurl;
		apiRoot = serverPath + route + endPoint;
	}
	else {
		message = "You must login before linking an artboard";
		showSpan(messagesLabel, message);
		return;
	}

	try {
		
		// build URL
		var url = apiRoot;
		message = "\nLinking...";

		showExportingLabel(message);

		showSpan(messagesLabel, message);

		disableElements(mainForm.uploadLink, elementForm.uploadLink);

		await sleep(1);
		
		var jwt = '/jwt-auth/v1/token';
		var url = globalModel.site.siteurl + GlobalModel.rest + jwt;
		
		// login to main site and then create post 
		//log("login url:"+url)
		var loginResults = await loginUser(url, username, credential, true);
		//log("login ok:"+loginResults.ok)
		serverPath = globalModel.userSite;
		url = serverPath + route + endPoint;
		//log("post url:"+url)
		var results = await createPost(url, pageTitle, markupOutput);
		
		//log("results:", results)

		enableElements(mainForm.uploadLink, elementForm.uploadLink);

		if (results.ok===false) {
			message = "Error: " + results.statusText;
			showSpan(messagesLabel, message);
			//log("results:", results)
			return;
		}
		
		
		var post = await results.json();
		var postURL = post.link;
		postLinkID = post.id;
		

		//log("post", post)
		//log("postLinkID", postLinkID)

		if (post && "content" in post && "raw" in post.content) {
			post.content.raw = getShortString(post.content.raw, 512);
			post.content.rendered = getShortString(post.content.rendered, 512);
		}

		if (post.id!=null) {
			hostForm.postLinkInput.value = post.id;
			hostForm.cloudLink.href = post.link;
			showBlockElement(hostForm.cloudLink);
			setTitleViaStyle(hostForm.cloudLink, post.link);
			updateArtboardModelAndSave();
		}
		
		message = "\nLink complete!";
		showSpan(messagesLabel, message);
		showExportingLabel(message, true);
		showPanelMessage(message);

		showLinkedArtboardForm(postLinkID, globalModel.userSite);
	}
	catch(error) {
		var errorMessage = error.text ? error.text() : "" + error;
		log('Error:', errorMessage);
		log(error.stack);

		hostForm.serverVerifyIcon.src = form.notFoundAltIconPath;

		showIcon(hostForm.serverVerifyIcon);

		showSpan(messagesLabel, errorMessage);

		var linkFailMessage = "Link failed. See developer console";
		
		showExportingLabel(linkFailMessage, true);
		showPanelMessage(linkFailMessage, true);
	}
}

function updateUploadLinkURLS(url) {

	var array = ["title", "href"];

	for (let index = 0; index < array.length; index++) {
		const attribute = array[index];
		mainForm.copyURLLink.setAttribute(attribute, url);
		mainForm.openRURLLink.setAttribute(attribute, url);

		if (elementForm && elementForm.openRURLLink) {
			elementForm.copyURLLink.setAttribute(attribute, url);
			elementForm.openRURLLink.setAttribute(attribute, url);
		}
		
		if (hostForm && hostForm.cloudLink) {
			hostForm.cloudLink.setAttribute(attribute, url);
		}
	}
	
}

/**
 * Upload artboard
 */
async function uploadArtboard(event=null) {
	var messagesLabel = hostForm.linkLabel;
	var panelMessagesLabel = elementForm.messageLabel;
	var serverPath = GlobalModel.host;
	var route = GlobalModel.route;
	var endPoint = GlobalModel.linkEndPoint;
	var username = hostForm.usernameInput.value;
	var credential = hostForm.passwordInput.value;
	var debug = hostForm.debugCheckbox.checked;
	var customDomain = globalArtboardModel.customDomain;
	var exportMultipleArtboards = globalModel.exportMultipleArtboards;
	var postLinkID = globalModel.lastArtboardModel && globalModel.lastArtboardModel.postLinkID;
	var pageTitle = "Title";
	var markupOutput = "Content at " + new Date().toLocaleTimeString();
	var message = "";
	var authResult = null;
	var apiRoot = serverPath + route;
	
	
	if (exportMultipleArtboards) {
		markupOutput = globalModel.markupOutput;
		pageTitle = globalModel.selectedArtboardModel.getPageTitle();
	}
	else {
		markupOutput = globalModel.selectedArtboardModel && globalModel.selectedArtboardModel.markupOutput;
		pageTitle = globalModel.selectedArtboardModel.getPageTitle();
	}
	
	if (globalModel.lastArtboardModel==null) {
		showSpan(messagesLabel, "Export an artboard before uploading");
		return;
	}
	else {
		markupOutput = globalModel.lastArtboardModel.pageOutput;
		pageTitle = globalModel.lastArtboardModel.getPageTitle();
	}

	if (globalModel.site) {
		serverPath = globalModel.site.siteurl;
		apiRoot = serverPath + route + endPoint;
	}
	else {
		message = "You must login to upload";
		showSpan(messagesLabel, message);
		showPanelMessage(message);
		return;
	}

	try {
		
		message = "\nUploading...";

		showExportingLabel(message);
		showPanelMessage(message);

		showSpan(messagesLabel, message);

		disableElements(mainForm.uploadLink, elementForm.uploadLink);

		await sleep(1);
		

		var url = globalModel.site.siteurl + GlobalModel.rest + GlobalModel.jwt;
		
		// login to main site and then create post 
		//log("login url:"+url)
		var loginResults = await loginUser(url, username, credential, true);
		//log("login ok:"+loginResults.ok)
		serverPath = globalModel.userSite;
		var postURL = serverPath + route + endPoint + "/" + postLinkID;

		//exportSelectedArtboardlog("post url:"+postURL)
		var results = await updatePost(postURL, pageTitle, markupOutput);
		
		//log("results:", results)

		enableElements(mainForm.uploadLink, elementForm.uploadLink);

		if (results.ok===false) {
			message = "Error: " + results.statusText;
			showSpan(messagesLabel, message);
			//log("results:", results)
			return;
		}
		
		
		var post = await results.json();
		var link = post.link;
		postLinkID = post.id;
		

		//log("post", post)
		//log("postLinkID", postLinkID)

		if (post && "content" in post && "raw" in post.content) {
			post.content.raw = getShortString(post.content.raw, 512);
			post.content.rendered = getShortString(post.content.rendered, 512);
		}

		if (post.id!=null) {
			hostForm.postLinkInput.value = post.id;
			hostForm.cloudLink.href = post.link;
			showBlockElement(hostForm.cloudLink);
			setTitleViaStyle(hostForm.cloudLink, post.link);
			//updateArtboardModelAndSave();
		}
		
		message = "\nUpload complete!";
		showSpan(messagesLabel, message);
		showExportingLabel(message, true);
		showPanelMessage(message);
		updateUploadLinkURLS(post.link);
		//showLinkedArtboardForm(postLinkID, globalModel.userSite);
	}
	catch(error) {
		var errorMessage = error.text ? error.text() : "" + error;
		//hostForm.serverVerifyIcon.src = form.notFoundAltIconPath;

		//showIcon(hostForm.serverVerifyIcon);

		showSpan(messagesLabel, errorMessage);

		log('Error:', errorMessage);
		var uploadFailMessage = "Upload failed. See developer console";
		
		showExportingLabel(uploadFailMessage, true);
		showPanelMessage(uploadFailMessage, true);
	}
}

/**
 * Returns true if user is logged in and artboard is linked
 * @param {ArtboardModel} model 
 */
function canUpload(model) {
	return model.postLinkID && globalModel.userSite;
}

/**
 * Link or upload 
 * @param {Boolean} linkToPost 
 */
async function linkOrUpload(linkToPost) {
	var serverPath = GlobalModel.host;
	var route = GlobalModel.endPoint;
	var messagesLabel = hostForm.messagesLabel;
	var debug = hostForm.debugCheckbox.checked;
	var customDomain = globalArtboardModel.customDomain;
	var exportMultipleArtboards = globalModel.exportMultipleArtboards;
	var postLinkID = globalModel.lastArtboardModel && globalModel.lastArtboardModel.postLinkID;
	var markupOutput = null;
	var pageTitle = null;
	var messagesLabel = hostForm.messagesLabel;
	var panelMessagesLabel = elementForm.messageLabel;
	var message = "";
	var useTextarea = hostForm.debugCheckbox.checked;
	var authResult = null;
	var apiRoot = serverPath + route;

	try {

		// build URL
		var url = apiRoot + route;
		message = "\nUploading...";

		if (postLinkID!=null && postLinkID!="") {
			url += "/" + postLinkID;
		}

		showExportingLabel(message);

		if (useTextarea) {
			if (linkToPost) {
				message = "\nLinking to... " + url;
			}
			else {
				message = "\nUploading to... " + url;
			}
			showSpan(messagesLabel, message, null, false, 0, true);
		}
		else {
			showSpan(messagesLabel, message);
		}

		disableElements(mainForm.uploadLink, elementForm.uploadLink);

		await sleep(1);

		var results = await fetch(url, {
			method: "POST",
			headers:{
				'Content-Type': 'application/json',
				'accept': 'application/json',
				'Authorization': 'Bearer '+ globalModel.token
			},
			body: JSON.stringify({
				title: pageTitle,
				content: markupOutput,
				status: 'publish',
				meta: {
					html_meta: markupOutput,
					html_meta_2: getShortString(markupOutput, 250),
					version: globalModel.version,
					applicationVersion: globalModel.applicationVersion
				}
			})
		})

		enableElements(mainForm.uploadLink, elementForm.uploadLink);

		var post = await results.json();
		var postURL = post.link;

		//log("results", result)

		if (post && "content" in post && "raw" in post.content) {
			post.content.raw = getShortString(post.content.raw, 512);
			post.content.rendered = getShortString(post.content.rendered, 512);
		}

		if (linkToPost && post.id!=null) {
			hostForm.postLinkInput.value = post.id;
			showBlockElement(hostForm.cloudLink);
			hostForm.cloudLink.href = post.link;
			setTitleViaStyle(hostForm.cloudLink, post.link);
			updateArtboardModelAndSave();
		}

		/* 
		 Error caused by JWT configuration 

		 Response {
			code         jwt_auth_bad_config
			data: {
					status   403
			}
			message   JWT is not configurated properly, please contact the admin
		 }

		 Fix is to move define('JWT_AUTH') at the top of wp-config. 
		*/

		//log("results: ", result)
		message = linkToPost ? "\nLink complete!" : "\nUpload complete!";
		showExportingLabel(message, true);
		showPanelMessage(message);
		
		var array = ["title", "href"];

		for (let index = 0; index < array.length; index++) {
			const attribute = array[index];
			mainForm.copyURLLink.setAttribute(attribute, postURL);
			mainForm.openRURLLink.setAttribute(attribute, postURL);

			if (elementForm && elementForm.openRURLLink) {
				elementForm.copyURLLink.setAttribute(attribute, postURL);
				elementForm.openRURLLink.setAttribute(attribute, postURL);
			}
		}

		if (useTextarea) {
			message += "\n" + object(post, "Response", 3, false);
			showSpan(messagesLabel, message, null, false, 0, true);
		}
		else {
			showSpan(messagesLabel, message);
		}
		
		/*
		{  
			code: 'rest_cannot_create',
			message: 'Sorry, you are not allowed to create posts as this user.',
			data: { 
				status: 401 
			} 
		}

		Cause: Had to update htaccess with rewrite
		# See https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/
		RewriteEngine on
		RewriteCond %{HTTP:Authorization} ^(.*)
		RewriteRule ^(.*) - [E=HTTP_AUTHORIZATION:%1]
		*/

	}
	catch(error) {
		var errorMessage = error.text ? error.text() : "" + error;
		hostForm.serverVerifyIcon.src = form.notFoundAltIconPath;

		showIcon(hostForm.serverVerifyIcon);

		if (useTextarea) {
			showSpan(messagesLabel, "" + post, null, false, 0, true);
		}
		else {
			showSpan(messagesLabel, errorMessage);
		}

		log('Error:', errorMessage);
		var uploadFailMessage = "Upload failed. See developer console";
		enableElements(mainForm.uploadLink, elementForm.uploadLink);
		showExportingLabel(uploadFailMessage, true);
		showPanelMessage(uploadFailMessage, true);
	}
}

/**
 * Creates a post via fetch
 * @param {String} url 
 * @param {String} title 
 * @param {String} markup 
 */
async function createPost(url, title, markup) {

	try {
		//log("create url : " + url)
		var results = await fetch(url, {
			method: "POST",
			headers:{
				'Content-Type': 'application/json',
				'accept': 'application/json',
				'Authorization': 'Bearer '+ globalModel.token
			},
			body: JSON.stringify({
				title: title,
				content: markup,
				status: 'publish',
				meta: {
					html_meta: markup,
				}
			})
		})
		
		// version: globalModel.version,
		// applicationVersion: globalModel.applicationVersion
	}
	catch (error) {
		log(error);
	}
		
	/**
	 * CREATE POST ERRORS 
	 * { type: 'default',
			status: 404,
			ok: false,
			statusText: 'not found',

		// url incorrect
		// check url
	*/

	/**
	 * { type: 'default',
		status: 403,
		ok: false,
		statusText: 'forbidden',
		headers: 
	*/
	/* 
	 Response {
		code         rest_cannot_create
		data: {
				status   403
		}
		message   Sorry, you are not allowed to create posts as this user.
		}

	 // might have to create a token for each call???
  */

	return results;
}

/**
 * Update a post via fetch
 * @param {String} url 
 * @param {String} title 
 * @param {String} markup 
 */
async function updatePost(url, title, markup) {

	try {
		//log("create url : " + url)
		var results = await fetch(url, {
			method: "POST",
			headers:{
				'Content-Type': 'application/json',
				'accept': 'application/json',
				'Authorization': 'Bearer '+ globalModel.token
			},
			body: JSON.stringify({
				title: title,
				content: markup,
				status: 'publish',
				meta: {
					html_meta: markup,
				}
			})
		})
		
		// version: globalModel.version,
		// applicationVersion: globalModel.applicationVersion
	}
	catch (error) {
		log(error);
	}
		
	/**
	 * CREATE POST ERRORS 
	 * { type: 'default',
			status: 404,
			ok: false,
			statusText: 'not found',

		// url incorrect
		// check url
	*/

	/**
	 * { type: 'default',
		status: 403,
		ok: false,
		statusText: 'forbidden',
		headers: 
	*/
	/* 
	 Response {
		code         rest_cannot_create
		data: {
				status   403
		}
		message   Sorry, you are not allowed to create posts as this user.
		}

	 // might have to create a token for each call???
  */

	return results;
}

/**
 * Creates a post via fetch
 * @param {String} url
 * @param {String} user
 * @param {String} credential
 * @param {Boolean} tokens
 */
async function loginUser(url, user, credential, tokens = false) {
	//log("url:"+url)

	try {
	
		var results = await fetch(url, {
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
				'accept': 'application/json',
			},
			body: JSON.stringify({
				username: user,
				password: credential
			})
		})
		
		
		if (tokens) {
			//log("auth results", results);
			var auth = await results.json();
			var sites = getPropertiesAsArray(auth.user_sites);
			var firstSite = sites.length && auth.user_sites[sites[0]];
			//log("sites", sites)
			//log("firstSite", firstSite)
			
			// save token
			var token = auth.token;
			globalModel.token = token;
			globalModel.site = firstSite;
			//log("new token:" + token)
		}
	}
	catch (error) {
		log(error);
	}
		
	/**
	 * { type: 'default',
			status: 404,
			ok: false,
			statusText: 'not found',

		// url not found. check url
	*/

	/**
	 * { type: 'default',
		status: 403,
		ok: false,
		statusText: 'forbidden',
		headers: 
	*/

	return results;
}

/**
 * Show more details. Todo update with current element form values before opening view
 * @param {HTMLElement} input 
 */
function showMoreDetails(input) {
	var title = "";
	var property = "";
	var description = "";
	var uxpEditLabel = "";
	var model = globalModel.selectedModel;
	var element = globalModel.selectedElement;
	var defaultValue = null;
	var isArtboard = element && getIsArtboard(element);

	if (model==null) {
		return;
	}

	if (globalModel.showingElementDialog || globalModel.panelVisible) {
		try {
			updateElementModel(model);
		}
		catch(error) {
			log(error);
		}
	}

	switch (input) {
		case elementForm.markupInsideInput:
			title = "Markup Inside";
			description = "";
			uxpEditLabel = "Edit Markup Inside";
			property = "markupInside";
			break;
	
		case elementForm.markupBeforeInput:
			title = "Markup Before";
			uxpEditLabel = "Edit Markup Before";
			property = "markupBefore";
			break;

		case elementForm.markupAfterInput:
			title = "Markup After";
			uxpEditLabel = "Edit Markup After";
			property = "markupAfter";
			break;

		case elementForm.textIDsInput:
			title = "Text IDs";
			uxpEditLabel = "Text IDs";
			property = "textIds";
			break;

		case elementForm.textTokensInput:
			title = "Text Tokens";
			uxpEditLabel = "Text Tokens";
			property = "textTokens";
			break;

		case elementForm.additionalStylesInput:
			title = "Additional Styles";
			uxpEditLabel = "Additional Styles";
			property = "additionalStyles";
			break;

		case elementForm.subStylesInput:
			title = "Additional Sub Styles";
			uxpEditLabel = "Additional Sub Styles";
			property = "subStyles";
			break;

		case elementForm.classesInput:
			title = "Additional Classes";
			uxpEditLabel = "Additional Classes";
			property = "additionalClasses";
			break;

		case elementForm.subClassesInput:
			title = "Additional Sub Classes";
			uxpEditLabel = "Additional Sub Classes";
			property = "subClasses";
			break;

		case elementForm.attributesInput:
			title = "Additional Attributes";
			uxpEditLabel = "Additional Attributes";
			property = "additionalAttributes";
			break;

		case elementForm.subAttributesInput:
			title = "Additional Sub Attributes";
			uxpEditLabel = "Additional Sub Attributes";
			property = "subAttributes";
			break;

		case elementForm.hyperlinkInput:
			title = "Hyperlink";
			uxpEditLabel = "Hyperlink";
			property = "hyperlink";
			break;

		case elementForm.hyperlinkElementInput:
			title = "Hyperlink element";
			uxpEditLabel = "Hyperlink element";
			property = "hyperlinkElement";
			break;

		case elementForm.templateIcon || mainForm.templateIcon:
			title = isArtboard ? "Page Template" : "HTML Template";
			uxpEditLabel = title;
			property = "template";
			defaultValue = isArtboard ? globalModel.template : "";
			break;

		case elementForm.styleTemplateIcon || mainForm.styleTemplateIcon:
			title = "Style Template";
			uxpEditLabel = "Style Template";
			property = "stylesheetTemplate";
			//defaultValue = globalModel.template;
			break;

		case elementForm.scriptTemplateIcon || mainForm.scriptTemplateIcon:
			title = "Script Template";
			uxpEditLabel = "Script Template";
			property = "scriptTemplate";
			//defaultValue = globalModel.template;
			break;
		
		default:
			break;
	}

	showMoreRoomView(title, model, property, model[property], description, defaultValue, uxpEditLabel, true, true, true, false, updateElementModelAfterMoreRoomView, model);
}

function updateElementModelAfterMoreRoomView(model) {
	updateElementForm(model)
	updateElementModelAndSave();
}

/**
 * 
 * @param {*} event 
 */
async function onExportFolderKeypress(event) {

	if (event.keyCode==13) {
		if (mainForm.exportFolderInput.value=="" || mainForm.exportFolderInput.value==null) {
			await browseForExportFolder();
		}
	}
}

/**
 * 
 * @param {*} event 
 */
async function onHostFormKeypress(event) {

	if (event.keyCode==13) {
		if (hostForm.usernameInput.value!="" || hostForm.passwordInput.value!="") {
			loginToHost(event, false);
		}
	}
}

function onStylesheetInputKeypress(event) {

	if (event.keyCode==13) {
		if (mainForm.stylesheetNameInput.value =="" || mainForm.stylesheetNameInput.value==null) {
			//browseForExportFolder();
		}
	}
}

/**
 * Get the total number of artboards in a project
 **/
function getNumberOfArtboards() {
	const { root } = require("scenegraph");
	var items = root.children;
	var numberOfItems = items ? items.length : 0;
	var numberOfArtboards = 0;

	// exclude pasteboard items
	for (let index = 0; index < numberOfItems; index++) {
		let item = items.at(index);
		let isArtboard = getIsArtboard(item);

		if (isArtboard) {
			numberOfArtboards++;
		}
	}

	return numberOfArtboards;
}

/**
 * Get the artboard that has the global artboard option selected or null if not found
 * @returns {Artboard}
 **/
function getGlobalArtboard() {
	const { root } = require("scenegraph");
	var items = root.children;
	var numberOfItems = items ? items.length : 0;
	var artboards = [];
	var pluginDataModel = null;

	// exclude pasteboard items
	for (let index = 0; index < numberOfItems; index++) {
		/** @type {Artboard} */
		let item = items.at(index);
		let isArtboard = getIsArtboard(item);

		if (isArtboard) {
			pluginDataModel = getArtboardModelPluginDataOnly(item);
			if (pluginDataModel.isGlobalArtboard) {
				return item;
			}
		}
	}

	return null;
}

/**
 * Get all artboards in the project. Excludes pasteboard items
 * @returns {Array}
 */
function getAllArtboardsGUIDs() {
	const { root } = require("scenegraph");
	var items = root.children;
	var numberOfItems = items ? items.length : 0;
	var artboards = [];

	// exclude pasteboard items
	for (let index = 0; index < numberOfItems; index++) {
		let item = items.at(index);
		let isArtboard = getIsArtboard(item);

		if (isArtboard) {
			artboards.push(item.guid);
		}
	}

	return artboards;
}

/**
 * Get guids from artboards
 * @returns {Array} artboards
 **/
function getGUIDsFromArtboards(artboards) {
	const { root } = require("scenegraph");
	var items = root.children;
	var numberOfItems = items ? items.length : 0;
	var guids = [];

	// exclude pasteboard items
	for (let index = 0; index < numberOfItems; index++) {
		let item = items.at(index);
		let isArtboard = getIsArtboard(item);

		if (isArtboard) {
			guids.push(item.guid);
		}
	}

	return guids;
}

/**
 * Get previous artboard. Called from export dialog
 **/
async function previousArtboard() {
	var artboardIndex = getArtboardIndex(globalModel.selectedArtboardModel.artboard);
	var artboard = null;
	
	try {

		if (artboardIndex>0) {

			await updateArtboardModelAndSave();
			
			artboard = getArtboardByIndex(artboardIndex-1);
			
			await initializeGlobalModel(globalModel.selection, globalModel.documentRoot, false, artboard);
			
			await updateMainFormWithArtboardModelValues();
			
			hideMainUIMessageControls();
			
			if (isBasicScreenDisplayed()) {
				showExportingLabel(form.basicInstructions);
			}
			else {
				showExportingLabel(form.instructions);
			}
		}
	}
	catch(error) {
		log(error.stack);
		addError("Previous artboard error", error);
	}

}

/**
 * Get next artboard. Called from export dialog
 **/
async function nextArtboard() {
	var artboardIndex = getArtboardIndex(globalModel.selectedArtboardModel.artboard);
	var numberOfArtboards = getNumberOfArtboards();
	var artboard = null;

	try {
		
		if (artboardIndex<numberOfArtboards-1) {
			updateArtboardModelAndSave();

			artboard = getArtboardByIndex(artboardIndex+1);

			await initializeGlobalModel(globalModel.selection, globalModel.documentRoot, false, artboard);
	
			await updateMainFormWithArtboardModelValues();
			
			hideMainUIMessageControls();
	
			if (isBasicScreenDisplayed()) {
				showExportingLabel(form.basicInstructions);
			}
			else {
				showExportingLabel(form.instructions);
			}
		}
	}
	catch(error) {
		log(error.stack);
		addError("Next artboard error", error);
	}
}

/**
 * Get an artboard by it's index in the root node. 
 * TODO Does not exclude pasteboard items. 
 * @param {Number} selectedIndex 
 * @returns {Artboard}
 **/
function getArtboardByIndex(selectedIndex) {
	var artboards = globalModel.documentRoot.children;
	var numberOfArtboards = artboards.length;

	for (let index = 0; index < numberOfArtboards; index++) {
		if (selectedIndex==index) {
			return artboards.at(index);
		}
	}

	return null;
}

/**
 * Gets an array of artboards from the current selection
 * @returns {Array}
 **/
function getSelectedArtboards() {
	const {selection} = require("scenegraph");
	var selectedItems = selection.items.splice(0); // copy the array 
	var selectedArtboards = [];

	for (let index = 0; index < selectedItems.length; index++) {
		let item = selectedItems[index];
		let isArtboard = getIsArtboard(item);

		if (isArtboard) {
			selectedArtboards.push(item);
		}
	}

	selectedArtboards.reverse();

	return selectedArtboards;
}

/**
 * Gets an array of artboards from the current selection
 * @returns {Array}
 **/
function getSelectedArtboardGUIDs() {
	const {selection} = require("scenegraph");
	var selectedItems = selection.items.splice(0); // copy the array 
	var selectedArtboards = [];

	for (let index = 0; index < selectedItems.length; index++) {
		let item = selectedItems[index];
		let isArtboard = getIsArtboard(item);

		if (isArtboard) {
			selectedArtboards.push(item.guid);
		}
	}

	return selectedArtboards;
}

/**
 * Gets an array of the artboard names
 * @param {Array} artboards
 * @returns {Array}
 **/
function getArtboardNames(artboards) {
	var names = [];

	for (let index = 0; index < artboards.length; index++) {
		let item = artboards[index];
		let isArtboard = getIsArtboard(item);

		if (isArtboard) {
			names.push(item.name);
		}
	}

	return names;
}

/**
 * Get a string of the artboard names
 * @param {Array} artboards
 * @returns {String}
 **/
function getArtboardNamesAsString(artboards, separator = ",") {
	var names = getArtboardNames(artboards);

	return names.join(separator);
}

/**
 * Gets an array of artboards by their GUID
 * @returns {Array} items list of guids
 **/
function getArtboardsFromGUIDs(items) {
	const {root} = require("scenegraph");
	var designViewItems = root.children;
	var numberOfDesignViewItems = designViewItems ? designViewItems.length : 0;
	var artboards = [];

	if (items==null || items.length==0) return [];

	for (let index = 0; index < numberOfDesignViewItems; index++) {
		let item = designViewItems.at(index);
		let isArtboard = getIsArtboard(item);

		if (isArtboard && items.indexOf(item.guid)!=-1) {
			artboards.push(item);
		}
	}

	return artboards;
}

/**
 * Returns an artboard by it's GUID
 * @returns {Artboard} 
 **/
function getArtboardFromGUID(guid) {
	const {root} = require("scenegraph");
	var designViewItems = root.children;
	var numberOfDesignViewItems = designViewItems ? designViewItems.length : 0;

	for (let index = 0; index < numberOfDesignViewItems; index++) {
		let item = designViewItems.at(index);
		let isArtboard = getIsArtboard(item);

		if (isArtboard && item.guid==guid) {
			return item;
		}
	}

	return null;
}

function getArtboardIndex(artboard) {
	var artboards = globalModel.documentRoot.children;
	var numberOfArtboards = artboards.length;

	for (let index = 0; index < numberOfArtboards; index++) {
		if (artboard==artboards.at(index)) {
			return index;
		}
	}

	return -1;
}

/**
 * Save the values from the main form to the artboard model
 * @param {Event} event 
 **/
async function updateArtboardModelAndSave(event = null) {
	var b = debugModel.preferences;

	await updateArtboardModelWithMainFormValues(globalArtboardModel);
	
	setSceneNodePluginData(globalArtboardModel.artboard, globalArtboardModel.getPreferencesData());

	if (globalModel.liveExport) {
		await submitMainForm(event);
	}
}

/**
 * Update artboard model with main export artboard form
 * @param {ArtboardModel} artboardModel 
 **/
function updateArtboardModelWithMainFormValues(artboardModel) {
	var b = debugModel.preferences;
	var selectedArtboards = [];
	var selectedArtboardGUIDs = null;
	var userSelectedArtboards = [];
	var userSelectedArtboardNames = [];
	var scaleValue;

	var exportList = mainForm.artboardSelectionSelect.value;
	var exportType = mainForm.exportPluralitySelect.value;
	var isGlobalArtboard = mainForm.globalArtboardCheckbox.checked;

	if (exportType==XDConstants.SINGLE_PAGE_NAVIGATION ||
		exportType==XDConstants.SINGLE_PAGE_MEDIA_QUERY || 
		exportType==XDConstants.SINGLE_PAGE_APPLICATION) {
		globalModel.exportToSinglePage = true;
	}
	else {
		globalModel.exportToSinglePage = false;
	}
	
	// selected artboards come from the current selection. usually if more than one selected than updated
	var exportArtboardsRangeGUIDs = artboardModel.exportArtboardsRange;
	selectedArtboards = getSelectedArtboards();
	userSelectedArtboards  = getArtboardsFromGUIDs(exportArtboardsRangeGUIDs);
	userSelectedArtboardNames  = getArtboardNames(userSelectedArtboards);
	selectedArtboardGUIDs  = getGUIDsFromArtboards(selectedArtboards).join(",");

	// updated in exportListChangeHandler
	if (exportList==XDConstants.SELECTED_ARTBOARDS) {
		//log("userSelectedArtboardNames:" + userSelectedArtboardNames)
	}

	globalModel.exportMultipleArtboards = exportList==XDConstants.SELECTED_ARTBOARDS || exportList==XDConstants.ALL_ARTBOARDS;
	globalModel.exportAsSinglePageApplication = exportType==XDConstants.SINGLE_PAGE_APPLICATION;
	globalModel.showArtboardsByControls = exportType==XDConstants.SINGLE_PAGE_NAVIGATION;
	globalModel.showArtboardsByMediaQuery = exportType==XDConstants.SINGLE_PAGE_MEDIA_QUERY;
	globalModel.exportType = exportType;
	globalModel.exportArtboardsRange = exportArtboardsRangeGUIDs;
	globalModel.exportArtboardsList = getArtboardsFromGUIDs(exportArtboardsRangeGUIDs);
	globalModel.exportList = exportList;
	
	artboardModel.exportToSinglePage = globalModel.exportToSinglePage;
	artboardModel.exportArtboardsRange = globalModel.exportArtboardsRange;
	artboardModel.showArtboardsByControls = globalModel.showArtboardsByControls;
	artboardModel.showArtboardsByMediaQuery = globalModel.showArtboardsByMediaQuery;
	artboardModel.singlePageApplication = globalModel.exportAsSinglePageApplication;
	artboardModel.exportList = globalModel.exportList;
	artboardModel.exportType = globalModel.exportType;
	artboardModel.isGlobalArtboard = isGlobalArtboard;


	// make sure to check for updated selected artboards
	updateSelectedArtboards(artboardModel);

	// when exporting a single artboard disable export multipage - single page options
	updateExportArtboardsLists(exportList);

	updateExportArtboardsLabel();

	if (mainForm.overflowList) {
		artboardModel.overflow = mainForm.overflowList.value;
	}

	if (mainForm.alternativeFontInput) {
		artboardModel.alternativeFont = mainForm.alternativeFontInput.value;
	}
 
	if (mainForm.exportFolderInput) {
		// excluding for multiple reasons: 
		// 1. privacy - sharing projects another user can see export path
		// 2. output folder can be different between multiple users
		// 3. output folder must be selected each time so no point storing folder location
		//artboardModel.exportFolder = mainForm.exportFolderInput.value;
		artboardModel.exportFolder = null;
	}

	if (mainForm.imagesFolderInput) {
		artboardModel.imagesExportFolder = mainForm.imagesFolderInput.value;
	}

	if (mainForm.imagesPrefixInput) {
		artboardModel.imagesPrefix = mainForm.imagesPrefixInput.value;
	}

	if (mainForm.image2xCheckbox) {
		artboardModel.image2x = mainForm.image2xCheckbox.checked;
	}

	if (mainForm.embedImagesCheckbox) {
		artboardModel.embedImages = mainForm.embedImagesCheckbox.checked;
	}

	if (mainForm.embedColorLimitInput) {
		artboardModel.embedColorLimit = mainForm.embedColorLimitInput.value;
		globalModel.embedImageColorLimit = mainForm.embedColorLimitInput.value;
	}
  
	if (mainForm.templateFileInput) {
		artboardModel.templateFile = mainForm.templateFileInput.value;
	}

	if (mainForm.additionalStylesInput) {
		artboardModel.additionalStyles = mainForm.additionalStylesInput.value;
	}

	if (mainForm.subStylesInput) {
		artboardModel.subStyles = mainForm.subStylesInput.value;
	}

	if (mainForm.scaleToFitCheckbox) {
		//artboardModel.scaleToFit = mainForm.scaleToFitCheckbox.checked;
	}

	if (mainForm.scaleToFitList) {
		var scaleToFitOption = mainForm.scaleToFitList.value;
		
		if (scaleToFitOption) {
			artboardModel.scaleToFit = scaleToFitOption.value!="default";
			artboardModel.scaleToFitType = scaleToFitOption.value;
		}
		else {
			artboardModel.scaleToFit = false;
			artboardModel.scaleToFitType = "default";
		}
	}

	if (mainForm.enableScaleUpCheckbox) {
		artboardModel.enableScaleUp = mainForm.enableScaleUpCheckbox.checked;
	}

	if (mainForm.scaleOnDoubleClickCheckbox) {
		artboardModel.scaleOnDoubleClick = mainForm.scaleOnDoubleClickCheckbox.checked;
	}

	if (mainForm.actualSizeOnDoubleClickCheckbox) {
		artboardModel.actualSizeOnDoubleClick = mainForm.actualSizeOnDoubleClickCheckbox.checked;
	}

	if (mainForm.scaleInput.value=="") {
		artboardModel.scaleFactor = 1;
	}
 	else {
		scaleValue = mainForm.scaleInput.value;
		if (isNaN(scaleValue)) scaleValue = 1;
		scaleValue = scaleValue*100;
		scaleValue = parseInt(scaleValue+"")/100;
		artboardModel.scaleFactor = scaleValue;
		//log("Scale value:" + scaleValue);
	}

	if (mainForm.navigateOnKeypressCheckbox) {
		artboardModel.navigateOnKeypress = mainForm.navigateOnKeypressCheckbox.checked;
	}

	if (mainForm.scaleOnResizeCheckbox) {
		artboardModel.scaleOnResize = mainForm.scaleOnResizeCheckbox.checked;
	}

	if (mainForm.titleInput.value=="") {
		artboardModel.title = null;
	}
	else {
		artboardModel.title = mainForm.titleInput.value;
	}

	if (trim(mainForm.pageNameInput.value)=="") {
		artboardModel.filename = null;
	}
	else {
		artboardModel.filename = mainForm.pageNameInput.value;
	}

	if (trim(mainForm.pageFolderInput.value)=="") {
		artboardModel.subFolder = null;
	}
	else {
		artboardModel.subFolder = mainForm.pageFolderInput.value;
	}

	artboardModel.externalStylesheet = mainForm.externalStylesheetCheckbox.checked;

	if (trim(mainForm.stylesheetNameInput.value)=="") {
		artboardModel.stylesheetFilename = null;
	}
	else {
		artboardModel.stylesheetFilename = mainForm.stylesheetNameInput.value;
	}

	if (trim(mainForm.stylesheetFolderInput.value)=="") {
		artboardModel.stylesheetSubFolder = null;
	}
	else {
		artboardModel.stylesheetSubFolder = mainForm.stylesheetFolderInput.value;
	}

	artboardModel.setStylesInline = mainForm.setStylesInlineCheckbox.checked;

	artboardModel.externalScript = mainForm.externalScriptCheckbox.checked;

	if (trim(mainForm.scriptNameInput.value)=="") {
		artboardModel.scriptFilename = null;
	}
	else {
		artboardModel.scriptFilename = mainForm.scriptNameInput.value;
	}

	if (trim(mainForm.scriptFolderInput.value)=="") {
		artboardModel.scriptSubFolder = null;
	}
	else {
		artboardModel.scriptSubFolder = mainForm.scriptFolderInput.value;
	}

	if (trim(mainForm.serverInput.value)=="") {
		artboardModel.server = null;
	}
	else {
		artboardModel.server = mainForm.serverInput.value;
	}
	
	if (mainForm.addRootContainerCheckbox) {
		artboardModel.addRootContainer = mainForm.addRootContainerCheckbox.checked;
	}

	if (mainForm.widthInput) {
		artboardModel.alternateWidth = mainForm.widthInput.value;
	}

	if (mainForm.heightInput) {
		artboardModel.alternateHeight = mainForm.heightInput.value;
	}

	if (mainForm.refreshPageCheckbox) {
		artboardModel.refreshPage = mainForm.refreshPageCheckbox.checked;
	}

	artboardModel.centerHorizontally = mainForm.centerHorizontallyCheckbox.checked;
	artboardModel.centerVertically = mainForm.centerVerticallyCheckbox.checked;
	//documentModel.inheritCommonStyles = mainForm.inheritCommonsStylesCheckbox;
	artboardModel.showOutline = mainForm.showOutlineCheckbox.checked;
	artboardModel.showScaleSlider = mainForm.showScaleSliderCheckbox.checked;
	artboardModel.markupOnly = mainForm.markupOnlyCheckbox.checked;
	artboardModel.useClassesToStyleElements = mainForm.useClassesToStyleElementsCheckbox.checked;

	if (mainForm.imageComparisonCheckbox) {
		artboardModel.addImageComparison = mainForm.imageComparisonCheckbox.checked;
	}

	if (mainForm.addDataNamesCheckbox) {
		artboardModel.addDataNames = mainForm.addDataNamesCheckbox.checked;
	}

	if (hostForm.postLinkInput) {
		artboardModel.postLinkID = hostForm.postLinkInput.value;
	}

	if (hostForm.customDomainTypeRadio.checked) {
		artboardModel.customDomain = true;
	}
	else {
		artboardModel.customDomain = false;
	}

	mainForm.warningsTextarea.value = "";
	mainForm.warningsTextarea.innerHTML = "";
	mainForm.messagesLabel.textContent = "Messages";

	hideMainUIMessageControls();
}

/**
 * Update the visibility of the exportPluralitySelect form item
 **/
function updateExportArtboardsLists(exportList) {
	if (exportList==XDConstants.SELECTED_ARTBOARD) {
		//mainForm.artboardSelectionSelect.style.flex = "1";
		//mainForm.exportPluralitySelect.style.display = Styles.BLOCK;
		//mainForm.exportPluralitySelect.style.flex = null;
		//mainForm.globalArtboardLabel.style.width = getPx(200);
		//mainForm.globalArtboardLabel.style.textAlign = "left";
		//mainForm.globalArtboardLabel.style.marginRight = getPx(0);
	}
	//else {
		mainForm.artboardSelectionSelect.style.flex = null;
		//mainForm.exportPluralitySelect.style.display = Styles.BLOCK;
		//mainForm.exportPluralitySelect.style.flex = "1";
		mainForm.globalArtboardLabel.style.width = null;
		mainForm.globalArtboardLabel.style.textAlign = "right";
		mainForm.globalArtboardLabel.style.marginRight = getPx(4);
	//}
}

/**
 * Update the visibility of the scalescreen form area
 **/
function updateScaleScreenForm() {
	var scaleFitType = globalArtboardModel.scaleToFitType;

	if (scaleFitType=="default") {
		showScaleScreenVisibility(false);
	}
	else {
		showScaleScreenVisibility();
	}
}

/**
 * Handle when the export type selection changes
 **/
function exportListSelectHandler(event = null) {
	var b = debugModel.preferences;
	var selectedArtboards = [];
	var selectedArtboardGUIDs = null;
	var userSelectedArtboards = [];
	var selectedArtboardModel = globalModel.selectedArtboardModel
	//var exportArtboardsRangeGUIDs = mainForm.exportRangeInput.value;
	var exportArtboardsRangeGUIDs = selectedArtboardModel.exportArtboardsRange;
	var exportList = mainForm.artboardSelectionSelect.value;
	
	// if user selects the option to export the selected artboards then make sure something is selected 
	if (exportList==XDConstants.SELECTED_ARTBOARDS) {
		
		updateSelectedArtboards(selectedArtboardModel);

		//mainForm.exportRangeInput.value = artboardModel.exportArtboardsRange;

		b && log("artboardModel.exportArtboardsRange:" + getArtboardNames(globalArtboardModel.exportArtboardList))
		//log("after mainForm.exportRangeInput.value:" + mainForm.exportRangeInput.value)
	}

	updateArtboardModelAndSave(event);
}

/**
 * Update the artboard model with the selected artboards if different
 * @param {ArtboardModel} artboardModel 
 * @param {Boolean} reselect select the artboards intentionally instead of using hueristics 
 * @returns {Boolean} returns true if selection has changed
 **/
function updateSelectedArtboards(artboardModel, reselect = false) {
	var b = debugModel.updateSelectedArtboards;
	var selectedArtboards = getSelectedArtboards();
	var selectedArtboardNames = getArtboardNames(selectedArtboards);
	var selectedArtboardGUIDs = getSelectedArtboardGUIDs();
	var selectedArtboardGUIDValue = selectedArtboardGUIDs.join(",");
	var userSelectedArtboards = [];
	var rangeGUIDs = artboardModel.exportArtboardsRange;
	var exportList = artboardModel.exportList;
	var selectionUpdated = false;
	var allArtboards = globalModel.allArtboards;
	var allArtboardGUIDs = getGUIDsFromArtboards(allArtboards).join(",");
	
	selectedArtboardGUIDs = getSelectedArtboardGUIDs();
	userSelectedArtboards = getArtboardsFromGUIDs(rangeGUIDs);
	selectedArtboardGUIDValue = selectedArtboardGUIDs.join(",");


	b && log("Selected artboards:" + selectedArtboardNames);
	b && log("Selected selectedArtboardGUIDs:" + selectedArtboardGUIDValue);

	if (reselect) {
		if (selectedArtboards.length>0) {
			b && log("user selected more than one artboard. setting or overwriting previous selected.")
			artboardModel.exportArtboardsRange = selectedArtboardGUIDValue;
			artboardModel.exportArtboardList = selectedArtboards;
			selectionUpdated = true;
		}
		else if (globalModel.numberOfArtboards>0) {
			artboardModel.exportArtboardsRange = allArtboardGUIDs;
			artboardModel.exportArtboardList = allArtboards;
			selectionUpdated = true;
		}
	}
	else if (exportList==XDConstants.SELECTED_ARTBOARDS) {

		// if more than one artboard is selected then reset the selected artboards
		// if a single artboard is selected and pre selected artboards exist then use those
		// otherwise select all
		if (selectedArtboards.length>1) {
			b && log("user selected more than one artboard. setting or overwriting previous selected.")
			artboardModel.exportArtboardsRange = selectedArtboardGUIDValue;
			artboardModel.exportArtboardList = selectedArtboards;
			selectionUpdated = true;
		}
		else if (userSelectedArtboards.length) {
			b && log("user has already selected artboards. no change")
			//artboardModel.exportArtboardsRange = rangeGUIDs;
			//artboardModel.exportArtboardList = userSelectedArtboards;
		}
		else {
			b && log("no user selected artboards and only one artboard selected")

			artboardModel.exportArtboardsRange = allArtboardGUIDs;
			artboardModel.exportArtboardList = allArtboards;

			selectionUpdated = true;
		}
	}


	b && log("exportArtboardsRange:" + artboardModel.exportArtboardsRange);
	b && log("exportArtboardList:" + getArtboardNames(artboardModel.exportArtboardList));

	if (selectionUpdated) {
		globalModel.exportArtboardsRange = artboardModel.exportArtboardsRange;
		globalModel.userSelectedArtboards = artboardModel.exportArtboardList;
		return true;
	}

	return false;
}

/**
 * Update the header of the main export dialog
 **/
async function updateExportArtboardsLabel() {
	var b = debugModel.updateExportArtboardsLabel;
	var labelValue = "";
	var exportList = globalModel.exportList;
	let selectedArtboardModel = globalModel.selectedArtboardModel;
	let exportMultipleArtboards = globalModel.exportMultipleArtboards;
	var index = selectedArtboardModel.index + 1;
	var exportRange = selectedArtboardModel.exportArtboardsRange;
	var exportArtboardList = selectedArtboardModel.exportArtboardList;
	var userSelectedArtboards = getArtboardsFromGUIDs(exportRange);
	var isGlobalArtboard = selectedArtboardModel.isGlobalArtboard;
	var userSelectedArtboardNames = getArtboardNamesAsString(userSelectedArtboards);
	var nameLabel = "";

	b && log("exportArtboardsRange:" + exportRange);
	b && log("exportArtboardList:" + getArtboardNamesAsString(exportArtboardList));
	
	if (exportList==null || exportList==XDConstants.SELECTED_ARTBOARD) {
		labelValue = globalModel.exportArtboardLabel; // Export Artboard
	}
	else if (exportList==XDConstants.SELECTED_ARTBOARDS) {
		if (globalModel.exportToSinglePage) {
			labelValue = globalModel.exportSelectedArtboardsToPageLabel;
		}
		else if (globalModel.exportToSinglePage==false) {
			labelValue = globalModel.exportSelectedArtboardsToPagesLabel;
		}

	}
	else if (exportList==XDConstants.ALL_ARTBOARDS) {

		if (globalModel.exportToSinglePage) {
			labelValue = globalModel.exportAllArtboardsToPageLabel;
		}
		else if (globalModel.exportToSinglePage==false) {
			labelValue = globalModel.exportAllArtboardsToPagesLabel;
		}
	}

	// live export - TODO show when auto export is enabled
	if (globalModel.liveExport || globalModel.exportOnUpdate) {
		labelValue += " " + globalModel.liveExportLabel;
		mainForm.submitButton.textContent = globalModel.exportButtonLiveLabel;
	}
	else {
		mainForm.submitButton.textContent = globalModel.exportButtonLabel;
	}

	b && log("exportMultipleArtboards:" + exportMultipleArtboards)
	b && log("exportList:" + exportList)
	
	mainForm.headerLabel.textContent = labelValue;


	if (selectedArtboardModel) {
		nameLabel = selectedArtboardModel.name + " (" + index + " of " + globalModel.numberOfArtboards + ")";
		
		// show number selected artboards label
		if (exportList==XDConstants.SELECTED_ARTBOARDS) {
			var numberOfPreviousSelectedArtboards = userSelectedArtboards.length;
			var selectedLabel = "";

			if (numberOfPreviousSelectedArtboards>1) {
				selectedLabel = "(" + userSelectedArtboards.length + ")";
			}
			else {
				selectedLabel = "(1)";
			}
			
			nameLabel += " " + selectedLabel;
		}
		else {
			selectedLabel = "";
		}

		mainForm.nameLabel.textContent = nameLabel;
	}


	if (isGlobalArtboard) {
		mainForm.globalArtboardIcon.src = form.globalArtboardIconPath;
		mainForm.globalArtboardIcon.style.display = Styles.BLOCK;
	}
	else {
		mainForm.globalArtboardIcon.src = form.globalArtboardIconPath;
		mainForm.globalArtboardIcon.style.display = Styles.NONE;
	}

	// show single artboard icon or multiple artboards icons
	if (exportMultipleArtboards) {
		mainForm.artboardIcon.src = form.artboardsIconPath;
		mainForm.artboardIcon.style.display = Styles.DISPLAY;
	}
	else {
		mainForm.artboardIcon.src = form.artboardIconPath;
		mainForm.artboardIcon.style.display = Styles.NONE;
	}
	
	if (exportList==XDConstants.SELECTED_ARTBOARDS) {
		mainForm.artboardIcon.title = userSelectedArtboardNames;
	}
	else {
		mainForm.artboardIcon.title = "";
	}

	// show artboard preview in icon
	// commenting out because last call never resolves
	// Error: Multiple createRenditions() calls cannot run concurrently. 
	// Wait for the previous call's Promise to resolve before calling again.
	try {

		mainForm.artboardPreviewIcon.style.display = Styles.NONE;
		//mainForm.artboardPreviewIcon.src = await getBase64FromSceneNode(globalModel.selectedArtboard);
		//mainForm.artboardPreviewIcon.style.display = Styles.BLOCK;
	}
	catch(error) {
		mainForm.artboardPreviewIcon.style.display = Styles.NONE;
	}
}

/**
 * Update the images options in the main form
 **/
function updateArtboardImageOptions() {
	let selectedArtboardModel = globalModel.selectedArtboardModel;
	var embedImages = selectedArtboardModel.embedImages;

	if (embedImages) {
		showBlockElement(mainForm.embedColorLimitInput);
		showBlockElement(mainForm.embedColorLimitLabel);
	}
	else {
		//hideElement(mainForm.embedColorLimitInput);
		//hideElement(mainForm.embedColorLimitLabel);
	}
}


/**
 * Updates the main export artboard form with artboard model values stored in the plugin data
 **/
async function updateMainFormWithArtboardModelValues() {
	var b = debugModel.preferences;
	let selectedArtboardModel = globalModel.selectedArtboardModel;
	var position = selectedArtboardModel.index + 1;
	var exportList = selectedArtboardModel.exportList;
	var exportArtboardsTo = null;

	if (exportList==null) {
		exportList = XDConstants.SELECTED_ARTBOARD;
	}

	// make sure to check for updated selected artboards
	
	var selectedArtboardsHasChanged = updateSelectedArtboards(selectedArtboardModel);

	var userSelectedArtboardsValue = selectedArtboardModel.exportArtboardsRange;
	var userSelectedArtboards = getArtboardsFromGUIDs(userSelectedArtboardsValue);
	var userSelectedArtboardNames = getArtboardNames(userSelectedArtboards);

	globalModel.exportList = exportList;
	globalModel.exportArtboardsRange = userSelectedArtboardsValue;
	globalModel.exportArtboardsList = userSelectedArtboards;
	globalModel.exportToSinglePage = selectedArtboardModel.exportToSinglePage;
	globalModel.showArtboardsByControls = selectedArtboardModel.showArtboardsByControls;
	globalModel.showArtboardsByMediaQuery = selectedArtboardModel.showArtboardsByMediaQuery;
	globalModel.exportToSinglePage = selectedArtboardModel.exportToSinglePage;
	globalModel.exportAsSinglePageApplication = selectedArtboardModel.singlePageApplication;
	globalModel.exportType = selectedArtboardModel.exportType;
	globalModel.exportMultipleArtboards = exportList==XDConstants.SELECTED_ARTBOARDS || exportList==XDConstants.ALL_ARTBOARDS;

	if (globalModel.exportAsSinglePageApplication) {
		exportArtboardsTo = XDConstants.SINGLE_PAGE_APPLICATION;
	}
	else if (globalModel.showArtboardsByControls) {
		exportArtboardsTo = XDConstants.SINGLE_PAGE_NAVIGATION;
	}
	else if (globalModel.showArtboardsByMediaQuery) {
		exportArtboardsTo = XDConstants.SINGLE_PAGE_MEDIA_QUERY;
	}
	else {
		exportArtboardsTo = XDConstants.MULTIPAGE;
	}
	
	// todo: save with exportType - need to test
	//mainForm.exportPluralitySelect.value = globalModel.exportType;
	mainForm.exportPluralitySelect.value = exportArtboardsTo;
	mainForm.artboardSelectionSelect.value = exportList;
	mainForm.globalArtboardCheckbox.checked = selectedArtboardModel.isGlobalArtboard;
	

	if (exportList==XDConstants.SELECTED_ARTBOARDS) {
		//mainForm.exportRangeInput.value = userSelectedArtboardNames.join(",");
	}
	else {
		//mainForm.exportRangeInput.value = "";
	}


	updateExportArtboardsLists(exportList);
	await updateExportArtboardsLabel();
	updateArtboardImageOptions();
	updateTemplateFormItems(true);
	updateExpectedOutputFormItems(true);

	// we are not updating the text field unless the folder has already been selected since we can't get the folder manually
	if (form.exportFolder!=null && form.exportFolder.isFolder) {
		mainForm.exportFolderInput.value = form.exportFolder.nativePath;//selectedArtboardModel.exportFolder;
	}
	else {
		mainForm.exportFolderInput.value = null;
	}

	if (selectedArtboardModel.overflow) {
		mainForm.overflowList.value = selectedArtboardModel.overflow;
	}
	else {
		mainForm.overflowList.value = OverflowOptions.HIDDEN;
	}

	if (mainForm.alternativeFontInput) {
		mainForm.alternativeFontInput.value = getString(selectedArtboardModel.alternativeFont);
	}

	if (mainForm.imagesFolderInput) {
		mainForm.imagesFolderInput.value = getString(selectedArtboardModel.imagesExportFolder);
	}

	if (mainForm.imagesPrefixInput) {
		mainForm.imagesPrefixInput.value = getString(selectedArtboardModel.imagesPrefix);
	}

	if (mainForm.templateFileInput) {
		mainForm.templateFileInput.value = getString(selectedArtboardModel.templateFile);
	}

	if (mainForm.additionalStylesInput) {
		mainForm.additionalStylesInput.value = getString(selectedArtboardModel.additionalStyles);
	}

	if (mainForm.subStylesInput) {
		mainForm.subStylesInput.value = getString(selectedArtboardModel.subStyles);
	}

	if (selectedArtboardModel.scaleFactor==1) {
		mainForm.scaleInput.value = "";
	}
	else {
		mainForm.scaleInput.value = selectedArtboardModel.scaleFactor + "";
	}

	if (mainForm.scaleToFitCheckbox) {
		//mainForm.scaleToFitCheckbox.checked = selectedArtboardModel.scaleToFit;
	}

	if (mainForm.scaleToFitList) {
		var scaleToFit = selectedArtboardModel.scaleToFit;
		var scaleToFitType = selectedArtboardModel.scaleToFitType;
		var scaleToFitOption = getListOption(mainForm.scaleToFitList.options, scaleToFitType, "value", "value");

		if (scaleToFitOption==null) {
			scaleToFitOption = scaleToFit ? mainForm.scaleToFitList.options[1] : mainForm.scaleToFitList.options[0];
		}
		mainForm.scaleToFitList.value = scaleToFitOption.value;
		//mainForm.scaleToFitInput.innerHTML = scaleToFitOption.value.label;
	}

	if (mainForm.image2xCheckbox) {
		mainForm.image2xCheckbox.checked = selectedArtboardModel.image2x;
	}

	if (mainForm.embedImagesCheckbox) {
		mainForm.embedImagesCheckbox.checked = selectedArtboardModel.embedImages;
	}

	if (mainForm.embedColorLimitInput) {
		mainForm.embedColorLimitInput.value = selectedArtboardModel.embedColorLimit;
	}

	if (mainForm.enableScaleUpCheckbox) {
		mainForm.enableScaleUpCheckbox.checked = selectedArtboardModel.enableScaleUp;
	}

	if (mainForm.scaleOnDoubleClickCheckbox) {
		mainForm.scaleOnDoubleClickCheckbox.checked = selectedArtboardModel.scaleOnDoubleClick;
	}

	if (mainForm.actualSizeOnDoubleClickCheckbox) {
		mainForm.actualSizeOnDoubleClickCheckbox.checked = selectedArtboardModel.actualSizeOnDoubleClick;
	}

	if (mainForm.navigateOnKeypressCheckbox) {
		mainForm.navigateOnKeypressCheckbox.checked = selectedArtboardModel.navigateOnKeypress;
	}

	if (mainForm.scaleOnResizeCheckbox) {
		mainForm.scaleOnResizeCheckbox.checked = selectedArtboardModel.scaleOnResize;
	}

	updateScaleScreenForm();

	if (mainForm.refreshPageCheckbox) {
		mainForm.refreshPageCheckbox.checked = selectedArtboardModel.refreshPage;
	}

	if (selectedArtboardModel.title==null) {
		mainForm.titleInput.value = "";
		mainForm.titleInput.placeholder = "Page title (" + selectedArtboardModel.name + ")";
	}
	else {
		mainForm.titleInput.value = selectedArtboardModel.title;
	}

	if (selectedArtboardModel.filename==null) {
		mainForm.pageNameInput.value = "";
		mainForm.pageNameInput.placeholder = "" + selectedArtboardModel.getFilename() + "";
	}
	else {
		mainForm.pageNameInput.value = selectedArtboardModel.filename;
	}

	if (selectedArtboardModel.subFolder==null) {
		mainForm.pageFolderInput.value = "";
	}
	else {
		mainForm.pageFolderInput.value = selectedArtboardModel.subFolder;
	}

	if (selectedArtboardModel.stylesheetFilename==null) {
		mainForm.stylesheetNameInput.value = "";
		mainForm.stylesheetNameInput.placeholder = ""+ selectedArtboardModel.getStylesheetFilename() + "";
	}
	else {
		mainForm.stylesheetNameInput.value = selectedArtboardModel.stylesheetFilename;
	}

	if (selectedArtboardModel.stylesheetSubFolder==null) {
		mainForm.stylesheetFolderInput.value = "";
	}
	else {
		mainForm.stylesheetFolderInput.value = selectedArtboardModel.stylesheetSubFolder;
	}

	if (selectedArtboardModel.scriptFilename==null) {
		mainForm.scriptNameInput.value = "";
		mainForm.scriptNameInput.placeholder = ""+ selectedArtboardModel.getJavaScriptFilename() + "";
	}
	else {
		mainForm.scriptNameInput.value = selectedArtboardModel.scriptFilename;
	}

	if (selectedArtboardModel.scriptSubFolder==null) {
		mainForm.scriptFolderInput.value = "";
	}
	else {
		mainForm.scriptFolderInput.value = selectedArtboardModel.scriptSubFolder;
	}

	if (selectedArtboardModel.server==null) {
		mainForm.serverInput.value = "";
	}
	else {
		mainForm.serverInput.value = selectedArtboardModel.server;
	}

	mainForm.externalScriptCheckbox.checked = selectedArtboardModel.externalScript;
	mainForm.externalStylesheetCheckbox.checked = selectedArtboardModel.externalStylesheet;
	
	mainForm.setStylesInlineCheckbox.checked = selectedArtboardModel.setStylesInline;

	if (mainForm.widthInput) {
		mainForm.widthInput.value = getString(selectedArtboardModel.alternateWidth);
	}

	if (mainForm.heightInput) {
		mainForm.heightInput.value = getString(selectedArtboardModel.alternateHeight);
	}

	if (mainForm.addRootContainerCheckbox) {
		mainForm.addRootContainerCheckbox.checked = selectedArtboardModel.addRootContainer;
	}

	if (mainForm.imageComparisonCheckbox) {
		mainForm.imageComparisonCheckbox.checked = selectedArtboardModel.addImageComparison;
	}

	if (mainForm.addDataNamesCheckbox) {
		mainForm.addDataNamesCheckbox.checked = selectedArtboardModel.addDataNames;
	}

	if (hostForm.postLinkInput) {
		hostForm.postLinkInput.value = selectedArtboardModel.postLinkID;
	}
	else {
		hostForm.postLinkInput.value = "";
	}

	mainForm.centerHorizontallyCheckbox.checked = selectedArtboardModel.centerHorizontally;
	mainForm.centerVerticallyCheckbox.checked = selectedArtboardModel.centerVertically;
	//mainForm.inheritCommonsStylesCheckbox.checked = documentModel.inheritCommonStyles;
	mainForm.showOutlineCheckbox.checked = selectedArtboardModel.showOutline;
	mainForm.showScaleSliderCheckbox.checked = selectedArtboardModel.showScaleSlider;
	mainForm.markupOnlyCheckbox.checked = selectedArtboardModel.markupOnly;
	mainForm.useClassesToStyleElementsCheckbox.checked = selectedArtboardModel.useClassesToStyleElements;

	// need to update 
	if (selectedArtboardsHasChanged) {
		updateArtboardModelAndSave();
	}
}

/**
 * Reset the element model values
 * @param {SceneNode} item
 * @param {Model} model
 * @param {Boolean} showChangedProperties
 **/
function resetElementModel(item, model, showChangedProperties = false) {
	var selectedItems = globalModel.selection.items;

	if (showChangedProperties) {
		showElementModelPreferencesInConsole();
		return;
	}

	try {

		// multiple selection
		if (globalModel.hasSelection && selectedItems.length>1) {
			var data = [];
			var items = [];
			
			for (var i=0;i<selectedItems.length;i++) {
				var selectionItem = selectedItems[i];
				var selectionModel = getModel(selectionItem, true);
				selectionModel.reset(selectionItem);

				items.push(selectionItem);
				data.push(selectionModel.getPreferencesData());
			}
			
			setSceneNodesPluginData(items, data);
			showPanelMessage("Elements reset", true);
		}
		else {
			resetPluginData(item);
			model.reset(item);
			updateElementForm(model);
			showPanelMessage("Element reset", true);
		}
		
		updateElementForm(model);
		updateHREFLinks();
	}
	catch (error) {
		log(error.stack);
	}
}

/**
 * Resets plugin data
 * @param {SceneNode} item 
 **/
function resetPluginData(item) {
	const { root, selection } = require("scenegraph");
	
	if (globalModel.showingPanel) {
		const { editDocument } = require("application");

		editDocument( () => {
			item.pluginData = null;
		});

	}
	else {
		item.pluginData = null;
	}
}

/**
 * Reset the artboard model values
 **/
function resetArtboardModel2() {
  
	try {
		var models = [globalModel.selectedArtboardModel, globalModel.originalArtboardModel];
		
		for (let i = 0; i < models.length; i++) {
			const model = models[i];
			const item = model.artboard;
			
			resetPluginData(item);
			model.reset();
			//log("model.scaleToFit:" + model.scaleToFit)
			createModel(item, 0, 0, true, false, model);
			//log("2 model.scaleToFit: " + model.scaleToFit)
			updateMainFormWithArtboardModelValues();
		}
	}
	catch (error) {
		log(error.stack);
	}
}

/**
 * Open documentation URL
 */
async function openDocumentation(event) {
	const { selection, root } = require("scenegraph");

	try {

		if (event && event.shiftKey) {
			globalModel.showLabelsInPanel = !globalModel.showLabelsInPanel;
			removeElementForm(panelNode)
			showElementDialog(selection, panelNode, true, globalModel.showLabelsInPanel);
		}
		else {
			shell.openExternal(GlobalModel.documentationURL);
		}
	}
	catch(e) {
		log(e);
	}
}

/**
 * Toggle panel on labels
 */
async function togglePanelLabels(event) {
	const { selection, root } = require("scenegraph");

	if (event.shiftKey) {
		globalModel.showLabelsInPanel = !globalModel.showLabelsInPanel;
		removeElementForm(panelNode)
		await showElementDialog(selection, panelNode, true, globalModel.showLabelsInPanel);
		updateElementForm(globalModel.selectedModel)
	}
	else {
		exportOnUpdateCheckbox(event);
	}
}

/**
 * Handle id input keydown event 
 * @param {*} event 
 **/
function idInputKeydown(event) {
	var duration = 500;
	
	setTimeout(() => {
		updateIdInput();
	}, duration);
}

/**
 * Handle when id input changes
 * @param {*} event 
 **/
function idInputChange(event) {

	updateElementModelAndSave(event);
}

/**
 * Handle when hyperlink input changes
 * @param {*} event 
 **/
function hyperlinkInputChange(event) {
	var value = elementForm.hyperlinkInput.value;

	if (value || value!=null) {
		clearHyperlinkDecorations(globalModel.selectedModel, false);
		updateElementModelAndSave();
	}
	else {
		updateElementModelAndSave();
	}
}

/**
 * The input has the same value on keydown
 * @param {Event} event 
 **/
function hyperlinkInputKeypress(event) {

	if (globalModel.selectedModel==null) {
		return;
	}

	// get past edit error 
	if (globalModel.panelVisible) {
		clearHyperlinkDecorations(globalModel.selectedModel, false);
	}
	else {
		hyperlinkInputChange(event);
	}
}

/**
 * Select the artboard that is used in the prototype interaction
 * @param {Event} event 
 **/
function applyPrototypeHyperlink(event) {
	var model = globalModel.selectedModel;

	if (model==null) {
		return;
	}

	var target = getTapTargetDestination(globalModel.selectedElement, model);

	// apply prototype hyperlink
	if (elementForm.interactionButton.src==form.rightChevron) {
		elementForm.hyperlinkInput.value = target.name;
		model.hyperlinkedArtboardGUID = null;
		model.inheritPrototypeLink = true;
		model.hyperlink = null;
		model.hyperlinkElement = null;
		updateElementModelAndSave();
		elementForm.hyperlinkPagesList.selectedIndex = null;
	}
	// remove existing hyperlink or prototype hyperlink
	else if (elementForm.interactionButton.src==form.clearChevron) {
		clearHyperlinkDecorations(model);
		updateElementModelAndSave();
	}
	
}

/**
 * Clears hyperlink text input
 * @param {Model} model 
 **/
function clearHyperlinkDecorations(model, input = true) {
	if (globalModel.selectedModel==null) {
		return;
	}
	elementForm.hyperlinkTargetsList.selectedIndex = null;
	elementForm.hyperlinkArtboardIcon.style.display = Styles.NONE;
	input ? elementForm.hyperlinkInput.value = "" : 0;
	model.hyperlinkedArtboardGUID = null;
	model.inheritPrototypeLink = false;
	model.hyperlink = null;
	model.hyperlinkElement = null;
}

/**
 * Add the list of artboards to the hyperlink list
 **/
function updateHyperlinkFormItems() {
	var artboardNames = [];
	var addStateNamesToPagesList = true;
	var pagesList = elementForm.hyperlinkPagesList;
	var statesList = elementForm.hyperlinkElementsList;
	var element = globalModel.selectedElement;
	var model = globalModel.selectedModel;

	try {
		
		clearListOptions(pagesList);

		// add artboards to pages list
		for (let modelGUID in globalModel.artboardModels) {
			let aModel =  globalModel.artboardModels[modelGUID];
			let artboard = getArtboardFromGUID(modelGUID);
			let option = document.createElement(HTMLConstants.OPTION);
			let name = artboard ? artboard.name : aModel.name;
			option.guid = modelGUID;
			option.filename = aModel.filename;
			option.value = aModel;// name;
			//option.innerHTML = name;
			
			if (name!=null) {
				option.innerText = name;
				option.innerHTML = name;
				artboardNames.push(option);
				pagesList.appendChild(option);
			}
		}

		// add an option to clear the list
		if (artboardNames.length) {
			let option = document.createElement(HTMLConstants.OPTION);
			let name = "(Clear)";
			
			if (name!=null) {
				option.innerText = name;
				option.innerHTML = name;
				option.clearItem = true;
				pagesList.appendChild(option);
			}
		}

		var hasPrototypeLink = hasArtboardDestination(element);

		// show or hide the add or ignore prototype hyperlink

		// is linked via prototype interaction - show clear button
		if (model.inheritPrototypeLink && hasPrototypeLink==true) {
			showBlockElement(elementForm.interactionButton);
			elementForm.interactionButton.src = form.clearChevron;
		}
		// is linked to artboard manually - show clear button
		else if (model.inheritPrototypeLink && hasPrototypeLink==false && model.hyperlinkedArtboardGUID) {
			showBlockElement(elementForm.interactionButton);
			elementForm.interactionButton.src = form.clearChevron;
		}
		// has prototype link but not inheriting it - show apply button
		else if (model.inheritPrototypeLink==false && hasPrototypeLink==true) {
			showBlockElement(elementForm.interactionButton);
			elementForm.interactionButton.src = form.rightChevron;
		}
		// has hyperlink - show clear button
		else if (model.hyperlink) {
			showBlockElement(elementForm.interactionButton);
			elementForm.interactionButton.src = form.clearChevron;
		}
		// no condition met - do not show
		else {
			elementForm.interactionButton.src = form.interactionButtonPath;  // no prototype link so don't show
			hideElement(elementForm.interactionButton);
		}

		clearListOptions(statesList);
		var statesArray = [];
		
		// add state names to states list
		for (let modelGUID in globalModel.artboardModels) {
			/** @type {ArtboardModel} */
			let aModel =  globalModel.artboardModels[modelGUID];
			let artboard = getArtboardFromGUID(modelGUID);
			let option = document.createElement(HTMLConstants.OPTION);
			let stateName = aModel ? aModel.hyperlinkElement : null;

			option.value = {model:aModel, name:stateName, stateName:stateName, guid: modelGUID, isState: true};
			
			if (stateName!=null && stateName!="" && statesArray.indexOf(stateName)==-1) {
				option.innerText = stateName;
				option.innerHTML = stateName;
				statesArray.push(stateName)
				statesList.appendChild(option);

				// add state names to pages list
				if (addStateNamesToPagesList) {
					if (statesArray.length==1) {
						let ruler = document.createElement(HTMLConstants.OPTION);
						ruler.innerHTML = "-";
						ruler.role = "separator";
						ruler.disabled = true;
						pagesList.appendChild(ruler);
					}

					var pageOption = document.createElement(HTMLConstants.OPTION);
					pageOption.innerText = stateName;
					pageOption.innerHTML = stateName;
					pageOption.value = Object.assign({}, option.value);
					pagesList.appendChild(pageOption);
				}
			}
		}

		// add clear option to states lists
		if (elementForm.hyperlinkElementInput.value) {

			let option = document.createElement(HTMLConstants.OPTION);
			let name = "(Clear)";
			
			if (name!=null) {
				option.innerText = name;
				option.innerHTML = name;
				option.value = {clearItem: true};
				statesList.appendChild(option);
			}
		}
	}
	catch(error) {
		log(error);
	}
}

/**
 * Clears tag name text input
 * @param {Model} model 
 **/
function clearTagNameInput(model, input) {
	input.value = "";
	model.tagName = null;
}

/**
 * Hyperlink target change
 * @param {*} event 
 **/
function hyperlinkTargetListChange(event) {
	var item = event.currentTarget.value;
	
	if (item) {
		elementForm.hyperlinkTargetInput.value = item;
		updateElementModelAndSave();
		event.currentTarget.selectedIndex = null;
	}
}

/**
 * Hyperlink element target change
 * @param {*} event 
 **/
function hyperlinkElementListChange(event) {
	var item = event.currentTarget.value;
	var model = globalModel.selectedModel;
	
	if (item.clearItem) {
		elementForm.hyperlinkElementInput.value = "";
		updateElementModelAndSave();
		event.currentTarget.selectedIndex = null;
	}
	else if (item && item.stateName) {
		elementForm.hyperlinkElementInput.value = getString(item.stateName);
		updateElementModelAndSave();
		event.currentTarget.selectedIndex = null;
	}
}

/**
 * Attempt to select hover effect element
 * @param {*} event 
 **/
function selectHoverEffectElement(event) {
	const viewport = require("viewport");
	var hoverEffectsList = elementForm.hoverEffectsList;
	var option = hoverEffectsList.value;
	var model = globalModel.selectedModel;
	var element = null;
	var guid = model.hoverElementGUID;
	
	if (guid!=null && guid!="") {
		element = getSceneNodeByGUID(guid);
	}
	
	if (element) {
		var selection = [element];

		try {
			editDocument(()=>{
				globalModel.selection.items = selection;
				scrollSceneNodesIntoView(selection, false);
			})
		}
		catch(error) {
			log(error)
		}
	}
}

/**
 * Copy unique styles to hover style declaration - style transfer
 * @param {*} event 
 **/
function copyUniqueStylesToCSSTemplate(event, pseudoClass = "hover") {
	const viewport = require("viewport");
	var hoverEffectsList = elementForm.hoverEffectsList;
	var option = hoverEffectsList.value;
	var item = globalModel.selectedElement;
	var model = globalModel.selectedModel;
	var selectedItems = getArrayFromObject(globalModel.selection.items);
	var secondElement = selectedItems.length>1 ? selectedItems[selectedItems.length-2] : null;
	var element = null;
	var guid = model.hoverElementGUID;
	var stylesIndent = 0;


	try {

		// get already selected hover element 
		if (guid!=null && guid!="") {
			element = getSceneNodeByGUID(guid);
		}

		// if no hover element then select second selected item
		if (element==null && secondElement) {
			element = secondElement;
		}
		else if (element==null) {
			return;
		}

		var styleRules = getChangedStylesObject(item, model, element);

		for (var i=0;i<styleRules.length;i++) {
			const styleRule = styleRules[i];
			const selectorText = styleRule.selectorText;
			const cssBefore = selectorText + " {";
			const cssAfter = "}";
			var cssText = "";

			styleRule.cssArray = getCSSValueArray(styleRule.style);

			cssText = addToStyles(styleRule.cssArray, styleRule.cssText, cssBefore, cssAfter, globalArtboardModel.useStyleLineBreaks, stylesIndent, []);

			if (model.stylesheetTemplate==null) {
				model.stylesheetTemplate = cssText;
			}
			else {
				model.stylesheetTemplate += "\n\n" + cssText
			}
		}

		updateElementModelAndSave();
		showSpan(elementForm.styleTransferLabel, "Styles transfered!", null, true, 1000);
	}
	catch(error) {
		log(error)
	}
}

/**
 * Attempt to select artboards by their state name
 * @param {*} event 
 **/
function selectArtboardsByStateName(event) {
	var stateName = elementForm.hyperlinkElementInput.value;
	var matchingArtboards = [];
	const viewport = require("viewport");

	if (stateName) {
		try {
			for (let modelGUID in globalModel.artboardModels) {
				/** @type {ArtboardModel} */
				let model =  globalModel.artboardModels[modelGUID];
				let artboard = getArtboardFromGUID(modelGUID);

				if (model.hyperlinkElement==stateName) {
					matchingArtboards.push(artboard);
				}
			}

			if (matchingArtboards.length) {
				editDocument(()=>{
					globalModel.selection.items = matchingArtboards;
					scrollSceneNodesIntoView(matchingArtboards, true);
				})
			}
		}
		catch(error) {
			log(error)
		}
	}
}

/**
 * Attempt to select selected artboards
 * @param {*} event 
 **/
function selectSelectedArtboards(event) {
	const viewport = require("viewport");
	var matchingArtboards = [];
	var model = globalModel.selectedArtboardModel;
	var exportArtboardsRange = model ? model.exportArtboardsRange : null;
	var range = exportArtboardsRange ? exportArtboardsRange.split(",") : [];
	var selectedArtboards = getArtboardsFromGUIDs(exportArtboardsRange);

	if (selectedArtboards.length) {
		
		try {
			for (var i=0;i<selectedArtboards.length;i++) {
				//var guid = selectedArtboards[i];
				//var artboard = getSceneNodeByGUID(guid);
				var artboard = selectedArtboards[i];

				if (artboard && model.guid!=artboard.guid) {
					matchingArtboards.push(artboard);
				}
			}

			// add selected artboard last
			if (model.guid) {
				artboard = getSceneNodeByGUID(model.guid);
				matchingArtboards.push(artboard);
			}

			if (matchingArtboards.length) {

				editDocument(()=>{
					globalModel.selection.items = matchingArtboards;
					scrollSceneNodesIntoView(matchingArtboards, true);
				})
			}
		}
		catch(error) {
			log(error)
		}
	}
}

/**
 * Scroll scene nodes into view
 * @param {Array} sceneNodes array of scene nodes to scroll to
 * @param {Boolean} zoom option to zoom out or zoom in to fit 
 */
function scrollSceneNodesIntoView(sceneNodes, zoom = true) {
	const viewport = require("viewport");
	var x = 0;
	var y = 0;
	var width = 0;
	var height = 0;
	var nodeX = 0;
	var nodeY = 0;
	var nodeWidth = 0;
	var nodeHeight = 0;
	var artboard = null;
	
	for (let index = 0; index < sceneNodes.length; index++) {
		/** @type {SceneNode} */
		const sceneNode = sceneNodes[index];

		nodeX = sceneNode.globalBounds.x;
		nodeY = sceneNode.globalBounds.y;
		nodeWidth = sceneNode.globalBounds.x + sceneNode.globalBounds.width;
		nodeHeight = sceneNode.globalBounds.y + sceneNode.globalBounds.height;

		if ((sceneNode instanceof Artboard)==false) {
			var parent = sceneNode.parent;

			while (parent!=null) {

				if (parent instanceof Artboard) {
					artboard = parent;
					nodeX += artboard.globalBounds.x;
					nodeY += artboard.globalBounds.y;
					nodeWidth += artboard.globalBounds.x+artboard.globalBounds.width;
					nodeHeight += artboard.globalBounds.y+artboard.globalBounds.height;
					break;
				}
				else {
					parent = parent.parent;
				}
			}
		}

		if (nodeX<x) {
			x = nodeX;
		}
		if (nodeY<y) {
			y = nodeY;
		}
		if (nodeWidth>width) {
			width = nodeWidth;
		}
		if (nodeHeight>height) {
			height = nodeHeight;
		}
	}

	if (zoom) {
		viewport.zoomToRect(x, y, width, height);
	}

	viewport.scrollIntoView(x, y, width, height);
}

/**
 * Scale to fit list change
 * @param {*} event 
 **/
function scaleToFitListChange(event) {
	var item = event.currentTarget.value;
	
	if (item) {
		//mainForm.scaleToFitInput.innerHTML = item.label;
		updateArtboardModelAndSave();
		updateScaleScreenForm();
		//event.currentTarget.selectedIndex = null;
	}
}

/**
 * Domain type change handler
 * @param {*} event 
 **/
function domainTypeChangeHandler(event) {
	var value = event.currentTarget.value;
	var name = event.currentTarget.name;
	var radio =  event.currentTarget;


	if (event.type=="click") {
		radio = radio.nextSibling;
		radio.checked = true;
	}

	updateDomainForm();	
}

function updateDomainForm() {

	if (hostForm.customDomainTypeRadio.checked) {
		showFlexElements(hostForm.urlInput.parentNode, hostForm.endPointInput.parentNode, hostForm.clearConsoleButton.parentNode, hostForm.debugCheckbox.parentNode);
		hideElement(hostForm.postLinkInput.parentNode);
	}
	else {
		hideElements(hostForm.urlInput.parentNode, hostForm.endPointInput.parentNode, hostForm.clearConsoleButton.parentNode, hostForm.debugCheckbox.parentNode);
	}
}

/**
 * Show login form
 */
function showLoginForm() {
	showBlockElements(hostForm.loginButton);
	showFlexElements(hostForm.usernameInput.parentNode, hostForm.passwordInput.parentNode);
	hideElements(hostForm.logoutButton, hostForm.siteNameLabel.parentNode, 
		hostForm.usernameLabel.parentNode, hostForm.cloudLink.parentNode, hostForm.uploadOnExportCheckbox.parentNode);
}

/**
 * Show logged in info
 * 
 * @param {Array} sites 
 * @param {Object} firstSite 
 * @param {String} user 
 */
function showLoggedInForm(sites, firstSite, user) {
	var authorPath = "/author/";	

	if (firstSite) {
		showSpan(hostForm.siteNameLabel, firstSite.blogname, null, false);
		showSpan(hostForm.usernameLabel, user, null, false);
		hostForm.siteNameLabel.href = firstSite.siteurl;
		hostForm.usernameLabel.href = firstSite.siteurl + authorPath + user;
	}

	hideElements(hostForm.loginButton, hostForm.usernameInput.parentNode, hostForm.passwordInput.parentNode);
	showFlexElements(hostForm.logoutButton, hostForm.siteNameLabel.parentNode, hostForm.usernameLabel.parentNode, 
			hostForm.uploadOnExportCheckbox.parentNode);
}

/**
 * Image format change handler
 * @param {*} event 
 **/
async function imageFormatChangeHandler(event) {
	var item = event.currentTarget.value;
	
	if (item) {
		updateElementModelAndSave();
	}
	
	if (globalModel.showImageSizeOnChange) {
		await showSizeOfImage();
	}
}

/**
 * Image quality change handler
 * @param {*} event 
 **/
async function imageQualityChangeHandler(event) {
	var item = event.currentTarget.value;
	
	if (item) {
		updateElementModelAndSave();
	}
	
	if (globalModel.showImageSizeOnChange) {
		await showSizeOfImage();
	}
}

/**
 * Embed images checkbox handler
 * @param {*} event 
 **/
function embedImagesCheckboxHandler(event) {
	var checkbox = elementForm.embedImageCheckbox;
	var checked = checkbox.checked;
	var embedImages = globalArtboardModel.embedImages;
	var model = globalModel.selectedModel;

	updateElementModelAndSave(event);
}

/**
 * Embed images label checkbox handler
 * @param {*} event 
 **/
function embedImagesLabel(event) {
	// if label clicked do no switch
	if (event.currentTarget!=mainForm.embedImagesCheckbox) {
		var checkbox = mainForm.embedImagesCheckbox;
		checkbox.checked = !checkbox.checked;
	}
	
	updateArtboardModelAndSave(event);
	updateArtboardImageOptions();
}

/**
 * Embed image reset checkbox handler
 * @param {*} event 
 **/
function embedImageResetHandler(event) {
	var checkbox = elementForm.embedImageCheckbox;
	var model = globalModel.selectedModel;

	checkbox.checked = false;
	model.embedImage = null;
	
	updateElementModelAndSave(event);
}

/**
 * Image quality change handler
 * @param {*} event 
 **/
function idInvalidClickHandler(event) {
	var value = elementForm.idInput.value;
	var sanitizedValue = null;

	if (value || value!=null) {
		sanitizedValue = getSanitizedIDName(value);

		if (value!=sanitizedValue) {
			elementForm.idInput.value = sanitizedValue;
		}
	}
	
	var duration = 500;
	
	setTimeout(() => {
		updateIdInput();
	}, duration);
}

/**
 * Show the size of the selected element 
 */
async function showSizeOfImage() {
	var sizes = [];
	var message = "";
	var selectedElement = globalModel.selectedElement;
	var selectedModel = globalModel.selectedModel;
	var format = selectedModel.imageFormat;
	var isAcceptableFormat = isSupportedExportFormat(format);

	if (isAcceptableFormat==false) {
		format = getImageFormat(selectedModel);
	}

	//elementForm.imageSizeLabel.textContent = selectedModel.imageQuality;
	await sleep(1);


	var definition = await getImageExportedSize(selectedElement, format, selectedModel.imageQuality);
	message = "Export size " + getSizeFormattedValue(definition.kbSize);

	showPanelMessage(message, true, true);
	return;
	elementForm.imageSizeLabel.textContent = message;
	
	if (elementForm.panelExportMessageTimeout != null) {
		clearTimeout(elementForm.panelExportMessageTimeout);
	}
	
	elementForm.panelExportMessageTimeout = setTimeout(() => {
		elementForm.imageSizeLabel.textContent = "";
		
	}, globalModel.quickExportNotificationDuration);
}

/**
 * Handles list changes for commonn before and after values
 * @param {Event} event 
 **/
function wrapTagsListChange(event) {
	var item = event.currentTarget.value;
	var list = event.currentTarget;
	var selectedIndex = list.selectedIndex;
	var options = list.options;
	var option = list.selectedOptions[0];

	item = option ? option : item;

	if (item) {

		if (item.clear==true) {
			elementForm.markupBeforeInput.value = "";
			elementForm.markupAfterInput.value = "";
		}
		else if (item.singleton==true) {

			if (item.addTags==true || item.addTags==null) {
				elementForm.markupBeforeInput.value = addTagCharacters(item.value);
			}
			else {
				elementForm.markupBeforeInput.value = item.value;
			}
		}
		else {

			if (item.addTags==true || item.addTags==null) {
				elementForm.markupBeforeInput.value = addTagCharacters(item.value);
				elementForm.markupAfterInput.value = addTagCharacters(item.value, true);
			}
			else {
				elementForm.markupBeforeInput.value = item.value;
				elementForm.markupAfterInput.value = item.value;
			}
		}

		if (item.clearMarkupAfter==true) {
			elementForm.markupAfterInput.value = "";
		}

		updateElementModelAndSave();

		list.selectedIndex = null;
	}
}

/**
 * Layout items in group 
 * @param {Event} event 
 **/
function groupLayoutIconHandler(event, column = false) {
	var horizontalItem = elementForm.groupHorizontalAlignmentList.value;
	var verticalItem = elementForm.groupVerticalAlignmentList.value;
	var layoutItem = elementForm.groupLayoutList.value;
	var model = globalModel.selectedModel;
	var group = globalModel.selectedElement;
	var distributeHorizontally = false;
	var distributeVertically = false;
	var isDefaultLayout = layoutItem=="default";
	let commands = require("commands");
	const { selection } = require("scenegraph");
	const { editDocument } = require("application");

	var items = selection.items;
	var numberOfItems = items.length;

	if (globalModel.showingPanel==false) {
		return;
	}

	// if multiple items selected distribute those items
	if (numberOfItems>1) {
		
		editDocument( () => {
			
			try {
				if (column) {
					commands.distributeVertical();
				}
				else {
					commands.distributeHorizontal();
				}
			}
			catch(error) {
				log(error);
			}
			
		})

		return;
	}
	
	// if a group is selected then distribute the items in the group
	if (column) {
		distributeVertically = true;
	}
	else {
		distributeHorizontally = true;
	}
	
	if (distributeHorizontally) {
		var nodes = filterNonExportables(getChildNodes(group, layoutItem==Styles.ROW_REVERSE));
		
		if (nodes.length) {
			try {
				
				editDocument( () => {
					
					try {
						selection.items = nodes;
						
						commands.distributeHorizontal();
						
						var verticalPosition = verticalItem.label;
						
						if (verticalPosition==Styles.TOP) {
							commands.alignTop();
						}
						else if (verticalPosition==Styles.CENTER) {
							commands.alignVerticalCenter();
						}
						else if (verticalPosition==Styles.BOTTOM) {
							commands.alignBottom();
						}
						
						selection.items = [group];
					}
					catch(error) {
						var string = error.toString();
						
						if (string.includes("Cannot select node outside the current edit")) {	
							// ignore
						}
						else {
							log("Error:" + error.stack);
						}
					}
				});
			}
			catch(error) {
				var string = error.toString();
				
				if (string.includes("Cannot select node outside the current edit")) {	
					// ignore
				}
				else {
					log("Error:" + error.stack);
				}
			}
		}
	}
	else if (distributeVertically) {
		var nodes = filterNonExportables(getChildNodes(group, layoutItem==Styles.COLUMN_REVERSE));
		
		if (nodes.length) {
			
			try {
				const { editDocument } = require("application");
				
				editDocument( () => {
					try {
						selection.items = nodes;
						
						commands.distributeVertical();
						
						var horizontalPosition = horizontalItem.label;
						
						if (horizontalPosition==Styles.LEFT) {
							commands.alignLeft();
						}
						else if (horizontalPosition==Styles.CENTER) {
							commands.alignHorizontalCenter();
						}
						else if (horizontalPosition==Styles.RIGHT) {
							commands.alignRight();
						}
						
						selection.items = [group];
					}
					catch(error) {
						var string = error.toString();
						
						if (string.includes("Cannot select node outside the current edit")) {	
							// ignore
						}
						else {
							log("Error:" + error.stack);
						}
					}
				});
			}
			catch(error) {
				var string = error.toString();
				
				if (string.includes("Cannot select node outside the current edit")) {	
					// ignore
				}
				else {
					log("Error:" + error.stack);
				}
			}
		}
	}
	else {
		//elementForm.groupHorizontalAlignmentList.style.display = Styles.NONE;
		//elementForm.groupHorizontalLayoutInput.style.display = Styles.NONE;
		
		//elementForm.groupVerticalAlignmentList.style.display = Styles.BLOCK;
		//elementForm.groupVerticalLayoutInput.style.display = Styles.BLOCK;
	}

}

/**
 * Handles list changes for group layout
 * @param {Event} event 
 **/
function groupLayoutListChange(event) {
	var horizontalItem = elementForm.groupHorizontalAlignmentList.value;
	var verticalItem = elementForm.groupVerticalAlignmentList.value;
	var layoutItem = elementForm.groupLayoutList.value;
	var model = globalModel.selectedModel;
	var element = globalModel.selectedElement;

	updateGroupLayoutOptions();
	
	updateElementModelAndSave();

	if (globalModel.showingElementDialog) {
		updateElementForm(model);
	}
}

/**
 * Handles list changes for overflow
 * @param {Event} event 
 **/
function overflowListChange(event) {
	var overflowValue = elementForm.overflowList.value;
	var model = globalModel.selectedModel;
	var element = globalModel.selectedElement;
	
	updateElementModelAndSave();

	if (globalModel.showingElementDialog) {
		updateElementForm(model);
	}
}

/**
 * Handles list changes for hover effect list
 * @param {Event} event 
 **/
function hoverEffectsListChange(event) {
	var model = globalModel.selectedModel;
	var element = globalModel.selectedElement;
	var hoverEffectsList = elementForm.hoverEffectsList;
	var object = hoverEffectsList.value;
	
	if (object && object.name == Styles.NONE) {
		model.hoverElementGUID = null;
	}
	else if (object && object.guid) {
		model.hoverElementGUID = object.guid;
	}

	updateElementModelAndSave(event);

	if (globalModel.showingElementDialog) {
		updateElementForm(model);
	}
}

/**
 * Toggle visibility of selected items
 * @param {*} event 
 **/
function toggleLayerVisibility(event) {
	const { selection } = require("scenegraph");
	const { editDocument } = require("application");

	if (selection.items.length) {

		if (globalModel.showingPanel) {
			editDocument( () => {
				//selection.items.forEach((sceneNode)=> {
				for (let index = 0; index < selection.items.length; index++) {
					const sceneNode = selection.items[index];
					
					if (getIsArtboard(sceneNode)==false) {
						sceneNode.visible = !sceneNode.visible;
					}
				}
			});
		}
	}
}

/**
 * Horizontally center the selected items
 * @param {*} event 
 **/
function centerItemsHorizontally(event) {
	const { selection } = require("scenegraph");
	const { editDocument } = require("application");

	if (selection.items.length) {
		var items = getArrayFromObject(selection.items);

		if (globalModel.showingPanel) {
			editDocument( () => {
				centerHorizontally(items);
			});
		}
	}
}

/**
 * Vertically center the selected items
 * @param {*} event 
 **/
function centerItemsVertically(event) {
	const { selection } = require("scenegraph");
	const { editDocument } = require("application");

	if (selection.items.length) {
		var items = getArrayFromObject(selection.items);

		if (globalModel.showingPanel) {
			editDocument( () => {
				centerVertically(items);
			});
		}
	}
}

/**
 * Bottom the selected items
 * @param {*} event 
 **/
function bottomItems(event) {
	const { selection } = require("scenegraph");
	const { editDocument } = require("application");

	if (selection.items.length) {
		var items = getArrayFromObject(selection.items);

		if (globalModel.showingPanel) {
			editDocument( () => {
				bottom(items);
			});
		}
	}
}

/**
 * Top the selected items
 * @param {*} event 
 **/
function topItems(event) {
	const { selection } = require("scenegraph");
	const { editDocument } = require("application");

	if (selection.items.length) {
		var items = getArrayFromObject(selection.items);

		if (globalModel.showingPanel) {
			editDocument( () => {
				top(items);
			});
		}
	}
}

/**
 * Left the selected items
 * @param {*} event 
 **/
function leftItems(event) {
	const { selection } = require("scenegraph");
	const { editDocument } = require("application");

	if (selection.items.length) {
		var items = getArrayFromObject(selection.items);

		if (globalModel.showingPanel) {
			editDocument( () => {
				left(items);
			});
		}
	}
}

/**
 * Right the selected items
 * @param {*} event 
 **/
function rightItems(event) {
	const { selection } = require("scenegraph");
	const { editDocument } = require("application");

	if (selection.items.length) {
		var items = getArrayFromObject(selection.items);

		if (globalModel.showingPanel) {
			editDocument( () => {
				right(items);
			});
		}
	}
}

/**
 * Hyperlink dropdown list change
 * @param {*} event 
 **/
function hyperlinkPagesListChange(event) {
	var item = event.currentTarget.value;
	var model = globalModel.selectedModel;
	
	if (item.clearItem) {
		clearHyperlinkDecorations(model);
		updateElementModelAndSave();
		event.currentTarget.selectedIndex = null;
	}
	else if (item) {

		if (item.isState) {
			elementForm.hyperlinkInput.value = "#" + item.stateName;
			model.hyperlinkedArtboardGUID = null;
		}
		else {
			elementForm.hyperlinkInput.value = item.name;
			model.hyperlinkedArtboardGUID = item.guid;
			elementForm.hyperlinkArtboardIcon.style.display = Styles.BLOCK;
		}

		updateElementModelAndSave();
		event.currentTarget.selectedIndex = null;
	}
}

/**
 * Tag name list change
 * @param {*} event 
 **/
function tagNameListChange(event, subTag = false) {
	var subTag = event.currentTarget==elementForm.subTagNameList;
	var item = subTag ? elementForm.subTagNameList.value : elementForm.tagNameList.value;
	var input = subTag ? elementForm.subTagNameInput : elementForm.tagNameInput;
	var model = globalModel.selectedModel;

	if (item.clearItem) {
		clearTagNameInput(model, input);
		updateElementModelAndSave();
		event.currentTarget.selectedIndex = null;
	}
	else if (item) {
		input.value = item.name;
		model.tagName = item.name;
		updateElementModelAndSave();
		event.currentTarget.selectedIndex = null;
	}
}

/**
 * Cursor list change
 * @param {*} event 
 **/
function cursorListChange(event) {
	var item = elementForm.cursorList.value;
	var model = globalModel.selectedModel;

	if (item==null || item.name=="Cursor") {
		model.cursor = Styles.DEFAULT;
		updateElementModelAndSave();
	}
	else if (item) {
		model.cursor = item.name;
		updateElementModelAndSave();
	}
}

/**
 * Handle blur event when in Windows and field is empty
 * @param {Event} event 
 **/
function updateElementModelAndSaveBlurHandler(event) {

	if (GlobalModel.isMac==false) {
		updateElementModelAndSave(event);
	}
}

/**
 * Update the model with the form values and save to plugin data
 * @param {Event} event event from a form input
 **/
async function updateElementModelAndSave(event = null) {
  var b = debugModel.preferences && log("Updating element model and save()");
  var target = event && event.currentTarget;
  var type = target && target.type;
  var defaultValue = target && target.defaultValue;
  var targetName = target && target.nodeName.toLowerCase();
  var value = target && target.value;
  var selectedItems = globalModel.selection.items;

  try {
	  b && log("Form id value:" + elementForm.idInput.value);
	  
		var model = globalModel.selectedModel;

		// fix for possible bug when in windows text input receives two change events
		// second change event has old values
		if (event && GlobalModel.isMac==false && targetName=="input" && type=="text") {

			if (globalModel.lastFormElement==target && globalModel.skipThisUpdate==true) {
				globalModel.skipThisUpdate = false;
				globalModel.lastFormElement = null;
				return;
			}

			if (value=="") {
				globalModel.lastFormElement = target;
				globalModel.skipThisUpdate = true;
			}

		}

		if (model && globalModel.hasSelection) {
			updateElementModel(model);
			
			// if multiple items are selected and a property is changed then save on all selected items
			if (model.propertyChanges.length && selectedItems.length>1) {
				var data = [];
				var items = [];
				
				for (var i=0;i<selectedItems.length;i++) {
					var selectionItem = selectedItems[i];
					var selectionModel = getModel(selectionItem, true);
					items.push(selectionItem);
					data.push(selectionModel.getPreferencesData());
				}
				
				/*
				for (var j=0;j<model.propertyChanges.length;j++) {
					var property  = model.propertyChanges[j];
					updateSelectedModels(globalModel.selectedModels, property, model[property]);
				}
				*/
				
				model.propertyChanges = [];
				setSceneNodesPluginData(items, data);
			}
			else {
				setSceneNodePluginData(globalModel.selectedElement, model.getPreferencesData());
			}
		}
  }
  catch (error) {
	log(error.stack);

	if (selectedItems.length>1) {
		showPanelMessage("Could not save preferences to multiple items. See console")
	}
	else {
		showPanelMessage("Could not save preferences.")
	}
  }
}

function updateSettingsModelAndSave() {
  var b = debugModel.preferences && log("Updating settings model and save()");
  updateSettingsModelWithSettingsFormValues();
  //createPreferenceData(globalModel.selectedModelPreferences, artboardModel, globalModel.selectedItem);
  //savePreferences(artboardModel.artboard, null, artboardModel.preferencesData);
}

/**
 * Show or hide scene node name input or name label
 * @param {Boolean} show 
 */
function showSceneNodeNameInput(show = true) {

	if (show) {
		hideElement(elementForm.nameLabel);
		showBlockElement(elementForm.nameInput);
		elementForm.nameInput.value = globalModel.selectedElement.name;
		elementForm.nameInput.focus();
	}
	else {
		hideElement(elementForm.nameInput);
		showBlockElement(elementForm.nameLabel);
	}
}

function updateSceneNodeName(e) {
	const { editDocument } = require("application");

	try {

		if (globalModel.showingPanel) {
			editDocument( () => {
				var element = globalModel.selectedElement;
				var name = elementForm.nameInput.value;

				if (trim(name)!=null && trim(name)!="") {
					element.name = name;

					// artboard name is not updating in the form?
					if (getIsArtboard(element)) {
						globalModel.selectedModel.name = name;
						updateElementForm(globalModel.selectedModel);
					}
				}
			});
		}
	}
	catch(error) {
		log(error);
	}
}

/**
 * Update element model with element form values
 * @param {Model} model 
 **/
function updateElementModel(model) {
	var b = debugModel.preferences;
	var id = elementForm.idInput.value;
	var element = globalModel.selectedElement;
	var alternateTagNameChanged = false;
	var stylesChanged = false;
	var subStylesChanged = false;
	var classesChanged = false;
	var subClassesChanged = false;
	var selectedModels = globalModel.selectedModels;
	var numberOfSelectedItems = selectedModels.length;

	model.propertyChanges = [];

	if (model==null && globalModel.hasSelection==false) {
		return;
	}

	model.id = id !=null && id!="" ? id : null;

	b && object(model,"Model");
	b && log("Model id:" + model.id);


	try {
		
		var alternateTagName = elementForm.tagNameInput.value!="" ? elementForm.tagNameInput.value : null;
		var subTagName = elementForm.subTagNameInput.value!="" ? elementForm.subTagNameInput.value : null;
		var additionalAttributes = elementForm.attributesInput.value!="" ? elementForm.attributesInput.value : "";
		var subAttributes = elementForm.subAttributesInput.value!="" ? elementForm.subAttributesInput.value : "";
		var alternateWidth = elementForm.widthInput.value!="" ? elementForm.widthInput.value : null;
		var alternateHeight = elementForm.heightInput.value!="" ? elementForm.heightInput.value : null;
		var overflow = elementForm.overflowList.value;
		var classes = elementForm.classesInput.value;
		var subClasses = elementForm.subClassesInput.value;
		var additionalStyles = elementForm.additionalStylesInput.value;
		var subStyles = elementForm.subStylesInput.value;

		updateSelectedModels(model, selectedModels, "overflow", overflow);
		updateSelectedModels(model, selectedModels, "additionalClasses", classes);
		updateSelectedModels(model, selectedModels, "subClasses", subClasses);
		updateSelectedModels(model, selectedModels, "alternateTagName", alternateTagName);
		updateSelectedModels(model, selectedModels, "subTagName", subTagName);
		updateSelectedModels(model, selectedModels, "additionalStyles", additionalStyles);
		updateSelectedModels(model, selectedModels, "subStyles", subStyles);
		updateSelectedModels(model, selectedModels, "additionalAttributes", additionalAttributes);
		updateSelectedModels(model, selectedModels, "subAttributes", subAttributes);
		updateSelectedModels(model, selectedModels, "alternateWidth", alternateWidth);
		updateSelectedModels(model, selectedModels, "alternateHeight", alternateHeight);

		var markupInside = elementForm.markupInsideInput.value;
		var markupBefore = elementForm.markupBeforeInput.value;
		var markupAfter = elementForm.markupAfterInput.value;

		var textIds = elementForm.textIDsInput.value;
		var textTokens = elementForm.textTokensInput.value;
		var displayed = elementForm.displayCheckbox.checked;
		var exported = elementForm.exportCheckbox.checked;

		updateSelectedModels(model, selectedModels, "markupInside", markupInside);
		updateSelectedModels(model, selectedModels, "markupBefore", markupBefore);
		updateSelectedModels(model, selectedModels, "markupAfter", markupAfter);

		updateSelectedModels(model, selectedModels, "textIds", textIds);
		updateSelectedModels(model, selectedModels, "textTokens", textTokens);
		updateSelectedModels(model, selectedModels, "displayed", displayed);
		updateSelectedModels(model, selectedModels, "export", exported);

		var hyperlink = elementForm.hyperlinkInput.value;
		var hyperlinkTarget = elementForm.hyperlinkTargetInput.value;
		var hyperlinkElement = elementForm.hyperlinkElementInput.value;
		
		if (hasArtboardDestination(element) && model.inheritPrototypeLink) {
			// don't save prototype links
		}
		else {
			updateSelectedModels(model, selectedModels, "hyperlink", hyperlink);
		}

		updateSelectedModels(model, selectedModels, "hyperlinkTarget", hyperlinkTarget);
		updateSelectedModels(model, selectedModels, "hyperlinkElement", hyperlinkElement);

		// checkboxes
		if (elementForm.useBase64DataCheckbox) {
			var useBase64Data = elementForm.useBase64DataCheckbox.checked;
			updateSelectedModels(model, selectedModels, "useBase64Data", useBase64Data);
		}
		
		var useAsGroupBackground = elementForm.useAsBackgroundCheckbox.checked;

		var consolidateStyles = elementForm.consolidateStylesCheckbox.checked;
		var constrainBottom = elementForm.constrainBottomCheckbox.checked;
		var constrainTop = elementForm.constrainTopCheckbox.checked;
		var constrainLeft = elementForm.constrainLeftCheckbox.checked;
		var constrainRight = elementForm.constrainRightCheckbox.checked;
		var centerHorizontally = elementForm.centerHorizontallyCheckbox.checked;
		var centerVertically = elementForm.centerVerticallyCheckbox.checked;

		updateSelectedModels(model, selectedModels, "useAsGroupBackground", useAsGroupBackground);

		updateSelectedModels(model, selectedModels, "consolidateStyles", consolidateStyles);
		
		updateSelectedModels(model, selectedModels, "constrainBottom", constrainBottom);
		updateSelectedModels(model, selectedModels, "constrainTop", constrainTop);
		updateSelectedModels(model, selectedModels, "constrainLeft", constrainLeft);
		updateSelectedModels(model, selectedModels, "constrainRight", constrainRight);
		updateSelectedModels(model, selectedModels, "centerHorizontally", centerHorizontally);
		updateSelectedModels(model, selectedModels, "centerVertically", centerVertically);

		var exportAsString = elementForm.exportAsStringCheckbox.checked;
		var showOutline = elementForm.showOutlineCheckbox.checked;
		var debug = elementForm.debugElementCheckbox.checked;

		updateSelectedModels(model, selectedModels, "exportAsString", exportAsString);
		updateSelectedModels(model, selectedModels, "showOutline", showOutline);
		updateSelectedModels(model, selectedModels, "debug", debug);

		var layout = elementForm.groupLayoutList.value;
		var layoutWrapping = elementForm.groupWrapList.value;
		
		updateSelectedModels(model, selectedModels, "layout", layout);
		updateSelectedModels(model, selectedModels, "layoutWrapping", layoutWrapping);
		
		// lists with sub value
		var horizontalValue = elementForm.groupHorizontalAlignmentList.value;
		var layoutHorizontalAlign = horizontalValue ? horizontalValue.style : null;

		var verticalValue = elementForm.groupVerticalAlignmentList.value;
		var layoutVerticalAlign = verticalValue ? verticalValue.style : null;

		var spacingValue = elementForm.groupSpacingList.value;
		var layoutSpacing = spacingValue ? spacingValue.style : null;

		var selfAlignmentValue = elementForm.selfAlignmentList.value;
		var selfAlignment = selfAlignmentValue ? selfAlignmentValue.style : null;

		updateSelectedModels(model, selectedModels, "selfAlignment", selfAlignment);
		updateSelectedModels(model, selectedModels, "layoutHorizontalAlign", layoutHorizontalAlign);
		updateSelectedModels(model, selectedModels, "layoutVerticalAlign", layoutVerticalAlign);
		updateSelectedModels(model, selectedModels, "layoutSpacing", layoutSpacing);

		var position = elementForm.positionList.value;
		var positionBy = elementForm.positionByList.value;
		var sizing = elementForm.sizeList.value;

		updateSelectedModels(model, selectedModels, "position", position);
		updateSelectedModels(model, selectedModels, "positionBy", positionBy);
		updateSelectedModels(model, selectedModels, "sizing", sizing);

		var imageFormat = elementForm.imageFormatList.value;
		var imageQuality = elementForm.imageQualitySlider.value;
		var image2x = elementForm.image2xCheckbox.checked;
		var embedImage = elementForm.embedImageCheckbox.checked;
		var exportAsImage = elementForm.convertToImageCheckbox.checked;

		updateSelectedModels(model, selectedModels, "imageFormat", imageFormat);
		updateSelectedModels(model, selectedModels, "imageQuality", parseInt(imageQuality));
		updateSelectedModels(model, selectedModels, "image2x", image2x);
		updateSelectedModels(model, selectedModels, "embedImage", embedImage);
		updateSelectedModels(model, selectedModels, "exportAsImage", exportAsImage);

		elementForm.messageLabel.textContent = "";

		b && object(model, "Updated model values");
	}
	catch(error) {
		log(error.stack);
	}
	
}

/**
 * Updates the element form with the element model values
 * @param {Model} model
 **/
function updateElementForm(model) {
	var b = debugModel.preferences;

	b && object(model, "Model values:")

		try {
		if (model==null && globalModel.hasSelection==false) {
			elementForm.nameLabel.textContent = "Nothing selected";
			var imagePath = form.notFoundIconPath;

			if (imagePath) {
				elementForm.elementIcon.src = null;
				elementForm.elementIcon.style.title = "";
			}
			
			return;
		}

		var element = globalModel.selectedElement;
		var isArtboard = getIsArtboard(element);
		var showingPanel = globalModel.showingPanel;
		var selectedArtboardModel = globalModel.selectedArtboardModel;
		var selectedModels = globalModel.selectedModels;
		
		// show element icon and name
		if (elementForm.nameLabel) {
			var elementName = element.name;
			var titleName = elementName.substr(0, GlobalModel.maxIDLength) + "(" + model.type + ")";
			var numberOfSelection = selectedModels.length;
			var multipleMessage = numberOfSelection>1 ? " (+" + (numberOfSelection-1) + ")" : "";

			if (elementName) {
				elementForm.nameLabel.textContent = elementName.substr(0, GlobalModel.maxIDLength) + multipleMessage;
				elementForm.nameLabel.title = titleName;
				elementForm.nameLabel.style.title = titleName;
			}
			else if (globalModel.selectedElement) {
				elementForm.nameLabel.textContent = globalModel.selectedElement.name.substr(0, GlobalModel.maxIDLength) + multipleMessage;
				elementForm.nameLabel.style.title = globalModel.selectedElement.type;
			}
			
			var imagePath = getIcon(model);

			if (imagePath) {
				elementForm.elementIcon.src = imagePath;
				elementForm.elementIcon.title = model.type;
				elementForm.elementIcon.style.title = model.type;
			}
			else {
				elementForm.elementIcon.src = null;
				elementForm.elementIcon.title = "";
				elementForm.elementIcon.style.title = "";
			}

			if (element.visible) {
				elementForm.displayedIcon.src = form.visibleIconPath;
				hideElement(elementForm.displayedIcon);
			}
			else {
				elementForm.displayedIcon.src = form.hiddenIconPath;
				showBlockElement(elementForm.displayedIcon);
			}
		}
		else if (elementForm.nameLabel) {
			elementForm.nameLabel.title = "";
			elementForm.nameLabel.style.title = "";
			elementForm.nameLabel.textContent = "";
		}

		elementForm.nameInput.value = elementForm.nameLabel.textContent;

		// overflow
		var overflowPre = "";
		var overflow = model.overflow;

		if (overflow!=null && overflow!="") {
			elementForm.overflowList.value = overflow;
		}
		else {
			var defaultOverflow = model.getDefaultOverflowValue(element);
			elementForm.overflowList.value = defaultOverflow;
			overflow = defaultOverflow;
		}

		var overflowListIndex = elementForm.overflowList.selectedIndex;

		if (overflowListIndex<4 && showingPanel) {
			overflowPre = "Overflow ";
		}

		if (overflowPre!="") {
			elementForm.overflowListInput.value = overflowPre + getString(overflow);
		}
		else {
			var overflowOption = getListOption(elementForm.overflowList.options, overflow, "value");
			elementForm.overflowListInput.value = overflowOption.innerHTML;
		}

		elementForm.idInput.value = getString(model.id);
		elementForm.additionalStylesInput.value = getString(model.additionalStyles);
		elementForm.subStylesInput.value = getString(model.subStyles);
		elementForm.classesInput.value = getString(model.additionalClasses);
		elementForm.subClassesInput.value = getString(model.subClasses);
		elementForm.attributesInput.value = getString(model.additionalAttributes);
		elementForm.subAttributesInput.value = getString(model.subAttributes);
		elementForm.tagNameInput.value = getString(model.alternateTagName);
		elementForm.subTagNameInput.value = getString(model.subTagName);
		elementForm.widthInput.value = getString(model.alternateWidth);
		elementForm.heightInput.value = getString(model.alternateHeight);
		elementForm.markupInsideInput.value = getString(model.markupInside);
		elementForm.markupBeforeInput.value = getString(model.markupBefore);
		elementForm.markupAfterInput.value = getString(model.markupAfter);
		elementForm.textIDsInput.value = getString(model.textIds);
		elementForm.textTokensInput.value = getString(model.textTokens);


		var tapTargetDestination = getTapTargetDestination(element, model);
		var canInheritHyperlink = model.inheritPrototypeLink && tapTargetDestination;

		// user hyperlinked to artboard manually
		if (model.hyperlinkedArtboardGUID && getArtboardModelByGUID(model.hyperlinkedArtboardGUID)) {
			let hyperlinkedArtboardModel = getArtboardModelByGUID(model.hyperlinkedArtboardGUID);
			elementForm.hyperlinkArtboardIcon.style.display = Styles.BLOCK;
			elementForm.hyperlinkArtboardIcon.src = form.artboardIconPath;
			elementForm.hyperlinkInput.value = getString(hyperlinkedArtboardModel.name);
		}
		// user typed in a hyperlink
		else if (model.hyperlink!=null && model.hyperlink!="" && model.hyperlinkedArtboardGUID==null) {
			elementForm.hyperlinkArtboardIcon.style.display = Styles.BLOCK;
			elementForm.hyperlinkArtboardIcon.src = form.linkIconPath;
			elementForm.hyperlinkInput.value = getString(model.hyperlink);
		}
		// hyperlink not set and item has link in prototype
		else if (tapTargetDestination && model.inheritPrototypeLink) {
			elementForm.hyperlinkArtboardIcon.style.display = Styles.BLOCK;
			elementForm.hyperlinkArtboardIcon.src = form.prototypeLinkIconPath;
			elementForm.hyperlinkInput.value = getString(tapTargetDestination.name);
		}
		// no hyperlink set
		else {
			elementForm.hyperlinkArtboardIcon.style.display = Styles.NONE;
			elementForm.hyperlinkInput.value = getString(model.hyperlink);
		}
		
		elementForm.hyperlinkTargetInput.value = getString(model.hyperlinkTarget);
		elementForm.hyperlinkElementInput.value = getString(model.hyperlinkElement);

		elementForm.convertToImageCheckbox.checked = model.exportAsImage;

		if (elementForm.useBase64DataCheckbox) {
			elementForm.useBase64DataCheckbox.checked = model.useBase64Data;
		}

		if (elementForm.useAsBackgroundCheckbox) {
			elementForm.useAsBackgroundCheckbox.checked = model.useAsGroupBackground;
		}

		elementForm.constrainLeftCheckbox.checked = model.constrainLeft;
		elementForm.constrainRightCheckbox.checked = model.constrainRight;
		elementForm.constrainBottomCheckbox.checked = model.constrainBottom;
		elementForm.constrainTopCheckbox.checked = model.constrainTop;
		elementForm.centerHorizontallyCheckbox.checked = model.centerHorizontally;
		elementForm.centerVerticallyCheckbox.checked = model.centerVertically;
		elementForm.consolidateStylesCheckbox.checked = model.consolidateStyles;
		elementForm.exportAsStringCheckbox.checked = model.exportAsString;
		elementForm.showOutlineCheckbox.checked = model.showOutline;
		elementForm.debugElementCheckbox.checked = model.debug;
		elementForm.displayCheckbox.checked = model.displayed;
		elementForm.exportCheckbox.checked = model.export;


		var delimiter = "&nbsp;";
		var places = 2;
		var horizontalLabel = !isArtboard ? getFormattedLabel("Horizontal", getShortNumber(model.bounds.centerDeltaX, places), delimiter) : "Horizontal";
		elementForm.centerHorizontallyCheckbox.previousSibling.innerHTML = horizontalLabel;

		var verticalLabel = !isArtboard ? getFormattedLabel("Vertical", getShortNumber(model.bounds.centerDeltaY, places), delimiter) : "Vertical";
		elementForm.centerVerticallyCheckbox.previousSibling.innerHTML = verticalLabel;

		var topLabel = !isArtboard ? getFormattedLabel("Top", getShortNumber(model.bounds.top, places), delimiter) : "Top";
		elementForm.constrainTopCheckbox.previousSibling.innerHTML = topLabel;

		var leftLabel = !isArtboard ? getFormattedLabel("Left", getShortNumber(model.bounds.left, places), delimiter) : "Left";
		elementForm.constrainLeftCheckbox.previousSibling.innerHTML = leftLabel;

		var bottomLabel = !isArtboard ? getFormattedLabel("Bottom", getShortNumber(model.bounds.bottom, places), delimiter) : "Bottom";
		elementForm.constrainBottomCheckbox.previousSibling.innerHTML = bottomLabel;

		var rightLabel = !isArtboard ? getFormattedLabel("Right", getShortNumber(model.bounds.right, places), delimiter) : "Right";
		elementForm.constrainRightCheckbox.previousSibling.innerHTML = rightLabel;

		if (model.export==false) {
			elementForm.exportCheckboxLabel.classList.add("redFormItem");
			elementForm.exportCheckbox.classList.add("redFormItem");
			showBlockElement(elementForm.notExportedLabel);
		}
		else {
			elementForm.exportCheckboxLabel.classList.remove("redFormItem");
			elementForm.exportCheckbox.classList.remove("redFormItem");
			hideElement(elementForm.notExportedLabel);
		}

		// Flexbox layout
		var groupHorizontalOption = getListOption(elementForm.groupHorizontalAlignmentList.options, model.layoutHorizontalAlign, "value", "style");
		var groupVerticalOption = getListOption(elementForm.groupVerticalAlignmentList.options, model.layoutVerticalAlign, "value", "style");
		var groupSpacingOption = getListOption(elementForm.groupSpacingList.options, model.layoutSpacing, "value", "style");
		var selfAlignOption = getListOption(elementForm.selfAlignmentList.options, model.selfAlignment, "value", "style");
		
		if (groupHorizontalOption) {
			elementForm.groupHorizontalAlignmentList.value = groupHorizontalOption.value;
		}
		else {
			groupHorizontalOption = getListOption(elementForm.groupHorizontalAlignmentList.options, "stretched", "value", "label");
			elementForm.groupHorizontalAlignmentList.value = groupHorizontalOption.value;
		}
		elementForm.groupHorizontalLayoutInput.value = getString(groupHorizontalOption.innerHTML);
		
		if (groupVerticalOption) {
			elementForm.groupVerticalAlignmentList.value = groupVerticalOption.value;
		}
		else {
			groupVerticalOption = getListOption(elementForm.groupVerticalAlignmentList.options, "stretched", "value", "label");
			elementForm.groupVerticalAlignmentList.value = groupVerticalOption.value;
		}
		elementForm.groupVerticalLayoutInput.value = getString(groupVerticalOption.innerHTML);

		if (groupSpacingOption) {
			elementForm.groupSpacingList.value = groupSpacingOption.value;
		}
		else {
			groupSpacingOption = getListOption(elementForm.groupSpacingList.options, "flexStart", "value", "label");
			elementForm.groupSpacingList.value = groupSpacingOption.value;
		}
		elementForm.groupSpacingInput.value = getString(groupSpacingOption.innerHTML);

		if (selfAlignOption) {
			elementForm.selfAlignmentList.value = selfAlignOption.value;
		}
		else {
			selfAlignOption = getListOption(elementForm.selfAlignmentList.options, "default", "value", "label");
			elementForm.selfAlignmentList.value = selfAlignOption.value;
		}

		var alignPre = "";
		if (selfAlignOption.innerHTML=="Default") {
			alignPre = "Align ";
		}

		elementForm.selfAlignmentListInput.value = alignPre + getString(selfAlignOption.innerHTML.replace("&amp;", "&"));

		if (model.layout==null) {
			elementForm.groupLayoutList.selectedIndex = 0;
		}
		else {
			elementForm.groupLayoutList.value = getString(model.layout);
		}
		elementForm.groupWrapList.value = model.layoutWrapping ? getString(model.layoutWrapping) : getString(elementForm.groupWrapList.value);

		elementForm.groupWrapInput.value = getString(elementForm.groupWrapList.options[elementForm.groupWrapList.selectedIndex].innerHTML);
		
		// layout
		var layoutOption = getListOption(elementForm.groupLayoutList.options, model.layout, "value");
		
		if (layoutOption) {
			elementForm.groupLayoutList.value = layoutOption.value;
		}
		else {
			layoutOption = getListOption(elementForm.groupLayoutList.options, Styles.DEFAULT, "value");
			elementForm.groupLayoutList.value = layoutOption.value;
		}
		elementForm.groupLayoutInput.value = getString(elementForm.groupLayoutList.options[elementForm.groupLayoutList.selectedIndex].innerHTML);
		
		// position list
		var positionOption = getListOption(elementForm.positionList.options, model.position, "value");
		
		if (positionOption) {
			elementForm.positionList.value = positionOption.value;
		}
		else {
			positionOption = getListOption(elementForm.positionList.options, Styles.DEFAULT, "value");
			elementForm.positionList.value = positionOption.value;
		}

		// position by list
		var positionByOption = getListOption(elementForm.positionByList.options, model.positionBy, "value");
		
		if (positionByOption) {
			elementForm.positionByList.value = positionByOption.value;
		}
		else {
			positionByOption = getListOption(elementForm.positionByList.options, XDConstants.DEFAULT, "value");
			elementForm.positionByList.value = positionByOption.value;
		}

		// sizing list
		var sizingOption = getListOption(elementForm.sizeList.options, model.sizing, "value");
		
		if (sizingOption==null) {
			sizingOption = getListOption(elementForm.sizeList.options, XDConstants.DEFAULT, "value");
		}

		selectListOption(elementForm.sizeList, sizingOption);

		elementForm.messageLabel.textContent = "";

		var imageFormat = model.imageFormat;
		var isAcceptableFormat = isSupportedExportFormat(imageFormat);

		if (isAcceptableFormat==false) {
			imageFormat = getImageFormat(model);
		}

		elementForm.imageFormatList.value = imageFormat;
		elementForm.imageQualitySlider.value = model.imageQuality==null ? globalModel.imageExportQuality : model.imageQuality;
		elementForm.image2xCheckbox.checked = model.image2x==null || model.image2x==true ? true : false;
		elementForm.embedImageCheckbox.checked = model.embedImage===true ? true : false;

		if (getIsArtboard(element)) {
			var exportList = model instanceof ArtboardModel && model.exportList;

			if (exportList==XDConstants.SELECTED_ARTBOARDS) {
				showBlockElement(elementForm.selectedArtboardsSelector);
			}
			else {
				hideElement(elementForm.selectedArtboardsSelector);
			}
		}
		else {
			hideElement(elementForm.selectedArtboardsSelector);
		}

		if (canUpload(selectedArtboardModel)) {
			showFlexElement(elementForm.uploadLink);
		}
		else {
			hideElement(elementForm.uploadLink);
		}

		updateHyperlinkFormItems();
		updateCursorList();
		updateTagNamesList();
		updateGroupLayoutOptions();
		updateTextFormItems();
		updateImageFormItems();
		updateTemplateFormItems();
		updateHoverEffectsList();
		updateRevealDescendantsList();
		updateNodeNavigationItems();
		updateSubFormItems();
		updateIdInput();
		updateChangedFormItems(element, model);

	}
	catch(error) {
		log(error.stack);
	}
}

/**
 * Create an option and return it
 * @param {String} label 
 * @param {*} value 
 **/
function createOption(label, value) {
	var option = document.createElement(HTMLConstants.OPTION);
	option.innerText = label;
	option.innerHTML = label;
	option.label = label;
	option.value = value;

	return option;
}

/**
 * Update the group layout options
 **/
function updateGroupLayoutOptions() {
	if (globalModel.selectedModel==null) {
		return;
	}

	var model = globalModel.selectedModel;
	var item = globalModel.selectedElement;
	var groupLayoutRow = elementForm.groupLayoutGroup;
	var groupItemGroup = elementForm.groupItemGroup;
	var selfAlignmentGroup = elementForm.selfAlignmentGroup;
	var useAsBackgroundGroup = elementForm.useAsBackgroundGroup;
	var isFlexItem = getIsFlexItem(item, model, true);
	var isInGroup = getIsInGroup(item);
	var layoutItem = elementForm.groupLayoutList.value;
	var model = globalModel.selectedModel;
	var element = globalModel.selectedElement;
	var isDefaultLayout = layoutItem=="default";
	var isRectange = getIsRectangle(item);
	var isGroup = getIsGroup(item);
	
	// show group layout options if item is container
	if (model.isLayoutGroup) {
		showFlexElements(groupLayoutRow, groupItemGroup);
	}
	else {
		hideElements(groupLayoutRow, groupItemGroup);
	}
	
	// show group layout buttons if item is container
	if (model.isLayoutGroup) {
		showBlockElement(elementForm.groupLayoutIcon);
		showBlockElement(elementForm.groupLayoutIcon2);
	}
	else {
		hideElement(elementForm.groupLayoutIcon);
		hideElement(elementForm.groupLayoutIcon2);
	}

	// show background fill option if rectange
	if (isRectange && isInGroup) {
		showFlexElement(useAsBackgroundGroup);
	}
	else {
		hideElements(useAsBackgroundGroup);
	}

	// show item layout options if item is in a row or column layout
	if (isFlexItem) {
		showFlexElement(selfAlignmentGroup);
	}
	else {
		hideElement(selfAlignmentGroup);
	}

	var distributeVertically = false;
	var distributeHorizontally = false;

	if (isDefaultLayout) {

		if (isPortrait(element)) {
			distributeVertically = true;
		}
		else {
			distributeHorizontally = true;
		}
	}

	// display column options or row items
	// show horizontal or vertical align button
	
	if (layoutItem==Styles.COLUMN || layoutItem==Styles.COLUMN_REVERSE || distributeVertically) {
		showBlockElement(elementForm.groupHorizontalAlignmentList);
		showBlockElement(elementForm.groupHorizontalLayoutInput);
		hideElement(elementForm.groupVerticalAlignmentList);
		hideElement(elementForm.groupVerticalLayoutInput);
	}
	else if (layoutItem==Styles.ROW || layoutItem==Styles.ROW_REVERSE || distributeHorizontally) {
		hideElement(elementForm.groupHorizontalAlignmentList);
		hideElement(elementForm.groupHorizontalLayoutInput);
		showBlockElement(elementForm.groupVerticalLayoutInput);
		showBlockElement(elementForm.groupVerticalAlignmentList);
	}
	else {
		hideElements(elementForm.groupHorizontalAlignmentList, elementForm.groupHorizontalLayoutInput);
		showBlockElements(elementForm.groupVerticalAlignmentList, elementForm.groupVerticalLayoutInput);
	}
	
}

/**
 * Add the text element options to the element properties form
 **/
function updateTextFormItems() {
	var selectedElement = globalModel.selectedElement;
	var textIDsGroup = elementForm.textIDsGroup;

	if (selectedElement instanceof Text) {
		showFlexElements(textIDsGroup);
	}
	else {
		hideElements(textIDsGroup);
	}
}

/**
 * Add the text element options to the element properties form
 **/
function updateHoverEffectsList() {
	var selectedElement = globalModel.selectedElement;
	var selectedModel = globalModel.selectedModel;
	var hoverEffectsList = elementForm.hoverEffectsList;
	var elementOptions = hoverEffectsList.options;
	var hoverElementGUID = selectedModel.hoverElementGUID;
	var hoverElement = null;
	var artboardName = null;
	var hoverElementOption = null;
	var selectedElementGUID = selectedElement && selectedElement.guid;

	var selectedItems = getArrayFromObject(globalModel.selection.items); // copy the array 
	var defaultOption = createOption(MessageConstants.NO_HOVER_EFFECT, {name:Styles.NONE});

	clearListOptions(hoverEffectsList);
	hoverEffectsList.appendChild(defaultOption);
	selectListOption(hoverEffectsList, defaultOption);

	if (hoverElementGUID) {
		hoverElement = getSceneNodeByGUID(hoverElementGUID);

		if (hoverElement) {

			name = getArtboard(hoverElement).name + " - " + hoverElement.name;
			hoverElementOption = createOption(name, {name:name, type:type, guid:guid});
			hoverEffectsList.appendChild(hoverElementOption);
			selectListOption(hoverEffectsList, hoverElementOption)
		}
	}

	for (var i=0;i<selectedItems.length;i++) {
		let sceneNode = selectedItems[i];
		var artboard = getArtboard(sceneNode);

		//  pasteboard item
		if (artboard==null) continue;

		var name = artboard.name + " - " + getShortString(sceneNode.name, 32);
		var type = sceneNode.type;
		var guid = sceneNode.guid;

		if (guid!=hoverElementGUID && guid!=selectedElementGUID) {
			hoverEffectsList.appendChild(createOption(name, {name:name, type:type, guid:guid}));
		}
	}

	var hoverEffectsIndex = elementForm.hoverEffectsList.selectedIndex;

	if (hoverEffectsIndex<1) {
		hideElement(elementForm.hoverEffectsSelector);
	}
	else {
		showBlockElement(elementForm.hoverEffectsSelector);
	}

	// more than one item selected or hover effects element selected
	if (selectedItems.length>1 || hoverEffectsIndex>0) {
		showBlockElement(elementForm.copyChangesToTemplateButton);
	}
	else {
		hideElement(elementForm.copyChangesToTemplateButton);
	}
}

/**
 * Add the text element options to the element properties form
 **/
function updateRevealDescendantsList() {
	var selectedElement = globalModel.selectedElement;
	var selectedModel = globalModel.selectedModel;
	var revealOnEventList = elementForm.revealOnEventList;
	var elementOptions = revealOnEventList.options;
	var selectedElementGUID = selectedElement && selectedElement.guid;

}

/**
 * Add the text element options to the element properties form
 **/
function updateTemplateFormItems(fromMainForm = false) {
	
	var selectedElement = globalModel.selectedElement;
	var selectedModel = globalModel.selectedModel;
	var templateIcon = elementForm.templateIcon;
	var scriptTemplateIcon = elementForm.scriptTemplateIcon;
	var styleTemplateIcon = elementForm.styleTemplateIcon;


	if (fromMainForm) {
		selectedModel = globalModel.selectedArtboardModel;
		selectedElement = globalModel.selectedArtboard;
		templateIcon = mainForm.templateIcon;
		scriptTemplateIcon = mainForm.scriptTemplateIcon;
		styleTemplateIcon = mainForm.styleTemplateIcon;
	}


	if (selectedModel) {

		if (selectedModel.template!=null && selectedModel.template!="") {
			templateIcon.src = form.templateDarkIconPath;
		}
		else {
			templateIcon.src = form.templateIconPath;
		}

		if (selectedModel.scriptTemplate!=null && selectedModel.scriptTemplate!="") {
			scriptTemplateIcon.src = form.scriptTemplateDarkIconPath;
		}
		else {
			scriptTemplateIcon.src = form.scriptTemplateIconPath;
		}

		if (selectedModel.stylesheetTemplate!=null && selectedModel.stylesheetTemplate!="") {
			styleTemplateIcon.src = form.styleTemplateDarkIconPath;
		}
		else {
			styleTemplateIcon.src = form.styleTemplateIconPath;
		}
	}

	if (getIsArtboard(selectedElement)) {
		showFlexElements(templateIcon, scriptTemplateIcon, styleTemplateIcon)
	}
	else {
		//templateIcon.style.display = Styles.NONE;
		//scriptTemplateIcon.style.display = Styles.NONE;
		//styleTemplateIcon.style.display = Styles.NONE;
	}

}

/**
 * Add the text element options to the element properties form
 **/
function updateExpectedOutputFormItems(fromMainForm = true) {
	var selectedElement = globalModel.selectedElement;
	var selectedModel = globalModel.selectedModel;
	var expectedHTMLIcon = null; // elementForm.expectedHTMLIcon;
	var expectedScriptIcon = null; // elementForm.expectedScriptIcon;
	var expectedStyleIcon = null; // elementForm.expectedStyleIcon;


	if (fromMainForm) {
		selectedModel = globalModel.selectedArtboardModel;
		selectedElement = globalModel.selectedArtboard;
		expectedHTMLIcon = mainForm.expectedHTMLIcon;
		expectedScriptIcon = mainForm.expectedScriptIcon;
		expectedStyleIcon = mainForm.expectedStyleIcon;
	}


	if (selectedModel instanceof ArtboardModel) {

		if (selectedModel.expectedOutput!=null && selectedModel.expectedOutput!="") {
			expectedHTMLIcon.src = form.verifyDarkIconPath;
		}
		else {
			expectedHTMLIcon.src = form.verifyIconPath;
		}

		if (selectedModel.expectedScriptOutput!=null && selectedModel.expectedScriptOutput!="") {
			expectedScriptIcon.src = form.verifyDarkIconPath;
		}
		else {
			expectedScriptIcon.src = form.verifyIconPath;
		}

		if (selectedModel.expectedCSSOutput!=null && selectedModel.expectedCSSOutput!="") {
			expectedStyleIcon.src = form.verifyDarkIconPath;
		}
		else {
			expectedStyleIcon.src = form.verifyIconPath;
		}
	}

}

/**
 * Update form to show properties that have changed
 * @param {SceneNode} item 
 * @param {Model} model 
 **/
function updateChangedFormItems(item, model) {

	try {

		if (model==null) {
			//return false;
		}

		const CLASS_NAME = "changedProperties";
		var defaultModel = new Model();
		defaultModel.overflow = defaultModel.getDefaultOverflowValue(item);
		var data = model.getPreferencesData();
		var changedPropertiesObject = getChangedPropertiesObject(data, defaultModel, [], defaultModel.getPreferencesProperties(true), true, true);
		var numberOfChangedProperties = getNumberOfProperties(changedPropertiesObject);


		if (numberOfChangedProperties>0) {
			elementForm.changedPropertiesIcon.src = form.changedPropertiesDarkIconPath;
			elementForm.resetElementIcon.src = form.resetDarkIconPath;
		}
		else {
			elementForm.changedPropertiesIcon.src = form.changedPropertiesIconPath;
			elementForm.resetElementIcon.src = form.resetIconPath;
		}

		// id
		if ("id" in changedPropertiesObject) {
			elementForm.idInput.classList.add(CLASS_NAME);
		}
		else {
			elementForm.idInput.classList.remove(CLASS_NAME);
		}

		// tag name
		if ("alternateTagName" in changedPropertiesObject) {
			elementForm.tagNameInput.classList.add(CLASS_NAME);
		}
		else {
			elementForm.tagNameInput.classList.remove(CLASS_NAME);
		}

		if ("subTagName" in changedPropertiesObject) {
			elementForm.subTagNameInput.classList.add(CLASS_NAME);
		}
		else {
			elementForm.subTagNameInput.classList.remove(CLASS_NAME);
		}

		// attributes
		if ("additionalAttributes" in changedPropertiesObject && changedPropertiesObject["additionalAttributes"]!=null) {
			elementForm.attributesInput.classList.add(CLASS_NAME);
		}
		else {
			elementForm.attributesInput.classList.remove(CLASS_NAME);
		}

		if ("subAttributes" in changedPropertiesObject) {
			elementForm.subAttributesInput.classList.add(CLASS_NAME);
		}
		else {
			elementForm.subAttributesInput.classList.remove(CLASS_NAME);
		}

		// classes
		if ("additionalClasses" in changedPropertiesObject) {
			elementForm.classesInput.classList.add(CLASS_NAME);
		}
		else {
			elementForm.classesInput.classList.remove(CLASS_NAME);
		}

		if ("subClasses" in changedPropertiesObject) {
			elementForm.subClassesInput.classList.add(CLASS_NAME);
		}
		else {
			elementForm.subClassesInput.classList.remove(CLASS_NAME);
		}

		// styles
		if ("additionalStyles" in changedPropertiesObject) {
			elementForm.additionalStylesInput.classList.add(CLASS_NAME);
		}
		else {
			elementForm.additionalStylesInput.classList.remove(CLASS_NAME);
		}

		if ("subStyles" in changedPropertiesObject) {
			elementForm.subStylesInput.classList.add(CLASS_NAME);
		}
		else {
			elementForm.subStylesInput.classList.remove(CLASS_NAME);
		}

		// size
		if ("alternateWidth" in changedPropertiesObject && changedPropertiesObject["alternateWidth"]!="") {
			elementForm.widthInput.classList.add(CLASS_NAME);
		}
		else {
			elementForm.widthInput.classList.remove(CLASS_NAME);
		}

		if ("alternateHeight" in changedPropertiesObject && changedPropertiesObject["alternateHeight"]!="") {
			elementForm.heightInput.classList.add(CLASS_NAME);
		}
		else {
			elementForm.heightInput.classList.remove(CLASS_NAME);
		}

		// constraint left
		if ("constrainLeft" in changedPropertiesObject) {
			elementForm.constrainLeftCheckbox.previousSibling.classList.add(CLASS_NAME);
		}
		else {
			elementForm.constrainLeftCheckbox.previousSibling.classList.remove(CLASS_NAME);
		}

		// constraint right
		if ("constrainRight" in changedPropertiesObject) {
			elementForm.constrainRightCheckbox.previousSibling.classList.add(CLASS_NAME);
		}
		else {
			elementForm.constrainRightCheckbox.previousSibling.classList.remove(CLASS_NAME);
		}

		// constraint top
		if ("constrainTop" in changedPropertiesObject) {
			elementForm.constrainTopCheckbox.previousSibling.classList.add(CLASS_NAME);
		}
		else {
			elementForm.constrainTopCheckbox.previousSibling.classList.remove(CLASS_NAME);
		}

		// constraint bottom
		if ("constrainBottom" in changedPropertiesObject) {
			elementForm.constrainBottomCheckbox.previousSibling.classList.add(CLASS_NAME);
		}
		else {
			elementForm.constrainBottomCheckbox.previousSibling.classList.remove(CLASS_NAME);
		}

		// center horizontally
		if ("centerHorizontally" in changedPropertiesObject) {
			elementForm.centerHorizontallyCheckbox.previousSibling.classList.add(CLASS_NAME);
		}
		else {
			elementForm.centerHorizontallyCheckbox.previousSibling.classList.remove(CLASS_NAME);
		}

		// center vertically
		if ("centerVertically" in changedPropertiesObject) {
			elementForm.centerVerticallyCheckbox.previousSibling.classList.add(CLASS_NAME);
		}
		else {
			elementForm.centerVerticallyCheckbox.previousSibling.classList.remove(CLASS_NAME);
		}

		// debug
		if ("debug" in changedPropertiesObject) {
			elementForm.debugElementCheckbox.previousSibling.classList.add(CLASS_NAME);
		}
		else {
			elementForm.debugElementCheckbox.previousSibling.classList.remove(CLASS_NAME);
		}

		// cursor
		if ("cursor" in changedPropertiesObject) {
			elementForm.cursorList.classList.add(CLASS_NAME);
		}
		else {
			elementForm.cursorList.classList.remove(CLASS_NAME);
		}


		// displayed
		if ("displayed" in changedPropertiesObject) {
			elementForm.displayCheckbox.previousSibling.classList.add(CLASS_NAME);
		}
		else {
			elementForm.displayCheckbox.previousSibling.classList.remove(CLASS_NAME);
		}

		// embed image
		if ("embedImage" in changedPropertiesObject) {
			elementForm.embedImageCheckbox.previousSibling.classList.add(CLASS_NAME);
		}
		else {
			elementForm.embedImageCheckbox.previousSibling.classList.remove(CLASS_NAME);
		}

		// embed color limit
		if ("embedColorLimit" in changedPropertiesObject) {
			//elementForm.embedColorLimitInput.previousSibling.classList.add(CLASS_NAME);
		}
		else {
			//elementForm.embedColorLimitInput.previousSibling.classList.remove(CLASS_NAME);
		}

		// enabled
		if ("enabled" in changedPropertiesObject) {
			//elementForm.enabled.previousSibling.classList.add(CLASS_NAME);
		}
		else {
			//elementForm.enabled.previousSibling.classList.remove(CLASS_NAME);
		}

		// export
		if ("export" in changedPropertiesObject) {
			elementForm.exportCheckbox.previousSibling.classList.add(CLASS_NAME);
		}
		else {
			elementForm.exportCheckbox.previousSibling.classList.remove(CLASS_NAME);
		}

		// export as image
		if ("exportAsImage" in changedPropertiesObject) {
			elementForm.convertToImageCheckbox.previousSibling.classList.add(CLASS_NAME);
		}
		else {
			elementForm.convertToImageCheckbox.previousSibling.classList.remove(CLASS_NAME);
		}

		// consolidateStyles
		if ("consolidateStyles" in changedPropertiesObject) {
			//elementForm.consolidateStyles.previousSibling.classList.add(CLASS_NAME);
		}
		else {
			//elementForm.consolidateStyles.previousSibling.classList.remove(CLASS_NAME);
		}

		// export as string
		if ("exportAsString" in changedPropertiesObject) {
			elementForm.exportAsStringCheckbox.previousSibling.classList.add(CLASS_NAME);
		}
		else {
			elementForm.exportAsStringCheckbox.previousSibling.classList.remove(CLASS_NAME);
		}

		// hyperlink
		if ("hoverElementGUID" in changedPropertiesObject) {
			elementForm.hoverEffectsList.classList.add(CLASS_NAME);
		}
		else {
			elementForm.hoverEffectsList.classList.remove(CLASS_NAME);
		}

		// hyperlink
		if ("hyperlink" in changedPropertiesObject) {
			elementForm.hyperlinkInput.classList.add(CLASS_NAME);
		}
		else {
			elementForm.hyperlinkInput.classList.remove(CLASS_NAME);
		}

		// hyperlink element
		if ("hyperlinkElement" in changedPropertiesObject) {
			elementForm.hyperlinkElementInput.classList.add(CLASS_NAME);
		}
		else {
			elementForm.hyperlinkElementInput.classList.remove(CLASS_NAME);
		}

		// hyperlink target
		if ("hyperlinkTarget" in changedPropertiesObject) {
			elementForm.hyperlinkTargetInput.classList.add(CLASS_NAME);
		}
		else {
			elementForm.hyperlinkTargetInput.classList.remove(CLASS_NAME);
		}

		// hyperlinked Artboard GUID 
		if ("hyperlinkedArtboardGUID" in changedPropertiesObject) {
			//elementForm.hyperlinkTargetInput.classList.add(CLASS_NAME);
		}
		else {
			//elementForm.hyperlinkTargetInput.classList.remove(CLASS_NAME);
		}

		// image format
		if ("imageFormat" in changedPropertiesObject) {
			elementForm.imageFormatList.classList.add(CLASS_NAME);
		}
		else {
			elementForm.imageFormatList.classList.remove(CLASS_NAME);
		}

		// image 2x
		if ("image2x" in changedPropertiesObject) {
			elementForm.image2xCheckbox.previousSibling.classList.add(CLASS_NAME);
		}
		else {
			elementForm.image2xCheckbox.previousSibling.classList.remove(CLASS_NAME);
		}

		// image quality
		if ("imageQuality" in changedPropertiesObject) {
			elementForm.imageQualitySlider.classList.add(CLASS_NAME);
		}
		else {
			elementForm.imageQualitySlider.classList.remove(CLASS_NAME);
		}

		// inheritPrototypeLink
		if ("inheritPrototypeLink" in changedPropertiesObject) {
			//elementForm.inheritPrototypeLink.classList.add(CLASS_NAME);
		}
		else {
			//elementForm.inheritPrototypeLink.classList.remove(CLASS_NAME);
		}

		// layout
		if ("layout" in changedPropertiesObject) {
			elementForm.groupLayoutInput.classList.add(CLASS_NAME);
		}
		else {
			elementForm.groupLayoutInput.classList.remove(CLASS_NAME);
		}

		// layout vertical align
		if ("layoutVerticalAlign" in changedPropertiesObject) {
			elementForm.groupVerticalLayoutInput.classList.add(CLASS_NAME);
		}
		else {
			elementForm.groupVerticalLayoutInput.classList.remove(CLASS_NAME);
			//? somewhere this has a border
			elementForm.groupVerticalAlignmentList.classList.remove(CLASS_NAME);
		}

		// layout horizontal align
		if ("layoutHorizontalAlign" in changedPropertiesObject) {
			elementForm.groupHorizontalLayoutInput.classList.add(CLASS_NAME);
		}
		else {
			elementForm.groupHorizontalLayoutInput.classList.remove(CLASS_NAME);
		}

		// layout wrapping
		if ("layoutWrapping" in changedPropertiesObject) {
			elementForm.groupWrapInput.classList.add(CLASS_NAME);
		}
		else {
			elementForm.groupWrapInput.classList.remove(CLASS_NAME);
		}

		// layout spacing
		if ("layoutSpacing" in changedPropertiesObject) {
			elementForm.groupSpacingInput.classList.add(CLASS_NAME);
		}
		else {
			elementForm.groupSpacingInput.classList.remove(CLASS_NAME);
		}

		// markup inside
		if ("markupInside" in changedPropertiesObject) {
			elementForm.markupInsideInput.classList.add(CLASS_NAME);
		}
		else {
			elementForm.markupInsideInput.classList.remove(CLASS_NAME);
		}

		// markup before
		if ("markupBefore" in changedPropertiesObject) {
			elementForm.markupBeforeInput.classList.add(CLASS_NAME);
		}
		else {
			elementForm.markupBeforeInput.classList.remove(CLASS_NAME);
		}

		// markup after
		if ("markupAfter" in changedPropertiesObject) {
			elementForm.markupAfterInput.classList.add(CLASS_NAME);
		}
		else {
			elementForm.markupAfterInput.classList.remove(CLASS_NAME);
		}

		// overflow
		if ("overflow" in changedPropertiesObject) {
			elementForm.overflowListInput.classList.add(CLASS_NAME);
		}
		else {
			elementForm.overflowListInput.classList.remove(CLASS_NAME);
		}
		
		// position
		if ("position" in changedPropertiesObject) {
			elementForm.positionList.classList.add(CLASS_NAME);
		}
		else {
			elementForm.positionList.classList.remove(CLASS_NAME);
		}

		// position by
		if ("positionBy" in changedPropertiesObject) {
			elementForm.positionByList.classList.add(CLASS_NAME);
		}
		else {
			elementForm.positionByList.classList.remove(CLASS_NAME);
		}

		// script template
		if ("scriptTemplate" in changedPropertiesObject) {
			//elementForm.scriptTemplateIcon.classList.add(CLASS_NAME);
		}
		else {
			//elementForm.scriptTemplateIcon.classList.remove(CLASS_NAME);
		}

		// self alignment
		if ("selfAlignment" in changedPropertiesObject) {
			elementForm.selfAlignmentGroup.classList.add(CLASS_NAME);
		}
		else {
			elementForm.selfAlignmentGroup.classList.remove(CLASS_NAME);
		}

		// show outline
		if ("showOutline" in changedPropertiesObject) {
			elementForm.showOutlineCheckbox.previousSibling.classList.add(CLASS_NAME);
		}
		else {
			elementForm.showOutlineCheckbox.previousSibling.classList.remove(CLASS_NAME);
		}

		// sizing 
		if ("sizing" in changedPropertiesObject) {
			elementForm.sizeList.classList.add(CLASS_NAME);
		}
		else {
			elementForm.sizeList.classList.remove(CLASS_NAME);
		}

		// stylesheet template
		if ("stylesheetTemplate" in changedPropertiesObject) {
			//elementForm.stylesheetTemplate.classList.add(CLASS_NAME);
		}
		else {
			//elementForm.stylesheetTemplate.classList.remove(CLASS_NAME);
		}

		// html template
		if ("template" in changedPropertiesObject) {
			//elementForm.template.classList.add(CLASS_NAME);
		}
		else {
			//elementForm.template.classList.remove(CLASS_NAME);
		}

		// text ids
		if ("textIds" in changedPropertiesObject) {
			elementForm.textIDsInput.classList.add(CLASS_NAME);
		}
		else {
			elementForm.textIDsInput.classList.remove(CLASS_NAME);
		}

		// text tokens
		if ("textTokens" in changedPropertiesObject) {
			elementForm.textTokensInput.classList.add(CLASS_NAME);
		}
		else {
			elementForm.textTokensInput.classList.remove(CLASS_NAME);
		}

		// useAsGroupBackground
		if ("useAsGroupBackground" in changedPropertiesObject) {
			elementForm.useAsBackgroundGroup.classList.add(CLASS_NAME);
		}
		else {
			elementForm.useAsBackgroundGroup.classList.remove(CLASS_NAME);
		}

		// useBase64Data
		if ("useBase64Data" in changedPropertiesObject) {
			//elementForm.useBase64DataCheckbox.previousSibling.classList.add(CLASS_NAME);
		}
		else {
			//elementForm.useBase64DataCheckbox.previousSibling.classList.remove(CLASS_NAME);
		}
	}
	catch (error) {
		log(error.stack);
	}
}

/**
 * Warn if id is not valid
 **/
function updateIdInput() {
	var value = elementForm.idInput.value;
	var sanitizedValue = null;

	if (value || value!=null) {
		sanitizedValue = getSanitizedIDName(value);

		if (value!=sanitizedValue) {
			showBlockElement(elementForm.idInputWarning);
		}
		else {
			hideElement(elementForm.idInputWarning);
		}
	}
	else {
		hideElement(elementForm.idInputWarning);
	}
}

/**
 * Add the text element options to the element properties form
 **/
function updateSubFormItems() {
	var element = globalModel.selectedElement;
	var model = globalModel.selectedModel;
	var hasSubTags = element && showSubFormItems(element, model);


	if (hasSubTags) {
		showFlexElement(elementForm.subTagNameInput);
		showFlexElement(elementForm.subTagNameList.parentNode);

		showFlexElement(elementForm.subClassesInput);
		showFlexElement(elementForm.subClassesListIcon);

		showFlexElement(elementForm.subStylesInput);
		showFlexElement(elementForm.subStylesListIcon);

		showFlexElement(elementForm.subAttributesInput);
		showFlexElement(elementForm.subAttributesListIcon);
	}
	else {
		hideElement(elementForm.subTagNameInput);
		hideElement(elementForm.subTagNameList.parentNode);

		hideElement(elementForm.subClassesInput);
		hideElement(elementForm.subClassesListIcon);

		hideElement(elementForm.subStylesInput);
		hideElement(elementForm.subStylesListIcon);

		hideElement(elementForm.subAttributesInput);
		hideElement(elementForm.subAttributesListIcon);
	}
}

/**
 * Enable elements
 * @param  {...any} elements 
 */
function enableElements(...elements) {
	var element = null;
	for (let index = 0; index < elements.length; index++) {
		element = elements[index];
		if (element) {
			element.disable = false;
		}
	}
}

/**
 * Disable elements. If element is null it is skipped
 * @param  {...any} elements 
 */
function disableElements(...elements) {
	var element = null;
	for (let index = 0; index < elements.length; index++) {
		element = elements[index];
		if (element) {
			element.disable = true;
		}
	}
}

function hideElements(...args) {
	for (let index = 0; index < args.length; index++) {
		hideElement(args[index]);
	}
}

function showBlockElements(...args) {
	for (let index = 0; index < args.length; index++) {
		showBlockElement(args[index]);
	}
}

function showFlexElements(...args) {
	for (let index = 0; index < args.length; index++) {
		showFlexElement(args[index]);
	}
}

function hideElement(element) {
	element.style.display = Styles.NONE;
}

function showFlexElement(element) {
	element.style.display = Styles.FLEX;
}

function showBlockElement(element) {
	element.style.display = Styles.BLOCK;
}

function getFormattedLabel(text, secondText = "", startDelimiter = null, endDelimiter = null) {
	var start = "";
	var end = "";

	if (startDelimiter != null) {
		start = startDelimiter;
	}

	if (endDelimiter != null) {
		end = endDelimiter;
	}
	
	text += " <span class='small'>" + start + secondText + end + "</span>";

	return text;
}

/**
 * Update navigation items
 **/
function updateNodeNavigationItems() {
	var selectedElement = globalModel.selectedElement;
	var selectParentLabel = elementForm.selectParentLabel;
	var selectNextSiblingLabel = elementForm.selectNextSiblingLabel;
	var selectPreviousSiblingLabel = elementForm.selectPreviousSiblingLabel;
	var selectDescendentLabel = elementForm.selectDescendentLabel;
	
	if (selectedElement==null) {
		return;
	}

	var parentElement = selectedElement.parent;
	var previousSibling = getPreviousSceneNode(selectedElement);
	var nextSibling = getNextSceneNode(selectedElement);
	var descendant = getFirstDescendantNode(selectedElement);
	var message = "";
	const CLASS_NAME = "isClickable";

	if (selectedElement) {

		if (parentElement) {
			selectParentLabel.classList.add(CLASS_NAME);
		}
		else {
			selectParentLabel.classList.remove(CLASS_NAME);
		}

		if (previousSibling) {
			selectPreviousSiblingLabel.classList.add(CLASS_NAME);
			setTitleViaStyle(selectPreviousSiblingLabel, message + previousSibling.name);
			globalModel.previousSiblingLabel = previousSibling.name;
			globalModel.previousSiblingIcon = getIcon(previousSibling);
		}
		else {
			selectPreviousSiblingLabel.classList.remove(CLASS_NAME);
			clearTitleViaStyle(selectPreviousSiblingLabel);
			globalModel.previousSiblingLabel = "";
			globalModel.previousSiblingIcon = "";
		}

		if (nextSibling) {
			selectNextSiblingLabel.classList.add(CLASS_NAME);
			setTitleViaStyle(selectNextSiblingLabel, message + nextSibling.name);
			globalModel.nextSiblingLabel = nextSibling.name;
			globalModel.nextSiblingIcon = getIcon(nextSibling);
		}
		else {
			selectNextSiblingLabel.classList.remove(CLASS_NAME);
			clearTitleViaStyle(selectNextSiblingLabel);
			globalModel.nextSiblingLabel = "";
			globalModel.nextSiblingIcon = "";
		}

		if (descendant) {
			selectDescendentLabel.classList.add(CLASS_NAME);
			setTitleViaStyle(selectDescendentLabel, message + descendant.name);
			globalModel.descendantLabel = descendant.name;
			globalModel.descendantIcon = getIcon(descendant);
		}
		else {
			selectDescendentLabel.classList.remove(CLASS_NAME);
			clearTitleViaStyle(selectDescendentLabel);
			globalModel.descendantLabel = "";
			globalModel.descendantIcon = "";
		}
	}
	
}

/**
 * Add the image element options to the element properties form
 **/
function updateImageFormItems() {
	var selectedElement = globalModel.selectedElement;
	var selectedModel = globalModel.selectedModel;
	var exportAsImage = isExportAsImage(selectedElement, selectedModel);
	var imageOptionsGroup = elementForm.imageOptionsGroup;
	var imageFormat = selectedModel.imageFormat;
	var isAcceptableFormat = isSupportedExportFormat(imageFormat);
	var embedImages = globalModel.selectedArtboardModel.embedImages;
	var image2x = globalModel.selectedArtboardModel.image2x;

	if (isAcceptableFormat==false) {
		imageFormat = getImageFormat(selectedModel);
	}

	if (exportAsImage) {
		showFlexElement(imageOptionsGroup);
	}
	else {
		hideElement(imageOptionsGroup);
	}

	if (imageFormat==XDConstants.PNG) {
		// do not disable for now so user can see export size
		//elementForm.imageQualitySlider.disabled = true;
	}
	else {
		elementForm.imageQualitySlider.disabled = false;
	}

	elementForm.imageQualitySlider.title = parseInt(elementForm.imageQualitySlider.value);
	elementForm.imageQualitySlider.style.title = parseInt(elementForm.imageQualitySlider.value);

	if (embedImages) {
		//elementForm.embedImageCheckbox.indeterminate = true;
	}

	if (image2x) {
		//elementForm.image2xCheckbox.indeterminate = true;
	}

}

/**
 * Add the list of common tagnames to the tagnames list
 **/
function updateTagNamesList() {
	var tagNameList = elementForm.tagNameList;
	var subTagNameList = elementForm.subTagNameList;

	tagNameList.innerHTML = "";
	subTagNameList.innerHTML = "";

	var commonTagNames = [
		HTMLConstants.ANCHOR, 
		HTMLConstants.BUTTON, 
		HTMLConstants.DIVISION, 
		HTMLConstants.FORM, 
		HTMLConstants.H1, 
		HTMLConstants.H2, 
		HTMLConstants.H3, 
		HTMLConstants.HR, 
		HTMLConstants.IMAGE, 
		HTMLConstants.INPUT, 
		HTMLConstants.ITALIC, 
		HTMLConstants.LIST_ITEM, 
		HTMLConstants.ORDERED_LIST, 
		HTMLConstants.PARAGRAPH, 
		HTMLConstants.SPAN, 
		HTMLConstants.SELECT, 
		HTMLConstants.TABLE, 
		HTMLConstants.TABLE_COLUMN, 
		HTMLConstants.TABLE_ROW, 
		HTMLConstants.UNORDERED_LIST, 
	];

	if (globalModel.tagNames && globalModel.tagNames.length) {
		commonTagNames = commonTagNames.concat(globalModel.tagNames);
	}

	for (var i=0;i<commonTagNames.length;i++) {
		let name = commonTagNames[i];
		
		tagNameList.appendChild(createOption(name, {name}));
		subTagNameList.appendChild(createOption(name, {name}));
	}

	// option to exclude the tag
	tagNameList.appendChild(createOption("none (exclude tag)", {name:"none"}));
	subTagNameList.appendChild(createOption("none (exclude tag)", {name:"none"}));

	// option to clear the input
	tagNameList.appendChild(createOption("(clear)", {"clearItem":true}));
	subTagNameList.appendChild(createOption("(clear)", {"clearItem":true}));
}

/**
 * Add the list of common cursors
 **/
function updateCursorList() {
	var cursorList = elementForm.cursorList;
	var model = globalModel.selectedModel;
	var cursor = model && model.cursor;

	cursorList.innerHTML = "";

	var cursorNames = [
		"Cursor", 
		Styles.AUTO, 
		Styles.DEFAULT, 
		Styles.NONE, 
		Styles.CONTEXT_MENU, 
		Styles.HELP, 
		Styles.POINTER, 
		Styles.PROGRESS, 
		Styles.WAIT, 
		Styles.CELL, 
		Styles.CROSSHAIR, 
		Styles.TEXT, 
		Styles.VERTICAL_TEXT, 
		Styles.ALIAS, 
		Styles.COPY, 
		Styles.MOVE, 
		Styles.NO_DROP, 
		Styles.NOT_ALLOWED, 
		Styles.GRAB, 
		Styles.GRABBING, 
		Styles.ALL_SCROLL, 
		Styles.COLUMN_RESIZE, 
		Styles.ROW_RESIZE, 
		Styles.ZOOM_IN, 
		Styles.ZOOM_OUT, 
	];

	for (var i=0;i<cursorNames.length;i++) {
		let name = cursorNames[i];
		var option = createOption(name, {name});
		
		cursorList.appendChild(option);

		if (name==cursor) {
			selectListOption(cursorList, option);
		}
	}

}


/**
 * Get path to the scene node icon using SceneNode or Model
 * @param {SceneNode|Model} item 
 */
function getIcon(item) {
	var { SceneNode } = require("scenegraph");

	var type = "";
	if (item && item instanceof Model) {
		type = item.type;
	}
	else if (item && item instanceof SceneNode) {
		type = item.constructor.name;
	}

	switch(type) {
	 
		case "Ellipse":
		   break;
		case "Rectangle":
		   break;
		case "Path":
		   break;
		case "Line":
		   break;
		case "Polygon":
		   break;
		case "Text":
		   break;
		case "Group":
		   break;
		case "BooleanGroup":
		   break;
		case "RepeatGrid":
		   break;
		case "SymbolInstance":
		   break;
		case "Artboard":
		   break;
		default:
		   //addWarning("Element Type not found", "Exporter for element \"" + type + "\" named \"" + item.name + "\" is not supported at this time");
	}

	return "icons/" + type + " Icon." + "png";
}

/**
 * Closes the notification dialog
 **/
function closeNotificationDialog() {
	try {
		notificationDialog.close();
		if (document.body.contains(notificationDialog)) {
			document.body.removeChild(notificationDialog);
		}
		clearTimeout(notificationForm.timeout);
	}
	catch(error) {
		log(error);
	}
}

function updateSettingsModelWithSettingsFormValues() {
  var b = debugModel.preferences && log("Updating settings model with form values()");
  //debugModel.id = settingsForm.idInput.value;

  //debugModel.constrainBottom = elementForm.constrainBottomCheckbox.checked;

}

/**
 * Export from a panel update call
 **/
async function exportFromAutoUpdate() {
	const { selection, root } = require("scenegraph");

	var waiting1 = await quickExport(globalModel.selection, globalModel.documentRoot, true, true);
	showPanelExportedLabel();

	// refresh the element panel
	var waiting2 = await showElementDialog(globalModel.selection, globalModel.documentRoot, true);
}

/**
 * Export without showing a dialog. 
 * @param {Selection} selection Selection
 * @param {RootNode} documentRoot DocumentRoot
 **/
async function quickExport(selection, documentRoot, showNotification = true, fromPanel = false, updateSelection = true) {
	var b = debugModel.exportingLastArtboard;
	var focusedArtboard = selection.focusedArtboard;
	var artboardName = focusedArtboard ? focusedArtboard.name : "";
	var numberOfArtboards = getNumberOfArtboards();
	var message = "Select an artboard to continue";

	if (numberOfArtboards==0 && selection.items.length) {
		message += ". You cannot export a pasteboard"
	}
	
	try {

		if (numberOfArtboards==0) {
			b && log("Focused Artboard is null");

			// if auto export then do not show message
			if (globalModel.panelVisible==false) {
				let dialog = await showAlertDialog(message, "Web Export");
				return dialog;
			}
			else {
				showPanelExportedLabel(true);
			}

			return;
		}
		else {
			b && log("Exporting \"" + artboardName + "\"");
		}

		if (form.exportFolder==null) {
			var selectedFolder = await browseForExportFolder(null, false, false);

			if (selectedFolder==null) {
				b && log("No export folder was selected.");
				return;
			}
		}

		// prevent exporting while currently exporting
		if (globalModel.exporting) {
			return;
		}
		
		b && log("Step 1 Initializing");
		var local = await getExportLocalData();
		var waiting = await initializeGlobalModel(selection, documentRoot, false, null, fromPanel);
		
		// if user selects multiple artboards and option is to export selected artboards we need to update
		if (globalModel.exportList==XDConstants.SELECTED_ARTBOARDS) {
			var selectedArtboardsHasChanged = false;
			
			// if selected artboards has changed we need to update the artboard model - needed for quick export and panel export
			if (updateSelection) {
				selectedArtboardsHasChanged = updateSelectedArtboards(globalModel.selectedArtboardModel);
			}
			
			if (globalModel.exportArtboardsRange==null) {
				selectedArtboardsHasChanged = updateSelectedArtboards(globalModel.selectedArtboardModel, true);
				
				if (selectedArtboardsHasChanged==false) {
					message = "No artboards selected. Select artboards.";
					let dialog = await showAlertDialog(message, "Web Export");
					return dialog;
				}
			}
		}
	
		globalModel.startTime = getTime();
	
		b && log("Step 2 Running");
		await exportare();

		updateHREFLinks();
	
		globalModel.exportDuration = getTime()-globalModel.startTime;
	
		message = "Export complete at " + new Date().toLocaleTimeString() + "";
	
		message += " (" + globalModel.exportDuration + "ms)\n";
	
		b && log("Step 3 " + message);
	
		if (showNotification) {
			b && log("Step 4 showNotification " + showNotification);

			if (globalModel.panelVisible==false) {
				b && log("Step 5 globalModel.panelVisible " + globalModel.panelVisible);

				// show a notification dialog
				setTimeout(() => {
					document.body.appendChild(notificationDialog);
					let dialog = notificationDialog.showModal();
				}, 1);
	
				// close the dialog after specified duration
				notificationForm.timeout = setTimeout(() => {
					closeNotificationDialog();
				}, globalModel.quickExportNotificationDuration);

				await showMessages(false, message);
			}
			else {
				b && log("Step 6 globalModel.panelVisible " + globalModel.panelVisible);
				// keep the links visible if auto export is enabled
				var hideLinks = globalModel.exportOnUpdate==false;
				showPanelExportedLabel(false, hideLinks);
			}
			
		}
	}
	catch (error) {
		log(error);
	}

}

/**
 * Open the Export all artboards dialog
 * @param {Selection} selection Selection
 * @param {RootNode} documentRoot DocumentRoot
 **/
async function showExportAllMainDialog(selection, documentRoot) {

	try {
		await showMainDialog(selection, documentRoot);
	}
	catch(error) {
		log("Show export all error" + error.stack);
	}
}

/**
 * Open the main export artboared dialog
 * @param {Selection} selection Selection
 * @param {RootNode} documentRoot DocumentRoot
 **/
async function showMainDialog(selection, documentRoot) {
	var b = debugModel.showMainDialog;
	var alert;

	DebugSettings.outlineOnClick(mainForm.mainForm);
	DebugSettings.outlineOnClick(moreRoomForm.form);
	DebugSettings.outlineOnClick(hostForm.form);

	var artboards = getAllArtboards();
	var numberOfArtboards = artboards ? artboards.length : 0;

	// user must select at least one artboard
	if (selection.focusedArtboard==null) {
		b && log("No focused artboard");

		// if one or more artboards exist then we'll select the first
		if (numberOfArtboards>=1) {
			b && log("One or more artboards are available");
			// select only artboard
			//selection.focusedArtboard = artboards.at(0);
		}
		else {
			b && log("No artboards in project");
			var message = "No artboards available";

			if (selection.items.length) {
				message += "You cannot export a pasteboard item.";
			}

			alert = await showAlertDialog(message, "Web Export");
			return alert;
		}
	}

	if (selection.editContext!=documentRoot && globalModel.preventDialogInEditContext) {
		alert = await showAlertDialog("Please exit out of group editing before exporting", MessageConstants.EDITING_CONTEXT);
		return alert;
	}

	//globalModel.exportAllArtboards = exportAllArtboards;
	
	try {
		
		await getExportLocalData();

		// todo: check if able to remove the await 
		await initializeGlobalModel(selection, documentRoot, false);
		
		// code continues in showMainDialogWindow()
		var dialog = await showMainDialogWindow();
	}
	catch (error) {
		log("Error:" + error.stack);
	}

	return dialog
}

/**
 * Open dialog for support
 * @param {Selection} selection Selection
 * @param {RootNode} documentRoot DocumentRoot
 */
async function openSupportDialog(selection, documentRoot) {
	var b = debugModel.showHelpDialog;
	b && log("Opening help dialog");

	let alertDialog = await showHelpDialogWindow();

	return alertDialog;
}

async function showHelpDialogWindow() {
	var b = debugModel.showHelpDialog && log("Showing help dialog window()");

	if (globalModel.applicationDescriptor==null) {
		await getApplicationDescriptor();
	}

	supportForm.versionLabel.innerHTML = globalModel.applicationDescriptor.version;

	document.body.appendChild(helpDialog);
	
	let dialog = helpDialog.showModal();

	return dialog;
}

async function showMainDialogWindow() {
	var b = debugModel.showMainDialog && log("Showing main dialog window()");

	document.body.appendChild(mainForm.mainDialog);


	var cssString = `
		input[type=checkbox] {
			cursor: pointer;
			border: 0px dashed red 
		}
		@media (min-width: 400px) {
			
		}`;
	const styleTag = document.createElement("style");
	styleTag.innerHTML = cssString;
	mainForm.mainForm.insertAdjacentElement('beforeend', styleTag);
	
	
	// if using await (see next line) then the code after await is not run until dialog close
	//var dialog = await openDialog(alertDialog);

	// if not using await code after this line is run
	let dialog = mainForm.mainDialog.showModal();

	updateMainFormWithArtboardModelValues();
	
	hideMainUIMessageControls();

	if (isBasicScreenDisplayed()) {
		showExportingLabel(form.basicInstructions);
	}
	else {
		showExportingLabel(form.instructions);
	}

	if (globalModel.showBasicScreen) {

		// height is not always avaialable for basic screen
		mainForm.advancedScreen.addEventListener("resize", ()=> {
			var height = mainForm.advancedScreen.clientHeight;
			mainForm.basicScreen.style.visibility = Styles.HIDDEN;

			if (height!=0 && globalModel.showBasicScreen) {
				mainForm.basicScreen.style.height = height;
				mainForm.advancedScreen.style.display = Styles.NONE;
				mainForm.basicScreen.style.display = Styles.FLEX;
				mainForm.basicScreen.style.visibility = Styles.VISIBLE;
				switchToMainScreen(true);
			}
			else {
				mainForm.advancedScreen.style.visibility = Styles.VISIBLE;
				mainForm.advancedScreen.style.display = Styles.BLOCK;
				mainForm.basicScreen.style.display = Styles.NONE;
			}
		})
	}
	else {
		mainForm.advancedScreen.style.visibility = Styles.VISIBLE;
		mainForm.advancedScreen.style.display = Styles.BLOCK;
		mainForm.basicScreen.style.display = Styles.NONE;
		mainForm.switchScreenButton.innerHTML = "Basic";
	}

	return dialog;
}

function isBasicScreenDisplayed() {
	var display = mainForm.basicScreen.style.display;
	
	return display!=null && display!=Styles.NONE;
}

function isMainDialogWindowDisplayed() {
	var display = mainForm.mainDialog.parentNode;
	
	return display!=null && display!=Styles.NONE;
}

function switchToMainScreen(enforceBasic = false) {
	var isBasicScreenVisible = isBasicScreenDisplayed();

	if (isBasicScreenVisible==false || enforceBasic) {
		var height = mainForm.advancedScreen.clientHeight;
		mainForm.basicScreen.style.height = height;
		mainForm.advancedScreen.style.display = Styles.NONE;
		mainForm.basicScreen.style.visibility = Styles.VISIBLE;
		mainForm.basicScreen.style.display = Styles.FLEX;
		mainForm.switchScreenButton.innerHTML = "Advanced";

		mainForm.resetArtboardButton.style.display = Styles.NONE;
		mainForm.copyPageButton.style.display = Styles.NONE;
		mainForm.copyMarkupButton.style.display = Styles.NONE;
		mainForm.copyCSSButton.style.display = Styles.NONE;

		mainForm.nextArtboardIcon.style.display = Styles.NONE;
		mainForm.previousArtboardIcon.style.display = Styles.NONE;

		showExportingLabel(form.basicInstructions);
		hideMainUIMessageControls();
		globalModel.showBasicScreen = true;
	}
	else {
		mainForm.advancedScreen.style.visibility = Styles.VISIBLE;
		mainForm.advancedScreen.style.display = Styles.BLOCK;
		mainForm.basicScreen.style.display = Styles.NONE;
		
		mainForm.resetArtboardButton.style.display = Styles.BLOCK;
		mainForm.copyPageButton.style.display = Styles.BLOCK;
		mainForm.copyMarkupButton.style.display = Styles.BLOCK;
		mainForm.copyCSSButton.style.display = Styles.BLOCK;

		mainForm.nextArtboardIcon.style.display = Styles.BLOCK;
		mainForm.previousArtboardIcon.style.display = Styles.BLOCK;
		
		mainForm.switchScreenButton.innerHTML = "Basic";
		showExportingLabel(form.instructions);
		hideMainUIMessageControls();
		globalModel.showBasicScreen = false;
	}

	savePreferences();
}

function switchToMainScreenVisibility() {
	globalModel.showBasicScreen = !globalModel.showBasicScreen;

	if (globalModel.showBasicScreen) {
		mainForm.basicScreen.style.visibility = Styles.VISIBLE;
		mainForm.advancedScreen.style.visibility = Styles.HIDDEN;
	}
	else {
		mainForm.advancedScreen.style.visibility = Styles.VISIBLE;
		mainForm.basicScreen.style.visibility = Styles.HIDDEN;
	}
}

function showScaleScreenVisibility(show = true) {

	if (show) {
		mainForm.scaleScreen.style.visibility = Styles.VISIBLE;
		mainForm.scaleScreen.style.display = Styles.FLEX;
	}
	else {
		mainForm.scaleScreen.style.visibility = Styles.HIDDEN;
		mainForm.scaleScreen.style.display = Styles.NONE;
	}
}

/**
 * Show element options dialog
 * @param {Selection} selection Selection
 * @param {RootNode} rootNode DocumentRoot
 * @param {Boolean} showingPanel is the panel showing
 * @param {Boolean} showLabels show the option labels
 **/
async function showElementDialog(selection, rootNode, showingPanel = false, showLabels = true) {
	var b = debugModel.showElementDialog;
	b && log("Opening element dialog");

	var items = Platforms.isXD ? selection.items : selection;

	try {

		DebugSettings.outlineOnClick(elementForm.mainForm);
		DebugSettings.outlineOnClick(mainForm.messagesForm);
		DebugSettings.outlineOnClick(moreRoomForm.form);
		DebugSettings.outlineOnClick(hostForm.form);
	  
		if (selection.items.length==0) {

			if (showingPanel==false && selection.focusedArtboard==null) {
				b && log("No element selected. Select an element");
				let alert = await showAlertDialog("Select an element to continue", "Export to Web");
				return alert;
			}
			else if (selection.focusedArtboard==null) {
				//log("selection.focusedArtboard is null")
			}
			else {
				//log("no selection but focused artboard")
			}
		}
		else {
			//log("has selections")
		}
		
		let w = await getExportLocalData();

		let valid = await initializeGlobalModel(selection, rootNode, true, null, showingPanel);
		
		// getting preferences of element
		var preferenceModelData = globalModel.selectedModelData;
		
		var dialog = null;
		
		if (showingPanel) {
			addElementOptionsPanel(panelNode, showLabels);
			
			if (globalModel.hasSelection==false) {
				disableElementForm();
			}
			else {
				enableElementForm();
				elementForm.mainFormFieldset.setAttribute("disabled", false);
			}
		}
		else {
			// code after this line will not be run until window is closed
			dialog = await showElementDialogWindow(preferenceModelData);
		}
	}
	catch(error) {
		log(error.stack)
	}
	
	try {
		
		// this should run after the window is closed
		if (showingPanel==false || (panelNode && panelNode.firstElementChild==null)) {
			//log("adding panel after dialog")
			// forcing labels to not be shown for now since this is run after a dialog is shown
			//addElementOptionsPanel(panelNode, globalModel.showLabelsInPanel);
		}
	}
	catch(error) {
		log(error.stack)
	}

	//var dialog = elementDialog.showModal();
  
	//updateElementFormWithElementModelValues(preferenceModelData);

	return dialog;
}


/**
 * Show element options dialog
 * @param {Array} selection Selection
 * @param {Object} activeDocument ActiveDocument
 * @param {Boolean} showingPanel is the panel showing
 * @param {Boolean} showLabels show the option labels
 **/
async function showElementDialogPhotoshop(selection, activeDocument, showingPanel = false, showLabels = true) {
	var b = debugModel.showElementDialog;
	b && log("Opening element dialog");

	try {

		DebugSettings.outlineOnClick(elementForm.mainForm);
		DebugSettings.outlineOnClick(mainForm.messagesForm);
		DebugSettings.outlineOnClick(moreRoomForm.form);
		DebugSettings.outlineOnClick(hostForm.form);
	  
		if (selection.length==0) {

			if (showingPanel==false && activeDocument==null) {
				b && log("No element selected. Select an element");
				let alert = await showAlertDialog("Select an element to continue", "Export to Web");
				return alert;
			}
			else if (activeDocument==null) {
				//log("selection.focusedArtboard is null")
			}
			else {
				//log("no selection but focused artboard")
			}
		}
		else {
			//log("has selections")
		}
		
		let w = await getExportLocalData();
		// initialize global model
		let valid = await initializeGlobalModel(selection, rootNode, true, null, showingPanel);
		
		// getting preferences of element"
		var preferenceModelData = globalModel.selectedModelData;
		
		var dialog = null;
		
		if (showingPanel) {
			addElementOptionsPanel(panelNode, showLabels);
			
			if (globalModel.hasSelection==false) {
				disableElementForm();
			}
			else {
				enableElementForm();
				elementForm.mainFormFieldset.setAttribute("disabled", false);
			}
		}
		else {
			// code after this line will not be run until window is closed
			dialog = await showElementDialogWindow(preferenceModelData);
		}
	}
	catch(error) {
		log(error.stack)
	}
	
	try {
		
		// this should run after the window is closed
		if (showingPanel==false || (panelNode && panelNode.firstElementChild==null)) {
			//log("adding panel after dialog")
			// forcing labels to not be shown for now since this is run after a dialog is shown
			//addElementOptionsPanel(panelNode, globalModel.showLabelsInPanel);
		}
	}
	catch(error) {
		log(error.stack)
	}

	//var dialog = elementDialog.showModal();
  
	//updateElementFormWithElementModelValues(preferenceModelData);

	return dialog;
}

/**
 * Add element options form to the panel node
 * @param {Object} node HTMLElement that contains the panel
 * @param {Boolean} showLabels 
 **/
function addElementOptionsPanel(node, showLabels = true) {
	var elementPanel = null;
	var panelNodeContainsNode = elementForm.mainForm && node ? node.contains(elementForm.mainForm) : false;
	var modalContainsNode = elementForm.mainForm && elementForm.mainDialog ? elementForm.mainDialog.contains(elementForm.mainForm) : false;
	
	try {
		
		// if element form is part of Element Options modal dialog then remove it
		if (elementForm.mainForm) {
			
			if (elementForm.mainForm.parentNode==elementForm.mainDialog) {
				removeElementForm(node);
			}
		}
		
		if (node) {
			panelNodeContainsNode = elementForm.mainForm ? node.contains(elementForm.mainForm) : false;
			//containsNode = false;
			
			if (node.firstElementChild==null || elementForm.mainForm==null || panelNodeContainsNode==false) {
				elementPanel = createElementDialogOrPanel(true, showLabels);
				node.appendChild(elementForm.mainForm);
			}
			else {

			}
		}
		else {
			
		}
		
		panelNode = node;
		
	}
	catch(error) {
		log(error.stack)
	}

	return elementForm.mainForm
}

/**
* Disables the element form
*/
function disableElementForm() {
	elementForm.mainFormFieldset.setAttribute("disabled", true);
	updateElementForm(null);
}

/**
* Enables the element form
*/
function enableElementForm() {

}

function removeElementForm(node) {

	try {

		if (node && node.hasChildNodes) {
			for (let index = 0; index < node.childNodes.length; index++) {
				var childNode = node.childNodes[index];

				if (childNode.parentNode) {
					//log("Removing node from:" + childNode.name);
					childNode.remove();
				}
				else {
					//log("Not removing node:" + childNode.name);
				}
			}
		}
	}
	catch (error) {
		log(error.stack)
	}

	
}

/**
 * Show element options dialog
 * @param {Model} preferenceModel 
 **/
async function showElementDialogWindow(preferenceModel) {
	var b = debugModel.showElementDialog;
	var panelNodeContainsNode = false;
	var modalContainsNode = false;
	
	if (panelNode) {
		panelNodeContainsNode = elementForm.mainForm ? panelNode.contains(elementForm.mainForm) : false;
		
		if (panelNodeContainsNode) {
			if (elementForm.mainForm && elementForm.mainForm.parentNode) {
				elementForm.mainForm.remove();
			}
		}
	}
	
	modalContainsNode = elementForm.mainForm && elementForm.mainDialog ? elementForm.mainDialog.contains(elementForm.mainForm) : false;

	//if (document.body && document.body.firstElementChild==null) {
	if (modalContainsNode==false) {
		createElementDialogOrPanel();
	}

	try {
		// TypeError: Failed to execute 'appendChild' on 'Node': parameter 1 is not of type 'Node'.
		document.body.appendChild(elementForm.mainDialog);
	}
	catch(error) {
		createElementDialogOrPanel();
		document.body.appendChild(elementForm.mainDialog);
	}

	const cssTemplateString = `form > div { padding-left: 4px; border: 0px solid green;}`;
	const styleTag = document.createElement("style");
	styleTag.innerHTML = cssTemplateString;
	//document.head.insertAdjacentElement('beforeend', styleTag);

	DebugSettings.outlineOnClick(elementForm.mainForm);
	DebugSettings.outlineOnClick(moreRoomForm.form);
	DebugSettings.outlineOnClick(hostForm.form);

	// if not using await code after this line is run
	let dialog = elementForm.mainDialog.showModal();
	
	if (GlobalModel.supportsPluginData) {
		updateElementForm(globalModel.selectedModel);
	}
	else {
		updateElementForm(preferenceModel);
	}

	return dialog;
}

async function showAlertDialog(message, header) {
  debugModel.showAlertDialog && log("Showing alert dialog");
  //mainDialog.close();
  //closeOtherDialogs();

  document.body.appendChild(alertDialog);
  
  // if using await then code is halted
  //var dialog = await alertDialog.showModal();

  // if not using await then the form is filled out
  let dialog = alertDialog.showModal();
  
  if (header!="" && header!=null) {
	 alertForm.header.textContent = header;
  }
  else {
	 alertForm.header.textContent = "Alert";
  }
  
  alertForm.message.textContent = message;

  return dialog;
}

function closeOtherDialogs() {
  var b = debugModel.showAlertDialog && log("Closing other dialogs");
  var result;
  
  if (mainForm.mainDialog._dialog) {
	 result = mainForm.mainDialog.close();
  }
  if (elementForm.mainDialog._dialog) {
	 result = elementForm.mainDialog.close();
  }
  if (alertDialog._dialog) {
	 result = alertDialog.close();
  }

  b && log("Close other dialog result:" + result);
}

async function closeDialog(dialog, wait = false) {
  var b = debugModel.showElementDialog || debugModel.showMainDialog;
  b && log("Closing dialog:" + dialog.name);

  var result;
  
  if (wait) {
	 result = await dialog.close();
  }
  else {
	 result = dialog.close();
  }

  b && log("Close result:" + result);
}

async function openDialog(dialog, wait = false) {
  var b = debugModel.showElementDialog || debugModel.showMainDialog;
  b && log("Opening dialog:" + dialog.name);
  var result;
  
  // code is halted when using await
  if (wait) {
	 result = await dialog.showModal();
  }
  else {
	 result = dialog.showModal();
  }

  b && log("Open result for " + dialog.name+ ":" + result);
  return result;
}

function getPreferenceFileName(artboard) {
  var filename = "" + artboard.guid + globalModel.preferencesExtension;
  return filename;
}

function getFocusedOrFirstArtboard() {
  if (globalModel.focusedArtboard) {
	 return globalModel.focusedArtboard;
  }

  return globalModel.firstArtboard;
}

function toFixedNumber(value, places) {
    return Math.round(value * Math.pow(10, places)) / Math.pow(10, places);
}

/**
 * If a preference file doesn't exist it is created.
 * The preferences data is saved in a file named the GUID of the artboard.
 * Each object in an artboard and the artboard are stored by their GUID.
 * 
 * @param {Artboard|SceneNode} artboard Artboard
 * @param {ArtboardModel|Model} model Model
 * @returns {Model}
 */
async function getPreferenceData(artboard, model, element = null) {
  var b = debugModel.preferences && log("Get Preference Data()");
  /** @type {ArtboardModel} */
  var currentArtboardModel;
  var preferenceModelData;
  var modelGuid;
  
  if (artboard==null) {
	 b && log("No artboard focused. Select an artboard or element on the artboard");
	 //showAlertDialog("Select an artboard to continue", "Export to Web");
	 return;
  }
  
  if (globalModel.exportToSinglePage) {
	 currentArtboardModel = getArtboardModel(artboard);
  }
  else {
	 currentArtboardModel = globalArtboardModel;
  }
  
  modelGuid = model.guid;
  var filename;
  
  if (Array.isArray(model)) {
	 model = model[0];
	 //if (getModel(item)==null) {
	 if (getModel(element)==null) {
		model = createModel(artboard, 0, 0);
	 }
  }
  
  try {
	 filename = getPreferenceFileName(artboard);
	 const pluginDataFolder = await fileSystem.getDataFolder();
	 const entries = await pluginDataFolder.getEntries();
	 const files = await entries.filter(entry => entry.name.indexOf(filename) >= 0);
	 var file; 
	 
	 // if file exists we have saved data
	 if (files.length && files[0].isFile) {
		file = files[0];
		let data = await file.read();
		//globalModel.lastPreferenceDataValue = data;
		// log("Pref data:" + data);

		if (data!="") {
		  // only set this once when opening the dialog and not again in case of cancel - cancel not implemented
		  if (currentArtboardModel.originalPreferencesDataValue==null) {
			 currentArtboardModel.originalPreferencesDataValue = data;
		  }
		  
		  data = JSON.parse(data);
		  currentArtboardModel.preferencesData = data;
		  preferenceModelData = data[modelGuid];

		  b && object(data, "Saved JSON preferences object:");

		  if (preferenceModelData!=null) {
			 //globalModel.cachedArtboardModels[artboard] = artboardModel;
		  }
		}
	 }
	 else {
		// no file exists - create a new preferences file for the artboard
		b && log("No artboard preference file found! Creating preferences file.");
		createPreferenceData(model, currentArtboardModel); // saves artboard model
		file = await savePreferences(artboard, filename, currentArtboardModel.preferencesData);
		preferenceModelData = currentArtboardModel.preferencesData[modelGuid];
	 }
	 
	 //obj(artboardModel.preferencesData, "Artboard pref before");
	 
	 // the file was found but no data for the selected element then add it
	 if (preferenceModelData==null) {
		b && log("No element preference found. Creating model and saving to preference file.");
		createPreferenceData(model, currentArtboardModel, element); // adds model to dictionary
		file = await savePreferences(artboard, filename, currentArtboardModel.preferencesData);
		preferenceModelData = currentArtboardModel.preferencesData[modelGuid];

		if (preferenceModelData!=null) {
		  //globalModel.cachedArtboardModels[artboard] = artboardModel;
		}
	 }
  }
  catch (error) {
	 log("" + error.stack);
	 addError("Get Preference Error", error);
  }
  
  //obj(artboardModel.preferencesData, "Artboard pref after");
  //obj(preferenceModelData, "Preferences loaded");
  
  return preferenceModelData;
}

/**
 * Creates preference data for the object passed in and returns it and sets it on the artboard model.
 * 
 * @param {Model|ArtboardModel} model 
 * @param {ArtboardModel} documentModel 
 * @param {SceneNode} element Scene node. Optional
 * @returns {Object|Model} retuns an object with the prefrences properties and values on it
 **/
function createPreferenceData(model, documentModel, element = null) {
  var b = debugModel.preferences && log("Create Preference Data()");
  b && log("Artboard model: " + documentModel.name);
  b && log("Artboard guid: " + documentModel.guid);
  b && log("Artboard: " + documentModel.artboard);
  //log("Creating preference data for " + getSanitizedIDName(model.id));
  var instanceType = typeof model;
  var data;

  // Model or Artboard Model
  if (model instanceof Model || model instanceof ArtboardModel) {
	 b && log("Data is Model or ArtboardModel");
	 b && log("Saving data for " + model.type);
	 b && log("Saving data for " + instanceType + " " + model.guid);
	 
	 data = model.getPreferencesData();
	 b && object(data, "New pref data for " + model.guid)

	 documentModel.preferencesData[model.guid] = data;
  }
  else {
	 b && log("Preference data is not Model or Artboard");
	 b && log("Model is " + model);
	 
	 // saving an element preference
	 if (element) {
		b && log("Saving data for item " + element.constructor.name + " " + element.guid);
		documentModel.preferencesData[element.guid] = model;
	 }
	 else {
		b && log("Saving data for " + instanceType + " " + documentModel.guid + " & " + element.guid);
		documentModel.preferencesData[documentModel.guid] = model;
	 }

	 data = model;
	 //obj(model, "Save data:");
  }

  // save to pluginData property
  var saveToPluginData = false;

  if (GlobalModel.supportsPluginData && saveToPluginData) {
	  //log("Version 14")

		// include guid keys so stringify can traverse the preferences data
		var includedProperties = getPropertiesAsArray(data).concat(getPreferenceProperties());
		
		var jsonData = JSON.stringify(data, includedProperties, XDConstants.TAB);

		// error when setting properties: 
		// Plugin Error: Plugin is not permitted to make changes from the background. Return a Promise to continue execution asynchronously.
		var canUpdate = false;
		
		if (canUpdate) {
			//log("Pref data: " + jsonData)

			if (element) {
				setSceneNodePluginData(element, jsonData);
				//element.pluginData = jsonData;
			}
			else {
				setSceneNodePluginData(globalArtboardModel.artboard, jsonData);
				//artboardModel.artboard.pluginData = jsonData;
			}
		}
  }

  return data;
}

function getPreferenceProperties() {
	var properties = globalArtboardModel.preferenceProperties;
	var modelPreferencesProperties = globalArtboardModel.model.preferenceProperties;
	properties = properties.concat(globalArtboardModel.model.preferenceProperties);

	return properties;
}

/**
 * Get list of models
 * @param {SceneNodeList} items 
 * @param {ArtboardModel} documentModel 
 **/
function getSelectedModels(items, documentModel) {
	var models = [];
	for (var i=0;i<items.length;i++) {
		var item = items[i];
		var model = getModel(item, true);
		models.push(model);
	}
  return models;
}

/**
 * Set value of property in a list of models
 * @param {Array} models 
 * @param {String} property 
 * @param {*} value 
 **/
function updateSelectedModels2(models, property, value, originalValue = null) {

	for (var i=0;i<models.length;i++) {
		var model = models[i];

		if (property in model) {
			model[property] = value
		}
	}
}

/**
 * Set value of property in a list of models
 * @param {Model} selectedModel
 * @param {Array} models 
 * @param {String} property 
 * @param {*} value 
 * @param {Boolean} onlyUpdateChanged 
 **/
function updateSelectedModels(selectedModel, models, property, value, onlyUpdateChanged = true) {
	var selectedModelChanged = false;

	// we may not want to update other properties unless this model value has changed
	if (selectedModel[property]!==value) {
		selectedModelChanged = true;
		selectedModel.propertyChanges.push(property);
	}

	for (var i=0;i<models.length;i++) {
		var model = models[i];

		if (property in model) {

			// only update non-selected items only if the selected model is changed
			if (onlyUpdateChanged && selectedModelChanged) {
				model[property] = value;
			}
			else if (selectedModel==model) {
				model[property] = value;
			}
		}
	}
}

/**
 * Get the preferences for the element
 * @param {SceneNode} element 
 * @param {ArtboardModel} documentModel ArtboardModel
 **/
function getSelectedModelPreferences(element, documentModel) {
  var b = debugModel.preferences && log("Get Selected Model Preferences()");
  var preferencesData;
  var isSceneNode;
  var model;

  // TypeError: Right-hand side of 'instanceof' is not an object
  //isSceneNode = element && element instanceof SceneNode;
  isSceneNode = true;
  preferencesData = documentModel.preferencesData[element.guid];

  // if no preference data for the element exists add it
  if (preferencesData==null) {
	 b && log("No preference data for Model. Creating model");
	 model = createModel(element, 0, 0, true);
	 b && log("model:" + model);
	 createPreferenceData(model, documentModel, element);
	 preferencesData = documentModel.preferencesData[model.guid];
  }
  else {
	 if (isSceneNode) {
		b && log("Preference data found for " + element.constructor.name + " element " + element.guid);
	 }
	 else {
		b && log("Preference data found for " + element + " " + element.guid);
	 }
	 
	 b && object(preferencesData, "Element pref data:");
  }

  return preferencesData;
}

/**
 * Save data to pluginData property. Value is the JSON string value from model.getPreferencesData().
 * @param {SceneNode} item 
 * @param {Object} data 
 * @param {String} editLabel 
 * @returns {Boolean|Error} returns true if set or false or Error if cannot set plugin data
 **/
function setSceneNodePluginData(item, data, editLabel = null) {

	if (GlobalModel.supportsPluginData) {
		var stackTrace = getStackTrace(null, ",").split(",");
		var calledFromQuickExport = stackTrace.indexOf("quickExport")!=-1;

		if (calledFromQuickExport) {
			return false;
		}

		try {
			const { root, selection } = require("scenegraph");

			if (globalModel.showingPanel || globalModel.exportFromElementPanel) {
				const { editDocument } = require("application");
				
				editDocument( () => {
					item.pluginData = JSON.stringify(data);
				});

			}
			else {
				item.pluginData = JSON.stringify(data);
			}

			return true;
		}
		catch(error) {
			// Error: Panel plugin edits must be triggered by an UI element
			// "Panel plugin edits must be initiated from a supported UI event"
			var errorString = error + "";

			// sometimes it looks like setting pluginData works but still throws an error - still debugging:
			if (errorString.indexOf("Panel plugin edits must be initiated from a supported UI")!=-1) {
				// update: calling from panel needs editDocument. added wrapper. looks like it is fixed
				//log("set plugin data error")
			}
			else if (errorString.indexOf("is not permitted to make changes from the background.")!=-1 && calledFromQuickExport) {
				// ignore errors from quick export
				//log("quick export error");
			}
			else if (errorString.indexOf("There are no edit records found.")!=-1) {

			}
			else {
				log(error);
			}

			return error;
		}
	}

	return false;
}

/**
 * Save data to pluginData property to multiple items. Value is the JSON string value from model.getPreferencesData().
 * @param {Array} items
 * @param {Array} data 
 * @param {String} editLabel 
 * @returns {Boolean|Error} returns true if set or false or Error if cannot set plugin data
 **/
function setSceneNodesPluginData(items, data, editLabel = null) {

	if (GlobalModel.supportsPluginData) {
		var stackTrace = getStackTrace(null, ",").split(",");
		var calledFromQuickExport = stackTrace.indexOf("quickExport")!=-1;

		if (calledFromQuickExport) {
			return false;
		}

		try {
			const { root, selection } = require("scenegraph");

			if (globalModel.showingPanel || globalModel.exportFromElementPanel) {
				const { editDocument } = require("application");
				
				editDocument( () => {
					for (var i=0;i<items.length;i++) {
						var item = items[i];
						item.pluginData = JSON.stringify(data[i]);
					}
				});

			}
			else {
				for (var i=0;i<items.length;i++) {
					var item = items[i];
					item.pluginData = JSON.stringify(data[i]);
				}
			}

			return true;
		}
		catch(error) {
			// Error: Panel plugin edits must be triggered by an UI element
			// "Panel plugin edits must be initiated from a supported UI event"
			var errorString = error + "";

			// sometimes it looks like setting pluginData works but still throws an error - still debugging:
			if (errorString.indexOf("Panel plugin edits must be initiated from a supported UI")!=-1) {
				// update: calling from panel needs editDocument. added wrapper. looks like it is fixed
				//log("set plugin data error")
			}
			else if (errorString.indexOf("is not permitted to make changes from the background.")!=-1 && calledFromQuickExport) {
				// ignore errors from quick export
				//log("quick export error");
			}
			else if (errorString.indexOf("There are no edit records found.")!=-1) {

			}
			else {
				log(error);
			}

			return error;
		}
	}

	return false;
}

/**
 * Save data to pluginData property using a string value in JSON format
 * @param {SceneNode} item 
 * @param {String} value 
 * @returns {Boolean|Error} returns true if set or Error if cannot set plugin data
 **/
function setSceneNodePluginDataValue(item, value) {

	if (GlobalModel.supportsPluginData) {

		try {
			item.pluginData = value;
			return true;
		}
		catch(error) {
			return error;
		}
	}
}

/**
 * Get data saved on the pluginData property or null if not set
 * @param {SceneNode} item 
 * @returns {Object} data
 **/
function getSceneNodePluginData(item) {

	if (item.pluginData) {
		var value  = item.pluginData;
		var data = JSON.parse(value);
	}

	return data;
}

/**
 * Imports the saved plugin data into the element model
 * @param {Model} model 
 * @param {Object} data 
 */
function parsePluginData(model, data) {
	model.parse(data);
}

/**
 * Add plugin data to the artboard model. May not be needed after version XD version 14
 * @param {Model} model 
 * @param {ArtboardModel} documentModel 
 * @param {Object} data 
 */
function storePluginDataInArtboardModel(model, documentModel, data) {
	documentModel.preferencesData[model.guid] = data;
}

/**
 * Get a copy of the preferences data
 * @param {Object|Model} preferencesData 
 **/
function copyPreferencesObject(preferencesData) {
	var data;
	if (preferencesData instanceof Model) {
		data = preferencesData.getPreferencesData();
		log("Getting preferences object")
		return data;
	}

	var data = Object.assign({}, preferencesData);
	log("Creating new object")
	return data;
}

/**
 * Copies values from a generic preferences object to artboard model.
 * Todo: Remove object assign if same output
 * @param {ArtboardModel} documentModel
 * @param {Object} preferenceData
 **/
function updateArtboardModelFromPreferences(documentModel, preferenceData) {
  var b = debugModel.preferences && log("Updating artboard model from preferences()");

  // TODO: Test if assign works the same as for in
  // using object assign
  // this could copy old property names if property names ever changed
  Object.assign(documentModel, preferenceData);

  for (const key in preferenceData) {
	 if (documentModel.hasOwnProperty(key)) {
		documentModel[key] = preferenceData[key];
	 }
  }
}

/**
 * Copies values from preferences to artboard model.
 * Todo: Remove object assign if same output
 * @param {Model} model
 * @param {Object} preferencesData
 **/
function updateElementModelFromPreferencesData(model, preferencesData) {
  var b = debugModel.preferences && log("Updating element model from preferences");

  // TODO: Test if assign works the same as for in
  // using object assign.
  // this could copy old property names if property names ever changed
  Object.assign(model, preferencesData);

  for (const key in preferencesData) {
	 if (model.hasOwnProperty(key)) {
		//b && log("Setting:" + key + " to " + preferences[key]);
		if (key=="type") continue;
		model[key] = preferencesData[key];
	 }
  }
}

/**
 * Gets the image export size. Returns array with image size at 1x and 2x
 * @param {SceneNode} sceneNode 
 * @param {String} format 
 * @param {Number} quality 
 * @returns {Definition} 
 */
async function getImageExportedSize(sceneNode, format, quality) {
	var b = debugModel.preferences;
	var dataFolder;
	var newFile;
	var preferencesValue;
	var filename = globalModel.temporaryImageFilename + "." + format;
	var definition = new Definition();
	var tempModel = new ArtboardModel();

	try {

		const temporaryFolder = await fileSystem.getTemporaryFolder();

		definition.node = sceneNode;
		definition.type = format;
		definition.quality = quality;
		definition.id = globalModel.temporaryImageFilename;
	
		var result = await exportRenditions([definition], tempModel, temporaryFolder, true);

		return definition;
	}
	catch (error) {
		log(error)
	}

	return null;
}

/**
 * Save users global preferences
 */
async function savePreferences() {
	var b = debugModel.preferences;
	var dataFolder;
	var newFile;
	var preferencesValue;
	var filename = globalModel.settingsFilename;
	var values = globalModel.getPreferencesData();
	
	b && log("Filename: " + filename);
	
	try {
		dataFolder = await fileSystem.getDataFolder();

		newFile = await dataFolder.createEntry(filename, { overwrite: true });
		
		preferencesValue = JSON.stringify(values, null, XDConstants.TAB);
		
		b && log("Data to save:" + preferencesValue);
		newFile.write(preferencesValue);

		b && log("Created global preferences file!\nCreated: " + newFile.nativePath);
	}
	catch (error) {
		log(error.stack);
		addError("Save Preferences Error", error);
	}

	return true;
}

/**
 * Get users global preferences
 */
async function getPreferences() {
	var b = debugModel.preferences;
	var pluginFolder;
	var newFile;
	var data;
	var filename = globalModel.settingsFilename;
	var values = globalModel.getPreferencesData();
	
	b && log("Filename: " + filename);
	
	try {
		pluginFolder = await fileSystem.getDataFolder();

		const entries = await pluginFolder.getEntries();
	 
		const files = entries.filter(entry => entry.name.indexOf(filename) >= 0);
		
		if (files.length && files[0].isFile) {
			var file = files[0];
			var preferencesValue = await file.read();
			data = JSON.parse(preferencesValue);
			globalModel.setPreferencesData(data);
		}

		b && log("Created global preferences file!\nCreated: " + newFile.nativePath);
	}
	catch (error) {
		log(error.stack);
		addError("Save Preferences Error", error);
	}

	return true;
}
/**
 * Get page template
 **/
async function getTemplate() {
  var b = debugModel.browseForFolder && log("Get Template()");
  b && log("Loading template from file system");

  try {
	 const pluginFolder = await fileSystem.getPluginFolder();
	 const entries = await pluginFolder.getEntries();
	 
	 const files = entries.filter(entry => entry.name.indexOf('template.html') >= 0);
	 
	 if (files.length && files[0].isFile) {
		var file = files[0];
		var template = await file.read();
		globalArtboardModel.template = template;
	 }
	 
  }
  catch (error) {
	 log("Stack:" + error.stack);
	 addError("Template Error", error);
  }
}

function getFormattedJSONString(artboardModel) {

  var preferencesProperties = artboardModel.preferenceProperties;
  var modelPreferencesProperties = artboardModel.model.preferenceProperties;
  preferencesProperties = preferencesProperties.concat(modelPreferencesProperties);
  
  // include guid keys so stringify can traverse the preferences data
  var includedProperties = getPropertiesAsArray(artboardModel.preferenceData).concat(preferencesProperties);
  
  var value = JSON.stringify(artboardModel.preferenceData, includedProperties, XDConstants.TAB);

  return value;
}

/**
 * Returns the names of the properties on the object in an array
 * @param {Object} values object that has properties on it
 */
function getPropertiesAsArray(values) {
  var array = [];

  for (const key in values) {
	 array.push(key);
  }

  return array;
}

/**********************************
 * CLIPBOARD METHODS
 **********************************/

async function copyCSStoClipboard(exportSelection = false, event = null) {
	var b = debugModel.copyToClipboard;
	var output = null;
	var exportMessage = null;
	
	try {

		if (globalModel.exportMultipleArtboards) {
			output = globalModel.cssOutput;
		}
		else {
			output = globalModel.selectedArtboardModel.cssOutput;
		}

		exportMessage = "CSS copied to the clipboard";

		if (output==null || output=="") {

			if (exportSelection) {
				await exportare(false, false, globalModel.selectedElement);
			}
			else {
				await exportare(false, false);
			}
		}

		if (b==false && globalModel.selectedModel) b = globalModel.selectedModel.debug;

		var exportWarningMessages = await showMessages(true);
		
		if (globalModel.exportMultipleArtboards) {
			output = globalModel.cssOutput;
		}
		else {
			output = globalModel.selectedArtboardModel.cssOutput;
		}

		const { editDocument } = require("application");

		if (globalModel.exportFromElementPanel) {
			// this still errors i think because it is not inside of the original click event from the panel
			editDocument( () => {
				clipboard.copyText(output);
			});
		}
		else {
			clipboard.copyText(output);
		}

		var showingLabel = false;
		var openMoreDetails = true;

		if (showingLabel) {

			if (exportSelection==false) {
				showExportingLabel(exportMessage);
			}
			else {
				showExportingLabel(exportMessage);
			}
		}
		else if (openMoreDetails) {
			showMessagesView("CSS", output + "\n\n\n" + exportWarningMessages, exportMessage);
		}

		b && log("Copied CSS to clipboard:\n" + globalArtboardModel.cssOutput);

		await resetGlobalModel();
	}
	catch(error) {
		log(error.stack);
	}
}

async function copyPageToClipboard(exportSelection = false, event = null) {
	var b = debugModel.copyToClipboard;
	var output = null;
	var exportMultipleArtboards = globalModel.exportMultipleArtboards;
	
	try {
		
		if (exportMultipleArtboards) {
			output = globalModel.pageOutput;
		}
		else {
			output = globalModel.selectedArtboardModel && globalModel.selectedArtboardModel.pageOutput;
			//output = artboardModel && artboardModel.pageOutput;
		}
		
		var exportMessage = "HTML page copied to clipboard";
		
		if (output==null || output=="") {
			
			if (exportSelection) {
				await exportare(false, false, globalModel.selectedElement);
			}
			else {
				await exportare(false, false);
			}
		}
		
		if (b==false && globalModel.selectedModel) b = globalModel.selectedModel.debug;
		
		var exportWarningMessages = await showMessages(true);
		
		if (globalModel.exportAllArtboards) {
			output = globalModel.pageOutput;
		}
		else {
			output = globalModel.selectedArtboardModel.pageOutput;
		}
		
		const { editDocument } = require("application");
		if (globalModel.showingPanel) {
			editDocument( () => {
				clipboard.copyText(output);
			});
		}
		else {
			// Plugin Error: Plugin is not permitted to make changes from the background. Return a Promise to continue execution asynchronously.
			// occurs when Export Artboards is opened from panel shortcut 
			clipboard.copyText(output);
		}

		b && log("Copied page to clipboard:\n" + output);

		var showingLabel = false;
		var openMoreDetails = true;

		if (showingLabel) {

			if (exportSelection==false) {
				showExportingLabel(exportMessage);
			}
			else {
				showExportingLabel(exportMessage);
			}
		}
		else if (openMoreDetails) {
			showMessagesView("HTML Page", output + "\n\n\n" + exportWarningMessages, exportMessage);
		}

		await resetGlobalModel();
	}
	catch(error) {
		log(error.stack);
	}
}

/**
 * Copy markup to clipboard
 * @param {Boolean} exportSelection export the selected element
 **/
async function copyMarkupToClipboard(exportSelection = false, event = null) {
	const { editDocument } = require("application");

	try {
		
		var b = debugModel.copyToClipboard;
		var output = null;
		var exportMultipleArtboards = globalModel.exportMultipleArtboards;
		
		if (exportMultipleArtboards) {
			output = globalModel.markupOutput;
		}
		else {
			output = globalModel.selectedArtboardModel && globalModel.selectedArtboardModel.markupOutput;
		}

		//var output = artboardModel.markupOutput;
		var exportMessage = "HTML markup copied to the clipboard";

		if (output==null || output=="") {
			if (exportSelection) {
				await exportare(false, false, globalModel.selectedElement);
			}
			else {
				await exportare(false, false);
			}
		}

		if (b==false && globalModel.selectedModel) b = globalModel.selectedModel.debug;

		var warningMessages = await showMessages(true);
		
		if (exportMultipleArtboards) {
			output = globalModel.markupOutput;
		}
		else {
			output = globalModel.selectedArtboardModel.markupOutput;
		}

		if (globalModel.showingPanel) {
			editDocument( () => {
				//clipboard.copyText(output);
			});
		}
		else {
			// Plugin Error: Plugin is not permitted to make changes from the background. Return a Promise to continue execution asynchronously.
			// occurs when Export Artboards is opened from panel shortcut 
			//clipboard.copyText(output);
		}

		var showingLabel = false;
		var openMoreDetails = true;

		if (showingLabel) {

			if (exportSelection==false) {
				showExportingLabel(exportMessage);
			}
			else {
				showExportingLabel(exportMessage);
			}
		}
		else if (openMoreDetails) {
			showMessagesView("HTML Markup", output + "\n\n\n" + warningMessages, exportMessage);
		}

		b && log("Copied markup to clipboard:\n" + globalArtboardModel.markupOutput);
		
		await resetGlobalModel();

	}
	catch(error) {
		log(error.stack);
	}
}

/**
 * Copy URL to clipboard. Use shift key to copy path
 * @param {Boolean} updateForm
 **/
async function copyURLtoClipboard(updateForm = false, event = null) {
	var b = debugModel.copyToClipboard;
	var exportMessage = "Copied URL to clipboard";
	var url = GlobalModel.lastURLLocation;
	var target = event && event.currentTarget;
	var isFromMainForm = target==mainForm.copyURLButton;
	var copiedPath = false;

	if (event && event.shiftKey) {
		url = GlobalModel.lastFolderPath;
		exportMessage = "Copied folder path to clipboard"; 
	}
	
	try {
		if (b==false && globalModel.selectedModel) b = globalModel.selectedModel.debug;
		
		if (url!=null && url!="") {

			if (globalModel.showingPanel) {
				editDocument( () => {
					clipboard.copyText(url);
				});
			}
			else {
				// Plugin Error: Plugin is not permitted to make changes from the background. Return a Promise to continue execution asynchronously.
				// occurs when Export Artboards is opened from panel shortcut 
				clipboard.copyText(url);
			}
			
			if (updateForm && mainForm.warningsTextarea) {
				showExportingLabel(exportMessage, true);
			}
			
			if (globalModel.panelVisible) {
				showPanelMessage(exportMessage);
			}
			
			b && log("Copied URL to clipboard:\n" + url);
		}
		else {
			
			exportMessage = "No URL to copy to the clipboard";

			if (updateForm && mainForm.messagesLabel) {
				showExportingLabel(exportMessage);
			}
			b && log(exportMessage);
		}
	}
	catch(error) {
		log(error.stack);
		//  Error: Cannot start another edit from UI event 'click' in panel plugin abc while editDocument is already executing
		// ?unknown: panel is open 
	}

}

/**
 * Copy Diff URL to clipboard
 * @param {Object} event
 **/
async function copyDiffURLtoClipboard(event = null) {
	var b = debugModel.copyToClipboard;
	var exportMessage = "Copied Diff URL to clipboard";
	var url = GlobalModel.lastDiffLocation;
	var target = event && event.currentTarget;
	var isFromMainForm = target==mainForm.diffLink;
	
	try {
		if (b==false && globalModel.selectedModel) b = globalModel.selectedModel.debug;
		
		if (url!=null && url!="") {

			if (globalModel.showingPanel) {
				editDocument( () => {
					clipboard.copyText(url);
				});
			}
			else {
				// Plugin Error: Plugin is not permitted to make changes from the background. Return a Promise to continue execution asynchronously.
				// occurs when Export Artboards is opened from panel shortcut 
				clipboard.copyText(url);
			}
			
			if (globalModel.panelVisible) {
				showPanelMessage(exportMessage);
			}
			
			b && log("Copied URL to clipboard:\n" + url);
		}
		else {
			
			exportMessage = "No URL to copy to the clipboard";

			if (mainForm.messagesLabel) {
				showExportingLabel(exportMessage);
			}
			b && log(exportMessage);
		}
	}
	catch(error) {
		log(error.stack);
		//  Error: Cannot start another edit from UI event 'click' in panel plugin abc while editDocument is already executing
		//  cause unknown: panel is open and export artboard dialog are open
	}

}

function copyForumURLtoClipboard(updateForm = false) {
	var b = debugModel.copyToClipboard;
	var exportMessage = "Copied Forum URL to clipboard";
	
	try {
		clipboard.copyText(GlobalModel.forumURL);
		
		b && log("Copied Forum URL to clipboard:\n" + GlobalModel.lastURLLocation);
	}
	catch(error) {
		log(error.stack);
	}

}

/**
 * Copy export folder path to clipboard
 */
function copyExportFolderURLtoClipboard() {
	var b = debugModel.copyToClipboard;
	var exportMessage = "Copied export folder path to clipboard";
	var path = mainForm.exportFolderInput.value;
	var previousMessage = mainForm.exportLabel.textContent;
	
	try {
		
		if (path==null || path=="") {
			showExportingLabel("Please select an export folder", true, previousMessage, globalModel.quickExportNotificationDuration/1.5);
		}
		else {
			clipboard.copyText(path);
			showExportingLabel(exportMessage, true, previousMessage, globalModel.quickExportNotificationDuration/1.5);
			b && log("Copied export folder path to clipboard:\n" + path);
		}
	}
	catch(error) {
		log(error.stack);
	}

}

/**
 * Show selected element markup in panel
 * @param {Boolean} css show the css instead of markup
 **/
async function showMarkupInPanel(css = false) {
	const { editDocument } = require("application");
	var b = debugModel.copyToClipboard;
	var output = null;
	var exportMultipleArtboards = globalModel.exportMultipleArtboards;

	//var output = artboardModel.markupOutput;
	var exportMessage = "HTML markup of the selected layer";

	if (css) {
		exportMessage = "CSS of the selected layer";
	}
	
	if (globalModel.selectedElement==null) {
		await showMessagesView("No Item Selected", "Items must be on an artboard to be exported", exportMessage);
		return;
	}

	if (globalModel.isPasteboardItem==true) {
		await showMessagesView("Pasteboard Item", "Items must be on an artboard to be exported", exportMessage);
		return;
	}

	try {

		if (exportMultipleArtboards) {
			output = globalModel.markupOutput;
		}
		else {
			output = globalModel.selectedArtboardModel && globalModel.selectedArtboardModel.markupOutput;
		}

		if (output==null || output=="") {
			await exportare(false, false, globalModel.selectedElement);
		}

		if (b==false && globalModel.selectedModel) b = globalModel.selectedModel.debug;

		var warningMessages = await showMessages(true);
		
		if (exportMultipleArtboards) {
			output = globalModel.markupOutput;
		}
		else {
			output = globalModel.selectedArtboardModel.markupOutput;
		}

		if (css) {

			if (exportMultipleArtboards) {
				output = globalModel.cssOutput;
			}
			else {
				output = globalModel.selectedArtboardModel.cssOutput;
			}
		}

		if (globalModel.showingPanel) {
	
		}
		else {
			// Plugin Error: Plugin is not permitted to make changes from the background. Return a Promise to continue execution asynchronously.
			// occurs when Export Artboards is opened from panel shortcut 
			//clipboard.copyText(output);
		}

		var showingLabel = false;
		var openMoreDetails = true;
		var title = "HTML Markup";

		if (css) {
			title = "CSS";
		}

		await showMessagesView(title, output, exportMessage, updateElementModelAfterMoreRoomView, globalModel.selectedModel);
		await resetGlobalModel();

	}
	catch(error) {
		log(error.stack);
	}
}

/**
 * Change the state of the checkbox
 * @param {HTMLInputElement} checkbox 
 */
function elementFormCheckboxLabelClickHandler(checkbox) {
	checkbox.checked = !checkbox.checked;

	updateElementModelAndSave();
}
/**
 * Change the state of the checkbox
 * @param {HTMLInputElement} checkbox 
 */
function mainFormCheckboxLabelClickHandler(checkbox) {
	checkbox.checked = !checkbox.checked;

	updateArtboardModelAndSave();
}

function messageLabelClickHandler(event) {
	var sendToConsole = false;
	var messageValue;
	
	if (sendToConsole) {
		var value = mainForm.warningsTextarea.value;
		console.log(value);
	}
	else {
		showMessagesView();
		//showExportMessages();
		//showMainUIMessageControls(true);
	}
}

function warningsTextareaOnInput(event) {
  event.preventDefault();
  return;
}

///////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////
/// MAIN 
/////////////////////////////////////////////

var globalModel = new GlobalModel();
var globalArtboardModel = new ArtboardModel();
var pageToken = new PageToken();
var lastFileLocation = null;

/**
 * Load in template code, application descriptor and preferences
 **/
async function getExportLocalData() {

	if (globalModel.useTemplate) {
		await getTemplate();
	}

	await getTagNamesList();
	await getSinglePageControls();
	await getPageScript();
	await getScaleControls();
	await getApplicationDescriptor();
	await getPreferences();
}

// To export an item 
// add a case to createModel()
// add a method like exportRectangle()
// in the method set properties on the objects of the tags you want to export
// set the tag name on the model
// in the addToExport method check the value
// todo: Create a sort of document object model

/**
 * Initialize the global model. This is supposed to get all the information needed 
 * to run the export method with quick export()
 * @param {Selection} selection 
 * @param {RootNode} rootNode 
 * @param {Boolean} showingElementDialog 
 * @param {Artboard} alternativeArtboard 
 * @param {Boolean} showingPanel 
 **/
async function initializeGlobalModel(selection, rootNode, showingElementDialog = false, alternativeArtboard = null, showingPanel = false) {
	var b = debugModel.initializeGlobalModel;
	var rootDesignViewItems = rootNode.children;
	var numberOfDesignViewItems = rootDesignViewItems ? rootDesignViewItems.length : 0;
	var numberOfSelectedArtboards = 0;
	var preferenceData = null;
	/** @type {Artboard} */
	var focusedArtboard = null;
	/** @type {Artboard} */
	var selectedArtboard = null;
	var selectedItems = selection.items.splice(0);
	var noArtboardsFound = false;
	var exportList = null;
	var allArtboards = getAllArtboards();
	var selectedArtboards = getSelectedArtboards();
	var numberOfArtboards = allArtboards.length;
	var numberOfSelectedArtboards = selectedArtboards.length;
	var allArtboardNames = getArtboardNames(allArtboards);
	var artboards = allArtboards;
	var selectingFirstArtboard = false;

	//log(getStackTrace())


	globalModel.allArtboards = artboards;
	globalModel.numberOfSelectedArtboards = numberOfSelectedArtboards;
	globalModel.numberOfArtboards = numberOfArtboards;
	globalModel.numberOfDesignViewItems = numberOfDesignViewItems;

	globalModel.hasSelection = true;

	if (numberOfArtboards==0) {
		noArtboardsFound = true;
		//return false;
	}

	// verify this works with export item
	selectedArtboard = determineSelectedArtboard(alternativeArtboard);

	//if (exportAllArtboards==false) {
		//globalModel.exportToSinglePage = false;
	//}

	globalModel.showingElementDialog = showingElementDialog;
	globalModel.showingPanel = showingPanel;
	globalModel.selection = selection;
	globalModel.focusedArtboard = focusedArtboard;

	globalModel.documentRoot = rootNode;
	globalModel.cssOutput = "";
	globalModel.markupOutput = "";
	globalModel.pageOutput = "";
	globalModel.artboardIds = [];
	globalModel.artboards = rootDesignViewItems; // todo refactor
	globalModel.artboardWidths = [];
	globalModel.artboardWidthsCounts = 0;
	globalModel.originalArtboard = selectedArtboard;
	globalModel.selectedArtboard = selectedArtboard;
	globalModel.selectedElement = null;
	globalModel.selectedModelData = null;
	globalModel.originalModelPreferences = null;
	globalModel.selectedModel = null;
	globalModel.selectedModels = [];
	globalModel.typesDictionary = {};
	globalModel.ids = {};
	globalModel.itemCount = 0;
	globalModel.artboardGUIDs = {};
	globalModel.selectedArtboardModel = selectedArtboard ? getArtboardModelInstance(selectedArtboard) : null;
	globalModel.originalArtboardModel = globalModel.selectedArtboardModel;
	globalModel.homeArtboard = interactions.homeArtboard;
	globalModel.firstArtboard = numberOfArtboards>0 ? artboards[0] : null;


	// need to remove this global variable for good 
	globalArtboardModel = globalModel.selectedArtboardModel;
	
	var selectedArtboardModel = globalModel.selectedArtboardModel;
	/** @type {String} */
	var exportRangeValue = null;
	var exportRangeArray = [];
	var exportType = null;
	var userSelectedArtboards = [];
	var userSelectedArtboardNames = [];
	var exportMultipleArtboards = false;

	if (selectedArtboardModel) {
		exportRangeValue = selectedArtboardModel.exportArtboardsRange;
		exportRangeArray = exportRangeValue!="" && exportRangeValue!=null && exportRangeValue.split ? exportRangeValue.split(",") : [];
		userSelectedArtboards = getArtboardsFromGUIDs(exportRangeArray);
		userSelectedArtboardNames = getArtboardNames(userSelectedArtboards);
		globalModel.userSelectedArtboards = userSelectedArtboards;
		exportType = selectedArtboardModel.exportType;
		exportList = selectedArtboardModel.exportList;

		// value can be null so default to selected artboard 
		if (exportList==null) {
			exportList = XDConstants.SELECTED_ARTBOARD;
			selectedArtboardModel.exportList = exportList;
		}
		
		exportMultipleArtboards = exportList==XDConstants.SELECTED_ARTBOARDS || exportList==XDConstants.ALL_ARTBOARDS;

		if (exportMultipleArtboards) {
			if (exportType==XDConstants.SINGLE_PAGE_NAVIGATION ||
				exportType==XDConstants.SINGLE_PAGE_MEDIA_QUERY || 
				exportType==XDConstants.SINGLE_PAGE_APPLICATION) {

				globalModel.exportToSinglePage = true;
			}
			else {
				globalModel.exportToSinglePage = false;
			}
		}

		if (globalModel.exportToSinglePage) {
			globalModel.embedImages = selectedArtboardModel.embedImages;
			globalModel.image2x = selectedArtboardModel.image2x;
			globalModel.imagesExportFolder = selectedArtboardModel.imagesExportFolder;
		}
		
		updateGlobalModelValues(selectedArtboardModel);

		globalModel.exportList = selectedArtboardModel.exportList;

	}
	else if (exportMultipleArtboards==false) {
		globalModel.exportToSinglePage = false;
	}

	globalModel.exportMultipleArtboards = exportMultipleArtboards;

	// Selected Element
	// no multiple selection support currently
	// get last selected item to match artboard selection behavior
	/** @type { SceneNode } */
	var element = selection.items.length ? selection.items[ selection.items.length-1 ] : selectedArtboard;
	
	if (showingElementDialog && element==null && globalModel.showingPanel && selectedArtboard) {
		element = selectedArtboard;
	}
	
	globalModel.selectedElement = element;

	if (numberOfArtboards==0 && element==null) {
		globalModel.hasSelection = false;
	} 

	globalModel.isPasteboardItem = getIsPasteboardItem(globalModel.selectedElement);

	// EXPORT ALL ARTBOARDS
	// get preferences for other artboards
	// if showing element dialog we need all artboard models to get a list of links to other artboards
	
	var getAllArtboardsBecauseLinksDontWorkOtherwise = true;

	if (exportMultipleArtboards || showingElementDialog || getAllArtboardsBecauseLinksDontWorkOtherwise) {
		b && log("Caching artboards for all artboards export");
	
		// add selected artboard
		if  (selectedArtboard) {
			globalModel.artboardModels[selectedArtboard.guid] = globalModel.selectedArtboardModel;
		}

		// add artboards to cache
		for (let index = 0; index < numberOfArtboards; index++) {
			/** @type {Artboard} */
			const currentArtboard = artboards[index];
			var currentArtboardModel;
			
			try {
				b && log("1 Caching artboard: " + currentArtboard.name);

				if (currentArtboard==selectedArtboard) {
					currentArtboardModel = globalModel.selectedArtboardModel;
				}
				else {
					currentArtboardModel = getArtboardModelInstance(currentArtboard);
				}

				currentArtboardModel.index = index;

				globalModel.currentArtboard = currentArtboard;
				globalModel.currentArtboardModel = currentArtboardModel;

				setArtboardID(currentArtboardModel);
				// reset if calling export more than once
				resetArtboardModel(currentArtboardModel);
				
				globalModel.artboardModels[currentArtboard.guid] = currentArtboardModel;

				if (currentArtboardModel.export!=false) {
					globalModel.artboardIds.push("#" + currentArtboardModel.elementId);
				}

				var data = null;

				if (GlobalModel.supportsPluginData) {
					data = getSceneNodePluginData(currentArtboard);

					if (data==null) {

						data = currentArtboardModel.getPreferencesData();

						try {

							if (isInEditContext(selection.editContext, currentArtboard)) {
								setSceneNodePluginData(currentArtboard, data);
							}
							else {
								// outside of context - can't set scene node plugin data
							}
						}
						catch(error) {

						}

					}
					
					// TODO: 
					// name and id are linked 
					// but we have no way of knowing when the name is changed outside of the plugin 
					// and no way to update the plugin data yet
					// so we are updating it when we run the plugin
					if (currentArtboard.name!=data.name) {
						data.name = currentArtboard.name;
						currentArtboardModel.name = data.name; // need to set this out of 

						if (isInEditContext(selection.editContext, currentArtboard)) {
							setSceneNodePluginData(currentArtboard, data);
						}
					}

					if (currentArtboardModel.originalPreferencesDataValue==null) {
						currentArtboardModel.originalPreferencesDataValue = currentArtboard.pluginData;
					}

					storePluginDataInArtboardModel(currentArtboardModel, currentArtboardModel, data);
				}
				else {
					data = await getPreferenceData(currentArtboard, currentArtboardModel, currentArtboard);
				}
				
				b && log("2.1 Preference data created for artboard:" + currentArtboard.name);
				b && object(data, "2.12 Preference Data");

				updateArtboardModelFromPreferences(currentArtboardModel, data);

				b && log("3 After getting preferences for artboard:" + currentArtboard.name);
				
			}
			catch(error) {
				log("Caching artboard error:" + error.stack);
			}
		}
		
		for (const boardGUID in globalModel.artboardModels) {
			b && log("Cached artboards: " + board);
		}
		
		// showing main UI dialog
		if (showingElementDialog==false) {
			b && log("Setting artboard model to selected artboard:" + globalModel.selectedArtboardModel.artboard);

			globalArtboardModel = globalModel.selectedArtboardModel;

			preferenceData = globalModel.selectedArtboardModel.preferencesData;

			!showElementDialog && updateMainFormWithArtboardModelValues();
		}
	}

	
	// EXPORT SINGLE ARTBOARD or ELEMENT OPTIONS
	// get selected artboard and it's elements data
	if (exportMultipleArtboards==false) {

		globalArtboardModel = globalModel.selectedArtboardModel;

		for (let index = 0; index < numberOfArtboards; index++) {
			var board = artboards[index];

			if (board==selectedArtboard) {
				globalArtboardModel.index = index;
				break;
			}
		}

		if (GlobalModel.supportsPluginData) {
			if (selectedArtboard) {
				preferenceData = getSceneNodePluginData(selectedArtboard);

				if (preferenceData==null) {
					preferenceData = globalArtboardModel.getPreferencesData();

					if (showingElementDialog==false) {
						setSceneNodePluginData(selectedArtboard, globalArtboardModel.getPreferencesData());
					}

					storePluginDataInArtboardModel(globalArtboardModel, globalArtboardModel, preferenceData);
				}
				else {
					//log("existing preferences found for artboard")
				}

				if (globalArtboardModel.originalPreferencesDataValue==null) {
					globalArtboardModel.originalPreferencesDataValue = selectedArtboard.pluginData;
				}
				
				updateArtboardModelFromPreferences(globalModel.selectedArtboardModel, preferenceData);
			}
		}
		else {
			preferenceData = await getPreferenceData(selectedArtboard, globalModel.selectedArtboardModel, selectedArtboard);

			updateArtboardModelFromPreferences(globalModel.selectedArtboardModel, preferenceData);
		}
	}
	
	// ELEMENT OPTIONS
	if (showingElementDialog) {

		if (element==null) {
			b && log("No items selected");
			return;
		}
	
		if (element instanceof Artboard) {
			b && log("Selected item is artboard:");
		}
	
		if (element) {
			b && log("Item selected:" + getSanitizedIDName(element.name));

			// since version 14 we can store a JSON string on each scene node
			if (GlobalModel.supportsPluginData) {
				var elementIsPasteboardItem = getIsPasteboardItem(element);
				if (elementIsPasteboardItem && numberOfArtboards==0) {
					//return;
				}

				preferenceData = getSceneNodePluginData(element);
				var elementModel = createModel(element, 0, 0, true, true);
				elementModel.originalPreferencesDataValue = element.pluginData;
				
				if (preferenceData==null) {
					preferenceData = elementModel.getPreferencesData();

					if (isInEditContext(selection.editContext, selectedArtboard)) {
						//log("Artboard is in edit context. Can save")
						//setSceneNodePluginData(selectedArtboard, elementModel.getPreferencesData());
						//setSceneNodePluginData(selectedArtboard, artboardModel.getPreferencesData());
					}
					else {
						//log("Artboard is NOT in edit context. Can NOT save")
					}
				}

				globalModel.selectedModelData = preferenceData;

				if (globalArtboardModel) {
					storePluginDataInArtboardModel(elementModel, globalArtboardModel, preferenceData);
				}
				globalModel.selectedModels = getSelectedModels(selection.items, globalArtboardModel); // does nothing right now
				globalModel.selectedModel = elementModel;
			}
			else {
				globalModel.selectedModelData = getSelectedModelPreferences(element, globalArtboardModel);
				//globalModel.originalModelPreferencesValue = copyPreferencesObject(globalModel.selectedModelPreferences);
				//var changedProperties = getChangedProperties(globalModel.originalModelPreferences, globalModel.selectedModelPreferences);
				//log("Changed properties:" + changedProperties);
				globalModel.selectedModels = getSelectedModels(selection.items, globalArtboardModel);
				globalModel.selectedModel = getModel(element);// models may not be created yet
			}
		}
	}

	return preferenceData;
}

/**
 * Initialize the global model
 * @param {Selection} selection 
 * @param {RootNode} rootNode 
 * @param {Boolean} showingElementDialog 
 * @param {Boolean} exportAllArtboards 
 * @param {Artboard} alternativeArtboard 
 * @param {Boolean} showingPanel 
 **/
async function initializeGlobalModelOTHER(selection, rootNode, showingElementDialog = false, exportAllArtboards = false, alternativeArtboard = null, showingPanel = false) {
	var b = debugModel.initializeGlobalModel;
	var rootDesignViewItems = rootNode.children;
	var numberOfDesignViewItems = rootDesignViewItems ? rootDesignViewItems.length : 0;
	var preferenceData;
	/** @type {Artboard} */
	var focusedArtboard;
	/** @type {Artboard} */
	var selectedArtboard;
	var selectedArtboardModel;
	var artboards = getAllArtboards();
	var numberOfArtboards = artboards.length;
	var selectedArtboards = getSelectedArtboards();
	var numberOfSelectedArtboards = selectedArtboards.length;
	var noArtboardsFound = false;
	var exportRange = [];

	// exclude pasteboard items

	globalModel.numberOfSelectedArtboards = numberOfSelectedArtboards;
	globalModel.numberOfArtboards = numberOfArtboards;
	globalModel.numberOfDesignViewItems = numberOfDesignViewItems;

	globalModel.hasSelection = true;

	if (numberOfArtboards==0) {
		noArtboardsFound = true;
		//return false;
	}

	if (globalModel.exportedThisSession) {

	}

	focusedArtboard = selection.focusedArtboard;

	if (alternativeArtboard) {
		selectedArtboard = alternativeArtboard;
	}
	else if (focusedArtboard==null) {

		// if no artboard is focused but an artboard is available select it
		if (numberOfArtboards>0) {
			//selectedArtboard = artboards[0];
			selectedArtboard = rootNode;
		}
	}
	else {
		selectedArtboard = focusedArtboard;
	}

	// Selected Element
	/** @type { SceneNode } */
	var element = selection.items.length ? selection.items[0] : selectedArtboard;
	
	if (showingElementDialog && element==null && showingPanel && selectedArtboard) {
		element = selectedArtboard;
	}
	
	globalModel.selectedElement = element;

	if (numberOfArtboards==0 && element==null) {
		globalModel.hasSelection = false;
	} 

	// determine if we need to export single artboard 
	// or multiple
	var temporarySelectedArtboardModel = null;

	if (selectedArtboard) {
		temporarySelectedArtboardModel = getArtboardModelPluginDataOnly(selectedArtboard);
	}
	else if (showingElementDialog && element) {
		temporarySelectedArtboardModel = getArtboardModelPluginDataOnly(getArtboard(element));
	}

	var exportList = temporarySelectedArtboardModel? temporarySelectedArtboardModel.exportList : null;

	// if not set then set export single artboard as default
	if (exportList==null) {

		if (numberOfSelectedArtboards==1) {
			exportList = XDConstants.SELECTED_ARTBOARD;
			exportAllArtboards = false;
		}
		else if (numberOfSelectedArtboards>1) {
			exportList = XDConstants.SELECTED_ARTBOARD;
			exportAllArtboards = true;
		}
	}

	if (exportAllArtboards==false) {
		globalModel.exportToSinglePage = false;
	}

	// this might be outdated - using export list
	globalModel.exportAllArtboards = exportAllArtboards;

	globalModel.showingElementDialog = showingElementDialog;
	globalModel.showingPanel = showingPanel;
	globalModel.selection = selection;
	globalModel.focusedArtboard = focusedArtboard;

	globalModel.documentRoot = rootNode;
	globalModel.cssOutput = "";
	globalModel.markupOutput = "";
	globalModel.pageOutput = "";
	globalModel.artboardIds = [];
	globalModel.artboards = rootDesignViewItems;
	globalModel.allArtboards = artboards;
	globalModel.selectedArtboards = selectedArtboards;
	globalModel.artboardWidths = [];
	globalModel.artboardWidthsCounts = 0;
	globalModel.originalArtboard = selectedArtboard;
	globalModel.selectedArtboard = selectedArtboard;
	globalModel.selectedModelData = null;
	globalModel.originalModelPreferences = null;
	globalModel.selectedModel = null;
	globalModel.selectedModels = [];
	globalModel.typesDictionary = {};
	globalModel.ids = {};
	globalModel.artboardGUIDs = {};

	selectedArtboardModel = selectedArtboard ? getArtboardModelInstance(selectedArtboard) : null;
	exportRange = selectedArtboardModel.exportArtboardsRange ? selectedArtboardModel.exportArtboardsRange.split(",") : [];
	globalModel.originalArtboardModel = selectedArtboardModel;
	globalModel.homeArtboard = interactions.homeArtboard;
	globalModel.userSelectedArtboards = selectedArtboardModel ? getArtboardsFromGUIDs(exportRange) : [];
	globalModel.firstArtboard = numberOfArtboards>0 ? artboards[0] : null;
	globalArtboardModel = globalModel.selectedArtboardModel;

	//log("globalModel.selectedArtboardsFromModel:" + globalModel.userSelectedArtboards)

	// EXPORT ALL ARTBOARDS
	// get preferences for other artboards
	// if showing element dialog we need all artboard models to get a list of links to other artboards
	
	b && log("Caching artboards");

	// add selected artboard
	if  (selectedArtboard) {
		globalModel.artboardModels[selectedArtboard.guid] = globalModel.selectedArtboardModel;
	}

	// add artboards to cache
	for (let index = 0; index < numberOfArtboards; index++) {
		const currentArtboard = artboards[index];
		var currentArtboardModel;
		
		try {
			//log("1 Caching artboard: " + currentArtboard.name);
			b && log("1 Caching artboard: " + currentArtboard.name);
			//log("1 Caching artboard: " + currentArtboard.name);
			
			if (currentArtboard==selectedArtboard) {
				currentArtboardModel = globalModel.selectedArtboardModel;
			}
			else {
				currentArtboardModel = getArtboardModelInstance(currentArtboard);
			}

			currentArtboardModel.index = index;

			globalModel.currentArtboard = currentArtboard;
			globalModel.currentArtboardModel = currentArtboardModel;

			setArtboardID(currentArtboardModel);
			// reset if calling export more than once
			resetArtboardModel(currentArtboardModel);
			
			globalModel.artboardModels[currentArtboard.guid] = currentArtboardModel;

			
			var data = getSceneNodePluginData(currentArtboard);

			if (data==null) {
				//log("No plugin data yet on artboard")
				data = currentArtboardModel.getPreferencesData();

				try {

					if (isInEditContext(selection.editContext, currentArtboard)) {
						setSceneNodePluginData(currentArtboard, data);
					}
					else {
						// outside of context - can't set scene node plugin data
					}
				}
				catch(error) {

				}

			}
			
			// TODO: 
			// name and id are linked 
			// but we have no way of knowing when the name is changed outside of the plugin 
			// and no way to update the plugin data yet
			// so we are updating it when we run the plugin
			if (currentArtboard.name!=data.name) {
				data.name = currentArtboard.name;
				currentArtboardModel.name = data.name; // need to set this out of 

				if (isInEditContext(selection.editContext, currentArtboard)) {
					setSceneNodePluginData(currentArtboard, data);
				}
			}

			if (currentArtboardModel.originalPreferencesDataValue==null) {
				currentArtboardModel.originalPreferencesDataValue = currentArtboard.pluginData;
			}

			storePluginDataInArtboardModel(currentArtboardModel, currentArtboardModel, data);

			updateArtboardModelFromPreferences(currentArtboardModel, data);
			
		}
		catch(error) {
			log("Caching artboard error:" + error.stack);
			//addError("Cache Artboard Error", error);
		}
	}

	
	for (const boardGUID in globalModel.artboardModels) {
		b && log("Cached artboards: " + board);
	}
	
	// showing main UI dialog
	if (showingElementDialog==false) {
		b && log("Setting artboard model to selected artboard:" + globalModel.selectedArtboardModel.artboard);

		globalArtboardModel = globalModel.selectedArtboardModel;

		preferenceData = globalModel.selectedArtboardModel.preferencesData;

		updateMainFormWithArtboardModelValues();
	}

	// EXPORT SINGLE ARTBOARD or ELEMENT OPTIONS
	// get selected artboard and it's elements data
	if (showingElementDialog) {

		globalArtboardModel = globalModel.selectedArtboardModel;
		for (let index = 0; index < numberOfArtboards; index++) {
			var board = artboards[index];

			if (board==selectedArtboard) {
				globalArtboardModel.index = index;
				break;
			}
		}

		if (selectedArtboard) {
			preferenceData = getSceneNodePluginData(selectedArtboard);

			if (preferenceData==null) {
				preferenceData = globalArtboardModel.getPreferencesData();

				if (showingElementDialog==false) {
					setSceneNodePluginData(selectedArtboard, globalArtboardModel.getPreferencesData());
				}

				storePluginDataInArtboardModel(globalArtboardModel, globalArtboardModel, preferenceData);
			}
			else {
				//log("existing preferences found for artboard")
			}

			if (globalArtboardModel.originalPreferencesDataValue==null) {
				globalArtboardModel.originalPreferencesDataValue = selectedArtboard.pluginData;
			}
			
			updateArtboardModelFromPreferences(globalModel.selectedArtboardModel, preferenceData);
		}
	}
	
	// ELEMENT OPTIONS
	if (showingElementDialog) {

		if (element==null) {
			b && log("No items selected");
			return;
		}
	
		if (element instanceof Artboard) {
			b && log("Selected item is artboard:");
		}
	
		if (element) {
			b && log("Item selected:" + getSanitizedIDName(element.name));

			// since version 14 we can store a JSON string on each scene node
			if (GlobalModel.supportsPluginData) {
				var elementIsPasteboardItem = getIsPasteboardItem(element);

				if (elementIsPasteboardItem && numberOfArtboards==0) {
					//return;
				}

				preferenceData = getSceneNodePluginData(element);
				var elementModel = createModel(element, 0, 0, true, true);
				elementModel.originalPreferencesDataValue = element.pluginData;
				
				if (preferenceData==null) {
					preferenceData = elementModel.getPreferencesData();

					if (isInEditContext(selection.editContext, selectedArtboard)) {
						//log("Artboard is in edit context. Can save")
					}
					else {
						//log("Artboard is NOT in edit context. Can NOT save")
					}
				}

				globalModel.selectedModelData = preferenceData;

				if (globalArtboardModel) {
					storePluginDataInArtboardModel(elementModel, globalArtboardModel, preferenceData);
				}

				globalModel.selectedModels = getSelectedModels(selection.items, globalArtboardModel); // does nothing right now
				globalModel.selectedModel = elementModel;
			}
			else {
				globalModel.selectedModelData = getSelectedModelPreferences(element, globalArtboardModel);
				//globalModel.originalModelPreferencesValue = copyPreferencesObject(globalModel.selectedModelPreferences);
				//var changedProperties = getChangedProperties(globalModel.originalModelPreferences, globalModel.selectedModelPreferences);
				//log("Changed properties:" + changedProperties);
				globalModel.selectedModels = getSelectedModels(selection.items, globalArtboardModel);
				globalModel.selectedModel = getModel(element);// models may not be created yet
			}
		}
	}

	return preferenceData;
}

/**
 * Export method
 * @param {Boolean} createFiles 
 * @param {Object} itemToExport alternatively a selected item on the artboard
 **/
async function exportare(createFiles = true, createRenditions = true, itemToExport = null) {
	var b = debugModel.exportare;
	var artboards = globalModel.artboards;
	var numberOfArtboards = artboards ? artboards.length : 0;
	var artboardToExport = globalModel.selectedArtboard;
	var selectedElement = globalModel.selectedElement;
	var selectedModel = globalModel.selectedModel;
	var selectedArtboardModel = globalModel.selectedArtboardModel
	var artboardName = getSceneNodeName(artboardToExport);
	var itemName = getSceneNodeName(selectedElement);

	b && log("Running export");
	b && log("Artboards: " + numberOfArtboards);
	b && log("Selected Artboard: " + artboardName);
	b && log("Selected item: " + itemName);
	b && log(": " + getStackTrace());
 
	if (numberOfArtboards==1 && artboardToExport==null) {
	  //artboardToExport = artboards.at(0);
	}

	// these should be set in initializeGlobalModel
	var exportList = globalModel.exportList;
	var exportMultipleArtboards = globalModel.exportMultipleArtboards;
	var exportAllArtboards = globalModel.exportAllArtboards;
	var exportArtboardsToSinglePage = globalModel.exportToSinglePage;
	var addMediaQuery = globalModel.showArtboardsByMediaQuery;
	var showArtboardsByControls = globalModel.showArtboardsByControls;
	var exportAsSinglePageApplication = globalModel.exportAsSinglePageApplication;
	var userSelectedArtboards = globalModel.userSelectedArtboards;
	var userSelectedArtboardNames = getArtboardNamesAsString(userSelectedArtboards);
	var result = false;


	try {
		b && log("Export type:" + exportList);

		// export selected element
		if (itemToExport) {
			b && log("Exporting item:" + getSceneNodeName(itemToExport));
			result = await exportSelectedItem(itemToExport, createFiles, createRenditions);
		}
		else if (exportList==XDConstants.SELECTED_ARTBOARD) {
			b && log("Exporting selected artboard:" + artboardName);
			result = await exportSelectedArtboard(artboardToExport, createFiles);
		}
		else if (exportList==XDConstants.SELECTED_ARTBOARDS) {
			b && log("Exporting selected artboards:" + userSelectedArtboardNames);
			
			// to single page
			if (exportArtboardsToSinglePage==true) {
				result = await exportSelectedArtboardsToSinglePage(globalModel.userSelectedArtboards, createFiles);
			}
			// to multiple pages
			else if (exportArtboardsToSinglePage==false) {
				result = await exportSelectedArtboardsToMultiplePages(globalModel.userSelectedArtboards, createFiles);
			}
		}
		else if (exportList==XDConstants.ALL_ARTBOARDS) {

			if (exportArtboardsToSinglePage==true) {
				result = await exportAllArtboardsToSinglePage(createFiles);
			}
			else if (exportArtboardsToSinglePage==false) {
				result = await exportAllArtboardsToMultiplePages(createFiles);
			}
		}
		else {
			//log("7")
		}

		//log("Export result:" + result)
	}
	catch(error) {
		log(""+error)
	}


	//log("Export result:" + result)

	return true;
}

/**
 * Export a multiple artboards to multiple pages
 * @param {Array} artboards
 * @param {Boolean} createFiles 
 **/
async function exportSelectedArtboardsToMultiplePages(artboards, createFiles = true) {
	var b = debugModel.exportSelectedArtboardsToMultiplePages;
	var numberOfArtboards = artboards ? artboards.length : 0;
	var artboardName = null;
	var selectedArtboardModel = globalModel.selectedArtboardModel;
	var selectedArtboards = [];

	b && log("Exporting");
	b && log("Artboards: " + numberOfArtboards);
	
	if (numberOfArtboards==0) {
	  b && log('Nothing open.');
	}
	
	for (const boardGUID in globalModel.artboardModels) {
	  b && log("Cached artboards: " + boardGUID);
	}
	
	var exportList = globalModel.exportList;
	var exportMultipleArtboards = globalModel.exportMultipleArtboards;
	var exportAllArtboards = globalModel.exportAllArtboards;
	var exportArtboardsToSinglePage = false;//globalModel.exportToSinglePage;
	var addMediaQuery = false;// globalModel.showArtboardsByMediaQuery;
	var showArtboardsByControls = false;//globalModel.showArtboardsByControls;
	var exportAsSinglePageApplication = false;// globalModel.exportAsSinglePageApplication;
	var showScaleSlider = false;
	var addScaleScript = false;
	var artboardWidths = [];
	var nonArtboards = [];
	var isArtboard = false;

	var imagesSubFolder = globalModel.imagesExportFolder;
	var embedImages = globalModel.embedImages;
	var createRenditions = true;


	// should be in resetGlobalModel()?
	globalModel.cssOutput = "";
	globalModel.markupOutput = "";
	globalModel.pageOutput = "";
	globalModel.artboardIds = [];
	globalModel.files = [];
	globalModel.exportedRenditions = [];
	globalModel.renditions = [];
	globalModel.errors = [];
	globalModel.messages = [];
	globalModel.warnings = [];
	globalModel.nonArtboards = [];
	globalModel.ids = Object.assign({}, globalModel.artboardIdsObject);

	artboardWidths = getArtboardWidths(artboards);

	globalModel.nonArtboards = nonArtboards;
	globalModel.artboardWidths = artboardWidths;
	globalModel.artboardWidthsCounts = artboardWidths.length;
	
	var selectedArtboardGUIDs = [];
	if (exportList == XDConstants.SELECTED_ARTBOARDS) {
		selectedArtboardGUIDs = globalModel.exportArtboardsRange;
		selectedArtboards = getArtboardsFromGUIDs(selectedArtboardGUIDs);

		b && log("selectedArtboardGUIDs:"+selectedArtboardGUIDs)
		b && log("selectedArtboards:"+selectedArtboards)
	}
	
 
	// loop through each artboard
	// some items in the artboards list are paste board items - skip them
	//artboards.forEach(async (artboard, i) => {
	for (let i = 0; i < numberOfArtboards; i++) {
		const currentArtboard = artboards[i];
		var currentArtboardModel;
		var guid = currentArtboard.guid;
		var isArtboard = getIsArtboard(currentArtboard);
		
		
		if (isArtboard==false) continue;

	  
		try {
			// filter out artboards not in selected artboards list
			if (exportList==XDConstants.SELECTED_ARTBOARDS) {
				if (selectedArtboardGUIDs.indexOf(guid)==-1) {
					continue;
				}
			}

			artboardName = currentArtboard.name;
			b && log("Exporting:" + artboardName);
		
			b && log("Getting cached artboard:" + currentArtboard.name);
			currentArtboardModel = getArtboardModel(currentArtboard);
			
			b && log("Cached artboard 3:" + currentArtboardModel);
			globalArtboardModel = currentArtboardModel;

			globalModel.currentArtboard = currentArtboard;
			globalModel.currentArtboardModel = currentArtboardModel;

			setArtboardID(currentArtboardModel);
			currentArtboardModel.exportToSinglePage = exportArtboardsToSinglePage;
			currentArtboardModel.showArtboardsByMediaQuery = addMediaQuery;
			currentArtboardModel.showArtboardsByControls = showArtboardsByControls;
			currentArtboardModel.singlePageApplication = exportAsSinglePageApplication;

			// create each node
			createModel(currentArtboard, 0, 0);

			// we are getting base 64 separately from create model bc too many errors appear when using with await and create model
			await getBase64DataModel(currentArtboard, currentArtboardModel, currentArtboardModel);

			await exportDocument(currentArtboardModel, createFiles, createRenditions, embedImages, imagesSubFolder);

			globalModel.files.push(...currentArtboardModel.files);
			globalModel.renditions.push(...currentArtboardModel.renditions);
			globalModel.exportedRenditions.push(...currentArtboardModel.exportedRenditions);
			globalModel.warnings.push(...currentArtboardModel.warnings);
			globalModel.errors.push(...currentArtboardModel.errors);
			globalModel.messages.push(...currentArtboardModel.messages);	


			if (currentArtboardModel.showScaleSlider) {
				showScaleSlider = true;
			}
			
			if (needsPageScript(globalArtboardModel)) {
				addScaleScript = true;
			}
			
			if (currentArtboardModel.scaleToFit || 
					currentArtboardModel.scaleOnDoubleClick || 
						currentArtboardModel.actualSizeOnDoubleClick) {
				addScaleScript = true;
			}
		}
		catch(error) {
			log("Export error:" + error.stack);
			addError("Run Error", error);
		}
	}
 
	try {

		// export multiple artboards to separate pages
		//selectedArtboardModel = globalModel.selectedArtboardModel;
		var files = selectedArtboardModel.files;

		if (selectedArtboardModel.externalStylesheet) {
			var stylesheetFile = new FileInfo();
			stylesheetFile.content = selectedArtboardModel.cssOutput;
			stylesheetFile.fileName = selectedArtboardModel.getStylesheetFilename();
			stylesheetFile.fileExtension = selectedArtboardModel.cssExtension;
			
			files.push(stylesheetFile);
		}

		if (selectedArtboardModel.externalScript) {
			var scriptFile = new FileInfo();
			scriptFile.content = selectedArtboardModel.scriptOutput;
			scriptFile.fileName = selectedArtboardModel.getJavaScriptFilename();
			scriptFile.fileExtension = selectedArtboardModel.jsExtension;
			
			files.push(scriptFile);
		}
		
		globalModel.scriptOutput = selectedArtboardModel.scriptOutput;
		globalModel.cssOutput = selectedArtboardModel.cssOutput;
		globalModel.markupOutput = selectedArtboardModel.markupOutput;
		globalModel.pageOutput = selectedArtboardModel.pageOutput;
		
		if (createFiles && files.length) {
			updateFileLocation(files[0], selectedArtboardModel);
		}

		globalModel.lastArtboardModel = selectedArtboardModel;
	}
	catch(error) {
		//log("Export error:" + error.stack);
	}
 
	return true;
}

/**
 * Export all artboards to a single page
 * @param {Boolean} createFiles 
 **/
async function exportAllArtboardsToSinglePage(createFiles = true) {
	var artboards = globalModel.allArtboards;
	var artboardNames = getArtboardNames(artboards);
	var result = false;
	//log("Export all artboards to single page");
	//log("Exporting " + artboards.length);
	//log("Exporting:" + artboardNames);

	result = await exportSelectedArtboardsToSinglePage(artboards, createFiles);
	return result;
}

/**
 * Export all artboards to a multiple pages
 * @param {Boolean} createFiles 
 **/
async function exportAllArtboardsToMultiplePages(createFiles = true) {
	var artboards = globalModel.allArtboards;
	var result = false;

	result = await exportSelectedArtboardsToMultiplePages(artboards, createFiles);
	return result;
}

/**
 * Export a multiple artboards to a single page
 * @param {Array} artboards
 * @param {Boolean} createFiles 
 **/
async function exportSelectedArtboardsToSinglePage(artboards, createFiles = true) {
	var b = debugModel.exportSelectedArtboardsToSinglePage;
	var numberOfArtboards = artboards ? artboards.length : 0;
	var artboardName = null;
	var artboardNames = getArtboardNames(artboards);

	b && log("Export Selected Artboards To Single Page");
	b && log("Exporting Selected Artboards:" + artboardNames);
	b && log("Artboards: " + numberOfArtboards);
	
	var exportAllArtboards = true;
	var exportArtboardsToSinglePage = true;
	var exportMultipleArtboards = globalModel.exportMultipleArtboards;
	var addMediaQuery = globalModel.showArtboardsByMediaQuery;
	var showArtboardsByControls = globalModel.showArtboardsByControls;
	var exportAsSinglePageApplication = globalModel.exportAsSinglePageApplication;
	var showScaleSlider = false;
	var addScaleScript = false;
	var artboardWidths = [];
	var nonArtboards = [];
	var isArtboard = false;
 

	// should be in resetGlobalModel()?
	globalModel.cssOutput = "";
	globalModel.markupOutput = "";
	globalModel.pageOutput = "";
	globalModel.artboardIds = [];
	globalModel.files = [];
	globalModel.exportedRenditions = [];
	globalModel.renditions = [];
	globalModel.errors = [];
	globalModel.messages = [];
	globalModel.warnings = [];
	globalModel.nonArtboards = [];
	globalModel.ids = Object.assign({}, globalModel.artboardIdsObject);


	globalModel.nonArtboards = nonArtboards;
	artboardWidths = getArtboardWidths(artboards);
	globalModel.artboardWidths = artboardWidths;
	globalModel.artboardWidthsCounts = artboardWidths.length;

 
	// loop through each artboard
	// some items in the artboards list are paste board items - skip them
	//artboards.forEach(async (artboard, i) => {
	for (let i = 0; i < numberOfArtboards; i++) {
		/** @type {Artboard} */
		const currentArtboard = artboards[i];
		/** @type {ArtboardModel} */
		var currentArtboardModel;
		var isArtboard = getIsArtboard(currentArtboard);
		
		if (isArtboard==false) continue;

		 
		try {
			artboardName = currentArtboard.name;

			b && log("Exporting:" + artboardName);
			
			currentArtboardModel = getArtboardModel(currentArtboard);

			if (currentArtboardModel.export == false) {
				continue;
			}
			
			globalArtboardModel = currentArtboardModel;

			globalModel.currentArtboard = currentArtboard;
			globalModel.currentArtboardModel = currentArtboardModel;

			setArtboardID(currentArtboardModel);
			currentArtboardModel.exportToSinglePage = exportArtboardsToSinglePage;
			currentArtboardModel.showArtboardsByMediaQuery = addMediaQuery;
			currentArtboardModel.showArtboardsByControls = showArtboardsByControls;
			currentArtboardModel.singlePageApplication = exportAsSinglePageApplication;

			// create each node
			createModel(currentArtboard, 0, 0);

			// we are getting base 64 separately from create model bc too many errors appear when using with await and create model
			await getBase64DataModel(currentArtboard, currentArtboardModel, currentArtboardModel);

			var createRenditions = true;

			await exportDocument(currentArtboardModel, createFiles, createRenditions);

			globalModel.files.push(...currentArtboardModel.files);
			globalModel.exportedRenditions.push(...currentArtboardModel.exportedRenditions);
			globalModel.renditions.push(...currentArtboardModel.renditions);
			globalModel.warnings.push(...currentArtboardModel.warnings);
			globalModel.errors.push(...currentArtboardModel.errors);
			globalModel.messages.push(...currentArtboardModel.messages);

			if (needsPageScript(globalArtboardModel)) {
				addScaleScript = true;
			}
			
			if (currentArtboardModel.scaleToFit || 
					currentArtboardModel.scaleOnDoubleClick || 
						currentArtboardModel.actualSizeOnDoubleClick) {
				addScaleScript = true;
			}
		}
		catch(error) {
			log("Export error:" + error.stack);
			addError("Run Error", error);
		}
	}

	try {
		
		// export all artboards to a single page
		b && log("Exporting to single page");
		var idCSS;

		if (globalModel.hideArtboardsUsingDisplay) {
			idCSS = globalModel.artboardIds.join("," + XDConstants.LINE_BREAK) + " {" + XDConstants.LINE_BREAK + XDConstants.TAB + Styles.DISPLAY + ": " + Styles.NONE + ";"+XDConstants.LINE_BREAK+"}";
		}
		else {
			idCSS = globalModel.artboardIds.join("," + XDConstants.LINE_BREAK) + " {" + XDConstants.LINE_BREAK + XDConstants.TAB + Styles.VISIBILITY + ": " + Styles.HIDDEN + ";"+XDConstants.LINE_BREAK+"}";
		}

		if (showArtboardsByControls) {
			globalModel.markupOutput = globalModel.markupOutput + XDConstants.LINE_BREAK + globalModel.navigationControls;
		}

		if (showScaleSlider) {
			globalModel.markupOutput = globalModel.markupOutput + XDConstants.LINE_BREAK + globalModel.zoomSliderControls;
		}
		
		if (needsPageScript(globalArtboardModel)) {
			addScaleScript = true;
		}
		
		var setGlobalProperties = true;
		var globalStyles = {};

		globalStyles[Styles.ARTBOARD_IDS] = globalModel.artboardIds.join(",").replace(/#/g, "");
		
		// we should have a global array we can add new style declarations to
		if (setGlobalProperties) {
			//var focusedArtboardModel = getArtboardModel(focusedArtboard);
			var focusedArtboardModel = globalModel.selectedArtboardModel;

			setStandardCSSPropertyValues(focusedArtboardModel, globalStyles, true, true);

			var globalStyleDeclaration = getCSSValueWithSelector(":root", globalStyles, true, focusedArtboardModel.addSpaceBetweenStyleAndValue, null, 1);
			idCSS = globalStyleDeclaration + XDConstants.LINE_BREAK + idCSS;
		}


		let singlePageArtboardModel = new ArtboardModel();

		// copy global data to a new temporary artboard 

		singlePageArtboardModel.parse(globalModel.selectedArtboardModel.getPreferencesData());
		singlePageArtboardModel.css = idCSS + XDConstants.LINE_BREAK + globalModel.cssOutput;
		singlePageArtboardModel.markup = wrapInTag(HTMLConstants.BODY, globalModel.markupOutput);
		singlePageArtboardModel.innerMarkup = globalModel.markupOutput;
		singlePageArtboardModel.scripts = globalModel.scriptOutput;
		singlePageArtboardModel.elementId = globalModel.selectedArtboardModel.elementId;

		var pageOutput = "";
		
		var stylesheetTemplate = singlePageArtboardModel.stylesheetTemplate;
		var scriptsTemplate = singlePageArtboardModel.scriptTemplate;
		
		if (stylesheetTemplate!=null && trim(stylesheetTemplate)!="") {
			stylesheetTemplate = replaceDatesToken(stylesheetTemplate);
			stylesheetTemplate = replaceViewIdsToken(stylesheetTemplate, singlePageArtboardModel);
			singlePageArtboardModel.css = replaceStylesToken(stylesheetTemplate, singlePageArtboardModel.css, singlePageArtboardModel.css);
		}
		
		if (scriptsTemplate!=null && trim(scriptsTemplate)!="") {
			scriptsTemplate = replaceDatesToken(scriptsTemplate);
			scriptsTemplate = replaceViewIdsToken(scriptsTemplate, singlePageArtboardModel);
			singlePageArtboardModel.scriptOutput = replaceScriptsToken(scriptsTemplate, globalModel.pageControlsScript);
		}
		else {
			singlePageArtboardModel.scriptOutput = globalModel.pageControlsScript;
		}

		if (singlePageArtboardModel.template==null || singlePageArtboardModel.template=="") {
			pageOutput = replacePageTokens(globalModel.template, singlePageArtboardModel, true);
		}
		else {
			pageOutput = replacePageTokens(singlePageArtboardModel.template, singlePageArtboardModel, true);
		}

		singlePageArtboardModel.pageOutput = pageOutput;
		globalModel.pageOutput = pageOutput;

		if (createFiles==false && globalModel.selectedArtboardModel.externalStylesheet) {
			addWarning("External Stylesheet", "The external stylesheet option is checked but create files is false. Styles may be missing")
		}

		if (createFiles==false && globalModel.selectedArtboardModel.externalScript) {
			addWarning("External Script", "The external script option is checked but create files is false. Script may be missing")
		}

		var files = globalModel.selectedArtboardModel.files;
		
		if (globalModel.selectedArtboardModel.externalStylesheet) {
			var stylesheetFile = new FileInfo();
			stylesheetFile.content = singlePageArtboardModel.css;
			stylesheetFile.fileName = singlePageArtboardModel.getStylesheetFilename();
			stylesheetFile.fileExtension = singlePageArtboardModel.cssExtension;
			stylesheetFile.subFolder = singlePageArtboardModel.stylesheetSubFolder;
			
			files.push(stylesheetFile);
		}
		
		if (globalModel.selectedArtboardModel.externalScript) {
			var scriptFile = new FileInfo();
			scriptFile.content = singlePageArtboardModel.scriptOutput;
			scriptFile.fileName = singlePageArtboardModel.getJavaScriptFilename();
			scriptFile.fileExtension = singlePageArtboardModel.jsExtension;
			scriptFile.subFolder = singlePageArtboardModel.scriptSubFolder;
			
			files.push(scriptFile);
		}

		//log("CSS:" + globalModel.cssOutput);
		//log("Markup:" + globalModel.markupOutput);
		b && debugModel.showPage && log("Single Page output:" + pageOutput);

		if (createFiles) {
			let file = new FileInfo();
			file.content = pageOutput;
			file.elementId = singlePageArtboardModel.elementId;
			file.fileName = singlePageArtboardModel.getFilename();
			file.diffFileName = singlePageArtboardModel.getDiffFilename();
			file.fileExtension = singlePageArtboardModel.extension;
			file.subFolder = singlePageArtboardModel.subFolder;
			
			files.push(file);

			singlePageArtboardModel.files = files;
			singlePageArtboardModel.exportedRenditions = globalModel.exportedRenditions;

			await saveToDisk(files, singlePageArtboardModel);
			updateFileLocation(file, singlePageArtboardModel);
			
			let infoData = getIssue(MessageConstants.EXPORTED_FILE, file.getFilename());
			globalModel.messages.push(infoData);
		}

		if (globalModel.selectedArtboardModel.uploadOnExport) {
			if (globalModel.selectedArtboardModel.postLinkID && globalModel.userSite) {
				await uploadArtboard();
			}
		}

		globalModel.lastArtboardModel = singlePageArtboardModel;
	}
	catch(error) {
		log("Export error:" + error.stack);
		addError("Run Error", error);
	}
 
	return true;
}

/**
 * Export a single selected item to a page or to property for use when copying to the clipboard
 * @param {SceneNode} item
 * @param {Boolean} createFiles 
 **/
async function exportSelectedItem(item, createFiles = true, createRenditions = true) {
	var b = debugModel.exportSelectedItem;
	var itemName = item ? item.name : null;
	var currentArtboardModel;
	var currentArtboard = getArtboard(item);

	b && log("Artboard Name: " + itemName);

	try {
		itemName = item.name;
		
		// TODO: use current artboard
		currentArtboardModel = globalModel.selectedArtboardModel;;

		globalModel.currentArtboard = currentArtboard;
		globalModel.currentArtboardModel = currentArtboardModel;

		setArtboardID(currentArtboardModel);

		// create each node
		createModel(currentArtboard, 0, 0);
		
		if (globalModel.selectedModel==null && item) {
			globalModel.selectedModel = getModel(item);
		}
		
		currentArtboardModel.itemToExport = item;

		await exportDocument(currentArtboardModel, createFiles, createRenditions);

		globalModel.lastArtboardModel = currentArtboardModel;
	}
	catch(error) {
		log("Export error:" + error.stack);
		addError("Run Error", error);
	}

	return true;
}

/**
 * Export a single selected artboard to a single page
 * @param {Artboard} currentArtboard
 * @param {Boolean} createFiles 
 **/
async function exportSelectedArtboard(currentArtboard, createFiles = true) {
	var b = debugModel.exportSelectedArtboard;
	var artboardName = null;
	var currentArtboardModel;
 
	//log("Exporting the selected artboard");

	b && log("Artboard Name: " + artboardName);

	try {
		var exportArtboardsToSinglePage = false;//globalModel.exportToSinglePage;
		var addMediaQuery = false;// globalModel.showArtboardsByMediaQuery;
		var showArtboardsByControls = false;//globalModel.showArtboardsByControls;
		var exportAsSinglePageApplication = false;// globalModel.exportAsSinglePageApplication;

		globalModel.cssOutput = "";
		globalModel.markupOutput = "";
		globalModel.pageOutput = "";
		globalModel.artboardIds = [];
		globalModel.files = [];
		globalModel.renditions = [];
		globalModel.errors = [];
		globalModel.messages = [];
		globalModel.warnings = [];
		globalModel.nonArtboards = [];
		globalModel.ids = Object.assign({}, globalModel.artboardIdsObject);

		artboardName = currentArtboard.name;
		//log("Exporting:" + artboardName);
			
		// TODO: get artboard model from global model not here
		//currentArtboardModel = artboardModel;
		currentArtboardModel = globalModel.selectedArtboardModel;;
		currentArtboardModel.exportToSinglePage = exportArtboardsToSinglePage

		// next 3 lines already set?
		//artboardModel.artboard = currentArtboard; 
		//artboardModel.name = currentArtboard && currentArtboard.name;
		//artboardModel.guid = currentArtboard && currentArtboard.guid;

		globalModel.currentArtboard = currentArtboard;
		globalModel.currentArtboardModel = currentArtboardModel;

		setArtboardID(currentArtboardModel);

		// create each node
		createModel(currentArtboard, 0, 0);

		// we are getting base 64 separately from create model bc too many errors appear when using with await and create model
		// todo: refactor 
		await getBase64DataModel(currentArtboard, currentArtboardModel, currentArtboardModel);

		await exportDocument(currentArtboardModel, createFiles);

	}
	catch(error) {
		log("Export error:" + error.stack);
		addError("Run Error", error);
	}

	// export single artboard or multiple artboards to separate pages
	var files = currentArtboardModel.files;
	var stylesheetFile = null;
	var scriptFile = null;

	try {

		if (currentArtboardModel.externalStylesheet) {
			stylesheetFile = new FileInfo();
			stylesheetFile.content = currentArtboardModel.cssOutput;
			stylesheetFile.fileName = currentArtboardModel.getStylesheetFilename();
			stylesheetFile.fileExtension = currentArtboardModel.cssExtension;
			
			files.push(stylesheetFile);
		}

		if (currentArtboardModel.externalScript) {
			scriptFile = new FileInfo();
			scriptFile.content = currentArtboardModel.scriptOutput;
			scriptFile.fileName = currentArtboardModel.getJavaScriptFilename();
			scriptFile.fileExtension = currentArtboardModel.jsExtension;
			
			files.push(scriptFile);
		}

		globalModel.scriptOutput = currentArtboardModel.scriptOutput;
		globalModel.cssOutput = currentArtboardModel.cssOutput;
		globalModel.markupOutput = currentArtboardModel.markupOutput;
		globalModel.pageOutput = currentArtboardModel.pageOutput;

		globalModel.lastArtboardModel = currentArtboardModel;

		if (createFiles && files.length) {
			updateFileLocation(files[0], currentArtboardModel);
		}


		if (currentArtboardModel.uploadOnExport) {
			if (currentArtboardModel.postLinkID && globalModel.userSite) {
				await uploadArtboard();
			}
		}
	}
	catch(error) {
		log("Export error:" + error.stack);
		addError("Run Error", error);
	}
 
	//log("Exported the selected artboard");
	return true;
}

/**
 * Export document
 * @param {ArtboardModel} currentArtboardModel 
 * @param {Boolean} createFiles 
 **/
async function exportDocument(currentArtboardModel, createFiles = true, createRenditions = true, embedImages = false, subfolder = null) {
	var b = debugModel.exportDocument;
	let artboardModel = currentArtboardModel;
	var userStyles = artboardModel.userStyles;
	var artboard = artboardModel.artboard;
	var files = artboardModel.files;
	var file;
	var cssArray;
	var pageOutput;
	var markupArray;
	var markup;
	var innerMarkup;
	var definitions;
	var definitionsArray;
	var css;
	var item;
	var fileExtension = artboardModel.extension;
	var linearOutput = "";
	var exportMultipleArtboards = globalModel.exportMultipleArtboards;
	var exportAllArtboards = globalModel.exportAllArtboards;
	var exportToSinglePage = artboardModel.exportToSinglePage;
	var itemToExport = artboardModel.itemToExport;
	var template = artboardModel.template;
	var stylesheetTemplate = artboardModel.stylesheetTemplate;
	var scriptTemplate = artboardModel.scriptTemplate;
	var addPageScript = needsPageScript(artboardModel);
	var script = artboardModel.scripts;
	var exportGlobalStyles = itemToExport==null || getIsArtboard(itemToExport);
	
	globalModel.artboardIds.push("#" + artboardModel.elementId);
	script = globalModel.pageControlsScript;

	if (exportGlobalStyles) {
		let model = artboardModel.globalModel;
		var styleRule = new StyleRule();
		var styleDeclaration = styleRule.style;
		// the selector below was too specific overriding id selectors
		//styleRule.selectorText = "#" + artboardModel.elementId + " *";

		// the following selector is also too specific
		//styleRule.selectorText = "[id=" + artboardModel.elementId + "] *";
		
		styleRule.selectorText = "*";
		styleDeclaration.setProperty(Styles.MARGIN, 0);
		styleDeclaration.setProperty(Styles.PADDING, 0);
		styleDeclaration.setProperty(Styles.BOX_SIZING, Styles.BORDER_BOX);
		styleDeclaration.setProperty(Styles.BORDER, Styles.NONE);
		styleRule.style = styleDeclaration;

		model.styleRules.push(styleRule);

		if (artboardModel.showOutline) {
			b && log("Outline all elements");
			styleDeclaration.setProperty(Styles.OUTLINE, artboardModel.outlineStyle);
		}

		if (exportToSinglePage==false) {
			styleRule = new StyleRule();
			styleRule.selectorText = ":root";
			styleDeclaration = styleRule.style;
			styleDeclaration.setProperty(Styles.ARTBOARD_IDS, artboardModel.elementId);
			
			model.styleRules.unshift(styleRule);
		}

		var addMediaInfo = true;

		if (addMediaInfo) {
			styleRule = new StyleRule();
			styleRule.selectorText = ".mediaViewInfo";
			styleDeclaration = styleRule.style;
			styleDeclaration.setProperty(Styles.ARTBOARD_NAME, artboardModel.artboard.name);
			styleDeclaration.setProperty(Styles.ARTBOARD_ID, artboardModel.elementId);

			if (artboardModel.hyperlinkElement) {
				styleDeclaration.setProperty(Styles.STATE, artboardModel.hyperlinkElement);
			}
			setStandardCSSPropertyValues(artboardModel, styleDeclaration);
			
			model.styleRules.unshift(styleRule);
		}

		addToExport(null, model);
	}

	if (artboardModel.artboard.fill!=null) {
		//model.cssStyles[Styles.BACKGROUND_COLOR] = createSolidFill(null, model, artboardModel.artboard.fill);
	}

	var addDocumentTag = artboardModel.alternateTagName=="none" ? false : true;

	if (itemToExport && getIsArtboard(itemToExport)==false) {
		exportItem(itemToExport, 0, 0);
	}
	else if (addDocumentTag) {
		exportItem(artboard, 0, 0);
	}
	else {

		for (var i=0;i<artboard.children.length;i++) {
			item = artboard.children.at(i);
			exportItem(item, artboardModel.currentNestLevel, i);
		}
	}

	cssArray = artboardModel.cssArray;
	markupArray = artboardModel.markupArray;
	definitionsArray = artboardModel.definitionsArray;
	pageOutput = "";

	if (userStyles) {
		cssArray.push(userStyles);
	}
  
	if (cssArray && cssArray.length) {
		
		css = cssArray.join("\n");

		// do not include stylesheet template if exporting item
		if (itemToExport==null || (itemToExport!=null && getIsArtboard(itemToExport))) {
			
			// replace tokens in stylesheet template
			if (stylesheetTemplate!=null && trim(stylesheetTemplate)!="") {
				stylesheetTemplate = replaceDatesToken(stylesheetTemplate);

				// if not single page replaced stylesheet template later 
				if (exportToSinglePage==false) {
					
					if (artboardModel.externalStylesheet==false) {
						css = replaceStylesToken(stylesheetTemplate, css, css);
					}
					else {
						css = replaceStylesToken(stylesheetTemplate, css, css);
					}
				}
				else {
					// if single page replace stylesheet template later 
					css = replaceStylesToken(stylesheetTemplate, css, css);
				}
			}
			else {
				// replace date values
				css = replaceDatesToken(css);
			}
		}

		if (exportMultipleArtboards && exportToSinglePage) {
			let mediaQuery = getMediaQuery(artboard);
			css = mediaQuery + " {" + XDConstants.LINE_BREAK + css + XDConstants.LINE_BREAK + "}";
		}

		linearOutput += wrapInStyleTags(css, globalModel.stylesheetId);
	}

	// replace tokens from script template or set default script value
	if (script) {

		// replace tokens in script template
		if (scriptTemplate!=null && trim(scriptTemplate)!="") {
			scriptTemplate = replaceDatesToken(scriptTemplate);

			// if not single page replace script sheet template later 
			if (exportToSinglePage==false) {
				
				if (artboardModel.externalScript==false) {
					script = replaceScriptsToken(scriptTemplate, script);
				}
				else {
					script = replaceScriptsToken(scriptTemplate, script);
				}
			}
			else {
				// if single page replace script template later 
			}
		}
		else {
			// replace date values
			script = replaceDatesToken(script);
		}

	}

	if (artboardModel.hoistSVGDefinitions && definitionsArray && definitionsArray.length) {
		definitions = definitionsArray.join(XDConstants.LINE_BREAK);
		definitions = wrapInTag(HTMLConstants.DEFINITIONS, definitions);
		definitions = wrapInTag(HTMLConstants.SVG, definitions, "width:0;height:0;");
		markupArray.splice(1, 0, definitions);
	}

	// the markup is used in the replace method
	if (markupArray && markupArray.length) {
		markup = markupArray.join(XDConstants.LINE_BREAK);
		innerMarkup = markup;
		markup = wrapInTag(HTMLConstants.BODY, markup);
		
		linearOutput += XDConstants.LINE_BREAK + markup;
	}
  
  
	if (template==null || template=="") {
		template = globalModel.template;

		// ignore this warning for now
		//addWarning("Missing template content", "The template was empty. Using backup.");
	}
	
	if (artboardModel.hasDuplicateIds) {

		let duplicateIds = artboardModel.duplicateIds;

		for (let id in duplicateIds) {
			var duplicate = duplicateIds[id];
			var name = getShortString(duplicate.elementName, 50);
			var type = duplicate.type;
			var newName = duplicate.newName;
			var artboardName = getShortString(artboardModel.name, 50);

			var value = "The " + type + " named, \"" + name + "\" on artboard, \"" + artboardName + "\" was renamed to, \"" + newName + "\"";
			
			//if (debugModel.ignoreDuplicateIDs==false && exportAllArtboards==false) {
			if (debugModel.ignoreDuplicateIDs==false) {
				addWarning(MessageConstants.DUPLICATE_ID, value);
			}
		}
	}
  
	artboardModel.css = css;
	artboardModel.markup = markup;
	artboardModel.innerMarkup = innerMarkup;
	artboardModel.scripts = script;

	artboardModel.cssOutput = css;
	artboardModel.markupOutput = innerMarkup;
	artboardModel.scriptOutput = script;

	pageOutput = addPageScript==false ? replaceScriptsToken(template) : template;
	pageOutput = replacePageTokens(pageOutput, artboardModel, addPageScript);

	//log("Page:" + pageOutput);
	artboardModel.pageOutput = pageOutput;

	globalModel.cssOutput += css + XDConstants.LINE_BREAK;
	globalModel.markupOutput += innerMarkup + XDConstants.LINE_BREAK;
	globalModel.scriptOutput += script + XDConstants.LINE_BREAK;
	globalModel.pageOutput = pageOutput;

	//log("Page output:\n" + pageOutput);

	if (debugModel.showMarkup) {
		log("Markup output:\n" + innerMarkup);
	}

	if (debugModel.showCSS) {
		log("CSS output:\n" + css);
	}

	if (debugModel.showLinearOutput) {
		log("Linear output:\n" + linearOutput);
	}

	if (debugModel.showPage) {
		log("Page output:\n" + pageOutput);
	}

	if (debugModel.showWarnings) {
		//showWarnings();
	}

	var createDiffFile = true;
	var expectedOutput = artboardModel.expectedOutput;
	var expectedCSSOutput = artboardModel.expectedCSSOutput;
	var expectedScriptOutput = artboardModel.expectedScriptOutput;
	var needsTitles = false;

	var diffObject = getDiffObject(artboard, expectedOutput, expectedCSSOutput, expectedScriptOutput, pageOutput);
	var diffOutput = diffObject.diffOutput;
	var exportedImages = [];
	
	if (createRenditions) {
		exportedImages = await exportRenditions(artboardModel.renditions, artboardModel, null, false, embedImages, subfolder);
		artboardModel.exportedRenditions = exportedImages;
	}

	// create files to be created
	file = new FileInfo();
	file.id = artboardModel.elementId;
	file.name = artboardModel.filename;
	file.content = pageOutput;
	file.fileName = artboardModel.getFilename();
	file.diffFileName = artboardModel.getDiffFilename();
	file.diffHTML = diffOutput;
	file.hasVerifyCheck = (expectedOutput!=null && expectedOutput!="") || (expectedCSSOutput!=null && expectedCSSOutput!="");
	file.fileExtension = fileExtension;
	file.exclude = exportToSinglePage;
	file.subFolder = artboardModel.subFolder;

	files.push(file);

	if (currentArtboardModel.externalStylesheet) {
		file = new FileInfo();
		file.name = artboardModel.filename;
		file.content = css;
		file.fileName = artboardModel.getStylesheetFilename();
		file.fileExtension = artboardModel.cssExtension;
		file.subFolder = artboardModel.stylesheetSubFolder;
		files.push(file);
	}
  
	if (currentArtboardModel.externalScript && addPageScript) {
		file = new FileInfo();
		file.name = currentArtboardModel.filename;
		file.content = currentArtboardModel.scripts;
		file.fileName = currentArtboardModel.getJavaScriptFilename();
		file.fileExtension = artboardModel.jsExtension;
		file.subFolder = artboardModel.scriptSubFolder;
		files.push(file);
	}

	if (diffOutput!=null && diffOutput!="" && createDiffFile) {
		file = new FileInfo();
		file.name = artboardModel.filename;
		file.content =  artboardModel.getDiffContent(diffOutput);
		file.fileName = artboardModel.getDiffFilename();
		file.fileExtension = artboardModel.extension;
		file.subFolder = artboardModel.subFolder;
		files.push(file);
	}
  
	if (createFiles) {
		b && log("Creating files");
		await saveToDisk(files, currentArtboardModel);
		updateFileLocation(files[0], currentArtboardModel);
		var totalExportSize = currentArtboardModel.totalPagesSize + currentArtboardModel.totalImageSize; 
		var totalExportSize2x = currentArtboardModel.totalPagesSize + currentArtboardModel.totalImage2xSize; 
		var supports2x = (globalModel.exportToSinglePage && (globalModel.image2x && globalModel.embedImages==false)) || (currentArtboardModel.image2x && currentArtboardModel.embedImages==false);
		var sizeMessage = exportToSinglePage ? "Total view size " : "Total page size ";

		if (supports2x) {
			addInfo(MessageConstants.TOTAL_PAGE_SIZE, sizeMessage + getSizeFormattedValue(totalExportSize) + " / @2x " + getSizeFormattedValue(totalExportSize2x) + "");
		}
		else {
			addInfo(MessageConstants.TOTAL_PAGE_SIZE, sizeMessage + getSizeFormattedValue(totalExportSize));
		}
	}
  
  return true;
}



/**
 * Get a diff object
 * @param {String} expectedOutput 
 **/
function getDiffObject(artboard, expectedOutput, expectedCSSOutput, expectedScriptOutput, pageOutput) {
	var hasPrev = false;
	var hasDiff = false;
	var needsTitles = false;
	var diffOutput = "";
	var pageDiff = null;
	var cssDiff = null;
	var scriptDiff = null;


	// get diff - this can take a while (up to 100x longer to export)
	// compare html output
	if (expectedOutput!=null) {
		if (expectedOutput!=pageOutput) {
			pageDiff = getDiff(expectedOutput, pageOutput)
			addError("HTML Mismatch", "The markup from artboard, '" + artboard.name + "' doesn't match the expected output");
		}
	}

	// compare css output
	if (expectedCSSOutput!=null) {
		if (expectedCSSOutput!=globalArtboardModel.cssOutput) {
			cssDiff = getDiff(expectedCSSOutput, globalArtboardModel.cssOutput)
			addError("CSS Mismatch", "The CSS from artboard, '" + artboard.name + "' doesn't match the expected output");
		}
	}

	// compare script output
	if (expectedScriptOutput!=null) {
		if (expectedScriptOutput!=globalArtboardModel.scriptOutput) {
			scriptDiff = getDiff(expectedScriptOutput, globalArtboardModel.scriptOutput);
			addError("Script Mismatch", "The script from artboard, '" + artboard.name + "' doesn't match the expected output");
		}
	}

	if ([pageDiff,cssDiff,scriptDiff].filter(v => v!=null).length >= 2 || scriptDiff) {
		needsTitles = true;
	}

	// assemble a page that shows diffs
	if (pageDiff!=null) {
		if (needsTitles) {
			diffOutput += "<div class='title'>" + globalArtboardModel.getFilename() + "</div>";
		}

		hasDiff = true;
		hasPrev = true;
	  	diffOutput += pageDiff.prettyDiff;
	}

	if (cssDiff!=null) {
		if (needsTitles) {
			if (hasPrev) diffOutput += "";
			diffOutput += getTag("div", {class:"title"}, true, globalArtboardModel.getStylesheetFilename(), null, false);
		}

		hasDiff = true;
	  	hasPrev = true;
	  	diffOutput += cssDiff.prettyDiff;
	}

	if (scriptDiff!=null) {
		if (needsTitles) {
			if (hasPrev) diffOutput += "";
			diffOutput += "<div class='title'>" + globalArtboardModel.getJavaScriptFilename() + "</div>";
		}
		
		hasDiff = true;
		diffOutput += scriptDiff.prettyDiff;
	}

	var diff = new DiffObject();
	diff.hasDiff = hasDiff;
	diff.cssDiff = cssDiff;
	diff.pageDiff = pageDiff;
	diff.scriptDiff = scriptDiff;
	diff.diffOutput = diffOutput;

	return diff;
}

/**
 * Get a list of differences between two strings
 * @param {String} expectedOutput 
 * @param {String} actualOutput 
 * @param {Boolean} lineMode 
 **/
function getDiff(expectedOutput, actualOutput, lineMode = false) {
	var dmp = new diff_match_patch();
	dmp.Diff_Timeout = 0;
	dmp.Patch_Margin = 4;
	dmp.Match_Distance = 1000;
	dmp.Diff_EditCost = 4;
	dmp.Patch_DeleteThreshold = 0.5;
	// At what point is no match declared (0.0 = perfection, 1.0 = very loose).
	dmp.Match_Threshold = 0.5;
	// No warmup loop since it risks triggering an 'unresponsive script' dialog
	// in client-side JavaScript
	var start = getTime();
	var result;
	var diffHTML;

	if (lineMode) {
		result = dmp.diff_lineMode_(expectedOutput, actualOutput, false);
		diffHTML = getPrettyHtmlDiff(result);
	}
	else {
		result = dmp.diff_main(expectedOutput, actualOutput, false);
		diffHTML = getPrettyHtmlDiff(result);
	}
	
	var end = getTime();
	var lines = [];
	var row = 1;
	var column = 0;
	var firstResult = result && result[0] ? result[0] : null;
	var operation = firstResult ? firstResult[0] : null;
	var data = firstResult ? firstResult[1] : null;
	var lastLine = "";
	
	if (data && data.indexOf(XDConstants.LINE_BREAK)!=-1) {
		lines = data.split(XDConstants.LINE_BREAK);
		lastLine = lines[lines.length-1];
		row = lines.length;
		column = lastLine.length;
	}

	var diff = new Diff(result, diffHTML, lines);
	diff.lastLine = lastLine;
	diff.row = row;
	diff.column = column;

	return diff;
}

/**
 * Convert a diff array into a pretty HTML report.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @return {String} HTML representation.
 **/
function getPrettyHtmlDiff(diffs) {
	var DIFF_DELETE = -1;
	var DIFF_INSERT = 1;
	var DIFF_EQUAL = 0;
	var html = [];
	var pattern_amp = /&/g;
	var pattern_lt = /</g;
	var pattern_gt = />/g;
	var pattern_para = /\n/g;
	var paragraph = '<br>'; //'&para;<br>';
	paragraph = '\n'; //'&para;<br>';
	
	for (var x = 0; x < diffs.length; x++) {
	  var op = diffs[x][0];    // Operation (insert, delete, equal)
	  var data = diffs[x][1];  // Text of change.
	  var text = data.replace(pattern_amp, '&amp;').replace(pattern_lt, '&lt;')
			.replace(pattern_gt, '&gt;').replace(pattern_para, paragraph);
	  switch (op) {
		 case DIFF_INSERT:
			html[x] = '<ins>' + text + '</ins>';
			break;
		 case DIFF_DELETE:
			html[x] = '<del>' + text + '</del>';
			break;
		 case DIFF_EQUAL:
			html[x] = '<span>' + text + '</span>';
			break;
	  }
	}
	return html.join('');
 };

/**
 * Get Export Files
 * @param {ArtboardModel} selectedArtboardModel 
 **/
function getExportFiles(selectedArtboardModel) {
	let files = selectedArtboardModel.files;
	var file = null;

	file = new FileInfo();
	file.content = selectedArtboardModel.pageOutput;
	file.name = selectedArtboardModel.filename;
	file.fileName = selectedArtboardModel.getFilename();
	file.diffFileName = selectedArtboardModel.getDiffFilename();
	file.fileExtension = selectedArtboardModel.extension;
	
	files.push(file);
	
	if (selectedArtboardModel.externalStylesheet) {
	  file = new FileInfo();
	  file.name = selectedArtboardModel.filename;
	  file.content = selectedArtboardModel.css;
	  file.fileName = selectedArtboardModel.getStylesheetFilename();
	  file.fileExtension = "css";
	  
	  files.push(file);
	}
	
	if (selectedArtboardModel.externalScript) {
	  file = new FileInfo();
	  //file.content = selectedArtboardModel.script;
	  file.content = globalModel.pageControlsScript;
	  file.name = selectedArtboardModel.filename;
	  file.fileName = selectedArtboardModel.getJavaScriptFilename();
	  file.fileExtension = "js";
	  
	  files.push(file);
	}

	return files;
}

/**
 * Shows all or selected artboards
 **/
function showSelectedArtboardsInMessages() {
	var title = "Selected Artboards";
	var value = null;
	
	if (globalModel.exportList==XDConstants.SELECTED_ARTBOARDS) {
		value = getArtboardNamesAsString(globalModel.exportArtboardsList, "\n");
	}
	else if (globalModel.exportList==XDConstants.ALL_ARTBOARDS) {
		value = getArtboardNamesAsString(globalModel.allArtboards, "\n");
	}
	else {
		value = globalModel.selectedArtboard.name;
	}

	if (value) {
		showMoreRoomView(title, null, null, value, "Artboards to be exported", null, null, false, false, false, true);
	}
}

/**
 * Shows the message view with title and value and description
 * @param {String} title 
 * @param {String} value 
 * @param {String} description 
 **/
function showMessagesView(title = null, value = null, description = "", callback = null, ...args) {

	if (title==null) {
		title = "Messages";
	}

	if (value==null) {
		value = mainForm.warningsTextarea.value;
	}

	showMoreRoomView(title, null, null, value, description, null, null, false, false, false, true, callback, ...args);
}

/**
 * Shows the main view or the element view after showing an alternate view
 **/
function showMainFormOrElementView() {
	var form = null;
	var dialog = null;

	try {

		if (globalModel.showingElementDialog) {
			form = elementForm.mainForm;
			dialog = elementForm.mainDialog;
		}
		else {
			form = mainForm.mainForm;
			dialog = mainForm.mainDialog;
		}

		dialog.removeChild(mainForm.messagesForm);
		dialog.appendChild(form);
	}
	catch(error) {
		log(error.stack);
	}
}

/**
 * Show a view with a large text area to show or enter more details
 * @param {String} title 
 * @param {Object} object 
 * @param {String} property 
 * @param {String} value 
 * @param {String} description 
 * @param {String} defaultValue 
 * @param {Boolean} nullIfDefault 
 * @param {Boolean} cancelButton 
 * @param {Boolean} okButton 
 * @param {Boolean} backButton 
 * @param {Function} callback 
 * @param  {...any} args 
 **/
function showMoreRoomView(title, object = null, property = null, value = "", description = null, defaultValue = null, editLabel = null, nullIfDefault = true, 
										cancelButton = true, okButton = true, backButton = false, callback = null, ...args) {
 
	if (globalModel.showingElementDialog) {

		if (globalModel.showingPanel) {
			moreRoomForm.referringView = elementForm.mainForm;
			moreRoomForm.referringDialog = panelNode;
		}
		else {
			moreRoomForm.referringView = elementForm.mainForm;
			moreRoomForm.referringDialog = elementForm.mainDialog;
		}
	}
	else {
		moreRoomForm.referringView = mainForm.mainForm;
		moreRoomForm.referringDialog = mainForm.mainDialog;
	}
	
	moreRoomForm.showView();

	moreRoomForm.object = object;
	moreRoomForm.property = property;
	moreRoomForm.value = value;
	moreRoomForm.title = title;
	moreRoomForm.defaultValue = defaultValue;
	moreRoomForm.description = description;
	moreRoomForm.nullIfDefault = nullIfDefault;
	moreRoomForm.callback = callback;
	moreRoomForm.parameters = args;
	moreRoomForm.editLabel = editLabel;
	moreRoomForm.showCancelButton(cancelButton);
	moreRoomForm.showOKButton(okButton);
	moreRoomForm.showBackButton(backButton);
	moreRoomForm.showDefaultButton(defaultValue!=null);
	moreRoomForm.showResetButton(nullIfDefault && (defaultValue==null|| defaultValue==""));

	moreRoomForm.setTitle(title);

	if (value=="" || value==null) {

		if (defaultValue) {
			moreRoomForm.setTextarea(defaultValue);
		}
	}
	else {
		moreRoomForm.setTextarea(value);
	}

	moreRoomForm.setDescription(description);

	// support for ace editor when window.getComputedStyle and window.focus are available

	return;
	try {

		var editor = window.ace.edit("messagesTextarea");
		editor.setTheme("ace/theme/monokai");
		editor.session.setMode("ace/mode/javascript");
		log("editor", editor)
	}
	catch(e) {
		log("error", e)
	}
}

/**
 * Show a view with a large text area to show or enter more details
 * @param {Object} event 
 * @param {Function} callback 
 * @param  {...any} args 
 **/
function showHostForm(event, callback = null, ...args) {
 
	if (globalModel.showingElementDialog) {

		if (globalModel.showingPanel) {
			hostForm.referringView = elementForm.mainForm;
			hostForm.referringDialog = panelNode;
		}
		else {
			hostForm.referringView = elementForm.mainForm;
			hostForm.referringDialog = elementForm.mainDialog;
		}
	}
	else {
		hostForm.referringView = mainForm.mainForm;
		hostForm.referringDialog = mainForm.mainDialog;
	}
	
	hostForm.showView();

	if (globalArtboardModel.customDomain) {
		hostForm.customDomainTypeRadio.checked = true;
	}
	else {
		hostForm.defaultDomainTypeRadio.checked = true;
	}

	if (hostForm.usernameInput.value=="") {
		hostForm.usernameInput.value = globalModel.hostField1;
	}

	if (hostForm.passwordInput.value=="") {
		//hostForm.passwordInput.value = globalModel.hostField2;
	}

	if (hostForm.urlInput.value=="") {
		hostForm.urlInput.value = globalModel.hostField3;
	}

	if (hostForm.endPointInput.value=="") {
		hostForm.endPointInput.value = globalModel.hostField4;
	}

	if (hostForm.uploadOnExportCheckbox) {
		hostForm.uploadOnExportCheckbox.checked = globalModel.selectedArtboardModel.uploadOnExport;
	}

	hostForm.callback = callback;

	updateDomainForm();

	var postID = globalModel.selectedArtboardModel.postLinkID;

	if (globalModel.userSite) {
		showLinkedArtboardForm(postID, globalModel.userSite);
	}
	else {
		showLinkedArtboardForm();
	}
}

function closeHostForm(...args) {
	var serverPath = hostForm.urlInput.value;
	var username = hostForm.usernameInput.value;
	var credential = hostForm.passwordInput.value;
	var endPoint = hostForm.endPointInput.value;

	globalModel.hostField1 = username;
	globalModel.hostField2 = credential;
	globalModel.hostField3 = serverPath;
	globalModel.hostField4 = endPoint;

	hostForm.resultsTextarea.innerHTML = "";

	savePreferences();

	updateArtboardModelAndSave();
}

/**
 * Get the artboard model if it already exists
 * @param {Artboard} artboard 
 **/
function getArtboardModel(artboard) {
  var b = debugModel.initializeGlobalModel;

  if (globalModel.artboardModels instanceof WeakMap) {
	 b && log("Cached artboard is WeakMap");

	 if (globalModel.artboardModels.has(artboard)) {
		b && log("Cached Artboard found");
		return globalModel.artboardModels.get(artboard);
	 }
  }
  else {
	 b && log("Cached artboard is object");
	 b && log("Cached artboard:" + artboard);
	 b && log("globalModel.cachedArtboardModels[artboard]:" + globalModel.artboardModels[artboard]);

	 if (globalModel.artboardModels[artboard.guid]) {
		b && log("Cached Artboard found");
		return globalModel.artboardModels[artboard.guid];
	 }
  }

  return null;
}

/**
 * Create and return an artboard model
 * @param {Artboard} artboard 
 * @returns {ArtboardModel}
 **/
function getArtboardModelInstance(artboard) {
	let artboardModel = createModel(artboard, 0, 0, true, true);
	return artboardModel;
}

/**
 * Determine selected artboard
 * @param {Artboard} alternativeArtboard 
 * @returns {Artboard}
 **/
function determineSelectedArtboard(alternativeArtboard = null) {
	const {selection} = require("scenegraph");
	var focusedArtboard = selection.focusedArtboard;
	var artboards = getAllArtboards();
	var globalArtboard = getGlobalArtboard();
	var selectedArtboard = null;
	var homeArtboard = interactions.homeArtboard;
	var numberOfArtboards = artboards.length;
	var useHomeArtboard = false;

	// if alternative is provided get that
	// otherwise get focused artboard
	// if focused is null then get home artboard
	// if no home artboard then get first artboard

	if (alternativeArtboard) {
		selectedArtboard = alternativeArtboard;
	}
	else if (globalArtboard) {
		selectedArtboard = globalArtboard;
	}
	else if (focusedArtboard) {
		selectedArtboard = focusedArtboard;
	}
	else if (homeArtboard && useHomeArtboard) {
		selectedArtboard = homeArtboard;
	}
	else if (numberOfArtboards>0) {
		selectedArtboard = artboards[0];
	}

	return selectedArtboard;
}

/**
 * Creates and returns a media query string
 * @param {Artboard} artboard 
 * @returns {String}
 **/
function getMediaQuery(artboard) {
  var b = debugModel.getMediaQuery;
  var artboardWidth = artboard.width;
  var widthIndex = globalModel.artboardWidths.indexOf(artboardWidth);
  var mediaQuery = "@media";
  var and = "and";
  var space = " ";
  var isWidestArtboard = widthIndex==globalModel.artboardWidthsCounts-1;
  var previousArtboardWidth = widthIndex!=0 ? globalModel.artboardWidths[widthIndex-1] : 0;
  var nextArtboardWidth = widthIndex+1!=globalModel.artboardWidthsCounts ? globalModel.artboardWidths[widthIndex+1] : 0;
  var isSlimmestArtboard = widthIndex==0;

  if (nextArtboardWidth===undefined) {
	  isWidestArtboard = true;
  }
  
  b && log("Get Media Query()");
  b && log("Artboard name: " + artboard.name);
  b && log("Is widest artboard: " + isWidestArtboard);
  b && log("Is slimmest artboard: " + isSlimmestArtboard);
  b && log("Artboard widths: " + globalModel.artboardWidths.join(","));
  b && log("Artboard index: " + widthIndex);
  b && log("Artboard width: " + artboardWidth);
  b && log("Previous Artboard width: " + previousArtboardWidth);
  b && log("Next Artboard width: " + nextArtboardWidth);
  
  // only one artboard
  if (isSlimmestArtboard && isWidestArtboard) {
	 b && log("Only one artboard");
	 mediaQuery += space + "(" + Styles.MIN_WIDTH + ": " + 0 + "px)";
  }
  else if (isWidestArtboard) {
	 b && log("Widest artboard");
	 mediaQuery += space + "(" + Styles.MIN_WIDTH + ": " + artboardWidth + "px)";
  }
  else if (isSlimmestArtboard) {
	 b && log("Slimmest artboard");
	 mediaQuery += space + "(" + Styles.MIN_WIDTH + ": " + 0 + "px)";
	 mediaQuery += space + and + space + "(" + Styles.MAX_WIDTH + ": " + (nextArtboardWidth-1) + "px)";
  }
  else {
	 b && log("Artboard is in the middle");
	 mediaQuery += space + "(" + Styles.MIN_WIDTH + ": " + artboardWidth + "px)";
	 mediaQuery += space + and + space + "(" + Styles.MAX_WIDTH + ": " + (nextArtboardWidth-1) + "px)";
  }
  
  b && log("Media query: " + mediaQuery);

  return mediaQuery;
}

// this may be duplicated - not necessary
function setArtboardID(artboardModel) {
	//artboardModel.id = getSanitizedIDName(artboardModel.name);
	//artboardModel.ids[artboardModel.id] = true;
	createUniqueItemName(artboardModel.artboard, artboardModel);
	//log("artboard ID:" + artboardModel.id);
}

/**
 * Show or get messages from the export process and optionally show in the message text area 
 * @param {Boolean} showInTextArea 
 * @param {String} pretext 
 */
async function showMessages(showInTextArea = false, pretext = "") {
	var b = debugModel.showWarnings;
	var warnings;
	var messages;
	var errors;
	var files;
	var renditions;
	var numberOfWarnings;
	var numberOfRenditions;
	var numberOfMessages;
	var numberOfErrors;
	var numberOfFiles;
	var exportList = globalModel.exportList;
	var exportMultipleArtboards = globalModel.exportMultipleArtboards;
  
	if (showInTextArea) {
		showMainUIMessageControls();
	}
  
  if (exportMultipleArtboards) {
		b && log("Messages from global model");
		messages = globalModel.messages.slice(0);
		warnings = globalModel.warnings.slice(0);
		errors = globalModel.errors.slice(0);
		files = globalModel.files.slice(0);
		renditions = globalModel.renditions.slice(0);
		renditions = globalModel.exportedRenditions.slice(0);
	}
	else {
		b && log("Messages from artboard model");
		messages = globalArtboardModel.messages.slice(0);
		warnings = globalArtboardModel.warnings.slice(0);
		errors = globalArtboardModel.errors.slice(0);
		files = globalArtboardModel.files.slice(0);
		renditions = globalArtboardModel.renditions.slice(0);
		renditions = globalArtboardModel.exportedRenditions.slice(0);
  }

  numberOfMessages = messages.length;
  numberOfWarnings = warnings.length;
  numberOfErrors = errors.length;
  numberOfFiles = files.length;
  numberOfRenditions = renditions.length;
  
  b && log("Messages:" + numberOfMessages + " Warnings:" + numberOfWarnings + " Errors:" + numberOfErrors + " Files:" + numberOfFiles + " Renditions:" + numberOfRenditions);

  var totalNumberOfMessages = numberOfWarnings + numberOfMessages + numberOfErrors + numberOfFiles + numberOfRenditions;
  totalNumberOfMessages = numberOfWarnings + numberOfErrors + numberOfFiles + numberOfRenditions;

  let totalMessage = totalNumberOfMessages>0 && pretext!="" ? pretext + "\n" : pretext;

  for (let i=0;i<numberOfErrors;i++) {
		if (i==0) {
			totalMessage += "Errors:\n";
		}

		let error = i+1 + ". " + errors[i];
		if (i!=0) totalMessage += "\n";
		totalMessage += error.toString();
		b && log("Error:" + error.toString());
  }
	
  for (let i=0;i<numberOfMessages;i++) {
		if (i==0) {
			if (numberOfErrors) totalMessage += "\n\n";
			totalMessage += "Messages:\n";
		}

		let message = i+1 + ". " + messages[i];
		if (i!=0) totalMessage += "\n";
		totalMessage += message.toString();
		b && log("Message:" + message.toString());
	}

  for (let i=0;i<numberOfWarnings;i++) {
		if (i==0) {
			if (numberOfMessages || numberOfErrors) totalMessage += "\n\n";
			totalMessage += "Warnings:\n";
		}

		let warning = i+1 + ". " + warnings[i];
		if (i!=0) totalMessage += "\n";
		totalMessage += warning.toString();
		b && log("Warning:" + warning.toString());
	}


  if (totalNumberOfMessages) {

	 if (showInTextArea) {
		b && log("Showing in text area");
		mainForm.warningsTextarea.value = totalMessage;
		mainForm.warningsTextarea.innerHTML = totalMessage;
		mainForm.messagesLabel.textContent = " Messages (" + totalNumberOfMessages + ") ";
	 }
	 else {
		//let alert = showAlertDialog(totalMessage, "Export complete with warnings")
		b && log("Export complete with warnings:" + totalMessage);
	 }
  }
  else {
	 b && log("Messages: none");

	 if (showInTextArea) {
		if (pretext!="") {
		  b && log("Adding pretext:" + pretext)
		}
		mainForm.warningsTextarea.value = pretext;
		mainForm.warningsTextarea.innerHTML = pretext;
		mainForm.messagesLabel.textContent = "Messages:";
	 }
	 else {
		b && log("Export complete:" + totalMessage);
		//let alert = showAlertDialog(totalMessage, "Export complete!")
	 }
  }

  return totalMessage;
}

/**
 * Show message in secondary form
 * @param {String} message 
 * @param {Boolean} showInTextArea 
 **/
function showMessage(message, showInTextArea = true) {
  var b = debugModel.showWarnings && log("Showing messages");

  if (showInTextArea) {
	 b && log("Showing in text area");
	 mainForm.warningsTextarea.value = message;
	 mainForm.warningsTextarea.innerHTML = message;
	 mainForm.messagesLabel.textContent = "Messages (1):";
  }
  else {
	 //let alert = showAlertDialog(totalMessage, "Export complete with warnings")
	 log("Message:" + message);
  }

  if (showInTextArea) {
	 showMainUIMessageControls();
  }
}

/**
 * Show panel export message
 * @param {Boolean} noArtboardSelected 
 * @param {Boolean} autoHide 
 */
function showPanelExportedLabel(noArtboardSelected = false, autoHide = false) {

	if (elementForm.exportMessageLabel) {
		var message = "";
		var date = new Date();
		var time = date.toTimeString(); // 16:31:23 GMT-0400 (EDT)
		time = date.toLocaleTimeString(); // 4:33:15 PM
		var selectedArtboardModel = globalModel.selectedArtboardModel;
		var exportList = selectedArtboardModel.exportList;
		var label = globalModel.selectedArtboardModel.name;
		var exportRange = selectedArtboardModel.exportArtboardsRange;
		var exportArtboardList = selectedArtboardModel.exportArtboardList;
		var exportAllArtboards = exportList==XDConstants.ALL_ARTBOARDS;
		var exportMultipleArtboards = exportList==XDConstants.SELECTED_ARTBOARDS || exportList==XDConstants.ALL_ARTBOARDS;
		var numberOfArtboards = globalModel.numberOfArtboards;
		var numberOfUserArtboards = globalModel.userSelectedArtboards;

		if (exportMultipleArtboards && exportAllArtboards) {
			message = "Exported '" + label + "' (" + numberOfArtboards + ") (" + globalModel.exportDuration + "ms)";
		}
		else if (exportMultipleArtboards && exportRange) {
			var exportRangeArray = exportRange.split(",");
			message = "Exported '" + label + "' (" + exportRangeArray.length + ") (" + globalModel.exportDuration + "ms)";
		}
		else {
			message = "Exported '" + label + "' (" + globalModel.exportDuration + "ms)";
		}

		if (noArtboardSelected) {
			message = "Select an artboard"
		}

		showPanelMessage(message, true, true);
	}
}

/**
 * Show message in the panel.
 * @param {String} message 
 * @param {Boolean} autoHide 
 **/
function showPanelMessage(message, autoHide = false, hideLinks = false) {
	if (hideLinks) {
		updateHREFLinks();
	}

	if (elementForm.exportMessageLabel) {

		showFlexElement(elementForm.exportMessageRow);
		showBlockElement(elementForm.exportMessageRowBorder);

		elementForm.exportMessageLabel.textContent = message;
		
		if (elementForm.panelExportMessageTimeout != null) clearTimeout(elementForm.panelExportMessageTimeout);
		
		elementForm.panelExportMessageTimeout = setTimeout(() => {
			elementForm.exportMessageLabel.textContent = "";
			hideElement(elementForm.exportErrorsIcon);
			
		}, globalModel.quickExportNotificationDuration);
	}
}

/**
 * 
 * @param {Selection} selection Selection
 * @param {RootNode} documentRoot DocumentRoot
 **/
async function getTemplate(selection, documentRoot) {
  var b = debugModel.browseForFolder && log("Get Template()");
  b && log("Loading template from file system");

  try {
	 const pluginFolder = await fileSystem.getPluginFolder();
	 const entries = await pluginFolder.getEntries();
	 
	 const files = entries.filter(entry => entry.name.indexOf('template.html') >= 0);
	 
	 if (files.length && files[0].isFile) {
		var file = files[0];
		var template = await file.read();
		globalArtboardModel.template = template;
	 }
	 
  }
  catch (error) {
	 log("Stack:" + error.stack);
	 addError("Template Error", error);
  }
}

/**
 * Get code for page navigation when exporting to single page
 **/
async function getTagNamesList() {
	var b = debugModel.getTagNamesList;
	b && log("Loading tag names");
	var filePath = "addons";
	var filename = "tagnames.txt";
	var folder;

	try {
		const pluginFolder = await fileSystem.getPluginFolder();
		const folder = await pluginFolder.getEntry(filePath);
		var entryContent = "";
		var entry = null;
		var tagNames = [];

		if (folder.isFolder) {
			entry = await folder.getEntry(filename);
			
			if (entry) {
				entryContent = await entry.read();

				b && log("navigation text:" + getShortString(entryContent, 200));

				tagNames = entryContent.split(/\n/);
				globalModel.tagNames = tagNames;
			}
		}
	}
	catch (error) {
		//log("Stack:" + error.stack);
	}
}

/**
 * Get code for page navigation when exporting to single page
 **/
async function getSinglePageControls() {
  var b = debugModel.getPageControls && log("Get Single Page Controls()");
  b && log("Loading single page controls from file system");
  var filePath = "code";
  var filename = "navigation.html";
  var folder;

  try {
	 const pluginFolder = await fileSystem.getPluginFolder();
	 const folder = await pluginFolder.getEntry(filePath);
	 var navigation;
	 var entry;

	 if (folder.isFolder) {
		entry = await folder.getEntry(filename);
		navigation = await entry.read();

		b && log("navigation text:" + getShortString(navigation, 200));
		globalModel.navigationControls = navigation;
	 }
	 
  }
  catch (error) {
	 log("Stack:" + error.stack);
	 addError("Navigation controls error", error);
  }
}

/**
 * Get javascript for artboard features
 **/
async function getPageScript() {
	var b = debugModel.getPageScript && log("Get Page Script()");
	b && log("Loading page script from file system");
	var filePath = "code";
	var filename = "view.js";
  
	try {
	   const pluginFolder = await fileSystem.getPluginFolder();
	   const folder = await pluginFolder.getEntry(filePath);
	   var script;
	   var entry;
  
	   if (folder.isFolder) {
		  entry = await folder.getEntry(filename);
		  script = await entry.read();

		  b && log("script text:" + getShortString(script, 200));
		  globalModel.pageControlsScript = script;
	   }
	   
	}
	catch (error) {
	   log("Stack:" + error.stack);
	   addError("Navigation controls error", error);
	}
}

/**
* Get code for scale controls
**/
async function getScaleControls() {
  var b = debugModel.getPageControls && log("Get Zoom Controls()");
  b && log("Loading zoom controls from file system");
  var filePath = "code";
  var filename = "zoomslider.html";

  try {
	 const pluginFolder = await fileSystem.getPluginFolder();
	 const folder = await pluginFolder.getEntry(filePath);
	 var slider;
	 var entry;

	 if (folder.isFolder) {
		entry = await folder.getEntry(filename);
		slider = await entry.read();

		b && log("zoom slider text:" + getShortString(slider, 200));
		globalModel.zoomSliderControls = slider;
	 }
	 
  }
  catch (error) {
	 log("Stack:" + error.stack);
	 addError("Scale slider controls error", error);
  }
}

/**
* Get application descriptor
**/
async function getApplicationDescriptor() {
	var b = debugModel.getApplicationDescriptor;
	b && log("Loading manifest from file system");
	var filePath = "";
	var filename = "manifest.json";
 
	try {
	  const pluginFolder = await fileSystem.getPluginFolder();
	  const folder = await pluginFolder.getEntry(filePath);
	  var value;
	  var entry;
 
	  if (folder.isFolder) {
		 entry = await folder.getEntry(filename);
		 value = await entry.read();
 
		 b && log("version info text:" + getShortString(value, 300));
		 var object = JSON.parse(value);
		 globalModel.applicationDescriptor = object;
		 globalModel.version = globalModel.applicationDescriptor.version;
	  }
	  
	}
	catch (error) {
	  log("Stack:" + error.stack);
	  addError("Scale slider controls error", error);
	}
 }

/**
 * Update the location the open buttons reference
 * @param {FileInfo} file 
 * @param {ArtboardModel} model 
 **/
function updateFileLocation(file, model) {
	var b = debugModel.updateFileLocation;
	let path = file.nativePath;
	var url = file.url;
	var filePrefix = path && path.indexOf("/")==0 ? "file://" : "file://";
	var hasHostPrefix = model.server ? true : false;
	var hostPrefix = hasHostPrefix ? model.server : "http://localhost/";
	var redirectHostPrefix = GlobalModel.redirectHost;
	var isExportArtboard = model.filename=="-none";

	b && log("Update file location");
	b && log("Model name:", model.filename)
	b && log("Native path: " + path);
	b && log("URL: " + url);
	
	// if export artboard do not update the URLs
	if (isExportArtboard) {
		path = model.exportFolder;
		return;
	}

	//URL:blob:/blob-1/Artboard___2.html
  
	lastFileLocation = path;
	
	GlobalModel.lastFileLocation = path;
	GlobalModel.lastURLLocation = filePrefix + path;
	GlobalModel.lastRURLLocation = redirectHostPrefix + filePrefix + path;
	GlobalModel.lastRURLLocationEnc = redirectHostPrefix + enurl(path);
	GlobalModel.lastFilename = file.getFilename();
	GlobalModel.lastHostPath = hostPrefix + file.getFilename();
	GlobalModel.lastFolderPath = filePrefix + file.folder;
	GlobalModel.lastDiffLocation = file.diffHTML ? filePrefix + file.folder + file.diffFileName : null;
	GlobalModel.hasVerifyCheck = file.hasVerifyCheck;
	GlobalModel.hasHost = hasHostPrefix;

	b && log("GlobalModel.lastFilename: " + GlobalModel.lastFilename);
	b && log("GlobalModel.lastFileLocation: " + GlobalModel.lastFileLocation);
	b && log("GlobalModel.lastDiffLocation: " + GlobalModel.lastDiffLocation);
	b && log("GlobalModel.lastURLLocation: " + GlobalModel.lastURLLocation);
	b && log("GlobalModel.lastRURLLocation: " + GlobalModel.lastRURLLocation);
	b && log("GlobalModel.lastRURLLocationEnc: " + GlobalModel.lastRURLLocationEnc);
	b && log("GlobalModel.lastHostPath: " + GlobalModel.lastHostPath);
	b && log("GlobalModel.lastFolderPath: " + GlobalModel.lastFolderPath);

	b && log("Setting open location link to: " + GlobalModel.lastURLLocation);
	globalModel.getLocationObject();
	updateHREFLinks();
}

/**
 * Use a non plain text value
 * @param {String} value 
 **/
function enurl(value) {
	var time = 0;
	var newValue = "";
	var timeValue = "";
	time = getTime();
	timeValue = time + "";
	time = Math.max(1, parseInt(timeValue.charAt(timeValue.length-1)));
	var char = "";
	var charCode = 0;
	var charCodeT = 0;

	if (value==null) {
		return "";
	}

	for (var i = 0; i < value.length; i++) {
		char = value[i];
		charCode = value.charCodeAt(i);
		charCodeT = charCode + time;
		newValue += String.fromCharCode(charCodeT);
	}

	return time + encodeURIComponent(newValue);
}

function deurl(value) {
	value = value.split("l=")[1];
	var time = value.charAt(0);
	var newValue = "";
	var char = "";
	var charCode = 0;
	var charCodeT = 0;

	value = decodeURIComponent(value.substr(1));

	for (var i = 0; i < value.length; i++) {
		char = value[i];
		charCode = value.charCodeAt(i);
		charCodeT = charCode - time;
		newValue += String.fromCharCode(charCodeT);
	}

	return newValue;
}

/**
 * Sets the tool tip on the form element. Setting tooltip via title style bc not working in other tests
 * @param {HTMLElement} element 
 * @param {String} value 
 **/
function setTitleViaStyle(element, value) {
	element.style.title = value;
	element.setAttributeNS(null, "title", value);
}

/**
 * Clears the tool tip on the form element. 
 * @param {HTMLElement} element 
 **/
function clearTitleViaStyle(element) {
	element.style.title = null;
	element.setAttributeNS(null, "title", null);
}

/**
 * Update the link "buttons" after export
 * There is a sortof related function. See hideLinks()
 **/
function updateHREFLinks() {
	var attributes = ["title", "href"];
	var supportsFile = applicationVersion<24;
	var numberOfErrors = globalArtboardModel.errors.slice(0).length;
	var serverPath = hostForm.urlInput.value;
	var username = hostForm.usernameInput.value;
	var credential = hostForm.passwordInput.value;

	for (let index = 0; index < attributes.length; index++) {
		const attribute = attributes[index];
		
		// update notification form
		if (notificationForm) {
			notificationForm.openFolderLink.setAttribute(attribute, GlobalModel.lastFolderPath);
			notificationForm.openURLLink.setAttribute(attribute, GlobalModel.lastURLLocation);
			notificationForm.openRURLLink.setAttribute(attribute, GlobalModel.lastRURLLocationEnc);
			notificationForm.openDiffLink.setAttribute(attribute, GlobalModel.lastDiffLocation);
			notificationForm.openHostLink.setAttribute(attribute, GlobalModel.lastHostPath);

			if (GlobalModel.lastDiffLocation) {
				showBlockElement(notificationForm.openDiffLink);
				hideElement(notificationForm.verifyDiffIcon);
			}
			else {
				hideElement(notificationForm.openDiffLink);

				// if artboard model has expected output to verify then show verify icon
				if (GlobalModel.hasVerifyCheck) {
					showBlockElement(notificationForm.verifyDiffIcon);
				}
				else {
					hideElement(notificationForm.verifyDiffIcon);
				}
			}

			if (numberOfErrors>0) {
				showBlockElement(notificationForm.exportErrorsIcon);
			}
			else {
				hideElement(notificationForm.exportErrorsIcon);
			}

			if (GlobalModel.hasHost) {
				showBlockElement(notificationForm.openHostLink);
			}
			else {
				hideElement(notificationForm.openHostLink);
			}

			if (GlobalModel.isMac && supportsFile) {
				if (GlobalModel.supportOpenFolders) {
					showBlockElement(notificationForm.openFolderLink);
				}
				else {
					hideElement(notificationForm.openFolderLink);
				}

				showBlockElement(notificationForm.openURLLink);
				hideElement(notificationForm.openRURLLink);
			}
			else {
				showBlockElement(notificationForm.openRURLLink);
				hideElement(notificationForm.openURLLink);
				hideElement(notificationForm.openFolderLink);
			}

		}
		
		// update main export dialog
		if (mainForm && mainForm.openURLLink) {
			mainForm.copyURLLink.setAttribute(attribute, GlobalModel.lastURLLocation);
			mainForm.openURLLink.setAttribute(attribute, GlobalModel.lastURLLocation);
			mainForm.openRURLLink.setAttribute(attribute, GlobalModel.lastRURLLocationEnc);
			mainForm.openHostLink.setAttribute(attribute, GlobalModel.lastHostPath);
			mainForm.openFolderLink.setAttribute(attribute, GlobalModel.lastFolderPath);
			mainForm.diffLink.setAttribute(attribute, GlobalModel.lastDiffLocation);


			if (numberOfErrors>0) {
				showBlockElement(mainForm.exportErrorsIcon);
			}
			else {
				hideElement(mainForm.exportErrorsIcon);
			}

			showBlockElements(mainForm.messagesLabel);

			if (GlobalModel.hasHost) {
				showBlockElements(mainForm.openHostLink);
			}
			else {
				hideElement(mainForm.openHostLink);
			}

			// windows does not open folder or file urls so hide links
			if (GlobalModel.isMac && supportsFile) {
				if (GlobalModel.supportOpenFolders) {
					showBlockElements(mainForm.openFolderLink);
				}
				else {
					hideElement(mainForm.openFolderLink);
				}

				hideElements(mainForm.openRURLLink);
				showBlockElements(mainForm.openURLLink, mainForm.copyURLLink);
			}
			else {
				hideElements(mainForm.openFolderLink, mainForm.openURLLink);
				showBlockElements(mainForm.copyURLLink, mainForm.openRURLLink);
			}

			if (username && credential && serverPath) {
				showBlockElement(mainForm.uploadLink);
			}
			else {
				hideElements(mainForm.uploadLink);
			}
		}

		// update element options form
		if (elementForm && elementForm.openURLLink) {
			elementForm.openURLLink.setAttribute(attribute, GlobalModel.lastURLLocation);
			elementForm.openRURLLink.setAttribute(attribute, GlobalModel.lastRURLLocationEnc);
			elementForm.diffLink.setAttribute(attribute, GlobalModel.lastDiffLocation);
			elementForm.openHostLink.setAttribute(attribute, GlobalModel.lastHostPath);
			elementForm.openFolderLink.setAttribute(attribute, GlobalModel.lastFolderPath);

			if (numberOfErrors>0) {
				showBlockElement(elementForm.exportErrorsIcon);
			}
			else {
				hideElement(elementForm.exportErrorsIcon);
			}

			if (GlobalModel.hasHost) {
				showBlockElement(elementForm.openHostLink);
			}
			else {
				hideElement(elementForm.openHostLink);
			}

			if (GlobalModel.lastDiffLocation) {
				showBlockElement(elementForm.diffLink);
				hideElement(elementForm.verifyDiffIcon);
			}
			else {
				hideElement(elementForm.diffLink);
				
				// if artboard model has expected output to verify then show verify icon
				if (GlobalModel.hasVerifyCheck) {
					showBlockElement(elementForm.verifyDiffIcon);
				}
				else {
					hideElement(elementForm.verifyDiffIcon);
				}
			}

			if (GlobalModel.isMac && supportsFile) {
				if (GlobalModel.supportOpenFolders) {
					showBlockElement(elementForm.openFolderLink);
				}
				else {
					hideElement(elementForm.openFolderLink);
				}
				showBlockElement(elementForm.openURLLink);
				hideElement(elementForm.openRURLLink);
			}
			else {
				hideElement(elementForm.openFolderLink);
				hideElement(elementForm.openURLLink);
				showBlockElement(elementForm.openRURLLink);
			}

			if (GlobalModel.lastURLLocation) {
				// not export yet but showing panel message
				showBlockElement(elementForm.copyURLLink);
			}
			else {
				hideElement(elementForm.openFolderLink);
				hideElement(elementForm.openURLLink);
				hideElement(elementForm.openRURLLink);
				hideElement(elementForm.copyURLLink);
			}

			setTitleViaStyle(elementForm.copyURLLink, "Click to copy URL to clipboard\nShift+click to copy folder path to clipboard\n\nFile exported to \"" + GlobalModel.lastURLLocation + "\"");
		}
	}

	var localhost = "Localhost link at " + GlobalModel.lastHostPath;
	localhost += " (this is an artificial link to http://localhost plus file name - must have a server already setup - verify export directory)";

	setTitleViaStyle(mainForm.openHostLink, localhost);
	setTitleViaStyle(mainForm.copyURLLink, "File exported to \"" + GlobalModel.lastURLLocation + "\" Copy to clipboard");
	setTitleViaStyle(mainForm.openURLLink, "File exported to \"" + GlobalModel.lastURLLocation + "\"");
	setTitleViaStyle(mainForm.openRURLLink, "Redirect back to \"" + GlobalModel.lastURLLocation + "\" (for Windows http hyperlink limitation)");
	setTitleViaStyle(mainForm.openFolderLink, "Files were exported to the folder \"" + GlobalModel.lastFolderPath+ "\"");
	
	if (GlobalModel.lastDiffLocation==null) {
		setTitleViaStyle(mainForm.diffLink, "No diff file");
	}
	else {
		setTitleViaStyle(mainForm.diffLink, "Diff file exported to \"" + GlobalModel.lastDiffLocation + "\"");
	}

	//mainForm.submitButton.setAttribute("title", "Exported to " + GlobalModel.lastURLLocation);
}

/**
 * Hide the links
 * See UpdateHREFlinks()
 **/
function hideLinks() {
	var display = Styles.NONE;

	try {
		hideElements(mainForm.messagesLabel, mainForm.copyURLLink, mainForm.openFolderLink, 
			mainForm.openHostLink, mainForm.openURLLink, mainForm.openRURLLink, mainForm.uploadLink, 
			mainForm.exportErrorsIcon, mainForm.diffLink, mainForm.verifyDiffIcon);

	}
	catch(error) {
		log(error)
	}
}

/**
 * Replace tokens in page template
 * @param {String} template
 * @param {ArtboardModel} artboardModel
 * @param {Boolean} replaceScripts
 **/
function replacePageTokens(template, artboardModel, replaceScripts = false) {
	var b = debugModel.replaceTokens;
	var pageOutput = "";
	var exportVersion = globalModel.version + "";
	var title = artboardModel.getPageTitle();

	exportVersion = globalModel.applicationDescriptor.version + "";
	
	// replace generator
	b && log("Template: " + template);
	
	b && log("Replacing generator: " + getShortString(artboardModel.generator, 10));
	pageOutput = replaceGeneratorToken(template, artboardModel.generator);

	b && log("Export version: " + getShortString(exportVersion));
	pageOutput = replaceGeneratorVersionsToken(pageOutput, exportVersion);

	// replace date values
	pageOutput = replaceDatesToken(pageOutput);

	// replace title
	b && log("Replacing title: " + getShortString(title, 8));
	pageOutput = replacePageTitleToken(pageOutput, title);
	
	// replace scripts
	//b && log("Replacing script: " + getShortString(artboardModel.scripts.join("")));
	//pageOutput = replaceScriptsToken(pageOutput, artboardModel.scripts);
	
	// replace styles
	b && log("Replacing styles: " + getShortString(artboardModel.css));
	if (artboardModel.externalStylesheet) {
		var stylesheetPath = artboardModel.getStylesheetFullPath();
		b && log("Writing external css link");

		// create link to stylesheet
		var stylesheetLinks = getExternalStylesheetLink(stylesheetPath, globalModel.stylesheetId);
		
		pageOutput = replaceStylesToken(pageOutput, stylesheetLinks, artboardModel.css);
	}
	else {
		if (artboardModel.css!="") {
			b && log("Writing CSS in page header");
			pageOutput = replaceStylesToken(pageOutput, wrapInStyleTags(artboardModel.css, globalModel.stylesheetId), artboardModel.css);
		}
	}

	// replace script
	b && log("Replacing script");
	if (replaceScripts) {

		if (artboardModel.externalScript) {
			var javascriptPath = artboardModel.getJavaScriptFullPath();
			b && log("Writing external script link");
			
			// create link to script
			var scriptLinks = getExternalScriptLink(javascriptPath, globalModel.scriptId);
			
			pageOutput = replaceScriptsToken(pageOutput, scriptLinks);
		}
		else {

			if (artboardModel.scriptOutput!="" && artboardModel.scriptOutput!=null) {
				b && log("Writing Script in page header");
				pageOutput = replaceScriptsToken(pageOutput, wrapInIdTag("script", artboardModel.scriptOutput, globalModel.scriptId));
			}
		}
	}
	
	pageOutput = replaceViewIdsToken(pageOutput, artboardModel);

	// replace content
	b && log("Replacing content: " + getShortString(artboardModel.markup));
	pageOutput = replaceContentToken(pageOutput, artboardModel.markup, artboardModel.innerMarkup);
	
	b && log("Page output: " + pageOutput);
	
	return pageOutput;
}

/**
 * Gets attribute safe string
 * @param {String} value 
 **/
function getAttributeSafeValue(value) {
	if (value!=null) {
		value = value.replace(/"/gi, "");
		return value;
	}
  	return "";
}

/**
 * Adds a warning issue to the current artboard model
 * @param {String} title 
 * @param {String} description 
 **/
function addWarning(title, description) {
  let warningData = getIssue(title, description);
  globalModel.currentArtboardModel.warnings.push(warningData);
}

/**
 * Adds an info issue to the current artboard model
 * @param {String} title 
 * @param {String} description 
 */
function addInfo(title, description) {
  let infoData = getIssue(title, description);
  globalModel.currentArtboardModel.messages.push(infoData);
}

/**
 * Adds an error issue to the current artboard model
 * @param {String} title 
 * @param {String} description 
 **/
function addError(title, description) {
  let infoData = getIssue(title, description);

  if (globalModel.currentArtboardModel) {
	  globalModel.currentArtboardModel.errors.push(infoData);
  }
}

/**
 * Opens the URL in a browser. Does not work in some operating system or protocol
 * @param {String} path 
 * @param {Boolean} addFileProtocol 
 * @param {Boolean} replaceSpaces 
 **/
async function openURL(path, addFileProtocol = true, replaceSpaces = true) {
  var b = debugModel.openURL && log("OpenURL()");
  b && log("Opening URL: " + path);

  if (addFileProtocol && path.indexOf("file://")!=0) {
	 path = "file://" + path;
  }
  
  if (replaceSpaces) {
	 path = path.replace(/ /g,"%20");
  }

  //path = encodeURIComponent(path);
  //log("path: " + path)
  try {
	var result = shell.openExternal(path);
	b && log("open results:" + result);

	copyURLtoClipboard();
  }
  catch(error) {
	 log("Error" + error);
	 addError("Open URL Error", error);
  }
}

/**
 * Export renditions of an array of definition items. Renditions for now means PNG or JPEG images
 * @param {Array} items array of definition objects
 * @param {ArtboardModel} artboardModel 
 * @param {Object} alternativeFolder alternative folder to export to  
 * @param {Boolean} remove delete after create. used to get file size
 **/
async function exportRenditions(items, artboardModel = null, alternativeFolder = null, remove = false, embedImages = false, subfolder = null) {
  var b = debugModel.saveRenditions;
  var exportedRenditions = [];
  var type = globalModel.imageExportFormat;
  var numberOfItems = items.length;
  var fileExists = false;
  var imagesFolderAlreadyExists = false;
  var filename = "";
  var subfolder = artboardModel && artboardModel.imagesExportFolder;
  var supports2x = globalModel.image2x;
  var embedImage = false;
  var subfolderPath = null;
  var results = null;
  var totalSize = 0;
  var total2xSize = 0;
  var fileSizeValue = "";
  var embedMessage = null;

  // images are typically added in addToRenditions()

  b && log("Number of renditions:" + numberOfItems);
  
  if (numberOfItems==0) {
	 b && log("No renditions to export");
	 return [];
  }

	//try {
		var outputFolder = form.exportFolder;
		var imagesOutputFolder = null;

		if (alternativeFolder) {
			outputFolder = alternativeFolder;
		}
		else if (outputFolder==null) {
			outputFolder = await fileSystem.getFolder();
		}

		if (subfolder) {
			subfolderPath = outputFolder.nativePath + subfolder;

			try {

				imagesFolderAlreadyExists = await checkSubFolderExists(outputFolder, subfolder);
				imagesOutputFolder = await getSubFolder(outputFolder, subfolder);

				if (imagesOutputFolder instanceof Error) {
					addError(MessageConstants.FOLDER_ERROR, "Folder could not be created \"" +subfolder + "\"" );
				}
				else {
					outputFolder =	imagesOutputFolder;
				}
			}
			catch(fileError) {
				imagesFolderAlreadyExists = false;
				addError(MessageConstants.FOLDER_ERROR, fileError);
			}

		}

		// create an array of objects to export
		
		// to export a scene node create a defintion
		// set id
		// set node to scenenode
		// set type (optional) png, jpg
		// set quality for jpg (optional) 
		// exported filename will be id + . + png
		// if you set fullFilename it will be used instead
		// if you set scale it will be used otherwise scale will be 1

		for (let index = 0; index < numberOfItems; index++) {
			/** @type {Definition} */
			var definition = items[index];
			b && log("definition.id: " + definition.id);

			// sanitize the name before it gets here
			//var name = getSanitizedIDName(definition.id, 0);
			var name = definition.id;
			var filename = "";
			/** @type {File} */
			var file = null;
			var fillType;
			var node = null;
			var exclude = definition.exclude;
			var excludeReason = definition.excludeReason;
			var embedded = false;
			var embedSize = 0;
			var quality = definition.quality;


			if (definition.type) {
				type = definition.type;
			}

			filename = name + "." + type;
			
			b && log("Exporting to: " + filename);
			b && log("Exporting object type: " + typeof definition);
			//b && object(definition);
			
			// todo: use types
			if (definition.fullFilename) {
				filename = definition.fullFilename;
				b && log("Exporting existing full filename: " + filename);
			}

			fileExists = await checkFileExists(outputFolder, filename);

			if (fileExists) {
				b && log("File exists");
				b && log("Overwriting:" + filename);
				
				if (debugModel.ignoreFileExists==false) {
					addInfo(MessageConstants.FILE_EXISTS, "File \"" +filename + "\"" );
				}
			}
			
			file = await outputFolder.createEntry(filename, {overwrite:true});
			node = definition.node;
			//log("Node to render" + node);

			if (node.fillEnabled) {
			
				if (node.fill) {
					fillType = node.fill.constructor.name;

					if (fillType==XDConstants.IMAGE_FILL) {
						//object.node = node.fill;
					}
				}
			}
			
			// cannot support image fills at this time
			//object.node = node.fill;
			definition.node = node;

			if (definition.type==null){
				definition.type = globalModel.imageExportFormat;
			}

			definition.exportName = filename;
			definition.exportFolder = subfolder && imagesOutputFolder ? subfolder : "";
			definition.outputFile = file;

			if ("scale" in definition && definition.scale!=null) {
				// scale already set
			}
			else {
				definition.scale = 1;
			}
			
			embedded = definition.embedded;

			if (exclude==false) {
				exportedRenditions.push(definition);
			}
			else if (exclude==true) {
				
				if (embedded) {
					embedSize = definition.base64 ? Math.round(definition.base64.length*10/1024)/10 : 0;
					totalSize += embedSize;
					embedMessage = definition.exportName + " was embedded (" + getSizeFormattedValue(embedSize) + ")";
					if (definition.numberOfColors!=null && definition.numberOfColors!="") {
						embedMessage += " (" + definition.numberOfColors + " colors)";
					}
					addInfo(MessageConstants.EMBED_IMAGE, embedMessage);
				}
				else {
					//addInfo(MessageConstants.EXCLUDED_IMAGE, definition.exportName + " was excluded");
				}
			}

			b && log("Exporting node: " + filename);

			//addInfo(MessageConstants.EXPORTED_IMAGE, filename);
		}
	
		// export all renditions at once
		if (exportedRenditions.length) {
			try {
				results = await application.createRenditions(exportedRenditions);
			}
			catch (error) {
				addError(MessageConstants.EXPORTED_IMAGE, error)
			}
		}

		// if subfolder was created but no files were exported then do not create directory
		if (subfolder && imagesOutputFolder) {
			var numberOfFiles = await getNumberOfFiles(imagesOutputFolder);

			if (imagesFolderAlreadyExists==false && numberOfFiles<1) {
				await imagesOutputFolder.delete();
			}
		}

		numberOfItems = exportedRenditions.length;
	
		try {

			for (let j = 0; j < numberOfItems; j++) {
				definition = exportedRenditions[j];
				
				var metadata = await definition.outputFile.getMetadata();
				var fileSize = Math.round(metadata.size*10/1024)/10;// get kilobyte to one decimal place
		
				if (definition.outputFile && definition.outputFile.nativePath && definition.outputFile.nativePath.includes("@2x")) {
					total2xSize += fileSize;
			
					definition.size2x = metadata.size;
					definition.kbSize2x = fileSize;
					definition.mbSize2x = Math.round(metadata.size*1000/1024/1024)/1000;
				}
				else {
					totalSize += fileSize;
			
					definition.size = metadata.size;
					definition.kbSize = fileSize;
					definition.mbSize = Math.round(metadata.size*1000/1024/1024)/1000;
				}
		
				addInfo(MessageConstants.EXPORTED_IMAGE, definition.exportName + " (" + getSizeFormattedValue(fileSize) + ")");
		
				b && log("Exported to: " + definition.outputFile.nativePath);
			}
		}
		catch(error) {
			log(error)
		}

		artboardModel.totalImageSize = Math.round(totalSize*10/1024)/10;
		artboardModel.totalImage2xSize = Math.round(total2xSize*10/1024)/10;

		if (remove) {

			for (let j = 0; j < numberOfItems; j++) {
				definition = exportedRenditions[j];

				// FileSystemProvider: You don't have permission on this file 'imageSize.jpg'
				// can't delete files from temp folder? 
				//await definition.outputFile.delete();

				//addInfo(MessageConstants.FILE_DELETED, definition.exportName + " ");

				//b && log("Deleted: " + definition.outputFile.nativePath);
			}
		}

		if (embedImages) {
			addInfo(MessageConstants.EMBED_IMAGE, "Total image size " +  getSizeFormattedValue(totalSize));
		}
		else {

			if (supports2x) {
				addInfo(MessageConstants.EXPORTED_IMAGE, "Total image size " +  getSizeFormattedValue(totalSize) + " / " +  getSizeFormattedValue(total2xSize) + "");
			}
			else {
				addInfo(MessageConstants.EXPORTED_IMAGE, "Total image size " +  getSizeFormattedValue(totalSize));
			}
		}

	//}
	//catch(error) {
		//log("Export rendition failed: " + error);
		//addError("Save Renditions Error", filename + ": "+ error);
	//}

	return exportedRenditions;
}

/**
 * Save files to disk
 * @param {Array} files 
 * @param {ArtboardModel} artboardModel 
 **/
async function saveToDisk(files, artboardModel = null) {
  var b = debugModel.saveToDisk;
  /**@type	{FileInfo} */
  var fileInfo;
  var newFile;
  var nameAndExtension;
  var filename;
  var numberOfExports = 0;
  var skippedDialog = true;
  var exportFolder = null;
  var orderedItem;
  var fileExists = false;
  var fileSize = 0;
  var metadata = null;
  var exportedRenditions = artboardModel && artboardModel.exportedRenditions ? artboardModel.exportedRenditions : [];
  var allExportedFiles = [];
  var originalExportFolder = null;

  try {

	if (artboardModel.exportFolder==form.exportFolder) {
		b && log("Artboard folder matches export folder");
	}
	else {
		b && log("Artboard folder does not match export folder");
	}

	exportFolder = form.exportFolder;
	originalExportFolder = exportFolder;

	b && log("folder.isFileSystemProvider:" + exportFolder.isFileSystemProvider);
	b && log("folder.isFolder:" + exportFolder.isFolder);

	// this should not be null by the time we get here - may be using for quick export 
	if (exportFolder==null || typeof exportFolder === "string") {
		b && log("export folder was null or string. Requesting new folder");
		//closeOtherDialogs();
		exportFolder = await fileSystem.getFolder();
		//log("Folder selected")
		skippedDialog = false;
		originalExportFolder = exportFolder;
	}

	// we have a folder let's export
	if (exportFolder) {
		var temp = null;

		if (globalModel.createExportingFile) {
			temp = await exportFolder.createEntry("web_export_log.txt", {overwrite: true});
			await temp.write("Exporting...");
		}

		var pageSize = 0;
		var pagesSize = 0;
		var exclude = false;
		var metadata = null;
		var fileSize = 0;
		var includedFiles = [];
		var name = "";

		// get list of non excluded files
		for(var i=0;i<files.length;i++) {
			fileInfo = files[i];// FileInfo
			nameAndExtension = fileInfo.getFilename();
			name = fileInfo.name;
			filename = fileInfo.fileName;
			exclude = fileInfo.exclude;
			fileSize = 0;

			b && log("Creating file: " + filename);
			
			if (exclude==true || filename.indexOf("-none")==0) {
				b && log("excluding:"+filename)
				continue;
			}

			includedFiles.push(fileInfo);
			
		}

		allExportedFiles = includedFiles.concat(...exportedRenditions);
		
		// loop through and export each file
		for(var i=0;i<files.length;i++) {
			fileInfo = files[i];// FileInfo
			nameAndExtension = fileInfo.getFilename();
			name = fileInfo.name;
			filename = fileInfo.fileName;
			exclude = fileInfo.exclude;
			var subfolder = fileInfo.subFolder;
			exportFolder = originalExportFolder;
			fileSize = 0;

			b && log("Creating file: " + filename);
			
			if (exclude==true || filename.indexOf("-none")==0) {
				b && log("excluding:"+filename)

				if (fileInfo.content) {
					fileSize = Math.round(fileInfo.content.length/1024);
				}
			}
			else {
				var subFolderAlreadyExists = false;
				var subOutputFolder = null;

				if (subfolder) {

				  try {
					  subFolderAlreadyExists = await checkSubFolderExists(originalExportFolder, subfolder);
					  subOutputFolder = await getSubFolder(originalExportFolder, subfolder);
					  exportFolder = subOutputFolder;
				  }
				  catch(fileError) {
					  subFolderAlreadyExists = false;
				  }
		  
				}

				var fileExists = await checkFileExists(exportFolder, nameAndExtension);
			  
				newFile = await exportFolder.createEntry(nameAndExtension, {overwrite: true});
	
				if (fileExists) {
					b && log("File exists");
					b && log("Overwriting:" + nameAndExtension);
					
					if (debugModel.ignoreFileExists==false) {
						addInfo(MessageConstants.FILE_EXISTS, "File \"" +nameAndExtension + "\"" );
					}
				}
				else {
					b && log("File does not exist");
					b && log("Created file: " + nameAndExtension);
				}

				if (fileInfo.content) {
					fileInfo.content = replaceFileListToken(fileInfo.content, allExportedFiles);
				}
	
				orderedItem = await newFile.write(fileInfo.content);
				b && log("Writing contents to file: " + nameAndExtension);

				fileInfo.nativePath = newFile.nativePath;
				fileInfo.url = newFile.url;
				fileInfo.folder = exportFolder.nativePath;

				metadata = await newFile.getMetadata();
				fileSize = Math.round(metadata.size/1024);
			}
			
			numberOfExports++;
			var fileSizeValue = "";

			if (i==0) {
				pageSize = fileSize;
			}
			pagesSize += fileSize;

			if (artboardModel.singlePageApplication) {
				addInfo(MessageConstants.EXPORTED_ELEMENT, fileInfo.id + " (" + getSizeFormattedValue(fileSize) + ")");
			}
			else {

				if (fileInfo.name && fileInfo.name.indexOf("-none")==0) {
					//addInfo(MessageConstants.EXPORTED_FILE, nameAndExtension + " (" + getSizeFormattedValue(fileSize) + ")");
				}
				else {
					addInfo(MessageConstants.EXPORTED_FILE, nameAndExtension + " (" + getSizeFormattedValue(fileSize) + ")");
				}
			}
		}

		if (artboardModel) {
			artboardModel.totalPagesSize += pagesSize;
			artboardModel.totalPageSize = pageSize;
		}

		if (globalModel.createExportingFile) {
			await temp.delete();
		}

		b && log("Export complete!\nExported " + numberOfExports + " files. \n" + files.join("\n"));
	 }
	 else {
		b && log("Export canceled");
	 }

  }
  catch (error) {
	 log(error.stack);
	 addError("Save to Disk Error", error);
  }

}

/**
 * Get formatted number
 * @param {Number} size 
 * @returns {String}
 **/
function getSizeFormattedValue(size) {
	var sizeLabel = "";
	var kilobyte = 1024;

	if (size>kilobyte) {
		sizeLabel = Math.round(size*100/kilobyte)/100 + "MB";
	}
	else {
		sizeLabel = Math.round(size*10)/10 + "k";
	}

	return sizeLabel;
}

/**
 * Create or update the model with the properties and values to later be exported. 
 * @param {SceneNode|Artboard} item 
 * @param {Number} nestLevel 
 * @param {Number} index 
 * @param {Boolean} skipExport 
 * @param {Boolean} addInPluginData 
 * @param {Model} existingModel 
 **/
function createModel(item, nestLevel, index, skipExport = false, addInPluginData = true, existingModel = null) {
	var b = debugModel.createModel;
	var type = item.constructor.name;
	var guid = item.guid;
	var isBooleanGroup = item instanceof BooleanGroup;
	var isGroup = item.isContainer;
	var preferenceData = null;
	var isArtboard = getIsArtboard(item);
	var hasMarkupInside = false;
	var hasHTMLTemplate = false;
	var isText = item instanceof Text;
	/** @type {Model} */
	var model = null;
	

	if (existingModel) {
		model = existingModel;
	}
	else {
		model = globalArtboardModel && globalArtboardModel.models && globalArtboardModel.models[guid];
	}

	if (model==null) {

		if (isArtboard && globalModel.artboardModels[guid]) {
			//model = globalModel.artboardModels[guid];
		}
	}

	if (model==null) {

		if (isArtboard) {
			model = new ArtboardModel();
		}
		else {
			model = new Model();
			model.overflow = model.getDefaultOverflowValue(item);
		}

		addModel(item, model);
	}
	
	b && log("Creating model for: " + type + " " + nestLevel + ":" + index);

	model.version = globalModel.version;
	
	// create properties
	model.nestLevel = nestLevel;
	model.index = index;
	model.bounds = getBoundsInParent(item);
	model.groupBounds = getBoundsInParentLocal(item, false);
	model.parentBounds = item.parent ? Object.assign({}, item.parent.globalBounds) : null;
	model.displayType = getDisplayTypeName(type);
	model.type = type;
	model.guid = guid;
	model.name = item.name;
	model.artboard = getArtboard(item);
	model.isBooleanGroup = isBooleanGroup;
	model.isGroup = isGroup;
	model.isLayoutGroup = isGroup && isBooleanGroup==false;

	if (addInPluginData) {
		preferenceData = getSceneNodePluginData(item);

		if (preferenceData) {
			parsePluginData(model, preferenceData);
		}
		else {
			// add default plugin data
		}
	}

	hasMarkupInside = model.markupInside!=null && model.markupInside!="";
	hasHTMLTemplate = model.template !=null && model.template!="";

   if (b==false && model.debug) {
  	  b && log("Creating model for: " + type + " " + nestLevel + ":" + index);
   }

   if (skipExport) {
	 return model;
	}
	
	var exportAsImage = isExportAsImage(item, model);

	
   if (hasMarkupInside && isText==false) {
	  type = XDConstants.HTML;
	}
  	if (hasHTMLTemplate && isArtboard==false) {
	  type = XDConstants.HTML_TEMPLATE;
	}
	
   if (exportAsImage && hasMarkupInside!=true) {
	  type = XDConstants.IMAGE;
	}
  
	switch(type) {
		
		case XDConstants.IMAGE:
			exportImage(item, model);
			break;
		case XDConstants.HTML_TEMPLATE:
			exportHTMLTemplate(item, model);
			break;
		case XDConstants.HTML:
			exportHTML(item, model);
			break;
		case XDConstants.ELLIPSE:
			exportEllipse(item, model);
			break;
		case XDConstants.RECTANGLE:
			if (getIsRectangle(item)) {
				exportRectangle(item, model);
			}
			break;
		case XDConstants.PATH:
			exportPath(item, model);
			break;
		case XDConstants.LINE:
			if (item instanceof Line) {
				exportLine(item, model);
			}
			break;
		case XDConstants.TEXT:
			if (item instanceof Text) {
				exportText(item, model);
			}
			break;
		case XDConstants.POLYGON:
			exportPolygon(item, model);
			break;
		case XDConstants.GROUP:
			exportGroup(item, model);
			break;
		case XDConstants.SCROLLABLE_GROUP:
			exportGroup(item, model);
			break;
		case XDConstants.BOOLEAN_GROUP:
			if (globalArtboardModel.exportBooleanGroupsAsPaths) {
				isBooleanGroup = true;
				exportPath(item, model);
			}
			else {
				exportGroup(item, model);
			}
			break;
		case XDConstants.REPEAT_GRID:
			exportRepeatGrid(item, model);
			break;
		case XDConstants.SYMBOL_INSTANCE:
			exportComponent(item, model);
			break;
		case XDConstants.ARTBOARD:
			item instanceof Artboard && exportArtboard(item, model);
			break;
		default:
			exportPath(item, model);
			addWarning(MessageConstants.ELEMENT_TYPE_NOT_FOUND, "Exporter for element \"" + type + "\" named \"" + item.name + "\" is not found. Exporting as path");
			break;
	}

	var items = item.children;

	if (item.isContainer && items && items.length && isBooleanGroup==false && exportAsImage==false && hasMarkupInside==false) {

		for (let index = 0; index < items.length; index++) {
			const element = items.at(index);
			createModel(element, ++globalArtboardModel.currentNestLevel, index);
			--globalArtboardModel.currentNestLevel;
		}
	}

  return model;
}

/**
 * Get base64 encoded image data if needed to images
 * @param {SceneNode|Artboard} item 
 * @param {Model} model 
 * @param {ArtboardModel} artboardModel 
 **/
async function getBase64DataModel(item, model, artboardModel) {
	var b = debugModel.createModel;
	var type = item.constructor.name;
	var isBooleanGroup = item instanceof BooleanGroup;
	var hasMarkupInside = false;
	var isText = item instanceof Text;

	model = getModel(item, true);

	hasMarkupInside = model.markupInside!=null && model.markupInside!="";

	var exportAsImage = isExportAsImage(item, model);

   if (exportAsImage) {
	  type = XDConstants.IMAGE;
   }

   if (hasMarkupInside && isText==false) {
	  type = XDConstants.HTML;
   }
  
	if (type==XDConstants.IMAGE) {
		await setEmbeddedImageSourceAttribute(item, model, artboardModel);
	}

	if (item.isContainer && item.children.length && isBooleanGroup==false && exportAsImage==false && hasMarkupInside==false) {
		
		var numberOfItems = item.children.length;

		// order is not important because we are updating a value
		for (var i=0;i<numberOfItems;i++) {
			await getBase64DataModel(item.children.at(i), model, artboardModel);
		}

	}

  return model;
}

/**
 * Get model from scene node
 * Models are currently created and removed during export 
 * @param {SceneNode} item 
 * @param {Boolean} createModelIfNeeded 
 * @returns {Model}
 **/
function getModel(item, createModelIfNeeded = false) {
	var model = null;

	if (globalArtboardModel && globalArtboardModel.models[item]!=null) {
		return globalArtboardModel.models[item];
	}
	else if (createModelIfNeeded) {
		model = createModel(item, 0, 0, true);
		return model;
	}

  return null;
}

/**
 * Get model with only plugin data values
 * @param {SceneNode} item 
 * @returns {Model|ArtboardModel}
 **/
function getModelPluginDataOnly(item) {
	if (GlobalModel.supportsPluginData) {
		var jsonObject = getSceneNodePluginData(item);
		var model = item instanceof Artboard ? new ArtboardModel() : new Model();

		if (jsonObject) {
			parsePluginData(model, jsonObject);
		}

		return model;
	}

  return null;
}

/**
 * Get artboard model with only plugin data values
 * @param {Artboard} item 
 * @returns {ArtboardModel}
 **/
function getArtboardModelPluginDataOnly(item) {
	var jsonObject = getSceneNodePluginData(item);
	var model = new ArtboardModel();

	if (jsonObject) {
		parsePluginData(model, jsonObject);
	}

	return model;
}

/**
 * Get model from scene node
 * @param {SceneNode} item 
 **/
function getArtboardModel(item) {
  if (globalModel.artboardModels && globalModel.artboardModels[item.guid]!=null) {
	 return globalModel.artboardModels[item.guid];
  }

  return null;
}

/**
 * Get item from model
 * @param {Model} model 
 **/
function getItem(model) {
  if (globalArtboardModel.items[model]!=null) {
	 return globalArtboardModel.items[model];
  }

  return null;
}

/**
 * Add model to artboard model. 
 * TODO pass in artboard model. Legacy code
 * @param {SceneNode} item 
 * @param {Model} model 
 **/
function addModel(item, model) {
  
	if (globalArtboardModel) {

		if (globalArtboardModel.models[item]!=null) {
			var description = "Model already added for " + item.constructor.name + " named \"" + getSanitizedIDName(item.name) + "\"";
			addWarning(MessageConstants.MODEL_ALREADY_ADDED, description);
		}
	
		globalArtboardModel.models[item] = model;
		globalArtboardModel.items[model] = item;
	}

	if (item instanceof Artboard) {
		globalModel.artboardModels[item.guid] = model;
	}
}

/**
 * Remove models from from current artboard model
 **/
function removeModels() {
  for (var item in globalArtboardModel.models) {
	 delete globalArtboardModel.models[item];
  }

  globalArtboardModel.models = null;
}

/**
 * Create the HTML element values to be arranged later
 * @param {SceneNode} item 
 * @param {Number} nestLevel 
 * @param {Number} index 
 **/
function exportItem(item, nestLevel, index) {
	var model = getModel(item);
	var b = debugModel.exportItem || model.debug;
	var type = model.type;
	var isBooleanGroup = model.type==XDConstants.BOOLEAN_GROUP && globalArtboardModel.exportBooleanGroupsAsPaths;
	var container = null;
	var isArtboard = getIsArtboard(item);
	var items = item.children;
	var isRepeatGrid = item && item instanceof RepeatGrid;
	var isRepeatGridItem = item && item.parent instanceof RepeatGrid;
	var hasMarkupInside = model.markupInside!=null && model.markupInside!="";
	var hasHTMLTemplate = model.template!=null && model.template!="";
	var hasInnerContentToken = hasHTMLTemplate ? model.template.match(pageToken.innerHTMLToken)!=null : false;
	var parseForHTML = hasHTMLTemplate && isArtboard==false ? !(hasHTMLTemplate==true && hasInnerContentToken==true) : false;

	b && log("Exporting: " + type + " " + nestLevel + ":" + index + " " + model.name);

	if (model.export==false) return;
	
	if (model.useAsGroupBackground==true) return;

	var exportAsImage = isExportAsImage(item, model);

	if (model.exportAsString && index>0 && isRepeatGridItem) {
		return;
	}

	addToExport(item, model);

	// export descendants
	if (item.isContainer && item.children.length && isBooleanGroup==false && 
		exportAsImage==false && hasMarkupInside==false && parseForHTML==false) {
		container = item;

		if (container instanceof Group && container.mask) {
			var convertMasksToImages = globalArtboardModel.convertMasksToImages;

			if (convertMasksToImages==false) {

				// export mask first
				for (let index = 0; index < items.length; index++) {
					const node = items.at(index);

					if (node==container.mask) {
						var model = getModel(node);
						if (exportAsImage==false) {
							exportItem(node, ++globalArtboardModel.currentNestLevel, index);
							--globalArtboardModel.currentNestLevel;
						}
					}
				}
	
				// after mask is exported export the rest
				for (let index = 0; index < items.length; index++) {
					const node = items.at(index);

					if (node!=container.mask) {
						exportItem(node, ++globalArtboardModel.currentNestLevel, index);
						--globalArtboardModel.currentNestLevel;
					}
				}
			}
		}
		else {

			for (let index = 0; index < items.length; index++) {
				const node = items.at(index);
				exportItem(node, ++globalArtboardModel.currentNestLevel, index);
				--globalArtboardModel.currentNestLevel;
			}

			// add last item
			if (isArtboard && globalArtboardModel.addImageComparison) {
				var imageModel = new ArtboardModel();
				var addTextToDisplay = false;

				imageModel.addImageComparison = true;

				// todo: add a way to indicate the screenshot from the actual page
				// workaround: add a text field to the artboard but set export to none
				// fix: add export rendition here 
				if (addTextToDisplay) {

					let newShape = new Text();
					newShape.text = "IMAGE";
					newShape.fontSize = 10;
					newShape.fontFamily = "sans-serif";
					newShape.fill = new Color("black");
					globalModel.selection.insertionParent.addChild(newShape);
					newShape.moveInParentCoordinates(20+Math.abs(newShape.localBounds.x), 20+Math.abs(newShape.localBounds.y));
				}

				imageModel.elementId = globalArtboardModel.elementId + Styles.COMPARE_IMAGE_NAME;
				imageModel.groupBounds = getBoundsInParentLocal(item);
				var keyframesRule = new KeyframesRule();
				keyframesRule.name = "fadein";

				var keys = ["0%", "37.5%", "50%", "87.5%", "100%"];
				var values = [1, 1, 0, 0, 1];

				// adding wait, fade out, wait, fade in animation 
				for (let i = 0; i < keys.length; i++) {
					const keyText = keys[i];
					
					var keyRule = new KeyframeRule();
					keyRule.keyText = keys[i];
					keyRule.style.setProperty(Styles.OPACITY, values[i]);
					keyframesRule.appendRule(keyRule);
				}

				imageModel.styleRules.push(keyframesRule);

				imageModel.cssStyles[Styles.ANIMATION] = "fadein " + globalArtboardModel.imageComparisonDuration + "s linear 0s infinite";
				imageModel.cssStyles[Styles.POINTER_EVENTS] = Styles.NONE;

				exportImage(globalArtboardModel.artboard, imageModel)
				addToExport(null, imageModel);
				addToExport(null, imageModel, true);
			}
		}
	}

	addToExport(item, model, true);
}

/**
 * Styles object to add transform value to
 * @param {Object} styles 
 * @param {String} value 
 */
function addTransformStyle(styles, value) {
  if (styles.transform==null) {
	 styles.transform = [];
  }

  styles.transform.push(value);
}

/**
 * Styles object to add transform value to
 * @param {Object} styles 
 * @param {String} value 
 */
function hasTransformStyle(styles, value) {
  if (styles.transform==null) {
	 styles.transform = [];
  }

  return styles.transform.indexOf(value)!=-1;
}

/**
 * Returns a valid transform value for rotation in the form of rotate(90deg);
 * @param {Number} value 
 * @returns {String} 
 **/
function getTransformRotationValue(value) {
	return "rotate(" + value + "deg)";
}

/**
 * Returns a valid transform value for translation in the form of translate(10px, 10px);
 * @param {Array} values 
 * @returns {String} 
 **/
function getTransformTranslationValue(...values) {
	var numberOfValues = values.length;

	if (numberOfValues==2) {
		return "translate(" + getPx(values[0]) + ", " + getPx(values[1]) + ")";
	}
	
	return "translate(" + getPx(values[0]) + ")";
}

function hasUIControls(artboardModel) {
	return artboardModel.showScaleSlider; 
}

/********************************************
 * EXPORT METHODS
 ********************************************/			

/**
 * Exports the Artboard. Todo refactor to fit other export methods
 * @param {Artboard} item 
 * @param {Model} model 
 **/
function exportArtboard(item, model) {
	var b = debugModel.exportItem || model.debug;
	var styles;
	// TODO create HTMLElement objects and set properties on that instead of using model for values and output

	if (globalArtboardModel.id==null || globalArtboardModel.id=="") {
		model.elementId = createUniqueItemName(globalArtboardModel.artboard, globalArtboardModel);
	}
	else {
		model.elementId = globalArtboardModel.id;
	}
	
	// todo the next section can be refactored
	if (globalArtboardModel.addRootContainer) {
		b && log("Adding root container");
		model.containerTagName = HTMLConstants.BODY;
		model.tagName = HTMLConstants.DIVISION;
		// not adding body container here
		model.addContainer = false; // artboardModel.exportToSinglePage==false;
		model.addCloseTag = true;
		model.addContainerCloseTag = true;//!hasUIControls(artboardModel);
		model.singleTag = globalArtboardModel.exportToSinglePage;
		
		styles = model.cssStyles;
		styles.position = Styles.ABSOLUTE;
		
		/*
		// javascript must be enabled for centered scaling otherwise page is clipped
		// so we are only setting the css variables and if JS is enabled so will centering 
		if (globalArtboardModel.centerHorizontally) {
			b && log("center horizontally")

			if (globalArtboardModel.centerUsingTransform) {
				addTransformStyle(styles, "translateX(-50%)");
				styles.left = "50%";
				b && log("Center horizontally");
			}
			else {
				styles.margin = "0 auto";
			}
		}

		if (globalArtboardModel.centerVertically) {
			b && log("Center vertically");
			addTransformStyle(styles, "translateY(-50%)");
			styles.top = "50%";
		}
		*/

		if (globalArtboardModel.exportToSinglePage) {
			if (globalModel.hideArtboardsUsingDisplay) {
				styles[Styles.DISPLAY] = Styles.BLOCK;
			}
			else {
				styles[Styles.VISIBILITY] = Styles.VISIBLE;
			}
		}
		else {
			setDisplayStyle(item, globalArtboardModel, styles)
		}

		if (globalArtboardModel.setBorderOnDocument) {

			if (globalArtboardModel.setBorderByOutline) {
				styles.outline = globalArtboardModel.borderStyle;
			}
			else {
				styles.border = globalArtboardModel.borderStyle;
			}
		}

		if (globalArtboardModel.setBodyBackgroundStyle) {
			styles[Styles.BACKGROUND] = globalArtboardModel.bodyBackgroundStyle;
		}

		model.attributes.id = model.elementId;
	}
	else {
		model.tagName = HTMLConstants.BODY;
		model.singleTag = true;
		styles = model.cssStyles;

		model.addEndTag = false;
		model.addCloseTag = false;
	}


	setSize(styles, item, model.alternateWidth, model.alternateHeight);

	if (globalArtboardModel.alternativeFont && globalArtboardModel.alternativeFont!="none") {
		styles[Styles.FONT_FAMILY] = globalArtboardModel.alternativeFont;
	}

	if (item.fill != null && item.fillEnabled) {
		var fillType = "";
		var fill = null;
		var fillCSS = "";

		fill = item.fill;
		fillType = fill.constructor.name;

		if (fillType==XDConstants.COLOR_FILL) {
			b && log("Solid Color fill");
			styles[Styles.BACKGROUND_COLOR] = createSolidFill(item, model, item.fill);
		}
		else if (fillType==XDConstants.LINEAR_GRADIENT_FILL || fillType ==XDConstants.RADIAL_GRADIENT_FILL) {
			b && log("Gradient fill");
			fillCSS = createGradientFill(item, model, fill, true);
			styles[Styles.BACKGROUND] = fillCSS;
		}
		else if (fillType==XDConstants.IMAGE_FILL) {
			addWarning(MessageConstants.IMAGE_FILL_SUPPORT, MessageConstants.IMAGE_FILL_SUPPORT)
		}
	}
	
	setOverflowOptions(styles, globalArtboardModel.overflow, OverflowOptions.HIDDEN);

	if (globalArtboardModel.scaleFactor != 1) {
		addTransformStyle(styles, "scale(" + globalArtboardModel.scaleFactor + ")");

		if (globalArtboardModel.centerHorizontally) {
			//styles[Styles.TRANSFORM_ORIGIN] = Styles.CENTER;
		}
		else {
			styles[Styles.TRANSFORM_ORIGIN] = globalArtboardModel.transformOrigin;
		}
	}

	//setHorizontalPosition(artboard, model);
	//setVerticalPosition(artboard, model);

	setPositionStyles(item, model);

	setAlphaStyle(item, model);

	setBlendMode(item, model);

	setDropShadow(item, model);

	setDisplayStyle(item, model, model.cssStyles);
	
	addInteractions(item, model, model.cssStyles);

	setFlexBoxStyles(item, model, model.cssStyles);
	
	setFlexAlignSelfStyles(item, model, model.cssStyles);
	
	//also setting in exportDocument
	setStandardCSSPropertyValues(globalArtboardModel, styles);

	setSizingOptions(item, model);

	if (globalArtboardModel.addRootContainer) {
		setAdditionalStyles(item, model, styles, model.additionalStyles);
	}
	else {
		setAdditionalStyles(item, model, styles, model.additionalStyles);
	}

	setClassAttribute(item, model);

	setStateInformation(item, model);

	setTagNames(item, model);

	setCursor(item, model);

	addHoverEffects(item, model);

	setDebugOptions(item, model);

	createStyleRules(item, model);
	
}

/**
 * Export Ellipse
 * @param {SceneNode} item 
 * @param {Model} model 
 **/
function exportEllipse(item, model) {
	model.tagName = HTMLConstants.ELLIPSE;
	model.singleTag = false;
	model.addSVGContainer = true;
	model.addEndTag = true;

	createUniqueItemName(item, model);
	
	setAlphaStyle(item, model);

	setBlendMode(item, model, model.svgStyles);

	setDropShadow(item, model, model.svgStyles);

	setBlur(item, model);

	setDisplayStyle(item, model, model.svgStyles);
	
	let hasRotation = item.rotation!=0;

	if (hasRotation) {
		var newCode = globalModel.useRotation2;
		addWarning(MessageConstants.ROTATION_SUPPORT, MessageConstants.rotationSupportMessage + "\" on \"" + model.elementId + "\"");

		if (newCode) {
			setSVGContainerSize(item, model, true);
			setSVGContainerAbsolutePosition(item, model);
			setSVGContainerOverflowVisible(item, model);
			setTransformStyles2(item, model, model.svgStyles);
		}
	}
	else {
		setSVGContainerStyles(item, model, true, false);
		setHorizontalPosition(item, model, model.svgStyles);
		setVerticalPosition(item, model, model.svgStyles);
	}

	setPositionStyles(item, model, model.svgStyles);

	setSVGContainerAttributes(item, model);

	if (globalArtboardModel.addDataNames) {
		setSceneNodeAttributes(model.svgAttributes, model);
	}

	if (getIsFlexItem(item, model)) {
		deleteNonApplicableFlexStyles(item, model, model.svgStyles);
	}
	
	setFlexAlignSelfStyles(item, model, model.svgStyles);
	
	//setElementStyles(item, model);
	setGraphicFillStyles(item, model, model.exportSVGStylesAsAttributes);
	setGraphicStrokeStyles(item, model, model.exportSVGStylesAsAttributes);

	setOverflowOptions(model.svgStyles, model.overflow, OverflowOptions.VISIBLE);
	
	addInteractions(item, model, model.cssStyles);

	setIdAttribute(item, model, model.attributes);

	setClassAttribute(item, model);

	setStateInformation(item, model);

	setEllipseProperties(item, model);

	setTagNames(item, model);

	setCursor(item, model);

	setSizingOptions(item, model);

	setAdditionalStyles(item, model, model.svgStyles, model.additionalStyles);

	setAdditionalStyles(item, model, model.cssStyles, model.subStyles);

	addHoverEffects(item, model);

	setDebugOptions(item, model);

	createStyleRules(item, model);
}

/**
 * Export Group. Sets overflow to visible.
 * @param {SceneNode} item 
 * @param {Model} model 
 * @param {Boolean} isRepeatGrid
 * @param {Boolean} isComponent
 **/
function exportGroup(item, model, isRepeatGrid = false, isComponent = false, isRectangle = false) {
	model.tagName = HTMLConstants.DIVISION;
	model.addContainer = true;
	model.setAdditionalClassesOnContainer = true;
	model.setAdditionalAttributesOnContainer = true;
	model.singleTag = true;

	var isRepeatGridItem = item && item.parent instanceof RepeatGrid;

	createUniqueItemName(item, model);

	setAlphaStyle(item, model);

	setBlendMode(item, model);

	let hasRotation = item.rotation!=0;

	if (hasRotation) {
		addWarning(MessageConstants.ROTATION_SUPPORT, MessageConstants.rotationSupportMessage + "\" on \"" + model.elementId + "\"");

		var newCode = globalModel.useRotation2;
		if (newCode) {
			setTransformStyles2(item, model, model.cssStyles);
		}
		else {
			setRotation(item, model.cssStyles, true);
		}
	}
	else {
		//setSVGContainerStyles(item, model, true, true);
	}

	setDropShadow(item, model);

	setBlur(item, model);
	
	setContainerStyles(item, model, false);
	
	setBackgroundFromDescendant(item, model, false, isRectangle);

	setPositionStyles(item, model);

	if (getIsFlexItem(item, model)) {
		deleteNonApplicableFlexStyles(item, model, model.cssStyles);
	}

	setFlexBoxStyles(item, model, model.cssStyles);
	
	setFlexAlignSelfStyles(item, model, model.cssStyles);

	setDisplayStyle(item, model, model.cssStyles);

	if (isRepeatGrid) {
		setOverflowOptions(model.cssStyles, model.overflow, OverflowOptions.HIDDEN);
	}
	else {
		setOverflowOptions(model.cssStyles, model.overflow, OverflowOptions.VISIBLE);
	}

	if (globalArtboardModel.setStylesInline) {
		setContainerStylePropertiesInline(item, model);
	}
	
	if (globalArtboardModel.addDataNames) {
		setSceneNodeAttributes(model.containerAttributes, model);
	}
	
	addInteractions(item, model, model.cssStyles, model.containerAttributes);

	setIdAttribute(item, model, model.containerAttributes);

	var sanitizedComponentName = getSanitizedName(model.name);
	
	if (isComponent || isRepeatGridItem) {
		model.componentName = sanitizedComponentName;
		model.containerClassesArray.push(sanitizedComponentName);
	}

	setClassAttribute(item, model);

	setStateInformation(item, model);

	setTagNames(item, model);

	setCursor(item, model);

	setSizingOptions(item, model);

	setAdditionalStyles(item, model, model.cssStyles, model.additionalStyles);

	addHoverEffects(item, model);

	setDebugOptions(item, model);

	createStyleRules(item, model);
}

/**
 * Export custom HTML
 * @param {SceneNode} item 
 * @param {Model} model 
 **/
function exportHTMLTemplate(item, model) {
	model.tagName = "none";
	model.addEndTag = true;
	model.singleTag = true;
	model.isHTML = true;

	exportHTML(item, model, true);
}

/**
 * Export custom HTML
 * @param {SceneNode} item 
 * @param {Model} model 
 * @param {Boolean} isHTMLTemplate 
 **/
function exportHTML(item, model, isHTMLTemplate = false) {
	if (isHTMLTemplate==false) {
		model.tagName = HTMLConstants.DIVISION;
		model.addEndTag = true;
		model.singleTag = true;
		model.isHTML = true;
	}

	createUniqueItemName(item, model);

	setAlphaStyle(item, model);

	setBlendMode(item, model);

	setDropShadow(item, model);

	setBlur(item, model);

	setDisplayStyle(item, model, model.cssStyles);

	setElementStyles(item, model);

	setRotation(item, model.cssStyles, true);
	
	setPositionAbsolute(model.cssStyles);

	setSize(model.cssStyles, model.groupBounds, model.alternateWidth, model.alternateHeight);

	setPositionStyles(item, model);

	setHorizontalPosition(item, model);
	setVerticalPosition(item, model);

	if (getIsFlexItem(item, model)) {
		deleteNonApplicableFlexStyles(item, model, model.cssStyles);
	}
		
	setFlexAlignSelfStyles(item, model, model.cssStyles);

	setOverflowOptions(model.cssStyles, model.overflow, OverflowOptions.VISIBLE);

	if (item instanceof Text) {
		
		if (item.areaBox!=null) {
			//setOverflowOptions(model.cssStyles, model.overflow, OverflowOptions.HIDDEN);
			//setTextContainerSizeStyles(item, model);
		}
		else {
			//setOverflowOptions(model.cssStyles, model.overflow, OverflowOptions.VISIBLE);
			//setTextContainerWidth(item, model);
			setWhiteSpaceNoWrap(item, model);
		}
		
		// adds the font styles to the css style object
		getTextValue(item, model);
	}

	if (globalArtboardModel.addDataNames) {
		setSceneNodeAttributes(model.attributes, model);
	}
	
	addInteractions(item, model, model.cssStyles);

	setIdAttribute(item, model, model.attributes);

	setClassAttribute(item, model);

	setStateInformation(item, model);

	setTagNames(item, model);

	setCursor(item, model);

	setSizingOptions(item, model);

	setAdditionalStyles(item, model, model.cssStyles, model.additionalStyles);

	addHoverEffects(item, model);

	setDebugOptions(item, model);

	createStyleRules(item, model);

	if (isHTMLTemplate) {
		var template = model.template;
		var hasInnerContentToken = template.match(pageToken.innerHTMLToken);

		if (hasInnerContentToken!=null) {
			var valuesArray = template.split(pageToken.innerHTMLToken);
			var beforeContent = valuesArray[0];
			var afterContent = valuesArray[1];
			
			beforeContent = replaceTemplateTokens(item, model, beforeContent, false);
			afterContent = replaceTemplateTokens(item, model, afterContent, false);

			model.beforeContent = beforeContent;
			model.afterContent = afterContent;
		}
		else {
			model.innerContent = replaceTemplateTokens(item, model, template, false);
		}
	}
	else {
		model.innerContent = model.markupInside;
	}
}

/**
 * Set HTML template option
 * @param {SceneNode} item 
 * @param {Model} model 
 **/
function setHTMLTemplate(item, model) {
	var hasHTMLTemplate = model.template !=null && model.template!="";
	var isArtboard = getIsArtboard(item);

	if (hasHTMLTemplate && isArtboard==false) {

		var template = model.template;
		var hasInnerContentToken = template.match(pageToken.innerHTMLToken);

		if (hasInnerContentToken!=null) {
			var valuesArray = template.split(pageToken.innerHTMLToken);
			var beforeContent = valuesArray[0];
			var afterContent = valuesArray[1];
			
			beforeContent = replaceTemplateTokens(item, model, beforeContent, false);
			afterContent = replaceTemplateTokens(item, model, afterContent, false);

			model.beforeContent = beforeContent;
			model.afterContent = afterContent;
		}
		else {
			model.innerContent = replaceTemplateTokens(item, model, template, false);
		}
	}
	else {
		model.innerContent = model.markupInside;
	}
}

/**
 * Export Image. Sets overflow to visible.
 * @param {SceneNode} item 
 * @param {Model} model 
 **/
function exportImage(item, model = null) {
	var b = model.debug;

	if (model==null) {
		model = new Model();
		model.groupBounds = getBoundsInParentLocal(item, false);
	}

	var isArtboardSnapshot = model instanceof ArtboardModel && model.addImageComparison;
	var useImageTag = true;
	var artboardModel = getArtboardModel(getArtboard(item));
	var embedImage = false;
	var hasHTMLTemplate = model.template !=null && model.template!="";

	// use image 
	if (useImageTag) {
		model.tagName = HTMLConstants.IMAGE;
		model.singleTag = true;

		b && log("Exporting as: " + model.tagName);
	
		var isArtboard = getIsArtboard(item);

		// artboard id is already unique - and
		// and creatunitque item name is not robust yet bc it truncates
		if (isArtboard==false && isArtboardSnapshot==false) {
			createUniqueItemName(item, model);
		}
		else {
			//object(model);
		}
	
		setAlphaStyle(item, model);

		setBlendMode(item, model);
	
		let hasRotation = item.rotation!=0;
	
		// if it is an image it is a snapshot of a rotated element. do not need to apply rotation in code
		if (hasRotation) {

		}
		else {

		}
	
		setDropShadow(item, model);
	
		setBlur(item, model);

		setDisplayStyle(item, model, model.cssStyles);
		
		setPositionStyles(item, model);

		setSize(model.cssStyles, model.groupBounds, model.alternateWidth, model.alternateHeight);

		if (isArtboardSnapshot) {
			model.cssStyles[Styles.LEFT] = 0;
			model.cssStyles[Styles.TOP] = 0;
		}
		else {
			setHorizontalPosition(item, model);
			setVerticalPosition(item, model);
		}


		if (getIsFlexItem(item, model)) {
			deleteNonApplicableFlexStyles(item, model, model.cssStyles);
		}
		
		setFlexAlignSelfStyles(item, model, model.cssStyles);
	
		if (isArtboardSnapshot==false) {
			setOverflowOptions(model.cssStyles, model.overflow, OverflowOptions.VISIBLE);
		}
	
		if (globalArtboardModel.setStylesInline) {
			setStylePropertiesInline(item, model);
		}
	
		if (globalArtboardModel.addDataNames) {
			setSceneNodeAttributes(model.attributes, model);
		}
		
		addInteractions(item, model, model.cssStyles);

		setIdAttribute(item, model, model.attributes);

		setClassAttribute(item, model);

		setStateInformation(item, model);
	
		embedImage = determineEmbedImage(model, globalArtboardModel);

		addToRenditions(item, model, globalArtboardModel.defaultRenditionScales, null, null, embedImage);
		
		setImageSourceAttribute(item, model, artboardModel);

		setTagNames(item, model);

		setCursor(item, model);

		setSizingOptions(item, model);

		setAdditionalStyles(item, model, model.cssStyles, model.additionalStyles);

		addHoverEffects(item, model);

		setDebugOptions(item, model);

		setHTMLTemplate(item, model);
		
		createStyleRules(item, model);
	}
	else {

		model.tagName = HTMLConstants.DIVISION;
		model.singleTag = true;
		model.addContainer = true;
		model.setAdditionalClassesOnContainer = true;
		model.setAdditionalAttributesOnContainer = true;

		createUniqueItemName(item, model);

		setAlphaStyle(item, model);

		setBlendMode(item, model);

		let hasRotation = item.rotation!=0;

		if (hasRotation) {
			addWarning(MessageConstants.ROTATION_SUPPORT, MessageConstants.rotationSupportMessage + "\" on \"" + model.elementId + "\"");
			//setSVGContainerStyles(item, model, true, true);
			setRotation(item, model.cssStyles, true);
		}
		else {
			//setSVGContainerStyles(item, model, true, true);
		}

		setDropShadow(item, model);

		setBlur(item, model);
		
		setSize(model.cssStyles, model.groupBounds, model.alternateWidth, model.alternateHeight);

		setPositionStyles(item, model);

		if (getIsFlexItem(item, model)) {
			deleteNonApplicableFlexStyles(item, model, model.cssStyles);
		}
		
		setFlexAlignSelfStyles(item, model, model.cssStyles);

		setOverflowOptions(model.cssStyles, model.overflow, OverflowOptions.VISIBLE);

		setDisplayStyle(item, model, model.cssStyles);

		if (globalArtboardModel.setStylesInline) {
			setContainerStylePropertiesInline(item, model);
		}
	
		addInteractions(item, model, model.cssStyles);

		setIdAttribute(item, model, model.attributes);

		setClassAttribute(item, model);

		setStateInformation(item, model);

		setTagNames(item, model);

		setCursor(item, model);

		setSizingOptions(item, model);

		setAdditionalStyles(item, model, model.cssStyles, model.additionalStyles);

		addHoverEffects(item, model);

		setDebugOptions(item, model);

		createStyleRules(item, model);
	}
}

/**
 * Export Line. This exports as a path for now and then removes the transform and viewbox styles.
 * @param {SceneNode} item 
 * @param {Model} model 
 **/
function exportLine(item, model) {
	model.tagName = HTMLConstants.PATH;
	model.addSVGContainer = true;
	model.addEndTag = true;
	model.singleTag = false;

	var previousExportStyle = true;//lineItem.rotation==0;

	if (previousExportStyle) {
		exportPath(item, model, true);
		//deleteTransformStyle(lineItem, model.svgStyles);
		//deleteViewBoxStyle(lineItem, model.svgAttributes);
		return;
	}

	createUniqueItemName(item, model);

	setAlphaStyle(item, model);

	setBlendMode(item, model, model.svgStyles);

	setDropShadow(item, model, model.svgStyles);

	setBlur(item, model);

	setDisplayStyle(item, model, model.svgStyles);

	//setSVGContainerStyles(item, model);
	let hasRotation = item.rotation!=0;
	let rotation = item.rotation;

	if (hasRotation) {
		var newCode = globalModel.useRotation2;
		addWarning(MessageConstants.ROTATION_SUPPORT, MessageConstants.rotationSupportMessage + "\" on \"" + model.elementId + "\"");

		if (newCode) {
			setSVGContainerSize(item, model, true);
			setSVGContainerAbsolutePosition(item, model);
			setSVGContainerOverflowVisible(item, model);
			setTransformStyles2(item, model, model.svgStyles);
		}
	}

	setPositionStyles(item, model, model.svgStyles);

	if (getIsFlexItem(item, model)) {
		deleteNonApplicableFlexStyles(item, model, model.svgStyles);
	}
		
	setFlexAlignSelfStyles(item, model, model.svgStyles);

	// set graphic primitives overflow to visible to prevent strokes from being clipped
	setOverflowOptions(model.svgStyles, model.overflow, OverflowOptions.VISIBLE);
	setSVGContainerAttributes(item, model);

	if (globalArtboardModel.addDataNames) {
		setSceneNodeAttributes(model.svgAttributes, model);
	}

	setGraphicFillStyles(item, model, model.exportSVGStylesAsAttributes);
	setGraphicStrokeStyles(item, model, model.exportSVGStylesAsAttributes);
	
	addInteractions(item, model, model.svgStyles);

	setIdAttribute(item, model, model.attributes);

	setClassAttribute(item, model);

	setStateInformation(item, model);

	setTagNames(item, model);

	setCursor(item, model);

	setPathData(item, model);

	setSizingOptions(item, model);

	setAdditionalStyles(item, model, model.svgStyles, model.additionalStyles);

	setAdditionalStyles(item, model, model.cssStyles, model.subStyles);

	addHoverEffects(item, model);

	setDebugOptions(item, model);

	createStyleRules(item, model);
}

/**
 * Export a polygon. 
 * We set graphic primitives overflow to visible to prevent strokes from being clipped
 * @param {SceneNode} item 
 * @param {Model} model 
 **/
function exportPolygon(item, model) {
	exportPath(item, model);
}

/**
 * Export a path. 
 * We set graphic primitives overflow to visible to prevent strokes from being clipped
 * @param {SceneNode} item 
 * @param {Model} model 
 * @param {Boolean} exportLine 
 **/
function exportPath(item, model, exportLine = false) {
	model.tagName = HTMLConstants.PATH;
	model.addSVGContainer = true;
	model.addEndTag = true;
	model.singleTag = false;

	createUniqueItemName(item, model);

	setAlphaStyle(item, model);

	setBlendMode(item, model, model.svgStyles);

	setDropShadow(item, model, model.svgStyles);

	setBlur(item, model);

	setDisplayStyle(item, model, model.svgStyles);

	let hasRotation = item.rotation!=0;

	// set graphic primitives overflow to visible to prevent strokes from being clipped
	var defaultOverflow = model.getDefaultOverflowValue(item);
	setOverflowOptions(model.svgStyles, model.overflow, defaultOverflow);
	setSVGContainerAbsolutePosition(item, model);
	setSVGContainerSize(item, model);

	if (hasRotation) {
		var newCode = globalModel.useRotation2;
		
		if (newCode) {
			setSVGContainerSize(item, model, true);		
			setTransformStyles2(item, model, model.svgStyles);
			setHorizontalPosition(item, model, model.svgStyles);
			setVerticalPosition(item, model, model.svgStyles);
		}
		else {
			setRotation(item, model.svgStyles, false);
		}
	}
	else {
		//setSVGContainerTop(item, model);
		//setSVGContainerLeft(item, model);

		setHorizontalPosition(item, model, model.svgStyles);
		setVerticalPosition(item, model, model.svgStyles);
		setTransformStyle(item, model.svgStyles, true);
	}

	setPositionStyles(item, model, model.svgStyles);

	if (getIsFlexItem(item, model)) {
		deleteNonApplicableFlexStyles(item, model, model.svgStyles);
	}
		
	setFlexAlignSelfStyles(item, model, model.svgStyles);

	setGraphicFillStyles(item, model, model.exportSVGStylesAsAttributes);
	setGraphicStrokeStyles(item, model, model.exportSVGStylesAsAttributes);

	if (globalArtboardModel.addDataNames) {
		setSceneNodeAttributes(model.svgAttributes, model);
	}
	
	addInteractions(item, model, model.svgStyles);

	setIdAttribute(item, model, model.attributes);

	setClassAttribute(item, model);

	setStateInformation(item, model);

	setSVGContainerViewBox(item, model);

	setSVGContainerAttributes(item, model);

	setTagNames(item, model);

	setCursor(item, model);

	setPathData(item, model);

	setSizingOptions(item, model);

	setAdditionalStyles(item, model, model.svgStyles, model.additionalStyles);

	setAdditionalStyles(item, model, model.cssStyles, model.subStyles);

	addHoverEffects(item, model);

	setDebugOptions(item, model);

	createStyleRules(item, model);
}

/**
 * Export Rectangle. Rectangle can be exported as an SVG Rectangle 
 * or as a DIV 
 * @param {SceneNode} item 
 * @param {Model} model 
 **/
function exportRectangle(item, model) {
	var hasRotation = item.rotation!=0;

	// export as a DIV 
	if (model.exportRectangleAsDiv && hasRotation==false) {
		model.tagName = HTMLConstants.DIVISION;
		model.addEndTag = true;
		model.singleTag = false;

		createUniqueItemName(item, model);

		setAlphaStyle(item, model);

		setBlendMode(item, model, model.svgStyles);

		setDropShadow(item, model, model.cssStyles);

		setBlur(item, model);

		setDisplayStyle(item, model, model.cssStyles);

		setContainerStyles(item, model);
		setHorizontalPosition(item, model, model.cssStyles);
		setVerticalPosition(item, model, model.cssStyles);
		
		if (globalArtboardModel.addDataNames) {
			setSceneNodeAttributes(model.attributes, model);
		}

		if (hasRotation) {
			var newCode = globalModel.useRotation2;
			addWarning(MessageConstants.ROTATION_SUPPORT, MessageConstants.rotationSupportMessage + "\" on \"" + model.elementId + "\"");

			if (newCode) {
				setTransformStyles2(item, model, model.cssStyles);
			}
		}

		setPositionStyles(item, model);

		if (getIsFlexItem(item, model)) {
			deleteNonApplicableFlexStyles(item, model, model.cssStyles);
		}
		
		setFlexAlignSelfStyles(item, model, model.cssStyles);

		setBackgroundFillStyles(item, model, model.cssStyles);
		setBorderStyles(item, model, model.cssStyles);

		setOverflowOptions(model.cssStyles, model.overflow, OverflowOptions.HIDDEN);

		addInteractions(item, model, model.svgStyles);

		setIdAttribute(item, model, model.attributes);

		setClassAttribute(item, model);

		setStateInformation(item, model);

		setTagNames(item, model);

		setCursor(item, model);

		setSizingOptions(item, model);

		setAdditionalStyles(item, model, model.cssStyles, model.additionalStyles);

		addHoverEffects(item, model);

		setDebugOptions(item, model);

		createStyleRules(item, model);

		return;
	}

	// EXPORTING AS SVG RECTANGLE
	model.tagName = HTMLConstants.RECTANGLE;
	model.addSVGContainer = true;
	model.addEndTag = true;
	model.singleTag = false;

	createUniqueItemName(item, model);

	setAlphaStyle(item, model);

	setBlendMode(item, model, model.svgStyles);

	setDropShadow(item, model, model.svgStyles);

	setBlur(item, model);

	setDisplayStyle(item, model, model.svgStyles);

	setSVGContainerAttributes(item, model);
	
	if (globalArtboardModel.addDataNames) {
		setSceneNodeAttributes(model.svgAttributes, model);
	}

	if (hasRotation) {
		var newCode = globalModel.useRotation2;
		addWarning(MessageConstants.ROTATION_SUPPORT, MessageConstants.rotationSupportMessage + "\" on \"" + model.elementId + "\"");

		if (newCode) {
			setSVGContainerSize(item, model, true);
			setSVGContainerAbsolutePosition(item, model);
			setSVGContainerOverflowVisible(item, model);
			setTransformStyles2(item, model, model.svgStyles);

			//setHorizontalPosition(item, model, model.svgStyles);
			//setVerticalPosition(item, model, model.svgStyles);
		}
	}
	else {
		setSVGContainerStyles(item, model, true, false);
		setHorizontalPosition(item, model, model.svgStyles);
		setVerticalPosition(item, model, model.svgStyles);
	}

	setPositionStyles(item, model, model.svgStyles);

	if (getIsFlexItem(item, model)) {
		deleteNonApplicableFlexStyles(item, model, model.svgStyles);
	}
	
	setFlexAlignSelfStyles(item, model, model.svgStyles);

	//setElementStyles(item, model);
	setGraphicFillStyles(item, model, model.exportSVGStylesAsAttributes);
	setGraphicStrokeStyles(item, model, model.exportSVGStylesAsAttributes);

	setOverflowOptions(model.svgStyles, model.overflow, OverflowOptions.VISIBLE);

	//setElementAttributes(item, model);
	
	addInteractions(item, model, model.svgStyles);

	setIdAttribute(item, model, model.attributes);

	setClassAttribute(item, model);

	setStateInformation(item, model);

	setRectangleAttributes(item, model);

	setTagNames(item, model);

	setCursor(item, model);

	setSizingOptions(item, model);

	setAdditionalStyles(item, model, model.svgStyles, model.additionalStyles);

	setAdditionalStyles(item, model, model.cssStyles, model.subStyles);

	addHoverEffects(item, model);

	setDebugOptions(item, model);

	createStyleRules(item, model);
}

/**
 * Export Component
 * @param {SceneNode} item 
 * @param {Model} model 
 **/
function exportComponent(item, model) {
	
	exportGroup(item, model, false, true);
}

/**
 * Export Repeat Grid. 
 * @param {SceneNode} item 
 * @param {Model} model 
 **/
function exportRepeatGrid(item, model) {

	exportGroup(item, model, true);
}

/**
 * Export text. The getTextValue formats the text string
 * @param {SceneNode} item 
 * @param {Model} model 
 **/
function exportText(item, model) {
	var b = model.debug==true;
	model.tagName = HTMLConstants.DIVISION;
	model.addEndTag = true;
	model.singleTag = true; // because we use markup inside
	var hasMarkupInside = model.markupInside!=null && model.markupInside!="";
	var hasRotation = item.rotation!=0;

	createUniqueItemName(item, model);

	setAlphaStyle(item, model);

	setBlendMode(item, model);

	setDropShadow(item, model);

	setBlur(item, model);

	setDisplayStyle(item, model, model.cssStyles);

	if (hasRotation) {
		var newCode = globalModel.useRotation2;
		addWarning(MessageConstants.ROTATION_SUPPORT, MessageConstants.rotationSupportMessage + "\" on \"" + model.elementId + "\"");

		if (newCode) {
			//setSVGContainerSize(item, model, true);
			setTransformStyles2(item, model, model.cssStyles);
		}
	}

	// rotation is set in here as well
	setHorizontalPosition(item, model);
	setVerticalPosition(item, model);

	setPositionStyles(item, model);

	if (getIsFlexItem(item, model)) {
		deleteNonApplicableFlexStyles(item, model, model.cssStyles);
	}

	setFlexAlignSelfStyles(item, model, model.cssStyles);
	var defaultOverflow = model.getDefaultOverflowValue(item);
	
	// if area box hide overflow
	if (item.areaBox!=null) {
		// hide overflow content by default since fonts are an issue and element is not a text area
		setOverflowOptions(model.cssStyles, model.overflow, defaultOverflow);
		//setTextContainerSizeStyles(item, model);
		setTextContainerWidth(item, model);
		setTextContainerHeight(item, model);
	}
	else {
		setOverflowOptions(model.cssStyles, model.overflow, defaultOverflow);
		setTextContainerWidth(item, model);

		// set default sizing to width for point text
		if ((model.alternateHeight!=null && model.alternateHeight!="") || (model.sizing==Styles.HEIGHT || model.sizing==XDConstants.BOTH)) {
			setTextContainerHeight(item, model);
		}

		setWhiteSpaceNoWrap(item, model);
		// fonts are positioned at em size and not caps height 
		// so you need the font installed
	}
	
	if (globalArtboardModel.addDataNames) {
		setSceneNodeAttributes(model.attributes, model);
	}
	
	addInteractions(item, model, model.cssStyles);

	setIdAttribute(item, model, model.attributes);

	setClassAttribute(item, model);

	setStateInformation(item, model);

	setTagNames(item, model);

	setCursor(item, model);

	// get the text values and styles
	setTextProperties(item, model);

	// if has markup inside replace text content
	if (hasMarkupInside) {
		model.innerContent = model.markupInside;
	}

	setSizingOptions(item, model);

	setAdditionalStyles(item, model, model.cssStyles, model.additionalStyles);

	addHoverEffects(item, model);

	setDebugOptions(item, model);

	createStyleRules(item, model);

}

/**
 * Set additional styles. Use -all or -styles to remove all styles or -styleName to remove an individual style
 * Use style name by itself to add the style if all the styles were removed using -all.
 * @param {SceneNode} item 
 * @param {Model} model 
 * @param {Object} styles 
 * @param {String} additionalStyles 
 **/
function setAdditionalStyles(item, model, styles, additionalStyles = null) {
	var stylesArray;
	var style = null;
	var name = null;
	var trimmedName = null;
	var value = null;
	var styleValue = null;
	var originalStyles = styles!=null ? Object.assign({}, styles) : null;
	var removeStyleName = null;

	var parentModel = item && item.parent && getModel(item.parent);
	var isRepeatGridParent = item && item.parent instanceof RepeatGrid;

	if (isRepeatGridParent) {
		additionalStyles = parentModel.subStyles;
	}

	if (additionalStyles) {
		stylesArray = additionalStyles.split(";");

		if (stylesArray.length) {

			for(var i=0;i<stylesArray.length;i++) {
				style = trim(stylesArray[i]);
				styleValue = style.split(":");
				name = styleValue.length==1 ? trim(styleValue[0]) : null;

				// special value to remove all styles
				if (style=="-all" || style=="-styles") {
					deleteProperties(styles);
					continue;
				}

				// special value to remove all styles
				if (style=="-text") {
					deleteProperties(styles, null, null, Styles.TEXT_STYLES);
					continue;
				}
				
				// name and value are defined
				if (styleValue.length>1) {
					name = trim(styleValue[0]);
					value = styleValue[1];
					styles[name] = value;
				}

				// check if style is to be removed. single value with minus "-width"
				else if (name && name.indexOf("-")==0) {
					removeStyleName = trim(name.substr(1));
					
					if (removeStyleName!="" && removeStyleName!=null) {
						delete styles[removeStyleName];
					}
				}

				// check if style is to be added. single value "width"
				else if (name!="" && name!=null) {

					if (styleValue[0] in originalStyles) {
						styles[name] = originalStyles[name];
					}
				}
			}
		}
		else{
			styles[additionalStyles] = "";
		}
	}
}

/**
 * Set additional classes
 * @param {SceneNode} item 
 * @param {Model|ArtboardModel} model 
 **/
function setClassAttribute(item, model) {
	var className = model.elementId;
	var classNamePost = model.elementId + globalArtboardModel.classNamePost;
	var classes = [...model.classesArray];
	var isText = item && item instanceof Text;
	var isHTML = model.isHTML;
	var isGroup = model.type==XDConstants.GROUP;
	var isSymbol = model.type==XDConstants.SYMBOL_INSTANCE;
	var parentModel = item && item.parent && getModel(item.parent);
	var isRepeatGridParent = item && item.parent instanceof RepeatGrid;
	var exportAsImage = isExportAsImage(item, model);
	var markupOnly = globalArtboardModel.markupOnly;
	var isArtboard = getIsArtboard(item);

	if (model.svgUseClasses && markupOnly==false) {
		className = model.elementId;
		model.svgClassesArray.push(className);
	}

	if (globalArtboardModel.useClassesToStyleElements && markupOnly==false) {
		
		if (isArtboard) {
			if (model instanceof ArtboardModel && model.addRootContainer) {
				model.classesArray.push(classNamePost);
			}
			else {
				model.containerClassesArray.push(classNamePost);
			}
		}
		else {

			if (model.addContainer) {
				model.containerClassesArray.push(classNamePost);
			}
			else {
				model.classesArray.push(classNamePost);
			}
		}
	}

	if (isText || isHTML || exportAsImage) {

		if (model.additionalClasses!=null && model.additionalClasses!="") {
			model.classesArray.push(model.additionalClasses);
		}

		if (model.subClasses!=null && model.subClasses!="") {
			model.subClassesArray.push(model.subClasses);
		}
	}
	else {

		if (isArtboard && model.additionalClasses!=null && model.additionalClasses!="") {
			model.classesArray.push(model.additionalClasses);
		}
		else if (model.additionalClasses!=null && model.additionalClasses!="") {
			model.containerClassesArray.push(model.additionalClasses);
			model.svgClassesArray.push(model.additionalClasses);
		}
	
		if (isGroup==false && isSymbol==false) {
			if (model.subClasses!=null && model.subClasses!="") {
				model.classesArray.push(model.subClasses);
			}
		}
	}

	if (model.containerClassesArray.length) {
		model.containerAttributes.class = model.containerClassesArray.join(" ");
	}

	if (model.svgClassesArray.length) {
		model.svgAttributes.class = model.svgClassesArray.join(" ");
	}

	if (model.classesArray.length) {
		model.attributes.class = model.classesArray.join(" ");
	}
}

/**
 * Set the tag names. This function is doing too much. Todo: Break it up or set it in the caller
 * @param {SceneNode} item 
 * @param {Model} model 
 **/
function setCursor(item, model) {
	var cursor = model.cursor;

	if (cursor!=null && cursor!="" && cursor!="default") {		
		model.cssStyles[Styles.CURSOR] = cursor;
	}
}

/**
 * Set the tag names. This function is doing too much. Todo: Break it up or set it in the caller
 * @param {SceneNode} item 
 * @param {Model} model 
 **/
function setTagNames(item, model) {
	var isArtboard = item && item instanceof Artboard;
	var parentModel = item && item.parent && getModel(item.parent);
	var isRepeatGridParent = item && item.parent instanceof RepeatGrid;
	var exportAsImage = isExportAsImage(item, model);
	var containerTagName = model.containerTagName;
	var isGroup = false;
	var isSVG = item && isSVGElement(item);
	var isBooleanGroup = item instanceof BooleanGroup;
	var tagName = null;
	var isSingleTag = model.singleTag;
	var isHTML = model.isHTML;

	// after extensive trouble with this function i would put these each in their own function
	if (item && item.isContainer && isBooleanGroup==false) {
		isGroup = true;
	}
  
	if (isArtboard) {

		if (model.subTagName) {
			tagName = model.subTagName;
		}
		else {
			tagName = model.tagName;
		}

		if (model.alternateTagName) {
			containerTagName = model.alternateTagName;
			tagName = model.alternateTagName;
		}
		else if (exportAsImage) {
			containerTagName = HTMLConstants.IMAGE;
			tagName = HTMLConstants.IMAGE;
		}
		else {
			containerTagName = model.containerTagName;
		}
	}
	else if (isGroup) {
	 
		// if it's a repeat grid item use the subtag name
		if (isRepeatGridParent && parentModel && parentModel.subTagName!=null) {
			containerTagName = parentModel.subTagName;
		}
		else if (model.alternateTagName) {
			containerTagName = model.alternateTagName;
		}
		else if (isHTML) {
			containerTagName = model.tagName;
		}
		else if (exportAsImage) {
			containerTagName = HTMLConstants.IMAGE;
		}
		else {
			containerTagName = model.containerTagName;
		}
 
	 }
	 else if (isSVG) {
 
		// svg container
		if (model.alternateTagName) {
			containerTagName = model.alternateTagName;
		}
		else if (isHTML) {
			containerTagName = model.tagName;
		}
		else if (exportAsImage) {
			containerTagName = HTMLConstants.IMAGE;
		}
		else {
			containerTagName = model.svgTagName;
		}

		// svg element
		if (item && item.parent instanceof RepeatGrid && parentModel && parentModel.subTagName!=null) {
			tagName = parentModel.subTagName;
		}
		else if (isHTML) {
			tagName = model.tagName;
		}
		else if (exportAsImage) {
			tagName = HTMLConstants.IMAGE;
		}
		else if (model.subTagName) {
			tagName = model.subTagName;
		}
		else {
			tagName = model.tagName;
		}

	}
	else {

		if (exportAsImage) {
			containerTagName = HTMLConstants.IMAGE;
		}

		if (model.alternateTagName) {
			tagName = model.alternateTagName;
		}
		else if (item && item.parent instanceof RepeatGrid && parentModel && parentModel.subTagName!=null) {
			tagName = parentModel.subTagName;
		}
		else {
			tagName = model.tagName;
		}
	}

	if (exportAsImage || isHTML) {
		//model.elementTagName = HTMLConstants.IMAGE;
		//model.elementSubTagName = HTMLConstants.IMAGE;

		if (isSingleTag) {
			model.elementTagName = containerTagName;
			model.elementSubTagName = containerTagName;
		}
		else {
			model.elementTagName = containerTagName;
			model.elementSubTagName = containerTagName;
		}
	}
	else if (isSVG) {
		model.elementTagName = containerTagName;
		model.svgTagName = containerTagName;
		model.elementSubTagName = tagName;
	}
	else if (isSingleTag) {
		model.elementTagName = containerTagName;
		model.elementSubTagName = tagName;
	}
	else {
		model.elementTagName = containerTagName;
		model.elementSubTagName = tagName;
	}

}

/**
 * Creates style rules for export item. Still in progress
 * @param {SceneNode} item 
 * @param {Model} model 
 **/
function createStyleRules(item, model) {
	var className = model.elementId + globalArtboardModel.classNamePost;
	var space = " ";
	var selector = "";
	var cssStyles = model.cssStyles;
	var svgStyles = model.svgStyles;
	 
	// adding CSS styles
	if (hasProperties(cssStyles)) {

		if (model.useSelector) {
			selector = model.selector;
		}
		else if (globalArtboardModel.useClassesToStyleElements) {
			selector = getCSSClass(className);
		}
		else {
			selector = getCSSID(model.elementId);
		}

		var styleRule = new StyleRule();
		styleRule.selectorText = selector;
		var styleDeclaration = styleRule.style;
		styleDeclaration.setProperties(cssStyles);

		model.styleRules.push(styleRule);
	}

	// adding SVG styles
	if (hasProperties(svgStyles)) {
		
		if (model.svgUseClasses) {
			selector = getCSSClass(model.elementId);
		 }
		 else {
			selector = getCSSID(model.elementId);
		 }

		var styleRule = new StyleRule();
		styleRule.selectorText = selector;
		var styleDeclaration = styleRule.style;
		styleDeclaration.setProperties(svgStyles);

		model.styleRules.push(styleRule);
	}
}

/**
 * Gets hover effects style declaration
 * @param {SceneNode} item 
 * @param {Model} model 
 **/
function addHoverEffects(item, model) {
	var className = model.elementId + globalArtboardModel.classNamePost;
	var hoverElementGUID = model.hoverElementGUID;
	var hoverElement = null;
	var hoverModel = null;
	var pseudoType = "hover";
	var selector = "";
	var sourceProperties = null;
	var targetProperties = null;
	var hoverProperties = null;
	var transition = true;
	var transitionValue = "all .3s ease-out";

	try {

		if (hoverElementGUID) {

			hoverElement = getSceneNodeByGUID(hoverElementGUID);
			
			if (hoverElement) {
				hoverModel = getModel(hoverElement);
				
				if (hoverModel==null) {
					hoverModel = new Model();
					hoverModel.exportSVGStylesAsAttributes = false;
					hoverModel = createModel(hoverElement, model.nestLevel, 0, false, true, hoverModel);
				}

				if (model.additionalStyles && model.additionalStyles.indexOf("transition")!=-1 ||
						model.subStyles && model.subStyles.indexOf("transition")!=-1) {
					transition = false;
				}
				
				// css styles
				if (hasProperties(model.cssStyles)) {

					if (model.useSelector) {
						selector = model.selector;
					}
					else if (globalArtboardModel.useClassesToStyleElements) {
						selector = getCSSClass(className);
					}
					else {
						selector = getCSSID(model.elementId);
					}
					
					hoverProperties = getChangedPropertiesObject(hoverModel.cssStyles, model.cssStyles, Styles.HOVER_STYLES);

					if (hasProperties(hoverProperties)) {

						var styleRule = new StyleRule();
						styleRule.selectorText = selector + ":" + pseudoType;
						var styleDeclaration = styleRule.style;
						styleDeclaration.setProperties(hoverProperties);

						if (transition) {
							model.cssStyles[Styles.TRANSITION] = transitionValue;
						}

						model.styleRules.push(styleRule);
					}
				}
				
				// add svg css
				if (hasProperties(model.svgStyles)) {
					
					if (model.svgUseClasses) {
						selector = getCSSClass(model.elementId);
					}
					else {
						selector = getCSSID(model.elementId);
					}
					
					hoverProperties = getChangedPropertiesObject(hoverModel.svgStyles, model.svgStyles, Styles.HOVER_STYLES);
					
					if (hasProperties(hoverProperties)) {

						var styleRule = new StyleRule();
						styleRule.selectorText = selector + ":" + pseudoType;
						var styleDeclaration = styleRule.style;
						styleDeclaration.setProperties(hoverProperties);

						if (transition) {
							model.svgStyles[Styles.TRANSITION] = transitionValue;
						}

						model.styleRules.push(styleRule);
					}
				}
			}
		}
	}
	catch(error) {
		log(error);
	}

}

/**
 * Get changed properties object. Returns StyleRule with style declaration containing properties
 * @param {SceneNode} item 
 * @param {Model} model 
 * @param {SceneNode} stylesElement
 * @returns {Array}
 **/
function getChangedStylesObject(item, model, stylesElement) {
	var className = model.elementId + globalArtboardModel.classNamePost;
	var hoverModel = null;
	var pseudoType = "hover";
	var selector = "";
	var sourceProperties = null;
	var targetProperties = null;
	var hoverProperties = null;
	var transition = true;
	var transitionValue = "all .3s ease-out";
	var styleRule = new StyleRule();
	var styleDeclaration = styleRule.style;
	var styleRules = [];

	try {


		// get the export / computed styles 
		model = createModel(item, model.nestLevel, 0, false, true, model);
		
		hoverModel = new Model();
		hoverModel.exportSVGStylesAsAttributes = false;
		hoverModel = createModel(stylesElement, model.nestLevel, 0, false, true, hoverModel);
	

		if (model.additionalStyles && model.additionalStyles.indexOf("transition")!=-1 ||
				model.subStyles && model.subStyles.indexOf("transition")!=-1) {
			transition = false;
		}

		styleRule = new StyleRule();
		styleDeclaration = styleRule.style;
		
		// css styles
		if (hasProperties(model.cssStyles)) {

			if (model.useSelector) {
				selector = model.selector;
			}
			else if (globalArtboardModel.useClassesToStyleElements) {
				selector = getCSSClass(className);
			}
			else {
				selector = getCSSID(model.elementId);
			}
			
			hoverProperties = getChangedPropertiesObject(hoverModel.cssStyles, model.cssStyles, Styles.HOVER_STYLES);

			if (hasProperties(hoverProperties)) {
				styleRule.selectorText = PageToken.SELECTOR_TOKEN + ":" + pseudoType;
				styleDeclaration.setProperties(hoverProperties);

				if (transition) {
					//model.cssStyles[Styles.TRANSITION] = transitionValue;
				}
				styleRules.push(styleRule)
			}
		}
		
		// add svg css
		if (hasProperties(model.svgStyles)) {
			
			if (model.svgUseClasses) {
				selector = getCSSClass(model.elementId);
			}
			else {
				selector = getCSSID(model.elementId);
			}
			
			hoverProperties = getChangedPropertiesObject(hoverModel.svgStyles, model.svgStyles, Styles.HOVER_STYLES);
			
			if (hasProperties(hoverProperties)) {
				styleRule = new StyleRule();
				styleRule.selectorText = PageToken.SELECTOR2_TOKEN + ":" + pseudoType;
				styleDeclaration = styleRule.style;
				styleDeclaration.setProperties(hoverProperties);

				if (transition) {
					//model.svgStyles[Styles.TRANSITION] = transitionValue;
				}

				styleRules.push(styleRule);
			}
		}
	}
	catch(error) {
		log(error);
	}

	return styleRules;
}

/**
 * Adds interaction
 * @param {SceneNode} item 
 * @param {Model} model 
 * @param {Object} style 
 * @param {Object} attributes 
 **/
function addInteractions(item, model, style, attributes = null) {
	var b = debugModel.addInteractions;
	var interactions = getInteractions(item);
	var parentArtboard = getArtboard(item);
	var parentArtboardModel = getArtboardModel(parentArtboard)
	var destinationArtboardModel = null;
	var cssTransitionName = Styles.TRANSITION;
	var cssAnimationVariableName = Styles.ANIMATION_DATA;
	var cssTargetVariableName = Styles.ACTION_TARGET;
	var cssTargetTypeName = Styles.ACTION_TYPE;
	var animation = "";

	if (attributes==null) {
		attributes = model.attributes;
	}

	try {
		for (let index = 0; index < interactions.length; index++) {
			var interaction = interactions[index];
			var trigger = interaction.trigger;
			var triggerType = trigger.type;
			var action = interaction.action;
			var actionType = action.type;
			var actionDestination = action.destination;
			var actionOverlay = action.overlay;
			var overlayTopLeft = action.overlayTopLeft;
			var keyframeCreated = false;
			
			//log("action", action)
			b && log("Element " + model.name);
			b && log("Trigger: " + triggerType + " -> Action: " + actionType);

			// TAP ACTION 
			if (triggerType==TriggerType.TAP) {
				const transition = action.transition;
				const transitionType = transition && transition.type;
				const transitionDuration = transition && transition.duration;
				const transitionEasing = transition && transition.easing;

				b && log("Transition Type: " + transitionType + " -> Transition Duration: " + transitionDuration + " -> Easing: " + transitionEasing);

				
				// GO TO ARTBOARD
				if (actionType==ActionType.GO_TO_ARTBOARD && model.inheritPrototypeLink) {
					var keyframesRule = new KeyframesRule();
					
					if (transitionType==TransitionType.DISSOLVE) {
						keyframesRule = addDissolve(action);
						keyframeCreated = true;
						//b && log("keyframesRule: ", keyframesRule);
					}
					
					if (transitionType==TransitionType.AUTO_ANIMATE) {
						keyframesRule = addDissolve(action);
						keyframeCreated = true;
						style[cssTransitionName] = "all " + transitionDuration + "s " + transitionEasing;
						b && log("style: ", style);
					}
					
					destinationArtboardModel = getArtboardModel(actionDestination);
					var fadeInAdded = keyframeCreated && hasStyleRule(parentArtboardModel, keyframesRule.name);
					
					if (keyframesRule && fadeInAdded==false) {
						b && log("parentArtboardModel.name: " + parentArtboardModel.name);
						parentArtboardModel.styleRules.push(keyframesRule);
					}

					animation = "fadein " + transitionDuration + "s " + transitionEasing;
					b && log("animation: " + animation);
					
					style[cssAnimationVariableName] = animation;
					
					if (globalModel.exportToSinglePage) {
						style[cssTargetTypeName] = XDConstants.VIEW;
						style[cssTargetVariableName] = destinationArtboardModel.elementId;
					}
					else {
						style[cssTargetTypeName] = XDConstants.PAGE;
						style[cssTargetVariableName] = destinationArtboardModel.getFilename();;
					}

					style[Styles.CURSOR] = Styles.POINTER;

					attributes[Events.ON_CLICK] = "application.goToTargetView(event)";
				}
				// SHOW OVERLAY
				else if (actionType==ActionType.OVERLAY) {
					// this does not support anchoring at this point (except horizontal and vertical centering)
					destinationArtboardModel = getArtboardModel(actionOverlay);
					var destinationStyles = destinationArtboardModel.cssStyles;
					attributes[Events.ON_CLICK] = "application.showOverlay(event,'" + destinationArtboardModel.elementId + "'," + overlayTopLeft.x + "," + overlayTopLeft.y + ")";
					style[Styles.CURSOR] = Styles.POINTER;
					
					var fadeInAdded = hasStyleRule(destinationArtboardModel, transitionType);
					
					if (fadeInAdded==false && transitionType==TransitionType.DISSOLVE) {
						animation = "fadein " + transitionDuration + "s " + transitionEasing;
						keyframesRule = addDissolve(action);
						destinationArtboardModel.styleRules.push(keyframesRule); // not added? 
						
						// maybe add all animations to global styles 
						fadeInAdded = hasStyleRule(destinationArtboardModel, transitionType);
						if (fadeInAdded==false) {
							parentArtboardModel.styleRules.push(keyframesRule);
						}
					}
					else if (fadeInAdded==false && transitionType==TransitionType.SLIDE) {
						keyframesRule = addSlideIn(action);
						animation = keyframesRule.name + " " + transitionDuration + "s " + transitionEasing + " forwards";
						destinationArtboardModel.styleRules.push(keyframesRule); // not added? 
						
						// maybe add all animations to global styles 
						fadeInAdded = hasStyleRule(destinationArtboardModel, transitionType);
						if (fadeInAdded==false) {
							parentArtboardModel.styleRules.push(keyframesRule);
						}
					}

					style[cssAnimationVariableName] = animation;
					
					if (globalModel.exportToSinglePage) {
						style[cssTargetTypeName] = XDConstants.VIEW;
						style[cssTargetVariableName] = destinationArtboardModel.elementId;
					}
					else {
						style[cssTargetTypeName] = XDConstants.PAGE;
						style[cssTargetVariableName] = destinationArtboardModel.getFilename();
					}
					
					// todo add overlay to a connected artboards array and show warning if not exported
				}
				// GO BACK TO PREVIOUS ARTBOARD
				else if (actionType==ActionType.GO_BACK) {
					attributes[Events.ON_CLICK] = "application.goBack()";
					style[Styles.CURSOR] = Styles.POINTER;
				}
		
			}

		}	
	}
	catch(error) {
		log(error);
	}
}

/**
 * Get the interactions
 * @param {SceneNode} item 
 * @return {Array}
 **/
function getInteractions(item) {

	try {
		var interactions = item.triggeredInteractions;
		return interactions;
	}
	catch(error) {

		// when an interaction(s) is added to an node and one does not have an endpoint the following errors happen
		// Plugin TypeError: Cannot read property 'pluginWrapper' of null
    	// at Interaction.serializeForApi (lib/interactions/Interaction.js:1:11398)
    	// at forEach.e (plugins/ScenegraphWrappers.js:1:11918)
    	// at Array.forEach (<anonymous>)
		 // at Text.get (plugins/ScenegraphWrappers.js:1:11896)
		 

		return [];
	}

	return [];
}

/**
 * Get the number of interactions
 * @param {SceneNode} item 
 * @return {Number}
 **/
function getNumberOfInteractions(item, model) {

	try {
		var interactions = item.triggeredInteractions;
		return interactions.length;
	}
	catch(error) {

		// when an interaction(s) is added to an node and one does not have an endpoint the following errors happen
		// Plugin TypeError: Cannot read property 'pluginWrapper' of null
    	// at Interaction.serializeForApi (lib/interactions/Interaction.js:1:11398)
    	// at forEach.e (plugins/ScenegraphWrappers.js:1:11918)
    	// at Array.forEach (<anonymous>)
		 // at Text.get (plugins/ScenegraphWrappers.js:1:11896)
		 

		return 0;
	}

	return 0;
}

/**
 * Gets the artboard tap target
 * @param {SceneNode} item 
 * @param {Model} model 
 * @return {Artboard}
 **/
function getTapTargetDestination(item, model) {
	var interactions = null;

	try {
		interactions = item.triggeredInteractions;
	}
	catch(error) {

		// when an interaction(s) is added to an node and one does not have an endpoint the following errors happen
		// Plugin TypeError: Cannot read property 'pluginWrapper' of null
    	// at Interaction.serializeForApi (lib/interactions/Interaction.js:1:11398)
    	// at forEach.e (plugins/ScenegraphWrappers.js:1:11918)
    	// at Array.forEach (<anonymous>)
		 // at Text.get (plugins/ScenegraphWrappers.js:1:11896)
	
		return null;
	}

	for (let index = 0; index < interactions.length; index++) {
		var interaction = interactions[index];
		var trigger = interaction.trigger;
		var triggerType = trigger.type;
		var action = interaction.action;
		var actionType = action.type;
		var actionDestination = action.destination;

		if (triggerType==TriggerType.TAP && actionType==ActionType.GO_TO_ARTBOARD) {
			return actionDestination;
		}
	}

	return null;
}

/**
 * Returns true if the element has a tap target to another artboard
 * @param {SceneNode} item 
 * @return {Boolean}
 **/
function hasArtboardDestination(item) {
	var interactions = null;

	try {
		interactions = item.triggeredInteractions;

		for (let index = 0; index < interactions.length; index++) {
			var interaction = interactions[index];

			if (interaction.trigger.type==TriggerType.TAP && interaction.action.type==ActionType.GO_TO_ARTBOARD) {
				return true;
			}
		}
	
		return false;
	}
	catch(error) {

		log(error.stack);
		// when an interaction(s) is added to an node and one does not have an endpoint the following errors happen
		// Plugin TypeError: Cannot read property 'pluginWrapper' of null
    	// at Interaction.serializeForApi (lib/interactions/Interaction.js:1:11398)
    	// at forEach.e (plugins/ScenegraphWrappers.js:1:11918)
    	// at Array.forEach (<anonymous>)
		 // at Text.get (plugins/ScenegraphWrappers.js:1:11896)
	
		return false;
	}
}

/**
 * Returns true if the artboard is an overlay to another artboard
 * @param {Artboard} item 
 * @return {Boolean}
 **/
function isArtboardOverlay(item) {
	var interactions = null;

	try {
		interactions = item.incomingInteractions;

		for (let index = 0; index < interactions.length; index++) {
			var interaction = interactions[index];
			var localInteractions = interaction.interactions;

			for (let j = 0; j < localInteractions.length; j++) {
				const localInteraction = localInteractions[j];
				var trigger = localInteraction.trigger;
				var action =  localInteraction.action;
				
				if (trigger && trigger.type==TriggerType.TAP && action && action.type==ActionType.OVERLAY) {
					return true;
				}
			}

		}
	
		return false;
	}
	catch(error) {

		log(error.stack);
		// when an interaction(s) is added to an node and one does not have an endpoint the following errors happen
		// Plugin TypeError: Cannot read property 'pluginWrapper' of null
    	// at Interaction.serializeForApi (lib/interactions/Interaction.js:1:11398)
    	// at forEach.e (plugins/ScenegraphWrappers.js:1:11918)
    	// at Array.forEach (<anonymous>)
		 // at Text.get (plugins/ScenegraphWrappers.js:1:11896)
	
		return false;
	}
}

/**
 * Creates a Dissolve animation
 * @param {Action} action 
 **/
function addDissolve(action, name = "fadein") {
	var keyframesRule = new KeyframesRule();
	const transition = action.transition;
	const transitionType = transition.type;
	const transitionDuration = transition.duration;
	const transitionEasing = transition.easing;

	keyframesRule.name = name;

	var keys = ["0%", "100%"];
	var values = [0, 1];

	for (let i = 0; i < keys.length; i++) {
		const keyText = keys[i];
		const keyRule = new KeyframeRule();
		keyRule.keyText = keys[i];
		keyRule.style.setProperty(Styles.OPACITY, values[i]);
		keyframesRule.appendRule(keyRule);
	}
	
	return keyframesRule;
}

/**
 * Creates a slide in animation
 * @param {Action} action 
 **/
function addSlideIn(action, name = null) {
	var keyframesRule = new KeyframesRule();
	const transition = action.transition;
	const transitionType = transition.type;
	const transitionDuration = transition.duration;
	const transitionEasing = transition.easing;
	const side = transition.fromSide;


	var keys = [];
	var values = [];
	var property = [];

	if (side=="R") {
		keys.push("0%");
		values.push("-100%");
		property.push("translateX");
		keyframesRule.name = "slide-right";
	}
	else if (side=="L") {
		keys.push("0%");
		values.push("100%");
		property.push("translateX");
		keyframesRule.name = "slide-left";
	}
	else if (side=="T") {
		keys.push("0%");
		values.push("-100%");
		property.push("translateY");
		keyframesRule.name = "slide-top";
	}
	else if (side=="B") {
		keys.push("0%");
		values.push("100%");
		property.push("translateY");
		keyframesRule.name = "slide-bottom";
	}

	if (name!=null) {
		keyframesRule.name = name;
	}

	for (let i = 0; i < keys.length; i++) {
		const keyText = keys[i];
		const keyRule = new KeyframeRule();
		keyRule.keyText = keys[i];
		keyRule.style.setProperty(Styles.TRANSFORM, property[i] + "(" + values[i] + ")");
		keyframesRule.appendRule(keyRule);
	}
	
	return keyframesRule;
}

/**
 * Returns true if style rule with specified name is in style rules array
 * @param {Model} model 
 * @param {String} name 
 * @returns {Boolean}
 **/
function hasStyleRule(model, name) {
	var styleRules = model.styleRules;
	var numberOfStyleRules = styleRules.length;

	for (let i = 0; i < numberOfStyleRules; i++) {
		if(styleRules[i].name==name){
			return true;
		}
	}
	
	return false;
}

/**
 * Returns true if element has exportAsImage checked or is rectangle with image fill
 * @param {SceneNode} item 
 * @param {Model} model 
 * @param {Boolean} fillEnabled fill must be enabled to return true if image fill 
 **/
function isExportAsImage(item, model, fillEnabled = true) {

	if (model.exportAsImage) {
		return true;
	}
	else if (getIsGraphicNodeWithImageFill(item, fillEnabled) && model.exportImageRectanglesAsImages) {
		return true;
	}
	else if (getIsMask(item)) {
		return true;
	}

	return false;
}

/**
 * Returns true if element has sub tags
 * @param {SceneNode} item 
 * @param {Model} model 
 **/
function showSubFormItems(item, model) {
	var isImage = isExportAsImage(item, model);
	var type = model && model.type;
	var value = null;

	if (isImage) {
		return false;
	}

	switch(type) {
		case "Text":
		case "Ellipse":
		case "Rectangle":
		case "Path":
		case "Polygon":
		case "Line":
		case "RepeatGrid":
		case "BooleanGroup":
			value = true;
			break;
		case "SymbolInstance":
		case "Group":
		case "Artboard":
			value = false;
			break;
		default:
			value = false;
	}

	return value;
}


/**
 * Returns true if element exports to an SVG element
 * @param {SceneNode} item 
 */
function isSVGElement(item) {
	if (item instanceof Rectangle || 
		item instanceof Path ||
		item instanceof BooleanGroup ||
		item instanceof Line ||
		item instanceof Ellipse) {
			return true;
	}
	return false;
}

/**
 * 
 * @param {Line} item 
 * @param {Model} model 
 */
async function getUnrotatedLine(item, model, line) {
	var centerPoint = getCenterPoint(item);
	var halfSize = Math.max(item.globalBounds.width/2, item.globalBounds.height/2)
	var halfSize2 = Math.max(Math.abs(item.end.x-item.start.x)/2, Math.abs(item.end.y-item.start.y)/2)
	//log ("half size:" + halfSize)
	//log ("half size 2:" + halfSize2)
	//object(centerPoint, "Center point:")
	var offsetX = item.parent.topLeftInParent.x;
	var offsetY = item.parent.topLeftInParent.y;
	//line.moveInParentCoordinates(item.translation.x, item.translation.y)
	//globalModel.selection.editContext.addChild(line)

	var gBounds = {};
	gBounds.x = centerPoint.x-halfSize2;
	gBounds.y = centerPoint.y;
	gBounds.width = item.end.x;
	gBounds.height = item.end.y;
	gBounds.groupX = gBounds.x-item.parent.globalBounds.x;
	gBounds.groupY = gBounds.y-item.parent.globalBounds.y;

	object(gBounds, "bounds");
	
	line.setStartEnd(
		item.start.x,
		item.start.y,
		item.end.x,
		item.end.y
	)
	
	line.strokeEnabled = true;
	line.stroke = new Color("#33FF33");
	line.strokeWidth = item.strokeWidth;
	globalModel.focusedArtboard.addChild(line)
	line.moveInParentCoordinates(centerPoint.x-halfSize2, centerPoint.y);

	object(model.groupBounds, "Item Group Bounds");
	
	setGroupBounds(line, model);

	object(model.groupBounds, "New Line group bounds");

	//line.moveInParentCoordinates(offsetX, offsetY);
	var itemGroupBounds = getBoundsInParentLocal(item);
	//object(itemGroupBounds, "Item Group bounds:")
	//object(model.groupBounds, "New line Group bounds:")
	var addOffset = item.parent instanceof Artboard;
	if (addOffset== false) {
		model.groupBounds.x = model.groupBounds.x - offsetX;
		model.groupBounds.y = model.groupBounds.y - offsetY;
	}
	//log ("after set group bounds")
	line.removeFromParent()
	return line;
	//line.moveInParentCoordinates(centerPoint.x-halfSize, centerPoint.y-halfSize);
	//line.rotateAround(item.rotation, item.localCenterPoint);
	/* 
	log("New line")
	log("start x 3:" + line.start.x)
	log("start y 3:" + line.start.y)
	log("end x 3:" + line.end.x)
	log("end y 3:" + line.end.y)
	log("translation 3:" + line.translation.x)
	log("translation 3:" + line.translation.y)

	var Fi = -item.rotation;
	var width = item.globalDrawBounds.x;
	//var width = item.globalDrawBounds.width;
	var height = item.globalDrawBounds.y;
	//var height = item.globalDrawBounds.height;

	var abHeight = width * Math.abs(Math.sin(Fi)) + height * Math.abs(Math.cos(Fi));
	var abWidth = width * Math.abs(Math.cos(Fi)) + height * Math.abs(Math.sin(Fi)); */

	//log("abWidth: " + abWidth)
	//log("abHeight: " + abHeight)
    //globalModel.selection.insertionParent.addChild(newElement); // [4]
    //newElement.moveInParentCoordinates(100, 100);   // [5]
}

function rotatePointAround(pointX,pointY,originX,originY,angle) {
    angle = angle * Math.PI / 180.0;
    return {
        x: Math.cos(angle) * (pointX-originX) - Math.sin(angle) * (pointY-originY) + originX,
        y: Math.sin(angle) * (pointX-originX) + Math.cos(angle) * (pointY-originY) + originY
    };
}

function getCenterPoint(node, local) {
	if (local) {
		return node.localCenterPoint;
	}
	return {
		x: node.boundsInParent.x + node.boundsInParent.width/2,
		y: node.boundsInParent.y + node.boundsInParent.height/2
	}

}

function centerItem(selectedItem) {
	
	if (selectedItem.parent instanceof Group) {
		selectedItem.placeInParentCoordinates(selectedItem.localCenterPoint, getCenterPoint(selectedItem));
	}
	else {
		selectedItem.placeInParentCoordinates(selectedItem.localCenterPoint, selectedItem.localCenterPoint);
	}
}

/**
 * In CSS you can declare your own style variables. We can use this to store custom data about the element
 * including layer name, scale behavior and so on 
 * @param {ArtboardModel} artboardModel artboard to set
 * @param {Object} styles styles object to set properties on
 * @param {Boolean} includeAllValues if false then custom properties are not defined unless true
 **/
function setStandardCSSPropertyValues(artboardModel, styles, includeAllValues = false, globalValuesOnly = false) {

	styles[Styles.ARTBOARD_NAME] = artboardModel.artboard.name;
	styles[Styles.ARTBOARD_ID] = artboardModel.elementId;

	if (includeAllValues) {
		styles[Styles.SCALE_TO_FIT] = artboardModel.scaleToFit ? "true" : "false";

		if (artboardModel.scaleToFitType==null) {
			styles[Styles.SCALE_TO_FIT_TYPE] = artboardModel.scaleToFit ? "fit" : "none";
		}
		else {
			styles[Styles.SCALE_TO_FIT_TYPE] = artboardModel.scaleToFitType;
		}

		styles[Styles.ENABLE_SCALE_UP] = artboardModel.enableScaleUp ? "true" : "false";

		styles[Styles.SCALE_ON_RESIZE] = artboardModel.scaleOnResize ? "true" : "false";
	
		styles[Styles.SHOW_SCALE_CONTROLS] = artboardModel.showScaleSlider ? "true" : "false";

		styles[Styles.SCALE_ON_DOUBLE_CLICK] = artboardModel.scaleOnDoubleClick ? "true" : "false";

		styles[Styles.CENTER_HORIZONTALLY] = artboardModel.centerHorizontally ? "true" : "false";

		styles[Styles.CENTER_VERTICALLY] = artboardModel.centerVertically ? "true" : "false";
	
		styles[Styles.ACTUAL_SIZE_ON_DOUBLE_CLICK] = artboardModel.actualSizeOnDoubleClick ? "true" : "false";

		styles[Styles.NAVIGATE_ON_KEYPRESS] = artboardModel.navigateOnKeypress ? "true" : "false";

		styles[Styles.REFRESH_FOR_CHANGES] = artboardModel.refreshPage ? "true" : "false";

		styles[Styles.ADD_IMAGE_COMPARE] = artboardModel.addImageComparison ? "true" : "false";

		styles[Styles.SHOW_BY_MEDIA_QUERY] = artboardModel.showArtboardsByMediaQuery ? "true" : "false";

		styles[Styles.SINGLE_PAGE_APPLICATION] = artboardModel.singlePageApplication ? "true" : "false";

		styles[Styles.SHOW_NAVIGATION_CONTROLS] = artboardModel.showArtboardsByControls ? "true" : "false";
		
		styles[Styles.ENABLE_DEEP_LINKING] = artboardModel.enableDeepLinking ? "true" : "false";

		styles[Styles.IS_OVERLAY] = isArtboardOverlay(artboardModel.artboard) ? "true" : "false";

		if (artboardModel.alternativeFont!=null && artboardModel.alternativeFont!="" && artboardModel.alternativeFont!="none") {
			styles[Styles.PAGE_FONT] = artboardModel.alternativeFont;
		}
		
	}
	else {
		
		if (artboardModel.scaleToFit) {
			styles[Styles.SCALE_TO_FIT] = "true";

			if (artboardModel.scaleToFitType==null) {
				styles[Styles.SCALE_TO_FIT_TYPE] = "fit";
			}
			else {
				styles[Styles.SCALE_TO_FIT_TYPE] = artboardModel.scaleToFitType;
			}
		}
		
		
		if (artboardModel.enableScaleUp) {
			styles[Styles.ENABLE_SCALE_UP] = "true";
		}

		if (artboardModel.scaleOnResize) {
			styles[Styles.SCALE_ON_RESIZE] = "true";
		}
		
		if (artboardModel.scaleOnDoubleClick) {
			styles[Styles.SCALE_ON_DOUBLE_CLICK] = "true";
		}
		
		if (artboardModel.showScaleSlider) {
			styles[Styles.SHOW_SCALE_CONTROLS] = "true";
		}
		
		if (artboardModel.actualSizeOnDoubleClick) {
			styles[Styles.ACTUAL_SIZE_ON_DOUBLE_CLICK] = "true";
		}
		
		if (artboardModel.centerHorizontally) {
			styles[Styles.CENTER_HORIZONTALLY] = "true";
		}
		
		if (artboardModel.centerVertically) {
			styles[Styles.CENTER_VERTICALLY] = "true";
		}

		if (artboardModel.navigateOnKeypress) {
			styles[Styles.NAVIGATE_ON_KEYPRESS] = "true";
		}

		if (artboardModel.refreshPage) {
			styles[Styles.REFRESH_FOR_CHANGES] = "true";
		}

		if (artboardModel.addImageComparison) {
			styles[Styles.ADD_IMAGE_COMPARE] = "true";
		}

		if (artboardModel.showArtboardsByMediaQuery) {
			styles[Styles.SHOW_BY_MEDIA_QUERY] = "true";
		}

		if (artboardModel.singlePageApplication) {
			styles[Styles.SINGLE_PAGE_APPLICATION] = "true";
		}

		if (artboardModel.showArtboardsByControls) {
			styles[Styles.SHOW_NAVIGATION_CONTROLS] = "true";
		}

		if (artboardModel.enableDeepLinking) {
			styles[Styles.ENABLE_DEEP_LINKING] = "true";
		}

		if (artboardModel.alternativeFont && artboardModel.alternativeFont!="none") {
			styles[Styles.PAGE_FONT] = artboardModel.alternativeFont;
		}

		if (isArtboardOverlay(artboardModel.artboard)) {
			styles[Styles.IS_OVERLAY] = "true";
		}
	}
}

/**
 * 
 * @param {Object} styles 
 * @param {String} values 
 **/
function addStylesFromStylesString(styles, values) {
  var b = debugModel.addStylesFromString;
  var nameValuePairs = values.split(";");
  var numberOfStyles = nameValuePairs.length;
  var nameValueArray = [];

  b && log("Values: " + values);
  b && log("Number of styles: " + numberOfStyles);
  
  for (let index = 0; index < numberOfStyles; index++) {
	 let nameValue = nameValuePairs[index];
	 b && log("Name value: " + nameValue);
	 nameValueArray = nameValue!=null && nameValue.indexOf(":")!=-1 ? nameValue.split(":") : [];
	 b && log("Name value split: " + nameValue.length);
	 
	 if (nameValueArray.length) {
		let name = nameValueArray[0];
		let value = nameValueArray[1];
		b && log("Name: " + name);
		b && log("Value: " + value);
		
		if(name!=null && value!=null) {
		  b && log("Setting name value");
		  styles[name] = value;
		}
	 }
  }

  b && object(styles, "Styles");
}

/**
 * 
 * @param {SceneNode} item 
 * @param {Object} styles 
 */
function deleteTransformStyle(item, styles) {
  delete styles[Styles.TRANSFORM];
}

/**
 * 
 * @param {SceneNode} item 
 * @param {Object} styles 
 */
function deleteViewBoxStyle(item, styles) {
  delete styles[Styles.VIEW_BOX];
}

/**
 * 
 * @param {SceneNode} item 
 * @param {Model} model 
 */
function setWhiteSpaceNoWrap(item, model) {
  var styles = model.cssStyles;
  styles[Styles.WHITE_SPACE] = Styles.NO_WRAP;
}

/**
 * 
 * @param {SceneNode} item 
 * @param {Model} model 
 */
function setLineHeight(item, model) {
  var styles = model.cssStyles;
  styles[Styles.LINE_HEIGHT] = "100%";
}

/**
 * 
 * @param {SceneNode} item 
 * @param {Model} model 
 */
function setSVGContainerRelativePosition(item, model) {
  var styles = model.svgStyles;
  styles[Styles.POSITION] = Styles.RELATIVE;
}

/**
 * 
 * @param {SceneNode} item 
 * @param {Model} model 
 */
function setSVGContainerAbsolutePosition(item, model) {
  var styles = model.svgStyles;
  styles[Styles.POSITION] = Styles.ABSOLUTE;
}

/**
 * 
 * @param {Object} styles 
 */
function setPositionAbsolute(styles) {
  styles[Styles.POSITION] = Styles.ABSOLUTE;
}

/**
 * Set position value
 * @param {Object} styles 
 **/
function setPosition(styles, value) {
  styles[Styles.POSITION] = value;
}

/**
 * Set position value
 * @param {SceneNode} item 
 * @param {Model} model 
 * @param {Object} styles 
 **/
function setPositionStyles(item, model, styles = null) {
	var position = model.position;
	styles = styles==null ? model.cssStyles : styles;

	if (position!=null && position!="default") {
		if (position==Styles.SIZING_ELEMENT) {
			setPosition(styles, Styles.RELATIVE);
		}
		else {
			setPosition(styles, position);
		}
	}
	else if (position==null || position=="default" || position==Styles.ABSOLUTE) {
		setPosition(styles, Styles.ABSOLUTE);
	}

	if (position==Styles.NONE) {
		delete styles[Styles.POSITION];
	}
}

/**
 * Set sizing options. Delete the options not selected. Sizing is set in export methods
 * @param {SceneNode} item 
 * @param {Model} model 
 **/
function setSizingOptions(item, model) {
	var sizing = model.sizing;
	var cssStyles = model.cssStyles;
	var svgStyles = model.svgStyles;

	try {
		if (sizing==XDConstants.DEFAULT) {
			// do not change 
		}
		else if (sizing==XDConstants.BOTH) {
			// change in export methods
		}
		else if (sizing==Styles.WIDTH) {
			delete cssStyles[Styles.HEIGHT];
			delete svgStyles[Styles.HEIGHT];
		}
		else if (sizing==Styles.HEIGHT) {
			delete cssStyles[Styles.WIDTH];
			delete svgStyles[Styles.WIDTH];
		}
		else if (sizing==XDConstants.NONE) {
			delete cssStyles[Styles.WIDTH];
			delete cssStyles[Styles.HEIGHT];
			delete svgStyles[Styles.WIDTH];
			delete svgStyles[Styles.HEIGHT];	
		}

	}
	catch(error) {
		
	}
}

/**
 * 
 * @param {SceneNode} item 
 * @param {Model} model 
 */
function setSVGContainerOverflowVisible(item, model) {
  var styles = model.svgStyles;
  styles[Styles.OVERFLOW] = Styles.VISIBLE;
}

/**
 * 
 * @param {SceneNode} item 
 * @param {Object} object 
 */
function setOverflowAuto(item, object) {
  object[Styles.OVERFLOW] = Styles.AUTO;
}

/**
 * 
 * @param {SceneNode} item 
 * @param {Object} object 
 */
function setOverflowHidden(item, object) {
  object[Styles.OVERFLOW] = Styles.HIDDEN;
}

/**
 * 
 * @param {Object} styles object that will set property "top" 
 * @param {Object} bounds object with y property on it
 */
function setTop(styles, bounds) {

  styles.top = getShortNumber(bounds.y) + Styles.PIXEL;
}

/**
 * 
 * @param {Object} styles object that will set property "left" 
 * @param {Object} bounds object with x property on it
 */
function setLeft(styles, bounds) {

  styles.left = getShortNumber(bounds.x) + Styles.PIXEL;
}

/**
 * Adds position and size styles for a container tag to the cssStyles object 
 * @param {SceneNode} item 
 * @param {Model} model 
 */
function setSVGContainerStyles(item, model, size, position) {
  var b = debugModel.setWidth || debugModel.setHeight;
  var styles = model.svgStyles;
  /** @type {GraphicNode} */
  var graphicNode = item instanceof GraphicNode ? item : null;
  var alternativeWidth = model.alternateWidth;
  var alternativeHeight = model.alternateHeight;

  styles.position = Styles.ABSOLUTE;
  styles.overflow = Styles.VISIBLE;

  if (size) {
	 var adjustSizeForStroke;
  
	 if (graphicNode && graphicNode.strokeEnabled && adjustSizeForStroke) {
		styles.width = getShortNumber(item.globalDrawBounds.width) + graphicNode.strokeWidth + Styles.PIXEL;
		styles.height = getShortNumber(item.globalDrawBounds.height) + graphicNode.strokeWidth + Styles.PIXEL;
	 }
	 else {
		styles.width = getShortNumber(item.globalDrawBounds.width) + Styles.PIXEL;
		styles.height = getShortNumber(item.globalDrawBounds.height) + Styles.PIXEL;
	 }

	 if (alternativeWidth) {
		b && log("Alt width: " + alternativeWidth)
		if (alternativeWidth=="none") {
			delete styles.width;
		}
		else {
			styles.width = alternativeWidth;
		}
	}
	
	if (alternativeHeight) {
	   b && log("Alt height: " + alternativeHeight)
		if (alternativeHeight=="none") {
			delete styles.height;
		}
		else {
			styles.height = alternativeHeight;
		}
	}
  }

  if (position) {
	 setHorizontalPosition(item, model, styles);
	 setVerticalPosition(item, model, styles);
  }
}

/**
 * 
 * @param {SceneNode} item 
 * @param {Object} styles
 */
function setTransformStyle(item, styles, zero = true) {
  var transform = item.transform;

  if (zero==true) {
	 transform.e = 0;
	 transform.f = 0;
  }
  
  styles[Styles.TRANSFORM] = transform;
}

/**
 * 
 * @param {SceneNode} item 
 * @param {Model} model 
 */
function setTransformRectangleStyles(item, model, styles, zero = false, adjust = true) {
  var transform = item.transform;
  var places = 4;
  var a,b,c,d,e,f = 0;
  var array = [];
  var bew = true;
  
  /*
  try {
	  log(item.transform)
	  //item.rotateAround(-item.rotation);
	}
	catch (e) {
		log(item.transform)
  }
  */

  a = transform.a;
  b = transform.b;
  c = transform.c;
  d = transform.d;
  e = transform.e;
  f = transform.f;

  if (zero==true) {
	 e = 0;
	 f = 0;
  }
  
  if (adjust==true) {
	
	if (bew) {

		if (item.parent) {
			log("item.parent.globalBounds.x:"+item.parent.globalBounds.x)
			log("item.parent.globalBounds.y:"+item.parent.globalBounds.y)
			log("item.globalBounds:",item.globalBounds)
			log("item.globalDrawBounds:",item.globalDrawBounds)
			log("item.translation:",item.translation)
			log("model.groupBounds:", model.groupBounds)
			var bounds = getBoundsInParent(item);
			//e = getShortNumber(e, places);
			//f = getShortNumber(f, places);
			e = getShortNumber(e - bounds.parentX, places);
			f = getShortNumber(f - bounds.parentY, places);
		}
		else {
			e = getShortNumber(e - model.groupBounds.parentX, places);
			f = getShortNumber(f - model.groupBounds.parentY, places);
		}
	}
	else {

		if (item.parent) {
			e = getShortNumber(e - item.parent.globalBounds.x);
			f = getShortNumber(f - item.parent.globalBounds.y);
		 }
		 else {
			e = getShortNumber(e);
			f = getShortNumber(f);
		 }
	}

	 
  }
  
  array.push(a,b,c,d,e,f);

  //styles[Styles.TRANSFORM] = "matrix(" + array.join(",") + ")";
  styles[Styles.TRANSFORM] = transform;

}

/**
 * Set transform styles. Rotated group not supported
 * @param {SceneNode} item scenenode 
 * @param {Model} model model 
 * @param {Object} styles object to apply styles
 **/
function setTransformStyles2(item, model, styles) {
	var transform2 = item.transform.clone();
	var transform = transform2.clone();
	var offsetX = 0;
	var offsetY = 0;
	var bounds = getBoundsInParent(item);
	var isParentArtboard = getIsArtboard(item.parent);
	var offsetParentX = getShortNumber(-bounds.parentXInArtboard + bounds.parentTransformX);
	var offsetParentY = getShortNumber(-bounds.parentYInArtboard + bounds.parentTransformY);
	var rotationPosition = getTransformRotationValue(getShortNumber(item.rotation));
	var translatePosition = null;
	var unrotatedPosition = null;
	var unrotatedMatrix = null;
	var groupPosition = null;

	//log("item.localCenterPoint:", item.localCenterPoint)
	//log("item.localBounds:", item.localBounds)
	unrotatedMatrix = item.transform.clone().rotate(-item.rotation, item.localCenterPoint.x, item.localCenterPoint.y);
	unrotatedMatrix.translate(item.localBounds.x, item.localBounds.y);
	//unrotatedMatrix = unrotatedMatrix.add(unrotatedMatrix.a,unrotatedMatrix.b,unrotatedMatrix.c,unrotatedMatrix.d,0,-10);
	unrotatedPosition = unrotatedMatrix.toString();
	groupPosition = getTransformTranslationValue(offsetParentX, offsetParentY);

	//if (item.isContainer==false) {
	//}

	//log("unrotatedMatrix:",unrotatedMatrix)
	//log("unrotatedPosition:",unrotatedPosition)
	//log("groupPosition:",groupPosition)


	// add group tranform
	if (isParentArtboard) {
		addTransformStyle(styles, unrotatedPosition);
		addTransformStyle(styles, rotationPosition);
	}
	else {
		addTransformStyle(styles, groupPosition);
		addTransformStyle(styles, unrotatedPosition);

		if (hasTransformStyle(styles, rotationPosition)==false) {
			addTransformStyle(styles, rotationPosition);
		}
	}

	styles[Styles.TRANSFORM_ORIGIN] = "center";
}
/**
 * Get relative transformed position
 * @param {SceneNode} item scenenode 
 * @param {Model} model model 
 * @returns {Array}
 **/
function getTransformedPosition(item, model) {
	var bounds = getBoundsInParent(item);
	//log("bounds.parentXInArtboard:"+bounds.parentXInArtboard)
	//log("bounds.parentTransformX:"+bounds.parentTransformX)
	var transform2 = item.transform.clone();
	var transform = transform2.clone();
	var offsetX = 0;
	var offsetY = 0;
	var isParentArtboard = getIsArtboard(item.parent);
	var offsetParentX = 0;
	var offsetParentY = 0;
	var translatePosition = null;
	var unrotatedPosition = [];
	var unrotatedMatrix = null;
	var groupPosition = [];
	
	if (isParentArtboard==false) {
		offsetParentX = getShortNumber(-bounds.parentXInArtboard + bounds.parentTransformX);
		offsetParentY = getShortNumber(-bounds.parentYInArtboard + bounds.parentTransformY);
	}
	
	unrotatedMatrix = item.transform.clone().rotate(-item.rotation, item.localCenterPoint.x, item.localCenterPoint.y);
	unrotatedPosition = unrotatedMatrix.getTranslate();
	
	groupPosition = [offsetParentX, offsetParentY];
	
	//log("unrotatedPosition:" + unrotatedPosition)
	//log("groupPosition:" + groupPosition)
	return groupPosition;
}

/**
 * Set transform styles
 * @param {SceneNode} item scenenode 
 * @param {Object} styles object of styles
 * @param {Boolean} matrix set transform using matrix
 * @param {Boolean} translate add in artboard translation
 * @param {Boolean} rotate set transform using rotate
 **/
function setTransformStyles(item, styles, matrix, translate, rotate) {
  var output = [];
  var newCode = true;
  var bounds = getBoundsInParent(item);
  
  if (translate) {
	  var x = -item.translation.x - bounds.xInArtboard;
	  var y = -item.translation.y - bounds.yInArtboard;

	  var transform = item.transform.rotate(-item.rotation, item.localCenterPoint.x, item.localCenterPoint.y);
	  
	  if (newCode) {
		  //output.push("translateX(" + getShortNumber(transform.e) + "px) translateY(" + getShortNumber(transform.f) +  "px)");
		}
		else {
			output.push("translate(" + -item.localBounds.x + "px, " + -item.localBounds.y +  "px)");
	  }
  }

  if (matrix) {
	 output.push(item.transform);
  }

  if (rotate) {
	 output.push("rotate(" + getShortNumber(item.rotation) + "deg)");
  }

  if (output.length) {
	 styles[Styles.TRANSFORM] = output.join(" ");
  }
}

/**
 * 
 * @param {SceneNode} item 
 * @param {Object} styles 
 **/
function setTranslationStyle(item, styles) {
  styles[Styles.TRANSFORM] = "translate(" + -item.localBounds.x + "px, " + -item.localBounds.y +  "px)";
}

/**
 * Adds the size styles for a container tag on the svgStyles object 
 * @param {SceneNode} item 
 * @param {Model} model 
 * @param {Boolean} useLocalBounds 
 * @param {Boolean} adjustSizeForStroke 
 **/
function setSVGContainerSize(item, model, useLocalBounds = false, adjustSizeForStroke = false) {
  var b = (debugModel.setWidth || debugModel.setHeight) && log("Set SVG container size()");
  var styles = model.svgStyles;
  var bounds = useLocalBounds ? item.localBounds : item.globalDrawBounds;
  var width = bounds.width<=0 ? 1 : bounds.width;
  var height = bounds.height<=0 ? 1 : bounds.height;

  if (item instanceof GraphicNode && item.strokeEnabled && adjustSizeForStroke) {
	 styles.width = getShortNumber(width + item.strokeWidth) + Styles.PIXEL;
	 styles.height = getShortNumber(height + item.strokeWidth) + Styles.PIXEL;
  }
  else {
	 styles.width = getShortNumber(width) + Styles.PIXEL;
	 styles.height = getShortNumber(height) + Styles.PIXEL;
  }

  if (model.alternateWidth) {
	 b && log("Alt width: " + model.alternateWidth)
	 styles.width = model.alternateWidth;
  }
  
  if (model.alternateHeight) {
	 b && log("Alt height: " + model.alternateHeight)
	 styles.height = model.alternateHeight;
  }
}

/**
 * Sets size styles on an object 
 * @param {Object} styles 
 * @param {Object} bounds 
 * @param {String} alternativeWidth 
 * @param {String} alternativeHeight 
 * @param {Number} strokeWidth  
 */
function setSize(styles, bounds, alternativeWidth = null, alternativeHeight = null, strokeWidth = 0) {
	var b = (debugModel.setWidth || debugModel.setHeight);

	if (strokeWidth!=0) {
	   styles.width = getShortNumber(bounds.width + strokeWidth) + Styles.PIXEL;
	   styles.height = getShortNumber(bounds.height + strokeWidth) + Styles.PIXEL;
	}
	else {
	   styles.width = getShortNumber(bounds.width) + Styles.PIXEL;
	   styles.height = getShortNumber(bounds.height) + Styles.PIXEL;
	}
  
	if (alternativeWidth) {
		b && log("Alt width: " + alternativeWidth)
		if (alternativeWidth=="none") {
			delete styles.width;
		}
		else {
			styles.width = alternativeWidth;
		}
	}
	
	if (alternativeHeight) {
	   b && log("Alt height: " + alternativeHeight)
		if (alternativeHeight=="none") {
			delete styles.height;
		}
		else {
			styles.height = alternativeHeight;
		}
	}

  }

/**
 * 
 * @param {SceneNode} item 
 * @param {Model} model 
 */
function setSVGContainerPosition(item, model) {
  var styles = model.svgStyles;
  var groupBounds = model.groupBounds;

  styles.left = model.groupBounds.x + Styles.PIXEL;
  styles.top = model.groupBounds.y + Styles.PIXEL;
}


/**
 * 
 * @param {SceneNode} item 
 * @param {Model} model 
 */
function setSVGContainerTop(item, model) {
  var styles = model.svgStyles;
  var groupBounds = model.groupBounds;

  styles.top = getShortNumber(model.groupBounds.y) + Styles.PIXEL;
}


/**
 * 
 * @param {SceneNode} item 
 * @param {Model} model 
 */
function setSVGContainerLeft(item, model) {
  var styles = model.svgStyles;
  var groupBounds = model.groupBounds;

  styles.left = getShortNumber(model.groupBounds.x) + Styles.PIXEL;
}

/**
 * 
 * @param {SceneNode} item 
 * @param {Model} model 
 */
function setSVGContainerAttributes(item, model, setStyleInline = false) {
  var attributes = model.svgAttributes;

  if (hasProperties(model.svgStyles) && setStyleInline) {
	 attributes.style = getCSSValue(model.svgStyles);
  }
}


/**
 * Sets the rotation in the transform
 * @param {SceneNode} item 
 * @param {Object} styles 
 **/
function setRotation(item, styles, setOriginCenter) {
  var value = item.rotation;

  if (value!=0) {
	value = getShortNumber(value, globalArtboardModel.maxDecimalPlaces);
	 //value = 360-value;
	addTransformStyle(styles, "rotate(" + value + "deg)");

	if (setOriginCenter) {
		styles[Styles.TRANSFORM_ORIGIN] = "center";
	}
  }
}

/**
 * 
 * @param {Object} attributes 
 * @param {Object} bounds 
 * @param {Number} strokeWidth 
 */
function setViewBox(attributes, bounds, strokeWidth=0, excludePosition = false) {
	var width = bounds.width;
	var height = bounds.height;
	var value = [];

	if (excludePosition) {
		value.push(0);
		value.push(0);
	}
	else {
		value.push(getShortNumber(bounds.x));
		value.push(getShortNumber(bounds.y));
	}

	// lines can have a height or width of 0 so we use the stroke width or 1px if not set
	// more work needs to be done to get the correct position
	if (width==0) {
		if (strokeWidth!=0) {
			value.push(strokeWidth);
		}
		else {
			value.push(1);
		}
	}
	else {		
		value.push(getShortNumber(bounds.width));
	}

	if (height==0) {
		if (strokeWidth!=0) {
			value.push(strokeWidth);
		}
		else {
			value.push(1);
		}
	}
	else {
		value.push(getShortNumber(bounds.height));
	}

	attributes.viewBox = value.join(" ");
}

/**
 * 
 * @param {SceneNode} item 
 * @param {Model} model 
 */
function setSVGContainerViewBox(item, model) {
	var attributes = model.svgAttributes;
	var bounds = item.localBounds;
	var width = bounds.width;
	var height = bounds.height;
	var value = [];

	value.push(getShortNumber(bounds.x));
	value.push(getShortNumber(bounds.y));

	// lines can have a height or width of 0 so we use the stroke width or 1px if not set
	// more work needs to be done to get the correct position
	if (width==0) {
		if (item instanceof GraphicNode && item.strokeEnabled) {
			value.push(item.strokeWidth);
		}
		else {
			value.push(1);
		}
	}
	else {		
		value.push(getShortNumber(bounds.width));
	}

	if (height==0) {
		if (item instanceof GraphicNode && item.strokeEnabled) {
			value.push(item.strokeWidth);
		}
		else {
			value.push(1);
		}
	}
	else {
		value.push(getShortNumber(bounds.height));
	}

	attributes.viewBox = value.join(" ");
}

/**
 * Set the class attribute on the svgAttributes object
 * @param {SceneNode} item 
 * @param {Model} model 
 */
function setSVGContainerClassAttribute(item, model) {
  var classes = model.svgClassesArray;
  var attributes = model.svgAttributes;

  if (classes.length) {
	 attributes.class = classes.join(" ");
  }
}

/**
 * Set the class attribute
 * @param {SceneNode} item 
 * @param {Model} model 
 */
function setClassAttributeOld(item, model, attributes, additionalClasses = null) {
  var classes = [...model.classesArray];// model.classesArray.concat([]);

  if (additionalClasses) {
	  classes.push(additionalClasses);
  }

  if (classes.length) {
	 attributes.class = classes.join(" ");
  }

}

/**
 * 
 * @param {SceneNode} item 
 * @param {Model} model 
 **/
function setContainerClassAttribute(item, model, additionalClasses = null) {
	var classes = [...model.containerClassesArray];
	var attributes = model.containerAttributes;
	
	if (additionalClasses) {
		classes.push(additionalClasses);
	}

	if (classes.length) {
		attributes.class = classes.join(" ");
	}

}

/**
 * Set the class attribute
 * @param {Array} classes 
 * @param {Object} attributes 
 * @param {String} additionalClasses 
 **/
function setClassAttribute2(classes, attributes, additionalClasses = null) {

  if (additionalClasses) {
	  classes.push(additionalClasses);
  }

  if (classes.length) {
	 attributes.class = classes.join(" ");
  }

}

/**
 * Set the group background based on a rectangles value
 * @param {SceneNode} item 
 * @param {Model} model 
 */
function setBackgroundFromDescendant(item, model, descendant = null, isRectangle = false) {
	var styles = model.cssStyles;
	var isBooleanGroup = item instanceof BooleanGroup;
	var isGroup = item.isContainer;
	var preferenceData = null;
	var isArtboard = item instanceof Artboard;
	var hasMarkupInside = false;
	var isText = item instanceof Text;
	var container = null;
	var exportAsImage = isExportAsImage(item, model);
  
  	if (item.isContainer && item.children.length && isBooleanGroup==false && exportAsImage==false && hasMarkupInside==false) {
		container = item;

		if (container.mask==null) {
	
			// after mask is exported export the rest
			//container.children.forEach((descendant, i) => {
			for (let index = 0; index < container.children.length; index++) {
				const descendant = container.children.at(index);
				
				var descendantModel = getModelPluginDataOnly(descendant);
				
				if (descendantModel && descendantModel.useAsGroupBackground) {
					setBackgroundFillStyles(descendant, model, model.cssStyles);
					setBorderStyles(descendant, model, model.cssStyles);
					setDropShadow(descendant, model, model.cssStyles);
				}
			}
			//});
		}
	}
	else if (isRectangle) {
		setBackgroundFillStyles(item, model, model.cssStyles);
		setBorderStyles(item, model, model.cssStyles);
		setDropShadow(descendant, model, model.cssStyles);
	}
}

/**
 * adds position and size styles for a container tag to the cssStyles object
 * @param {SceneNode} item 
 * @param {Model} model 
 */
function setContainerStyles(item, model, useDrawBounds = false) {
  var b = debugModel.horizontalPosition && log("Set container styles()");
  var styles = model.cssStyles;
  var bounds = item.localBounds;
  var width = bounds.width<=0 ? 1 : bounds.width;
  var height = bounds.height<=0 ? 1 : bounds.height;

  styles.position = Styles.ABSOLUTE;
  
  b && log("Model: " + getShortString(item.name));
  
	if (model.alternateWidth) {
		b && log("Alt width: " + model.alternateWidth)

		if (model.alternateWidth=="none") {
			delete styles.width;
		}
		else {
			styles.width = model.alternateWidth;
		}
	}
	else {
		styles.width = getShortNumber(width) + Styles.PIXEL;
	}
  
  	if (model.alternateHeight) {
	 	b && log("Alt height: " + model.alternateHeight)
	 
		if (model.alternateHeight=="none") {
			delete styles.height;
		}
		else {
			styles.height = model.alternateHeight;
		}
  	}
  	else {
		styles.height = getShortNumber(height) + Styles.PIXEL;
  	}

  setHorizontalPosition(item, model, null, useDrawBounds);
  setVerticalPosition(item, model, null, useDrawBounds);

}

/**
 * adds position and size styles for a container tag to the cssStyles object 
 * @param {SceneNode} item 
 * @param {Model} model 
 */
function setTextContainerSizeStyles(item, model) {
  var styles = model.cssStyles;
  
  if (model.alternateWidth) {
	 if (model.alternateWidth=="none") {
		 delete styles.width;
	 }
	 else {
		 styles.width = model.alternateWidth;
	 }
  }
  else {
	 styles.width = getShortNumber(item.localBounds.width + globalArtboardModel.additionalTextWidth) + Styles.PIXEL;
  }
  
  if (model.alternateHeight) {

	 if (model.alternateHeight=="none") {
		delete styles.height;
	}
	else {
		styles.height = model.alternateHeight;
	}
  }
  else {
	 styles.height = getShortNumber(item.localBounds.height) + Styles.PIXEL;
  }
}

/**
 * Adds size styles for a container tag to the cssStyles object 
 * @param {SceneNode} item 
 * @param {Model} model 
 */
function setTextContainerHeight(item, model) {
	var styles = model.cssStyles;

	if (model.alternateHeight) {
		if (model.alternateHeight=="none") {
			delete styles.height;
		}
		else {
			styles.height = model.alternateHeight;
		}
	}
	else {
		styles.height = item.localBounds.height + Styles.PIXEL;
	}
}


/**
 * Adds width styles for a container tag to the cssStyles object 
 * @param {SceneNode} item 
 * @param {Model} model 
 */
function setTextContainerWidth(item, model) {
	var styles = model.cssStyles;

	if (model.alternateWidth) {
		if (model.alternateWidth=="none") {
			delete styles.width;
		}
		else {
			styles.width = model.alternateWidth;
		}
	}
	else {
		styles.width = getShortNumber(item.localBounds.width + globalArtboardModel.additionalTextWidth) + Styles.PIXEL;
	}
}

/**
 * adds position and size styles for a container tag to the cssStyles object 
 * @param {SceneNode} item 
 * @param {Model} model 
 * @param {Boolean} absolute 
 */
function setTextContainerPositionStyles(item, model, absolute = true) {
  var styles = model.cssStyles;

  if (absolute) {
	 styles.position = Styles.ABSOLUTE;
  }
  else {
	 styles.position = Styles.RELATIVE;
  }

  setHorizontalPosition(item, model);
  setVerticalPosition(item, model);
}

/**
 * Set horizontal position
 * @param {SceneNode} item 
 * @param {Model} model 
 * @param {Object} object alternative object to set styles on
 * @param {Boolean} useDrawBounds 
 * @param {Boolean} removeStyles removes the width style if both width and height are set
 **/
function setHorizontalPosition(item, model, object = null, useDrawBounds = false, removeStyles = true) {
	var b = debugModel.setPosition;
	var styles = object ? object : model.cssStyles;
	var hasRotation = item.rotation!=0;
	var xPosition = 0;
	var bounds = null;
	var height = 0;
	var width = 0;
	var left = 0;
	var right = 0;
	var rotationValue = null;
	var isImage = isExportAsImage(item, model);
	var isHTML = model.isHTML;
	var relativePositions = [];
	var leftName = Styles.LEFT;
	var rightName = Styles.RIGHT;
	var topName = Styles.TOP;
	var bottomName = Styles.BOTTOM;
	var position = model.position;
	var positionBy = model.positionBy;


	try {

		if (positionBy==XDConstants.DEFAULT) {
			// already set to default
		}
		else if (positionBy==Styles.PADDING || positionBy==XDConstants.HORIZONTAL_PADDING) {
			leftName = Styles.PADDING_LEFT;
			rightName = Styles.PADDING_RIGHT;
			topName = Styles.PADDING_TOP;
			bottomName = Styles.PADDING_BOTTOM;
		}
		else if (positionBy==Styles.MARGIN || positionBy==XDConstants.HORIZONTAL_MARGIN) {
			leftName = Styles.MARGIN_LEFT;
			rightName = Styles.MARGIN_RIGHT;
			topName = Styles.MARGIN_TOP;
			bottomName = Styles.MARGIN_BOTTOM;
		}
		else if (position==Styles.SIZING_ELEMENT) {
			leftName = Styles.MARGIN_LEFT;
			rightName = Styles.MARGIN_RIGHT;
			topName = Styles.MARGIN_TOP;
			bottomName = Styles.MARGIN_BOTTOM;
		}

		bounds = model.groupBounds;
		xPosition = useDrawBounds ? bounds.drawX : bounds.x;
		
		if (hasRotation && isImage==false && isHTML==false) {
			relativePositions = getTransformedPosition(item, model);
			rotationValue = getTransformRotationValue(getShortNumber(item.rotation));
			xPosition = 0;
			
			if (hasTransformStyle(styles, rotationValue)==false) {
				addTransformStyle(styles, rotationValue);
			}
		}
		
		b && log("Model: " + getShortString(item.name));

		if (positionBy==Styles.NONE || 
			positionBy==XDConstants.VERTICAL_MARGIN || 
			positionBy==XDConstants.VERTICAL_PADDING ||
			positionBy==XDConstants.VERTICAL_CONSTRAINT) {
			return;
		}


		if (model.centerHorizontally) {
			b && log("Centering horizontally")
			styles.left = "50%";
			addTransformStyle(styles, "translateX(-50%)");
		}
		else if (model.constrainRight && model.constrainLeft) {
			b && log("Setting left and right position")
			styles[leftName] = getShortNumber(xPosition) + Styles.PIXEL;
			styles[rightName] = getShortNumber(model.parentBounds.width - model.groupBounds.width - xPosition);
			styles[rightName] += Styles.PIXEL;

			if (removeStyles) {
				delete styles[Styles.WIDTH];
			}

			b && log("Left: " + styles[leftName]);
			b && log("Right: " + styles[rightName]);
		}
		else if (model.constrainRight) {
			b && log("Setting right position")
			styles[rightName] = getShortNumber(model.parentBounds.width - model.groupBounds.width - xPosition);
			styles[rightName] += Styles.PIXEL;
			b && log("Right: " + styles[rightName]);
		}
		else {
			b && log("Setting left position")
			styles[leftName] = getShortNumber(xPosition) + Styles.PIXEL;
			b && log("Left: " + styles[leftName]);
		}

	}
	catch(error) {
		log(error.stack);
		addError("Set position error", error);
	}
}

/**
 * Set the vertical position.
 * @param {SceneNode} item 
 * @param {Model} model 
 * @param {Object} object alternative object to set styles on
 * @param {Boolean} useDrawBounds 
 * @param {Boolean} removeStyles 
 **/
function setVerticalPosition(item, model, object = null, useDrawBounds = false, removeStyles = false) {
	var b = debugModel.setPosition;
	var styles = object ? object : model.cssStyles;
	var hasRotation = item.rotation!=0;
	var yPosition = 0;
	var bounds = null;
	var width = 0;
	var height = 0;
	var top = 0;
	var bottom = 0;
	var rotationValue = null;
	var isImage = isExportAsImage(item, model);
	var isHTML = model.isHTML;
	var relativePositions = [];
	var leftName = Styles.LEFT;
	var rightName = Styles.RIGHT;
	var topName = Styles.TOP;
	var bottomName = Styles.BOTTOM;
	var position = model.position;
	var positionBy = model.positionBy;


	try {

		if (positionBy==XDConstants.DEFAULT) {
			// already set to default
		}
		else if (positionBy==Styles.PADDING || positionBy==XDConstants.VERTICAL_PADDING) {
			leftName = Styles.PADDING_LEFT;
			rightName = Styles.PADDING_RIGHT;
			topName = Styles.PADDING_TOP;
			bottomName = Styles.PADDING_BOTTOM;
		}
		else if (positionBy==Styles.MARGIN || positionBy==XDConstants.VERTICAL_MARGIN) {
			leftName = Styles.MARGIN_LEFT;
			rightName = Styles.MARGIN_RIGHT;
			topName = Styles.MARGIN_TOP;
			bottomName = Styles.MARGIN_BOTTOM;
		}
		else if (position==Styles.SIZING_ELEMENT) {
			leftName = Styles.MARGIN_LEFT;
			rightName = Styles.MARGIN_RIGHT;
			topName = Styles.MARGIN_TOP;
			bottomName = Styles.MARGIN_BOTTOM;
		}

		bounds = model.groupBounds;
		yPosition = useDrawBounds ? bounds.drawY : bounds.y
		
		if (hasRotation && isImage==false && isHTML==false) {
			var useRotation2 = globalModel.useRotation2;
			relativePositions = getTransformedPosition(item, model);

			if (useRotation2) {
				rotationValue = getTransformRotationValue(getShortNumber(item.rotation));;
				yPosition = 0;
				
				if (hasTransformStyle(styles, rotationValue)==false) {
					addTransformStyle(styles, rotationValue);
				}
			}
		}

		if (positionBy==Styles.NONE || 
			positionBy==XDConstants.HORIZONTAL_MARGIN || 
			positionBy==XDConstants.HORIZONTAL_PADDING ||
			positionBy==XDConstants.HORIZONTAL_CONSTRAINT) {
			return;
		}

		if (model.centerVertically) {
			b && log("Centering vertically")
			styles.top = "50%";
			addTransformStyle(styles, "translateY(-50%)");
		}
		else if (model.constrainTop && model.constrainBottom) {
			b && log("Setting top and bottom position")
			styles[topName] = getShortNumber(yPosition) + Styles.PIXEL;
			styles[bottomName] = getShortNumber(model.parentBounds.height - model.groupBounds.height - yPosition);
			styles[bottomName] += Styles.PIXEL;

			if (removeStyles) {
				delete styles[Styles.HEIGHT];
			}

			b && log("Top: " + styles[topName]);
			b && log("Bottom: " + styles[bottomName]);
		}
		else if (model.constrainBottom) {
			b && log("Setting bottom position")
			styles[bottomName] = getShortNumber(model.parentBounds.height - model.groupBounds.height - yPosition);
			styles[bottomName] += Styles.PIXEL;
			b && log("Bottom: " + styles[bottomName]);
		}
		else {
			b && log("Setting top position");
			styles[topName] = getShortNumber(yPosition) + Styles.PIXEL;
			b && log("Top: " + styles[topName]);
		}

	}
	catch(error) {
		log(error.stack);
		addError("Set position error", error);
	}
}

/**
 * Check if a group is vertical layout
 * @param {SceneNode} stackItem 
 */
function isVerticalStack(stackItem) {
	var b = debugModel.verticalStack;
	var items = stackItem.children;
	var numberOfItems = items.length;
	var item = null;
	var itemX = 0;
	var itemY = 0;
	var secondItem = null;
	var secondItemX = 0;
	var secondItemY = 0;
	var model = null;
	var secondModel = null;
	var xGrows = true;
	var yGrows = true;
	var xOffset = 0;
	var yOffset = 0;

	if (numberOfItems>1) {

		for (var i=numberOfItems-1;i>-1;i--) {
			item = getItemAtIndex(stackItem, i);
			secondItem = getItemAtIndex(stackItem, i-1);
			model = getModel(item, true);
			secondModel = secondItem ? getModel(secondItem, true) : null;
		
			b && log("item["+i+"]:" + item.name)
			itemX = model.bounds.x;
			itemY = model.bounds.y;
			b && log("itemX:" + itemX)
			b && log("itemY:" + itemY)
			
			if (secondModel) {
				secondItemX = secondModel.bounds.x;
				secondItemY = secondModel.bounds.y;
				b && log("secondItemX:" + secondItemX)
				b && log("secondItemY:" + secondItemY)

				xOffset = secondItemX-itemX;
				yOffset = secondItemY-itemY;
			}
			else {
				continue;
			}
	
			if (secondItemY>itemY) {

			}
			else {
				yGrows = false;
			}

			if (secondItemX>itemX) {

			}
			else {
				xGrows = false;
			}
		}

		b && log("xgrows:"+xGrows+", yGrows:"+yGrows);
		b && log("xOffset:"+xOffset+", yOffset:"+yOffset);
		
		// the rare stair-case layout 
		// may fail if group is a square
		if (xGrows && yGrows) {

			// on two item groups not enough info so we guess by distance
			if (yOffset>xOffset) {
				return true;
			}

			//return isPortrait(stackItem);
		}

		// horizontal 
		if (xGrows) {
			return false;
		}
		
		// vertical
		if (yGrows) {
			return true;
		}
	}

	return false;
}

/**
 * Set flex box styles
 * @param {SceneNode} item 
 * @param {Model} model 
 * @param {Object} styles 
 **/
function setFlexBoxStyles(item, model, styles) {
	var layout = model.layout;
	var horizontalAlign = model.layoutHorizontalAlign;
	var verticalAlign = model.layoutVerticalAlign;
	var wrap = model.layoutWrapping;
	var layoutSpacing = model.layoutSpacing;
	var alignItems = null;
	

	if (layout==XDConstants.STACK && item.isContainer) {
		layout = isVerticalStack(item) ? Styles.VERTICAL : Styles.HORIZONTAL;
	}
	
	if (layout!=null && layout!="default") {

		if (layout==Styles.ROW || layout==Styles.ROW_REVERSE) {
			styles[Styles.DISPLAY] = Styles.FLEX;
			styles[Styles.FLEX_DIRECTION] = layout;
			styles[Styles.ALIGN_ITEMS] = verticalAlign;
			styles[Styles.JUSTIFY_CONTENT] = layoutSpacing;
			styles[Styles.FLEX_WRAP] = wrap;
		}
		else if (layout==Styles.COLUMN || layout==Styles.COLUMN_REVERSE) {
			styles[Styles.DISPLAY] = Styles.FLEX;
			styles[Styles.FLEX_DIRECTION] = layout;
			styles[Styles.ALIGN_ITEMS] = horizontalAlign;
			styles[Styles.JUSTIFY_CONTENT] = layoutSpacing;
			styles[Styles.FLEX_WRAP] = wrap;
		}
		else if (layout==Styles.VERTICAL) {
			styles[Styles.DISPLAY] = Styles.FLEX;
			styles[Styles.FLEX_DIRECTION] = Styles.COLUMN_REVERSE;
			styles[Styles.ALIGN_ITEMS] = horizontalAlign;
			styles[Styles.JUSTIFY_CONTENT] = Styles.START;
			styles[Styles.FLEX_WRAP] = wrap;
		}
		else if (layout==Styles.HORIZONTAL) {
			styles[Styles.DISPLAY] = Styles.FLEX;
			styles[Styles.FLEX_DIRECTION] = Styles.ROW_REVERSE;
			styles[Styles.ALIGN_ITEMS] = verticalAlign;
			styles[Styles.JUSTIFY_CONTENT] = Styles.START;
			styles[Styles.FLEX_WRAP] = wrap;
		}
		else if (layout==Styles.FLEX) {
			styles[Styles.DISPLAY] = Styles.FLEX;
			styles[Styles.ALIGN_ITEMS] = verticalAlign;
			styles[Styles.JUSTIFY_CONTENT] = layoutSpacing;
			styles[Styles.FLEX_WRAP] = wrap;
		}
		else {
			styles[Styles.DISPLAY] = layout;
		}
	}
}

/**
 * Set flexbox self alignment styles.
 * Not set if parent element is not flex box
 * @param {SceneNode} item 
 * @param {Model} model 
 * @param {Object} styles 
 **/
function setFlexAlignSelfStyles(item, model, styles) {
	var b = debugModel.flexAlignSelf;
	var selfAlignment = model.selfAlignment;
	var isFlexBoxItem = getIsFlexItem(item, model, true);
	var parentModel = getParentModel(item); 
	var layout = parentModel ? parentModel.layout : null;
	var isStackLayout = layout==XDConstants.STACK;

	if (isStackLayout) {
		layout = isVerticalStack(item.parent) ? Styles.VERTICAL : Styles.HORIZONTAL;
	}

	if (isFlexBoxItem) {

		if (isStackLayout && 
			(selfAlignment=="default" || selfAlignment==null || selfAlignment=="auto")) {
			
			// we are looping through each item starting with the last node first 
			// The first child is lowest in the z order.
			// 0 is item at the bottom visually, then 1 is the next item higher
			// XD has a weird way of ordering elements so we are working around that
			var numberOfNodes = getNumberOfItemsInParent(item);
			var nodeIndex = getItemIndex(item);
			var higherNode = getItemAtIndex(item.parent, nodeIndex+1);
			var lowerNode = getItemAtIndex(item.parent, nodeIndex-1);
			var lowerNodeModel = lowerNode ? getModel(lowerNode, true) : null;
			var higherNodeModel = higherNode ? getModel(higherNode, true) : null;
			var marginValue = 0;
			var marginAbove = -1;
			var marginBelow = -1;
			var marginToRight = -1;
			var marginToLeft = -1;
			var styleName = Styles.MARGIN_BOTTOM;
			var marginLeft = getShortNumber(model.bounds.left);
			var marginTop = getShortNumber(model.bounds.top);
			var marginRight = -1;
			var marginBottom = -1;

			b && log("Item["+nodeIndex+"]: " + getShortString(item.name))
			b && log("  x:", model.bounds.left)
			b && log("  y:", model.bounds.top)
			b && log("  w:", model.bounds.width)
			b && log("  h:", model.bounds.height)

			if (higherNode) {
				b && log("higher item["+(nodeIndex+1)+"]"+ getShortString(higherNode.name))
				b && log("  x:", higherNodeModel.bounds.left)
				b && log("  y:", higherNodeModel.bounds.top)
				b && log("  w:", higherNodeModel.bounds.width)
				b && log("  h:", higherNodeModel.bounds.height)
			}

			if (lowerNode) {
				b && log("lower item:["+(nodeIndex-1)+"]"+ getShortString(lowerNode.name))
				b && log("  x:", lowerNodeModel.bounds.left)
				b && log("  y:", lowerNodeModel.bounds.top)
				b && log("  w:", lowerNodeModel.bounds.width)
				b && log("  h:", lowerNodeModel.bounds.height)
			}
			
			if (layout==Styles.VERTICAL || layout==Styles.HORIZONTAL) {

				// get the margin of the current item to the next item higher up
				if (higherNode && higherNodeModel) {
					marginToLeft = getShortNumber(higherNodeModel.bounds.left - higherNodeModel.bounds.width - model.bounds.left);
					marginAbove = getShortNumber(higherNodeModel.bounds.top - higherNodeModel.bounds.height - model.bounds.top);
				}
				
				// get the margin of the current item to the next item further down
				if (lowerNode && lowerNodeModel) { // 281 - (33 + 243)
					marginToRight = getShortNumber(lowerNodeModel.bounds.left - (model.bounds.width + model.bounds.left));
					marginBelow = getShortNumber(lowerNodeModel.bounds.top - model.bounds.height - model.bounds.top);
				}
			}
			else {

				if (higherNode && higherNodeModel) {
					marginToRight = getShortNumber(higherNodeModel.bounds.left - model.bounds.width - model.bounds.left);
					marginAbove = getShortNumber(higherNodeModel.bounds.top - higherNodeModel.bounds.height - model.bounds.top);
				}
				
				if (lowerNode && lowerNodeModel) {
					marginToLeft = getShortNumber(lowerNodeModel.bounds.left - lowerNodeModel.bounds.width - model.bounds.left);
					marginBelow = getShortNumber(lowerNodeModel.bounds.top - lowerNodeModel.bounds.height - model.bounds.top);
				}
			}

			b && log("  marginToRight:", marginToRight)
			b && log("  marginAbove:", marginAbove)
			b && log("  marginToLeft:", marginToLeft)
			b && log("  marginBelow:", marginBelow)

			if (layout==Styles.HORIZONTAL) {
				styleName = Styles.MARGIN_RIGHT;
				marginValue = getShortNumber(marginToRight);

				if (marginTop>0) {
					styles[Styles.MARGIN_TOP] = getPx(marginTop);
				}
			}
			else if (layout==Styles.VERTICAL) {
				styleName = Styles.MARGIN_BOTTOM;
				marginValue = getShortNumber(marginBelow);

				if (marginLeft>0) {
					styles[Styles.MARGIN_LEFT] = getPx(marginLeft);
				}
			}

			b && log(styleName + ":" + marginValue)

			// top or left node
			if (nodeIndex==numberOfNodes-1) {
				if (marginValue>-1) {
					styles[styleName] = getPx(marginValue);
				}
			}
			// middle node
			else if (nodeIndex!=numberOfNodes-1) {
				if (marginValue>-1) {
					styles[styleName] = getPx(marginValue);
				}
			}
			// bottom or right most node
			else if (nodeIndex==0) {
				return;
			}
		}
		else if (selfAlignment!="default" && selfAlignment!=null) {

			if (selfAlignment==XDConstants.PUSH_LEFT) {
				styles[Styles.MARGIN_LEFT] = Styles.AUTO;
			}
			else if (selfAlignment==XDConstants.PUSH_RIGHT) {
				styles[Styles.MARGIN_RIGHT] = Styles.AUTO;
			}
			else if (selfAlignment==XDConstants.PUSH_LEFT_RIGHT) {
				styles[Styles.MARGIN] = addString(getPx(0), Styles.AUTO);
			}
			else if (selfAlignment==XDConstants.PUSH_TOP) {
				styles[Styles.MARGIN_TOP] = Styles.AUTO;
			}
			else if (selfAlignment==XDConstants.PUSH_BOTTOM) {
				styles[Styles.MARGIN_BOTTOM] = Styles.AUTO;
			}
			else if (selfAlignment==XDConstants.PUSH_TOP_BOTTOM) {
				styles[Styles.MARGIN] = addString(Styles.AUTO, getPx(0));
			}
			else if (selfAlignment==XDConstants.PUSH_ALL) {
				styles[Styles.MARGIN] = Styles.AUTO;
			}
			else {
				styles[Styles.ALIGN_SELF] = selfAlignment;
			}
		}
		else {
			styles[Styles.ALIGN_SELF] = Styles.AUTO;
		}
	}
}

/**
 * 
 * @param {SceneNode} item 
 * @param {Model} model 
 */
function setContainerAttributes(item, model) {
  var attributes = model.containerAttributes;

  attributes.id = model.elementId;
}

/**
 * Add scene node attributes to the element in the form of attributes	
 * @param {Object} attributes 
 * @param {Model} model 
 */
function setSceneNodeAttributes(attributes, model) {
	attributes[HTMLAttributes.DATA_TYPE] = model.displayType;
	
	attributes[HTMLAttributes.DATA_NAME] = getAttributeSafeValue(model.name);
}

/**
 * Add hyperlink state as an attribute
 * @param {SceneNode} item 
 * @param {Model} model 
 * @param {Object} styles style object containing state info
 * @param {Boolean} asAttribute assign state info to attribute 
 **/
function setStateInformation(item, model, styles = null, asAttribute = false) {
	var styles = styles ? styles : model.cssStyles;

	if (model.hyperlinkElement!=null && model.hyperlinkElement!="") {

		if (asAttribute) {
			model.attributes[HTMLAttributes.DATA_STATE] = model.hyperlinkElement;
		}
		else {
			styles[Styles.STATE] = model.hyperlinkElement;
		}
	}
}

/**
 * 
 * @param {SceneNode} item 
 * @param {Model} model 
 */
function setStylePropertiesInline(item, model) {
  var attributes = model.attributes;

  if (hasProperties(model.cssStyles)) {
	 attributes.style = getCSSValue(model.cssStyles);
  }
}

/**
 * 
 * @param {SceneNode} item 
 * @param {Model} model 
 */
function setContainerStylePropertiesInline(item, model) {
  var properties = model.containerAttributes;

  if (hasProperties(model.cssStyles)) {
	 properties.style = getCSSValue(model.cssStyles);
  }
}

/**
 * Set the debug options of the element
 * @param {SceneNode} item 
 * @param {Model} model 
 **/
function setDebugOptions(item, model, styles = null) {
  	if (styles==null) {
		styles = model.cssStyles;
	}

	// skip opacity if 1
	if (model.showOutline) {
		styles[Styles.OUTLINE] = globalArtboardModel.outlineStyle;
	}
}

/**
 * Set the alpha of the element
 * @param {SceneNode} item 
 * @param {Model} model 
 **/
function setAlphaStyle(item, model) {
  	var styles = model.cssStyles;

	// skip opacity if 1
	if (item.opacity!=1) {
		styles[Styles.OPACITY] = getShortNumber(item.opacity, 3);
	}
}

/**
 * Set the blend mode of the element
 * @param {SceneNode} item 
 * @param {Model} model 
 **/
function setBlendMode(item, model, styles = null) {
	if (styles==null) {
		styles = model.cssStyles;
	}
	var Scene = scenegraph.SceneNode;
	var blendMode = item.blendMode;

	if (Scene==null) {
		return;
	}

	if (blendMode==Scene.BLEND_MODE_PASSTHROUGH) {
		// no pass through in CSS 
		//styles[Styles.MIX_BLEND_MODE] = Scene.BLEND_MODE_PASSTHROUGH;
	}
	else if (blendMode==Scene.BLEND_MODE_COLOR) {
		styles[Styles.MIX_BLEND_MODE] = Scene.BLEND_MODE_COLOR;
	}
	else if (blendMode==Scene.BLEND_MODE_COLOR_BURN) {
		styles[Styles.MIX_BLEND_MODE] = Scene.BLEND_MODE_COLOR_BURN;
	}
	else if (blendMode==Scene.BLEND_MODE_COLOR_DODGE) {
		styles[Styles.MIX_BLEND_MODE] = Scene.BLEND_MODE_COLOR_DODGE;
	}
	else if (blendMode==Scene.BLEND_MODE_DARKEN) {
		styles[Styles.MIX_BLEND_MODE] = Scene.BLEND_MODE_DARKEN;
	}
	else if (blendMode==Scene.BLEND_MODE_DIFFERENCE) {
		styles[Styles.MIX_BLEND_MODE] = Scene.BLEND_MODE_DIFFERENCE;
	}
	else if (blendMode==Scene.BLEND_MODE_EXCLUSION) {
		styles[Styles.MIX_BLEND_MODE] = Scene.BLEND_MODE_EXCLUSION;
	}
	else if (blendMode==Scene.BLEND_MODE_HARD_LIGHT) {
		styles[Styles.MIX_BLEND_MODE] = Scene.BLEND_MODE_HARD_LIGHT;
	}
	else if (blendMode==Scene.BLEND_MODE_HUE) {
		styles[Styles.MIX_BLEND_MODE] = Scene.BLEND_MODE_HUE;
	}
	else if (blendMode==Scene.BLEND_MODE_LIGHTEN) {
		styles[Styles.MIX_BLEND_MODE] = Scene.BLEND_MODE_LIGHTEN;
	}
	else if (blendMode==Scene.BLEND_MODE_LUMINOSITY) {
		styles[Styles.MIX_BLEND_MODE] = Scene.BLEND_MODE_LUMINOSITY;
	}
	else if (blendMode==Scene.BLEND_MODE_MULTIPLY) {
		styles[Styles.MIX_BLEND_MODE] = Scene.BLEND_MODE_MULTIPLY;
	}
	else if (blendMode==Scene.BLEND_MODE_NORMAL) {
		styles[Styles.MIX_BLEND_MODE] = Scene.BLEND_MODE_NORMAL;
	}
	else if (blendMode==Scene.BLEND_MODE_OVERLAY) {
		styles[Styles.MIX_BLEND_MODE] = Scene.BLEND_MODE_OVERLAY;
	}
	else if (blendMode==Scene.BLEND_MODE_SATURATION) {
		styles[Styles.MIX_BLEND_MODE] = Scene.BLEND_MODE_SATURATION;
	}
	else if (blendMode==Scene.BLEND_MODE_SCREEN) {
		styles[Styles.MIX_BLEND_MODE] = Scene.BLEND_MODE_SCREEN;
	}
	else if (blendMode==Scene.BLEND_MODE_SOFT_LIGHT) {
		styles[Styles.MIX_BLEND_MODE] = Scene.BLEND_MODE_SOFT_LIGHT;
	}

}

/**
 * Set the display of the element. Currently only sets the display to "none" or not at all.
 * @param {SceneNode} item 
 * @param {Model} model 
 **/
function setDisplayStyle(item, model, object = null) {
  var styles = object ? object : model.cssStyles;

  // todo handle both cases
  if (model.displayed==false || item.visible==false) {
	  styles[Styles.DISPLAY] = Styles.NONE;
  }
}

/**
 * Set the drop shadow
 * @param {SceneNode} item 
 * @param {Model} model 
 **/
function setDropShadow(item, model, object = null) {
  var styles = object ? object : model.cssStyles;
  
  if (item instanceof GraphicNode && item.shadow && item.shadow.visible) {
	  var shadow = item.shadow;
	  var color = getColorInRGBA(shadow.color);
	  var styleValue = "drop-shadow(" + getShortNumber(shadow.x) + "px " + getShortNumber(shadow.y) + "px " + getShortNumber(shadow.blur) + "px " + color + ")";

	  if (styles[Styles.FILTER]) {
		styles[Styles.FILTER] += " " + styleValue;	
	  }
	  else {
		  styles[Styles.FILTER] = styleValue;
	  }
  }
}

/**
 * Set the blur
 * @param {SceneNode} item 
 * @param {Model} model 
 **/
function setBlur(item, model) {
  var styles = model.cssStyles;
  
  if (item instanceof GraphicNode && item.blur && item.blur.visible) {
	  /** @type {Blur} */
	  var blur = item.blur;
	  var styleValue = "blur(" + getShortNumber(blur.blurAmount) + "px" + ")";
	  var brightness = " brightness(" + blur.brightnessAmount + "%)"; // not used at this time

	  if (styles[Styles.FILTER]) {
		styles[Styles.FILTER] += " " + styleValue;	
	  }
	  else {
		  styles[Styles.FILTER] = styleValue;
	  }
  }
}

function getDisplayTypeName(type) {
	var value;

	switch(type) {
	 
		case XDConstants.ELLIPSE:
		   value = "Ellipse";
		   break;
        case XDConstants.RECTANGLE:
		   value = "Rectangle";
		   break;
        case XDConstants.PATH:
		   value = "Path";
		   break;
        case XDConstants.LINE:
			value = "Line";
		   break;
        case XDConstants.TEXT:
		   value = "Text";
		   break;
        case XDConstants.GROUP:
			value = "Group";
		   break;
        case XDConstants.BOOLEAN_GROUP:
			value = "Boolean Group";
		   break;
        case XDConstants.REPEAT_GRID:
			value = "Repeat Grid";
		   break;
        case XDConstants.SYMBOL_INSTANCE:
			value = "Symbol";
		   break;
        case XDConstants.ARTBOARD:
			value = "Artboard";
		   break;
		default:
			value = type + "";
	}

	return value;
}

/**
 * 
 * @param {SceneNode} item 
 * @param {Model} model 
 */
function setVerticalOverflowStyle(item, model, hidden = false) {
  var styles = model.cssStyles;

  styles[Styles.OVERFLOW_Y] = hidden ? Styles.HIDDEN : Styles.SCROLL;
}

/**
 * 
 * @param {SceneNode} item 
 * @param {Model} model 
 */
function setHorizontalOverflowStyle(item, model, hidden = false) {
  var styles = model.cssStyles;

  styles[Styles.OVERFLOW_X] = hidden ? Styles.HIDDEN : Styles.SCROLL;
}

/**
 * Set the overflow behavior of the element 
 * 
 * Options:
 * - Hidden - Hide any child content that exceeds the set width and height
 * - Visible - Show content that exceeds the set width and height
 * - Auto - Show horizontal or vertical scroll bars as needed
 * - Horizontal Auto - Show horizontal scroll bars if needed. Do no vertical scroll bars
 * - Horizontal On - Show horizontal scroll bars always. Do not show vertical scroll bars
 * - Vertical Auto - Show vertical scroll bars if needed. Do not show horizontal scroll bars
 * - Vertical On - Show vertical scroll bars always. Do not show horizontal scroll bars
 * 
 * @param {Object} styles object to set overflow style on
 * @param {String} value value from OverflowOptions class
 * @param {String} defaultValue some elements we want to set defaults for
 **/
function setOverflowOptions(styles, value, defaultValue = null) {

	// for now default to visible
	if (value==null || value==Styles.DEFAULT) {
		if (defaultValue!=null) {
			value = defaultValue;
		}
		else {
			value = OverflowOptions.VISIBLE;
		}
	}

	if (value==OverflowOptions.HIDDEN) {
		styles[Styles.OVERFLOW] = Styles.HIDDEN;
	}
	else if (value==OverflowOptions.VISIBLE) {
		styles[Styles.OVERFLOW] = Styles.VISIBLE;
	} 
	else if (value==OverflowOptions.AUTO) {
		styles[Styles.OVERFLOW] = Styles.AUTO;
	}
	else if (value==OverflowOptions.ON) {
		styles[Styles.OVERFLOW] = Styles.SCROLL;
	}
	else if (value==OverflowOptions.HORIZONTAL_AUTO) {
		styles[Styles.OVERFLOW_X] = Styles.AUTO;
		styles[Styles.OVERFLOW_Y] = Styles.HIDDEN;
	}
	else if (value==OverflowOptions.HORIZONTAL_ON) {
		styles[Styles.OVERFLOW_X] = Styles.SCROLL;
		styles[Styles.OVERFLOW_Y] = Styles.HIDDEN;
	}
	else if (value==OverflowOptions.VERTICAL_AUTO) {
		styles[Styles.OVERFLOW_X] = Styles.HIDDEN;
		styles[Styles.OVERFLOW_Y] = Styles.AUTO;
	}
	else if (value==OverflowOptions.VERTICAL_ON) {
		styles[Styles.OVERFLOW_X] = Styles.HIDDEN;
		styles[Styles.OVERFLOW_Y] = Styles.SCROLL;
	}
}

/**
 * Sets the graphic fill value on the styles or attributes
 * @param {SceneNode|GraphicNode} item 
 * @param {Model} model 
 * @param {Boolean} setAsAttribute 
 **/
function setGraphicFillStyles(item, model, setAsAttribute = false) {
  var b = (debugModel.fills) && log("Set Graphic Fill Styles()");
  var stylesOrAttributes = model.cssStyles;
  var fillType;
  var fill;

  if (setAsAttribute) {
	stylesOrAttributes = model.attributes;
  }

  if (item.fillEnabled) {
	 fill = item.fill;

	 if (fill==null) {
		b && log("Fill enabled but is null. Setting transparent fill.")
		createSolidFill(item, model, fill, true);
		stylesOrAttributes.fill = model.fill;
		return;
	 }

	 fillType = fill.constructor.name;
	 
	 //logObject(fill);

	 b && log("Fill type:" + fillType);
	 //log("Fill value:" + fill.value);

	 if (fillType==XDConstants.COLOR_FILL) {
		b && log("Color fill");
		//styles.fill = getColorInHexWithHash(fill.value);
		createSolidFill(item, model, fill);
		stylesOrAttributes.fill = model.fill;
		//styles["fill-opacity"] = fill.opacity;
	 }
	 else if (fillType==XDConstants.LINEAR_GRADIENT_FILL || fillType ==XDConstants.RADIAL_GRADIENT_FILL) {
		b && log("Gradient fill");
		createGradientFill(item, model, fill);
		stylesOrAttributes.fill = "url(#" + model.definition.id + ")";
	 }
	 else if (fillType==XDConstants.IMAGE_FILL) {
		b && log("Image fill");
		createImageFill(item, model, fill);
		stylesOrAttributes.fill = "url(#" + model.definition.id + ")";
		//addWarning("ImageFill not supported.", "ImageFill is not supported at this time");
	 }
  }
  else {
	  b && log("Transparent fill");
	 stylesOrAttributes.fill = "transparent";
  }
}

/**
 * Returns the CSS string value of solid fill
 * @param {SceneNode} item 
 * @param {Model} model 
 * @param {Object} fill 
 * @param {Boolean} transparent 
 **/
function createSolidFill(item, model, fill, transparent = false) {
  var b = debugModel.colorFill;
  var rgba;
  var value = "";
  var useRGBA = true;

  if (transparent) {
	 value = "rgba(0,0,0,0)";
	 model.fill = value;
	 return value;
  }

  //rgba = fill.toRgba();

  if (useRGBA) {
	 //value = fill.serialize(); // rgb or rgba(0,0,0,.5)
	 value = getRGBAFromFill(fill);
	 //obj(fill, "Fill");
  }
  else {
	 value = fill.toHex(); // #ff00FF does not include fill alpha?
	 if (value.length<8) {
		//var alpha = Number(rgba.a).toString(16).padStart(2, '0');
		var alpha = Number(fill.a).toString(16);
		value += alpha;
	 }
  }

  model.fill = value;

  return value
  //logObject(value, "fill");
}


function getFillValue(fill, useRGBA = true) {
  var b = debugModel.colorFill;
  var value = "";
  var rgba;
  var alpha = "";
  
  //rgba = fill.toRgba();
  
  if (useRGBA) {
	 //value = fill.serialize(); // rgb or rgba(0,0,0,.5);
	 value = getRGBAFromFill(fill);
  }
  else {
	 value = fill.toHex(); // #000000

	 // not working
	 if (value.length<8) {
		//var alpha = Number(rgba.a).toString(16).padStart(2, '0');
		var alpha = Number(fill.a).toString(16);
		value += alpha;
	 }
  }
  
  return value;
}

/**
 * Defines an object with the SVG or CSS values to create a gradient fill
 * @param {SceneNode} item 
 * @param {Model} model 
 * @param {*} fill 
 * @param {Boolean} fill 
 **/
function createGradientFill(item, model, fill, css = false) {
	var b = debugModel.colorFill && log("Create gradient fill()");
	var gradient = null;
	var type = fill.constructor.name;
	var id = createUniqueItemName(item, model, true);
	var tagName;
	var entry;
	var entries;
	var definition = new Definition();
	var colorStopTagName = "stop";
	var colorStops = [];
	var cssColorStops = [];
	var colorStop;
	var numberOfEntries = 0;
	var useRGBA = false;
	var cssTagName = "";
	var cssRatio = "";
	var cssColor = "";
	var angle = 0;
	var rgba;
	var scaleFactor = 1;
	var xDifference = 1;
	var yDifference = 1;

	gradient = new Gradient();
	gradient.id = id;
	gradient.spreadMethod = "pad";

	definition.id = id;
  
	// is image fill needed?
	if (type==XDConstants.LINEAR_GRADIENT_FILL) {
		tagName = HTMLConstants.LINEAR_GRADIENT;
		cssTagName = "linear-gradient";
		
		var endPoints = fill.getEndPoints();
		// start position
		gradient.x1 = getShortNumber(fill.startX);
		gradient.y1 = getShortNumber(fill.startY);
		// end position
		gradient.x2 = getShortNumber(fill.endX);
		gradient.y2 = getShortNumber(fill.endY);

		var gradientCSS = getLinearGradientCSS(model, fill);

		angle = getAngle(gradient.x1, gradient.y1, gradient.x2, gradient.y2);
		//log("angle:" + angle)
		angle += 90;
	}
	else if (type==XDConstants.RADIAL_GRADIENT_FILL) {
		cssTagName = "radial-gradient";
		tagName = HTMLConstants.RADIAL_GRADIENT;
	}
	else if (type==XDConstants.IMAGE_FILL) {
		tagName = HTMLConstants.BITMAP_FILL;
	}

	definition.tagName = tagName;
	definition.colorStopTagName = colorStopTagName;
	
	entries = fill.colorStops;
	
	numberOfEntries = entries ? entries.length : 0;
	var scaleFactorValue;
	
	for (var i=0; i < numberOfEntries; i++) {
		entry = entries[i];
		colorStop = new ColorStop();
		colorStop.offset = getShortNumber(entry.stop, 4);
		scaleFactorValue = scaleFactor/(numberOfEntries-i);
		scaleFactorValue = i==0 ? 1 : scaleFactor;
		scaleFactorValue = scaleFactor;
		scaleFactorValue = 1;
		
		//log("scaleFactorValue:"+ scaleFactorValue)
		if (i==0) {
			cssRatio = getShortNumber(entry.stop*100*scaleFactorValue, 2) + "%";
		}
		else {
			cssRatio = getShortNumber(entry.stop*100*scaleFactorValue, 2) + "%";
		}
		cssColor = getRGBAFromFill(entry.color);

		if (useRGBA) {
			colorStop[HTMLConstants.STOP_COLOR] = entry.color.serialize(); // rgb or rgba(0,0,0,.5)
		}
		else {
			colorStop[HTMLConstants.STOP_COLOR] = entry.color.toHex();
			colorStop[HTMLConstants.STOP_OPACITY] = getShortNumber(entry.color.a/255);
		}

		colorStops.push(colorStop);
		cssColorStops.push(addString(cssColor, cssRatio));
	}

	definition.colorStops = colorStops;
	definition.properties = gradient;

	if (css) {
		var cssOutput = "";

		cssOutput += cssTagName;
		cssOutput += "(";
		
		if (angle!=0) {
			cssOutput += getShortNumber(angle, 1) + "deg, ";
		}

		cssOutput += cssColorStops.join(", ");
		cssOutput += ")";
		//log(cssOutput)
		//return gradientCSS;
		return cssOutput;
	}

	model.definition = definition;
	
}

/**
 * Get angle from line points
 * @param {Number} startX 
 * @param {Number} startY 
 * @param {Number} endX 
 * @param {Number} endY 
 **/
function getAngle(startX, startY, endX, endY) {
	var deltaX = startX - endX;
	var deltaY = startY - endY;
	var theta = Math.atan2(-deltaY, -deltaX);
	theta *= 180 / Math.PI;
	if (theta < 0) {
		theta = theta + 360;
	}

	return theta;
}

/**
 * Get CSS of linear gradient
 * @param {Model} model 
 * @param {Object} fill 
 */
function getLinearGradientCSS(model, fill) {
	var H = model.groupBounds.drawHeight;
	var W = model.groupBounds.drawWidth;
	var entry;
	var cssColorStops = [];
	var entries = fill.colorStops;
	var gradient = new Gradient();
	var endPoints = fill.getEndPoints();
	// start position
	var x1 = getShortNumber(fill.startX);
	var y1 = getShortNumber(fill.startY);
	// end position
	var x2 = getShortNumber(fill.endX);
	var y2 = getShortNumber(fill.endY);
	var type = fill.constructor.name;
	var cssTagName;
	var numberOfEntries = 0;
	var colorStop;
	var cssRatio = "";
	var cssColor = "";
	var useRGBA = false;

	if (type==XDConstants.LINEAR_GRADIENT_FILL) {
		cssTagName = "linear-gradient";
		var angle1 = getAngle(x1, y1, x2, y2);
		angle1 += 90;
	}
	else if (type==XDConstants.RADIAL_GRADIENT_FILL) {
		cssTagName = "radial-gradient";
	}
	
	var angle = Math.atan((H*(x2 - x1))/Math.abs(W*(y2 - y1))) 
	var angle2 = Math.atan(((x2 - x1))/Math.abs((y2 - y1))) 
	if(y2 > y1) {
		angle=Math.PI - angle;
	}
	angle2 = getShortNumber((angle2 * 180 / Math.PI));
	//log("angle 2:"+angle2)
	//log("angle 3:"+(angle * 180 / Math.PI))
	var angleValue = getShortNumber((angle * 180 / Math.PI))+"deg";
	//angleValue = angle2 +"deg";
	var Dc = Math.abs(W*Math.sin(angle)) + Math.abs(H*Math.cos(angle));
	var Ds = Math.sqrt(W*W*(x2 - x1)*(x2 - x1) + H*H*(y2 - y1)*(y2 - y1));
	var scaleFactor = getShortNumber(Dc/Ds);
	var d = (W*W*(x1 - 0.5)*(x1 - x2)+H*H*(y1 - 0.5)*(y1 - y2))/Math.sqrt(W*W*(x2 - x1)*(x2 - x1) + H*H*(y2 - y1)*(y2 - y1));

	var offsetValue = getShortNumber(((Dc/2 - d)*100) / Dc, 2)+"%";

	numberOfEntries = entries ? entries.length : 0;
	
	for (var i=0; i < numberOfEntries; i++) {
		entry = entries[i];
		colorStop = new ColorStop();
		colorStop.offset = getShortNumber(entry.stop, 4);
		var ratioValue;
		
		if (i==0) {
			//cssRatio = "calc(" + offsetValue + ")";
			ratioValue = getShortNumber(entry.stop*100)+"%";
			cssRatio = "calc(" + ratioValue + "/" + scaleFactor + " + " + offsetValue + ")";
		}
		else {
			ratioValue = getShortNumber(entry.stop*100)+"%";
			cssRatio = "calc(" + ratioValue + "/" + scaleFactor + " + " + offsetValue + ")";
		}
		cssColor = getRGBAFromFill(entry.color);
		cssColorStops.push(addString(cssColor, cssRatio));
	}

	var cssOutput = "";

	cssOutput += cssTagName;
	cssOutput += "(";
	
	if (angle!=0) {
		//cssOutput += getShortNumber(angle, 1) + "deg, ";
		cssOutput += angleValue + ", ";
	}

	cssOutput += cssColorStops.join(", ");
	cssOutput += ")";
	//log(cssOutput)
	return cssOutput;
	
}

/**
 * Get image format of model or default image format
 * @param {Model} model 
 * @returns {String}
 */
function getImageFormat(model = null) {
	var type = model && model.imageFormat;
	var isAcceptableFormat = isSupportedExportFormat(type);
	if (isAcceptableFormat) {
		return type;
	}
	type = globalModel.imageExportFormat;
	return type;
}

/**
 * Get image quality from the model or use the default image quality
 * @param {Model} model 
 * @returns {Number}
 **/
function getImageQuality(model = null) {
	var quality = globalModel.imageExportQuality;
	if (model && model.imageQuality) {
		return model.imageQuality;
	}
	return quality;
}

/**
 * Create an image fill. Incomplete
 * @param {SceneNode} item 
 * @param {Model} model 
 * @param {Object} fill 
 * @param {Boolean} updateModel 
 */
function createImageFill(item, model, fill = null, updateModel = true) {
  var b = debugModel.imageFill && log("Create image fill()");
  var patternProperties = {};
  var type = fill ? fill.constructor.name : null;
  var id = createUniqueItemName(item, patternProperties, true);
  var filename = "";
  var fullFilename = "";
  var definition = new Definition();
  var imageAttributes = {};
  var imageTagName = "image";
  var tagName = HTMLConstants.PATTERN;
  var extension = "";
  
  if (type!=XDConstants.IMAGE_FILL) {
	 // not an image fill
  }

  extension = getImageFormat(model);
  id = id + "_pattern";
  filename = id;
  fullFilename = model.imageFolder + id + "." + extension;
  patternProperties.id = id;
  patternProperties.x = "0";
  patternProperties.y = "0";
  patternProperties.width = "100%";
  patternProperties.height = "100%";
  
  imageAttributes.x = "0";
  imageAttributes.y = "0";
  imageAttributes.width = "100%";
  imageAttributes.height = "100%";
  imageAttributes[HTMLConstants.HREF] = fullFilename;
  // need to set xlink:href for safari 
  imageAttributes[HTMLConstants.XLINK_HREF] = fullFilename;

  // not tested
  if (fill) {
	 if (fill.scaleBehavior==""){
		//image.style.["object-fit"] = "contains";
	 }
	 else if (fill.scaleBehavior=="") {
		//image.style.["object-fit"] = "cover";
	 }
  }

  b && log("filename: " + filename);
  b && log("full filename: " + fullFilename);
  b && log("id: " + id);
  b && log("pattern id: " + patternProperties.id);
  b && log("width: " + item.localBounds.width);
  b && log("height: " + item.localBounds.height);

  if (fill) {
	  b && log("scale behavior: " + fill.scaleBehavior);
	  b && log("isLinkedContent: " + fill.isLinkedContent);
	  b && log("Natural Width: " + fill.naturalWidth);
	  b && log("Natural Height: "  + fill.naturalHeight);
  }

  definition.id = id;
  definition.tagName = tagName;

  definition.imageTagName = imageTagName;
  definition.imageAttributes = imageAttributes;
  definition.colorStops = [];
  definition.properties = patternProperties;
  definition.imageData = fill;
  definition.filename = filename;
  definition.fullFilename = fullFilename;
  definition.extension = extension;

  if (updateModel) {
	  model.definition = definition;
  }

  return "url(" + definition.fullFilename + ")";
}

/**
 * 
 * @param {SceneNode} item 
 * @param {Model} model 
 * @param {Object} fill 
 */
function createImageFillCSS(item, model, fill = null) {
  var b = debugModel.imageFill;
  var patternProperties = {};
  var type = fill ? fill.constructor.name : null;
  //var id = fill ? model.id : createUniqueName(item);
  //var id = fill ? model.id : createUniqueItemName(item, patternProperties);
  var id = createUniqueItemName(item, patternProperties, true);
  var filename;
  var fullFilename;
  var definition = new Definition();
  var imageAttributes = {};
  var imageTagName = "image";
  var tagName = HTMLConstants.PATTERN;
  var extension;
  log("1")
  
  if (type!=XDConstants.IMAGE_FILL) {
	 // not an image fill 
  }

  extension = getImageFormat(model);
  id = id + "_pattern";
  filename = id;
  fullFilename = model.imageFolder + id + "." + extension;
  patternProperties.id = id;
  patternProperties.x = "0";
  patternProperties.y = "0";
  patternProperties.width = "100%";
  patternProperties.height = "100%";
  
  imageAttributes.x = "0";
  imageAttributes.y = "0";
  imageAttributes.width = "100%";
  imageAttributes.height = "100%";
  imageAttributes[HTMLConstants.HREF] = fullFilename;
  // need to set xlink:href for safari 
  imageAttributes[HTMLConstants.XLINK_HREF] = fullFilename;

  // not tested
  if (fill) {
	 if (fill.scaleBehavior==""){
		//image.style.["object-fit"] = "contains";
	 }
	 else if (fill.scaleBehavior=="") {
		//image.style.["object-fit"] = "cover";
	 }
  }

  b && log("filename: " + filename);
  b && log("full filename: " + fullFilename);
  b && log("id: " + id);
  b && log("pattern id: " + patternProperties.id);
  b && log("width: " + item.localBounds.width);
  b && log("height: " + item.localBounds.height);

  if (fill) {
	  b && log("scale behavior: " + fill.scaleBehavior);
	  b && log("isLinkedContent: " + fill.isLinkedContent);
	  b && log("Natural Width: " + fill.naturalWidth);
	  b && log("Natural Height: "  + fill.naturalHeight);
  }

  definition.id = id;
  definition.tagName = tagName;

  definition.imageTagName = imageTagName;
  definition.imageAttributes = imageAttributes;
  definition.colorStops = [];
  definition.properties = patternProperties;
  definition.imageData = fill;
  definition.filename = filename;
  definition.fullFilename = fullFilename;
  definition.extension = extension;

  model.definition = definition;
}

/**
 * Sets the graphic stroke style or attribute
 * @param {SceneNode} item 
 * @param {Model} model 
 * @param {Boolean} setAsAttribute 
 **/
function setGraphicStrokeStyles(item, model, setAsAttribute = true) {
	var b = debugModel.strokeStyle;
	var styles = model.cssStyles;
	var strokeType;
	var strokeColor;// is Color
	var useRGBA = true;

	if (setAsAttribute) {
		styles = model.attributes;
	}

  	if (item instanceof GraphicNode && item.strokeEnabled) {
		strokeColor = item.stroke;
		if (strokeColor==null) return; // text?
		strokeType = strokeColor.constructor.name;
		//var rgba = strokeColor.toRgba();

		if (useRGBA) {
			styles.stroke = getRGBAFromFill(strokeColor); // rgb or rgba(0,0,0,.5)
		}
		else {
			styles.stroke = strokeColor.toHex(true);
		}
		
		styles[Styles.STROKE_WIDTH] = item.strokeWidth + Styles.PIXEL;
		styles[Styles.STROKE_LINE_JOIN] = item.strokeJoins;
		
		if (item.strokeEndCaps==CapsStyle.NONE) {
			styles[Styles.STROKE_LINE_CAP] = CapsStyle.NORMAL;
		}
		else {
			styles[Styles.STROKE_LINE_CAP] = item.strokeEndCaps;
		}
		
		if (item.strokeDashArray.length) {
			styles[Styles.STROKE_DASH_ARRAY] =  item.strokeDashArray.toString().replace(/,/g, " ");
			styles[Styles.STROKE_DASH_OFFSET] =  item.strokeDashOffset;
		}

		styles[Styles.STROKE_MITER_LIMIT] = item.strokeMiterLimit;
		//styles[Styles.STROKE_POSITION] = item.strokePosition;
		//styles[Styles.STROKE_ALIGNMENT] = item.strokePosition;
		//styles[Styles.STROKE_LOCATION] = item.strokePosition;

		if (item.strokePosition!="center") {

		if (debugModel.ignoreStrokeNotSupported==false) {
			addWarning(MessageConstants.BORDER_SUPPORT, "Border position \"" + item.strokePosition + "\" on \"" + model.elementId + "\"  is not supported");
		}
	}

	if (model.useCrispEdges) {
		styles[Styles.SHAPE_RENDERING] = Styles.CRISP_EDGES;
	}
	else {
		styles[Styles.SHAPE_RENDERING] = Styles.AUTO;
		}
	}
}


/**
 * Set the background style in css
 * @param {SceneNode} item 
 * @param {Model} model 
 * @param {Object} styles style object to set border and border radius on (optional) 
 * @param {Boolean} updateModel update model
 **/
function setBackgroundFillStyles(item, model, styles = null, updateModel = true) {
	var fill = item.fill;
	var fillType = fill && fill.constructor.name;
	var fillEnabled = item.fillEnabled;
	var fillCSS = "";

	if (fill==null || fillEnabled==false) {
		fillCSS = createSolidFill(item, model, fill, true);
		if (styles) styles[Styles.BACKGROUND_COLOR] = fillCSS;
	}
	else if (fillType==XDConstants.COLOR_FILL) {
		fillCSS = createSolidFill(item, model, fill);
		if (styles) styles[Styles.BACKGROUND_COLOR] = fillCSS;
	}
	else if (fillType==XDConstants.LINEAR_GRADIENT_FILL || fillType ==XDConstants.RADIAL_GRADIENT_FILL) {
		fillCSS = createGradientFill(item, model, fill, true);
		if (styles) styles[Styles.BACKGROUND] = fillCSS;
	}
	else if (fillType==XDConstants.IMAGE_FILL) {
		fillCSS = createImageFill(item, model, fill, updateModel);
		if (styles) styles[Styles.BACKGROUND] = fillCSS;
		addWarning(MessageConstants.IMAGE_FILL_SUPPORT, "Image fill is not supported with this element currently")
	}

	var borderRadiusValue = "0";

	if (item && item.hasRoundedCorners) {
		borderRadiusValue = getPx(item.effectiveCornerRadii.topLeft);
		borderRadiusValue = addString(borderRadiusValue, getPx(item.effectiveCornerRadii.topRight));
		borderRadiusValue = addString(borderRadiusValue, getPx(item.effectiveCornerRadii.bottomRight));
		borderRadiusValue = addString(borderRadiusValue, getPx(item.effectiveCornerRadii.bottomLeft));

		if (styles) styles[Styles.BORDER_RADIUS] = borderRadiusValue;
	}

	return fillCSS;
}

/**
 * Gets the graphic stroke as a border style or sets the border
 * @param {SceneNode} item 
 * @param {Model} model 
 * @param {Object} object style object to set border and border radius on (optional) 
 **/
function setBorderStyles(item, model, object = null) {
	var b = debugModel.strokeStyle;
	var styles = model.cssStyles;
	var strokeType;
	var strokeColor;// is Color
	var useRGBA = true;
	var borderColor = null;
	var borderWidth = null;
	var borderStyle = "solid";
	var borderValue = "0";
	var isGraphicNode = item instanceof GraphicNode;
	var isRectange = getIsRectangle(item);

  	if (item instanceof GraphicNode && item.strokeEnabled) {
		strokeColor = item.stroke;

		if (strokeColor!=null) {

			strokeType = strokeColor.constructor.name;
		
			if (useRGBA) {
				borderColor = getRGBAFromFill(strokeColor);
			}
			else {
				borderColor = strokeColor.toHex(true);
			}
			
			borderWidth = item.strokeWidth + Styles.PIXEL;
			
			if (item.strokeDashArray.length) {
				borderStyle = Styles.DASHED;
			}
		
			if (item.strokePosition!="center") {
				// todo: maybe add support for outer, inner or center border using outline and outline offset
			}
		
			borderValue = addStrings(" ", borderWidth, borderStyle, borderColor);
		}
		else {
			borderValue = "0";
		}
	}

	// set styles if styles object passed in
	if (object) {
		object[Styles.BORDER] = borderValue;	
	}

	return borderValue;
}

/**
 * Get if element is in a Flexbox layout
 * Currently model is only created during export
 * Set last parameter to true to get the model if outside of export
 * @param {SceneNode} item 
 * @param {Model} model 
 **/
function getIsFlexItem(item, model, createModelIfNeeded = false) {
	var parentModel = getParentModel(item, createModelIfNeeded);
	var layout = null;
	
	if (parentModel) {
		layout = parentModel.layout;

		if (layout==Styles.COLUMN || layout==Styles.COLUMN_REVERSE ||
			layout==Styles.ROW || layout==Styles.ROW_REVERSE || 
			layout==XDConstants.STACK) {
				return true;
		}
	}

	return false;
}

/**
 * Get if element is in a Flexbox layout
 * Currently model is only created during export
 * Set last parameter to true to get the model if outside of export
 * @param {SceneNode} item 
 **/
function getParentModel(item, createModelIfNeeded = false) {
	var parentModel = item && item.parent && getModel(item.parent);

	if (item!=null && parentModel==null && createModelIfNeeded) {
		parentModel = createModel(item.parent, 0, 0, true);
	}
	
	return parentModel;
}

/**
 * Get if element is in a group
 * @param {SceneNode} item 
 * @returns {Boolean} 
 **/
function getIsInGroup(item) {
	var parent = item && item.parent;
	var isArtboard = parent && getIsArtboard(parent);

	if (parent!=null && parent.isContainer && isArtboard==false) {
		return true;
	}

	return false;
}

/**
 * Get if element is a group not including boolean group
 * @param {SceneNode} item 
 * @returns {Boolean} 
 **/
function getIsGroup(item) {
	var isContainer = item && item.isContainer;
	var isArtboard = item && getIsArtboard(item);
	var booleanGroup = item instanceof BooleanGroup;

	if (item && isContainer && booleanGroup==false) {
		return true;
	}

	return false;
}

/**
 * Get if element is rectangle
 * @param {SceneNode} item 
 * @returns {Boolean} 
 **/
function getIsRectangle(item) {
	return item instanceof Rectangle;
}

/**
 * Get if element is mask group
 * @param {SceneNode} item 
 * @returns {Boolean} 
 **/
function getIsMask(item) {
	
	if (item && item instanceof Group && item.mask && item.isContainer) {
		return true;
	}

	return false;
}

/**
 * Deletes styles not applicable when using flexbox
 * @param {SceneNode} item 
 * @param {Model} model 
 * @param {Object} object styles object 
 **/
function deleteNonApplicableFlexStyles(item, model, object) {

	//delete object[Styles.POSITION];
	// set position as relative
	object[Styles.POSITION] = Styles.RELATIVE;
	delete object[Styles.LEFT];
	delete object[Styles.RIGHT];
	delete object[Styles.BOTTOM];
	delete object[Styles.TOP];
}

/**
 * A scene node to export as an image
 * @param {SceneNode} item 
 * @param {Model} model 
 * @param {Array} scales
 **/
function addToRenditions(item, model, scales = [1], type = null, quality = 0, isEmbedded = false) {
	// to export a scene node create a definition

	// set id
	// set node to scenenode
	// exported filename will be id + . + png
	// if you set fullFilename it will be used instead
	// if you set scale it will be used otherwise scale will be 1

	var exportScales = scales.concat();

	if (type==null) {
		type = getImageFormat(model);
	}

	if (quality == 0 || quality == null) {
		quality = getImageQuality(model);
	}

	var prefix = getImagePrefix(globalArtboardModel)

	if (model.image2x===false || globalArtboardModel.image2x===false) {
		exportScales.length = 1;
	}

	var numberOfScales = exportScales.length;
	
	for (let index = 0; index < numberOfScales; index++) {
		const scale = exportScales[index];
		
		var definition = new Definition();

		definition.id = model.elementId;

		if (scale!=1) {
			definition.id = model.elementId + "@" + scale + "x";
		}

		definition.node = item;
		//definition.fullFilename = model.id + "." + XDConstants.PNG;
		definition.type = type;
		definition.extension = type;
		definition.scale = scale;
		definition.quality = quality;
		definition.exclude = isEmbedded;
		definition.prefix = prefix;

		model.renditions.push(definition);
		
		if (model.imageDefinition==null) {
			model.imageDefinition = definition;
		}
	}
}

function setPathData(item, model) {
  var properties = model.attributes;

  properties.d = item.pathData;
}

function setPathAttributes(item, model) {
  var properties = model.attributes;
  var groupBounds = model.groupBounds;

  properties.d = item.pathData;
}

function setEllipseProperties(item, model) {
  var properties = model.attributes;
  var groupBounds = model.groupBounds;
  var rx = item.localBounds.width/2;
  var ry = item.localBounds.height/2;
  //var cx = groupBounds.x + rx;
  //var cy = groupBounds.y + ry;
  var cx = rx;
  var cy = ry;
  properties.rx = rx;
  properties.ry = ry;
  properties.cx = cx;
  properties.cy = cy;
}

/**
 * adds position and size styles for a container tag to the cssStyles object 
 * @param {SceneNode} item 
 * @param {Model} model 
 **/
function setRectangleAttributes(item, model) {
  var attributes = model.attributes;
  var groupBounds = model.groupBounds;
  var width = item.localBounds.width;
  var height = item.localBounds.height;
  var x = groupBounds.x;
  var y = groupBounds.y;

  attributes.rx = item.effectiveCornerRadii.topLeft;
  attributes.ry = item.effectiveCornerRadii.topLeft;

  attributes.x = 0;
  attributes.y = 0;
  attributes.width = getShortNumber(width);
  attributes.height = getShortNumber(height);

  if (model.alternateWidth) {

	if (model.alternateWidth=="none") {
		delete attributes.width;
	}
	else {
		attributes.width = model.alternateWidth;
	}
  }

  if (model.alternateHeight) {

	 if (model.alternateHeight=="none") {
		 delete attributes.height;
	 }
	 else {
		attributes.height = model.alternateHeight;
	 }
  }
  
}

/**
 * Set the text properties
 * @param {SceneNode} item 
 * @param {Model} model 
 **/
function setTextProperties(item, model) {
  var innerContent = getTextValue(item, model);

  model.innerContent = innerContent;
}

/**
 * Gets the text value 
 * @param {SceneNode} item Text element. Text extends GraphicNode which extends SceneNode
 * @param {Model} model 
 **/
function getTextValue(item, model, sourceCompare = null) {
	var b = debugModel.getTextValue;
	var styleRanges = item.styleRanges;
	var containerStyles = model.cssStyles;
	var styleValues = "";
	var source = "";
	var textValue;
	var tag = null;
	var properties;
	var rangeIndex = 0;
	var styleRange;
	var firstStyleRange;
	var currentLength = 0;
	var numberOfStyleRanges;
	let characters;
	let numberOfCharacters;
	var lineSpacing = item.lineSpacing;
	var paragraphSpacing = item.paragraphSpacing;
	var attemptLineSpacing = true;
	var attemptParagraphSpacing = false;
	var commonStyles = {};
	var commonStylesArray = [];
	var parentStyles = {};
	var styleNames = ["fontFamily", "fontSize", "fontStyle", "charSpacing", "underline", "fill"]; // Styles.TEXT_STYLES
	var styleName;
	var spanStylesMatchGroupStyles = false;
	var additionalStyles = null;
	var fontSize = 0;
	var spanClassValue = null;
	var attributes = null;
	var noTag = model.subTagName=="none" ? true : false;
	var attributesValue = null;
	var textIds = getStylesObject(model.textIds, true); // get name value object
	var textIdTokens = textIds ? getPropertiesAsArray(textIds) : null;
	var textTokens = getStylesObject(model.textTokens, true); // get name value object
	var textTokensArray = textTokens ? getPropertiesAsArray(textTokens) : null;
	var idsFoundArray = [];
	var tokensFoundArray = [];
	var trimmedTextValue = null;
	var leftTrimmedTextValue = null;
	var id = null;
	var lastId = null;
	var replaceAllTokens = false;
	var replaceAllIds = false;
	
	tag = model.subTagName!=null && model.subTagName!="" && model.subTagName!=Styles.NONE ? model.subTagName : HTMLConstants.SPAN;
	attributes = model.subAttributes!=null && model.subAttributes!="" ? model.subAttributes : null;
	spanClassValue = model.subClassesArray.length ? model.subClassesArray.join(" ") : null;
	additionalStyles = model.subStyles ? model.subStyles : null;
	
	numberOfStyleRanges = styleRanges.length;
	characters = item.text;
	numberOfCharacters = characters.length;
	firstStyleRange = numberOfStyleRanges ? styleRanges[0] : null;
	fontSize = firstStyleRange ? firstStyleRange.fontSize : 12;
	commonStylesArray = styleNames.slice();

	// container styles
	if (attemptLineSpacing) {

		if (lineSpacing!=0 && lineSpacing>fontSize) {
			b && log("Line spacing:" + lineSpacing);
			containerStyles[Styles.LINE_HEIGHT] = lineSpacing + Styles.PIXEL;
			containerStyles[Styles.MARGIN_TOP] = -((lineSpacing-fontSize)/2) + Styles.PIXEL;
		}
		else {
			//containerStyles[Styles.LINE_HEIGHT] = item.lineSpacing + Styles.PIXEL;
		}
	
		if (attemptParagraphSpacing && paragraphSpacing!=null && paragraphSpacing!=0) {
			b && log("Paragraph spacing:" + paragraphSpacing);
	
			// for now we want to add to the line height - if its zero then we use font size
			if (lineSpacing==0) {
				lineSpacing = fontSize * 1.2;
			}

			containerStyles[Styles.LINE_HEIGHT] = lineSpacing + paragraphSpacing + Styles.PIXEL;
		}
	}

	// add container styles

	// text align
	if (item.textAlign!=null) {
		b && log("Text align:" + item.textAlign);
		containerStyles[Styles.TEXT_ALIGN] = item.textAlign;
	}

	// vertical text position issue
	if (model.liftTextUp) {
		containerStyles[Styles.MARGIN_TOP] = "-.2em";
	}
	
	setTextStylesObject(firstStyleRange, commonStyles, parentStyles, containerStyles);

	b && log("Number of style ranges:" + numberOfStyleRanges);
	b && log("Text:" + getShortString(characters, 80));

	// log ("application version " + application.version); // 14.0.42.14

	// go through styles and find the styles that are the same
	// also create a parent styles object
	for (let j = 0; j < styleNames.length; j++) {
		styleName = styleNames[j];

		// loop through style ranges and discard 
		for (let i = 0; i < numberOfStyleRanges; i++) {
			styleRange = styleRanges[i];
			
			if (i==0) {
				commonStyles[styleName] = styleRange[styleName];
				parentStyles[styleName] = styleRange[styleName];
				continue;
			}

			if (styleName in commonStyles && (commonStyles[styleName] != styleRange[styleName])) {
				delete commonStyles[styleName];

				if (commonStylesArray.indexOf(styleName)!=-1) {
					commonStylesArray.splice(commonStylesArray.indexOf(styleName), 1)
				}
			}
		}
	}

	// check if all the style range styles match the text node styles
	spanStylesMatchGroupStyles = styleNames.length==commonStylesArray.length;

	// loop through all of the style ranges
	for (var i=0;i<numberOfStyleRanges;i++) {
		styleRange = styleRanges[i];
		source += noTag ? "" : "<";
		properties = {};

		// get the text for the style range
		if (numberOfStyleRanges==1) {
			textValue = characters;
		}
		else {
			if (i==numberOfStyleRanges-1) {
				currentLength = rangeIndex+styleRange.length;

				if (currentLength<numberOfCharacters) {
					textValue = characters.substr(rangeIndex, numberOfCharacters);
				}
				else {
					textValue = characters.substr(rangeIndex, styleRange.length);
				}
			}
			else {
				textValue = characters.substr(rangeIndex, styleRange.length);
			}
		}
		
		b && log("i:" + i);
		b && log("text index:" + rangeIndex);
		b && log("style length:" + styleRange.length);
		b && log("text value:" + textValue);

		var hasLineEnding = textValue.replace(/\n$/, "").length!=textValue.length;
		trimmedTextValue = textValue.replace(/\n|\r/g, "");

		// text ids finds text by value and 
		// gives a range of text an id so you can reference the text later
		// for example if you enter "start:startID" then the word "start" is wrapped in a span with id set to "startID"
		if (textIds && replaceAllIds==false) {
			idsFoundArray = [];

			for (let tokenIndex = 0; tokenIndex < textIdTokens.length; tokenIndex++) {
				var word = textIdTokens[tokenIndex];

				if (word=="*") {
					replaceAllIds = true;
					break;
				}

				if (textValue.includes(word)) {
					idsFoundArray.push(word)
				}
			}


			if (replaceAllIds) {
				if (numberOfStyleRanges>1) {
					lastId = textIds["*"];
				}
				else {
					id = textIds["*"];
				}
			}
			// if token is already completely inside of a span
			else if (textIds[textValue]!=null) {
				id = textIds[textValue];
			}
			else if (textIds[trimmedTextValue]!=null) {
				id = textIds[trimmedTextValue];
			}
			else if (textIdTokens.indexOf(textValue)!=-1) {
				//log("textIdTokens.indexOf(textValue):"+textIdTokens.indexOf(textValue))
			}
			else {
				id = null;

				// if token is not in a span add one
				for (let k=0;k<idsFoundArray.length;k++) {
					let token = idsFoundArray[k];
					let tokenIDValue = textIds[token];
					let startPosition = textValue.indexOf(token);
					let newToken = "";
					

					if (startPosition!=-1) {

						// giving an id to the element 
						if (token) {
							newToken = getTag(HTMLConstants.SPAN, {id:tokenIDValue}, true, token, null, false);
							textValue = textValue.replace(token, newToken);
							var idIsUnique = isIDUnique(globalArtboardModel, tokenIDValue);

							if (idIsUnique==false) {
								var messageValue = "The text field named, \"" + model.name + "\" with text id " + tokenIDValue;
								messageValue  +=  " on artboard, \"" + globalArtboardModel.name + "\" was used already";
							
								if (debugModel.ignoreDuplicateIDs==false) {
									addWarning(MessageConstants.DUPLICATE_TEXT_ID, messageValue);
								}
							}
							else {
								addID(globalArtboardModel, tokenIDValue);
							}
						}
					}
				}
			}
		}
		else {
			id = null;
		}

		if (id!=null) {
			var idIsUnique = isIDUnique(globalArtboardModel, id);

			if (idIsUnique==false) {
				var messageValue = "The text field named, \"" + model.name + "\" with text id " + id +  " on artboard, \"" + globalArtboardModel.name + "\" was used already";
			
				if (debugModel.ignoreDuplicateIDs==false) {
					addWarning(MessageConstants.DUPLICATE_TEXT_ID, messageValue);
				}
			}
			else if (id!=null) {
				addID(globalArtboardModel, id);
			}
		}

		// text tokens finds text by value and replaces it with the replacement value
		// or for example if you enter "start:running" then the word "start" is replaced by "running"
		if (textTokens) {
			tokensFoundArray = [];

			if (replaceAllTokens) {
				textValue = "";
				continue;
			}

			for (let tokenIndex = 0; tokenIndex < textTokensArray.length; tokenIndex++) {
				var word = textTokensArray[tokenIndex];

				if (word=="*") {
					replaceAllTokens = true;
				}

				if (textValue.includes(word)) {
					tokensFoundArray.push(word)
				}
			}

			if (replaceAllTokens) {
				textValue = textTokens["*"];
			}
			// if token is already completely inside of a span
			else if (textTokens[textValue]!=null) {
				textValue = textTokens[textValue];
			}
			else if (textTokens[trimmedTextValue]!=null) {
				textValue = textTokens[trimmedTextValue];
			}
			else if (textTokensArray.indexOf(textValue)!=-1) {
				//log("textTokensArray.indexOf(textValue):"+textTokensArray.indexOf(textValue))
			}
			else {

				// if token is not in a span add one
				for (let k=0;k<tokensFoundArray.length;k++) {
					let token = tokensFoundArray[k]; // search pattern "John"
					let replacement = textTokens[token]; // replacement value "Name" 
					let startPosition = textValue.indexOf(token);
					let newToken = "";
					
					if (startPosition!=-1) {

						if (token) {
							newToken = replacement;
							textValue = textValue.replace(token, newToken);
						}
					}
				}
			}
		}
		
		if (hasLineEnding) {
			leftTrimmedTextValue = textValue.replace(/\n$/, "");
			textValue = leftTrimmedTextValue.replace(/\n|\r/g, "<br/>");
		}
		else {
			textValue = textValue.replace(/\n|\r/g, "<br/>");
		}

		setTextStylesObject(styleRange, commonStyles, parentStyles, properties);
		
		styleValues = getCSSValue(properties);

		// setting additional styles on each span doesn't make sense in this point 
		// because all style ranges will get the same value
		// unless it's a style that can't be inherited from the parent class
		if (additionalStyles!=null) {

			if (styleValues.lastIndexOf(";")!=styleValues.length-1) {
				//styleValues += ";";
			}

			styleValues = addString(styleValues, additionalStyles, ";");

			//styleValues += additionalStyles;
		}

		var lastSpanTag = false;
		if (replaceAllIds && rangeIndex==0 && numberOfStyleRanges>1) {
			id = lastId;
			attributesValue = tag;
	
			attributesValue = addString(attributesValue, "id=\"" + lastId + "\"");
			attributesValue = spanClassValue!=null ? addString(attributesValue, "class=\"" + spanClassValue + "\"") : attributesValue;
			attributesValue = (spanStylesMatchGroupStyles==false || additionalStyles!=null) && styleValues!=null && styleValues!="" ? addString(attributesValue, "style=\"" + styleValues + "\"") : attributesValue;
			attributesValue = attributes!=null ? addString(attributesValue, attributes) : attributesValue;
	
			// text ids do not work if tag is set to none
			source = "<" + attributesValue + ">" + source;
			id = null;
		}
		
		if (replaceAllIds && i==numberOfStyleRanges-1 && numberOfStyleRanges>1) {
			lastSpanTag = true;
		}
		
		attributesValue = tag;

		attributesValue = id!=null ? addString(attributesValue, "id=\"" + id + "\"") : attributesValue;
		attributesValue = spanClassValue!=null ? addString(attributesValue, "class=\"" + spanClassValue + "\"") : attributesValue;
		attributesValue = (spanStylesMatchGroupStyles==false || additionalStyles!=null) && styleValues!=null && styleValues!="" ? addString(attributesValue, "style=\"" + styleValues + "\"") : attributesValue;
		attributesValue = attributes!=null ? addString(attributesValue, attributes) : attributesValue;

		// text ids do not work if tag is set to none
		source += noTag ? "" : attributesValue + ">";
		source += textValue;
		source += noTag ? "" : "</" + tag + ">";
		source += lastSpanTag==true ? "</" + tag + ">" : "";
		source += hasLineEnding ? "<br>" : "";
		rangeIndex += styleRange.length;

		if (replaceAllTokens) {
			break;
		}
	}

	return source;
}

/**
 * Returns true if the style passed in is in the commonStyles object or if the 
 * value of the style in the parentStyles object matches the value passed in
 * @param {Object} commonStyles 
 * @param {Object} parentStyles 
 * @param {String} style 
 * @param {Object|String} value 
 **/
function canInheritValue(commonStyles, parentStyles, style, value) {
	var b = debugModel.canInherit;
	b && log("parent value : " + parentStyles[style]);
	b && log("parameter value : " + value);
	
	if (style in commonStyles) {
		b && log("is common style");
		return true;
	}
	
	if (style=="fill") {
		var parentFill = parentStyles && parentStyles[style] && "toRgba" in parentStyles[style] ? getRGBAFromFill(parentStyles[style]) : null;
		var currentFill = value && "toRgba" in value ? getRGBAFromFill(value) : null;

		b && log("parentFill : " + parentFill);
		b && log("currentFill : " + currentFill);

		if (parentFill == currentFill) {
			return true;
		}
		
		return false;
	}
	else if (parentStyles[style]==value) {
		return true;
	}

	return false;
}

/**
 * Set the styles on a span of text 
 * @param {Object} styleRange 
 * @param {Object} commonStyles 
 * @param {Object} parentStyles 
 * @param {Object} styles The properties that 
 **/
function setTextStylesObject(styleRange, commonStyles, parentStyles, styles) {
	var b = false;
	var fontFamily;
	var alternativeFonts;
	var value;
	var fontStyle;
	var isLight;
	var numberOfStyles;
	var fontFamily;
	var alternativeFonts;
	let characters;
	let numberOfCharacters;
	var lineSpacing = 0;
	var paragraphSpacing = 0;
	var attemptLineSpacing = false;

	alternativeFonts = globalArtboardModel.alternativeFont;

	// FONT FAMILY
	if (canInheritValue(commonStyles, parentStyles, "fontFamily", styleRange.fontFamily)==false) {
		fontFamily = styleRange.fontFamily;
		
		if (alternativeFonts!=null && alternativeFonts!="") {
			value = fontFamily + ", " + alternativeFonts;
		}
		else {
			value = styleRange.fontFamily;
		}

		styles[Styles.FONT_FAMILY] = value;
	}

	if (alternativeFonts=="none") {
		delete styles[Styles.FONT_FAMILY];
	}
	
	// FONT STYLE
	if (canInheritValue(commonStyles, parentStyles, "fontStyle", styleRange.fontStyle)==false) {
		fontStyle = styleRange.fontStyle.toLowerCase();
	
		if (fontStyle=="regular") {
			value = Styles.FONT_STYLE_NORMAL;
		}
		else if (fontStyle=="italic" || fontStyle=="oblique") {
			value = Styles.FONT_STYLE_ITALIC;
		}
		else {
			value = Styles.FONT_STYLE_NORMAL;
		}

		styles[Styles.FONT_STYLE] = value;
	}
	
	// FONT WEIGHT
	if (canInheritValue(commonStyles, parentStyles, "fontStyle", styleRange.fontStyle)==false) {
		isLight = fontStyle.indexOf("light")!=-1 || fontStyle.indexOf("thin")!=-1;
	
		if (fontStyle.indexOf("bold")!=-1) {
			value = Styles.FONT_WEIGHT_BOLD;
		}
		else if (globalArtboardModel.supportLightFonts && isLight) {
			value = Styles.FONT_WEIGHT_LIGHT;
		}
		else {
			value = Styles.FONT_WEIGHT_NORMAL;
		}
	
		styles[Styles.FONT_WEIGHT] = value;
	}

	// FONT SIZE
	if (canInheritValue(commonStyles, parentStyles, "fontSize", styleRange.fontSize)==false) {
		value = styleRange.fontSize + Styles.PIXEL;

		styles[Styles.FONT_SIZE] = value;
	}

	// FONT COLOR
	if (canInheritValue(commonStyles, parentStyles, "fill", styleRange.fill)==false) {
		value = getFillValue(styleRange.fill);

		styles[Styles.COLOR] = value;
	}

	// FONT CHARACTER SPACING
	if (canInheritValue(commonStyles, parentStyles, "charSpacing", styleRange.charSpacing)==false) {
		
		if (styleRange.charSpacing!=0) {
			value = styleRange.charSpacing/GlobalModel.characterSpacingFactor + Styles.PIXEL;
			styles[Styles.LETTER_SPACING] = value;
		}
	}
	
	// FONT UNDERLINE
	if (canInheritValue(commonStyles, parentStyles, "underline", styleRange.underline)==false) {
		value = styleRange.underline;

		if (styleRange.underline) {
			styles[Styles.TEXT_DECORATION] = Styles.TEXT_DECORATION_UNDERLINE;
		}
	}
	
	// TEXT UNDERLINE
	if (canInheritValue(commonStyles, parentStyles, Styles.TEXT_DECORATION_UNDERLINE, styleRange.underline)==false) {
		value = styleRange.underline;

		if (styleRange.underline) {
			styles[Styles.TEXT_DECORATION] = Styles.TEXT_DECORATION_UNDERLINE;
		}
	}
	
	// STRIKE THROUGH
	if (canInheritValue(commonStyles, parentStyles, "strikethrough", styleRange.underline)==false) {
		value = styleRange.strikethrough;

		if (styleRange.strikethrough) {
			styles[Styles.TEXT_DECORATION] = addString(styles[Styles.TEXT_DECORATION], Styles.LINE_THROUGH);
		}
	}
	
	// SUPER OR SUB SCRIPT 
	if (canInheritValue(commonStyles, parentStyles, "textScript", styleRange.textScript)==false) {
		value = styleRange.textScript;

		if (styleRange.textScript=="superscript") {
			styles[Styles.VERTICAL_ALIGN] = Styles.SUPER_SCRIPT;
		}
		else if (styleRange.textScript=="subscript") {
			styles[Styles.VERTICAL_ALIGN] = Styles.SUB_SCRIPT;
		}
	}
	
	// TEXT TRANSFORM 
	if (canInheritValue(commonStyles, parentStyles, "textTransform", styleRange.textTransform)==false) {
		value = styleRange.textScript;

		if (styleRange.textTransform=="uppercase") {
			styles[Styles.TEXT_TRANSFORM] = Styles.UPPER_CASE;
		}
		else if (styleRange.textTransform=="lowercase") {
			styles[Styles.TEXT_TRANSFORM] = Styles.LOWER_CASE;
		}
		else if (styleRange.textTransform=="titlecase") {
			styles[Styles.TEXT_TRANSFORM] = Styles.CAPITALIZE;
		}
	}
	
	// FLIP Y 
	if (canInheritValue(commonStyles, parentStyles, "flipY", styleRange.textTransform)==false) {
		value = styleRange.flipY;

		if (styleRange.flipY) {
			styles[Styles.TRANSFORM] = "scale(1, -1);";
		}
	}
	
	// setting display to inherit, block, grid, table or flex 
	// helps pull up text / reduce the overhead space of the text when font is not installed
	// there is about a .2em margin above text 
	// sort of the same as using margin-top:-.2em
	
	// Update 1.1.4 - disabling because it causes each span to move to a new line
	var setBlockDisplay = false;
	if (setBlockDisplay) {
		styles[Styles.DISPLAY] = Styles.INHERIT;
	}

	return styles;
}

/**
 * Set ID attribute. If set to none no id is set.
 * @param {SceneNode} item 
 * @param {Model} model 
 * @param {Object} attributes 
 **/
function setIdAttribute(item, model, attributes) {
	
	if (model.elementId!="none") {
		if (globalArtboardModel.useClassesToStyleElements || globalArtboardModel.markupOnly) {
	
			// if using classes only set id if user defined an id
			if (model.id!=null && model.id!=null) {
				attributes.id = model.elementId;
			}
		}
		else {
			attributes.id = model.elementId;
		}
	}
	
}

function setElementAttributes(item, model) {
  var attributes = model.attributes;
  
  attributes.id = model.elementId;
}

function setTransitionStyle(styles, property = "all", duration = 1, timing = "ease-out", delay = 0) {
	var values = [];
	values.push(property);
	values.push(duration + "s");
	values.push(timing);
	values.push(delay + "s");
	styles[Styles.TRANSITION] = values.join(XDConstants.SPACE);
}

/**
 * Get prefix before image path 
 * @param {ArtboardModel} artboardModel 
 * @returns {String}
 **/
function getImagePrefix(artboardModel) {
	var exportFolder = artboardModel.imagesExportFolder;
	var imagePrefix = artboardModel.imagesPrefix;
	var documentFolder = globalModel.selectedArtboardModel.getSubdirectoryPath();
	var pageInSubDirectory = artboardModel.hasSubdirectory();
	var numberOfSubFolders = getNumberOfDirectories(documentFolder);
	var documentPrefix = repeatCharacter(artboardModel.upDirectorySymbol, numberOfSubFolders);
	var prefix = "";
	var prefixes = [];

	
	if (imagePrefix) {
		prefixes.push(imagePrefix);
	}
	
	if (documentPrefix) {
		prefixes.push(documentPrefix);
	}
	
	if (documentFolder) {
		//prefixes.push(documentFolder);
	}
	
	if (exportFolder) {
		prefixes.push(exportFolder);
	}
	
	if (prefixes.length) {
		prefix = prefixes.join("/");
		prefix += "/";
	}
	
	return prefix;
}

/**
 * Set the source of the image tag
 * @param {SceneNode} item 
 * @param {Model} model 
 * @param {ArtboardModel} artboardModel 
 */
function setImageSourceAttribute(item, model, artboardModel) {
	var properties = model.attributes;
	var renditions = model.renditions;
	var numberOfRenditions = renditions.length;
	var sourceSet = "";
	var sourceSetArray = [];
	var source = "";
	var prefix = "";

	prefix = getImagePrefix(artboardModel);
	
	for (let index = 0; index < numberOfRenditions; index++) {
		const rendition = renditions[index];
		const scale = rendition.scale;
		const scaleValue = "@" + scale + "x";
		const period = XDConstants.PERIOD;

		if (scale==1) {
			source = rendition.id + period + rendition.extension;
		}
		else {
			source = rendition.id + scaleValue + period + rendition.extension;
		}

		source = prefix + rendition.id + period + rendition.extension;
		
		source += " " + scale + "x";
		sourceSet += source; 
		
		if (index>0) {
			sourceSet += ","; 
		}
		
		sourceSetArray.push(source);
	}

	// loop through renditions
	if (model.imageDefinition) {
		properties[HTMLAttributes.SRC] = prefix + model.imageDefinition.id + "." + model.imageDefinition.extension;
		properties[HTMLAttributes.SRCSET] = sourceSetArray.join(XDConstants.COMMA+" ");
	}
}

/**
 * Get and set the source of the image tag using base 64 encoded value
 * @param {SceneNode} item 
 * @param {Model} model 
 * @param {ArtboardModel} artboardModel 
 **/
async function setEmbeddedImageSourceAttribute(item, model, artboardModel) {
	var properties = model.attributes;
	var embedImage = determineEmbedImage(model, artboardModel);
	var definition = new Definition();
	var numberOfColors = getEmbeddedColorLimit(model, artboardModel);
	var base64 = "";

	if (embedImage) {
		var quantizeFilter = new QuantizeFilterOptions(numberOfColors);
		var invertFilter = new InvertFilterOptions();
		var filters = [];

		if (numberOfColors!=null && numberOfColors>0) {
			filters.push(quantizeFilter);
		}

		base64 = await getBase64FromSceneNode(item, filters);
		properties[HTMLAttributes.SRC] = base64;
		delete properties[HTMLAttributes.SRCSET];
		definition = model.imageDefinition; // note there may be more defintions in model.renditions for diff scales
		
		if (definition) {
			definition.embedded = true;
			definition.base64 = base64;
			definition.numberOfColors = numberOfColors;
			definition.exclude = true;
			definition.excludeReason = MessageConstants.IMAGE_EMBEDDED;
		}
	}

	return true;
}

/**
 * Determine if image should be embedded. Element will inherit embedding option from artboard 
 * @param {Model} model 
 * @param {ArtboardModel} artboardModel 
 * @returns {Boolean}
 */
function determineEmbedImage(model, artboardModel) {
	var embedImages = artboardModel.embedImages==true;
	var embedImage = model.embedImage==true;

	// if artboard has embed images and element does not disable embeded image
	// todo: add support for later
	//if (embedImages && (embedImage===null || embedImages===true)) 
	
	// if artboard has embed images
	if (embedImages) {
		return true;
	}
	// if element has embed images checked
	else if (embedImage===true) {
		return true;
	}

	return false;
}

/**
 * Get number of colors for embedded images
 * @param {Model} model 
 * @param {ArtboardModel} artboardModel 
 * @returns {Number}
 */
function getEmbeddedColorLimit(model, artboardModel) {
	var numberOfColors = artboardModel.embedColorLimit;

	if (globalModel.exportToSinglePage) {
		numberOfColors = globalModel.embedImageColorLimit;
	}

	return numberOfColors;
}

/**
 *  set the box sizing, margin and padding to 0
 * */
function setElementStyles(item, model) {
  var styles = model.cssStyles;
  styles[Styles.BOX_SIZING] = Styles.BORDER_BOX;
  styles.margin = "0";
  styles.padding = "0";
}

function setBoxSizingBorderBox(model, styles) {
  styles[Styles.BOX_SIZING] = Styles.BORDER_BOX;
}

function setGroupProperties(item, model) {
  var properties = model.attributes;
}

/**
 * Get the bounds in direct parent. 
 * @param {SceneNode} item 
 * @param {Boolean} fromRoot 
 */
function getBoundsInParentLocal(item, fromRoot = false) {
  var b = debugModel.getBounds && log("Get bounds in parent()");
  var bounds = {};
  var x = 0;
  var y = 0;
  var drawX = 0;
  var drawY = 0;
  var parentX = 0;
  var parentY = 0;
  var parent;
  var hasRotation = item.rotation!=0;
  var unrotatedTransform = hasRotation ? item.transform.rotate(-item.rotation, item.localCenterPoint.x, item.localCenterPoint.y) : null;
  var unrotatedBounds = hasRotation ? unrotatedTransform.transformRect(item.localBounds) : null;

  // draw values are not tested yet

  if (item.parent) {
	 x = item.globalBounds.x;
	 y = item.globalBounds.y;
	 drawX = item.globalDrawBounds.x;
	 drawY = item.globalDrawBounds.y;
	 parent = item.parent;

	 b && log("item x:" + x);
	 b && log("item y:" + y);
	 b && log("item draw x:" + drawX);
	 b && log("item draw y:" + drawY);
	 
	 while(parent) {
		parentX = parent.globalBounds.x;
		parentY = parent.globalBounds.y;
		x = x - parentX;
		y = y - parentY;
		drawX = drawX - parent.globalBounds.x;
		drawY = drawY - parent.globalBounds.y;
		
		b && log("parent x:" + parentX);
		b && log("parent y:" + parentY);

		if (fromRoot) {
		  parent = parent.parent;
		}
		else {
		  parent = null;
		}
	 }

	 b && log("final x:" + x);
	 b && log("final y:" + y);
	 b && log("final draw x:" + drawX);
	 b && log("final draw y:" + drawY);
	 bounds.x = x;
	 bounds.y = y;
	 bounds.drawX = drawX;
	 bounds.drawY = drawY;
	 bounds.width = item.globalBounds.width;
	 bounds.height = item.globalBounds.height;
	 bounds.drawWidth = item.globalDrawBounds.width;
	 bounds.drawHeight = item.globalDrawBounds.height;
	 bounds.boundsInParent = item.boundsInParent;
	 bounds.hasRotation = hasRotation;
	 bounds.unrotatedTransform = unrotatedTransform;
	 bounds.unrotatedBounds = unrotatedBounds;
	 
	 // attempt to get untransformed line dimensions
	 if (item instanceof Line) {
		/** @type {Line} */
		var line = item;
		var isArtboard = item.parent instanceof Artboard;
		var centerPoint = getCenterPoint(line);
		var lineBounds = {};
		var halfSize;
		
		halfSize = Math.max(Math.abs(line.end.x-line.start.x)/2, Math.abs(line.end.y-line.start.y)/2);
		lineBounds.x = centerPoint.x-halfSize;
		lineBounds.y = centerPoint.y;
		lineBounds.width = line.end.x;
		lineBounds.height = line.end.y;
		
		if (isArtboard==false) {
			var offsetX = item.parent.topLeftInParent.x;
			var offsetY = item.parent.topLeftInParent.y;
			lineBounds.x = 0;
			lineBounds.y = halfSize;
		}

		bounds.lineBounds = lineBounds;
	}
	else {
		halfSize = Math.max(item.globalBounds.width/2, item.globalBounds.height/2)
	}

  }

  return bounds;
}

function setGroupBounds(item, model, fromRoot = false) {
  var bounds = getBoundsInParentLocal(item, fromRoot);
  model.groupBounds = bounds;
}

/**
 * 
 * @param {String} name 
 * @param {Object} attributes 
 * @param {Boolean} close 
 * @param {String} innerContent 
 * @param {String} additionalAttributes 
 * @param {Boolean} isSingletonTag
 */
function getTag(name, attributes, close = false, innerContent = null, additionalAttributes = null, isSingletonTag = true) {
	var b = debugModel.getTag;
	var noTag = name==Styles.NONE;
	var source = noTag ? "" : "<" + name;
	var value = null;
	var sourceLength = source.length;
	var removeAll = false;
	var removeAttributes = false;
	var startIndex = 0;
	var attributesRemoved = false;

	// special value to remove all attributes
	if (additionalAttributes && noTag==false) {
		removeAll = additionalAttributes.indexOf("-all")==0;
		removeAttributes = additionalAttributes.indexOf("-attributes")==0;
		
		if (removeAll || removeAttributes) {
			deleteProperties(attributes, ["class"]);
			attributesRemoved = true;
		}

		if (removeAll) {
			startIndex = "-all".length;
		}
		else if (removeAttributes) {
			startIndex = "-attributes".length;
		}
	}

	if (attributes && noTag==false) {
		for (let attribute in attributes) {
			value = attributes[attribute];
			source += " " + attribute;
			source += '="' + encodeAttribute(value) + '"';
		}
	}
	
	// todo: if there are duplicate tags and the second duplicate is ignored by the browser then 
	// custom attributes should be placed before default 
	// and if possible the duplicate removed
	if (additionalAttributes && noTag==false) {
		if (attributesRemoved) {
			additionalAttributes = additionalAttributes.substr(startIndex);
		}

		if (trim(additionalAttributes).length>0) {
			source = addString(source, additionalAttributes)
		}
	}
	
	if (close && isSingletonTag) {
		if (noTag==false) {
			source += "/>";
		}
	}
	else {
		if (noTag==false) {
			source += ">";
		}

		if (innerContent!=null && innerContent!="") {
			source += innerContent;
		}

		if (close && isSingletonTag==false) {
			if (noTag==false) {
				source += "</" + name + ">";
			}
		}
	}


	return source;
}

function getInnerContent(model) {
  var output = "";
  var value = null;

  if (model.innerContent!=null && model.innerContent!="") {
	 output += model.innerContent;
  }

  return output;
}

/**
 * Get selector for the current element
 * @param {SceneNode} item 
 * @param {Model} model 
 * @param {Boolean} subElement 
 * @param {Boolean} useClassesToStyleElements 
 */
function getSelector(item, model, subElement = false, useClassesToStyleElements = false) {
	var className = model.elementId + globalArtboardModel.classNamePost;
	var selector = "";

	if (subElement) {
		if (model.svgUseClasses) {
			selector = getCSSClass(model.elementId);
		}
		else {
			selector = getCSSID(model.elementId);
		}
	}
	else if (useClassesToStyleElements) {
		selector = getCSSClass(className);
	}
	else {
		selector = getCSSID(model.elementId);
	}

	return selector;
}

/**
 * Get selector for the current element without the period or hash tag in front
 * @param {SceneNode} item 
 * @param {Model} model 
 * @param {Boolean} subElement 
 * @param {Boolean} useClassesToStyleElements 
 */
function getSelectorName(item, model, subElement = false, useClassesToStyleElements = false) {
	var className = model.elementId + globalArtboardModel.classNamePost;
	var selector = "";

	if (subElement) {
		if (model.svgUseClasses) {
			selector = model.elementId;
		}
		else {
			selector = model.elementId;
		}
	}
	else if (useClassesToStyleElements) {
		selector = className;
	}
	else {
		selector = model.elementId;
	}

	return selector;
}

function getCSSID(id) {
  return  "#" + id;
}

function getCSSClass(name) {
  return XDConstants.PERIOD + name;
}

function getCSSValueWithID(id, properties, lineBreak, space, additionalStyles = null) {
  var css = getCSSValue(properties, space, lineBreak, additionalStyles);

  return "#" + id + "{" + css + "}";
}

function getCSSValueWithClass(name, properties, lineBreak, space, additionalStyles = null) {
  var css = getCSSValue(properties, space, lineBreak, additionalStyles);

  return "." + name + "{" + css + "}";
}

function getCSSValueWithSelector(selector, properties, lineBreak, space = null, additionalStyles = null, indent = 0) {
  var css = getCSSValue(properties, space, lineBreak, additionalStyles, indent);

  return selector + XDConstants.SPACE + "{" + XDConstants.LINE_BREAK + css + XDConstants.LINE_BREAK + "}";
}

/**
 * Get CSS style declaration string
 * @param {Object} properties 
 * @param {String} space 
 * @param {Boolean} lineBreak 
 * @param {String} additionalStyles 
 */
function getCSSValue(properties, space = null, lineBreak = false, additionalStyles = null, indent = 0) {
	var output = "";
	var value;
	var arrayValue;

	value = "";

	// should call getCSSValueArray and then call join
	if (space==null || space=="false") {
	 	space = "";
  	}
  	else {  
		space = XDConstants.SPACE;
  	}

	if (properties) {
		for (var property in properties) {
			value = properties[property];

			if (lineBreak && output!="") {
				output += XDConstants.LINE_BREAK;
			}
			
			output += indent > 0 ? getIndent(indent, XDConstants.TAB) : "";
			output += property;
			output += ":" + space;
			
			if (property==Styles.TRANSFORM) {
				if (value instanceof Array) {
					arrayValue = value;
					output += encodeStyle(arrayValue.join(" "));
				}
				else if (typeof value=="object") {
					//value.e = 0;
					//value.f = 0;
					output += encodeStyle(value);
				}
			}
			else {
				output += encodeStyle(value);
			}

			output += ";";
		}
	}

	if (additionalStyles) {
		if (lineBreak) {
			output += getIndent(indent) + additionalStyles.split(";").join(XDConstants.LINE_BREAK + getIndent(indent));
		}
		else {
			output += getIndent(indent) + additionalStyles;
		}
	}

	return output;
}

/**
 * 
 * @param {Object} properties 
 * @param {String} space 
 * @param {String} additionalStyles 
 */
function getCSSValueArray(properties, space = null, additionalStyles = null) {
  var output = "";
  var outputArray = [];
  var value;

  value = "";

  if (space==null) {
	 space = "";
  }
  else {  
	 space = " ";
  }

  if (properties) {
	 for (var property in properties) {
		value = properties[property];
		output = "";
		output += property;
		output += ":" + space;

		if (property==Styles.TRANSFORM) {
		  if (value instanceof Array) {
			 output += encodeStyle(value.join(" "));
		  }
		  else if (typeof value=="object") {
			 //value.e = 0;
			 //value.f = 0;
			 output += encodeStyle(value);
		  }
		  else {
			 output += encodeStyle(value);
		  }
		}
		else {
		  output += encodeStyle(value);
		}

		output += ";";

		outputArray.push(output);
	 }
  }

  if (additionalStyles) {
	 var styles = additionalStyles.split(";");

	 if (styles.length) {
		for(var i=0;i<styles.length;i++) {
		  value = styles[i];
		  if (value!="") {
			 outputArray.push(value+";");
		  }
		}
	 }
	 else{
		outputArray.push(additionalStyles);
	 }
  }

  return outputArray;
}

/**
 * Get object from string of attributes. Not implemented. 
 * @param {String} additionalAttributes 
 * @param {String} space 
 */
function getAttributeValueArray(additionalAttributes, space = null) {
	var output = "";
	var outputArray = [];
	var value;
 
	value = "";
 
	if (space==null) {
	  space = "";
	}
	else {  
	  space = " ";
	}

 
	if (additionalAttributes) {
		// how to determine how to split attributes?
		var attributes = additionalAttributes.split(" ");

		// not finished
		if (attributes.length) {
			for(var i=0;i<attributes.length;i++) {
				value = attributes[i];
			}
		}
		else{

		}
	}
 
	return outputArray;
 }

/**
 * Get object from string of styles. 
 * Use name:value and separate by semicolon name:value;name:value;
 * @param {String} values 
 * @returns {Object}
 **/
function getStylesObject(values, checkForColons = false) {
	var value;
	var pair;
	var object = {};
	var style;
	var nameValue;
	var name;

	if (values) {
		var styles = values.split(";");
  
		if (styles.length) {
		  	for(var i=0;i<styles.length;i++) {
				pair = styles[i];// name:value

				if (pair && pair.indexOf(":")!=-1) {
					nameValue = pair.split(":");
					
					// if token and or value both have colons check for double colon
					if (checkForColons && nameValue.length>2 && pair.indexOf("::")!=-1) {
						name = pair.split('::')[0];
						value = pair.split('::').slice(1).join("::");
					}
					else if (nameValue.length>2) {
						// if token is something like "First name:" we want to skip the colon
						name = pair.split(':').slice(0, -1).join(":");
						value = nameValue[nameValue.length-1];
					}
					else {
						name = nameValue[0];
						value = nameValue[nameValue.length-1];
					}

					var hasIndeterminateColons = nameValue.length>2 && pair.indexOf("::")==-1;

					if (checkForColons && hasIndeterminateColons) {
						var messageValue = "Cannot determine name and value, \"" + styles[i] + "\". Separate with double colons, \"::\"";
					
						//if (debugModel.ignoreDuplicateIDs==false) {
							addWarning(MessageConstants.INDETERMINATE_COLONS, messageValue);
						//}
					}

					// get value
					//log("name:"+name)
					//log("value:"+value)

					// prevent splitting on colon in name
					object[name] = trim(value);
				}
		  	}
		}
	}

	return object;
}

/**
 * Get an object with both styles and additional styles string using name value pairs, name:value;name:value
 * @param {Object} properties 
 * @param {String} values
 */
function getCSSValueObject(properties, values = "") {
	var additionalStyles = null;
	var styles = {};

	if (properties) {
		styles = Object.assign(styles, properties);
	}

	if (values!="") {
		values = getStylesObject(values, false);
		styles = Object.assign(styles, values);
	}

	return styles;
}

function getEndTag(name) {
	var noTag = name==Styles.NONE;
  var output = noTag ? "" : "</" + name + ">";
  return output;
}

function encodeAttribute(value) {
	// TODO: encode / escape double quotes
  return value;
}

function encodeStyle(value) {
  return value;
}

function replaceNonWordCharacters(value) {
  value = value.replace(/\s/gs, "_"); // replace all white space characters
  //value = value.replace(/\W/gs, "_"); // replace everything but letters and numbers and dash
  value = value.replace(/[^\w\-]/gs, ""); // replace everything but letters and numbers and dash
  return value;
}

/**
 * Create a file name
 * @param {ArtboardModel} model 
 * @returns {String}
 **/
function generateFileName(model) {
	return replaceNonWordCharacters(model.name) + XDConstants.PERIOD + HTMLConstants.HTML;
}

function getSanitizedIDName(value, maxLength = -1) {
  maxLength = maxLength==-1 ? GlobalModel.maxIDLength : maxLength;
  value = value.replace(/\n|\r/gs, " ");
  value = replaceNonWordCharacters(value);

  // replace any ids starting with a number with "ID" and then the number
  value = value.replace(/(^\d)/, "ID$1");

  // names have no length limit and sometimes are 256 characters or more
  // limit length for readability
  if (maxLength!=0 && value.length>maxLength) {
	 value = value.substr(0, maxLength);
	 addWarning(MessageConstants.ID_TRUNCATED, "The auto generated ID starting with '" + getShortString(value) + "' was truncated");
  }

  return value;
}

/**
 * Get a string without spaces or non word characters
 * @param {String} value 
 */
function getSanitizedName(value = "") {
	value = value.replace(/\s/gs, "_");
	value = value.replace(/\W/gs, "_");
	return value;
}

function createUniqueName(object) {
  var name = object.constructor.name;
  globalArtboardModel.nameCounter++;
  name = name + globalArtboardModel.nameCounter;
  name = name.replace(/\s/gs, "_");
  //log("Unique names:" + name)
  return name;
}

function getObjectType(object) {
	var name = object && object.constructor && object.constructor.name;
	if (name==null && object!=null) {
		name = typeof object;
	}
	return name;
}

function getTypeCount(type) {
	var index = 0;
	if (type!=null && type!="" && type!=undefined) {
		index = globalModel.typesDictionary[type]==null ? 0 : globalModel.typesDictionary[type];
	}
	return index;
}

function addTypeCount(object, isPattern) {
	var type = isPattern ? HTMLConstants.PATTERN : getObjectType(object);
	var count = getTypeCount(type);
	count++;
	globalModel.typesDictionary[type] = count;
	globalModel.itemCount++;
	return count;
}

/**
 * Get the artboard name or null if no artboard
 * @param {SceneNode} sceneNode 
 * @returns {String} 
 **/
function getSceneNodeName(sceneNode) {
	return sceneNode ? sceneNode.name : null;
}

/**
 * Creates a unique ID. Needs refactoring. 
 * @param {SceneNode} sceneNode 
 * @param {Model|Object} model 
 **/
function createUniqueItemName(sceneNode, model, isPattern = false) {
	var b = debugModel.createUniqueName;
	var id = model.id;
	var hasId = id!=null && id!="";
	var elementId = hasId ? id : sceneNode.name;
	var unsanitizedElementId = elementId;
	var sanitizedElementId = null;
	var guid = sceneNode.guid;
	var globalIds = globalModel.ids;
	var artboardGUIDs = globalModel.artboardGUIDs;
	var artboardIdsObject = globalModel.artboardIdsObject;
	var currentArtboardModel = globalModel.currentArtboardModel;
	var ids = currentArtboardModel.ids;
	var idExists = false;
	var newName = null;
	var maxLength = GlobalModel.maxIDLength;
	var shortName = elementId.substr(0, maxLength);
	var exportList = globalModel.exportList;
	var exportMultipleArtboards = globalModel.exportMultipleArtboards;
	var exportAllArtboards = globalModel.exportAllArtboards;
	var exportToSinglePage = globalModel.exportToSinglePage;
	var currentTypeCount = addTypeCount(sceneNode, isPattern);
	var type = getObjectType(sceneNode);
	var typeName = type;
	var artboardIndex = currentArtboardModel.index;
	var nestLevel = model.nestLevel || 0;
	var index = model.index || 0;
	var isArtboard = sceneNode instanceof Artboard;
	var hasGlobalIds = (exportMultipleArtboards && exportToSinglePage) || exportMultipleArtboards; // should prob enable this by default but need testing
	var parent = sceneNode && sceneNode.parent;
	var isRepeatGridParent = parent && parent instanceof RepeatGrid;
	var isRepeatGridItem = false;
	var parentModel = null;
	var originalNaming = false;

	if (type==XDConstants.SYMBOL_INSTANCE) {
		typeName = XDConstants.COMPONENT;
	}

	b && log("Artboard:" + artboardIndex + " NestLevel:" + nestLevel + " Index:" + index + " Type:" + type + " Count:" + currentTypeCount);

	
	if (isArtboard) {
		elementId = getSanitizedIDName(elementId, 0);
		
		// we already set the artboard id but now we are going through the loop again
		if (artboardGUIDs[guid]!=null) {
			model.elementId = elementId;
			return elementId;
		}
		// we already set the artboard id but now we are going through the loop again
		//else if (artboardIdsObject[elementId]!=null && artboardIdsObject[elementId]==guid && exportToSinglePage) {
		//	addError(MessageConstants.DUPLICATE_ID, "An artboard is already named, \"" + sceneNode.name + "\"");
		//}
		else {

			if (artboardIdsObject[elementId]!=null) {
				
			}

			artboardGUIDs[guid] = elementId;
			artboardIdsObject[elementId] = guid;
		}
	}
	else {
		sanitizedElementId = getSanitizedIDName(elementId);

		// allow user to set unsanitized id but warn
		if (hasId && sanitizedElementId!=elementId) {
			addWarning(MessageConstants.ID_INVALID, "The id of the element may not be valid, \"" + elementId + "\"");
		}
		else {
			elementId = sanitizedElementId;
		}

	}

	if (elementId=="") {
		b && log("Element id is empty string");

		// todo change to class and support removing id
		if (isRepeatGridParent) {
			parentModel = getModel(sceneNode.parent);
			isRepeatGridItem = isRepeatGridParent;

			if (parentModel && parentModel.id=="none") {
				// add support to remove ids from repeat grid items
			}
			
			elementId = parentModel.elementId + "_" + index;
		}
	}

	idExists = ids[elementId]!=null || ids[elementId.toLowerCase()]!=null;
	//idExists = ids[elementId]!=null;

	if (idExists==false && hasGlobalIds) {
		idExists = globalIds[elementId]!=null;
	}

	//idExists = true;
	
	b && log("Name(id):" + elementId);
	b && log("Already Exists:" + idExists);
  
	if (idExists) {
		currentArtboardModel.hasDuplicateIds = true;

		if (originalNaming) {

			newName = elementId + "_A" + artboardIndex;
	
			if (!isArtboard) {
				if (nestLevel!=null) {
					//newName += "_N" + nestLevel;
				}
				if (index!=null) {
					//newName += "_I" + index;
				}
				
				//newName += "_T" + currentTypeCount;
				newName += "_" + typeName + "_" + currentTypeCount;
				//newName = "I_" + getPositionInHierarchy(sceneNode, model);
			}
		}
		else {
			var idIndex = 1;
			var searchForUniqueID = true;
			//newName = elementId + "_" + toHex(currentTypeCount);
			newName = elementId + "_" + idIndex;

			while (searchForUniqueID) {
				idIndex++;
				newName = elementId + "_" + toHex(globalModel.itemCount+idIndex);
				//newName = elementId + "_" + toHex(idIndex);
				//newName = elementId + "_" + toHex(currentTypeCount);

				//log("new name:" + newName)
				//log("ids[newName]:" + ids[newName])
				//log("searchForUniqueID:" + searchForUniqueID)

				if (ids[newName]===undefined) {
					if (hasGlobalIds) {
						if (globalIds[newName]===undefined) {
							searchForUniqueID = false;
						}
					}
					else {
						searchForUniqueID = false;
						//log("id is unique:" + newName)
					}
				}
				else {
					//log("id found:" + newName)
				}
				if (idIndex>100) {
					//break;
				}
			}
		}
		
		elementId = newName;

		ids[elementId] = newName;

		if (hasGlobalIds) {
			globalIds[elementId] = newName;
		}

		currentArtboardModel.duplicateIds[newName] = new Duplicates(sceneNode.name, type, newName);

		b && log("New id:" + newName);
	}
	else {
		ids[elementId] = elementId;

		if (hasGlobalIds) {
			globalIds[elementId] = elementId;
		}
	}

	b && log("Model id:" + elementId);
	model.elementId = elementId;
	//model.shortName = shortName;

	return elementId;
}

function toHex(d, base = 36) {
	var r = d % base;
	if (d - r == 0) {
	  return toChar(r);
	}
	return toHex( (d - r)/base ) + toChar(r);
 }
 
 function toChar(n) {
	//const alpha = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const alpha = "abcdefghijklmnopqrstuvwxyz";
	return alpha.charAt(n);
 }

/**
 * Returns true if id is unique. Set the global parameter to true to check all ids globally
 * @param {ArtboardModel} artboardModel 
 * @param {String} id 
 * @param {Boolean} global 
 * @returns {Boolean}
 */
function isIDUnique(artboardModel, id, global = false) {
	var artboardIds = artboardModel.ids;
	var globalIds = globalModel.ids;
	var idExists = false;
	var elementId = id;

	idExists = artboardIds[elementId]!=null;

	if (idExists==false && global) {
		idExists = globalIds[elementId]!=null;
	}

	return idExists==false;
}

/**
 * Returns true if id is unique. Set the global parameter to true to check all ids globally
 * @param {ArtboardModel} artboardModel 
 * @param {String} id 
 * @param {Boolean} global 
 * @returns {Boolean}
 */
function addID(artboardModel, id, sanitize = true, global = false) {
	var artboardIds = artboardModel.ids;
	var globalIds = globalModel.ids;
	var idExists = false;
	var elementId = null;
	var artboardIdsObject = globalModel.artboardIdsObject;


	if (sanitize) {
		elementId = getSanitizedIDName(id);
	}
	else {
		elementId = id;
	}

	idExists = artboardIds[elementId]!=null;

	if (idExists==false && global) {
		idExists = globalIds[elementId]!=null;
	}

	artboardIds[elementId] = elementId;

	if (global) {
		globalIds[elementId] = elementId;
	}

	return idExists;
}

/**
 * 
 * @param {SceneNode} sceneNode 
 */
function getPositionInHierarchy(sceneNode, model) {
	var treePosition = "";
	var parentSceneNode = sceneNode;
	var index = 0;
	var indexes = [];
	
	while (parentSceneNode!=null && model!=null) {
		index = model.index;
		indexes.push(index);
		parentSceneNode = parentSceneNode.parent;
		//log("node: "+ parentSceneNode)
		model = getModel(parentSceneNode);
	}
	indexes.reverse();
	return indexes.join("_");
}

function getColorInHexWithHash(color) {
  return getColorInHex(color, true);
}

function getColorInHex(color, addHash, addPrefix) {
  var red = extractRed(color).toString(16).toUpperCase();
  var green = extractGreen(color).toString(16).toUpperCase();
  var blue = extractBlue(color).toString(16).toUpperCase();
  var value = "";
  var zero = "0";
  
  if (red.length==1) {
	 red = zero.concat(red);
  }
  
  if (green.length==1) {
	 green = zero.concat(green);
  }
  
  if (blue.length==1) {
	 blue = zero.concat(blue);
  }
  
  if (addHash) {
	 value = "#" + red + green + blue;
  }
  else if (addPrefix) {
	 value = "0x" + red + green + blue;
  }
  else {
	 value = red + green + blue;
  }
  
  return value;
}

/**
 * Pass in the color or fill
 * @param {Color} fill 
 **/
function getRGBAFromFill(fill) {
  var rgba = null;
  
  if ("toRgba" in fill && typeof fill.toRgba=="function") {
		rgba = fill.toRgba();
		return "rgba(" + rgba.r + "," + rgba.g + "," + rgba.b + "," + getShortNumber(rgba.a/255) + ")"; 
	}
	else if ("r" in fill && fill.r!=undefined) {
		rgba = fill.r ;
		return "rgba(" + fill.r + "," + fill.g + "," + fill.b + "," + getShortNumber(fill.a/255) + ")"; 
  }
  else {
		return fill.toHex(true); 
  }
}

function getColorInRGBA(color, alpha) {
	var rgba = color.toRgba();
	var value = getColorInRGB(color);

	return "rgba("+rgba.r+", "+rgba.g+", "+rgba.b+", "+getShortNumber(rgba.a/255)+")";
}

function getColorInRGB(color, alpha) {
	var red = extractRed(color);
	var green = extractGreen(color);
	var blue = extractBlue(color);
	var value = "";
	
	if (isNaN(alpha) || alpha==null) {
		value = "rgb("+red+","+green+","+blue+")";
	}
	else {
		value = "rgba("+red+","+green+","+blue+","+alpha+")";
	}
	
	return value;
}

/**
 * Repeats a character as many times as you request
 * @param {String} character 
 * @param {Number} count 
 * @returns {String}
 **/
function repeatCharacter(character, count) {
	var value = "";
	
	for (var i=0;i<count;i++) {
		value += character;
	}
	
	return value;
}

function extractRed(color) {
  return (( color >> 16 ) & 0xFF);
}

function extractGreen(color) {
  return ((color >> 8) & 0xFF);
}

function extractBlue(color) {
  return (color & 0xFF);
}

/**
 * Writes a tag with the given name
 * @param {String} name 
 * @param {String} value 
 * @param {String} styles 
 * @param {Boolean} addEndTag 
 * @returns {String}
 **/
function wrapInTag(name, value, styles=null, addEndTag = true) {
  if (value==null || value=="") return "";
  var out = "<" + name;
  if (styles!=null) out += " style=\"" + styles + "\"";
  out += ">\n" + value;
  if (addEndTag) {
	  out += "\n</" + name + ">";
  }
  return out;
}

/**
 * Writes a tag with the given name with id
 * @param {String} name 
 * @param {String} value 
 * @param {String} id 
 * @param {Boolean} addEndTag 
 * @returns {String}
 **/
function wrapInIdTag(name, value, id=null, addEndTag = true) {
  if (value==null || value=="") return "";
  var out = "<" + name;
  if (id!=null) out += " id=\"" + id + "\"";
  out += ">\n" + value;
  if (addEndTag) {
	  out += "\n</" + name + ">";
  }
  return out;
}

/**
 * Adds a less than character before the value and a greater than character after the value
 * Before div, after <div>
 * @param {String} value 
 * @returns {String}
 **/
function addTagCharacters(value, isEndTag = false) {
	var out = "";
	if (value==null || value=="") return "";

	if (isEndTag==false) {
		out = "<" + value + ">";
	}
	else {
		out = "</" + value + ">";
	}

	return out;
}

/**
 * Returns a style tag with id and styles value
 * @param {String} value 
 * @param {String} id 
 **/
function wrapInStyleTags(value, id = "") {
  if (value==null || value=="") return "";
  if (id!="") id = "id=\"" + id + "\" ";
  var out = "<style "+ id + "type=\"text/css\">\n" + value + "\n</style>";
  return out;
}

/**
 * Create a style tag
 * @param {String} filePath path to file
 * @param {String} id id of the tag (optional)
 * @param {String} relation 
 * @param {String} title 
 * @param {String} type 
 * @param {String} media 
 **/
function getExternalStylesheetLink(filePath, id = null, relation = null, title = null, type = null, media = null) {
  var object = {};
  var output = "";

  if (relation==null) relation = "stylesheet";
  if (type==null) type = "text/css";

  if (media) object.media = media;
  if (relation) object.rel = relation;
  if (title) object.rel = title;
  if (type) object.type = type;
  if (id) object.id = id;

  object.href = filePath;

  output = getTag("link", object, true);
  
  return output;
}

/**
 * Get a external script tag
 * @param {String} filePath 
 * @param {Boolean} defer 
 * @param {String} type 
 **/
function getExternalScriptLink(filePath, id = null, defer = false, type = null) {
	var object = {};
	var output = "";
 
	if (type==null) type = "text/javascript";
 
	if (id) object.id = id;
	if (defer) object.defer = "defer";
	if (type) object.type = type;
 
	object.src = filePath;
 
	output = getTag("script", object, true, null, null, false);
	
	return output;
}

/**
 * Replace generator token
 * @param {String} value 
 * @param {String} name 
 **/
function replaceGeneratorToken(value, name) {
	var pageOutput = value!=null ? value.replace(pageToken.generatorToken, name) : "";
	return pageOutput;
}

/**
 * Replace generator version token
 * @param {String} value 
 * @param {String} name 
 **/
function replaceGeneratorVersionsToken(value, name) {
	var pageOutput = value!=null ? value.replace(pageToken.generatorVersionToken, name) : "";
	return pageOutput;
}

/**
 * Replaces any tokens in the template with date values
 * @param {String} value 
 **/
function replaceDatesToken(value) {
	var pageOutput = value;
	var date = new Date();
	var day = date.getDay() + "";
	var month = date.getMonth()+1 + "";
	var year = date.getFullYear() + "";
	var time = date.toTimeString();

	if (pageOutput!=null) {
		pageOutput = pageOutput.replace(pageToken.dateToken, date.toString());
		pageOutput = pageOutput.replace(pageToken.dateYearToken, year);
		pageOutput = pageOutput.replace(pageToken.dateMonthToken, month);
		pageOutput = pageOutput.replace(pageToken.dateDayToken, day);
		pageOutput = pageOutput.replace(pageToken.timeToken, time);
	}

	return pageOutput;
}

/**
 * Replace script token
 * @param {String} value 
 * @param {String} replacement 
 **/
function replaceScriptsToken(value, replacement = null) {
	var pageOutput = "";

	if (value!=null) {
		if (replacement==null) {
			pageOutput = value.replace(pageToken.scriptsToken, "");
		}
		else {
			pageOutput = value.replace(pageToken.scriptsToken, "$1" + replacement);
		}
	}

	return pageOutput;
}

/**
 * Replace page title token
 * @param {String} value 
 * @param {String} name 
 **/
function replacePageTitleToken(value, name) {
  var pageOutput = value!=null ? value.replace(pageToken.pageTitleToken, name) : "";
  return pageOutput;
}

/**
 * Replace selector token
 * @param {String} value string that may contain selector
 * @param {String} name selector
 * @param {Boolean} name subSelector
 **/
function replaceSelectorToken(value, name, subSelector = false) {
	var output = "";

	if (subSelector) {
		output = value!=null ? value.replace(pageToken.subSelectorToken, name) : "";
	}
	else {
		output = value!=null ? value.replace(pageToken.selectorToken, name) : "";
	}

	return output;
}

/**
 * Replace element properties in custom code
 * @param {SceneNode} item 
 * @param {Model} model 
 * @param {String} value string possibly containing template tokens
 * @param {Boolean} isCSS selector has CSS selector
 **/
function replaceTemplateTokens(item, model, value, isCSS = false) {
	var output = value;
	var selector = null;
	var subSelector = null;

	if (isCSS) {
		selector = getSelector(item, model, false, globalArtboardModel.useClassesToStyleElements);
		subSelector = getSelector(item, model, true, globalArtboardModel.useClassesToStyleElements);
	}
	else {
		selector = getSelectorName(item, model, false, globalArtboardModel.useClassesToStyleElements);
		subSelector = getSelectorName(item, model, true, globalArtboardModel.useClassesToStyleElements);
	}

	// replace subselector string first so it doesn't replace regular selector string
	output = replaceSelectorToken(output, subSelector, true);
	output = replaceSelectorToken(output, selector);
	output = output.replace(pageToken.noStylesToken, ""); // todo: replace whole line
	output = replaceBoundaryTokens(item, model, output);

	return output;
}

/**
 * Replace boundary tokens
 * @param {SceneNode} item 
 * @param {Model} model 
 * @param {String} value string possibly containing template tokens
 **/
function replaceBoundaryTokens(item, model, value) {
	var output = value!=null ? value : "";
	var places = 1;
	var width = getShortNumber(model.groupBounds.width, places);
	var height = getShortNumber(model.groupBounds.height, places);
	var pixelWidth = getPx(width);
	var pixelHeight = getPx(height);
	var percentWidth = getShortNumber(getPercentWidth(item, model), places)+"%";
	var percentHeight = getShortNumber(getPercentHeight(item, model), places)+"%";
	var top = getShortNumber(model.groupBounds.y, places);
	var left = getShortNumber(model.groupBounds.x, places);
	var bottom = getShortNumber(getBottomPosition(item, model), places);
	var right = getShortNumber(getRightPosition(item, model), places);
	var strokeWidth = item.strokeWidth;
	var transform = "none";
	var imageSource = model.attributes[HTMLAttributes.SRC];
	var imageSourceSet = model.attributes[HTMLAttributes.SRCSET];
	var rotation = getShortNumber(item.rotation, places);

	if (model.alternateWidth) {
		width = model.alternateWidth;
	}

	if (model.alternateHeight) {
		height = model.alternateWidth;
	}
	
	if (model.cssStyles.transform) {
		transform = model.cssStyles.transform;
	}
	else if (model.svgStyles.transform) {
		transform = model.svgStyles.transform;
	}

	// if you have a group selected you may need to dive into the group to get the elements with fill or stroke

	// should create a token object on the model with all the token values
	if (item.fill && item.fillEnabled && pageToken.fillColorToken.test(output) && model.exportAsImage==false) {
		var fillValue = setBackgroundFillStyles(item, model, null, false);
		output = output.replace(pageToken.fillColorToken, fillValue);
	}

	if (item instanceof GraphicNode && item.strokeEnabled) {
		var borderValue = setBorderStyles(item, model);
		var strokeColor = item.stroke && getRGBAFromFill(item.stroke);
		output = output.replace(pageToken.strokeColorToken, strokeColor);
		output = output.replace(pageToken.strokeWidthToken, strokeWidth);
					
		if (item.strokeDashArray.length) {
			output = output.replace(pageToken.strokeStyleToken, Styles.DASHED);
		}
		else {
			output = output.replace(pageToken.strokeStyleToken, Styles.SOLID);
		}
		output = output.replace(pageToken.strokeToken, borderValue);
	}

	output = output.replace(pageToken.pixelWidthToken, pixelWidth);
	output = output.replace(pageToken.pixelHeightToken, pixelHeight);
	output = output.replace(pageToken.percentWidthToken, percentWidth+"");
	output = output.replace(pageToken.percentHeightToken, percentHeight);
	output = output.replace(pageToken.widthToken, width + "");
	output = output.replace(pageToken.heightToken, height + "");

	output = output.replace(pageToken.topToken, top + "");
	output = output.replace(pageToken.leftToken, left + "");
	output = output.replace(pageToken.rightToken, right + "");
	output = output.replace(pageToken.bottomToken, bottom + "");

	output = output.replace(pageToken.rotationToken, rotation + "");
	output = output.replace(pageToken.transformToken, transform);

	output = output.replace(pageToken.imageSourceToken, imageSource);
	output = output.replace(pageToken.imageSourceSetToken, imageSourceSet);

	return output;
}

/**
 * Get bottom position
 * @param {SceneNode} item 
 * @param {Model} model 
 * @param {Boolean} useDrawBounds 
 * @returns {Number}
 */
function getBottomPosition(item, model, useDrawBounds = false) {
	var bounds = model.groupBounds;
	var hasRotation = item.rotation!=0;
	var yPosition = useDrawBounds ? bounds.drawY : bounds.y
	
	if (hasRotation) {
		var useRotation2 = globalModel.useRotation2;

		if (useRotation2) {
			yPosition = 0;
		}
	}

	var value = getShortNumber(model.parentBounds.height - model.groupBounds.height - yPosition);

	return value;
}

/**
 * Get right position
 * @param {SceneNode} item 
 * @param {Model} model 
 * @param {Boolean} useDrawBounds 
 * @returns {Number}
 */
function getRightPosition(item, model, useDrawBounds = false) {
	var bounds = model.groupBounds;
	var hasRotation = item.rotation!=0;
	var xPosition = useDrawBounds ? bounds.drawX : bounds.x;
	
	if (hasRotation) {
		var useRotation2 = globalModel.useRotation2;

		if (useRotation2) {
			xPosition = 0;
		}
	}

	var value = getShortNumber(model.parentBounds.width - model.groupBounds.width - xPosition);

	return value;
}

/**
 * Get percent height
 * @param {SceneNode} item 
 * @param {Model} model 
 * @returns {Number}
 */
function getPercentHeight(item, model, useDrawBounds = false) {
	var bounds = model.groupBounds;
	var value = getShortNumber(model.groupBounds.height/model.parentBounds.height)*100;
	return value;
}
/**
 * Get percent width
 * @param {SceneNode} item 
 * @param {Model} model 
 * @returns {Number}
 */
function getPercentWidth(item, model, useDrawBounds = false) {
	var bounds = model.groupBounds;
	var value = getShortNumber(model.groupBounds.width/model.parentBounds.width)*100;
	return value;
}

/**
 * Replace file token with a list of files
 * @param {String} value  
 * @param {Array} files array of file info objects
 **/
function replaceFileListToken(value, files) {
	var filesArray = files;
	var fileString = "";
	var fileArrayString = "";
	var pathArray = [];
	var quotedArray = [];
	const quotes = '"';
	const delimiter = ",";
	var path = "";


	for (let index = 0; index < files.length; index++) {
		const file = files[index];
		path = file.getFilename();
		pathArray.push(path);
		quotedArray.push(quotes + path + quotes);
	}

	fileString = pathArray.join(delimiter);
	fileArrayString = quotedArray.join(delimiter);
	//log("fileString:"+ fileString)
	//log("fileArrayString:"+ fileArrayString)

	var pageOutput = value!=null ? value.replace(pageToken.fileListToken, fileString) : "";
	pageOutput = pageOutput!=null ? pageOutput.replace(pageToken.fileListArrayToken, fileArrayString) : "";
   return pageOutput;
}

/**
 * Replace content
 * @param {String} page 
 * @param {String} content 
 * @param {String} applicationContent 
 **/
function replaceContentToken(page, content, applicationContent) {
	var contentReplacement;
	var pageMergedOutput = "";
	var whiteSpace;
	var match;
	var appMatch;
	
	// check for application markup token
	appMatch = page.match(pageToken.applicationTokenSingleline);
	
	if (appMatch!=null) {
		whiteSpace = appMatch[1]!=null ? appMatch[1] : "";
		applicationContent = indentMultiline(applicationContent, whiteSpace);
		
		pageMergedOutput = page.replace(pageToken.applicationTokenSingleline, function() {return applicationContent});
	}
	else {
	
		// check for body_content token
		match = page.match(pageToken.contentTokenSingleline);
		
		if (match!=null) {
			// check for body_markup token
			whiteSpace = match[1]!=null ? match[1] : "";
			content = indentMultiline(content, whiteSpace);
			
			pageMergedOutput = page.replace(pageToken.contentTokenSingleline, function(){return content});
		}
		else {
			match = page.match(pageToken.contentTokenMultiline);
			
			if (match!=null) {
				whiteSpace = match[1]!=null ? match[1] : "";
				content = indentMultiline(content, whiteSpace);
				
				contentReplacement = pageToken.contentTokenReplace.replace("[content]", content);
				pageMergedOutput = page.replace(pageToken.contentTokenMultiline, contentReplacement);
			}
			else {
				addWarning(MessageConstants.MISSING_TOKEN, "No content token(s) found in the template.");
				pageMergedOutput = page;
			}
		}
	}
	
	return pageMergedOutput;
}

/**
 * Replace tokens with stylesheet values
 * @param {String} page 
 * @param {String} styles 
 * @param {String} value style value without the enclosing tag 
 **/
function replaceStylesToken(page, styles, value) {
	var contentReplacement;
	var pageMergedOutput = "";
	var whiteSpace;
	var match;
	
	// replace with style value
	page = page.replace(pageToken.stylesValueToken, value);

	// replace styles
	match = page.match(pageToken.stylesTokenSingleline);
	
	if (match!=null) {
		whiteSpace = match[1]!=null ? match[1] : "";
		styles = indentMultiline(styles, whiteSpace);
		pageMergedOutput = page.replace(pageToken.stylesTokenSingleline, styles);
	}
	else {
		match = page.match(pageToken.stylesTokenMultiline);
		
		if (match!=null) {
			whiteSpace = match[1]!=null ? match[1] : "";
			styles = indentMultiline(styles, whiteSpace);
			
			contentReplacement = pageToken.stylesTokenReplace.replace("[styles]", styles);
			pageMergedOutput = page.replace(pageToken.stylesTokenMultiline, contentReplacement);
		}
		else {
			addWarning(MessageConstants.MISSING_TOKEN, "No styles token(s) found in the template.");
			pageMergedOutput = page;
		}
	}
	
	return pageMergedOutput;
}

/**
 * Replace view id tokens with view ids
 * @param {String} page 
 * @param {ArtboardModel} artboardModel 
 **/
function replaceViewIdsToken(page, artboardModel) {
	var contentReplacement;
	var pageMergedOutput = page;
	var whiteSpace;
	var match;
	var ids = globalModel.artboardIds;
	var viewId = artboardModel.elementId;
	var viewIds = [];
	var viewIdsCSS = [];
	var viewIdsArray = [];
	var viewNames = [];
	var delimiter = ","
	var viewName = artboardModel.title || artboardModel.name;

	for (let index = 0; index < ids.length; index++) {
		const id = ids[index].replace("#", "");
		viewIds.push(id);
		viewIdsCSS.push("#"+id);
		viewIdsArray.push('"'+id+'"');
	}

	pageMergedOutput = pageMergedOutput.replace(pageToken.viewNameToken, viewName);
	pageMergedOutput = pageMergedOutput.replace(pageToken.viewIdToken, viewId);
	pageMergedOutput = pageMergedOutput.replace(pageToken.viewIdsToken, viewIds.join(delimiter));
	pageMergedOutput = pageMergedOutput.replace(pageToken.viewIdsArrayToken, viewIdsArray.join(delimiter));
	pageMergedOutput = pageMergedOutput.replace(pageToken.viewIdsCSSToken, viewIdsCSS.join(delimiter));
	
	return pageMergedOutput;
}

/**
 * Create and return Issue object 
 * @param {String} name 
 * @param {String} description 
 * @param {Number} line 
 * @param {Number} column 
 **/
function getIssue(name, description, line = 0, column = 0) {
	var data = new Warning();
	data.description = description;
	data.label = name;
	data.line = line;
	data.column = column;
	return data;
}

/**
 * Replace stylesheet token
 * @param {String} page 
 * @param {String} stylesheetLinks 
 * @param {Boolean} andAddToMarkup 
 **/
function replaceStylesheetsToken(page, stylesheetLinks, andAddToMarkup) {
	var whiteSpace;
	var match;

	match = page.match(pageToken.stylesheetTokenSingleline);
  
	if (match!=null) {
		whiteSpace = match[1]!=null ? match[1] : "";
		stylesheetLinks = indentMultiline(stylesheetLinks, whiteSpace);
		page = page.replace(pageToken.stylesheetTokenSingleline, stylesheetLinks);
	}
	else { 
		match = page.match(pageToken.stylesheetTokenMultiline);
	
		if (match!=null) {
			whiteSpace = match[1]!=null ? match[1] : "";
			stylesheetLinks = indentMultiline(stylesheetLinks, whiteSpace);
		
			var stylesheetReplacement = pageToken.stylesheetTokenReplace.replace("[stylesheets]", stylesheetLinks);
			page = page.replace(pageToken.stylesheetTokenMultiline, stylesheetReplacement);
		}
		else {
			addWarning(MessageConstants.MISSING_TOKEN, "No stylesheet token(s) found in the template.");
		
		if (andAddToMarkup) {
			page = stylesheetLinks + "\n" + page;
		}
	 }
  }
  
  return page;
}

/**
 * Returns true if an object has enumeratable properties
 * @param {Object} object 
 **/
function hasProperties(object) {
	var numberOfProperties = 0;
	
	if (object==null) return false;

	for (var properties in object) {
		numberOfProperties = 1;
		break; 
	}

	return numberOfProperties>0;
}

/**
 * Returns the number of enumeratable properties on the passed in object
 * @param {Object} object 
 */
function getNumberOfProperties(object) {
	var numberOfProperties = 0;

	for (var properties in object) {
		numberOfProperties++;
	}

	return numberOfProperties;
}

/**
 * Adds one line to the document markup.
 * Todo: Use hierarchical tree structure for setting indents
 * @param {Model} model 
 * @param {String} markup 
 * @param {Number} indent 
 * @param {Array} markupArray array to add markup to 
 * @param {Number} minimumIndent 
 **/ 
function addToMarkup(model, markup, indent, markupArray, minimumIndent = null) {
	var output = "";
	
	if (indent==-1) {
		model.currentIndent--;

		if (minimumIndent!=null && model.currentIndent<minimumIndent) {
			model.currentIndent = minimumIndent;
		}
	}

	output = getIndent(model.currentIndent);
	output += markup;

	//log("adding to markup:" + output);
	markupArray.push(output);

	if (indent==1) {
		model.currentIndent++;
	}
}

/**
 * Adds block to the document markup
 **/ 
function addBlockToMarkup(markup, markupArray, indentValue = 0, minimumIndent = 0) {
	var output = "";
	var whiteSpace;

	if (indentValue<minimumIndent) {
		indentValue = minimumIndent;
	}

	// todo use block indent function 
	whiteSpace = getIndent(indentValue);
	output = indentMultiline(markup, whiteSpace);
	//output = indent(markup, whiteSpace);
	//log("adding to markup:" + output);
	markupArray.push(output);
}

/**
 * Adds styles to the artboard css stylesheet array
 * @param {Array} stylesArray array lines of styles to add
 * @param {String} cssText block of styles to add
 * @param {String} before content before styles
 * @param {String} after content after styles
 * @param {Boolean} lineBreak adds a line break before style
 * @param {Number} indent amount to indent
 * @param {Array} cssArray the array to add the styles to
 **/
function addToStyles(stylesArray, cssText, before, after, lineBreak, indent, cssArray) {
	var output = "";
	var value;
	var currentLength = cssArray.length;

	if (lineBreak) {
		output = getIndent(indent);
		output += before;
		cssArray.push(output);
		
		for (var i=0;i<stylesArray.length;i++) {
			value = stylesArray[i];
			output = getIndent(indent+1);
			output += value;
			
			cssArray.push(output);
			//log("adding to styles:" + output);
		}
		
		output = getIndent(indent);
		output += after;
		cssArray.push(output);
	}
	else {
		output = indentMultiline(cssText, getIndent(indent));
		cssArray.push(output);
	}
	
	output = cssArray.slice(currentLength).join(XDConstants.LINE_BREAK);
	//log("adding to styles:" + output);
	return output;
}

/**
 * Add definitions to markup
 * @param {Model} model 
 * @param {String} markup 
 * @param {Number} indent 
 * @param {Number} minimumIndent 
 **/
function addToDefinitions(model, markup, indent = 0, minimumIndent = 0) {
  var output = "";

  output = getIndent(indent);
  output += markup;
  //log("adding to markup:" + output);
  globalArtboardModel.definitionsArray.push(output);

}

// Takes the last two lines and switches them around
// this is usually used when you have closed a tag but 
// want to add another element inside that tag before it's closed
// used mostly to add debug options to the page
function swapLastMarkupInsert() {
	let markup = globalArtboardModel.markupArray;
	
	if (markup.length) {
		let lastLine = markup.pop();
		let notLastLine = markup.pop();
		markup.push(lastLine);
		markup.push(notLastLine);
	}
}

/**
 * Adds each elements mark up to the document line by line
 * @param {SceneNode} item the scene node. can be null (optional)
 * @param {Model} model 
 * @param {Boolean} after 
 **/
function addToExport(item, model, after = false) {
	var b = debugModel.addToExport || model.debug;
	var indentAmount = 0;
	var addedInnerContent = false;
	var className = null;
	var classNamePost = "_Class";
	var additionalStyles = null;
	var space = null;
	/** @type {Definition} */
	var definition = null;
	var parentGroup = null;
	var maskName = null;
	var type = model.type;
	var isMaskGroup = false;
	var isGroup = false;
	var additionalAttributes = model.additionalAttributes;
	var subAttributes = model.subAttributes;
	var exportAsImage = isExportAsImage(item, model);
	var isArtboard = getIsArtboard(item);
	var hasMarkupInside = model.markupInside!=null && model.markupInside!="";
	var innerContent = model.innerContent;
	var isHTML = model.isHTML;
	var isSVG = item && isSVGElement(item);
	var parentModel = item && item.parent && getModel(item.parent);
	var containerTagName = model.containerTagName;
	var svgTagName = model.svgTagName;
	var tagName = null;
	var template = model.template;
	var hasTemplate = template!=null && template!="";
	var addDefaultMarkup = true;
	var isRepeatGridParent = (item && item.parent instanceof RepeatGrid);
	var additionalClasses = null;
	var subClasses = null;
	var stylesIndent = globalArtboardModel.externalStylesheet && globalArtboardModel.exportToSinglePage==false ? 0 : globalArtboardModel.startingStylesIndent;
	var exportList = globalModel.exportList;
	var exportMultipleArtboards = exportList==XDConstants.SELECTED_ARTBOARDS || exportList==XDConstants.ALL_ARTBOARDS;
	var currentCSSArray = globalArtboardModel.cssArray;
	var currentMarkupArray = globalArtboardModel.markupArray;
	var convertMasksToImages = globalArtboardModel.convertMasksToImages;

	if (model.id==null) {
		//addWarning("Model has no ID", "The model has no ID");
	}

	if (hasTemplate) {
		if (isArtboard) {
			addDefaultMarkup = true;
		}
		else {
			addDefaultMarkup = false;
		}
	}
	
	parentGroup = item ? item.parent : null;

	if (item && item instanceof Group && item.mask && item.isContainer) {
		isMaskGroup = true;
	}

	if (item && item.isContainer) {
		isGroup = true;
	}

	svgTagName = model.svgTagName;
	containerTagName = model.elementTagName;
	tagName = model.elementSubTagName;

   className = model.elementId + classNamePost;
	
	// what's this doing?
	if (model.singleTag) {
		//additionalAttributes : subAttributes;
	}
		
	if (model.additionalStyles) {
		//additionalStyles = model.additionalStyles;
	}
  
	if (globalArtboardModel.addSpaceBetweenStyleAndValue) {
		space = " ";
	}
	
	if (exportAsImage) {
		
	}
  
  //////////////////////////////////////////////////////////
  // BEFORE - code to add before child nodes are added
  //////////////////////////////////////////////////////////

  if (after==false) {
	 
	 b && log("AddToExport before: " + model.elementId);
	 model.currentIndent = model.nestLevel + globalArtboardModel.startingIndent;

	 // show outline
	 if (model.showOutline) {
		model.cssStyles.outline = globalArtboardModel.outlineStyle;
	 }

	 if (exportAsImage) {
		 // added in exportImage()
		//addToRenditions(item, model, artboardModel.defaultRenditionScales);
	 }
	 
	 // STYLES
	 // now setting styles in another function
	 // adding css styles move to own function like addHoverEffects()
	 /*
	 if (hasProperties(model.cssStyles)) {

		if (model.useSelector) {
		   model.cssBefore = model.selector + " {";
		}
		else if (globalArtboardModel.useClassesToStyleElements) {
			model.cssBefore = getCSSClass(className) + " {";
		}
		else {
			model.cssBefore = getCSSID(model.elementId) + " {";
		}
		
		model.cssAfter = "}";
		
		model.cssText = model.cssBefore + getCSSValue(model.cssStyles, null, false, additionalStyles) + model.cssAfter;
		model.cssArray = getCSSValueArray(model.cssStyles, space, additionalStyles);
		addToStyles(model.cssArray, model.cssText, model.cssBefore, model.cssAfter, globalArtboardModel.useStyleLineBreaks, stylesIndent, currentCSSArray);   
	 }
	 */

	 // STYLE RULES
	 // adds style rules to the stylesheet
	 if (model.styleRules.length) {
		var styleRules = model.styleRules;
		var numberOfStyleRules = styleRules.length;
		var stylesheetTemplate = model.stylesheetTemplate;
		var hasCustomCSS = stylesheetTemplate!=null && stylesheetTemplate!="" && isArtboard==false;
		var excludeStyles = stylesheetTemplate!=null && stylesheetTemplate.match(pageToken.noStylesToken)!=null && hasCustomCSS;

		// if user has custom CSS and has a "no styles" token then exclude created CSS
		if (excludeStyles==false) {

			for (let i = 0; i < numberOfStyleRules; i++) {
				/** @type {Rule} */
				const rule = styleRules[i];

				// add styles or keyframes
				if (rule instanceof StyleRule) {
					const cssBefore = rule.selectorText + " {";
					const cssAfter = "}";
					
					rule.cssText = cssBefore + getCSSValue(rule.style, null, false) + cssAfter;
					rule.cssArray = getCSSValueArray(rule.style, space);

					addToStyles(rule.cssArray, rule.cssText, cssBefore, cssAfter, globalArtboardModel.useStyleLineBreaks, stylesIndent, currentCSSArray);
				}
				else if (rule instanceof KeyframesRule) {
					var keyframeRules = rule.cssRules;
					var numberOfKeyframeRules = keyframeRules.length;

					const cssBefore = XDConstants.AT_SYMBOL + KeyframesRule.KEYFRAMES + XDConstants.SPACE + rule.name + " {";
					const cssAfter = "}";

					var cssOutput2 = addToStyles(rule.cssArray, rule.cssText, cssBefore, "", globalArtboardModel.useStyleLineBreaks, stylesIndent, currentCSSArray);

					if (numberOfKeyframeRules) stylesIndent++;

					for (let index = 0; index < numberOfKeyframeRules; index++) {
						let keyRule = keyframeRules[index];
						let cssBefore = keyRule.keyText + " {";
						let cssAfter = "}";
						
						keyRule.cssText = cssBefore + getCSSValue(keyRule.style, null, false) + cssAfter;
						keyRule.cssArray = getCSSValueArray(keyRule.style, space);
						rule.cssArray.push(keyRule.cssText);
						// sometimes ending bracket } was not added bc model.cssAfter was empty so for now using local var
						//var cssOutput3 = addToStyles(keyRule.cssArray, keyRule.cssText, cssBefore, model.cssAfter, globalArtboardModel.useStyleLineBreaks, stylesIndent);
						var cssOutput = addToStyles(keyRule.cssArray, keyRule.cssText, cssBefore, cssAfter, globalArtboardModel.useStyleLineBreaks, stylesIndent, currentCSSArray);
					}

					if (numberOfKeyframeRules) stylesIndent--;

					// if no line break
					rule.cssText = cssBefore + rule.cssArray.join("\n") + cssAfter;
					addToStyles([], "", "", cssAfter, globalArtboardModel.useStyleLineBreaks, stylesIndent, currentCSSArray);
				}
			}
		}
		
		if (hasCustomCSS) {
			var customCSS = replaceTemplateTokens(item, model, stylesheetTemplate, true);
			addToStyles([], customCSS, "", "", false, stylesIndent, currentCSSArray);
		}
	 }

	 /*
	 // adding svg css
	 if (hasProperties(model.svgStyles)) {
		
		if (model.svgUseClasses) {
			
		  className = model.elementId;
		  //model.svgClassesArray.push(className);
		  //setSVGContainerClassAttribute(item, model);

		  //setClassAttribute2(model.svgClassesArray, model.svgAttributes, additionalClasses);
		  model.svgCSSBefore = getCSSClass(model.elementId) + " {";
		}
		else {
		  model.svgCSSBefore = getCSSID(model.elementId) + " {";
		}
		
		model.svgCSSAfter = "}";
		
		model.svgCSS = model.svgCSSBefore + getCSSValue(model.svgStyles, null, false, additionalStyles) + model.svgCSSAfter;
		model.cssArray = getCSSValueArray(model.svgStyles, space, additionalStyles);
		addToStyles(model.cssArray, model.svgCSS, model.svgCSSBefore, model.svgCSSAfter, globalArtboardModel.useStyleLineBreaks, stylesIndent, currentCSSArray);   
	 }
	 */
	 
	 // MARKUP
	 // user markup before - for comments or php
	 if (model.markupBefore!="" && model.markupBefore!=null) {
		b && log("adding markupBefore");
		indentAmount = model.markupBefore && model.markupAfter ? 1 : 0;
		indentAmount = 0;
		addToMarkup(model, model.markupBefore, indentAmount, currentMarkupArray);
	 }

	 // Make variable
	 if (model.exportAsString===true) {
		b && log("adding export as string");
		indentAmount = 0;
		var repeatGridParent = getParentRepeatGrid(item);
		var variableName = null;
		var script = getTag(HTMLConstants.SCRIPT, {type:"text/javascript"}, false);

		if (repeatGridParent) {
			var repeatGridModel = getModel(repeatGridParent);
			variableName = repeatGridModel.elementId + "Item";
		}
		else {
			variableName = model.elementId;
		}

		addToMarkup(model, script, indentAmount, currentMarkupArray);
		script = "var " + variableName + " = `";
		addToMarkup(model, script, indentAmount, currentMarkupArray);
	 }

	 // hyperlink - adding a hyperlink / anchor tag before objects can mess up users selectors or styles
	 // for example a selector to items in a flex box might target container > div 
	 // but selectors also need to target container > a
	 // if wrapping in an anchor can also add underlines where not expected
	 if (model.hyperlink || model.hyperlinkedArtboardGUID) {
		b && log("adding hyperlink");
		var hyperlinkAttributes = {href: model.hyperlink};

		if (model.hyperlinkedArtboardGUID) {
			let hyperlinkArtboardModel = getArtboardModelByGUID(model.hyperlinkedArtboardGUID);

			if (hyperlinkArtboardModel) {
				var href = null;

				if (globalModel.exportToSinglePage) {
					href = XDConstants.HASH;
					href += hyperlinkArtboardModel.elementId ? replaceNonWordCharacters(hyperlinkArtboardModel.elementId) : replaceNonWordCharacters(hyperlinkArtboardModel.name);
				}
				else {
					//href = hyperlinkArtboardModel.filename ? hyperlinkArtboardModel.filename + XDConstants.PERIOD + HTMLConstants.HTML : replaceNonWordCharacters(hyperlinkArtboardModel.name) + XDConstants.PERIOD + HTMLConstants.HTML;
					href = hyperlinkArtboardModel.getFilename();
				}

				hyperlinkAttributes.href = href;
			}
			else {
				addWarning(MessageConstants.LINK_TO_ARTBOARD, "Can't find artboard '" + model.hyperlink + "' linked to by '" + model.name + "'");
			}
		}

		if (model.hyperlinkTarget) {
			hyperlinkAttributes.target = model.hyperlinkTarget;
		}

		model.hyperlinkBefore = getTag(model.anchorTagName, hyperlinkAttributes);
		indentAmount = 0;
		addToMarkup(model, model.hyperlinkBefore, indentAmount, currentMarkupArray);
	 }
	 
	 // container before - for div for some composite components
	 if (model.addContainer) {
		b && log("adding containerBefore");
		//additionalAttributes = model.setAdditionalAttributesOnContainer ? model.additionalAttributes : "";
		model.containerBefore = getTag(containerTagName, model.containerAttributes, false, null, additionalAttributes);
		indentAmount = model.containerBefore && model.containerAfter ? 1 : 0;
		indentAmount = 0;
		addToMarkup(model, model.containerBefore, indentAmount, currentMarkupArray);
	 }
	 
	 // svg before - for svg container of svg elements
	 if (model.addSVGContainer) {
		b && log("adding svgBefore");
		if (parentGroup && parentGroup instanceof Group && parentGroup.mask && item!=parentGroup.mask) {//ugh
		  //model.svgProperties[Styles.CLIP_PATH] = "url(#" + artboardModel.lastMaskID + ")";
		}
		
		model.svgBefore = getTag(svgTagName, model.svgAttributes, false, null, additionalAttributes);
		indentAmount = model.svgBefore ? 1 : 0;
		indentAmount = 1;
		addToMarkup(model, model.svgBefore, indentAmount, currentMarkupArray);
	 }
	 
	 // svg before - for svg container of svg elements
	 if (isMaskGroup && convertMasksToImages==false) {
		let useMask = false;

		b && log("adding svgBefore mask");
		if (useMask) {
		  // temporary inline styles
		  let val = getTag(svgTagName, {style:"width:inherit;height:inherit;overflow:visible"} );
		  indentAmount = 1;
		  addToMarkup(model, val, indentAmount, currentMarkupArray);
		}
		else {
			if (isMaskGroup) {
				addWarning(MessageConstants.MASK_SUPPORT, "Masks are not supported in this release. Exporting masked group as an image");
			}

			// create a image fill 
			createImageFill(item, model, null);
			let svgAttributes = {};
			// temporary inline styles
			svgAttributes.style = "width:inherit;height:inherit;overflow:visible;";
			let val = getTag(svgTagName, svgAttributes);
			
			indentAmount = 1;
			addToMarkup(model, val, indentAmount, currentMarkupArray);
			
			let properties = {};
			properties.fill = "url(#" + model.definition.id + ")";
			properties.width = "100%";
			properties.height = "100%";
			let rectValue = getTag(HTMLConstants.RECTANGLE, properties) + getEndTag(HTMLConstants.RECTANGLE);
			indentAmount = 1;
			addToMarkup(model, rectValue, indentAmount, currentMarkupArray);
		}

	 }

	 // MASKS or CLIP PATHS
	 // add a mask or reference to a mask
	 if (convertMasksToImages==false && parentGroup && parentGroup.mask) {

		if (item==parentGroup.mask) {
		  let defsValue = getTag(HTMLConstants.DEFINITIONS, null);
		  indentAmount = 1;
		  addToMarkup(model, defsValue, indentAmount, currentMarkupArray);

		  maskName = model.elementId + "_mask";
		  b && log("adding mask:" + maskName);
		  //model.mask = getTag(Classes.MASK, {id:maskName});
		  model.mask = getTag(HTMLConstants.CLIP_PATH, {id:maskName});
		  indentAmount = 1;
		  addToMarkup(model, model.mask, indentAmount, currentMarkupArray);

		  globalArtboardModel.lastMaskID = maskName;
		}
		else {
		  b && log("adding mask id:" + globalArtboardModel.lastMaskID);
		  //model.attributes.mask = "url(#" + artboardModel.lastMaskID + ")";
		}
	 }

	 // add renditions to the renditions array
	 if (model.renditions.length) {
		b && log("adding renditions")
		b && log("artboardModel.renditions length " + globalArtboardModel.renditions.length)
		globalArtboardModel.renditions = globalArtboardModel.renditions.concat(model.renditions);
		b && log("artboardModel.renditions length after " + globalArtboardModel.renditions.length)
	 }
	 
	 // svg definitions - for svg gradient fills and image fills
	 if (hasProperties(model.definition)) {
		 b && log("adding gradient or pattern definition before");
		 definition = model.definition;
		 model.definitionBefore = getTag(definition.tagName, definition.properties);
		 indentAmount = 1;

		if (!globalArtboardModel.hoistSVGDefinitions) {
		  addToMarkup(model, model.definitionBefore, indentAmount, currentMarkupArray);
		}

		addToDefinitions(model, model.definitionBefore, 1);
		
		//model.indentAmount--;
		indentAmount--;
		var numberOfColorStops = definition.colorStops ? definition.colorStops.length : 0
		
		for (let i=0;i<numberOfColorStops;i++) {
		  let colorStop = definition.colorStops[i];
		  b && log("adding gradient colorstop");
		  // Message in IE that color tag cannot be self closing
		  // but examples on W3C use singletons for color stop
		  let colorStopValue = getTag(definition.colorStopTagName, colorStop, true, null, null, false);
		  model.colorStops.push(colorStopValue);
		  addToDefinitions(model, colorStopValue, 2);
		  indentAmount = 0;
		  
		  if (!globalArtboardModel.hoistSVGDefinitions) {
			 addToMarkup(model, colorStopValue, indentAmount, currentMarkupArray);
		  }
		}

		if (definition.imageAttributes) {
		   //log("HAS IMAGE")

		  	if (definition.imageData) {
				//log("HAS IMAGE DATA")
				//addToRenditions(definition.imageData, model, [1,2]);
				var imageDefinition = {id: definition.id, node: item, imageData: definition.imageData, filename: definition.filename}
				var imageDefinition2x = {id: definition.id+"@2x", node: item, imageData: definition.imageData, filename: definition.filename, scale: 2};
				
				globalArtboardModel.renditions.push(imageDefinition);
				
				if (model.image2x==null || model.image2x==true) {
					globalArtboardModel.renditions.push(imageDefinition2x);
				}
			}
			else if (definition.imageAttributes) {
				var imageDefinitionAttributes = {id: definition.id, node: item, imageData: null, filename: definition.fullFilename};
				var imageDefinitionAttributes2x = {id: definition.id, node: item, imageData: null, filename: definition.filename+"@2x." + definition.extension, scale: 2};

				globalArtboardModel.renditions.push(imageDefinitionAttributes);
				
				// only add scale 2x for now
				if (globalArtboardModel.exportScaledRenditions) {

						if (model.image2x==null || model.image2x==true) {
						globalArtboardModel.renditions.push(imageDefinitionAttributes2x);
					}
				}
		  }
		  
		  let imageAttributes = definition.imageAttributes;
		  let imageValue = getTag(definition.imageTagName, imageAttributes, true, null, null, false);

		  addToDefinitions(model, imageValue, 2);
		  indentAmount = 0;

		  if (!globalArtboardModel.hoistSVGDefinitions) {
			 addToMarkup(model, imageValue, indentAmount, currentMarkupArray);
		  }
		}

		b && log("adding gradient or pattern definition after");
		model.definitionAfter = getEndTag(definition.tagName);
		indentAmount = -1;

		if (!globalArtboardModel.hoistSVGDefinitions) {
		  addToMarkup(model, model.definitionAfter, indentAmount, currentMarkupArray);
		}

		addToDefinitions(model, model.definitionAfter, 1);
	 }
	 
	 // ACTUAL ELEMENT MARKUP
	 // todo refactor this function
	if (tagName!=null && addDefaultMarkup==true) {
		b && log("adding markup");

		subAttributes = model.singleTag ? additionalAttributes : subAttributes;

		if (isArtboard && (subAttributes==null || subAttributes=="")) {
			subAttributes = additionalAttributes;
		}
		
		if (model.linebreakInnerContent) {
			// we add it in the next code block
			model.markup = getTag(tagName, model.attributes, false, null, subAttributes);
			
			if (innerContent!=null) {
				indentAmount = 1;
			}
			else {
				indentAmount = 0;
			}
		}
		else {
			model.markup = getTag(tagName, model.attributes, false, innerContent, subAttributes);
			addedInnerContent = true;
			indentAmount = 0;
		}

		if (model.markup!="") {
			addToMarkup(model, model.markup, indentAmount, currentMarkupArray);
		}
	}

	if (innerContent!=null && addedInnerContent==false) {
		b && log("adding inner content");
		indentAmount = 1;
		addToMarkup(model, innerContent, indentAmount, currentMarkupArray);
		model.currentIndent--;
		if (getObjectType(item)==XDConstants.TEXT || isSVG || isGroup) model.currentIndent--;
	}
	
	if (model.beforeContent!=null && addedInnerContent==false) {
		b && log("adding before content");
		indentAmount = 1;
		addToMarkup(model, model.beforeContent, indentAmount, currentMarkupArray);
		model.currentIndent--;
		if (getObjectType(item)==XDConstants.TEXT || isSVG || isGroup) model.currentIndent--;
	}
	
	if (model.addEndTag && tagName!=Styles.NONE) {
		b && log("adding markup end tag");
		
		if (hasTemplate==false) {
			model.markupCloseTag = getEndTag(tagName);
			addToMarkup(model, model.markupCloseTag, 0, currentMarkupArray);
		}
	 }
	 
	 // MASKS
	 // closing mask tag
	 if (false && parentGroup && parentGroup.mask) {

		if (item==parentGroup.mask) {
		  b && log("adding mask close tag");
		  //model.maskCloseTag = getEndTag(Classes.MASK);
		  model.maskCloseTag = getEndTag(HTMLConstants.CLIP_PATH);
		  indentAmount = 0;
		  addToMarkup(model, model.maskCloseTag, indentAmount, currentMarkupArray);
		  model.currentIndent--;

		  let defsValue = getEndTag(HTMLConstants.DEFINITIONS);
		  indentAmount = 0;
		  addToMarkup(model, defsValue, indentAmount, currentMarkupArray);
		  model.currentIndent--;
		}
	 }

	 if (model.addSVGContainer) {
		b && log("adding svgAfter");
		model.svgAfter = getEndTag(svgTagName);

		indentAmount = -1;
		addToMarkup(model, model.svgAfter, indentAmount, currentMarkupArray);
		model.currentIndent--;
	 }

  }
  
  //////////////////////////////////////////////////////////
  // AFTER - code to add after child nodes were added
  //////////////////////////////////////////////////////////
  
	if (after==true) {
		b && log("AddtoExport after: " + model.elementId);
		//model.currentIndent = model.nestLevel + documentModel.startingIndent;

		if (model.addCloseTag) {
			b && log("adding markup close tag");
			model.markupCloseTag = getEndTag(tagName);
			addToMarkup(model, model.markupCloseTag, -1, currentMarkupArray);
		}

		if (isMaskGroup) {
			b && log("adding svgAfter mask");
			model.svgAfter = getEndTag(svgTagName);
			addToMarkup(model, model.svgAfter, 0, currentMarkupArray);
			model.currentIndent--;
		}

		// add page script when exporting to a single page or multiple individual pages
		// TODO: Export using script classes like style rules
		if (item && 
			model.type==XDConstants.ARTBOARD && 
			(globalModel.exportToSinglePage==false || exportMultipleArtboards==false) && globalArtboardModel.itemToExport==null) {
			b && log("adding slider markup and artboard script");
			var additionalArtboardOutput = "";

			if (globalArtboardModel.showScaleSlider) {
				additionalArtboardOutput = XDConstants.LINE_BREAK_FULL + globalModel.zoomSliderControls + XDConstants.LINE_BREAK_FULL;
				addBlockToMarkup(additionalArtboardOutput, currentMarkupArray);
			}
			
			var usePreviousAddScript = false;
			if (usePreviousAddScript && needsPageScript(globalArtboardModel)) {
				additionalArtboardOutput = wrapInTag(HTMLConstants.SCRIPT, globalModel.pageControlsScript);
				addBlockToMarkup(additionalArtboardOutput, currentMarkupArray);
			}
			
		}
		
		if (model.addContainer && model.addContainerCloseTag) {
			b && log("adding containerAfter");
			model.containerAfter = getEndTag(containerTagName);
			addToMarkup(model, model.containerAfter, 0, currentMarkupArray, globalArtboardModel.startingIndent);
		}

		if (model.afterContent!=null) {
			b && log("adding after content");
			indentAmount = 1;
			addToMarkup(model, model.afterContent, indentAmount, currentMarkupArray);
			model.currentIndent--;
			if (getObjectType(item)==XDConstants.TEXT || isSVG || isGroup) model.currentIndent--;
		}

		if (model.hyperlink || model.hyperlinkedArtboardGUID) {
			b && log("adding hyperlink");
			model.hyperlinkAfter = getEndTag(model.anchorTagName);
			addToMarkup(model, model.hyperlinkAfter, 0, currentMarkupArray);
		}

		// Make variable
		if (model.exportAsString===true) {
		  b && log("adding export as string");
		  var script = "`;";
		  addToMarkup(model, script, 0, currentMarkupArray, globalArtboardModel.startingIndent);
		  addToMarkup(model, getEndTag(HTMLConstants.SCRIPT), 0, currentMarkupArray, globalArtboardModel.startingIndent);
		}

		if (model.markupAfter!="") {
			b && log("adding markupAfter");
			addToMarkup(model, model.markupAfter, 0, currentMarkupArray);
		}

		// Add script template
		var scriptTemplate = model.scriptTemplate;
		if (scriptTemplate!=null && scriptTemplate!="" && isArtboard==false) {
			b && log("adding script as string");
			indentAmount = globalArtboardModel.startingIndent+model.currentIndent;
			var script = getTag(HTMLConstants.SCRIPT, {type:"text/javascript"}, false);
			var selector = model.selector;
			var getElementString = 'document.getElementById("' + model.elementId + '");\n';
			var addListenerString = 'element.addEventListener("' + model.elementId + '");\n';
  
			selector = getSelectorName(item, model, false, globalArtboardModel.useClassesToStyleElements);

			if (globalArtboardModel.useClassesToStyleElements) {
				getElementString = 'document.getElementByClassName("' + selector + '")';
			}

			addToMarkup(model, script, indentAmount, currentMarkupArray);
			script = "";
			//script = "var element = " + getElementString;
			script += replaceTemplateTokens(item, model, scriptTemplate);
			script = indentMultiline(script, indentAmount);
			addToMarkup(model, script, indentAmount, currentMarkupArray);
			addToMarkup(model, getEndTag(HTMLConstants.SCRIPT), indentAmount, currentMarkupArray);
		}
	}

}

/**
 * Return an array of scene nodes that have export set to false
 * @param {Array} sceneNodes array of scene nodes
 **/
function filterNonExportables(sceneNodes) {
	var model = null;
	var list = sceneNodes.slice();

	for (let index = 0; index < list.length; index++) {
		const element = list[index];
		model = getModel(element);

		if (model==null) {
			model = getModelPluginDataOnly(element);
		}

		if (model && model.export==false) {
			list.splice(index, 1);
		}
	}

	return list;
}

function getArtboardModelByGUID(guid) {
	return globalModel.artboardModels[guid];
}

/**
 * Get the widths of the artboards
 * @param {Array} artboards 
 **/
function getArtboardWidths(artboards) {
	var artboardWidths = [];
	
	// get the widths of all artboards
	for (let index = 0; index < artboards.length; index++) {
		let artboard = artboards[index];
		let artboardWidth = artboard.width;
		let isArtboard = getIsArtboard(artboard);

		// in some cases the artboard width can be undefined - skip for now
		// may be a paste board item
		if (isArtboard===false) {
			continue;
		}

		var currentArtboardModel = getArtboardModel(artboard);

		if (currentArtboardModel.export == false) {
			continue;
		}

		if (artboardWidths.indexOf(artboardWidth)==-1 && artboardWidth!==undefined) {
			artboardWidths.push(artboard.width);
		}
		//else if (addMediaQuery && model) {
			//addWarning(MessageConstants.SAME_ARTBOARD_WIDTHS, "At least two artboards have the same width. Here's one of them: " + artboard.name);
		//}
	};

	// sort numerically in ascending order
	artboardWidths.sort((a, b) => a - b);
	
	return artboardWidths;
}

/**
 * Returns true if the page needs the script library. 
 * The script is used for scaling, autorefresh, setting states and more
 * Set the script template value to force the script to be exported all the time
 * @param {ArtboardModel} artboardModel 
 **/
function needsPageScript(artboardModel) {
	// include page script automatically
	return true;

	if (artboardModel.scaleToFit || 
		artboardModel.scaleOnDoubleClick || 
		artboardModel.actualSizeOnDoubleClick || 
		artboardModel.showScaleSlider || 
		artboardModel.scaleOnResize || 
		artboardModel.refreshPage ||
		artboardModel.scriptTemplate ||
		artboardModel.externalScript ||
		artboardModel.centerHorizontally ||
		artboardModel.centerVertically ||
		globalModel.exportAsSinglePageApplication ||
		globalModel.showArtboardsByControls) {
		return true;
	}
	return false;
}

function openURLLocation() {
	var b = debugModel.openURL;

	b && log("Opening location");
	var supportsFile = applicationVersion<24;
	var result = null;
	var path = GlobalModel.lastRURLLocationEnc;

	if (GlobalModel.isMac && applicationVersion) {
		result = shell.openExternal(GlobalModel.lastURLLocation);
	}
	else {
		result = shell.openExternal(path);
	}
}

function openLocation() {
  var b = debugModel.openURL;
  b && log("Opening location");

  if (lastFileLocation!=null) {
	 openLastLocation();
  }
  else {
	 mainForm.warningsTextarea.value = "No location available. Please run export first";
  }
}

function openLastLocation() {
  var b = debugModel.openURL;
  
  b && log("Last file location:" + lastFileLocation);
  b && log("GlobalModel.lastFileLocation: " + GlobalModel.lastFileLocation);
  b && log("GlobalModel.lastURLLocation: " + GlobalModel.lastURLLocation);

  if (GlobalModel.lastURLLocation!=null) {
	 b && log("Opening location:" + GlobalModel.lastURLLocation);
	 openURL(GlobalModel.lastURLLocation, true, true);
  }
  else {
	 b && log("Run export first");
	 showAlertDialog("No location available. Please perform an export first.", "Web Export")
  }
}

/**
 * Converts scene node list to an array
 * @param {Object} object 
 **/
function getArrayFromObject(object) {
	var array = [];

	for (const key in object) {
		if (object.hasOwnProperty(key)) { // should check if number
			const value = object[key];
			array[key] = value;
		}
	}

	return array;
}

async function mergeLayers(event) {
	const {selection} = require("scenegraph");
	const { editDocument } = require("application");

	try {
		
		const pluginDataFolder = await fileSystem.getDataFolder();
		var path = pluginDataFolder.nativePath;
		var item = selection.items[0];
		var artboard = getArtboard(item);
		var width = item.globalDrawBounds.width;
		var height = item.globalDrawBounds.height;
		mouseDownElement = item;
		lastMergedLayerFile = await getTempImageFromSceneNode(item);

		log("saved last merge image file")
	}
	catch(error) {
		log(error)
	}
}

async function addLastMerge(event) {
	const {selection} = require("scenegraph");
	const { editDocument } = require("application");
	var item = selection.items[0];

	try {

		editDocument( () => {
			var newElement = new Rectangle();
			const imageFill = new ImageFill(lastMergedLayerFile);
			newElement.fill = imageFill;
			var bounds = getBoundsInParent(mouseDownElement);
			newElement.width = bounds.width;
			newElement.height = bounds.height;
			selection.insertionParent.addChild(newElement);
			newElement.moveInParentCoordinates(bounds.x, bounds.y);
		});
	}
	catch(error) {
		log(error)
	}
}

function showErrorIcon(value) {
	
}

/**
 * Show an icon for a brief period of time
 * @param {Object} icon icon to show
 * @param {Boolean} timeout show for a specific time
 * @param {Number} duration how long to show message
 **/
function showIcon(icon, timeout = true, duration = 0) {
	duration = duration!=0 ? duration : globalModel.quickExportNotificationDuration;

	icon.style.display = "block";

	if (timeout) {
		
		if (elementForm.panelIconTimeout != null) {
			clearTimeout(elementForm.panelIconTimeout);
			elementForm.panelIconTimeout = null;
		}

		elementForm.panelIconTimeout = setTimeout(() => {
			icon.style.display = "none";
		}, duration);
	}
}

/**
 * Show message in a span for a brief period of time - showLabel
 * @param {Object} span span to show
 * @param {String} message message to display
 * @param {String} defaultValue message to show after timeout 
 * @param {Boolean} timeout show for a specific time
 * @param {Number} duration how long to show message in milliseconds
 * @param {Boolean} append append
 **/
function showSpan(span, message = "", defaultValue = "", timeout = true, duration = 0, append = false) {
	duration = duration!=0 ? duration : globalModel.quickExportNotificationDuration;

	if (append) {
		span.innerHTML += message;
	}
	else {
		span.innerHTML = message;
	}

	if (span.timeoutReference!=null) {
		clearTimeout(span.timeoutReference);
	}

	if (timeout===true) {

		span.timeoutReference = setTimeout(() => {
			span.innerHTML = defaultValue==null ? "" : defaultValue;
		}, duration);
	}
}

function errorLog(value) {

	if (globalModel.showingPanel) {
		showErrorIcon(value);
	}

	log(value);
	
}

/**
 * Handle global errors.
 * @param {String} message 
 * @param {String} url 
 * @param {Number} line 
 * @param {Number} column 
 * @param {*} error 
 **/
function errorHandler (message, url, line, column, error) {
	var string = message.toLowerCase();
	var substring = "script error";

	if (string.indexOf(substring) > -1){
	  log('Script Error: See Console for Detail');
	} else {
	  var message = [
		 'Message: ' + message,
		 'URL: ' + url,
		 'Line: ' + line,
		 'Column: ' + column,
		 'Error object: ' + JSON.stringify(error)
	  ].join(' - ');
 
	  log(message);
	}
 
	return false;
}

/**
 * Error handler
 * @param {*} error 
 */
function errorHandler2 (error) {
 
	return false;
}

function reloadPanel() {
	log("command")
}


if (Platforms.isXD) {
		
	module.exports = {
		commands: {
			showMainDialog: showMainDialog, 
			showElementDialog: showElementDialog, 
			exportToWeb: quickExport,
			openLastLocation: openLastLocation,
			openSupportDialog: openSupportDialog
		},
		panels: {
			"elementDialog": {
				async show(event) {
					const { selection, root } = require("scenegraph");
					var node = event.node;

					//window.addEventListener("error", errorHandler2, true);
					//window.addEventListener("onerror", errorHandler2, true);
					//window.onerror = errorHandler;
					
					try {
						panelNode = node;

						globalModel.panelVisible = true;

						await showElementDialog(selection, root, true, globalModel.showLabelsInPanel);
						
						if (GlobalModel.supportsPluginData && globalModel.selectedModel) {
							updateElementForm(globalModel.selectedModel);
						}
						
					}
					catch (error) {
						log(error.stack);
					}

				},

				hide(event) {
					globalModel.panelVisible = false;

					try {

						if (event.node && event.node.firstElementChild) {
							event.node.firstElementChild.remove();
						}
					}
					catch(error) {
						log(error);
					}
				},

				async update() {
					const { selection, root } = require("scenegraph");

					try {

						if (moreRoomForm.isVisible) {
							moreRoomForm.commitForm();
						}

						if (globalModel.panelVisible==false) {
							return;
						}

						var time = getTime();

						await showElementDialog(selection, root, true, globalModel.showLabelsInPanel);

						time = getTime() - time;

						if (GlobalModel.supportsPluginData && globalModel.selectedModel) {
							updateElementForm(globalModel.selectedModel);
						}
						
						if (globalModel.exportOnUpdate) {

							if (selection.items.length || selection.focusedArtboard) {
								exportFromAutoUpdate();
							}
						}
					}
					catch(error) {
						log(error.stack);
					}
				}
			}
		}
	}
}
else if (Platforms.isPhotoshop) {
	const { entrypoints } = require("uxp");

	log("Photoshop path")
	var test = h("input");

	entrypoints.setup({
		commands: {
			showMainDialog: showMainDialog, 
			showElementDialog: showElementDialog, 
			exportToWeb: quickExport,
			//openLastLocation: openLastLocation,
			openSupportDialog: openSupportDialog
		},
		panels: {
			"elementDialog": {
				async show(event) {
					
					try {
						const activeDocument = application.activeDocument;
						var selectedLayers = activeDocument.topLayers;
						var node = event.node;
						panelNode = node;

						globalModel.panelVisible = true;

						await showElementDialog(selectedLayers, activeDocument, true, globalModel.showLabelsInPanel);
						
						if (GlobalModel.supportsPluginData && globalModel.selectedModel) {
							updateElementForm(globalModel.selectedModel);
						}
						
					}
					catch (error) {
						log(error.stack);
					}

					event.node.appendChild(test);
				}
			}
		}
	});
}