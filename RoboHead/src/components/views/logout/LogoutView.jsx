/**
 *
 * Copyright: Copyright (c) 2020 by AQUENT, L.L.C.
 * Company: AQUENT, L.L.C.
 * @created 08-09-2020
 */
const React = require("react");
const styles = require("../../../App.css");
const Properties = require("../../../properties/Properties");
const ApplicationUtil = require("../../../util/ApplicationUtil");
const deletePrefences = require("../../../services/LocalStorageService")
  .deletePrefences;
class LogoutView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  /**
   * It logout user as soon as it loads this screen.
   */
  componentDidMount() {
    deletePrefences();

    let copyToRHObject = ApplicationUtil.copyToRH;
    if (copyToRHObject) {
      copyToRHObject.setState({
        isAPIKeyPresent: false,
        isAccontUrlPresent: false,
        showLoginView: false,
        showAPIKeyView: false,
      });
      copyToRHObject.logout();
    }
    // let copyFromRHObject = ApplicationUtil.CopyFromRHView;
    // if (copyFromRHObject) {
    //   copyFromRHObject.logout();
    // }
  }

  render() {
    return (
      <panel style={{ color: "#666666" }} className={styles.panel}>
        <div>{Properties.Logout_message}</div>
      </panel>
    );
  }
}

module.exports = LogoutView;
