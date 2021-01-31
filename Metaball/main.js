let panel;

let lastNodes = [];
let selectedNodes = null;

function create() {
  const html = `
<style>
    .break {
        flex-wrap: wrap;
    }
    label.row > span {
        color: #8E8E8E;
        width: 20px;
        text-align: right;
        font-size: 9px;
        display: block;
    }
    div.row {
      display: block;
      margin: 0 0 10px 0;
    }
    div.row input {
        width: 100%;
    }
    form {
        width: 100%;
        margin: 0px;
        padding: 0px;
    }
    .show {
        display: block;
    }
    .hide {
        display: none;
    }
</style>
<form method="dialog" id="main">
    <div class="row break">
      <div class="row break">Generate 2D-Metaball shapes from circle objects.</div>
      <div class="row break">
            <span>Rate</span>
            <input id="rate" uxp-quiet="true" class="slider" value="50" type="range" min="1" max="200">
        </div>
    </div>
    <footer><button id="create" type="submit" uxp-variant="cta">Create</button></footer>
</form>

<div id="warning">This plugin requires you to select circle layers in the document. Please select two or more circle layers with the same dimensions.</div>
`;

  function createMetaball() {
    const { editDocument } = require("application");
    const { Path, Color, Ellipse, root } = require("scenegraph");
    const rate = Number(document.querySelector("#rate").value) || 50;
    const form = document.querySelector("form");
    const warning = document.querySelector("#warning");
    

    // [6]
    editDocument({ editLabel: "Increase metaball size" }, function(selection) {
      let currentArtboard = selection.parent;
      const nodes = selection.items;

      let selectedNodesInLastNodes = false;
      if (selectedNodes) {
        selectedNodesInLastNodes = nodes.every(n => selectedNodes.includes(n));
      }
      
      selectedNodes = nodes;

      if (selectedNodesInLastNodes) {
        lastNodes.forEach( element => {
          if(element) {
            element.removeFromParent();
          }
        });
      }
      lastNodes = [];

      let handleSize = 24;
      let appearance = 'Half';
      let index = 1;
    
      for (let i = nodes.length - 1; i >= 1; i--) {
        for (let j = i - 1; j >= 0; j--) {
          if (((nodes[i] instanceof Ellipse) && nodes[i].isCircle) && ((nodes[j] instanceof Ellipse) && (nodes[j].isCircle))) {
            let txi = (nodes[i].parent !== nodes[j].parent) ? nodes[i].globalBounds.x : nodes[i].translation.x;
            let tyi = (nodes[i].parent !== nodes[j].parent) ? nodes[i].globalBounds.y : nodes[i].translation.y;
            let txj = (nodes[i].parent !== nodes[j].parent) ? nodes[j].globalBounds.x : nodes[j].translation.x;
            let tyj = (nodes[i].parent !== nodes[j].parent) ? nodes[j].globalBounds.y : nodes[j].translation.y;
            
            let metaballObj = metaball(nodes[i].localBounds.width / 2, nodes[j].localBounds.width / 2, [txi + nodes[i].localBounds.width / 2, tyi + nodes[i].localBounds.width / 2], [txj + nodes[j].localBounds.width / 2, tyj + nodes[j].localBounds.width / 2], handleSize/10, rate/100, appearance);
            
            if (nodes[i].parent !== nodes[j].parent) {
              currentArtboard = root;
            } else {
              currentArtboard = selection.insertionParent;
            }
            if (metaballObj) {

              const node = new Path();
              let layer = nodes[i];
              node.pathData = metaballObj;

              node.name = 'MetaballShape'+ index;
              node.fill = new Color(layer.fill);
              node.stroke = new Color(layer.stroke);
              node.strokeEnabled = layer.strokeEnabled;
              lastNodes.push(node);
              currentArtboard.addChild(node);

            } else {
              form.className = "hide";
              warning.className = "show";
            }
          } else {
            form.className = "hide";
            warning.className = "show";
          }
        }
      }
    });
  }

  panel = document.createElement("div");
  panel.innerHTML = html;
  panel.querySelector("form").addEventListener("submit", createMetaball);
  panel.querySelector("input").addEventListener("input", createMetaball);


  return panel;
}

