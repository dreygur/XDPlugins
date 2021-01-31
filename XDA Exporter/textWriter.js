const fs = require("uxp").storage.localFileSystem;

const saveText = async (suggestedName, text) => {
    suggestedName = verifyString(suggestedName);
    const file = await fs.getFileForSaving(suggestedName);
    if (!file) {
        // file picker was cancelled
        return;
    }
    await file.write(text);
}

const saveTexts = async (fileInfos) => {
    const folder = await fs.getFolder();
    if (!folder) {
        // folder picker was cancelled
        return;
    }

    const entries = await folder.getEntries();
    for (var t of fileInfos){
        // ファイル名が存在しなくなるまで名前にインデント
        var count = 1;
        var initialFileName = verifyString(t.name);
        var fileName = initialFileName;
        while(true){
            if(entries.some(en => en.name == fileName)){
                count++;
                var s = initialFileName.split(".");
                fileName = s[0] + count + s[1];
            }else{
                break;
            }
        }
        const file = await folder.createFile(fileName);
        await file.write(t.text);
    };
}

const verifyString = (text) => {
    return text.replace(/\//g, "-");;
}

module.exports = {
    saveText,
    saveTexts
}