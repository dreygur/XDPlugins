const { 
    tail_gray, tail_red, tail_orange, tail_yellow, tail_green, tail_teal, tail_blue, tail_indigo, tail_purple, tail_pink,
    tail_graytxt, tail_redtxt, tail_orangetxt, tail_yellowtxt, tail_greentxt, tail_tealtxt, tail_bluetxt, tail_indigotxt, tail_purpletxt, tail_pinktxt
} = require('./colors/tailwind_colors');

const { 
    fl_grey, fl_brown, fl_blueGrey, fl_deepPurple, fl_purple, fl_indigo, fl_blue, fl_lightBlue, fl_cyan, fl_teal, 
    fl_green, fl_lightGreen, fl_lime, fl_yellow, fl_amber, fl_orange, fl_deepOrange, fl_red, fl_pink,
    
    fl_deepPurpleAccent, fl_purpleAccent, fl_indigoAccent, fl_blueAccent, fl_lightBlueAccent, fl_cyanAccent, fl_tealAccent,
    fl_greenAccent, fl_lightGreenAccent, fl_limeAccent, fl_yellowAccent, fl_amberAccent, fl_orangeAccent,
    fl_deepOrangeAccent, fl_redAccent, fl_pinkAccent,
  
    blueGreytxt, deepPurpletxt, purpletxt, indigotxt, bluetxt, lightBluetxt,
    cyantxt, tealtxt, greentxt, lightGreentxt, limetxt, yellowtxt, ambertxt, orangetxt, deepOrangetxt, redtxt, pinktxt, greytxt, browntxt,
  
    deepPurpleAccenttxt, purpleAccenttxt, indigoAccenttxt, blueAccenttxt, lightBlueAccenttxt, cyanAccenttxt, tealAccenttxt, greenAccenttxt, lightGreenAccenttxt, limeAccenttxt, yellowAccenttxt, amberAccenttxt, orangeAccenttxt, deepOrangeAccenttxt, redAccenttxt, pinkAccenttxt,

} = require('./colors/flutter_colors.js');

const { 
    ant_red, ant_volcano, ant_orange, ant_gold, ant_yellow, ant_lime, ant_green, ant_cyan, ant_blue, 
    ant_geekblue, ant_purple, ant_magenta, ant_gray,
    ant_redtxt, ant_volcanotxt, ant_orangetxt, ant_goldtxt, ant_yellowtxt, ant_limetxt, ant_greentxt, ant_cyantxt, ant_bluetxt, ant_geekbluetxt, ant_purpletxt, ant_magentatxt, ant_graytxt,
} = require('./colors/ant_colors');


const {
    op_gray, op_red, op_pink, op_grape, op_violet, op_indigo, op_blue, op_cyan, op_teal, op_green, op_lime, op_yellow, op_orange,
    op_graytxt, op_redtxt, op_pinktxt, op_grapetxt, op_violettxt, op_indigotxt, op_bluetxt, op_cyantxt, op_tealtxt, op_greentxt, op_limetxt, op_yellowtxt, op_orangetxt,
} = require('./colors/open_colors');


let dialog;

