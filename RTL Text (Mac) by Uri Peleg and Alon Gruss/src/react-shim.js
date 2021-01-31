if (window.setTimeout == null) {
  window.setTimeout = function(fn) {
    fn();
  };
}

if (window.clearTimeout == null) {
  window.clearTimeout = function() {};
}

if (window.cancelAnimationFrame == null) {
  window.cancelAnimationFrame = function() {};
}
if (window.requestAnimationFrame == null) {
  window.requestAnimationFrame = function() {
    console.log("requestAnimationFrame is not supported yet");
  };
}
if (window.HTMLIFrameElement == null) {
  window.HTMLIFrameElement = class HTMLIFrameElement {};
}

// safely handles circular references
JSON.safeStringify = (obj, indent = 2) => {
  let cache = [];
  const retVal = JSON.stringify(
    obj,
    (key, value) =>
      typeof value === "object" && value !== null
        ? cache.includes(value)
          ? undefined // Duplicate reference found, discard key
          : cache.push(value) && value // Store value in our collection
        : value,
    indent
  );
  cache = null;
  return retVal;
};