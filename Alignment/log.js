///////////////////////////////////////////////////////////////////////////
// Utility functions and constants for debugging and development
///////////////////////////////////////////////////////////////////////////


const {Artboard, BooleanGroup, Blur, Matrix, Color, Ellipse, GraphicNode, Group, Line, LinkedGraphic, Path, Rectangle, RepeatGrid, RootNode, SceneNode, SymbolInstance, Text} = require("scenegraph");

/**
* Lists the properties of an object in the console in name and value columns
* @param {*} object An object
* @param {String} description Optional description. If no description the constructor name is used.
* @param {Number} level If set to 1 lists properties of objects one level deep 
*/
function object(object, description = null, level = 1) {
  let output = "";
  var className = "";
  var value;
  var minCharacterLength = 0;
  var value2;
  var indentCharacter = " ";
  var properties = [];
  var separatorCharacter = "   "; // ": ";

  var indent = "";
  if (DebugSettings.logFunctionName) {
    var functionName = getFunctionName();

    if (DebugSettings.lastFunctionName!=functionName) {
      console.log(functionName+ "()");
      DebugSettings.lastFunctionName = functionName;
    }
    if (functionName!="") {
      indent = " ";
    }
  }
  
  if (description!=null) {
    className = description;
  }
  else {
    className = object ? object.constructor.name : "Object";
  }

  if (object==null) {
    console.log(indent+"Object is null");
    return;
  }

  for (var property in object) {
    if (property && property.length>minCharacterLength) {
      minCharacterLength = property.length;
    }
    properties.push(property);
  }

  // add two spaces
  minCharacterLength++;
  minCharacterLength++;

  properties.sort();
  
  for (var j=0;j<properties.length;j++) {
    property = properties[j];
    value = object[property];
    
    if (value=="[object Object]" && level == 1) {
      output += indent + " " + property + ": {\n";
      
      for (var property2 in value) {
        value2 = value[property2];

        //for (var i=property2.length;i<minCharacterLength;i++) property2 += indentCharacter;
        output += "\t" + indent + property2 + separatorCharacter + value2 + "\n";
      }

      output += indent +" }\n";
    }
    else {
      value = object[property];
      for (var i=property.length;i<minCharacterLength;i++) property += indentCharacter;
      output += indent + " " + property + separatorCharacter + value + "\n";
    }
  }

  console.log(`${indent}${className} {\n${output}${indent}}`);
}

/**
 * Writes a value to the console. Same as calling console.log and then returning true.
 * Returns true so you can enable debugging options with var debug = enableDebugging && log("Debugging method()")
 * @param {String} string value to write to the console
 * @param {Array} args 
 */
function log(string, ...args) {
  var indent = "";
  if (string==null || string===undefined) {
    string = "";
  }

  // suppress all logging
  if (DebugSettings.suppressLogMessages==true) {
    console.log("Suppressing log")
    return;
  }

  // log function name
  if (DebugSettings.logFunctionName) {
    var functionName = getFunctionName();
    if (DebugSettings.lastFunctionName!=functionName) {
      console.log(functionName+ "()");
      DebugSettings.lastFunctionName = functionName;
    }
    if (functionName!="") {
      indent = " ";
    }
  }

  console.log(indent + string, ...args);
  
  return true;
}

/**
 * Get the name of the function this method is called from. 
 * If this is method is called outside of a function the value of (function) is returned
 */
function getFunctionName() {
  var callStackArray = getStackArray();

  if (callStackArray && callStackArray.length) {
    var name = callStackArray[0];

    if (name==null || name=="") {
      return "(function)";
    }

    return name;
  }

  return "No functions";
}

/**
 * Gets the class name of the object based on the constructor.name property or object to string conversion if no constructor name
 * @param {Object} object Object to get the class name of
 */
function getClassName(object) {
  var name = object && "constructor" in object? object.constructor.name : object;
  return name;
}


/**
 * Get an array of the names of properties that have different values for the same property
 * @param {Object} target object
 * @param {Object} source object
 **/
function getChangedProperties(target, source) {
	var properties = Object.keys(target);
	var changed = [];
	var key = "";
	var value = null;
	var value2 = null;

	if (source==null) return properties;
	for (var i=0;i<properties.length;i++) {
		key = properties[i];
		value = target[key];
    value2 = source[key];
    
		if (value != value2) {
			changed.push(key);
		}
	}

	return changed;
}

/**
 * Get the call stack separated by ">"
 * @param {Error} error 
 */
