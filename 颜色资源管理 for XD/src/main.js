const application = require("application");
const fs = require("uxp").storage.localFileSystem;
const assets = require("assets");
const resetCss = require("../theme/css/reset.css");
const clpane = require("../theme/css/clpane.css");
const contextmenuCss = require("../theme/context-style/index.css");
const Vue = require("vue").default;
const colorpanel = require("./colorpanel.vue").default;
const colorpicker = require("./colorPicker.vue").default;
const { Text, Color } = require("scenegraph");
let instanceSass;
function classfyAsset(event) {
    console.log("classfyAsset1:" + event.node);
    /*
    for (let i in event.node) {
        console.log(i + ": " + event.node[i]);
    }
    */
    document.body.innerHTML = `<panel><div id="container"></div></panel>`
    let panel = document.querySelector("panel");
    event.node.appendChild(panel);
    instanceSass = new Vue({
        el: "#container",
        components: { colorpanel },
        data: {
            selectChange: 0,
            selection: {
                items: [],
                itemsIncludingLocked: [],
                hasArtwork: false,
                hasArtboards: false,
                editContext: null,
                insertionParent: null,
                focusedArtboard: null
            }
        },
        render(h) {
            return h(colorpanel, {
                props: {
                    selection: this.selection,
                    selectChange: this.selectChange
                }
            })
        }
    })
}
let instanceWeui;
function showWeui(event) {

    for (let i in event.node) {
        console.log(i + ": " + event.node[i]);
    }
    document.body.innerHTML = `<panel><div id="container"></div></panel>`
    let panel = document.querySelector("panel");
    event.node.appendChild(panel);
    instanceWeui = new Vue({
        el: "#container",
        components: { colorpicker },
        data: {
            selection: {
                items: [],
                itemsIncludingLocked: [],
                hasArtwork: false,
                hasArtboards: false,
                editContext: null,
                insertionParent: null,
                focusedArtboard: null
            }
        },
        render(h) {
            return h(colorpicker, {
                props: {
                    selection: this.selection
                }
            })
            // return h(colorpanel)
        }
    })
}


function traverseObj(obj) {

    for (let i in obj) {

        // 这里使用递归，属性类型为对象则进一步遍历
        if (typeof obj[i] == "object") {
            traverseObj(obj[i]);
        }
    }
}
function show(event) {

    const content = "<p>Hello, World</p>";
    const panel = document.createElement("div");
    panel.innerHTML = content;
    event.node.appendChild(panel);
}

function hide(event) {

    event.node.firstChild.remove();
}
function updateSass(selection, documentRoot) {
    /*
    vue监听不到selection的变化，所以监听selectChange
    */
    instanceSass.selectChange++;
    instanceSass.selection = selection;
}
function updateWeui(selection, documentRoot) {
    console.log("update:");
}
function updateWidget(selection, documentRoot) {
    console.log("update:");
}
module.exports = {
    panels: {
        sassVariable: {
            show(event) {
                classfyAsset(event);
            },
            hide(event) {
                hide(event);
            },
            update(selection, documentRoot) {
                updateSass(selection, documentRoot);
            }
        },
        weui: {
            show(event) {
                showWeui(event);
            },
            hide(event) {
                hide(event);
            },
            update(selection, documentRoot) {
                updateWeui(selection, documentRoot);
            }
        },
        widget: {
            show(event) {
                show(event);
            },
            hide(event) {
                hide(event);
            },
            update(selection, documentRoot) {
                updateWidget(selection, documentRoot);
            }
        }
    }
};
