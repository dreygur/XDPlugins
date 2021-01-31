/**
 *
 * Copyright: Copyright (c) 2020 by AQUENT, L.L.C.
 * Company: AQUENT, L.L.C.
 * @created 20-10-2020
 */
const React = require("react");
const styles = require("../../../App.css");
const ApplicationConstants = require("../../../constants/ApplicationConstants");
const ImageComponent = require("../image/ImageComponent");
class ActionItemRowView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showChecked: false,
    };
  }

  componentDidMount() {
    const { prefs, record } = this.props;
    if (prefs.outputColumns.includes(record.dataIndex)) {
      this.setState({ showChecked: true });
    }
  }

  /**
   * To maintain state of cheked setting
   */
  selectSetting(e, i, record) {
    this.setState({
      showChecked: !this.state.showChecked,
    });
    this.props.setSettingIndex(e, i, record);
  }

  render() {
    const {
      i,
      record,
      type,
      setSortIndex,
      sortDirection,
      sortIndex,
    } = this.props;
    const { showChecked } = this.state;
    return (
      <React.Fragment key={i}>
        {i == 0 && <div className={styles.ActionItemBottomCSS}></div>}
        <div
          className={i == 0 ? styles.WidthDivCSS : styles.widthDivMainCSS}
          className={styles.MainActionSettingDiv}
          onClick={(e) => setSortIndex(e, i, record)}
        >
          <div
            className={
              type == ApplicationConstants.SORT_OBJECT && sortIndex == i
                ? styles.SortDivCSS
                : styles.SortDivWidthCSS
            }
          >
            {record.columnName}
          </div>
          {!showChecked && type == ApplicationConstants.SETTING_OBJECT && (
            <div onClick={(e) => this.selectSetting(e, i, record)}>
              <ImageComponent
                url={"images/checkbox.svg"}
                styleObject={{
                  height: 17,
                  width: 17,
                }}
              />
            </div>
          )}
          {showChecked && type == ApplicationConstants.SETTING_OBJECT && (
            <div onClick={(e) => this.selectSetting(e, i, record)}>
              <ImageComponent
                url={"images/checkbox_checked_blue.svg"}
                styleObject={{
                  height: 17,
                  width: 17,
                }}
              />
            </div>
          )}
          {sortIndex != i && type == ApplicationConstants.SORT_OBJECT && (
            <div onClick={(e) => this.selectSetting()}>
              <ImageComponent
                url={"images/icon_pick_sort_down_grey.svg"}
                styleObject={{
                  height: 17,
                  width: 17,
                }}
              />
            </div>
          )}
          {sortIndex == i && type == ApplicationConstants.SORT_OBJECT && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <ImageComponent
                url={
                  sortDirection == ApplicationConstants.ASC
                    ? "images/icon_pick_sort_up_blue.svg"
                    : "images/icon_pick_sort_down_blue.svg"
                }
                styleObject={{
                  height: 17,
                  width: 17,
                }}
              />
            </div>
          )}
        </div>
        <div className={styles.ActionItemBottomCSS}></div>
      </React.Fragment>
    );
  }
}

module.exports = ActionItemRowView;
