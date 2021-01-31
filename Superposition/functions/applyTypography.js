const scenegraph = require("scenegraph");
const { editDocument } = require("application");
const { Color, Text } = scenegraph;

const applyTypography = (el, typography) => {
  el.innerHTML = typography
    .map((text, index) => {
      let style = `
        font-family:${text.fontFamily};
        color:${text.color};
        ${
          text.color === "rgb(255, 255, 255)" ||
          text.color.startsWith("rgba(255, 255, 255")
            ? "background:#ddd;"
            : ""
        }
      `;

      return `<li class="text" data-index="${index}">
        <div style="${style}">Ag</div>
        <span>${text.fontFamily} &mdash; ${
        text.fontSize.split("px")[0]
      }pt</span>
        </li>`;
    })
    .join("");

  el.querySelectorAll("li").forEach(text => {
    text.addEventListener("click", e => {
      const textData = typography[text.getAttribute("data-index")];
      editDocument(function() {
        scenegraph.selection.items.forEach(item => {
          if (item instanceof Text) {
            item.fill = new Color(textData.color);
            item.fontFamily = textData.fontFamily;
            item.fontSize = parseFloat(textData.fontSize.split("px")[0]);
            // item.fontStyle
            // item.charSpacing textData.letterSpacing
            // item.underline
            // item.strikethrough
            // item.textTransform
            // item.textScript
            item.lineSpacing = parseFloat(textData.lineHeight.split("px")[0]);
          }
        });
      });
    });
  });
};

module.exports = applyTypography;