function getStackTrace(error = null, separator = " > ") {
  var array = getStackArray(error);

  if (array && array[0]=="getStackTrace") {
    array.shift();
  }
  if (array && array[0]=="getStackArray") {
    array.shift();
  }

  return array.join(separator);
}

/**
 * Gets the call stack as an array of functions 
 * @param {Object} error optionally pass in an error. if error is not passed in than a new error is created
 */
function getStackArray(error = null) {
  var value = "";
  
  if (error==null) {
    try {
      error = new Error("Stack");
    }
    catch (e) {
      
    }
  }
  
  if ("stack" in error) {
    value = error.stack;
    var methods = value.match(/at (\w+|\.)*/gm);

    var newArray = methods.map(function (value, index, array) {
      value = value.replace("at ","");
      return value;
    })

    if (newArray && newArray[0]=="getStackTrace") {
      newArray.shift();
    }
    if (newArray && newArray[0]=="getStackArray") {
      newArray.shift();
    }
    if (newArray && newArray[0]=="getFunctionName") {
      newArray.shift();
    }
    if (newArray && newArray[0]=="object") {
      newArray.shift();
    }
    if (newArray && newArray[0]=="log") {
      newArray.shift();
    }

	  return newArray;
  }
  
  return null;
}

class XDConstants {

  // XD Fill Constants
  static get COLOR_FILL () { return "Color"; }
  static get IMAGE_FILL () { return "ImageFill"; }
  static get LINEAR_GRADIENT_FILL () { return "LinearGradientFill"; }
  static get RADIAL_GRADIENT_FILL () { return "RadialGradientFill"; }

  static get MAC_PLATFORM () { return "darwin"; }

  static get LINE_BREAK () { return "\n"; }
  static get LINE_BREAK_FULL () { return "\n\r"; }
  static get SPACE () { return " "; }
  static get TAB () { return "\t"; }

  static get PNG () { return "png"; }
  static get JPEG () { return "jpg"; }
  
  static get ARTBOARD () { return "Artboard"; }
  static get BOOLEAN_GROUP () { return "BooleanGroup"; }
  static get ELLIPSE () { return "Ellipse"; }
  static get GRAPHICS_NODE () { return "GraphicsNode"; }
  static get GROUP () { return "Group"; }
  static get LINE () { return "Line"; }
  static get LINKED_GRAPHIC () { return "LinkedGraphic"; }
  static get PATH () { return "Path"; }
  static get RECTANGLE () { return "Rectangle"; }
  static get REPEAT_GRID () { return "RepeatGrid"; }
  static get ROOT_NODE () { return "RootNode"; }
  static get SCENE_NODE () { return "SceneNode"; }
  static get SYMBOL_INSTANCE () { return "SymbolInstance"; }
  static get TEXT() { return "Text"; }
  static get POINT_TEXT() { return "PointText"; }
  static get AREA_TEXT() { return "AreaText"; }
}

class DebugSettings {

  /**
   * Static getter setter 
   **/
  static get logFunctionName () {
    if ("_logFunctionName" in DebugSettings===false) {
      DebugSettings._logFunctionName = false; // default value set here 
    }
    
    return DebugSettings._logFunctionName;
  }

  static set logFunctionName (value) {
    DebugSettings._logFunctionName = value;
  }

  /**
   * Last function name. Used when logging
   **/
  static get lastFunctionName () {
    if ("_lastFunctionName" in DebugSettings===false) {
      DebugSettings._lastFunctionName = ""; // default value set here 
    }
    
    return DebugSettings._lastFunctionName;
  }

  static set lastFunctionName (value) {
    DebugSettings._lastFunctionName = value;
  }

  /**
   * Set to true to suppress logging that is using the log function
   **/
  static get suppressLogMessages () {
    if ("_suppressLogMessages" in DebugSettings===false) {
      DebugSettings._suppressLogMessages = false;
    }
    
    return DebugSettings._suppressLogMessages;
  }

  static set suppressLogMessages (value) {
    DebugSettings._suppressLogMessages = value;
  }

  /**
   * Add or remove outline around element when META key + click event
   **/
  static outlineOnClick (element) {
    
    if ("_outlineOnClick" in DebugSettings===false) {
      DebugSettings._outlineOnClick = element; // save element to remove listeners 
    }

    if ("_outlineOnClick" in DebugSettings && element==null) {
      
      if (DebugSettings._outlineOnClick) {
        DebugSettings._outlineOnClick.addEventListener("click", DebugSettings.formClick);
      }

      DebugSettings._outlineOnClick = null;
      return;
    }

    if (element) {
      element.addEventListener("click", DebugSettings.formClick);
    }

  }

