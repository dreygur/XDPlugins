const storage = require("uxp").storage;
const fs = storage.localFileSystem;

let data;

const defaultThemes = {
    // "mapbox://styles/mapbox/streets-v11",
    // "mapbox://styles/mapbox/satellite-v9",
    "Basic": "jestrux/ckfjayjhx1lpy19nv168t7r7z", // basic
    "Light": "mapbox/light-v10",
    "Dark": "mapbox/dark-v10",
    "Spring": "jestrux/ckfjath4f0ibq19o3kta26x0d",
    "Decimal": "jestrux/ckfj8co8w13x719mlwo181pru",
    "Sky": "jestrux/ckfjb5dzl0i4q19lbziebguof",
    "Blueprint": "jestrux/ckfj9eoiz4veb1armafkrpt6h",
    "Galaxy": "jestrux/ckfj9j6bx1iqc19meeipe67f5",
    "Bubblegum": "jestrux/ckfjb3gc64x0g1armwcpnrm9s",
    "Golden": "jestrux/ckfjb97v91kec19me0em1p5uu"
}

/**
 * Downloads an image from the photoUrl and
 * stores it in a temp file and returns the file
 *
 * @param {url} photoUrl
 */
async function downloadImage(photoUrl) {
    const photoObj = await xhrBinary(photoUrl);
    const tempFolder = await fs.getTemporaryFolder();
    const tempFile = await tempFolder.createFile("tmp", { overwrite: true });
    await tempFile.write(photoObj, { format: storage.formats.binary });
    return tempFile;
}

/**
 * Fetches a url with binary data and returns a promise
 * which resolves with this data
 *
 * @param {url} url
 */
async function xhrBinary(url) {
    const res = await fetch(url);
    if(!res.ok){
        const error = await res.json();
        if(error.message)
            throw Error(error.message);
        else
            throw Error(res.statusText);
    }
    const buffer = await res.arrayBuffer();
    const arr = new Uint8Array(buffer);
    return arr;
}

/**
 * Converts a styles json to styles url parameter
 * Copied from https://stackoverflow.com/questions/19115223/converting-google-maps-styles-array-to-google-static-maps-styles-string
 * 
 * @param {string} jsonStr 
 * @return string
 */

function parseStyles(jsonStr) {
    let json;
    let result = [];

    json = JSON.parse(jsonStr);

    json.forEach((item) => {
        let style = '';
        if (item.stylers && item.stylers.length > 0) {
            // add feature
            if (item.hasOwnProperty('featureType')) {
                style += 'feature:' + item.featureType + '|'
            } else {
                style += 'feature:all' + '|'
            }

            // add element
            if (item.hasOwnProperty('elementType')) {
                style += 'element:' + item.elementType + '|'
            } else {
                style += 'element:all' + '|'
            }

            // add stylers
            item.stylers.forEach((styler) => {
                const propName = Object.keys(styler)[0];
                const propVal = styler[propName].toString().replace('#', '0x');
                style += propName + ':' + propVal + '|';
            });
        }
        result.push('style=' + encodeURIComponent(style));
    });

    return '&' + result.join('&');
}

/**
 * Gets the dimensions of a node based on its type
 * 
 * @returns {Object} Object containing width and height
 */
function getDimensions(node) {
    let width, height;
    switch(node.constructor.name) {
        case "Rectangle":
        case "Polygon":
            width = node.width;
            height = node.height;
            break;
        case "Ellipse": 
            width = node.radiusX * 2;
            height = node.radiusY * 2;
            break;
        case "BooleanGroup": // Selecting arbitrary values for path and boolean group
        case "Path": 
            width = 500;
            height = 500;
            break;
        default:
            throw "Not supported"
    }

    return {
        width, height
    }
}


/**
 * A little helper class to make storing key-value-pairs (e.g. settings) for plugins for Adobe XD CC easier.
 */
class storageHelper {
    /**
     * Creates a data file if none was previously existent.
     * @return {Promise<storage.File>} The data file
     * @private
     */
    static async init() {
        let dataFolder = await fs.getDataFolder();
        try {
            let returnFile = await dataFolder.getEntry('storage.json');
            data = JSON.parse((await returnFile.read({format: storage.formats.utf8})).toString());
            return returnFile;
        } catch (e) {
            const file = await dataFolder.createEntry('storage.json', {type: storage.types.file, overwrite: true});
            if (file.isFile) {
                await file.write('{}', {append: false});
                data = {};
                return file;
            } else {
                throw new Error('Storage file storage.json was not a file.');
            }
        }
    }

