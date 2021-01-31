// Search in variable 'entries' for a folder with the name 'folderName' and 
// returns an Array.<Entry> with the content of that folder
async function getFilesFromSpecificFolder(entries, folderName) {
    var folder = entries.filter(entry => entry.isFolder && entry.name == folderName);
    if (folder.length == 0) {
        console.log('The folder ' + folderName + ' doesn\'t exist');
        return undefined;
    } else {
        var files = await folder[0].getEntries();
        return files;
    }
}

// Find the file with the name 'fileName', read the file and return
// the data as a JSON
async function readSpecificFile(entries, fileName) {
    var data = entries.filter(entry => entry.name == fileName);
    return JSON.parse(await data[0].read());
}

module.exports = {
    getFilesFromSpecificFolder,
    readSpecificFile
}