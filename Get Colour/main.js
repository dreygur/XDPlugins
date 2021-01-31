// @TODO
/*

xd bug - textarea size increases when dialog shows
bug - hsl doesn't support decimals in hsl values

fea Option to include variable names find colour then preceding $
fea get colour summary in realtime.

*/
const viewport = require("viewport");
const { alert, error } = require("./lib/dialogs.js");

let panel;

function create() {
  // [1]
  const html = `
<style>
  .break {
    flex-wrap: wrap;
  }
  label.row > * {
    margin: 3px 0;
  }
  label {
  	font-size: 12px;
  }
  p {
  	font-size:12px;
  }
  p.note {
  	font-size: 9px;
  }
  label.row > span {
    color: #8e8e8e;
    width: 20px;
    text-align: right;
    font-size: 9px;
  }
  label.row input {
    flex: 1 1 auto;
  }
  label.row textarea {
    flex: 1 1 auto;
  }
  label.row input[type="number"] {
    flex-basis: 32px;
  }
  div input[type="checkbox"] {
    flex: 0 0 20px;
  }
  form footer > * {
    position: relative;
    left: 8px;
  }
  form {
    max-width: 100%;
  }
  textarea,
  textarea:disabled {
  	max-width: 100%;
    height: 180px;
  }
</style>
<p class="small">Grab your colour codes from your stylesheet and paste them below.</p>

<form method="dialog" id="main">
        
        <label class="row">
        	<textarea id="allVars" placeholder="$primary: #ff0054;&#10;$secondary: rgba(240,0,0,0.9);"></textarea>
        </label>

        <em>Colours will be automatically added to your assets</em>

        <div class="row">
        	<input id="option2" type="checkbox">
        	<label class="row">Also add to canvas</label>
        </div>
    
    <footer><button disabled id="ok" type="submit" uxp-variant="cta">Get Colour</button></footer>
</form>`;

function matchClr(str){
	var match = String(str).match(/(#([\da-f]{3}){1,2}|(rgb|hsl)a\((\d{1,3}%?,\s?){3}(1|0?\.\d+)\)|(rgb|hsl)\(\d{1,3}%?(,\s?\d{1,3}%?){2}\))/ig);
  	return match ? match[0] : 0 ;
}

async function msgNotFound() {
    /* we'll display a dialog here */
    alert("No colours found", "Make sure you input or paste your colour variables or styles into the provided text field.",
    	"Example: $primary: #ff0054;",
    	"Supported colour formats:",
    	"* Hex",
    	"* RGB/RGBA",
    	"* HSL/HSLA",
    	);    
}

async function msgAddedToAssets(n) {
    /* we'll display a dialog here */
    alert("Sweet as!", n+" colours added to your document assets."); 
}


function getClr() { // [2]
    const { editDocument } = require("application"); // [3]
    const { Rectangle, Color } = require("scenegraph");


    
    // [ on submit this runs]
    editDocument({ editLabel: "Get clr" }, function(selection) {
      var dataString = document.querySelector("#allVars").value;
      // var dataString = "// My brand colors $primary: #ff0054; $secondary: #FFEC19; $white: rgba(255,255,255,0.9); $success: #1FC3B0; $danger: #CB3A3A;"

      let swatches = [];

		//get all colours from string
		if(matchClr(dataString)) {
			
			// console.log("Getting all colours");

				for (let i = 0; i<dataString.length; i++) {
					let n = dataString.indexOf(matchClr(dataString)), //find first occurance starting from position i
				      l = matchClr(dataString).length,
              b = swatches.includes(matchClr(dataString));

          //not at end AND not already added AND colour exists
          if(n != -1 && b !=true && matchClr(dataString)) {

						swatches.push(matchClr(dataString)); //add to swatches array
						dataString = dataString.substring(n+l); //enough to get past 'rgb'
						

					} else if (n.length < 1) {
						//finish
						return;
					}
				}
			console.log("Colours acquired init: "+swatches);

		} else {
      console.log("Not Found "+matchClr(dataString));
			//no colours found
			msgNotFound();
		}


		//add to canvas / assets
		if (swatches.length > 0) {
			// done hex loop add the assets
		    // const opt1 = document.querySelector("#option1");
		    const opt2 = document.querySelector("#option2");

			for (let i = 0; i<swatches.length; i++) {

			   
				//add colours to assets
				var assets = require("assets"),
	    			// newColor = new Color(swatches[i]),
    			newColor = new Color(swatches[i]),
		    		numAdded = assets.colors.add([
		        		newColor,
		        	]);

				if(opt2.checked) {
				  const newElement = new Rectangle();
				  newElement.width = 50;
				  newElement.height = 50;
				  newElement.fill = new Color(swatches[i]);

				  selection.insertionParent.addChild(newElement);
				  newElement.moveInParentCoordinates(50*i, 0);
				}
			}

			if(opt2.checked) viewport.scrollIntoView(50, 0, 50, 50);

			msgAddedToAssets(swatches.length);

      //reset form
			document.querySelector("#allVars").value = "";
      document.querySelector("#allVars").blur();
      document.getElementById("ok").disabled = true;
		} 
	});
  }

  panel = document.createElement("div"); // [9]
  panel.innerHTML = html; // [10]
  panel.querySelector("form").addEventListener("submit", getClr); // [11]

  return panel; // [12]

}



function show(event) { 
  if (!panel) event.node.appendChild(create()); 
}

function update() { // [1]
  const textarea = document.getElementById("allVars");

  textarea.addEventListener("input", function(){
	document.getElementById("ok").disabled = false;
	 if(!this.value) document.getElementById("ok").disabled = true;
  });

}

// [6]
module.exports = {
  panels: {
    getColour: {
      show,
      update
    }
  }
};