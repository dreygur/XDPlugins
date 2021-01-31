const { alert } = require("../libs/dialogs");
const { t } = require("../data/locales");

async function showSelectedNoedsLengthError() {
  await alert(
    t("selectedNoedsLengthErrorTitle"),
    t("selectedNoedsLengthErrorDesxription")
  );
}

async function showRootNodeContextError() {
  await alert(
    t("showRootNodeContextErrorTitle"),
    t("showRootNodeContextErrorDesxription")
  );
}

async function showWorngScaleLengthError() {
  await alert(
    t("showWorngScaleLengthErrorTitle"),
    t("showWorngScaleLengthErrorDescription")
  );
}

function rgbToHex(rgb) {
  return (
    "#" +
    rgb
      .map((value) => {
        return ("0" + value.toString(16)).slice(-2);
      })
      .join("")
  );
}

function getRandomNum(min, max) {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
}

function isIntWithinRange(num, min, max) {
  const check1 = Math.round(num) === num;
  const check2 = num >= min;
  const check3 = num <= max;
  return check1 && check2 && check3;
}

module.exports = {
  showSelectedNoedsLengthError,
  showRootNodeContextError,
  showWorngScaleLengthError,
  rgbToHex,
  getRandomNum,
  isIntWithinRange,
};
