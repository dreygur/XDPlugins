
export default class Artboard {
  constructor(name, width, height) {
    this._type = 'Artboard';
    this._name = name;
    this._width = width;
    this._height = height;
  }

  set children(children) {
    this._children = children;
  }

  set fill(fill) {
    this._fill = fill;
  }

  get name() {
    return this._name;
  }

  get children() {
    return this._children;
  }

  get fill() {
    return this._fill;
  }

  load() {
    //Create an artboardNode and load itself onto the XD document
    const scenegraph = require('scenegraph');
    const root = require('scenegraph').root;
    let artboardNode = new scenegraph.Artboard();

    artboardNode.name = this._name;
    artboardNode.width = this._width;
    artboardNode.height = this._height;
    artboardNode.fill = this._fill;

    root.addChild(artboardNode);

    return artboardNode;
  }
}