const { selection, Artboard } = require("scenegraph");
const { msg, styleClass, showMessage, resetMessage } = require("./message");

const validateSelection = () => {
  const panel = document.querySelector("#panel");
  const okButton = panel.querySelector("#ok");
  const select = document.querySelector("#color-select");
  const backgroundColorDiv = document.querySelector("#background-color");

  if (isValidSelection()) {
    okButton.removeAttribute("disabled");

    if (selectionHasBackground()) {
      select.setAttribute("disabled", "");
      backgroundColorDiv.className = "hide";
    } else {
      select.removeAttribute("disabled");
      backgroundColorDiv.className = "show";
    }
  } else {
    okButton.setAttribute("disabled", "");
    select.setAttribute("disabled", "");
    backgroundColorDiv.className = "hide";
  }
};

const isValidSelection = () => {
  resetMessage();

  // selection exists?
  if (!selectionExists())
    return showMessage({
      message: msg.validate.selDim,
      styleClass: styleClass.info
    });

  const item = selection.items[0];

  // is correct type?
  if (!isCorrectType(item))
    return showMessage({
      message: msg.validate.selDim,
      styleClass: styleClass.info
    });

  // is square?
  if (!isSquare(item))
    return showMessage({
      message: msg.validate.selDim,
      styleClass: styleClass.info
    });

  return true;
};

const selectionExists = () => {
  return !!selection.items.length;
};

const isCorrectType = item => {
  const supportedTypes = [Artboard];
  const typeValidations = supportedTypes.map(nodeType => {
    return item instanceof nodeType;
  });

  return typeValidations.includes(true);
};

const isSquare = item => {
  return item.width === item.height;
};

const selectionHasBackground = () => {
  const fillRgba = selection.items[0].fill.toRgba();

  return fillRgba.a === 255;
};

module.exports = { validateSelection, selectionHasBackground };
