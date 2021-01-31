const scenegraph = require("scenegraph");
const applicationTags   = new Map();
const currentTags       = new Map();

const tagsMapper = require("./tagsMap.js");

const TAG_MANAGER_PLUGIN = "TagManager";

let filterString = '';


function log(...strs) {
    return;
    console.log("TagsManager----", strs);
}


function getCurrentTags() {
    return currentTags;
}

// function getObjectsForTag(tag, selection, documentRoot) {
//     let existingObjects = tagObjectMapping.get(tag);
//     let ret = [];
//     if(existingObjects) {
//         existingObjects.forEach(obj => {
//             if(scenegraph.getNodeByGUID(obj)) {
//                 ret.push(obj);
//             }
//         });
//     }

//     tagObjectMapping.set(tag, ret);
//     return ret;
// }

// function checkAndAddToApplicationTagsMap(selection) {
//     if(selection.items) {
//         selection.items.forEach(item => {
//             checkAndAddToApplicationTagsMapForItem(item);
//         });
//     }
// }

// function checkAndAddToApplicationTagsMapForItem(item) {
//     if(item instanceof Group) {
        
//         item.children.forEach(child => {
//             checkAndAddToApplicationTagsMapForItem(child);
//         });
//     }
//     else if(item instanceof Artboard) {
        
//         item.children.forEach(child => {
//             checkAndAddToApplicationTagsMapForItem(child);
//         });
//     }

//     if(item.pluginData && item.pluginData.name == TAG_MANAGER_PLUGIN) {
//         let tags = pluginData.tags;
//         let tagsList = tags.split(',');
//         tagsList.forEach(tag => {
//             tag = tag.trim();
//             //addToTagObjectMap(tag, item);
//         });
//     }
// }

/*
Generic Helpers
*/

function getTagsMapAsString(tagsMap) {
    let arr = [];
    tagsMap.forEach((key, value) => {
        arr.push(value); 
    })

    return arr.join(',');
}

function clearTagsOnNode(node) {
    
    node.pluginData = null;    
}

function setTagToNode(tagStr, node, isRoot = false) {

    let tagId = tagsMapper.setTag(tagStr);

    if(node.pluginData) {
        if(node.pluginData.name == TAG_MANAGER_PLUGIN) {
            let currentTags = node.pluginData.tags;
            let tagsList = currentTags.split(',');

            if(tagsList.indexOf(tagId) == -1) {
                tagsList.push(tagId.trim());
            }
            
            if(isRoot) {

                node.pluginData = {
                    name: TAG_MANAGER_PLUGIN,
                    tags: tagsList.join(','),
                    tagsMap: tagsMapper.serialize()
                    //tagsMap: tagObjectMapping
                }
            }
            else {
                node.pluginData = {
                    name: TAG_MANAGER_PLUGIN,
                    tags: tagsList.join(','),
                    //tagsMap: tagObjectMapping
                }
            }
        }  
    }
    else {
        node.pluginData = {
            name:TAG_MANAGER_PLUGIN,
            tags:tagId.trim(),
            //tagsMap: tagObjectMapping
        }
    }

    return tagId;
    //addToTagObjectMap(tag, node);
}

function removeTagFromNode(tagStr, node) {

    let tagId = tagsMapper.getTagIdFromName(tagStr);

    if(node.pluginData && node.pluginData.name == TAG_MANAGER_PLUGIN) {
        let currentTags = node.pluginData.tags;
        let tagsList = currentTags.split(',');
        let index = tagsList.indexOf(tagId);
        if(index  == -1) {
            
        }
        else {
            tagsList.splice(index, 1);
        }

        if(tagsList.length > 0) {
            node.pluginData = {
                name: TAG_MANAGER_PLUGIN,
                tags:  tagsList.join(','),
                //tagsMap: tagObjectMapping
            }
        }
        else {
            node.pluginData = null;
        }

        //removeFromTagObjectMap(tag, node);
    }
}

