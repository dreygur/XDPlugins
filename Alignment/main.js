///////////////////////////////////////////////////////////////////////////
// Alignment
// Set alignment of selected objects in it's container
///////////////////////////////////////////////////////////////////////////

const {Artboard, BooleanGroup, Color, Ellipse, Group, Line, LinkedGraphic, Path, Rectangle, RepeatGrid, RootNode, SceneNode, SymbolInstance, Text} = require("scenegraph");
const {object, log, getClassName, getString, getBoundsInParent, getShortNumber, getArtboard, getFunctionName, getStackTrace, getChangedProperties, moveTo, DebugSettings} = require("./log");
const {centerLeft, center, centerRight, topLeft, topCenter, top, topRight, bottomLeft, bottom, bottomCenter, bottomRight, left, right} = require("./log");
const {anchorToEdges, anchorToVerticalEdges, anchorToHorizontalEdges, centerHorizontally, centerVertically} = require("./log");

class Model {
    constructor() {
        this.labelWidth = 75;
        this.messageLabel = null;
        this.selection = null;
        this.documentRoot = null;
        this.version = 1;
        
        this.dialog = null;
        this.frontView = null;
        this.backView = null;
        this.headerLabel = null;
        this.nameLabel = null;
        this.messageParagraph = null;
        this.marginInput = null;
        this.leftInput = null;
        this.rightInput = null;
        this.horizontalInput = null;
        this.verticalInput = null;
        this.bottomInput = null;
        this.topInput = null;
        this.lastHorizontalValue = null;
        this.lastVerticalValue = null;
        this.lastLeftValue = null;
        this.lastRightValue = null;
        this.lastBottomValue = null;
        this.lastTopValue = null;
        this.lastLeftLabel = null;
        this.lastRightLabel = null;
        this.lastBottomLabel = null;
        this.lastTopLabel = null;
        this.lastHorizontalLabel = null;
        this.lastVerticalLabel = null;
        this.lastPositionSet = null;
        this.dialogWidth = 260;
        this.rows = {};
        this.rowHeight = 40;
        this.backRowHeight = 30;
        this.iconWidth = 18;
        this.iconHeight = 18;
        this.footerIconWidth = 14;
        this.footerIconHeight = 14;
        this.iconFactor = 1.5;
        this.footerMargin = 12,
        this.backInputWidth = 150;
        this.backViewLabelWidth = 100;
        this.lastLabelWidth = 55;
        this.alternativeKey = false;
        this.event = null;

        // top row
        this.topLeftIcon = "icons/Top Left.png";
        this.topLeftMiddleIcon = "icons/Top Left Middle.png";
        this.topCenterIcon = "icons/Top Center.png";
        this.topRightMiddleIcon = "icons/Top Right Middle.png";
        this.topRightIcon = "icons/Top Right.png";
        
        // second row
        this.leftTopIcon = "icons/Left Middle Top.png";
        this.leftCenterIcon = "icons/Left Center.png";
        this.rightTopIcon = "icons/Right Middle Top.png";

        // middle row
        this.horizontalCenterBottomIcon = "icons/Horizontal Center Bottom.png";
        this.horizontalCenterTopIcon = "icons/Horizontal Center Top.png";
        this.leftCenterIcon = "icons/Left Center.png";
        this.leftVerticalCenterIcon = "icons/Left Vertical Center Middle.png";
        this.centerIcon = "icons/Center.png";
        this.rightVerticalCenterIcon = "icons/Right Vertical Center Middle.png";
        this.rightCenterIcon = "icons/Right Center.png";

        // forth row
        this.leftBottomIcon = "icons/Left Middle Bottom.png";
        this.leftCenterIcon = "icons/Left Center.png";
        this.rightBottomIcon = "icons/Right Middle Bottom.png";

        // bottom row
        this.bottomLeftIcon = "icons/Bottom Left.png";
        this.bottomLeftMiddleIcon = "icons/Bottom Left Middle.png";
        this.bottomCenterIcon = "icons/Bottom Center.png";
        this.bottomRightMiddleIcon = "icons/Bottom Right Middle.png";
        this.bottomRightIcon = "icons/Bottom Right.png";

        // footer / constraints row
        this.centerConstraintsIcon = "icons/Constrain Center.png";
        this.horizontalConstraintsIcon = "icons/Constrain Horizontally.png";
        this.verticalConstraintsIcon = "icons/Constrain Vertically.png";

        this.exitIcon = "icons/Exit Icon.png";
        this.switchViewIcon = "icons/Switch View Icon.png";
        this.closeIcon = "icons/Close Icon.png";
        this.closeToolTip = "Click here to close this dialog";
        
        this.zeroPoint = {x: 0, y: 0};
        this.border = "0px solid #abababs";

        this.lastLabelTooltip = "Click here to fill with last value";
        this.lastLabelBorder = "0px solid #b8b8b8";
        this.lastLabelFontSize = 11;
        this.lastBorderRadius = "0";
        this.lastLabelColor = "#b8b8b8";
        this.lastMargin = 0;
        this.lastCursor = "pointer";

        this.onsubmit = function(event) {
            event.preventDefault();
        }

        this.closeDialogHandler = function(event) {
            
            if (event.shiftKey) {
                showBackDialog();
            }
            else {
                saveLastValues();
                closeDialog(model.dialog);
            }
        }
    }
}

class Types {
    static get AREA_TEXT () { return "AreaText"; }
    static get ARTBOARD () { return "Artboard"; }
    static get BOOLEAN_GROUP () { return "BooleanGroup"; }
    static get ELLIPSE () { return "Ellipse"; }
    static get GRAPHICS_NODE () { return "GraphicsNode"; }
    static get TOTAL_GROUPS () { return "TotalGroups"; }
    static get GROUP () { return "Group"; }
    static get LINE () { return "Line"; }
    static get LINKED_GRAPHIC () { return "LinkedGraphic"; }
    static get PATH () { return "Path"; }
    static get POINT_TEXT () { return "PointText"; }
    static get RECTANGLE () { return "Rectangle"; }
    static get REPEAT_GRID () { return "RepeatGrid"; }
    static get ROOT_NODE () { return "RootNode"; }
    static get SCENE_NODE () { return "SceneNode"; }
    static get SYMBOL_INSTANCE () { return "SymbolInstance"; }
    static get TEXT() { return "Text"; }
}

