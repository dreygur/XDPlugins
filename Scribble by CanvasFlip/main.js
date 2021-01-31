//constant variables to be used throughout
const {Artboard, Text, Group, RepeatGrid, SymbolInstance, Color, BitmapFill, LinearGradientFill, RadialGradientFill, Shadow} = require("scenegraph");
const uxp = require("uxp");
const application = require("application");
//const cfURLPrefix = "http://192.168.0.199/canvasflip_latest";
const cfURLPrefix = "https://www.canvasflip.com";

//global variables predefined
let pluginFolder = null;
let localStorageFolder = null;
let localStorageFile = null;
let localStorage = null;
let dialog = null;
let $ = null;
let projects = [];

let selectedArtboards = [];
let syncData = null;
let syncBackData = null;
let newProjectCreated = 0;

//load all resources upfront like localstorage files
async function loadResources() {
    pluginFolder = await uxp.storage.localFileSystem.getPluginFolder();

    //load local storage file
    localStorageFolder = await uxp.storage.localFileSystem.getDataFolder();
    localStorageFile = (await localStorageFolder.getEntries()).filter(entry => entry.name.indexOf("scribble_plugin_data.json") >= 0);
    if (localStorageFile.length > 0) {
        localStorageFile = localStorageFile[0];

        //read scribble_plugin_data.json
        localStorage = await localStorageFile.read();
        localStorage = JSON.parse(localStorage);
    } else {
        //create scribble_plugin_data.json and write
        localStorage = {
            data: {
                user: {
                    id: 0,
                    name: "",
                    token: ""
                },
                selected_project: 0,
                is_sync_all: 0
            }
        };

        localStorageFile = await localStorageFolder.createEntry("scribble_plugin_data.json", {
            overwrite: true
        });
        await localStorageFile.write(JSON.stringify(localStorage));
    }
}
loadResources();

async function syncArtboardsHandlerFunction(selection, documentRoot) {
    $ = selection => document.querySelector(selection);

    await loadDialog();

    if (localStorage != null && localStorage.data.user.token.length == 0 || localStorage.data.user.id == 0) {
        //open login dialog
        openLoginDialog(selection, documentRoot, "sync");
    } else {
        //open sync dialog
        openSyncDialog(selection, documentRoot);
    }

    return dialog.showModal().then(async result => {
        //code after close
        if (syncData != null) {
            let response = {
                project_uuid: "",
                page_uuid: ""
            };
            for (var i = 0; i < syncData.length; i++) {
                var artboard = syncData[i].artboard;
                var data = syncData[i].data;

                //generate thumbnail image
                //let scale = parseFloat(250 / item.globalBounds.width).toFixed(2);
                let thumbBase64 = await specs.layerToBase64(artboard, 1);

                //iterate through all text layers and hide it before taking screenshot image
                specs.showHideArtboardTextLayers(artboard, null, data.layers, false);

                //generate full image
                let base64 = await specs.layerToBase64(artboard, 1);

                //iterate through all text layers and show it
                specs.showHideArtboardTextLayers(artboard, null, data.layers, true);

                var syncArtboardsData = {
                    filename: artboard.name + ".png",
                    height: artboard.globalBounds.height,
                    width: artboard.globalBounds.width,
                    projectId: localStorage.data.selected_project,
                    isSyncAll: localStorage.data.is_sync_all,
                    userId: localStorage.data.user.id,
                    token: localStorage.data.user.token,
                    specs: data,
                    weight: data.weight
                };

                response = await api.syncArtboard(syncArtboardsData, base64, thumbBase64);
            }

            //load complete dialog
            let loginCSS = (await pluginFolder.getEntry("html/common.css"));
            loginCSS = await loginCSS.read();
            document.body.innerHTML = "<style>" + loginCSS + "</style>" +
                    "<dialog id='dialog'></dialog>";
            dialog = $("#dialog");

            let syncCompleteHTML = (await pluginFolder.getEntry("html/sync-complete.html"));
            syncCompleteHTML = await syncCompleteHTML.read();
            $("#dialog").innerHTML = syncCompleteHTML;

            //render header logo image
            let syncCompletedIMG = (await pluginFolder.getEntry("images/sync_completed.png"));
            syncCompletedIMG = await syncCompletedIMG.read({format: uxp.storage.formats.binary});
            $("#syncCompletedIMG").src = "data:image/png;base64," + utils.binaryToBase64(syncCompletedIMG);

            //render header logo image
            let logoIMG = (await pluginFolder.getEntry("images/logo_header.png"));
            logoIMG = await logoIMG.read({format: uxp.storage.formats.binary});
            $("#logoHeader").src = "data:image/png;base64," + utils.binaryToBase64(logoIMG);

            //show link
            var link = "";
            if (syncData.length > 1) {
                link += "/vi/share/?project=" + response.project_uuid;
            } else {
                link += "/vi/scribble/?page=" + response.page_uuid;
            }
            $("#syncCompleteText").value = cfURLPrefix + link;
            $("#goToPreviewLink").setAttribute("href", cfURLPrefix + link);

            $("#close").addEventListener("click", () => {
                dialog.close();
            });

            //empty syncData and show complete dialog
            syncData = null;
            return dialog.showModal().then(result => {

            });
        }
    });
}

