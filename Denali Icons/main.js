const fs = require("uxp").storage.localFileSystem;

let rootNode = null;
let PANEL_HTML = null;
const $ = sel => rootNode && rootNode.querySelector(sel);

function panel() {
    // Get Icon Data
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            var records = JSON.parse(this.responseText);

            // Render all HTML icons
            function renderHtmlData(iconStyle) {
                var out = "";
                var i, j;
                for (i in records) {
                    out += '<div class="icon-category"><h3>' + records[i].name + '</h3><div class="icon-container">';
                    for (j in records[i].icons) {
                        if (iconStyle === "solid") {
                            out += '<img class="iconImage" id="' + records[i].icons[j] + '-solid" src="icons/' + records[i].icons[j] + '-solid.svg" draggable="true" />';
                        } else {
                            out += '<img class="iconImage" id="' + records[i].icons[j] + '" src="icons/' + records[i].icons[j] + '.svg" draggable="true" />';
                        }
                    }
                    out += '</div></div>';
                }
                return out;
            }

            var PANEL_STYLE = `
            <style>
                .header {
                    display:flex;
                    flex-direction: row;
                    margin-bottom: 10px;
                    background: #F7F7F7;
                    width: 100%
                }
                .icon-container {
                    display: flex;
                    flex-wrap: wrap;
                    flex: 1;
                    margin: 10px 0px 20px 0px;
                }
                .iconImage {
                    height: 45px;
                    width: 45px;
                    padding: 8px;
                    margin: 2px;
                    border-radius: 10px;
                    cursor: move;
                }
                .iconImage:hover {
                    border: solid 2px #0082F3;
                }
                .hide { display: none; }
                .row { align-items: center; }
            </style>
            `
            PANEL_HTML = PANEL_STYLE + `
            <div method="dialog" id="main">
                <div class="header">
                    <label class="row">
                        <span>Icon Style</span>
                        <select id="lstAction">
                            <option selected value="outline">Outline</option>
                            <option value="solid">Solid</option>
                        </select>
                    </label>
                </div>
                <div id="outlineIconCategoryContainer">
                    ` + renderHtmlData("outline") + `
                </div>
                <div id="solidIconCategoryContainer" class="hide">
                    ` + renderHtmlData("solid") + `
                </div>
            </div>`
        }
    };
    xhr.open("GET", "denali-icon-categories.json", true);
    xhr.send();

    // Create the panel's DOM. We'll do this only once.
    function create() {
        if (rootNode) { return rootNode; }
        rootNode = document.createElement("div");
        rootNode.innerHTML = PANEL_HTML;

        // Switch between solid and outline icons
        $("#lstAction").onchange = (evt) => {
            if (evt.target.value === "outline") {
                document.getElementById("outlineIconCategoryContainer").classList.remove("hide");
                document.getElementById("solidIconCategoryContainer").classList.add("hide");
            } else {
                document.getElementById("outlineIconCategoryContainer").classList.add("hide");
                document.getElementById("solidIconCategoryContainer").classList.remove("hide");
            }
            console.log(evt.target.value);
        }
        return rootNode;
    }

    function show(event) {
        event.node.appendChild(create());

        // Get icon files
        document.querySelectorAll('.iconImage').forEach(async (item) => {
            const pluginFolder = await fs.getPluginFolder();
            const theImagesFolder = await pluginFolder.getEntry("icons");
            const icon = await theImagesFolder.getEntry(item.id + ".svg");
            // Event on drag to place file
            item.addEventListener('dragstart', event => {
                event.dataTransfer.setData("text/uri-list", icon.nativePath);
            })
        })
    }
    return show
}

module.exports = {
    panels: {
        denaliIcons: panel()
    }
};
