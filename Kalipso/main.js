
const { selection, Artboard, Text, Rectangle, Color, Polygon, Line } = require("scenegraph");
let panel;
let manifest;
const viewport = require('viewport');
const fs = require("uxp").storage.localFileSystem;
var assets = require("assets");
var preview = "";
var Resources_CascadeStyleSheet_Folder;
var styleFolder;
const application = require("application");
const scenegraph = require("scenegraph");
var SelectedStyleName = "";
var Default_CascadeStyleSheet;
var Project_CascadeStyleSheet_File;
var Default_CascadeStyleSheet_Content;
var mySelectedArtBoard = [];
const commands = require("commands");

var SelectorButton =
`.[NAME]{
	--k-width-2:null;
	--k-top-2:null;
	--k-right-2:null;
	--k-left-2:null;
	--k-height-2:null;
	--k-bottom-2:null;
	--k-border-type:No;
	left:null;
	top:null;
	right:null;
	bottom:null;
	width:[WIDTH];
	height:[HEIGHT];
	background-color:[BACKGROUNDCOLOR];
	opacity:[OPACITY];
	font-family:[FONT];
	font-size:[FONTSIZE];
	font-style:null;
	font-weight:[WEIGHT];
	color:[FOREGROUNDCOLOR];
}
`
var SelectorInput =
`
.[NAME]
{
	--k-width-2:null;
	--k-top-2:null;
	--k-rounded-corners:null;
	--k-right-2:null;
	--k-left-2:null;
	--k-hint-text-color:null;
	--k-height-2:null;
	--k-font-size-2:12;
	--k-disabled-text-color:null;
	--k-bottom-2:null;
	--k-border-type:No;
	left:null;
	top:null;
	right:null;
	bottom:null;
	width:[WIDTH];
	height:[HEIGHT];
	background-color:[BACKGROUNDCOLOR];
	opacity:[OPACITY];
	font-family:[FONT];
	font-size:[FONTSIZE];
	font-style:null;
	font-weight:[WEIGHT];
	color:[FOREGROUNDCOLOR];
	text-align:Left Center;
	border:[BORDER];
	border-radius:[CORNERRADIUS];
	border-color:[BORDERCOLOR];
	border-left:[BORDERLEFT];
	border-top:[BORDERTOP];
	border-right:[BORDERRIGHT];
	border-bottom:[BORDERBOTTOM];
}
`


var SelectorLabel =
`
.[NAME]
{
	--k-border-type:No;
	width:[WIDTH];
	height:[HEIGHT];
	background-color:[BACKGROUNDCOLOR];
	opacity:[OPACITY];
	font-family:[FONT];
	font-size:[FONTSIZE];
	font-weight:[WEIGHT]
	color:[FOREGROUNDCOLOR];
}
`
var selectorShape =
`
.[NAME]
{
	--k-type:[TYPE];
	--k-line-color:[BORDERCOLOR];
	width:[WIDTH];
	height:[HEIGHT];
	background-color:[BACKGROUNDCOLOR];
	opacity:[OPACITY];
	border:[BORDER];
	border-left:[BORDERLEFT];
	border-top:[BORDERTOP];
	border-right:[BORDERRIGHT];
	border-bottom:[BORDERBOTTOM];
}
`
var selectorimage =
`
.[NAME]
{
	width:[WIDTH];
	height:[HEIGHT];
	background-color:[BACKGROUNDCOLOR];
	opacity:[OPACITY];
	background-image:[IMAGE];
	font-family:[FONT];
	font-weight:[WEIGHT]
	font-size:[FONTSIZE];
	color:[FOREGROUNDCOLOR];
	border:[BORDER];
	border-radius:[CORNERRADIUS];
	border-color:[BORDERCOLOR];
	border-left:[BORDERLEFT];
	border-top:[BORDERTOP];
	border-right:[BORDERRIGHT];
	border-bottom:[BORDERBOTTOM];
	background-size:Proportionally Streched;
	--k-advanced-style:[ADVANCEDSTYLE];
	--k-border-type:[TYPE];
	--k-rounded-corners:[ROUNDEDCORNERS];
	--k-image-x:[IMAGEX];
	--k-image-y:[IMAGEY];
	--k-image-width:[IMAGEWIDTH];
	--k-image-height:[IMAGEHEIGHT];
	--k-text-x:[TEXTX];
	--k-text-y:[TEXTY];
}`
var root =
`
:root
{
	--fontsize_header:[Header];
	--fontsize_subheader:[SubHeader];
	--fontsize_title:[Title];
	--fontsize_subtitle:[Subtitle];
	--fontsize_default:[Default];
	--header-background:[Header Background];
	--header-foreground:[Header Foreground];
	--header-accent:[Header Accent];
	--body-background:[Body Background];
	--body-foreground:[Body Foreground];
	--body-accent:[Body Accent];
	--font:OS Default;
	--device-type:[Device Type];
	--device-width:[ArtWidth];
	--device-height:[ArtHeight];
	--icon-set:White;
}
`;
var headerBackgroundColor = new Color("#E9E9E9");
var headerForegroundColor = new Color("#000000");
var headerAccentColor = new Color("#F1F1F1");
var bodyBackground = new Color("#FFFFFF");
var bodyForeground = new Color("#000000");
var bodyAccent = new Color("#212121");
let headerFontSize = 18;
let subheaderFontSize = 15;
let bodyTitleFontSize = 14;
let bodySubtitleFontsize = 13;
let bodyDefaultFontSize = 11;

