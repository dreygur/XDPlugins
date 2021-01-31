const {
    ImageFill
} = require("scenegraph");
const {
    alert,
    error
} = require("./lib/dialogs.js");
var {
    Color
} = require("scenegraph");
const {
    RepeatGrid,
    Artboard
} = require("scenegraph");
const uxp = require("uxp");
const fs = uxp.storage.localFileSystem;
var oldSearchQuery = "";

//Use the search title to generate tex and image URLs
function beginWiki(selection, root, searchTitle) {
    searchTitle = searchTitle.replace(/ /g, "%20");
    const txtUrl = "https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&explaintext=1&prop=extracts&generator=prefixsearch&exlimit=10&exintro=1&gpslimit=10&gpssearch=" + searchTitle;
    const imgUrl = "https://en.wikipedia.org/w/api.php?action=query&format=json&generator=prefixsearch&formatversion=2&prop=pageimages&pilicense=any&piprop=original&gpssearch=" + searchTitle;

    return Promise.all([
                  fetch(txtUrl),
                  fetch(imgUrl)
                ]).then(function (response) {
            var blobPromises = [];
            for (var i = 0; i < response.length; i++) {
                blobPromises.push(response[i].json());
            }
            return Promise.all(blobPromises);
        })
        .then(([summaryResponse, jsonResponse]) => {
            return assignContentToSelection(selection, summaryResponse, jsonResponse, getPage(jsonResponse));
        }).catch((err) => {
            if (err.message == "Network request failed") {
                return alert("Internet unavailable", "Please check the internet connection and try again.");
            } else
                return alert("Search term unavailable", "Please try a different search term.");
        });
}

//Based on availability of image, select the right page number
function getPage(jsonResponse) {
    var pageNum = 0;
    var pageNum2 = 1;
    var pageNum3 = 2;
    var goForSecond = false;
    var goForThird = false;
    for (var i = 0; i < jsonResponse.query.pages.length; i++) {
        if (jsonResponse.query.pages[i].index == 1) {
            if (jsonResponse.query.pages[i].original != null)
                pageNum = i;
            else
                goForSecond = true;
        }
        if (jsonResponse.query.pages[i].index == 2) {
            if (jsonResponse.query.pages[i].original != null)
                pageNum2 = i;
            else goForThird = true;
        }
        if (jsonResponse.query.pages[i].index == 2) {
            pageNum3 = i;
        }
    }
    if (goForSecond && goForThird) {
        pageNum = pageNum3;
        goForSecond = false;
        goForThird = false;
    } else if (goForSecond && (!goForThird)) {
        pageNum = pageNum2;
        goForSecond = false;
    }
    //    console.log(rootUrl);
    return pageNum;
}

//Detect the number and type of selection and assign Text or Image accordingly
function assignContentToSelection(selection, summaryResponse, jsonResponse, pageNum) {
    var rootUrl = jsonResponse.query.pages[pageNum];
    if (selection.items.length == 1) {
        if (selection.items[0].constructor.name == "Text") {
            fillText(selection.items[0], summaryResponse, pageNum);
        } else
            return fillImage(selection.items[0], rootUrl);
    } else if (selection.items.length == 2) {
        if (selection.items[0].constructor.name == "Text") {
            fillText(selection.items[0], summaryResponse, pageNum);
            return fillImage(selection.items[1], rootUrl);
        } else if (selection.items[1].constructor.name == "Text") {
            fillText(selection.items[1], summaryResponse, pageNum);
            return fillImage(selection.items[0], rootUrl);
        }
    }
}