  /**
   * Set to input form 
   **/
  static get form () {
    return DebugSettings._form;
  }

  static set form (value) {
    DebugSettings._form = value;
  }

  /**
   * Adds or removes an outline on the event target 
   **/
  static formClick(event, color = "red") {
    var component = event.target;

    if (event.metaKey && event.shiftKey==false) {
      component = event.target;

      if ("style" in component && "border" in component.style) {
        var style = component.style;
        var isString = typeof style.border=="string"; 
        var borderWidth = 0;

        if (isString) {
          borderWidth = parseInt(style.border);
        }
        else {
          borderWidth = style.border && style.border.width && style.border.width.top ? style.border.width.top.value : 0 ;
        }

        if (borderWidth==0 || isNaN(borderWidth)) {
          style.border = "1px dashed " + color;
        }
        else {
          style.border = "0px dashed " + color;
        }
      }
    }      

    if (event.shiftKey) {
      component = event.target;

      if (DebugSettings.form==null) {
        var group = document.createElement("div");
        var inputName = document.createElement("input");
        var inputValue = document.createElement("input");
        var nameError = document.createElement("span");
        var valueError = document.createElement("span");
        var span = document.createElement("span");
        
        inputName.type = "text";
        inputValue.type = "text";
        //inputName.style.width = "120px";
        inputName.style.flex = "1";
        inputName.style.height = "20px";
        inputName.style.margin = "0";
        inputName.style.marginRight = "0";
        //inputValue.style.width = "100px";
        inputValue.style.flex = "1";
        inputValue.style.height = "20px";
        //inputValue.style.padding = "0";
        inputValue.style.margin = "0";
        inputName.placeholder = "name";
        inputValue.placeholder = "value";
        inputValue.placeholder = "value";
        span.innerHTML = "X";
        nameError.innerHTML = "!";
        nameError.style.color = "red";
        nameError.title = "Property not found";
        valueError.title = "Value not found";
        nameError.style.display = "none";
        valueError.style.display = "none";
        span.style.paddingLeft = "2px";
        span.style.marginRight = "10px";
        span.style.cursor = "pointer";
        group.style.backgroundColor = "rgba(255, 255, 255, .85)";

        span.addEventListener("click", function(e) {
          group.remove();
          DebugSettings.form = null;
        })

        inputName.addEventListener("change", DebugSettings.inputNameHandler)
        inputName.addEventListener("input", DebugSettings.inputNameHandler)
        inputValue.addEventListener("change", DebugSettings.inputValueHandler)

        group.appendChild(inputName);
        group.appendChild(nameError);
        group.appendChild(inputValue);
        group.appendChild(valueError);
        group.appendChild(span);
        group.style.position = "absolute";
        group.style.top = "0px";
        group.style.gap = "0px";
        group.style.left = "0px";
        group.className = "row";

        component.ownerDocument.body.firstChild.appendChild(group);

        DebugSettings.form = group;
        DebugSettings.form.component = component;
        DebugSettings.form.inputName = inputName;
        DebugSettings.form.inputValue = inputValue;
        DebugSettings.form.nameError = nameError;
        DebugSettings.form.valueError = valueError;
      }
    }
  }

  static inputNameHandler(e) {
    var inputName = DebugSettings.form.inputName;
    var inputValue = DebugSettings.form.inputValue;
    var nameError = DebugSettings.form.nameError;
    var component = DebugSettings.form.component;
    var name = inputName.value;
    var value = null;
    var object = component;
    var names = [];
    var hasError = false;

    if (name==null || name=="") {
      nameError.style.display = "none"; // hide error
      return;
    }

    if (name && name.indexOf(".")!=-1) {
      names = name.split(".");

      for(var i=0;i<names.length;i++) {
        name = names[i];

        if (name in object) {
          
          if (i<names.length-1) {
            object = object[name];

            if ("getPropertyValue" in object) {
              value = object.getPropertyValue(name);
            }
            else {
              value = object[name];
            }
          }
          else {

            if ("getPropertyValue" in object) {
              value = object.getPropertyValue(name);
            }
            else {
              value = object[name];
            }
          }
        }
        else {
          hasError = true;
        }
      }
    }
    else {
      if (name in object) {
        value = object[name];
      }
      else {
        hasError = true;
      }
    }

    
    // can't find property show error
    if (hasError) {
      nameError.style.display = "inline-block"; // show error
    }
    else {
      nameError.style.display = "none"; // hide error

      if (e.type=="change") {
        inputValue.value = value;
        inputValue.focus();
      }
    }
  }

