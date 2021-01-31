/**
 *
 * Copyright: Copyright (c) 2020 by AQUENT, L.L.C.
 * Company: AQUENT, L.L.C.
 * @created 08-09-2020
 */
const React = require("react");
const InputFileName = require("../../common/InputFileName");
const styles = require("./Login.css");
const Properties = require("../../../properties/Properties");
const { getHomeBean } = require("../../../services/LoginService");
const ApplicationUtil = require("../../../util/ApplicationUtil");
const { hideSpinner, showSpinner } = require("../../../util/ApplicationUtil");
const {
  setLocalUserViewPreferenceData,
} = require("../../../services/LocalStorageService");
const setLocalPreferenceData = require("../../../services/LocalStorageService")
  .setLocalPreferenceData;
class APIKeyView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      apiKey: "",
      showError: false,
      errorMessage: "",
    };
  }
  /**
   * It stores entered APi key
   */
  handleAPIKeyInputChange(e) {
    this.setState({ apiKey: e.target.value, showError: false });
  }
  /**
   * It validate api key entred or not and redirects to View
   */
  handleLogIn() {
    const { apiKey } = this.state;
    const { accountUrl, onLoginSuccessful } = this.props;
    if (apiKey == "") {
      this.setState({
        showError: true,
        errorMessage: Properties.Api_key_error,
      });
    } else {
      ApplicationUtil.userToken = apiKey;
      showSpinner();
      getHomeBean(apiKey)
        .then((res) => {
          hideSpinner();
          setLocalUserViewPreferenceData(res);
          ApplicationUtil.homeBeanData = res;
          let prefernceData = {};
          prefernceData.accountUrl = accountUrl;
          prefernceData.userApiToken = apiKey;
          setLocalPreferenceData(prefernceData);
          onLoginSuccessful();
        })
        .catch((err) => {
          this.setState({
            showError: true,
            errorMessage: Properties.Api_valid_key_error,
          });
          hideSpinner();
        });
    }
  }

  /**
   * Redirect user to Account URL screen
   */
  handleCancel() {
    this.props.onCancel();
  }

  render() {
    const { showError, errorMessage } = this.state;
    const { isPanelMinimum } = this.props;
    return (
      <React.Fragment>
        <div>
          <div className={styles.TextMarginCSS}>{Properties.Welcome_text}</div>
          <div>
            <InputFileName
              typeString="text"
              styleObject={{ width: "100%", marginLeft: "0px" }}
              placeholderValue={
                isPanelMinimum ? Properties.API_key_label : Properties.Key_label
              }
              onInputChange={(e) => this.handleAPIKeyInputChange(e)}
            />
          </div>

          <div
            style={isPanelMinimum ? {} : { display: "flex", flexWrap: "wrap" }}
          >
            <div>
              <button
                style={
                  isPanelMinimum
                    ? { width: "100%", marginLeft: "0px" }
                    : { marginLeft: "0px" }
                }
                uxp-variant="secondary"
                onClick={(e) => this.handleCancel()}
              >
                {Properties.Cancel_button}
              </button>
            </div>
            <div>
              <button
                style={
                  isPanelMinimum ? { marginLeft: "0px", width: "100%" } : {}
                }
                uxp-variant="cta"
                onClick={(e) => this.handleLogIn()}
              >
                {Properties.Log_in_label}
              </button>
            </div>
          </div>
          {showError && (
            <div className={styles.ErrorTextMargin}>
              <span className={styles.ErrorCss}>{errorMessage}</span>
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

module.exports = APIKeyView;
