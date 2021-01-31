<template>
  <div class="clpane">
    <contextmenu ref="contextmenu" :theme="theme" :autoPlacement="false">
      <contextmenu-item @click="deleteColor">删除</contextmenu-item>
      <contextmenu-item>编辑</contextmenu-item>
      <contextmenu-item>在画布中高亮显示</contextmenu-item>
      <contextmenu-item>重命名</contextmenu-item>
      <contextmenu-item>复制</contextmenu-item>
    </contextmenu>
    <div class="clpane-item" v-if="colorArray[0].length>0">
      <p class="clpane-title" @click="togglePanel(0)">字体颜色 Font Color</p>
      <ul class="clpane-list" v-show="panePlay[0]">
        <li
          ref="testitem"
          class="clpane-list-item"
          :data-uniq="`${item[2]}`"
          v-bind:class="{'cur':textCur.indexOf(item[2])>-1}"
          v-for="item in colorArray[0]"
          v-contextmenu:contextmenu
        >
          <span
            class="clpane-list-color"
            :style="`background-color:${item[1]}`"
            @click="addColor($event, item ,'text')"
          ></span>
          <span class="clpane-list-name" @click="addColor($event, item ,'text')">{{item[0]}}</span>
        </li>
      </ul>
    </div>
    <div class="clpane-item" v-if="colorArray[1].length>0">
      <p class="clpane-title" @click="togglePanel(1)">填充颜色 Fill Color</p>
      <ul class="clpane-list" v-show="panePlay[1]">
        <li
          class="clpane-list-item"
          v-for="(item, index) in colorArray[1]"
          :key="index"
          :data-uniq="`${item[2]}`"
          v-bind:class="{'cur':fillCur.indexOf(item[2])>-1}"
        >
          <span
            class="clpane-list-color"
            :style="`background-color:${item[1]}`"
            @click="addColor($event, item ,'fill')"
          ></span>
          <span
            class="clpane-list-name"
            @click="(e) => addColor(e, item ,'fill')"
            @click.right="(e) => popOption(e, item ,'fill')"
          >{{item[0]}}</span>
        </li>
      </ul>
    </div>
    <div class="clpane-item" v-if="colorArray[2].length>0">
      <p class="clpane-title" @click="togglePanel(2)">边框颜色 Border Color</p>
      <ul class="clpane-list" v-show="panePlay[2]">
        <li
          class="clpane-list-item"
          v-for="item in colorArray[2]"
          v-bind:class="{'cur':lineCur.indexOf(item[2])>-1}"
        >
          <span
            class="clpane-list-color"
            :style="`background-color:${item[1]}`"
            @click="addColor($event, item ,'border')"
          ></span>
          <span class="clpane-list-name" @click="addColor($event, item ,'border')">{{item[0]}}</span>
        </li>
      </ul>
    </div>
    <div class="clpane-item" v-if="colorArray[3].length>0">
      <p class="clpane-title" @click="togglePanel(3)">链接颜色 Link Color</p>
      <ul class="clpane-list" v-show="panePlay[3]">
        <li class="clpane-list-item" v-for="item in colorArray[3]">
          <span class="clpane-list-color" :style="`background-color:${item[1]}`"></span>
          <span class="clpane-list-name">{{item[0]}}</span>
        </li>
      </ul>
    </div>
    <div class="clpane-item" v-if="colorArray[4].length>0">
      <p class="clpane-title" @click="togglePanel(4)">阴影颜色 Shadow Color)</p>
      <ul class="clpane-list" v-show="panePlay[4]">
        <li
          class="clpane-list-item"
          v-for="item in colorArray[4]"
          v-bind:class="{'cur':shadowCur.indexOf(item[2])>-1}"
        >
          <span
            class="clpane-list-color"
            :style="`background-color:${item[1]}`"
            @click="addColor($event, item ,'shadow')"
          ></span>
          <span class="clpane-list-name" @click="addColor($event, item ,'shadow')">{{item[0]}}</span>
        </li>
      </ul>
    </div>

    <div class="clpane-item" v-if="colorArray[5].length>0">
      <p class="clpane-title" @click="togglePanel(5)">品牌色 Brand Color)</p>
      <ul class="clpane-list" v-show="panePlay[5]">
        <li
          class="clpane-list-item"
          v-for="item in colorArray[5]"
          v-bind:class="{'cur':fnCur.indexOf(item[2])>-1}"
        >
          <span
            class="clpane-list-color"
            :style="`background-color:${item[1]}`"
            @click="addColor($event, item ,'fill')"
          ></span>
          <span class="clpane-list-name" @click="addColor($event, item ,'fill')">{{item[0]}}</span>
        </li>
      </ul>
    </div>

    <div class="clpane-item" v-if="colorArray[6].length>0">
      <p class="clpane-title" @click="togglePanel(6)">功能色 Function Color</p>
      <ul class="clpane-list" v-show="panePlay[6]">
        <li
          class="clpane-list-item"
          v-for="item in colorArray[6]"
          v-bind:class="{'cur':fnCur.indexOf(item[2])>-1}"
        >
          <span
            class="clpane-list-color"
            :style="`background-color:${item[1]}`"
            @click="addColor($event, item ,'fill')"
          ></span>
          <span class="clpane-list-name" @click="addColor($event, item ,'fill')">{{item[0]}}</span>
        </li>
      </ul>
    </div>

    <div class="clpane-item" v-if="fontArray.length>0">
      <p class="clpane-title" @click="togglePanel(5)">字体 Font</p>
      <ul class="clpane-list" v-show="panePlay[5]">
        <li
          class="clpane-list-item"
          v-for="(item, index) in fontArray"
          :key="index"
          :data-uniq="`${item[2]}`"
          v-bind:class="{'cur':textCur.indexOf(item[2])>-1}"
        >
          <span
            class="clpane-list-font"
            :style="`color:${item[3]}`"
            @click="addColor($event, item ,'fill')"
          >Ag</span>
          <span
            class="clpane-list-name"
            @click="(e) => addColor(e, item ,'fill')"
            @click.right="(e) => popOption(e, item ,'fill')"
          >{{item[4] || (item.slice(0,4).join(" ")+"pt")}}</span>
        </li>
      </ul>
    </div>
    <div
      class="clpane-error"
      v-if="colorArray[0].length<1
      &&colorArray[1].length<1
      &&colorArray[2].length<1
      &&colorArray[3].length<1
      &&colorArray[4].length<1
      &&colorArray[5].length<1
      &&colorArray[6].length<1
      &&fontArray.length<1"
    >
      <div class="clpane-error-pic"></div>

      <p class="clpane-error-text">您当前没有定义颜色和字体资源！</p>
      <p class="clpane-error-correct">请到资源面板添加!</p>
      <p>颜色命名格式为：颜色名字+色值</p>
      <p>例如：color-text #9c9c9c</p>
    </div>
    <button
      class="btn-down"
      v-if="!(colorArray[0].length<1
      &&colorArray[1].length<1
      &&colorArray[2].length<1
      &&colorArray[3].length<1
      &&colorArray[4].length<1
      &&colorArray[5].length<1
      &&colorArray[6].length<1
      &&fontArray.length<1)"
      @click="downSass()"
    >下载 Download</button>
  </div>
