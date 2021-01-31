const React = require('react');
const {exportAsset, formatOptions} = require('./exportAsset');
const LabelRadio = require('./LabelRadio.jsx');
const ExportLogo = require('./ExportLogo.jsx');

const ExportForm = ({ layer, dialog }) => {
  const [fileName, setFileName] = React.useState(layer.name);
  const [fileFormat, setFileFormat] = React.useState('png');

  const onNameChange = e => setFileName(e.target.value);

  const onFormatChange = e => setFileFormat(e.target.value);

  const isInvalidName = fileName => fileName.match(/[^/\sa-z0-9_-]/gi);

  const exporting = async () => await exportAsset(layer, {fileName, fileFormat});

  const onFinish = e => {
    e.preventDefault();
    exporting();
    dialog.close();
  };

  const onCancel = e => {
    e.preventDefault();
    dialog.close();
  };

  return (
    <form style={{ width: 250 }}>
      <div className="flex-row justify-content-between align-items-center">
        <h1>Flutter Export</h1>
        <ExportLogo/>
      </div>
      <hr className="margin-1-b"/>

      <label className="flex-column margin-half">
        <span className="align-self-start">File name</span>
        <input className="w-100" value={fileName} onChange={onNameChange}/>
      </label>

      <div className="flex-row justify-content-between align-items-center margin-half">
        {Object.keys(formatOptions).map(value => <LabelRadio key={value} value={value} format={fileFormat} onClick={onFormatChange}/>)}
      </div>

      <div className="flex-row justify-content-between">
        <button uxp-variant="primary" onClick={onCancel}>
          Cancel
        </button>
        <button disabled={isInvalidName(fileName)} uxp-variant="cta" onClick={onFinish}>
          Select folder
        </button>
      </div>
    </form>
  );
};

module.exports = ExportForm;
