"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reader_1 = require("./src/reader");
class MaterialPanelClass {
    constructor() {
        this.colectable = [];
        this.selector = {
            panel: 0,
            effect: [
                "#material-background-box",
                "#material-background-name",
                "#material-background-color-text"
            ]
        };
    }
    get btnFS() {
        return document.querySelector("#material-foreground-color-setter");
    }
    get btnBS() {
        return document.querySelector("#material-background-color-setter");
    }
    async make() {
        let allOthers = await reader_1.dataDir("./data/user");
        allOthers.forEach(async (entry) => {
            if (!entry.isFile)
                return;
            let fileinfo = entry;
            let textfle = await fileinfo.read();
            this.colectable.push({
                name: entry.name,
                data: JSON.parse(textfle)
            });
            console.log(this.currentindex);
        });
        this.currentindex = 0;
    }
    HandleSelection(selection) {
        this.selection = selection;
        if (!selection.items || selection.items.length == 0) {
            this.btnFS.style.display = "none";
            this.btnBS.style.display = "none";
        }
        else {
            this.btnFS.style.display = "";
            this.btnBS.style.display = "";
        }
    }
    async DialogBox() {
        var div = document.createElement("div");
        let file1 = await reader_1.datareader("./extend/file-1.zip");
        let file2 = await reader_1.datareader("./extend/file-2.zip");
        div.innerHTML = ` <style> ${file2} </style> ${file1} `;
        let fgHandler = div.querySelector("#material-foreground-handler");
        let bgHandler = div.querySelector("#material-background-handler");
        div.querySelector("#material-background-handler .title")
            .addEventListener("click", _ => {
            this.selector.panel = 0;
            this.selector.effect = [
                "#material-background-box",
                "#material-background-name",
                "#material-background-color-text"
            ];
            if (!bgHandler.classList.contains("selected")) {
                fgHandler.classList.remove("selected");
                fgHandler.classList.remove("active");
                fgHandler.classList.add("in-active");
                bgHandler.classList.remove("in-active");
                bgHandler.classList.add("selected");
                this.btnBS.textContent = "Change";
            }
        });
        div.querySelector("#material-background-box")
            .addEventListener("click", _ => {
            this.selector.panel = 0;
            this.selector.effect = [
                "#material-background-box",
                "#material-background-name",
                "#material-background-color-text"
            ];
            if (bgHandler.classList.contains("selected")) {
                if (bgHandler.classList.contains("active")) {
                    bgHandler.classList.remove("active");
                    this.btnBS.textContent = "Change";
                }
                else {
                    bgHandler.classList.add("active");
                    this.btnBS.textContent = "Auto Change";
                }
            }
            else {
                fgHandler.classList.remove("selected");
                fgHandler.classList.remove("active");
                fgHandler.classList.add("in-active");
                bgHandler.classList.remove("in-active");
                bgHandler.classList.add("selected");
                this.btnFS.textContent = "Change";
                this.btnBS.textContent = "Change";
            }
        });
        div.querySelector("#material-foreground-handler .title")
            .addEventListener("click", _ => {
            this.selector.panel = 1;
            this.selector.effect = [
                "#material-foreground-box",
                "#material-foreground-name",
                "#material-foreground-color-text"
            ];
            if (!fgHandler.classList.contains("selected")) {
                bgHandler.classList.remove("selected");
                bgHandler.classList.remove("active");
                bgHandler.classList.add("in-active");
                fgHandler.classList.remove("in-active");
                fgHandler.classList.add("selected");
                this.btnFS.textContent = "Change";
            }
        });
        div.querySelector("#material-foreground-box")
            .addEventListener("click", _ => {
            this.selector.panel = 1;
            this.selector.effect = [
                "#material-foreground-box",
                "#material-foreground-name",
                "#material-foreground-color-text"
            ];
            if (fgHandler.classList.contains("selected")) {
                if (fgHandler.classList.contains("active")) {
                    fgHandler.classList.remove("active");
                    this.btnFS.textContent = "Change";
                }
                else {
                    fgHandler.classList.add("active");
                    this.btnFS.textContent = "Auto Change";
                }
            }
            else {
                bgHandler.classList.remove("selected");
                bgHandler.classList.remove("active");
                bgHandler.classList.add("in-active");
                fgHandler.classList.remove("in-active");
                fgHandler.classList.add("selected");
                this.btnBS.textContent = "Change";
                this.btnFS.textContent = "Change";
            }
        });
        const { editDocument } = require("application");
        const { Color } = require("scenegraph");
        var ChangeFill = () => {
            var validelements = ["Rectangle", "Ellipse", "Path", "Artboard", "Text", "Polygon"];
            var Collect = (items) => {
                items.forEach(element => {
                    if (validelements.includes(element.constructor.name)) {
                        this.Tempcollection.push(element);
                    }
                    else if (element.children && element.children.length > 0)
                        Collect(element.children);
                });
            };
            editDocument({ editLabel: "Change Fill" }, function (selection) {
                const txtBg = div.querySelector("#material-background-color-text");
                selection.items.forEach(element => {
                    if (validelements.includes(element.constructor.name)) {
                        element.fill = new Color(txtBg.value);
                    }
                });
            });
        };
        div.querySelector("#material-background-color-setter")
            .addEventListener("click", _ => { this.ChangeFill(editDocument, Color); });
        div.querySelector("#material-foreground-color-setter")
            .addEventListener("click", _ => { this.ChangeBorder(editDocument, Color); });
        div.querySelector("#mcp-item-selector")
            .addEventListener("click", _ => {
            let s1 = document.querySelector(".library-select-box");
            s1.classList.toggle("active");
            let s2 = document.getElementById("material-panel-colors");
            s2.style.display = (s1.classList.contains("active") ? "none" : "");
        });
        if (this.colectable.length > 0) {
            let s1 = div.querySelector(".library-select-box");
            s1.innerHTML = "";
            this.colectable.forEach((g, i) => {
                var v1 = document.createElement("div");
                v1.textContent = g.name.substring(0, g.name.lastIndexOf(".")).replace(/-/g, " ");
                s1.appendChild(v1);
                v1.onclick = _ => {
                    this.currentindex = i;
                    this.fillmaterial(div);
                    s1.classList.remove("active");
                };
            });
        }
        this.fillmaterial(div);
        return div;
    }
    fillmaterial(panel) {
        panel.querySelector("#mcp-collection-title")
            .textContent =
            this.colectable[this.currentindex].name.substring(0, this.colectable[this.currentindex].name.lastIndexOf(".")).replace(/-/g, " ");
        setTimeout(() => {
            let container = panel.querySelector("#material-panel-colors");
            container.innerHTML = "";
            container.style.display = "";
            let MaterialSource = this.colectable[this.currentindex];
            if (this.currentindex < 0 || this.colectable.length == 0) {
                container.innerHTML = "Select Color Collection";
                return;
            }
            let cbound = container.getBoundingClientRect();
            var boxbond = document.body.getBoundingClientRect();
            let crw = 15;
            let validate = cbound.width > 0;
            console.log("is validate", boxbond.height, document.body.clientHeight);
            if (validate) {
                let mx = Math.max(...Object.keys(MaterialSource.data).map(keymain => {
                    if (typeof MaterialSource.data[keymain] == "string")
                        return 0;
                    return Object.keys(MaterialSource.data[keymain]).length;
                }));
                crw = Math.round(cbound.width / mx) - 1;
                if (crw > 20)
                    crw = 20;
                if (crw < 15)
                    validate = false;
            }
            var c0 = Object.keys(MaterialSource.data)[0];
            if (typeof MaterialSource.data[c0] == "string") {
                var colorBox = document.createElement("div");
                colorBox.className = "color-box-grid";
                colorBox.style.justifyContent = "flex-start";
                container.appendChild(colorBox);
                Object.keys(MaterialSource.data)
                    .forEach(keymain => {
                    var col2 = document.createElement("div");
                    col2.title = `${this.MakeName(keymain)} `;
                    col2.style.backgroundColor = MaterialSource.data[keymain];
                    col2.className = "color-item-s";
                    col2.style.width = 20 + "px";
                    col2.style.maxWidth = 20 + "px";
                    col2.style.height = 20 + "px";
                    col2.style.margin = "1px 1px 0 0";
                    colorBox.appendChild(col2);
                    col2.onclick = _ => {
                        this.FixSelection(col2);
                        this.overflow(keymain, MaterialSource.data[keymain]);
                    };
                });
                return;
            }
            Object.keys(MaterialSource.data)
                .forEach(keymain => {
                var onc = document.createElement("div");
                container.appendChild(onc);
                onc.className = "mtpl-d0";
                var colorBox = document.createElement("div");
                onc.appendChild(colorBox);
                colorBox.className = "color-box-row";
                Object.keys(MaterialSource.data[keymain])
                    .forEach(key => {
                    var col2 = document.createElement("div");
                    col2.title = `${this.MakeName(keymain)} ${key}`;
                    col2.style.backgroundColor = this.colectable[this.currentindex].data[keymain][key];
                    col2.className = "color-item-s";
                    if (validate) {
                        col2.style.width = crw + "px";
                        col2.style.height = crw + "px";
                    }
                    colorBox.appendChild(col2);
                    col2.onclick = _ => {
                        this.FixSelection(col2);
                        let namestring = `${this.MakeName(keymain)} ${key.toUpperCase()}`;
                        let colorstring = this.colectable[this.currentindex].data[keymain][key];
                        this.overflow(namestring, colorstring);
                    };
                });
            });
        }, 200);
    }
    FixSelection(col2) {
        var t = this.selector.panel == 0 ? "●" : "○";
        let pvsList = document.querySelectorAll(".is-selected");
        pvsList.forEach(pvs => {
            if (pvs.textContent == t) {
                pvs.classList.remove("is-selected");
                pvs.textContent = "";
            }
            if (pvs.textContent == "⬤") {
                pvs.textContent = this.selector.panel == 1 ? "●" : "○";
            }
        });
        col2.classList.add("is-selected");
        if (col2.textContent != "") {
            col2.textContent = "⬤";
        }
        else {
            col2.textContent = t;
        }
        col2.style.color = "rgba(255,255,255,0.5)";
    }
    overflow(name, colortext) {
        let elm = document.querySelector(this.selector.effect[0]);
        let elmtext = document.querySelector(this.selector.effect[1]);
        let inputtext = document.querySelector(this.selector.effect[2]);
        elmtext.textContent = name;
        elm.style.backgroundColor = colortext;
        inputtext.value = colortext;
        const { editDocument } = require("application");
        const { Color } = require("scenegraph");
        if (document.querySelector("#material-background-handler")
            .classList.contains("active")) {
            this.ChangeFill(editDocument, Color);
        }
        if (document.querySelector("#material-foreground-handler")
            .classList.contains("active")) {
            this.ChangeBorder(editDocument, Color);
        }
    }
    MakeName(mainkey) {
        return mainkey.split(/(?=[A-Z])/).join(" ");
    }
    ChangeBorder(editDocument, Color) {
        editDocument({ editLabel: "Change stroke" }, (selection) => {
            this.Tempcollection = [];
            const txtFg = document.querySelector("#material-foreground-color-text");
            if (txtFg.value.length == 0)
                return;
            var validelements = ["Rectangle", "Ellipse", "Path", "Text", "Line", "Polygon"];
            var Collect = (items) => {
                items.forEach(element => {
                    if (validelements.includes(element.constructor.name)) {
                        this.Tempcollection.push(element);
                    }
                    else if (element.children && element.children.length > 0)
                        Collect(element.children);
                });
            };
            selection.items.forEach(element => {
                if (validelements.includes(element.constructor.name)) {
                    this.Tempcollection.push(element);
                }
                else if (element.children && element.children.length > 0)
                    Collect(element.children);
            });
            this.Tempcollection.forEach(element => {
                element.stroke = new Color(txtFg.value);
            });
        });
    }
    ChangeFill(editDocument, Color) {
        editDocument({ editLabel: "Change Fill" }, (selection) => {
            this.Tempcollection = [];
            const txtBg = document.querySelector("#material-background-color-text");
            if (txtBg.value.length == 0)
                return;
            var validelements = ["Rectangle", "Ellipse", "Path", "Artboard", "Text", "Polygon"];
            var Collect = (items) => {
                items.forEach(element => {
                    if (validelements.includes(element.constructor.name)) {
                        this.Tempcollection.push(element);
                    }
                    else if (element.children && element.children.length > 0)
                        Collect(element.children);
                });
            };
            selection.items.forEach(element => {
                if (validelements.includes(element.constructor.name)) {
                    this.Tempcollection.push(element);
                }
                else if (element.children && element.children.length > 0)
                    Collect(element.children);
            });
            this.Tempcollection.forEach(element => {
                element.fill = new Color(txtBg.value);
            });
        });
        ;
    }
}
exports.MaterialPanelClass = MaterialPanelClass;
