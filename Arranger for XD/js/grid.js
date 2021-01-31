const utils = require("./utils");

// Option B: Working with groups
function layoutGrid (obj) {
    // console.log("--> layoutGrid fired!");

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
    // console.log("hasArtboards: ", hasArtboards);

    if (hasArtboards === false) {
        selItems = utils.prepareSelection(obj);
        selLen = selItems.length;
    }


	//---------------
    // Properties
    //---------------
    // Columns and Rows
    let cols = 1;
    let rows = 1;
    
    let itemW = 0;
    let itemH = 0;

    // Gutter
    let gutterW = obj.gutterW;
    let gutterH = obj.gutterH;

    // Position
    let startX = 0;
    let startY = 0;

    if (obj.positionActivated === true) {
        startX = obj.x;
        startY = obj.y;
    }
    
    let xPos = 0;
    let yPos = 0;
    let finalPos = {x:0, y:0};

    // Random Order
    if (obj.randomOrderActivated === true) {
        selItems = utils.shuffleArray(selItems);
    }

    //---------------
    // SIZE OF FIRST ITEM AS REFERENCE
    //---------------
    let firstItem = selItems[0];
    let myBounds = firstItem.boundsInParent;
    // let myBounds = firstItem.localBounds;
    itemW = myBounds.width;
    itemH = myBounds.height;

    // console.log('firstItem.parent:', firstItem.parent);
	//---------------
    // Arrange Items
    //---------------
    for (var i=0; i<selLen; i++) {
        //------------
        // current item
        //------------
        var item = selItems[i];
        let nodeCenterPoint = item.localCenterPoint;
        //------------
        // Calc Columns and Rows
        //------------
        cols = i % obj.cols;
        rows = Math.floor( i / obj.cols );

        //------------
        // Calc X and Y
        //------------
        finalPos.x = (( itemW + gutterW) * cols) + startX;
        finalPos.y = (( itemH + gutterH) * rows) + startY;
        // console.log('==== finalPos:', finalPos);

        item.placeInParentCoordinates(nodeCenterPoint, finalPos);
    }
}

module.exports = {
    layoutGrid: layoutGrid
};
