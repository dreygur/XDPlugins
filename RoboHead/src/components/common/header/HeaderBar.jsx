/**
 *
 * Copyright: Copyright (c) 2020 by AQUENT, L.L.C.
 * Company: AQUENT, L.L.C.
 * @created 14-10-2020
 */
const React = require("react");
const Properties = require("../../../properties/Properties");
const styles = require("../../../App.css");
const ImageComponent = require("../image/ImageComponent");
class HeaderBar extends React.Component {
  render() {
    const { headerLabel, handleLogout } = this.props;
    return (
      <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
        <div style={{ width: "89%" }} className={styles.ViewLabel}>
          {headerLabel}
        </div>
        <div
          style={{
            marginLeft: "5px",
            cursor: "pointer",
          }}
          className={styles.DefaulFontColor}
          onClick={(e) => handleLogout()}
          title={Properties.Logout_label}
        >
          <ImageComponent
            styleObject={{
              width: 18,
              height: 18,
            }}
            url={"images/logout.svg"}
          />
        </div>
      </div>
    );
  }
}

module.exports = HeaderBar;
