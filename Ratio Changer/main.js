const { selection } = require("scenegraph");
const { editDocument,appLanguage } = require("application");
const strings = require("./strings.json");
const supportedLanguages = require("./manifest.json").languages;
const uiLang = supportedLanguages.includes(appLanguage)
    ? appLanguage
    : supportedLanguages[0];

let panel;

const create = () => {
  const html = `
  <style>
  hr {
    margin: 10px 0 20px;
  }
  h2 {
    font-size: 14px;
    color: #666666;
  }
  ul {
    margin: 0;
    padding: 0;
  }
  li {
    font-size: 0.8rem;
    list-style: none;
    border-radius: 2px;
    line-height: 1;
  }
  li:hover {
    background: #e5ecef;
  }
  label {
    display: flex;
    align-items: center;
    padding: 10px 0;
    padding-left: 4px;
    color: #666666;
  }
  .ratio {
    font-size: 14px;
    width: 5em;
  }
  .ratio-name {
    font-size: 14px;
  }
  input[type="radio"] {
    margin: 0 8px 0 4px;
  }
  .custom-ratio {
    margin-top: 20px;
  }
  .custom-input {
    display: flex;
    align-item: center;
  }
  .colon {
    text-align: center;
    align-self: center;
  }
  input[type="number"] {
    width: 6em;
    padding: 4px;
    padding-left: 10px;
  }
  .trans-button {
    display: block;
    margin: 20px auto;
  }
</style>
<div class="container">
  <div class="basis-list" id="basis-list">
    <h2 id="basis-header">${strings[uiLang].basisHeader}</h2>
    <ul>
      <li>
        <label for="basis-width">
          <input
            type="radio"
            name="basis"
            id="basis-width"
            value="basis-width"
            checked="checked"
          />
          width
        </label>
      </li>
      <li>
        <label for="basis-height">
          <input
            type="radio"
            name="basis"
            id="basis-height"
            value="basis-height"
          />
          height
        </label>
      </li>
    </ul>
  </div>

  <hr />

  <div class="ratio-list" id="ratio-list">
    <h2 id="ratio-header">${strings[uiLang].ratioHeader}</h2>
    <ul>
      <li>
        <label for="square">
          <input type="radio" name="ratio" id="square" value="square" />
          <div class="ratio">1:1</div>
          <div class="ratio-name" id="square-text">${strings[uiLang].squareText}</div>
        </label>
      </li>
      <li>
        <label for="golden">
          <input
            type="radio"
            name="ratio"
            id="golden"
            value="golden"
            checked="checked"
          />
          <div class="ratio">1.618:1</div>
          <div class="ratio-name" id="golden-text">${strings[uiLang].goldenText}</div>
        </label>
      </li>
      <li>
        <label for="yamato">
          <input type="radio" name="ratio" id="yamato" value="yamato" />
          <div class="ratio">1.414:1</div>
          <div class="ratio-name" id="yamato-text">${strings[uiLang].yamatoText}</div>
        </label>
      </li>
      <li>
        <label for="retro">
          <input type="radio" name="ratio" id="retro" value="retro" />
          <div class="ratio">4:3</div>
          <div class="ratio-name" id="retro-text">${strings[uiLang].retroText}</div>
        </label>
      </li>
      <li>
        <label for="camera">
          <input type="radio" name="ratio" id="camera" value="camera" />
          <div class="ratio">3:2</div>
          <div class="ratio-name" id="camera-text">${strings[uiLang].cameraText}</div>
        </label>
      </li>
      <li>
        <label for="monitor">
          <input type="radio" name="ratio" id="monitor" value="monitor" />
          <div class="ratio">16:9</div>
          <div class="ratio-name" id="monitor-text">${strings[uiLang].monitorText}</div>
        </label>
      </li>
      <li>
        <label for="wide">
          <input type="radio" name="ratio" id="wide" value="wide" />
          <div class="ratio">16:10</div>
          <div class="ratio-name" id="wide-text">${strings[uiLang].wideText}</div>
        </label>
      </li>
      <li>
        <label for="triangle">
          <input type="radio" name="ratio" id="triangle" value="triangle" />
          <div class="ratio">2:√3</div>
          <div class="ratio-name" id="triangle-text">${strings[uiLang].triangleText}</div>
        </label>
      </li>
    </ul>
  </div>
  <div class="custom-ratio">
    <h2 id="custom-header">${strings[uiLang].customHeader}</h2>
    <div class="custom-input">
      <input type="number" name="custom-left" id="custom-left" placeholder="0" min="1" max="9999" />
      <div class="colon">：</div>
      <input type="number" name="custom-right" id="custom-right" placeholder="0" min="1" max="9999" />
    </div>
  </div>
</div>
<button class="trans-button" id="run">${strings[uiLang].run}</button>
  `;

  panel = document.createElement("div");
  panel.innerHTML = html;

  // 実行
  panel.querySelector("#run").addEventListener("click", changer);

  return panel;
};

// 変更処理
const changer = () => {
  editDocument({ editLabel: "trans object ratio" }, () => {
    
    // get basis checked value
    let basisCheckedValue;
    const basis = panel.querySelectorAll('input[name="basis"]');
    basis.forEach((basis) => {
      if (basis.checked) {
        basisCheckedValue = basis.value;
      }
    });

    // get ratio checked value
    let ratioCheckedValue;
    const ratios = panel.querySelectorAll('input[name="ratio"]');
    ratios.forEach((ratio) => {
      if (ratio.checked) {
        ratioCheckedValue = ratio.value;
      }
    });

    // value(string) -> figures(number)
    let ratio;
    switch (ratioCheckedValue) {
      case "square":
        ratio = 1;
        break;
      case "golden":
        ratio = (1 + Math.sqrt(5)) / 2;
        break;
      case "yamato":
        ratio = Math.sqrt(2);
        break;
      case "retro":
        ratio = 4 / 3;
        break;
      case "camera":
        ratio = 3 / 2;
        break;
      case "monitor":
        ratio = 16 / 9;
        break;
      case "wide":
        ratio = 16 / 10;
        break;
      case "triangle":
        ratio = 2 / Math.sqrt(3);
        break;
      default:
        console.log("Select ratio!");
        break;
    }

    const left = panel.querySelector('input[name="custom-left"]').value;
    const right = panel.querySelector('input[name="custom-right"]').value;
    if (left > 0 && right > 0) {
      ratio = left / right;
      console.log(ratio); 
    }

    // calc
    selection.items.forEach((item) => {
      const itemWidth = item.localBounds.width;
      const itemHeight = item.localBounds.height;
      if (basisCheckedValue === "basis-width") {
        const transHeight = Math.round(itemWidth / ratio);
        item.resize(itemWidth, transHeight);
      } else if (basisCheckedValue === "basis-height") {
        const transWidth = Math.round(itemHeight / ratio);
        item.resize(transWidth, itemHeight);
      }
    });
  });
};

const show = (event) => {
  if (!panel) event.node.appendChild(create());
};

module.exports = {
  panels: {
    ratiochanger: {
      show,
    },
  },
};
