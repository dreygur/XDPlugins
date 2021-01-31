const {Path, Color} = require("scenegraph");

async function regularPolygonFunction(selection) {
  const dialog = createDialog();
  try {
    const value = await dialog.showModal();
    
    if (3 <= value.vertex && 0 < value.radius) {
      const vertex = value.vertex;
      const radius = value.radius;
      const points = [];
      const angle = 360 / vertex;

      // 頂点の座標を求める
      for (let i = 0; i < vertex; i++) {
        const rad = angle * i * Math.PI / 180;
        const x = radius * Math.cos(rad);
        const y = radius * Math.sin(rad);
        points.push({x:x, y:y});
      }
      
      // path data のテキスト作成
      let pathData = `M${points[0].x},${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        pathData += `L${points[i].x},${points[i].y}`
      }
      pathData += 'Z';

      // path を追加
      const wedge = new Path();
      wedge.pathData = pathData;
      wedge.fill = new Color("#000000");
      wedge.translation = {x: radius, y: radius};
      selection.insertionParent.addChild(wedge);
    } else {
      console.log("Illegal value");  
    }
  } catch (err) {
    console.log("ESC dismissed dialog");
  }
}

function createDialog() {
  document.body.innerHTML = `
<style>
    #dialog form {
        width: 300px;
    }
</style>
<dialog id="dialog">
    <form method="dialog">
        <label>
            <span>Number of vertices</span>
            <input uxp-quiet="true" type="text" id="vertex" value="3"/>
        </label>
        <label>
            <span>radius</span>
            <input uxp-quiet="true" type="text" id="radius" value="100"/>
        </label>
        <footer>
            <button id="cancel">Cancel</button>
            <button type="submit" id="ok" uxp-variant="cta">OK</button>
        </footer>
    </form>
</dialog>
`;

  const dialog = document.querySelector('#dialog');
  const form = document.querySelector('#dialog form');
  const cancel = document.querySelector('#cancel');
  const ok = document.querySelector('#ok');
  const vertex = document.querySelector('#vertex');
  const radius = document.querySelector('#radius');

  const submit = (e) => {
    dialog.close({vertex: parseInt(vertex.value), radius: parseInt(radius.value)});
  }

  cancel.addEventListener("click", () => {
    dialog.close();
  });
  ok.addEventListener("click", e => {
    submit();
    e.preventDefault();
  });
  form.addEventListener("submit", e => {
    submit();
    e.preventDefault();
  })

  return dialog;
}

module.exports = {
  commands: {
    regularPolygonCommand: regularPolygonFunction
  }
};