function create() {
	const HTML =
	`<style>
	.d-flex {
		display: flex;
	}
	.p
	{
		font:Roboto
	}

	.div
	{
		font:Roboto
	}

	.break {
		flex-wrap: wrap;
	}
	label.row > span {
		color: #8E8E8E;
		width: 20px;
		text-align: right;
		font-size: 9px;
	}
	label.row input {
		flex: 1 1 auto;
	}
	.show {
		display: block;
	}
	.hide {
		display: none;
	}
	</style>

	<form method="dialog" id = "NewStyle">
		<div>
			<p>Export as a Kalipso Designer style</p>
		</div>
		<div >
		<p>Export the style to a friendly folder, like your documents folder ou desktop, set up that path in Kalipso for the user styles!'</p>
		</div>
		<hr />
		<p>Please enter the name of the style and after select the destination folder.</p> 
		<label>
		<span>Name</span>
		<input id="stylename" type="text" placeholder="My amazing Style" />
		</label> 
		<div>
		<button id="cancelbutton" type="submit" uxp-variant="cta" style="width:40%; position:relative;margin-top: 25px;margin-left:12px;" >Cancel</button>
		<button id="okbutton" type="submit" uxp-variant="cta" style="width:40%; position:relative;margin-top: 25px;margin-left:12px;">Create</button>
		</div >
		<div style="position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;">
			<p >This plugin requires Kalipso Design studio! </p>
				<p> <a style = "float: left;" href="https://sysdevkalipso.com/uploads/documentos/CD_Kalipso_5.0.0.zip">Download a free demo of Kalipso 5 Designer</a></p>  
				<p> <a  style = "float: left;" href="https://www.sysdevkalipso.com/en/">For more information check out our website</a></p>   
		</div>
	</form>

	<form method="dialog" id="main">      
		<div  class="flex" style="margin-top:8px;word-wrap: break-word;margin-left:auto;margin-right:auto;  box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.5); border:#F6F6F6; background:#F9F9F9;padding: 5px; z-index: 1;position: absolute;">
			<p  style="margin-top: 10px; font-size:14px;fort-weight:100; ">Add a Kalipso default artboard size</p>      
			<div><button id="Smartphone" style="width:100%; position:relative;" uxp-variant="cta">Smartphone</button></div>
			<div><button id="Tablet" style=" width:100%; position:relative;"   uxp-variant="cta">Tablet</button></div>
			<div id="NObj" style="margin-top: 20px;">
			<p style="color:black; padding:15px;  word-wrap: break-word;font-size:18px;font-weight:bold;">Select an artboard</p>
			<p style="color:gray; padding:9px;  word-wrap: break-word;font-size:12px;">Kalipso Designer 5, is a fast mobile application generator. Kalipso uses the concept of CSS to style the apps you create. Along with our integrated Style Editor, you with this plugin can easily use your mockups to create a new style for Kalipso!</p> 
		</div>
		<div id="objects" class="flex" style="margin-top: 8px; word-wrap: break-word;margin-left:auto;margin-right:auto;  box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.5); border:#F6F6F6; background:#F9F9F9;padding: 5px; z-index: 1;position: absolute;">
			<div id="export" style="word-wrap: break-word;">
				<p id="SelectedBoardLabel" style="margin-top: 12px; font-size:14px;font-weight: bold; ">Select an artboard</p>      
				<p  style="margin-top: 10px;color:gray; font-size:11px;">Options fot selected artboard</p>      
				<button id="Export" style=" width:100%; position:relative;" uxp-variant="action">Export to Kalipso Style</button></div>
				<p style="font-size:9px;">In order to export objects to Kalipso Style, you must prefix them with the following:</p>
				<div style="margin-left:5px;font-size:12px;font-weight:600;color:#000000;">
				<div><button id="Button" uxp-variant="action" style="width:100%; position:relative;" >button-</button></div>
				<div><button id="Label" uxp-variant="action" style="width:100%; position:relative;" >label-</button></div>
				<div><button id="Input" uxp-variant="action" style="width:100%; position:relative;" >input-</button></div>
				<div><button id="Combo" uxp-variant="action" style="width:100%; position:relative;" >combo-</button></div>
				<div><button id="Image" uxp-variant="action" style="width:100%; position:relative;" >image-</button></div>   
					</div>
				</div>
			</div>
		</div>	
			<div style="position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;">
			<p >This plugin requires Kalipso Design studio! </p>
				<p> <a style = "float: left;" href="https://sysdevkalipso.com/uploads/documentos/CD_Kalipso_5.0.0.zip">Download a free demo of Kalipso 5 Designer</a></p>  
				<p> <a  style = "float: left;" href="https://www.sysdevkalipso.com/en/">For more information check out our website</a></p>   
		</div>
	</form>



	`
	  /*  <p id="warning"  style="margin-top: 8px; font-size:12px;">The objects below are designed to resemble native kalipso objects.</p>
	  <div style="margin-left:10px;
	    font-size:12px;
	    color:#000000;">
	        <p>By default all item groups are exported as images. The exception applies if at least one of the following prefixes is found in  the item name:</p>
	        <div style="margin-left:10px;
	        font-size:12px;font-weight:600;
	        color:#000000;">
	        <p style="background:white;" >button-</p>
	        <p style="background:white;" >label-</p>
	        <p style="background:white;" >input-</p>
	        <p style="background:white;" >combo-</p>
	        <p style="background:white;" >image-</p>
	        </div> */

	        panel = document.createElement("div");
	        panel.innerHTML = HTML;
	        return panel;
	    }
	    function show(event) {
	    	if (!panel) {
	    		try {
	    			event.node.appendChild(create());
	    			let formOptions = document.getElementById("objects");
	    			let NoobjDiv = document.getElementById("NObj");
	    			formOptions.style.display = "none";
	      //NoobjDiv.style.display = "block";
	      document.getElementById("NewStyle").style.display = "none";
	      document.getElementById("Tablet").addEventListener("click", function () { Tablet(); });
	      document.getElementById("Smartphone").addEventListener("click", function () { Smartphone() });
	      document.getElementById("Export").addEventListener("click", function () { Export() });
	      document.getElementById("Combo").addEventListener("click", function () { Combo() });
	      document.getElementById("Label").addEventListener("click", function () { Label() });
	      document.getElementById("Image").addEventListener("click", function () { Image() });
	      document.getElementById("Input").addEventListener("click", function () { TextBox() });
	      document.getElementById("Button").addEventListener("click", function () { NewButton() });
	      document.getElementById("okbutton").addEventListener("click", function () { ExportOk() });
	      document.getElementById("cancelbutton").addEventListener("click", function () { CancelExport() });

	  }
	  catch (ex) {
	      //console.log("Failed", ex);
	  }
	}
}

function teste() {

}


function Shape() {
	require("application").editDocument((documentRoot, selection) => {
		try {
			
			if (mySelectedArtBoard instanceof Artboard) {
				GetColors();
				const Shape = new Rectangle();
				Shape.name = ".shape-";
				Shape.fill = headerBackgroundColor;
				Shape.width = mySelectedArtBoard.width;
				Shape.height = 28;
				Shape.stroke = headerBackgroundColor;
				mySelectedArtBoard.addChild(Shape);
				let commands = require("commands");
				scenegraph.selection.items = [Shape];
				commands.alignHorizontalCenter()
				commands.alignVerticalCenter()
				scenegraph.selection.items = [mySelectedArtBoard]
			}
		}
		catch (ex) {
	      //console.log("Failed", ex);
	  }
	});
}

function Looper() {
	require("application").editDocument((documentRoot, selection) => {
		try {
	
	      if (mySelectedArtBoard instanceof Artboard) {
	      	GetColors();
	      	const Shape = new Rectangle();
	      	Shape.name = ".shape-";
	      	Shape.fill = bodyAccent;
	      	Shape.width = mySelectedArtBoard.width - 40;
	      	Shape.height = mySelectedArtBoard.height - 60;
	      	Shape.stroke = bodyAccent;
	      	mySelectedArtBoard.addChild(Shape);
	      	let commands = require("commands");
	      	scenegraph.selection.items = [Shape];
	      	commands.alignHorizontalCenter()
	      	scenegraph.selection.items = [mySelectedArtBoard]
	      }
	  }
	  catch (ex) {
	      //console.log("Failed", ex);
	  }
	});
}

function NewButton() {
	require("application").editDocument((documentRoot, selection) => {
		try {
	      if (mySelectedArtBoard instanceof Artboard) {
	      	GetColors();
	      	const ButtonBackground = new Rectangle();
	      	ButtonBackground.name = "border";
	      	ButtonBackground.fill = bodyAccent;
	      	ButtonBackground.width = 80;
	      	ButtonBackground.height = 28;
	      	ButtonBackground.stroke = bodyAccent;
	      	const ButtonText = new Text();
	      	ButtonText.text = "Button";
	      	ButtonText.name = "text";
	      	ButtonText.styleRanges = [{
	      		length: ButtonText.text.length,
	      		fill: bodyBackground,
	      		fontSize: bodyDefaultFontSize
	      	}];
	      	mySelectedArtBoard.addChild(ButtonBackground);
	      	mySelectedArtBoard.addChild(ButtonText);
	      	let commands = require("commands");
	      	scenegraph.selection.items = [ButtonBackground, ButtonText];
	      	commands.alignHorizontalCenter()
	      	commands.alignVerticalCenter()
	      	commands.group();
	      	let group = scenegraph.selection.items[0];
	      	group.name = "button-";
	      	commands.alignHorizontalCenter()
	      	commands.alignVerticalCenter()
	      	scenegraph.selection.items = [mySelectedArtBoard]
	      }
	  }
	  catch (ex) {
	      //console.log("Failed", ex);
	  }
	});
}