async function syncBackArtboardsHandlerFunction(selection, documentRoot) {
    $ = selection => document.querySelector(selection);

    await loadDialog();

    if (localStorage != null && localStorage.data.user.token.length == 0 || localStorage.data.user.id == 0) {
        //open login dialog
        openLoginDialog(selection, documentRoot, "sync-back");
    } else {
        //open sync dialog
        openSyncBackDialog(selection, documentRoot);
    }

    return dialog.showModal().then(async result => {
        //code after close
        if (syncBackData != null) {
            for (var i = 0; i < syncBackData.artboards.length; i++) {
                let layers = [];

                //iterate all artboards
                selectedArtboards.forEach(function (item) {
                    if (item instanceof Artboard) {
                        if (syncBackData.artboards[i].name == item.name) {
                            let specs = new Specs();
                            layers = specs.setArtboard(item, null, syncBackData.artboards[i].scribble);
                        }
                    }
                });

                //iterate all children and change text
                for (var j = 0; j < layers.length; j++) {
                    layers[j].child.text = layers[j].content;
                }
            }

            //load complete dialog
            let loginCSS = (await pluginFolder.getEntry("html/common.css"));
            loginCSS = await loginCSS.read();
            document.body.innerHTML = "<style>" + loginCSS + "</style>" +
                    "<dialog id='dialog'></dialog>";
            dialog = $("#dialog");

            let syncCompleteHTML = (await pluginFolder.getEntry("html/sync-back-complete.html"));
            syncCompleteHTML = await syncCompleteHTML.read();
            $("#dialog").innerHTML = syncCompleteHTML;

            //render sync completed icon
            let syncCompletedIMG = (await pluginFolder.getEntry("images/sync_completed.png"));
            syncCompletedIMG = await syncCompletedIMG.read({format: uxp.storage.formats.binary});
            $("#syncCompletedIMG").src = "data:image/png;base64," + utils.binaryToBase64(syncCompletedIMG);

            //render header logo image
            let logoIMG = (await pluginFolder.getEntry("images/logo_header.png"));
            logoIMG = await logoIMG.read({format: uxp.storage.formats.binary});
            $("#logoHeader").src = "data:image/png;base64," + utils.binaryToBase64(logoIMG);

            //show link
            var link = "";
            if (syncBackData.artboards.length > 1) {
                link += "/vi/share/?project=" + syncBackData.project_uuid;
            } else {
                link += "/vi/scribble/?page=" + syncBackData.page_uuid;
            }
            $("#syncCompleteText").value = cfURLPrefix + link;
            $("#goToPreviewLink").setAttribute("href", cfURLPrefix + link);

            $("#close").addEventListener("click", () => {
                dialog.close();
            });

            //empty syncBackData and show complete dialog
            syncBackData = null;
            return dialog.showModal().then(result => {

            });
        }
    });
}

async function loadDialog() {
    let loginCSS = (await pluginFolder.getEntry("html/common.css"));
    loginCSS = await loginCSS.read();
    document.body.innerHTML = "<style>" + loginCSS + "</style>" +
            "<dialog id='dialog'></dialog>";
    dialog = $("#dialog");
}

//open login dialog
async function openLoginDialog(selection, documentRoot, action) {
    //read login html
    let loginHTML = (await pluginFolder.getEntry("html/login.html"));
    loginHTML = await loginHTML.read();
    $("#dialog").innerHTML = loginHTML;

    //render header logo image
    let logoIMG = (await pluginFolder.getEntry("images/logo_header.png"));
    logoIMG = await logoIMG.read({format: uxp.storage.formats.binary});
    $("#logoHeader").src = "data:image/png;base64," + utils.binaryToBase64(logoIMG);

    let [close, loginBtn, email, password, error] = ["#close", "#loginBtn", "#emailID", "#password", "#error"].map(s => $(s));

    //Login button Click
    loginBtn.addEventListener("click", async () => {
        //login
        let data = await api.login(email.value, password.value);
        data = JSON.parse(data);

        if (data != "error" && data.result == "success") {
            async function writePluginData(data) {
                //read scribble_plugin_data.json and populate user data
                localStorage.data.user.id = data.id;
                localStorage.data.user.name = data.name;
                localStorage.data.user.token = data.token;

                //save data to file
                await localStorageFile.write(JSON.stringify(localStorage));

                try {
                    if (action == "sync") {
                        await openSyncDialog(selection, documentRoot);
                    } else {
                        await openSyncBackDialog(selection, documentRoot);
                    }
                } catch (e) {
                    console.log("Exception occurred: " + e);
                }
            }
            writePluginData(data);
        } else {
            error.style.opacity = 1;
        }
    });

    close.addEventListener("click", () => {
        dialog.close();
    });
}

