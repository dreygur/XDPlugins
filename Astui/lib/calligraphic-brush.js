const {
    selection
} = require("scenegraph");
const commands = require("commands");
const environment = require("./storage-helper");

class calligraphicBrush {

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
     * Initiates the dialog window, based on the actions taken either proceeds with gathering paths or does nothing.
     */
    static async processData() {
        const values = this.createDialog();
        const options = await document.body.appendChild(values).showModal();
        if ((options) && (options !== "reasonCanceled")) {
            return this.getPathData(options);
        }
    }

    /**
     * The dialog's UI. This allows the user to set their own custom values that are sent with the request to the server.
     * Rounded parameter represents brush roundness (100% means completely round an 1% only a little round, 
     * these digits are processed into floats
     * since the API requires a float between 0 and 1;
     * Angle and Width are numeric values, where angle can have negative values (negative angles) and width start from 1px
     * 
     */
    static createDialog() {
        let dialog = document.createElement("dialog");
        dialog.style.width = "300px";
        //form
        const form = document.createElement("form");
        dialog.appendChild(form);

        const text = document.createElement("h1");
        text.textContent = "Calligraphic Brush";
        text.style.marginBottom = "10px";
        form.appendChild(text);

        const error = document.createElement("div");
        error.style.color = "red";
        form.appendChild(error);

        const div = document.createElement("div");
        div.className = "row";
        form.appendChild(div);


        const labelWrapper = document.createElement("label");
        const labelConnection = document.createElement("div");
        labelConnection.className = "row";
        labelConnection.style.justifyContent = "space-between";
        labelWrapper.appendChild(labelConnection);

        const label = document.createElement("span");
        label.textContent = "Roundness";
        labelConnection.appendChild(label);
        const percentage = document.createElement("span");
        percentage.textContent = this.roundness ? this.roundness : 20 + "%";
        labelConnection.appendChild(percentage);

        const roundness = document.createElement("input");
        roundness.type = "range";
        roundness.min = 1;
        roundness.max = 100;
        roundness.value = this.roundness ? this.roundness : 20;
        roundness.style.width = "220px";
        labelWrapper.appendChild(roundness);
        div.appendChild(labelWrapper);

        const subDiv = document.createElement("div");
        subDiv.className = "row";
        form.appendChild(subDiv);

        const labelAngle = document.createElement("label");
        const angle = document.createElement("span");
        angle.textContent = "Angle";
        labelAngle.appendChild(angle);

        const wrapperAngleInput = document.createElement("div");
        wrapperAngleInput.className = "row";

        const angleInput = document.createElement("input");
        angleInput.type = "number";
        angleInput.value = this.angle ? this.angle : -45;
        angleInput.style.width = "60px";
        angleInput.min = -360;
        angleInput.max = 360;

        const degreeSign = document.createElement("div");
        degreeSign.textContent = "°";

        wrapperAngleInput.appendChild(angleInput);
        wrapperAngleInput.appendChild(degreeSign);

        labelAngle.appendChild(wrapperAngleInput);

        subDiv.appendChild(labelAngle);

        const wrapperWidth = document.createElement("label");
        const labelWidth = document.createElement("span");
        labelWidth.textContent = "Width";
        wrapperWidth.appendChild(labelWidth);

        const wrapperWidthInput = document.createElement("div");
        wrapperWidthInput.className = "row";

        const widthInput = document.createElement("input");
        widthInput.style.width = "60px";
        widthInput.type = "number";
        widthInput.min = 1;
        widthInput.value = this.widthInput ? this.widthInput : 20;

        const units = document.createElement("div");
        units.textContent = "px";
        wrapperWidthInput.appendChild(widthInput);
        wrapperWidthInput.appendChild(units);
        wrapperWidth.appendChild(wrapperWidthInput);
        subDiv.appendChild(wrapperWidth);

        const footer = document.createElement("footer");
        footer.style.marginTop = "10px";
        footer.style.paddingTop = "5px";
        footer.className = "row";
        footer.style.borderTop = "1px solid #ddd";
        form.appendChild(footer);


        const apply = document.createElement("button");
        apply.uxpVariant = "cta";
        apply.textContent = "Apply";
        const cancel = document.createElement("button");
        cancel.textContent = "Cancel";
        footer.appendChild(cancel);
        footer.appendChild(apply);

        //actions
        roundness.addEventListener("input", e => {
            percentage.textContent = Math.round(roundness.value).toString() + "%";
        });
        angleInput.addEventListener("input", e => {
            if ((angleInput.value >= 360) || (angleInput.value <= -360)) {
                error.textContent = "The angle " + angleInput.value + " is impossible!";
            } else {
                error.textContent = "";
            }
        });
        apply.addEventListener("click", e => {
            if ((angleInput.value <= 360) && (angleInput.value >= -360)) {
            
                let options = {
                    roundness: Math.round(roundness.value) / 100,
                    angle: angleInput.value,
                    width: widthInput.value,
                };
                dialog.close(options);
                e.preventDefault();
                this.angleInput = options.angle;
                this.roundness = Math.round(roundness.value);
                this.widthInput = options.width;
            } else {
                e.preventDefault();
            }
        });

        cancel.addEventListener("click", e => {
            dialog.close();
            e.preventDefault();
        });
        form.addEventListener("submit", e => {
              if ((angleInput.value <= 360) && (angleInput.value >= -360)) {

                let options = {
                    roundness: Math.round(roundness.value) / 100,
                    angle: angleInput.value,
                    width: widthInput.value,
                };
                
                dialog.close(options);
                e.preventDefault();
                this.angleInput = options.angle;
                this.roundness = Math.round(roundness.value);
                this.widthInput = options.width;
            } else {
                e.preventDefault();
            }
        });

            return dialog;
  
    }




