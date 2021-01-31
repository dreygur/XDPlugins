const reactShim = require("./react-shim");
const React = require("react");
const ReactDOM = require("react-dom");
const UIDialog = require("./UIDialog.jsx");
const MessageDialog = require("./components/MessageDialog.jsx");
const AboutDialog = require("./components/AboutDialog.jsx");
var enableRun = [true, true];
var isPolicyAccepted = false;
const { confirm } = require("../lib/dialogs.js");
const { LOCALE_MAP_REVERSE, LOCALE_MAPPING_ADOBE_IO, allLangList, LANG_MAP } = require('./Constants/constants');
const { appLanguage } = require("application");
const Strings = require('./Dictionaries/'+appLanguage+'.json');
const englishStrings = require('./Dictionaries/en.json');


let application = require("application");
var commands = require("commands");
var { Artboard, Text } = require("scenegraph");
const fs = require("uxp").storage.localFileSystem;
var apiKeys = ["", "", ""];
var dialogWorldReady;
var dialogFirst = false;
var count = 0;
var isUxp3 = false;

function getDialog(dialog, selection, root, allLangList, allLangListState) {
    if (dialog == null) {
        var buildNo = Number(application.version.split(".")[0]);
        if(buildNo>20){
            isUxp3 = true;
        }
        dialog = document.createElement("dialog");
        dialog.style.paddingBottom = "10px";
        dialogFirst = true;
        ReactDOM.render(<UIDialog dialog={dialog} selection={selection} root={root} allLangList={allLangList} allLangListState={allLangListState} isUxp3={isUxp3} />, dialog);
    } else {
        dialogFirst = false;
    }
    return dialog;
}


//** ERROR DIALOG */
function createMsgDialog(title, msg) {
    const dialog = document.createElement("dialog");
    ReactDOM.render(<MessageDialog dialog={dialog} title={title} msg={msg} />, dialog);
    return dialog;
}





/** Show Error, Warning or other messages through a dialog */
async function showMsgDialog(title, msg) {
    var msgDialog = createMsgDialog(title, msg);
    try {
        await document.body.appendChild(msgDialog).showModal();
    } catch (err) {
        // cancelled with ESC
    } finally {
        msgDialog.remove();
    }
}



async function showMaindialog(dialog, selection, root, detectedSourceLang) {
    try {
        let appendedDialog = document.body.appendChild(dialog);
        if (!document.getElementById("modeOptions").value)
            document.getElementById("modeOptions").value = englishStrings.DEFAULT_TRANSLATOR;
        let i, j;
        for (i = 0; i < root.children.length; i++) {
            let artboard = root.children.at(i);
            if (artboard.name.includes('World Ready')) {
                document.getElementById("undoButton").style.display = "block";
                break;
            }
            for (j = 0; j < artboard.children.length; j++) {
                let child = artboard.children.at(j);
                if (child.name.includes('World Ready')) {
                    document.getElementById("undoButton").style.display = "block";
                    break;
                }
            }
            if (j < artboard.children.length) {
                break;
            }
        }
        if (i == root.children.length) {
            document.getElementById("undoButton").style.display = "none";
        }
        
        // For subsequent dialogs uncheck the target lang which source detected lang
        if(LOCALE_MAPPING_ADOBE_IO[detectedSourceLang]){
            document.getElementById(LOCALE_MAPPING_ADOBE_IO[detectedSourceLang]).checked = false;
        }
        var anyLangSelected = false;
        for(var indxx = 1; indxx < allLangList.length; indxx++) {
            anyLangSelected = document.getElementById(LOCALE_MAPPING_ADOBE_IO[allLangList[indxx]]).checked;
            if(anyLangSelected){
                break;
            }
        }

        if(anyLangSelected != true){
            if(detectedSourceLang == "English"){
                document.getElementById("de_DE").checked = true;
            } else {
                document.getElementById("en_US").checked = true;
            }
            document.getElementById("runButton").disabled = false;
        }

        //Select the detectedLang
        document.getElementById("sourceLanguage").value = LANG_MAP[detectedSourceLang];
        const r = await appendedDialog.showModal();
        return r;

    } catch (err) {
        // cancelled with ESC
    } finally {

        // dialog.remove();
    }
}

/**
 * 
 * Plugin flow starts here!!
 */
async function updatePolicyAcceptance() {
    const pluginDataFolder = await fs.getDataFolder();
    const entries = await pluginDataFolder.getEntries();
    let i = 0;
    for (i = 0; i < entries.length; i++) {
        if (entries[i].name == "analytics.json") {
            break;
        }
    }
    if (i < entries.length) {
        let contents = await entries[i].read();
        if (contents) {
            try {
                contents = JSON.parse(contents);
                if ('Accept' in contents)
                    isPolicyAccepted = contents['Accept'];
            } catch (e) {
                isPolicyAccepted = false;
            }

        }

    }
}

