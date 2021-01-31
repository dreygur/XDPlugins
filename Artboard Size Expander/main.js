/**
 * @file Artboard Extender
 * @version 1.0.0
 * @author Akira Maruyama
 * @mail akira.maru@gmail.com
 */

const Artboard = require('scenegraph').Artboard;
const { alert, error } = require('./lib/dialogs.js');

// 下に広げる
function expandD_ab(selection) {
  move_ab(selection, 10, 0);
}
function expandD_ab100(selection) {
  move_ab(selection, 100, 0);
}

// 上に縮める
function shrinkU_ab(selection) {
  move_ab(selection, -10, 0);
}
function shrinkU_ab100(selection) {
  move_ab(selection, -100, 0);
}

// 左に縮める
function shrinkL_ab(selection) {
  move_ab(selection, -10, 1);
}
function shrinkL_ab100(selection) {
  move_ab(selection, -100, 1);
}

// 右に広げる
function expandR_ab(selection) {
  move_ab(selection, 10, 1);
}
function expandR_ab100(selection) {
  move_ab(selection, 100, 1);
}

function move_ab(selection, num, wh) {
  if (!checkselection(selection)) {
    const init = new Init(selection);
    if (wh) {
      selection.items[0].resize(init.selw + num, init.selh);
    } else {
      selection.items[0].resize(init.selw, init.selh + num);
    }
  }
}

function checkselection(selection) {
  const init = new Init(selection);
  let app = require('application');
  const applang = app.appLanguage;
  if (!init.selArtboards || init.selnum == 0) {
    if (applang == 'ja') {
      error(
        'アートボードが選択されていません',
        'アートボードを1つだけ選択してください'
      );
    } else {
      error('Artboard is not selected', 'Please select only one artboard.');
    }
    return true;
  } else if (init.selnum >= 2) {
    if (applang == 'ja') {
      error(
        '複数のアートボードが選択されています',
        'アートボードを1つだけ選択してください'
      );
    } else {
      error(
        'Multiple Artboard is selected',
        'Please select only one artboard.'
      );
    }
    return true;
  }
}

class Init {
  constructor(selection) {
    this.selnum = selection.items.length; // get object number
    this.selArtboards = selection.hasArtboards; // Is selection artboard? T/F
    const node = selection.items[0];
    if (this.selArtboards) {
      this.selw = node.boundsInParent.width; // get artboard width
      this.selh = node.boundsInParent.height; // get artboard height
    }
  }
}

module.exports = {
  commands: {
    ExpandD_ab: expandD_ab,
    ExpandD_ab100: expandD_ab100,
    ShrinkU_ab: shrinkU_ab,
    ShrinkU_ab100: shrinkU_ab100,
    ExpandR_ab: expandR_ab,
    ExpandR_ab100: expandR_ab100,
    ShrinkL_ab: shrinkL_ab,
    ShrinkL_ab100: shrinkL_ab100
  }
};
