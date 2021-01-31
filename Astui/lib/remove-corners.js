const {
    selection
} = require("scenegraph");
const commands = require("commands");
const environment = require('./storage-helper');
const svgHelper = require("./svg-helper");

class removeCorners {

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
     *
     * This  gets the array of points, and once we can get which point is selected from XD, this will be replaced by the array of selected points
     * @returns {Promise} chains into another method that sends the requests
     */
    static processData() {
        commands.ungroup();
        const selectedGrid = selection.items;

        if (selectedGrid.length > 1) {
            let rand;
            do {
                commands.ungroup();
                commands.convertToPath();
                rand++;
            } while (rand < 4);


        } else {
            commands.convertToPath();
        }
        const node = selection.items;
        let pathArray = new Array;
        let object = this;
        node.forEach(function (childNode, i) {
            pathArray.push({
                path: childNode.pathData,
                points: svgHelper.getPointsArray(childNode.pathData)
            });
        });
        return object.getNewPaths(pathArray);
    }

    /**
     * Creates an array of Promises, sending current path data to the API and getting the reworked data back. This then is sent to a redrawing method
     * @param {array} array - array of objects with paths and points
     * @returns {Promise<*>} resolved array of requests and the paths 
     */
    static getNewPaths(array) {

        let newPaths = new Array; //array of said requests
        let object = this;
        array.forEach(async function (element) {
            newPaths.push(object.apiCall(element.path, element.points));

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
        const node = selection.items; 

        node.forEach(function (childNode, i) {
            if (path[i].error) {
                throw path[i].error + " - " + path[i].message;
            }
            childNode.pathData = path[i].path;
        });

    }
    
    /**
     * API Call with the selected points and path, if the call is unsuccessful and has an error
     * it builds error information into the object's response with the current path, so no artwork disappears
     * @param {string} body path
     * @param {*} array array of points selected
     * @param {*} radius selected by the user
     * @returns {JSON} data - processed path
     */
    static async apiCall(body, array) {

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
            body: "api_token=" + api_token + "&path=" + body + "&indices=" + array,
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

module.exports = removeCorners;