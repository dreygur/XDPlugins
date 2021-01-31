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
  
  removeFromArray(array, "getStackTrace");
  removeFromArray(array, "getStackArray");
  removeFromArray(array, "logStackTrace");

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
      if (value==null || value=="") {
        value = "(anonymous)";
      }
      return value;
    })

    var val = newArray.join(",");
    
    removeFromArray(newArray, "logStackTrace");
    removeFromArray(newArray, "getStackTrace");
    removeFromArray(newArray, "getStackArray");
    removeFromArray(newArray, "getFunctionName");
    removeFromArray(newArray, "object");
    removeFromArray(newArray, "log");
    
    //log("newArray:" + val)

	  return newArray;
  }
  
  return null;
}

/**
 * Removes any cases of the items from an array
 * @param {Array} array 
 * @param {String} value 
 */
function removeFromArray(array, value) {

  for (let index = array.length-1; index>=0;index--) {
    if (value == array[index]) {
      array.splice(index, 1);
    }
  }

  return array;
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
        DebugSettings._outlineOnClick.addEventListener("click", DebugSettings.outlineOnFormClickHandler);
      }

      DebugSettings._outlineOnClick = null;
      return;
    }

    if (element) {
      element.addEventListener("click", DebugSettings.outlineOnFormClickHandler);
    }

  }

  /**
   * Highlight color
   **/
  static get highlightColor () {
    if (DebugSettings.hasOwnProperty("_highlightColor")===false) {
      DebugSettings._highlightColor = "#1594E8";
    }

    return DebugSettings._highlightColor;
  }

  static set highlightColor (value) {
    DebugSettings._highlightColor = value;
  }

  /**
   * Outline form 
   **/
  static get form () {
    return DebugSettings._form;
  }

  static set form (value) {
    DebugSettings._form = value;
  }

  /**
   * Exclude form from debugging
   **/
  static get excludeForm () {
    return DebugSettings._excludeForm;
  }

  static set excludeForm (value) {
    DebugSettings._excludeForm = value;
  }

  /**
   * Updates the form component.
   * @param {Object} component 
   * @param {Object} prevComponent 
   **/
  static updateComponent(component, prevComponent = null) {
    prevComponent!=null ? DebugSettings.highlight(prevComponent, false) : 0;
    var element = component;
    var indexLabel = DebugSettings.getPositionOfElement(element);
    var propertyName = DebugSettings.form.inputName.value;
    var nodeName =  element.nodeName;
    var id = element.id;
    var label = nodeName;

    if (id) {
      label += " #" + id;
    }

    DebugSettings.form.component = element;
    DebugSettings.highlight(element);
    DebugSettings.form.elementIndex.innerHTML = indexLabel + "";
    DebugSettings.form.elementIndex.title = label;
    DebugSettings.form.nameLabel.innerHTML = label;

    // if property input has content attempt to get value
    if (propertyName!="" && propertyName!=null) {
      DebugSettings.inputNameHandler(null, true);
    }
  }

  /**
   * Highlights the component. Set outline to false to not highlight
   * @param {Object} component 
   * @param {Boolean} outline 
   * @param {String} color 
   **/
  static highlight(component, outline = true, color = null) {
    if (component==null) return;
    if (color==null) {
      color = DebugSettings.highlightColor;
    }

    var style = component.style;

    if ("style" in component && "outline" in component.style) {
      
      if (outline) {
        style.outline = "1.5px dashed " + color;
      }
      else {
        style.outline = "0px dashed " + color;
      }
    }
  }

  /**
   * Toggle outline of the component
   * @param {Object} component 
   * @param {String} color
   **/
  static toggleHighlight(component, color = null) {
    if (color==null) {
      color = DebugSettings.highlightColor;
    }

    if ("style" in component && "outline" in component.style) {
      var style = component.style;
      var isString = typeof style.outline=="string"; 
      var borderWidth = 0;

      if (isString) {
        borderWidth = parseFloat(style.outlineWidth);
      }
      else {
        borderWidth = style.outline && style.outline.width && style.outline.width.top ? style.outline.width.top.value : 0 ;
      }

      if (borderWidth==0 || isNaN(borderWidth)) {
        style.outline = "1.5px dashed " + color;
      }
      else {
        style.outline = "0px dashed " + color;
      }
    }
  }

  /**
   * Adds or removes an outline on the event target 
   **/
  static outlineOnFormClickHandler(event, color = null) {
    var component = event.target;
    if (color==null) {
      color = DebugSettings.highlightColor;
    }

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
      
      if (DebugSettings.form && DebugSettings.excludeForm) {
        DebugSettings.form.remove();
      }

      var group = document.createElement("form");
      var inputName = document.createElement("input");
      var inputValue = document.createElement("input");
      var parent = document.createElement("span");
      var descendants = document.createElement("div");
      var prevSibling = document.createElement("span");
      var nextSibling = document.createElement("span");
      var nameError = document.createElement("span");
      var valueError = document.createElement("span");
      var close = document.createElement("span");
      var elementIndex = document.createElement("span");
      var nameLabel = document.createElement("span");
      var index = 0;


      group.style.position = "absolute";
      group.style.top = "0px";
      group.style.gap = "0px";
      group.style.left = "0px";
      group.style.right = "20px";
      group.style.zIndex = "100";
      group.style.padding = "6px";
      group.style.margin = "8px";
      group.style.border = "1px solid rgba(0, 0, 0, .25)";
      group.style.filter = "drop-shadow(3px 3px 6px rgba(0, 0, 0, 0.161));";
      group.style.backgroundColor = "rgba(255, 255, 255, .85)";
      group.style.alignItems = "center";
      group.style.display = "flex";
      group.style.fontWeight = "bold";
      group.style.fontSize = "13px";
      group.style.flex = "1";
      group.style.minHeight = "40px";
      group.className = "row";

      inputName.type = "text";
      inputValue.type = "text";
      inputName.style.flex = "1";
      inputName.style.margin = "0";
      inputName.style.marginRight = "0";
      inputName.style.width = "80px";
      inputName.uxpQuiet = true;
      inputValue.uxpQuiet = true;
      inputValue.style.flex = "1";
      inputValue.style.margin = "0";
      inputName.placeholder = "name";
      inputValue.placeholder = "value";
      inputValue.placeholder = "value";
      inputValue.style.width = "80px";

      parent.innerHTML = "&#8593;";
      descendants.innerHTML = "&#8595;";
      close.innerHTML = "X";
      prevSibling.innerHTML = "<";
      nextSibling.innerHTML = ">";
      nameError.innerHTML = "!";

      parent.title = "Parent element";
      descendants.title = "Descendant elements";
      prevSibling.title = "Previous element";
      nextSibling.title = "Next element";
      
      nameError.style.color = "red";
      nameError.title = "Property not found";
      valueError.title = "Value not found";
      nameError.style.display = "none";
      valueError.style.display = "none";
      close.style.margin = "0";
      
      parent.style.padding = "0px 4px";
      descendants.style.padding = "0px 4px";
      prevSibling.style.padding = "0px 4px";
      nextSibling.style.padding = "0px 4px";
      elementIndex.style.padding = "0px 6px";
      close.style.padding = "0px 4px";

      parent.style.cursor = "pointer";
      prevSibling.style.cursor = "pointer";
      elementIndex.style.cursor = "pointer";
      nextSibling.style.cursor = "pointer";
      descendants.style.cursor = "pointer";
      close.style.cursor = "pointer";

      nameLabel.style.position = "absolute";
      nameLabel.style.left = "2px";
      nameLabel.style.top = "1px";
      nameLabel.style.fontSize = "8px";
      nameLabel.style.textTransform = "uppercase";
      nameLabel.style.display = "inline-block";

      elementIndex.style.fontSize = "9px";
      elementIndex.style.textTransform = "uppercase";
      elementIndex.style.display = "inline-block";
      
      elementIndex.innerHTML = DebugSettings.getPositionOfElement(component);
      nameLabel.innerText = component.nodeName;

      close.addEventListener("click", function(e) {
        if (DebugSettings.form) {
          DebugSettings.highlight(DebugSettings.form.component, false);
        }
        group.remove();
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
          //DebugSettings.form.inputName.value = "nodeName";
          //DebugSettings.inputNameHandler(e, true);
        }
      })

      group.addEventListener("click", function(e) {
        
      })

      group.onsubmit = function(e) {
        e.preventDefault();
        return false
      };

      inputName.addEventListener("change", DebugSettings.inputNameHandler);
      inputName.addEventListener("input", DebugSettings.inputNameHandler);
      inputName.addEventListener("keyup", DebugSettings.inputNameHandler);
      inputName.addEventListener("keydown", DebugSettings.inputNameHandler);
      inputName.addEventListener("keypress", DebugSettings.inputNameHandler);
      inputName.addEventListener("blur", DebugSettings.inputNameHandler);
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
      group.appendChild(nameLabel);

      component.parentNode.appendChild(group);

      DebugSettings.form = group;
      DebugSettings.form.component = component;
      DebugSettings.form.inputName = inputName;
      DebugSettings.form.inputValue = inputValue;
      DebugSettings.form.nameError = nameError;
      DebugSettings.form.nameLabel = nameLabel;
      DebugSettings.form.valueError = valueError;
      DebugSettings.form.elementIndex = elementIndex;

      DebugSettings.updateComponent(component);
    }
  }

  /**
   * Handle typing in the input handler. Listens for change and input events
   * Has focus issues when selected item size or container size is small
   * @param {Event} event event from input
   * @param {Boolean} getValue if true fills in the value in the value input
   */
  static inputNameHandler(event, getValue = false) {
    if (DebugSettings.form==null) return;
    var inputPropertyName = DebugSettings.form.inputName;
    var inputValue = DebugSettings.form.inputValue;
    var nameError = DebugSettings.form.nameError;
    var component = DebugSettings.form.component;
    var name = inputPropertyName.value;
    var value = null;
    var object = component;
    var names = [];
    var hasError = false;
    var isBlur = event && event.type=="blur";

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
      
      if (event && event.type=="change") {
        inputPropertyName.focus();
      }
      return false;
    }
    else {
      nameError.style.display = "none"; // hide error

      if ((event && event.type=="keydown" && event.keyCode==13) || getValue || isBlur) {
        inputValue.value = value;

        if (value==null || value=="") {
          inputValue.value = "";
          inputValue.placeholder = value==null ? "null" : "empty";
          setTimeout(function() {
            inputValue.placeholder = "value";
            inputValue.focus();
          }, 1000);
        }

        if (event && event.type=="keydown" && event.keyCode==13) {
          inputValue.focus();
          setTimeout(function() {
            inputValue.focus();
          }, 50);
        }
      }
    }
  }

  static inputValueHandler(event) {
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
      valueError.title = event + "";
    }
    else {
      valueError.style.display = "none"; // hide error
      valueError.title = "";
    }

    if (event.type=="change") {
      inputValue.focus();
    }
  }

  /**
   * Get the position of the element in a group
   */
  static getPositionOfElement(component, total = true) {
    if (component==null) { return "" }
    var index = Array.prototype.slice.call(component.parentElement.children).indexOf(component) + 1;
    var numberOfElements = component.parentElement.children.length;
  
    if (total==false) return index;
    return index + " of " + numberOfElements;
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
 * Get all artboards in the project. Excludes pasteboard items
 * @returns {Array}
 */
function getAllArtboards() {
	const { root } = require("scenegraph");
	var items = root.children;
	var numberOfItems = items ? items.length : 0;
	var artboards = [];

	// exclude pasteboard items
	for (let index = 0; index < numberOfItems; index++) {
		let item = items.at(index);
		let isArtboard = getIsArtboard(item);

		if (isArtboard) {
			artboards.push(item);
		}
	}

	return artboards;
}

/**
 * Milliseconds to wait
 * @param {Number} ms 
 */
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Returns true if item is a graphic node
 * @param {SceneNode} item 
 * @param {Boolean} excludeText excludes text objects
 * @returns {Boolean}
 **/
function getIsGraphicNode(item, excludeText = true) {

  if (item && item instanceof GraphicNode) {
    if (item instanceof Text && excludeText) {
      return false;
    }
    return true;
  }
  return false;
}

/**
 * Toggles the visibility of the layer
 * @param {SceneNode} item 
 **/
function toggleLayerVisibility(item) {

  if (item) {
    item.visibility = item.visibility;
  }

}

/**
 * Returns true if item is a graphic node with image
 * @param {SceneNode} item 
 * @param {Boolean} fillEnabled will only return true if condition is met and fill is enabled 
 * @returns {Boolean}
 **/
function getIsGraphicNodeWithImageFill(item, fillEnabled = true) {

  if (item && item instanceof GraphicNode) {
    if (item.fill && item.fill.constructor.name==XDConstants.IMAGE_FILL) {
      if (item.fillEnabled && fillEnabled) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Get computed translation
 * @param {SceneNode} item 
 **/
function getComputedTranslation(item) {
  var parent = item.parent;
  var transform = null;
  var translation = [0,0];
  
  if (parent instanceof Artboard) {
    return translation;
  }
  
  while (parent!=null) {
    transform = parent.transform;
    var local = transform.getTranslate();

    translation[0] += local[0];
    translation[1] += local[1];
    
    parent = parent.parent;

    if (parent instanceof Artboard) {
      return translation;
    }
  }

  return translation;
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
  var hasRotation = item.rotation!=0;
  var unrotatedTransform = hasRotation ? item.transform.rotate(-item.rotation, item.localCenterPoint.x, item.localCenterPoint.y) : null;
  var unrotatedBounds = hasRotation ? unrotatedTransform.transformRect(item.localBounds) : null;
  var parentTranslate = [];

  if (item.parent) {
      artboard = getArtboard(item);
      parent = item.parent;
      
      parentTranslate = getComputedTranslation(item);

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

      bounds.parentTransformX = parentTranslate[0];
      bounds.parentTransformY = parentTranslate[1];

      bounds.localCenterPointX = item.localCenterPoint.x;
      bounds.localCenterPointY = item.localCenterPoint.y;

      bounds.offsetX = offsetX;
      bounds.offsetY = offsetY;

      bounds.right = bounds.parentWidth - bounds.width - bounds.x;
      bounds.bottom = bounds.parentHeight - bounds.height - bounds.y;

      bounds.unrotatedTransform = unrotatedTransform;
      bounds.unrotatedBounds = unrotatedBounds;
  }

  return bounds;
}

/**
 * Returns if scene node is portrait. If square then returns true
 * @param {SceneNode} item Get the bounds of the scene node
 * @param {Boolean} squareCounts square counts as portrait
 **/
function isPortrait(item, squareCounts = true) {
  var width = item.globalBounds.width;
  var height = item.globalBounds.height;

  if (height>width) {
   return true;
  }

  if (height==width && squareCounts) {
    return true;
  }

  return false;
}

/**
 * Returns if scenenode is landscape. If is square then returns true
 * @param {SceneNode} item Get the bounds of the scene node
 * @param {Boolean} squareCounts square counts as landscape
 **/
function isLandscape(item, squareCounts = true) {
  var width = item.globalBounds.width;
  var height = item.globalBounds.height;

  if (width>height) {
   return true;
  }

  if (width==height && squareCounts) {
    return true;
  }

  return false;
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
 * Get the child nodes of a group
 * @param {SceneNode} sceneNode 
 * @param {Boolean} reverse 
 * @return {Array}
 **/
function getChildNodes(sceneNode, reverse = false) {
  var nodes = [];

	if (sceneNode.isContainer) {
		var childNodes = sceneNode.children;

		for(var i=0;i<childNodes.length;i++) {
			let childNode = childNodes.at(i);
      nodes.push(childNode);
		}
	}

  if (reverse) {
    nodes.reverse();
  }

  return nodes;
}

/**
 * Returns true if scene node is artbaord
 * @param {SceneNode} node 
 * @returns {Boolean}
 **/
function getIsArtboard(node) {
	return node && node instanceof Artboard;
}

/**
 * Returns true if scene node is on the pasteboard and not in an artboard. If node parent is null then true is returned.
 * @param {SceneNode} node 
 * @returns {Boolean}
 **/
function getIsPasteboardItem(node) {
	const { root } = require("scenegraph");
  var parent = node;

  while (parent) {
    if (parent instanceof Artboard) {
      return false;
    }
    if (parent==root) {
      return true;
    }
    if (parent==null) {
      return true;
    }
    parent = parent.parent;
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
 * Adds strings onto the end of other strings. Separator is space by default but can be any character
 * @param {String} separator 
 * @param {Array} strings
 **/
function addStrings(separator = " ", ...strings) {
  var char = "";
  var value = "";

  var numberOfStrings = strings ? strings.length : 0;

  for (let index = 0; index < numberOfStrings; index++) {
    var nextString = strings[index];

    if (nextString!=null) {
      char = value.charAt(value.length-1);

      // if separater is alrdady at end of first string just add value
      if (char==separator) {
        value += nextString;
      }
      else {
        value += separator + nextString;
      }
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
 * Indents a multiline string the indent amount
 * @param {String} value String to indent
 * @param {String} indentAmount White space value used for the indentation
 **/
function indentMultiline(value, indentAmount) {
	if (value==null || value=="") return indentAmount;
	
	if (indentAmount==null || indentAmount=="") return value;
	
	var indentPattern = /([\t ]*)(.+)$/gm;
	var indentedText = value.replace(indentPattern, indentAmount + "$1$2");
	return indentedText;
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
    if (getIsArtboard(selectedItem)==false) {
      bounds = getBoundsInParent(selectedItem);
      selectedItem.moveInParentCoordinates(-bounds.centerDeltaX + margin, 0);
    }
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
    if (getIsArtboard(selectedItem)==false) {
      bounds = getBoundsInParent(selectedItem);
      selectedItem.moveInParentCoordinates(0, -bounds.centerDeltaY + margin);
    }
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
 * Returns true if export rendition type is supported
 * @param {String} type extension rendition 
 * @returns {Boolean}
 **/
function isSupportedExportFormat(type) {
  var lowercase = type && type.toLowerCase();
  if (lowercase=="png" || lowercase=="jpg" || lowercase=="pdf" || lowercase=="svg") {
    return true;
  }
  return false;
}

/**
 * Get the base 64 from scene node
 * @param {SceneNode} element 
 * @returns {Object}
 **/
async function getBase64FromSceneNode(element) {
  const arrayBuffer = getArrayBufferFromSceneNode(element);
  var buffer = getBase64ArrayBuffer(arrayBuffer);
  return buffer;
}

/**
 * Get the image Array Buffer from scene node
 * @param {SceneNode} element 
 * @returns {Object}
 **/
async function getArrayBufferFromSceneNode(element, scale = 1) {
  const application = require("application");
  const filesystem = require("uxp").storage;
  const folder = await filesystem.localFileSystem.getTemporaryFolder();
  const file = await folder.createFile(element.guid + ".png", { overwrite: true });
  const definition = {};
  
  definition.node = element;
  definition.outputFile = file;
  definition.type = "png";
  definition.scale = scale;
  definition.quality = 100;

  const renditionResults = await application.createRenditions([definition]);
  const renditionsFiles = renditionResults.map(a => a.outputFile);
  const renditionsFile = renditionsFiles[0];
  const arrayBuffer = await renditionsFile.read({ format: filesystem.formats.binary });
  arrayBuffer.length = arrayBuffer.byteLength;
  return arrayBuffer;
}

/**
 * Exports the image to a temporary file and returns the file
 * @param {SceneNode} element 
 * @returns {Object}
 **/
async function getTempImageFromSceneNode(element) {
  const application = require("application");
  const filesystem = require("uxp").storage;
  const folder = await filesystem.localFileSystem.getTemporaryFolder();
  const file = await folder.createFile(element.guid + ".png", { overwrite: true });
  const definition = {};
  
  definition.node = element;
  definition.outputFile = file;
  definition.type = "png";
  definition.scale = 2;
  definition.quality = 100;

  const renditionResults = await application.createRenditions([definition]);
  const renditionsFiles = renditionResults.map(a => a.outputFile);
  const renditionsFile = renditionsFiles[0];
  return file;
}

/**
 * Returns base 64 string from array buffer
 * @param {Object} arrayBuffer 
 * @param {Boolean} addHeader 
 * https://github.com/AdobeXD/plugin-samples/blob/master/ui-panel-show-renditions/main.js
 **/
function getBase64ArrayBuffer(arrayBuffer, addHeader = true) {
  let base64 = ''
  const encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

  const bytes = new Uint8Array(arrayBuffer)
  const byteLength = bytes.byteLength
  const byteRemainder = byteLength % 3
  const mainLength = byteLength - byteRemainder

  let a, b, c, d
  let chunk

  // Main loop deals with bytes in chunks of 3
  for (var i = 0; i < mainLength; i = i + 3) {
      // Combine the three bytes into a single integer
      chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

      // Use bitmasks to extract 6-bit segments from the triplet
      a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
      b = (chunk & 258048) >> 12 // 258048   = (2^6 - 1) << 12
      c = (chunk & 4032) >> 6 // 4032     = (2^6 - 1) << 6
      d = chunk & 63               // 63       = 2^6 - 1

      // Convert the raw binary segments to the appropriate ASCII encoding
      base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
  }

  // Deal with the remaining bytes and padding
  if (byteRemainder == 1) {
      chunk = bytes[mainLength]

      a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

      // Set the 4 least significant bits to zero
      b = (chunk & 3) << 4 // 3   = 2^2 - 1

      base64 += encodings[a] + encodings[b] + '=='
  } else if (byteRemainder == 2) {
      chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

      a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
      b = (chunk & 1008) >> 4 // 1008  = (2^6 - 1) << 4

      // Set the 2 least significant bits to zero
      c = (chunk & 15) << 2 // 15    = 2^4 - 1

      base64 += encodings[a] + encodings[b] + encodings[c] + '='
  }
  var header = "data:image/png;base64,";
  return addHeader ?  header+ base64 : base64;
}

/**
 * Gets an empty string if value is null
 * @param {String} value if value is null returns an empty string
 **/
function getString(value) {
	return value==null ? "" : value;
}

/**
 * Get the index of the scene node in a container
 */
function getSceneNodeIndex(sceneNode) {
  if (sceneNode==null) { return -1 };
  var parent = sceneNode.parent && sceneNode.parent;
  var numberOfItems = parent && parent.children.length;
  var index = 0;

	for (index = 0; index < numberOfItems; index++) {
    let item = parent.at(index);
    
		if (item==sceneNode) {
			return index;
		}
	}

  return index;
}

/**
 * Get previous scene node in a container or null if first item
 */
function getPreviousSceneNode(sceneNode) {
  if (sceneNode==null && sceneNode.parent) { return null };
  var parent = sceneNode.parent;
  var numberOfItems = parent.children.length;
  var index = 0;

	for (index = 0; index < numberOfItems; index++) {
    let item = parent.children.at(index);
    
		if (item==sceneNode) {
      if (index==0) {
        return null;
      }
      else {
        return parent.children.at(index-1);
      }
		}
	}

  return null;
}

/**
 * Get the next scene node in a container or null if none
 */
function getNextSceneNode(sceneNode) {
  if (sceneNode==null && sceneNode.parent) { return null };
  var parent = sceneNode.parent;
  var numberOfItems = parent.children.length;
  var index = 0;

	for (var index = 0; index < numberOfItems; index++) {
    let item = parent.children.at(index);
    
		if (item==sceneNode) {
      if (index<=numberOfItems-1) {
        return parent.children.at(index+1);
      }
      else {
        return null;
      }
		}
	}

  return null;
}

/**
 * Get first descendant scene node in a container or null if none
 */
function getFirstDescendantNode(sceneNode) {
  if (sceneNode==null || sceneNode.isContainer==false) { 
    return null;
  }

  if (sceneNode.children.length) {
    return sceneNode.children.at(0);
  }

  return null;
}

/**
 * Get if element is in a group
 * @param {SceneNode} item 
 * @returns {Boolean} 
 **/
function getIsInGroup(item) {
	var parent = item && item.parent;
	var isArtboard = parent && getIsArtboard(parent);

	if (parent!=null && parent.isContainer && isArtboard==false) {
		return true;
	}

	return false;
}

/**
 * Duplicate position of an element
 * @param {SceneNode} source 
 * @param {SceneNode} target
 */
function replicatePosition(source, target, place = false) {
	var sourceBounds = source.boundsInParent;
	var registrationPoint = {x: source.localBounds.x, y: source.localBounds.y};
	var targetPoint = null;

  if (place) {
    targetPoint = {};
    targetPoint.x = sourceBounds.x;
    targetPoint.y = sourceBounds.y;
    target.placeInParentCoordinates(registrationPoint, targetPoint);
  }
  else {
    target.moveInParentCoordinates(sourceBounds.x, sourceBounds.y);
  }
}

/**
 * Returns true if plugin is located in plugin develop folder
 */
async function isDesignMode() {
	const filesystem = require("uxp").storage;
	const pluginFolder = await filesystem.localFileSystem.getPluginFolder();
	const nativePath = pluginFolder.nativePath;
	const isMac = require("os").platform()=="darwin";
	const delimiter = isMac ? "/" : "\\";
	var folders = nativePath.split(delimiter);
	var folderName = "develop";
	var filtered = folders.filter((path)=> {return path});
	var numberOfFolders = filtered.length;
	var index = filtered.indexOf(folderName);
	var offsetOfDevelopFolder = -2;

	if (index==numberOfFolders+offsetOfDevelopFolder) {
		return true;
	}

	return false;
}

module.exports = {object, log, isSupportedExportFormat, getShortNumber, getFirstDescendantNode, getNextSceneNode, getPreviousSceneNode, getSceneNodeIndex, getString, getArtboard, getAllArtboards, getCenterPoint, getBoundsInParent, getClassName, getFunctionName, 
  getStackTrace, getStackArray, logStackTrace, getIsGraphicNode, getIsGraphicNodeWithImageFill, getIsArtboard, getIsPasteboardItem, getShortString, getTime, getPx, getChangedProperties, trim, deleteProperties, addString, addStrings, walkDownTree, XDConstants, DebugSettings,
  isInEditContext, isSiblingNode, isDescendantNode, isChildNode, isPortrait, isLandscape, isDesignMode, getChildNodes, moveTo, sleep,
  centerLeft, center, centerRight, topLeft, topCenter, top, topRight, bottomLeft, bottom, bottomCenter, bottomRight, left, right,
  anchorToEdges, anchorToVerticalEdges, replicatePosition, getIsInGroup, getArrayBufferFromSceneNode, getBase64FromSceneNode, anchorToHorizontalEdges, centerHorizontally, centerVertically, indentMultiline, toggleLayerVisibility, getTempImageFromSceneNode};