function chooseColor() {
    const html =
        `
       <style>
        * {
            font-family: -apple-system, BlinkMacSystemFont, Roboto, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
            font-size: 20px;
        }
        .colorSelect {
            padding: 10px 50px 30px 40px;
            margin:0;
            font-weight: bold;
            line-height: 24px;
            z-index: 1;
        }
       </style>
       
       <form id="main" method="dialog">
        <div class="colorSelect">
                <div style="padding: 10px 50px 20px 40px;">Select Color Palette</div>
                <div class="form-group">
                    <label for="color"></label>
                    <select class="form-control" id="colorDropdown" name="colorDropdown">
                        <option disabled selected value>choose...</option>
                        <option value="ant" type="submit" uxp-variant="cta" id="ant">Ant Design Colors</option>
                        <option value="tailwind" type="submit" uxp-variant="cta" id="tailwind">Tailwind Colors</option>
                        <option value="flutterPrimary" type="submit" uxp-variant="cta" id="flutterPrimary">Flutter Primary Colors</option>
                        <option value="flutterAccent" type="submit" uxp-variant="cta" id="flutterAccent">Flutter Accent Colors</option>
                        <option value="openColor" type="submit" uxp-variant="cta" id="openColor">Open Colors</option>
                    </select>
                    <br>
                </div>
            </div>
            <div id="errorText" style="display: none; color: #D7373F; padding: 0px 0px 20px 50px;">This is some error text</div>
            <footer>
                <div style="display: flex; flex-direction: row; flex-wrap: nowrap;">
                    <button id="closeButton" uxp-variant="primary" >Close</button>
                    <button id="ok" type="submit" uxp-variant="cta" disabled>Generate Colors</button>
                </div>
            </footer>
        </form>`
    
    
        
    if (!dialog) {
        dialog = document.createElement("dialog");
        dialog.innerHTML = html;
        document.appendChild(dialog);
        document.getElementById("colorDropdown").addEventListener("change", enable);
        document.getElementById("closeButton").addEventListener("click", closeDialog);
        document.getElementById("ok").addEventListener("click", getSelectedColor);
    }
    return dialog.showModal();
}


function generateColor(rowNum, colorName, textName, yaxis) {
    const { Rectangle, Text, Color } = require("scenegraph");
    let scenegraph = require("scenegraph");

    for (let i = 0; i <= rowNum; i++) {
        let rectangle = new Rectangle();
        rectangle.width = 90;
        rectangle.height = 90;
        rectangle.fill = new Color(colorName[i]);

        let txt = new Text();
        txt.text = textName[i];
        txt.fill = new Color("#2D3748");
        // txt.fontFamily = 'SF Pro Display';    text = (i+1)+"00 - " + 
        txt.fontSize = 12;
        scenegraph.selection.insertionParent.addChild(rectangle);
        rectangle.moveInParentCoordinates(90 * i + 50, 50 + yaxis * 180);

        scenegraph.selection.insertionParent.addChild(txt);
        txt.moveInParentCoordinates(90 * i + 60, 50 + 90 + 30 + yaxis * 180);
    }
}

function enable() {
    var e = document.getElementById("colorDropdown");
    var btnMain = document.getElementById("ok");
    var result = e.value;
    if(result == "ant" || result == "tailwind" || result == "flutterPrimary" || result =="flutterAccent" || result == "openColor"){
        btnMain.removeAttribute("disabled");
    }
    else {
        btnMain.setAttribute("disabled");
    }
}
function disable(){
    var btnMain = document.getElementById("ok");
    btnMain.setAttribute("disabled");
}

function getSelectedColor(){
    var e = document.getElementById("colorDropdown");
    var result = e.value;

    if (result == "ant") {
        antColors();
        disable();
    } else if (result == "tailwind") {
        tailwindColors();
        disable();
    } else if (result == "flutterPrimary"){
        flutterPrimaryColors();
        disable();
    } else if (result == "flutterAccent"){ 
        flutterAccentColors();
        disable();
    } else if (result == "openColor"){
        openColors();
        disable();
    } else {
        disable();
    }
}


function antColors() {
    generateColor(9, ant_red, ant_redtxt, 0);
    generateColor(9, ant_volcano, ant_volcanotxt, 1);
    generateColor(9, ant_orange, ant_orangetxt, 2);
    generateColor(9, ant_gold, ant_goldtxt, 3);
    generateColor(9, ant_yellow, ant_yellowtxt, 4);
    generateColor(9, ant_lime, ant_limetxt, 5);
    generateColor(9, ant_green, ant_greentxt, 6);
    generateColor(9, ant_cyan, ant_cyantxt, 7);
    generateColor(9, ant_blue, ant_bluetxt, 8);
    generateColor(9, ant_geekblue, ant_geekbluetxt, 9);
    generateColor(9, ant_purple, ant_purpletxt, 10);
    generateColor(9, ant_magenta, ant_magentatxt, 11);
    generateColor(9, ant_gray, ant_graytxt, 12);
}