class AlertForm {
    constructor() {
      this.header = null;
      this.message = null;
    }
  }

var model = new Model();
var showCenterValues = false;

DebugSettings.logFunctionName = true;

var alertForm = new AlertForm();
let alertDialog =
h("dialog", {name:"Alert"},
   h("form", { method:"dialog", style: { width: getPx(model.dialogWidth) }, },
	 alertForm.header = h("h2", "Header"),
	 h("label", { class: "row" },
		alertForm.message = h("span", { }, "Message"),
	 ),
	 h("footer",
		h("button", { uxpVariant: "cta", type: "submit", onclick(e) { closeDialog(alertDialog) } }, "OK")
	 )
   )
)

model.dialog =
    h("dialog", { style: { margin: getPx(6), marginBottom: getPx(0), padding: getPx(0) } },
        model.frontView = h("form", { method:"dialog", 
            style: { width: getPx(model.dialogWidth), margin: getPx(0), padding: getPx(0), title: model.closeToolTip }, 
            onsubmit: model.onsubmit },

            h("label", { class: "row", display: "none"},
              h("div", { style: { flex:"1", overflow: "visible", border: "0px solid gray", padding: getPx(0)} }, 
                   model.messageParagraph = h("p", { textContent:"", style: {  opacity: 1 } } )
              )
            ),

            h("div", { class: "row", style: { border: "1px solid #D3D3D3", display: "block" } },

                /** TOP ROW */
                h("div", { class: "row", style: { border:model.border, alignItems: "flex-start", height: getPx(model.rowHeight) } },
                    h("img", {  title: "Top Left", src: model.topLeftIcon, width: getPx(model.iconWidth), height: getPx(model.iconHeight), 
                        onclick(e) { topLeftHandler(e);  } }),
                    h("span", { style: { flex:"1" } }, ""),
                    h("img", { title: "Top", src: model.topLeftMiddleIcon, width: getPx(model.iconWidth),  
                        height: getPx(model.iconHeight - ((model.iconHeight/model.iconFactor)/4)), 
                        onclick(e) { topHandler(e) } }, "Top"),
                    h("span", { style: { flex:"1" } }, ""),
                    h("img", { title: "Top Center", src: model.topCenterIcon, width: getPx(model.iconWidth), height: getPx(model.iconHeight), 
                        onclick(e) { topCenterHandler(e) } }, "Top Center"),
                    h("span", { style: { flex:"1" } }, ""),
                    h("img", { title: "Top", src: model.topRightMiddleIcon, width: getPx(model.iconWidth),  
                        height: getPx(model.iconHeight - ((model.iconHeight/model.iconFactor)/4)), 
                        onclick(e) { topHandler(e) } }, "Top"),
                    h("span", { style: { flex:"1" } }, ""),
                    h("img", { title: "Top Right", src: model.topRightIcon, width: getPx(model.iconWidth), height: getPx(model.iconHeight), 
                        onclick(e) { topRightHandler(e) } }, "Top Right"),
                ),

                /** SECOND ROW */
                h("div", { class: "row", style: { flex:"1", border:model.border, alignItems: "center", height: getPx(model.rowHeight) } },
                    h("img", { uxpVariant: "primary", title: "Left", src: model.leftTopIcon, width: getPx(model.iconWidth), height: getPx(model.iconHeight), 
                        onclick(e) { leftHandler(e) } }, "Left"),
                    h("span", { style: { flex:"1" },  }, ""),
                    h("img", { uxpVariant: "primary", title: "Horizontal Center", src: model.horizontalCenterTopIcon, width: getPx(model.iconWidth/model.iconFactor), height: getPx(model.iconHeight), 
                        onclick(e) { centerHorizontallyHandler(e) } }, "Horizontal Center"),
                    h("span", { style: { flex:"1" },  }, ""),
                    h("img", { uxpVariant: "primary", title: "Right", src: model.rightTopIcon, width: getPx(model.iconWidth), height: getPx(model.iconHeight), 
                        onclick(e) { rightHandler(e) } }, "Right"),
                ),

                /** MIDDLE ROW */
                h("div", { class: "row", style: {flex:"1", border:model.border, height: getPx(model.rowHeight)} },
                    h("img", { uxpVariant: "primary", title: "Center Left", src: model.leftCenterIcon, width: getPx(model.iconWidth), height: getPx(model.iconHeight), 
                        onclick(e) { centerLeftHandler(e) } }, "Center Left"),
                    h("span", { style: { flex:"1" } }, ""),
                    h("img", { uxpVariant: "primary", title: "Vertical Center", src: model.leftVerticalCenterIcon, width: getPx(model.iconWidth), height: getPx(model.iconHeight/model.iconFactor),
                        marginTop: getPx(((model.iconHeight-model.iconHeight/model.iconFactor)/2)), 
                        onclick(e) { centerVerticallyHandler(e) } }, "Vertical Center"),
                    h("span", { style: { flex:"1" } }, ""),
                    h("img", { uxpVariant: "primary", title: "Center in the container", src: model.centerIcon, width: getPx(model.iconWidth), height: getPx(model.iconHeight), 
                        onclick(e) { centerHandler(e) } }, "Center"),
                    h("span", { style: { flex:"1" } }, ""),
                    h("img", { uxpVariant: "primary", title: "Vertical Center", src: model.rightVerticalCenterIcon, width: getPx(model.iconWidth), height: getPx(model.iconHeight/model.iconFactor), 
                        marginTop: getPx(((model.iconHeight-model.iconHeight/model.iconFactor)/2)),
                        onclick(e) { centerVerticallyHandler(e) } }, "Vertical Center"),
                    h("span", { style: { flex:"1" } }, ""),
                    h("img", { uxpVariant: "primary", title: "Center Right", src: model.rightCenterIcon, width: getPx(model.iconWidth), height: getPx(model.iconHeight), 
                        onclick(e) { centerRightHandler(e) } }, "Center Right"),
                ),

                /** FORTH ROW */
                h("div", { class: "row", style: {flex:"1", border:model.border, height: getPx(model.rowHeight) } },
                    h("img", { uxpVariant: "primary", title: "Left", src: model.leftBottomIcon, width: getPx(model.iconWidth), height: getPx(model.iconHeight), 
                        onclick(e) { leftHandler(e) } }, 
                    "Left"),
                    h("span", { style: { flex:"1" },  }, ""),
                    h("img", { uxpVariant: "primary", title: "Horizontal Center", src: model.horizontalCenterBottomIcon, width: getPx(model.iconWidth/model.iconFactor), height: getPx(model.iconHeight), 
                        onclick(e) { centerHorizontallyHandler(e) } }, 
                    "Horizontal Center"),
                    h("span", { style: { flex:"1" },  }, ""),
                    h("img", { uxpVariant: "primary", title: "Right", src: model.rightBottomIcon, width: getPx(model.iconWidth), height: getPx(model.iconHeight), 
                        onclick(e) { rightHandler(e) } }, 
                    "Right"),
                ),

                /** BOTTOM ROW */
                h("div", { class: "row", style: { flex:"1", alignItems:"flex-end", border: model.border, height: getPx(model.rowHeight)  } },
                    h("img", { uxpVariant: "primary", title: "Bottom Left", src: model.bottomLeftIcon, width: getPx(model.iconWidth), height: getPx(model.iconHeight), 
                        onclick(e) { bottomLeftHandler(e) } }, "Bottom Left"),
                    h("span", { style: { flex:"1" } }, ""),
                    h("img", { uxpVariant: "primary", title: "Bottom", src: model.bottomLeftMiddleIcon, width: getPx(model.iconWidth), 
                        height: getPx(model.iconHeight - ((model.iconHeight/model.iconFactor)/4)), 
                        marginTop: getPx(((model.iconHeight-model.iconHeight/model.iconFactor)/2)),
                        onclick(e) { bottomHandler(e) } }, "Bottom"),
                    h("span", { style: { flex:"1" } }, ""),
                    h("img", { uxpVariant: "primary", title: "Bottom Center", src: model.bottomCenterIcon, width: getPx(model.iconWidth), height: getPx(model.iconHeight), 
                        onclick(e) { bottomCenterHandler(e) } }, "Bottom Center"),
                    h("span", { style: { flex:"1" } }, ""),
                    h("img", { uxpVariant: "primary", title: "Bottom", src: model.bottomRightMiddleIcon, width: getPx(model.iconWidth), 
                        height: getPx(model.iconHeight - ((model.iconHeight/model.iconFactor)/4)), 
                        marginTop: getPx(((model.iconHeight-model.iconHeight/model.iconFactor)/2)),
                        onclick(e) { bottomHandler(e) } }, "Bottom"),
                    h("span", { style: { flex:"1" } }, ""),
                    h("img", { uxpVariant: "primary", title: "Bottom Right", src: model.bottomRightIcon, width: getPx(model.iconWidth), height: getPx(model.iconHeight), 
                        onclick(e) { bottomRightHandler(e) } }, "Bottom Right")
                ),
            ),
            
            /** FOOTER ROW */
            h("div", { class: "row", style: { width:"100%", alignItems:"center", justifyContent: "space-between", height: getPx(model.rowHeight), 
                margin: getPx(0), padding: getPx(0), paddingTop: getPx(6), border: "0px solid black" } },

                h("img", { uxpVariant: "primary", title: "Exit", src: model.exitIcon, width: getPx(model.footerIconWidth), height: getPx(model.footerIconHeight), 
                    style: { marginRight: getPx(0) },
                    onclick(e) { model.closeDialogHandler(e) } }, "Exit"),
                h("img", { uxpVariant: "primary", title: "Back", src: model.switchViewIcon, width: getPx(model.footerIconWidth), height: getPx(model.footerIconHeight), 
                    style: { marginRight: getPx(0) },
                    onclick(e) { showBackDialog() } }, "Back"),
                h("img", { uxpVariant: "primary", title: "Anchor to all sides", src: model.centerConstraintsIcon, width: getPx(model.footerIconWidth), height: getPx(model.footerIconHeight), 
                    style: { marginRight: getPx(0) },
                    onclick(e) { anchorToEdgesHandler(e) } }, "Constrain Center"),
                h("img", { uxpVariant: "primary", title: "Anchor to top and bottom", src: model.verticalConstraintsIcon, width: getPx(model.footerIconWidth), height: getPx(model.footerIconHeight), 
                    style: { marginRight: getPx(0) },
                    onclick(e) { anchorToVerticalEdgesHandler(e) } }, "Constrain Vertically"),
                h("img", { uxpVariant: "primary", title: "Anchor to left and right", src: model.horizontalConstraintsIcon, width: getPx(model.footerIconWidth), height: getPx(model.footerIconHeight), 
                    style: { marginRight: getPx(0) },
                    onclick(e) { anchorToHorizontalEdgesHandler(e) } }, "Constrain Horizontally"),
                model.marginInput = h("input", { type: "text", placeholder: "Edge", uxpQuiet: true, 
                    style: { width: getPx(22), maxWidth:getPx(22), minWidth: getPx(0), align: "center", textAlign:"center", fontSize: getPx(9), marginRight: getPx(0) },
                    onchange(e) { marginInputChangeHandler(e) },
                    onkeydown(e) { marginInputKeypress(e) } } ),
                h("img", { uxpVariant: "primary", title: "Anchor to left and right", src: model.horizontalConstraintsIcon, width: getPx(model.footerIconWidth), height: getPx(model.footerIconHeight), 
                    style: { marginRight: getPx(0) },
                    onclick(e) { anchorToHorizontalEdgesHandler(e) } }, "Constrain Horizontally"),
                h("img", { uxpVariant: "primary", title: "Anchor to top and bottom", src: model.verticalConstraintsIcon, width: getPx(model.footerIconWidth), height: getPx(model.footerIconHeight), 
                    style: { marginRight: getPx(0) },
                    onclick(e) { anchorToVerticalEdgesHandler(e) } }, "Constrain Vertically"),
                h("img", { uxpVariant: "primary", title: "Anchor to all sides", src: model.centerConstraintsIcon, width: getPx(model.footerIconWidth), height: getPx(model.footerIconHeight), 
                    style: { marginRight: getPx(0) },
                    onclick(e) { anchorToEdgesHandler(e) } }, "Constrain Center"),
                h("img", { uxpVariant: "primary", title: "Back", src: model.switchViewIcon, width: getPx(model.footerIconWidth), height: getPx(model.footerIconHeight), 
                    style: { marginRight: getPx(0) },
                    onclick(e) { showBackDialog() } }, "Back"),
                h("img", { uxpVariant: "primary", title: "Exit", src: model.exitIcon, width: getPx(model.footerIconWidth), height: getPx(model.footerIconHeight), 
                    style: { marginRight: getPx(0) },
                    onclick(e) { model.closeDialogHandler(e) } }, "Exit")

            ),
        )
    )

