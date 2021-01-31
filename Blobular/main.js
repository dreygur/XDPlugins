const { Path, Color } = require("scenegraph");

let panel;
function create() {
  const html = `
  <style>
      .uxp-plugin label span {
        margin-left: 0;
        margin-right: 0;
      }

      .uxp-plugin h3 {
        margin: 3px 0 10px 0;
        font-size: 11px;
        color: #707070;
        letter-spacing: 0;
      }

      input[type="range"] {
        margin: 6px 0 0 0;
        width: 100%;
      }

      input[type="checkbox"] {
        margin: 0 10px 0 0;
      }

      label input[type="checkbox"] + span {
        font-size: 12px;
        color: #8E8E8E;
      }

      .uxp-plugin hr {
        margin: 2px 0 8px 0;
      }

      label > div {
        display: flex;
        flex: 1 0 auto;
        width: 100%;
        justify-content: space-between;
      }

      label {
        margin-bottom: 8px;
      }

      form {
        display: flex;
        flex-direction: column;
        min-height: calc(100vh - 110px);
      }

      .blob-preview-spacer {
        flex: 1 0 auto;
      }

      .blob-preview-div {
        background: #FFFFFF;
        width: 100%;
        height: 170px;
        border-radius: 2px;
        border: 1px solid #D0D0D0;
        display: flex;
        justify-content: center;
      }

      .uxp-plugin footer {
        flex-direction: column;
        margin: 18px 0 6px 0;
      }

      .uxp-plugin button {
        display: block;
        flex: 1 0 auto;
        width: 100%;
        margin: 0;
      }

      label span {
        color: #8E8E8E;
        text-align: left;
        font-size: 12px;
      }

      form {
        width: 100%;
        padding: 0;
        margin: 0;
      }
  </style>

  <form method="dialog" id="main">
    <h3>SHAPE</h3>
    <label>
      <div class="row spread">
        <span>Complexity</span>
        <span data-label="complexity">50</span>
      </div>
      <input type="range" min=0 max=10 value=5 id="complexityV" data-shape data-name="complexity" uxp-quiet="true" />
    </label>
    <label>
      <div class="row spread">
        <span>Uniqueness</span>
        <span data-label="contrast">50</span>
      </div>
      <input type="range" min=0 max=10 value=5 id="contrastV" data-shape data-name="contrast" uxp-quiet="true" />
    </label>
    <hr class="small" />
    <h3>COLOR</h3>
    <label>
      <input type="checkbox" checked="true" id="color" />
      <span>Fill</span>
    </label>
    <div class="color-settings">
      <label>
        <div class="row spread">
          <span>Hue</span>
          <span data-label="hue">0</span>
        </div>
        <input type="range" min=0 max=360 value=0 id="colorH" data-name="hue" data-color uxp-quiet="true" />
      </label>
      <label>
        <div class="row spread">
          <span>Saturation</span>
          <span data-label="saturation">50</span>
        </div>
        <input type="range" min=0 max=100 value=50 id="colorS" data-name="saturation" data-color uxp-quiet="true" />
      </label>
      <label>
        <div class="row spread">
          <span>Lightness</span>
          <span data-label="lightness">50</span>
        </div>
        <input type="range" min=0 max=100 value=50 id="colorL" data-name="lightness" data-color uxp-quiet="true" />
      </label>
    </div>
    <label>
      <input type="checkbox" id="border" />
      <span>Border</span>
    </label>
    <div class="border-settings" style="display: none">
      <label>
        <div class="row spread">
          <span>Hue</span>
          <span data-label="borderHue">0</span>
        </div>
        <input type="range" min=0 max=360 value=0 id="borderH" data-name="borderHue" uxp-quiet="true" />
      </label>
      <label>
        <div class="row spread">
          <span>Saturation</span>
          <span data-label="borderSaturation">0</span>
        </div>
        <input type="range" min=0 max=100 value=50 id="borderS" data-name="borderSaturation" uxp-quiet="true" />
      </label>
      <label>
        <div class="row spread">
          <span>Lightness</span>
          <span data-label="borderLightness">0</span>
        </div>
        <input type="range" min=0 max=100 value=50 id="borderL" data-name="borderLightness" uxp-quiet="true" />
      </label>
    </div>
    <div class="blob-preview-spacer"></div>
    <hr class="small" />
    <label style="margin-bottom: 6px">
      <span style="margin-top: 2px">Preview</span>
    </label>
    <div class="blob-preview-div">
      <svg width="170" height="170" xmlns="http://www.w3.org/2000/svg" class="blob-preview">
        <path transform="scale(.166)" d="" fill="hsl(0, 50%, 50%)" stroke="transparent" style="stroke-width: 20px" />
      </svg>
    </div>
    <footer>
      <button id="ok" type="submit" uxp-variant="cta">Create Blob</button>
      <button id="reset" uxp-variant="secondary">Reset</button>
    </footer>
  </form>
  `;

  panel = document.createElement("div")
  panel.innerHTML = html;

  return panel;
}

