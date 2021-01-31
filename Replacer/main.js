var viewport = require("viewport");
var {Rectangle, Color} = require("scenegraph");
const { alert, error } = require("./lib/dialogs.js");
var commands = require("commands");
var foundObjectsList=[];
var Find;
var Replace;
function replacerBegin(selection,root) {
    //Replaces found objects with clones of object to be replaced with
    if(selection.items.length==2){
        if(selection.items[0].constructor.name=="Rectangle"||selection.items[0].constructor.name=="Ellipse"||selection.items[0].constructor.name=="Line"||selection.items[0].constructor.name=="Path"||selection.items[0].constructor.name=="Text"){
            var shape = new Rectangle();
            shape.width = 100;
            shape.height = 100;
            shape.fill = new Color("#f00");
            Replace=selection.items[1];
            Find=selection.items[0];
            walkDownTree(root, pushNode);
            foundObjectsList.forEach(function(found,i){
                selection.items = Replace;
                commands.duplicate();
                var clone = selection.items[0];
                clone.removeFromParent(); 
                //Its a bit tricky for paths since their x,y coordinates are not usually their "translation" coordinates
                if ((found.constructor.name=="Path")&&!(clone.constructor.name=="Path"))
                    clone.translation = {x: found.topLeftInParent.x, y: found.topLeftInParent.y};
                else if (!(found.constructor.name=="Path")&&(clone.constructor.name=="Path")){
                    clone.moveInParentCoordinates(found.translation.x-clone.boundsInParent.x,found.translation.y-clone.boundsInParent.y);
                }
                else if((found.constructor.name=="Path")&&(clone.constructor.name=="Path")){
                    clone.moveInParentCoordinates(found.topLeftInParent.x-clone.boundsInParent.x,found.topLeftInParent.y-clone.boundsInParent.y);
                }
                else
                    clone.translation = found.translation;
                found.parent.addChildAfter(clone,found);
                found.removeFromParent();
            });
            foundObjectsList=[];
        }
        else{
            selectedTypeAlert();
        }
    }
    else if (selection.items.length>2){
        selectedNumberAlert();
    }
    else{
        selectedNumberAlert();
    }
}
//The following functions help search through all nodes of the artboard
function pushNode(node) { 
    if(checkFind(Find,node))
        foundObjectsList.push(node);
}
function walkDownTree(node, command, value = null) {
    command(node, value);
    if (node.isContainer) {
        var childNodes = node.children;
        for(var i=0;i<childNodes.length;i++) {
            let childNode = childNodes.at(i);
            walkDownTree(childNode, command, value);
        }
    }
}
//Alerts on wrong selection
async function selectedNumberAlert() {
    return alert("Select 2 elements",
                 "Please select 2 elements - all instances of the first will be replaced with the second");
}
async function selectedTypeAlert() {
    return alert("Type of element not supported",
                 "Currently Replacer supports replacing lines, rectangles, ellipses, paths and text only. It does not support replacing groups, artboards, repeat-grids etc.");
}
//Compare the object to be found with a particular node 
function checkFind(find,replace){
    if (find.constructor.name==replace.constructor.name)
        switch(find.constructor.name){
            case "Rectangle":  if(find.width==replace.width&&find.height==replace.height&&find.cornerRadii.topLeft==replace.cornerRadii.topLeft&&find.cornerRadii.topRight==replace.cornerRadii.topRight&&find.cornerRadii.bottomLeft==replace.cornerRadii.bottomLeft&&find.cornerRadii.bottomRight==replace.cornerRadii.bottomRight&&CheckGraphicProps(find,replace)){
                return true;
            }
                else{
                    return false;
                }
                break;
            case "Ellipse": 
                if(find.radiusX==replace.radiusX&&find.radiusY==replace.radiusY&&find.isCircle==replace.isCircle&&CheckGraphicProps(find,replace)){
                    return true;
                }
                else{
                    return false;
                }
                break;
            case "Line": 
                if(Object.compare(find.start,replace.start)&&Object.compare(find.end,replace.end)&&CheckGraphicProps(find,replace)){
                    return true;
                }
                else{
                    return false;
                }
                break;
            case "Path": 
                if(find.pathData==replace.pathData&&CheckGraphicProps(find,replace)){
                    return true;
                }
                else{
                    return false;
                }
                break;
            case "Text": if(find.text==replace.text&&Object.compare(find.styleRanges,replace.styleRanges)&&find.fontFamily==replace.fontFamily&&find.fontStyle==replace.fontStyle&&find.fontSize==replace.fontSize&&find.charSpacing==replace.charSpacing&&find.underline==replace.underline&&find.flipY==replace.flipY&&find.textAlign==replace.textAlign&&find.lineSpacing==replace.lineSpacing&&find.paragraphSpacing==replace.paragraphSpacing&&Object.compare(find.areaBox,replace.areaBox)&&find.clippedByArea==replace.clippedByArea&&CheckGraphicProps(find,replace)){
                return true;
            }
                else{
                    return false;
                }
                break;
            default:
                console.log("not found");
                return false;
        }
    else
        return false;
}
//Having these separately so that selective replace can be done in future. Eg: ignore style and replace.
function CheckGraphicProps(finder,replacer){
    if(Object.compare(finder.fill,replacer.fill)&&
       Object.compare(finder.fillEnabled,replacer.fillEnabled)&&
       Object.compare(finder.stroke,replacer.stroke)&&
       Object.compare(finder.strokeEnabled,replacer.strokeEnabled)&&
       Object.compare(finder.strokeWidth,replacer.strokeWidth)&&
       Object.compare(finder.strokePosition,replacer.strokePosition)&&
       Object.compare(finder.strokeEndCaps,replacer.strokeEndCaps)&&
       Object.compare(finder.strokeJoins,replacer.strokeJoins)&&
       Object.compare(finder.strokeMiterLimit,replacer.strokeMiterLimit)&&
       Object.compare(finder.strokeDashArray,replacer.strokeDashArray)&&
       Object.compare(finder.strokeDashOffset,replacer.strokeDashOffset)&&
       Object.compare(finder.shadow,replacer.shadow)&&
       Object.compare(finder.blur,replacer.blur)&&
       Object.compare(finder.pathData,replacer.pathData)&&
       Object.compare(finder.hasLinkedGraphicFill,replacer.hasLinkedGraphicFill)
      )
        return true;
    else
        return false;
}
module.exports = {
    commands: {
        replacerBegin: replacerBegin
    }
};
//Object compare function
Object.compare = function (obj1, obj2) {
    //Loop through properties in object 1
    for (var p in obj1) {
        //Check property exists on both objects
        if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false;

        switch (typeof (obj1[p])) {
                //Deep compare objects
            case 'object':
                if (!Object.compare(obj1[p], obj2[p])) return false;
                break;
                //Compare function code
            case 'function':
                if (typeof (obj2[p]) == 'undefined' || (p != 'compare' && obj1[p].toString() != obj2[p].toString())) return false;
                break;
                //Compare values
            default:
                if (obj1[p] != obj2[p]) return false;
        }
    }
    for (var p in obj2) {
        if (typeof (obj1[p]) == 'undefined') return false;
    }
    return true;
};