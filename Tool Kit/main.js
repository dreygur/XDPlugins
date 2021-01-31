/**
 * Shorthand for creating Elements.
 * @param {*} tag The tag name of the element.
 * @param {*} [props] Optional props.
 * @param {*} children Child elements or strings
 */

const {
    alert
} = require("./lib/dialogs");
const uxp = require("uxp").storage;
const fs = uxp.localFileSystem;

const {
    ImageFill
} = require("scenegraph");
const {
    Artboard,
    Rectangle,
    Polygon,
    Path,
    Ellipse,
    Text,
    Color,
    Group,
    RepeatGrid,
    SymbolInstance,
    Selection
} = require("scenegraph");

const scenegraph = require("scenegraph");

window.application = require("scenegraph");
window.TextNodeCount = 0;
window.GroupsCounter = 0;
window.GroupReduntFlag = false;
window.becomeNullX = false;
window.imagesModel = {};



let Find, Replace, format, reverse;

let labelWidth = 75;

let popupFlag = true;



var cur, man;
let documentRoot;

function h(tag, props, ...children) {
    let element = document.createElement(tag);
    if (props) {
        if (props.nodeType || typeof props !== "object") {
            children.unshift(props);
        } else {
            for (let name in props) {
                let value = props[name];
                if (name == "style") {
                    Object.assign(element.style, value);
                } else {
                    element.setAttribute(name, value);
                    element[name] = value;
                }
            }
        }
    }
    for (let child of children) {
        element.appendChild(typeof child === "object" ? child : document.createTextNode(child));
    }
    return element;
}


function onSubmit() {
    const FindValue = String(document.querySelector("#txtV").value);
    const ReplaceValue = String(document.querySelector("#txtH").value);
    const errorMsg = " node(s) found with the text node "
    //  const caseSensetive = Boolean(document.querySelector("#ckeckB").checked);

    //  console.log(caseSensetive);
    if (FindValue === "" || ReplaceValue === "") {
        alert("Information", "Please fill text in FIND and REPLACE fields to run this functionality");
    } else {
        require("application").editDocument(async () => {
            const value = await doAsync();
            try {
                scenegraph.root.pluginData = {
                    value
                };
                //   console.log(scenegraph.root);
                var selectedIndex = document.querySelector("#dropId").selectedIndex;
                //Code Change - 0004444 -- change below if condition to (selectedIndex === 0)
                if (selectedIndex === 1) {
                    scenegraph.root.children.forEach(node => {
                        updateText(node, FindValue, ReplaceValue);
                    });
                    document.querySelector("#liveChangingFinderId").innerHTML = "'" + window.TextNodeCount + "'" + errorMsg + "'" + FindValue + "'";
                    window.TextNodeCount = 0;
                } else {
                    //      console.log(scenegraph.selection.items);
                    if (scenegraph.selection.items.length === 0) {
                        alert("Information", "Please select Items, where you wanted to replace the text");
                        return;
                    }
                    scenegraph.selection.items.forEach(node => {
                        updateText(node, FindValue, ReplaceValue);
                    });
                    document.querySelector("#liveChangingFinderId").innerHTML = "'" + window.TextNodeCount + "'" + errorMsg + "'" + FindValue + "'";
                    window.TextNodeCount = 0;
                    //                    document.body.appendChild(FindModelCreation());
                    //                    document.body.appendChild(FindModelCreation()).showModal();
                }

            } catch (ex) {
                console.log("Failed", ex);
            }
        });

    }

}

function updateText(node, FindValue, ReplaceValue) {
    if (node instanceof Text) {

        if (node.text === FindValue) {
            node.text = ReplaceValue;
            window.TextNodeCount = window.TextNodeCount + 1;
        }


    } else {
        if (node instanceof Group || node instanceof Artboard) {

            updatesubGrps(node, FindValue, ReplaceValue);
        }
        //        if(node instanceof SymbolInstance){
        //               symbolChecker(node, FindValue, ReplaceValue);
        //               }
    }
}

function updatesubGrps(node, FindValue, ReplaceValue) {
    node.children.forEach(node => {
        if (node instanceof Text) {
            if (node.text === FindValue) {
                node.text = ReplaceValue;
                window.TextNodeCount = window.TextNodeCount + 1;
            }

        } else {
            if (node instanceof Group || node instanceof Artboard) {

                updatesubGrps(node, FindValue, ReplaceValue);
            }
            //            if(node instanceof SymbolInstance){
            //               symbolChecker(node, FindValue, ReplaceValue);
            //               }
        }
    })
}

function symbolChecker(node, FindValue, ReplaceValue) {
    if (node instanceof SymbolInstance) {
        console.log("found a symbol");
        let commands = require("commands");
        console.log(node);

        //        scenegraph.selection.items.forEach(node => {
        //    //        console.log("SymbolInstance+ " + node)
        //            updateText(node, FindValue, ReplaceValue);
        //            scenegraph.selection.items.push(node);
        //        })

        return;

    } else {
        return;
    }
}


function doAsync() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("4444");
        }, 1000);
    });
}




function sayHello(Selection, documentRoot) {
    const {
        editDocument
    } = require("application");
    //    if(popupFlag){
    //        window.Selection = Selection;
    //        window.documentRoot = documentRoot;
    //        dialog.showModal();
    //        popupFlag = false;
    //        return;
    //    }
    editDocument(function (Object) {
        Object.children.forEach(node => {

            if (node instanceof Text) {
                if (node.text === "Manu") {
                    node.text = "Manohar";
                }

            } else {
                if (node instanceof Group || node instanceof Artboard) {

                    //        console.log("found a group");
                    sayHello(Selection, node, documentRoot, true);
                }
            }
        })
    });
}

let panel;

function create() {
    const HTML =
        `<style>
            .break {
                flex-wrap: wrap;
            }
            textarea{
height: 54px !important;
}
            label.row > span {
                color: #8E8E8E;
                text-align: center;
                font-size: 9px;
            }
            .applyClass{
                width: 100%;
            }
            .seperaterClass{
                width: 100%;
                opacity: 20%;
            }
            #swapFindReplace{
                width:32px;
                align: center;
                }
            p{
            font-size: 14px;
}
            

        </style>
           
<div id="findAndReplaceBodyID" >
                <div  class="row break">
                    <textarea type="text" width="100%" uxp-quiet="false" id="txtV" height="54px" placeholder="*Find">
                    </textarea>
                 </div>
<div class="row break">
<button style="display: block; margin: 0 auto; padding-top: 10px" id="swapFindReplace" uxp-variant="action" title="Swap the values"><img src="./images/swap.png" /></button>
</div>
            <div class="row break">
                    <textarea type="text" width="100%" uxp-quiet="false" id="txtH" height="54px" placeholder="*Replace">
                    </textarea>
         
                </div>
                <div class="row break">
        

    

                    <select uxp-quiet="true" width="100%" id="dropId">
                        <option value="key2">Selection Only</option>
                    </select>
              
                </div>
                    
                  
 <div class="row break">
<button class="applyClass" id="ok" type="submit" uxp-variant="cta">Apply</button>
</div>
<hr class="seperaterClass">
<div class="row break">

        <h4 id="warning" style="color:#2E071F;margin-top:10px">  Please note:</h4>
<p id="warning2">1. Kindly note above 'FIND' Input field is CASE SENSITIVE</p>
<p id="warning">2. This functionality doesn't effect on "Repeat Grid" & "Symbol" items</p>
</div>
<div class="row break">
<h4 id="ResultsID" style="color:#2E071F;margin-top:10px">  Result:</h4>
<p id="liveChangingFinderId" style="color:#FF00BF;margin-top:10px" ></p>
</div>
</div>
        `
    //    function increaseRectangleSize() {
    //        const { editDocument } = require("application");
    //        const height = Number(document.querySelector("#txtV").value);
    //        const width = Number(document.querySelector("#txtH").value);
    //
    //        editDocument({ editLabel: "Increase rectangle size" }, function (selection) {
    //            const selectedRectangle = selection.items[0];
    //            selectedRectangle.width += width
    //            selectedRectangle.height += height
    //        })
    //    }

    panel = document.createElement("div");
    panel.innerHTML = HTML;
    panel.querySelector("#ok").addEventListener("click", onSubmit);
    panel.querySelector("#swapFindReplace").addEventListener("click", onInterchangeFindReplace);
    //    panel.querySelector("#txtV").addEventListener("keydown", onInputChange);
    //    panel.querySelector("#txtH").addEventListener("keydown", onInputChange);
    ////     panel.querySelector("#txtV").addEventListener("change", onInputChange);
    ////    panel.querySelector("#txtH").addEventListener("change", onInputChange);

    return panel;
}

