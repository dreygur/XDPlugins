const {
    selection,
    Color
} = require("scenegraph");
const commands = require("commands");
const environment = require("./storage-helper");
const recipe = require("./recipes");


class longShadows {

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
     * Initiating the UI dialogue for getting values from the user then proceeding with the data
     */
    static async processData() {
        const values = this.createDialog();
        const options = await document.body.appendChild(values).showModal();
        if ((options) && (options !== "reasonCanceled")) {
            return this.getPathData(options);
        }
    }
    /**
     * Creating the UI, getting user defined angle and length of the shadow
     */
    static createDialog() {
        let dialog = document.createElement("dialog");
        dialog.style.width = "300px";
        //form
        const form = document.createElement("form");
        dialog.appendChild(form);

        const text = document.createElement("h1");
        text.textContent = "Long Shadow";
        text.style.marginBottom = "10px";
        form.appendChild(text);

        const error = document.createElement("div");
        error.style.color = "red";
        form.appendChild(error);

        const div = document.createElement("div");
        div.className = "row";
        form.appendChild(div);
        //input


        const labelWrapperLength = document.createElement("label");
        const labelLength = document.createElement("span");
        labelLength.textContent = "Length";
        labelWrapperLength.appendChild(labelLength);
        const lengthInput = document.createElement("input");
        lengthInput.type = "number";
        lengthInput.min = 0;
        lengthInput.className = "column";
        lengthInput.value = this.lengthInput ? this.lengthInput : 20;
        labelWrapperLength.appendChild(lengthInput);
        div.appendChild(labelWrapperLength);

        const labelWrapper = document.createElement("label");
        const label = document.createElement("span");
        label.textContent = "Angle°";
        labelWrapper.appendChild(label);
        const angleInput = document.createElement("input");
        angleInput.type = "number";
        angleInput.min = -360;
        angleInput.max = 360;
        angleInput.className = "column";
        angleInput.value = this.angleInput ? this.angleInput : -45;
        labelWrapper.appendChild(angleInput);
        div.appendChild(labelWrapper);

        const outlineDiv = document.createElement("div");
        const outlineLabelWrapper = document.createElement("label");
        outlineLabelWrapper.className = "row";
        outlineLabelWrapper.style.alignItems = "center";
        const outlineCheckbox = document.createElement("input");
        outlineCheckbox.setAttribute("type", "checkbox");
        outlineCheckbox.checked = this.outlineCheckbox ? this.outlineCheckbox : false;
        outlineLabelWrapper.appendChild(outlineCheckbox);

        const outlineLabel = document.createElement("span");
        outlineLabel.textContent = "Shadow Simple Strokes (Borders)";
        outlineLabelWrapper.appendChild(outlineLabel);
        outlineDiv.appendChild(outlineLabelWrapper);
        form.appendChild(outlineDiv);


        //footer
        const footer = document.createElement("footer");
        footer.style.marginTop = "10px";
        footer.style.paddingBottom = "5px";
        footer.className = "row";
        footer.style.borderBottom = "1px solid #ddd";
        form.appendChild(footer);

        const refWrapper = document.createElement("div");
        refWrapper.className = "row";

        form.appendChild(refWrapper);

        const ref = document.createElement("span");
        ref.textContent = "Angle Reference";
        ref.style.fontSize = "11px";
        refWrapper.appendChild(ref);



        const imageWrapper = document.createElement("div");
        imageWrapper.className = "row";
        imageWrapper.style.alignItems = "center";
        imageWrapper.style.marginTop = "10px";

        form.appendChild(imageWrapper);

        const image = document.createElement("img");
        image.src = "./images/compass.png";
        image.style.width = "260px";
        image.style.height = "141px"
        imageWrapper.appendChild(image);

        //buttons
        const apply = document.createElement("button");
        apply.uxpVariant = "cta";
        apply.textContent = "Apply";
        const cancel = document.createElement("button");
        cancel.textContent = "Cancel";
        footer.appendChild(cancel);
        footer.appendChild(apply);
        //actions
        angleInput.addEventListener("input", e => {
            if ((angleInput.value >= 360) || (angleInput.value <= -360)) {
                error.textContent = "The angle " + angleInput.value + " is impossible!";
            } else {
                error.textContent = "";
            }
        });

        apply.addEventListener("click", e => {

            e.preventDefault();
            submit();
        });

        const submit = () => {
            if ((angleInput.value <= 360) && (angleInput.value >= -360)) {
                let options = {
                    "length": lengthInput.value,
                    "angle": angleInput.value,
                    "outline": outlineCheckbox.checked
                };
                dialog.close(options);
                this.angleInput = options.angle;
                this.lengthInput = options.length;
                this.outlineCheckbox = outlineCheckbox.checked;
            } else {
                e.preventDefault();
            }
        };
        cancel.addEventListener("click", e => {

            dialog.close();
            e.preventDefault();
        });
        form.addEventListener("submit", e => {

            e.preventDefault();
            submit();
        });
        return dialog;
    }

