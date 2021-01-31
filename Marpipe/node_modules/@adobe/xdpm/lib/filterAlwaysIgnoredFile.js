const { ALWAYS_IGNORE } = require("./constants.js");

function filterAlwaysIgnoredFile(filepath) {
    let shouldBeIgnored = false;
    ALWAYS_IGNORE.forEach(regex => {
        if (regex.test(filepath)) {
            shouldBeIgnored = true;
        }
    });
    return !shouldBeIgnored;
}

module.exports = filterAlwaysIgnoredFile;