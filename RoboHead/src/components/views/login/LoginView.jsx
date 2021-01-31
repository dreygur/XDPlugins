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
const { validateEmail } = require("../../../util/Validator");
const ApplicationUtil = require("../../../util/ApplicationUtil");
const ApplicationConstants = require("../../../constants/ApplicationConstants");
const { getHomeBean } = require("../../../services/LoginService");
const {
  setLocalUserViewPreferenceData,
} = require("../../../services/LocalStorageService");
const setLocalPreferenceData = require("../../../services/LocalStorageService")
  .setLocalPreferenceData;
const validateUser = require("../../../services/LoginService").validateUser;
const showSpinner = require("../../../util/ApplicationUtil").showSpinner;
const hideSpinner = require("../../../util/ApplicationUtil").hideSpinner;
class LoginView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      showError: false,
      errorMessage: "",
    };
  }
  /**
   * It stores email also validate email on change
   */
  handleEmailInputChange(e) {
    this.setState({ email: e.target.value, showError: false });
  }
  /**
   * It stores password
   */
  handlePasswordInputChange(e) {
    this.setState({ password: e.target.value });
  }

  getErrorMessage(res) {
    let message = res.errorMessages[0]
      ? res.errorMessages[0].detailedMessage ==
        ApplicationConstants.BAD_CREDENTAILS_ERROR
        ? Properties.Bad_credentails_message
        : res.errorMessages[0].detailedMessage
      : Properties.User_not_found_error;
    return message;
  }

  /**
   * It validated entred credentails on login click.
   */
  handleLogIn() {
    const { email, password } = this.state;
    const { accountUrl, onLoginSuccessful } = this.props;
    let isValidEmail = validateEmail(email);
    if (email == "" || !isValidEmail) {
      this.setState({
        showError: true,
        errorMessage: Properties.Valid_email_address_error,
      });
    } else if (password == "") {
      this.setState({
        showError: true,
        errorMessage: Properties.Password_error,
      });
    } else {
      showSpinner();
      let requestParams = {};
      requestParams.emailId = email;
      requestParams.password = password;
      requestParams.accountUrl = accountUrl;
      validateUser(requestParams)
        .then((res) => {
          if (!res.success) {
            this.setState({
              showError: true,
              errorMessage: this.getErrorMessage(res),
            });
          } else {
            let prefernceData = {};
            prefernceData.accountUrl = accountUrl;
            prefernceData.email = email;
            prefernceData.password = password;
            prefernceData.userApiToken = res.customParams.userApiToken;
            ApplicationUtil.userToken = res.customParams.userApiToken;
            ApplicationUtil.applicationUrl = accountUrl;

            showSpinner();
            getHomeBean(res.customParams.userApiToken)
              .then((homeBean) => {
                hideSpinner();
                setLocalUserViewPreferenceData(homeBean);
                ApplicationUtil.homeBeanData = homeBean;
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
          hideSpinner();
        })
        .catch((err) => {
          hideSpinner();
        });
    }
  }

  /**
   * To get homeBeandata on login successfull
   */
  getHomebeanData(apiKey) {
    showSpinner();
    getHomeBean(apiKey)
      .then((res) => {
        hideSpinner();
        setLocalUserViewPreferenceData(res);
        ApplicationUtil.homeBeanData = res;
      })
      .catch((err) => {
        hideSpinner();
      });
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
    let inputCSS = { width: "100%", marginLeft: "0px" };
    return (
      <React.Fragment>
        <div>
          <div className={styles.TextMarginCSS}>{Properties.Welcome_text}</div>
          <div>
            <InputFileName
              typeString="text"
              styleObject={inputCSS}
              placeholderValue={
                isPanelMinimum
                  ? Properties.Email_label
                  : Properties.Email_address_label
              }
              onInputChange={(e) => this.handleEmailInputChange(e)}
            />
          </div>
          <div>
            <InputFileName
              typeString="password"
              styleObject={inputCSS}
              placeholderValue={
                isPanelMinimum
                  ? Properties.Password_text_label
                  : Properties.Password_label
              }
              onInputChange={(e) => this.handlePasswordInputChange(e)}
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

module.exports = LoginView;
