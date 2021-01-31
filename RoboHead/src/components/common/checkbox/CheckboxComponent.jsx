/**
 *
 * Copyright: Copyright (c) 2020 by AQUENT, L.L.C.
 * Company: AQUENT, L.L.C.
 * @created 13-10-2020
 */
const React = require("react");
const Properties = require("../../../properties/Properties");
const styles = require("../../../App.css");
const ImageComponent = require("../image/ImageComponent");
class CheckboxComponent extends React.Component {
  render() {
    const { labelString, isCheked, chnageEvent } = this.props;
    return (
      <div className={styles.CheckboxCSS}>
        <div onClick={(e) => chnageEvent(e)}>
          <ImageComponent
            url={
              isCheked
                ? "images/checkbox_checked_Grey.svg"
                : "images/checkbox.svg"
            }
            styleObject={{
              height: 17,
              width: 17,
            }}
          />
        </div>
        {labelString && (
          <span style={{ fontSize: "12px !important", marginLeft: "3px" }}>
            {labelString}
          </span>
        )}
      </div>
    );
  }
}

module.exports = CheckboxComponent;