function onInterchangeFindReplace() {
    var x = document.getElementById("txtV").value;
    var y = document.getElementById("txtH").value;

    document.getElementById("txtV").value = y;
    document.getElementById("txtH").value = x;
}

function theOtherFunction() {
    document.getElementById("txtV").value = "";
    console.log("theOtherFunction");
}

function onInputChange(event) {
    var x = document.getElementById("txtV").value;
    var y = document.getElementById("txtH").value;
    console.log(x);
    var KeyID = event.keyCode;

    if (KeyID == 8) {
        x = "";
        console.log("BACKSPACE KEY");
        console.log(document.getElementById("txtV").value);
        if (document.getElementById("txtV").value.length == 0) {
            document.getElementById("txtV").value = x;
            console.log(document.getElementById("txtV").value);
            theOtherFunction();
        }

        return;
    }

    if (KeyID == 13) {
        x = "";
        console.log("ENTER KEY");
        console.log(document.getElementById("txtV").value);
        if (document.getElementById("txtV").value.length == 0) {
            document.getElementById("txtV").value = x;
            console.log(document.getElementById("txtV").value);
            theOtherFunction();
        }
        return;
    }

    //    if(window.becomeNullX){
    //        document.getElementById("txtV").value = "";
    //        window.becomeNullX = false;
    //        console.log("entered second");
    //        return;
    //       }

    //    if(x == ""){
    //       console.log("actually become null");
    //        window.becomeNullX = true;
    //        document.getElementById("txtV").value = "";
    //        return;
    //       }

    //  x.value = x.value.toUpperCase();
    //     var KeyID = event.keyCode;
    //     console.log(event.CHANGE);
    //   switch(KeyID)
    //   {
    //      case 8:
    //       if(x == ""){
    //            console.log("entered");
    //         document.getElementById("txtV").setAttribute('value', '');
    //           console.log(document.getElementById("txtV").value);
    //       }
    //           if(y == ""){
    //         document.getElementById("txtH").setAttribute('value', '');
    //           }
    //      break; 
    //      case 46:
    //      alert("delete");
    //      break;
    //      default:
    //      break;
    //   }
}

function createSwapper() {
    const HTML =
        `<style>
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
        <form method="dialog" id="main">
        

           



            <footer><button id="swapObj" type="submit" uxp-variant="cta">Swap Both</button></footer>
        </form>
        <h6 id="warning"></h6>
        `
    //    function increaseRectangleSize() {
    //        const { editDocument } = require("application");
    //        const height = Number(document.querySelector("#txtV").value);
    //        const width = Number(document.querySelector("#txtH").value);
    //
    //        editDocument({ editLabel: "Increase rectangle size" }, function (selection) {
    //            const selectedRectangle = selection.items[0];
    //            selectedRectangle.width += width
    //            selectedRectangle.height += height
    //        })
    //    }

    panel = document.createElement("div");
    panel.innerHTML = HTML;
    panel.querySelector("form").addEventListener("submit", onSwap);
    return panel;
}