function Label() {
	require("application").editDocument((documentRoot, selection) => {
		try {
	      if (mySelectedArtBoard instanceof Artboard) {
	      	GetColors();
	      	const ButtonBackground = new Rectangle();
	      	ButtonBackground.name = "border";
	      	ButtonBackground.width = 80;
	      	ButtonBackground.height = 20;
	      	const ButtonText = new Text();
	      	ButtonText.text = "Label";
	      	ButtonText.width = 80
	      	ButtonText.name = "label";
	      	ButtonText.styleRanges = [{
	      		length: ButtonText.text.length,
	      		fill: bodyForeground,
	      		fontSize: bodyDefaultFontSize
	      	}];
	      	mySelectedArtBoard.addChild(ButtonBackground);
	      	mySelectedArtBoard.addChild(ButtonText);
	      	let commands = require("commands");
	      	scenegraph.selection.items = [ButtonBackground, ButtonText];
	      	commands.alignHorizontalCenter()
	      	commands.alignVerticalCenter()
	      	commands.group();
	      	let group = scenegraph.selection.items[0];
	      	group.name = "label-";
	      	commands.alignHorizontalCenter()
	      	commands.alignVerticalCenter()
	      	scenegraph.selection.items = [mySelectedArtBoard]
	      }
	  }
	  catch (ex) {
	      //console.log("Failed", ex);
	  }
	});
}


