///////////////////////////////////////////////////////////////////////////
// Utility functions and constants for debugging and development
///////////////////////////////////////////////////////////////////////////

const {Artboard, BooleanGroup, Blur, Matrix, Color, Ellipse, GraphicNode, Group, Line, LinkedGraphic, Path, Rectangle, RepeatGrid, RootNode, SceneNode, SymbolInstance, Text} = require("scenegraph");

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

  // supress all logging
  if (DebugSettings.suppressLogMessages==true) {
    console.log("Suppressing log")
    return;
  }

  // log function name
  if (DebugSettings.logFunctionName) {
    var functionName = getFunctionName();
    if (DebugSettings.lastFunctionName!=functionName) {
      console.log(functionName+ "()", ...args);
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
* Lists the properties of an object in the console in name and value columns
* @param {*} obj An object
* @param {String} description Optional description. If no description the constructor name is used.
* @param {Number} level If set to 1 lists properties of objects one level deep 
* @param {Boolean} logToConsole do not write to the console
**/
function object(obj, description = null, level = 1, logToConsole = true) {
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
      logToConsole && console.log(functionName+ "()");
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
    className = obj ? obj.constructor.name : "Object";
  }

  if (obj==null) {
    logToConsole && console.log(indent+className + " is null");
    return indent += className + " is null";
  }

  for (var property in obj) {
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
    value = obj[property];
    
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
      value = obj[property];
      for (var i=property.length;i<minCharacterLength;i++) property += indentCharacter;
      output += indent + " " + property + separatorCharacter + value + "\n";
    }
  }

  var result = `${indent}${className} {\n${output}${indent}}`;
  logToConsole && console.log(result);
  return result;
}

/**
 * Get the name of the function this method is called from. 
 * If this is method is called outside of a function the value of (function) is returned
 **/
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
 **/
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
 * Logs the stack trace
 * @param {Error} error 
 * @param {String} separator 
 **/
