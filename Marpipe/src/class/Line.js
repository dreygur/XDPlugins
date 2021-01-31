
export default class Line {
  constructor(name, boundsInParent) {
    this._name = name;
    this._type = 'Line';
    this._width = boundsInParent.width;
    this._height = boundsInParent.height;
    this._boundsInParent = boundsInParent;
  }

  set start(startObj) {
    this._start = {
      x: startObj.x,
      y: startObj.y
    }
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

  set opacity(opacity) {
    this._opacity = opacity;
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

  get start() {
    return this._start;
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

  get opacity() {
    return this._opacity;
  }

  load(targetArtboardNode) {
    const scenegraph = require('scenegraph');
    let lineNode = new scenegraph.Line();

    if (this._start.x === 0 && this._start.y === 0) {//downward line placement according to calculations
      lineNode.setStartEnd(this._boundsInParent.x, this._boundsInParent.y, this._boundsInParent.x + this._width, this._boundsInParent.y + this._height);
    }
    else {//upward line placement according to calculations
      lineNode.setStartEnd(this._boundsInParent.x, this._boundsInParent.y + this._height, this._boundsInParent.x + this._width, this._boundsInParent.y);
    }

    lineNode.strokeEnabled = this._strokeEnabled;
    lineNode.stroke = this._stroke;
    lineNode.strokeWidth = this._strokeWidth;
    lineNode.strokePosition = this._strokePosition;
    lineNode.strokeEndCaps = this._strokeEndCaps;
    lineNode.strokeJoins = this._strokeJoins;
    lineNode.strokeMiterLimit = this._strokeMiterLimit;
    lineNode.strokeDashArray = this._strokeDashArray;
    lineNode.strokeDashOffset = this._strokeDashOffset;
    lineNode.shadow = this._shadow;
    lineNode.blur = this._blur;
    lineNode.opacity = this._opacity;

    targetArtboardNode.addChild(lineNode);

    return lineNode;
  }

  equal(artworkNode) {

    if (this._type !== artworkNode.constructor.name) {
      return false;
    }

    // debugging purpose
    // let data = `
    // 	width: ${this._width}:${artworkNode.boundsInParent.width} - ${this._width === artworkNode.boundsInParent.width}
    // 	height: ${this._height}:${artworkNode.boundsInParent.height} - ${this._height === artworkNode.boundsInParent.height}
    // 	boundsInParent.x: ${this._boundsInParent.x}:${artworkNode.boundsInParent.x} - ${this._boundsInParent.x === artworkNode.boundsInParent.x}
    // 	boundsInParent.y: ${this._boundsInParent.y}:${artworkNode.boundsInParent.y} - ${this._boundsInParent.y === artworkNode.boundsInParent.y}
    // 	start.x: ${this._start.x}:${artworkNode.start.x} - ${this._start.x === artworkNode.start.x}
    // 	start.y: ${this._start.y}:${artworkNode.start.y} - ${this._start.y === artworkNode.start.y}
    // 	stroke: ${this._stroke.value}:${ artworkNode.stroke.value} - ${this._stroke.value === artworkNode.stroke.value}
    // 	strokeWidth: ${this._strokeWidth}:${artworkNode.strokeWidth} - ${this._strokeWidth === artworkNode.strokeWidth}
    // 	strokePosition: ${this._strokePosition}:${artworkNode.strokePosition} - ${this._strokePosition === artworkNode.strokePosition}
    // 	strokeEndCaps: ${this._strokeEndCaps}:${artworkNode.strokeEndCaps} - ${this._strokeEndCaps === artworkNode.strokeEndCaps}
    // 	strokeJoins: ${this._strokeJoins}:${artworkNode.strokeJoins} - ${this._strokeJoins === artworkNode.strokeJoins}
    // 	strokeMiterLimit: ${this._strokeMiterLimit}:${artworkNode.strokeMiterLimit} - ${this._strokeMiterLimit === artworkNode.strokeMiterLimit}
    // 	this._strokeDashArray: ${this._strokeDashArray}
    // 	artworkNode.strokeDashArray: ${artworkNode.strokeDashArray}
    // 	strokeDashOffset: ${this._strokeDashOffset}:${artworkNode.strokeDashOffset} - ${this._strokeDashOffset === artworkNode.strokeDashOffset}
    // 	shadow: ${this._shadow}:${artworkNode.shadow} - ${this._shadow === artworkNode.shadow}
    // 	blur: ${this._blur}:${artworkNode.blur} - ${this._blur === artworkNode.blur}
    // `;		

    // console.log(data);

    //check if there is any difference in the property values
    if (this._width !== artworkNode.boundsInParent.width ||
      this._height !== artworkNode.boundsInParent.height ||
      this._boundsInParent.x !== artworkNode.boundsInParent.x ||
      this._boundsInParent.y !== artworkNode.boundsInParent.y ||
      this._start.x !== artworkNode.start.x ||
      this._start.y !== artworkNode.start.y ||
      this._stroke.value !== artworkNode.stroke.value ||
      this._strokeWidth !== artworkNode.strokeWidth ||
      this._strokePosition !== artworkNode.strokePosition ||
      this._strokeEndCaps !== artworkNode.strokeEndCaps ||
      this._strokeJoins !== artworkNode.strokeJoins ||
      this._strokeMiterLimit !== artworkNode.strokeMiterLimit ||
      this._strokeDashOffset !== artworkNode.strokeDashOffset ||
      this._blur !== artworkNode.blur) {

      return false;
    }

    if (this._shadow !== null || artworkNode.shadow !== null) {
      if (this._shadow !== null && artworkNode.shadow !== null) {

        // debugging purpose
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

    return true;
  }
}