function Combo() {
	require("application").editDocument((documentRoot, selection) => {
		try {
	      if (mySelectedArtBoard instanceof Artboard) {
	      	GetColors();
	      	let polygon = new Polygon();
	      	polygon.name = "gliph";
	      	polygon.width = 10;
	      	polygon.height = 5;
	      	polygon.fill = new Color(bodyForeground);
	      	polygon.cornerCount = 3;
	      	polygon.setAllCornerRadii(0);
	      	polygon.rotateAround(180, polygon.localCenterPoint);
	      	let ButtonBackground = new Rectangle();
	      	ButtonBackground.name = "Background";
	      	ButtonBackground.fill = new Color(bodyForeground, 0.01);
	      	ButtonBackground.width = 80;
	      	ButtonBackground.height = 20;
	      	ButtonBackground.stroke = new Color(bodyForeground, 0.2);
	      	ButtonBackground.strokeWidth = 0.5
	      	let ButtonText = new Text();
	      	ButtonText.text = "Combo Box";
	      	ButtonText.name = "Label";
	      	ButtonText.styleRanges = [{
	      		length: ButtonText.text.length,
	      		fill: bodyForeground,
	      		fontSize: bodyDefaultFontSize
	      	}];
	      	mySelectedArtBoard.addChild(ButtonBackground);
	      	mySelectedArtBoard.addChild(ButtonText);
	      	mySelectedArtBoard.addChild(polygon);
	      	let commands = require("commands");
	        // scenegraph.selection.items = [ButtonBackground, ButtonText, line];
	        scenegraph.selection.items = [ButtonBackground, ButtonText];
	        commands.alignLeft()
	        scenegraph.selection.items = [ButtonBackground, ButtonText];
	        commands.alignVerticalCenter()
	        scenegraph.selection.items = [ButtonBackground, polygon];
	        commands.alignRight()
	        commands.alignVerticalCenter()
	        // scenegraph.selection.items = [line,ButtonBackground];
	        // commands.alignBottom()
	        // scenegraph.selection.items = [polygon, ButtonText,ButtonBackground,line];
	        scenegraph.selection.items = [polygon, ButtonText, ButtonBackground];
	        commands.group();
	        let group = scenegraph.selection.items[0];
	        group.name = "combo-mycombo";
	        commands.alignHorizontalCenter()
	        commands.alignVerticalCenter()
	        scenegraph.selection.items = [mySelectedArtBoard]
	    }
	}
	catch (ex) {
	      //console.log("Failed", ex);
	  }
	});
}
function Image() {
	require("application").editDocument((documentRoot, selection) => {
		try {
	      if (mySelectedArtBoard instanceof Artboard) {
	      	GetColors();
	      	const ButtonBackground = new Rectangle();
	      	ButtonBackground.name = "border";
	      	ButtonBackground.width = 32;
	      	ButtonBackground.height = 32;
	      	const ButtonImage = new Rectangle();
	      	ButtonImage.name = "border";
	      	ButtonImage.fill = headerBackgroundColor;
	      	ButtonImage.width = 18;
	      	ButtonImage.height = 18;
	      	ButtonImage.stroke = headerBackgroundColor;
	      	const ButtonText = new Text();
	      	ButtonText.text = "Button";
	      	ButtonText.name = "text";
	      	ButtonText.width = 40;
	      	ButtonText.styleRanges = [{
	      		length: 40,
	      		fill: bodyForeground,
	      		fontSize: 6
	      	}];
	      	mySelectedArtBoard.addChild(ButtonBackground);
	      	mySelectedArtBoard.addChild(ButtonImage);
	      	mySelectedArtBoard.addChild(ButtonText);
	      	let commands = require("commands");
	      	scenegraph.selection.items = [ButtonBackground, ButtonImage];
	      	commands.alignHorizontalCenter()
	      	commands.alignVerticalCenter()
	      	scenegraph.selection.items = [ButtonBackground, ButtonText];
	      	commands.alignHorizontalCenter()
	      	commands.alignBottom()
	      	scenegraph.selection.items = [ButtonBackground, ButtonImage, ButtonText];
	      	commands.group();
	      	let group = scenegraph.selection.items[0];
	      	group.name = "image-";
	      	commands.alignHorizontalCenter()
	      	commands.alignVerticalCenter()
	      	scenegraph.selection.items = [mySelectedArtBoard]
	      }
	  } catch (ex) {
	      //console.log("Failed", ex);
	  }
	});
}
function TextBox() {
	require("application").editDocument((documentRoot, selection) => {
		try {
	      if (mySelectedArtBoard instanceof Artboard) {
	      	GetColors();
	      	let ButtonBackground = new Rectangle();
	      	ButtonBackground.name = "Background";
	      	ButtonBackground.fill = new Color(bodyForeground, 0.01);
	      	ButtonBackground.width = 80;
	      	ButtonBackground.height = 20;
	      	ButtonBackground.stroke = new Color(bodyForeground, 0.2);
	      	ButtonBackground.strokeWidth = 0.5
	      	let ButtonText = new Text();
	      	ButtonText.text = "Text Box";
	      	ButtonText.name = "Label";
	      	ButtonText.Width = 60;
	      	ButtonText.styleRanges = [{
	      		fill: bodyForeground,
	      		fontSize: bodyDefaultFontSize
	      	}];
	      	mySelectedArtBoard.addChild(ButtonText);
	      	mySelectedArtBoard.addChild(ButtonBackground);
	      	let commands = require("commands");
	      	scenegraph.selection.items = [ButtonBackground, ButtonText];
	      	commands.alignLeft()
	      	scenegraph.selection.items = [ButtonBackground, ButtonText];
	      	commands.alignVerticalCenter()
	      	scenegraph.selection.items = [ButtonText, ButtonBackground];
	      	commands.group();
	      	let group = scenegraph.selection.items[0];
	      	group.name = "input-";
	      	commands.alignHorizontalCenter()
	      	commands.alignVerticalCenter()
	      	scenegraph.selection.items = [mySelectedArtBoard]
	      }
	  }
	  catch (ex) {
	      //console.log("Failed", ex);
	  }
	});
}
function GetColors() {


	var allColors = assets.colors.get();

	var _hcolor1 = allColors.find(o => o.name == "Header Background")
	var _hcolor2 = allColors.find(o => o.name == "Header Foreground")
	var _hcolor3 = allColors.find(o => o.name == "Header Accent")
	var _hcolor4 = allColors.find(o => o.name == "Body Background")
	var _hcolor5 = allColors.find(o => o.name == "Body Foreground")
	var _hcolor6 = allColors.find(o => o.name == "Body Accent")
	  if (_hcolor1 === undefined) { console.log("no header background defined"); assets.colors.add([{ name: "Header Background", color: headerBackgroundColor }]) } else { //console.log("Header Background:", "\n", _hcolor1); 
	  headerBackgroundColor = _hcolor1.color }
	  if (_hcolor2 === undefined) { console.log("no header foreground defined"); assets.colors.add([{ name: "Header Foreground", color: headerForegroundColor }]) } else { //console.log("Header Foreground:", "\n", _hcolor2);
	  headerForegroundColor = _hcolor2.color }
	  if (_hcolor3 === undefined) { console.log("no header accent defined"); assets.colors.add([{ name: "Header Accent", color: headerAccentColor }]) } else { //console.log("Header Accent:", "\n", _hcolor3);
	  headerAccentColor = _hcolor3.color }
	  if (_hcolor4 === undefined) { console.log("no body background defined"); assets.colors.add([{ name: "Body Background", color: bodyBackground }]) } else { //console.log("Body Background:", "\n", _hcolor4);
	  bodyBackground = _hcolor4.color }
	  if (_hcolor5 === undefined) { console.log("no body foreground defined"); assets.colors.add([{ name: "Body Foreground", color: bodyForeground }]) } else { //console.log("Body Foreground:", "\n", _hcolor5);
	  bodyForeground = _hcolor5.color }
	  if (_hcolor6 === undefined) { console.log("no body accent defined"); assets.colors.add([{ name: "Body Accent", color: bodyAccent }]) } else { //console.log("Body Accent:", "\n", _hcolor6);
	  bodyAccent = _hcolor6.color }
	}

	function Style(Device) {

		if (Device.toLowerCase() == "smartphone") {
			headerFontSize = 18;
			subheaderFontSize = 15;
			bodyTitleFontSize = 14;
			bodySubtitleFontsize = 13;
			bodyDefaultFontSize = 11;
		}
		else {
			headerFontSize = 23;
			subheaderFontSize = 19;
			bodyTitleFontSize = 15;
			bodySubtitleFontsize = 13;
			bodyDefaultFontSize = 12;
		}
		var FontHeader = {
			fontFamily: "Arial",
			fontStyle: "Regular",
			fontSize: headerFontSize,
			fill: headerForegroundColor,
			charSpacing: 0,
			lineSpacing: 0,
			underline: false
		}, FontSubHeader = {
			fontFamily: "Arial",
			fontStyle: "Regular",
			fontSize: subheaderFontSize,
			fill: headerForegroundColor,
			charSpacing: 0,
			lineSpacing: 0,
			underline: false
		}, FontTitle = {
			fontFamily: "Arial",
			fontStyle: "Bold",
			fontSize: bodyTitleFontSize,
			fill: bodyForeground,
			charSpacing: 0,
			lineSpacing: 0,
			underline: false
		}, FontSubTitle = {
			fontFamily: "Arial",
			fontStyle: "Regular",
			fontSize: bodySubtitleFontsize,
			fill: bodyForeground,
			charSpacing: 0,
			lineSpacing: 0,
			underline: false
		}, FontDefault = {
			fontFamily: "Arial",
			fontStyle: "Regular",
			fontSize: bodyDefaultFontSize,
			fill: bodyForeground,
			charSpacing: 0,
			lineSpacing: 0,
			underline: false
		};
		try {
			assets.characterStyles.delete([
				{ style: FontHeader, name: "Header" },
				{ style: FontSubHeader, name: "SubHeader" },
				{ style: FontTitle, name: "Title" },
				{ style: FontSubTitle, name: "SubTitle" },
				{ style: FontDefault, name: "Default" }
				]);
			assets.characterStyles.add([
				{ style: FontHeader, name: "Header" },
				{ style: FontSubHeader, name: "SubHeader" },
				{ style: FontTitle, name: "Title" },
				{ style: FontSubTitle, name: "SubTitle" },
				{ style: FontDefault, name: "Default" }
				]);
		}
		catch{ }

	}

	function GetUpdatedFonts() {
		var allCharacterStyles = assets.characterStyles.get();
		var _font1 = allCharacterStyles.find(o => o.name == "Header")
		var _font2 = allCharacterStyles.find(o => o.name == "SubHeader")
		var _font3 = allCharacterStyles.find(o => o.name == "Title")
		var _font4 = allCharacterStyles.find(o => o.name == "SubTitle")
		var _font5 = allCharacterStyles.find(o => o.name == "Default")
		if (_font1 === undefined) { console.log("no header defined"); } else { console.log("Header:", "\n", _font1); headerFontSize = _font1.style.fontSize }
		if (_font2 === undefined) { console.log("no subheader defined"); } else { console.log("Subheader:", "\n", _font2); subheaderFontSize = _font2.style.fontSize }
		if (_font3 === undefined) { console.log("no title defined"); } else { console.log("Title:", "\n", _font3); bodyTitleFontSize = _font3.style.fontSize }
		if (_font4 === undefined) { console.log("no subtitle defined"); } else { console.log("Subtitle:", "\n", _font4); bodySubtitleFontsize = _font4.style.fontSize }
		if (_font5 === undefined) { console.log("no defaut defined"); } else { console.log("Default:", "\n", _font5); bodyDefaultFontSize = _font5.style.fontSize }
	}

	function Smartphone() {
		require("application").editDocument((documentRoot, selection) => {
			try {
				GetColors();
				Style("Smartphone");
				let artWidth = 240;
				let artHeight = 400;
				var newArt = new Artboard();
				let xpos = 0;
				let ypos = 0;
				newArt.name = "Kalipso default smartphone";
				newArt.width = artWidth;
				newArt.height = artHeight;
				newArt.fillEnabled = true;
				newArt.fill = bodyBackground;
				scenegraph.root.addChild(newArt, 0)
				selection.items = [newArt];
				newArt.moveInParentCoordinates(xpos, ypos);
				viewport.scrollIntoView(newArt)
	      //********************************************************
	      const Header = new Rectangle();
	      Header.width = artWidth;
	      Header.height = 50;
	      Header.name = "header";
	      Header.fill = headerBackgroundColor;
	      Header.stroke = headerBackgroundColor;
	      newArt.addChild(Header);
	      Header.moveInParentCoordinates(0, 0);
	      //********************************************************
	      // create sub-header
	      const SubHeader = new Rectangle();
	      SubHeader.width = artWidth;
	      SubHeader.height = 30;
	      SubHeader.name = "subheader";
	      SubHeader.fill = headerAccentColor;
	      SubHeader.stroke = headerAccentColor;
	      newArt.addChild(SubHeader);
	      SubHeader.moveInParentCoordinates(0, 50);
	      //********************************************************
	      ////console.log(FontHeader.fill.value);
	      // create header Header
	      const HeaderTitle = new Text();
	      HeaderTitle.text = "Header";
	      HeaderTitle.name = "header";
	      HeaderTitle.styleRanges = [{
	      	length: HeaderTitle.text.length,
	      	fontSize: headerFontSize,
	      	fill: headerForegroundColor
	      }];
	      newArt.addChild(HeaderTitle);
	      HeaderTitle.moveInParentCoordinates(12, 30);
	      //********************************************************
	      ////console.log(FontSubHeader.fill.value);
	      // create header Subheader
	      const SubHeaderTitle = new Text();
	      SubHeaderTitle.text = "Subheader";
	      SubHeaderTitle.name = "subheader";
	      SubHeaderTitle.styleRanges = [{
	      	length: SubHeaderTitle.text.length,
	      	fontSize: subheaderFontSize,
	      	fill: headerForegroundColor
	      }];
	      newArt.addChild(SubHeaderTitle);
	      SubHeaderTitle.moveInParentCoordinates(12, 70);
	      //********************************************************
	      ////console.log(FontTitle.fill.value);
	      // create title
	      const Title = new Text();
	      Title.text = "Title";
	      Title.name = "title";
	      Title.styleRanges = [{
	      	length: Title.text.length,
	      	fill: bodyForeground,
	      	fontSize: bodyTitleFontSize
	      }];
	      newArt.addChild(Title);
	      Title.moveInParentCoordinates(12, 100);
	      //********************************************************
	      ////console.log(FontSubTitle.fill.value);
	      // create sub title
	      const SubTitle = new Text();
	      SubTitle.text = "Sub Title";
	      SubTitle.name = "subtitle";
	      SubTitle.styleRanges = [{
	      	length: SubTitle.text.length,
	      	fill: bodyForeground,
	      	fontSize: bodySubtitleFontsize
	      }];
	      newArt.addChild(SubTitle);
	      SubTitle.moveInParentCoordinates(12, 129);
	      //********************************************************
	      ////console.log(FontDefault.fill.value);
	      // // create content
	      // const LabelBase = new Text();
	      // LabelBase.text = `This artboard was generated via Kalipso XD plugin, we added some colors and font sizes to your assets as an example! `;
	      // LabelBase.name = "label-base";
	      // LabelBase.styleRanges = [{
	      //   length: LabelBase.text.length,
	      //   fill: bodyForeground,
	      //   fontSize: bodyDefaultFontSize
	      // }];
	      // newArt.addChild(LabelBase);
	      // LabelBase.moveInParentCoordinates(12, 200);
	      //********************************************************
	      // create label
	      const LabelButton = new Rectangle();
	      LabelButton.name = "border";
	      LabelButton.fill = bodyAccent;
	      LabelButton.width = 80;
	      LabelButton.height = 28;
	      LabelButton.stroke = bodyAccent;
	      newArt.addChild(LabelButton);
	      LabelButton.moveInParentCoordinates(80, 342);
	      const ButtonText = new Text();
	      ButtonText.text = "Ok";
	      ButtonText.name = "text";
	      ButtonText.styleRanges = [{
	      	length: ButtonText.text.length,
	      	fill: bodyBackground,
	      	fontSize: bodyDefaultFontSize
	      }];
	      newArt.addChild(ButtonText);
	      ButtonText.moveInParentCoordinates(111, 360);
	      scenegraph.selection.items = [LabelButton, ButtonText];
	      commands.group();
	      let group = scenegraph.selection.items[0];
	      group.name = 'button';
	      //scenegraph.selection.items = [newArt];
	  }
	  catch (ex) {
	      //console.log("Failed", ex);
	  }
	});
}
function Tablet() {
	require("application").editDocument((documentRoot, selection) => {
		try {
			GetColors();
			Style("Tablet");
			let artWidth = 600;
			let artHeight = 365;
			let commands = require("commands");
			var newArt = new Artboard();
			let xpos = 0;
			let ypos = 0;
	      //********************************************************
	      //   if (documentRoot.children.length>0)
	      //   {
	      //     // se já existe um artboard saca o x + width
	      //     let childNode = documentRoot.children.at(0);
	      //     ////console.log (childNode);
	      //     xpos = childNode.globalDrawBounds.x + childNode.globalDrawBounds.width + 40;
	      //     ypos = childNode.globalDrawBounds.y;
	      //     ////console.log (xpos,ypos);
	      //   }
	      //********************************************************
	      // create header
	      newArt.name = "Kalipso default tablet";
	      newArt.width = artWidth;
	      newArt.height = artHeight;
	      newArt.fillEnabled = true;
	      newArt.fill = bodyBackground;
	      scenegraph.root.addChild(newArt, 0)
	      scenegraph.selection.items = [newArt];
	      newArt.moveInParentCoordinates(xpos, ypos);
	      //********************************************************
	      const Header = new Rectangle();
	      Header.width = artWidth;
	      Header.height = 50;
	      Header.name = "header";
	      Header.fill = headerBackgroundColor;
	      Header.stroke = headerBackgroundColor;
	      newArt.addChild(Header);
	      Header.moveInParentCoordinates(0, 0);
	      viewport.scrollIntoView(newArt)
	      //********************************************************
	      // create sub-header
	      const SubHeader = new Rectangle();
	      SubHeader.width = artWidth;
	      SubHeader.height = 30;
	      SubHeader.name = "subHeader";
	      SubHeader.fill = headerAccentColor;
	      SubHeader.stroke = headerAccentColor;
	      newArt.addChild(SubHeader);
	      SubHeader.moveInParentCoordinates(0, 50);
	      //********************************************************
	      // create header title
	      const HeaderTitle = new Text();
	      HeaderTitle.text = "Header";
	      HeaderTitle.name = "header";
	      HeaderTitle.styleRanges = [{
	      	length: HeaderTitle.text.length,
	      	fill: headerForegroundColor,
	      	fontSize: headerFontSize
	      }];
	      newArt.addChild(HeaderTitle);
	      HeaderTitle.moveInParentCoordinates(12, 35);
	      //********************************************************
	      // create header sb title
	      const SubHeaderTitle = new Text();
	      SubHeaderTitle.text = "Subheader";
	      SubHeaderTitle.name = "subheader";
	      SubHeaderTitle.styleRanges = [{
	      	length: SubHeaderTitle.text.length,
	      	fill: headerForegroundColor,
	      	fontSize: subheaderFontSize
	      }];
	      newArt.addChild(SubHeaderTitle);
	      SubHeaderTitle.moveInParentCoordinates(12, 70);
	      //********************************************************
	      // create title
	      const Title = new Text();
	      Title.text = "Title";
	      Title.name = "title";
	      Title.styleRanges = [{
	      	length: Title.text.length,
	      	fill: bodyForeground,
	      	fontSize: bodyTitleFontSize
	      }];
	      newArt.addChild(Title);
	      Title.moveInParentCoordinates(12, 100);
	      //********************************************************
	      // create sub title
	      const SubTitle = new Text();
	      SubTitle.text = "Sub Title";
	      SubTitle.name = "subtitle";
	      SubTitle.styleRanges = [{
	      	length: SubTitle.text.length,
	      	fill: bodyForeground,
	      	fontSize: bodySubtitleFontsize
	      }];
	      newArt.addChild(SubTitle);
	      SubTitle.moveInParentCoordinates(12, 129);
	      //********************************************************
	      // create label
	      const LabelButton = new Rectangle();
	      LabelButton.name = "border";
	      LabelButton.fill = bodyAccent;
	      LabelButton.width = 80;
	      LabelButton.height = 28;
	      LabelButton.stroke = bodyAccent;
	      newArt.addChild(LabelButton);
	      LabelButton.moveInParentCoordinates(artWidth / 2 - 40, artHeight - 80);
	      const ButtonText = new Text();
	      ButtonText.text = "Ok";
	      ButtonText.name = "text";
	      ButtonText.styleRanges = [{
	      	length: ButtonText.text.length,
	      	fill: bodyBackground,
	      	fontSize: bodyDefaultFontSize
	      }];
	      newArt.addChild(ButtonText);
	      ButtonText.moveInParentCoordinates(artWidth / 2 - 10, artHeight - 60);
	      scenegraph.selection.items = [LabelButton, ButtonText];
	      commands.group();
	      let group = scenegraph.selection.items[0];
	      group.name = 'button';
	      scenegraph.selection.items = [newArt];
	  }
	  catch (ex) {
	      //console.log("Failed", ex);
	  }
	});
}

