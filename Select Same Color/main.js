const { Artboard, Rectangle, Color } = require("scenegraph");  
const { error } = require("./lib/dialogs.js");

function isSameColor(color1, color2){
	if(typeof color1 === 'undefined' || typeof color2 === 'undefined' || color1 == null || color2 == null){
		return false;
	}
	//check if both are shadows
	if(typeof color1.visible === 'boolean' && typeof color2.visible === 'boolean'){
		if(color1.x == color2.x && color1.y == color2.y && color1.blur == color2.blur){
			return isSameColor(color1.color, color2.color);
		}
	}else if(typeof color1.r == 'number' && typeof color2.r == 'number'){ //check if both are solid colors
		return color1.r == color2.r 
		&& color1.g == color2.g 
		&& color1.b == color2.b 
		&& color1.a == color2.a;
	}else if(typeof color1.startX == 'number' && typeof color2.startX == 'number'){
		
		//we are both linear gradients, check if start/end points are the same
		if(color1.startX == color2.startX
			&& color1.startY == color2.startY
			&& color1.endX == color2.endX
			&& color1.endY == color2.endY
			&& color1.colorStops.length == color2.colorStops.length
			){
		
			//check if actual colors are the same
			for (var i = 0; i < color1.colorStops.length; i++) {
				var color1Stop = color1.colorStops[i];
				var color2Stop = color2.colorStops[i];
				if(color1Stop.stop == color2Stop.stop){
					var areSameColors = isSameColor(color1Stop.color, color2Stop.color);
					if(!areSameColors){
						//colors don't match
						return false;
					}
				}else{
					//stop points don't match
					return false;
				}
			}
			return true; //all colors match too.
		}
	}
	return false; //different kinds (e.g. solid color vs. gradient)
}

async function selectItemsWithSameFill(selection, documentRoot){
	selectItemsWithSameColorFunctionInner(selection, documentRoot, 'fill');
}

async function selectItemsWithSameBorder(selection, documentRoot){
	selectItemsWithSameColorFunctionInner(selection, documentRoot, 'border');
}

async function selectItemsWithSameShadow(selection, documentRoot){
	selectItemsWithSameColorFunctionInner(selection, documentRoot, 'shadow');
}

function resolveColor(node, funcType){
	console.log('in resolveColor');
	if(funcType == 'fill'){
		return node.fill;
	}else if(funcType == 'border'){
		return node.stroke;
	}else if(funcType == 'shadow'){
		return node.shadow;
	}
}

async function selectItemsWithSameColorFunctionInner(selection, documentRoot, funcType) {     
	if(!selection.items.length){
		await error("Please select an item", "No item is selected. Please select an item and try again."); 
		return;
	}else if(selection.items.length > 1){
		await error("Please select only one item", "Multiple items are selected. Please select a single item."); 
		return;
	}
	if(selection.items[0].constructor.name == 'Artboard'){
		await error("Selecting artboards is not supported.", "Please select an item inside the artboard, not the artboard itself."); 
		return;
	}
	var color = resolveColor(selection.items[0], funcType);
	if(typeof color === 'undefined'){
		await error("No color or linear gradient defined for selection.", "Selection doesn't have a single " + funcType + " color/linear gradient defined. Please select an item with a single " + funcType + " and try again."); 
		return;
	}
	var selectedItems = [];
	var traverse = function(currentNode){
		currentNode.children.forEach(traverse);
		var nodeColor = resolveColor(currentNode, funcType);
		if(isSameColor(nodeColor, color)){
			if(currentNode.constructor.name != 'Artboard'){ //we can't select artboards with anything else 
				selectedItems.push(currentNode);
			}
			
		}
	}
	traverse(documentRoot, selectedItems);
	selection.items = selectedItems;
   
}

module.exports = {
    commands: {
        selectItemsWithSameFill: selectItemsWithSameFill,
        selectItemsWithSameBorder: selectItemsWithSameBorder,
        selectItemsWithSameShadow: selectItemsWithSameShadow
    }
};