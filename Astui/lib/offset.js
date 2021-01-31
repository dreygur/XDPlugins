const {
    selection,
    Path,
    Color
} = require("scenegraph");
const environment = require('./storage-helper');

const commands = require("commands");
class offset {

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
        const dialog = this.getDialog();
        const settings = await dialog.showModal();
        if ((settings) && (settings !== "reasonCanceled")) {
            return this.getAllPath(settings);
        }
    }

    /**
     * Creating the UI itself.
     * Allows user to input the needed parameters: the width, type (mitre, Round, Bevel), limit if the type is mitre and Whether the operation should keep the original path. 
     * This gets returned when the dialog is submitted
     * The last selected value is remains in the dialog window
     * 
     */
    static getDialog(id = "offset") {


        const $ = sel => document.querySelector(sel);
        const sel = `#${id}`;
        let options = document.querySelector(sel);

        //create your elements
        document.body.innerHTML = `
<style>
    ${sel} form {
        width: 280px;
    }
    input[type="text"], input[type="number"] {
        font-size: 10px;
        width: 90px;
    }
    input[type=range] {
        width: 180px;
    }
    #error {
        color: red;
        font-size: 10px;
        padding-left: 5px;
        height: 13px;
    }
    .justify-end {
         justify-content: flex-end;
    }
    .row {
        align-items: center; 
    }
    .hint {font-size: 10px; }
    hr { margin-top:5px;}
    #easing_range_meter, #opacity_meter {font-size: 11px; margin-bottom: 0px; }

</style>
<dialog id="${id}">
<form method="dialog">
    <h1>Offset Path</h1>
    <hr>
    <div class="row">
        <div class="column">
            <label for="width">
                <span>Distance</span>
            </label>

            <input type="number" id="width" name="width" value="10" />
        </div>
            <div class="column">
                <label>
                    <span>Corner</span>
                    <select id="type">
                        <option value="mitre">Mitre</option>
                        <option value="round">Round</option>
                        <option value="bevel">Bevel</option>
                    </select>
                </label>
            </div>
            <div class="column">
                <label>
                    <span>Limit</span>
                    <input type="number" id="limit" name="limit" disabled />
                </label>
            </div>
        </div>
        <div class="row">
            <label>
                <span>Position Result</span>
                <select id="position">
                    <option value="above">Above original</option>
                    <option value="below">Below Original</option>
                    <option value="replace">Replace Original</option>
                </select>
            </label>
        </div>
        <hr>
        <div class="row">
            <label>
                <div class="row">
                    <input type="number" min="1" value="1" max="1000" name="repeats" id="repeats" />
                    <span>steps</span>
                </div>
                <div id="error">
                </div>
            </label>
           </div>
        </div>
        <hr>
        <div class="row">
        <div class="column">
        <label class="row">
        <input type="checkbox" name="easing" id="easing" />
        <span>Easing</span>
        </label>
        </div>
        <div class="column">
        <label>
            <div class="row justify-end">
                <span id="easing_range_meter"></span>
            </div>

            <input type="range" min="1" max="99" name="easing_range" value="1" id="easing_range" disabled/>
        </label>
        </div>
        </div>
        <hr>
        <div class="hint row">
        <p>Please, ensure that your artwork has strokes (borders) and fill if you'd like to use stroke and fill alteration</p>
        </div>
        <div class="row">
    
        <div class="column">
        <label>
        <span>Stroke Options</span>
        <select id="stroke" width="100">
        <option value="current">Keep Stroke</option>
            <option value="change">Alter Stroke</option>
            <option value="none">No Stroke</option>
        </select>
    </label>
    </div>
            <div class="column">
                <label>
                    <span>Stroke Color</span>
                    <input type="text" name="stroke_colour" id="stroke_colour" placeholder="#000000 or color name"  width="150"/>
                </label>
            </div>

        </div>
 
        <div class="row">
        <div class="column">
        <label>
        <span>Fill Options</span>
        <select id="fill"  width="100">
        <option value="current">Keep Fill</option>
            <option value="change">Alter Fill</option>
            <option value="none">No Fill</option>
        </select>
    </label>
    </div>
            <div class="column">
                <label>
                    <span>Fill Color</span>
                    <input type="text" name="fill_colour" id="fill_colour"  placeholder="#000000 or color name" width="150" disabled />
                </label>
            </div>
         
        </div>
  
        <hr>
        <div class="row">
        <div class="column">
        <label class="row padding-top">
        <input type="checkbox" name="opacity" id="opacity" />

        <span>Opacity</span>
        </label>
        </div>
        <div class="column">
        <label>
            <div class="row justify-end">
                <span id="opacity_meter"></span>
            </div>

            <input type="range" min=0 max=100 name="opacity_range_value" id="opacity_range_value"  disabled/>

        </label>
        </div>
        </div>

        
        <hr>


        <footer>
            <button id="cancel">Cancel</button>
            <button type="submit" id="submit" uxp-variant="cta">Apply</button>
        </footer>
</form>
</dialog>
`;

        options = document.querySelector(sel);
        const [form, submitButton, cancel, width, type, limit, repeats, fill, stroke, position, error, easing_range, opacity_meter, opacity_range_value, easing_range_meter, fill_colour, stroke_colour, easing, opacity] = [`${sel} form`, "#submit", "#cancel", "#width", "#type", "#limit", "#repeats", "#fill", "#stroke", "#position", "#error", "#easing_range", "#opacity_meter", "#opacity_range_value", "#easing_range_meter", "#fill_colour", "#stroke_colour", "#easing", "#opacity"].map(s => $(s));

        type.selectedIndex = this.type ? this.type : 0;
        position.selectedIndex = this.position ? this.position : 0;
        fill.selectedIndex = this.fill ? this.fill : 0;
        stroke.selectedIndex = this.stroke ? this.stroke : 0;
        width.value = this.width ? this.width : 10;
        repeats.value = this.repeat ? this.repeat : 1;
        if (this.easing) {
            easing.checked = true;
            easing_range.value = this.easing;
            easing_range_meter.textContent = this.easing.toString() + "%";

            easing_range.disabled = false;
        }
        if (this.opacity) {
            opacity.checked = true;
            opacity_range_value.value = this.opacity;
            opacity_range_value.disabled = false;
            opacity_meter.textContent = this.opacity.toString() + "%";
        }
        const submit = () => {
            if (repeats.value >= 0) {
                let settings = {
                    "width": Number(width.value),
                    "corner": type.value,
                    "limit": limit.value,
                    "position": position.value,
                    "repeats": Number(repeats.value),
                    "fill": fill.value,
                    "stroke": stroke.value,
                    "reverse": false,
                    "fill_colour": fill_colour.value,
                    "stroke_colour": stroke_colour.value,
                };
                if (width.value > 0) {
                    settings.reverse = true;
                }

                if (easing.checked) {

                    settings.easing_range = Math.round(easing_range.value) / 100;
                    this.easing = Math.round(easing_range.value);

                } else {
                    this.easing = false;
                }

                if (opacity.checked) {
                    settings.opacity = Math.round(opacity_range_value.value);
                    this.opacity = Math.round(opacity_range_value.value);
                } else {
                    this.opacity = false;
                }
                options.close(settings);
            } else {
                error.textContent = "Cannot have negative value of steps";
            }
            //resetting UI fields

            this.type = type.selectedIndex;
            this.position = position.selectedIndex;
            this.fill = fill.selectedIndex;
            this.stroke = stroke.selectedIndex;
            this.fill_colour = fill_colour.value;
            this.stroke_colour = stroke_colour.value;
            this.width = width.value;
            this.repeat = Number(repeats.value);

        };

        easing.addEventListener("change", e => {
            e.preventDefault();
            if (easing.checked) {
                easing_range.disabled = false;
                easing_range.value = 75;
                easing_range_meter.textContent = "75%";
            } else {
                easing_range.disabled = true;
                easing_range_meter.textContent = "";
                easing_range.value = 0;
            }
        });

        opacity.addEventListener("change", e => {
            e.preventDefault();
            if (opacity.checked) {
                opacity_range_value.disabled = false;
                opacity_range_value.value = 100;
                opacity_meter.textContent = "100%";
            } else {
                opacity_range_value.disabled = true;
                opacity_meter.textContent = "";
                opacity_range_value.value = 0;
            }
        });

        repeats.addEventListener("input", e => {
            if (repeats.value < 1) {
                error.textContent = "Cannot have fewer than one step";
            } else {
                error.textContent = "";
            }
        });


        opacity_range_value.addEventListener("input", e => {
            opacity_meter.textContent = Math.round(opacity_range_value.value).toString() + "%";
        });

        easing_range.addEventListener("input", e => {
            easing_range_meter.textContent = Math.round(easing_range.value).toString() + "%";
        });

        cancel.addEventListener("click", () => {
            options.close();
        });

        if (type.value == "mitre") {
            limit.disabled = false;
            limit.value = 20;
        }


        if ((stroke.value == "current") || (stroke.value == "none")) {
            stroke_colour.disabled = true;
        } else {
            stroke_colour.disabled = false;
            stroke_colour.value = this.stroke_colour ? this.stroke_colour : "";
        }

        if ((fill.value == "current") || (fill.value == "none")) {
            fill_colour.disabled = true;
        } else {
            fill_colour.disabled = false;
            fill_colour.value = this.fill_colour ? this.fill_colour : "";
        }


        fill.addEventListener("change", e => {

            e.preventDefault();
            if (fill.value == "change") {
                fill_colour.disabled = false;
            } else {
                fill_colour.disabled = true;
                fill_colour.value = "";

            }
        });

        stroke.addEventListener("change", e => {
            e.preventDefault();
            if (stroke.value == "change") {
                stroke_colour.disabled = false;
            } else {
                stroke_colour.disabled = true;
                stroke_colour.value = "";
            }
        });



        type.addEventListener("change", e => {
            e.preventDefault();
            if (type.value == "mitre") {
                limit.disabled = false;
                limit.value = 20;
            } else {

                limit.disabled = true;
                limit.value = "";
            }
        });
        submitButton.addEventListener("click", e => {
            submit();
            e.preventDefault();
        });

        form.onsubmit = submit;

        return options;
    }


    /**
     * Gathers all selected items into an array of objects that is used to be processed
     * 
     * @param {*} selection 
     */
    static getAllPath(settings) {
        const node = selection.items;
        let pathArray = [];

        node.forEach(function (childNode, i) {
            pathArray.push({
                path: childNode.pathData
            });

        });
        return this.getNewPaths(pathArray, settings);
    }

    /**
     * This will allow us to process each of the available paths with the API calls
     * This also passes user defined values from the UI, if the user defined for multiple offsets, we create a array of new requests where offsets differ depending on easing (ie no easing or easing at 50) the offsets are equal,
     *  The total offset for each path is n(offset) where n is the path number
     * 
     * This also builds array of opacities for each of the neq path (if defined) by working out the opacity for each path (total opacity - target opacity the result divides by the amount of offsets to be created and this is our difference)
     * 
     * Resolves all requests via Promises and sends the response object to redraw paths method.
     * 
     * @param {*} array 
     * @param {*} settings 
     */
    static async getNewPaths(array, settings) {
        let newPaths = [];
        let object = this;

        if (settings.repeats == 1) {
            array.forEach(async function (element) {
                newPaths.push(object.callToOffsetApi(element.path, settings));
            });
            return Promise.all(newPaths)
                .then(data => this.placePaths(data, settings));
        } else {

            let pathCounter = 0;
            let pathsTotalLoop = settings.repeats;
            pathsTotalLoop -= 1;
            let receivedPaths = new Array;
            let opacities = [];
            let opacityDifference;
         
                opacityDifference = (100 - settings.opacity) / settings.repeats;

                opacities.push(100 - opacityDifference);
          

            if (settings.easing_range) {
                this.offsets = [];
                let offset = this.calculateOffset(settings.repeats, settings.easing_range, settings.width * settings.repeats, this.offsets);

                array.forEach(async function (element, i) {
                    receivedPaths.push(object.callToOffsetApi(element.path, settings, offset[0]));

                    do {

                        opacities.push(opacities[pathCounter] - opacityDifference);
                        receivedPaths.push(object.callToOffsetApi(element.path, settings, offset[pathCounter + 1]));
                        pathCounter++;

                    } while (pathCounter < pathsTotalLoop);
                    pathCounter = 0;

                });
            } else {
                array.forEach(async function (element) {

                    receivedPaths.push(object.callToOffsetApi(element.path, settings));
                    do {

                        opacities.push(opacities[pathCounter] - opacityDifference);
                        receivedPaths.push(object.callToOffsetApi(element.path, settings, (pathCounter + 2) * settings.width));
                        pathCounter++;
                    } while (pathCounter < pathsTotalLoop);
                    pathCounter = 0;

                });

            }
            return Promise.all(receivedPaths).then(data => object.placeMultiOffset(data, settings, opacities));
        }

    }

    /**
     * Pass n (number of offsets), m (fractional distance of middle offset),
     * and either the first offset or the total offset. Returns an array of
     * offsets (distance from the original path)
     * @param {*} n number offsets
     * @param {*} m easing_range
     * @param {*} offset - width of the offset (total or partial)
     * @param {*} offsets 
     */
    static calculateOffset(n, m, offset, offsets) {
        if (n == 1) {
            offsets.push(offset);
        } else {
            let lowBound = 0.0;
            let highBound = 1.0;
            if (m == 0.5) {
                for (let i = 1; i <= n; ++i) {
                    offsets.push(offset * (parseFloat(i) / parseFloat(n)));
                }
            } else {
                let error;
                let inverted = false;
                if (m < 0.5) {
                    m = 1.0 - m;
                    inverted = true;
                }
                let doubled = false;
                if (n % 2 == 1) {
                    n = n * 2;
                    doubled = true;
                }

                let k = 0.85; // Arbitrary starting value
                let hd, td;

                // Iterate to find k
                do {
                    let digits = this.getVariableOffsetDistances(n, k, hd, td);
                    hd = digits[0];
                    td = digits[1];
                    let md = hd / td;
                    error = Math.abs(md - m);
                    if (error <= 0.0000001) break;
                    if (md < m) {
                        highBound = k;
                        k = (k + lowBound) / 2.0;
                    } else {
                        lowBound = k;
                        k = (k + highBound) / 2.0;
                    }
                } while (error > 0.0000001);
                if (inverted) {
                    k = 1.0 / k;
                }
                if (doubled) {
                    n = n / 2;
                    k = k * k; // k value is squared when number of offsets is halved
                }
                if (inverted || doubled) {
                    let digits = this.getVariableOffsetDistances(n, k, hd, td);
                    hd = digits[0];
                    td = digits[1];
                }
                // Create the array of offsets
                let firstOffset, totalOffset;
                totalOffset = offset;
                firstOffset = totalOffset / (td * parseFloat(n));
                offsets.push(firstOffset);
                for (let i = 1; i < n - 1; ++i) {
                    offsets.push((firstOffset * Math.pow(k, i) + offsets[offsets.length - 1]));
                }
                offsets.push(totalOffset);
            }
        }
        this.offsets = offsets;
        return offsets;
    }

    /**
     * Number of offsets n must be even. Constant k is the value by which each offset distance is multiplied by to get the succeeding 
     * offset. Returns the distance of the middle offset and the last offset, based on a total distance for the corresponding non-variable 
     * offset of 1.0 (i.e., n offsets of 1/n).
     * @param {*} n 
     * @param {*} k 
     * @param {*} halfDistance 
     * @param {*} totalDistance 
     */
    static getVariableOffsetDistances(n, k, halfDistance, totalDistance) {
        halfDistance = 0;
        totalDistance = 0;
        for (let i = 0; i < n; ++i) {
            let d = (1.0 / parseFloat(n)) * (Math.pow(k, i));
            if (i < (n / 2)) {
                halfDistance += d;
            }
            totalDistance += d;
        }
        return [halfDistance, totalDistance];
    }

    /**
     * Calculating a colour for each new path based on the the original and the target colour. Adapted from Colorize Text plugin https://github.com/AdobeXD/plugin-samples/tree/master/e2e-colorize-text
     * We turn the passed HEX value into a Color object, which helps us calculate the new rgba values between the colours.
     * We use the number of repeated paths needed to get each colour step
     * @param {*} firstColour 
     * @param {*} newColour 
     * @param {*} repeats 
     */
    static calculateGradient(firstColour, newColour, repeats) {

        const lastColour = new Color(newColour);
        let colourArray = [];
        if (firstColour.colorStops) {
            const [startRGBA, endRGBA] = [new Color(firstColour.colorStops[0].color.value), lastColour].map(color => [color.r, color.g, color.b, color.a]);

            let things = 0;
            const deltaRGBA = this.zip(startRGBA, endRGBA).map(([start, end]) => (end - start) / repeats);

            do {
                const color = new Color();
                // assign the R, G, and B components based on how many times we've iterated (step)
                [color.r, color.g, color.b, color.a] = startRGBA.map((c, idx) => c + (deltaRGBA[idx] * (things + 1)));
                colourArray.push(color);
                things++;
            } while (things < repeats);
        } else {

            let things = 0;
            const [startRGBA, endRGBA] = [firstColour, lastColour].map(color => [color.r, color.g, color.b, color.a]);

            const deltaRGBA = this.zip(startRGBA, endRGBA).map(([start, end]) => (end - start) / repeats);

            do {
                const color = new Color();
                // assign the R, G, and B components based on how many times we've iterated (step)
                [color.r, color.g, color.b, color.a] = startRGBA.map((c, idx) => c + (deltaRGBA[idx] * (things + 1)));
                colourArray.push(color);
                things++;
            } while (things < repeats);
        }
        return colourArray;
    }
    /**
     * 
     * Given two arrays, return an array like [ [a[0], b[0]], [a[1], b[1], ... ]
     */
    static zip(a, b) {
        return a.map((a, idx) => [a, b[idx]]);
    }

    /**
     * Placing and creating new elements on the Scenegraph.
     * First we define the order of new paths, for positive offsets we need to place small to big paths, and reverse of that for negative widths
     * Depending on the settings we create an array of colours to tween into the final colour values to assign to each new path
     * 
     * @param {*} data 
     * @param {*} settings 
     * @param {*} opacities 
     */
    static placeMultiOffset(data, settings, opacities) {


        const obj = this;
        const masterData = obj.chunk(data, settings.repeats);

        if (settings.reverse) {
            opacities.reverse();
        }
        selection.items.forEach(function (item, index) {

            let newFill;
            if (settings.fill == "change") {
                newFill = obj.calculateGradient(item.fill, settings.fill_colour, settings.repeats);
                if (settings.reverse) {
                    newFill.reverse();
                }

            }

            let newStroke;
            if (settings.stroke == "change") {
                newStroke = obj.calculateGradient(item.stroke, settings.stroke_colour, settings.repeats);
                if (settings.reverse) {
                    newStroke.reverse();
                }

            }

            //need to rebuild the array so that we can crete needed elements and position them in the right order
            masterData[index].reverse();
            masterData[index].forEach(function (element, i) {
                let offsetObj = new Path;
                if (element.path) {
                    offsetObj.pathData = element.path;

                    if (item.fillEnabled) {
                        switch (settings.fill) {
                            case "change":
                                offsetObj.fill = newFill[i];
                                offsetObj.fillEnabled = true;
                                break;
                            case "none":
                                offsetObj.fillEnabled = false;
                                break;
                            default:
                                offsetObj.fill = item.fill;
                                offsetObj.fillEnabled = item.fillEnabled;
                                break;
                        }
                    } else {
                        offsetObj.fillEnabled = false;
                    }
                    if (item.strokeEnabled) {
                        switch (settings.stroke) {
                            case "change":
                                offsetObj.stroke = newStroke[i];
                                offsetObj.strokeEnabled = true;
                                offsetObj.strokeWidth = item.strokeWidth;
                                offsetObj.strokePosition = item.strokePosition;
                                offsetObj.strokeEndCaps = item.strokeEndCaps;
                                offsetObj.strokeJoins = item.strokeJoins;
                                offsetObj.strokeDashArray = item.strokeDashArray;
                                offsetObj.strokeDashOffset = item.strokeDashOffset;

                                break;
                            case "none":
                                offsetObj.strokeEnabled = false;
                                break;
                            default:
                                offsetObj.strokeEnabled = item.strokeEnabled;
                                offsetObj.strokeWidth = item.strokeWidth;
                                offsetObj.strokePosition = item.strokePosition;
                                offsetObj.strokeEndCaps = item.strokeEndCaps;
                                offsetObj.strokeJoins = item.strokeJoins;
                                offsetObj.strokeDashArray = item.strokeDashArray;
                                offsetObj.strokeDashOffset = item.strokeDashOffset;
                                offsetObj.stroke = item.stroke;
                                break;
                        }
                    } else {
                        offsetObj.strokeEnabled = false;
                    }
                    if (settings.opacity >= 0) {
                        offsetObj.opacity = opacities[i] / 100;
                    }
                    offsetObj.rotateAround(item.rotation, item.localBounds);

                    offsetObj.translation = item.translation;
                    offsetObj.shadow = item.shadow;

                    // console.log(item.rotation, item.localCenterPoint)
                    // offsetObj.rotateAround(item.rotation, item.localCenterPoint);

                    selection.insertionParent.addChild(offsetObj);
                }
                switch (settings.position) {
                    case "above":
                        commands.sendToBack();
                        break;
                    case "below":
                        commands.bringToFront();
                        break;
                    case "replace":
                        item.removeFromParent();
                        break;
                }
            });



        });


    }

    /**
     * Replacing selected object paths with the newly processed paths from the API, allows to keep the properties of stroke data
     * By default the API uses the background colour of the path and not the stroke, we have to manually preserve stroke's colours
     * This also preserves (duplicates) or removes the original paths, depending on the user selection from the UI.
     * 
     * @param {*} selection 
     * @param {*} path - response with path and colour
     */
    static placePaths(path, settings) {
        const node = selection.items;
        const commands = require("commands");
        switch (settings.position) {
            case "above":

                commands.duplicate();
                commands.sendToBack();
                break;
            case "below":

                commands.duplicate();
                commands.bringToFront();
                break;
        }

        node.forEach(function (childNode, i) {
            if (path[i].error) {
                throw path[i].error + " - " + path[i].message;
            }


            childNode.pathData = path[i].path;
            if (settings.opacity) {
                childNode.opacity = settings.opacity / 100;
            }

            switch (settings.fill) {
                case "change":
                    childNode.fill = new Color(settings.fill_colour);

                    // childNode.fillEnabled = true;
                    break;
                case "none":
                    childNode.fillEnabled = false;
                    break;

            }
            switch (settings.stroke) {
                case "change":
                    childNode.stroke = new Color(settings.stroke_colour);

                    // childNode.strokeEnabled = true;
                    break;
                case "none":
                    childNode.strokeEnabled = false;
                    break;

            }
        });

    }

    /**
     * API Call using user defined properties, current path information and array of points to be affected, if the call is unsuccessful and has an error
     * it builds error information into the object's response with the current path, so no artwork disappears
     * 
     * @param {*} body path data
     * @param {*} setting data set out in the form
     */
    static async callToOffsetApi(body, setting, widthArray = null) {
        const api_token = await environment.get("api_token");
        const width = widthArray ? widthArray : setting.width;
        const cornerType = setting.corner;
        const limit = setting.limit;
        let content;
        if (limit) {
            content = "api_token=" + api_token + "&path=" + body + "&offset=" + width + "&join_type=" + cornerType + "&mitre_limit=" + limit;
        } else {
            content = "api_token=" + api_token + "&path=" + body + "&offset=" + width + "&join_type=" + cornerType;
        }
        let response = await fetch(this.endpoint, {
            method: "post",
            headers: {
                "Cache-Control": "no-cache",
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json"
            },
            body: content,
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

    static chunk(array, size) {
        const chunked_arr = [];
        let index = 0;
        while (index < array.length) {
            chunked_arr.push(array.slice(index, size + index));
            index += size;
        }
        return chunked_arr;
    }



}

module.exports = offset;