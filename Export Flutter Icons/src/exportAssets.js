var glyphs2ttf = require("./glyphs2ttf").glyphs2ttf;
const application = require("application");
const fs = require("uxp").storage.localFileSystem;

const { alert, error } = require("./lib/dialogs.js");

module.exports = async function exportAssets(selection, root, packageName) {
    console.log('selection:');
    console.log(selection.items);
    //console.log('packageName: ' + (packageName || ""));

    //need an actual selection
    if (selection.items.length <= 0) {
        alert("Export Flutter Icons", "Please select at least one Artboard for export")
        return;
    }else {
        var hasArtboard = false;

        for (var k = 0; k < selection.items.length; k++) {
            const node = selection.items[k];
    
            if (node.constructor.name.toLowerCase() == "artboard") {
                hasArtboard = true;
                break;
            }
        }
        if ( !hasArtboard ){
            alert("Export Flutter Icons", "Please select at least one Artboard for export")
            return;
        }
    }

    //set up file I/O
    const folder = await fs.getFolder();

    var outputDir = await folder.createFolder("Flutter Icons (" + Date.now() + ")");

    var fontsDir = await outputDir.createFolder("fonts");
    
    for (var k = 0; k < selection.items.length; k++) {
        const node = selection.items[k];

        if (node.constructor.name.toLowerCase() == "artboard") {
            const fontName = node.name.replace(/[^a-z0-9]/gi, '');

            var hasPathGroup = false;
            for (var i = 0; i < node.children.length; i++) {
              const childNode = node.children.at(i);
              const childNodeType = childNode.constructor.name.toLowerCase();
              if (childNodeType == "path" || childNodeType == "group") {
                hasPathGroup = true;
                break;
              }
            }

            if ( !hasPathGroup ){
              alert("Export Flutter Icons", "Plugin supports only 'path' and 'group' elements!");
              return;
            }

            var glyphs = [];
            const renditions = [];
            const hasIconsSuffix = fontName.toLowerCase().endsWith("icons") || fontName.toLowerCase().endsWith("icon");             

            const fontClassFileName = fontName + ( hasIconsSuffix ? "" : "Icons");
            
            const ttfFile = await fontsDir.createFile((fontClassFileName + ".ttf"), { overwrite: true });
            const classFileName = (node.name.replace(/[^a-z0-9]/gi, '_')).toLowerCase() + ( hasIconsSuffix ? ".dart" : "_icons.dart" );
            
            const classFile = await outputDir.createFile(classFileName, { overwrite: true });

            for (var i = 0; i < node.children.length; i++) {
                const childNode = node.children.at(i);
                const childNodeType = childNode.constructor.name.toLowerCase();
                if ( childNodeType == "path" || childNodeType == "group") {
                    const svgFileName = childNode.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
                    const file = await outputDir.createFile((svgFileName + ".svg"), { overwrite: true });

                    glyphs.push({
                        glyph: file,
                        name: svgFileName,
                        code: 0xE000 + i,
                    });

                    renditions.push({
                        node: childNode,
                        outputFile: file,
                        type: application.RenditionType.SVG,
                        scale: null,
                        quality: null,
                        minify: true,
                        embedImages: true
                    });
                }

            }

            if (renditions.length > 0) {

                await application.createRenditions(renditions)
                    .then(results => {
                        return true;
                    })
                    .catch(error => {
                        console.log(error);
                        return false;
                    });

                await glyphs2ttf({
                    fontName: fontName,
                    fontFileName: fontClassFileName + ".ttf",
                    fontClassFileName: fontClassFileName,
                    classFile: classFile,
                    packageName: packageName,
                    ttfFile: ttfFile,
                    glyphs: glyphs
                });
            }
        }
    }

    return true;
}
