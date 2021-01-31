const {getManifest, getNearestIcon} = require('./manifest.js');
const {createJSfile} = require('./exportCreation/createJSfile');
const {createCssWithMargin} = require('./exportCreation/createCss');
const {createHTML} = require('./exportCreation/createHTMLstructur');
const {createSubFolder, filterImages} = require("./helper");
const {createIcon} = require("./exportCreation/createIcons");
const {createIndexDatei} = require("./exportCreation/createIndexHTML");
const {sortItemsOboveAnother, mapItemsLyingInEachOther, sortItemsfromLeftToRight} = require("../lib/selectionHandler.js");
const {selection} = require("scenegraph");
const fs = require("uxp").storage.localFileSystem;

let manifest;

function strToHtml(str) {
    // allow some common overloads, including arrays and non-strings
    if (Array.isArray(str)) {
        return str.map(str => strToHtml(str)).join('');
    }
    if (typeof str !== 'string') {
        return strToHtml(`${str}`);
    }

    let html = str;

    // handle some markdown stuff
    if (html.substr(0, 2) === '##') {
        html = `<h3>${html.substr(2).trim().toUpperCase()}</h3>`;
    } else if (html.substr(0, 1) === '#') {
        html = `<h2>${html.substr(1).trim()}</h2>`;
    } else if (html.substr(0, 2) === '* ') {
        html = `<p class="list"><span class="bullet margin">•</span><span class="margin">${html.substr(2).trim()}</span></p>`;
    } else if (html.substr(0, 4) === '----') {
        html = `<hr class="small"/>${html.substr(5).trim()}`;
    } else if (html.substr(0, 3) === '---') {
        html = `<hr/>${html.substr(4).trim()}`;
    } else {
        html = `<p>${html.trim()}</p>`;
    }

    // handle links -- the catch here is that the link will transform the entire paragraph!
    const regex = /\[([^\]]*)\]\(([^\)]*)\)/;
    const matches = str.match(regex);
    if (matches) {
        const title = matches[1];
        const url = matches[2];
        html = `<p><a href="${url}">${html.replace(regex, title).replace(/\<\|?p\>/g, '')}</a></p>`;
    }

    return html;
}