model.backView = 
h("form", { method:"dialog", style: { width: getPx(model.dialogWidth), margin: getPx(0), padding: getPx(12) }, 
    onsubmit: model.onsubmit },

    h("div", { class: "row", style: { border: "0px solid #D3D3D3", display: "block", minHeight:getPx(195) } },

        h("label", { class: "row", style: { marginLeft: getPx(0), alignItems:"center", height: getPx(model.backRowHeight) } },
            h("span", { class: "row", style: { marginLeft: 0, fontSize: getPx(model.lastLabelFontSize), width: getPx(model.backViewLabelWidth)} }, "Left"),
            model.leftInput = h("input", { type: "text", placeholder: "Left", uxpQuiet: true, 
                style: { textAlign: "right", width: getPx(model.backInputWidth), minWidth: getPx(0), marginRight: getPx(model.footerMargin) },
                onchange(e) { leftInputChangeHandler() } } ),
            model.lastLeftLabel = h("span", { class: "row", style: { fontSize: getPx(model.lastLabelFontSize), textAlign: "right", 
                borderRadius: model.lastBorderRadius, width: getPx(model.lastLabelWidth), title: model.lastLabelTooltip, border: model.lastLabelBorder, color: model.lastLabelColor, cursor: model.lastCursor},
                onclick(e) { lastLabelClicked(e) } }, ""),
        ),

        h("label", { class: "row", height: getPx(model.backRowHeight), style: { marginLeft: getPx(0), alignItems: "center" } },
            h("span", { class: "row", style: { marginLeft: getPx(0), fontSize: getPx(model.lastLabelFontSize), width: getPx(model.backViewLabelWidth)} }, "Top"),
            model.topInput = h("input", { type: "text", placeholder: "Top", uxpQuiet: true, 
                style: { align: "right", textAlign: "end", marginRight: model.footerMargin, width: getPx(model.backInputWidth), minWidth: getPx(0)},
                onchange(e) { topInputChangeHandler() } } ),
            model.lastTopLabel = h("span", { class: "row", style: { width: getPx(model.lastLabelWidth), title: model.lastLabelTooltip, border: model.lastLabelBorder, 
                color: model.lastLabelColor, fontSize: getPx(model.lastLabelFontSize), textAlign: "right", borderRadius: model.lastBorderRadius, cursor: model.lastCursor},
                onclick(e) { lastLabelClicked(e) } }, ""),
        ),

        h("label", { class: "row", style: { height: getPx(model.backRowHeight), marginLeft: getPx(0), alignItems: "center" } },
            h("span", { class: "row", style: { marginLeft: getPx(0), fontSize: getPx(model.lastLabelFontSize), width: getPx(model.backViewLabelWidth)} }, "Bottom"),
            model.bottomInput = h("input", { type: "text", placeholder: "Bottom", uxpQuiet: true, 
                style: { align: "center", textAlign: "center", marginRight: getPx(model.footerMargin), width: getPx(model.backInputWidth), minWidth: getPx(0)},
                onchange(e) { bottomInputChangeHandler() } } ),
            model.lastBottomLabel = h("span", { class: "row", style: { fontSize: getPx(model.lastLabelFontSize), textAlign: "right", borderRadius: model.lastBorderRadius,
                width: getPx(model.lastLabelWidth), title: model.lastLabelTooltip, border: model.lastLabelBorder, color: model.lastLabelColor, cursor: model.lastCursor},
                onclick(e) { lastLabelClicked(e) } }, ""),
        ),

        h("label", { class: "row", style: { height: getPx(model.backRowHeight), marginLeft: getPx(0), alignItems: "center" } },
            h("span", { class: "row", style: { marginLeft: getPx(0), fontSize: getPx(model.lastLabelFontSize), width: getPx(model.backViewLabelWidth)} }, "Right"),
            model.rightInput = h("input", { type: "text", placeholder: "Right", uxpQuiet: true, 
                style: { width: getPx(model.backInputWidth), minWidth: getPx(0), 
                align: "center", textAlign: "center", marginRight: model.footerMargin},
                onchange(e) { rightInputChangeHandler() } } ),
            model.lastRightLabel = h("span", { class: "row", 
                style: { fontSize: getPx(model.lastLabelFontSize), textAlign: "right", height:getPx(20), width: getPx(model.lastLabelWidth), 
                title: model.lastLabelTooltip, border: model.lastLabelBorder, color: model.lastLabelColor, cursor: model.lastCursor},
                onclick(e) { lastLabelClicked(e) } }, ""),
        ),

        h("label", { class: "row", style: { height: getPx(model.backRowHeight), marginLeft: getPx(0), alignItems:"center" } },
            h("span", { class: "row", style: { marginLeft: getPx(0), fontSize: getPx(model.lastLabelFontSize), width: getPx(model.backViewLabelWidth)} }, "Horizontal Center"),
            model.horizontalInput = h("input", { type: "text", placeholder: "Horizontal Center", uxpQuiet: true, 
                style: { width: getPx(model.backInputWidth), minWidth: getPx(0), marginRight: getPx(model.footerMargin), align: "center", textAlign: "center"},
                onchange(e) { horizontalInputChangeHandler() } } ),
            model.lastHorizontalLabel = h("span", { class: "row", style: { fontSize: getPx(model.lastLabelFontSize), textAlign: "right", borderRadius: model.lastBorderRadius,
                width: getPx(model.lastLabelWidth), title: model.lastLabelTooltip, border: model.lastLabelBorder, color: model.lastLabelColor, cursor: model.lastCursor},
                onclick(e) { lastLabelClicked(e) } }, ""),
        ),

        h("label", { class: "row", style: { height: getPx(model.backRowHeight), marginLeft: getPx(0), alignItems:"center" } },
            h("span", { class: "row", style: { marginLeft: getPx(0), fontSize: getPx(model.lastLabelFontSize), width: getPx(model.backViewLabelWidth)} }, "Vertical Center"),
            model.verticalInput = h("input", { type: "text", placeholder: "Vertical Center", uxpQuiet: true, style: { width: getPx(model.backInputWidth), minWidth: getPx(0), 
                align: "center", textAlign: "center", marginRight: getPx(model.footerMargin)},
                onchange(e) { verticalInputChangeHandler() } } ),
            model.lastVerticalLabel = h("span", { class: "row", style: { fontSize: getPx(model.lastLabelFontSize), textAlign: "right", borderRadius: model.lastBorderRadius,
                width: getPx(model.lastLabelWidth), title: model.lastLabelTooltip, border: model.lastLabelBorder, color: model.lastLabelColor, cursor: model.lastCursor},
                onclick(e) { lastLabelClicked(e) } }, ""),
        ),

    ),

    /** FOOTER ROW */
    h("div", { class: "row", style: { alignItems:"center", margin: getPx(0), padding: getPx(0), paddingTop: getPx(0), border: "0px solid black" } },
    
        h("img", { uxpVariant: "primary", title: "Exit", src: model.exitIcon, width: getPx(model.footerIconWidth), height: getPx(model.footerIconHeight), 
            style: { marginRight: getPx(8) },
            onclick(e) { model.closeDialogHandler(e) } }, "Exit"),
        h("img", { uxpVariant: "primary", title: "Front", src: model.switchViewIcon, width: getPx(model.footerIconWidth), height: getPx(model.footerIconHeight), 
            style: { marginRight: getPx(0) },
            onclick(e) { showMainDialog() } }, "Front"),
        h("span", { style: { flex:"1" } }, ""),
        h("img", { title: "Horizontal Center", src: model.horizontalCenterBottomIcon, 
            width: getPx(model.iconWidth/model.iconFactor), height: getPx(model.iconHeight), 
            style: {display: "none"},
            onclick(e) { centerHorizontallyHandler(e) } }, "Horizontal Center"),
        h("span", { style: { flex:"1" } }, ""),
        h("img", {  title: "Vertical Center", src: model.leftVerticalCenterIcon, width: getPx(model.iconWidth), height: getPx(model.iconHeight/model.iconFactor),
            style: { display: "none", marginTop: getPx(((model.iconHeight-model.iconHeight/model.iconFactor)/2)) }, 
            onclick(e) { centerVerticallyHandler(e) } }, "Vertical Center"),
        h("span", { style: { flex:"1" } }, ""),
        h("img", { uxpVariant: "primary", title: "Front", src: model.switchViewIcon, width: getPx(model.footerIconWidth), height: getPx(model.footerIconHeight), 
            style: { marginRight: getPx(8) },
            onclick(e) { showMainDialog() } }, "Front"),
        h("img", { uxpVariant: "primary", title: "Exit", src: model.exitIcon, width: getPx(model.footerIconWidth), height: getPx(model.footerIconHeight), 
            style: { marginRight: getPx(0) },
            onclick(e) { model.closeDialogHandler(e) } }, "Exit")
    ),
)

