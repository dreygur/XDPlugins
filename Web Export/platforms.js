
/**
 * Static class to check the environment and get reference to the application
 */
class Platforms {

  constructor() {
    
  }

  static get isPhotoshop() {
    Platforms.getEnvironment();

    return Platforms._isPhotoshop;
  }

  static get isXD() {
    Platforms.getEnvironment();

    return this._isXD;
  }

  static get xd() {
    Platforms.getEnvironment();

    return this._xd;
  }

  static get ps() {
    Platforms.getEnvironment();

    return this._ps;
  }

  static get application() {
    Platforms.getEnvironment();

    return this._ps || this._xd;
  }

  static getEnvironment() {

    if (Platforms.hasOwnProperty("initialized")===false) {
      
      Platforms._isXD = false;
      Platforms._isPhotoshop = false;
      Platforms._xd = null;
      Platforms._photoshop = null;

      // XD environment
      try {
        Platforms._xd = require("application");
        Platforms._isXD = true;
      }
      catch(error) { }

      // Photoshop environment
      try {
        Platforms._photoshop = require("photoshop").app;
        Platforms._isPhotoshop = true;
      }
      catch(error) { }

      Platforms.initialized = true;
    }

  }
}

module.exports = {Platforms};