function ExportOk() {

	require("application").editDocument(async (documentRoot, selection) => {
		try {
	      //console.log("Selected " + mySelectedArtBoard);
	      if (!mySelectedArtBoard instanceof Artboard) {
	      	const { alert, error } = require("./lib/dialogs.js");
	      	alert("Export as Kalipso Style",
	      		"Please select an artboard or a object within a artboard!");
	      	return;
	      }
	      //console.log("start");
	      const pluginFolder = await fs.getPluginFolder();
	      if (pluginFolder == "") {
	      	const { alert, error } = require("./lib/dialogs.js");
	      	alert("Export as Kalipso Style",
	      		"Operation canceled!");
	      	return;
	      }
	      var renditionOptions;
	      SelectedStyleName = document.getElementById("stylename").value;
	      //console.log("style name is " + SelectedStyleName);
	      if (SelectedStyleName == "newstyle.css" || SelectedStyleName == "") {
	      	const { alert, error } = require("./lib/dialogs.js");
	      	alert("Operation canceled!",
	      		"A file name is required!");
	      	return;
	      }

	      Default_CascadeStyleSheet = await pluginFolder.getEntry("Default.css");
	      //console.log("default css is  " + Default_CascadeStyleSheet);
	      if (Default_CascadeStyleSheet == null || Default_CascadeStyleSheet == "") {
	      	const { alert, error } = require("./lib/dialogs.js");
	      	alert("A file is missing from the plugin!Please contact the plugin developers to report this error!",
	      		"Operation canceled!");
	      	return;
	      }

	      // lê css do ficheiro que existe ou do default,perguntar ao utilizador se é para anexar ou substituir
	      try {
	      	Project_CascadeStyleSheet_File = await styleFolder.getEntry(SelectedStyleName + ".css");
	        //console.log("leu ficheiro de projeto?" + Project_CascadeStyleSheet_File);
	        Default_CascadeStyleSheet_Content = await Project_CascadeStyleSheet_File.read();
	    }
	    catch
	    {
	    	styleFolder = await fs.getFolder();
	    	Project_CascadeStyleSheet_File = await styleFolder.createEntry(SelectedStyleName + ".css", { overwrite: true });
	        //console.log("criou ficheiro de projeto novo" + Project_CascadeStyleSheet_File);
	        Default_CascadeStyleSheet_Content = await Default_CascadeStyleSheet.read();
	    }


	    if (styleFolder == null || styleFolder == "") {
	    	const { alert, error } = require("./lib/dialogs.js");
	        alert("Export as Kalipso Style", //[1]
	          "The user styles folder is required!"); //[2]
	        return;
	    }
	      //console.log("style folder is " + styleFolder);


	      //console.log("style file name is  " + Project_CascadeStyleSheet_File);
	      try {
	      	Resources_CascadeStyleSheet_Folder = await styleFolder.getEntry(SelectedStyleName + ".resources");
	        //console.log(Resources_CascadeStyleSheet_Folder);
	    }
	    catch
	    {
	    	Resources_CascadeStyleSheet_Folder = await styleFolder.createFolder(SelectedStyleName + ".resources", { overwrite: true });
	        //console.log(Resources_CascadeStyleSheet_Folder);
	    }
	    try {
	    	preview = await styleFolder.getEntry(SelectedStyleName + ".preview");
	    }
	    catch
	    {
	    	try
	    	{
		    	preview = await styleFolder.createFile(SelectedStyleName + ".preview", { overwrite: true });
		    	renditionOptions = [{ node: mySelectedArtBoard, outputFile: preview, type: application.RenditionType.PNG, scale: 1 }];
		    	await application.createRenditions(renditionOptions);
	    	}
		    catch
		    {
		    	console.log ("Não gravou imagem");
		    }
	    }

	    var type = "smartphone";
	    if (mySelectedArtBoard.width > mySelectedArtBoard.height)
	    	type = "tablet"
	    GetColors()
	    GetUpdatedFonts();
	    try 
	    {
	    	root = root.replace("[Header Background]", headerBackgroundColor.toHex(true).toString());
	    	root = root.replace("[Header Foreground]", headerForegroundColor.toHex(true).toString());
	    	root = root.replace("[Header Accent]", headerAccentColor.toHex(true).toString());
	    	root = root.replace("[Body Background]", mySelectedArtBoard.fill.toHex(true).toString());
	    	root = root.replace("[Body Foreground]", bodyForeground.toHex(true).toString());
	    	root = root.replace("[Body Accent]", bodyAccent.toHex(true).toString());
	    	root = root.replace("[Header]", headerFontSize);
	    	root = root.replace("[SubHeader]", subheaderFontSize);
	    	root = root.replace("[Title]", bodyTitleFontSize);
	    	root = root.replace("[Subtitle]", bodySubtitleFontsize);
	    	root = root.replace("[Default]", bodyDefaultFontSize);
	    	root = root.replace("[ArtWidth]", mySelectedArtBoard.width);
	    	root = root.replace("[ArtHeight]", mySelectedArtBoard.height);
	    	root = root.replace("[Device Type]", type);

	    }  
	    catch
	    {
	    	console.log("não gravou cores");
	    }

	    eraseSelector(":root")
	    Default_CascadeStyleSheet_Content = root + Default_CascadeStyleSheet_Content.toString();
	    await exportImages();
	    await CreateSelectors();
	}
	catch (ex) {
		console.log("Failed", ex);
	}
});
}
function CancelExport() {
	document.getElementById("NewStyle").style.display = "none";
	document.getElementById("main").style.display = "block";
}

