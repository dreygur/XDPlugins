let panel;
let min = 5;
let max = 100;
let currentg;
let times = 1;
let isH = true;
const {alert, error} = require("./lib/dialogs.js");
const {Rectangle} = require("scenegraph");

function create() {
  // [1]
  const html = `
<style>
    .break { flex-wrap: wrap; }
    label.row > span { color: #8E8E8E; width: 50px; text-align: right; font-size: 12px; white-space: nowrap; flex:0 0 auto; }
    label.row input { flex: 1 1 auto; }
    form { padding: 0px; }
    .show { display: block; }
    .hide { display: none; }
    em { background-color:#f8ff89;padding: 0 5px;border-radius:4px; }
</style>

<form method="dialog" id="main">
    <div class="row break">
        <label class="row">
            <span>min size</span>
            <input type="number" uxp-quiet="true" id="min" value="${min}" placeholder="min" />
        </label>
        <label class="row">
            <span>max size</span>
            <input type="number" uxp-quiet="true" id="max" value="${max}" placeholder="max" />
        </label>
    </div>
    <p style="font-size: 11px;">When the same selection operation is performed for the <em>5n-1</em>(e.g. 4,9,...) time, it will be sorted from <em>low to high</em></p>
    <p style="font-size: 11px;">When the same selection operation is performed for the <em>5n</em>(e.g. 5,10,...) time, it will be sorted from <em>high to low</em></p>
    <footer><button id="ok" type="submit" uxp-variant="cta">Random Size</button></footer>
</form>

<p id="warning">This plugin requires you to select some rectangles in the document. Please select some rectangles.</p>
`;

  function randomRectangleSize() { // [2]
    const {editDocument} = require("application"); // [3]
    // [6]
    editDocument({editLabel: "Random Rectangles size"}, function (selection) {
      randomsize(selection);
    });
  }


  panel = document.createElement("div");
  panel.innerHTML = html;
  panel.querySelector("#ok").addEventListener("click", randomRectangleSize);

  return panel;
}

function randomsize(selection) {
  if (document.querySelector("#min")) {
    min = Number(document.querySelector("#min").value);
    max = Number(document.querySelector("#max").value);
  }
  let sortX = function (a, b) {
    return a.globalBounds.x - b.globalBounds.x
  };
  let sortY = function (a, b) {
    return a.globalBounds.y - b.globalBounds.y
  };
  let selgp = isH ? selection.items.sort(sortX) : selection.items.sort(sortY);
  let arr = [];
  const num = selection.items.length;

  for (let j = 0; j < num; j++) {
    let newsize = parseInt(max * Math.random());
    arr.push(newsize > min ? newsize : min);
  }

  if (times % 5 === 4 && num > 1) {
    arr.sort(function (a, b) {
      return a - b;
    });
  }
  if (times % 5 === 0 && num > 1 && times > 4) {
    arr.sort(function (a, b) {
      return b - a;
    });
  }
  for (let i = 0; i < num; i++) {
    if (selection && selgp[i] instanceof Rectangle) {
      let start = isH ? selgp[i].height : selgp[i].width;
      // selgp[i].height = min + parseInt((max - min) / (num - 1) * i);
      // selgp[i].height = max - parseInt((max - min) / (num - 1) * i);
      if (isH) {
        selgp[i].height = arr[i];
        selgp[i].moveInParentCoordinates(0, start - selgp[i].height);
      } else {
        selgp[i].width = arr[i];
        // selgp[i].moveInParentCoordinates(start - selgp[i].width, 0);
      }
    }
  }
  currentg = selection.items[0];
  times++;
}

function show(event) {
  if (!panel) event.node.appendChild(create());
}

async function showError() {

  await error("Please select some rectangles",
    "This plugin requires you to select some rectangles in the document. Please select some rectangles.");
}

/**
 * @return {boolean}
 */
function HorV(arr) {
  let H = 0;
  let V = 0;
  for (let item of arr) {
    if (item.localBounds.height > item.localBounds.width) H++;
    if (item.localBounds.height < item.localBounds.width) V++;
  }
  return H > V;
}

function findmax(arr) {
  let max = 0;
  for (let item of arr) {
    if (item.localBounds.height > max) {
      max = item.localBounds.height
    }
    if (item.localBounds.width > max) {
      max = item.localBounds.width
    }
  }
  return max;
}

function update(selection) {
  const form = document.querySelector("form");
  const warning = document.querySelector("#warning");

  if (!selection || !(selection.items[0] instanceof Rectangle)) {
    form.className = "hide";
    warning.className = "show";
  } else {
    form.className = "show";
    warning.className = "hide";
  }
  // console.log(selection.items.length);

  if (selection.items.length > 0 && currentg !== selection.items[0]) {
    document.querySelector("#max").value = findmax(selection.items);
    max = findmax(selection.items);
    isH = HorV(selection.items);
    times = 1;
  }
}

function quickReSize(selection, documentRoot) {
  const {Rectangle} = require("scenegraph");

  if (selection.items.length > 0 && currentg !== selection.items[0]) {
    max = findmax(selection.items);
    isH = HorV(selection.items);
    times = 1;
  }

  if (selection && (selection.items[0] instanceof Rectangle)) {
    randomsize(selection);
  } else {
    // console.log(123);
    showError();
  }
  // console.log(times);
}

module.exports = {
  panels: {
    resizeRectangle: {
      show,
      update
    }
  },
  commands: {
    quick: quickReSize
  }
};
