const reactShim = require('./react-shim');
const React = require('react');
const ReactDOM = require('react-dom');
const ExportForm = require('./ExportForm.jsx');
const ErrorForm = require('./ErrorForm.jsx');
const styles = require('./styles.css');

const flutterExport = selection => {
  let dialog;

  const getDialog = () => {
    if(dialog == null) {
      dialog = document.createElement("dialog");
    }
    if(selection.items.length === 0) {
      ReactDOM.render(<ErrorForm dialog={dialog} content={<p>No layer selected to export</p>}/>, dialog);
      return dialog;
    }

    if(selection.items.length > 1) {
      ReactDOM.render(<ErrorForm dialog={dialog} content={<p>You can only export 1 layer at a time</p>}/>, dialog);
      return dialog;
    }

    ReactDOM.render(<ExportForm dialog={dialog} layer={selection.items[0]}/>, dialog);

    return dialog;
  };

  return document.body.appendChild(getDialog()).showModal();
};

module.exports = {
  commands: {
    flutterExport
  }
};
