const ExportImage = require("./utils/export-utils");

function exportPPTAsImage(selection, documentRoot) {
    return ExportImage.exportRendition(documentRoot);
}

module.exports = {
    commands: {
        exportPPTAsImage
    }
}
