const { Color, Rectangle } = require("scenegraph");
const { config } = require("../data/config");
const { getRandomNum } = require("./utilities");

function getToWhiteColor(opt) {
  const max = config.cmn.colorMax;
  const r =
    opt.baseColor.r + ((max - opt.baseColor.r) / opt.scaleRatio) * opt.index;
  const g =
    opt.baseColor.g + ((max - opt.baseColor.g) / opt.scaleRatio) * opt.index;
  const b =
    opt.baseColor.b + ((max - opt.baseColor.b) / opt.scaleRatio) * opt.index;
  return { r, g, b };
}

function getToBlackColor(opt) {
  const r = opt.baseColor.r - (opt.baseColor.r / opt.scaleRatio) * opt.index;
  const g = opt.baseColor.g - (opt.baseColor.g / opt.scaleRatio) * opt.index;
  const b = opt.baseColor.b - (opt.baseColor.b / opt.scaleRatio) * opt.index;
  return { r, g, b };
}

function getToSomeColor(opt) {
  const r =
    opt.baseColor.r > opt.endColor.r
      ? opt.baseColor.r -
        ((opt.baseColor.r - opt.endColor.r) / opt.scaleRatio) * opt.index
      : opt.baseColor.r +
        ((opt.endColor.r - opt.baseColor.r) / opt.scaleRatio) * opt.index;
  const g =
    opt.baseColor.g > opt.endColor.r
      ? opt.baseColor.g -
        ((opt.baseColor.g - opt.endColor.g) / opt.scaleRatio) * opt.index
      : opt.baseColor.g +
        ((opt.endColor.g - opt.baseColor.g) / opt.scaleRatio) * opt.index;
  const b =
    opt.baseColor.b > opt.endColor.r
      ? opt.baseColor.b -
        ((opt.baseColor.b - opt.endColor.b) / opt.scaleRatio) * opt.index
      : opt.baseColor.b +
        ((opt.endColor.b - opt.baseColor.b) / opt.scaleRatio) * opt.index;
  return { r, g, b };
}

module.exports = function generateScaleColors(
  selection,
  mode,
  scaleLength,
  isEndColorCk,
  color
) {
  const selectNode = selection.items[0];
  const tipsLength = scaleLength;
  const tipsGutter = config.cmn.tipXGutter;
  const tipsWidth = config.cmn.tipWidth;
  const tipsHeight = config.cmn.tipHeight;
  const baseTipLocX = 0;
  const baseTipLocY = -1 * (config.cmn.tipWidth + config.cmn.tipsBottomOffset);
  const scaleRatio = isEndColorCk ? scaleLength - 1 : scaleLength; // Include end color or not include
  const endColor = {};
  const colorGenerateMode = color.isSecond ? "two" : mode;
  let getColor;
  switch (colorGenerateMode) {
    case "two":
      endColor.r = color.second.r;
      endColor.g = color.second.g;
      endColor.b = color.second.b;
      getColor = getToSomeColor;
      break;
    case "complementary":
      const max = Math.max(color.base.r, Math.max(color.base.g, color.base.b));
      const min = Math.min(color.base.r, Math.min(color.base.g, color.base.b));
      const sum = max + min;
      endColor.r = sum - color.base.r;
      endColor.g = sum - color.base.g;
      endColor.b = sum - color.base.b;
      getColor = getToSomeColor;
      break;
    case "random":
      endColor.r = getRandomNum(config.cmn.colorMin, config.cmn.colorMax);
      endColor.g = getRandomNum(config.cmn.colorMin, config.cmn.colorMax);
      endColor.b = getRandomNum(config.cmn.colorMin, config.cmn.colorMax);
      getColor = getToSomeColor;
      break;
    case "black":
      endColor.r = 0;
      endColor.g = 0;
      endColor.b = 0;
      getColor = getToBlackColor;
      break;
    case "white":
    default:
      endColor.r = 255;
      endColor.g = 255;
      endColor.b = 255;
      getColor = getToWhiteColor;
      break;
  }
  for (let i = 0; i < tipsLength; i += 1) {
    const rect = new Rectangle();
    const locX = baseTipLocX + (tipsWidth + tipsGutter) * i;
    const locY = baseTipLocY;
    const index = i;
    rect.name = `scale-${mode}-color-${i}`;
    rect.width = tipsWidth;
    rect.height = tipsHeight;
    rect.placeInParentCoordinates(selectNode.parent.localBounds, {
      x: locX,
      y: locY,
    });
    rect.fill = new Color(
      getColor({
        baseColor: color.base,
        endColor,
        tipsLength,
        scaleRatio,
        index,
      })
    );
    selection.insertionParent.addChild(rect);
  }
};
