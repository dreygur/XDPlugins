let panel;
var newText = [];
var selectionCount = 0;
var input = "";

function create() {
  const html = `
<style>
    form {
      width:100%;
    }

    label {
        width: 100%;
    }

    label input {
      width: 100%;
    }

    label span {
      width: 100%;
    }

    #warning {
      width: 100%;
      background-color: #0DA7DC;
      padding: 12px;
      border-radius: 4px;
      color: #FFFFFF;
    }

    .show {
        display: block;
    }
    .hide {
        display: none;
    }
</style>

<form id="main">
    <div>
        <label>
            <span>Text Pattern</span>
            <input type="text" id="inputValue" value="" placeholder="Example: Item 1" />
        </label>
    </div>
    <footer><button id="apply" type="submit" uxp-variant="cta">Apply</button></footer>
</form>

<div id="warning">Select at least one Text object.</div>
`;




  panel = document.createElement("div");
  panel.innerHTML = html;
  panel.querySelector("form").addEventListener("submit", updateText);

  return panel;
}

function parseRange(value) {
  const reg = new RegExp(/(\d*)([^\d:]+)(\d*)$/);
  const rangeMatch = value.match(reg);
  const [a, b] = rangeMatch || [];
  if (a && b) {
    return rangeMatch;
  }
  return;
};

function parseNumber(value) {
  const reg2 = new RegExp(/(\d*)$/);
  const numberMatch = value.match(reg2);
  if (numberMatch && numberMatch[0] !== "") {
    return numberMatch[0];
  }
  return;
};

function createNewText() {
  console.log("### CreateNewText");
  newText = [];

  // handle case where user has entered a range
  const range = parseRange(input);
  if (range) {
    const [originalRangeStr, from, delim, to] = range;
    const prefix = ""
    const diff = to - from;
    // Loop through each element and create label
    var elementNumber = 0;
    for (var i = 0; i < selectionCount; i++) {
      var newFrom = parseInt(from) + (diff + 1) * i;
      var newTo = parseInt(to) + (diff + 1) * i;
      newText[i] = input.replace(
            originalRangeStr,
            `${newFrom}${delim}${newTo}`
      );
    }
    return;
  }

  // handle case where user input just ends in a single number
  const number = parseNumber(input);
  if (number) {
    // Loop through each element and create label
    var elementNumber = 0;
    for (var i = 0; i < selectionCount; i++) {
      var newNumber = parseInt(number) + i;
      newText[i] = input.replace(
            number,
            newNumber
      );
    }
    return;
  }

  // handle case where user input does not have a suffix
  // Loop through each element and create label
  for (var i = 0; i < selectionCount; i++) {
    var newNumber = parseInt(number) + i;
    newText[i] = input;
  }
  return;
}

function getInput() {
  input = document.querySelector("#inputValue").value;
}

function updateText() {
  console.log("### Update Text");
  const { Text } = require("scenegraph");
  getInput();
  createNewText();

  const { editDocument } = require("application");
  editDocument({ editLabel: "Update Text" }, function(selection) {
    var itemIndex = 0;
    selection.items.map(i => {
      i.text = newText[itemIndex];
      itemIndex++;
    });
  });
}

function show(event) {
  if (!panel) event.node.appendChild(create());
}

function update(selection) {
  console.log("### Update");
  const { Text } = require("scenegraph");

  const form = document.querySelector("form");
  const warning = document.querySelector("#warning");

  if (!selection || !(selection.items[0] instanceof Text)) {
    form.className = "hide";
    warning.className = "show";
  } else {
    form.className = "show";
    warning.className = "hide";
  }

  selectionCount = selection.items.length;
  console.log("selectionCount: " + selectionCount);

}





module.exports = {
  panels: {
    sequentialText: {
      show,
      update
    }
  }
};
