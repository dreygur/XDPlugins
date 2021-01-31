/*
 * Typist
 * Author: Giovanni De Andre aka Gio
 * https://github.com/gioalo
 * License: MIT
 *
 */

const {Artboard, Color, Text, Rectangle } = require("scenegraph");
const {alert,error,warning} = require("./lib/dialogs.js");
const h = require("./lib/h.js");
const Typist  = require("./lib/typist.js");
const typist = new Typist();
let selectedArtboard = null;

/**
 * Creates Artboard and make selection
 * @param {*} selection
 * @param {*} root
 */
async function createNewArtboard(selection, root) {
    let len = root.children.length;
    let last = len === 0 ? len : len - 1;
    let nodes = [];
    let newArtboard = new Artboard();
    newArtboard.name = "Typist";
    newArtboard.width = 1920;
    newArtboard.height = 1080;
    newArtboard.fill = new Color("white");

    if(root.children.length > 0) {
        root.children.forEach((node, index) => {
            nodes.push(node);
        });
        const lastNode = {
            x: nodes[last].globalBounds.x,
            y: nodes[last].globalBounds.y,
            h: nodes[last].height,
            w: nodes[last].width,
            spacing: 100,
            getNode(){
                return nodes[last];
            },
            getYpos(){
                return this.y + (this.h + this.spacing);
            }
        };
        newArtboard.moveInParentCoordinates(lastNode.x, lastNode.getYpos());
        await root.addChildAfter(newArtboard, lastNode.getNode());
    } else {
        newArtboard.moveInParentCoordinates(0,0);
        await root.addChild(newArtboard);
    }

    selection.items = [newArtboard];
}

/**
 * Create plugin
 * @param {*} selection
 */
async function initPlugin(selection, root){
    selectedArtboard = selection;
    if(selectedArtboard.hasArtboards && selectedArtboard.items.length === 1 &&  selectedArtboard.items[0].children.length === 0 && selectedArtboard.items[0].width === 1920 && selectedArtboard.items[0].height === 1080) {
        try {
            // Form
            const $dialog = document.querySelector("#typistDialog");
            const $form = document.querySelector("#typistDialog #form");
            const $submitBtn = document.querySelector("#typistDialog #submitBtn");
            const $closeBtn = document.querySelector("#typistDialog #closeBtn");
            const $customRatioInput = document.querySelector("#typistDialog #customRatio");
            // Inputs
            const $ratio = document.querySelector("#typistDialog select[name=ratio]");
            const $newRatio = document.querySelector("#typistDialog input[name=custom_ratio]");
            const $base = document.querySelector("#typistDialog input[name=base]");
            const $notes = document.querySelector("#typistDialog input[name=notes]");
            // error
            const $notesError = document.querySelector("#typistDialog #notesError");
            const $baseError = document.querySelector("#typistDialog #baseError");
            const $customRatioError = document.querySelector("#typistDialog #customRatioError");
            const $formError = document.querySelector("#typistDialog #formError");

            $form.addEventListener("submit",(evt)=>{
                evt.preventDefault();
                resetFormInputs();
                evt.target.reset();
            });

            // Resets form
            function resetFormInputs() {
                if($ratio.value === "") {
                    $customRatioInput.style.visibility = "visible";
                } else {
                    $customRatioInput.style.visibility = "hidden";
                }
                if($formError.style.visibility === "visible") {
                    $formError.style.visibility = "hidden";
                }
            }

            function deletesArtboardIfCancel() {
                selectedArtboard.items[0].removeFromParent();
            }

            $base.addEventListener("keyup",(evt)=>{
                evt.preventDefault();
                showInputError(
                    typist.validateFontSize(Math.max(evt.target.value)),
                    $baseError,
                    $submitBtn
                );
            });

            $notes.addEventListener("keyup",(evt)=>{
                evt.preventDefault();
                showInputError(
                    typist.validateNumberOfNotes(Math.max(evt.target.value)),
                    $notesError,
                    $submitBtn
                );
            });

            $newRatio.addEventListener("keyup",(evt)=>{
                evt.preventDefault();
                showInputError(
                    typist.validateRatio(Math.max(evt.target.value)),
                    $customRatioError,
                    $submitBtn
                );
            });

            $closeBtn.addEventListener("click", ()=>{
                deletesArtboardIfCancel();
                resetFormInputs();
                $dialog.close();
            });

            $ratio.addEventListener("change", (evt)=>{
                if(evt.target.value !== "") {
                    $customRatioInput.style.visibility = "hidden";
                } else {
                    $customRatioInput.style.visibility = "visible";
                }
            });
            // form submit
            $submitBtn.addEventListener("click", (evt)=>{
                evt.preventDefault();
                const inputValues = {
                    ratio: ($ratio.value !== "" ? Math.max($ratio.value) : Math.max($newRatio.value)),
                    fontSize: Math.max($base.value),
                    notes: Math.max($notes.value)
                }
                $dialog.close(inputValues);
                resetFormInputs();
            });

            await $dialog.showModal().then((resolve) => {
                if(resolve != "" && resolve != "reasonCanceled") {
                    typist.typographyScale(resolve.ratio, resolve.notes, resolve.fontSize).then((res) =>{
                        // console.log(res);
                        typistSpec(selectedArtboard, res.reverse());
                    }).catch(res => {
                        deletesArtboardIfCancel();
                        console.log("[USER] Invalid values make sure is a positive number.");
                        return res;
                    });
                }
            });

        } catch (error) {
            typist.alertUserIfItBroken();
            deletesArtboardIfCancel();
            console.error("[DEVELOPER] Oops something is broken.", error);
        }
    } else {
        alertUserToSelectArtboard();
    }
}
/**
 * Returns error for invalid values
 * @param {string} id
 * @param {number} value
 */
