const {Path, Color} = require("scenegraph");

async function starShapeFunction(selection) {
  const dialog = createDialog();
  try {
    const value = await dialog.showModal();
    
    if (3 <= value.vertex && 0 < value.radius1 && 0 < value.radius2) {
      const vertex = value.vertex;
      const radius1 = value.radius1;
      const radius2 = value.radius2;
      const points = [];
      const angle = 360 / vertex;

      // 頂点の座標を求める
      for (let i = 0; i < vertex; i++) {
        const rad1 = (angle * i - angle / 2) * Math.PI / 180;
        const x1 = radius1 * Math.cos(rad1);
        const y1 = radius1 * Math.sin(rad1);
        points.push({x:x1, y:y1});

        const rad2 = angle * i * Math.PI / 180;
        const x2 = radius2 * Math.cos(rad2);
        const y2 = radius2 * Math.sin(rad2);
        points.push({x:x2, y:y2});
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
      wedge.translation = {x: radius1, y: radius1};
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
            <span>radius 1</span>
            <input uxp-quiet="true" type="text" id="radius1" value="100"/>
        </label>
        <label>
            <span>radius 2</span>
            <input uxp-quiet="true" type="text" id="radius2" value="50"/>
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
  const radius1 = document.querySelector('#radius1');
  const radius2 = document.querySelector('#radius2');

  const submit = (e) => {
    dialog.close({vertex: parseInt(vertex.value), radius1: parseInt(radius1.value), radius2: parseInt(radius2.value)});
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
    starShapeCommand: starShapeFunction
  }
};