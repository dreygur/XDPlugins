const {
    selection
} = require("scenegraph");
const environment = require('./storage-helper');

class smartPointRemoval {

    /**
     * Setting API token
     * @param {string} api 
     */
    static async setToken(api) {
        this.api = api;
    }

    /**
     * Setting endpoints to call the API
     * @param {string} endpoint - full address
     */
    static async setEndpoint(endpoint) {
        this.endpoint = endpoint;

    }

    /**
     * Rounding the float to an int and printing it in the representative div
     * 
     * @param {float} value
     */
    static roundParameters(value) {
        const inputText = document.getElementById("tolerance_value");
        inputText.textContent = Math.round(value.value);
    }

    /**
     * Creating the dialog and calling optimisation method
     * 
     * @param  {[type]} selection
     */
    static async processData() {

        const dialog = this.getDialog();

        const r = await dialog.showModal();
        if ((r) && (r !== "reasonCanceled")) {
            return this.getAllPath(r);
        }

    }
    /**
     * This method creates a ui for a dialog that alerts the user that the have to set settings for Smart Point Removal (SPR).
     * it combines HTML and JS together and could be written better. This exists to show multiple ways of handling the ui
     * 
     * @param {string} id
     */
    static getDialog(id = "options") {
        const $ = sel => document.querySelector(sel);
        const sel = `#${id}`;
        let options = document.querySelector(sel);
        if (options) {
            return options;
        }
        document.body.innerHTML = `
<style>
    ${sel} form {
        width: 300px;
    }
    .hint {
        margin-top: 10px;
        font-size: 10px;
    }
    .padding {
        padding-left: 5px;
    }
</style>
<dialog id="${id}">
    <form method="dialog">
        <h1>Smart Point Remove</h1>
        <label>
            <span>Set your Smart Point Removal tolerance</span>
            <input type="range" min="1" max="100" value="15" id="accuracy" />
            <div class="padding">
             <div id="tolerance_value">15</div>
             </div>
             <div class="hint padding">Hint: a minimum tolerance of 1 maintains the path shape but removes very few points. The maximum tolerance of 100 removes many more points but can distort the shape. Try starting with a tolerance of 15 for good results.
            </div>
        </label>
        <footer>
            <button id="cancel">Cancel</button>
            <button type="submit" id="submit" uxp-variant="cta">Apply</button>
        </footer>
    </form>
</dialog>
`;

        options = document.querySelector(sel);
     
        const [form, submitButton, cancel, accuracy] = [`${sel} form`, "#submit", "#cancel", "#accuracy"].map(s => $(s));
       
        const submit = () => {
            options.close(Math.round(accuracy.value));

        };
        cancel.addEventListener("click", e => {
            options.close();
        });
        accuracy.addEventListener("input", e => {
            this.roundParameters(accuracy);
            e.preventDefault();
        });
        submitButton.addEventListener("click", e => {
            submit();
            e.preventDefault();
        });

        form.addEventListener("submit", e => {
            dialog.close(input.value);
            e.preventDefault();
        });

        return options;
    }

    /**
     * Getting all paths from selection and creating array of path and tolerance for each
     * this gets passed to getNewPaths method that in return calls the API 
     *
     * @param {*} selection
     * @param {*} tolerance
     */
    static getAllPath(tolerance) {

        const node = selection.items;
        let pathArray = new Array;

        node.forEach(function (childNode, i) {
            pathArray.push({
                path: childNode.pathData
            });
        });
        return this.getNewPaths(pathArray, tolerance);
    }


    /**
     * Redraws the paths by creating an array of fetch request with current data.
     * returns a Promise.all() -> which means that it won"t proceed with other methods until the promises/requests are resolved.
     * 
     * @param {*} selection
     * @param {*} array
     * @param {*} value
     */
    static getNewPaths(origPaths, tolerance) {
        let newPaths = new Array; //array of said requests
        let object = this;
        origPaths.forEach(async function (element) {
            newPaths.push(object.sprCallToApi(element.path, tolerance));

        });
        return Promise.all(newPaths)
            .then(data => this.placePaths(data));
    }


    /**
     * Redraws the paths  and throwns an exception if the paths objects have errors in them
     * @param {array} path 
     */
    static placePaths(path) {
        const node = selection.items;
        node.forEach(function (childNode, i) {
            if (path[i].error) {
                throw path[i].error + " - " + path[i].message;
            }
            childNode.pathData = path[i].path;
        });
    }

    /**
     * This is used to call our Smart Points Removal function on the API with the tolerance set by the user via the UI
     * Includes some minor error handling too, if the token is expired reset it and create object for alerting the user
     *
     * @param {*} body original path!
     * @param {*} accuracy option selected
     */
    static async sprCallToApi(body, accuracy) {
        const api_token = this.api;
        const endpoint = this.endpoint;
        let response = await fetch(endpoint, {

            method: "post",
            headers: {
                "Cache-Control": "no-cache",
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json"
            },
            body: "api_token=" + api_token + "&path=" + body + "&tolerance=" + accuracy + "&decimal=1",
        });
        const status = response.status;
        let error = response.statusText;

        if (status == 200) {
            let data = await response.json();
            return data;
        } else {
            if ((status == 401) || (status == 402)) {
                await environment.set("api_token", "");
                error = "Unauthorised or expired. Check your token.";
            }

            let data = {
                "path": body,
                "error": status,
                "message": error,
            };
            return data;
        }

    }


}

module.exports = smartPointRemoval;