
 const {Path, Color, Ellipse, Rectangle} = require("scenegraph");


  /* --------------------------
   drowParms = {
     x:Number,
     y:Number,
     width:Number,
     height:Number,
     leftEdgeType:"none" or "arrow1" or "arrow2" or "arrow3" or "circle1" or "circle2" or "square1" or "square2" or "bar",
     rightEdgeType:
     lineType:"straight" or "curve" or "snake",
     lineWidth:Number,
     color:String
   }
  ------------------------------ */

const lineOffset = {
  none: 0,
  arrow1: 0,
  arrow2: 0,
  arrow3: 0,
  circle1: 8,
  circle2: 8,
  square1: 8,
  square2: 8,
  bar: 0
}

function drawConnector(parms){
 const x = parms.x;
 const y = parms.y;
 const width = parms.width;
 const height = parms.height;
 const leftEdgeType = parms.leftEdgeType;
 const rightEdgeType = parms.rightEdgeType;
 const edgeScale = parms.edgeScale;
 const lineType = parms.lineType;
 const lineWidth = parms.lineWidth;
 const color = parms.color;


 // create leftEdge
 let edgeX = x;
 let edgeY = y;
 const leftEdge = createEdge({
   x: edgeX,
   y: edgeY,
   type: leftEdgeType,
   lineWidth: lineWidth,
   scale: edgeScale,
   color: color
 }, false);

 if(lineType == "curve" && (leftEdgeType == "arrow1" || leftEdgeType == "arrow2" || leftEdgeType == "arrow3" || leftEdgeType == "bar")){
   leftEdge.rotateAround(90, {x:0, y:0})
 }

 // create RightEdge
 edgeX = x + width;
 edgeY = y;
 if(lineType == "curve" || lineType == "snake"){
   edgeY = y + height;
 }
 const rightEdge = createEdge({
   x: edgeX,
   y: edgeY,
   type: rightEdgeType,
   lineWidth: lineWidth,
   scale: edgeScale,
   color: color
 }, true);


 // create line

 let leftOffset = lineOffset[leftEdgeType] * edgeScale/100;
 let rightOffset = lineOffset[rightEdgeType] * edgeScale/100;

 const line = createLine({
   sx: x,
   sy: y,
   ex: x + width,
   ey: y + height,
   type: lineType,
   lineWidth: lineWidth,
   color: color
 }, leftOffset, rightOffset);

 return [line, leftEdge, rightEdge];

}


function createLine(parms, leftOffset, rightOffset){
 const sx = parms.sx;
 const sy = parms.sy;
 const ex = parms.ex;
 const ey = parms.ey;
 const type = parms.type;
 const lineWidth = parms.lineWidth;
 const color = parms.color;

 let p0, p1, p2, p3;
 let pathData = "";
 switch(type){

   case "straight":
    p0 = (sx + leftOffset) + "," + sy;
    p1 = (ex - rightOffset) + "," + sy;
    pathData = `M ${p0} L ${p0} ${p1}`;
   break;

   case "curve":
    p0 = sx + "," + (sy + leftOffset);
    p1 = sx + "," + ey;
    p2 = (ex - rightOffset) + "," + ey;
    pathData = `M ${p0} L ${p0} ${p1} ${p2}`;
   break;

   case "snake":
    const mx = (ex - sx)/2 + sx;
    p0 = (sx + leftOffset) + "," + sy;
    p1 = mx + "," + sy;
    p2 = mx + "," + ey;
    p3 = (ex - rightOffset) + "," + ey;
    pathData = `M ${p0} L ${p0} ${p1} ${p2} ${p3}`;
   break;

 }

 const path = new Path();
 path.stroke = new Color(color);
 path.strokeWidth = lineWidth;
 path.pathData = pathData;
 path.name = "line";
 return path;
}


function createEdge(parms, isRight){
 const x = parms.x;
 const y = parms.y;
 const type = parms.type;
 const lineWidth = parms.lineWidth;
 const color = parms.color;
 const scale = parms.scale/100;

 let p0,p1,p2,p3;
 let pathData = "";
 let stroke;
 let fill;
 let path;

 switch(type){

   case "arrow1":
     if(isRight){
       p0 = (-15*scale) + "," + (-8*scale);
       p1 = "0,0";
       p2 = (-15*scale) + "," + (8*scale);
       p3 = (-12*scale) + ",0";
     }else{
       p0 = (15*scale) + "," + (-8*scale);
       p1 = "0,0";
       p2 = (15*scale) + "," + (8*scale);
       p3 = (12*scale) + ",0";
     }
     pathData = `M ${p0} L ${p0} ${p1} ${p2} ${p3} Z`;
     path = new Path();
     path.pathData = pathData;
     path.stroke = new Color(color);
     path.fill = new Color(color);
     path.moveInParentCoordinates(x,y);
   break;

   case "arrow2":
     if(isRight){
       p0 = (-15*scale) + "," + (-8*scale);
       p1 = "0,0";
       p2 = (-15*scale) + "," + (8*scale);
     }else{
       p0 = (15*scale) + "," + (-8*scale);
       p1 = "0,0";
       p2 = (15*scale) + "," + (8*scale);
     }
     pathData = `M ${p0} L ${p0} ${p1} ${p2} Z`;
     path = new Path();
     path.pathData = pathData;
     path.stroke = new Color(color);
     path.fill = new Color(color);
     path.moveInParentCoordinates(x,y);
   break;

   case "arrow3":
    if(isRight){
      p0 = (-15*scale) + "," + (-10*scale);
      p1 = "0,0";
      p2 = (-15*scale) + "," + (10*scale);
    }else{
      p0 = (15*scale) + "," + (-10*scale);
      p1 = "0,0";
      p2 = (15*scale) + "," + (10*scale);
    }
    pathData = `M ${p0} L ${p0} ${p1} ${p2}`;
    path = new Path();
    path.pathData = pathData;
    path.stroke = new Color(color);
    path.moveInParentCoordinates(x,y);
   break;

   case "circle1":
    path = new Ellipse();
    path.radiusX = 8*scale;
    path.radiusY = 8*scale;
    path.stroke = new Color(color);
    path.moveInParentCoordinates(x-8*scale, y-8*scale);
   break;

   case "circle2":
    path = new Ellipse();
    path.radiusX = 8*scale;
    path.radiusY = 8*scale;
    path.stroke = new Color(color);
    path.fill = new Color(color);
    path.moveInParentCoordinates(x-8*scale, y-8*scale);
   break;

   case "square1":
    path = new Rectangle();
    path.width = 16*scale;
    path.height = 16*scale;
    path.stroke = new Color(color);
    path.moveInParentCoordinates(x-8*scale, y-8*scale);
   break;

   case "square2":
    path = new Rectangle();
    path.width = 16*scale;
    path.height = 16*scale;
    path.stroke = new Color(color);
    path.fill = new Color(color);
    path.moveInParentCoordinates(x-8*scale, y-8*scale);

   break;

   case "bar":
     p0 = "0," + (-8*scale);
     p1 = "0," + (8*scale);
   pathData = `M ${p0} L ${p0} ${p1}`;
   path = new Path();
   path.pathData = pathData;
   path.stroke = new Color(color);
   path.moveInParentCoordinates(x,y);
   break;

   case "none":
    path = new Path();
    path.moveInParentCoordinates(x,y);
   break;
 }
 path.strokeWidth = lineWidth;
 if(isRight){
   path.name = "rightEdge";
 }else{
   path.name = "leftEdge";
 }

 return path;
}

module.exports.drawConnector = drawConnector;
module.exports.lineOffset = lineOffset;
