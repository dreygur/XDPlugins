
export default class Text {
  constructor(name, text) {
    this._name = name;
    this._type = 'Text';
    this._text = text;
    this._registrationPt = { x: 0, y: 0 };
  }

  set text(text) {
    this._text = text;
  }

  //to replace current text length with the imported text
  set styleLength(strLength) {
    this._styleRanges[0].length = strLength;
  }

  set localBounds(localBounds) {
    this._localBounds = localBounds;
  }

  set styleRanges(styleRanges) {
    this._styleRanges = [];
    this._styleRanges.push(styleRanges);
  }

  set flipY(flipY) {
    this._flipY = flipY;
  }

  set textAlign(textAlign) {
    this._textAlign = textAlign;
  }

  set spacing(spacingObj) {
    this._lineSpacing = spacingObj.lineSpacing;
    this._paragraphSpacing = spacingObj.paragraphSpacing;
  }

  set areaBox(areaBox) {
    this._areaBox = areaBox;
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

  set registrationPt(registrationPt) {
    this._registrationPt = registrationPt;
  }

  set assetArr(textArr) {
    this._assetArr = textArr;
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

  get text() {
    return this._text;
  }

  get length() {
    return this._text.length;
  }

  get localBounds() {
    return this._localBounds;
  }

  get styleRanges() {
    return this._styleRanges;
  }

  get flipY() {
    return this._flipY;
  }

  get textAlign() {
    return this._textAlign;
  }

  get lineSpacing() {
    return this._lineSpacing;
  }

  get paragraphSpacing() {
    return this._paragraphSpacing;
  }

  get areaBox() {
    return this._areaBox;
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

  get rotation() {
    return this._rotationDeg;
  }

  get translation() {
    return this._translation;
  }

  get registrationPt() {
    return this._registrationPt;
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

  //set the line location of current text according to the original copied text and the new line number by changing the registration point
  setLine(lineNum) {//lineNum starts at 0, 1 means next line, 2 means next next line
    this._registrationPt = { x: 0, y: -1 * lineNum * this._localBounds.height };		//-1 to move downward from orig text direction, lineNum-1 is the number of heights downward, the height is according to the localBounds.height
  }

  //Creates an actual Text artwork based on the data stored in the Text object and paste it onto the artboard
  load(targetArtboardNode) {
    const scenegraph = require('scenegraph');
    let textNode = new scenegraph.Text();

    textNode.text = this._text;
    textNode.styleRanges = this._styleRanges;
    textNode.flipY = this._flipY;
    textNode.textAlign = this._textAlign;
    textNode.lineSpacing = this._lineSpacing;
    textNode.paragraphSpacing = this._paragraphSpacing;
    textNode.areaBox = this._areaBox;
    textNode.strokeEnabled = this._strokeEnabled;
    textNode.stroke = this._stroke;
    textNode.strokeWidth = this._strokeWidth;
    textNode.strokePosition = this._strokePosition;
    textNode.strokeEndCaps = this._strokeEndCaps;
    textNode.strokeJoins = this._strokeJoins;
    textNode.strokeMiterLimit = this._strokeMiterLimit;
    textNode.strokeDashArray = this._strokeDashArray;
    textNode.strokeDashOffset = this._strokeDashOffset;
    textNode.shadow = this._shadow;
    textNode.blur = this._blur;
    textNode.opacity = this._opacity;
    textNode.rotateAround(this._rotationDeg, this._rotationCenter);

    textNode.placeInParentCoordinates(this._registrationPt, this._translation);		//move the text's topLeft point (local coordinate value) to the original text's topLeft point (parent coordinate value)
    // targetArtboard.items[0].addChild(textNode);
    targetArtboardNode.addChild(textNode);

    return textNode;
  }

  equal(artworkNode) {

    if (this._type !== artworkNode.constructor.name) {
      return false;
    }

    // let data = `
    // 	localBounds.x: ${this._localBounds.x}:${artworkNode.localBounds.x} - ${this._localBounds.x === artworkNode.localBounds.x}
    // 	localBounds.y: ${this._localBounds.y}:${artworkNode.localBounds.y} - ${this._localBounds.y === artworkNode.localBounds.y}
    // 	localBounds.width: ${this._localBounds.width}:${artworkNode.localBounds.width} - ${this._localBounds.width === artworkNode.localBounds.width}
    // 	localBounds.height: ${this._localBounds.height}:${artworkNode.localBounds.height} - ${this._localBounds.height === artworkNode.localBounds.height}

    // 	styleRanges.length: ${this._styleRanges[0].length}:${artworkNode.styleRanges[0].length} - ${this._styleRanges[0].length === artworkNode.styleRanges[0].length}
    // 	styleRanges.linkId: ${this._styleRanges[0].linkId}:${artworkNode.styleRanges[0].linkId} - ${this._styleRanges[0].linkId === artworkNode.styleRanges[0].linkId}
    // 	styleRanges.fontFamily: ${this._styleRanges[0].fontFamily}:${artworkNode.styleRanges[0].fontFamily} - ${this._styleRanges[0].fontFamily === artworkNode.styleRanges[0].fontFamily}
    // 	styleRanges.fontStyle: ${this._styleRanges[0].fontStyle}:${artworkNode.styleRanges[0].fontStyle} - ${this._styleRanges[0].fontStyle === artworkNode.styleRanges[0].fontStyle}
    // 	styleRanges.fontSize: ${this._styleRanges[0].fontSize}:${artworkNode.styleRanges[0].fontSize} - ${this._styleRanges[0].fontSize === artworkNode.styleRanges[0].fontSize}
    // 	styleRanges.charSpacing: ${this._styleRanges[0].charSpacing}:${artworkNode.styleRanges[0].charSpacing} - ${this._styleRanges[0].charSpacing === artworkNode.styleRanges[0].charSpacing}
    // 	styleRanges.underline: ${this._styleRanges[0].underline}:${artworkNode.styleRanges[0].underline} - ${this._styleRanges[0].underline === artworkNode.styleRanges[0].underline}
    // 	styleRanges.textTransform: ${this._styleRanges[0].textTransform}:${artworkNode.styleRanges[0].textTransform} - ${this._styleRanges[0].textTransform === artworkNode.styleRanges[0].textTransform}
    // 	styleRanges.textScript: ${this._styleRanges[0].textScript}:${artworkNode.styleRanges[0].textScript} - ${this._styleRanges[0].textScript === artworkNode.styleRanges[0].textScript}
    // 	styleRanges.fill.value: ${this._styleRanges[0].fill.value}:${artworkNode.styleRanges[0].fill.value} - ${this._styleRanges[0].fill.value === artworkNode.styleRanges[0].fill.value}
    // 	styleRanges.strikethrough: ${this._styleRanges[0].strikethrough}:${artworkNode.styleRanges[0].strikethrough} - ${this._styleRanges[0].strikethrough === artworkNode.styleRanges[0].strikethrough}

    // 	translation.x: ${this._translation.x}:${artworkNode.translation.x} - ${this._translation.x === artworkNode.translation.x}
    // 	translation.y: ${this._translation.y}:${artworkNode.translation.y} - ${this._translation.y === artworkNode.translation.y}

    // 	flipY: ${this._flipY}:${artworkNode.flipY} - ${this._flipY === artworkNode.flipY}
    // 	textAlign: ${this._textAlign}:${artworkNode.textAlign} - ${this._textAlign === artworkNode.textAlign}
    // 	lineSpacing: ${this._lineSpacing}:${artworkNode.lineSpacing} - ${this._lineSpacing === artworkNode.lineSpacing}
    // 	paragraphSpacing: ${this._paragraphSpacing}:${artworkNode.paragraphSpacing} - ${this._paragraphSpacing === artworkNode.paragraphSpacing}
    // 	rotation: ${this._rotationDeg}:${artworkNode.rotation} - ${this._rotationDeg === artworkNode.rotation}

    // 	stroke: ${this._stroke.value}:${artworkNode.stroke.value} - ${this._stroke.value === artworkNode.stroke.value}
    // 	strokeWidth: ${this._strokeWidth}:${artworkNode.strokeWidth} - ${this._strokeWidth === artworkNode.strokeWidth}
    // 	strokePosition: ${this._strokePosition}:${artworkNode.strokePosition} - ${this._strokePosition === artworkNode.strokePosition}
    // 	strokeEndCaps: ${this._strokeEndCaps}:${artworkNode.strokeEndCaps} - ${this._strokeEndCaps === artworkNode.strokeEndCaps}
    // 	strokeJoins: ${this._strokeJoins}:${artworkNode.strokeJoins} - ${this._strokeJoins === artworkNode.strokeJoins}
    // 	strokeMiterLimit: ${this._strokeMiterLimit}:${artworkNode.strokeMiterLimit} - ${this._strokeMiterLimit === artworkNode.strokeMiterLimit}
    // 	strokeDashOffset: ${this._strokeDashOffset}:${artworkNode.strokeDashOffset} - ${this._strokeDashOffset === artworkNode.strokeDashOffset}

    // 	strokeDashArray: ${this._strokeDashArray}
    // 	strokeDashArray: ${artworkNode.strokeDashArray}
    // 	areaBox: ${this._areaBox}:${artworkNode.areaBox} - ${this._areaBox=== artworkNode.areaBox}
    // 	shadow: ${this._shadow}:${artworkNode.shadow} - ${this._shadow === artworkNode.shadow}
    // 	blur: ${this._blur}:${artworkNode.blur} - ${this._blur === artworkNode.blur}
    // `;

    // console.log(data);

    //no need to check artworkNode.localBounds.x, localBounds.width, and localBounds.height because it should be flexible to different text length and height

    //if there is a single unequal property between the artwork, return false
    if (
      this._localBounds.y !== artworkNode.localBounds.y ||
      this._styleRanges[0].length !== artworkNode.styleRanges[0].length ||
      this._styleRanges[0].linkId !== artworkNode.styleRanges[0].linkId ||
      this._styleRanges[0].fontFamily !== artworkNode.styleRanges[0].fontFamily ||
      this._styleRanges[0].fontStyle !== artworkNode.styleRanges[0].fontStyle ||
      this._styleRanges[0].fontSize !== artworkNode.styleRanges[0].fontSize ||
      this._styleRanges[0].charSpacing !== artworkNode.styleRanges[0].charSpacing ||
      this._styleRanges[0].underline !== artworkNode.styleRanges[0].underline ||
      this._styleRanges[0].textTransform !== artworkNode.styleRanges[0].textTransform ||
      this._styleRanges[0].textScript !== artworkNode.styleRanges[0].textScript ||
      this._styleRanges[0].fill.value !== artworkNode.styleRanges[0].fill.value ||
      this._styleRanges[0].strikethrough !== artworkNode.styleRanges[0].strikethrough ||
      this._translation.x !== artworkNode.translation.x ||
      this._translation.y !== artworkNode.translation.y ||
      this._flipY !== artworkNode.flipY ||
      this._textAlign !== artworkNode.textAlign ||
      this._lineSpacing !== artworkNode.lineSpacing ||
      this._paragraphSpacing !== artworkNode.paragraphSpacing ||
      this._rotationDeg !== artworkNode.rotation ||
      this._strokeWidth !== artworkNode.strokeWidth ||
      this._strokePosition !== artworkNode.strokePosition ||
      this._strokeEndCaps !== artworkNode.strokeEndCaps ||
      this._strokeJoins !== artworkNode.strokeJoins ||
      this._strokeMiterLimit !== artworkNode.strokeMiterLimit ||
      this._strokeDashOffset !== artworkNode.strokeDashOffset) {

      return false;
    }

    //newly created text in a newly created document in XD of MacOS will have stroke property as null which will cause issue if we try to directly access stroke.value 
    if (this._stroke === null || artworkNode.stroke === null) {			//if one of them is null
      if (this._stroke !== artworkNode.stroke) {
        return false;
      }
    } else {																//if none is null, then we can directly compare stroke.value
      if (this._stroke.value !== artworkNode.stroke.value) {			//if values don't equal
        return false;
      }
    }

    if (this._strokeDashArray.length === artworkNode.strokeDashArray.length) {
      if (this._strokeDashArray.length > 0) {//keep verifying if strokeDashArray is not empty

        for (let i = 0; i < this._strokeDashArray.length; i++) {
          if (this._strokeDashArray[i] !== artworkNode.strokeDashArray[i]) {

            return false;
          }
        }
      }
    }
    else {
      return false;
    }

    if (this._areaBox !== null || artworkNode.areaBox !== null) {
      if (this._areaBox !== null && artworkNode.areaBox !== null) {
        // 	let data = `
        // areaBox.width: ${this._areaBox.width}:${artworkNode.areaBox.width} - ${this._areaBox.width === artworkNode.areaBox.width}
        // areaBox.height: ${this._areaBox.height}:${artworkNode.areaBox.height} - ${this._areaBox.height === artworkNode.areaBox.height}
        // 	`;

        if (this._areaBox.width !== artworkNode.areaBox.width || this._areaBox.height !== artworkNode.areaBox.height) {//if either is not equal
          return false;
        }
      }
      else {
        return false;
      }
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

    if (this._blur !== null || artworkNode.blur !== null) {
      if (this._blur !== null && artworkNode.blur !== null) {
        // 	let data = `
        // blur.blurAmount: ${this._blur.blurAmount}:${artworkNode.blur.blurAmount} - ${this._blur.blurAmount === artworkNode.blur.blurAmount}
        // blur.brightnessAmount: ${this._blur.brightnessAmount}:${artworkNode.blur.brightnessAmount} - ${this._blur.brightnessAmount === artworkNode.blur.brightnessAmount}
        // blur.fillOpacity: ${this._blur.fillOpacity}:${artworkNode.blur.fillOpacity} - ${this._blur.fillOpacity === artworkNode.blur.fillOpacity}
        // blur.isBackgroundEffect: ${this._blur.isBackgroundEffect}:${artworkNode.blur.isBackgroundEffect} - ${this._blur.isBackgroundEffect === artworkNode.blur.isBackgroundEffect}
        // blur.visible: ${this._blur.visible}:${artworkNode.blur.visible} - ${this._blur.visible === artworkNode.blur.visible}
        // 	`;

        if (this._blur.blurAmount !== artworkNode.blur.blurAmount ||
          this._blur.brightnessAmount !== artworkNode.blur.brightnessAmount ||
          this._blur.fillOpacity !== artworkNode.blur.fillOpacity ||
          this._blur.isBackgroundEffect !== artworkNode.blur.isBackgroundEffect ||
          this._blur.visible !== artworkNode.blur.visible) {

          return false;
        }
      }
      else {
        return false;
      }
    }

    return true;
  }
}