  static inputValueHandler(e) {
    var inputName = DebugSettings.form.inputName;
    var inputValue = DebugSettings.form.inputValue;
    var nameError = DebugSettings.form.nameError;
    var valueError = DebugSettings.form.valueError;
    var component = DebugSettings.form.component;
    var name = inputName.value;
    var value = inputValue.value;
    var object = component;
    var names;
    var hasError = false;

    try {

      if (name && name.indexOf(".")!=-1) {
        names = name.split(".");

        for(var i=0;i<names.length;i++) {
          name = names[i];

          if (name in object) {
            if (i<names.length-1) {
              object = object[name];
            }
          }
          else {
            hasError = true;
          }
        }
      }
      else if (name in object) {

        if ("setPropertyValue" in object) {
          object.setPropertyValue(name, value);
        }
        else {
          object[name] = value;
        }
      }
      else {
        hasError = true;
      }

    }
    catch(e) {
      console.log(e);
    }
    
    if (hasError) {
      valueError.style.display = "inline-block"; // show error
      valueError.title = e + "";
    }
    else {
      valueError.style.display = "none"; // hide error
      valueError.title = "";
    }
  }
}

/**
 * Get the artboard of the current scene node
 * @param {SceneNode} item Scene node
 **/
function getArtboard(item) {

  if (item instanceof Artboard) return item;
  var parent = item.parent;
  while (parent!=null) {
      if (parent instanceof Artboard) return parent;
      parent = parent.parent;
  }
  return null;
}

/**
 * Gets bounds of scene node including relative bounds in container
 * @param {SceneNode} item Get the bounds of the scene node
 **/
function getBoundsInParent(item) {
  var bounds = {};
  var x = 0;
  var y = 0;
  var parentX = 0;
  var parentY = 0;
  var parentWidth= 0;
  var parentHeight = 0;
  var width= 0;
  var height = 0;
  var parent = null;
  var offsetX = 0;
  var offsetY = 0;
  var centerX = 0;
  var centerY = 0;
  var centerDeltaX = 0;
  var centerDeltaY = 0;
  var globalCenterX = 0;
  var globalCenterY = 0;
  var globalDeltaX = 0;
  var globalDeltaY = 0;
  var isLine = item && item.constructor.name=="Line";
  var sizeAdjusted = false;
  var artboard = null;
  var xInArtboard = 0;
  var yInArtboard = 0;
  var parentXInArtboard = 0;
  var parentYInArtboard = 0;

  if (item.parent) {
      artboard = getArtboard(item);
      parent = item.parent;

      x = item.globalBounds.x;
      y = item.globalBounds.y;
      width = item.globalBounds.width;
      height = item.globalBounds.height;
      xInArtboard = artboard ? item.globalBounds.x - artboard.globalBounds.x : 0;
      yInArtboard = artboard ? item.globalBounds.y - artboard.globalBounds.y : 0;

      parentXInArtboard = artboard ? parent.globalBounds.x - artboard.globalBounds.x : 0;
      parentYInArtboard = artboard ? parent.globalBounds.y - artboard.globalBounds.y : 0;

      const STROKE_WIDTH_NAME = "strokeWidth"; // not in types 

      if (isLine && width==0) {
          width = item[STROKE_WIDTH_NAME];
          sizeAdjusted = true;
      }
      
      if (isLine && height==0) {
          height = item[STROKE_WIDTH_NAME];
          sizeAdjusted = true;
      }

      parentX = parent.globalBounds.x;
      parentY = parent.globalBounds.y;
      parentWidth = parent.globalBounds.width;
      parentHeight = parent.globalBounds.height;

      // center cartisian position
      centerX = parentWidth/2 - width/2;
      centerY = parentHeight/2 - height/2;

      offsetX = x - parentX;
      offsetY = y - parentY;
      
      globalCenterX = parentX + centerX;
      globalCenterY = parentY + centerY;
      
      centerDeltaX = offsetX - centerX;
      centerDeltaY = offsetY - centerY;
      
      globalDeltaX = x + centerDeltaX;
      globalDeltaY = y - centerDeltaY;

      bounds.xInArtboard = xInArtboard;
      bounds.yInArtboard = yInArtboard;

      bounds.parentXInArtboard = parentXInArtboard;
      bounds.parentYInArtboard = parentYInArtboard;

      bounds.x = offsetX;
      bounds.y = offsetY;

      bounds.globalX = item.globalBounds.x;
      bounds.globalY = item.globalBounds.y;

      bounds.xInGroup = offsetX;
      bounds.yInGroup = offsetY;
      
      bounds.centerX = centerX;
      bounds.centerY = centerY;
      
      bounds.width = item.globalBounds.width;
      bounds.height = item.globalBounds.height;

      bounds.centerDeltaX = centerDeltaX;
      bounds.centerDeltaY = centerDeltaY;

      bounds.globalDeltaX = globalDeltaX;
      bounds.globalDeltaY = globalDeltaY;

      bounds.globalCenterX = globalCenterX;
      bounds.globalCenterY = globalCenterY;

      bounds.sizeAdjusted = sizeAdjusted;

      bounds.computedCenterX = getCenterPoint(item).x;
      bounds.computedCenterY = getCenterPoint(item).y;

      bounds.parentWidth = parentWidth;
      bounds.parentHeight = parentHeight;

      bounds.parentX = parentX;
      bounds.parentY = parentY;

      bounds.offsetX = offsetX;
      bounds.offsetY = offsetY;

      bounds.right = bounds.parentWidth - bounds.width - bounds.x;
      bounds.bottom = bounds.parentHeight - bounds.height - bounds.y;
  }

  return bounds;
}

