let panel;
const {Shadow, Rectangle, Ellipse, Color, selection, Artboard } = require("scenegraph");
let commands = require("commands");

const shadowColor1 = new Color('#000000', 0.18);
const myShadow1 = new Shadow(5, 5, 10, shadowColor1);


function create() {
  const html =  `
  <style>
  #color_panel{
  visibility: visible;
  }
  button.object:hover{
        background-color:#A5A7AA;
    }
      .break {
          flex-wrap: wrap;
      }
      label.row > span {
          color: #8E8E8E;
          width: 20px;
          text-align: right;
          font-size: 9px;
      }
      label.row input {
          flex: 1 1 auto;
      }
      .show {
          display: block;
      }
      .hide {
          display: none;
      }
      .bgdiv {
          border-radius: 25px;
          padding: 20px;
          background-color: white;
          margin:10px;
        }
  </style>
  <label>
  <input type="checkbox" id="color_btn"/>
  <span>Use background color of selected object</span>
  </label>
  <div class="row break" id = "color_panel">
  <label class="row">
      <span>R</span>
      <input type="number" uxp-quiet="true" id="c_r" value="0" placeholder="R" />
  </label>
  <label class="row">
      <span>G</span>
      <input type="number" uxp-quiet="true" id="c_g" value="0" placeholder="G" />
  </label>
  <label class="row">
      <span>B</span>
      <input type="number" uxp-quiet="true" id="c_b" value="0" placeholder="b" />
  </label>
</div>

  <div class = "bgdiv">
  <h1>RECTANGLE</h1>
  <hr>
  <form method="dialog" id="rect">
      <div class="row break">
          <label class="row">
              <span>Height</span>
              <input type="number" uxp-quiet="true" id="rectHeight" value="10" placeholder="Height" />
          </label>
          <label class="row">
              <span>Width</span>
              <input type="number" uxp-quiet="true" id="rectWidth" value="10" placeholder="Width" />
          </label>
      </div>
      <footer><button id="ok" type="submit" uxp-variant="cta">Create</button></footer>
  </form>
  </div>

  <div class = "bgdiv">
  <h1>CIRCLE</h1>
  <hr>
  <form method="dialog" id="circle">
      <div class="row break">
          <label class="row">
              <span>Radius</span>
              <input type="number" uxp-quiet="true" id="circleRadius" value="10" placeholder="Radius" />
          </label>
      </div>
      <footer><button id="ok" type="submit" uxp-variant="cta">Create</button></footer>
  </form>
  </div>

</form>
</div>
  <p id="warning">This plugin requires you to select any filled element in the document. Please select one.</p>
  `;

  function createRectangle() {
    const { editDocument } = require("application");
    const rect_h = Number(document.querySelector("#rectHeight").value);
    const rect_w = Number(document.querySelector("#rectWidth").value);

    if (document.getElementById('color_btn').checked)
    {
        document.getElementById("color_panel").style.visibility == 'hidden';
        var newColor = selection.items[0].fill.clone()

    }
    else{
        document.getElementById("color_panel").style.visibility == 'visible';
        const c_color_r = Number(document.querySelector("#c_r").value);
        const c_color_g = Number(document.querySelector("#c_g").value);
        const c_color_b = Number(document.querySelector("#c_b").value);
        var newColor = new Color({r:c_color_r,g:c_color_g,b:c_color_b});
    }

    editDocument({ editLabel: "Create a rectangle" }, function (selection) {
        const blackShadowRect = new Rectangle();
        blackShadowRect.width = rect_w;
        blackShadowRect.height = rect_h;
        blackShadowRect.fill = newColor;
        blackShadowRect.shadow = myShadow1;
        blackShadowRect.cornerRadii = {topLeft:40, topRight:40, bottomRight:40, bottomLeft:40}
        selection.insertionParent.addChild(blackShadowRect);
        blackShadowRect.moveInParentCoordinates(0, 0);

        let shadowColor2_r = newColor.r + 25;
        let shadowColor2_g = newColor.g + 25;
        let shadowColor2_b = newColor.b + 25;

        if (shadowColor2_r > 255){
          let val = shadowColor2_r - 255;
          shadowColor2_r = newColor.r + val;
        }
        if (shadowColor2_g > 255){
          let val = shadowColor2_g - 255;
          shadowColor2_g = newColor.g + val;
        }
        if (shadowColor2_b > 255){
          let val = shadowColor2_b - 255;
          shadowColor2_b = newColor.b + val;
        }

        const shadowColor2 = new Color({r:shadowColor2_r,g:shadowColor2_g,b:shadowColor2_b});
        const myShadow2 = new Shadow(-5, -5, 10, shadowColor2);

        const whiteShadowRect = new Rectangle();
        whiteShadowRect.width = rect_w;
        whiteShadowRect.height = rect_h;
        whiteShadowRect.fill = newColor;
        whiteShadowRect.shadow = myShadow2;
        whiteShadowRect.cornerRadii = {topLeft:40, topRight:40, bottomRight:40, bottomLeft:40}
        selection.insertionParent.addChild(whiteShadowRect);
        whiteShadowRect.moveInParentCoordinates(0, 0);

        selection.items = [blackShadowRect, whiteShadowRect];
        commands.group();
    })
  }

  function createCircle() {
    const { editDocument } = require("application");
    const radius = Number(document.querySelector("#circleRadius").value);

    if (document.getElementById('color_btn').checked)
    {
        document.getElementById("color_panel").style.visibility == 'hidden';
        var newColor = selection.items[0].fill.clone()

    }
    else{
        document.getElementById("color_panel").style.visibility == 'visible';
        const c_color_r = Number(document.querySelector("#c_r").value);
        const c_color_g = Number(document.querySelector("#c_g").value);
        const c_color_b = Number(document.querySelector("#c_b").value);
        var newColor = new Color({r:c_color_r,g:c_color_g,b:c_color_b});
    }

    editDocument({ editLabel: "Create a circle"}, function(selection){
        let blackShadowCircle = new Ellipse();
        blackShadowCircle.radiusX = radius;
        blackShadowCircle.radiusY = radius;
        blackShadowCircle.fill = newColor;
        blackShadowCircle.shadow = myShadow1;
        selection.insertionParent.addChild(blackShadowCircle);
        blackShadowCircle.moveInParentCoordinates(0, 0);

        let shadowColor2_r = newColor.r + 25;
        let shadowColor2_g = newColor.g + 25;
        let shadowColor2_b = newColor.b + 25;

        if (shadowColor2_r > 255){
          let val = shadowColor2_r - 255;
          shadowColor2_r = newColor.r + val;
        }
        if (shadowColor2_g > 255){
          let val = shadowColor2_g - 255;
          shadowColor2_g = newColor.g + val;
        }
        if (shadowColor2_b > 255){
          let val = shadowColor2_b - 255;
          shadowColor2_b = newColor.b + val;
        }

        const shadowColor2 = new Color({r:shadowColor2_r,g:shadowColor2_g,b:shadowColor2_b});
        const myShadow2 = new Shadow(-2, -2, 5, shadowColor2);

        let whiteShadowCircle = new Ellipse();
        whiteShadowCircle.radiusX = radius;
        whiteShadowCircle.radiusY = radius;
        whiteShadowCircle.fill = newColor;
        whiteShadowCircle.shadow = myShadow2;
        selection.insertionParent.addChild(whiteShadowCircle);
        whiteShadowCircle.moveInParentCoordinates(0, 0);

        selection.items = [blackShadowCircle, whiteShadowCircle];
        commands.group();
    });
}
  panel = document.createElement("div");
  panel.innerHTML = html;

  panel.querySelector("#circle").addEventListener("submit", createCircle);
  panel.querySelector("#rect").addEventListener("submit", createRectangle);

  return panel;

}

function show(event) {
  if (!panel) event.node.appendChild(create());
}

module.exports = {
  panels: {
    createRectangle: {
      show
    }
  }

};