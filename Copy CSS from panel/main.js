const sg = require("scenegraph");
const clipboard = require("clipboard");

let panel;
let css = "";

const num = value => {
  return Math.round(value * 100) / 100;
}
const eq = (num1, num2) => {
  return (Math.abs(num1 - num2) < 0.001);
}
const styleToWeight = fontStyle => {
  if (fontStyle.match(/\bBold\b/i)) return "bold";
  else if (fontStyle.match(/\bBlack\b/i) || fontStyle.match(/\bHeavy\b/i)) return 900;
  else if (fontStyle.match(/\bSemi[- ]?bold\b/i) || fontStyle.match(/\bDemi[- ]?bold\b/i)) return 600;
  else if (fontStyle.match(/\bMedium\b/i)) return 500;
  else if (fontStyle.match(/\bLight\b/i)) return 300;
  else if (fontStyle.match(/\bUltra[- ]light\b/i)) return 200;
  else return "normal";
}
const styleIsItalic = fontStyle => {
  return (fontStyle.match(/\bItalic\b/i) || fontStyle.match(/\bOblique\b/i));
}
const colorToCSS = solidColor => {
  if (solidColor.a !== 255) return `rgba(${solidColor.r}, ${solidColor.g}, ${solidColor.b}, ${num(solidColor.a / 255)})`;
  return solidColor.toHex();
}

const copy = selection => {
  const textArea = panel.querySelector("#textarea");
  css = "";
  let node = selection.items[0];

  if (!(node instanceof sg.Text && !node.areaBox)) {
    let bounds = node.localBounds;
    css += `width: ${num(bounds.width)}px;\n`;
    css += `height: ${num(bounds.height)}px;\n`;
  }

  if (node.hasRoundedCorners) {
    let corners = node.effectiveCornerRadii;
    let tlbr = eq(corners.topLeft, corners.bottomRight);
    let trbl = eq(corners.topRight, corners.bottomLeft);
    if (tlbr && trbl) {
      if (eq(corners.topLeft, corners.topRight)) {
        css += `border-radius: ${num(corners.topLeft)}px;\n`;
      } else {
        css += `border-radius: ${num(corners.topLeft)}px ${num(corners.topRight)}px;\n`;
      }
    } else {
      css += `border-radius: ${num(corners.topLeft)}px ${num(corners.topRight)}px ${num(corners.bottomRight)}px ${num(corners.bottomLeft)}px;\n`;
    }
  }

  if (node instanceof sg.Text) {
    let textStyles = node.styleRanges[0];
    if (textStyles.fontFamily.includes(" ")) {
      css += `font-family: "${textStyles.fontFamily}";\n`;
    } else {
      css += `font-family: ${textStyles.fontFamily};\n`;
    }
    css += `font-weight: ${styleToWeight(textStyles.fontStyle)};\n`;
    if (styleIsItalic(textStyles.fontStyle)) {
      css += `font-style: italic;\n`;
    }
    if (textStyles.underline) {
      css += `text-decoration: underline;\n`;
    }
    css += `font-size: ${num(textStyles.fontSize)}px;\n`;
    if (textStyles.charSpacing !== 0) {
      css += `letter-spacing: ${num(textStyles.charSpacing / 1000)}em;\n`;
    }
    if (node.lineSpacing !== 0) {
      css += `line-height: ${num(node.lineSpacing)}px;\n`;
    }
    css += `text-align: ${node.textAlign};\n`;
  }

  let hasBgBlur = (node.blur && node.blur.visible && node.blur.isBackgroundEffect);
  let fillName = (node instanceof sg.Text) ? "color" : "background";
  if (node.fill && node.fillEnabled && !hasBgBlur) {
    let fill = node.fill;
    if (fill instanceof sg.Color) {
      css += `${fillName}: ${colorToCSS(fill)};\n`;
    } else if (fill.colorStops) {
      let stops = fill.colorStops.map(stop => {
        return colorToCSS(stop.color) + " " + num(stop.stop * 100) + "%";
      });
      css += `${fillName}: linear-gradient(${stops.join(", ")});\n`;  // TODO: gradient direction!
      // let deg = Math.atan2(fill.endY - fill.startY, fill.endX - fill.startX);
      // console.log(Math.abs((deg * 180 / Math.PI)-180));
    } else if (fill instanceof sg.ImageFill) {
      css += `/* background: url(...); */\n`;
    }
  } else {
    css += `${fillName}: transparent;\n`;
  }

  if (node.stroke && node.strokeEnabled) {
    let stroke = node.stroke;
    css += `border: ${num(node.strokeWidth)}px solid ${colorToCSS(stroke)};\n`;
    // TODO: dashed lines!
  }

  if (node.opacity !== 1) {
    css += `opacity: ${num(node.opacity)};\n`;
  }

  if (node.shadow && node.shadow.visible) {
    let shadow = node.shadow;
    let shadowSettings = `${num(shadow.x)}px ${num(shadow.y)}px ${num(shadow.blur)}px ${colorToCSS(shadow.color)}`;
    if (node instanceof sg.Text) {
      css += `text-shadow: ${shadowSettings};\n`;
    } else if (node instanceof sg.Rectangle) {
      css += `box-shadow: ${shadowSettings};\n`;
    } else {
      css += `filter: drop-shadow(${shadowSettings});\n`;
    }
  }

  if (node.blur && node.blur.visible) {
    let blur = node.blur;
    if (blur.isBackgroundEffect) {
      let backdropCSS = `backdrop-filter: blur(${blur.blurAmount}px);\n`;
      css += `/* Note: currently only Safari supports backdrop-filter */\n`;
      css += backdropCSS;
      css += `--webkit-` + backdropCSS;

      if (blur.brightnessAmount > 0) {
        css += `background-color: rgba(255, 255, 255, ${num(blur.brightnessAmount / 100)});\n`;
      } else if (blur.brightnessAmount < 0) {
        css += `background-color: rgba(0, 0, 0, ${-num(blur.brightnessAmount / 100)});\n`;
      }

      if (blur.fillOpacity > 0) {
        css += `/* (plus shape's fill blended on top as a separate layer with ${num(blur.fillOpacity * 100)}% opacity) */\n`;
      }
    } else {
      css += `filter: ${blur.blurAmount}px;\n`;
    }
  }
  textArea.value = css;
}

const create = () => {
  const html = `
  <link rel="stylesheet" href="style.css">
  <form action="">
    <div class="container">
      <div class="error">Select element</div>
      <textarea readonly id="textarea"></textarea>
      <button id="btn">Copy CSS</button>
    </div>
  </form>
`;
  panel = document.createElement("div");
  panel.innerHTML = html;
  panel.querySelector("form").addEventListener("click", () => clipboard.copyText(css));

  return panel;
}

const show = event => {
  if (!panel) event.node.appendChild(create());
}

const update = selection => {
  const btn = panel.querySelector("#btn");
  const textArea = panel.querySelector("#textarea");
  const errorBox = panel.querySelector(".error");

  if (!selection || !(selection.items[0])) {
    textArea.value = ""
    btn.setAttribute("disabled");
    textArea.setAttribute("disabled");
    errorBox.classList.remove("hide");
  } else {
    btn.removeAttribute("disabled");
    textArea.removeAttribute("disabled");
    errorBox.classList.add("hide");
    copy(selection);
  }
}

module.exports = {
  panels: {
    copyCss: {
      show,
      update
    }
  }
};