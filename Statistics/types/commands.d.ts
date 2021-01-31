/**
 * You can make structural changes to the scenegraph, and perform other complex operations, by programmatically invoking the same commands as XD users have access to in the UI. These methods do not take arguments. Instead, set the selection to the objects you want the command to target, then invoke the command:
 */
declare class commands {
    /**
     * Wraps the selected objects in a Group, leaving the Group selected afterward. Equivalent to Object > Group in the UI.
     */
    public static group(): void;

    /**
     * Ungroups any of the selected objects that are ungroupable containers (Groups, Symbols, Repeat Grids, etc.). Equivalent to Object > Ungroup.
     */
    public static ungroup(): void;

    /**
     * Creates a masked Group from the selected objects, using the object that is highest in the z order as the mask shape. The mask shape must be a leaf node or Boolean Group. Equivalent to Object > Mask With Shape.
     */
    public static createMaskGroup(): void;

    /**
     * Converts each selected object to a Path with the exact same visual appearance. Only applies to leaf nodes and Boolean Groups. Equivalent to Object > Path > Convert to Path.
     */
    public static convertToPath(): void;

    /**
     * Duplicates all selected objects, leaving the duplicates selected afterward.
     *
     * - If the objects are artboards, the duplicates are positioned to not overlap any more artboards, and are placed at the top of the artboard z order.
     * - If normal objects, each duplicate is in the exact same position as the original, and just above it in the z order (duplicates of a multiple selection will not be contiguous in the z order if the originals were not).
     *
     * Edit > Duplicate
     */
    public static duplicate(): void;

    /**
     * Brings selected objects to the front of the z order. Equivalent to Object > Arrange > Bring to Front.
     */
    public static bringToFront(): void;

    /**
     * Brings each selected object one step closer to the front of the z order. Equivalent to Object > Arrange > Bring Forward.
     */
    public static bringForward(): void;

    /**
     * Sends selected objects to the back of the z order. Equivalent to Object > Arrange > Send to Back.
     */
    public static sendToBack(): void;

    /**
     * Sends each selected object one step closer to the back of the z order. Equivalent to Object > Arrange > Send Backward.
     */
    public static sendBackward(): void;

    /**
     * Aligns all selected objects flush left. Equivalent to Object > Align > Left.
     */
    public static alignLeft(): void;

    /**
     * Aligns all selected objects flush right. Equivalent to Object > Align > Right.
     */
    public static alignRight(): void;

    /**
     * Aligns all selected objects along their horizontal centerlines. Equivalent to Object > Align > Center (Horizontally).
     */
    public static alignHorizontalCenter(): void;

    /**
     * Aligns all selected objects flush top. Equivalent to Object > Align > Top.
     */
    public static alignTop(): void;

    /**
     * Aligns all selected objects flush bottom. Equivalent to Object > Align > Bottom.
     */
    public static alignBottom(): void;

    /**
     * Aligns all selected objects along their vertical centerlines. Equivalent to Object > Align > Center (Vertically).
     */
    public static alignVerticalCenter(): void;

    /**
     * Distributes all selected objects evenly along the X axis. Equivalent to Object > Distribute > Horizontally.
     */
    public static distributeHorizontal(): void;

    /**
     * Distributes all selected objects evenly along the Y axis. Equivalent to Object > Distribute > Vertically.
     */
    public static distributeVertical(): void;

    /**
     * Shifts all selected objects and their content so they align crisply with the pixel grid. Equivalent to Object > Align to Pixel Grid.
     */
    public static alignToPixelGrid(): void;


    // /**
    //* Flips the object horizontally. Some objects such as Symbols cannot be flipped. Equivalent to Object > Flip > Horizontally.
    //*/
    //public static filpHorizontal(): void;
//
    //  /**
    // * Flips the object vertically. Some objects such as Symbols cannot be flipped. Equivalent to Object > Flip > Vertically.
    //*/
    //public static flipVertical(): void;
}

export = commands;