//open Create Project dialog
async function openCreateProjectDialog(selection, documentRoot) {
    //read login html
    let createProjectHTML = (await pluginFolder.getEntry("html/create-project.html"));
    createProjectHTML = await createProjectHTML.read();
    $("#dialog").innerHTML = createProjectHTML;

    //render header logo image
    let logoIMG = (await pluginFolder.getEntry("images/logo_header.png"));
    logoIMG = await logoIMG.read({format: uxp.storage.formats.binary});
    $("#logoHeader").src = "data:image/png;base64," + utils.binaryToBase64(logoIMG);

    let [close, createProjectBtn, projectName, error, backToSync] = ["#close", "#createProjectBtn", "#projectName", "#error", "#backToSync"].map(s => $(s));

    //Login button Click
    createProjectBtn.addEventListener("click", async () => {
        let data = await api.createProject(localStorage.data.user.id, localStorage.data.user.token, projectName.value);
        data = JSON.parse(data);

        if (data != "error" && data.result == "success") {
            //Set global variable newProjectCreated to 1 for set new project in selection
            newProjectCreated = 1;
            // openSyncDialog will take one new parameter newProjectCreated 
            await openSyncDialog(selection, documentRoot);
        } else {
            error.style.opacity = 1;
        }
    });

    //Back to sync 
    backToSync.addEventListener("click", async function () {
        await openSyncDialog(selection, documentRoot);
    });
    close.addEventListener("click", () => {
        dialog.close();
    });
}

//open sync dialog
async function openSyncDialog(selection, documentRoot) {
    //read sync html
    let syncHTML = (await pluginFolder.getEntry("html/sync.html"));
    syncHTML = await syncHTML.read();
    $("#dialog").innerHTML = syncHTML;

    //render header logo image
    let logoIMG = (await pluginFolder.getEntry("images/logo_header.png"));
    logoIMG = await logoIMG.read({format: uxp.storage.formats.binary});
    $("#logoHeader").src = "data:image/png;base64," + utils.binaryToBase64(logoIMG);

    let [close, logoutBtn, syncBtn, selectProject, selectProjectLoading, syncAll, syncSelected, error, createProject] = ["#close", "#logoutBtn", "#syncBtn", "#selectProject", "#selectProjectLoading", "#syncAll", "#syncSelected", "#error", "#createProject"].map(s => $(s));

    //set checkboxes
    if (localStorage.data.is_sync_all) {
        syncAll.checked = true;
        syncSelected.checked = false;
    } else {
        syncAll.checked = false;
        syncSelected.checked = true;
    }

    syncAll.addEventListener("click", () => {
        localStorage.data.is_sync_all = 1;
        syncAll.checked = true;
        syncSelected.checked = false;
    });

    syncSelected.addEventListener("click", () => {
        localStorage.data.is_sync_all = 0;
        syncAll.checked = false;
        syncSelected.checked = true;
    });

    selectProject.addEventListener("change", () => {
        localStorage.data.selected_project = selectProject.value;
    });

    logoutBtn.addEventListener("click", async () => {
        localStorage.data.user.id = 0;
        localStorage.data.user.name = "";
        localStorage.data.user.token = "";

        //save updated data to file
        await localStorageFile.write(JSON.stringify(localStorage));

        try {
            await openLoginDialog(selection, documentRoot, "sync");
        } catch (e) {
            console.log("Exception occurred: " + e);
        }
    });

    syncBtn.addEventListener("click", async () => {
        if (localStorage.data.selected_project > 0) {
            var artboardWeight = 1000,
                    artboardsCount = 0;

            if (localStorage.data.is_sync_all) {
                selectedArtboards = documentRoot.children;
            } else {
                selectedArtboards = selection.items;
            }

            //iterate all artboards
            syncData = [];
            selectedArtboards.forEach(async function (item) {
                if (item instanceof Artboard) {
                    //artboard found
                    artboardsCount++;

                    //get specs
                    let data = specs.getArtboard(item, null, null);
                    data.weight = artboardWeight;
                    syncData.push({
                        artboard: item,
                        data: data
                    });

                    //increment artboardWeight
                    artboardWeight = artboardWeight + 1;
                }
            });

            if (artboardsCount == 0) {
                syncData = null;
                error.style.opacity = 1;
            } else {
                //save updated data to file
                await localStorageFile.write(JSON.stringify(localStorage));
                await dialog.close();
            }
        } else {
            error.style.opacity = 1;
        }
    });

    createProject.addEventListener("click", async () => {
        try {
            // Open Create Project Dialog
            await openCreateProjectDialog(selection, documentRoot);
        } catch (e) {
            console.log("Exception occurred: " + e);
        }
    });

    close.addEventListener("click", () => {
        dialog.close();
    });

    await loadProjects(selectProject, selectProjectLoading);
}