async function createDialog({
                                title,
                                icon = 'plugin-icon',
                                msgs,
                                input,
                                prompt,
                                multiline = false,
                                render,
                                template,
                                isError = false,
                                buttons = [
                                    {label: 'Close', variant: 'cta', type: 'submit'}
                                ]
                            } = {},
                            width = 500,
                            height = 'auto',
                            iconSize = 18
) {

    let messages = Array.isArray(msgs) ? msgs : [msgs];

    try {
        if (!manifest) {
            manifest = await getManifest();
        }
    } catch (err) {
        // do nothing
    }

    let usingPluginIcon = false;
    if (icon === 'plugin-icon') {
        if (manifest.icons) {
            usingPluginIcon = true;
            iconSize = 24;
            icon = getNearestIcon(manifest, iconSize);
        }
    }

    const dialog = document.createElement('dialog');
    dialog.innerHTML = `
    <style>
    form {
        width: ${width}px;
    }
    .h1 {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .h1 img {
        width: ${iconSize}px;
        height: ${iconSize}px;
        flex: 0 0 ${iconSize}px;
        padding: 0;
        margin: 0;
    }
    img.plugin-icon {
        border-radius: 4px;
        overflow: hidden;
    }
    
    #readMe{
    color: indianred;
    }
    
    a{
    color: indianred;
    font-style: italic;
    text-decoration: underline;
    }
    
    .list {
        display: flex;
        flex-direction: row;
    }
    .list .margin {
        margin-bottom: 0;
        margin-left: 0;
    }
    .list span {
        flex: 0 0 auto;
        border: 1px solid transparent;
    }
    .list .bullet {
        text-align: center;
    }
    .list + .list {
        margin-top: 0;
    }
    .container {
        zoverflow-x: hidden;
        overflow-y: auto;
        height: ${height === 'auto' ? height : `${height}px`};
    }
    input{
    width: 250px;
    }
    
    .text{
    margin-left: 10px;
    }
    
    #eg{
    padding-bottom: 15px;
    }
    
    </style>
    <form method="dialog">
        <h1 class="h1">
            <span ${isError ? `class="color-red"` : ""}>${title}</span>
            ${icon ? `<img ${usingPluginIcon ? `class="plugin-icon" title="${manifest.name}"` : ''} src="${icon}" />` : ''}
        </h1>
        <p id="readMe">Please read <a href="https://plugindocs.readthedocs.io/en/latest/?">this instruction</a> before using the PlugIn</p>
        <hr/>
        <div class="container">
            ${!render && (
        template ? template() : (messages.map(msg => strToHtml(msg)).join('') +
            `<lable class="text">Webcomponent name with "-"</lable>` +
            (prompt ? `<label>${
                `<input type="text" id="prompt" value="" placeholder="${prompt}" required/>`
                }</label>` + `<label id="eg">e.g.: my-component</label>` : '')
        )
    )}
            
        </div>
        <div class="container">
            ${!render && (
        `<lable class="text">Select a folder</lable>` +
        (input ? `<label>${
            `<input type="text" id="input" value="" placeholder="${input}" disabled required/>`
            }</label>` + `<label id="saved" style="display: none; color: forestgreen">your component is saved</label>` : '')
    )}
        </div>
        <div id="showAlert" style="display: none; color: indianred">Something went wrong. Please read the instruction and make sure you did everything in the correct way. You can also write an e-mail to the support.</div>
        <footer>
            ${buttons.map(({label, type, variant} = {}, idx) => `<button id="btn${idx}" type="${type}" uxp-variant="${variant}">${label}</button>`).join('')}
        </footer>
    </form>
    `;


    // if render fn is passed, we'll call it and attach the DOM tree
    if (render) {
        dialog.querySelector(".container").appendChild(render());
    }


    //check if the user enter the componentname correctly
    let promptfield = dialog.querySelector("#prompt");
    promptfield.onfocus = function () {
        inputfiel.disabled = false;
    };

    let alert = dialog.querySelector("#showAlert");
    let okayMsg = dialog.querySelector("#saved");

    //user clicks on input-field to select a folder
    let inputfiel = dialog.querySelector("#input");
    inputfiel.onfocus = async e => {
        e.preventDefault();
        const myFolder = await fs.getFolder();

        let filename = promptfield.value;

        try {
            //create CSS File
            let cssName = filename.split("-")[0] + filename.split("-")[1] + "-style";
            const cssFile = await myFolder.createEntry(cssName + ".css", {overwrite: true});
            let selectedItems = [];
            selectedItems = selection.items;
            let array = [];
            let sortedObove = sortItemsOboveAnother(selectedItems);
            let itemMap = mapItemsLyingInEachOther(sortedObove);
            for (let key of itemMap.keys()) {
                array.push(key);
            }
            let sortedArray = sortItemsfromLeftToRight(array);
            await cssFile.write(createCssWithMargin(sortedArray, itemMap, undefined));

            //create JS-File
            let starttag = [];
            const myFile = await myFolder.createEntry(filename + ".js", {overwrite: true});
            await myFile.write(createJSfile(filename, sortedArray, itemMap, starttag));

            //create Index HTML
            const indexFile = await myFolder.createEntry("index.html", {overwrite: true});
            await indexFile.write(createIndexDatei(filename));

            //create seperate HTML Code
            let startTag = [];
            const htmlFile = await myFolder.createEntry("htmlStructur.html", {overwrite: true});
            await htmlFile.write(createHTML(sortedArray, itemMap, startTag));

            //Print Path into the input-field
            let filepath = myFile.nativePath;
            inputfiel.value = filepath;

            //create subfolder and save Icons
            const subfolder = await createSubFolder(myFolder, "_mat");
            let iconList = filterImages(selection.items);
            iconList.forEach(item => {
                createIcon(subfolder, item);
            });
            //empty selection Array
            selectedItems.length = 0;

            okayMsg.style.display = "block";

        } catch (e) {
            alert.style.display = "block";
        }
    };


    // The "ok" and "cancel" button indices. OK buttons are "submit" or "cta" buttons. Cancel buttons are "reset" buttons.
    let okButtonIdx = -1;
    let cancelButtonIdx = -1;
    let clickedButtonIdx = -1;

    // Ensure that the form can submit when the user presses ENTER (we trigger the OK button here)
    const form = dialog.querySelector('form');
    form.onsubmit = () => dialog.close('ok');

    // Attach button event handlers and set ok and cancel indices
    buttons.forEach(({type, variant} = {}, idx) => {
        const button = dialog.querySelector(`#btn${idx}`);
        if (type === 'submit' || variant === 'cta') {
            okButtonIdx = idx;
        }
        if (type === 'reset') {
            cancelButtonIdx = idx;
        }
        button.onclick = e => {
            e.preventDefault();
            clickedButtonIdx = idx;
            dialog.close(idx === cancelButtonIdx ? 'reasonCanceled' : 'ok');
        }
    });

    try {
        document.appendChild(dialog);

        const response = await dialog.showModal();
        if (response === 'reasonCanceled') {
            // user hit ESC
            return {which: cancelButtonIdx, value: ''};
        } else {
            if (clickedButtonIdx === -1) {
                // user pressed ENTER, so no button was clicked!
                clickedButtonIdx = okButtonIdx; // may still be -1, but we tried
            }
            return {which: clickedButtonIdx, value: ''};
        }
    } catch (err) {
        // system refused the dialog
        return {which: cancelButtonIdx, value: ''};
    } finally {
        dialog.remove();
    }
}

