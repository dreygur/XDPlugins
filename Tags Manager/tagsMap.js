//Maps ids to tag names
//(sadsflknfds, rectangle)

const tagsMap = new Map();
const SEPERATOR = ":";

let applicationTagsUpdateRequired = false;

function getApplicationTagsUpdateRequired() {
    return applicationTagsUpdateRequired;
}

function setApplicationTagsUpdateRequired(val) {
    applicationTagsUpdateRequired = val;
}

function getGuid(tag) {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + SEPERATOR + tag;
}

function log(...strs) {
    return;
    console.log("Mapper----", strs);
}

function getTagIdFromName(tag) {
    let ret = null;
    for (const [key, value] of tagsMap.entries()) {
        if(tag == value) {
            ret = key;
        }
    }

    return ret;
}

function getTagFromId(tagId) {
    
    let tag = tagsMap.get(tagId);
    if(!tag) {
        let parts = tagId.split(SEPERATOR);
        
        let tagName = parts.pop();
        tagsMap.set(tagId, tagName);
        
        log("setApplicationTagsUpdateRequired", true);
        setApplicationTagsUpdateRequired(true);

        return tagName;
    }

    return tag;
}


function setTag(tag) {
    
    tag = tag.trim();
    
    let tagId = getTagIdFromName(tag);
    if(tagId) {
        return tagId;
    }

    tagId = getGuid(tag);
    
    tagsMap.set(tagId, tag);
    
    return tagId;
}

function editTag(tagId, newTag) {
    tagsMap.set(tagId, newTag);
}

function deleteTag(tagId) {
    tagsMap.delete(tagId);
}

function serialize() {
    let obj = {};

    for (const [key, value] of tagsMap.entries()) {
        obj[key] = value;
    }

    return obj;
}

function unserialize(obj) {

    Object.entries(obj).forEach(([key, value]) => {
        tagsMap.set(key, value);
    });
}

function getTagsMap() {
    return tagsMap;
}

module.exports.getTagsMap = getTagsMap;

module.exports.getTagIdFromName = getTagIdFromName;
module.exports.getTagFromId = getTagFromId;
module.exports.getApplicationTagsUpdateRequired = getApplicationTagsUpdateRequired;
module.exports.setApplicationTagsUpdateRequired = setApplicationTagsUpdateRequired;

module.exports.setTag = setTag;
module.exports.editTag = editTag;
module.exports.deleteTag = deleteTag;
module.exports.serialize = serialize;
module.exports.unserialize = unserialize;