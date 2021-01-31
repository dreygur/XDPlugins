const clipboard = require("clipboard");
const { alert, error } = require("./lib/dialogs.js");
const { editDocument } = require("application");
async function selectTextElement(selection) {
  let selectedItems = selection.items;
  let elements = [];
  let getTextElements = (element) => {
    if(element.length === undefined) {
      let i = 0;
      while(i < element.children.length) {
        if (element.children.at(i).constructor.name === 'Group' || element.children.at(i).constructor.name === 'Text') {
          if(element.children.at(i).constructor.name === 'Group') {
            let ii = 0;
            while(ii < element.children.at(i).children.length) {
              if(element.children.at(i).children.at(ii).constructor.name === 'Text'){
                elements.push(element.children.at(i).children.at(ii));
              } else if (element.children.at(i).children.at(ii).constructor.name === 'Group') {
                let groupInGroup = element.children.at(i).children.at(ii);
                elements.push(getTextElements(groupInGroup));
              }
              ii=(ii+1)|0;
            }

          } else {
            elements.push(element.children.at(i));
          }
        }
        i=(i+1)|0;
      }
    }
    if(element.length !== undefined) {
      let i = 0;
      while(i < element.length) {
        if (element[i].constructor.name === 'Group' || element[i].constructor.name === 'Text') {
          if(element[i].constructor.name === 'Group') {
            let ii = 0;
            while(ii < element[i].children.length) {
              if(element[i].children.at(ii).constructor.name === 'Text'){
                elements.push(element[i].children.at(ii));
              } else if (element[i].children.at(ii).constructor.name === 'Group') {
                let groupInGroup = element[i].children.at(ii);
                elements.push(getTextElements(groupInGroup));
              }
              ii=(ii+1)|0;
            }
          } else {
            elements.push(element[i]);
          }
        }
        i=(i+1)|0;
      }
    }
    return elements;
  }
  elements.push(getTextElements(selectedItems));
  return elements;
}
let textLength;
async function clipText(selection, option) {
  selectTextElement(selection).then(elements => {
    let progressElement = document.getElementById('progressBar');
    let textContext = [];
    let progressMax = String(elements.length);
    let i = 0;
    while(i<elements.length) {
      elements[i].text !== undefined ? textContext.push(elements[i].text) : false;
      i=(i+1)|0;
      progressElement.style.width = String((i / progressMax) * 100) + "%";
    }
    if(option) {
      clipboard.copyText(String(textContext.join('\n\n')));
    } else {
      clipboard.copyText(String(textContext.join("")));
    }
    textLength = String(textContext.join("")).length;
    return option;
  });
  return option;
}
function getDialog() {
    let dialog = document.createElement("dialog");
    dialog.id = 'dialog';
    dialog.innerHTML = `
    <style>
        #dialog form {
            width: 400px;
        }
        h1 {
          position: relative;
        }
        h1 img {
          position: absolute;
          top: 0;
          right: 0;
        }
        .checkbox-container {
          position: relative;
          vertical-align: top;
          width: 100%;
          height: 45px;
        }
        .checkbox-title {
          position: absolute;
          left: 15px;
          top: 7px;
          color: #000;
          transition: 1s;
        }
        .checkbox-input {
          position: absolute;
          left: 0;
          top: 5px;
          transition: 1s;
        }
        .progress-container {
          background-color: #ccc;
          height: 10px;
          border-radius: 5px;
          overflow: hidden;
          margin-bottom: 10px;
        }
        .progress-bar {
          background-color: #2d95ef;
          width: 0%;
          height: 10px;
          transition: .8s;
        }
    </style>
        <form method="dialog" id="form">
            <h1>Clip Text<img style="width: 24px; height: auto;" src="./images/icon@1x.png"/></h1>
            <hr />
            <label class="checkbox-container">
                <input class="checkbox-input" type="checkbox" id="break" placeholder="size"/><h2 id="checkboxTitle" class="checkbox-title"></h2>
            </label>
            <h3 class="progress-title" id="textLength">Waiting...</h3>
            <div id="progressContainer" class="progress-container">
              <div class="progress-bar" id="progressBar" value="0"></div>
            </div>
            <footer>
                <button id="cancel">Cancel</button>
                <button type="submit" id="ok" uxp-variant="cta">Apply</button>
            </footer>
        </form>
    `;
    return dialog;
}


function createDialog(selection) {
    document.body.appendChild(getDialog());
    let dialog = document.querySelector('#dialog');
    let progressElement = document.getElementById('progressBar');
    let cancelBtn = document.getElementById("cancel");
    let submitBtn = document.getElementById("ok");
    let checkBox = document.getElementById("break");
    let checkboxTitle = document.getElementById("checkboxTitle");
    let lengthDisplay = document.getElementById("textLength");
    progressElement.style.width = "0%"
    cancelBtn.style.display = "inline-block";
    submitBtn.innerHTML = 'Apply';
    checkBox.checked = false;
    checkBox.style.display = "inline-block";
    checkboxTitle.innerHTML = "Add a line break for each text widget?";
    checkboxTitle.style.left = "15px";
    lengthDisplay.innerHTML = "Waiting...";
    const submit = async () => {
        await clipText(selection, checkBox.checked).then(value => {
          cancelBtn.style.display = "none";
          checkBox.style.display = "none";
          checkboxTitle.innerHTML = value === false ? "Line break did not added." : "Line break added."
          checkboxTitle.style.left = "0px";
          lengthDisplay.innerHTML = String(textLength) + " character copy complete";
          if(progressElement.style.width === "100%") {
            submitBtn.innerHTML = 'FINISH';
            setTimeout(function() {
              dialog.close('ok');
            }, 1200);
          }
        });
    };
    document.querySelector('#cancel').addEventListener('click', (e) => {
        dialog.close('cancel');
    });
    document.querySelector('#ok').addEventListener('click', async (e) => {
        await submit();
    });
    document.querySelector('#form').onsubmit = async (e) => {
        e.preventDefault();
    };
    return dialog;
}
async function main(selection, documentRoot) {
  let condition = false;
  await selectTextElement(selection).then(elements => {
    let textContext = [];
    let i = 0;
    while(i<elements.length) {
      elements[i].text !== undefined ? textContext.push(elements[i].text) : false;
      i=(i+1)|0;
    }
    if(textContext.length === 0) {
      alert("Clip text is unsuccessful.", "No text in selected object.");
      return false;
    } else {
      condition = true;
    }
  });
  if(condition) {
    const r = await createDialog(selection).showModal();
    if (r === 'reasonCanceled') {
        console.log('ESC dismissed dialog');
    }
  }
}
module.exports = {
  commands: {
    ClipText: main
  }
};