async function loadProjects(selectProject, selectProjectLoading) {
    //populate projects afetr open dialog
    let data = await api.getProjects(localStorage.data.user.id, localStorage.data.user.token);
    data = JSON.parse(data);

    if (data != "error" && data.result == "success") {
        projects = data.projects;

        if (projects.length > 0) {
            let projectOptions = "";
            let selectedIndex = 0;
            for (let i = 0; i < projects.length; i++) {
                if (projects[i].id == localStorage.data.selected_project) {
                    //select this project by default
                    selectedIndex = i;
                }
                projectOptions += "<option value='" + projects[i].id + "'>" + projects[i].title + "</option>";
            }
            // Set selectedIndex to 0 if called from newProjectCreated

            if (newProjectCreated == 1) {
                selectedIndex = 0;
            }
            selectProject.innerHTML = projectOptions;
            selectProject.style.display = "block";
            selectProjectLoading.style.display = "none";

            selectProject.selectedIndex = selectedIndex;

            if (selectedIndex == 0) {
                //no project is localStorage
                localStorage.data.selected_project = projects.length > 0 ? projects[0].id : 0;
            }
        } else {
            selectProjectLoading.text("No projects yet!")
        }
    }
}

//open sync dialog
async function openSyncBackDialog(selection, documentRoot) {
    //read sync html
    let syncBackHTML = (await pluginFolder.getEntry("html/sync-back.html"));
    syncBackHTML = await syncBackHTML.read();
    $("#dialog").innerHTML = syncBackHTML;

    //render header logo image
    let logoIMG = (await pluginFolder.getEntry("images/logo_header.png"));
    logoIMG = await logoIMG.read({format: uxp.storage.formats.binary});
    $("#logoHeader").src = "data:image/png;base64," + utils.binaryToBase64(logoIMG);

    let [close, logoutBtn, syncBtn, selectProject, selectProjectLoading, syncAll, syncSelected, error] = ["#close", "#logoutBtn", "#syncBtn", "#selectProject", "#selectProjectLoading", "#syncAll", "#syncSelected", "#error"].map(s => $(s));

    //set checkboxes
    if (localStorage.data.is_sync_all) {
        syncAll.checked = true;
        syncSelected.checked = false;
    } else {
        syncAll.checked = false;
        syncSelected.checked = true;
    }

    syncAll.addEventListener("click", () => {
        localStorage.data.is_sync_all = 1;
        syncAll.checked = true;
        syncSelected.checked = false;
    });

    syncSelected.addEventListener("click", () => {
        localStorage.data.is_sync_all = 0;
        syncAll.checked = false;
        syncSelected.checked = true;
    });

    selectProject.addEventListener("change", () => {
        localStorage.data.selected_project = selectProject.value;
    });

    logoutBtn.addEventListener("click", async () => {
        localStorage.data.user.id = 0;
        localStorage.data.user.name = "";
        localStorage.data.user.token = "";

        //save updated data to file
        await localStorageFile.write(JSON.stringify(localStorage));

        try {
            await openLoginDialog(selection, documentRoot, "sync-back");
        } catch (e) {
            console.log("Exception occurred: " + e);
        }
    });

    syncBtn.addEventListener("click", async () => {
        if (localStorage.data.selected_project > 0) {
            var artboardsCount = 0,
                    artboardNames = [];

            if (localStorage.data.is_sync_all) {
                selectedArtboards = documentRoot.children;
            } else {
                selectedArtboards = selection.items;
            }

            //iterate all artboards
            selectedArtboards.forEach(function (item) {
                if (item instanceof Artboard) {
                    //artboard found
                    artboardsCount++;

                    artboardNames.push(item.name);
                }
            });

            let syncBackArtboardsData = {
                artboards: artboardNames,
                project_id: localStorage.data.selected_project,
                user_id: localStorage.data.user.id,
                user_token: localStorage.data.user.token,
                is_sync_all: localStorage.data.is_sync_all
            }

            syncBackData = await api.syncBackArtboards(syncBackArtboardsData);
            if (artboardsCount == 0) {
                syncBackData = null;
                error.style.opacity = 1;
            } else {
                //save updated data to file
                await localStorageFile.write(JSON.stringify(localStorage));

                await dialog.close();
            }
        } else {
            error.style.opacity = 1;
        }
    });

    close.addEventListener("click", () => {
        dialog.close();
    });

    await loadProjects(selectProject, selectProjectLoading);
}

module.exports = {
    commands: {
        syncArtboards: syncArtboardsHandlerFunction,
        syncBackArtboards: syncBackArtboardsHandlerFunction
    }
};

class Specs {
    constructor() {

    }