function getTagsFromNode(node, tagIds) {
    if(!tagIds)
        tagIds = new Map();

    let pluginData = node.pluginData;
    
    if(pluginData && pluginData.name == TAG_MANAGER_PLUGIN) {
        let currentTags = pluginData.tags;
        let tagsList = currentTags.split(',');

        log("getTagsFromNode", node.name, currentTags);

        tagsList.forEach(tagId => {
            tagId = tagId.trim();
            tagIds.set(tagId, tagId);
        });
    }

    return tagIds;
}

function getTagsSetFromNode(node) {
    let set = new Set();
    let pluginData = node.pluginData;
    
    if(pluginData && pluginData.name == TAG_MANAGER_PLUGIN) {
        let currentTags = pluginData.tags;
        let tagsList = currentTags.split(',');

        log("getTagsFromNode", node.name, currentTags);

        tagsList.forEach(tagId => {
            set.add(tagId);
        });
    }

    return set;
}

function getTagsMapFromRoot(documentRoot) {
    let pluginData = documentRoot.pluginData;
    
    if(pluginData && pluginData.name == TAG_MANAGER_PLUGIN && pluginData.tagsMap) {
        let tagsMap = pluginData.tagsMap;
        if(tagsMap) {
            tagsMapper.unserialize(tagsMap);
        }
    }
}
/*
Application level tags management apis
*/

function initApplicationTags(documentRoot) {
    getTagsMapFromRoot(documentRoot);
    let tagIds = getTagsFromNode(documentRoot, null);
    
    for (const [key, value] of tagIds.entries()) {
        applicationTags.set(key, value);
    }
}

function setApplicationTag(tagsString, documentRoot) {
    let tags = tagsString.split(',');

    tags.forEach(tag => {
        tag = tag.trim();
        let tagId = setTagToNode(tag, documentRoot, true);

        applicationTags.set(tagId, tag);
    });
    
}

function getApplicationTags() {
    
    let ret = new Map();

    if(applicationTags) {
        
        for (const [key, value] of applicationTags.entries()) {
            
            let tag = tagsMapper.getTagFromId(key);

        //    log("Application tag:", key, value, tag);

            if(filterString && filterString.length > 0) {
                if(tag.toLowerCase().indexOf(filterString.toLowerCase()) >=0 ) {
                    ret.set(tag, value);
                }
            }
            else {
                ret.set(tag, value);
            }
        }
    }

    log("Application tags returned: ", getTagsMapAsString(ret));
    return ret;
}

function getApplicationTagsString() {
    return getTagsMapAsString(getApplicationTags());
}

function clearApplicationTags(documentRoot) {
    clearTagsOnNode(documentRoot);
}

/*
Selection level tags management apis
*/
function setSelectionTag(tagsString, selection, documentRoot) {
    
    let tags = tagsString.split(',');
    
    tags.forEach(tag => {
        if(!tag || tag.trim().length == 0) {

        }
        else {
            tag = tag.trim();

            if(selection) {
                selection.items.forEach(item => {
                    setTagToNode(tag, item);
                });
            }
        }
    });

    setApplicationTag(tagsString, documentRoot);
}

function removeSelectionTag(tagsString, selection, documentRoot) {
    let tags = tagsString.split(',');

    tags.forEach(tag => {
        if(!tag || tag.trim().length == 0) {

        }
        else {
            tag = tag.trim();
            selection.items.forEach(item => {
                removeTagFromNode(tag, item);
            });     
        }
    });
}

function removeItemTag(tagsString, item, documentRoot) {
    let tags = tagsString.split(',');

    tags.forEach(tag => {
        if(!tag || tag.trim().length == 0) {

        }
        else {
            tag = tag.trim();
            removeTagFromNode(tag, item);    
        }
    });
}

function removeTag(tagString, selection, documentRoot) {
    removeSelectionTag(tagString, selection, documentRoot);

    let tagId = tagsMapper.getTagIdFromName(tagString);
    removeTagFromNode(tagString, documentRoot);
    applicationTags.delete(tagId);
    tagsMapper.deleteTag(tagId);

    if(documentRoot.pluginData) {
        let currentTags = documentRoot.pluginData.tags;
        if(currentTags.length > 0) {
            documentRoot.pluginData = {
                name: TAG_MANAGER_PLUGIN,
                tags:  currentTags,
                tagsMap: tagsMapper.serialize()
            }
        }
        else {
            documentRoot.pluginData = null;
        }
    }
}

