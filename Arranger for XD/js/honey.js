const utils = require("./utils");

// Option B: Working with groups
function layoutHoney (obj) {
    // console.log("--> layoutHoney fired! obj: ", utils);
    const {Rectangle, Ellipse, Polygon, Color, Path, selection} = require("scenegraph");

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
    let currentCol = 0;
    let currentRow = 0;
    
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
    // let myBounds = firstItem.boundsInParent;
    let myBounds = firstItem.localBounds;
    itemW = myBounds.width;
    itemH = myBounds.height;

    //---------------
    // Honeycomb
    //---------------
    // const isHoneycombActive = obj.honeycombActivated;
    const asymmLayout = obj.asymmetricalLayout;
    // console.log('asymmLayout:', asymmLayout);
    const alternateRows = obj.alternateRows;

    let offsetXValue = obj.offsetX; //itemW * .5;
    let offsetYValue = obj.offsetY; //itemH * .5;

    let offsetX = 0;
    let offsetY = 0;

    let colCount1 = obj.cols;
    let colCount2 = obj.cols - 1; //obj.cols - 1;

    if (asymmLayout === false) {
        colCount1 = obj.cols;
        colCount2 = obj.cols - 1;
    }
    else if (asymmLayout === true) {
        // Here don't make a difference between these two values
        colCount1 = obj.cols;
        colCount2 = obj.cols; //obj.cols - 1;
    }

    let counterCol = 0; // counts the current col
    let counterRow = 0; // counts the current row

    let flagForCounter = 0; // toggles between the rows
    let finalCol = 0;   // this goes into the data object
    let finalRow = 0;   // this goes into the data object
    //---------------
    // Generate Layout Data
    //---------------
    let dataLayout = [];

    let targetIndex = null;
    // Start conditions are different for
    // alternating rows
    if (alternateRows === false) {
        targetIndex = colCount1;
        flagForCounter = 0;
    }
    else if (alternateRows === true) {
        targetIndex = colCount2;
        flagForCounter = 1;
    }

    for (var i=0; i < selLen; i++) {

        if (i < targetIndex) {
            // console.log('++++++++');
            finalCol = counterCol;
            finalRow = counterRow;
            counterCol += 1;
        } else if (i == targetIndex) {
            // console.log('-------');
            counterCol = 0;
            finalCol = counterCol;
            counterCol += 1;

            counterRow += 1;
            finalRow = counterRow;

            // Update targetIndex
            if (flagForCounter == 0) {
                targetIndex = i + colCount2;
                flagForCounter = 1;
            }
            else if (flagForCounter == 1) {
                targetIndex = i + colCount1;
                flagForCounter = 0;
            }
        }

        let data = {};
        data.index = i;
        data.col = finalCol;
        data.row = finalRow;
        dataLayout.push(data);
    }

    // console.log('dataLayout:', dataLayout);

	//---------------
    // Arrange Items
    //---------------
    for (var i=0; i < selLen; i++) {
        //------------
        // current item
        //------------
        var item = selItems[i];
        let nodeCenterPoint = item.localCenterPoint;

        const dataPoint = dataLayout[i];
        currentCol = dataPoint.col;
        currentRow = dataPoint.row;

        //------------
        // Calc Columns and Rows
        //------------
        // Grid
        // currentCol = i % obj.cols;
        // currentRow = Math.floor( i / obj.cols );
        
        //------------
        // Honeycomb
        //------------
        // if (isHoneycombActive) {
            // x
            if (currentRow % 2 == 0) {
                
                if (alternateRows === false) offsetX = 0;
                else offsetX = offsetXValue + (gutterW * .5);

            } else if (currentRow % 2 != 0) {

                if (alternateRows === false) offsetX = offsetXValue + (gutterW * .5);
                else  offsetX = 0;
            }

            // y
            offsetY = offsetYValue;
        // }

        //------------
        // Calc X and Y
        //------------
        finalPos.x = ( (itemW + gutterW) * currentCol) + startX + offsetX;
        finalPos.y = ( (itemH + offsetY + gutterH) * currentRow) + startY;

        item.placeInParentCoordinates(nodeCenterPoint, finalPos);
    }
}

// Helpers

// function getAutoOffsetX (selection) {
function getAutoOffsetX () {
    const {selection} = require("scenegraph");
    const hasArtboards = selection.hasArtboards;
    if (hasArtboards === false) {
        const item = utils.getFirstItemOfInterest();
        if (item) {
            const bounds1 = item.localBounds;
            return bounds1.width * .5;
        }
    }
    return 0;
}


function getAutoOffsetY () {
    const {selection} = require("scenegraph");
    const hasArtboards = selection.hasArtboards;
    if (hasArtboards === false) {
        const item = utils.getFirstItemOfInterest();
        if (item) {
            const bounds1 = item.localBounds;
            return bounds1.height * .5;
        }
    }
    return 0;
}



module.exports = {
    layoutHoney,
    getAutoOffsetX,
    getAutoOffsetY
};
