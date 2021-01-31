/**
 *
 * Copyright: Copyright (c) 2020 by AQUENT, L.L.C.
 * Company: AQUENT, L.L.C.
 * @created 20-10-2020
 */
const React = require("react");
const styles = require("../../../App.css");
class ImageComponent extends React.Component {
  render() {
    const { url, styleObject } = this.props;
    return (
      <img
        style={styleObject}
        className={styles.DefaulFontColor}
        src={url}
        alt="user-img"
      ></img>
    );
  }
}

module.exports = ImageComponent;
