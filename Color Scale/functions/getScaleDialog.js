const { config } = require("../data/config");
const {
  rgbToHex,
  isIntWithinRange,
  showWorngScaleLengthError,
} = require("./utilities");
const generateScaleColors = require("./generateScaleColors");

function createDialog(selection) {
  const node = selection.items[0];
  const node2 = selection.items[1];
  const isNode2 = typeof node2 !== "undefined" ? true : false;
  const color = {
    // isSecond will be used only in generateScaleColors function.
    isSecond: isNode2,
    base: {
      hex: rgbToHex([node.fill.r, node.fill.g, node.fill.b]),
      r: node.fill.r,
      g: node.fill.g,
      b: node.fill.b,
    },
    // Define color for CSS tags, even if secondColor is undefined.
    second: {
      hex: isNode2
        ? rgbToHex([node2.fill.r, node2.fill.g, node2.fill.b])
        : "#000",
      r: isNode2 ? node2.fill.r : 0,
      g: isNode2 ? node2.fill.g : 0,
      b: isNode2 ? node2.fill.b : 0,
    },
  };
  // Create Dialog Tags
  document.body.innerHTML = `
    <style>
      .scale-form { width: 400px; }
      .scale-form__item { margin-bottom: 20px; }
      .scale-form__ttl {
        margin: 0 0 15px 0;
        color: #121212;
        font-size: 14px;
      }
      .scale-form__sec-ttl {
        margin: 0 0 5px 0;
        color: #676767;
        font-size: 12px;
      }
      .scale-form__sm-input { width: 30px; }
      .scale-form__color {
        margin-bottom: 6px;
        width: 100%;
        height: 40px;
        border-radius: 4px;
        color: #fff;
        font-weight: bold;
        text-align: center;
      }
      .scale-form__color--type_base { background-color: rgba(${color.base.r}, ${color.base.g}, ${color.base.b}, 1); }
      .scale-form__color--type_second { background-color: rgba(${color.second.r}, ${color.second.g}, ${color.second.b}, 1); }
      .scale-form__color-txt {
        margin-top: 10px;
        font-size: 12px;
      }
      .scale-form__color-info {
        text-align: center;
        font-size: 12px;
        color: #555;
      }
      .d-none { display: none !important; }
      .d-block { display: block !important; }
    </style>
    <dialog>
      <form class="scale-form" name="scale-form" method="dialog">
        <h1 class="scale-form__ttl">Color Scale</h1>
        <div id="baseColorParts" class="scale-form__item">
          <div class="scale-form__color scale-form__color--type_base"><span class="scale-form__color-txt">Base Color</span></div>
          <div class="scale-form__color-info">${color.base.hex} | R: ${color.base.r} G: ${color.base.g} B: ${color.base.b}</div>
        </div>
        <div id="secondColorParts" class="scale-form__item">
          <div class="scale-form__color scale-form__color--type_second"><span class="scale-form__color-txt">Second Color</span></div>
          <div class="scale-form__color-info">${color.second.hex} | R: ${color.second.r} G: ${color.second.g} B: ${color.second.b}</div>
        </div>
        <div id="scaleModeParts" class="scale-form__item scale-form__item--type_scale-mode">
          <h2 class="scale-form__sec-ttl">Scale Mode</h2>
          <select id="scaleMode" name="scaleMode">
            <option value="white" selected>To White Color</option>
            <option value="black">To Black Color</option>
            <option value="complementary">To Complementary Color</option>
            <option value="random">To Random Color</option>
          </select>
        </div>
        <div class="scale-form__item scale-form__item--type_scale-length">
          <h2 class="scale-form__sec-ttl">Scale Length ( ${config.cmn.scaleMinLength}〜${config.cmn.scaleMaxLength} )</h2>
          <input id="scaleLength" class="scale-form__sm-input" uxp-quiet="true" type="text" value="${config.cmn.scaleLength}" />
        </div>
        <div id="scaleOptionParts" class="scale-form__item scale-form__item--type_scale-option">
          <h2 class="scale-form__sec-ttl">Option</h2>
          <label class="row">
            <input id="optionIncludeEndColor" type="checkbox" checked="true" />
            <span>Include end color.</span>
          </label>
        </div>
        <footer class="scale-form__footer">
          <button id="cancelBtn">Cancel</button>
          <button id="okBtn" type="submit" uxp-variant="cta">Create</button>
        </footer>
      </form>
    </dialog>
  `;
  const [
    dialog,
    form,
    cancelBtn,
    okBtn,
    secondColorParts,
    scaleModeParts,
    scaleMode,
    scaleLength,
    scaleOptionParts,
    includeEnd,
  ] = [
    "dialog",
    "form",
    "#cancelBtn",
    "#okBtn",
    "#secondColorParts",
    "#scaleModeParts",
    "#scaleMode",
    "#scaleLength",
    "#scaleOptionParts",
    "#optionIncludeEndColor",
  ].map((s) => document.querySelector(s));
  // Adjust UI
  // Normal UI or 2 Color UI
  if (!isNode2) {
    secondColorParts.classList.add("d-none");
  } else {
    scaleModeParts.classList.add("d-none");
    scaleOptionParts.classList.add("d-none");
  }
  // Adjust UI with event
  // If selected mode do not need `Include End Color option`, It make required mode.
  scaleMode.onchange = (event) => {
    const val = event.target.value;
    if (val === "complementary" || val === "random") {
      includeEnd.checked = true;
      includeEnd.disabled = true;
    } else {
      includeEnd.disabled = false;
    }
  };
  // Dialog Events
  // Cancel Button or ESC Key
  cancelBtn.addEventListener("click", () => dialog.close("reasonCanceled"));
  // Create Button
  okBtn.addEventListener("click", (e) =>
    handleSubmit(
      e,
      selection,
      dialog,
      scaleMode,
      scaleLength,
      includeEnd,
      color
    )
  );
  // Return key
  form.onsubmit = (e) =>
    handleSubmit(
      e,
      selection,
      dialog,
      scaleMode,
      scaleLength,
      includeEnd,
      color
    );
  return dialog;
}

function handleSubmit(
  e,
  selection,
  dialog,
  scaleMode,
  scaleLength,
  includeEnd,
  color
) {
  // Error
  if (
    !isIntWithinRange(
      Number(scaleLength.value),
      config.cmn.scaleMinLength,
      config.cmn.scaleMaxLength
    )
  ) {
    showWorngScaleLengthError();
    return false;
  }
  // Create scale colors
  generateScaleColors(
    selection,
    scaleMode.value,
    scaleLength.value,
    includeEnd.checked,
    color
  );
  // Close the dialog, passing back data
  dialog.close();
  // Prevent further automatic close handlers
  e.preventDefault();
}

module.exports = function getScaleDialog(selection) {
  // Get the dialog if it already exists
  let dialog = document.querySelector("dialog");
  // Reset dialog html source for base-color view.
  if (dialog) dialog.remove();
  return createDialog(selection);
};
