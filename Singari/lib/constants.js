/**
  * @file constants
  * @author sttk3.com
  * @copyright (c) 2020 sttk3.com
*/

// 整列オプション
const XDAlignOptions = {
  LEFT_EDGES: 'XDAlignOptions.LEFT_EDGES',
  HORIZONTAL_CENTERS: 'XDAlignOptions.HORIZONTAL_CENTERS',
  RIGHT_EDGES: 'XDAlignOptions.RIGHT_EDGES',

  TOP_EDGES: 'XDAlignOptions.TOP_EDGES',
  VERTICAL_CENTERS: 'XDAlignOptions.VERTICAL_CENTERS',
  BOTTOM_EDGES: 'XDAlignOptions.BOTTOM_EDGES',
  
  TOP_LEFT: 'XDAlignOptions.TOP_LEFT',
  TOP_MIDDLE: 'XDAlignOptions.TOP_MIDDLE',
  TOP_RIGHT: 'XDAlignOptions.TOP_RIGHT',
  MIDDLE_LEFT: 'XDAlignOptions.MIDDLE_LEFT',
  CENTER: 'XDAlignOptions.CENTER',
  MIDDLE_RIGHT: 'XDAlignOptions.MIDDLE_RIGHT',
  BOTTOM_LEFT: 'XDAlignOptions.BOTTOM_LEFT',
  BOTTOM_MIDDLE: 'XDAlignOptions.BOTTOM_MIDDLE',
  BOTTOM_RIGHT: 'XDAlignOptions.BOTTOM_RIGHT'
} ;

// 分布オプション
const XDDistributeOptions = {
  LEFT_EDGES: 'XDDistributeOptions.LEFT_EDGES',
  HORIZONTAL_CENTERS: 'XDDistributeOptions.HORIZONTAL_CENTERS',
  RIGHT_EDGES: 'XDDistributeOptions.RIGHT_EDGES',

  TOP_EDGES: 'XDDistributeOptions.TOP_EDGES',
  VERTICAL_CENTERS: 'XDDistributeOptions.VERTICAL_CENTERS',
  BOTTOM_EDGES: 'XDDistributeOptions.BOTTOM_EDGES',
  
  HORIZONTAL_SPACE: 'XDDistributeOptions.HORIZONTAL_SPACE',
  VERTICAL_SPACE: 'XDDistributeOptions.VERTICAL_SPACE'
} ;

// Undoに表示されるメニュー名
const XDAlignLabels = {
  'XDAlignOptions.LEFT_EDGES': 'Align Left Edges',
  'XDAlignOptions.HORIZONTAL_CENTERS': 'Align Horizontal Centers',
  'XDAlignOptions.RIGHT_EDGES': 'Align Right Edges',

  'XDAlignOptions.TOP_EDGES': 'Align Top Edges',
  'XDAlignOptions.VERTICAL_CENTERS': 'Align Verticel Canters',
  'XDAlignOptions.BOTTOM_EDGES': 'Align Bottom Edges',
  
  'XDAlignOptions.TOP_LEFT': 'Align Top Left',
  'XDAlignOptions.TOP_MIDDLE': 'Align Top Middle',
  'XDAlignOptions.TOP_RIGHT': 'Align Top Right',
  'XDAlignOptions.MIDDLE_LEFT': 'Align Middle Left',
  'XDAlignOptions.CENTER': 'Align Center',
  'XDAlignOptions.MIDDLE_RIGHT': 'Align Middle Right',
  'XDAlignOptions.BOTTOM_LEFT': 'Align Bottom Left',
  'XDAlignOptions.BOTTOM_MIDDLE': 'Align Bottom Middle',
  'XDAlignOptions.BOTTOM_RIGHT': 'Align Bottom Right',
  
  'XDDistributeOptions.LEFT_EDGES': 'Distribute Left Edges',
  'XDDistributeOptions.HORIZONTAL_CENTERS': 'Distribute Horizontal Centers',
  'XDDistributeOptions.RIGHT_EDGES': 'Distribute Right Edges',

  'XDDistributeOptions.TOP_EDGES': 'Distribute Top Edges',
  'XDDistributeOptions.VERTICAL_CENTERS': 'Distribute Vertical Centers',
  'XDDistributeOptions.BOTTOM_EDGES': 'Distribute Bottom Edges',
  
  'XDDistributeOptions.HORIZONTAL_SPACE': 'Distribute Horizontal Space',
  'XDDistributeOptions.VERTICAL_SPACE': 'Distribute Vertical Space'
} ;

// 整列・分布基準
const XDAlignBasis = {
  PARENT: 'Parent',
  SELECTION: 'Selection',
  TEXT: 'Text',
  FRONTMOST_ITEM: 'Frontmost item',
  BACKMOST_ITEM: 'Backmost item',
  LAST_SELECTED_ITEM: 'Last selected item'
}

// なんとかbounds
const XDBoundsType = {
  GLOBAL_BOUNDS: 'globalBounds',
  LOCAL_BOUNDS: 'localBounds',
  BOUNDS_IN_PARENT: 'boundsInParent',
  GLOBAL_DRAW_BOUNDS: 'globalDrawBounds'
} ;

module.exports = {
  XDAlignOptions,
  XDDistributeOptions,
  XDAlignLabels,
  XDAlignBasis,
  XDBoundsType
} ;