/**
 * Calls the passed in function on the passed in node and it's descendants 
 * @param {SceneNode} node SceneNode 
 * @param {Function} command Function to call on each node
 * @param {*} value Optional value to pass to command
 **/
function walkDownTree(node, command, value = null) {
  command(node, value);

  if (node.isContainer) {
    var childNodes = node.children;

    for(var i=0;i<childNodes.length;i++) {
      let childNode = childNodes.at(i);

      walkDownTree(childNode, command, value);
    }
  }
}


function getCenterPoint(node) {
	return {
		x: node.boundsInParent.x + node.boundsInParent.width/2,
		y: node.boundsInParent.y + node.boundsInParent.height/2
	}
}

/**
 * Gets a number with less places
 * @param {Number} value 
 * @param {Number} places 
 */
function getShortNumber(value, places = 3) {
	value = Math.round(value * Math.pow(10, places)) / Math.pow(10, places);
	return value;
}

/**
 * Gets short string and replaces line breaks
 * @param {String} value 
 * @param {Number} characters 
 */
function getShortString(value, characters = 20) {
    if (value==null) {
      return "";
    }

    if (value===undefined) {
      return "";
    }

    if (typeof value === "string") {
      value = value.replace(/\n|\r/g, " ");
      return value.substr(0, characters);
    }
  
    return "Not a string";
}

/**************************************************
* POSITIONING
**************************************************/

/**
 * Move a scene node to a specific x and y position
 * @param {SceneNode} element
 * @param {Number} x
 * @param {Number} y
 **/
function moveTo(element, x, y) {
  var bounds = getBoundsInParent(element);
  element.moveInParentCoordinates(-bounds.x+x, -bounds.y+y);
}

/**
 * Center left
 * @param {Array} selectedItems array of scenenodes 
 * @param {Number} margin margin from edge
 **/
function centerLeft(selectedItems, margin = 0) {
  var numberOfItems = selectedItems ? selectedItems.length : 0;
  /** @type {SceneNode} */
  var selectedItem = null;
  var bounds = null;
  var isArtboardParent = false;

  for(var i=0;i<numberOfItems;i++) {
    selectedItem = selectedItems[i];
    bounds = getBoundsInParent(selectedItem);

    if (isArtboardParent) {
      selectedItem.placeInParentCoordinates(getZeroPoint(), {x:margin+bounds.x, y:bounds.centerY+bounds.parentY});
    }
    else {
      moveTo(selectedItem, margin, bounds.centerY);
    }
  }
}

/**
 * Center 
 * @param {Array} selectedItems array of scenenodes 
 **/
function center(selectedItems) {
  var numberOfItems = selectedItems ? selectedItems.length : 0;
  /** @type {SceneNode} */
  var selectedItem = null;
  var bounds = null;

  for(var i=0;i<numberOfItems;i++) {
    selectedItem = selectedItems[i];
    bounds = getBoundsInParent(selectedItem);
    selectedItem.moveInParentCoordinates(-bounds.centerDeltaX, -bounds.centerDeltaY);
  }
}

/**
 * Center right
 * @param {Array} selectedItems array of scenenodes 
 * @param {Number} margin margin from edge
 **/
function centerRight(selectedItems, margin = 0) {
  var numberOfItems = selectedItems ? selectedItems.length : 0;
  /** @type {SceneNode} */
  var selectedItem = null;
  var bounds = null;
  var isArtboardParent = false;

  for(var i=0;i<numberOfItems;i++) {
    selectedItem = selectedItems[i];
    bounds = getBoundsInParent(selectedItem);
    var right = bounds.parentWidth - margin - bounds.width;
    
    if (isArtboardParent) {
      selectedItem.placeInParentCoordinates(getZeroPoint(), {x:right, y:bounds.centerY});
    }
    else {
      moveTo(selectedItem, right, bounds.centerY);
    }
  }
}