    /**
     * Retrieves a value from storage. Saves default value if none is set.
     * @param {string} key The identifier
     * @param {*} defaultValue The default value. Gets saved and returned if no value was previously set for the speciefied key.
     * @return {Promise<*>} The value retrieved from storage. If none is saved, the `defaultValue` is returned.
     */
    static async get(key, defaultValue) {
        if (!data) {
            const dataFile = await this.init();
            data = JSON.parse((await dataFile.read({format: storage.formats.utf8})).toString());
        }
        if (data[key] === undefined) {
            await this.set(key, defaultValue);
            return defaultValue;
        } else {
            return data[key];
        }
    }

    /**
     * Saves a certain key-value-pair to the storage.
     * @param {string} key The identifier
     * @param {*} value The value that get's saved
     * @return {Promise<void>}
     */
    static async set(key, value) {
        const dataFile = await this.init();
        data[key] = value;
        return await dataFile.write(JSON.stringify(data), {append: false, format: storage.formats.utf8})
    }

    /**
     * Deletes a certain key-value-pair from the storage
     * @param {string} key The key of the deleted pair
     * @return {Promise<void>}
     */
    static async delete(key) {
        return await this.set(key, undefined);
    }

    /**
     * Resets (i.e. purges) all stored settings.
     * @returns {Promise<void>}
     */
    static async reset() {
        const dataFile = await this.init();
        return await dataFile.write('{}', {append: false, format: storage.formats.utf8})

    }
}

function getMapUrl(params){
    const {
        selectedLocation, zoomLevel, 
        mapType, theme, coords,
        width, height
    } = params;

    if(theme && theme.length && coords && coords.length)
        return getMapImageByCoordinates(params);

    let url = "https://www.mapquestapi.com/staticmap/v5/map?key=WeIoVZDtlQwX3HwGpXiNjk12Ca9eQJUm";
    url += `&center=${encodeURIComponent(selectedLocation)}`;
    url += `&zoom=${parseInt(zoomLevel)}&type=${mapType}`;
    url += `&size=${parseInt(width)},${parseInt(height)}`;

    return url;
}

function getMapImageByCoordinates({
    coords, 
    theme = "Basic",
    zoomLevel = 11.5,
    width, 
    height,
    bearing = 0,
    pitch = 0,
}){
    if(!coords)
        return null;

    const long = coords[0];
    const lat = coords[1];

    width = width < 500 ? width * 1.5 : width;
    height = height < 500 ? height * 1.5 : height;

    if(width > 1280 || height > 1280){
        console.log("Originals: ", width, height);

        const aspectRatio = width / height;
        width = 1280;
        height = 1280 / aspectRatio
    }

    const styleUrl = "styles/v1/" + defaultThemes[theme];
    const token = "pk.eyJ1IjoiamVzdHJ1eCIsImEiOiJja2RwbTZjZWcyM2xoMnlsY2pqaWM5czV4In0.5a8wiZC7EHZ1PWoDWzYjMQ";
    const url = `https://api.mapbox.com/${styleUrl}/static/${long},${lat},${zoomLevel},${bearing},${pitch}/${parseInt(width)}x${parseInt(height)}?access_token=${token}`;
    // console.log("Map url: ", url);
    return url;
}

async function getLocationCoordinates(location){
    // let url = `https://www.mapquestapi.com/geocoding/v1/address?key=WeIoVZDtlQwX3HwGpXiNjk12Ca9eQJUm&location=${encodeURIComponent(location)}`;
    // const response = await fetch(url);
    // const res = await response.json();
    // if(res.results && res.results[0] && res.results[0].locations){
    //     if(res.results[0].locations[0] && res.results[0].locations[0].latLng)
    //         return Object.values(res.results[0].locations[0].latLng).reverse();

    //     return null;
    // }

    let url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`;

    let res;
    try {
        const response = await fetch(url);
        res = await response.json();
    } catch (error) {
        const response = await fetch(url,  {
            method: 'GET',
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0',
            }
        });
        res = await response.json();
    }
    

    if(res && res.length){
        let place = res.find(({type}) => type == "administrative");
        if(!place){
            const placeTypes = [
                "state", "city", "postcode", "county", "ward", "state_district", "country"
            ];
            place = res.find(({type}) => placeTypes.includes(type));
        }
            
        const {lon, lat} = place || res[0];

        return [lon, lat];
    }

    return null;
}

module.exports = {
    defaultThemes,
    downloadImage,
    parseStyles,
    getDimensions,
    storageHelper,
    getMapUrl,
    getMapImageByCoordinates,
    getLocationCoordinates
};