
export default class Group {
  constructor(name) {
    this._name = name;
    this._type = 'Group';
  }

  set translation(translation) {
    this._translation = translation;
  }

  //set an array of artworks nested in this group
  set children(artworkArr) {
    this._children = artworkArr;
  }

  //sets an arr of img asset arr
  set arrOfImgAssetArr(arrOfImgAssetArr) {
    this._arrOfImgAssetArr = arrOfImgAssetArr;
  }

  // set textAssetArr 
  set arrOfTextAssetArr(arrOfTextAssetArr) {
    this._arrOfTextAssetArr = arrOfTextAssetArr;
  }

  get name() {
    return this._name;
  }

  get type() {
    return this._type;
  }

  get translation() {
    return this._translation;
  }

  //get an array of artworks nested in this group
  get children() {
    return this._children;
  }

  //set an arr of img asset arr
  get arrOfImgAssetArr() {
    return this._arrOfImgAssetArr;
  }

  //set an arr of text asset arr
  get arrOfTextAssetArr() {
    return this._arrOfTextAssetArr;
  }

  isMapped() {
    if (this._arrOfImgAssetArr === undefined || this._arrOfTextAssetArr === undefined) {
      return false;
    }
    else {
      return true;
    }
  }

  //creates artwork node and place it within the artboard node
  load(targetArtboardNode) {
    let selection = require('scenegraph').selection;
    let commands = require('commands');
    let childrenNode = [];

    //load artwork onto the artboard
    this._children.forEach(artworkObj => {
      childrenNode.push(artworkObj.load(targetArtboardNode));
    })

    //group
    selection.items = childrenNode;
    commands.group();
    let group = selection.items[0];

    //position
    group.moveInParentCoordinates(this._translation.x, this._translation.y);
  }
}