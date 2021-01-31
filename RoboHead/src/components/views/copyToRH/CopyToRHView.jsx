/**
 *
 * Copyright: Copyright (c) 2020 by AQUENT, L.L.C.
 * Company: AQUENT, L.L.C.
 * @created 08-09-2020
 */
const React = require("react");
const SpinnerComp = require("../../common/Spinner");
const styles = require("./CopyToRH.css");
const AuthenticationPanel = require("../login/AuthenticationPanel");
const ApplicationUtil = require("../../../util/ApplicationUtil");
const CopyToRHPanel = require("./CopyToRHPanel");
const ApplicationConstants = require("../../../constants/ApplicationConstants");
const { Fragment } = require("react");
const Properties = require("../../../properties/Properties");
const FileSave = require("../../common/FileSave");
const Footer = require("../../common/footer/footer");
const getLocalPreferenceData = require("../../../services/LocalStorageService")
  .getLocalPreferenceData;
class CopyToRHView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAPIKeyPresent: false,
      isAccontUrlPresent: false,
      showLoginView: false,
      showAPIKeyView: false,
      showMessage: false,
      isPanelMinimum: false,
    };
  }

  /**
   * To check account name or User API token is present or not.
   */

  componentDidMount() {
    ApplicationUtil.copyToRH = this;
    getLocalPreferenceData().then((data) => this.setPreferences(data));
    this.checkPanelResize();
  }

  /**
   * Event Listner to check panel width on resize
   * @param {*} value
   * @param {*} url
   */
  checkPanelResize() {
    let panelElement = document.getElementById(
      ApplicationConstants.COPY_TO_RH_PANEL_ID
    );
    let me = this;
    panelElement.addEventListener("resize", function () {
      if (panelElement.offsetWidth < 160) {
        me.setState({ isPanelMinimum: true });
      } else {
        me.setState({ isPanelMinimum: false });
      }
    });
  }

  /**
   * Remove added events
   */
  componentWillUnmount() {
    let panelElement = document.getElementById(
      ApplicationConstants.COPY_TO_RH_PANEL_ID
    );
    if (panelElement) {
      panelElement.removeEventListener("resize", function () {});
    }
  }

  /**
   * To chnage user state
   * @param {*} value
   * @param {*} url
   */
  ChnageState(value, url) {
    this.setState({
      isAccontUrlPresent: true,
      accountUrl: url,
      showAPIKeyView: value == ApplicationConstants.FALSE ? false : true,
      showLoginView: value == ApplicationConstants.FALSE ? true : false,
    });
  }

  setPreferences(preferenceData) {
    if (preferenceData.accountUrl) {
      ApplicationUtil.applicationUrl = preferenceData.accountUrl;

      this.setState({ isAccontUrlPresent: true });
    }
    if (preferenceData.apiKey) {
      ApplicationUtil.userToken = preferenceData.apiKey;
    }
    if (preferenceData.apiKey) {
      this.setState({ isAPIKeyPresent: true });
    }
  }
  /**
   * To chane login view to Copy to RH view
   */
  changeView() {
    this.setState({ isAPIKeyPresent: true });
    if (ApplicationUtil.MyWorkPanel) {
      ApplicationUtil.MyWorkPanel.changeView();
    }
  }
  /**
   * To logout the user
   */
  logout() {
    let me = this;
    ApplicationUtil.applicationUrl = "";
    me.setState({
      isAPIKeyPresent: false,
      isAccontUrlPresent: false,
      showLoginView: false,
      showAPIKeyView: false,
      showMessage: true,
    });
    /**
     * To hide message automatically
     */
    setTimeout(function () {
      me.setState({ showMessage: false });
    }, 5000);
  }

  /**
   * Reset View on cancel
   */
  resetView() {
    this.setState({
      isAccontUrlPresent: false,
      showLoginView: false,
      showAPIKeyView: false,
    });
  }

  getView() {
    const {
      isAccontUrlPresent,
      showLoginView,
      showAPIKeyView,
      accountUrl,
      isPanelMinimum,
    } = this.state;
    return (
      <AuthenticationPanel
        isPanelMinimum={isPanelMinimum}
        isAccontUrlPresent={isAccontUrlPresent}
        showLoginView={showLoginView}
        accountUrl={accountUrl}
        showAPIKeyView={showAPIKeyView}
        onLoginSuccess={(e) => this.changeView()}
        chnageStates={(val, url) => this.ChnageState(val, url)}
        resetView={(e) => this.resetView()}
      />
    );
  }

  render() {
    const { isAPIKeyPresent, showMessage, isPanelMinimum } = this.state;
    return (
      <panel
        style={{
          color: "#666666",
        }}
        className={styles.panel}
      >
        <div id={ApplicationConstants.COPY_TO_RH_PANEL_ID}>
          <div className={styles.MainPanelDiv}>
            <SpinnerComp />
            <div>
              {!isAPIKeyPresent && this.getView()}
              {isAPIKeyPresent && (
                <CopyToRHPanel isPanelMinimum={isPanelMinimum} />
              )}
              {showMessage && <FileSave message={Properties.Logout_message} />}
            </div>
            <Footer
              showAccountOption={
                ApplicationUtil.applicationUrl == "" ? false : true
              }
            />
          </div>
          <div className={styles.MainPanelDivHeight}>
            <SpinnerComp />
            <div
              style={{
                height: "calc(100vh - 170px)",
                overflow: "auto",
              }}
            >
              {!isAPIKeyPresent && this.getView()}
              {isAPIKeyPresent && (
                <CopyToRHPanel isPanelMinimum={isPanelMinimum} />
              )}
              {showMessage && <FileSave message={Properties.Logout_message} />}
            </div>
            <Footer
              showAccountOption={
                ApplicationUtil.applicationUrl == "" ? false : true
              }
            />
          </div>
        </div>
      </panel>
    );
  }
}

module.exports = CopyToRHView;