function show(event) {
  if (!panel) event.node.appendChild(create());

  updateBlobPreview();

  function addBlobToDocument() {
    const { editDocument } = require("application");
    const viewport = require("viewport");
    const path = document.querySelector(".blob-preview > path").getAttribute("d");
    const colorH = Number(document.querySelector("#colorH").value);
    const colorS = Number(document.querySelector("#colorS").value);
    const colorL = Number(document.querySelector("#colorL").value);
    const color = {h: colorH, s: colorS, l: colorL};

    const borderH = Number(document.querySelector("#borderH").value);
    const borderS = Number(document.querySelector("#borderS").value);
    const borderL = Number(document.querySelector("#borderL").value);
    const borderColor = {h: borderH, s: borderS, l: borderL};

    const colorEnabled = document.getElementById("color").checked;
    const borderEnabled = document.getElementById("border").checked;

    editDocument({ editLabel: "Increase rectangle size" }, function(selection) {
      const blob = createBlobElement(
        path,
        color,
        borderColor,
        colorEnabled,
        borderEnabled
      );
      selection.insertionParent.addChild(blob);

      if (selection.items[0]) {
        // place next to selection
        const selectedItem = selection.items[0];

        blob.placeInParentCoordinates(
          {
            x: blob.localBounds.x,
            y: blob.localBounds.y
          },
          {
            x: selectedItem.boundsInParent.x + 100,
            y: selectedItem.boundsInParent.y
          }
        );

      } else {
        // place in center of viewport
        blob.placeInParentCoordinates(
          {
            x: blob.localBounds.x,
            y: blob.localBounds.y
          },
          {
            x: viewport.bounds.x + (viewport.bounds.width / 2) - (blob.localBounds.width / 2),
            y: viewport.bounds.y + (viewport.bounds.height / 2) - (blob.localBounds.height / 2)
          }
        );
      }

      selection.items = blob;

      updateBlobPreview();
    });
  }

  document.querySelector("form").addEventListener("submit", addBlobToDocument);

  // change value in UI when slider changes
  document.querySelectorAll('[data-name]').forEach(item => {
    item.addEventListener('input', event => {
      let itemValue = item.value;
      if (item.hasAttribute("data-shape")) {
        itemValue = itemValue * 10;
      }
      itemValue = Math.round(itemValue);
      let itemName = item.dataset.name;
      let itemLabel = document.querySelector('[data-label="' + itemName + '"]')
      itemLabel.innerHTML = itemValue.toString();
    });

    item.addEventListener('change', event => {
      if (item.hasAttribute("data-shape")) {
        updateBlobPreview();
      }
    });

    item.addEventListener('input', event => {
      if (item.hasAttribute("data-color")) {
        updateBlobColor();
      } else if (!item.hasAttribute("data-shape")) {
        updateBlobStrokeColor();
      }
    });
  });

  document.querySelector("#reset").addEventListener("click", resetSettings);
  function resetSettings() {
    document.querySelectorAll('[data-name]').forEach(item => {
      item.value = 0;
      let itemValue = item.value;
      let itemName = item.dataset.name;
      if (item.hasAttribute("data-shape")) {
        item.value = 5;
        itemValue = 50;
      } else if (
          itemName === "lightness" ||
          itemName === "saturation" ||
          itemName === "borderLightness" ||
          itemName === "borderSaturation"
        ) {
        item.value = 50;
        itemValue = 50;
      }
      itemValue = Math.round(itemValue);
      let itemLabel = document.querySelector('[data-label="' + itemName + '"]')
      itemLabel.innerHTML = itemValue.toString();

      document.getElementById("color").checked = true;
      document.querySelector(".color-settings").style.display = "block";
      document.getElementById("border").checked = false;
      document.querySelector(".border-settings").style.display = "none";
    });

    updateBlobPreview();
    updateBlobColor();
    updateBlobStrokeColor();
  }

  const borderSettingInput = document.getElementById("border");
  const borderSettings = document.querySelector(".border-settings");

  const colorSettingInput = document.getElementById("color");
  const colorSettings = document.querySelector(".color-settings");

  borderSettingInput.addEventListener('change', event => {
    updateBlobStrokeColor();
    if (borderSettingInput.checked == true){
      borderSettings.style.display = "block";
    } else {
      borderSettings.style.display = "none";
    }
  });

  colorSettingInput.addEventListener('change', event => {
    updateBlobColor();
    if (colorSettingInput.checked == true){
      colorSettings.style.display = "block";
    } else {
      colorSettings.style.display = "none";
    }
  });

  function updateBlobPreview() {
    const complexity = document.getElementById("complexityV").value;
    const contrast = document.getElementById("contrastV").value;

    const blobPath = generateBlob({
        size: 1000,
        complexity: (complexity * .1),
        contrast: (contrast * .1)
    });
    const previewEl = document.querySelector(".blob-preview > path");
    previewEl.setAttribute("d", blobPath);
  }

  function updateBlobColor() {
    let hsl;
    const colorEnabled = document.getElementById("color").checked;

    if (colorEnabled) {
      const hue = document.getElementById("colorH").value;
      const saturation = document.getElementById("colorS").value;
      const lightness = document.getElementById("colorL").value;
      hsl = "hsl(" + Math.round(hue) + ", " + Math.round(saturation) + "%, " + Math.round(lightness) + "%)"
    } else {
      hsl = "transparent";
    }

    const previewEl = document.querySelector(".blob-preview > path");
    previewEl.setAttribute("fill", hsl);
  }

  function updateBlobStrokeColor() {
    let hsl;
    const borderEnabled = document.getElementById("border").checked;

    if (borderEnabled) {
      const hue = document.getElementById("borderH").value;
      const saturation = document.getElementById("borderS").value;
      const lightness = document.getElementById("borderL").value;
      hsl = "hsl(" + Math.round(hue) + ", " + Math.round(saturation) + "%, " + Math.round(lightness) + "%)"
    } else {
      hsl = "transparent";
    }

    const previewEl = document.querySelector(".blob-preview > path");
    previewEl.setAttribute("stroke", hsl);
  }

}

