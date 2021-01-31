/**
 *
 * Copyright: Copyright (c) 2020 by AQUENT, L.L.C.
 * Company: AQUENT, L.L.C.
 * @created 08-09-2020
 */
const React = require("react");
const styles = require("../../../App.css");
const ImageComponent = require("../image/ImageComponent");
class CustomSnackbar extends React.Component {
  render() {
    const { message, view, isPanelHeightLess } = this.props;
    return (
      <div
        className={
          view == "success"
            ? isPanelHeightLess
              ? styles.snackbar
              : styles.snackbarSuccess
            : isPanelHeightLess
            ? styles.snackbarErrorLess
            : styles.snackbarError
        }
      >
        <div className={styles.snackbarIconCss}>
          <ImageComponent
            url={
              view == "success"
                ? "images/icon_success_green.svg"
                : "images/icon_error_red.svg"
            }
            styleObject={{ height: 17, width: 17 }}
          />
        </div>
        <div className={styles.MainSnackbarCss}>{message}</div>
      </div>
    );
  }
}

module.exports = CustomSnackbar;
