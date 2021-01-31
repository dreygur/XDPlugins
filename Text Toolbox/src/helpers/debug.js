/*
 * Copyright (c) 2018. by Pablo Klaschka
 */

class debugHelper {
    static shouldDebug() {
        return false;
    }

    /**
     * Logs elements to console
     * @param {*} objects Logged objects
     */
    static log(...objects) {
        if (debugHelper.shouldDebug()) {
            objects.unshift('Text Toolbox Plugin: ');
            const args = Array.prototype.slice.call(objects.map(value => value instanceof Object ? JSON.stringify(value) : value));
            console.log.apply(console, args);
        }
    }
}


module.exports = debugHelper;