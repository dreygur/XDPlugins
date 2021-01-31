/**
 *
 * Copyright: Copyright (c) 2020 by AQUENT, L.L.C.
 * Company: AQUENT, L.L.C.
 * @created 08-09-2020
 */
const React = require("react");
const Properties = require("../../properties/Properties");
const styles = require("../../App.css");
class FileSave extends React.Component {
  render() {
    return (
      <div style={{ marginLeft: "8px" }} className={styles.PaddingCSS}>
        <div className={styles.SaveFileMessageCSS}></div>
        <div style={{ marginLeft: "5px" }}>{this.props.message}</div>
      </div>
    );
  }
}

module.exports = FileSave;
