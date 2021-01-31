const { Artboard, Group } = require('scenegraph')

const canInsertInSelection = (selection) => {
  return selection.items.length &&
    selection.items[0] instanceof Artboard === false &&
    selection.items[0] instanceof Group === false
}

module.exports = canInsertInSelection
