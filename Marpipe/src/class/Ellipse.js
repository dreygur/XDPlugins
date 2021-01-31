
export default class Ellipse {
  constructor(name, boundsInParent) {
    this._type = 'Ellipse';
    this._name = name;
    this._width = boundsInParent.width;
    this._height = boundsInParent.height;
    this._boundsInParent = boundsInParent;
  }

  set radius(radiusObj) {
    this._radiusX = radiusObj.x;
    this._radiusY = radiusObj.y;
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

  //input: an array of img network paths for mapping
  set assetArr(imgFileArr) {
    this._assetArr = imgFileArr;
  }

  get name() {
    return this._name;
  }

  get type() {
    return this._type;
  }

  get boundsInParent() {
    return this._boundsInParent;
  }

  get radiusX() {
    return this._radiusX;
  }

  get radiusY() {
    return this._radiusY;
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

  get fill() {
    return this._fill;
  }

  get opacity() {
    return this._opacity;
  }

  get translation() {
    return this._translation;
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

  load(targetArtboardNode) {
    const scenegraph = require('scenegraph');
    let ellipseNode = new scenegraph.Ellipse();

    ellipseNode.width = this._boundsInParent.width;
    ellipseNode.height = this._boundsInParent.height;
    ellipseNode.radiusX = this._radiusX;
    ellipseNode.radiusY = this._radiusY;
    ellipseNode.strokeEnabled = this._strokeEnabled;
    ellipseNode.stroke = this._stroke;
    ellipseNode.strokeWidth = this._strokeWidth;
    ellipseNode.strokePosition = this._strokePosition;
    ellipseNode.strokeEndCaps = this._strokeEndCaps;
    ellipseNode.strokeJoins = this._strokeJoins;
    ellipseNode.strokeMiterLimit = this._strokeMiterLimit;
    ellipseNode.strokeDashArray = this._strokeDashArray;
    ellipseNode.strokeDashOffset = this._strokeDashOffset;
    ellipseNode.shadow = this._shadow;
    ellipseNode.blur = this._blur;
    ellipseNode.rotateAround(this._rotationDeg, this._rotationCenter);
    ellipseNode.fill = this._fill;
    ellipseNode.opacity = this._opacity;
    ellipseNode.moveInParentCoordinates(this._translation.x, this._translation.y);
    targetArtboardNode.addChild(ellipseNode);

    return ellipseNode;
  }

  equal(artworkNode) {

    if (this._type !== artworkNode.constructor.name) {
      return false;
    }

    //debugging purpose
    // let data = `
    // 	width: ${this._width}:${artworkNode.boundsInParent.width} - ${this._width === artworkNode.boundsInParent.width}
    // 	height: ${this._height}:${artworkNode.boundsInParent.height} - ${this._height === artworkNode.boundsInParent.height}
    // 	radiusX: ${this._radiusX}:${artworkNode.radiusX} - ${this._radiusX === artworkNode.radiusX}
    // 	radiusY: ${this._radiusY}:${artworkNode.radiusY} - ${this._radiusY === artworkNode.radiusY}
    // 	rotation: ${this._rotationDeg}:${artworkNode.rotation} - ${this._rotationDeg === artworkNode.rotation}
    // 	translation.x: ${this._translation.x}:${artworkNode.translation.x} - ${this._translation.x === artworkNode.translation.x}
    // 	translation.y: ${this._translation.y}:${artworkNode.translation.y} - ${this._translation.y === artworkNode.translation.y}
    // 	shadow: ${this._shadow}:${artworkNode.shadow} - ${this._shadow === artworkNode.shadow}
    // 	blur: ${this._blur}:${artworkNode.blur} - ${this._blur === artworkNode.blur}
    // 	stroke: ${this._stroke.value}:${artworkNode.stroke.value} - ${this._stroke.value === artworkNode.stroke.value}
    // 	strokeWidth: ${this._strokeWidth}:${artworkNode.strokeWidth} - ${this._strokeWidth === artworkNode.strokeWidth}
    // 	strokePosition: ${this._strokePosition}:${artworkNode.strokePosition} - ${this._strokePosition === artworkNode.strokePosition}
    // 	strokeEndCaps: ${this._strokeEndCaps}:${artworkNode.strokeEndCaps} - ${this._strokeEndCaps === artworkNode.strokeEndCaps}
    // 	strokeJoins: ${this._strokeJoins}:${artworkNode.strokeJoins} - ${this._strokeJoins === artworkNode.strokeJoins}
    // 	strokeMiterLimit: ${this._strokeMiterLimit}:${artworkNode.strokeMiterLimit} - ${this._strokeMiterLimit === artworkNode.strokeMiterLimit}
    // 	this._strokeDashArray: ${this._strokeDashArray}
    // 	artworkNode.strokeDashArray: ${artworkNode.strokeDashArray}
    // 	strokeDashOffset: ${this._strokeDashOffset}:${artworkNode.strokeDashOffset} - ${this._strokeDashOffset === artworkNode.strokeDashOffset}
    // `

    // console.log(data);

    if (this._width !== artworkNode.boundsInParent.width ||
      this._height !== artworkNode.boundsInParent.height ||
      this._radiusX !== artworkNode.radiusX ||
      this._radiusY !== artworkNode.radiusY ||
      this._rotationDeg !== artworkNode.rotation ||
      this._translation.x !== artworkNode.translation.x ||
      this._translation.y !== artworkNode.translation.y ||
      this._blur !== artworkNode.blur ||
      this._stroke.value !== artworkNode.stroke.value ||
      this._strokeWidth !== artworkNode.strokeWidth ||
      this._strokePosition !== artworkNode.strokePosition ||
      this._strokeEndCaps !== artworkNode.strokeEndCaps ||
      this._strokeJoins !== artworkNode.strokeJoins ||
      this._strokeMiterLimit !== artworkNode.strokeMiterLimit ||
      this._strokeDashOffset !== artworkNode.strokeDashOffset) {

      return false;
    }

    if (this._shadow !== null || artworkNode.shadow !== null) {
      if (this._shadow !== null && artworkNode.shadow !== null) {

        //debugging purpose
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

    //check if there is any difference in the property value
    if (this._strokeDashArray.length === artworkNode.strokeDashArray.length) {
      if (this._strokeDashArray.length > 0) {
        //verify if each array value matches
        for (let i = 0; i < this._strokeDashArray.length; i++) {
          if (this._strokeDashArray[i] !== artworkNode.strokeDashArray[i]) {//once there is an unmatch, then it's not equal
            return false;
          }
        }
      }
    }
    else {
      return false;
    }

    return true;
  }
}