function Export() {
	require("application").editDocument(async (documentRoot, selection) => {
		try {
			document.getElementById("NewStyle").style.display = "block";
			document.getElementById("main").style.display = "none";
	      //exportHandlerFunction(selection, documentRoot)
	  }
	  catch
	  {
	  }
	});
}


async function exportImages() {

	let children = [];
	let groups = [];
	let images = [];
	let root_groups = [];
	let root_images = [];
	let arritems = []; 
	groups = mySelectedArtBoard.children.filter(node => node instanceof scenegraph.Group);
	root_groups = scenegraph.root.children.filter(node => node instanceof scenegraph.Group);
	root_images = scenegraph.root.children.filter(node => (typeof node.fill != 'undefined' && node.fill != null && node.fill.toString().includes('ImageFill') != ''));
	images = mySelectedArtBoard.children.filter(node => (typeof node.fill != 'undefined' && node.fill != null && node.fill.toString().includes('ImageFill') != ''));
	children = children.concat(groups).concat(root_groups).concat(root_images).concat(images);

	if (children.length == 0) {
	    //console.log("sai sem imagens para tratar")
	    return;
	}

	try {

		children.forEach
		( 
			item => 
			{	

				const sitems = item.children;
				var nesteditems = sitems.length;

				if ( nesteditems > 0 )
				{
					sitems.forEach(
						sitem => 
						{

		    			//if (sitem instanceof scenegraph.Group || sitem.fill instanceof scenegraph.ImageFill) -- comentado para permitir gravar imagens em grupos só com um filho
		    			//{
		    				if(item.name.substr(0, 6) == "image-")
		    				{
		    					sitem.name = item.name;
		    					// exporta porque é um grupo dentro de um grupo com prefixo imagem (adv style)
		    					arritems.push (sitem)
		    				} 
		    			//}
		    		});
				}
				else
				{
					if(item.name.substr(0, 6) == "image-")
					{
						// exporta porque é um grupo dentro de um grupo com prefixo imagem (adv style)
						arritems.push (item)
					} 
				}    
			});

		let arr = arritems.map( async item =>
		{

			const file = await Resources_CascadeStyleSheet_Folder.createFile(`${item.name}.png`, { overwrite: true });
			let obj = {};
			obj.node = item
			obj.outputFile = file;
			obj.type = "png";
			obj.scale = 4;
			return obj;

		});
		
		if (arr.length > 0) {
			var renditions = await Promise.all(arr);
	      renditions = renditions.filter(item => item);  // remove os duplicados
	      await application.createRenditions(renditions);
	  }
	}
	catch (err) {
		console.log("error in rendition:" + err);
	}
}


