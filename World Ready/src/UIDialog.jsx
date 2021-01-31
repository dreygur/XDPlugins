const React = require('react');
const ReactDOM = require("react-dom");
const styles = require('./UIDialog.css');
const Header = require('./components/Header.jsx');
const HookKey = require('./components/HookKey.jsx');
const Mode = require('./components/Mode.jsx');
const Langs = require('./components/Langs.jsx');
const Footer = require('./components/Footer.jsx');
const MessageDialog = require('./components/MessageDialog.jsx');
const Loader = require('./components/Loader.jsx');
var commands = require("commands");
const { appLanguage } = require("application");
const Strings = require('./Dictionaries/'+appLanguage+'.json');
var { Group, Rectangle, Text, Color, Artboard, SymbolInstance, RepeatGrid } = require("scenegraph");
const fs = require("uxp").storage.localFileSystem;
const { HOOK_LIST, MODE_LIST, REQUEST_STRING_LIMIT, LOCALE_MAPPING, LOCALE_MAP_REVERSE, LOCALE_MAPPING_ADOBE_IO, LANG_MAP_REVERSE } = require('./Constants/constants');
var enableRun = [true, true];
var currentSelectedLocale;
var supportedLanguagesCheck = {};
var langList = [];
var loading = false;

var allTextArray = [];
var amberOverlaysArray = [];
var coreStringTranslationsMap = {};
var maxWidthTranslationTextBox = {};

var apiKeyForSelectedHook = "";
var guidCoreStringMap = {};


var multipleRequests = [];
var hierarchyTree = {};
var groupNames = {};
var isGroupMasked = {};
var isGroupVisible = {};
var localizedArtboard = [];
var needUngrouping = {};
var reqStrings = [];


var selectedSourceLang = "";

var showWarningforSomeTranslationsError = false;
var showWarningForSymbInstGroups = false;

var analyticsJSON = {};
var sessionID = "";


class UIDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            currentSelectedHook: HOOK_LIST[0],
            currentSelectedMode: MODE_LIST[1],
            selection: props.selection,
            allLangList: props.allLangList,
            allLangListState: props.allLangListState,
            apiKeys: ["", "", ""],
            loading: false
        };
        this.onTranslationHookChanged = this.onTranslationHookChanged.bind(this);
        this.mapKeyWithHook = this.mapKeyWithHook.bind(this);
        this.onModeSelected = this.onModeSelected.bind(this);
        this.changeAvailableLangList = this.changeAvailableLangList.bind(this);
        this.runSelectedMode = this.runSelectedMode.bind(this);
        this.onLoaderClick = this.onLoaderClick.bind(this);
    }

    async componentDidMount() {
        var { selection } = this.props;
        //Get Session ID
        this.getApiKeys();
        if (sessionID == undefined) {
            sessionID = "";
        }
        analyticsJSON["sessionId"] = sessionID;
        if (sessionID == "") {
            let sessionUrl = "https://wra.adobe.io/amberanalytics/getNewSessionId?api_key=amber_ana_prd";
            var xhr = new XMLHttpRequest();
            xhr.open('GET', sessionUrl, true);
            xhr.onload = function () {

                if (this.status == 200) {
                    analyticsJSON["sessionId"] = xhr.response;
                    sessionID = xhr.response;
                } else {
                    let errorMsg = xhr.responseText;
                }
            };
            xhr.onerror = function () {
            };
            xhr.send(null);
        }
    }

    enableRunButton() {
        if (enableRun[0] == true && enableRun[1] == true) {
            document.getElementById("runButton").disabled = false;
        } else {
            document.getElementById("runButton").disabled = true;
        }
    }

    async getApiKeys() {
        const pluginDataFolder = await fs.getDataFolder();
        const entries = await pluginDataFolder.getEntries();
        let i = 0;
        for (i = 0; i < entries.length; i++) {
            if (entries[i].name == "apiKeys.json") {
                break;
            }
        }
        if (i < entries.length) {
            let contents = await entries[i].read();
            if (contents) {
                try {
                    contents = JSON.parse(contents);
                    this.setState((state) => ({
                        apiKeys: state.apiKeys.map((key, ind) => ind == 0 ? "" : key)
                    }));
                    // apiKeys[0] = "";
                    if ('Google' in contents)
                        this.setState((state) => ({
                            apiKeys: state.apiKeys.map((key, ind) => ind == 1 ? contents['Google'] : key)
                        }));
                    if ('Bing' in contents)
                        this.setState((state) => ({
                            apiKeys: state.apiKeys.map((key, ind) => ind == 2 ? contents['Bing'] : key)
                        }));
                    if ('sessionId' in contents)
                        sessionID = contents['sessionId'];

                } catch (e) {
                    this.setState((state) => ({
                        apiKeys: state.apiKeys.map((key) => '')
                    }));
                }
            }

        }
    }

    /** UI Callbacks and Utils */
    mapKeyWithHook(val) {
        if (val && val.trim() != "") {
            enableRun[0] = true;
        } else {
            enableRun[0] = false;
        }
        if (this.state.currentSelectedHook == HOOK_LIST[0]) {
            this.setState((state) => ({
                apiKeys: state.apiKeys.map((key, ind) => ind == 0 ? val.trim() : key)
            }));
        } else if (this.state.currentSelectedHook == HOOK_LIST[1]) {
            this.setState((state) => ({
                apiKeys: state.apiKeys.map((key, ind) => ind == 1 ? val.trim() : key)
            }));
        } else if (this.state.currentSelectedHook == HOOK_LIST[2]) {
            this.setState((state) => ({
                apiKeys: state.apiKeys.map((key, ind) => ind == 2 ? val.trim() : key)
            }));
        }
        this.enableRunButton();
    }

    onTranslationHookChanged(index) {

        let id = HOOK_LIST[index].id;
        this.setState({
            currentSelectedHook: HOOK_LIST[index],
            currentIndex: index
        });
        enableRun[0] = true;
        if (id == "adb") {

            document.getElementById('modeOptions').options[1].selected = false;
            document.getElementById('modeOptions').options[2].selected = false;
            document.getElementById("apiKeyInput").value = this.state.apiKeys[0];
            document.getElementById("apiLabel").style.display = "none";
            document.getElementById("noteLabel").style.display = "flex";

        } else if (id == "goo") {
            document.getElementById('modeOptions').options[0].selected = false;
            document.getElementById('modeOptions').options[2].selected = false;
            document.getElementById("apiKeyInput").value = this.state.apiKeys[1];
            document.getElementById("noteLabel").style.display = "none";
            document.getElementById("apiLabel").style.display = "block";
            document.getElementById("googleLogo").style.display = "block";
            document.getElementById("microLogo").style.display = "none";
            document.getElementById("apiLink").href = "https://cloud.google.com/translate/";
            if (this.state.apiKeys[1].trim() == "") {
                enableRun[0] = false;
            }

        } else if (id == "micro") {
            document.getElementById('modeOptions').options[0].selected = false;
            document.getElementById('modeOptions').options[1].selected = false;
            document.getElementById("apiKeyInput").value = this.state.apiKeys[2];
            document.getElementById("noteLabel").style.display = "none";
            document.getElementById("apiLabel").style.display = "block";
            document.getElementById("googleLogo").style.display = "none";
            document.getElementById("microLogo").style.display = "block";
            document.getElementById("apiLink").href = "https://azure.microsoft.com/en-in/services/cognitive-services/translator-text-api/";
            if (this.state.apiKeys[2].trim() == "") {
                enableRun[0] = false;
            }
        }
        this.enableRunButton();
    }


    onModeSelected(element) {
        let modeSelected = document.getElementById(element);
        if (element == "highMode") {
            this.onModeChanged(0);
            modeSelected.style.border = "2px solid #378EF0";
            let otherMode = document.getElementById("transMode");
            otherMode.style.border = "1px solid #DDDDDD";
            document.getElementById("runButton").textContent = Strings.HIGHLIGHT_LABEL;
        } else {
            this.onModeChanged(1);
            modeSelected.style.border = "2px solid #378EF0";
            let otherMode = document.getElementById("highMode");
            otherMode.style.border = "1px solid #DDDDDD";
            document.getElementById("runButton").textContent = Strings.TRANSLATE_LABEL;
        }
    }

    changeAvailableLangList(id, Lang, input) {
        let elem = document.getElementById(id);
        if (input == false) {
            elem.checked = !elem.checked;
        }
        
        enableRun[1] = false;
        for( var ind = 1; ind < this.state.allLangList.length; ind++) {
            if(document.getElementById(LOCALE_MAPPING_ADOBE_IO[this.state.allLangList[ind]]).checked == true){
                enableRun[1] = true;
                break;
            }
        }
        this.enableRunButton();
    }

    onModeChanged(index) {
        this.setState({
            currentSelectedMode: MODE_LIST[index]
        });

    }

    //** ERROR DIALOG */
    createMsgDialog(title, msg) {
        const dialog = document.createElement("dialog");
        ReactDOM.render(<MessageDialog dialog={dialog} title={title} msg={msg} />, dialog);
        return dialog;
    }


    /** Show Error, Warning or other messages through a dialog */
    async showMsgDialog(title, msg) {
        var msgDialog = this.createMsgDialog(title, msg);
        try {
            await document.body.appendChild(msgDialog).showModal();
        } catch (err) {
            // cancelled with ESC
        } finally {
            //msgDialog.remove();
        }
    }

    onLoaderClick() {

    }

    /** Pre processing before run modes */
    traverseThrough(artboard) {
        if (artboard instanceof Text) {
            allTextArray.push(artboard);
            guidCoreStringMap[artboard.guid] = artboard.text;
        }
        if (artboard.children.length > 0) {
            artboard.children.forEach((childNode, i) => {
                this.traverseThrough(childNode);
            });
        }
    }

    addRequest(reqStrings, indx) {
        multipleRequests.push(this.getTranslation(reqStrings, langList[indx]));
    }

    async fetchAndSaveTranslations(selection, root) {
        this.runRemoveMode(selection, root);
        allTextArray = [];
        langList = [];
        if (selection.items.length > 0 && (selection.items[0] instanceof Artboard)) {
            this.traverseThrough(selection.items[0]);
        }
        multipleRequests = [];

        if (this.state.currentSelectedMode.id == "draw" || this.state.currentSelectedMode.id == "replace") {

            for (var key in supportedLanguagesCheck) {
                if (supportedLanguagesCheck[key] == true) {
                    langList.push(key);
                }
            }
            analyticsJSON["locale"] = langList.join(",");
        }
        var curStringCount = 0, totalCount = allTextArray.length;;
        reqStrings = [];
        for (var indx = 0; indx < langList.length; indx++) {
            for (var i = 0; i < allTextArray.length; i++) {
                if (!(allTextArray[i].text in coreStringTranslationsMap) || !(this.state.currentSelectedHook.id in coreStringTranslationsMap[allTextArray[i].text]) || !(langList[indx] in coreStringTranslationsMap[allTextArray[i].text][this.state.currentSelectedHook.id]) || allTextArray[i].text == coreStringTranslationsMap[allTextArray[i].text][this.state.currentSelectedHook.id][langList[indx]]) {
                    curStringCount = curStringCount + 1;
                    reqStrings.push(allTextArray[i].text);
                    if (curStringCount == REQUEST_STRING_LIMIT) {
                        this.addRequest(reqStrings, indx);
                        curStringCount = 0;
                        reqStrings = [];
                    }
                }
            }
            if (reqStrings.length > 0) {
                this.addRequest(reqStrings, indx);
                curStringCount = 0;
                reqStrings = [];
            }
        }
        analyticsJSON["stringCount"] = totalCount;
        analyticsJSON["engineType"] = this.state.currentSelectedHook.name.substring(0, this.state.currentSelectedHook.name.indexOf(' ')).toLowerCase();
        var i, j;
        var _self = this;
        return Promise.all(multipleRequests).then(async function (responses) {
            var truncationCount = 0;

            if (_self.state.currentSelectedMode.id == "draw") {
                var truncatedStringsLangList = {};
                var fontStringsInfo = {};

                for (i = 0; i < allTextArray.length; i++) {
                    maxWidthTranslationTextBox[allTextArray[i].text] = {};
                    maxWidthTranslationTextBox[allTextArray[i].text][_self.state.currentSelectedHook.id] = new Text();
                    maxWidthTranslationTextBox[allTextArray[i].text][_self.state.currentSelectedHook.id].text = allTextArray[i].text;
                    maxWidthTranslationTextBox[allTextArray[i].text][_self.state.currentSelectedHook.id].styleRanges = allTextArray[i].styleRanges;
                    var maxWidth = maxWidthTranslationTextBox[allTextArray[i].text][_self.state.currentSelectedHook.id].localBounds.width;
                    var maxWidthText = maxWidthTranslationTextBox[allTextArray[i].text][_self.state.currentSelectedHook.id].text;

                    var truncatedLangs = "";
                    for (j = 0; j < langList.length; j++) {
                        maxWidthTranslationTextBox[allTextArray[i].text][_self.state.currentSelectedHook.id].text = coreStringTranslationsMap[allTextArray[i].text][_self.state.currentSelectedHook.id][langList[j]];
                        if (maxWidthTranslationTextBox[allTextArray[i].text][_self.state.currentSelectedHook.id].localBounds.width > allTextArray[i].localBounds.width && _self.state.currentSelectedMode.id == "draw") {
                            if (truncatedLangs.length > 0) {
                                truncatedLangs += ",";
                            }
                            truncatedLangs += langList[j];
                        }
                        if (maxWidth > maxWidthTranslationTextBox[allTextArray[i].text][_self.state.currentSelectedHook.id].localBounds.width) {
                            maxWidthTranslationTextBox[allTextArray[i].text][_self.state.currentSelectedHook.id].text = maxWidthText;
                        } else {
                            maxWidthText = maxWidthTranslationTextBox[allTextArray[i].text][_self.state.currentSelectedHook.id].text;
                            maxWidth = maxWidthTranslationTextBox[allTextArray[i].text][_self.state.currentSelectedHook.id].localBounds.width;
                        }

                    }
                    if (truncatedLangs != "") {
                        truncationCount++;
                    }
                    truncatedStringsLangList[allTextArray[i].text] = truncatedLangs;
                    if (allTextArray[i].text in fontStringsInfo) {
                        fontStringsInfo[allTextArray[i].text] = fontStringsInfo[allTextArray[i].text] + ", " + allTextArray[i].styleRanges[0].fontFamily;
                    } else {
                        fontStringsInfo[allTextArray[i].text] = allTextArray[i].styleRanges[0].fontFamily;
                    }
                    analyticsJSON["truncationInfo"] = truncatedStringsLangList;
                    analyticsJSON["fontInfo"] = fontStringsInfo;

                }
            }

            function makeRequest(method, url) {

                return new Promise(function (resolve, reject) {
                    let xhr = new XMLHttpRequest();
                    xhr.open(method, userTypeUrl, true);
                    xhr.onload = function () {
                        if (this.status == 200) {
                            if (xhr.response == "true") {

                                analyticsJSON["originType"] = "internal";
                            } else {
                                analyticsJSON["originType"] = "external";
                            }

                        }
                        resolve(xhr.response);
                    };
                    xhr.onerror = function () {
                        reject(xhr.responseText);

                    };
                    xhr.send(null);

                });

            }
            analyticsJSON["truncationCount"] = truncationCount;
            let userTypeUrl = "https://wra.adobe.io/amberanalytics/isUserInternal?api_key=amber_ana_prd";
            let result = await makeRequest("GET", userTypeUrl);
            let apiurl = "https://wra.adobe.io/amberanalytics/anaEntry?api_key=amber_ana_prd";
            var xhr = new XMLHttpRequest();
            xhr.open('POST', apiurl, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Accept', 'application/json, text/plain, */*');
            xhr.onload = function () {

                if (this.status == 200) {

                    let res = JSON.parse(xhr.response);
                } else {
                    let errorMsg = JSON.parse(xhr.responseText);
                }
            };
            xhr.onerror = function () {
            };
            xhr.send(JSON.stringify(analyticsJSON));

        }).catch(function (err) {
            throw err;
        });
    }



    getTranslation(reqStrings, lang) {
        let sourceLangSelected = document.getElementById("sourceLanguage");
        var addFromParam = false;
        if (sourceLangSelected.value != Strings.SOURCE_LANGUAGE_LABEL) {
            //need to set from param in translate api
            addFromParam = true;
        }
        var _self = this;
        if (this.state.currentSelectedHook.id == "goo") {
            var sourceStrings = [];
            for (let i = 0; i < reqStrings.length; i++) {
                sourceStrings.push(reqStrings[i].replace(/\n/g, "<br>"));
            }
            if (apiKeyForSelectedHook == "") {
                return;
            }
            const apiKey = apiKeyForSelectedHook;
            let apiurl = "https://translation.googleapis.com/language/translate/v2?key=";
            apiurl += apiKey;
            let content = JSON.stringify({
                'q': sourceStrings,
                'target': LOCALE_MAPPING[lang].substring(0, 2),
            });
            return new Promise((resolve, reject) => {
                var xhr = new XMLHttpRequest();
                xhr.open('POST', apiurl, true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Accept', 'application/json, text/plain, */*');
                xhr.timeout = 10000;
                xhr.onload = function () {
                    function isUpperCase(str) {
                        return str === str.toUpperCase();
                    }

                    if (this.status == 200) {
                        let res = JSON.parse(xhr.response);
                        for (let i = 0; i < reqStrings.length; i++) {
                            if (!(reqStrings[i] in coreStringTranslationsMap)) {
                                coreStringTranslationsMap[reqStrings[i]] = {};
                            }
                            if (!(_self.state.currentSelectedHook.id in coreStringTranslationsMap[reqStrings[i]])) {
                                coreStringTranslationsMap[reqStrings[i]][_self.state.currentSelectedHook.id] = {};
                            }
                            let transText = res.data.translations[i].translatedText.replace(/<br>/g, "\n");
                            if (transText != null && transText != undefined && transText != "") {
                                if (isUpperCase(reqStrings[i])) {
                                    coreStringTranslationsMap[reqStrings[i]][_self.state.currentSelectedHook.id][lang] = transText.toUpperCase();
                                    if (reqStrings[i].length == 1 && reqStrings[i][0] >= 'A' && reqStrings[i][0] <= 'Z') {
                                        coreStringTranslationsMap[reqStrings[i]][_self.state.currentSelectedHook.id][lang] = reqStrings[i];
                                    }
                                } else {
                                    coreStringTranslationsMap[reqStrings[i]][_self.state.currentSelectedHook.id][lang] = transText;
                                    if (reqStrings[i].length == 1 && reqStrings[i][0] >= 'a' && reqStrings[i][0] <= 'z') {
                                        coreStringTranslationsMap[reqStrings[i]][_self.state.currentSelectedHook.id][lang] = reqStrings[i];
                                    }
                                }
                            } else {
                                coreStringTranslationsMap[reqStrings[i]][_self.state.currentSelectedHook.id][lang] = reqStrings[i];
                            }
                        }
                        resolve(res);
                    } else {
                        let errorMsg = JSON.parse(xhr.responseText);
                        reject(errorMsg.error.message);
                    }
                };
                xhr.onerror = function () {
                    reject(Strings.GENERIC_ERROR);
                };
                xhr.ontimeout = function () {
                    reject(Strings.TIMEOUT_ERROR);
                };
                xhr.send(content);
            });
        } else if (_self.state.currentSelectedHook.id == "micro") {
            if (apiKeyForSelectedHook == "") {
                return;
            }
            var sourceStrings = [];
            for (let i = 0; i < reqStrings.length; i++) {
                sourceStrings.push(reqStrings[i].replace(/\n/g, "<br>"));
            }
            const apiKey = apiKeyForSelectedHook;
            let apiurl = "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0";
            var params = "";
            if (addFromParam) {
                params = params + "&from=" + LOCALE_MAPPING[this.selectedSourceLang];
            }
            params = params + "&to=" + LOCALE_MAPPING[lang].substring(0, 2);
            params = params + "&textType=html";
            apiurl += params;
            let content = [];
            for (let i = 0; i < sourceStrings.length; i++) {
                content.push({ 'Text': sourceStrings[i] });
            }
            content = JSON.stringify(content);
            return new Promise((resolve, reject) => {
                var xhr = new XMLHttpRequest();
                xhr.open('POST', apiurl, true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Accept', 'application/json, text/plain, */*');
                xhr.setRequestHeader('Ocp-Apim-Subscription-Key', apiKey);
                xhr.timeout = 10000;
                xhr.onload = function () {
                    function isUpperCase(str) {
                        return str === str.toUpperCase();
                    }
                    if (this.status == 200) {
                        let res = JSON.parse(xhr.response);
                        for (let i = 0; i < reqStrings.length; i++) {
                            if (!(reqStrings[i] in coreStringTranslationsMap)) {
                                coreStringTranslationsMap[reqStrings[i]] = {};
                            }
                            if (!(_self.state.currentSelectedHook.id in coreStringTranslationsMap[reqStrings[i]])) {
                                coreStringTranslationsMap[reqStrings[i]][_self.state.currentSelectedHook.id] = {};
                            }
                            let transText = res[i].translations[0].text.replace(/<br>/g, "\n");
                            if (transText != null && transText != undefined && transText != "") {
                                if (isUpperCase(reqStrings[i])) {
                                    coreStringTranslationsMap[reqStrings[i]][_self.state.currentSelectedHook.id][lang] = transText.toUpperCase();
                                    if (reqStrings[i].length == 1 && reqStrings[i][0] >= 'A' && reqStrings[i][0] <= 'Z') {
                                        coreStringTranslationsMap[reqStrings[i]][_self.state.currentSelectedHook.id][lang] = reqStrings[i];
                                    }
                                } else {
                                    coreStringTranslationsMap[reqStrings[i]][_self.state.currentSelectedHook.id][lang] = transText;
                                    if (reqStrings[i].length == 1 && reqStrings[i][0] >= 'a' && reqStrings[i][0] <= 'z') {
                                        coreStringTranslationsMap[reqStrings[i]][_self.state.currentSelectedHook.id][lang] = reqStrings[i];
                                    }
                                }
                            } else {
                                coreStringTranslationsMap[reqStrings[i]][_self.state.currentSelectedHook.id][lang] = reqStrings[i];
                            }
                        }
                        resolve(res);
                    } else {
                        let errorMsg = JSON.parse(xhr.responseText);
                        reject(errorMsg.error.message);
                    }
                };
                xhr.onerror = function () {
                    reject(Strings.GENERIC_ERROR);
                };
                xhr.ontimeout = function () {
                    reject(Strings.TIMEOUT_ERROR);
                };
                xhr.send(content);
            });
        } else if (_self.state.currentSelectedHook.id == "adb") {
            var sourceStrings = [];
            for (let i = 0; i < reqStrings.length; i++) {
                sourceStrings.push(reqStrings[i].replace(/\n/g, "<br>"));
            }
            let apiurl = "https://mt.adobe.io/api/v2/translate/";
            if (addFromParam) {
                var content = JSON.stringify({
                    "from": LOCALE_MAPPING_ADOBE_IO[this.selectedSourceLang],
                    "to": LOCALE_MAPPING_ADOBE_IO[lang],
                    "textType": "html",
                    "str": sourceStrings,
                    "contentType": "UGC",
                    "domain": "dme",
                    "engines": ["Bing"]
                });
            } else {
                var content = JSON.stringify({
                    "to": LOCALE_MAPPING_ADOBE_IO[lang],
                    "str": sourceStrings,
                    "contentType": "UGC",
                    "domain": "dme",
                    "engines": ["Bing"]
                });
            }

            return new Promise((resolve, reject) => {
                var xhr = new XMLHttpRequest();
                xhr.open('POST', apiurl, true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Accept', 'application/json, text/plain, */*');
                xhr.setRequestHeader("x-api-key", "xd_amber_prod");
                xhr.timeout = 10000;
                xhr.onload = function () {
                    function isUpperCase(str) {
                        return str === str.toUpperCase();
                    }
                    if (this.status == 200) {
                        let res = JSON.parse(xhr.response);
                        if ("code" in res) {
                            reject(res.msg);
                        } else {
                            for (let i = 0; i < res["Bing"].length; i++) {
                                var sourceText = res["Bing"][i]["originalText"].replace(/<br>/g, "\n");
                                if (!(sourceText in coreStringTranslationsMap)) {
                                    coreStringTranslationsMap[sourceText] = {};
                                }
                                if (!(_self.state.currentSelectedHook.id in coreStringTranslationsMap[sourceText])) {
                                    coreStringTranslationsMap[sourceText][_self.state.currentSelectedHook.id] = {};
                                }
                                let transText = res["Bing"][i]["translatedText"].replace(/<br>/g, "\n");

                                if (transText != null && transText != undefined && transText != "") {
                                    if (isUpperCase(reqStrings[i])) {
                                        coreStringTranslationsMap[sourceText][_self.state.currentSelectedHook.id][lang] = transText.toUpperCase();
                                        if (sourceText.length == 1 && sourceText[0] >= 'A' && sourceText[0] <= 'Z') {
                                            coreStringTranslationsMap[sourceText][_self.state.currentSelectedHook.id][lang] = sourceText;
                                        }
                                    } else {
                                        coreStringTranslationsMap[sourceText][_self.state.currentSelectedHook.id][lang] = transText;
                                        if (sourceText.length == 1 && sourceText[0] >= 'a' && reqStrings[i][0] <= 'z') {
                                            coreStringTranslationsMap[sourceText][_self.state.currentSelectedHook.id][lang] = sourceText;
                                        }
                                    }
                                } else {
                                    coreStringTranslationsMap[sourceText][_self.state.currentSelectedHook.id][lang] = sourceText;
                                }
                            }
                            resolve(res);
                        }
                    } else {
                        let errorMsg = JSON.parse(xhr.responseText);
                        if ("code" in errorMsg) {
                            reject(errorMsg.msg);
                        } else if ("error_code" in errorMsg) {
                            reject(errorMsg.message);
                        }
                        reject(Strings.GENERIC_ERROR);
                    }
                };
                xhr.onerror = function () {
                    reject(Strings.GENERIC_ERROR);
                };
                xhr.ontimeout = function () {
                    reject(Strings.PLUGIN_TIMEOUT);
                };
                xhr.send(content);
            });
        }
    }

    /** Util Functions for running different modes(Remove, Draw, Replace) */

    isUpperCase(str) {
        return str === str.toUpperCase();
    }

    traverseToRemoveGroup(node) {
        if (node instanceof Artboard) {
            if (node.children.length > 0) {
                node.children.forEach(function (childNode, i) {
                    if (childNode.name == 'World Ready Group') {
                        amberOverlaysArray.push(childNode);
                    }

                });
            }
        }
        else if (node.children.length > 0) {
            node.children.forEach((childNode, i) => {
                this.traverseToRemoveGroup(childNode);
            });
        }
    }

    traverseAndTranslate(node, selection) {
        if (node instanceof Artboard && node.children.length > 0) {
            node.children.forEach((childNode, i) => {
                this.traverseAndTranslate(childNode, selection);
            });
        }
        else if (node.children.length > 0) {
            node.locked = false;
            if (needUngrouping[node.guid] == true) {
                selection.items = [node];
                commands.ungroup();
                var selectionList = selection.itemsIncludingLocked;
                for (let i = 0; i < selectionList.length; i++) {
                    if (selectionList[i].children && selectionList[i].children.length > 0) {
                        this.traverseAndTranslate(selectionList[i], selection);
                    }
                    else if (selectionList[i] instanceof Text) {
                        selectionList[i].locked = false;
                        selectionList[i].text = coreStringTranslationsMap[selectionList[i].text][this.state.currentSelectedHook.id][currentSelectedLocale];
                    } else {
                        selectionList[i].locked = false;
                    }
                }
            }
        }
        else if (node instanceof Text) {
            node.locked = false;
            node.text = coreStringTranslationsMap[node.text][this.state.currentSelectedHook.id][currentSelectedLocale];
        } else {
            if (!(node instanceof Artboard)) {
                node.locked = false;
            }

        }
    }

    traverseToStoreHierarchy(artboard) {
        if (artboard.children.length > 0) {
            var need = false;
            let childArray = [];
            artboard.children.forEach(function (childNode, i) {
                childArray.push(childNode);
            });
            artboard.children.forEach((childNode, i) => {
                if (this.traverseToStoreHierarchy(childNode) == true) {
                    need = true;
                }
            });
            needUngrouping[artboard.guid] = need;
            if (need == true || artboard instanceof Artboard) {
                hierarchyTree[artboard.guid] = childArray;
                groupNames[artboard.guid] = artboard.name;
                if (!(artboard instanceof Artboard)) {
                    if (artboard instanceof SymbolInstance || artboard instanceof RepeatGrid) {
                        showWarningForSymbInstGroups = true;
                    }
                    isGroupMasked[artboard.guid] = artboard.mask;
                    isGroupVisible[artboard.guid] = artboard.visible;
                }
            }
            return need;
        } else if (artboard instanceof Text) {
            return true;
        } else {
            return false;
        }
    }

    traverseToReformHierarchy(guid, selection) {
        if (guid in hierarchyTree) {
            var childNodesArray = hierarchyTree[guid];
            if (localizedArtboard.guid == guid) {
                if (childNodesArray.length > 0) {
                    for (let i = 0; i < childNodesArray.length; i++) {
                        this.traverseToReformHierarchy(childNodesArray[i].guid, selection);
                    }
                }
            } else {
                if (childNodesArray.length > 0) {
                    var toSelect = [];
                    for (let i = 0; i < childNodesArray.length; i++) {
                        var node = this.traverseToReformHierarchy(childNodesArray[i].guid, selection);
                        toSelect.push(node);
                    }
                    selection.items = toSelect;
                    if (isGroupMasked[guid]) {
                        commands.createMaskGroup();
                    } else {
                        commands.group();
                    }
                    selection.items[0].name = groupNames[guid];
                    selection.items[0].visible = isGroupVisible[guid];
                    return selection.items[0];
                }
            }
        } else {
            var artboard;
            for (let i = 0; i < localizedArtboard.children.length; i++) {
                let childNode = localizedArtboard.children.at(i);
                if (childNode.guid == guid) {
                    artboard = childNode;
                    break;
                }
            }
            return artboard;
        }
    }

    /** Run Modes functions (Remove, Draw, Replace) */

    async runDrawModeNow(selection, root) {

        if (showWarningforSomeTranslationsError) {
            await this.showMsgDialog(Strings.WARNING_LABEL, Strings.UNTRANSLATED_STRINGS_WARNING);
        }
        this.runDrawHighlightsMode(root, selection);
        if (amberOverlaysArray.length > 0) {
            var selectedItems = selection.items;
            selection.items = amberOverlaysArray;
            commands.group();
            amberOverlaysArray = [];
            amberOverlaysArray.push(selection.items[0]);
            selection.items[0].name = "World Ready Group";
            selection.items = selectedItems;
        }
        if (amberOverlaysArray.length < 1) {
            // Success Case
            await this.showMsgDialog(Strings.SUCCESS_LABEL, Strings.WORLD_READY_SUCCESS_MESSAGE);
        }
    }

    async runReplaceModeNow(selection, root) {
        if (showWarningforSomeTranslationsError) {
            await this.showMsgDialog(Strings.WARNING_LABEL, Strings.UNTRANSLATED_STRINGS_WARNING);
        }
        this.runReplaceMode(selection, root);
        if (showWarningForSymbInstGroups) {
            await this.showMsgDialog(Strings.WARNING_LABEL, Strings.NO_REPEAT_GRID_SUPPORT_WARNING);
        }
    }

    async rejectedPromise(err) {
        await this.showMsgDialog(Strings.ERROR_LABEL, err);
    }

    async runSelectedMode(dialog, undoSelected) {
        var { selection } = this.props;
        var { root } = this.props;
        this.selectedSourceLang = document.getElementById("sourceLanguage").value;
        if(this.selectedSourceLang != Strings.SOURCE_LANGUAGE_LABEL) {
            this.selectedSourceLang = LANG_MAP_REVERSE[this.selectedSourceLang];
        }
        if (undoSelected == false) {
            apiKeyForSelectedHook = "";
            if (this.state.currentSelectedHook.id != "adb") {
                apiKeyForSelectedHook = document.getElementById("apiKeyInput").value;
                if (apiKeyForSelectedHook.trim() == "") {
                    enableRun[0] = false;
                }
            }
            this.enableRunButton();
        };

        if (document.getElementById("runButton").disabled == false || undoSelected == true) {
            // dialog.close(true);
            const pluginDataFolder = await fs.getDataFolder();
            let newFile = await pluginDataFolder.createEntry("apiKeys.json", { overwrite: true });
            let allKeys = { "Adobe": this.state.apiKeys[0], "Google": this.state.apiKeys[1], "Bing": this.state.apiKeys[2], "sessionId": sessionID };
            await newFile.write(JSON.stringify(allKeys));
        }
        this.setState({
            loading: true
        })


        for( var ind = 1; ind < this.state.allLangList.length; ind++) {
            var langSelected = document.getElementById(LOCALE_MAPPING_ADOBE_IO[this.state.allLangList[ind]]).checked;
            supportedLanguagesCheck[this.state.allLangList[ind]] = langSelected;
        }


        if (undoSelected == true) {
            root.children.forEach(function (childNode, i) {

                if (childNode.name.includes('(World Ready)')) {
                    amberOverlaysArray.push(childNode);
                }
            });
            this.setState({ loading: false });
            return this.runRemoveMode(selection, root);
        } else if (this.state.currentSelectedMode.id == "draw") {
            analyticsJSON["modeType"] = "highlight";
            return this.fetchAndSaveTranslations(this.state.selection, this.props.root).then((value) => { this.runDrawModeNow(this.state.selection, this.props.root); this.setState({ loading: false }); dialog.close(); }).catch((err) => { this.setState({ loading: false }); dialog.close(); this.rejectedPromise(err) });
        } else if (this.state.currentSelectedMode.id == "replace") {
            analyticsJSON["modeType"] = "translate";
            return this.fetchAndSaveTranslations(this.state.selection, this.props.root).then((value) => { this.runReplaceModeNow(this.state.selection, this.props.root); this.setState({ loading: false }); dialog.close(); }).catch((err) => { this.setState({ loading: false }); dialog.close(); this.rejectedPromise(err) });
        }

    }

    /**
     * 
     * Remove the rect bounds drawn. Other way is to undo the plugin action (ctrl + Z) 
     */
    runRemoveMode(selection, root) {

        var prevSelectedArtboard = selection.items;
        this.traverseToRemoveGroup(root);
        if (amberOverlaysArray.length > 0) {
            for (let i = 0; i < amberOverlaysArray.length; i++) {
                if (amberOverlaysArray[i].parent != null) {
                    selection.items = amberOverlaysArray[i];
                    commands.ungroup();
                    var toDelete = selection.items;
                    for (let j = 0; j < toDelete.length; j++) {
                        toDelete[j].removeFromParent();
                    }
                }
            }

        }
        selection.items = prevSelectedArtboard;
        amberOverlaysArray = [];
        return new Promise((resolve, reject) => { resolve("true") });
    }


    /**
     * 
     * Draw the Red Highlights over the text elements to indicate user space taken by the longest translation 
     */
    runDrawHighlightsMode(root, selection) {
        for (var i = 0; i < allTextArray.length; i++) {
            var maxWidthText = new Text();

            maxWidthText.styleRanges = allTextArray[i].styleRanges;
            maxWidthText.fontFamily = allTextArray[i].fontFamily;
            maxWidthText.fontStyle = allTextArray[i].fontStyle;
            maxWidthText.fontSize = allTextArray[i].fontSize;
            maxWidthText.fill = allTextArray[i].fill;
            maxWidthText.charSpacing = allTextArray[i].charSpacing;
            maxWidthText.underline = allTextArray[i].underline;
            maxWidthText.flipY = allTextArray[i].flipY;
            maxWidthText.textAlign = allTextArray[i].textAlign;
            maxWidthText.lineSpacing = allTextArray[i].lineSpacing;
            maxWidthText.paragraphSpacing = allTextArray[i].paragraphSpacing;
            maxWidthText.areaBox = allTextArray[i].areaBox;

            maxWidthText.text = maxWidthTranslationTextBox[allTextArray[i].text][this.state.currentSelectedHook.id].text;
            // Draw bounds and hints
            if ((maxWidthText.areaBox && maxWidthText.clippedByArea) || (!allTextArray[i].areaBox && (maxWidthText.localBounds.width > allTextArray[i].localBounds.width))) {
                // Do the drawing
                var rect = new Rectangle();
                rect.width = maxWidthText.localBounds.width;
                rect.height = maxWidthText.localBounds.height;
                rect.stroke = new Color("red");
                maxWidthText.opacity = 0.2;

                selection.items[0].addChild(rect);
                selection.items[0].addChild(maxWidthText);

                amberOverlaysArray.push(rect);
                amberOverlaysArray.push(maxWidthText);

                // Depends on allignment
                if (allTextArray[i].textAlign == Text.ALIGN_LEFT) {
                    rect.moveInParentCoordinates(allTextArray[i].globalBounds.x - rect.globalBounds.x, allTextArray[i].globalBounds.y - rect.globalBounds.y);

                }
                else if (allTextArray[i].textAlign == Text.ALIGN_CENTER) {
                    rect.moveInParentCoordinates(allTextArray[i].globalBounds.x - (maxWidthText.globalBounds.width - allTextArray[i].globalBounds.width) / 2 - rect.globalBounds.x, allTextArray[i].globalBounds.y - rect.globalBounds.y);

                }
                else if (allTextArray[i].textAlign == Text.ALIGN_RIGHT) {
                    rect.moveInParentCoordinates(allTextArray[i].globalBounds.x - (maxWidthText.globalBounds.width - allTextArray[i].globalBounds.width) - rect.globalBounds.x, allTextArray[i].globalBounds.y - rect.globalBounds.y);

                }

                maxWidthText.moveInParentCoordinates(rect.globalBounds.x - maxWidthText.globalBounds.x, rect.globalBounds.y - maxWidthText.globalBounds.y);

            }
        }
    }
   

    /**
     * 
     * Duplicate the artboard and replace the text elements with translations from selected locale. 
     */
    runReplaceMode(selection, root) {

        var prevSelectedArtboard = selection.items;
        for (let i = 0; i < langList.length; i++) {
            currentSelectedLocale = langList[i];
            let artboardInExistence = selection.items[0].name + " (World Ready) " + currentSelectedLocale;
            root.children.forEach(function (childNode, i) {
                if (childNode.name == artboardInExistence) {
                    amberOverlaysArray.push(childNode);
                }
            });
        }
        this.runRemoveMode(selection, root);

        for (let i = 0; i < langList.length; i++) {
            currentSelectedLocale = langList[i];
            showWarningForSymbInstGroups = false;
            if (selection.items.length == 1 && selection.items[0] instanceof Artboard) {
                let orgArtboard = selection.items[0];
                commands.duplicate();
                selection.items[0].name = orgArtboard.name + " (World Ready) " + currentSelectedLocale;
                localizedArtboard = selection.items[0];
                hierarchyTree = {};
                groupNames = {};
                isGroupMasked = {};
                isGroupVisible = {};
                this.traverseToStoreHierarchy(selection.items[0]);
                this.traverseAndTranslate(selection.items[0], selection);
                selection.items = [localizedArtboard];
                this.traverseToReformHierarchy(localizedArtboard.guid, selection);
            }
            selection.items = prevSelectedArtboard;
        }

    }

    render() {
        const { dialog } = this.props;
        const { isUxp3 } = this.props;
        return (
            <form method="dialog" className={styles.form}>
                <div className={this.state.loading ? styles.change : ""}>
                    <Header onHookChange={this.onTranslationHookChanged} />
                    <HookKey onHookInput={this.mapKeyWithHook} />
                    <Mode onModeClick={this.onModeSelected} />
                    <div>
                        <label className={styles.langLabel}>{Strings.SOURCE_LANG_LABEL}</label>
                        <select className={styles.sourceLangDropDown} id="sourceLanguage" onChange={(e) => { this.selectedSourceLang = e.target.value }}>
                            {
                                this.state.allLangListState.map((entry) => <option key={entry.value} value={entry.display}>{entry.display}</option>)
                            }
                        </select>
                    </div>
                    <Langs onCheckedChange={this.changeAvailableLangList} isUxp3={isUxp3} />
                    <Footer dialog={dialog} onButtonClick={this.runSelectedMode} />
                </div>
                {this.state.loading == true && <Loader onLoaderClick={this.onLoaderClick}> </Loader>}

            </form>

        );
    };


}


module.exports = UIDialog;