function showBackDialog() {
    model.lastPositionSet = null;
    model.dialog.removeChild(model.frontView);
    model.dialog.appendChild(model.backView);
    setUIControls();
}

function showMainDialog() {
    saveLastValues();
    model.lastPositionSet = null;
    model.dialog.appendChild(model.frontView);
    model.dialog.removeChild(model.backView);
}

async function openDialog(selection, documentRoot) {
    document.body.appendChild(model.dialog);
    model.selection = selection;
    model.documentRoot = documentRoot;

    DebugSettings.outlineOnClick(model.dialog);

    var selectedItems = model.selection.items;
    var numberOfItems = selectedItems ? selectedItems.length : 0;
    
    if (numberOfItems==0) {
        alert = await showAlertDialog("Select an item to continue", "No items selected");
        return alert;
    }
    
    setUIControls();
    setLastValuesLabels();

    const cssTemplateString = `img { cursor: pointer;} img:hover {outline:.5px dashed black} img {outline:0}`;
	const styleTag = document.createElement("style");
	styleTag.innerHTML = cssTemplateString;
	document.head.insertAdjacentElement('beforeend', styleTag);

    var alert = await model.dialog.showModal();
}

function setUIControls() {
    var selectedItems = model.selection.items;
    var numberOfItems = selectedItems ? selectedItems.length : 0;
    var selectedItem = numberOfItems ? selectedItems[0] : null;
    var localCenterPoint = selectedItem.localCenterPoint;
    

    var documentRoot = model.documentRoot;
    var savedMargin = 20;


    // get saved data
    if (documentRoot && documentRoot.pluginData) {

        try {
            var pluginData = JSON.parse(documentRoot.pluginData);
            
            if (pluginData && pluginData.margin!=null) {
                savedMargin = pluginData.margin;
            }

        }
        catch(error) {
            log(error)
        }
    }

    if (model.marginInput) {
        model.marginInput.value = savedMargin;
    }

    if (model.nameLabel) {
        model.nameLabel.textContent = getType(selectedItem);
    }

    updateFormValue();

    return;
    model.messageParagraph.textContent = "";
    model.messageParagraph.style.border = "none"; // "1px solid #bcbcbc";
    model.rows = {};

    
    addRow("BOUNDS", null, {isHeader:true, x:"X", y:"Y", width:"WIDTH", height:"HEIGHT"}, true, false);

    var localX = selectedItem.parent ? selectedItem.globalBounds.x - selectedItem.parent.globalBounds.x : 0;
    var localY = selectedItem.parent ? selectedItem.globalBounds.y - selectedItem.parent.globalBounds.y : 0;
    addRow("Position in Group", "(sceneNode.globalBounds.x - sceneNode.parent.globalBounds.x)", {x: localX, y: localY});
    addRow("Bounds in Parent", "(sceneNode.boundsInParent)", selectedItem.boundsInParent);
    addRow("Top Left in Parent", "(sceneNode.topLeftInParent)", selectedItem.topLeftInParent);
    addRow("Global Bounds", "(sceneNode.globalBounds)", selectedItem.globalBounds);
    addRow("Global Draw Bounds", "(sceneNode.globalDrawBounds)", selectedItem.globalDrawBounds);
    
    if (showCenterValues) {
        var centerX = selectedItem.parent.globalBounds.width/2 - selectedItem.globalBounds.width/2;
        var centerY = selectedItem.parent.globalBounds.height/2 - selectedItem.globalBounds.height/2;
        addRow("Center in Group", "(sceneNode.parent.globalBounds.width/2 - sceneNode.globalBounds.width/2)", {x: centerX, y: centerY});
        var computedCenterX = selectedItem.boundsInParent.x + selectedItem.boundsInParent.width/2;
        var computedCenterY = selectedItem.boundsInParent.y + selectedItem.boundsInParent.height/2;
        addRow("Center in Group", "(sceneNode.boundsInParent.x + selectedItem.boundsInParent.width/2)", {x: computedCenterX, y: computedCenterY});
        addRow("Delta to Center Point", "(sceneNode.localCenterPoint)", localCenterPoint);
    }
    
}

