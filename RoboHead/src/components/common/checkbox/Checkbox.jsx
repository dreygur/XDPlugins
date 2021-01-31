/**
 *
 * Copyright: Copyright (c) 2020 by AQUENT, L.L.C.
 * Company: AQUENT, L.L.C.
 * @created 13-10-2020
 */
const React = require("react");
const Properties = require("../../../properties/Properties");
const styles = require("../../../App.css");
class Checkbox extends React.Component {
  render() {
    const { labelString, isCheked, chnageEvent } = this.props;
    return (
      <div className={styles.CheckboxCSS}>
        <input
          style={{ marginLeft: "0px" }}
          type="checkbox"
          checked={isCheked}
          onChange={(e) => chnageEvent(e)}
        />
        {labelString && <span>{labelString}</span>}
      </div>
    );
  }
}

module.exports = Checkbox;
