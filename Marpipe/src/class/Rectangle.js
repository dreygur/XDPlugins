
export default class Rectangle {
  constructor(name, width, height) {
    this._name = name;
    this._type = 'Rectangle';
    this._width = width;
    this._height = height;
  }

  set cornerRadii(cornerRadii) {
    this._cornerRadii = cornerRadii;
  }

  set stroke(strokeObj) {
    this._stroke = strokeObj.stroke;
    this._strokeWidth = strokeObj.strokeWidth;
    this._strokePosition = strokeObj.strokePosition;
    this._strokeEndCaps = strokeObj.strokeEndCaps;
    this._strokeJoins = strokeObj.strokeJoins;
    this._strokeMiterLimit = strokeObj.strokeMiterLimit;
    this._strokeDashArray = strokeObj.strokeDashArray;
    this._strokeDashOffset = strokeObj.strokeDashOffset;
    this._strokeEnabled = strokeObj.strokeEnabled;
  }

  set shadow(shadow) {
    this._shadow = shadow;
  }

  set blur(blur) {
    this._blur = blur;
  }

  set rotation(rotation) {
    this._rotationDeg = rotation;
    this._rotationCenter = {
      x: 0,
      y: 0
    }
  }

  set translation(translationObj) {
    this._translation = {
      x: translationObj.x,
      y: translationObj.y
    }
  }

  set fill(fill) {
    this._fill = fill;
  }

  set opacity(opacity) {
    this._opacity = opacity;
  }

  //each artwork can be mapped to a group of images, input: array of network
  set assetArr(imgArr) {
    this._assetArr = imgArr;
  }

  get name() {
    return this._name;
  }

