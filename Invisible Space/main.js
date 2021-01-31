/*
 * Invisible Space
 *
 */
// 多言語化
const { appLanguage } = require("application");
const supportedLanguages = require("./manifest.json").languages;
const uiLang = supportedLanguages.includes(appLanguage)
    ? appLanguage
    : supportedLanguages[0];
const strings = require("./strings.json");

const {selection, Rectangle, Color} = require("scenegraph");
const commands = require("commands");
let panel;

function create() {
  //// Add your HTML to the DOM
  const HTML = `
    <style>
      .box {
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px dotted #e9e9e9;
      }
      label {
        display: block;
        padding: 0;
        text-align: center;
      }
      label span {
        display: block;
        font-size: 10px;
        color: #666;
      }
      input {
        display: block;
        margin: 0 auto 5px;
        padding: 0;
        width: 60px;
      }
      .group {
        width: 80%;
        max-width: 400px;
      }
      .padding-set-lr {
        display: flex;
        justify-content: center;
      }
      .padding-set-lr input {
        margin: 0 10px 5px;
      }
      .note {
        margin-top: 20px;
        color: #999;
        text-align: center;
        font-size: 12px;
        line-height: 1.4;
      }
      #footer {
        display: flex;
        justify-content: center;
        margin-top: 40px;
      }
      .warning form,
      .warning-text {
        display: none;
      }
      .warning .warning-text {
        display: block;
      }
    </style>
    <div class="wrapper">
      <form>
        <label>
          <span>padding</span>
          <input type="number" class="padd" placeholder="0">
        </label>
        
        <div class="box">
          <label>
            <span>Top</span>
            <input type="number" class="padds" placeholder="0">
          </label>
          <div class="padding-set-lr">
            <label>
              <span>Left</span>
              <input type="number" class="padds" placeholder="0">
            </label>
            <label>
              <span>Right</span>
              <input type="number" class="padds" placeholder="0">
            </label>
          </div>
          <label>
            <span>Bottom</span>
            <input type="number" class="padds" placeholder="0">
          </label>
          
          <p class="note">${strings[uiLang].note}</p>
        </div>
        
        <div class="box">
            <label>
              <span>Group Name</span>
              <input type="text" class="group" placeholder="Group">
            </label>
        </div>
        
        <footer id="footer">
          <button class="btn-cancel" uxp-variant="primary">Clear</button>
          <button type="submit" uxp-variant="cta">OK</button>
        </footer>
      </form>
      <p class="warning-text">${strings[uiLang].warning}</p>
    </div>
  `;

  function setInvisibleSpace() {
    const { editDocument } = require("application");
    editDocument({ editLabel: "Invisible Space" }, function (selection) {

      // グループのレイヤー名
      let groupNameFixed = groupName.placeholder;
      if(groupName.value != "") {
        groupNameFixed = groupName.value;
      }
      commands.group();  // 選択しているものをグループ化する
      const item = selection.items[0];  // 選択しているグループ
      item.name = groupNameFixed;  // グループのレイヤー名

      const nodearea = item.boundsInParent;
      const baseWidth = nodearea.width;
      const baseHeight = nodearea.height;
      const baseX = nodearea.x;
      const baseY = nodearea.y;
      const paddValue = padd.value;  // paddingに入力された値
      const paddArray = [];  // 単独入力用配列
      let addWidth, addHeight, addX, addY;  // 幅高さとポジション調整用

      // 単独入力を配列変換
      for(let i = 0; i < 4; ++i) {
        if(padds[i].value != "") {
          paddArray.push(Number(padds[i].value));
        }else {
          paddArray.push(undefined);
        }
      }

      // padding計算
      if(paddValue != "") {
        addWidth = paddValue * 2;
        addHeight = paddValue * 2;
        addX = -paddValue;
        addY = -paddValue;

        if(paddArray[0] != undefined) {
          addHeight += -paddValue + paddArray[0];
          addY = -paddArray[0];
        }
        if(paddArray[1] != undefined) {
          addWidth += -paddValue + paddArray[1];
          addX = -paddArray[1];
        }
        if(paddArray[2] != undefined) {
          addWidth += -paddValue + paddArray[2];
        }
        if(paddArray[3] != undefined) {
          addHeight += -paddValue + paddArray[3];
        }
      }else {
        paddArray.forEach((value, index) => {
          if(value == undefined) {
            paddArray[index] = 0;
          }
        });

        addWidth = paddArray[1] + paddArray[2];
        addHeight = paddArray[0] + paddArray[3];
        addX = -paddArray[1];
        addY = -paddArray[0];

        if(paddArray[0] != 0) {
          if(paddArray[1] == 0 && paddArray[2] == 0 && paddArray[3] == 0) {
            addWidth = 0;
            addHeight = -baseHeight + paddArray[0];
            addX = 0;
          }
        }
        if(paddArray[1] != 0) {
          if(paddArray[0] == 0 && paddArray[2] == 0 && paddArray[3] == 0) {
            addWidth = -baseWidth + paddArray[1];
            addHeight = 0;
            addY = 0;
          }
        }
        if(paddArray[2] != 0) {
          if(paddArray[0] == 0 && paddArray[1] == 0 && paddArray[3] == 0) {
            addWidth = -baseWidth + paddArray[2];
            addHeight = 0;
            addX = baseWidth;
            addY = 0;
          }
        }
        if(paddArray[3] != 0) {
          if(paddArray[0] == 0 && paddArray[1] == 0 && paddArray[2] == 0) {
            addWidth = 0;
            addHeight = -baseHeight + paddArray[3];
            addX = 0;
            addY = baseHeight;
          }
        }
      }

      const shape = new Rectangle();
      shape.name = "spacer";
      shape.width = baseWidth + addWidth;
      shape.height = baseHeight + addHeight;
      shape.fill = new Color("ffffff", 0);
      shape.moveInParentCoordinates(baseX + addX, baseY + addY);
      item.addChild(shape, 0);
    })
  }

  function clearInvisibleSpace() {
    padd.value = groupName.value = "";
    for(let i = 0; i < 4; ++i) {
      padds[i].value = "";
    }
  }

  panel = document.createElement("div");
  panel.innerHTML = HTML;
  //// Get references to DOM elements
  const [form, padd, groupName, cancel] = [
    `form`,
    ".padd",
    ".group",
    ".btn-cancel"
  ].map(s => panel.querySelector(s));
  const padds = panel.querySelectorAll(".padds");

  form.addEventListener("submit", setInvisibleSpace);
  cancel.addEventListener("click", clearInvisibleSpace);

  return panel;
}

function show(event) {
  if (!panel) event.node.appendChild(create());
}

function hide(event) {
  // This function triggers when the panel is hidden by user
}

function update() {
  // オブジェクトが選択されているかチェック
  const wrapper = document.querySelector(".wrapper");
  const groupName = document.querySelector(".group");

  if (selection.items.length == 0) {
    wrapper.classList.add("warning");
  }else {
    wrapper.classList.remove("warning");
    groupName.placeholder = selection.items[0].name;
  }
}

module.exports = {
  panels: {
    InvidibleSpace: {
      show,
      hide,
      update
    }
  }
};
