const utils = require("./utils");

// console.log("wave.js 2 loaded...");

function layoutWave (obj) {
	// console.log("layoutWave fired! obj: ", obj);

    //---------------
    // BASICS
    //---------------
	let sel = obj.selection;
    let selItems = sel.items;
    let selLen = selItems.length;

    //---------------
    // SELECTION
    //---------------
    // If we are dealing with Artboards then move on...
    // Else we need to check groups and parents etc
    let hasArtboards = obj.selection.hasArtboards;
    if (hasArtboards === false) {
        selItems = utils.prepareSelection(obj);
        selLen = selItems.length;
    }

	//---------------
    // Properties
    //---------------
    let itemW = 0;
    let itemH = 0;

    // Period and Amplitude
    let period = 200;
    let amplitude = 50;

    // Distance and Angle
    let distance = 0;
    let startAngle = obj.startAngle;
    let angleStep = ((2 * Math.PI) / obj.period) * obj.distance;

    // Position
    let startX = 0;
    let startY = 0;
    let finalPos = {x:0, y:0};

    if (obj.positionActivated === true) {
        startX = obj.x;
        startY = obj.y;
    }

    // Random Order
    if (obj.randomOrderActivated === true) {
        selItems = utils.shuffleArray(selItems);
    }

	//---------------
    // Arrange Items
    //---------------
    for (let i=0; i<selLen; i++) {
        //------------
        // current item
        //------------
        let item = selItems[i];
        itemW = item.width;
        itemH = item.height;
        
        // Calc wave
        let xNew = startX + (i * obj.distance);
        let yNew = startY + (obj.amplitude * Math.sin(startAngle));

        finalPos.x = xNew;
        finalPos.y = yNew;

        let nodeCenterPoint = item.localCenterPoint;
        item.placeInParentCoordinates(nodeCenterPoint, finalPos);

        // Increment theta
        startAngle += angleStep;
    }
}

// --------
// UTILS
// --------
function shuffleArray(myArray) {
  let newArray = Array.from(myArray);

  for (let i = newArray.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // swap elements
  }

  return newArray;
}



module.exports = {
    layoutWave: layoutWave
};
