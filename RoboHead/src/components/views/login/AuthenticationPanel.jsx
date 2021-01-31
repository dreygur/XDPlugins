/**
 *
 * Copyright: Copyright (c) 2020 by AQUENT, L.L.C.
 * Company: AQUENT, L.L.C.
 * @created 08-09-2020
 */
const React = require("react");
const AccountUrlView = require("./AccountUrlView");
const LoginView = require("./LoginView");
const APIKeyView = require("./APIKeyView");
const SpinnerComp = require("../../common/Spinner");
const getLocalPreferenceData = require("../../../services/LocalStorageService")
  .getLocalPreferenceData;
const ApplicationConstants = require("../../../constants/ApplicationConstants");
const ApplicationUtil = require("../../../util/ApplicationUtil");
class AuthenticationPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accountUrl: "",
    };
  }
  /**
   * It shows UI on basis of preferences
   */
  checkSSOEnbled(value, url) {
    this.props.chnageStates(value, url);
  }

  /**
   * It shows respectives view on login successfull
   */
  loginSuccessfull() {
    if (ApplicationUtil.copyToRH) {
      ApplicationUtil.copyToRH.setState({ isAPIKeyPresent: true });
    }
    if (ApplicationUtil.CopyFromRHView) {
      ApplicationUtil.CopyFromRHView.setState({ isAPIKeyPresent: true });
    }
    if (ApplicationUtil.MyWorkListView) {
      ApplicationUtil.MyWorkListView.setState({ isAPIKeyPresent: true });
    }
    this.props.onLoginSuccess();
  }

  /**
   * To Reset to account url view
   */
  cancelView() {
    this.props.resetView();
  }

  render() {
    const {
      isAccontUrlPresent,
      showLoginView,
      showAPIKeyView,
      accountUrl,
      isPanelMinimum,
    } = this.props;
    return (
      <React.Fragment>
        <div>
          <SpinnerComp />
          {!isAccontUrlPresent && (
            <AccountUrlView
              isPanelMinimum={isPanelMinimum}
              isSSOEnabled={(value, accountUrl) =>
                this.checkSSOEnbled(value, accountUrl)
              }
            />
          )}
          {showLoginView && (
            <LoginView
              isPanelMinimum={isPanelMinimum}
              accountUrl={accountUrl}
              onCancel={(e) => this.cancelView()}
              onLoginSuccessful={(e) => this.loginSuccessfull()}
            />
          )}
          {showAPIKeyView && (
            <APIKeyView
              isPanelMinimum={isPanelMinimum}
              accountUrl={accountUrl}
              onCancel={(e) => this.cancelView()}
              onLoginSuccessful={(e) => this.loginSuccessfull()}
            />
          )}
        </div>
      </React.Fragment>
    );
  }
}

module.exports = AuthenticationPanel;
