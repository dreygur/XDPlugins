/*
 * Plugin to add Hamburger icon.
 */

var {Line, Rectangle, Color} = require("scenegraph");
const commands = require("commands");

function drawHamburger(selection) {

    let lines = [];

	const lineData = [
	    { startX: 5, startY: 10, endX: 35, endY: 10 },
	    { startX: 5, startY: 20, endX: 35, endY: 20 },
	    { startX: 5, startY: 30, endX: 35, endY: 30 }
	]
	
    lineData.forEach(data => {
        const line = new Line();

        line.setStartEnd(
            data.startX,
            data.startY,
            data.endX,
            data.endY
        );

        line.strokeEnabled = true;
        line.stroke = new Color("#000000");
        line.strokeWidth = 5;

        lines.push(line);

        selection.editContext.addChild(line)
    });

    selection.items = lines;
    commands.group();
}

module.exports = {
    commands: {
        drawHamburger: drawHamburger
    }
};
