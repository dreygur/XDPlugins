//defining const objects that we are pulling from scenegraph API
const {
    selection
} = require("scenegraph");
const commands = require("commands");
const environment = require("./lib/storage-helper");
const svgHelper = require("./lib/svg-helper");
const smartPointRemoval = require("./lib/smart-point-removal");
const tangencies = require("./lib/tangencies");
const strokeOutline = require("./lib/outline");
const offsetPath = require("./lib/offset");
const roundCorners = require("./lib/round-corners");
const removeCorners = require("./lib/remove-corners");
const calligraphicBrush = require("./lib/calligraphic-brush");
const longShadow = require("./lib/long-shadows");



const $ = sel => document.querySelector(sel);

let alertMessage;

/**
 * @NOTE: API RELATED 
 */
 
const spr = gettingEndpoints("spr");
const tangenciesEndpoint = gettingEndpoints("tangencies");
const validate = gettingEndpoints("validate");
const outline = gettingEndpoints("outline");
const offset = gettingEndpoints("offset");
const roundedApi = gettingEndpoints("rounded");
const remove = gettingEndpoints("removerounded");
const calligraphic = gettingEndpoints("calligraphic");
const longShadowEndpoint = gettingEndpoints("longshadow");
/**
 * Getting the endpoint from the settings file
 * Or creating the file if no file is created with the base url
 * @param {string} operation 
 */
async function gettingEndpoints(operation) {
    const url = await environment.get("server", "https://astui.tech/api/v1/");
    await environment.get("api_token", "");
    return url + operation;
}

/**
 * Validation request
 * Server request to validate endpoint, validating the token that is sent with it
 * 
 * @param {} token - string user specified token
 */
async function checkAuth(token) {
    const authentication = await fetch(await validate, {
        method: "post",
        headers: {
            "Cache-Control": "no-cache",
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json"
        },
        body: "api_token=" + token,
    });
    let response = await authentication.json();

    return response;

}

/**
 * Creates modal that prompts user to insert their API token,
 * the token is verified and if valid, the prompt closes and passes the token to env variable to set.
 * When the token is invalid or empty, the prompt displays an error until the user dismisses or puts in a valid token
 *
 * @param {Creating a} id
 * @return the api token
 */
function insertApiKey(id = "api") {
    const sel = `#${id}`;
    let apiInput = document.querySelector(sel);

    if (apiInput) {
        return apiInput;
    }

    document.body.innerHTML = `
    <style>
    input[type="text"] {
        width: 400px;
    }
    #error {
        color: red;
        height: 15px;
        font-size: 12px;
    }
    .info_text {
        text-align: left;
    }
    </style>
    <dialog id="${id}">
        <form method="dialog">
            <h1>Astui API Token</h1>
            <label>
                <span>Insert your Astui API token:</span>
                <input type="text" id="api_token" />
                <div id="error"></div>
                <div class="info_text">
                <p>Don't have an Astui API Token? <a href="https://astui.tech" target=_"blank">Get one here.</a></p>
                </div>
                <footer>
            </label>
       
                <button type="submit" id="submit" uxp-variant="cta">Apply</button>
            </footer>
        </form>
    </dialog>

    `;
    apiInput = document.querySelector(sel);

    const [form, submitButton, token, error] = [`${sel} form`, "#submit", "#api_token", "#error"].map(s => $(s));
    //defining different behaviours for each of the actionable fields
    const submit = () => {
        return checkAuth(token.value)
            .then(response => {
                if (response.message == "Authenticated") {
                    error.textContent = "";
                    return apiInput.close(token.value);

                } else {

                    error.textContent = "Sorry, Astui API token invalid.";
                    token.value = "";
                }
            }).catch(function (err) {
                err.textContent = "";
                token.value = "";
                return apiInput.close(token.value);
            });

    }
    token.addEventListener("change", e => {
        e.preventDefault();
    });

    submitButton.addEventListener("click", e => {
        submit();
        e.preventDefault();
    });

    form.addEventListener("submit", e => {
        apiInput.close(token.value);
        e.preventDefault();
    });

    return apiInput;
}

