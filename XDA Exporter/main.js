const { showDialogY } = require("./dialog.js");
const { mapScreen } = require("./nodeMapper.js");
const { findArtboardInParent } = require("./scenegraphUtils.js");
const { saveText, saveTexts } = require("./textWriter.js");

const saveScreen = () => {
    const { selection } = require("scenegraph");

    let artboards = findArtboards(selection.items);
    let length = artboards.length
    if( length == 0 ){
        showDialogY("Please select any node");
        return;
    }else if( length == 1 ){
        let screenData = mapScreen(artboards[0]);
         saveText(artboards[0].name + ".xda", JSON.stringify(screenData, null , "\t"));
    }else{
        let fileInfos = artboards.map( a => {
            let screenData = mapScreen(a);
            return {
                "name" : a.name + ".xda",
                "text" : JSON.stringify(screenData, null , "\t")
            }
        });
        saveTexts(fileInfos);
    }    
}

const findArtboards = (nodes) => {
    let rtn = []
    nodes.forEach(x => {
        let artboard = findArtboardInParent(x);
        if(artboard != null && rtn.every(y => y.guid != artboard.guid)){
            rtn.push(artboard);
        }
    });
    return rtn;
}

module.exports = {
    commands: {
        "exportXda": saveScreen
    }
};