function update(selection) {}

// Create blob from preview path
function createBlobElement(path, color, borderColor, colorEnabled, borderEnabled) {
  const blobElement = new Path();
  blobElement.pathData = path;
  if (colorEnabled) {
    blobElement.fill = new Color(color);
  }
  if (borderEnabled) {
    blobElement.stroke = new Color(borderColor);
    blobElement.strokeWidth = 20;
  }
  return blobElement;
}

// Generate blob

const generateBlob = (opt) => {
    const rgen = rand(String(Date.now()));
    const count = 3 + Math.floor(14 * opt.complexity);
    const angle = 360 / count;
    const radius = opt.size / Math.E;
    const points = [];
    for (let i = 0; i < count; i++) {
        const rand = 1 - 0.8 * opt.contrast * rgen();
        points.push({
            x: Math.sin(rad(i * angle)) * radius * rand + opt.size / 2,
            y: Math.cos(rad(i * angle)) * radius * rand + opt.size / 2,
        });
    }
    const smoothed = smooth(points, {
        closed: true,
        strength: ((4 / 3) * Math.tan(rad(angle / 4))) / Math.sin(rad(angle / 2)),
    });
    return render(smoothed, {
        closed: true,
        fill: opt.color,
        size: opt.size
    });
};

const loopAccess = (arr, i) => {
    return arr[((i % arr.length) + arr.length) % arr.length];
};
const rad = (deg) => {
    return (deg / 360) * 2 * Math.PI;
};
const deg = (rad) => {
    return (((rad / Math.PI) * 1) / 2) * 360;
};
const distance = (p1, p2) => {
    return Math.sqrt(Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2));
};
const angle = (p1, p2) => {
    return deg(Math.atan2(p2.y - p1.y, p2.x - p1.x));
};
const rand = (seed) => {
    const xfnv1a = (str) => {
        let h = 2166136261 >>> 0;
        for (let i = 0; i < str.length; i++) {
            h = Math.imul(h ^ str.charCodeAt(i), 16777619);
        }
        return () => {
            h += h << 13;
            h ^= h >>> 7;
            h += h << 3;
            h ^= h >>> 17;
            return (h += h << 5) >>> 0;
        };
    };
    const sfc32 = (a, b, c, d) => () => {
        a >>>= 0;
        b >>>= 0;
        c >>>= 0;
        d >>>= 0;
        var t = (a + b) | 0;
        a = b ^ (b >>> 9);
        b = (c + (c << 3)) | 0;
        c = (c << 21) | (c >>> 11);
        d = (d + 1) | 0;
        t = (t + d) | 0;
        c = (c + t) | 0;
        return (t >>> 0) / 4294967296;
    };
    const seedGenerator = xfnv1a(seed);
    return sfc32(seedGenerator(), seedGenerator(), seedGenerator(), seedGenerator());
};

