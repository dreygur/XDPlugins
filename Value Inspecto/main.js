const { alert } = require("./lib/dialogs.js");

let panel;
//creating panel
function create() {
    const html = ` <style>
    .box {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .dpi-section{
        margin-top:3%;
    }
    .rootpixel-section{
        margin-top:3%;
    }
    .note-section{
        margin-top:3%;
        margin-bottom:5%;
        margin-left:2.3%;
        margin-right:2.5%;
    }
    .cal-child {

    }

    .boldColor{
        color: #000;
        font-weight: bold;
    }
    b.boldColor-White {
        font-weight: bold;
        color: white;
    }

    .EdtValue{
        width: 100%;
    }
    .EdtDpi{
        display: none;
        width:100%;
        margin-left:-1%;
    }
    .EdtRoot{
        width:100%;
    }
  
    .dValue{
        width:100%;
        margin-left:-15px;
    }
    .dDpi{
        width:100%;
    }

    .inline{
        display: inline;
    }
    .H{ margin-left:10px;}

    p.note{
        width:100%;
        height: 22px;
        line-height:22px;
        paddingLeft:4px;
        background: #999999;
        margin-left:0px;
        color: #fff;
        overflow: hidden;
    }
    .active, .note:hover {
        background-color: #2680EB;
      }
    .chevron{ 
        margin-left:15px;
    }
    .notesContent{
        display: none;
        overflow: hidden;
    }
    li{
        margin-top:6px;
    }

    .convertValue{
        width:60%;
        margin: 0 auto;
        display: block;
    }


    .units-heading {
        text-align: center;
        width: 100%;
        margin-top:5px;
        margin-bottom: 15px;
        align-content: center;
        font-weight: bold;
        font-size: 12px;
    }
    .card-section {
        max-width: 380px;
        margin: 0 auto;
    }
    .card {
        width: 80px;
        height: 100px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        background-color: #2CABFF;
        border-radius: 5px;
        padding: 8% 8%;
    }
    .cards {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        list-style: none;
        margin: 0;
        padding: 0;
    }
    .cards_item {
        display: flex;
        padding: 5px;
    }
    .UnitsLabel {
        margin-top: 20%;
        font-size: 13px;
        font-weight: 500;
        color: white;
    }


    .footer {
        float: left;
        clear: both;
        margin-top: 20px;
        left: 0;
        bottom: 0;
        width: 100%;
        color: gray;
        text-align: center;
    }
    .a-footer {
        font-weight: 600;
        color: #2CABFF;
    }


    @media screen and (max-width: 300px) {
        .dValue{
            width:80%;
        }
    
         .note-section{
             margin-left:4%;
             margin-right:3.8%;
        }
    
    }
    

</style>

<div class="box">
<form method="dialog" id="main">

<div class="box">
  <input class="EdtValue inline" type="number" id="tvValue" placeholder="Enter value" required />
    <select id="unitsValue" class="inline dValue">
      <option value="Pixel [px]" selected>Pixel [px]</option>
      <option value="Density Pixel [dp]">Density Pixel [dp]</option>
      <option value="Scale Pixel [sp]">Scale Pixel [sp]</option>
      <option value="Root Element [rem/em]">Root Element [rem/em]</option>
      <option value="Point [pt]">Point [pt]</option>
      <option value="Millimeter [mm]">Millimeter [mm]</option>
      <option value="Centimeter [cm]">Centimeter [cm]</option>
      <option value="Inches [in]">Inches [in]</option>
    </select>
</div>

<div class="dpi-section">
<b class="boldColor H">Select Density [dpi]</b>
<div class="box cal-child">
    <select id="densityValue" class="dDpi block">
        <option value="v1" selected>ldpi ~120</option>
        <option value="v2">mdpi ~160</option>
        <option value="v3">tvdpi ~213</option>
        <option value="v4">hdpi ~240</option>
        <option value="v5">xhdpi ~320</option>
        <option value="v6">xxhdpi ~480</option>
        <option value="v7">xxxhdpi ~640</option>
        <option value="v8">Custom dpi</option>
    </select>
    <input class="EdtDpi" type="number" id="customDpi" placeholder="dpi value" required />
</div>
</div>

<div class="rootpixel-section">
<b class="boldColor H">Root Pixel Value</b>
<div class="box cal-child">
<input class="EdtRoot" type="number" id="rootValue" value="16" placeholder="Enter value" required />
</div>
</div>


<div class="note-section">
<p class="note">
<i class"noteicon">&#128161;<b> Tips :</b></i><span><i id="chevron" class="chevron">&#x25BC;</i></span>
<ul class="notesContent">
  <li>1. All values are calculated, with respect to <b>Density[dpi]</b> value.</li>
  <li>2. <b>ScalePixel[sp]</b> values are same as <b>DensityPixel[dp]</b>, they change when device font changes.</li>
  <li>3. <b>16 px</b> is the default base/root value.</li>
  <li>4. <b>Element [em]</b> is relative to the font-size of its direct or nearest parent.</li>
  <li>5. <b>Root Element [rem]</b> is only relative to the html (root) font-size.</li>
</ul>
</p> 
</div>


<button class="convertValue" id="btnconvertValue" type="submit" uxp-variant="cta">Convert Value</button>


<hr style="  margin-top:30px;"/>
<p class="units-heading"><b>CALCULATED UNITS</b></p>
<div class="card-section">
<ul class="cards">

<li class="cards_item">
  <div class="card">
    <b class="boldColor-White">Pixel [px]</b><br /><br />
    <label id="pxtxt" class="UnitsLabel">00.00</label>
  </div>
</li>

<li class="cards_item">
  <div class="card">
    <b class="boldColor-White">Density Pixel [dp]</b><br />
    <label id="dptxt" class="UnitsLabel">00.00</label>
  </div>
</li>

<li class="cards_item">
  <div class="card">
    <b class="boldColor-White">Scale Pixel [sp]</b><br />
    <label id="sptxt" class="UnitsLabel">00.00</label>
  </div>
</li>

<li class="cards_item">
  <div class="card">
    <b class="boldColor-White">Root Element [em/rem]</b>
    <label id="remtxt" class="UnitsLabel">00.00</label>
  </div>
</li>

<li class="cards_item">
  <div class="card">
    <b class="boldColor-White">Point [pt]</b><br /><br />
    <label id="pttxt" class="UnitsLabel">00.00</label>
  </div>
</li>

<li class="cards_item">
  <div class="card">
    <b class="boldColor-White">Millimeter [mm]</b><br />
    <label id="mmtxt" class="UnitsLabel">00.00</label>
  </div>
</li>

<li class="cards_item">
  <div class="card">
    <b class="boldColor-White">Centimeter [cm]</b><br />
    <label id="cmtxt" class="UnitsLabel">00.00</label>
  </div>
</li>

<li class="cards_item">
  <div class="card">
    <b class="boldColor-White">Inches [in]</b><br /><br />
    <label id="intxt" class="UnitsLabel">00.00</label>
  </div>
</li>

</ul>
</div>

<hr style="  margin-top:30px;"/>
<div class="footer">
<p>Developed with <p>&#128153;</p>
    <a class="a-footer" target="_blank" href="https://valueinspecto.github.io/">Website</a> | 
    <a class="a-footer" target="_blank" href="https://softwindevs.github.io/">Contact Us</a>
    <p>Version 1.0.1</p>
</p>
</div>

</form>
</div>
`;

    async function calculatevalues() {
        const { editDocument } = require("application");

         const EnteredValue = document.getElementById("tvValue").value;
         const RootValue = document.getElementById("rootValue").value;
         const CDpiValue = document.getElementById("customDpi").value;

         const lblPx = document.getElementById("pxtxt");
         const lblDp = document.getElementById("dptxt");
         const lblSp = document.getElementById("sptxt");
         const lblrem = document.getElementById("remtxt");
         const lblPt = document.getElementById("pttxt");
         const lblMm = document.getElementById("mmtxt");
         const lblCm = document.getElementById("cmtxt");
         const lblInh = document.getElementById("intxt");
     
         var px = 0, dp = 0, sp = 0, rem = 0, pt = 0, mm = 0, cm = 0,  inh = 0, rootvalue = 0;
         var dpi = 120;
         var customdpi = CDpiValue;
 
         const densityValue = document.getElementById("densityValue");
         const lblUnit = document.getElementById("unitsValue");
         var optiondpi = densityValue.options[densityValue.selectedIndex].value;
         var optionunits = lblUnit.options[lblUnit.selectedIndex].value;
 

        if (EnteredValue.length == 0) {
            // console.log("Enter some value first!");
            lblPx.innerHTML = "00.00";
            await alert("Error!", "Please enter some value first &#128580;");
        } else if (RootValue.length == 0 || RootValue == 0) {
            await alert("Error!", "Root Pixel Value cannot not be 0 or null &#128580;",
                "<b>Note: </b>Default Root Pixel Value is 16px");
        }else if (optiondpi == "v8" && CDpiValue.length == 0) {
            await alert("Error!", "Please enter custom dpi value first &#128580;");
        } else {

        if (optiondpi == "v1") {
            dpi = 120;
        } else if (optiondpi == "v2") {
            dpi = 160;
        } else if (optiondpi == "v3") {
            dpi = 213;
        } else if (optiondpi == "v4") {
            dpi = 240;
        } else if (optiondpi == "v5") {
            dpi = 320;
        } else if (optiondpi == "v6") {
            dpi = 480;
        } else if (optiondpi == "v7") {
            dpi = 640;
        } else if (optiondpi == "v8") {
            dpi = customdpi;
        }


        if (optionunits == "Pixel [px]") {
            //px to units converter
            lblPx.innerHTML = EnteredValue;
            px = EnteredValue;
            rootvalue = RootValue;

            rem = px / rootvalue * 1000 / 1000;
            lblrem.innerHTML = rem.toFixed(3); 

            cm = px * 2.54 / dpi;
            lblCm.innerHTML = cm.toFixed(3); 

            dp = px * 160 / dpi;
            lblDp.innerHTML = dp.toFixed(3);
            lblSp.innerHTML = dp.toFixed(0);

            mm = px / dpi * 25.4;
            lblMm.innerHTML = mm.toFixed(3);

            inh = px / dpi;
            lblInh.innerHTML = inh.toFixed(3);

            pt = px * 72 / dpi;
            lblPt.innerHTML = pt.toFixed(3);
        }
        else if (optionunits == "Density Pixel [dp]") {
            //dp to units converter
            lblDp.innerHTML = EnteredValue;
            lblSp.innerHTML = EnteredValue;
            dp = EnteredValue;
            rootvalue = RootValue;

            px = dp * dpi / 160;
            lblPx.innerHTML = px.toFixed(3);

            rem = px / rootvalue * 1000 / 1000;
            lblrem.innerHTML = rem.toFixed(3); 

            mm = px / dpi * 25.4;
            lblMm.innerHTML = mm.toFixed(3);

            cm = px * 2.54 / dpi;
            lblCm.innerHTML = cm.toFixed(3); 

            inh = px / dpi;
            lblInh.innerHTML = inh.toFixed(3);

            pt = px * 72 / dpi;
            lblPt.innerHTML = pt.toFixed(3);

        } else if (optionunits == "Scale Pixel [sp]") {
            //sp to units converter
            lblSp.innerHTML = EnteredValue;
            sp = EnteredValue;
            rootvalue = RootValue;

            px = sp * dpi / 160;
            lblPx.innerHTML = px.toFixed(3);

            dp = px * 160 / dpi;
            lblDp.innerHTML = dp.toFixed(3);

            rem = px / rootvalue * 1000 / 1000;
            lblrem.innerHTML = rem.toFixed(3); 

            mm = px / dpi * 25.4;
            lblMm.innerHTML = mm.toFixed(3);

            cm = px * 2.54 / dpi;
            lblCm.innerHTML = cm.toFixed(3); 

            inh = px / dpi;
            lblInh.innerHTML = inh.toFixed(3);

            pt = px * 72 / dpi;
            lblPt.innerHTML = pt.toFixed(3);

        } 
         else if (optionunits ==  "Root Element [rem/em]") {
            //rem/em to units converter
            lblrem.innerHTML = EnteredValue;
            rem = EnteredValue;
            rootvalue = RootValue;

            px = rem * rootvalue;
            lblPx.innerHTML = px.toFixed(3);

            dp = px * 160 / dpi;
            lblDp.innerHTML = dp.toFixed(3);
            lblSp.innerHTML = dp.toFixed(0);

            mm = px / dpi * 25.4;
            lblMm.innerHTML = mm.toFixed(3);

            cm = px * 2.54 / dpi;
            lblCm.innerHTML = cm.toFixed(3); 

            inh = px / dpi;
            lblInh.innerHTML = inh.toFixed(3);

            pt = px * 72 / dpi;
            lblPt.innerHTML = pt.toFixed(3);

        }
        else if (optionunits == "Point [pt]") {
            //pt to units converter
            lblPt.innerHTML = EnteredValue;
            pt = EnteredValue;
            rootvalue = RootValue;

            inh = pt / 72;
            lblInh.innerHTML = inh.toFixed(3);

            mm = inh * 25.4;
            lblMm.innerHTML = mm.toFixed(3);

            px = inh * dpi;
            lblPx.innerHTML = px.toFixed(3);

            rem = px / rootvalue * 1000 / 1000;
            lblrem.innerHTML = rem.toFixed(3); 

            dp = px * 160 / dpi;
            lblDp.innerHTML = dp.toFixed(3);
            lblSp.innerHTML = dp.toFixed(0);

            cm = px * 2.54 / dpi;
            lblCm.innerHTML = cm.toFixed(3); 

        }
        else if (optionunits == "Millimeter [mm]") {
            //mm to units converter
            lblMm.innerHTML = EnteredValue;
            mm = EnteredValue;
            rootvalue = RootValue;

            inh = mm / 25.4;
            lblInh.innerHTML = inh.toFixed(3);

            pt = inh * 72;
            lblPt.innerHTML = pt.toFixed(3);

            px = inh * dpi;
            lblPx.innerHTML = px.toFixed(3);

            rem = px / rootvalue * 1000 / 1000;
            lblrem.innerHTML = rem.toFixed(3); 

            cm = px * 2.54 / dpi;
            lblCm.innerHTML = cm.toFixed(3); 

            dp = px * 160 / dpi;
            lblDp.innerHTML = dp.toFixed(3);
            lblSp.innerHTML = dp.toFixed(0);

        }
        else if (optionunits == "Centimeter [cm]") {
            //pt to units converter
            lblCm.innerHTML = EnteredValue;
            cm = EnteredValue;
            rootvalue = RootValue;

            inh = cm / 2.54;
            lblInh.innerHTML = inh.toFixed(3);

            px = inh * dpi;
            lblPx.innerHTML = px.toFixed(3);

            mm = inh * 25.4;
            lblMm.innerHTML = mm.toFixed(3);

            rem = px / rootvalue * 1000 / 1000;
            lblrem.innerHTML = rem.toFixed(3); 

            dp = px * 160 / dpi;
            lblDp.innerHTML = dp.toFixed(3);
            lblSp.innerHTML = dp.toFixed(0);

            pt = px * 72 / dpi;
            lblPt.innerHTML = pt.toFixed(3);

        }
         else if (optionunits == "Inches [in]") {
            //inh to units converter
            lblInh.innerHTML = EnteredValue;
            inh = EnteredValue;
            rootvalue = RootValue;

            px = inh * dpi;
            lblPx.innerHTML = px.toFixed(3);

            rem = px / rootvalue * 1000 / 1000;
            lblrem.innerHTML = rem.toFixed(3); 

            dp = px * 160 / dpi;
            lblDp.innerHTML = dp.toFixed(3);
            lblSp.innerHTML = dp.toFixed(0);

            pt = px * 72 / dpi;
            lblPt.innerHTML = pt.toFixed(3);

            mm = inh * 25.4;
            lblMm.innerHTML = mm.toFixed(3);

            cm = px * 2.54 / dpi;
            lblCm.innerHTML = cm.toFixed(3); 

        }

        }
    }

    panel = document.createElement("div");
    panel.innerHTML = html;
    panel.querySelector("form").addEventListener("submit", calculatevalues);

    return panel;
}