function tailwindColors() {
    generateColor(8, tail_gray, tail_graytxt, 0);
    generateColor(8, tail_red, tail_redtxt, 1);
    generateColor(8, tail_orange, tail_orangetxt, 2);
    generateColor(8, tail_yellow, tail_yellowtxt, 3);
    generateColor(8, tail_green, tail_greentxt, 4);
    generateColor(8, tail_teal, tail_tealtxt, 5);
    generateColor(8, tail_blue, tail_bluetxt, 6);
    generateColor(8, tail_indigo, tail_indigotxt, 7);
    generateColor(8, tail_purple, tail_purpletxt, 8);
    generateColor(8, tail_pink, tail_pinktxt, 9);
}

function flutterPrimaryColors() {
    generateColor(9, fl_blueGrey, blueGreytxt, 0);        
    generateColor(9, fl_indigo, indigotxt, 1);       
    generateColor(9, fl_blue, bluetxt, 2);
    generateColor(9, fl_lightBlue, lightBluetxt, 3);
    generateColor(9, fl_cyan, cyantxt, 4);
    generateColor(9, fl_teal, tealtxt, 5);
    generateColor(9, fl_green, greentxt, 6);
    generateColor(9, fl_lightGreen, lightGreentxt, 7);
    generateColor(9, fl_lime, limetxt, 8);
    generateColor(9, fl_yellow, yellowtxt, 9);
    generateColor(9, fl_amber, ambertxt, 10);
    generateColor(9, fl_orange, orangetxt, 11);
    generateColor(9, fl_deepOrange, deepOrangetxt, 12);
    generateColor(9, fl_red, redtxt, 13);
    generateColor(9, fl_pink, pinktxt, 14);
    generateColor(9, fl_deepPurple, deepPurpletxt, 15);     
    generateColor(9, fl_purple, purpletxt, 16);    
    generateColor(9, fl_brown, browntxt, 17);
    generateColor(11, fl_grey, greytxt, 18);
 }

function flutterAccentColors() {
   generateColor(3, fl_indigoAccent, indigoAccenttxt, 0);
   generateColor(3, fl_blueAccent, blueAccenttxt, 1);
   generateColor(3, fl_lightBlueAccent, lightBlueAccenttxt, 2);
   generateColor(3, fl_cyanAccent, cyanAccenttxt, 3);
   generateColor(3, fl_tealAccent, tealAccenttxt, 4);
   generateColor(3, fl_greenAccent, greenAccenttxt, 5);
   generateColor(3, fl_lightGreenAccent, lightGreenAccenttxt, 6);
   generateColor(3, fl_limeAccent, limeAccenttxt, 7);
   generateColor(3, fl_yellowAccent, yellowAccenttxt, 8);
   generateColor(3, fl_amberAccent, amberAccenttxt, 9);
   generateColor(3, fl_orangeAccent, orangeAccenttxt, 10);
   generateColor(3, fl_deepOrangeAccent, deepOrangeAccenttxt, 11);
   generateColor(3, fl_redAccent, redAccenttxt, 12);
   generateColor(3, fl_pinkAccent, pinkAccenttxt, 13);
   generateColor(3, fl_purpleAccent, purpleAccenttxt, 14);
   generateColor(3, fl_deepPurpleAccent, deepPurpleAccenttxt, 15);
}

function openColors() {
    generateColor(9, op_gray, op_graytxt, 0);
    generateColor(9, op_red, op_redtxt, 1);
    generateColor(9, op_pink, op_pinktxt, 2);
    generateColor(9, op_grape, op_grapetxt, 3);
    generateColor(9, op_violet, op_violettxt, 4);
    generateColor(9, op_indigo, op_indigotxt, 5);
    generateColor(9, op_blue, op_bluetxt, 6);
    generateColor(9, op_cyan, op_cyantxt, 7);
    generateColor(9, op_teal, op_tealtxt, 8);
    generateColor(9, op_green, op_greentxt, 9);
    generateColor(9, op_lime, op_limetxt, 10);
    generateColor(9, op_yellow, op_yellowtxt, 11);
    generateColor(9, op_orange, op_orangetxt, 12);
}

function closeDialog() {
    disable();
    dialog.close();
}

module.exports = {
    commands: {
        createColorPalette: chooseColor
    }
};

