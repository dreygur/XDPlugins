'use strict';
const { alert, error } = require("./lib/dialogs.js");
const { Line, Rectangle, Ellipse, Text, Color, Path } = require("scenegraph");
const commands = require("commands");

let scenegraph = require("scenegraph");

const CSV = require("./lib/csv");
const fs = require("uxp").storage.localFileSystem;
var assets = require("assets");


const palette = [
    ["Side Panel", '#6F777B'],
    ["Side Text", '#DEE0E2'],
    ["Tasks", '#A7488C'],
    ["Personas", '#35C0BD'],
    ["Touch Points", '#2C3E50'],
    ["Pain Points", '#F15159'],
    ["Dark Text", '#4C4743']
];

const sidePanelFill = palette[0][1];
const sidePanelText = palette[1][1];
const titleText = '#ffffff';
const defaultText = palette[6][1];



var ht_row = 170;
const wd_row = 30;
var wd_full = 1920;
const wd_offset = 330;
const ht_offset = 170;

const ht = 150;
const wd = 160;
const gutter = 10;
const gutterX = 5;
const gutterY = 32;

var row_x;
var row_y;

var offsetX = 2 * wd + gutterX;
var offsetY = 110;

var fontSize = 12;
var fontHeaderSize = 18;
var fontLargeSize = 48;
var allColors;

var rowHts  =  [190, 370, 550, 900, 870];


async function createUserJourney(selection) {
    var i, j;

    const aFile = await fs.getFileForOpening({ types: ["txt", "csv"] });
    if (!aFile) {
        return;
    }

    const contents = await aFile.read();
    const arr = CSV.parse(contents);


    if(arr.length<6 ){
        showError('Not enough Data');
    }else if(arr.length>20 ){
        showError('Too Many Rows');
    }else{
        drawSidePanel(arr.slice(0,5), selection);

        drawJourney(arr.slice(5), selection);
    }
}


function drawJourney(arr, selection) {
    var rows = arr.length;
    var cols;
    var text;
    var i,j;

    // draw background rows and title blocks
    var str = " ";
    row_x = wd_offset + gutter + wd_row;

    // split out the emotion row
    let emotionArray = arr.splice(2,1)[0];
    rows = arr.length;

    wd_full = arr[0].length * wd;

    for (j = 0; j < rows; j++) {
        ht_row = 170;
        if (j === 2){
            ht_row = 340;
        }
        row_y = rowHts[j];

        // Do not draw a box for the Time
        if(arr[j][0]!=="Timeline"){
            // draw row
            var rect = new Rectangle();
            rect.width = wd_full;
            rect.height = ht_row;
            rect.fill = new Color(palette[j+2][1], 0.1);
            rect.stroke = null;
            selection.insertionParent.addChild(rect);
            rect.moveInParentCoordinates(row_x, row_y );

            // draw header
            var rect = new Rectangle();
            rect.width = wd_row;
            rect.height = ht_row;
            rect.fill = new Color(palette[j+2][1]);
            rect.stroke = null;
            selection.insertionParent.addChild(rect);
            // NB x position of title block is offset
            rect.moveInParentCoordinates(wd_offset, row_y);

            // row title text
            if (arr[j][0] !== null && arr[j][0] !== ""){
                str = String(arr[j][0]);
            }
            let text = new scenegraph.Text();
            text.rotateAround(270, text.localCenterPoint);
            text.text = str;
            text.textAlign = Text.ALIGN_RIGHT;
            text.styleRanges = [{
                length: str.length,
                fill: new Color(titleText),
                fontSize: fontHeaderSize
            }];

            selection.insertionParent.addChild(text);
            let x = wd_offset + gutter + 5;
            let y = rowHts[j] + gutter;
            text.moveInParentCoordinates(x, y);
        }

        // add the text blocks
        str = " ";
        cols = arr[j].length;
        var xOffset = 0;
        for (i = 0; i < cols; i++) {
          if (arr[j][i] !== null && i > 0 ) {
                if (arr[j][i] !== "") {
                    var str = String(arr[j][i]); // cast to string so we can get length
                    text = new Text();
                    if(arr[j][0]!=="Timeline"){
                        text.areaBox = { width: wd - gutterX * 3, height: ht };
                    }else{
                        xOffset = (wd - gutterX * 3)/2;
                    }
                    text.text = str;
                    text.styleRanges = [{
                        length: str.length,
                        fill: new Color(defaultText),
                        fontSize: fontSize
                    }];

                    // set yPos of TOUCH POINTS based on emotion point
                    var correction = 0;
                    if (j === 2){
                        let value = 1;
                        //check the "emotion" row
                        if(emotionArray[i]!==null){
                            value = parseInt(emotionArray[i]);
                        }

                        if(value<3){
                            correction = 170;
                        }

                    }

                    selection.insertionParent.addChild(text);
                    let x = row_x + (i - 1) * (wd + gutter) + gutter + xOffset;
                    let y = row_y + gutter + correction;
                    text.moveInParentCoordinates(x, y);
                }
            }
        }
        row_y = row_y + ht_row + gutter;

    }

    drawEmotions(emotionArray, selection);
}


