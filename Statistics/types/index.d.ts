import {Artboard, SceneNode} from "scenegraph";

export {};

declare global {
    /**
     * Imports classes from a module (e.g. ```const { Text } = require('scenegraph'); ```)
     * @param module The module name
     */
    function require(module: string): void;

    /**
     * Represents the children of a scenenode. Typically accessed via the SceneNode.children property.
     */
    class SceneNodeList {
        public items: SceneNode[];
        public readonly length: number;

        public forEach(
            callback: (sceneNode: SceneNode, index: number) => void,
            thisArg?: object
        ): void;

        public forEachRight(
            callback: (sceneNode: SceneNode, index: number) => void,
            thisArg?: object
        ): void;

        public filter(
            callback: (sceneNode: SceneNode, index: number) => boolean,
            thisArg?: object
        ): Array<SceneNode>;

        public map(
            callback: (sceneNode: SceneNode, index: number) => any,
            thisArg?: object
        ): Array<any>;

        public some(
            callback: (sceneNode: SceneNode, index: number) => boolean,
            thisArg?: object
        ): boolean;

        public at(index: number): SceneNode | null;
    }

    /**
     * The selection object represents the currently selected set of nodes in the UI. You can set the selection to use it as input for commands, or to determine what is left selected for the user when your plugin’s edit operation completes.
     *
     * The current selection state is passed to your command handler function as an argument.
     *
     * The selection can only contain items within the current edit context:
     *
     *  - If the user has drilled down into a container node, the container is the current edit context and only its immediate children can be selected.
     *  - If the user hasn’t drilled into any container, the root of the document is the edit context, and the selection may contain any artboard or any combination of the pasteboard’s immediate children and one or more artboards’ immediate children. The selection cannot contain both artboards and non-artboards at the same time, however.
     *
     * Note that when in the root edit context, the selection can contain items with multiple different parents.
     *
     * Items that are locked cannot be in the selection. If the user or your plugin attempts to select any locked items, they are automatically filtered into a separate list (itemsIncludingLocked) which is generally only used by the Unlock command.
     */
    interface Selection {
        /**
         * Array representing the current selection. Empty array if nothing is selected (never null). Never includes locked nodes.
         *
         * As a convenience, the setter also accepts a single node or null as valid input. However, the getter always returns an array.
         *
         * If the user selects nodes one-by-one, by Shift-clicking, this array lists the nodes in the order they were added to the selection.
         *
         * Returns a fresh array each time, so this can be mutated by the caller without interfering with anything. Mutating the array does not change the selection - only invoking the ‘items’ setter changes selection.
         */
        items: Array<SceneNode>;
        /**
         * Array representing the current selection plus any locked items that the user has attempted to select.
         */
        itemsIncludingLocked: Array<SceneNode>;
        /**
         * True if the selection isn’t empty and consists of one or more non-Artboards. Never true at the same time as hasArtboards.
         */
        hasArtwork: boolean;
        /**
         * True if the selection isn’t empty and consists of one or more Artboards. Never true at the same time as hasArtwork.
         */
        hasArtboards: boolean;
        /**
         * The context in which selection and edit operations must occur. If the user hasn’t drilled into any container node, this value is the document root, and its scope includes all immediate children of the pasteboard (including Artboards), and all immediate children of all those Artboards.
         */
        editContext: SceneNode;
        /**
         * The preferred parent to insert newly added content into. Takes into account the current edit context as well as the “focused artboard” if in the root context.
         */
        insertionParent: SceneNode;
        /**
         * The artboard the user is currently most focused on (via recent selection or edit operations). May be null, for example if no artboards exist or if the user just deleted an artboard.
         */
        focusedArtboard: Artboard | null | undefined;

    }

    /**
     * To get an instance: `require("uxp").shell`
     */
    class Shell {
        /**
         * Opens the url in an the system browser.
         * @param url The url which should be opened
         */
        public openExternal(url: string);
    }
}