</template>

<script>
import application from "application";
import assets from "assets";
import uxp from "uxp";
import * as $ from "jquery";
import {
  directive,
  Contextmenu,
  ContextmenuItem,
  ContextmenuSubmenu,
  ContextmenuGroup
} from "v-contextmenu";
const {
  GraphicNode,
  Artboard,
  Text,
  Color,
  Rectangle,
  Ellipse,
  SymbolInstance
} = require("scenegraph");
const { editDocument } = require("application");
export default {
  props: {
    selectChange: Number,
    selection: {
      type: Object
    },
    theme: String
  },
  data() {
    return {
      colorAll: "",
      colorSass: "",
      colorArray: [[], [], [], [], [], [], []],
      fontArray: [],
      panePlay: [true, false, false, false, false, false],
      contextMenuTarget: document.body,
      contextMenuVisible: false,
      textCur: [],
      fillCur: [],
      lineCur: [],
      shadowCur: [],
      fnCur: []
    };
  },
  methods: {
    deleteColor(vm, event) {
      console.log("vm,event:", vm, event);
    },
    traverseObj: function(obj) {
      for (let i in obj) {
        // 这里使用递归，属性类型为对象则进一步遍历
        if (typeof obj[i] == "object") {
          this.traverseObj(obj[i]);
        }
      }
    },
    popOption: function(e, item, type) {},
    addColor: function(e, item, type) {
      let thatSelection = this.selection;

      const that = this;
      let selectType;

      let itemLen = thatSelection.items.length;
      if (type == "fill") {
        var loop = function(node, color) {
          if (node && node.children.length > 0) {
            node.children.forEach(child => {
              if (child instanceof Rectangle || child instanceof Ellipse) {
                editDocument({ editLabel: "add color" }, function(child) {
                  let newColor = new Color(color);
                  child.fill = new Color(color);
                });
              } else if (child && child.children && child.children.length > 0) {
                loop(child, color);
              }
            });
          }
        };
        for (var i = 0; i < itemLen; i++) {
          const selectItem = thatSelection.items[i];
          if (
            selectItem instanceof Rectangle ||
            selectItem instanceof Ellipse
          ) {
            editDocument({ editLabel: "add color" }, function(selection) {
              selectItem.fill = new Color(item[3]);
              // console.log("selectItem.fill:", selectItem.fill);
            });
          } else if (selectItem && selectItem.children.length > 0) {
            loop(selectItem, item[3]);
          }
        }
      } else if (type == "border") {
        for (var i = 0; i < itemLen; i++) {
          const selectItem = thatSelection.items[i];
          editDocument({ editLabel: "add color" }, function(selection) {
            selectItem.stroke = new Color(item[3]);
          });
        }
      } else if (type == "text") {
        for (var i = 0; i < itemLen; i++) {
          const selectItem = thatSelection.items[i];
          this.traverseObj(selectItem);

          if (selectItem instanceof Text) {
            editDocument({ editLabel: "add color" }, function(selection) {
              selectItem.fill = new Color(item[3]);
            });
          }
        }
      } else if (type == "shadow") {
        for (var i = 0; i < itemLen; i++) {
          const selectItem = thatSelection.items[i];
          editDocument({ editLabel: "add color" }, function(selection) {
            selectItem.shadow = {
              x: 5,
              y: 5,
              blur: 5,
              color: new Color(item[3]),
              visible: true
            };
          });
        }
      }
    },
    traChildFill: function(node, color) {
      let that = this;
      node.children.forEach(child => {
        editDocument({ editLabel: "add color", mergeId: "111" }, function(
          child
        ) {
          child.fill = new Color(color);
          if (child.children.length > 0) {
            that.traChildFill(child, color);
          }
        });
      });
    },
    downSass: async function() {
      const fs = uxp.storage.localFileSystem;
      // Get a folder by showing the user the system folder picker
      const folder = await fs.getFolder();
      // Exit if user doesn't select a folder
      if (!folder) return console.log("User canceled folder picker.");
      // 在本地创建一个sass文件
      const file = await folder.createFile("wegame-token.scss", {
        overwrite: true
      });
      // const file = await fs.getFileForSaving("hello.txt", { types: ["txt"] });
      if (!file) {
        // file picker was cancelled
        return;
      }
      await file.write(this.colorSass);
      const renditionOptions = [
        {
          node: selection.items[0],
          outputFile: file,
          type: application.RenditionType.PNG,
          scale: 2
        }
      ];

      try {
        // Create the rendition(s)
        const results = await application.createRenditions(renditionOptions);

        // Create and show a modal dialog displaying info about the results
        const dialog = this.createDialog(results[0].outputFile.nativePath);
        return dialog.showModal();
      } catch (err) {
        // Exit if there's an error rendering.
        return console.log("Something went wrong. Let the user know.");
      }
    },
    createDialog: function(filepath) {
      // Add your HTML to the DOM
      document.body.innerHTML = `
        <style>
        form {
            width: 400px;
        }
        </style>
        <dialog id="dialog">
            <form method="dialog">
                <h1>Redition saved</h1>
                <p>Your rendition was saved at:</p>
                <input type="text" uxp-quiet="true" value="${filepath}" readonly />
                <footer>
                <button type="submit" uxp-variant="cta" id="ok-button">OK</button>
                </footer>
            </form>
        </dialog>
      `;

      // Remove the dialog from the DOM every time it closes.
      // Note that this isn't your only option for DOM cleanup.
      // You can also leave the dialog in the DOM and reuse it.
      // See the `ui-html` sample for an example.
      const dialog = document.querySelector("#dialog");
      dialog.addEventListener("close", e => dialog.remove());

      return dialog;
    },
    togglePanel: function(index) {
      this.panePlay[index] = !this.panePlay[index]; //取反
      this.$set(this.panePlay, index, this.panePlay[index]);
    },
    convertTo(format, color) {
      if (format == "hex") {
        return "#" + (color & 0x00ffffff).toString(16).padStart(6, "0");
      } else {
        alert("Other color formats not supported yet");
      }
    },
    // (colorName, colorArr, realColor,sassColor)分别对应(设计师命名，展示颜色数组，10位数的色值，css色值)
    colorGroup(
      colorName,
      colorArr,
      realColor,
      sassColor,
      sassHex,
      colorOpacity
    ) {
      // let nameValArr = colorName.split(" ");
      let nameValArr = [];
      nameValArr.push(colorName);
      nameValArr.push(sassColor);
      nameValArr.push(realColor);
      nameValArr.push(sassHex);
      nameValArr.push(colorOpacity);

      if (colorName.toLowerCase().indexOf("color-text") != -1) {
        colorArr[0].push(nameValArr);
      } else if (colorName.toLowerCase().indexOf("color-fill") != -1) {
        colorArr[1].push(nameValArr);
      } else if (colorName.toLowerCase().indexOf("color-line") != -1) {
        colorArr[2].push(nameValArr);
      } else if (colorName.toLowerCase().indexOf("color-link") != -1) {
        colorArr[3].push(nameValArr);
      } else if (colorName.toLowerCase().indexOf("color-shadow") != -1) {
        colorArr[4].push(nameValArr);
      } else if (colorName.toLowerCase().indexOf("color-brand") != -1) {
        colorArr[5].push(nameValArr);
      } else {
        colorArr[6].push(nameValArr);
      }
      return colorArr;
    },
    hexToRgba(hex, opacity) {
      return (
        "rgba(" +
        parseInt("0x" + hex.slice(1, 3)) +
        "," +
        parseInt("0x" + hex.slice(3, 5)) +
        "," +
        parseInt("0x" + hex.slice(5, 7)) +
        "," +
        opacity +
        ")"
      );
    },
    packNode() {
      let allColors = assets.colors.get(),
        colorLen = allColors.length,
        allCharacter = assets.characterStyles.get(),
        characterLen = allCharacter.length;

      if (colorLen > 0) {
        for (var i = 0; i < colorLen; i++) {
          let newColor = this.convertTo("hex", allColors[i]["color"]["value"]);
          let colorName =
            allColors[i]["name"] == undefined ? newColor : allColors[i]["name"];
          let valKey = colorName.split(" ");
          let valKey_len = valKey.length;
          let sassColorName,
            sassHex,
            sassColor,
            colorOpacity = 1;
          for (var j = 0; j < valKey_len; j++) {
            if (valKey[j].toLowerCase().indexOf("color") != -1) {
              // 获取色值名字
              sassColorName = valKey[j];
            } else if (valKey[j].indexOf("#") != -1) {
              // 获取色值
              sassHex = valKey[j];
            } else if (valKey[j].indexOf("%") != -1) {
              // 获取透明度
              var _regex = /\d+/;
              var match = _regex.exec(valKey[j]);
              colorOpacity = match[0] / 100;
            }
            // 如果有透明度，则将色值转成rgba
            if (sassHex && colorOpacity != 1) {
              sassColor = this.hexToRgba(sassHex, colorOpacity);
            } else {
              sassColor = sassHex;
            }
          }
          let keyColor = valKey[1] == undefined ? newColor : valKey[1];

          this.colorArray = this.colorGroup(
            colorName,
            this.colorArray,
            allColors[i]["color"]["value"],
            sassColor,
            sassHex,
            colorOpacity
          );

          this.colorAll += colorName + ": " + newColor + ";\n";
          this.colorSass += "$" + sassColorName + ": " + sassColor + ";\n";
        }
      }
      if (characterLen > 0) {
        for (var i = 0; i < characterLen; i++) {
          let fontFamily = allCharacter[i]["style"].fontFamily,
            fontWeight = allCharacter[i]["style"].fontStyle,
            fontSize = allCharacter[i]["style"].fontSize,
            fontColor = allCharacter[i]["style"].fill.value,
            fontName = allCharacter[i]["name"];
          let rgbaColor = allCharacter[i]["style"].fill.toRgba();
          rgbaColor =
            "rgba(" +
            rgbaColor.r +
            "," +
            rgbaColor.g +
            "," +
            rgbaColor.b +
            "," +
            rgbaColor.a / 256 +
            ")";
          let fontItem = [
            fontFamily,
            fontWeight,
            fontSize,
            rgbaColor,
            fontName
          ];
          this.fontArray.push(fontItem);
        }
      }

      console.log("您还未添加颜色和字体资源！请到资产面板添加！");
    }
  },
  mounted() {
    this.packNode();
  },
  watch: {
    /*选中图层左侧颜色高亮*/
    selectChange: {
      deep: true,
      immediate: true,
      handler(val) {
        this.textCur = [];
        this.fillCur = [];
        this.lineCur = [];
        this.shadowCur = [];
        this.fnCur = [];
        let selectLen = this.selection.items.length;

        for (var i = 0; i < selectLen; i++) {
          const selectItem = this.selection.items[i];

          if (selectItem instanceof Text) {
            // let colVal = this.convertTo("hex", selectItem.fill.value);
            let colVal = selectItem.fill.value;

            this.textCur.push(colVal);
          } else {
            if (selectItem.fill.value) {
              // let colVal = this.convertTo("hex", selectItem.fill.value);
              let colVal = selectItem.fill.value;
              this.fillCur.push(colVal);
            }
            if (selectItem.stroke.value) {
              // let lineVal = this.convertTo("hex", selectItem.stroke.value);
              let lineVal = selectItem.stroke.value;
              this.lineCur.push(lineVal);
            }
            if (selectItem.shadow.color.value) {
              let shadowVal = selectItem.shadow.color.value;
              this.shadowCur.push(shadowVal);
            }
          }
        }
      }
    }
  },
  directives: {
    contextmenu: directive
  },
  components: {
    Contextmenu,
    ContextmenuItem,
    ContextmenuSubmenu,
    ContextmenuGroup
  }
};
</script>
<style>
</style>

