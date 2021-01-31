// const honeyJS = require("./honey");
// const utilsJS2 = require("./utils2");


function ping() {
	console.log("*** ping ***")
}

// ----------------------------
// SELECTION
// ----------------------------
function prepareSelection (obj) {
    // console.log('---- prepareSelection fired');
	//const { Group } = require("scenegraph");
    const commands = require("commands");

	let sel = obj.selection;
    let selItems = obj.selection.items;

	// let hasArtboards = obj.selection.hasArtboards;
 //    console.log("hasArtboards: ", hasArtboards);

 //    if (hasArtboards === false) {
        let isSameGroup = hasSameGroup(obj.selection.items);
        // console.log("isSameGroup: ", isSameGroup);

        let selArr = [];
        // --------------------
        //
        // We have 3 cases
        //
        // --------------------
        
        // -------------------
        // Case 1: only 1 item && item is a group
        // ==> work with children in that group
        // -------------------
        if (selItems.length === 1) {

            const selItem = selItems[0];
            let xTemp = selItem.boundsInParent.x;
            let yTemp = selItem.boundsInParent.y;
            let nodeCenterPoint = selItem.localCenterPoint;

            if ( isGroup(selItem) ) {
                // console.log('-- CASE 1: sel is 1 group');

                // v1 -------
                // var xTemp = selItem.boundsInParent.x - selItem.boundsInParent.width;
                // var yTemp = selItem.boundsInParent.y + (selItem.boundsInParent.height/2);

                // v2 -------
                // var xTemp = selItem.boundsInParent.x;
                // var yTemp = selItem.boundsInParent.y;

                // console.log('xTemp:', xTemp);
                // console.log('yTemp:', yTemp);

                // // Place group on coord of first item
                // selItem.placeInParentCoordinates( nodeCenterPoint, {x:xTemp,y:yTemp} );

                selItem.children.forEach(function (childNode, i) {
                    selArr.push(childNode);
                });

                selItems = selArr;
                // console.log("SPECIAL CASE: selItems.length: ", selItems.length);
            }

        } else {

            // -------------------
            // Case 2: items are not part of the same group
            // ==> create a group and work with children (our items)
            // -------------------
            if (isSameGroup === false) {
                // console.log('-- CASE 2: not same group - create group');
                var xTemp = selItems[0].boundsInParent.x - selItems[0].boundsInParent.width;
                var yTemp = selItems[0].boundsInParent.y + (selItems[0].boundsInParent.height/2);

                commands.group();
                let g = sel.items[0]; // <-- this is the newly created group
                // Place group on coord of first item
                g.placeInParentCoordinates( {x:0,y:0}, {x:xTemp,y:yTemp} );
                
                // collect children for internal selection
                g.children.forEach(function (childNode, i) {
                    selArr.push(childNode);
                });

                // obj.selection.items = selArr;
                selItems = selArr;
            }
            // -------------------
            // Case 3: items are part of the same group
            // ==> work on the selection (with children of that group)
            // -------------------
            else if (isSameGroup === true) {
                // console.log('-- CASE 3: same group');
                // -----------
                // Z-ORDER
                // -----------
                // We do this to get the selection in the right z-order
                // children are always returned sorted by z-order
                let groupParent = sel.items[0].parent; // <-- this is the first object of the initial selection

                // If we have the same number of children than we can assume
                // the user has selected all children, no additional check needed.
                //
                // Else there are more children than are selected
                // than we have to pick only the selected ones
                let selLen = sel.items.length;
                if (selLen === groupParent.children.length) {
                    groupParent.children.forEach(function (childNode, i) {
                        selArr.push(childNode);
                    });
                } else {
                    groupParent.children.forEach(function (childNode, i) {
                        if (childNode.selected === true) selArr.push(childNode);
                    });
                }

                obj.selection.items = selArr;
                selItems = selArr;
            };
        }
    // };

    return selItems;
}

function isGroup (item) {
    // console.log('-- isGroup fired');
    const { Group } = require("scenegraph");
    return item instanceof Group;
}

function hasSameGroup (itemsArr) {
    // console.log('-- hasSameGroup fired');
    const { Group } = require("scenegraph");
    // Step 1: is first item in a group
    let firstParent = itemsArr[0].parent;
    if (!(firstParent instanceof Group)) return false;

    // Step 2: have all items the same group as parent
    for (let i=1; i<itemsArr.length; i++) {
        if (firstParent.guid !== itemsArr[i].parent.guid) return false;
    }
    return true;
}


function getFirstItemOfInterest () {
    let item = undefined;
    const {selection} = require("scenegraph");
    // ----------------------------------
    // CASE 1: selection is empty
    // ----------------------------------
    if (selection.items.length === 0) {
        return undefined;
    }
    // ----------------------------------
    // CASE 2
    // selection = 1
    // ----------------------------------
    else if (selection.items.length === 1) {
        item = selection.items[0];

        // If item is a group than we assume that we will
        // arrange the children
        // therefore we will retrieve the first child
        if (isGroup(item) === true) {
            item = item.children.at(0);
        }
    }
    // ----------------------------------
    // CASE 3
    // selection is greater 1 
    // ----------------------------------
    else {
        item = selection.items[0];
    }

    return item;
}
// ----------------------------
// ARRAY
// ----------------------------
function shuffleArray(myArray) {
  let newArray = Array.from(myArray);

  for (let i = newArray.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // swap elements
  }

  return newArray;
}

// ----------------------------
// MATH
// ----------------------------
// Converts from degrees to radians.
// Math.radians = function(degrees) {
//   return degrees * Math.PI / 180;
// };
 
// // Converts from radians to degrees.
// Math.degrees = function(radians) {
//   return radians * 180 / Math.PI;
// };

module.exports = {
    ping,
    prepareSelection,
    isGroup,
    hasSameGroup,
    getFirstItemOfInterest,
    shuffleArray
};