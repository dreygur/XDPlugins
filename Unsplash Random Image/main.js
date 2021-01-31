const { ImageFill } = require("scenegraph");
const { alert, error } = require("./lib/dialogs");
const uxp = require("uxp").storage;
const fs = uxp.localFileSystem;


// Generate and show the dialog and get user's input
async function showDialog() {
    let buttons = [
        { label: "Cancel", variant: "primary" },
        { label: "Get Image", variant: "cta", type: "submit" }
    ];

    const dialog = document.createElement('dialog');
    dialog.innerHTML = `
        <style>
            form {
                width: 400px;
            }
            .h1 {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
            }
            .h1 img {
                width: 18px;
                height: 18px;
                flex: 0 0 18px;
                padding: 0;
                margin: 0;
            }
            img.plugin-icon {
                border-radius: 4px;
                overflow: hidden;
            }
            .container {
                zoverflow-x: hidden;
                overflow-y: auto;
                height: auto;
            }
            .row {
                align-items: center;
            }
            .spread {
                justify-content: space-between;
            }
            p#credits {
                font-size: 12px!important;
                line-height: 14px!important;
                margin-top: 18px!important;
            }
        </style>
        <form method="dialog">
            <h1 class="h1">
                <span>Unsplash Random Image</span>
                <img class="plugin-icon" src="images/logo2.png" />
            </h1>
            <hr />
            <div class="container">
                <p>Please enter the criteria you want to apply. </p> 
                        <label>
                            <span>Search by title</span>
                            <input type="text" id="searchText" placeholder="Example: Office" tabindex="1"/>
                        </label>
                        <label>
                            <span>Filter by Type</span>
                            <select id="imageType" tabindex="2">
                                <option value="portrait">Portrait</option>
                                <option value="landscape">Landscape</option>
                                <option value="squarish">Squarish</option>
                            </select>
                        </label>
                <p id="credits">Note: This plugin uses the The Unsplash API.</p>                    
            </div>
            <footer>
                ${buttons.map(({label, type, variant} = {}, idx) => `<button id="btn${idx}" type="${type}" uxp-variant="${variant}">${label}</button>`).join('')}
            </footer>
        </form>
            `;

    dialog.querySelector("#imageType").selectedIndex = -1;

    let okButtonIdx = -1;
    let cancelButtonIdx = -1;
    let clickedButtonIdx = -1;

    const form = dialog.querySelector('form');
    form.onsubmit = () => dialog.close('ok');

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
            dialog.close( idx === cancelButtonIdx ? 'reasonCanceled' : 'ok');
        }
    });

    try {
        document.appendChild(dialog);
        const response = await dialog.showModal();
        if (response === 'reasonCanceled') {
            return {which: cancelButtonIdx, value: ''};
        } else {
            if (clickedButtonIdx === -1) {
                clickedButtonIdx = okButtonIdx;
            }
            return {
                which: clickedButtonIdx,
                values: {
                    search: dialog.querySelector('#searchText').value,
                    type: dialog.querySelector('#imageType').value
                }
            };
        }
    } catch(err) {
        return {which: cancelButtonIdx, value: ''};
    } finally {
        dialog.remove();
    }
}

// Generate posters query based on user's input
async function generateRandomImage(selection) {
    const totalObjCount = selection.items.length;
    // Nothing was selected, show error message.
    if (totalObjCount === 0) {
        await error("Selection Error", "Please select some layers.", "Supported layers are rectangle and ellipse." );
        return;
    }

    // Unsupported layer was selected, show error message.
    else if (totalObjCount === 1 && (selection.items[0].constructor.name !== "Rectangle" && selection.items[0].constructor.name !== "Ellipse")) {
        await error("Selection Error", "Please select only rectangle and ellipse layers." );
        return;
    }

    // Unsupported layer was selected, show error message.
    else if (totalObjCount > 30) {
        await error("Selection Error", "Please select less layer." );
        return;
    }

    // At least one supported layer was selected, we can display the dialog.
    else {
        const response = await showDialog();
        const searchText = encodeURIComponent(response.values.search);
        const imageType = encodeURIComponent(response.values.type);

        // Everything's OK and valid, let's do some magic!
        const apiKey = "70d2a939758ec596973eea8352f1e04b67b64b8167448936bbb976d13630b7df";
        let url;

        // User has pressed Cancel in the dialog, nothing happens.
        if (response.which === 0) {
            return;
        }

        // User hasn't applied search criteria, show error message
        else if (imageType === 'undefined' && searchText === '') {
            url = "https://api.unsplash.com/photos/random/?" +
              "client_id=" + apiKey +
              "&count=" + totalObjCount;
        }

        // No genre, only release year was provided
        else if (imageType === 'undefined' && searchText !== '') {
            url = "https://api.unsplash.com/search/photos/?" +
              "client_id=" + apiKey +
              "&page=1" +
              "&per_page=" + totalObjCount +
              "&query=" + encodeURIComponent(response.values.search);
        }

        // No release year, only movie genre was provided
        else if (imageType !== 'undefined' && searchText === '') {
            url = "https://api.unsplash.com/photos/random/?" +
              "client_id=" + apiKey +
              "&count=" + totalObjCount +
              "&orientation=" + encodeURIComponent(response.values.type);
        }

        // Both release year and movie genre were provided
        else {
            url = "https://api.unsplash.com/search/photos/?" +
              "client_id=" + apiKey +
              "&page=1" +
              "&per_page=" + totalObjCount +
              "&query=" + encodeURIComponent(response.values.search) +
              "&orientation=" + encodeURIComponent(response.values.type);
        }

        return fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function (response) {
            return response.json();
        }).then(function (jsonResponse) {
            return downloadImage(selection, jsonResponse, totalObjCount);
        });
    }
}

/* Download images based on json response */
async function downloadImage(selection, jsonResponse, totalObjCount) {
    for (let i=0; i<totalObjCount; i++) {
        try {
            const photoUrl = ( jsonResponse['results'] !== undefined ) ? jsonResponse['results'][i]['urls']['regular'] : jsonResponse[i]['urls']['regular'];
            const photoObj = await xhrBinary(photoUrl);
            const tempFolder = await fs.getTemporaryFolder();
            const tempFile = await tempFolder.createFile("tmp", { overwrite: true });
            await tempFile.write(photoObj, { format: uxp.formats.binary });
            applyImagefill(selection.items[i], tempFile);
        } catch (err) {
            console.log("error");
            console.log(err.message);
            await error("Oops!!", "Something went wrong!", "Please Try Later." )
        }
    }}

/* Convert image to Base64, used by downloadImage() */
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

/* Fill the node with Base64 Image, used by downloadImage() */
function applyImagefill(currItem, file) {
    const imageFill = new ImageFill(file);
    if (currItem.constructor.name === "Rectangle" || currItem.constructor.name === "Ellipse") {
        currItem.fill = imageFill;
    }
}

module.exports = {
    commands: {
        generateRandomImage: generateRandomImage
    }
}