/**
 * Creates the generic error dialog that is used throughout this file
 * 
 * @param error - string, the error that is displayed
 */
function createAlert(error) {
    if (alertMessage == null) {
        
        alertMessage = document.createElement("dialog");
        const text = document.createElement("h1");
        text.textContent = "Alert!";
        alertMessage.appendChild(text);
        const message = document.createElement("p");
        message.textContent = error;
        message.style.padding = "20px 0";

        alertMessage.appendChild(message);
        let footer = document.createElement("footer");
        alertMessage.appendChild(footer);
        let closeButton = document.createElement("button");
        closeButton.uxpVariant = "cta";
        closeButton.textContent = "Got It!";
        closeButton.onclick = (e) => alertMessage.close();
        footer.appendChild(closeButton);

    }
    return alertMessage;
}




/**
 * Instantiates the API Token dialog and gets its return,
 * This is then set as the token in our settings file, only of there is a token to insert.
 * Dismissal of the dialog brings up an error.
 */
async function createApiDialogue() {
    const dialog = insertApiKey();

    const r = await dialog.showModal();
    if ((r !== "") && (r !== "reasonCanceled")) {
        await environment.set("api_token", r);
        return r;
    } else {
        throw new Error("No API Key inserted");
    }
}


/**
 * Call to Smart Point Removal module, but before preforming operations, it checks whether the artwork is selected and if it's too big, ensuring the plugin operates smoothly. If everything is fine,
 * the method checks for an API token, so that the user doesn't have to input it every time an operation is run. The user gets prompted with an "insert API token" dialog if the file is empty.
 * If there are errors with the request or something else with the artwork, the user is prompted with the error message and operations are stopped.
 */
async function apiCheckSpr() {

    if (selection.items[0] == null) {
        document.body.appendChild(createAlert("Oh no! You haven't selected anything.")).showModal();
    } else {
        const size = calculatePaths();
        if (size) {
            const apiCheck = await environment.get("api_token");
            smartPointRemoval.setEndpoint(await spr);
            if ((!apiCheck) || (apiCheck == "reasonCanceled") ) {
                return createApiDialogue().then(data => smartPointRemoval.setToken(data))
                    .then(data => smartPointRemoval.processData())
                    .catch(error => document.body.appendChild(createAlert(error)).showModal());
            } else {

                smartPointRemoval.setToken(apiCheck);
                return await smartPointRemoval.processData().catch(error => document.body.appendChild(createAlert(error)).showModal());

            }
        }
    }
}

/**
 * Call to tangencies module, but before preforming operations, it checks whether the artwork is selected and if it's too big, ensuring the plugin operates smoothly. If everything is fine,
 * the method checks for an API token, so that the user doesn't have to input it every time an operation is run. The user gets prompted with an "insert API token" dialog if the file is empty.
 * If there are errors with the request or something else with the artwork, the user is prompted with the error message and operations are stopped.
 */
async function apiCheckTangencies() {
    if (selection.items[0] == null) {
        document.body.appendChild(createAlert("Oh no! You haven't selected anything.")).showModal();
    } else {

        const size = calculatePaths();
        if (size) {
            const apiCheck = await environment.get("api_token");
            tangencies.setEndpoint(await tangenciesEndpoint);
            if ((!apiCheck) || (apiCheck == "reasonCanceled")) {
                return createApiDialogue().then(data => tangencies.setToken(data))
                    .then(data => tangencies.processData())
                    .catch(error => document.body.appendChild(createAlert(error)).showModal());
            } else {
                //sets the api and enpoints and processes the selection

                tangencies.setToken(apiCheck);
                return await tangencies.processData().catch(error => document.body.appendChild(createAlert(error)).showModal());

            }
        }
    }

}