async function valueError(id,value) {
    if(typist.checkNumberValidity(value)) {
        id.style.visibility = "hidden";
    } else {
        id.style.visibility = "visible";
    }
}
/**
 * Return error
 * @param {boolean} valid
 * @param {HTMLElement} id target element id
 */
async function showInputError(valid, id, btnId){
    const formError = document.querySelector("#typistDialog #formError");
    if (valid) {
        id.style.visibility = "hidden";
        btnId.removeAttribute("disabled");
        formError.style.visibility = "hidden";
    } else {
        id.style.visibility = "visible";
        btnId.setAttribute("disabled","disabled");
        formError.style.visibility = "visible";
    }
}
/**
 * Draw Header headline
 * @param {*} selection
 * @param {*} config
 */
async function heading(selection, config) {
    // headline text
    const headlineNode = new Text();
    headlineNode.text = "Typography Spec";
    headlineNode.styleRanges = [{
        length: headlineNode.text.length,
        fontSize: 72,
        fill: new Color(config.colorBlack),
        fontStyle: "Bold"
    }];

    headlineNode.moveInParentCoordinates(config.xpos, config.ypos);
    selection.insertionParent.addChild(headlineNode);
}
/**
 * Draw Header typist settings
 * @param {*} selection
 * @param {*} config
 */
async function settings(selection, config) {
    // settings text
    const settingsNode = new Text();
    settingsNode.text = `Settings: Body Font Size = ${config.base}px, Baseline Ratio = ${config.ratio}, Optimal Line Length Width = ${config.width}px (Approx. 75 C.P.L)`;
    settingsNode.styleRanges =[{
        length: settingsNode.text.length,
        fontSize: 24,
        fill: new Color(config.colorBlack)
    }];
    settingsNode.moveInParentCoordinates(config.xpos, config.ypos + 72);
    selection.insertionParent.addChild(settingsNode);
}
/**
 * Draw Rectangle for header
 * @param {*} selection
 */
async function header(selection) {
    let rectangle = new Rectangle();
		rectangle.width = selection.items[0].width;
		rectangle.height = 230;
		rectangle.fill = new Color("#F5F5F5");
		selection.insertionParent.addChild(rectangle);
        rectangle.moveInParentCoordinates(0, 0);
}
/**
 * Draws typist artwork
 * @param {*} selectedArtboard current selection
 * @param {object[]} data typography settings
 */