async function CreateSelectors() {

	try {
		var selectortype = "";
		var NAME = null;
		var WIDTH = null;
		var HEIGHT = null;
		var NAME = null;
		var TYPE = 'Customized';
		var BACKGROUNDCOLOR = '-1';
		var FOREGROUNDCOLOR = 'var(--body-foreground)';
		var ADVANCEDSTYLE = 'No';
		var IMAGEX = null;
		var IMAGEY = null;
		var TEXTX = null;
		var TEXTY = null;
		var IMAGE = null;
		var IMAGEWIDTH = null;
		var IMAGEHEIGHT = null;
		var BORDERCOLOR = '-1';
		var BORDERTHICKNESS = '0';
		var GBLX = '0';
		var GBLY = '0';
		var ADVANCEDSTYLE = 'Yes';
		var FONT = 'var(--font)';
		var FONTSIZE = 12;
		var ROUNDEDCORNERS = 'No';
		var OPACITY = "100";
		var KTYPE = "Rectangle"
		var WEIGHT = null;
		let objects = [];

		objects = mySelectedArtBoard.children;

		objects.forEach(async item => 
		{

	    	// SET DEFAULTS
	    	selectortype = "image-";
	    	NAME = item.name;OPACITY = "100";TYPE = 'Default';
	    	BACKGROUNDCOLOR = '-1'; FOREGROUNDCOLOR = 'var(--body-foreground)';
	    	ADVANCEDSTYLE = 'No'; IMAGEX = null; IMAGEY = null; TEXTX = null; TEXTY = null; IMAGEWIDTH = null; IMAGEHEIGHT = null;
	    	BORDERCOLOR = '-1'; BORDERTHICKNESS = '0';ROUNDEDCORNERS = 'No';
	    	GBLX = '0'; GBLY = '0';
	    	FONT = 'var(--font)'; FONTSIZE = "12";OPACITY = Math.ceil(item.opacity )* 100;WIDTH = Math.ceil(item.boundsInParent.width);HEIGHT = Math.ceil(item.boundsInParent.height);
	    	

	    	if (item.children === undefined) 
	    	{
	    		var nesteditems = 0;
	    	}
	    	else 
	    	{
	    		const children = item.children;
	    		var nesteditems = children.length;
	    	}
	    	if (nesteditems === 0) 
	    	{

	    		if (item instanceof scenegraph.Rectangle)
	    		{
	    			if (item.fill instanceof scenegraph.ImageFill)
	    			{
	    				selectortype = "image-";
	    				IMAGE = item.name + ".png"; 
	    				BACKGROUNDCOLOR = '-1';
	    			}
	    			else
	    			{
	    				TYPE = 'Rectangle';
	    				selectortype = "shape-";
	    				BACKGROUNDCOLOR = item.fill.toHex(true);
	    				if (item.strokeEnabled > 0)
	    				{
	    					BORDERCOLOR = item.stroke.toHex(true);
	    					BORDERTHICKNESS = item.strokeWidth;
	    					
	    				}
	    				else
	    				{
	    					BORDERCOLOR = null;
	    					BORDERTHICKNESS = null;
	    				}
	    				if (item.hasRoundedCorners)
	    				{
	    					ROUNDEDCORNERS = item.cornerRadii.topLeft;
	    				}
	    			}
	    		}

	    		else if (item instanceof scenegraph.Ellipse)
	    		{
	    			TYPE = 'Ellipse';
	    			selectortype = "shape-";
	    			BACKGROUNDCOLOR = item.fill.toHex(true);
	    			if (item.strokeEnabled)
	    			{
	    				if (item.stroke == undefined)
	    				{ 
	    				} 
	    				else
	    				{
	    					BORDERCOLOR = item.stroke.toHex(true);
	    					BORDERTHICKNESS = item.strokeWidth;
	    				}
	    			}
	    			else
	    			{
	    				BORDERCOLOR = null;
	    				BORDERTHICKNESS = null;
	    			}
	    		}
	    		else if (item instanceof scenegraph.Text) 
	    		{
	    			WEIGHT = item.fontStyle;
	    			selectortype = "label-";
	    			FONTSIZE = item.fontSize;
	    			FONT = item.fontFamily;
	    			if (item.fill === undefined)
	    			{
	    				FOREGROUNDCOLOR = bodyForeground.toHex(true);
	    			}
	    			else
	    			{
	    				FOREGROUNDCOLOR = item.fill.toHex(true);
	    			};

	    			BACKGROUNDCOLOR = -1;
	    		}
	    	}
	    	else 
	    	{
	    		OPACITY = item.opacity * 100;
	    		selectortype = "image-";
	    		TYPE = 'Customized'; WIDTH = Math.ceil(item.boundsInParent.width); HEIGHT = Math.ceil(item.boundsInParent.height);
	    		WIDTH = Math.ceil(item.boundsInParent.width);
	    		HEIGHT = Math.ceil(item.boundsInParent.height);
	    		GBLX = item.boundsInParent.x; GBLY = item.boundsInParent.y;
	    		var items = [];
	    		items = item.children;
	    		items.forEach(sitem => {
	    			console.log(" multi selector - subitem ", "\n", sitem)
		          if (sitem instanceof scenegraph.Rectangle && !sitem.name == item.name) // se o nome tiver o mesmo nome do item faz bypass 
		          {
		          	if (sitem.strokeEnabled)
		          	{
		          		if (sitem.stroke == undefined) { } else
		          		{
		          			BORDERCOLOR = sitem.stroke.toHex(true);
		          			BORDERTHICKNESS = sitem.strokeWidth;
		          		}
		          	}
		          	else
		          	{
		          		BORDERCOLOR = null;
		          		BORDERTHICKNESS = null;
		          	}

		          	if (sitem.hasRoundedCorners) {
		          		ROUNDEDCORNERS = sitem.cornerRadii.topLeft;
		          	}
		          	if (sitem.fill instanceof scenegraph.ImageFill) 
		          	{
		          		IMAGEWIDTH = Math.ceil(sitem.boundsInParent.width);
		          		IMAGEHEIGHT = Math.ceil(sitem.boundsInParent.height);
		          		IMAGEX = Math.ceil(sitem.boundsInParent.x);
		          		IMAGEY = Math.ceil(sitem.boundsInParent.y);
		          		ADVANCEDSTYLE = 'Yes';
		          		selectortype = "image-";
		          	}
		          }
		          else if (sitem instanceof scenegraph.Group)
		          {
		          	IMAGEWIDTH = Math.ceil(sitem.boundsInParent.width);
		          	IMAGEHEIGHT = Math.ceil(sitem.boundsInParent.height);
		          	IMAGEX = Math.ceil(sitem.boundsInParent.x );
		          	IMAGEY = Math.ceil(sitem.boundsInParent.y);
		          	ADVANCEDSTYLE = 'Yes';
		          	selectortype = "image-";
		          }
		          else if (sitem instanceof scenegraph.Text) {
		          	BACKGROUNDCOLOR = -1;
		          	FONTSIZE = sitem.fontSize;
		          	WEIGHT = sitem.fontStyle;
		          	FONT = sitem.fontFamily;
		          	TEXTX = Math.ceil(sitem.boundsInParent.x);
		          	TEXTY = Math.ceil(sitem.boundsInParent.y);
		          	if (sitem.fill != null) {
		          		var isColorHex = sitem.fill.toHex(true) != null ? true : false;
		          		if (isColorHex) {
		          			FOREGROUNDCOLOR = sitem.fill.toHex(true);
		          		}
		          	}
		          }
		      });

	    	}
	    	var isexception = false;

	    	if (item.name.substr(0, 6) == "image-")
	    	{
	    		selectortype = "image-";
	    		isexception = true;
	    		var newselector = selectorimage;
	    	} 
	    	else if (item.name.substr(0, 6) == "shape-")
	    	{
	    		selectortype = "shape-";
	    		isexception = true;
	    		var newselector = selectorShape;
	    	}
	    	else if (item.name.substr(0, 7) == "button-")
	    	{
	    		selectortype = "button-";
	    		isexception = true;
	    		var newselector = SelectorButton;
	    	}
	    	else if (item.name.substr(0, 6) == "label-") 
	    	{
	    		selectortype = "label-";
	    		isexception = true;
	    		var newselector =SelectorLabel;
	    	}
	    	else if (item.name.substr(0, 5) == "icon-") 
	    	{
	    		selectortype = "image-";
	    		isexception = true;
	    		var newselector = selectorimage;
	    	}
	    	else if (item.name.substr(0, 5) == "input-") 
	    	{
	    		selectortype = "input-";
	    		isexception = true;
	    		var newselector = SelectorInput;
	    	}
	    	if (isexception == true)
	    	{
	    		NAME = item.name
	    	}
	    	else 
	    	{
	    		NAME = selectortype + item.name
	    	}
	    	NAME = NAME.replace(' ' ,'');
	    	NAME = NAME.replace('_' ,'');

	      //NAME = removeDiacritics(NAME);

	      if (NAME.substr(0, 5) == "icon-")
	      {
	      	NAME = NAME.replace('icon' ,'image');
	      }

	      console.log("prepara " ,"\n",newselector)

	      newselector = newselector.replace('[OPACITY]', OPACITY);
	      newselector = newselector.replace('[WIDTH]', WIDTH);
	      newselector = newselector.replace('[HEIGHT]', HEIGHT);
	      newselector = newselector.replace('[NAME]', NAME);
	      newselector = newselector.replace('[BACKGROUNDCOLOR]', BACKGROUNDCOLOR);
	      newselector = newselector.replace('[FOREGROUNDCOLOR]', FOREGROUNDCOLOR);
	      newselector = newselector.replace('[IMAGE]', IMAGE);
	      newselector = newselector.replace('[ADVANCEDSTYLE]', ADVANCEDSTYLE);
	      newselector = newselector.replace('[IMAGEWIDTH]', IMAGEWIDTH);
	      newselector = newselector.replace('[IMAGEHEIGHT]', IMAGEHEIGHT);
	      newselector = newselector.replace('[IMAGEX]', IMAGEX);
	      newselector = newselector.replace('[IMAGEY]', IMAGEY);
	      newselector = newselector.replace('[TEXTX]', TEXTX);
	      newselector = newselector.replace('[TEXTY]', TEXTY);
	      newselector = newselector.replace('[BORDERCOLOR]', BORDERCOLOR);
	      newselector = newselector.replace('[TYPE]', TYPE);
	      newselector = newselector.replace('[FONT]', FONT);
	      newselector = newselector.replace('[WEIGHT]', WEIGHT);
	      newselector = newselector.replace('[FONTSIZE]', FONTSIZE);
	      newselector = newselector.replace('[CORNERRADIUS]', ROUNDEDCORNERS);
	      if (ROUNDEDCORNERS > 0) {
	      	newselector = newselector.replace('[ROUNDEDCORNERS]', "Specify Radius");
	      }
	      else 
	      {
	      	newselector = newselector.replace('[ROUNDEDCORNERS]', "No");
	      }
	      if (BORDERCOLOR != BACKGROUNDCOLOR) 
	      {
	      	newselector = newselector.replace('[BORDER]', BORDERTHICKNESS);
	      	newselector = newselector.replace('[BORDERTOP]', 'Yes');
	      	newselector = newselector.replace('[BORDERBOTTOM]', 'Yes');
	      	newselector = newselector.replace('[BORDERLEFT]', 'Yes');
	      	newselector = newselector.replace('[BORDERRIGHT]', 'Yes');
	      	newselector = newselector.replace('[CORNERRADIUS]', ROUNDEDCORNERS);
	      }
	      else
	      {
	      	newselector = newselector.replace('[BORDER]', '0');
	      	newselector = newselector.replace('[BORDERTOP]', 'No');
	      	newselector = newselector.replace('[BORDERBOTTOM]', 'No');
	      	newselector = newselector.replace('[BORDERLEFT]', 'No');
	      	newselector = newselector.replace('[BORDERRIGHT]', 'No');
	      }

	      Default_CascadeStyleSheet_Content = Default_CascadeStyleSheet_Content + newselector;
	  });
console.log(" write selectors to file");
await Project_CascadeStyleSheet_File.write(Default_CascadeStyleSheet_Content);
}
catch (err) {
	console.log("error in rendition:" + err);
}
}

