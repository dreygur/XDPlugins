/**
 *
 * Copyright: Copyright (c) 2020 by AQUENT, L.L.C.
 * Company: AQUENT, L.L.C.
 * @created 08-09-2020
 */
const React = require("react");
const Properties = require("../../../properties/Properties");
const ObjectSelection = require("../../common/ObjectSelection");
const SpinnerComp = require("../../common/Spinner");
const styles = require("../../../App.css");
const ApplicationConstants = require("../../../constants/ApplicationConstants");
const CopyToProject = require("./CopyToProject");
const CopyToCampaign = require("./CopyToCampaign");
const ApplicationUtil = require("../../../util/ApplicationUtil");

class CopyToRHPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultView: ApplicationConstants.OBJECT_TYPE_PROJECT,
      list: [],
    };
  }
  componentDidMount() {
    ApplicationUtil.copyToRHPanel = this;
    this.setState({ defaultView: ApplicationConstants.OBJECT_TYPE_PROJECT });
  }
  /**
   * Change view based on dropdown selection
   */
  changeObjectView(e) {
    this.setState({ defaultView: e.target.value });
  }
  /**
   * Return view based on selection.
   */
  changeView(value) {
    const { defaultView } = this.state;
    const { isPanelMinimum, isPanelHasScroll, isPanelHeightLess } = this.props;
    switch (parseInt(value)) {
      case ApplicationConstants.OBJECT_TYPE_PROJECT:
        return (
          <CopyToProject
            defaultView={defaultView}
            isPanelMinimum={isPanelMinimum}
            isPanelHasScroll={isPanelHasScroll}
            isPanelHeightLess={isPanelHeightLess}
          />
        );
      case ApplicationConstants.OBJECT_TYPE_CAMPAIGN:
        return (
          <CopyToCampaign
            defaultView={defaultView}
            isPanelMinimum={isPanelMinimum}
            isPanelHasScroll={isPanelHasScroll}
            isPanelHeightLess={isPanelHeightLess}
          />
        );
    }
  }
  /**
   * To return label for selected view header
   * @param {*} value
   */
  getLabel(value) {
    switch (parseInt(value)) {
      case ApplicationConstants.OBJECT_TYPE_PROJECT:
        return " " + Properties.Project_header_label;
      case ApplicationConstants.OBJECT_TYPE_CAMPAIGN:
        return " " + Properties.Campaign_header_label;
    }
  }
  logout() {
    ApplicationUtil.logout();
  }
  render() {
    const { defaultView } = this.state;
    let selectedViewLabel = this.getLabel(defaultView);
    return (
      <React.Fragment>
        <SpinnerComp />
        <div className={styles.PanelMainDiv}>
          <div
            style={{ width: "95%", display: "flex", flexWrap: "wrap" }}
            className={styles.ViewLabel}
          >
            {Properties.Export_file_to_robohead_label}
            {selectedViewLabel}
          </div>
          <div
            style={{
              marginLeft: "5px",
              cursor: "pointer",
            }}
            className={styles.DefaulFontColor}
            onClick={(e) => this.logout()}
            title={Properties.Logout_label}
          >
            <img
              style={{
                width: 18,
                height: 18,
              }}
              className={styles.DefaulFontColor}
              src={"images/logout.svg"}
              alt="user-img"
            ></img>
          </div>
        </div>
        <ObjectSelection
          objectType={defaultView}
          changeObjectType={(e) => this.changeObjectView(e)}
        />
        {this.changeView(defaultView)}
      </React.Fragment>
    );
  }
}

module.exports = CopyToRHPanel;
