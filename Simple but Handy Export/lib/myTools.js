const removeTheNotApproved = (unsanitized) => {
    return unsanitized.replace(/[\\:*?"<>|#]/g, '')
}

const dashesForSlashes = (unsanitized) => {
    return unsanitized.replace(/\//g, '-')
}

const sanitizeName = (unsanitized) => {
    return removeTheNotApproved(dashesForSlashes(unsanitized))
}

async function getOrCreateFolder(parent, name) {
    try {
        return await parent.getEntry(name);
    }
    catch {
        return await parent.createFolder(name);
    }
}

async function createOrOverrideFile(folder, path, createSubDirectories = true, format = "PNG") {

    const pathSegmentIndex = path.indexOf("/");

    if (pathSegmentIndex === -1 || !createSubDirectories)
        //No more sub directories, return the file
        return await folder.createFile(`${sanitizeName(path)}.${format.toLowerCase()}`, {overwrite: true});

    if (pathSegmentIndex > 0)
        //Multiple slashes next to each other, don't create directory with empty name
        folder = await getOrCreateFolder(folder, path.substring(0, pathSegmentIndex));

    //Move on to the next sub directory
    return await createOrOverrideFile(folder, path.substring(pathSegmentIndex + 1));
}

function clamp(number, min, max) {
    var actualMin = Math.min(min, max);
    var actualMax = Math.max(min, max);

    if (number <= actualMin)
        return min;
    if (number >= actualMax)
        return max;

    return number;
}

module.exports = {
    sanitizeName: sanitizeName,
    createOrOverrideFile: createOrOverrideFile,
    clamp: clamp
}