//Perform filling the Image contatiner
async function fillImage(currentSelection, rootUrl) {
    try {
        if (rootUrl.original != null) {
            if (rootUrl.original.source.split(/\#|\?/)[0].split('.').pop().trim() != "svg") {
                const photoUrl = rootUrl.original.source;
                //            console.log(photoUrl);
                const photoObj = await xhrBinary(photoUrl);
                const tempFolder = await fs.getTemporaryFolder();
                const tempFile = await tempFolder.createFile("tmp", {
                    overwrite: true
                });
                await tempFile.write(photoObj, {
                    format: uxp.storage.formats.binary
                });
                const imageFill = new ImageFill(tempFile);
                currentSelection.fillEnabled = true;
                currentSelection.fill = imageFill;
            } else
                alert("SVG not supported", "The image available is an SVG image which is currently not supported by Wikify.")
        } else
            alert("Image unavailable", "An image is not available for the searched term.")
    } catch (err) {
        alert("Image unavailable", "An image is not available for the searched term.")
        console.log("Error:");
        console.log(err.message);
        currentSelection.fill = new Color("white");
        //        return alert("Please enter a valid text to Wikify. Also please select an image container or text container.");
    }
}

//Perform filling the Text container
function fillText(currentSelection, summaryResponse, pageNum) {
    try {
        //        var titleUrl = summaryResponse.query.pages[pageNum].title;
        //        console.log(summaryResponse.query.pages);
        var descriptionUrl = summaryResponse.query.pages[pageNum].extract;
        currentSelection.text = descriptionUrl;
    } catch (err) {
        alert("Text unavailable", "A text description for the searched term is not available.")
        console.log("Error:");
        console.log(err.message);
        currentSelection.text = "";
        //        return alert("Please select an image container or text container. Also please enter a valid text to Wikify.");
    }
}

//Parse URL to binary object
function xhrBinary(url) {
    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest();
        req.onload = () => {
            if (req.status === 200) {
                try {
                    const arr = new Uint8Array(req.response);
                    resolve(arr);
                } catch (err) {
                    reject('Couldnt parse response. ${err.message}, ${req.response}');
                }
            } else {
                reject('Request had an error: ${req.status}');
            }
        }
        req.onerror = reject;
        req.onabort = reject;
        req.open('GET', url, true);
        req.responseType = "arraybuffer";
        req.send();
    });
}

//Check validity and number of the selected elements
function checkSelection(selection) {
    //    console.log(selection.items[0].constructor.name);
    if (selection.items.length >= 1 && selection.items.length <= 2) {
        if (selection.items.length == 1) {
            if ((selection.items[0].constructor.name == "RepeatGrid") || (selection.items[0].parent.constructor.name == "RepeatGrid") || (selection.items[0].constructor.name == "Artboard")) {
                return "Repeat";
            } else if ((selection.items[0].parent.constructor.name != "RootNode") && (selection.items[0].parent.parent.constructor.name == "RepeatGrid")) {
                return "Repeat";
            } else if (selection.items[0].constructor.name == "SymbolInstance") {
                return "Symbol";
            } else if (selection.items[0].constructor.name == "Line") {
                return "Line";
            } else if (selection.items[0].constructor.name == "Group") {
                return "Group";
            } else
                return "Go";
        } else if (selection.items.length == 2) {
            if ((selection.items[0].constructor.name == "RepeatGrid") || (selection.items[1].constructor.name == "RepeatGrid") || (selection.items[0].parent.constructor.name == "RepeatGrid") || (selection.items[1].parent.constructor.name == "RepeatGrid") || (selection.items[0].constructor.name == "Artboard") || (selection.items[1].constructor.name == "Artboard")) {
                return "Repeat";
            } else if ((selection.items[0].parent.constructor.name != "RootNode") && (selection.items[0].parent.parent.constructor.name == "RepeatGrid")) {
                return "Repeat";
            } else if ((selection.items[0].constructor.name == "SymbolInstance") || (selection.items[1].constructor.name == "SymbolInstance")) {
                return "Symbol";
            } else if ((selection.items[0].constructor.name == "Group") || (selection.items[1].constructor.name == "Group")) {
                return "Group";
            } else if ((selection.items[0].constructor.name == "Line") || (selection.items[1].constructor.name == "Line")) {
                return "Line";
            } else {
                if (((selection.items[0].constructor.name == "Text") && (selection.items[1].constructor.name == "Text")) || ((selection.items[0].constructor.name != "Text") && (selection.items[1].constructor.name != "Text"))) {
                    return "NotTextImage";
                } else
                    return "Go";
            }
        }
    } else if (selection.items.length == 0) {
        return "NoneSelected";
    } else
        return "NumberExceed";
}