function onSwap(selection) {

    let commands = require("commands");
    //  console.log(scenegraph.selection.items);

    if (scenegraph.selection.items.length !== 2) {
        alert("Warning", "Please Select exactly 2 Items in order to swap their Positions");
        return;
    }

    if (scenegraph.selection.items.length == 2 && (scenegraph.selection.items[0] instanceof Artboard && scenegraph.selection.items[1] instanceof Artboard)) {
        let selectedItems = scenegraph.selection.items;
        let firstNodeBounds = selectedItems[0].boundsInParent;
        let length = selectedItems.length;
        let localBounds;

        for (let i = 0; i < length - 1; ++i) {
            let node = selectedItems[i];
            localBounds = {
                x: node.localBounds.x,
                y: node.localBounds.y
            };
            node.placeInParentCoordinates(localBounds, selectedItems[i + 1].boundsInParent);
        }

        let lastNode = selectedItems[length - 1];

        localBounds = {
            x: lastNode.localBounds.x,
            y: lastNode.localBounds.y
        };

        lastNode.placeInParentCoordinates(localBounds, firstNodeBounds);
        return;
    }

    //  require("application").editDocument(async () => {
    //    const value = await doAsync();
    commands.group();
    var firstObjNode = scenegraph.selection.items[0].children.at(0);
    var firstObjBounds = scenegraph.selection.items[0].children.at(0).globalBounds;
    var firstObjBoundsCoOrds = {
        x: firstObjBounds.x,
        y: firstObjBounds.y
    }
    var firstObjX = firstObjBounds.x;
    var firstObjY = firstObjBounds.y;
    //  console.log("---First");
    // console.log(firstObjBounds);

    var secondObjNode = scenegraph.selection.items[0].children.at(1);
    var secondObjBounds = scenegraph.selection.items[0].children.at(1).globalBounds;
    var secondObjBoundsCoOrds = {
        x: secondObjBounds.x,
        y: secondObjBounds.y
    }
    var secondObjX = secondObjBounds.x;
    var secondObjY = secondObjBounds.y;

    //   console.log("---second");
    //  console.log(secondObjBounds);

    //   console.log("---globel");
    var groupNodeBounds = scenegraph.selection.items[0].globalBounds;
    //   console.log(groupNodeBounds);
    if (groupNodeBounds.height == firstObjBounds.height && groupNodeBounds.width == firstObjBounds.width) {
        //      console.log("subset of Firstobj");
        commands.ungroup();
        return;
    }

    if (groupNodeBounds.height == secondObjBounds.height && groupNodeBounds.width == secondObjBounds.width) {
        //     console.log("subset of secondObj");
        commands.ungroup();
        return;
    }

    //case 2: group width is equal to obj1 //case 3: group width is equal to obj2
    if (groupNodeBounds.width == firstObjBounds.width || groupNodeBounds.width == secondObjBounds.width) {
        console.log("width same");
        if (groupNodeBounds.y == firstObjBounds.y) {
            console.log("in If");
            var h2Diff = groupNodeBounds.height - secondObjBounds.height;
            secondObjNode.moveInParentCoordinates(0, -h2Diff);

            var h1Diff = groupNodeBounds.height - firstObjBounds.height;
            firstObjNode.moveInParentCoordinates(0, h1Diff);
        } else {
            var h1Diff = groupNodeBounds.height - secondObjBounds.height;
            secondObjNode.moveInParentCoordinates(0, h1Diff);

            var h2Diff = groupNodeBounds.height - firstObjBounds.height;
            firstObjNode.moveInParentCoordinates(0, -h2Diff);
        }
        commands.ungroup();
        return;
    }

    //case 4: group height is equal to obj1
    if (groupNodeBounds.height == firstObjBounds.height) {
        //    console.log("Obj1 height is equal to group height");
        if (groupNodeBounds.x == firstObjBounds.x) {
            var xDiff = groupNodeBounds.width - firstObjBounds.width;
            firstObjNode.moveInParentCoordinates(xDiff, 0);

            //                var y2Diff = groupNodeBounds.y - secondObjBounds.y;
            //                secondObjNode.moveInParentCoordinates(0,y2Diff);
            var x2Diff = groupNodeBounds.width - secondObjBounds.width;
            secondObjNode.moveInParentCoordinates(-x2Diff, 0);
            commands.ungroup();
            return;
        } else {
            var x2Diff = groupNodeBounds.width - secondObjBounds.width;
            secondObjNode.moveInParentCoordinates(x2Diff, 0);
            //                var y2Diff = groupNodeBounds.y - secondObjBounds.y;
            //                secondObjNode.moveInParentCoordinates(0,y2Diff);

            var xDiff = groupNodeBounds.width - firstObjBounds.width;
            firstObjNode.moveInParentCoordinates(-xDiff, 0);
            commands.ungroup();
            return;
        }
    }
    //case 5: group height is equal to obj2
    if (groupNodeBounds.height == secondObjBounds.height) {
        //    console.log("Obj2 height is equal to group height");

        if (groupNodeBounds.x == secondObjBounds.x) {
            var xDiff = groupNodeBounds.width - secondObjBounds.width;
            secondObjNode.moveInParentCoordinates(xDiff, 0);

            //                var y2Diff = groupNodeBounds.y - firstObjBounds.y;
            //                firstObjNode.moveInParentCoordinates(0,y2Diff);
            var x2Diff = groupNodeBounds.width - firstObjBounds.width;
            firstObjNode.moveInParentCoordinates(-x2Diff, 0);
            commands.ungroup();
            return;
        } else {
            var x2Diff = groupNodeBounds.width - firstObjBounds.width;
            firstObjNode.moveInParentCoordinates(x2Diff, 0);
            //                var y2Diff = groupNodeBounds.y - firstObjBounds.y;
            //                firstObjNode.moveInParentCoordinates(0,y2Diff);

            var xDiff = groupNodeBounds.width - secondObjBounds.width;
            secondObjNode.moveInParentCoordinates(-xDiff, 0);
            commands.ungroup();
            return;
        }
    }


    //case 6: top aligned deprecated
    //        if (firstObjBounds.y == secondObjBounds.y) {
    //            if (firstObjBounds.x < secondObjBounds.x) {
    //                var xDiff = secondObjBounds.x - firstObjBounds.x;
    //                var num = groupNodeBounds.width - firstObjBounds.width;
    //                firstObjNode.moveInParentCoordinates(num, 0);
    //                secondObjNode.moveInParentCoordinates(-xDiff, 0);
    //            } else {
    //                var xDiff = firstObjBounds.x - secondObjBounds.x;
    //                var num = groupNodeBounds.width - secondObjBounds.width;
    //                firstObjNode.moveInParentCoordinates(-xDiff, 0);
    //                secondObjNode.moveInParentCoordinates(num, 0);
    //            }
    //            commands.ungroup();
    //            return;
    //        }
    //case 7 : left aligned
    if (firstObjBounds.x == secondObjBounds.x) {
        if (firstObjBounds.y < secondObjBounds.y) {
            var yDiff = secondObjBounds.y - firstObjBounds.y;
            var num = groupNodeBounds.height - firstObjBounds.height;
            firstObjNode.moveInParentCoordinates(0, num);
            secondObjNode.moveInParentCoordinates(0, -yDiff);
        } else {
            var yDiff = firstObjBounds.y - secondObjBounds.y;
            var num = groupNodeBounds.height - secondObjBounds.height;
            firstObjNode.moveInParentCoordinates(0, -yDiff);
            secondObjNode.moveInParentCoordinates(0, num);
        }
        commands.ungroup();
        return;

    } else {
        if (groupNodeBounds.x == firstObjBounds.x) {
            //      console.log("firstObj is aligned left");
            var xDiff = groupNodeBounds.width - firstObjBounds.width;
            firstObjNode.moveInParentCoordinates(xDiff, 0);
            var heightDiff = groupNodeBounds.height - firstObjBounds.height;
            if (groupNodeBounds.y == firstObjBounds.y) {
                if (heightDiff == 0) {
                    firstObjNode.moveInParentCoordinates(0, 0);
                } else {
                    firstObjNode.moveInParentCoordinates(0, heightDiff);
                }
            } else {
                firstObjNode.moveInParentCoordinates(0, -heightDiff);
            }
            var xDiff = groupNodeBounds.width - secondObjBounds.width;
            secondObjNode.moveInParentCoordinates(-xDiff, 0);
            var heightDiff = groupNodeBounds.height - secondObjBounds.height;
            if (groupNodeBounds.y == secondObjBounds.y) {
                if (heightDiff == 0) {
                    secondObjNode.moveInParentCoordinates(0, 0);
                } else {
                    secondObjNode.moveInParentCoordinates(0, heightDiff);
                }
            } else {
                secondObjNode.moveInParentCoordinates(0, -heightDiff);
            }

        } else {


            //      console.log("secObj is aligned left");
            var xDiff = groupNodeBounds.width - secondObjBounds.width;
            secondObjNode.moveInParentCoordinates(xDiff, 0);
            var heightDiff = groupNodeBounds.height - secondObjBounds.height;
            if (groupNodeBounds.y == secondObjBounds.y) {
                if (heightDiff == 0) {
                    secondObjNode.moveInParentCoordinates(0, 0);
                } else {
                    secondObjNode.moveInParentCoordinates(0, heightDiff);
                }
            } else {
                secondObjNode.moveInParentCoordinates(0, -heightDiff);
            }
            var xDiff = groupNodeBounds.width - firstObjBounds.width;
            firstObjNode.moveInParentCoordinates(-xDiff, 0);
            var heightDiff = groupNodeBounds.height - firstObjBounds.height;
            if (groupNodeBounds.y == firstObjBounds.y) {
                if (heightDiff == 0) {
                    firstObjNode.moveInParentCoordinates(0, 0);
                } else {
                    firstObjNode.moveInParentCoordinates(0, heightDiff);
                }
            } else {
                firstObjNode.moveInParentCoordinates(0, -heightDiff);
            }
        }
        commands.ungroup();
        return;

    }
    // });
}

function modalOpener() {

    setTimeout(function () {

    }, 1000);
}

