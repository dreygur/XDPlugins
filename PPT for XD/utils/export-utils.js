const PptxGenJS = require("../external/dist/pptxgen"),
    application = require("application"),
    storage = require("uxp").storage,
    fs = require("uxp").storage.localFileSystem,
    constants = require("../utils/constants"),
    b64Arr = require("../external/dist/b64ArrayBuffer"),
    InputDialog = require("../views/input-dialog"),
    MessageDialog = require("../views/message-dialog");

async function deleteFiles(folder, files) {
    for(var i=0; i<files.length; i++) {
        const rendition = await folder.getEntry(files[i].name);
        await rendition.delete();
    }
    Promise.resolve(1);
}

function createArtboardRenditions(root, folder) {
    const fileCreationPromises = [];
    for(var i=0; i< root.children.length; i++) {
        const childArtboard = root.children.at(i);
        if (childArtboard.constructor.name === "Artboard") {
            fileCreationPromises.push(folder.createFile("rendition" + i + ".png", { overwrite: true }));
        }
    }
    // Create a file that will store the rendition
    return Promise.all(fileCreationPromises)
        .then(function (result) {

            var renditionOptions = [];
    
            for(var i=0; i< result.length; i++) {
                // Create options for rendering a PNG.
               // Other file formats have different required options.
               // See `application#createRenditions` docs for details.
               renditionOptions.push({
                   node: root.children.at(i),
                   outputFile: result[i],
                   type: application.RenditionType.PNG,
                   scale: 1
               });
                       
           }
           return application.createRenditions(renditionOptions);
        })
        .catch(function(err) {
            var messageDialog = MessageDialog.create("Error Occurred: ", err);
            return messageDialog.showModal();
        });
}

function exportRendition(root) {
    // Exit if there's no root
    // For production plugins, providing feedback to the user is expected
    if (root.children.length === 0) {
      var messageDialog = MessageDialog.create("No items. Please check if atleast one artboard is present in XD file.");
      return messageDialog.showModal();
    }

    let tempFolder, myFile, imagePaths;
    const pptx = new PptxGenJS();
    const firstArtboard = root.children.at(0);
    const width = firstArtboard.width;
    const height = firstArtboard.height;
  
    fs.getFileForSaving("output.ppt", { types: [ "ppt" ]}).then(function (file) {
        if (!file) {
            // file picker was cancelled
            return Promise.reject("File picker was cancelled");
        }
        myFile = file;
        // Get a folder by showing the user the system folder picker
        return fs.getTemporaryFolder();
    }).then(function (folder) {
        tempFolder = folder;
        return createArtboardRenditions(root, folder);
    }).then(function (results) {      
        pptx.setLayout({width: width/constants.PIXELS_PER_INCH, height: height/constants.PIXELS_PER_INCH});
        const pathPromises = [];
        for(var i=0; i< results.length; i++) {
            const imagePath = results[i].outputFile.name;
            pathPromises.push(tempFolder.getEntry(imagePath));
        }
        return Promise.all(pathPromises);
    }).then(function (results) {
        imagePaths = results;
        const imgPromises = []
        for(var i=0; i<results.length; i++) {
            imgPromises.push(results[i].read({format: storage.formats.binary}));
        }
        return Promise.all(imgPromises);
    }).then(function (results) {
        for(var i=0; i< results.length; i++) {
            var slide = pptx.addNewSlide();

            var base64String = "data:image/jpg;base64," + b64Arr.base64ArrayBuffer(results[i]);
            slide.addImage({data: base64String, x:0, y:0, w:width/constants.PIXELS_PER_INCH, h:height/constants.PIXELS_PER_INCH});
        }
        return pptx.save(null, null, null, myFile);
    }).then(function () {
        deleteFiles(tempFolder, imagePaths);
    }).then(function (result) {
        const dialog = InputDialog.create(myFile.nativePath);
        return dialog.showModal();
    }).catch(function (err) {
        console.log("Got Error: ", err);
    });
}

exports.exportRendition = exportRendition;