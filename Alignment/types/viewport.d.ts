/**
 * The `viewport` module represents the current UI view of the XD document's content.
 * Since: XD 14
 */
import {SceneNode} from "./scenegraph";

declare class viewport {
    /**
     * The current viewport bounds expressed in global coordinates.
     */
    public static readonly bounds: {x:number,y:number,width:number,height:number};

    /**
     * The current viewport zoom factor (where 1.0 = 100% zoom, 0.5 = 50% zoom, etc.).
     */
    public static readonly zoomFactor: number;

    /**
     * Smoothly pan the viewport to bring the entire given region into view. If the region is already fully in view, does nothing. If the given region is too large to fit entirely in view, it is simply centered (zoom remains unchanged).
     *
     * The region can be defined by passing a {@link SceneNode}, or by explicitly specifying a rectangle in global coordinates.
     * @param {!SceneNode} node The node that gets scrolled into view
     */
    public static scrollIntoView(node: SceneNode): void;

    /**
     * Smoothly pan the viewport to bring the entire given region into view. If the region is already fully in view, does nothing. If the given region is too large to fit entirely in view, it is simply centered (zoom remains unchanged).
     *
     * The region can be defined by passing a {@link SceneNode}, or by explicitly specifying a rectangle in global coordinates.
     * @param x
     * @param y
     * @param width
     * @param height
     */
    public static scrollIntoView(x: number, y:number, width:number, height:number): void;

    /**
     * Smoothly pan the viewport to center on a specific point in the document's global coordinates. Even if the point is already in view, the view pans until it is centered.
     * @param {number} x The x-coordinate of the centered point (in the document's global coordinates)
     * @param {number} y The y-coordinate of the centered point (in the document's global coordinates)
     */
    public static scrollToCenter(x: number, y:number): void;

    /**
     * Zoom & pan the view as needed so the given region fills the viewport (with some padding). If the region is large, zooms out as needed so it fits entirely in view. If the region is smaller, zooms in so the region fills the entire viewport - may zoom in past 100% to achieve this.
     *
     * The region can be defined by passing a {@link SceneNode}, or by explicitly specifying a rectangle in global coordinates.
     * @param {!SceneNode} node
     */
    public static zoomToRect(node: SceneNode): void;

    /**
     * Zoom & pan the view as needed so the given region fills the viewport (with some padding). If the region is large, zooms out as needed so it fits entirely in view. If the region is smaller, zooms in so the region fills the entire viewport - may zoom in past 100% to achieve this.
     *
     * The region can be defined by passing a {@link SceneNode}, or by explicitly specifying a rectangle in global coordinates.
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     */
    public static zoomToRect(x: number, y:number, width:number, height:number): void;
}

export = viewport;