function onGroupCleaner() {
    //    require("application").editDocument(async () => {
    //        scenegraph.root.children.forEach(node => {
    //                        console.log("groupCleaner")
    //                    })
    //    });

    window.GroupsCounter = 0;
    document.body.appendChild(modalCreation());
    document.querySelector("#GroupDoneID").disabled = true;
    document.body.appendChild(modalCreation()).showModal();
    document.querySelector("#GroupDoneID").disabled = false;



    let commands = require("commands");
    scenegraph.root.children.forEach(node => {
        var node = node;
        groupFinder(node);

    })
    scenegraph.selection.items = [];

    //    if (!window.GroupReduntFlag) {
    //        console.log("No" + " Redundent Groups Found and Removed");
    //        //   alert("0"+ " Redundent Groups Found and Removed");
    //    } else {
    //        console.log(window.GroupsCounter + " Redundent Groups Found and Removed");
    //        //    alert(window.GroupsCounter+ " Redundent Groups Found and Removed");
    //        window.GroupsCounter = 0;
    //        window.GroupReduntFlag = false;
    //    }
    if (window.GroupsCounter === 0) {
        document.querySelector("#liveChangingId").innerHTML = "No Redundent Groups Found and Removed";
    }
}

function groupFinder(node) {

    if (node instanceof Group) {
        var node = node;
        groupRemover(node);
    }
    if (node instanceof Artboard) {
        var node = node;
        node.children.forEach(node => {
            var node = node;
            groupFinder(node);
        })
    } else {
        return;
    }

}

function groupRemover(node) {
    let commands = require("commands");
    if (node.children.length === 1 && node.children.at(0) instanceof Group) {
        //maskedGroup Check
        var maskedGroupCheck = node.mask ? "Masked Group" : "Plain Group";
        if (maskedGroupCheck === "Masked Group") {

            return;
        }
        window.GroupReduntFlag = true;
        var node = node;
        scenegraph.selection.items = [node];
        commands.ungroup();
        window.GroupsCounter = window.GroupsCounter + 1;
        document.querySelector("#liveChangingId").innerHTML = window.GroupsCounter.toString() + " Redundent Groups Found and Removed";
        document.querySelector("#helperTextId").innerHTML = "Control+Z(in Win) or Command+Z(in Mac) to Undo the operation";
        node = scenegraph.selection.items[0];
        groupRemover(node);
    } else if (node.children.length === 1 && (node.children.at(0) instanceof Rectangle || node.children.at(0) instanceof Ellipse || node.children.at(0) instanceof Text)) {
        window.GroupReduntFlag = true;
        scenegraph.selection.items = [node];
        commands.ungroup();
        window.GroupsCounter = window.GroupsCounter + 1;
        document.querySelector("#liveChangingId").innerHTML = window.GroupsCounter.toString() + " Redundent Groups Found and Removed";
        document.querySelector("#helperTextId").innerHTML = "Control+Z(in Win) or Command+Z(in Mac) to Undo the operation";
    } else if (node.children.length > 1) {
        node.children.forEach(node => {
            var node = node;
            var maskedGroupCheck = node.mask ? "Masked Group" : "Plain Group";
            if (maskedGroupCheck === "Plain Group" && node instanceof Group) {
                var parentCheck = node.parent.mask ? "Masked Group" : "Plain Group";
                if (parentCheck !== "Masked Group") {
                    groupRemover(node);
                }
            }
        })
    }
}

//create progress Modal

let dialog;

function modalCreation() {
    if (dialog == null) {
        function onsubmit(e) {
            dialog.close();
        }

        dialog = (
            h("dialog",
                h("form", {
                        style: {
                            width: 360
                        },
                        onsubmit
                    },
                    h("h1", {
                        style: {
                            color: 200
                        },
                        id: "liveChangingId"
                    }, "No Redundent Groups Found"),
                    h("p", "Group Cleaner worked very hard!"),

                    h("p", {
                        style: {
                            fontWeight: 400,
                        },
                        id: "helperTextId"
                    }, ""),
                    h("footer",
                        h("button", {
                            uxpVariant: "cta",
                            id: "GroupDoneID",
                            type: "submit",
                            onclick(e) {
                                onsubmit();
                                e.preventDefault();
                            }
                        }, "Done")
                    )
                )
            )
        );
    }
    return dialog;
}

function onswapFillBorder(Selection) {
    let commands = require("commands");
    //  console.log(scenegraph.selection.items);
    var selectionItem = scenegraph.selection.items;
    if (selectionItem.length === 0) {
        alert("Information", "Please select atleast one shaper layer");
        return;
    } else {
        var length = selectionItem.length;
        var flag = true;
        for (var i = 0; i <= length - 1; i++) {
            var newfill = selectionItem[i].fill;
            var newstroke = selectionItem[i].stroke;

            if (selectionItem[i] instanceof Rectangle || selectionItem[i] instanceof Ellipse || selectionItem[i] instanceof Polygon || selectionItem[i] instanceof Path) {
                if (selectionItem[i].fillEnabled && selectionItem[i].strokeEnabled) {
                    selectionItem[i].stroke = newfill;
                    selectionItem[i].fill = newstroke;
                } else if (selectionItem[i].fillEnabled == true && selectionItem[i].strokeEnabled == false) {
                    selectionItem[i].fillEnabled = false;
                    selectionItem[i].fill = newstroke;
                    selectionItem[i].strokeEnabled = true;
                    selectionItem[i].stroke = newfill;
                } else if (selectionItem[i].fillEnabled == false && selectionItem[i].strokeEnabled == true) {
                    selectionItem[i].fillEnabled = true;
                    selectionItem[i].fill = newstroke;
                    selectionItem[i].strokeEnabled = false;
                    selectionItem[i].stroke = newfill;
                } else {
                    selectionItem[i].fill = newstroke;
                    selectionItem[i].stroke = newfill;
                }

                flag = false;
            }

            //below if checks for text and having both fill and stroke then only it executes, else its goes 
            if (selectionItem[i] instanceof Text && selectionItem[i].fillEnabled && selectionItem[i].strokeEnabled) {
                selectionItem[i].stroke = newfill;
                selectionItem[i].fill = newstroke;
                flag = false;
            }
        }
        if (flag) {
            alert("Information", "Please Select atleast one shaper layer");
        }
    }
    //    } else if (selectionItem[0] != instanceof Rectangle || selectionItem[0] != Ellipse || selectionItem[0] == instanceof Polygon || selectionItem[0] instanceof Path) {
    //        alert("Warning", "Please Select exactly 2 Items in order to swap their Positions");
    //        return;
    //    }
    //    else if (selectionItem[0] == instanceof Rectangle || selectionItem[0] == Ellipse || selectionItem[0] == instanceof Polygon || selectionItem[0] == instanceof Path){
    //        console.log(selectionItem[0]);
    //        return;
    //    }
    //    else {
    //        alert("Warning", "Please Select exactly 2 Items in order to swap their Positions");
    //        return;
    //    }

}