    /**
     *  Uses Path object properties to get the data for the API calls
     *  where each object has a path (Path.pathData) and the colour of the stroke or fill if no stroke is available.
     *  This is due this tool mostly being used with bezier pen and paths created don't usually have a fill
     * 
     * @param {*} options - options defined by the UI
     * @returns {Promise<*>} chaining into a redrawing method
     */
    static getPathData(options) {

        const node = selection.items;
        let pathArray = new Array;
        let object = this;
        node.forEach(function (childNode, i) {
            pathArray.push({
                path: childNode.pathData,
                color: childNode.stroke ? childNode.stroke : childNode.fill,
            });
        });
        return object.getNewPaths(pathArray, options);
    }


    /**
     * Creates an array of Promises, sending current path data to the API and getting the reworked data back. This then is sent to a redrawing method
     * @param {array} array - array of objects with paths and points
     * @param {*} options - defined by the user parameters
     * @returns {Promise<*>} resolved array of requests and the paths 
     */
    static getNewPaths(array, options) {

        let newPaths = new Array; //array of said requests
        let object = this;
        array.forEach(async function (element) {
            newPaths.push(object.callCalligraphicBrushAPI(element, options.roundness, options.angle, options.width));

        });
        return Promise.all(newPaths)
            .then(data => this.placePaths(data));
    }

    /**
     * Redrawing all the paths with the newly received ones without distorting the colours.
     * We also remove all strokes, since they're not needed anymore.
     * This also throws and error if the object has error properties, stopping the other processing
     * @param {array} path 
     */
    static placePaths(path) {
        const node = selection.items;
        node.forEach(function (childNode, i) {
            if (path[i].error) {
                throw path[i].error + " - " + path[i].message;
            }
            childNode.pathData = path[i].path;
            childNode.fillEnabled = true;
            childNode.fill = path[i].color;
            childNode.strokeEnabled = false;
        });
    }


    /**
     * API Call using user defined properties and current path information, if the call is unsuccessful and has an error
     * it builds error information into the object's response with the current path, so no artwork disappears
     * @param {string} body path
     * @param {*} array array of points selected
     * @param {*} radius selected by the user
     * @returns {JSON} data - processed path
     */
    static async callCalligraphicBrushAPI(body, roundness, angle, width) {

        const api_token = this.api;
        let response = await fetch(this.endpoint, {
            method: "post",
            headers: {
                "Cache-Control": "no-cache",
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json"
            },
            body: "api_token=" + api_token + "&path=" + body.path + "&roundness=" + roundness + "&angle=" + angle + "&width=" + width,
        });

        const status = response.status;
        let error = response.statusText;
        if (status == 200) {
            let data = await response.json();
            data = {
                path: data.path,
                color: body.color
            }
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

module.exports = calligraphicBrush;