    async layerToBase64(layer, scale) {
        try {
            let tempFolder = await uxp.storage.localFileSystem.getTemporaryFolder();
            let tempFile = await tempFolder.createEntry(Math.random().toString(36).substr(7) + ".png", {
                overwrite: true
            });

            let promise = new Promise(function (resolve, reject) {
                application.createRenditions([{
                        node: layer,
                        outputFile: tempFile,
                        type: application.RenditionType.PNG,
                        scale: scale
                    }]).then(async function (files) {
                    let buffer = await files[0].outputFile.read({format: uxp.storage.formats.binary});

                    let binaryData = "";
                    let bytes = new Uint8Array(buffer);
                    let byteLength = bytes.byteLength;

                    for (var i = 0; i < byteLength; i++) {
                        binaryData += String.fromCharCode(bytes[i]);
                    }

                    resolve(window.btoa(binaryData));
                }).catch(function (error) {
                    reject(error);
                });
            });

            return await promise;
        } catch (e) {
            console.log("Exception occurred: " + e);
        }

        return null;
    }

    getArtboard(artboard, symbol, symbolOffset) {
        //return if not instance of artboard or symbol
        if (!(artboard instanceof Artboard || symbol instanceof SymbolInstance || symbol instanceof Group || symbol instanceof RepeatGrid)) {
            return;
        }

        var self = this;
        var layers = [];
        var artboardBound = null;
        var artboardChildren = [];

        if (symbol instanceof SymbolInstance) {
            artboardBound = symbol.globalBounds;
            artboardChildren = symbol.children;
        } else if (symbol instanceof Group || symbol instanceof RepeatGrid) {
            artboardBound = artboard.globalBounds;
            artboardChildren = symbol.children;
        } else if (artboard instanceof Artboard) {
            artboardBound = artboard.globalBounds;
            artboardChildren = artboard.children;
        }

        //iterate all children inside this artboard/symbol
        artboardChildren.forEach(function (child) {
            var layer = {};

            if (child instanceof Text) {
                //text found
                try {
                    //set rect with artboardBound offset
                    layer.rect = self.getLayerRect(child.globalBounds, artboardBound);
                    if (symbol instanceof SymbolInstance) {
                        //set rect with symbol offset
                        layer.rect.x = symbolOffset.x + layer.rect.x;
                        layer.rect.y = symbolOffset.y + layer.rect.y;
                    }

                    //set layer properties
                    layer.sid = child.guid;
                    layer.name = child.name;
                    layer.fixedWidth = 0;

                    //rotation
                    layer.rotation = child.rotation;

                    //opacity
                    layer.opacity = child.opacity;

                    //TODO: radius

                    //TODO: borders

                    //TODO: fills
                    //var fills = self.getLayerFills(child, child.fill);
                    //if (fills.length > 0)
                    //layer.fills = fills;

                    //TODO: shadow
                    //var shadow = self.getLayerShadow(child);
                    //if (shadow.length > 0)
                    //layer.shadow = shadow;

                    layer.font = {
                        content: child.text,
                        override: null,
                        font: child.styleRanges.length > 0 ? child.styleRanges[0].fontFamily : "",
                        size: child.styleRanges.length > 0 ? child.styleRanges[0].fontSize : "",
                        line: child.lineSpacing,
                        spacing: {
                            char: 0, //TODO: char spacing
                            para: 0, //TODO: para spacing
                        },
                        align: child.textAlign,
                        color: self.getLayerColor(child, child.fill),
                        transform: 0 //TODO: transform
                    }

                    try {
                        //extract attribute styles
                        var styles = [];
                        var rangeIndex = 0;

                        child.styleRanges.forEach(function (style) {
                            if (style.length > 0) {
                                styles.push({
                                    content: child.text.substr(rangeIndex, style.length),
                                    font: style.fontFamily,
                                    size: style.fontSize,
                                    line: 0,
                                    spacing: {
                                        char: 0, //ToDo: Due to bug in XD temp 0 have assign rather this "layer.font.spacing.char"style.charSpacing,
                                        para: 0
                                    },
                                    align: "left",
                                    color: self.getLayerColor(child, style.fill),
                                    transform: 0
                                });

                                rangeIndex += style.length;
                            }
                        });

                        if (styles.length > 0 && child.text.length > rangeIndex) {
                            //style ranges are finished but texts remaining at end
                            styles.push({
                                content: child.text.substr(rangeIndex, child.text.length),
                                font: styles[styles.length - 1].font,
                                size: styles[styles.length - 1].size,
                                line: styles[styles.length - 1].line,
                                spacing: {
                                    char: 0, //ToDo: Due to bug in XD temp 0 have assign rather this "layer.font.spacing.char",
                                    para: styles[styles.length - 1].spacing.para,
                                },
                                align: styles[styles.length - 1].align,
                                color: styles[styles.length - 1].color,
                                transform: styles[styles.length - 1].transform
                            });
                        }
                    } catch (e) {
                        console.log("Exception occurred: " + e);
                    }

                    if (styles.length == 0) {
                        styles.push({
                            content: layer.font.override != null ? layer.font.override : layer.font.content,
                            font: layer.font.font,
                            size: layer.font.size,
                            line: layer.font.line,
                            spacing: {
                                char: 0, //ToDo: Due to bug in XD temp 0 have assign rather this "layer.font.spacing.char"
                                para: layer.font.spacing.para
                            },
                            align: layer.font.align,
                            color: layer.font.color,
                            transform: layer.font.transform
                        });
                    }
                    layer.font.styles = styles;
                } catch (e) {
                    console.log("Exception occurred: " + e);
                }

                //TODO: masking
                /*if (msLayer.hasClippingMask()) {
                 this.maskObjectID = (msGroup != null ? msGroup.objectID() : undefined);
                 this.maskRect = this.getLayerRect(msLayer.absoluteRect(), artboardFrame);
                 } else if ((msGroup != null && this.maskObjectID != msGroup.objectID()) || msLayer.shouldBreakMaskChain()) {
                 this.maskObjectID = undefined;
                 this.maskRect = undefined;
                 }
                 
                 if (layerProperties.isMaskChildLayer) {
                 layer.rect = this.getLayerMaskRect(layer.rect);
                 }*/

                //set symbol id if applicable
                if (symbol instanceof SymbolInstance || symbol instanceof Group || symbol instanceof RepeatGrid) {
                    layer.symbol_instance_id = symbol.guid;
                }

                layers.push(layer);
            }

            if (child instanceof SymbolInstance) {
                let bounds = {x: child.globalBounds.x, y: child.globalBounds.y};
                var symbolLayers = self.getArtboard(artboard, child, bounds);
                symbolLayers.forEach(function (layer) {
                    layers.push(layer);
                });
            } else if (child instanceof Group || child instanceof RepeatGrid) {
                var symbolLayers = self.getArtboard(artboard, child, null);
                symbolLayers.forEach(function (layer) {
                    layers.push(layer);
                });
            }
        });

        if (symbol == null) {
            var artboardData = {
                sid: artboard.guid,
                name: artboard.name,
                width: artboard.width,
                height: artboard.height,
                layers: layers
            };

            return artboardData;
        } else {
            return layers;
        }
    }