function show(event) {
    if (!panel) event.node.appendChild(create());
}

function update(selection) {
    const { Ellipse } = require("scenegraph");
  
    const form = document.querySelector("form");
    const warning = document.querySelector("#warning");

    let selectionIsEllipseAndCircle = [];
    selection.items.forEach(item => {
      selectionIsEllipseAndCircle.push(item instanceof Ellipse && item.isCircle);
    });
  
    if (!selection || !(selectionIsEllipseAndCircle.every(n => n === true)) || selection.items.length < 2) {
      form.className = "hide";
      warning.className = "show";
    } else {
      form.className = "show";
      warning.className = "hide";
    }
}

/**
 * Based on Metaball script by SATO Hiroyuki
 * http://shspage.com/aijs/en/#metaball
 */
function metaball(radius1, radius2, center1, center2, handleSize = 2.4, v = 0.5, appearance = 'Full') {
  const HALF_PI = Math.PI / 2;
  const d = dist(center1, center2);
  const maxDist = radius1 + radius2 * 300;
  let u1, u2;

  if (radius1 === 0 || radius2 === 0 || d > maxDist || d <= Math.abs(radius1 - radius2)) {
    return '';
  }

  if (d < radius1 + radius2) {
    u1 = Math.acos(
      (radius1 * radius1 + d * d - radius2 * radius2) / (2 * radius1 * d),
    );
    u2 = Math.acos(
      (radius2 * radius2 + d * d - radius1 * radius1) / (2 * radius2 * d),
    );
  } else {
    u1 = 0;
    u2 = 0;
  }

  // All the angles
  const angleBetweenCenters = angle(center2, center1);
  const maxSpread = Math.acos((radius1 - radius2) / d);

  const angle1 = angleBetweenCenters + u1 + (maxSpread - u1) * v;
  const angle2 = angleBetweenCenters - u1 - (maxSpread - u1) * v;
  const angle3 = angleBetweenCenters + Math.PI - u2 - (Math.PI - u2 - maxSpread) * v;
  const angle4 = angleBetweenCenters - Math.PI + u2 + (Math.PI - u2 - maxSpread) * v;
  // Points
  const p1 = getVector(center1, angle1, radius1);
  const p2 = getVector(center1, angle2, radius1);
  const p3 = getVector(center2, angle3, radius2);
  const p4 = getVector(center2, angle4, radius2);

  // Define handle length by the
  // distance between both ends of the curve
  const totalRadius = radius1 + radius2;
  const d2Base = Math.min(v * handleSize, dist(p1, p3) / totalRadius);

  // Take into account when circles are overlapping
  const d2 = d2Base * Math.min(1, d * 2 / (radius1 + radius2));

  const r1 = radius1 * d2;
  const r2 = radius2 * d2;

  const h1 = getVector(p1, angle1 - HALF_PI, r1);
  const h2 = getVector(p2, angle2 + HALF_PI, r1);
  const h3 = getVector(p3, angle3 + HALF_PI, r2);
  const h4 = getVector(p4, angle4 - HALF_PI, r2);

  return metaballToPath(
    p1, p2, p3, p4,
    h1, h2, h3, h4,
    d > radius1,
    radius2,
    radius1,
    appearance
  );
}

function metaballToPath(p1, p2, p3, p4, h1, h2, h3, h4, escaped, r, r1, appearance) {
  if (appearance == 'Half') {
    return [
      'M', p1,
      'C', h1, h3, p3,
      'L', p4,
      'C', h4, h2, p2,
      'Z'
    ].join(' ');
  } else {
    return [
      'M', p1,
      'C', h1, h3, p3,
      'A', r, r, 0, escaped ? 1 : 0, 0, p4,
      'C', h4, h2, p2,
      'A', r1, r1, 0, escaped ? 1 : 0, 0, p1,
    ].join(' ');
  }
}

function dist([x1, y1], [x2, y2]) {
  return ((x1 - x2) ** 2 + (y1 - y2) ** 2) ** 0.5;
}

function angle([x1, y1], [x2, y2]) {
  return Math.atan2(y1 - y2, x1 - x2);
}

function getVector([cx, cy], a, r) {
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

module.exports = {
    panels: {
      createMetaball: {
        show,
        update
      }
    }
};