function createImagePanel(Event) {
    const HTML =
        `<style>
            .break {
                flex-wrap: wrap;
            }
            p{
                font-size: 14px;
            }
            label.row input {
        flex: 1 1 auto;
    }
            .row {
  display: flex;
  flex-wrap: wrap;
  padding: 0 0px;
}

/* Create four equal columns that sits next to each other 
.column {
  flex: 25%;
  max-width: 25%;
  padding: 0 0px;
}

.column img {
  margin-top: 8px;
  vertical-align: middle;
  width: 100%;
}
*/

.column {
  flex: 100%;
  padding: 0 0px;
}

.column img {
  margin-top: 8px;
  vertical-align: middle;
  border-radius: 4px;

}

/* Responsive layout - makes a two column-layout instead of four columns 
@media screen and (max-width: 400px) {
  .column {
    flex: 50%;
    max-width: 50%;
  }
}
*/

/* Responsive layout - makes the two columns stack on top of each other instead of next to each other 
@media screen and (max-width: 200px) {
  .column {
    flex: 100%;
    max-width: 100%;
  }
}
*/
.flexbox { display: flex;  margin-top:0rem }
.flexbox input {padding-left:0.4rem !important;margin-top:0rem; width: 100%; }

.container {
  position: relative;
  width: 100%;
}

.column container {
  margin-top: 8px;
  vertical-align: middle;
  border-radius: 4px;

}

.overlay {
  position: absolute; 
  bottom: 0; 
  background: rgb(0, 0, 0);
  background: rgba(0, 0, 0, 0); /* Black see-through */
  width: 100%;
  transition: .5s ease;
  opacity:0;
  color: white;
  font-size: 20px;
  padding: 8px;
    text-align: right;
}


.container:hover .overlay {
opacity:1;
  
}

.downloadBnt{
width: 2rem !important;
cursor: pointer;
z-index:1000;
cursor:pointer;
}

.alert {
display: none;
  padding: 0.4rem;
  background-color: #f44336;
  color: white;
  border-Color: #f44336;
  border-radius: 4px;
  font-size: 14px;
  width: calc(100%);
}

.info {
display: fixed;
  padding: 0.4rem;
  background-color: #008FF7;
  color: white;
  border-Color: #008FF7;
  border-radius: 4px;
  font-size: 12px;
  width: calc(100%);
}

.closebtn {
float: right;
  margin-right: 5px;
margin-left:0.4rem;
  color: white;
  font-weight: regular;
  font-size: 20px;
  line-height: 24px;
  cursor: pointer;
  transition: 0.3s;
}

.closebtn:hover {
  color: black;
}


       
</style>
        <div id="imagePanelId"  style="height:calc(100vh - 156px);">
            <div class="flexbox" style="margin-top:0rem;padding:0rem">
                <input style="flex:1;margin:0rem !important" type="search"   uxp-quiet="false" id="imageSearchId" value="" placeholder="Search" />
                <button uxp-quiet="false"  style="margin-top: 0rem" id="searchImageId" uxp-variant="action" title="Click to seach">
                        <img src="./images/go.png" />
                    </button>
            </div>



                <div class="scrollableContainer"  style="overflow-y: scroll; height:100%">
<div id="ImageAlertID" style="position: fixed" class="alert">
  <span class="closebtn" id="closebtn">&times;</span> <span id="AlertMessageId"> Please select a shape layer.</span>
</div>

<div id="ImageInfoID" style="position: fixed" class="info">
 <span id="AlertMessageId"> <b>Step 1</b> : Please select shape Layer(s).<br/> <b>Step 2</b> : Search for any image from the Search panael.<br/> <b>Step 3</b>: Click on the download Icon,which will appear on hover of an image.</span>
</div>
            <div class="row" id="imageGridId">
            </div>
          </div>
        </div>

        `

    /*<div class="stretch">
                    <input type="search"  uxp-quiet="false" id="imageSearchId" value="" placeholder="Search" />
                </div>
                <div class="normal">
                    <button uxp-quiet="false" style="margin-top: 3px" id="searchImageId" uxp-variant="action" title="Swap the values">
                        <img src="./images/go.png" />
                    </button>
                </div>*/



    panel = document.createElement("div");
    panel.innerHTML = HTML;
    panel.querySelector("#searchImageId").addEventListener("click", onImageSearch);

    panel.querySelector("#imageSearchId").addEventListener("keydown", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("searchImageId").click();
        }
    });

    panel.querySelector("#closebtn").addEventListener("click", onMessageClose);


    function onMessageClose() {
        this.parentElement.style.display = 'none';
    }

    //  panel.querySelector("#searchImageId2").addEventListener("click", increaseRectangleSize);
    return panel;
}



function onImageSearch(event) {
    document.getElementById("ImageInfoID").style.display = "none";
    if (!navigator.onLine) {

        var AlertMessageId = document.getElementById("AlertMessageId");
        AlertMessageId.innerHTML = ' Please Check your Internet Connection';
        document.getElementById("ImageAlertID").style.display = "inline";
        console.log("Please check your internet connection!");
        return
    }
    document.getElementById("imageGridId").innerHTML = '';

    var queryString = document.getElementById("imageSearchId").value;
    queryString = queryString.replace(" ", "-");
    var apiKey = "0e3c983027e4658f85fd6b30872294e5d8be20e0eaa71ca6a0b56fa2b27270b5";
    var url = "https://api.unsplash.com/search/photos/?" +
        "client_id=" + apiKey +
        "&page=1" + "&per_page=40" +
        "&query=" + queryString;

    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(function (response) {
        return response.json();
    }).then(function (jsonResponse) {
        var gridRow = document.getElementById("imageGridId");
        console.log(jsonResponse.results.length);
        if (jsonResponse.results.length == 0) {
            console.log(jsonResponse.results.length);

            var AlertMessageId = document.getElementById("AlertMessageId");
            AlertMessageId.innerHTML = ' No results Found';
            document.getElementById("ImageAlertID").style.display = "inline";
            //  document.getElementById("imageGridErrorHandleID").innerHTML = "No results Found";
            return;
        } else {
            //  document.getElementById("imageGridErrorHandleID").innerHTML = "";
        }
        var columnImagesLength = jsonResponse.results.length;
        //        if(jsonResponse.results.length >=3){
        //            columnImagesLength = Math.floor((jsonResponse.results.length)/3);
        //        }
        var urlPath = 1;
        for (var c = 0; c <= 0; c++) {
            var column = document.createElement("div");
            for (var i = 0; i <= columnImagesLength - 1; i++) {


                var imageContainer = document.createElement("div");
                imageContainer.className = "container";
                var overlay = document.createElement("div");

                var downloadBnt = document.createElement("BUTTON");
                downloadBnt.setAttribute("uxp-variant", "action");

                downloadBnt.className = "downloadBnt";
                downloadBnt.innerHTML = '<img src="./images/download.png" />';
                overlay.appendChild(downloadBnt);
                overlay.className = "overlay";


                var image = document.createElement("IMG");
                image.id = jsonResponse.results[i].id;
                image.style.width = "100%";
                image.style.height = "auto";

                image.src = jsonResponse.results[i].urls.regular;
                image.draggable = true;

                downloadBnt.addEventListener("click", function (event) {

                    document.getElementById("ImageInfoID").style.display = "none !important";
                    var selectionItems = scenegraph.selection.items;

                    if (selectionItems.length !== 1) {
                        var AlertMessageId = document.getElementById("AlertMessageId");
                        AlertMessageId.innerHTML = ' Please select a shape layer';
                        document.getElementById("ImageAlertID").style.display = "inline";
                        console.log("Please select exactly one shape layer");
                        return;
                    } else {
                        var selection = scenegraph.selection.items[0];
                        if (selection instanceof Rectangle || selection instanceof Polygon || selection instanceof Path || selection instanceof Ellipse) {
                            //                                    console.log(selection);
                        } else {
                            var AlertMessageId = document.getElementById("AlertMessageId");
                            AlertMessageId.innerHTML = ' Please select a shape layer';
                            document.getElementById("ImageAlertID").style.display = "inline";
                            console.log("Please select shape layer");
                            return;
                        }

                        var selectionCheck = false;
                        //            window.ImageDropSelectionCount = 0;
                    }

                    //                    


                    function increaseRectangleSize() {
                        const {
                            editDocument
                        } = require("application");

                        // [6]
                        editDocument({
                            editLabel: "UnSpash it"
                        }, function (selection) {

                            console.log(window.ImageDropSelectionCount);
                            const selectedRectangle = selection.items[window.ImageDropSelectionCount];
                            window.ImageDropSelectionCount++;
                            var apiKey = "0e3c983027e4658f85fd6b30872294e5d8be20e0eaa71ca6a0b56fa2b27270b5";
                            var selectedImageNode = event.target._parentNode._previousSibling;
                            window.selectedPhotoId = selectedImageNode.id;
                            const url = "https://api.unsplash.com/photos/" + selectedPhotoId + "/?client_id=" + apiKey;
                            return fetch(url)
                                .then(function (response) {
                                    return response.json();
                                })
                                .then(function (jsonResponse) {
                                    return downloadImage(selection, jsonResponse);
                                });

                        });
                    }

                    increaseRectangleSize();

                })
                //  urlPath++;

                imageContainer.appendChild(image);
                imageContainer.appendChild(overlay);

                // imageContainer.appendChild(downloadBnt);
                column.appendChild(imageContainer);
            }
            column.className = "column";

            gridRow.appendChild(column);
            document.getElementById("ImageAlertID").style.display = "none";
            document.getElementById("ImageInfoID").style.display = "none";
        }





        //return downloadImage(selection, jsonResponse, totalObjCount);
    });

}

