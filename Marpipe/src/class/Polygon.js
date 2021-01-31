
export default class Polygon {
  constructor(name, width, height) {
    this._name = name;
    this._type = 'Polygon';
    this._width = width;
    this._height = height;
  }

  set cornerCount(cornerCount) {
    this._cornerCount = cornerCount;
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

  //input: an array of img network paths 
  set assetArr(imgFileArr) {
    this._assetArr = imgFileArr;
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

  get cornerCount() {
    return this._cornerCount;
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
    let polygonNode = new scenegraph.Polygon();

    polygonNode.width = this._width;
    polygonNode.height = this._height;
    polygonNode.cornerCount = this._cornerCount;
    polygonNode.setAllCornerRadii(this._cornerRadii[0]);
    polygonNode.strokeEnabled = this._strokeEnabled;
    polygonNode.cornerRaddi = this._cornerRadii;
    polygonNode.stroke = this._stroke;
    polygonNode.strokeWidth = this._strokeWidth;
    polygonNode.strokePosition = this._strokePosition;
    polygonNode.strokeEndCaps = this._strokeEndCaps;
    polygonNode.strokeJoins = this._strokeJoins;
    polygonNode.strokeMiterLimit = this._strokeMiterLimit;
    polygonNode.strokeDashArray = this._strokeDashArray;
    polygonNode.strokeDashOffset = this._strokeDashOffset;
    polygonNode.shadow = this._shadow;
    polygonNode.blur = this._blur;
    polygonNode.rotateAround(this._rotationDeg, this._rotationCenter);
    polygonNode.fill = this._fill;
    polygonNode.opacity = this._opacity;
    polygonNode.moveInParentCoordinates(this._translation.x, this._translation.y);
    // targetArtboard.items[0].addChild(polygonNode); 
    targetArtboardNode.addChild(polygonNode);

    return polygonNode;
  }

  equal(artworkNode) {

    if (this._type !== artworkNode.constructor.name) {
      return false;
    }

    //output data for debugging purpose
    // let data = `
    // 	width: ${this._width}:${artworkNode.width} - ${this._width === artworkNode.width}
    // 	height: ${this._height}:${artworkNode.height} - ${this._height === artworkNode.height}
    // 	cornerCount: ${this._cornerCount}:${artworkNode.cornerCount} - ${this._cornerCount === artworkNode.cornerCount}
    // 	cornerRadii: ${this._cornerRadii}:${artworkNode.cornerRadii} - ${this._cornerRadii === artworkNode.cornerRadii}
    // 	stroke: ${this._stroke.value}:${artworkNode.stroke.value} - ${this._stroke.value === artworkNode.stroke.value}
    // 	strokeWidth: ${this._strokeWidth}:${artworkNode.strokeWidth} - ${this._strokeWidth === artworkNode.strokeWidth}
    // 	strokePosition: ${this._strokePosition}:${artworkNode.strokePosition} - ${this._strokePosition === artworkNode.strokePosition}
    // 	strokeEndCaps: ${this._strokeEndCaps}:${artworkNode.strokeEndCaps} - ${this._strokeEndCaps === artworkNode.strokeEndCaps}
    // 	strokeJoins: ${this._strokeJoins}:${artworkNode.strokeJoins} - ${this._strokeJoins === artworkNode.strokeJoins}
    // 	strokeMiterLimit: ${this._strokeMiterLimit}:${artworkNode.strokeMiterLimit} - ${this._strokeMiterLimit === artworkNode.strokeMiterLimit}
    // 	this._strokeDashArray: ${this._strokeDashArray} - 
    // 	artworkNode.strokeDashArray: ${artworkNode.strokeDashArray} - 
    // 	strokeDashOffset: ${this._strokeDashOffset}:${artworkNode.strokeDashOffset} - ${this._strokeDashOffset === artworkNode.strokeDashOffset}
    // 	shadow: ${this._shadow}:${artworkNode.shadow} - ${this._shadow === artworkNode.shadow}
    // 	blur: ${this._blur}:${artworkNode.blur} - ${this._blur === artworkNode.blur}
    // 	rotation: ${this._rotationDeg}:${artworkNode.rotation} - ${this._rotationDeg === artworkNode.rotation}
    // 	translation.x: ${this._translation.x}:${artworkNode.translation.x} - ${this._translation.x === artworkNode.translation.x}
    // 	translation.y: ${this._translation.y}:${artworkNode.translation.y} - ${this._translation.y === artworkNode.translation.y}
    // `

    // console.log(data);

    //check if there is any difference in the property values
    if (this._width !== artworkNode.width ||
      this._height !== artworkNode.height ||
      this._cornerCount !== artworkNode.cornerCount ||
      this._cornerRadii.topLeft !== artworkNode.cornerRadii.topLeft ||
      this._cornerRadii.topRight !== artworkNode.cornerRadii.topRight ||
      this._cornerRadii.bottomLeft !== artworkNode.cornerRadii.bottomLeft ||
      this._cornerRadii.bottomRight !== artworkNode.cornerRadii.bottomRight ||
      this._stroke.value !== artworkNode.stroke.value ||
      this._strokeWidth !== artworkNode.strokeWidth ||
      this._strokePosition !== artworkNode.strokePosition ||
      this._strokeEndCaps !== artworkNode.strokeEndCaps ||
      this._strokeJoins !== artworkNode.strokeJoins ||
      this._strokeMiterLimit !== artworkNode.strokeMiterLimit ||
      this._strokeDashOffset !== artworkNode.strokeDashOffset ||
      this._blur !== artworkNode.blur ||
      this._rotationDeg !== artworkNode.rotation ||
      this._translation.x !== artworkNode.translation.x ||
      this._translation.y !== artworkNode.translation.y) {

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
            return false;
          }
        }
      }
    }
    else {
      return false;
    }

    return true;;
  }
}