/*
 * Copyright (c) 2018. by Pablo Klaschka
 */

class SelectionChecker {
    /**
     * Creates a new selection checker to check types of the selection
     * @param {Selection} selection The selection passed into the main funciton
     */
    constructor(selection) {
        this.selection = selection;
    }

    /**
     * Checks if selection contains one or more of the specified SceneNode `types`
     * @param {...string} types The SceneNode types
     * @returns {boolean} `true` if the selection contains one or more of the specified SceneNode `types`
     */
    oneOrMore(...types) {
        return this.count.apply(this, types) > 0;
    }

    /**
     * Checks if selection contains `n` or more of the specified SceneNode `types`
     * @param {...string} types The SceneNode types
     * @param  {number} n The minimum number of occurances in selection
     * @returns {boolean} `true` if the selection contains `n` or more of the specified SceneNode `types`
     */
    nOrMore(n, ...types) {
        return this.count.apply(this, types) >= n;
    }

    /**
     * Checks if selection contains `n` or less of the specified SceneNode `types`
     * @param {...string} types The SceneNode types
     * @param  {number} n The maximum number of occurances in selection
     * @returns {boolean} `true` if the selection contains `n` or less of the specified SceneNode `types`
     */
    nOrLess(n, ...types) {
        return this.count.apply(this, types) <= n;
    }

    /**
     * Checks if selection contains exactly `n` occurances of the specified SceneNode `types`
     * @param {...string} types The SceneNode types
     * @param  {number} n The desired number of occurances in selection
     * @returns {boolean} `true` if the selection contains exactly `n` occurances of the specified SceneNode `types`
     */
    exactlyN(n, ...types) {
        return this.count.apply(this, types) <= n;
    }

    /**
     * Checks if selection contains exactly one occurance of an element of the specified SceneNode `types`
     * @param {...string} types The SceneNode types
     * @returns {boolean} `true` if the selection contains exactly one occurance of an element of the specified SceneNode `types`
     */
    exactlyOne(...types) {
        return this.count.apply(this, types) === 1;
    }

    /**
     * Checks if selection contains no occurances of any of the specified SceneNode `types`
     * @param {...string} types The SceneNode types
     * @returns {boolean} `true` if the selection contains no occurances of any of the specified SceneNode `types`
     */
    no(...types) {
        return this.count.apply(this, types) < 1;
    }

    /**
     * Counts the number of occurences of the scecified types
     * @returns {number} The number of elements of the specified types
     * @param {...string} types the SceneNode types
     */
    count(...types) {
        return this.selection.items.reduce((previousValue, currentValue) => {
            let isOfOneOfTypes = false;
            for (let type of types) {
                if (SelectionChecker.checkForType(currentValue, type)) {
                    isOfOneOfTypes = true;
                    break;
                }
            }
            return previousValue + isOfOneOfTypes ? 1 : 0;
        }, 0);
    }

    /**
     * Checks if `node` matches type (specified as `string`)
     * @param {SceneNode} node
     * @param {string} type
     * @returns {boolean} `true` if `node` matches specified ``type`
     */
    static checkForType(node, type) {
        const typeCheckLookupTable = {
            '*': (node) => {
                return !!node;
            },
            'Text': (node) => {
                const {Text} = require('scenegraph');
                return node instanceof Text;
            },
            'AreaText': (node) => {
                const {Text} = require('scenegraph');
                return node instanceof Text && node.areaBox;
            },
            'PointText': (node) => {
                const {Text} = require('scenegraph');
                return node instanceof Text && node.areaBox === null;
            },
            'Rectangle': (node) => {
                const {Rectangle} = require('scenegraph');
                return node instanceof Rectangle;
            },
            'Artboard': (node) => {
                const {Artboard} = require('scenegraph');
                return node instanceof Artboard;
            },
            'Group': (node) => {
                const {Group} = require('scenegraph');
                return node instanceof Group;
            },
            'BooleanGroup': (node) => {
                const {BooleanGroup} = require('scenegraph');
                return node instanceof BooleanGroup;
            },
            'Ellipse': (node) => {
                const {Ellipse} = require('scenegraph');
                return node instanceof Ellipse;
            },
            'GraphicsNode': (node) => {
                const {GraphicsNode} = require('scenegraph');
                return node instanceof GraphicsNode;
            },
            'Line': (node) => {
                const {Line} = require('scenegraph');
                return node instanceof Line;
            },
            'LinkedGraphic': (node) => {
                const {LinkedGraphic} = require('scenegraph');
                return node instanceof LinkedGraphic;
            },
            'Path': (node) => {
                const {Path} = require('scenegraph');
                return node instanceof Path;
            },
            'RepeatGrid': (node) => {
                const {RepeatGrid} = require('scenegraph');
                return node instanceof RepeatGrid;
            },
            'RootNode': (node) => {
                const {RootNode} = require('scenegraph');
                return node instanceof RootNode;
            },
            'SceneNode': (node) => {
                const {SceneNode} = require('scenegraph');
                return node instanceof SceneNode;
            },
            'SymbolInstance': (node) => {
                const {SymbolInstance} = require('scenegraph');
                return node instanceof SymbolInstance;
            },
        };
        return (typeCheckLookupTable[type]) ? typeCheckLookupTable[type](node) : false;
    }
}

module.exports = SelectionChecker;