    showHideArtboardTextLayers(artboard, symbol, layers, isShow) {
        //return if not instance of artboard or symbol
        if (!(artboard instanceof Artboard || symbol instanceof SymbolInstance || symbol instanceof Group || symbol instanceof RepeatGrid)) {
            return;
        }

        var self = this;
        var artboardChildren = [];

        if (symbol instanceof SymbolInstance || symbol instanceof Group || symbol instanceof RepeatGrid) {
            artboardChildren = symbol.children;
        } else if (artboard instanceof Artboard) {
            artboardChildren = artboard.children;
        }

        //iterate all children inside this artboard/symbol
        artboardChildren.forEach(function (child) {
            if (child instanceof Text) {
                let layerId = child.guid;

                for (var i = 0; i < layers.length; i++) {
                    if (layerId == layers[i].sid) {
                        try {
                            child.visible = isShow;
                        } catch (e) {
                            console.log("Exception occurred: " + e);
                        }
                    }
                }
            }

            if (child instanceof SymbolInstance || child instanceof Group || child instanceof RepeatGrid) {
                //show-hide layer text for this symbol
                self.showHideArtboardTextLayers(artboard, child, layers, isShow);
            }
        });
    }

    setArtboard(artboard, symbol, scribble) {
        if (scribble == null || scribble.layers == null) {
            return;
        }

        //return if not instance of artboard or symbol
        if (!(artboard instanceof Artboard || symbol instanceof SymbolInstance || symbol instanceof Group || symbol instanceof RepeatGrid)) {
            return;
        }

        var self = this;
        var layers = [];
        var artboardChildren = [];

        if (symbol instanceof SymbolInstance || symbol instanceof Group || symbol instanceof RepeatGrid) {
            artboardChildren = symbol.children;
        } else if (artboard instanceof Artboard) {
            artboardChildren = artboard.children;
        }

        //iterate all children inside this artboard/symbol
        artboardChildren.forEach(function (child) {
            try {
                let layerId = child.guid;

                for (var i = 0; i < scribble.layers.length; i++) {
                    var scribbleLayer = scribble.layers[i];

                    if (layerId == scribbleLayer.sid) {
                        try {
                            layers.push({
                                child: child,
                                content: scribbleLayer.content
                            });
                            //remove this layer from scribble now and break;
                            //scribble.layers.splice(i, 1);
                            break;
                        } catch (e) {
                            console.log("Exception occurred: " + e);
                        }
                    }
                }

                if (child instanceof SymbolInstance || child instanceof Group || child instanceof RepeatGrid) {
                    try {
                        var symbolLayers = self.setArtboard(artboard, child, scribble);
                        symbolLayers.forEach(function (layer) {
                            layers.push(layer);
                        });
                    } catch (e) {
                        console.log("Exception occurred: " + e);
                    }
                }
            } catch (e) {
                console.log("Exception occurred: " + e);
            }
        });

        return layers;
    }

    getLayerRect(rect, referenceRect) {
        if (referenceRect) {
            return {
                x: rect.x - referenceRect.x,
                y: rect.y - referenceRect.y,
                width: rect.width,
                height: rect.height
            };
        }

        return {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height
        };
    }

