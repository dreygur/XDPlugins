const utils = require("./utils");

function layoutCircle (obj) {

	let sel = obj.selection;
    let selItems = sel.items;
	let selLen = selItems.length;

    //---------------
    // SELECTION
    //---------------
    // If we are dealing with Artboards then move on...
    // Else we need to check groups and parents etc
    let hasArtboards = sel.hasArtboards;

    if (hasArtboards === false) {
        selItems = utils.prepareSelection(obj);
        selLen = selItems.length;
    }
	//---------------
    // Properties
    //---------------
    let radiusW = obj.sizeW / 2;
    let radiusH = obj.sizeH / 2;
    let itemW = 0;
    let itemH = 0;

    let finalPos = {x:0, y:0};

    // Random Order
    if (obj.randomOrderActivated === true) {
        selItems = utils.shuffleArray(selItems);
    }

    // Angles
    const angleOffset = -90;
    let angleStart = obj.startAngle + angleOffset;
    let angleEnd = obj.endAngle + angleOffset;
    let angleDiff = 0;

    if (obj.direction === false) // cw
    {
        angleDiff = angleEnd - angleStart;
    }
    else if (obj.direction === true) // ccw
    {
        angleDiff = angleStart - angleEnd;
        if (angleDiff <= 0)
        {
            angleDiff += 359;
        }
        else if (angleDiff > 0)
        {
            angleDiff -= 359;
        }
    }

    angleStart = Math.radians(angleStart);
    angleEnd = Math.radians(angleEnd);
    angleDiff = Math.radians(angleDiff);
    
    let angle = angleStart;
    let step = (2 * Math.PI) / selLen;

    if (obj.endAngleActivated === true)
    {
        let correctionValue = 0;
        if (obj.adjustLastItemActivated === true) {
            correctionValue = 1;
        }
        step = (angleDiff) / (selLen - correctionValue);
    }

    // Orientation
    let adjustValueOrientation = 0;
    if (obj.orientation === 1) adjustValueOrientation = 90; // Up
    else if (obj.orientation === 2) adjustValueOrientation = 270; // Down
    else if (obj.orientation === 3) adjustValueOrientation = 0; // Left
    else if (obj.orientation === 4) adjustValueOrientation = 180; // Right

    //---------------
    // Arrange items
    //---------------
	for (let i=0; i<selLen; i++)
    {
        // current item
        let item = selItems[i];

        // let localBounds = item.localBounds;
        // let globalBounds = item.globalBounds;
        let parentBounds = item.boundsInParent;
        let nodeBounds = parentBounds; // globalBounds; // item.globalBounds;

       	itemW = nodeBounds.width;
        itemH = nodeBounds.height;

        // --------------------
        // Calc position values
        // --------------------
        let xNew = obj.x + (radiusW * Math.cos(angle));
        let yNew = obj.y + (radiusH * Math.sin(angle));

        finalPos.x = xNew;
        finalPos.y = yNew;

        let nodeCenterPoint = item.localCenterPoint;
        item.placeInParentCoordinates(nodeCenterPoint, finalPos);

        // Direction
        if (obj.direction === false) angle += step;
        else if (obj.direction === true) angle -= step;

        //---------------
        // Look At Center
        //---------------
        // Artboards are not allowed to have any rotation transforms
        if (hasArtboards === false) {

            let targetAngle = 0;

            if (obj.orientation === 0) {
                targetAngle = 0;
                adjustValueOrientation = 0;
            } else {
                targetAngle = calculateAngle([obj.x, obj.y], [finalPos.x, finalPos.y]);
            }

            let rotationDelta = targetAngle - item.rotation + adjustValueOrientation;
            item.rotateAround(rotationDelta, item.localCenterPoint);
        }
    }
}

//---------
// UTILS
//---------
function calculateAngle(p1, p2){
    return Math.atan2(p2[1] - p1[1],
                      p2[0] - p1[0]) * 180 / Math.PI;
}

// Converts from degrees to radians.
Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};
 
// Converts from radians to degrees.
Math.degrees = function(radians) {
  return radians * 180 / Math.PI;
};


module.exports = {
    layoutCircle: layoutCircle
};