function logStackTrace(error = null, separator = " > ") {
  log(getStackTrace(error, separator))
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
  if (array && array[0]=="logStackArray") {
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
  static get POLYGON () { return "Polygon"; }
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
    const _outlineOnClick = "_outlineOnClick";
    
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
   * Highlights the component. Set outline to false to not highlight
   * @param {Object} component 
   * @param {Boolean} outline 
   * @param {String} color 
   **/
  static highlight(component, outline = true, color = "red") {
    var style = component.style;

    if ("style" in component && "border" in component.style) {
      if (outline) {
        style.border = "1px dashed " + color;
      }
      else {
        style.border = "0px dashed " + color;
      }
    }
  }

  /**
   * Updates the form component.
   * @param {Object} component 
   * @param {Object} prevComponent 
   **/
  static updateComponent(component, prevComponent = null) {
    prevComponent!=null ? DebugSettings.highlight(prevComponent, false) : 0;
    var element = component;
    DebugSettings.form.component = element;
    DebugSettings.highlight(element);
    var index = Array.prototype.slice.call(element.parentElement.children).indexOf(element);
    DebugSettings.form.elementIndex.innerHTML = index+"";
    DebugSettings.form.elementIndex.title = element.nodeName;
  }

  /**
   * Toggle outline of the component
   * @param {Object} component 
   * @param {String} color
   **/
  static toggleHighlight(component, color = "red") {

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

  /**
   * Adds or removes an outline on the event target 
   **/
  static formClick(event, color = "red") {
    var component = event.target;

    if (((event.ctrlKey || event.metaKey) && event.shiftKey==false)) {

      if (DebugSettings.form && DebugSettings.form.component) {
        DebugSettings.highlight(DebugSettings.form.component, false);
      }

      component = event.target;
      if (component.style) {
        DebugSettings.toggleHighlight(component, color);
      }
    }

    if ((event.ctrlKey || event.metaKey) && event.shiftKey) {
      component = event.target;
      
      if (DebugSettings.form) {
        DebugSettings.form.remove();
      }

      var group = document.createElement("form");
      var inputName = document.createElement("input");
      var inputValue = document.createElement("input");
      var parent = document.createElement("label");
      var descendants = document.createElement("div");
      var prevSibling = document.createElement("span");
      var nextSibling = document.createElement("span");
      var nameError = document.createElement("span");
      var valueError = document.createElement("span");
      var close = document.createElement("span");
      var elementIndex = document.createElement("span");
      var index = 0;
      
      group.onsubmit = function(e) {
        e.preventDefault();
        return false
      };
      inputName.type = "text";
      inputValue.type = "text";
      inputName.style.flex = "1";
      inputName.style.margin = "0";
      inputName.style.marginRight = "0";
      inputValue.style.flex = "1";
      inputValue.style.margin = "0";
      inputName.placeholder = "name";
      inputValue.placeholder = "value";
      inputValue.placeholder = "value";
      parent.innerHTML = "&#8593;";
      descendants.innerHTML = "&#8595;"; 
      parent.title = "Parent element";
      descendants.title = "Descendant elements"; 
      close.innerHTML = "X";
      prevSibling.innerHTML = "<";
      nextSibling.innerHTML = ">";
      prevSibling.title = "Previous element";
      nextSibling.title = "Next element";
      nameError.innerHTML = "!";
      nameError.style.color = "red";
      nameError.title = "Property not found";
      valueError.title = "Value not found";
      nameError.style.display = "none";
      valueError.style.display = "none";
      close.style.padding = "0px 4px";
      close.style.margin = "0";
      close.style.cursor = "pointer";
      parent.style.padding = "0px 4px";
      parent.style.cursor = "pointer";
      descendants.style.padding = "0px 4px";
      descendants.style.cursor = "pointer";
      prevSibling.style.padding = "0px 4px";
      prevSibling.style.cursor = "pointer";
      nextSibling.style.padding = "0px 4px";
      nextSibling.style.cursor = "pointer";
      elementIndex.style.padding = "0px 6px";
      elementIndex.style.textAlign = "center";
      index = Array.prototype.slice.call(component.parentElement.children).indexOf(component);
      elementIndex.innerHTML = index+"";
      elementIndex.style.cursor = "pointer";

      close.addEventListener("click", function(e) {
        group.remove();
        DebugSettings.highlight(DebugSettings.form.component, false);
        DebugSettings.form = null;
      })

      parent.addEventListener("click", function(e) {
        var element = DebugSettings.form.component;
        if (element.parentNode) {
          DebugSettings.updateComponent(element.parentNode, element);
        }
      })

      descendants.addEventListener("click", function(e) {
        var element = DebugSettings.form.component;
        if (element.children.length) {
          DebugSettings.updateComponent(element.children[0], element);
        }
      })

      prevSibling.addEventListener("click", function(e) {
        var element = DebugSettings.form.component;
        if (element.previousElementSibling) {
          DebugSettings.updateComponent(element.previousElementSibling, element);
        }
      })

      nextSibling.addEventListener("click", function(e) {
        var element = DebugSettings.form.component;
        if (element.nextElementSibling && element.nextElementSibling!=DebugSettings.form) {
          DebugSettings.updateComponent(element.nextElementSibling, element);
        }
      })

      elementIndex.addEventListener("click", function(e) {
        var element = DebugSettings.form.component;
        if (element) {
          DebugSettings.form.inputName.value = "nodeName";
          DebugSettings.inputNameHandler(e, true);
        }
      })

      inputName.addEventListener("change", DebugSettings.inputNameHandler);
      inputName.addEventListener("input", DebugSettings.inputNameHandler);
      inputValue.addEventListener("change", DebugSettings.inputValueHandler);

      group.appendChild(parent);
      group.appendChild(prevSibling);
      group.appendChild(elementIndex);
      group.appendChild(nextSibling);
      group.appendChild(descendants);
      group.appendChild(inputName);
      group.appendChild(nameError);
      group.appendChild(inputValue);
      group.appendChild(valueError);
      group.appendChild(close);

      group.style.position = "absolute";
      group.style.top = "0px";
      group.style.gap = "0px";
      group.style.left = "0px";
      group.style.zIndex = "100";
      group.style.padding = "6px";
      group.style.margin = "8px";
      group.style.border = "1px solid rgba(0, 0, 0, .25)";
      group.style.filter = "drop-shadow(3px 3px 6px rgba(0, 0, 0, 0.161));";
      group.style.backgroundColor = "rgba(255, 255, 255, .85)";
      group.style.alignItems = "center";
      group.style.display = "flex";
      group.style.fontWeight = "bold";
      group.className = "row";

      component.parentNode.appendChild(group);

      DebugSettings.form = group;
      DebugSettings.form.component = component;
      DebugSettings.form.inputName = inputName;
      DebugSettings.form.inputValue = inputValue;
      DebugSettings.form.nameError = nameError;
      DebugSettings.form.valueError = valueError;
      DebugSettings.form.elementIndex = elementIndex;

      DebugSettings.updateComponent(component);
    }
  }

  static inputNameHandler(e, getValue = false) {
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
      return false;
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
      //inputName.style.outline = "1px solid red"; // show error
      
      if (e.type=="change") {
        inputName.focus();
      }
      return false;
    }
    else {
      nameError.style.display = "none"; // hide error
      //inputName.style.outline = null; // hide error

      if (e.type=="change" || getValue) {
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
      
      if (name in object) {

        if ("setPropertyValue" in object) {
          object.setPropertyValue(name, value);
        }
        else {

          if (typeof object[name]=="number" || typeof object[name]=="bigint") {
            object[name] = Number(value);
          }
          else if (typeof object[name]=="boolean") {
            var booleanValue = value && value!=="0" && value!=="false" ? true : false;
            object[name] = booleanValue;
          }
          else {
            object[name] = value;
          }
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

    if (e.type=="change") {
      inputValue.focus();
    }
  }
}

/**
 * Get the time in milliseconds
 */
function getTime() {
  return new Date().getTime();
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
  var usePrev = false;

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

      if (isLine && width==0) {
          width = item.strokeWidth;
          sizeAdjusted = true;
      }
      
      if (isLine && height==0) {
          height = item.strokeHeight;
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
      
      if (usePrev) {
        centerDeltaX = centerX - offsetX;
        centerDeltaY = centerY - offsetY;
      }
      else {
        centerDeltaX = offsetX - centerX;
        centerDeltaY = offsetY - centerY;
      }

      
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

      bounds.localBoundsWidth = item.localBounds.width;
      bounds.localBoundsHeight = item.localBounds.height;

      bounds.localBoundsX = item.localBounds.x;
      bounds.localBoundsY = item.localBounds.y;

      bounds.offsetX = offsetX;
      bounds.offsetY = offsetY;

      bounds.right = bounds.parentWidth - bounds.width - bounds.x;
      bounds.bottom = bounds.parentHeight - bounds.height - bounds.y;
  }

  return bounds;
}

/**
 * One method used to get the center bounds position. Must call get bounds in parent first.
 * @param {SceneNode} node 
 **/
function getCenterPoint(node) {
	return {
		x: node.boundsInParent.x + node.boundsInParent.width/2,
		y: node.boundsInParent.y + node.boundsInParent.height/2
	}
}

/**
 * Move a scene node to a specific x and y position in its parent container
 * @param {SceneNode} element
 * @param {Number} x
 * @param {Number} y
 **/
function moveTo(element, x, y) {
  var bounds = getBoundsInParent(element);
  element.moveInParentCoordinates(-bounds.x+x, -bounds.y+y);
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

/**
 * Returns true if the node is in the edit context
 * @param {SceneNode} editContext A reference to selection.editContext
 * @param {SceneNode} node The node to check
 **/
function isInEditContext(editContext, node) {

	if (editContext==node) {
		return true;
	}
  
	if (editContext.isContainer && isChildNode(editContext, node)) {
		return true;
	}

	return false;
}

/**
 * Returns true if nodes are siblings
 * @param {SceneNode} nodeA
 * @param {SceneNode} nodeB
 * @return {Boolean}
 **/
function isSiblingNode(nodeA, nodeB) {
  return nodeA.parent == nodeB.parent;
}

/**
 * Returns true if node is descendant of parentNode
 * @param {SceneNode} parentNode 
 * @param {SceneNode} node 
 * @return {Boolean}
 **/
function isDescendantNode(parentNode, node) {

	if (parentNode==node) {
		return true;
	}

	if (parentNode.isContainer) {
		var childNodes = parentNode.children;

		for(var i=0;i<childNodes.length;i++) {
			let childNode = childNodes.at(i);

			// found the node
			if (childNode==node) {
				return true;
			}

			if (childNode.isContainer) {
				return isDescendantNode(childNode, node);
			}
		}
	}

	return false;
}

/**
 * Returns true if node is a child (not descendant) of parentNode
 * @param {SceneNode} parentNode 
 * @param {SceneNode} node 
 * @return {Boolean}
 **/
function isChildNode(parentNode, node) {

	if (parentNode==node) {
		return true;
	}

	if (parentNode.isContainer) {
		var childNodes = parentNode.children;

		for(var i=0;i<childNodes.length;i++) {
			let childNode = childNodes.at(i);

			if (childNode==node) {
				return true;
			}
		}
	}

	return false;
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
    value = value.replace(/[\r\n\x0B\x0C\u0085\u2028\u2029]+/g, " ");
    return value.substr(0, characters);
  }

  return "Not a string";
}

/**
 * Adds a string onto the end of other strings and adds a space between
 * if needed. Separator is space by default but can be any character
 * @param {String} value 
 * @param {String} anotherValue 
 * @param {String} separator 
 **/
function addString(value, anotherValue, separator = " ") {
  var char = "";

  // if value is not null 
  if (value!=null && value!="") {

	  if (anotherValue!=null) {
      char = value.charAt(value.length-1);

      // if space at end just add value
      if (char==separator) {
        value += anotherValue;
      }
      else {
        value += separator + anotherValue;
      }
	  }
  }
  else {
    value = "";
    
	  if (anotherValue!=null) {
      value += anotherValue;
	  }
  }
  return value;
}

/**
 * Get value with pixels. Pass in a number 10 and get "10px"
 * @param {Number} value 
 * @returns {String}
 **/
function getPx(value) {
  return value + "px";
}

/**
 * Trims whitespace
 * @param {String} value 
 * @returns {String}
 **/
function trim(value) {
  if (value==null) {
    return "";
  }

  if (value===undefined) {
    return "";
  }

  return value.trim();
}

/**
 * Deletes all properties except any exceptions, and except values that start with value 
 * or delete only values specified in the properties array
 * @param {Object} value 
 * @param {Array} exceptions 
 * @param {Array} startsWith 
 * @param {Array} properties 
 **/
function deleteProperties(value, exceptions = null, startsWith = null, properties = null) {
  if (value==null) return;

  for(var name in value) {

    // do not delete if in exceptions
    if (exceptions && exceptions.includes(name)) {
      // skip
      continue;
    }

    // delete only properties starting with value
    if (startsWith) {
      const exclude = startsWith.some(str => name.startsWith(str));
      if (exclude) {
        // skip
        continue;
      }
    }

    // delete only specified properties
    if (properties) {
      if (properties.includes(name)) {
        delete value[name];
      }
      continue;
    }

    delete value[name];
  }
}

module.exports = {object, log, getShortNumber, getArtboard, getCenterPoint, getBoundsInParent, getClassName, getFunctionName, 
  getStackTrace, getStackArray, logStackTrace, getShortString, getTime, getPx, getChangedProperties, trim, deleteProperties, addString, walkDownTree, XDConstants, DebugSettings,
  isInEditContext, isSiblingNode, isDescendantNode, isChildNode, moveTo};