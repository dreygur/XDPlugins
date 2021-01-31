const reactShim = require("./react-shim");
const React = require("react");
const ReactDOM = require("react-dom");
const App = require("./ui.jsx");

function main(selection) {
  let dialog;

  function getDialog() {
    if (dialog == null) {
      dialog = document.createElement("dialog");
      ReactDOM.render(<App dialog={dialog} selection={selection} />, dialog);
    }
    return dialog;
  }

  return document.body.appendChild(getDialog()).showModal();
}

// [7]
module.exports = {
  commands: {
    main
  }
};