/**
 * Top left
 * @param {Array} selectedItems array of scenenodes 
 * @param {Number} margin margin from edge
 **/
function topLeft(selectedItems, margin = 0) {
  var numberOfItems = selectedItems ? selectedItems.length : 0;
  /** @type {SceneNode} */
  var selectedItem = null;
  var isArtboardParent = false;

  for(var i=0;i<numberOfItems;i++) {
    selectedItem = selectedItems[i];
    isArtboardParent = selectedItem.parent && selectedItem instanceof Artboard ? true : false;

    if (isArtboardParent) {
      selectedItem.placeInParentCoordinates(getZeroPoint(), {x:margin, y:margin});
    }
    else {
      moveTo(selectedItem, margin, margin);
    }
  }
}

/**
 * Top center
 * @param {Array} selectedItems array of scenenodes 
 * @param {Number} margin margin from edge
 **/
function topCenter(selectedItems, margin = 0) {
  var numberOfItems = selectedItems ? selectedItems.length : 0;
  /** @type {SceneNode} */
  var selectedItem = null;
  var bounds = null;
  var isArtboardParent = false;

  for(var i=0;i<numberOfItems;i++) {
    selectedItem = selectedItems[i];
    isArtboardParent = selectedItem.parent && selectedItem instanceof Artboard ? true : false;

    bounds = getBoundsInParent(selectedItem);

    if (isArtboardParent) {
      selectedItem.placeInParentCoordinates(getZeroPoint(), {x:bounds.centerX, y:margin});
    }
    else {
      moveTo(selectedItem, bounds.centerX, margin);
    }
  }
}

/**
 * Top
 * @param {Array} selectedItems array of scenenodes 
 * @param {Number} margin margin from edge
 **/
function top(selectedItems, margin = 0) {
  var numberOfItems = selectedItems ? selectedItems.length : 0;
  /** @type {SceneNode} */
  var selectedItem = null;
  var bounds = null;
  var isArtboardParent = false;

  for(var i=0;i<numberOfItems;i++) {
    selectedItem = selectedItems[i];
    isArtboardParent = selectedItem.parent && selectedItem instanceof Artboard ? true : false;

    bounds = getBoundsInParent(selectedItem);

    if (isArtboardParent) {
      selectedItem.placeInParentCoordinates(getZeroPoint(), {x:bounds.x, y:margin});
    }
    else {
      moveTo(selectedItem, bounds.x, margin);
    }
  }
}

/**
 * Top right
 * @param {Array} selectedItems array of scenenodes 
 * @param {Number} margin margin from edge
 **/
function topRight(selectedItems, margin = 0) {
  var numberOfItems = selectedItems ? selectedItems.length : 0;
  /** @type {SceneNode} */
  var selectedItem = null;
  var bounds = null;
  var isArtboardParent = false;

  for(var i=0;i<numberOfItems;i++) {
    selectedItem = selectedItems[i];
    isArtboardParent = selectedItem.parent && selectedItem instanceof Artboard ? true : false;

    bounds = getBoundsInParent(selectedItem);
    var right = bounds.parentWidth - margin - bounds.width;
    
    if (isArtboardParent) {
      selectedItem.placeInParentCoordinates(getZeroPoint(), {x:right, y:margin});
    }
    else {
      moveTo(selectedItem, right, margin);
    }
  }
}

/**
 * Bottom left
 * @param {Array} selectedItems array of scenenodes 
 * @param {Number} margin margin from edge
 **/
function bottomLeft(selectedItems, margin = 0) {
  var numberOfItems = selectedItems ? selectedItems.length : 0;
  /** @type {SceneNode} */
  var selectedItem = null;
  var bounds = null;
  var isArtboardParent = false;

  for(var i=0;i<numberOfItems;i++) {
    selectedItem = selectedItems[i];

    bounds = getBoundsInParent(selectedItem);
    var bottomY = bounds.parentHeight - bounds.height - margin;

    if (isArtboardParent) {
      selectedItem.placeInParentCoordinates(getZeroPoint(), {x:margin, y:bottomY});
    }
    else {
      moveTo(selectedItem, margin, bottomY);
    }
  }
}

/**
 * Bottom
 * @param {Array} selectedItems array of scenenodes 
 * @param {Number} margin margin from edge
 **/
