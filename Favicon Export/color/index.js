const assets = require("assets");
const { Color } = require("scenegraph");

const getAssetColors = () => {
  const colors = assets.colors.get();
  return colors;
};

const getColorList = () => {
  const assetColors = getAssetColors();

  const extraOptions = [
    {
      name: "White",
      color: new Color("White"),
      extra: true,
      default: true
    },
    {
      name: "Black",
      color: new Color("Black"),
      extra: true
    },
    {
      name: "Transparent",
      color: new Color("rgba(255, 255, 255, 0"),
      extra: true
    }
    // {
    //   name: "Custom",
    //   color: null
    // }
  ];

  const colorList = assetColors.concat(extraOptions);
  return colorList;
};

const getSelectedColor = () => {
  const select = document.querySelector("#color-select");
  const selectedItem = select.selectedOptions[0];
  const selectedValue = selectedItem.value;

  const color = parseStringifiedRgbaColor(selectedValue);

  return color;
};

const getStringifiedRgbaColor = colorAsset => {
  const rgbaColor = colorAsset.color.toRgba();
  return JSON.stringify(rgbaColor);
};

const parseStringifiedRgbaColor = string => {
  const parsedString = JSON.parse(string);
  const color = new Color(parsedString);
  return color;
};

const getColorDetails = colorAsset => {
  const selected = colorAsset.default ? "selected" : "";
  const value = colorAsset.color ? getStringifiedRgbaColor(colorAsset) : "none";
  const displayStr = colorAsset.name
    ? colorAsset.name
    : colorAsset.color.toHex().toUpperCase();

  const source = colorAsset.extra ? "" : "Asset: ";

  return { selected, value, displayStr, source };
};

const setColorPreview = _e => {
  const colorPreview = document.querySelector("#color-preview");
  const color = getSelectedColor();

  colorPreview.style.color = `rgba(${color.r}, ${color.g}, ${color.b}, 1)`;
};

module.exports = {
  getColorList,
  getSelectedColor,
  getColorDetails,
  setColorPreview
};
