const {alert,error,warning,prompt} = require("./dialogs.js");

module.exports = class Typist {
  constructor() {
    this.ratios = [
      ['Double Octave', 4],
      ['Major Twelfth', 3],
      ['Octave', 2.0],
      ['Golden Ratio', 1.618034],
      ['Major Seventh', 1.875],
      ['Minor Seventh', 1.777777778],
      ['Major Sixth', 1.666666667],
      ['Minor Sixth', 1.6],
      ['Fifth', 1.5],
      ['Augmented Fourth', 1.41421],
      ['Fourth', 1.333],
      ['Major Third', 1.25],
      ['Minor Third', 1.2],
      ['Major Second', 1.125],
      ['custom', '']
    ];
    this.typography = [];
    this.defaultFontSize = 16;
    this.defaultRatio = 1.618034;
    this.defaultNotes = 2;
    this.foundInvalidValues = false;
  }

  getRatios() {
    return this.ratios;
  }

  async showUserError(){
    await error("Missing form fields.", "* All fields must be fill out.","* Please Close Plugin and try again.");
  }
  async alertUserIfItBroken(){
    await alert("Sorry, something is broken.","* Report issue to the developer, needs to be fix.", "[Contact or Report Issues.](https://github.com/gioalo/).");
  }

  /**
   * Create typography scales base on classical musical notes.
   * Return array of typography settings
   * Array = [{
   *  id: Number,
   *  pt: Number,
   *  em: Number,
   *  leading: Number,
   *  leadingPx: Number,
   *  maxwidth: Number,
   *  spacing: Number
   * }]
   * @param {number} ratio numer
   * @param {number} len number
   * @param {number} size number optional - default browser font is 16px but you can change it
   */
  async typographyScale(ratio, len, size) {
    return new Promise((resolve, reject)=>{
      const base = size || 16;
      const point = this.convertPx2Pt(base) || 12;

      if (this.validateRatio(ratio) && this.validateNumberOfNotes(len) && this.validateFontSize(base)) {
        try {
          let i = 0,
            fontSize = 0,
            lead = 0,
            typographyArray = [],
            n = ratio < 2 ? 4 : 2;

          for (; i < len + n; i++) {
            // formula to calculate font size scale
            fontSize = (1 * ratio ** ((i-1) / len)).toFixed(4); // result is em
            // use the leading EM in the web instead of pixels
            typographyArray.push({
              "id": i,
              "pt": Math.round(fontSize * point),
              "px": Math.round(fontSize * base),
              "em": parseFloat(fontSize),
              "leading": parseFloat(this.leading(fontSize, ratio).toFixed(4)),
              "leadingPx": Math.round((fontSize * base) + base),
              "maxwidth": this.cplWidth(fontSize * base),
              "spacing": Math.round(base * ratio ** (i - (len + 1)))
            });
          }
          resolve(this.removeDuplicates(typographyArray));
          // CLEAN/reset array
          typographyArray = [];
        } catch (error) {
          console.error("[DEVELOPER] Something is broken: ", error);
          this.alertUserIfItBroken();
        }
      } else {
        reject(this.showUserError());
      }
    });
  }



  /**
   * Returns the calculated line height of the font size by the base leading
   * @param {number} fontSize A number font-size
   * @param {number} ratio A number base line height
   */
  leading(fontSize, ratio) {
    return Math.ceil(fontSize / ratio) * (ratio / fontSize);
  }
  /**
   * Returns the line width relative to the font size in px
   * @param {number} fontSize number of font size in px
   * @param {number} ratio number ratio use to calculate font scale
   * @param {number} lineHeight number line height in px
   */
  width(fontSize, ratio, lineHeight) {
    return Math.round((fontSize * ratio) ** 2 * [1 + (2 * ratio) * (lineHeight / fontSize - ratio)]);
  }
  /**
   * Returns the adjusted line height of any font-size
   * @param {number} ratio number ratio
   * @param {number} width number width
   * @param {number} fontSize number font-size
   */
  adjustedleading(ratio, width, fontSize) {
    let newLeading = ratio - (1 / (2 * ratio)) * (1 - (width / (fontSize * ratio) ** 2));
    return Math.round(this.leading(fontSize, newLeading));
  }
  /**
   * Converts points to px
   * @param {number} pixel number in pixels
   */
  convertPx2Pt(pixel) {
    return pixel * 0.75;
  }

  /**
   * Returns the ideal width to measure 45 to 75 characters per line for the specific font size
   * @param {number} fontSize A number font size
   */
  cplWidth(fontSize) {
    return Math.round(75 * (fontSize / 2.2));
  }

  /**
   * Return true if parameter is typeof number
   * @param {number} number
   */
  isNumber(number) {
    if (typeof number === "number") {
      return true;
    } else {
      return false;
    }
  }
  /**
   * Return true if number is positive and number is between 1 - 99
   * @param {number} number number must be positive number
   */
  checkNumberValidity(number) {
    if (this.isNumber(number) && this.isPositive(number) && number > 0 && number < 100) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Return true if a number is positive >= 1.125 and number <= 4
   * @param {number} number
   */
  validateRatio(number){
    if(this.isNumber(number) && this.isPositive(number) && number >= 1.125 && number <= 4) {
      return true;
    } else {
      return false;
    }
  }
  /**
   * Return true if a number is positive >= 14 and number <= 24
   * @param {number} number
   */
  validateFontSize(number){
    if(this.isNumber(number) && this.isPositive(number) && number >= 14 && number <= 24) {
      return true;
    } else {
      return false;
    }
  }
  /**
   * Return true if number is positive and >= 2 and number <= 4
   * @param {number} number
   */
  validateNumberOfNotes(number){
    if(this.isNumber(number) && this.isPositive(number) && number >= 2 && number <= 4) {
      return true;
    } else {
      return false;
    }
  }
  /**
   * Return true if number is positive
   * @param {number} number
   */
  isPositive(number){
    if(Math.sign(number) !== -1) {
      return true;
    } else {
      return false;
    }
  }
  removeDuplicates(arr){
    let newArr = [];
    let isEqual = null;
    arr.forEach(el => {
      if(el.px !== isEqual) {
        newArr.push(el);
      }
      isEqual = el.px;
    });
    return newArr;
  }
};