async function downloadImage(selection, jsonResponse) {
    try {
        const {
            ImageFill
        } = require("scenegraph");
        const uxp = require("uxp");
        const photoUrl = jsonResponse.urls.full;
        const photoObj = await xhrBinary(photoUrl);
        const tempFolder = await fs.getTemporaryFolder();
        const tempFile = await tempFolder.createFile("tmp", {
            overwrite: true
        });
        await tempFile.write(photoObj, {
            format: uxp.storage.formats.binary
        });
        applyImagefill(selection, tempFile);
    } catch (err) {
        console.log("error")
        console.log(err.message);
    }
}

function applyImagefill(selection, file) {
    const imageFill = new ImageFill(file);
    let application = require("application");
    selection.items[0].fill = imageFill;
    selection.items[0].fillEnabled = true;
    document.getElementById("ImageAlertID").style.display = "none";
}


function xhrBinary(url) {
    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest();
        req.onload = () => {
            if (req.status === 200) {
                try {
                    const arr = new Uint8Array(req.response);
                    resolve(arr);
                } catch (err) {
                    reject('Couldnt parse response. ${err.message}, ${req.response}');
                }
            } else {
                reject('Request had an error: ${req.status}');
            }
        }
        req.onerror = reject;
        req.onabort = reject;
        req.open('GET', url, true);
        req.responseType = "arraybuffer";
        req.send();
    });
}



function dragStart(event) {
    const target = event.target;
    const dataTransfer = event.dataTransfer;
    const mimeType = target.dataset.dragMimeType || "image/jpg";
    dataTransfer.effectAllowed = "all";
    const dragItem = new DataTransferItem();
    dragItem.set("text/uri-list", target.src); //file:/// or data:base64,png;asdfasf
    dragItem.set("text/html", `<meta http-equiv="Content-Type" content="text/html;charset=UTF-8"><img alt="Image" src="${target.src}"/>`);
    dataTransfer.items.push(dragItem);
    dragItem.element = target;
}







