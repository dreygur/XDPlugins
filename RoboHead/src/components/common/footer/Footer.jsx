/**
 *
 * Copyright: Copyright (c) 2020 by AQUENT, L.L.C.
 * Company: AQUENT, L.L.C.
 * @created 30-09-2020
 */
const React = require("react");
const Properties = require("../../../properties/Properties");
const styles = require("../../../App.css");
const { shell } = require("uxp");
const Http = require("../../../services/HttpService");
const ApplicationConstants = require("../../../constants/ApplicationConstants");
class Footer extends React.Component {
  /**
   * To open user account URL
   */
  getMyAccount() {
    let URL = Http.API_URL();
    shell.openExternal(URL);
  }
  /**
   * To open Help URL in browser
   */
  getHelp() {
    shell.openExternal(ApplicationConstants.HELP_URL);
  }

  /**
   * To send uer feedback to RH
   */
  sendFeedback() {
    shell.openExternal(ApplicationConstants.FEEDBACK_URL);
  }
  render() {
    const { showAccountOption, isPanelHeightLess, showPadding } = this.props;
    let marginCSS = { marginLeft: "5px" };
    return (
      <div
        style={showPadding ? {} : { marginTop: "-8px" }}
        className={styles.FooterMainDiv}
      >
        {isPanelHeightLess && (
          <div style={{ display: "flex", justifyContent: "space-evenly" }}>
            {showAccountOption && (
              <div
                title={Properties.Label_go_to_robohead_account}
                className={styles.footerCss}
                onClick={(e) => this.getMyAccount()}
              >
                <img
                  className={styles.footerImageCss}
                  src={"images/Icon_GoToRHAccount.svg"}
                  alt="user-img"
                ></img>
              </div>
            )}
            <div
              title={Properties.Label_get_help}
              className={styles.footerCss}
              onClick={(e) => this.getHelp()}
            >
              <img
                className={styles.footerImageCss}
                src={"images/Icon_GetHelp_new.svg"}
                alt="user-img"
              ></img>
            </div>
            <div
              title={Properties.Label_send_feedback}
              className={styles.footerCss}
              onClick={(e) => this.sendFeedback()}
            >
              <img
                className={styles.footerImageCss}
                src={"images/Icon_SubmitEnhancementSuggestion.svg"}
                alt="user-img"
              ></img>
            </div>
          </div>
        )}
        {!isPanelHeightLess && (
          <div>
            {showAccountOption && (
              <div
                className={styles.footerCss}
                onClick={(e) => this.getMyAccount()}
              >
                <img
                  className={styles.footerImageCss}
                  src={"images/Icon_GoToRHAccount.svg"}
                  alt="user-img"
                ></img>
                <span style={marginCSS}>
                  {Properties.Label_go_to_robohead_account}
                </span>
              </div>
            )}
            <div className={styles.footerCss} onClick={(e) => this.getHelp()}>
              <img
                className={styles.footerImageCss}
                src={"images/Icon_GetHelp_new.svg"}
                alt="user-img"
              ></img>
              <span style={marginCSS}>{Properties.Label_get_help}</span>
            </div>
            <div
              className={styles.footerCss}
              onClick={(e) => this.sendFeedback()}
            >
              <img
                className={styles.footerImageCss}
                src={"images/Icon_SubmitEnhancementSuggestion.svg"}
                alt="user-img"
              ></img>
              <span style={marginCSS}>{Properties.Label_send_feedback}</span>
            </div>
          </div>
        )}
      </div>
    );
  }
}

module.exports = Footer;