  get type() {
    return this._type;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  get cornerRadii() {
    return this._cornerRadii;
  }

  get strokeEnabled() {
    return this._strokeEnabled;
  }

  get stroke() {
    return this._stroke;
  }

  get strokeWidth() {
    return this._strokeWidth;
  }

  get strokePosition() {
    return this._strokePosition;
  }

  get strokeEndCaps() {
    return this._strokeEndCaps;
  }

  get strokeJoins() {
    return this._strokeJoins;
  }

  get strokeMiterLimit() {
    return this._strokeMiterLimit;
  }

  get strokeDashArray() {
    return this._strokeDashArray;
  }

  get strokeDashOffset() {
    return this._strokeDashOffset;
  }

  get shadow() {
    return this._shadow;
  }

  get blur() {
    return this._blur;
  }

  get rotation() {
    return this._rotationDeg;
  }

  get translation() {
    return this._translation;
  }

  get fill() {
    return this._fill;
  }

  get opacity() {
    return this._opacity;
  }

  get assetArr() {
    return this._assetArr;
  }

  isMapped() {
    if (this._assetArr === undefined) {
      return false;
    }
    else {
      return true;
    }
  }

  //creates a duplicate of graphicObject and outputs on the selected artboard
  load(targetArtboardNode) {
    const scenegraph = require('scenegraph');
    let rectangleNode = new scenegraph.Rectangle();

    rectangleNode.width = this._width;
    rectangleNode.height = this._height;
    rectangleNode.strokeEnabled = this._strokeEnabled;
    rectangleNode.stroke = this._stroke;
    rectangleNode.strokeWidth = this._strokeWidth;
    rectangleNode.strokePosition = this._strokePosition;
    rectangleNode.strokeEndCaps = this._strokeEndCaps;
    rectangleNode.strokeJoins = this._strokeJoins;
    rectangleNode.strokeMiterLimit = this._strokeMiterLimit;
    rectangleNode.strokeDashArray = this._strokeDashArray;
    rectangleNode.strokeDashOffset = this._strokeDashOffset;
    rectangleNode.shadow = this._shadow;
    rectangleNode.blur = this._blur;
    rectangleNode.cornerRadii = this._cornerRadii;
    rectangleNode.rotateAround(this._rotationDeg, this._rotationCenter);
    rectangleNode.fill = this._fill;
    rectangleNode.opacity = this._opacity;

    rectangleNode.moveInParentCoordinates(this._translation.x, this._translation.y);
    targetArtboardNode.addChild(rectangleNode);

    return rectangleNode;
  }


  //verifies input artworkNode is the same as the graphicObject
  equal(artworkNode) {

    if (this._type !== artworkNode.constructor.name) {
      // console.log('unmatch 1');
      return false;
    }

    //output data for debugging purpose
    let data = `
			width: ${this._width}:${artworkNode.width} - ${this._width === artworkNode.width}
			height: ${this._height}:${artworkNode.height} - ${this._height === artworkNode.height}
			stroke: ${this._stroke.value}:${artworkNode.stroke.value} - ${this._stroke.value === artworkNode.stroke.value}
			strokeWidth: ${this._strokeWidth}:${artworkNode.strokeWidth} - ${this._strokeWidth === artworkNode.strokeWidth}
			strokePosition: ${this._strokePosition}:${artworkNode.strokePosition} - ${this._strokePosition === artworkNode.strokePosition}
			strokeEndCaps: ${this._strokeEndCaps}:${artworkNode.strokeEndCaps} - ${this._strokeEndCaps === artworkNode.strokeEndCaps}
			strokeJoins: ${this._strokeJoins}:${artworkNode.strokeJoins} - ${this._strokeJoins === artworkNode.strokeJoins}
			strokeMiterLimit: ${this._strokeMiterLimit}:${artworkNode.strokeMiterLimit} - ${this._strokeMiterLimit === artworkNode.strokeMiterLimit}
			strokeDashArray: ${this._strokeDashArray}:${artworkNode.strokeDashArray} - ${this._strokeDashArray === artworkNode.strokeDashArray}
			strokeDashOffset: ${this._strokeDashOffset}:${artworkNode.strokeDashOffset} - ${this._strokeDashOffset === artworkNode.strokeDashOffset}
			shadow: ${this._shadow}:${artworkNode.shadow} - ${this._shadow === artworkNode.shadow}
			blur: ${this._blur}:${artworkNode.blur} - ${this._blur === artworkNode.blur}
			cornerRadii.topLeft: ${this._cornerRadii.topLeft}:${artworkNode.cornerRadii.topLeft} - ${this._cornerRadii.topLeft === artworkNode.cornerRadii.topLeft}
			cornerRadii.topRight: ${this._cornerRadii.topRight}:${artworkNode.cornerRadii.topRight} - ${this._cornerRadii.topRight === artworkNode.cornerRadii.topRight}
			cornerRadii.bottomLeft: ${this._cornerRadii.bottomLeft}:${artworkNode.cornerRadii.bottomLeft} -  ${this._cornerRadii.bottomLeft === artworkNode.cornerRadii.bottomLeft}
			cornerRadii.bottomRight: ${this._cornerRadii.bottomRight}:${artworkNode.cornerRadii.bottomRight} - ${this._cornerRadii.bottomRight === artworkNode.cornerRadii.bottomRight}
			rotation: ${this._rotationDeg}:${artworkNode.rotation} - ${this._rotationDeg === artworkNode.rotation}
			translation.x: ${this._translation.x}:${artworkNode.translation.x} - ${this._translation.x === artworkNode.translation.x}
			translation.y: ${this._translation.y}:${artworkNode.translation.y} - ${this._translation.y === artworkNode.translation.y}
		`;

    // console.log(data);

    //check any difference in property values
    if (this._width !== artworkNode.width ||
      this._height !== artworkNode.height ||
      this._stroke.value !== artworkNode.stroke.value ||
      this._strokeWidth !== artworkNode.strokeWidth ||
      this._strokePosition !== artworkNode.strokePosition ||
      this._strokeEndCaps !== artworkNode.strokeEndCaps ||
      this._strokeJoins !== artworkNode.strokeJoins ||
      this._strokeMiterLimit !== artworkNode.strokeMiterLimit ||
      this._strokeDashOffset !== artworkNode.strokeDashOffset ||
      this._blur !== artworkNode.blur ||
      this._cornerRadii.topLeft !== artworkNode.cornerRadii.topLeft ||
      this._cornerRadii.topRight !== artworkNode.cornerRadii.topRight ||
      this._cornerRadii.bottomLeft !== artworkNode.cornerRadii.bottomLeft ||
      this._cornerRadii.bottomRight !== artworkNode.cornerRadii.bottomRight ||
      this._rotationDeg !== artworkNode.rotation ||
      this._translation.x !== artworkNode.translation.x ||
      this._translation.y !== artworkNode.translation.y) {

      // console.log(data);
      // console.log('unmatch 2');
      return false;
    }

    if (this._shadow !== null || artworkNode.shadow !== null) {
      if (this._shadow !== null && artworkNode.shadow !== null) {
        // 	let data = `
        // shadow.x: ${this._shadow.x}:${artworkNode.shadow.x} - ${this._shadow.x === artworkNode.shadow.x}
        // shadow.y: ${this._shadow.y}:${artworkNode.shadow.y} - ${this._shadow.y === artworkNode.shadow.y}
        // shadow.blur: ${this._shadow.blur}:${artworkNode.shadow.blur} - ${this._shadow.blur === artworkNode.shadow.blur}
        // shadow.color.value: ${this._shadow.color.value}:${artworkNode.shadow.color.value} - ${this._shadow.color.value === artworkNode.shadow.color.value}
        // shadow.visible: ${this._shadow.visible}:${artworkNode.shadow.visible} - ${this._shadow.visible === artworkNode.shadow.visible}
        // 	`;

        if (this._shadow.x !== artworkNode.shadow.x ||
          this._shadow.y !== artworkNode.shadow.y ||
          this._shadow.blur !== artworkNode.shadow.blur ||
          this._shadow.color.value !== artworkNode.shadow.color.value ||
          this._shadow.visible !== artworkNode.shadow.visible) {
          return false;
        }
      }
      else {
        return false;
      }
    }

    if (this._strokeDashArray.length === artworkNode.strokeDashArray.length) {
      if (this._strokeDashArray.length > 0) {
        //verify if each array value matches
        for (let i = 0; i < this._strokeDashArray.length; i++) {
          if (this._strokeDashArray[i] !== artworkNode.strokeDashArray[i]) {//once there is an unmatch, then it's not equal
            // console.log('unmatch 3');
            return false;
          }
        }
      }
    }
    else {
      // console.log('unmatch 4');
      return false;
    }

    return true;
  }
}