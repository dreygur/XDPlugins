/**
 *
 * Copyright: Copyright (c) 2020 by AQUENT, L.L.C.
 * Company: AQUENT, L.L.C.
 * @created 08-09-2020
 */
const React = require("react");
class Input extends React.Component {
  render() {
    const {
      placeholderValue,
      onInputChange,
      styleObject,
      typeString,
      valueString,
    } = this.props;
    return (
      <React.Fragment>
        <input
          type={typeString}
          value={valueString}
          style={styleObject}
          placeholder={placeholderValue}
          onChange={onInputChange}
        />
      </React.Fragment>
    );
  }
}

module.exports = Input;