    getLayerFills(layer, fill) {
        var self = this;
        var layerFills = [];

        try {
            if (layer.fillEnabled) {
                if (fill instanceof Color) {
                    layerFills.push({
                        type: "color",
                        color: self.getColor(fill)
                    });
                } else if (layer instanceof LinearGradientFill) {
                    layerFills.push({
                        type: "gradient",
                        gradient: this.getLayerGradient(fill, "linear")
                    });
                } else if (layer instanceof RadialGradientFill) {
                    layerFills.push({
                        type: "gradient",
                        gradient: this.getLayerGradient(fill, "radial")
                    });
                } else if (layer instanceof BitmapFill) {
                    //TODO: bitmap fill
                }
            }
        } catch (e) {
            console.log("Exception occurred: " + e);
        }

        return layerFills;
    }

    getLayerColor(layer, fill) {
        var self = this;
        try {
            if (layer.fillEnabled) {
                if (fill instanceof Color) {
                    return self.getColor(fill);
                }
            }
        } catch (e) {
            console.log("Exception occurred: " + e);
        }

        return null;
    }

    getColor(color) {
        if (color instanceof Color) {
            return {
                r: color.r,
                g: color.g,
                b: color.b,
                a: Math.floor((color.a / 255) * 100) / 100
            };
        }

        return null;
    }

    getLayerGradient(gradient, gradientType) {
        var self = this;
        var colorStops = [];

        try {
            gradient.colorStops.forEach(function (colorStop) {
                colorStops.push({
                    color: self.getColor(colorStop.color),
                    position: colorStop.stop
                });
            });

            return {
                type: gradientType,
                from: {
                    x: parseFloat(gradient.startX),
                    y: parseFloat(gradient.startY)
                },
                to: {
                    x: parseFloat(gradient.endX),
                    y: parseFloat(gradient.endY)
                },
                colorStops: colorStops
            };
        } catch (e) {
            console.log("Exception occurred: " + e);
        }

        return {};
    }

    getLayerShadow(layer) {
        var self = this;
        var layerShadow = [];

        try {
            if (layer.shadow instanceof Shadow) {
                //TODO: inner / outer
                var shadowType = "outer";

                layerShadow.push({
                    type: shadowType,
                    offsetX: layer.shadow.x,
                    offsetY: layer.shadow.y,
                    blurRadius: layer.shadow.blur,
                    spread: 0,
                    color: self.getColor(layer.shadow.color)
                });
            }
        } catch (e) {
            console.log("Exception occurred: " + e);
        }

        return layerShadow;
    }
}
const specs = new Specs();

class API {

    constructor() {

    }

    async login(email, password) {
        let promise = await new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", cfURLPrefix + "/vi/svcs/scribble/sketch/sketchLogin.php", true);
            xhr.onload = function (e) {
                if (xhr.status === 200) {
                    resolve(xhr.response);
                } else {
                    reject("error");
                }
            };
            xhr.onerror = function (e) {
                console.log("onerror")
                reject("error");
            };
            xhr.onabort = function (e) {
                console.log("onabort")
                reject("error");
            };
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send("email=" + email + "&password=" + password);
        });

        let result = await promise;
        return result;
    }

    async createProject(id, token, projectName) {
        let promise = await new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", cfURLPrefix + "/vi/svcs/scribble/xd/xdCreateProject.php", true);
            xhr.onload = function (e) {
                if (xhr.status === 200) {
                    resolve(xhr.response);
                } else {
                    reject("error");
                }
            };
            xhr.onerror = function (e) {
                console.log("onerror")
                reject("error");
            };
            xhr.onabort = function (e) {
                console.log("onabort")
                reject("error");
            };
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send("id=" + id + "&token=" + token + "&project_name=" + projectName);
        });
        let result = await promise;
        return result;
    }

    async getProjects(id, token) {
        let promise = await new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", cfURLPrefix + "/vi/svcs/scribble/sketch/sketchGetProjects.php", true);
            xhr.onload = function (e) {
                if (xhr.status === 200) {
                    resolve(xhr.response);
                } else {
                    reject("error");
                }
            };
            xhr.onerror = function (e) {
                console.log("onerror")
                reject("error");
            };
            xhr.onabort = function (e) {
                console.log("onabort")
                reject("error");
            };
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send("id=" + id + "&token=" + token);
        });

        let result = await promise;
        return result;
    }

    async syncArtboard(syncArtboardsData, base64, thumbBase64) {
        let promise = await new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", cfURLPrefix + "/vi/svcs/scribble/xd/xdSyncArtboard.php", true);
            xhr.onload = function (e) {
                if (xhr.status === 200) {
                    resolve(xhr.response);
                } else {
                    reject("error");
                }
            };
            xhr.onerror = function (e) {
                console.log("onerror")
                reject("error");
            };
            xhr.onabort = function (e) {
                console.log("onabort")
                reject("error");
            };
            xhr.upload.addEventListener("progress", function (evt) {
                console.log("progress")
                if (evt.lengthComputable) {
                    //CalculateProgress(evt.loaded, evt.total, syncArtboardsData.filename);
                }
            }, false);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.responseType = "json";
            xhr.send(JSON.stringify({
                data: syncArtboardsData,
                image: base64,
                thumb: thumbBase64
            }));
        });

        let result = await promise;
        return result;
    }

    async syncBackArtboards(data) {
        let promise = await new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", cfURLPrefix + "/vi/svcs/scribble/xd/xdSyncBackArtboards.php", true);
            xhr.onload = function (e) {
                if (xhr.status === 200) {
                    resolve(xhr.response);
                } else {
                    reject("error");
                }
            };
            xhr.onerror = function (e) {
                console.log("onerror")
                reject("error");
            };
            xhr.onabort = function (e) {
                console.log("onabort")
                reject("error");
            };
            xhr.upload.addEventListener("progress", function (evt) {
                console.log("progress")
                if (evt.lengthComputable) {
                    //CalculateProgress(evt.loaded, evt.total, syncArtboardsData.filename);
                }
            }, false);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.responseType = "json";
            xhr.send(JSON.stringify(data));
        });

        let result = await promise;
        return result;
    }
}
const api = new API();

