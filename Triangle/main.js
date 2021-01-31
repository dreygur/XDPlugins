let {Path, Color, scenegraph} = require("scenegraph");
let commands = require("commands");

let addTriangle = selection => {  
  // create triangle  
  let triangle = new Path();
  triangle.pathData = "M 508.5 543 L 388.0343933105469 751.6587524414062 L 628.2350463867188 751.6587524414062 L 508.5 543 Z";
  triangle.stroke = new Color("#000");
  triangle.strokeWidth = 4;
  selection.insertionParent.addChild(triangle);

  // place triangle on artboard
  let parentCenter = triangle.parent.localCenterPoint;
  let triangleLocation = triangle.localBounds;  
  let triangleCord = {x: triangleLocation.x * 1.3, y: triangleLocation.y * 1.3};
  triangle.placeInParentCoordinates(triangleCord, parentCenter);

}

module.exports = {
    commands: {
       addTriangle
    }
};
