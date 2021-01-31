const scenegraph = require("scenegraph");
const { editDocument } = require("application");
const { Color, Rectangle } = scenegraph;

const applyBorderRadii = (el, borderradii) => {
  el.innerHTML = borderradii
    .map((radius, index) => {
      return `<li class="radius" data-index="${index}">
          <span>${radius}</span>
        </li>`;
    })
    .join("");

  el.querySelectorAll("li").forEach(radius => {
    radius.addEventListener("click", e => {
      const radiusData = borderradii[radius.getAttribute("data-index")];
      const isMultiple = radiusData.split(" ").length > 1;

      const value = isMultiple
        ? {
            topLeft: parseInt(radiusData.split(" ")[0].split("px")[0]),
            topRight: parseInt(radiusData.split(" ")[1].split("px")[0]),
            bottomRight: parseInt(radiusData.split(" ")[2].split("px")[0]),
            bottomLeft: parseInt(radiusData.split(" ")[3].split("px")[0])
          }
        : parseInt(radiusData.split("px")[0]);
      editDocument(function() {
        scenegraph.selection.items.forEach(item => {
          if (item instanceof Rectangle) {
            if (isMultiple) {
              item.cornerRadii = value;
            } else {
              item.setAllCornerRadii(value);
            }
          }
        });
      });
    });
  });
};

module.exports = applyBorderRadii;
