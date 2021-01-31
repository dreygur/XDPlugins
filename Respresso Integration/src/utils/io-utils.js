const application = require("application");
const jsSHA = require('./sha256');
const utils = require('./utils');

const fs = require("uxp").storage.localFileSystem;

class IOUtils {

    constructor() { }

    async write(nodeList) {
        if (nodeList.length < 1) return;
        const folder = await fs.getTemporaryFolder();
        if (!folder) console.log("User canceled folder picker."); //todo - user doesn't select a folder
        const optionsProm = nodeList.map(async img => {
            const name = img.name;
            const id = `adobexd_${img.guid}`;
            const file = await folder.createFile(`${id}----id-name----${name}.txt`, { overwrite: true });
            return {
                node: img,
                outputFile: file,
                quality: 100,
                type: application.RenditionType.SVG,
                scale: 1,
                minify: true,
                embedImages: true
            }
        });

        try {
            // Create the rendition(s)
            const options = await Promise.all(optionsProm);
            const results = await application.createRenditions(options);

            // Create and show a modal dialog displaying info about the results
            const contents = await this.read(results)
            return contents;
        } catch (err) {
            // Exit if there's an error rendering.
            console.log(err); // todo make correct error
            return [];
        }
    }

    async read(files) {
        const images = files.map(async img => {
            const imgName = img.outputFile.name.replace(".txt", "").split("----id-name----");
            const imageId = imgName[0];
            const imageName = imgName[1];
            const image = await img.outputFile.read();

            const imageStartToken = "<image ";
            const imageStart = image.indexOf(imageStartToken);
            if (imageStart != -1) {
                const xlinkHrefToken = "xlink:href=";
                const xlinkHrefStart = image.indexOf(xlinkHrefToken, imageStart + imageStartToken.length);
                const dataToken = "data:"
                const mimeTypeStart = image.indexOf(dataToken, xlinkHrefStart + xlinkHrefToken.length);
                const mimeType = image.substring(mimeTypeStart + dataToken.length, image.indexOf(";", mimeTypeStart));

                const base64Start = image.indexOf(",", mimeTypeStart + mimeType.length) + 1;
                const base64Data = image.substring(base64Start, image.indexOf("\"", base64Start));

                return this.rasterObject(base64Data, mimeType, imageId, imageName);
            }
            else return this.vectorObject(image, imageId, imageName);
        });

        return await Promise.all(images);
    }

    async vectorObject(image, id, name) {
        var shaObj = new jsSHA("SHA-256", "TEXT");
        shaObj.update(image)
        var hash = shaObj.getHash("HEX");

        const svgBase64 = utils.base64encode(image)

        return {
            id: id,
            name: name,
            mimetype: "image/svg+xml",
            file: svgBase64,
            sha: hash
        }
    }

    async rasterObject(image, mimetype, id, name) {
        const raw = utils.base64decode(image);

        var shaObj = new jsSHA("SHA-256", "ARRAYBUFFER");
        shaObj.update(raw)
        var hash = shaObj.getHash("HEX");

        return {
            id: id,
            name: name,
            mimetype: mimetype,
            file: image,
            sha: hash
        }
    }
}

module.exports = IOUtils;