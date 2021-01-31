const application = require("application");

async function createIcon(folder, item) {
    let name = item.name;

    const file = await folder.createFile(name + ".png");

    let renditionSettings = [{
        node: item,               // [1]
        outputFile: file,                       // [2]
        type: application.RenditionType.PNG,    // [3]
        scale: 2                                // [4]
    }];

    application.createRenditions(renditionSettings)    // [1]
        .then(results => {                             // [2]
            console.log(`PNG rendition has been saved at ${results[0].outputFile.nativePath}`);
        })
        .catch(error => {                              // [3]
            console.log(error);
        });
}

module.exports = {
    createIcon,
};