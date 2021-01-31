const scenegraph = require("scenegraph");
const { editDocument } = require("application");
const { Color, Line } = scenegraph;

const applyColor = async (el, colors) => {
  el.innerHTML = colors
    .map((color, index) => {
      return `<li class="color" data-index="${index}" title="${color.color}">
        <div><div style="background:${color.color}"></div></div>
        <span>${color.name}</span>
      </li>`;
    })
    .join("");

  el.querySelectorAll("li").forEach(color => {
    color.addEventListener("click", e => {
      const colorData = colors[color.getAttribute("data-index")];
      editDocument(function() {
        scenegraph.selection.items.forEach(item => {
          if (item instanceof Line) {
            item.stroke = new Color(colorData.color);
          } else {
            item.fill = new Color(colorData.color);
          }
        });
      });
    });
  });
};

module.exports = applyColor;