function getSelectionTags(selection) {

    let tags = new Map();
    let allsets = [];
    selection.items.forEach(item => {
        allsets.push(getTagsSetFromNode(item));
    });

    let intersections = new Set();
    if(allsets.length > 0) {
        intersections = allsets[0];

        if(allsets.length > 1) {
            for(let i = 1; i < allsets.length; i++) {
                intersections = [...intersections].filter(x=> allsets[i].has(x));
            }
        }
    }

    for (const x of intersections) {
        let tag = tagsMapper.getTagFromId(x);
        tags.set(tag, tag);
    }

    return tags;
}

function clearSelectionTags(selection) {
    selection.items.forEach(item => {
        clearTagsOnNode(item);
    });
}

function setFilterString(str) {
    filterString = str;
}

function getMissingSelectionTags(selection) {
    let selectionTags = getSelectionTags(selection);
    let ret = new Map();

    let myApplicationTags = getApplicationTags();
    for (const [key, value] of myApplicationTags.entries()) {
        if(!selectionTags.get(key)) {
            ret.set(key, key);
        } 
    }

    return ret;
}

function getTagIdFromName(tag) {
    return tagsMapper.getTagIdFromName(tag);
}

function editTag(oldTag, newtag, documentRoot) {
    let tagId = tagsMapper.getTagIdFromName(oldTag);
    tagsMapper.editTag(tagId, newtag);

    let currentTags = documentRoot.pluginData.tags;
    documentRoot.pluginData = {
        name: TAG_MANAGER_PLUGIN,
        tags: currentTags,
        tagsMap: tagsMapper.serialize()
    }

}

function getApplicationTagsUpdateRequired() {
    log('getApplicationTagsUpdateRequired', tagsMapper.getApplicationTagsUpdateRequired());
    return tagsMapper.getApplicationTagsUpdateRequired();
}

function setApplicationTagsUpdateRequired(val) {
    log('setApplicationTagsUpdateRequired', val);
    tagsMapper.setApplicationTagsUpdateRequired(val);
}

function updateApplicationTags(documentRoot) {
    let currentTagsList = [];
    let tagsMap = tagsMapper.getTagsMap();
    for (const [key, value] of tagsMap.entries()) {
        applicationTags.set(key, value);
        currentTagsList.push(value);
    }

    let currentTags = currentTagsList.join(',');
    documentRoot.pluginData = {
        name: TAG_MANAGER_PLUGIN,
        tags: currentTags,
        tagsMap: tagsMapper.serialize()
    }
}

function getTagFromId(id) {
    tagsMapper.getTagFromId(id);
}

module.exports.updateApplicationTags = updateApplicationTags;
module.exports.setApplicationTagsUpdateRequired = setApplicationTagsUpdateRequired;
module.exports.getApplicationTagsUpdateRequired = getApplicationTagsUpdateRequired;


module.exports.setFilterString = setFilterString;

module.exports.setSelectionTag = setSelectionTag;
module.exports.removeSelectionTag = removeSelectionTag;
module.exports.removeItemTag = removeItemTag;

module.exports.getSelectionTags = getSelectionTags;
module.exports.getMissingSelectionTags = getMissingSelectionTags;
module.exports.clearSelectionTags = clearSelectionTags;

module.exports.initApplicationTags = initApplicationTags;

module.exports.setApplicationTag = setApplicationTag;
module.exports.getApplicationTags = getApplicationTags;
module.exports.clearApplicationTags = clearApplicationTags;
module.exports.getApplicationTagsString = getApplicationTagsString;

module.exports.getCurrentTags = getCurrentTags;
module.exports.getTagsMapAsString = getTagsMapAsString;

module.exports.getTagIdFromName = getTagIdFromName;

module.exports.getTagFromId = getTagFromId;
module.exports.editTag = editTag;
module.exports.removeTag = removeTag;

//module.exports.getObjectsForTag = getObjectsForTag;
//module.exports.checkAndAddToApplicationTagsMap = checkAndAddToApplicationTagsMap;

module.exports.TAG_MANAGER_PLUGIN = TAG_MANAGER_PLUGIN;
