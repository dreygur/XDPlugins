import {Color, LinearGradientFill, RadialGradientFill} from "./scenegraph";

/**
 * Type of gradient color element: linear gradient or radial gradient
 */
export enum GradientType {
    LINEAR,
    RADIAL
}

/**
 * Assets library entry representing a solid color.
 */
type ColorAsset = {
    /**
     * Name of the Assets entry, if it is explicitly named. (The UI shows an auto-generated label for any unnamed assets).
     */
    name?: string;

    /**
     * Color of the asset
     */
    color: Color;
}

/**
 * Assets library entry representing a linear or radial gradient.
 */
type GradientAsset = {
    /**
     * Name of the Assets entry, if it is explicitly named. (The UI shows an auto-generated label for any unnamed assets).
     */
    name?: string;
    /**
     * Either `GradientType.LINEAR` or `GradientType.RADIAL`
     */
    gradientType: GradientType;
    /**
     * Array of color stops used in the gradient, where stop >= 0 and <= 1, and the values are strictly increasing. Same format as the colorStops property of a LinearGradientFill object.
     */
    colorStops: Array<{ stop: number, color: Color }>
}

/**
 * Assets library entry representing a set of text character styles.
 */
type CharacterStyleAsset = {
    /**
     * Name of the Assets entry, if it is explicitly named. (The UI shows an auto-generated label for any unnamed assets).
     */
    name?: string;
    /**
     * Object containing the style properties
     */
    style: CharacterStyle;
}

/**
 * Character style properties. See documentation for the Text node type for more details.
 *
 * When creating a new character style, all properties are mandatory except those with default values specified here. When deleting
 an existing character style, always pass the exact object returned by [`characterStyles.get()`](#module_assets-characterStyles-get) (with all properties fully
 specified) to avoid any ambiguity.
 */
type CharacterStyle = {
    /**
     * the font family
     */
    fontFamily: string;
    /**
     * the style of the font
     */
    fontStyle: string;
    /**
     * the size of the font
     */
    fontSize: number;
    /**
     * the Color of the font fill
     */
    fill: Color;
    /**
     * the character spacing
     */
    charSpacing: number;
    /**
     * the line spacing
     */
    lineSpacing: number;
    /**
     * whether underline is turned on
     */
    underline: boolean;
    /**
     * (**Since**: XD 19)
     * Default `false`; whether strikethrough is turned on
     */
    strikethrough?: boolean;
    /**
     * (**Since**: XD 19)
     * Default "none"; one of "none", "uppercase", "lowercase", or "titlecase"
     */
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'titlecase';
    /**
     * (**Since**: XD 20)
     * Default "none"; one of "none", "superscript", or "subscript"
     */
    textScript?: 'none' | 'superscript' | 'subscript';
}

/**
 * The collection of colors and gradients saved in this document's Asset library
 */
interface colors {
    /**
     * Get a list of all color/gradient assets, in the order they appear in the Assets panel.
     *
     * The list may contain a mix of solid Color assets and/or gradient assets. If there are no color/gradient assets, an empty array is returned.
     *
     * @example
     *  var assets = require("assets"),
     *  allColors = assets.colors.get();
     *
     */
    get(): Array<ColorAsset | GradientAsset>;

    /**
     * Add color/gradient assets to the collection.
     *
     * The list may contain a mix of solid Color assets and/or gradient assets. Items are not added if a duplicate color/gradient already exists in the collection, *regardless of its name*.
     * @param colorAssets The color assets
     * @returns {number} number of assets added (may be less than requested if duplicates already exist)
     */
    add(colorAssets: Color | ColorAsset | LinearGradientFill | RadialGradientFill | GradientAsset | Array<Color | ColorAsset | LinearGradientFill | RadialGradientFill | GradientAsset>): number;

    /**
     * Delete color/gradient assets from the collection.
     *
     * The list may contain a mix of solid Color assets and/or gradient assets. Assets with the same color/gradient are removed even if their names differ. Assets that already don't exist in the collection are silently ignored. Typically you will pass asset objects returned from `get()` directly to this function.
     *
     * @param colorAssets The color assets
     * @returns {number} number of assets deleted (may be less than requested if some didn't exist)
     */
    delete(colorAssets: Color | ColorAsset | LinearGradientFill | RadialGradientFill | GradientAsset | Array<Color | ColorAsset | LinearGradientFill | RadialGradientFill | GradientAsset>): number;
}

/**
 * The collection of character styles saved in this document's Assets library.
 */
interface characterStyles {
    /**
     * Get a list of all character style assets, in the order they appear in the Assets panel.
     *
     * If there are no character style assets, an empty array is returned.
     *
     * @example
     *  var assets = require("assets"),
     *  allCharacterStyles = assets.characterStyles.get();
     *
     */
    get(): Array<CharacterStyleAsset>;

    /**
     * Add one or more character style assets to the collection.
     *
     * Items are not added if a duplicate character style already exists in the collection, regardless of its name. All character style properties must be fully specified (no properties are optional).
     *
     * @param charStyleAssets The character style assets
     * @returns {number} number of assets added (may be less than requested if duplicates already exist)
     */
    add(charStyleAssets: CharacterStyleAsset | Array<CharacterStyleAsset>): number;

    /**
     * Delete one or more character style assets from the collection.
     *
     * Assets with the same character style are removed *even if their names differ*. Assets that already don't exist in the
     * collection are silently ignored. All character style properties must be fully specified (no properties are optional).
     * To avoid ambiguity, pass the exact asset objects returned from [`get()`](#module_assets-characterStyles-get) directlyto this function.
     *
     * @returns {number} number of assets deleted (may be less than requested if some didn't exist)
     * @param charStyleAssets The character styles
     */
    delete(charStyleAssets: CharacterStyleAsset | Array<CharacterStyleAsset>): number;
}

/**
 * The collection of colors and gradients saved in this document's Asset library
 */
export const colors: colors;
/**
 * The collection of character styles saved in this document's Assets library.
 */
export const characterStyles: characterStyles;
