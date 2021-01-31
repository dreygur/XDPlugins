
export default class Path {
  constructor(name, pathData) {
    this._name = name;
    this._type = 'Path';
    this._pathData = pathData;
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

  get pathData() {
    return this._pathData;
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
    let pathNode = new scenegraph.Path();

    pathNode.pathData = this._pathData;
    pathNode.strokeEnabled = this._strokeEnabled;
    pathNode.stroke = this._stroke;
    pathNode.strokeWidth = this._strokeWidth;
    pathNode.strokePosition = this._strokePosition;
    pathNode.strokeEndCaps = this._strokeEndCaps;
    pathNode.strokeJoins = this._strokeJoins;
    pathNode.strokeMiterLimit = this._strokeMiterLimit;
    pathNode.strokeDashArray = this._strokeDashArray;
    pathNode.strokeDashOffset = this._strokeDashOffset;
    pathNode.shadow = this._shadow;
    pathNode.blur = this._blur;
    pathNode.rotateAround(this._rotationDeg, this._rotationCenter);
    pathNode.fill = this._fill;
    pathNode.opacity = this._opacity;
    pathNode.moveInParentCoordinates(this._translation.x, this._translation.y);
    // targetArtboard.items[0].addChild(pathNode);											//add path to artboard
    targetArtboardNode.addChild(pathNode);											//add path to artboard

    return pathNode;
  }

  equal(artworkNode) {

    if (this._type !== artworkNode.constructor.name) {
      return false;
    }

    //output data for debugging purpose
    // let data = `
    // 	pathData: ${this._pathData}:${artworkNode.pathData} - ${this._pathData === artworkNode.pathData}
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
    // `;

    // console.log(data);

    //check if there is any difference in the property value
    if (this._pathData !== artworkNode.pathData ||
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