function eraseSelector(str_to_search) {
	var content = Default_CascadeStyleSheet_Content
	var x = content.search(str_to_search);
	console.log("str_to_search", "\n", str_to_search)
	console.log("content.search(str_to_search) returned: ", "\n", x)
	if (x == -1)
		return;
	var part1 = content.substring(x - 1);
	var y = part1.search("}");
	console.log("y:" + y)
	var to_remove = content.substr(x, part1.length + y + 1);
	console.log("to remove:", "\n", to_remove)
	Default_CascadeStyleSheet_Content = Default_CascadeStyleSheet_Content.replace(to_remove, '');
}

function update() {
	let formOptions = document.getElementById("objects");


	if (selection)
	{

			//TESTE
			/*
			if (selection.items[0] instanceof scenegraph.Text )
			{
				const { alert, error } = require("./lib/dialogs.js");
				alert("Selected item boundsInParent", 
				selection.items[0].fontStyle );  
			}
			const { alert, error } = require("./lib/dialogs.js");
				alert(selection.items[0] ,selection.items[0].parent);
	 	 
				*/
			//TESTE

			let formOptions = document.getElementById("objects");
			let NoobjDiv = document.getElementById("NObj");
			if (selection.items[0].parent instanceof Artboard)
			{
				mySelectedArtBoard = scenegraph.selection.items[0].parent;

		 		
				formOptions.style.display = "block";
				NoobjDiv.style.display = "none";
				document.getElementById("SelectedBoardLabel").innerHTML  = mySelectedArtBoard.name;
				document.getElementById("export").style.display = "block";
			}
			else if (selection.items[0] instanceof Artboard)
			{
				mySelectedArtBoard = scenegraph.selection.items[0];
				formOptions.style.display = "block";
				NoobjDiv.style.display = "none";
				document.getElementById("SelectedBoardLabel").innerHTML  = mySelectedArtBoard.name;
				document.getElementById("export").style.display = "block";
			}
			else
			{
				formOptions.style.display = "none";
				NoobjDiv.style.display = "block";
				document.getElementById("export").style.display = "none";
			}
		} else
		{
			formOptions.style.display = "none";
			NoobjDiv.style.display = "block";
			document.getElementById("export").style.display = "none";
		}
	}

	function removeDiacritics(str) {
	  // return str.replace(/[^A-Za-z0-9\s]+/g, function(a){
	  //    return diacriticsMap[a] || a; 
	  // });
	}
	removeDiacritics(teste);

	module.exports = {
		panels: {
			kalipsoPluginPanel: {
				show,
				update
			}
		}
	};



	 /*  
	   const { alert, error } = require("./lib/dialogs.js");
	        alert("Selected item", 
	          selection.items[0].parent); 
	          */