async function typistSpec(selectedArtboard, data) {
    let baseline = data[data.length - 2];
    if(selectedArtboard.items.length > 0 && data.length > 0) {
        // setup type settings
        const config = {
            id: baseline.leading,
            base:baseline.px,
            ratio:baseline.leading,
            width:baseline.maxwidth,
            colorBlack: "#212121",
            colorWhite: "#FFFFFF",
            ypos:100,
            xpos:100
        };

        // Rename/tag selected artboard
        selectedArtboard.items[0].name = `Typography Spec-${config.id}`;


        // Header
        header(selectedArtboard);
        heading(selectedArtboard, config);
        settings(selectedArtboard, config);

        // Type scales nodes
        data.forEach((item, i) => {
            const node = new Text();
            node.text = `The quick brown fox jumps over the lazy dog (${item.em}em).`;

            node.styleRanges = [{
                length: node.text.length,
                fontSize: item.px,
                fill: new Color(config.colorBlack)
            }];

            node.moveInParentCoordinates(config.xpos, (config.ypos * 2.5) + (100 * (i + 1)));
            selectedArtboard.insertionParent.addChild(node);
        });
    }

}
/**
 * Alert user to select artboard
 */
async function alertUserToSelectArtboard() {
    console.log("[USER] Alert! No Artboard selection, Not an empty Artboard or Too many selections. Select at least one Artboard.");
    await alert("⚠️ Required Artboard.","* Make sure you have selected at least one Empty Artboard. Required Artboard size Web 1920 (1920x1080).","* Can't select multiple Artboards.","* Please close and try again!");
}

// Create form dialog
let typistFormDialog = h("dialog", {id:"typistDialog"},
    h("form", { style: { width: 600 }, method:"dialog", id:"form"},
        h("h1", "Typist"),
        h("hr"),
        h("p", "Please fill out form to generate modular typography."),
        h("div",
            {style:{ display:"flex", flexDirection: "row", justifyContent:"space-between"
            }},
            h("label",
                h("span", "Baseline font size (Body)"),
                h("input", {type: "number", name:"base", placeholder:"14-24", style:{width: 100}}),
                h("span",{id:"baseError",style:{color:"red",fontSize:"12px", visibility:"hidden"}},"⚠️Invalid number.")
            ),
            h("label",
                h("span", "Number of headings"),
                h("input", {type: "number", name:"notes", placeholder:"2-4", style:{width: 100}}),
                h("span",{id:"notesError",style:{color:"red",fontSize:"12px", visibility:"hidden"}},"⚠️Invalid number.")
            )
        ),
        h("div",{style:{ display:"flex", flexDirection: "row",justifyContent:"space-between"}},
            h("label",
                h("span", "Select a Ratio"),
                h("select", { style: { width: 250 }, name:"ratio", autofocus:'autofocus'},
                    ...typist.getRatios().map(([name, value]) =>
                        h("option", {value: value, style:{ textTransform:"capitalize" }}, `${name} - ${value}`))
                )
            ),
            h("label",{id:"customRatio",style:{visibility:"hidden",width: 100}},
                h("span", "Enter Ratio"),
                h("input", {type: "number", name:"custom_ratio", placeholder:"1.125-4", style:{width: 100}}),
                h("span",{id:"customRatioError",style:{color:"red",fontSize:"12px", visibility:"hidden"}},"⚠️Invalid number.")
            )
        ),
        h("footer",{style:{display:"flex", flexDirection:"row", alignItems:"center"}},
            h("span",{id:"formError", style:{visibility:"hidden", fontSize:"14px", fontWeight:"bold", color:"red"}},"Sorry! You must fill out all fields."),
            h("button", {uxpVariant: "primary", id:"closeBtn"}, "Cancel"),
            h("button", {uxpVariant: "cta", id:"submitBtn"}, "Submit")
        )
    )
);
// Append form dialog
document.body.appendChild(typistFormDialog);

/**
 * Initialize plugin commands
 */
module.exports = {
    commands: {initPlugin}
};