/**
 * Generates an alert message
 *
 * @param {string} title
 * @param {string[]} msgs
 * @returns {Promise<{which: number}>} `which` indicates which button was clicked.
 */
async function alert(title, ...msgs) {
    return createDialog({title, msgs});
}

/**
 * Generates a warning message
 *
 * @param {string} title
 * @param {string[]} msgs
 * @returns {Promise<{which: number}>} `which` indicates which button was clicked.
 */
async function error(title, ...msgs) {
    return createDialog({title, isError: true, msgs});
}

/**
 * Displays a confirmation dialog.
 *
 * @param {string} title
 * @param {string} msg
 * @param {string[]} [buttons = ['Cancel', 'OK']] the buttons to display (in macOS order); TWO MAX.
 * @returns {Promise<{which: number}>} `which` indicates which button was clicked.
 */
async function confirm(title, msg, buttons = [ 'Cancel', 'OK' ]) {
    return createDialog({title, msgs: [msg], buttons: [
            {label: buttons[0], type:'reset', variant: 'primary'},
            {label: buttons[1], type:'submit', variant: 'cta'}
        ]});
}

/**
 * Displays a warning dialog.
 *
 * @param {string} title
 * @param {string} msg
 * @param {string[]} [buttons = ['Cancel', 'OK']] the buttons to display (in macOS order); TWO MAX.
 * @returns {Promise<{which: number}>} `which` indicates which button was clicked.
 */
async function warning(title, msg, buttons = [ 'Cancel', 'OK' ]) {
    return createDialog({title, msgs: [msg], buttons: [
            {label: buttons[0], type:'submit', variant: 'primary'},
            {label: buttons[1], type:'button', variant: 'warning'}
        ]});
}


async function prompt(title, msg, input, prompt, buttons = ['Cancel', 'OK'], multiline = false) {
    return createDialog({
        title, msgs: [msg], prompt, input, multiline, buttons: [
            {label: buttons[0], type: 'reset', variant: 'primary'},
            {label: buttons[1], type: 'submit', variant: 'cta'}
        ]
    });
}

function createAlert(tag, props, ...children) {
    let element = document.createElement(tag);
    if (props) {
        if (props.nodeType || typeof props !== "object") {
            children.unshift(props);
        }
        else {
            for (let name in props) {
                let value = props[name];
                if (name == "style") {
                    Object.assign(element.style, value);
                }
                else {
                    element.setAttribute(name, value);
                    element[name] = value;
                }
            }
        }
    }
    for (let child of children) {
        element.appendChild(typeof child === "object" ? child : document.createTextNode(child));
    }
    return element;
}

module.exports = {
    prompt,
};