const {
    selection,
    Path,
    Color
} = require("scenegraph");

const commands = require("commands");
const environment = require('./storage-helper');

class outline {
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
     * Stroke processor for deciding which process to run
     * 
     * @param {*} selection 
     */
    static processData() {


        let paths = this.getStrokes();

        return this.getNewPaths(paths);
    }
    /**
     * @TODO: OPTIMISE!
     * 
     * Getting data from strokes is slightly more complex, this needs to be optimised, but currently we're building arrays of objects with paths and other parameters ensuring that all paths are processed properly and the colour and path types are sent correctly and are not lost in the API calls
     * Each path has GraphicNode's properties to get information that we need.
     * If the path doesn't have a stroke, we'll addd it to the array but with different properties. This is so that we don't erase the path after the API call. 
     * We could get selection.items index and iterate through that as well.
     * 
     * @param {*} selection 
     */
    static getStrokes() {
        const node = selection.items;
        let pathArray = new Array;
        const object = this;
        node.forEach(function (childNode, i) {
            if (childNode.strokeEnabled) {
                pathArray.push({
                    path: childNode.pathData,
                    width: childNode.strokeWidth,
                    cap_type: object.capTypeSetter(childNode.strokeEndCaps),
                    mitre_limit: childNode.strokeMiterLimit,
                    dash_offset: childNode.strokeDashOffset,
                    join_type: childNode.strokeJoins == "miter" ? "mitre" : childNode.strokeJoins,
                    dashes: childNode.strokeDashArray,
                    color: childNode.stroke,
                    placement: object.defineStrokePlacementNameForApi(childNode.strokePosition),
                    stroke: "present",

                });
            } else {
                pathArray.push({
                    path: childNode.pathData,
                    color: childNode.fill,
                    stroke: "none",
                });
            }
        });
        return pathArray;
    }

    /**
     * Creates a new array of requests and no-stroked paths and resolves all the requests. This data is then passed to placePaths function.
     * 
     * @param {*} array 
     */
    static async getNewPaths(array) {
        let newPaths = new Array;
        let object = this;
        array.forEach(async function (element) {
            if (element.stroke == "present") {
                newPaths.push(object.callToOutlineStrokeApi(element));
            } else {
                newPaths.push({
                    path: element.path,
                    color: element.color,
                });
            }
        });

        return Promise.all(newPaths)
            .then(data => this.placePaths(data));
    }


    /**
     * Little cap type translator, since XD"s strokeEndCaps isn"t complying with API"s paramente
     */
    static capTypeSetter(capType) {
        if (capType == "square") {
            return "projecting";
        } else {
            return capType;
        }
    }

    /**
     * Another definition translator from XD terminology to Astui API
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
     * Keeps the properties of stroke data and adds a new path onto the scenegraph
     * By default the API uses the background colour of the path and not the stroke, we have to manually preserve stroke's colours
     * Adds a new outlined stroke on top of the selected items, removing the stroke from the selected items. 
     * If the object didn't have a fill colour - it just overwrites the item
     * 
     * @param {*} selection 
     * @param {*} path - response with path and colour
     */
    static placePaths(path) {
        commands.convertToPath();
        const node = selection.items;

        node.forEach(function (childNode, i) {
            if (path[i].error) {
                throw path[i].error + " - " + path[i].message;
            }
            if (childNode.fillEnabled) {
                const newPath = new Path;
                newPath.pathData = path[i].path;
                newPath.strokeEnabled = false;
                newPath.fillEnabled = true;
     
                newPath.fill = new Color(path[i].color.value, 1);
                childNode.strokeEnabled = false;

                newPath.rotateAround(childNode.rotation, childNode.translation, childNode.localCenterPoint);

                newPath.translation = childNode.translation;
               newPath.shadow = childNode.shadow;
                selection.insertionParent.addChild(newPath);
      
            } else {
                childNode.pathData = path[i].path;
                childNode.strokeEnabled = false;
                childNode.fillEnabled = true;
                path[i].color.opacity = 1; 
                childNode.fill = new Color(path[i].color.value, 1);
            }

        });
    }

    /**
     * API Call using current path and stroke properties, current path information and array of points to be affected, if the call is unsuccessful and has an error
     * Builds the request data based on what properties are available from path object for more refer to the API docs
     * it builds error information into the object's response with the current path, so no artwork disappears
     * 
     * @param {*} body 
     * @param {*} setting 
     */
    static async callToOutlineStrokeApi(path) {

        const api_token = this.api;
        const width = path.width;
        const cap = path.cap_type;
        const join = path.join_type;
        const mitre_limit = path.mitre_limit;
        const placement = path.placement;
        const offset = path.dash_offset;
        const dashes = path.dashes;
        let requestBody;
        if (dashes.length) {
            if (!dashes[1]) {
                requestBody = "api_token=" + api_token + "&path=" + path.path + "&width=" + width + "&join_type=" + join + "&cap_type=" + cap + "&mitre_limit=" + mitre_limit + "&placement=" + placement + "&dash_offset=" + offset + "&dashes[0]=" + dashes + "&dashes[1]=" + dashes[0];
            } else {

                requestBody = "api_token=" + api_token + "&path=" + path.path + "&width=" + width + "&join_type=" + join + "&cap_type=" + cap + "&mitre_limit=" + mitre_limit + "&placement=" + placement + "&dash_offset=" + offset + "&dashes[0]=" + dashes[0] + "&dashes[1]=" + dashes[1];
            }
        } else {
            requestBody = "api_token=" + api_token + "&path=" + path.path + "&width=" + width + "&join_type=" + join + "&cap_type=" + cap + "&mitre_limit=" + mitre_limit + "&placement=" + placement;
        }

        let response = await fetch(this.endpoint, {
            method: "post",
            headers: {
                "Cache-Control": "no-cache",
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json"
            },
            body: requestBody,
        });
        const status = response.status;
        let error = response.statusText;

        if (status == 200) {
            let data = await response.json();
            data = {
                "path": data.path,
                "color": path.color,
            };
            return data;
        } else {
            if ((status == 401) || (status == 402)) {
                await environment.set("api_token", "");
                error = "Unauthorised or expired. Check your token.";
            }

            let data = {
                "path": path,
                "error": status,
                "message": error,
            };
            return data;
        }
    }
}

module.exports = outline;