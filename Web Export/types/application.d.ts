import { Color, SceneNode, RootNode } from "scenegraph";
import { storage } from "uxp";

interface EditSettings {
    /**
     * Used as the Undo label in the **Edit** menu. If unspecified, XD uses the `uxp-edit-label` attribute on the DOM node which the user interacted with, and if that does not exist then the plugin's name will be used.
     */
    editLabel?: string;
    /**
     * If two consecutive edits to the same selection have the same `mergeId`, they are flattened together into one Undo step. If unspecified, for "high frequency" UI events (see above), XD treats the originating DOM node as a unique identifier for merging; for other UI events, merging is disabled.
     */
    mergeId?: string;
}

/**
 * Call `editDocument()` from a plugin panel UI event listener to initiate an edit operation batch in order to modify the XD document. This API is irrelevant for plugin menu item commands, which are wrapped in an edit batch automatically.
 *
 * XD calls the `editFunction()` synchronously (before `editDocument()` returns). This function is treated the same as a menu command handler:
 * 
 * * It is passed two arguments, the selection and the root node of the scenegraph
 * * It can return a Promise to extend the duration of the edit asynchronously
 * 
 * You can only call `editDocument()` in response to a user action, such as a button `"click"` event or a text input's `"input"` event. This generally means you must call it while a UI event handler is on the call stack.
 * 
 * For UI events that often occur in rapid-fire clusters, such as dragging a slider or pressing keys in a text field, XD tries to smartly merge consecutive edits into a single atomic Undo step. See the `mergeId` option below to customize this behavior.
 * @param editFunction Function which will perform your plugin's edits to the scenegraph.
 */
export function editDocument(editFunction: (selection: Selection, root: RootNode) => Promise<any> | void): void;

/**
 * Call `editDocument()` from a plugin panel UI event listener to initiate an edit operation batch in order to modify the XD document. This API is irrelevant for plugin menu item commands, which are wrapped in an edit batch automatically.
 *
 * XD calls the `editFunction()` synchronously (before `editDocument()` returns). This function is treated the same as a menu command handler:
 * 
 * * It is passed two arguments, the selection and the root node of the scenegraph
 * * It can return a Promise to extend the duration of the edit asynchronously
 * 
 * You can only call `editDocument()` in response to a user action, such as a button `"click"` event or a text input's `"input"` event. This generally means you must call it while a UI event handler is on the call stack.
 * 
 * For UI events that often occur in rapid-fire clusters, such as dragging a slider or pressing keys in a text field, XD tries to smartly merge consecutive edits into a single atomic Undo step. See the `mergeId` option below to customize this behavior.
 * @param options Optional settings object (see below). This argument can be omitted.
 * @param editFunction Function which will perform your plugin's edits to the scenegraph.
 */
export function editDocument(options: EditSettings, editFunction: (selection: Selection, root: RootNode) => Promise<any> | void): void;

interface RenditionSettingsBase {
    /**
     * Root of scenegraph subtree to render. This may be any node in the scenegraph, regardless of the current edit context.
     */
    node: SceneNode;
    /**
     * File to save the rendition to (overwritten without warning if it already exists)
     */
    outputFile: storage.File;
}

interface RenditionSettingsPNGorJPG extends RenditionSettingsBase {
    /**
     * (PNG & JPG renditions) DPI multipler in the range [0.1, 100], e.g. 2.0 for @2x DPI.
     */
    scale: number;
    /**
     * (PNG & JPEG renditions) Alpha component ignored for JPG. Optional: defaults to transparent for PNG, solid white for JPG.
     */
    background?: Color;
}

export interface RenditionSettingsPNG extends RenditionSettingsPNGorJPG {
    /**
     * File type
     */
    type: RenditionType.PNG;
}

export interface RenditionSettingsJPG extends RenditionSettingsPNGorJPG {
    /**
     * File type.
     */
    type: RenditionType.JPG;
    /**
     * (JPG renditions) Compression quality in the range [1, 100].
     */
    quality: number;
}

export interface RenditionSettingsSVG extends RenditionSettingsBase {
    /**
     * File type.
     */
    type: RenditionType.SVG;
    /**
     * (SVG renditions) If true, SVG code is minified.
     */
    minify: boolean;
    /**
     * (SVG renditions) If true, bitmap images are stored as base64 data inside the SVG file. If false, bitmap images are saved as separate files linked from the SVG code.
     */
    embedImages: boolean;
}

export interface RenditionSettingsPDF extends RenditionSettingsBase {
    /**
     * File type
     */
    type: RenditionType.PDF;
}

/**
 * All rendition settings fields are required (for a given rendition type) unless otherwise specified.
 */
export type RenditionSettings = RenditionSettingsPNG | RenditionSettingsJPG | RenditionSettingsSVG | RenditionSettingsPDF;

/**
 * Type that gets returned by `application.createRenditions`
 */
type RenditionResult = {
    /**
     * File the rendition was written to (equal to outputFile in RenditionSettings)
     */
    outputFile: storage.File;
}

/**
 * Generate renditions of nodes in the document in a batch. Overwrites any existing files without warning.
 *
 * A single createRenditions() call can generate any number of renditions, including multiple renditions of the same node (with different output settings) or renditions of multiple different nodes. Only one createRenditions() call can be executing at any given time, so wait for the Promise it returns before calling it again.
 *
 * @param renditions List of renditions to generate
 * @return Promise<Array<RenditionResult>, string> - Promise which is fulfilled with an array of RenditionResults (pointing to the same outputFiles that were originally passed in, or rejected with an error string if one or more renditions failed for any reason.
 */
export function createRenditions(renditions: RenditionSettings[]): Promise<RenditionResult[] | string>;

export enum RenditionType {
    JPG = "jpg",
    PNG = "png",
    PDF = "pdf",
    SVG = "svg",
}

/**
 * Adobe XD version number in the form "major.minor.patch.build"
 */
export const version: string;

/**
 * Current language the application UI is using. This may not equal the user's OS locale setting: it is the closest locale supported by XD - use this when you want your plugin's UI to be consistent with XD's UI. Specifies language only, with no region info (e.g. "fr", not "fr_FR").
 */
export const appLanguage: string;

/**
 * User's OS-wide locale setting. May not match the XD UI, since XD does not support all world languages. Includes both language and region (e.g. "fr_CA" or "en_US").
 */
export const systemLocale: string;
