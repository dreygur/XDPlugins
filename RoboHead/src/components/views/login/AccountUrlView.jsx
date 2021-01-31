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
const ApplicationConstants = require("../../../constants/ApplicationConstants");
const ApplicationUtil = require("../../../util/ApplicationUtil");
const getLoginForm = require("../../../services/LoginService").getLoginForm;
const showSpinner = require("../../../util/ApplicationUtil").showSpinner;
const hideSpinner = require("../../../util/ApplicationUtil").hideSpinner;
class AccountUrlView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accountUrl: "",
      showError: false,
      errorMessage: "",
    };
  }
  /**
   * It stores account name
   */
  handleInputChange(e) {
    this.setState({ accountUrl: e.target.value, showError: false });
  }
  /**
   * It validate entered account name
   */
  handleAccountNext() {
    const { accountUrl } = this.state;
    const { isSSOEnabled } = this.props;
    if (accountUrl !== "") {
      ApplicationUtil.applicationUrl =
        accountUrl + ApplicationConstants.ACCOUNT_URL;
      showSpinner();
      getLoginForm(accountUrl)
        .then((res) => {
          if (res.enableXdPlugin == ApplicationConstants.FALSE) {
            this.setState({
              showError: true,
              errorMessage: Properties.XD_enable_error_message,
            });
          } else {
            if (res.detailedMessage && !res.success) {
              this.setState({
                showError: true,
                errorMessage: Properties.Valid_Account_name_error,
              });
            } else {
              isSSOEnabled(
                res.enableSso,
                accountUrl + ApplicationConstants.ACCOUNT_URL
              );
            }
          }
          hideSpinner();
        })
        .catch((err) => {
          this.setState({
            showError: true,
            errorMessage: Properties.Valid_account_url_error,
          });
          hideSpinner();
        });
    } else {
      this.setState({
        showError: true,
        errorMessage: Properties.Account_url_error,
      });
    }
  }

  render() {
    const { showError, errorMessage } = this.state;
    const { isPanelMinimum } = this.props;
    return (
      <React.Fragment>
        <div>
          <div className={styles.TextMarginCSS}>{Properties.Welcome_text}</div>
          <div
            style={{
              marginTop: "10px",
              color: "black",
              fontSize: "12px !important",
            }}
          >
            <span>{Properties.Enter_account_name}</span>
          </div>
          <div
            className={
              isPanelMinimum
                ? styles.AccountViewMinCss
                : styles.AccountViewMaxCss
            }
          >
            <InputFileName
              typeString="text"
              styleObject={
                isPanelMinimum
                  ? { width: "100%", marginLeft: "0px" }
                  : { width: "62%", marginLeft: "0px" }
              }
              placeholderValue={
                isPanelMinimum ? "" : Properties.Account_name_label
              }
              onInputChange={(e) => this.handleInputChange(e)}
            />

            <div
              style={isPanelMinimum ? { width: "100%" } : { width: "38%" }}
              className={styles.FontCSS}
            >
              {ApplicationConstants.ACCOUNT_URL}
            </div>
          </div>
          <button
            style={{ marginLeft: "0px" }}
            uxp-variant="cta"
            onClick={(e) => this.handleAccountNext()}
          >
            {Properties.Next_text}
          </button>
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

module.exports = AccountUrlView;