module.exports = {
    commands: {
        wikifyBegin: function (selection, root) {
            switch (checkSelection(selection)) {
                case "Repeat":
                    alert("Select different element(s)", "Repeat grids and Artboards are not supported currently. Please select different kind of element(s).");
                    break;
                case "Symbol":
                    alert("Select element(s) within Symbol", "One of the selected element is a Symbol. Please select elements within the Symbol and run the plugin again.");
                    break;
                case "Line":
                    alert("Lines not supported", "One of the selected element is a Line which cannot be a container for texts or images. Please select different element(s).");
                    break;
                case "Group":
                    alert("Select element(s) within Group", "One of the selected element is a Group. Please select elements within the Group and run the plugin again.");
                    break;
                case "NotTextImage":
                    alert("Select image/text containers only", "Please make sure that one of the 2 selected elements is an image container and the other is a text container.");
                    break;
                case "NumberExceed":
                    alert("Select maximum 2 elements", "Please select a maximum of 2 elements at a time.");
                    break;
                case "NoneSelected":
                    alert("No element(s) selected", "Select an element first and run the plugin.");
                    break;
                case "Go":
                    return new Promise((resolve, reject) => {
                        //The front-end
                        let dialog = document.createElement("dialog");
                        let pluginArea = document.createElement("div");
                        Object.assign(pluginArea.style, {
                            width: 300
                        });

                        let header = document.createElement("div");
                        header.innerHTML = "<p><img width='26px' style='position:fixed;right:40px;top:50px' src='images/wikifyIcon2.png'/><h1>Wikify</h1></p>";
                        Object.assign(header.style, {
                            id: "header",
                            width: "100%",
                            marginTop: 10
                        });
                        pluginArea.appendChild(header);

                        let line = document.createElement("hr");
                        pluginArea.appendChild(line);

                        let pluginDescription = document.createElement("h3");
                        pluginDescription.textContent = "Wikify helps to search and insert content from Wikpedia into your design. Please note that not all content have a free to use license and should be used only after acquiring the correct licenses.\n";
                        Object.assign(pluginDescription.style, {
                            id: "pluginDescription",
                            width: "100%",
                            alignItems: "left",
                            marginBottom: 16
                        });
                        pluginArea.appendChild(pluginDescription);

                        let searchDescription = document.createElement("P");
                        searchDescription.textContent = "Enter word(s) to search:";
                        Object.assign(searchDescription.style, {
                            id: "searchDescription",
                            width: "100%",
                            alignItems: "left",
                            marginBottom: 0
                        });
                        pluginArea.appendChild(searchDescription);

                        let search = document.createElement("input");
                        Object.assign(search.style, {
                            id: "search",
                            width: "98%",
                            alignItems: "left",
                            marginBottom: 0
                        });
                        search.addEventListener('keydown', evt => {
                            if (evt.keyCode == 13) {
                                if (search.value != "") {
                                    oldSearchQuery = search.value;
                                    dialog.close();
                                    resolve(search);
                                } else {
                                    errorDescription.textContent = "Please enter some text";
                                }
                            }
                        });
                        if (oldSearchQuery == "")
                            search.placeholder = "Eg. Steve Jobs";
                        else
                            search.value = oldSearchQuery;
                        pluginArea.appendChild(search);

                        let errorDescription = document.createElement("h3");
                        errorDescription.textContent = "             ";
                        Object.assign(errorDescription.style, {
                            marginBottom: 30,
                            color: "#E56B95"
                        });
                        pluginArea.appendChild(errorDescription);

                        let btnArea = document.createElement("div");
                        Object.assign(btnArea.style, {
                            width: "100%",
                            position: "relative",
                            left: "130px",
                            display: "flex"
                        });

                        let closeButton = document.createElement("button");
                        closeButton.setAttribute("uxp-variant", "secondary");
                        closeButton.textContent = "Close";
                        closeButton.addEventListener("click", function (ev) {
                            dialog.close();
                            reject();
                        });
                        Object.assign(closeButton.style, {
                            id: "closeButton",
                            width: "80px"
                        });
                        btnArea.appendChild(closeButton);

                        let wikifyButton = document.createElement("button");
                        wikifyButton.setAttribute("uxp-variant", "cta");
                        wikifyButton.textContent = "Wikify";
                        wikifyButton.addEventListener("click", function (ev) {
                            if (search.value != "") {
                                oldSearchQuery = search.value;
                                dialog.close();
                                resolve(search);
                            } else {
                                errorDescription.textContent = "Please enter some text";
                            }
                        });
                        Object.assign(wikifyButton.style, {
                            id: "closeButton",
                            width: "80px",
                            display: "flex"
                        });
                        btnArea.appendChild(wikifyButton);

                        pluginArea.appendChild(btnArea);

                        dialog.appendChild(pluginArea);
                        document.body.appendChild(dialog);
                        //                dialog.showModal();
                        dialog.showModal()
                            .then(result => {
                                if (result == "reasonCanceled") {
                                    console.log("Wikify closed");
                                    reject();
                                }
                            });
                    }).then(function (search) {
                        return beginWiki(selection, root, search.value);
                    }).catch((err) => {
                        console.log(err);
                    });
                    break;
            }

        }


    }
};