/**
 * 
 * @param {String} name
 */
function addRow(name, tooltip, bounds, firstRow = false, lastRow = false) {
	var displayName= name;
	
	try {
		var nameLabel;
		var icon;
		var borderWeight = 0;
		var topBorderWeight = firstRow ? 1 : 0;
		var bottomBorderWeight = lastRow ? 0 : 1;
		var textMarginTop = 0;//"-1.2em";
		var title;
		var borderBottomColor = "";
		var iconSize = 10;
		var rowHeight = 24;
		var marginLeftOffset = 0;
        var fontSize = 10.5;
        var showIcon = false;
        var iconPath = "";
        var labelWidth = 180;
        var valueWidth = 60;
        var headerBackgroundColor = "transparent";
        var headerTextColor = "#585858";
        var headerFontWeight = "bold";
        var valueAlignment = "right";
        var fixedDecimalPlaces = 1;

        var header = bounds.isHeader;
        var xValue = header ? bounds.x : toFixedNumber(bounds.x, fixedDecimalPlaces);
        var yValue = header ? bounds.y : toFixedNumber(bounds.y, fixedDecimalPlaces);
        var widthValue = header ? bounds.width : toFixedNumber(bounds.width, fixedDecimalPlaces);
        var heightValue = header ? bounds.height : toFixedNumber(bounds.height, fixedDecimalPlaces);

        "width" in bounds ? 0 : widthValue = "";
        "height" in bounds ? 0 : heightValue = "";

        borderBottomColor = header ? "rgba(0, 0, 0, .6)" : "rgba(0, 0, 0, .1)";
        
        if(tooltip==null) tooltip = "";
        
        var style = {
            fontSize: getPx(fontSize),
            border: borderWeight + "px solid black", 
            width: getPx(valueWidth), 
            whiteSpace: "nowrap",
			overflow: "hidden", 
            textOverflow: "ellipsis",
            marginTop : getPx(textMarginTop),
            textAlign: valueAlignment
        }

		var row =
		    h("div", {
                class: "row", 
                title: title,
                style: {
                    height: getPx(rowHeight), 
                    backgroundColor : header ? headerBackgroundColor : "transparent",
                    fontSize: getPx(fontSize),
                    borderTop: topBorderWeight + "px solid " + borderBottomColor, 
                    borderBottom: bottomBorderWeight + "px solid " + borderBottomColor, 
                    alignItems: "center",
                    color : header ? headerTextColor : "#585858",
                    fontWeight : header ? headerFontWeight : "normal",
                }, 
                onclick(e) { } 
            },
			
			h("span", { style: {
                width: getPx(0),  
                display: "none", 
                border: borderWeight + "px solid black"} 
            }),

			icon = h("img", {
				display: showIcon ? "block" : "none", 
				title: name, 
				src: iconPath, 
				style: {
                    width: getPx(iconSize), 
                    height: getPx(iconSize), 
                    marginRight: getPx(5),
					border: borderWeight + "px solid green"} 
				}
			),

			nameLabel = h("span", { 
                title: tooltip,
				style: {
                    marginLeft: marginLeftOffset, 
                    width: getPx(labelWidth),
                    fontSize: fontSize,
					whiteSpace: "nowrap", 
					overflow: "hidden", 
					textOverflow: "ellipsis", 
					marginTop: getPx(textMarginTop), 
					border: borderWeight + "px solid black"}
				}, 
				displayName
			),

			h("span", { style: style, title: bounds.x + "" }, xValue),
			h("span", { style: style, title: bounds.y + "" }, yValue),
			h("span", { style: style, title: widthValue!="" ? bounds.width + "" : "" }, widthValue),
			h("span", { style: style, title: heightValue!="" ? bounds.height + "" : "" }, heightValue)

		)
		
		model.messageParagraph.appendChild(row);
	}
	catch (error) {
		log(error.stack);
    }
    
    row.name = name;
    row.icon = icon;
    row.nameLabel = nameLabel;
    row.bounds = bounds;

    model.rows[name] = row;

	return row;
}

