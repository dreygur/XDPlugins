import Artboard from '@/class/Artboard.js';
import Rectangle from '@/class/Rectangle.js';
import Ellipse from '@/class/Ellipse.js';
import Polygon from '@/class/Polygon.js';
import Line from '@/class/Line.js';
import Path from '@/class/Path.js';
import Text from '@/class/Text.js';
import Group from '@/class/Group.js';


export default {
  methods: {
    artboardClone(artboardNode, name) {//Create an object for artboardNode
      let artboardObj = new Artboard(name, artboardNode.width, artboardNode.height);
      artboardObj.fill = artboardNode.fill;
      let children = [];

      artboardNode.children.forEach(node => {
        let object = this.nodeClone(node);

        if (object) {
          children.push(object);
        }
      })
      artboardObj.children = children;

      return artboardObj;
    },
    nodeClone(node) {//Create an object for node
      let object;

      if (node.visible === true) {
        switch (node.constructor.name) {
          case 'Rectangle':
            object = this.rectangleClone(node);
            break;
          case 'Ellipse':
            object = this.ellipseClone(node);
            break;
          case 'Polygon':
            object = this.polygonClone(node);
            break;
          case 'Line':
            object = this.lineClone(node);
            break;
          case 'Path':
            object = this.pathClone(node);
            break;
          case 'Text':
            object = this.textClone(node);
            break;
          case 'Group':
            object = this.groupClone(node);
            break;
        }
      }

      return object;	                                            //undefined if node is not visible
    },
    rectangleClone(node) {//Create an object for rectangle graphicNode
      let rectangleObj = new Rectangle(node.name, node.width, node.height);

      rectangleObj.stroke = {
        stroke: node.stroke,
        strokeWidth: node.strokeWidth,
        strokePosition: node.strokePosition,
        strokeEndCaps: node.strokeEndCaps,
        strokeJoins: node.strokeJoins,
        strokeMiterLimit: node.strokeMiterLimit,
        strokeDashArray: node.strokeDashArray,
        strokeDashOffset: node.strokeDashOffset,
        strokeEnabled: node.strokeEnabled
      };
      rectangleObj.cornerRadii = node.cornerRadii;
      rectangleObj.blur = node.blur;
      rectangleObj.shadow = node.shadow;
      rectangleObj.rotation = node.rotation;
      rectangleObj.translation = node.translation;
      rectangleObj.fill = node.fill;
      rectangleObj.opacity = node.opacity;

      return rectangleObj;
    },
    ellipseClone(node) {//Create an object for ellipse graphicNode
      let ellipseObj = new Ellipse(node.name, node.boundsInParent);

      ellipseObj.radius = {
        x: node.radiusX,
        y: node.radiusY
      }
      ellipseObj.fill = node.fill;
      ellipseObj.rotation = node.rotation;
      ellipseObj.translation = node.translation;
      ellipseObj.shadow = node.shadow;
      ellipseObj.blur = node.blur;
      ellipseObj.opacity = node.opacity;
      ellipseObj.stroke = {
        stroke: node.stroke,
        strokeWidth: node.strokeWidth,
        strokePosition: node.strokePosition,
        strokeEndCaps: node.strokeEndCaps,
        strokeJoins: node.strokeJoins,
        strokeMiterLimit: node.strokeMiterLimit,
        strokeDashArray: node.strokeDashArray,
        strokeDashOffset: node.strokeDashOffset,
        strokeEnabled: node.strokeEnabled
      };

      return ellipseObj;
    },
    polygonClone(node) {//Create an object for polygon graphicNode
      let polygonObj = new Polygon(node.name, node.width, node.height);

      polygonObj.fill = node.fill;
      polygonObj.cornerCount = node.cornerCount;
      polygonObj.cornerRadii = node.cornerRadii;
      polygonObj.rotation = node.rotation;
      polygonObj.translation = node.translation;
      polygonObj.shadow = node.shadow;
      polygonObj.blur = node.blur;
      polygonObj.opacity = node.opacity;
      polygonObj.stroke = {
        stroke: node.stroke,
        strokeWidth: node.strokeWidth,
        strokePosition: node.strokePosition,
        strokeEndCaps: node.strokeEndCaps,
        strokeJoins: node.strokeJoins,
        strokeMiterLimit: node.strokeMiterLimit,
        strokeDashArray: node.strokeDashArray,
        strokeDashOffset: node.strokeDashOffset,
        strokeEnabled: node.strokeEnabled
      };

      return polygonObj;
    },
    lineClone(node) {//Create an object for line graphicNode
      let lineObj = new Line(node.name, node.boundsInParent);

      lineObj.start = node.start;
      lineObj.shadow = node.shadow;
      lineObj.blur = node.blur;
      lineObj.opacity = node.opacity;
      lineObj.stroke = {
        stroke: node.stroke,
        strokeWidth: node.strokeWidth,
        strokePosition: node.strokePosition,
        strokeEndCaps: node.strokeEndCaps,
        strokeJoins: node.strokeJoins,
        strokeMiterLimit: node.strokeMiterLimit,
        strokeDashArray: node.strokeDashArray,
        strokeDashOffset: node.strokeDashOffset,
        strokeEnabled: node.strokeEnabled
      };

      return lineObj;
    },
    pathClone(node) {//Create an object for path graphicNode
      let pathObj = new Path(node.name, node.pathData);

      pathObj.fill = node.fill;
      pathObj.rotation = node.rotation;
      pathObj.translation = node.translation;
      pathObj.shadow = node.shadow;
      pathObj.blur = node.blur;
      pathObj.opacity = node.opacity;
      pathObj.stroke = {
        stroke: node.stroke,
        strokeWidth: node.strokeWidth,
        strokePosition: node.strokePosition,
        strokeEndCaps: node.strokeEndCaps,
        strokeJoins: node.strokeJoins,
        strokeMiterLimit: node.strokeMiterLimit,
        strokeDashArray: node.strokeDashArray,
        strokeDashOffset: node.strokeDashOffset,
        strokeEnabled: node.strokeEnabled
      };

      return pathObj;
    },
    textClone(node) {//Create an object for text graphicNode
      let textName = ``;
      let textObj = new Text(textName, node.text);

      textObj.localBounds = node.localBounds;
      textObj.styleRanges = node.styleRanges[0];				      //only takes in the first character's style for reference
      textObj.flipY = node.flipY;
      textObj.textAlign = node.textAlign;
      textObj.spacing = {
        lineSpacing: node.lineSpacing,
        paragraphSpacing: node.paragraphSpacing
      }
      textObj.areaBox = node.areaBox;
      textObj.rotation = node.rotation;
      textObj.translation = node.translation;
      textObj.shadow = node.shadow;
      textObj.blur = node.blur;
      textObj.opacity = node.opacity;
      textObj.stroke = {
        stroke: node.stroke,
        strokeWidth: node.strokeWidth,
        strokePosition: node.strokePosition,
        strokeEndCaps: node.strokeEndCaps,
        strokeJoins: node.strokeJoins,
        strokeMiterLimit: node.strokeMiterLimit,
        strokeDashArray: node.strokeDashArray,
        strokeDashOffset: node.strokeDashOffset,
        strokeEnabled: node.strokeEnabled
      };

      return textObj;
    },
    groupClone(node) {//Create an object for group
      let groupObj = new Group(node.name);

      groupObj.translation = node.translation;
      let childrenObj = [];

      //creates obj for each children
      node.children.forEach(graphicNode => {
        let artworkObj = this.nodeClone(graphicNode);

        if (artworkObj) {//if defined
          childrenObj.push(artworkObj);
        }
      })

      groupObj.children = childrenObj;

      return groupObj;
    }
  }
}