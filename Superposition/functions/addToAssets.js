const scenegraph = require("scenegraph");
const { Color } = scenegraph;
const assets = require("assets");

const addToAssets = (colors, typography) => {
  const colorList = colors.map(color => {
    return {
      name: color.name,
      color: new Color(color.color)
    };
  });

  assets.colors.add(colorList);

  // const textList = typography.map(text => {
  //   return {
  //     style: {
  //       fontFamily: text.fontFamily,
  //       fontStyle: "Regular",
  //       fontSize: parseInt(text.fontSize.split("px")[0]),
  //       fill: new Color(text.color),
  //       charSpacing:
  //         text.letterSpacing === "normal"
  //           ? 0
  //           : parseFloat(text.letterSpacing.split("px")[0]),
  //       lineSpacing:
  //         text.lineHeight === "normal"
  //           ? 0
  //           : parseInt(text.lineHeight.split("px")[0]),
  //       underline: false,
  //       strikethrough: false
  //       //textTransform:
  //       //textSript
  //     }
  //   };
  // });
  //
  // assets.characterStyles.add(textList);
};

module.exports = addToAssets;
