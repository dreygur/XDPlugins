/**
* Entry point for the plugin
*
* @param {!Selection} selection
*/

const { Artboard, Color, Rectangle, selection } = require("scenegraph")
const { error } = require("./lib/dialogs")

let panel;
var showRuler = false;
let regexp = /^[0-9a-fA-F]+$/;

//Panel Create function
function create() {
    let HTML =
    `<style>
    .break {
        flex-wrap: wrap;
        padding-left: 0;
        margin-left: 0;
    }
    label.row input {
        width: 100%;
        margin-left: 0;
    }
    label {
        display: flex;
    }
    label > div{
        width: 100%;
        font-size: 12px;
        color: #787878;
    }
    .show {
        display: block;
    }
    .hide {
        display: none;
    }
    .help-message{
        font-size: 12px;
        text-align: left;
        padding-left: 0;   
    }
    label.row input:disabled{
        cursor: not-allowed !important;
    }
    </style>
    <form method="dialog" id="main">
    <div class="row break">
    <label class="row">
    <div>Scale: (1 unit = ? px)</div>
    <input type="number" uxp-quiet="true" id="txtV" value="24" placeholder="Scale" />
    </label>                
    </div>
    <div class="row break">
    <label class="row">
    <div>Border Color</div>
    <input type="text" uxp-quiet="true" id="txtColor" value="000000" placeholder="Enter 3-digit or 6-digit HEX Value" />
    </label>                
    </div>
    <div class="row break">
    <button id="ok" type="submit" uxp-variant="cta">Toggle Ruler</button>
    </div>    
    </form>
    <div class="row break"><p class="help-message">To change the ruler color and scale, please hide the ruler first. </p></div>
    `
    panel = document.createElement("div");
    panel.innerHTML = HTML;
    
    //Event Listener for Ruler Settings Form
    panel.querySelector("form").addEventListener("submit", rulerPanel);
    
    //Event Listener for Ruler Color
    panel.querySelector("#txtColor").addEventListener('change', validateColor(panel.querySelector("#txtColor").value));
    
    return panel;
}

//Panel Show function
function show(event) {
    if (!panel) event.node.appendChild(create());
}

//Panel Update function
function update() {
    const { Artboard } = require("scenegraph");
    let form = document.querySelector("form");
    let warning = document.querySelector("#warning");
    if (!selection || !(selection.items[0] instanceof Artboard)) {
        form.className = "hide";
        warning.className = "show";
    } else {
        form.className = "show";
        warning.className = "hide";       
        
    }
}

//Panel
function rulerPanel() {        
    const { editDocument } = require("application");    
    editDocument({ editLabel: "Show Hide Ruler" }, function () {
        if (showRuler){
            hideTheRuler()
        }
        else{
            showTheRuler(selection)
        }
    })
}

function validateColor(borderColor){
    if (borderColor.length==3 || borderColor.length==6){
        if (isHexadecimal(borderColor)){
            return true
        }
        else {
            return false
        }
    }
    else {
        showError("Length of Hex Value is invalid! Please enter hex value of either 3 or 6 characters.")       
    }
}

function validateScale(scale){    
    let maxValueOfScale = selection.items[0]["width"] > selection.items[0]["height"] ? selection.items[0]["height"] : selection.items[0]["width"]
    if (scale > 0 && scale < maxValueOfScale){
        return true
    }
    else {
        showError("Scale must be greater than 0 and less than " + maxValueOfScale + " (the shorter of the artboard's dimensions: width or height).")
        return false       
    }
}

//To check if Border Color is a Hex Value or not. Currently supports only 3 and 6 digit Hex Values
function isHexadecimal(str) {    
    if (regexp.test(str)) {
        return true;
    }
    else {
        return false;
    }
}

async function toggleRuler(){
    if (selection.items[0]==undefined){
        showError("Please select an artboard to show/hide its ruler.")
    }
    else if (selection.items[0] instanceof Artboard){
        if (selection.items[1]){ 
            showError("Please select one artboard at a time to show/hide its ruler.")
        }
        else{
            console.log( "toggleRuler: ", selection.items[0])
            if (showRuler){
                hideTheRuler()   
            }
            else {
                showTheRuler(selection)
            }
        }
    }
    else {
        showError("Please select an artboard to show/hide its ruler.")
    }
}

function showTheRuler(selection){   
    let colorOfBorder = document.querySelector("#txtColor").value
    let scale = Number(document.querySelector("#txtV").value);  
    
    if (validateColor(colorOfBorder) && validateScale(scale)){
        
        document.querySelector("#txtV").disabled = true
        document.querySelector("#txtColor").disabled = true
        
        let rectangles = selection.items[0].children.filter(artboardChild => {
            return artboardChild instanceof Rectangle;
        })
        
        //Remove all the existing ruler markings from the artboard
        rectangles.forEach(rectangle => {
            if (rectangle.name.includes("Ruler-Marking")) {
                rectangle.locked = false
                rectangle.removeFromParent()             
            }
        })      
        
        var artboardWidth = (selection.items[0]["width"])
        var artboardHeight = (selection.items[0]["height"])          
        let selectionSaved = selection
        selection = [];
        let counter = 0
        
        //Create horizontal ruler markings                 
        for (var i = 0; i < artboardHeight; i = i + scale) {
            
            let newRulerMarking = new Rectangle();
            newRulerMarking.width = 8;
            newRulerMarking.height = 0.5;
            newRulerMarking.fill = new Color("#" + colorOfBorder);
            
            selectionSaved.insertionParent.addChild(newRulerMarking);                
            newRulerMarking.moveInParentCoordinates(0, i);    
            newRulerMarking.name ="Ruler-Marking-Y-Axis-" + counter                            
            newRulerMarking.locked = true                    
            
            counter++
        }
        
        //Create vertical ruler markings                 
        for (var i = 0; i < artboardWidth; i = i + scale) {
            
            let newRulerMarking = new Rectangle();
            newRulerMarking.width = 0.5;
            newRulerMarking.height = 8;
            newRulerMarking.fill = new Color("#" + colorOfBorder);
            
            selectionSaved.insertionParent.addChild(newRulerMarking);
            newRulerMarking.moveInParentCoordinates(i, 0);
            newRulerMarking.name = "Ruler-Marking-X-Axis-" + counter                            
            
            newRulerMarking.locked = true
            
            counter++
            
        }
    }
    else {
        showError("The Hex Value is invalid! Please make sure each character is either 0-9 or a-f.")
    }
    //Invert the flag
    showRuler = true
}

async function hideTheRuler(){
    
    document.querySelector("#txtV").disabled = false
    document.querySelector("#txtColor").disabled = false
    
    let rectangles = selection.items[0].children.filter(artboardChild => {
        return artboardChild instanceof Rectangle;
    })
    rectangles.forEach(rectangle => {                              
        if (rectangle.name.includes("Ruler-Marking")){
            //Hide all the existing ruler markings                        
            rectangle.locked = false
            rectangle.visible = false;
        }                                                        
    })      
    //Invert the flag
    showRuler = false
}

async function showError(errorType) {
    errorType = errorType || errorMessage
    await error("Ruler - Error", errorType); 
}

module.exports = {
    panels: {
        rulerPanel: {
            show,
            update
        }
    },
    commands:{
        showError, toggleRuler
    }
};