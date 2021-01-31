const React = require('react');

const LabelRadio = ({ value, format, onClick }) => (
  <label className="row">
    <input checked={format === value} type="radio" value={value} onClick={onClick} onChange={onClick}/>
    <span>{value.toUpperCase()}</span>
  </label>
);

module.exports = LabelRadio;