function bottom(selectedItems, margin = 0) {
  var numberOfItems = selectedItems ? selectedItems.length : 0;
  /** @type {SceneNode} */
  var selectedItem = null;
  var bounds = null;
  var isArtboardParent = false;

  for(var i=0;i<numberOfItems;i++) {
    selectedItem = selectedItems[i];

    bounds = getBoundsInParent(selectedItem);
    var bottomY = bounds.parentHeight - bounds.height - margin;

    if (isArtboardParent) {
      selectedItem.placeInParentCoordinates(getZeroPoint(), {x:bounds.x, y:bottomY});
    }
    else {
      moveTo(selectedItem, bounds.x, bottomY);
    }
  }
}

/**
 * Bottom center
 * @param {Array} selectedItems array of scenenodes 
 * @param {Number} margin margin from edge
 **/
function bottomCenter(selectedItems, margin = 0) {
  var numberOfItems = selectedItems ? selectedItems.length : 0;
  /** @type {SceneNode} */
  var selectedItem = null;
  var bounds = null;
  var isArtboardParent = false;

  for(var i=0;i<numberOfItems;i++) {
    selectedItem = selectedItems[i];
    bounds = getBoundsInParent(selectedItem);
    var bottomY = bounds.parentHeight - bounds.height - margin;

    if (isArtboardParent) {
      selectedItem.placeInParentCoordinates(getZeroPoint(), {x:bounds.centerX, y:bottomY});
    }
    else {
      moveTo(selectedItem, bounds.centerX, bottomY);
    }
  }
}

/**
 * Bottom right
 * @param {Array} selectedItems array of scenenodes 
 * @param {Number} margin margin from edge
 **/
function bottomRight(selectedItems, margin = 0) {
  var numberOfItems = selectedItems ? selectedItems.length : 0;
  /** @type {SceneNode} */
  var selectedItem = null;
  var bounds = null;
  var isArtboardParent = false;

  for(var i=0;i<numberOfItems;i++) {
    selectedItem = selectedItems[i];

    bounds = getBoundsInParent(selectedItem);
    var right = bounds.parentWidth - margin - bounds.width;
    var bottomY = bounds.parentHeight - bounds.height - margin;

    if (isArtboardParent) {
      selectedItem.placeInParentCoordinates(getZeroPoint(), {x:right, y:bottomY});
    }
    else {
      moveTo(selectedItem, right, bottomY);
    }
  }
}

/**
 * Left
 * @param {Array} selectedItems array of scenenodes 
 * @param {Number} margin margin from edge
 **/
function left(selectedItems, margin = 0) {
  var numberOfItems = selectedItems ? selectedItems.length : 0;
  /** @type {SceneNode} */
  var selectedItem = null;
  var bounds = null;
  var isArtboardParent = false;

  try {

    for(var i=0;i<numberOfItems;i++) {
      selectedItem = selectedItems[i];

      bounds = getBoundsInParent(selectedItem);

      if (isArtboardParent) {
        selectedItem.placeInParentCoordinates(getZeroPoint(), {x:margin, y:bounds.y});
      }
      else {
        moveTo(selectedItem, margin, bounds.y);
      }
    }
  }
  catch(error) {
    log(error)
  }
}

/**
 * Right
 * @param {Array} selectedItems array of scenenodes 
 * @param {Number} margin margin from edge
 **/
function right(selectedItems, margin = 0) {
  var numberOfItems = selectedItems ? selectedItems.length : 0;
  /** @type {SceneNode} */
  var selectedItem = null;
  var bounds = null;
  var isArtboardParent = false;

  for(var i=0;i<numberOfItems;i++) {
    selectedItem = selectedItems[i];

    bounds = getBoundsInParent(selectedItem);
    var right = bounds.parentWidth - margin - bounds.width;
    
    if (isArtboardParent) {
      selectedItem.placeInParentCoordinates(getZeroPoint(), {x: right, y: bounds.y});
    }
    else {
      moveTo(selectedItem, right, bounds.y);
    }
  }
}

/**************************************************
* CONSTRAINTS
**************************************************/

/**
 * Anchor to top, left, bottom and right edge
 * @param {Array} selectedItems array of scenenodes 
 * @param {Number} margin margin from edge
 **/