// do two loops one to set line beneath all circles
function drawEmotions(arr, selection) {
    var i, j;
    var x, y;
    var lastX = null;
    var lastY = null;
    var value;
    var len = arr.length;
    var offsetChart = (wd - gutterX * 3)/2;
    var padding = 40;
    var ht_range = ht_row*2 - padding*2;
    var ht_step = parseInt(ht_range/4);
    var points = [];
    var startY, endY = 0;

    for (i = 1; i < len; i++) {
        // default value
        value = 1;
        if(arr[i]!==null){
            value = parseInt(arr[i]);
        }

        x = row_x + ((i - 1) * (wd + gutter)) + wd/2;
        y = rowHts[2] + (value - 1) * ht_step + padding;

        // draw point
        const circ = new Ellipse();
        circ.radiusX = 6;
        circ.radiusY = 6;
        circ.fill = new Color(defaultText);
        circ.strokeWidth = 1;

        selection.insertionParent.addChild(circ);
        circ.moveInParentCoordinates(x, y);

        points.push([x+6, y+6]);

        //draw vert line
        const line = new Line();

        // determine direction of line
        if(value<3){
            startY = y + 10;
            endY = 710;
          }else{
            startY = y - 10;
            endY = 600;
          }

        line.setStartEnd(
            x + 6,
            startY + 6,
            x + 6,
            endY + 6   // correct for anchor point of ellipse
        );

        line.strokeEnabled = true;
        line.stroke = new Color(defaultText);
        line.strokeWidth = 1;

        selection.insertionParent.addChild(line);

    }

    //draw a path between points
    len = points.length;

    let pathData = 'M' + points[0][0] +',' + points[0][1];

    for (i = 1; i < len; i++) {
        pathData += ' L' + points[i][0] +',' + points[i][1];
    }
    const curve = new Path();
    curve.pathData = pathData;
    curve.strokeEnabled = true;
    curve.strokeDashArray = [3, 10];
    curve.stroke = new Color("black");
    curve.strokeWidth = 3

    selection.insertionParent.addChild(curve);

}


function drawSidePanel(arr, selection) {
    const len = 5; // get first four rows to use as side-bar content
    const rect = new Rectangle();
    rect.width = wd * 2;
    rect.height = 1080;
    rect.fill = new Color(sidePanelFill);
    rect.stroke = null;
    rect.opacity = 1;
    selection.insertionParent.addChild(rect);
    //persona icon placeholder
    const circ = new Ellipse();
    circ.radiusX = wd/2 - gutter;
    circ.radiusY = wd/2 - gutter;
    circ.fill = null;
    circ.stroke = new Color(sidePanelText);
    circ.strokeWidth = 3;
    selection.insertionParent.addChild(circ);
    circ.moveInParentCoordinates(gutter + wd/2, gutter*2);

    // use Persona value as page title
    var str = "Default Persona title";
    if(arr[0][1]!==null && arr[0][1]!==""){
        str = String(arr[0][1]);
    }
    var text = new Text();
    text.text = str;
    text.styleRanges = [{
        length: str.length,
        fill: new Color(defaultText),
        fontSize: fontLargeSize
    }];

    selection.insertionParent.addChild(text);
    let x = offsetX + gutter;
    let y = wd/2 + gutter*3; // match the center of the circle
    text.moveInParentCoordinates(x, y);

    var i, j, displayFont;
    var rowLength = 0;
    str = "";

    for (j = 1; j < len; j++) {
        // add title
        if (arr[j][0] !== null && arr[j][0] !== "") {
            str = String(arr[j][0]);
        }

        text = new Text();
        text.text = str;
        text.styleRanges = [{
            length: str.length,
            fill: new Color(sidePanelText),
            fontSize: fontHeaderSize
        }];

        selection.insertionParent.addChild(text);
        let xTitle = gutter;
        let yTitle = rowHts[0] + (j-1)*(ht_row + gutter) + gutter;
        text.moveInParentCoordinates(xTitle, yTitle);

        // loop though and build single string
        str = "";
        rowLength = arr[j].length;
        for (i = 1; i < rowLength; i++) {
            if (arr[j][i] !== null && arr[j][i] !== "") {
                str += String(arr[j][i]) +"\n";
            }
        }

        // check for empty string
        if(str===""){
          str = " ";
        }
        text = new Text();
        text.areaBox = { width: wd*2 - gutterX * 3, height: ht };
        text.text = str;
        text.styleRanges = [{
            length: str.length,
            fill: new Color(sidePanelText),
            fontSize: fontSize
        }];

        selection.insertionParent.addChild(text);
        let x = gutter;
        let y = rowHts[0] + (j-1)*(ht_row + gutter) + 16 + gutter; // +16px to account for title
        text.moveInParentCoordinates(x, y);
    }

}


async function showError(header) {
    /* we'll display a dialog here */
    await error("CSV File Import Failed: " + header,
        "Failed to load the selected file. Please check the file format:",
        "* There needs to be 5 rows: for Persona, Roles, Goals, Needs and Expectations",
        "* Then there needs to be 6 rows: for Tasks, Persona, Emotion, Touch points and Pain points",
        "* See the plugin help page for more information");}



module.exports = {
    commands: {
        "createUserJourney": createUserJourney
    }
};