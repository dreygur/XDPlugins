const {Rectangle, Text, Line, Ellipse, Polygon,} = require("scenegraph");
class Utils{
    createRectangle(args){
        if(args.length == 7){    
            let newRect = new Rectangle();
            newRect.width = args[0];
            newRect.height = args[1];
            newRect.fillEnabled = args[2];
            newRect.strokeEnabled = args[3];
            newRect.fill = args[4];
            newRect.shadow = args[5];
            newRect.name = args[6];
            return newRect;
        }
        else{
            return null;
        }
    }
    createText(args){
        if(args.length == 4){
            var text = new Text();
            text.text = args[0];
            text.fill = args[1];
            text.textAlign = args[2];
            text.fontSize = args[3];
            return text;
        }
        else{
            return null;
        }
    }
    
    createLine(args){
        if(args.length == 3){
            var line = new Line();
            var points = args[0];
            line.setStartEnd(points[0], points[1], points[2], points[3]);
            line.strokeEnabled = args[1];
            line.stroke = args[2];
            return line;
        }
        else{
            return null;
        }
    }
    
    createEllipse(args){
        if(args.length == 7){
            let newEllipse = new Ellipse();
            newEllipse.radiusX = args[0];
            newEllipse.radiusY = args[1];
            newEllipse.fillEnabled = args[2];
            newEllipse.strokeEnabled = args[3];
            newEllipse.fill = args[4];
            newEllipse.shadow = args[5];
            newEllipse.name = args[6];
            return newEllipse;
        }
        else{
            return null;
        }
    }
    
    createPolygon(args){
        if(args.length == 6){
            var polygon = new Polygon();
            polygon.width = args[0];
            polygon.height = args[1];
            polygon.cornerCount = args[2];
            polygon.setAllCornerRadii(args[3]);
            polygon.fill = args[4];
            polygon.name = args[5];
            return polygon;
        }
        else{
            return null;
        }
    } 
}
let object = new Utils();
module.exports = object;