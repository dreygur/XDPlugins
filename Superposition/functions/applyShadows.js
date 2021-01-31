const scenegraph = require("scenegraph");
const { editDocument } = require("application");
const { Color, Shadow } = scenegraph;

const applyShadows = (el, shadows) => {
  el.innerHTML = shadows
    .map((shadow, index) => {
      return `<li class="shadow" data-index="${index}">
          <span>${shadow}</span>
        </li>`;
    })
    .join("");

  el.querySelectorAll("li").forEach(shadow => {
    shadow.addEventListener("click", e => {
      const shadowData = shadows[shadow.getAttribute("data-index")];

      const splitBetweenColorAndRest = shadowData.split(") ");
      const color = new Color(splitBetweenColorAndRest[0] + ")");

      const splitValues = splitBetweenColorAndRest[1].split(" ");
      const x = parseFloat(splitValues[0].split("px")[0]);
      const y = parseFloat(splitValues[1].split("px")[0]);
      const b = parseFloat(splitValues[2].split("px")[0]);
      editDocument(function() {
        scenegraph.selection.items.forEach(item => {
          item.shadow = new Shadow(x, y, b, color, true);
        });
      });
    });
  });
};

module.exports = applyShadows;