class UTILS {

    constructor() {

    }

    binaryToBase64(buffer) {
        try {
            let binaryData = "";
            let bytes = new Uint8Array(buffer);
            let byteLength = bytes.byteLength;

            for (var i = 0; i < byteLength; i++) {
                binaryData += String.fromCharCode(bytes[i]);
            }

            return window.btoa(binaryData);
        } catch (e) {
            console.log(e);
        }

        return null;
    }
}
const utils = new UTILS();

if (!window.atob && !window.btoa) {
    (function (window) {
        var _PADCHAR = "=",
                _ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

        function _getbyte64(s, i) {
            var idx = _ALPHA.indexOf(s.charAt(i));

            if (idx === -1) {
                throw "Cannot decode base64";
            }

            return idx;
        }

        function _decode(s) {
            var pads = 0,
                    i,
                    b10,
                    imax = s.length,
                    x = [];

            s = String(s);

            if (imax === 0) {
                return s;
            }

            if (imax % 4 !== 0) {
                throw "Cannot decode base64";
            }

            if (s.charAt(imax - 1) === _PADCHAR) {
                pads = 1;

                if (s.charAt(imax - 2) === _PADCHAR) {
                    pads = 2;
                }

                // either way, we want to ignore this last block
                imax -= 4;
            }

            for (i = 0; i < imax; i += 4) {
                b10 = (_getbyte64(s, i) << 18) | (_getbyte64(s, i + 1) << 12) | (_getbyte64(s, i + 2) << 6) | _getbyte64(s, i + 3);
                x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 0xff, b10 & 0xff));
            }

            switch (pads) {
                case 1:
                    b10 = (_getbyte64(s, i) << 18) | (_getbyte64(s, i + 1) << 12) | (_getbyte64(s, i + 2) << 6);
                    x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 0xff));
                    break;

                case 2:
                    b10 = (_getbyte64(s, i) << 18) | (_getbyte64(s, i + 1) << 12);
                    x.push(String.fromCharCode(b10 >> 16));
                    break;
            }

            return x.join("");
        }

        function _getbyte(s, i) {
            var x = s.charCodeAt(i);

            if (x > 255) {
                throw "INVALID_CHARACTER_ERR: DOM Exception 5";
            }

            return x;
        }

        function _encode(s) {
            if (arguments.length !== 1) {
                throw "SyntaxError: exactly one argument required";
            }

            s = String(s);

            var i,
                    b10,
                    x = [],
                    imax = s.length - s.length % 3;

            if (s.length === 0) {
                return s;
            }

            for (i = 0; i < imax; i += 3) {
                b10 = (_getbyte(s, i) << 16) | (_getbyte(s, i + 1) << 8) | _getbyte(s, i + 2);
                x.push(_ALPHA.charAt(b10 >> 18));
                x.push(_ALPHA.charAt((b10 >> 12) & 0x3F));
                x.push(_ALPHA.charAt((b10 >> 6) & 0x3f));
                x.push(_ALPHA.charAt(b10 & 0x3f));
            }

            switch (s.length - imax) {
                case 1:
                    b10 = _getbyte(s, i) << 16;
                    x.push(_ALPHA.charAt(b10 >> 18) + _ALPHA.charAt((b10 >> 12) & 0x3F) + _PADCHAR + _PADCHAR);
                    break;

                case 2:
                    b10 = (_getbyte(s, i) << 16) | (_getbyte(s, i + 1) << 8);
                    x.push(_ALPHA.charAt(b10 >> 18) + _ALPHA.charAt((b10 >> 12) & 0x3F) + _ALPHA.charAt((b10 >> 6) & 0x3f) + _PADCHAR);
                    break;
            }

            return x.join("");
        }

        window.btoa = _encode;
        window.atob = _decode;

    })(window);
}