function updateFormValue() {
    var selectedItems = model.selection.items;
    var numberOfItems = selectedItems ? selectedItems.length : 0;
    var selectedItem = numberOfItems ? selectedItems[0] : null;
    var bounds = getBoundsInParent(selectedItem);
    var places = 1;

    model.leftInput.value = getShortNumber(bounds.x, places);
    model.topInput.value = getShortNumber(bounds.y, places);
    model.bottomInput.value = getShortNumber(bounds.bottom, places);
    model.rightInput.value = getShortNumber(bounds.right, places);
    model.verticalInput.value = getShortNumber(bounds.centerDeltaY, places);
    model.horizontalInput.value = getShortNumber(bounds.centerDeltaX, places);
}

function saveLastValues() {
    var selectedItems = model.selection.items;
    var numberOfItems = selectedItems ? selectedItems.length : 0;
    /** @type {SceneNode} */
    var selectedItem = null;
    var bounds = null;

    for(var i=0;i<numberOfItems;i++) {
        selectedItem = selectedItems[i];

        bounds = getBoundsInParent(selectedItem);

        model.lastLeftValue = bounds.x;
        model.lastTopValue = bounds.y;
        model.lastBottomValue = bounds.bottom;
        model.lastRightValue = bounds.right;
        model.lastHorizontalValue = bounds.centerDeltaX;
        model.lastVerticalValue = bounds.centerDeltaY;

        break;
    }
}

