const scenegraph = require("scenegraph");
const assets = require("assets");
const shell = require("uxp").shell;
const { editDocument } = require("application");

const {
  Rectangle,
  Text,
  Ellipse,
  Polygon,
  Line,
  Path,
  Color,
  Shadow
} = scenegraph;

const superpositionNotRunningHTML = require("./components/superpositionNotRunning");
const superpositionRunningHTML = require("./components/superpositionRunning");

const applyColor = require("./functions/applyColor");
const applyTypography = require("./functions/applyTypography");
const applyBorderRadii = require("./functions/applyBorderRadii");
const applyShadows = require("./functions/applyShadows");
const addToAssets = require("./functions/addToAssets");
const accordion = require("./functions/accordion");

const SERVER = `http://127.0.0.1:8653`;

let panel;
let superpositionRunning;
let timestamp;
let data = {
  url: false,
  colors: [],
  typography: [],
  borderradii: [],
  shadows: []
};

function create() {
  panel = document.createElement("div");
  panel.innerHTML = `
    <style>${require("./components/styles")}</style>
    ${superpositionNotRunningHTML}
    ${superpositionRunningHTML}
  `;

  panel.querySelector("#add").addEventListener("click", e => {
    editDocument(function() {
      addToAssets(data.colors, data.typography);
      const msgEl = panel.querySelector("#msg");

      msgEl.innerHTML = "Colors added to assets panel!";
      msgEl.classList.add("visible");

      setTimeout(() => {
        msgEl.classList.remove("visible");
        msgEl.innerHTML = "";
        console.log("hi", msgEl);
      }, 1500);
    });
  });

  panel.querySelectorAll(".list").forEach(list => {
    accordion(list);
  });

  return panel;
}

async function determineSuperpositionRunning() {
  const newData = await fetch(`${SERVER}/data#${Math.random()}`)
    .then(response => response.json())
    .catch(error => false);

  if (newData) {
    superpositionRunning = true;

    if (data.url !== newData.currentUrl) {
      data.url = newData.currentUrl;
    }
    if (newData.timestamp !== timestamp) {
      updateValues(newData);
    }
  } else {
    superpositionRunning = false;

    data.colors = [];
    data.typography = [];
    data.borderradii = [];
    data.shadows = [];
  }

  determinePanelVisibility(false);

  // poll every 2 seconds;
  setTimeout(() => {
    determineSuperpositionRunning();
  }, 2000);
}

async function updateValues(newData) {
  if (newData) {
    data.colors = newData.colors;
    data.typography = newData.typography;
    data.borderradii = newData.borderRadii.filter(radius =>
      radius.endsWith("px")
    );
    data.shadows = newData.shadows
      .filter(shadow => shadow.indexOf("inset") === -1)
      .filter(shadow => shadow.match(/,/g).length < 4);

    panel.querySelector("#currentURL").innerHTML = data.url;

    applyTypography(panel.querySelector("#typographyList"), data.typography);
    applyColor(panel.querySelector("#colorList"), data.colors);
    applyBorderRadii(panel.querySelector("#borderradiiList"), data.borderradii);
    applyShadows(panel.querySelector("#shadowsList"), data.shadows);
  } else {
  }

  determinePanelVisibility(scenegraph.selection);
}

const showItem = id => panel.querySelector(id).classList.remove("hide");
const showColor = options => {
  data.colors.length && showItem("#colors");
  if (options && options.disabled) {
    panel.querySelector("#colors").classList.add("disabled");
  } else {
    panel.querySelector("#colors").classList.remove("disabled");
  }
};
const showTypography = () => data.typography.length && showItem("#typography");
const showSpacing = () =>
  (data.spacing.horizontalSpacing.length ||
    data.spacing.verticalSpacing.length) &&
  showItem("#spacing");
const showBorderradii = () =>
  data.borderradii.length && showItem("#borderradii");
const showShadows = () => data.shadows.length && showItem("#shadows");

const showAll = () => {
  showColor();
  showTypography();
  showSpacing();
  showBorderradii();
  showShadows();
};

function determinePanelVisibility(selection) {
  if (superpositionRunning) {
    panel.querySelector("#superpositionNotRunning").classList.add("hide");
    panel.querySelector("#superpositionRunning").classList.remove("hide");
  } else {
    panel.querySelector("#superpositionNotRunning").classList.remove("hide");
    panel.querySelector("#superpositionRunning").classList.add("hide");
  }

  if (selection) {
    panel
      .querySelectorAll("#superpositionRunning>div")
      .forEach(div => div.classList.add("hide"));

    if (selection.items[0] instanceof Rectangle) {
      panel
        .querySelector("#superpositionRunningRectangleSelected")
        .classList.remove("hide");

      showColor();
      showBorderradii();
      showShadows();
    } else if (selection.items[0] instanceof Text) {
      panel
        .querySelector("#superpositionRunningTextSelected")
        .classList.remove("hide");

      showColor();
      showTypography();
      showShadows();
    } else if (
      selection.items[0] instanceof Ellipse ||
      selection.items[0] instanceof Polygon ||
      selection.items[0] instanceof Line ||
      selection.items[0] instanceof Path
    ) {
      panel
        .querySelector("#superpositionRunningShapeSelected")
        .classList.remove("hide");

      showColor();
      showShadows();
    } else {
      panel
        .querySelector("#superpositionRunningNothingSelected")
        .classList.remove("hide");

      showColor({
        disabled: true
      });
    }
  }
}

function show(event) {
  if (!panel) {
    event.node.appendChild(create());
  }

  setTimeout(() => {
    // async...
    determineSuperpositionRunning();
  }, 100);
}

function hide(event) {
  //event.node.firstChild.remove();
}

function update(selection, documentRoot) {
  if (panel) {
    determinePanelVisibility(selection);
  }
}

module.exports = {
  panels: {
    db30d108: {
      show,
      hide,
      update
    }
  }
};