function anchorToEdges(selectedItems, margin = 0) {
  var numberOfItems = selectedItems ? selectedItems.length : 0;
  /** @type {SceneNode} */
  var selectedItem = null;
  var bounds = null;
  var isArtboardParent = false;

  for (var i=0;i<numberOfItems;i++) {
    selectedItem = selectedItems[i];

    bounds = getBoundsInParent(selectedItem);
    
    if (isArtboardParent) {
      selectedItem.resize(bounds.parentWidth-margin*2, bounds.parentHeight-margin*2);
      selectedItem.placeInParentCoordinates(getZeroPoint(), {x:margin, y:margin});
    }
    else {
      selectedItem.resize(bounds.parentWidth-margin*2, bounds.parentHeight-margin*2);
      moveTo(selectedItem, margin, margin);
    }
  }
}

/**
 * Anchor to vertical edges
 * @param {Array} selectedItems array of scenenodes 
 * @param {Number} margin margin from edge
 **/
function anchorToVerticalEdges(selectedItems, margin = 0) {
  var numberOfItems = selectedItems ? selectedItems.length : 0;
  /** @type {SceneNode} */
  var selectedItem = null;
  var bounds = null;
  var isArtboardParent = false;

  for (var i=0;i<numberOfItems;i++) {
    selectedItem = selectedItems[i];

    bounds = getBoundsInParent(selectedItem);

    if (isArtboardParent) {
      selectedItem.resize(selectedItem.localBounds.width, bounds.parentHeight-margin*2);
      selectedItem.placeInParentCoordinates(getZeroPoint(), {x: bounds.x, y: margin});
    }
    else {
      selectedItem.resize(selectedItem.localBounds.width, bounds.parentHeight-margin*2);
      moveTo(selectedItem, bounds.x, margin);
    }
  }
}

/**
 * Anchor to horizontal edges
 * @param {Array} selectedItems array of scenenodes 
 * @param {Number} margin margin from edge
 **/
function anchorToHorizontalEdges(selectedItems, margin = 0) {
  var numberOfItems = selectedItems ? selectedItems.length : 0;
  var isArtboardParent = false;
  var bounds = null;
  /** @type {SceneNode} */
  var selectedItem = null;

  for (var i=0;i<numberOfItems;i++) {
    selectedItem = selectedItems[i];

    bounds = getBoundsInParent(selectedItem);
    
    if (isArtboardParent) {
      selectedItem.resize(bounds.parentWidth-margin*2, selectedItem.localBounds.height);
      selectedItem.placeInParentCoordinates(getZeroPoint(), {x: margin, y: bounds.y});
    }
    else {
      selectedItem.resize(bounds.parentWidth-margin*2, selectedItem.localBounds.height);
      moveTo(selectedItem, margin, bounds.y);
    }
  }
}

/**************************************************
* CENTERING 
**************************************************/

/**
 * Center horizontally
 * @param {Array} selectedItems array of scenenodes 
 * @param {Number} margin margin from edge
 **/
function centerHorizontally(selectedItems, margin = 0) {
  var numberOfItems = selectedItems ? selectedItems.length : 0;
  /** @type {SceneNode} */
  var selectedItem = null;
  var bounds = null;

  for(var i=0;i<numberOfItems;i++) {
    selectedItem = selectedItems[i];
    bounds = getBoundsInParent(selectedItem);
    selectedItem.moveInParentCoordinates(-bounds.centerDeltaX + margin, 0);
  }
}

/**
 * Center vertically
 * @param {Array} selectedItems array of scenenodes 
 * @param {Number} margin margin from edge
 **/
function centerVertically(selectedItems, margin = 0) {
  var numberOfItems = selectedItems ? selectedItems.length : 0;
  /** @type {SceneNode} */
  var selectedItem = null;
  var bounds = null;

  for(var i=0;i<numberOfItems;i++) {
    selectedItem = selectedItems[i];
    bounds = getBoundsInParent(selectedItem);
    selectedItem.moveInParentCoordinates(0, -bounds.centerDeltaY + margin);
  }
}

/**
 * Returns a zero point object. {x:0, y:0}
 * @returns {Object}
 */
function getZeroPoint() {
  return {x:0,y:0};
}

/**
 * Gets an empty string if value is null
 * @param {String} value if value is null returns an empty string
 **/
function getString(value) {
	return value==null ? "" : value;
}

module.exports = {object, log, getShortNumber, getString, getArtboard, getCenterPoint, getBoundsInParent, getClassName, getFunctionName, 
  getStackTrace, getStackArray, getShortString, getChangedProperties, moveTo, walkDownTree, XDConstants, DebugSettings,
  centerLeft, center, centerRight, topLeft, topCenter, top, topRight, bottomLeft, bottom, bottomCenter, bottomRight, left, right,
  anchorToEdges, anchorToVerticalEdges, anchorToHorizontalEdges, centerHorizontally, centerVertically};