/**
 * Call to Outline Stroke module, but before preforming operations, it checks whether the artwork is selected and if it's too big, ensuring the plugin operates smoothly. If everything is fine,
 * the method checks for an API token, so that the user doesn't have to input it every time an operation is run. The user gets prompted with an "insert API token" dialog if the file is empty.
 * If there are errors with the request or something else with the artwork, the user is prompted with the error message and operations are stopped.
 * 
 */
async function apiCheckStroke() {
    if (selection.items[0] == null) {
        document.body.appendChild(createAlert("Oh no! You haven't selected anything.")).showModal();
    } else {

        const size = calculatePaths();
        if (size) {
            strokeOutline.setEndpoint(await outline);
            const apiCheck = await environment.get("api_token");
            if ((!apiCheck) || (apiCheck == "reasonCanceled")) {
                return createApiDialogue().then(data => strokeOutline.setToken(data))
                    .then(data => strokeOutline.processData())
                    .catch(error => document.body.appendChild(createAlert(error)).showModal());
            } else {
                strokeOutline.setToken(apiCheck);
                return await strokeOutline.processData().catch(error => document.body.appendChild(createAlert(error)).showModal());
            }
        }

    }
}

/**
 * Calls to Offset module, but before preforming operations, it checks whether the artwork is selected and if it's too big, ensuring the plugin operates smoothly. If everything is fine,
 * the method checks for an API token, so that the user doesn't have to input it every time an operation is run. The user gets prompted with an "insert API token" dialog if the file is empty.
 * If there are errors with the request or something else with the artwork, the user is prompted with the error message and operations are stopped.
 */
async function apiCheckOffset() {
    if (selection.items[0] == null) {
        document.body.appendChild(createAlert("Oh no! You haven't selected anything.")).showModal();
    } else {

        const size = calculatePaths();
        if (size) {

            offsetPath.setEndpoint(await offset);
            const apiCheck = await environment.get("api_token");
            if ((!apiCheck) || (apiCheck == "reasonCanceled")) {
                return createApiDialogue().then(data => offsetPath.setToken(data))
                    .then(data => offsetPath.processData())
                    .catch(error => document.body.appendChild(createAlert(error)).showModal());
            } else {
                offsetPath.setToken(apiCheck);
                return await offsetPath.processData().catch(error => document.body.appendChild(createAlert(error)).showModal());
            }
        }
    }
}

/**
 * Calls Rounded Corners, but before it can be processed checking the artwork if it's too big, then checks whether the user has previously set API token.
 * If artwork is fine and the token is fine, processes further, if there are errors (unauthorised, artwork too big, server time out) the user is prompted with the error message 
 * and no alterations are done in the artwork. 
 */
async function apiRoundCorner() {
    if (selection.items[0] == null) {
        document.body.appendChild(createAlert("Oh no! You haven't selected anything.")).showModal();
    } else {

        const size = calculatePaths();
        if (size) {
            roundCorners.setEndpoint(await roundedApi);
            const apiCheck = await environment.get("api_token");
            

            if ((!apiCheck) || (apiCheck == "reasonCanceled")) {
                return createApiDialogue().then(data => roundCorners.setToken(data))
                    .then(data => roundCorners.processData())
                    .catch(error => document.body.appendChild(createAlert(error)).showModal());
            } else {
                roundCorners.setToken(apiCheck);
                return await roundCorners.processData().catch(error => document.body.appendChild(createAlert(error)).showModal());
            }
        }
    }
}

/**
 * Calls Remove Rounded Corners, but before it can be processed checking the artwork if it's too big, then checks whether the user has previously set API token.
 * If artwork is fine and the token is fine, processes further, if artwork too big - errors and cancels processing, if unauthorised - asks for a token and after verification proceeds.
 */