function setLastValuesLabels() {
    var places = 1;

    if (model.lastLeftValue!=null) {
        model.lastLeftLabel.textContent = "" + getShortNumber(model.lastLeftValue, places);
        model.lastTopLabel.textContent = "" + getShortNumber(model.lastTopValue, places);
        model.lastBottomLabel.textContent = "" + getShortNumber(model.lastBottomValue, places);
        model.lastRightLabel.textContent = "" + getShortNumber(model.lastRightValue, places);
        model.lastHorizontalLabel.textContent = "" + getShortNumber(model.lastHorizontalValue, places);
        model.lastVerticalLabel.textContent = "" + getShortNumber(model.lastVerticalValue, places);
    }
    else {
        // fill with current values
    }

}


/**************************************************
* POSITIONING 
**************************************************/

/**
 * Set last method call for repeating last action when enter is pressed
 * @param {Function} method 
 * @param {MouseEvent} event 
 **/
function lastCall(method = null, event = null) {
    model.lastPositionSet = method;
    model.event = event;
}

// Clock wise from top left

function topLeftHandler(event = null) {
    var selectedItems = model.selection.items;
    var margin = getMargin(event);
    topLeft(selectedItems, margin);
    lastCall(topLeftHandler, event);
    reselectItems();
}

function topHandler(event = null) {
    var selectedItems = model.selection.items;
    var margin = getMargin(event);
    top(selectedItems, margin);
    lastCall(topHandler, event);
    reselectItems();
}

function topCenterHandler(event = null) {
    var selectedItems = model.selection.items;
    var margin = getMargin(event);
    topCenter(selectedItems, margin);
    lastCall(topCenterHandler, event);
    reselectItems();
}

function topRightHandler(event = null) {
    var selectedItems = model.selection.items;
    var margin = getMargin(event);
    topRight(selectedItems, margin);
    lastCall(topRightHandler, event);
    reselectItems();
}

function rightHandler(event = null) {
    var selectedItems = model.selection.items;
    var margin = getMargin(event);
    right(selectedItems, margin);
    lastCall(rightHandler, event);
    reselectItems();
}

function centerRightHandler(event = null) {
    var selectedItems = model.selection.items;
    var margin = getMargin(event);
    centerRight(selectedItems, margin);
    lastCall(centerRightHandler, event);
    reselectItems();
}

function bottomRightHandler(event = null) {
    var selectedItems = model.selection.items;
    var margin = getMargin(event);
    bottomRight(selectedItems, margin);
    lastCall(bottomRightHandler, event);
    reselectItems();
}

function bottomHandler(event = null) { // giggidy
    var selectedItems = model.selection.items;
    var margin = getMargin(event);
    bottom(selectedItems, margin);
    lastCall(bottomHandler, event);
    reselectItems();
}

function bottomCenterHandler(event = null) {
    var selectedItems = model.selection.items;
    var margin = getMargin(event);
    bottomCenter(selectedItems, margin);
    lastCall(bottomCenterHandler, event);
    reselectItems();
}

function bottomLeftHandler(event = null) {
    var selectedItems = model.selection.items;
    var margin = getMargin(event);
    bottomLeft(selectedItems, margin);
    lastCall(bottomLeftHandler, event);
    reselectItems();
}

function leftHandler(event = null) {
    var selectedItems = model.selection.items;
    var margin = getMargin(event);
    left(selectedItems, margin);
    lastCall(leftHandler, event);
    reselectItems();
}

function centerLeftHandler(event = null) {
    var selectedItems = model.selection.items;
    var margin = getMargin(event);
    centerLeft(selectedItems, margin);
    lastCall(centerLeftHandler, event);
    reselectItems();
}


/**************************************************
 * CONSTRAINTS
 **************************************************/

function anchorToEdgesHandler(event = null) {
    var selectedItems = model.selection.items;
    var margin = getMargin(event);
    anchorToEdges(selectedItems, margin);
    lastCall(anchorToEdgesHandler, event);
    reselectItems();
}

function anchorToVerticalEdgesHandler(event = null) {
    var selectedItems = model.selection.items;
    var margin = getMargin(event);
    anchorToVerticalEdges(selectedItems, margin);
    lastCall(anchorToVerticalEdgesHandler, event);
    reselectItems();
}

function anchorToHorizontalEdgesHandler(event = null) {
    var selectedItems = model.selection.items;
    var margin = getMargin(event);
    anchorToHorizontalEdges(selectedItems, margin);
    lastCall(anchorToHorizontalEdgesHandler, event);
    reselectItems();
}

/**************************************************
 * CENTERING 
 **************************************************/

function centerHandler(event = null) {
    var selectedItems = model.selection.items;
    center(selectedItems);
    lastCall(centerHandler, event);
    reselectItems();
}

function centerHorizontallyHandler(event = null) {
    var selectedItems = model.selection.items;
    var margin = getMargin(event);
    centerHorizontally(selectedItems, margin);
    lastCall(centerHorizontallyHandler, event);
    reselectItems();
}

function centerVerticallyHandler(event = null) {
    var selectedItems = model.selection.items;
    var margin = getMargin(event);
    centerVertically(selectedItems, margin);
    lastCall(centerVerticallyHandler, event);
    reselectItems();
}

function reselectItems() {

    try {
        var selection = model.selection;
        var selectedItems = model.selection.items;
        selection.items = [];
        selection.items = selectedItems;
    }
    catch(error) {
        log(error)
    }
}

function getSelectedItems() {

    try {
        var selection = model.selection;
        var selectedItems = model.selection.items;
        return selectedItems;
    }
    catch(error) {
        log(error)
    }
}

/**
 * Returns true if alternative behavior key is used
 * @param {MouseEvent} event 
 */
function isModifier(event) {

    if (event && event.altKey) {
        model.alternativeKey = true;
        return true;
    }
    model.alternativeKey = false;
    return false;
}

/**************************************************
 * FORM HANDLERS 
 **************************************************/

