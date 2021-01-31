const { ImageFill } = require("scenegraph");
const { alert, error } = require("./lib/dialogs");
const uxp = require("uxp").storage;
const fs = uxp.localFileSystem;

// Generate and show the dialog and get user's input 
async function showDialog() {
    let buttons = [
        { label: "Cancel", variant: "primary" },
        { label: "Generate Posters", variant: "cta", type: "submit" }
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
                <span>Movie Posters</span>
                <img class="plugin-icon" src="images/logo2.png" />
            </h1>
            <hr />
            <div class="container">
                <p>Please enter the criteria you want to apply. </p> 
                        <label>
                            <span>Search titles by release year</span>
                            <input type="text" id="movieYear" placeholder="Example: 1997" tabindex="1"/>
                        </label>
                        <label>
                            <span>Filter by genre</span>
                            <select id="movieGen" tabindex="2">
                                <option value="28">Action</option>
                                <option value="12">Adventure</option>
                                <option value="16">Animation</option>
                                <option value="35">Comedy</option>
                                <option value="18">Drama</option>
                                <option value="27">Horror</option>
                                <option value="10749">Romance</option>
                                <option value="878">Science Fiction</option>
                                <option value="53">Thriller</option>
                            </select>
                        </label>
                <p id="credits">Note: This plugin uses the The Movie Database API that allows you to generate maximum 20 movie posters at a time.</p>                    
            </div>
            <footer>
                ${buttons.map(({label, type, variant} = {}, idx) => `<button id="btn${idx}" type="${type}" uxp-variant="${variant}">${label}</button>`).join('')}
            </footer>
        </form>
            `;

    dialog.querySelector("#movieGen").selectedIndex = -1;

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
                    year: dialog.querySelector('#movieYear').value,
                    genre: dialog.querySelector('#movieGen').value
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
async function generatePosters(selection) {
    const totalObjCount = selection.items.length;
    // Nothing was selected, show error message.
    if (totalObjCount === 0) {
        await error(
            "Selection Error",
            "Please select some layers.",
            "Supported layers are rectangle and ellipse."
         );
        return ;
    }

    // Unsupported layer was selected, show error message.
    else if (totalObjCount === 1 && (selection.items[0].constructor.name !== "Rectangle" && selection.items[0].constructor.name !== "Ellipse")) {
        await error(
            "Selection Error",
            "Please select only rectangle and ellipse layers."
         );
        return ;
    }

    // At least one supported layer was selected, we can display the dialog.
    else {
        const response = await showDialog();
        const selGenre = encodeURIComponent(response.values.genre);
        const selYear = encodeURIComponent(response.values.year);

        // User has pressed Cancel in the dialog, nothing happens. 
        if (response.which === 0) { 
            return;
        }

        // User hasn't applied search criteria, show error message
        else if (selGenre === 'undefined' && selYear === '') {
            await error(
            "Criteria Selection Error",
            "Please input criteria."
         );
        return ;
        }

        // Everything's OK and valid, let's do some magic!
        const apiKey = "26630c4ce58372e3fed6a6fc38a8e924";
        let url;

        // No genre, only release year was provided
        if (selGenre === 'undefined' && selYear !== '') {
            url = "https://api.themoviedb.org/3/discover/movie?"+
            "api_key=" + apiKey +
            "&page=1" +
            "&year=" + encodeURIComponent(response.values.year) +
            "&append_to_response=images"+
             "&include_image_language=en,null"; }

        // No release year, only movie genre was provided
        else if (selGenre !== 'undefined' && selYear === '' ) {
            url = "https://api.themoviedb.org/3/discover/movie?"+
            "api_key=" + apiKey +
            "&page=1" +
            "&with_genres=" + encodeURIComponent(response.values.genre) +
            "&append_to_response=images"+
             "&include_image_language=en,null"; }

        // Both release year and movie genre were provided
        else {
            url = "https://api.themoviedb.org/3/discover/movie?"+
            "api_key=" + apiKey +
            "&page=1" +
            "&year=" + encodeURIComponent(response.values.year) +
            "&with_genres=" + encodeURIComponent(response.values.genre) +
            "&append_to_response=images"+
             "&include_image_language=en,null";
        }
        
         return fetch(url)
            .then(function (response) {
                return response.json();
            })
            .then(function (jsonResponse) {
                return downloadImage(selection, jsonResponse, totalObjCount);
            });
         }

        
    }

/* Download images based on json response */
async function downloadImage(selection, jsonResponse, totalObjCount) {
    for (let i=0; i<totalObjCount; i++) {
        try {
            const photoUrl = 'https://image.tmdb.org/t/p/w500' + jsonResponse.results[i]['poster_path'];
            const photoObj = await xhrBinary(photoUrl);
            const tempFolder = await fs.getTemporaryFolder();
            const tempFile = await tempFolder.createFile("tmp", { overwrite: true });
            await tempFile.write(photoObj, { format: uxp.formats.binary });
            applyImagefill(selection.items[i], tempFile);
        } catch (err) {
            console.log("error")
            console.log(err.message);
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
        generatePosters
    }
}