const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
};

const smooth = (points, opt) => {
    if (points.length === 2)
        return points;
    const out = [];
    for (let i = 0; i < points.length; i++) {
        const point = loopAccess(points, i);
        const before = loopAccess(points, (i - 1));
        const after = loopAccess(points, (i + 1));
        out.push({
            x: point.x,
            y: point.y,
            handles: {
                angle: angle(before, after),
                in: opt.strength * (1 / 2) * distance(point, before),
                out: opt.strength * (1 / 2) * distance(point, after),
            },
        });
    }
    return out;
};

const interpolate = (point, opt) => {
    const handles = point.handles || { angle: 0, out: 0, in: 0 };
    handles.angle = Math.PI + rad(handles.angle);
    return {
        x: point.x,
        y: opt.size - point.y,
        handles,
    };
};

const render = (p, opt) => {
    const points = p.map((point) => interpolate(point, opt));
    const handles = [];
    for (let i = 0; i < points.length; i++) {
        const { x, y, handles: hands } = loopAccess(points, i);
        const next = loopAccess(points, (i + 1));
        const nextHandles = next.handles;
        if (hands === undefined) {
            handles.push({ x1: x, y1: y, x2: next.x, y2: next.y });
            continue;
        }
        handles.push({
            x1: x - Math.cos(hands.angle) * hands.out,
            y1: y + Math.sin(hands.angle) * hands.out,
            x2: next.x + Math.cos(nextHandles.angle) * nextHandles.in,
            y2: next.y - Math.sin(nextHandles.angle) * nextHandles.in,
        });
    }
    let path = "";
    for (let i = 0; i <= points.length; i++) {
        const point = loopAccess(points, i);
        const hands = loopAccess(handles, (i - 1));
        if (i === 0) {
            path += `M ${point.x} ${point.y}`;
            continue;
        }
        path += ` C ${hands.x1} ${hands.y1} ${hands.x2} ${hands.y2} ${point.x} ${point.y}`;
    }
    return path;
};


module.exports = {
  panels: {
    settings: {
      show,
      update
    }
  }
};
