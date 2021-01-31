const React = require('react');
const ExportLogo = require('./ExportLogo.jsx');

const ErrorForm = ({ message = 'Oops!', dialog, content }) => {
  const onClose = () => dialog.close();

  return (
    <form style={{ width: 360 }}>
      <h1 className="flex-row justify-content-between align-items-center">
        <span className="color-red">{message}</span>
        <ExportLogo/>
      </h1>
      <hr/>
      {content}
      <footer>
        <button uxp-variant="cta" onClick={onClose}>
          Close
        </button>
      </footer>
    </form>
  );
};

module.exports = ErrorForm;
