const { Artboard } = require("scenegraph")

const findArtboardInParent = (node) => {
    var target = node;
    while (target != null) {
        if (target instanceof Artboard)
            return target;
        target = target.parent;
    }
    return null;
}

module.exports = {
    findArtboardInParent
}