function lastLabelClicked(event) {
    var selectedItems = getSelectedItems();
    var target = event.currentTarget;
    event.preventDefault();
    var valueSet = false;

    if (target==model.lastLeftLabel) {
        left(selectedItems, model.lastLeftValue);
        valueSet = true;
    }
    else if (target==model.lastRightLabel) {
        right(selectedItems, model.lastRightValue);
        valueSet = true;
    }
    else if (target==model.lastBottomLabel) {
        bottom(selectedItems, model.lastBottomValue);
        valueSet = true;
    }
    else if (target==model.lastTopLabel) {
        top(selectedItems, model.lastTopValue);
        valueSet = true;
    }
    else if (target==model.lastHorizontalLabel) {
        centerHorizontally(selectedItems, model.lastHorizontalValue);
        valueSet = true;
    }
    else if (target==model.lastVerticalLabel) {
        centerVertically(selectedItems, model.lastVerticalValue);
        valueSet = true;
    }

    if (valueSet) {
        updateFormValue();
    }

    reselectItems();
}

function leftInputChangeHandler() {
    var seletedItems = getSelectedItems();
    var value = model.leftInput.value;
    value = updateInputValue(model.leftInput);
    left(seletedItems, value);
    updateFormValue();
    reselectItems();
}

function topInputChangeHandler() {
    var seletedItems = getSelectedItems();
    var value = model.topInput.value;
    value = updateInputValue(model.topInput);
    top(seletedItems, value);
    updateFormValue();
    reselectItems();
}

function rightInputChangeHandler() {
    var seletedItems = getSelectedItems();
    var value = model.rightInput.value;
    value = updateInputValue(model.rightInput);
    right(seletedItems, value);
    updateFormValue();
    reselectItems();
}

function bottomInputChangeHandler() {
    var seletedItems = getSelectedItems();
    var value = model.bottomInput.value;
    value = updateInputValue(model.bottomInput);
    bottom(seletedItems, value);
    updateFormValue();
    reselectItems();
}

function horizontalInputChangeHandler() {
    var seletedItems = getSelectedItems();
    var value = model.horizontalInput.value;
    value = updateInputValue(model.horizontalInput);
    centerHorizontally(seletedItems, value);
    updateFormValue();
    reselectItems();
}

function verticalInputChangeHandler() {
    var seletedItems = getSelectedItems();
    var value = updateInputValue(model.verticalInput);
    centerVertically(seletedItems, value);
    updateFormValue();
    reselectItems();
}

function marginInputChangeHandler(event) {
    var value = model.marginInput.value;
    value = getNumberValue(value);
    var keyCode = event.keyCode;
    
    if (!isNaN(value)) {
        if (keyCode==13) {
            if (model.lastPositionSet && model.backView.parentNode==null) {
                model.lastPositionSet(model.event);
            }
    
            var documentRoot = model.documentRoot;
    
            if (documentRoot) {
                documentRoot.pluginData = JSON.stringify({version:model.version, margin:value});
            }
        }
    }
    else {
        model.marginInput.value = "0";
    }
}

/**
 * The input has the same value on keydown
 */
function marginInputKeypress(event) {

    if (event.keyCode==13) {
        marginInputChangeHandler(event);
    }
}

/**************************************************
 * UTILITIES 
 **************************************************/

/**
 * Get a valid number value and update input
 **/
function updateInputValue(input) {
    var value = input.value;
    var numberOfNumbers = (""+ value).length;
    var numberOfNumbersAfter = 0;
    
    value = getNumberValue(value);
    numberOfNumbersAfter = (value+"").length;

    if (numberOfNumbers!=numberOfNumbersAfter) {
        input.value = value;
    }

    if (isNaN(value)|| value===false) {
        return 0;
    }
    return value;
}

/**
 * Get a valid number value
 **/
function getNumberValue(value) {
    var result = parseFloat(value!=null && value!="" && (""+value).replace(/[^0-9.-]/g, ""));

    if (isNaN(result)) {
        return 0;
    }
    return result;
}

function getMargin(event = null) {
    if (isModifier(event)) {
        return 0;
    }
    var value = model.marginInput.value;
    value = parseFloat(value);
    if (isNaN(value)) {
        value = 0;
        model.marginInput.value = 0;
    }
    return value;
}

function toFixedNumber(value, places = 2) {
    return Math.round(value * Math.pow(10, places)) / Math.pow(10, places);
}

/**
 * Get scene node type
 * @param {SceneNode} node 
 */
function getType(node) {
	var type = node && node.constructor && node.constructor.name;

	switch(type) {
	 
		case Types.ELLIPSE:
		   break;
		case Types.RECTANGLE:
		   break;
		case Types.PATH:
		   break;
		case Types.LINE:
		   break;
		case Types.TEXT:
		   break;
		case Types.GROUP:
		   break;
		case Types.BOOLEAN_GROUP:
		   break;
		case Types.REPEAT_GRID:
		   break;
		case Types.SYMBOL_INSTANCE:
		   break;
		case Types.ARTBOARD:
		   break;
		default:
	}

	return type;

}

/**
 * Get value with pixels. Pass in a number 10 and get "10px"
 * @param {Number} value 
 * @returns {String}
 **/
function getPx(value) {
  return value + "px";
}

/**
* Shorthand for creating Elements.
* @param {*} tag The tag name of the element.
* @param {*} [props] Optional props.
* @param {*} children Child elements or strings
*/
function h(tag, props, ...children) {
    let element = document.createElement(tag);
    if (props) {
        if (props.nodeType || typeof props !== "object") {
            children.unshift(props);
        }
        else {
            for (let name in props) {
                let value = props[name];

                if (name == "style") {
                    Object.assign(element.style, value);
                }
                else {
                    element.setAttribute(name, value);
                    element[name] = value;
                }
            }
        }
    }
    for (let child of children) {
        element.appendChild(typeof child === "object" ? child : document.createTextNode(child));
    }
    return element;
}

/**
 * Get value with pixels. Pass in a number 10 and get "10px"
 * @param {Number} value 
 * @returns {String}
 **/
function getPx(value) {
  return value + "px";
}

async function showAlertDialog(message, header) {
  
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

async function closeDialog(dialog, wait = false) {
	var b = false;
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

module.exports = {
    commands: {
        menuCommand: openDialog
    }
}