function DpiDropDown() {
    const densityValue = document.getElementById("densityValue");
    var optiondpi = densityValue.options[densityValue.selectedIndex].value;
    var EditextDpi = document.getElementById("customDpi");
    if(optiondpi == "v8") {
        EditextDpi.style.display = "inline";
        densityValue.style.width= "100%";
    } else {
        EditextDpi.style.display = "none";
        densityValue.style.width= "100%";
    }
}

//showing panel
function show(event) {

    if (!panel) event.node.appendChild(create());
}

function update(selection) {

    // console.log("Value Inspecto Plugin started!");  // log a message that plugin started
    document.getElementById('tvValue').onfocus = function (event) {
        document.getElementById('tvValue').value = '';
    }
    document.getElementById("densityValue").onchange = function (event) { DpiDropDown() };

    var coll = document.getElementsByClassName("note");
    var i;
    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function () {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
                document.getElementById("chevron").innerHTML = "&#x25BC;";
            } else {
                content.style.display = "block";
                document.getElementById("chevron").innerHTML = "&#x25B2;";
            }
        });
    }
    const form = document.querySelector("form");
}

module.exports = {
    /*   TODO:future update need commands
    commands: {
          myPluginCommand: mainFunction
      }, */

    panels: {
        myPluginPanel: {
            show,
            update
        }
    }

};
