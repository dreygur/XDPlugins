/* developed by Sayed Faisal (http://sfaisal.dev) */
const { Rectangle, Color, Path} = require("scenegraph");
const paperjs = require("./lib/paper-core.min.js");

function reorientPath(selection) {
  if(selection.items.length>0){
    var skippedItems=0;
    selection.items.forEach(function (item, index) {
      var isPath = false;
      var str = item.toString();
      str = str.substring(0, 4);

      if(str == "Path") isPath = true;

      if(isPath){
        var tempPath = new paperjs.Path(item.pathData);
        tempPath.rotate(item.rotation);

        if(item.rotation>0){
          item.rotateAround(-item.rotation, item.localCenterPoint);
        }else{
          item.rotateAround((item.rotation*-1), item.localCenterPoint);
        }
        item.pathData = tempPath.pathData;
      }else{
        console.log('Skipped object ('+item.name+')');
        skippedItems++;
      }
    });
    if(skippedItems>0){
      if(skippedItems==1){
        if(selection.items.length==1){
          showDialog("The selected object is not a path, please select a path.");
        }else{
          showDialog("Skipped "+ skippedItems +" object, because it's not a path.");
        }
      }else{
        showDialog("Skipped "+ skippedItems +" objects, because it's not a path.");
      }
    }
  }else{
    showDialog("Please select a path.");
  }
}
function showDialog(message) {
  const dialogId = `#dia`;
  let appDialog = document.querySelector(dialogId);

  document.body.innerHTML = `
  <style>
      form {
          width: 360px;
      }
      p{
        text-align: center;
      }
  </style>
  <dialog id="dia">
  <form method="dialog">
      <p>`+message+`</p>
      <footer>
          <button type="submit">Ok</button>
      </footer>
  </form>
  </dialog>`;

  appDialog = document.querySelector(dialogId);
  return appDialog.showModal();
}

module.exports = {
  commands: {
    reorientPath: reorientPath
  }
};