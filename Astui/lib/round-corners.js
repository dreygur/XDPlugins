const {
    selection
} = require("scenegraph");
const commands = require("commands");
const environment = require("./storage-helper");
const svgHelper = require("./svg-helper");

class roundCorners {

    /**
     * Setting API token that acts as the authentication for this request
     * @param {string} api 
     */
    static async setToken(api) {
        this.api = api;
    }

    /**
     * Setting endpoint for this operation of the API
     * @param {string} endpoint - full address
     */
    static async setEndpoint(endpoint) {
        this.endpoint = endpoint;

    }

    /**
     * Initiating the UI dialogue for getting values from the user then proceeding with the data if the dialog isn't dismissed
     */
    static async processData() {
        const values = this.createDialog();
        const radius = await document.body.appendChild(values).showModal();
        if ((radius) && (radius !== "reasonCanceled")) {
            return this.getPathData(radius);
        }
    }

    /**
     * Creating the UI itself.
     * Allows user to input the corner radius they desire, this gets returned when the dialog is submitted
     * The last selected value is remains in the dialog window
     * 
     */
    static createDialog() {
        let dialog = document.createElement("dialog");
        dialog.style.width = "300px";

        const form = document.createElement("form");
        dialog.appendChild(form);

        const text = document.createElement("h1");
        text.textContent = "Corners";
        text.style.marginBottom = "10px";
        form.appendChild(text);

        const messageWrapper = document.createElement("section");
        const labelWrapper = document.createElement("label");
        const label = document.createElement("span");
        label.textContent = "Corner Radius";
        labelWrapper.appendChild(label);
        const input = document.createElement("input");
        input.type = "number";
        input.style.width = "225px";
        input.value = this.input ? this.input : 5;
        labelWrapper.appendChild(input);

        const intro = document.createElement("div");
        intro.textContent = "Hint: Rounded corners will be added to all non-smooth points on any path shape. If a corner radius is too large to fit, it will not be added.";
        intro.style.fontSize = "10px";
        intro.style.marginTop = "10px";
        labelWrapper.appendChild(intro);
        messageWrapper.appendChild(labelWrapper);
        form.appendChild(messageWrapper);

        const footer = document.createElement("footer");
        footer.style.marginTop = "10px";
        footer.style.paddingBottom = "5px";
        footer.className = "row";
        footer.style.borderBottom = "1px solid #ddd";
        form.appendChild(footer);

        const apply = document.createElement("button");
        apply.uxpVariant = "cta";
        apply.textContent = "Apply";
        const cancel = document.createElement("button");
        cancel.textContent = "Cancel";
        footer.appendChild(cancel);
        footer.appendChild(apply);
        
        const clarification = document.createElement("div");
        clarification.textContent = "Unfortunately XD doesn't yet allow plugins to control individual points, which Astui is ready to immediately take advantage of.";
        clarification.style.fontSize = "10px";
        clarification.style.marginTop = "10px";
        form.appendChild(clarification);
        
        apply.addEventListener("click", e => {
            dialog.close(input.value);
            e.preventDefault();
            this.input = input.value;
        });

        cancel.addEventListener("click", e => {
            dialog.close();
            e.preventDefault();
        });
        form.addEventListener("submit", e => {
            dialog.close(input.value);
            e.preventDefault();
            this.input = input.value;
        });
        return dialog;
    }

    /**
     * This will allow us to get path data from each of the object on the screen. 
     * This also gets the array of points that this path has to round all corners. 
     * Once we can get a specific point selected, the array will be replaced by the array of points selected.
     * 
     * @param {*} radius - user defined radius
     * @returns {Promise<*>} chaining into a redrawing method
     */
    static getPathData(radius) {

       
        const node = selection.items;
        let pathArray = new Array;
        let object = this;
        node.forEach(function (childNode, i) {
            pathArray.push({
                path: childNode.pathData,
                points: svgHelper.getPointsArray(childNode.pathData)
            });
        });
        return object.getNewPaths(pathArray, radius);
    }

    /**
     * Creates an array of Promises, sending current path data to the API and getting the reworked data back. This then is sent to a redrawing method
     * @param {array} array - array of objects with paths and points
     * @param {*} radius radius selected by the user
     * @returns {Promise<*>} resolved array of requests and the paths 
     */
    static getNewPaths(array, radius) {

        let newPaths = new Array;
        let object = this;
        array.forEach(async function (element) {
            newPaths.push(object.roundCornersAPI(element.path, element.points, radius));

        });

        return Promise.all(newPaths)
            .then(data => this.placePaths(data));
    }

    /**
     * Replacing selected object paths with the newly processed paths from the API
     * if the object has error properties, throws an error, stopping other operations
     * @param {array} path 
     */
    static placePaths(path) {
        const node = selection.items; //getting array of current paths
        
        node.forEach(function (childNode, i) {
            if (path[i].error) {
                throw path[i].error + " - " + path[i].message;
            }
            childNode.pathData = path[i].path;
        });
    }


    /**
     * API Call using user defined properties, current path information and array of points to be affected, if the call is unsuccessful and has an error
     * it builds error information into the object's response with the current path, so no artwork disappears
     * @param {string} body path
     * @param {*} array array of points selected
     * @param {*} radius selected by the user
     * @returns {JSON} data - processed path
     */
    static async roundCornersAPI(body, array, radius) {

        //get api_token
        const api_token = this.api;
        //waiting for the request to complete
        let response = await fetch(this.endpoint, {
            method: "post",
            headers: {
                "Cache-Control": "no-cache",
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json"
            },
            body: "api_token=" + api_token + "&path=" + body + "&radius=" + radius + "&indices=" + array,
        });

        const status = response.status;
        let error = response.statusText;
        //wait for the request to send a response and return it
        if (status == 200) {
            let data = await response.json();
            return data;
        } else {
            //a bit of error handling, when we process a f
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

module.exports = roundCorners;