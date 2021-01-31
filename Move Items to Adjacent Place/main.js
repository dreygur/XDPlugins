let commands = require("commands");

function moveLeft(selection){
	checkAction(selection, false, "left");
}
function moveUp(selection){
	checkAction(selection, false, "up");
}
function moveRight(selection){
	checkAction(selection, false, "right");
}
function moveDown(selection){
	checkAction(selection, false, "down");
}
function duplicateLeft(selection){
	checkAction(selection, true, "left");
}
function duplicateUp(selection){
	checkAction(selection, true, "up");
}
function duplicateRight(selection){
	checkAction(selection, true, "right");
}
function duplicateDown(selection){
	checkAction(selection, true, "down");
}

function checkAction(selection, dup, dir){
	if (selection.items.length > 0){
		if (dup === true){
			commands.duplicate();
		}
		const d = getSize(selection.items);
		var x, y;
		if (dir === "left"){
			x = d.x * -1;
			y = 0;
			console.log(x)
		} else if (dir === "up"){
			x = 0;
			y = d.y * -1;
		} else if (dir === "right"){
			x = d.x;
			y = 0;
		} else if (dir === "down"){
			x = 0;
			y = d.y;
		}
		for (var i = 0; i < selection.items.length; i++){
			selection.items[i].moveInParentCoordinates(x, y);
		}
	}
}



function getSize(arr){
	let lArr = [];
	let tArr = [];
	let rArr = [];
	let bArr = [];
	for (var i = 0; i < arr.length; i++){
		const bounds = arr[i].globalBounds;
		var x = bounds.x;
		var y = bounds.y;
		var w = bounds.width;
		var h = bounds.height;
		lArr.push(x);
		tArr.push(y);
		rArr.push(x + w);
		bArr.push(y + h);
	}
	const l = Math.min(...lArr);
	const t = Math.min(...tArr);
	const r = Math.max(...rArr);
	const b = Math.max(...bArr);
	let obj = {};
	obj.x = r - l;
	obj.y = b - t;
	return obj;
}

module.exports = {
	commands: {
		moveLeft: moveLeft,
		moveUp: moveUp,
		moveRight: moveRight,
		moveDown: moveDown,
		duplicateLeft: duplicateLeft,
		duplicateUp: duplicateUp,
		duplicateRight: duplicateRight,
		duplicateDown: duplicateDown
	}
};