function onloremipsum(Selection){
    

    let commands = require("commands");
    window.stoploop = false;
    

    var loremSourceText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Bibendum est ultricies integer quis. Iaculis urna id volutpat lacus laoreet. Mauris vitae ultricies leo integer malesuada. Ac odio tempor orci dapibus ultrices in. Egestas diam in arcu cursus euismod. Dictum fusce ut placerat orci nulla. Tincidunt ornare massa eget egestas purus viverra accumsan in nisl. Tempor id eu nisl nunc mi ipsum faucibus. Fusce id velit ut tortor pretium. Massa ultricies mi quis hendrerit dolor magna eget. Nullam eget felis eget nunc lobortis. Faucibus ornare suspendisse sed nisi. Sagittis eu volutpat odio facilisis mauris sit amet massa. Erat velit scelerisque in dictum non consectetur a erat. Amet nulla facilisi morbi tempus iaculis urna. Egestas purus viverra accumsan in nisl. Feugiat in ante metus dictum at tempor commodo. Convallis tellus id interdum velit laoreet. Proin sagittis nisl rhoncus mattis rhoncus urna neque viverra. Viverra aliquet eget sit amet tellus cras adipiscing enim eu. Ut faucibus pulvinar elementum integer enim neque volutpat ac tincidunt. Dui faucibus in ornare quam. In iaculis nunc sed augue lacus viverra vitae congue. Vitae tempus quam pellentesque nec nam aliquam sem et. Ut morbi tincidunt augue interdum. Sem fringilla ut morbi tincidunt augue. Morbi enim nunc faucibus a pellentesque sit amet porttitor eget. In est ante in nibh mauris. Nam aliquam sem et tortor consequat id porta nibh. Diam quis enim lobortis scelerisque fermentum dui faucibus. Non curabitur gravida arcu ac. Magna fringilla urna porttitor rhoncus dolor. Aenean et tortor at risus viverra adipiscing. Dignissim sodales ut eu sem. Quam quisque id diam vel quam elementum pulvinar etiam non. Eleifend quam adipiscing vitae proin sagittis. Enim facilisis gravida neque convallis a cras semper. Risus commodo viverra maecenas accumsan. Sit amet porttitor eget dolor morbi non arcu risus. Vitae et leo duis ut diam quam. Aliquam faucibus purus in massa tempor. Quisque egestas diam in arcu cursus. Nibh sit amet commodo nulla facilisi nullam. Lacus luctus accumsan tortor posuere ac. Risus quis varius quam quisque id diam vel quam elementum. Scelerisque purus semper eget duis at. Pretium lectus quam id leo in vitae turpis massa sed. Lobortis elementum nibh tellus molestie nunc non blandit massa. Ut tortor pretium viverra suspendisse potenti nullam ac tortor. Posuere morbi leo urna molestie at elementum eu. Viverra adipiscing at in tellus integer. Dis parturient montes nascetur ridiculus mus mauris vitae ultricies leo. Quis blandit turpis cursus in hac habitasse. Sagittis id consectetur purus ut faucibus pulvinar. Ultrices eros in cursus turpis massa. Sit amet nulla facilisi morbi tempus. Mauris rhoncus aenean vel elit. Nulla facilisi cras fermentum odio eu feugiat. Feugiat scelerisque varius morbi enim nunc faucibus a. Neque volutpat ac tincidunt vitae semper. Amet nisl suscipit adipiscing bibendum est ultricies integer. Urna nunc id cursus metus aliquam eleifend. Ullamcorper malesuada proin libero nunc consequat interdum varius. Aliquet sagittis id consectetur purus ut faucibus pulvinar. Tincidunt dui ut ornare lectus sit. Quis risus sed vulputate odio ut enim. Diam sollicitudin tempor id eu nisl nunc mi ipsum. Volutpat odio facilisis mauris sit amet. Pellentesque sit amet porttitor eget dolor morbi non arcu. Pulvinar mattis nunc sed blandit libero volutpat. Amet nisl suscipit adipiscing bibendum est ultricies integer. Posuere urna nec tincidunt praesent semper feugiat nibh sed. In dictum non consectetur a erat. Porta nibh venenatis cras sed felis eget. Ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at augue. Pulvinar sapien et ligula ullamcorper. Pharetra convallis posuere morbi leo. Lacus laoreet non curabitur gravida arcu ac. Neque ornare aenean euismod elementum nisi quis eleifend. Tellus in metus vulputate eu scelerisque felis imperdiet proin fermentum. Faucibus purus in massa tempor nec feugiat nisl. Viverra aliquet eget sit amet tellus cras adipiscing enim. Sapien et ligula ullamcorper malesuada proin libero nunc consequat. Quis viverra nibh cras pulvinar mattis nunc sed blandit. Mi bibendum neque egestas congue quisque egestas diam. Ullamcorper dignissim cras tincidunt lobortis feugiat vivamus. At augue eget arcu dictum varius duis at consectetur. Ipsum dolor sit amet consectetur adipiscing elit. Varius morbi enim nunc faucibus a pellentesque sit amet. Amet luctus venenatis lectus magna fringilla urna porttitor rhoncus. Molestie a iaculis at erat pellentesque. Rutrum quisque non tellus orci. Orci eu lobortis elementum nibh tellus molestie. Viverra mauris in aliquam sem. Id nibh tortor id aliquet lectus proin. Cursus in hac habitasse platea dictumst. In vitae turpis massa sed elementum tempus egestas sed sed. Sed ullamcorper morbi tincidunt ornare. Sit amet consectetur adipiscing elit duis. Vitae nunc sed velit dignissim sodales ut eu. Dignissim enim sit amet venenatis urna cursus eget nunc. Sodales ut eu sem integer vitae. Cursus risus at ultrices mi tempus imperdiet nulla. Nisl tincidunt eget nullam non nisi est sit. Euismod quis viverra nibh cras pulvinar mattis nunc. Vestibulum mattis ullamcorper velit sed. Tincidunt lobortis feugiat vivamus at augue eget. Bibendum enim facilisis gravida neque convallis. Elementum facilisis leo vel fringilla est ullamcorper eget nulla facilisi. Proin sed libero enim sed faucibus turpis. Ut diam quam nulla porttitor massa id neque. Elementum eu facilisis sed odio morbi quis commodo. Semper quis lectus nulla at volutpat diam. Sit amet purus gravida quis blandit. Sit amet dictum sit amet justo donec enim diam. Nulla aliquet porttitor lacus luctus accumsan. Amet consectetur adipiscing elit pellentesque habitant morbi tristique senectus et. Pellentesque elit eget gravida cum sociis natoque penatibus et. Amet venenatis urna cursus eget. Ac turpis egestas maecenas pharetra convallis posuere morbi. Nulla pellentesque dignissim enim sit amet venenatis urna cursus eget. Convallis a cras semper auctor neque vitae. Pharetra pharetra massa massa ultricies mi quis hendrerit dolor magna. Lacus laoreet non curabitur gravida arcu ac. Justo laoreet sit amet cursus sit. Blandit massa enim nec dui nunc. Consectetur purus ut faucibus pulvinar elementum. Quam quisque id diam vel quam elementum. Aliquam ultrices sagittis orci a scelerisque. Commodo nulla facilisi nullam vehicula ipsum. Eget aliquet nibh praesent tristique magna sit amet purus gravida. Fusce id velit ut tortor pretium viverra suspendisse potenti. Nullam eget felis eget nunc lobortis mattis aliquam faucibus. Nisi quis eleifend quam adipiscing. Consectetur libero id faucibus nisl tincidunt eget nullam non nisi. Purus in massa tempor nec feugiat. Ut aliquam purus sit amet. Sem fringilla ut morbi tincidunt. Orci dapibus ultrices in iaculis nunc sed augue lacus. Integer enim neque volutpat ac tincidunt vitae semper quis lectus. Volutpat diam ut venenatis tellus. Phasellus egestas tellus rutrum tellus pellentesque eu tincidunt tortor. Turpis nunc eget lorem dolor sed. Pellentesque sit amet porttitor eget dolor morbi non arcu risus. Quis lectus nulla at volutpat diam ut. Mauris cursus mattis molestie a. Suspendisse interdum consectetur libero id faucibus nisl tincidunt eget. Ac auctor augue mauris augue neque gravida in fermentum et. Sit amet massa vitae tortor condimentum. Sagittis vitae et leo duis ut diam quam. Nunc non blandit massa enim nec dui nunc. Dis parturient montes nascetur ridiculus mus. Lacus sed turpis tincidunt id. Facilisi cras fermentum odio eu feugiat pretium nibh. Pharetra convallis posuere morbi leo urna. Velit egestas dui id ornare arcu odio ut. Gravida cum sociis natoque penatibus et magnis. Mus mauris vitae ultricies leo integer. Ultricies tristique nulla aliquet enim tortor. Ipsum dolor sit amet consectetur adipiscing elit ut aliquam purus. Blandit volutpat maecenas volutpat blandit aliquam etiam erat velit. Ridiculus mus mauris vitae ultricies. Turpis egestas pretium aenean pharetra magna ac placerat vestibulum lectus. Adipiscing tristique risus nec feugiat in fermentum posuere urna. Tempor id eu nisl nunc mi. Enim diam vulputate ut pharetra sit. Elementum integer enim neque volutpat ac tincidunt vitae semper quis. Feugiat sed lectus vestibulum mattis. Cras pulvinar mattis nunc sed blandit libero. Ut aliquam purus sit amet. Quam lacus suspendisse faucibus interdum posuere. Sollicitudin tempor id eu nisl nunc mi. Nunc lobortis mattis aliquam faucibus purus in massa tempor. Quis commodo odio aenean sed adipiscing. Enim neque volutpat ac tincidunt vitae semper quis. Aenean vel elit scelerisque mauris pellentesque pulvinar pellentesque habitant. Sed egestas egestas fringilla phasellus faucibus scelerisque. Congue eu consequat ac felis donec et. Cras ornare arcu dui vivamus arcu felis bibendum ut. In fermentum et sollicitudin ac orci phasellus egestas tellus rutrum. Sagittis orci a scelerisque purus semper eget. Habitant morbi tristique senectus et netus et malesuada fames ac. Urna neque viverra justo nec ultrices dui sapien eget mi. Lectus vestibulum mattis ullamcorper velit sed ullamcorper morbi tincidunt ornare. Elementum curabitur vitae nunc sed velit dignissim sodales ut eu. Est sit amet facilisis magna. Bibendum arcu vitae elementum curabitur vitae nunc sed velit. Dolor sit amet consectetur adipiscing elit pellentesque. Libero justo laoreet sit amet. Convallis a cras semper auctor neque. Nibh cras pulvinar mattis nunc sed blandit. Neque sodales ut etiam sit amet nisl purus in mollis. Ac turpis egestas sed tempus. Ornare aenean euismod elementum nisi quis eleifend quam adipiscing vitae. Ipsum dolor sit amet consectetur adipiscing elit pellentesque habitant morbi. Elementum integer enim neque volutpat. Lectus nulla at volutpat diam ut venenatis. At imperdiet dui accumsan sit amet nulla facilisi morbi tempus. Lectus quam id leo in vitae.";
    var loremArray = loremSourceText.trim().split(" ");
   // console.log(loremArray);
    
    //  console.log(scenegraph.selection.items);
    var selectionItem = scenegraph.selection.items;
    if (selectionItem.length === 0) {
        alert("Information", "Please select atleast one Text layer");
        return;
    } else {
        var length = selectionItem.length;
        var flag = true;
        for (var i = 0; i <= length - 1; i++) {
            var newfill = selectionItem[i].fill;
            var newstroke = selectionItem[i].stroke;

            //below if checks for text and having both fill and stroke then only it executes, else its goes 
            if (selectionItem[i] instanceof Text ) {
                var loremResult = "";
                var repeatCheck = 1;

                if(selectionItem[i].areaBox){

                    for(var j=0;j<=loremArray.length-1;j++){
                        var loremResultPrevious = loremResult;
                        loremResult = loremResult+" "+loremArray[j];
                        selectionItem[i].text = loremResult;
                        if(selectionItem[i].clippedByArea){
                            selectionItem[i].text = loremResultPrevious;
                            break;
                        }
                        if(j=== 1492){
                            j =0;
                            repeatCheck++;
                            if(repeatCheck === 3){
                                break;
                            }
                        }

                        if(window.stoploop){
                            break;
                        }
                    }
                }
                else{
                    selectionItem[i].text = "Lorem Ipsum";
                }
                //selectionItem[i].text = "Lorem Ipsum My name is manohar My name is manoharMy name is manohar";
                var flag = false;
            }
        }
        if (flag) {
            alert("Information", "Please Select atleast one Text Layer");
        }
    }
}