async function apiRemoveRounded() {
    if (selection.items[0] == null) {
        document.body.appendChild(createAlert("Oh no! You haven't selected anything.")).showModal();
    } else {
        const size = calculatePaths();
        if (size) {
            const apiCheck = await environment.get("api_token");

            removeCorners.setEndpoint(await remove);
            if ((!apiCheck) || (apiCheck == "reasonCanceled")) {
                return createApiDialogue().then(data => removeCorners.setToken(data))
                    .then(data => removeCorners.processData())
                    .catch(error => document.body.appendChild(createAlert(error)).showModal());
            } else {
                //sets the api and enpoints and processes the selection
                removeCorners.setToken(apiCheck);
                return await removeCorners.processData().catch(error => document.body.appendChild(createAlert(error)).showModal());

            }
        }
    }
}

/**
 * Calls Calligraphic brush, but before it can be processed checking the artwork if it's too big, then checks whether the user has previously set API token.
 * If artwork is fine and the token is fine, processes further, if artwork too big - errors and cancels processing, if unauthorised = asks for a token and after verification proceeds.
 */
async function apiCalligraphicBrush() {
    if (selection.items[0] == null) {
        document.body.appendChild(createAlert("Oh no! You haven't selected anything.")).showModal();
    } else {

        const size = calculatePaths();
        if (size) {
            const apiCheck = await environment.get("api_token");
            calligraphicBrush.setEndpoint(await calligraphic);

            if ((!apiCheck) || (apiCheck == "reasonCanceled")) {
                return createApiDialogue().then(data => calligraphicBrush.setToken(data))
                    .then(data => calligraphicBrush.processData())
                    .catch(error => document.body.appendChild(createAlert(error)).showModal());
            } else {
                calligraphicBrush.setToken(apiCheck);
                return await calligraphicBrush.processData().catch(error => document.body.appendChild(createAlert(error)).showModal());
            }
        }
    }
}

/**
 * Calls Long Shadow, but before it can be processed checking the artwork if it's too big, then checks whether the user has previously set API token.
 * If artwork is fine and the token is fine, processes further, if artwork too big - errors and cancels processing, if unauthorised = asks for a token and after verification proceeds.
 */
async function apiLongShadow() {
    if (selection.items[0] == null) {
        document.body.appendChild(createAlert("Oh no! You haven't selected anything.")).showModal();
    } else {

        const size = calculatePaths();
        if (size) {
            const apiCheck = await environment.get("api_token");
            longShadow.setEndpoint(await longShadowEndpoint);

            if ((!apiCheck) || (apiCheck == "reasonCanceled")) {
                return createApiDialogue().then(data => longShadow.setToken(data))
                    .then(data => longShadow.processData())
                    .catch(error => document.body.appendChild(createAlert(error)).showModal());
            } else {
                longShadow.setToken(apiCheck);
                return await longShadow.processData().catch(error => document.body.appendChild(createAlert(error)).showModal());
            }
        }
    }
}

/**
 *  Ungroups symbols and paths, converts them into instances of Path object, to get the data for the API calls
 *  where each object has a path (Path.pathData)
 */
function ungroupPaths() {

        let rand = 0;
        do {
            commands.ungroup();
            commands.convertToPath();
            rand++;

        } while (rand < 4);

    return true; 

}

/*
 * Calculating the paths and points, and letting the user know if cannot process
 */
function calculatePaths() {
    let paths  = ungroupPaths();
    if (paths) {
        const selectedGrid = selection.items;
        let pointTotal = 0;
    selectedGrid.forEach(element => {
        const points = svgHelper.getPointsArray(element.pathData);

        pointTotal += points.length;
    });
    if ((selectedGrid.length >= 160) || (pointTotal >= 5292)) {
        document.body.appendChild(createAlert("File's too big. You have " + selectedGrid.length + " paths and " + pointTotal + " points. We accept up to 160 paths and 5292 points")).showModal();
        return false;
    } else {
        return true;
    }
}

}
module.exports = {
    commands: {
        optionLoad: apiCheckSpr,
        moveTangencies: apiCheckTangencies,
        outlineStroke: apiCheckStroke,
        offsetPath: apiCheckOffset,
        roundCorner: apiRoundCorner,
        removeRoundedCorners: apiRemoveRounded,
        calligraphicBrush: apiCalligraphicBrush,
        longShadow: apiLongShadow,
    }
}