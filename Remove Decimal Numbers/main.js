function removeDecimalNumbers({
    items
}) {
    if (items.length > 0) {
        items.forEach(item => {
            // Get item's coords and bounds
            const {
                width,
                height
            } = item.localBounds;
            const {
                x,
                y
            } = item.translation;

            // Round the Item's width and height
            item.resize(
                Math.floor(width),
                Math.floor(height)
            );

            // Round the Item's X/Y positions
            const newX = x - Math.floor(x);
            const newY = y - Math.floor(y);
            item.moveInParentCoordinates(
                -newX,
                -newY
            );
        });
    }
}


module.exports = {
    commands: {
        removeDecimalNumbers: removeDecimalNumbers
    }
};