function hide(event) {
    // nothing to do here
}

function update(selection, documentRoot) {
    // ...update panel DOM based on selection...
}

//function show(event){
//    console.log(event.node);
//    if (panel) {
//        return;
//    }
//    event.node.appendChild(createImagePanel());
//    var keyValue = document.querySelector("#dropId").options[0].value;
//    //    console.log(keyValue);
//    document.querySelector("#dropId").selectedIndex = 0;
//    
//}

function hide1(event) {
    // nothing to do here
}

function update1(selection, documentRoot) {
    // ...update panel DOM based on selection...
}

module.exports = {
    commands: {
        // definitions for each commandId in manifest go here
        swapId: onSwap,
        groupId: onGroupCleaner,
        swapFillBorderId: onswapFillBorder,
        loremipsumId: onloremipsum

    },
    panels: {
        // definitions for each panelId in manifest go here
        finderId: {
            show(event) {
                if (panel) {
                    if (window.panelId === "finderId") {
                        document.querySelector("#imagePanelId").style.display = "hidden";
                        document.querySelector("#findAndReplaceBodyID").style.display = "inline";
                        document.querySelector("#txtV").value = window.findValue;
                        document.querySelector("#txtH").value = window.replaceValue;
                        return;
                    } else {
                        window.panelId = "finderId";
                        document.getElementById("imagePanelId").style.display = "hidden";
                        if (document.getElementById("findAndReplaceBodyID")) {
                            document.getElementById("findAndReplaceBodyID").style.display = "inline";
                            return;
                        }

                    }
                } else {
                    window.panelId = "finderId";
                }
                //                if (document.querySelector("#imagePanelId")) {
                //                    console.log("just before hide");
                //                    document.querySelector("#imagePanelId").style.display = "hidden";
                //                }
                //   event.node.getElementById("#imagePanelId").style.display = "hidden";
                //                event.node.innerHTML="";
                event.node.appendChild(create());
                var keyValue = document.querySelector("#dropId").options[0].value;
                //    console.log(keyValue);
                document.querySelector("#dropId").selectedIndex = 0;
            },
            hide(event) {
                window.findValue = document.querySelector("#txtV").value;
                window.replaceValue = document.querySelector("#txtH").value;
            },
            update
        },
        unSplashId: {
            show(event) {
                console.log("unSplash Panel");
                if (panel) {
                    if (window.panelId === "unSplashId") {
                        document.querySelector("#imagePanelId").style.display = "inline";
                        return;
                    } else {
                        window.panelId = "unSplashId";
                        document.querySelector("#findAndReplaceBodyID").style.display = "hidden";
                    //    console.log(document.querySelector("#imagePanelId"));
                        if (document.querySelector("#imagePanelId")) {
                        //    console.log(document.querySelector("#imagePanelId").style.display);
                            document.querySelector("#imagePanelId").style.display = "inline";
                        //    console.log(document.querySelector("#imagePanelId").style.display);
                            return;
                        }

                    }

                } else {
                    window.panelId = "unSplashId";
                }
                //                if (document.querySelector("#findAndReplaceBodyID")) {
                //                    document.querySelector("#findAndReplaceBodyID").style.display = "hidden";
                //                }
                // event.node.getElementById("findAndReplaceBodyID").style.display = "hidden";
                event.node.appendChild(createImagePanel());
            },
            hide(event){
                document.querySelector("#imagePanelId").style.display = "hidden";
            },
            update
        }
    },

};


// Next Version : Changes

//- add Group Cleaner code in manifest
//Code : ,
//          {
//          "type": "menu",
//            "label": "Groups cleaner",
//            "commandId": "groupId",
//              "shortcut":{ "mac": "Cmd+Alt+3", "win": "Cmd+t+3" }
//        }
//        ,
//         {
//             "type": "menu",
//             "label": "Swap Fill and Stroke",
//             "commandId": "swapFillBorderId",
//             "shortcut":{ "mac": "Cmd+Alt+4", "win": "Cmd+t+4" }
//         },
//      {
//            "type": "panel",
//            "label": "Image Search (Unsplash)",
//            "panelId": "unSplashId",
//            "shortcut": {
//                "mac": "Cmd+Alt+5",
//                "win": "Ctrl+Alt+5"
//            }
//        }
//

//- add group Id in Export Module after onswap in Main.js
//Code : ,
//        groupId: onGroupCleaner,
//        swapFillBorderId: onswapFillBorder

//after Finder ID     
//        unSplashId: {
//            show(event) {
//                console.log("unSplash Panel");
//                if (panel) {
//                    if (window.panelId === "unSplashId") {
//                        return;
//                    } else {
//                        window.panelId = "unSplashId";
//                        document.getElementById("findAndReplaceBodyID").style.display = "hidden";
//                        if (document.getElementById("imagePanelId")) {
//                            console.log("whatthe heck");
//                            document.getElementById("imagePanelId").style.display = "inline";
//                            return;
//                        }
//
//                        return;
//
//                    }
//
//                } else {
//                    window.panelId = "unSplashId";
//                }
//                //                if (document.querySelector("#findAndReplaceBodyID")) {
//                //                    document.querySelector("#findAndReplaceBodyID").style.display = "hidden";
//                //                }
//                // event.node.getElementById("findAndReplaceBodyID").style.display = "hidden";
//                event.node.appendChild(createImagePanel());
//            },
//            hide,
//            update
//        }

//        