    /**
     * Looping through selected items, getting paths array to be processed further with options defined by the user
     * @param {*} radius - user defined radius
     * @returns {Promise<*>} chaining into a redrawing method
     */
    static getPathData(options) {

        const node = selection.items;
        let pathArray = new Array;
        const object = this;
        node.forEach(function (childNode, i) {

            if (options.outline && childNode.strokeEnabled) {

                pathArray.push({
                    width: childNode.strokeWidth,
                    cap_type: childNode.strokeEndCaps == "square" ? "projecting" : childNode.strokeEndCaps,
                    mitre_limit: childNode.strokeMiterLimit,
                    dash_offset: childNode.strokeDashOffset,
                    join_type: childNode.strokeJoins == "miter" ? "mitre" : childNode.strokeJoins,
                    dashes: childNode.strokeDashArray,
                    stroke_color: childNode.stroke,
                    placement: object.defineStrokePlacementNameForApi(childNode.strokePosition),
                    stroke: "present",
                    path: childNode.pathData,
                    angle: options.angle,
                    length: options.length,
                });
            } else if (options.outline && !childNode.strokeEnabled) {
                pathArray.push({
                    color: childNode.fill,
                    stroke: "none",
                    path: childNode.pathData,
                    angle: options.angle,
                    length: options.length,
                });
            } else {
                pathArray.push({
                    path: childNode.pathData,
                    angle: options.angle,
                    length: options.length,
                });
            }
        });
        return this.getNewPaths(pathArray);
    }

    /**
     * Another definition translator from XD terminology to Astui API
     * to see more view outline.js 
     * 
     * @param {*} stroke 
     */
    static defineStrokePlacementNameForApi(stroke) {
        let newStroke = "";
        switch (stroke) {
            case "outside":
                newStroke = "outset";
                break;
            case "inside":
                newStroke = "inset";
                break;
            case "center":
                newStroke = "centered";
                break;
            case "miter":
                newStroke = "mitre";
                break;

        }
        return newStroke;

    }

    /**
     * Getting processed paths from the api calls, populating the array with requests containing element properties and user defined parameters
     * The processed data then sent to placePaths method to be redrawn
     * @param {array} array - array of objects with paths and custom parameters
     * @returns {Promise<*>} resolved array of requests and the paths 
     */
    static getNewPaths(array) {

        let newPaths = new Array;
        let object = this;
        array.forEach(async function (element) {

            if (element.stroke == "present") {
                newPaths.push(object.callToRecipe(element));
            } else {
                newPaths.push(object.callLongShadowAPI(element.path, element.angle, element.length));
            }
        });
        return Promise.all(newPaths)
            .then(data => this.placePaths(data, array));
    }

    /**
     * Duplicating objects and replacing only half, this allows for the shadow to be created after the Path and not just replace it
     * The new path is also given Black as the fill colour
     * @param {array} path 
     */
    static placePaths(path, element) {
        const node = selection.items;
        if (element.stroke) {
            commands.convertToPath();
        }
        commands.duplicate();
        node.forEach(function (childNode, i) {
            if (path[i].error) {
                throw path[i].error + " - " + path[i].message;
            }
            childNode.pathData = path[i].path;
            childNode.fill = new Color("Black");
                childNode.fillEnabled = true;
                childNode.strokeEnabled = false;
         
        });
    }


    /**
     * Call to create shadow from the provided body
     * Some minor error handling too, if the token is expired reset it and alert the user
     * @param {*} body 
     * @param {*} angle 
     * @param {*} length 
     */
    static async callLongShadowAPI(body, angle, length) {
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
            body: "api_token=" + api_token + "&path=" + body + "&angle=" + angle + "&length=" + length,
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

    /**
     * Creating the body for the new recipe endpoint,
     * We want to outline first and then apply the long shadow, we build the JSON accordingly providing all the appplicable parameters for each request. 
     * Once body is defined, passing it to our recipe module to be sent to the server.
     * @param {*} apiParamObj 
     */
    static callToRecipe(apiParamObj) {
        let recipes = {
            "outline": {
                "width": apiParamObj.width,
                "join_type": apiParamObj.join_type,
                "cap_type": apiParamObj.cap_type,
                "mitre_limit": apiParamObj.mitre_limit,
                "placement": apiParamObj.placement,
            },
            "longshadow": {
                "angle": apiParamObj.angle,
                "length": apiParamObj.length,
            }
        };
        if ((apiParamObj.dashes)) {

            recipes.outline.dashes = apiParamObj.dashes;
            recipes.outline.dash_offset = apiParamObj.dash_offset;
        }


        return recipe.callRecipesApi(this.api, recipes, apiParamObj.path);


    }



}

module.exports = longShadows;