function makeStringForDetection(node, detectString) {
    if(count >= 5){
        return detectString;
    }
    if(node instanceof Text && node.text) {
        detectString = detectString + " " + node.text;
        count = count + 1;
    }
    if(node.children.length > 0) {
        node.children.forEach(function(childNode, i) {
            detectString = makeStringForDetection(childNode, detectString);
        });
    }
    return detectString;
}

async function startPluginWorkflow(selection, root) {
    if (selection.items.length == 1 && selection.items[0] instanceof Artboard) {
        if (selection.items[0].name.includes('(World Ready)')) {
            await showMsgDialog(Strings.ERROR_LABEL, Strings.SOURCE_ARTBOARD_ERROR);
            return;
        }
        
        //Language detection here
        //For auto lang detect  fetch the detected lang using first 5 instances of text
        console.log(Strings.SOURCE_LANGUAGE_LABEL);
        let detectedSourceLang = Strings.SOURCE_LANGUAGE_LABEL;
        count = 0;
        let detectStr = makeStringForDetection(selection.items[0], "");
        var res = "";
        try{
            res = await makeLangDetectRequest(detectStr);
        } catch(e) {
            console.log("exception in lang detect");
            console.log(res);
            res = "";
        }
        //TODO Check here if the detected lang is there in the LOCALE_MAP_REVERSE
        if(res){
            let langDetected = LOCALE_MAP_REVERSE[res];
            if(langDetected){
                detectedSourceLang = langDetected;
            }
        }
        let allLangListState = allLangList.map(lang => {return {value: LANG_MAP[lang], display: LANG_MAP[lang]}});
        // draw Main dialogue and after dialog close run the Network I/O
        dialogWorldReady = getDialog(dialogWorldReady, selection, root, allLangList, allLangListState);
        return showMaindialog(dialogWorldReady, selection, root, detectedSourceLang);
    }
    else {
        await showMsgDialog(Strings.SELECTION_MESSAGE, Strings.ARTBOARD_SELECTOPN_MESSAGE);
        return new Promise((resolve, reject) => { resolve("true") });
    }
}

function makeLangDetectRequest(detectStr){

    let apiurl = "https://mt.adobe.io/api/v2/translate/";

    var content = JSON.stringify({
        "to": "en_US",
        "str": [detectStr],
        "contentType": "UGC",
        "domain": "dme",
        "engines": ["Bing"]
    });


    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', apiurl, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Accept', 'application/json, text/plain, */*');
        xhr.setRequestHeader("x-api-key", "xd_amber_prod");
        xhr.timeout = 2000;
        xhr.onload = function () {
            if (this.status == 200) {
                let res = JSON.parse(xhr.response);
                if ("code" in res) {
                    reject("");
                } else {
                    let langDetected = res["Bing"][0]["from"];
                    resolve(langDetected);
                }
            } else {
                reject("");
            }
        };
        xhr.onerror = function () {
            reject("");
        };
        xhr.ontimeout = function () {
            reject("");
        };
        xhr.send(content);
    });

}
async function aboutPlugin(selection, root) {
    var msg = Strings.ABOUT_SUMMARY;
    
    const dialog = document.createElement("dialog");
    ReactDOM.render(<AboutDialog dialog={dialog} title="World Ready" msg={msg} />, dialog);
    
    
    try {
        const r = await document.body.appendChild(dialog);
        let d = document.getElementById("content");
        d.innerHTML = msg;
        await r.showModal();
    } catch (err) {
        // cancelled with ESC
    } finally {
        dialog.remove();
    }
    
}

async function  WorldReadyMain(selection, root) {
    console.log(appLanguage);
    await updatePolicyAcceptance();
    if (isPolicyAccepted != true) {
        const feedback = await confirm("World Ready",
            "<b>"+Strings.ANALYTICS_HEADER+"</b>"+Strings.ANALYTICS_MESSAGE,
            [Strings.CANCEL_BUTTON, Strings.ACCEPT_BUTTON]);
        switch (feedback.which) {
            case 0:
                break;
            case 1:
                isPolicyAccepted = true;
                const pluginDataFolder = await fs.getDataFolder();
                let newFile = await pluginDataFolder.createEntry("analytics.json", { overwrite: true });
                let allKeys = { "Accept": isPolicyAccepted };
                await newFile.write(JSON.stringify(allKeys));
                return startPluginWorkflow(selection, root);
        }
    } else {
        return startPluginWorkflow(selection, root);
    }

}



module.exports = {
    commands: {
        WorldReadyMain: WorldReadyMain,
        aboutPlugin: aboutPlugin
    }
};


//  temporary stubs required for React. These will not be required as soon as the XD environment provides setTimeout/clearTimeout
global.setTimeout = function (fn) { fn() }
global.clearTimeout = function () { };



