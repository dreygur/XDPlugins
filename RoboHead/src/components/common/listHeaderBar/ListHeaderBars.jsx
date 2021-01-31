/**
 *
 * Copyright: Copyright (c) 2020 by AQUENT, L.L.C.
 * Company: AQUENT, L.L.C.
 * @created 14-10-2020
 */
const React = require("react");
const styles = require("../../../App.css");
const ApplicationConstants = require("../../../constants/ApplicationConstants");
const Properties = require("../../../properties/Properties");
const ApplicationUtil = require("../../../util/ApplicationUtil");
const ImageComponent = require("../image/ImageComponent");
class ListHeaderBars extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showExpand: false,
      ourDialog: "",
    };
  }

  /**
   * handles show popup callback
   * @param {*} type
   */
  showPopup(type) {
    this.props.ShowDialog(type);
  }

  /**
   * To handle expand/collapse
   */
  chnageState() {
    this.setState({ showExpand: !this.state.showExpand });
    if (ApplicationUtil.MyWorkListView)
      ApplicationUtil.MyWorkListView.handleExpand(!this.state.showExpand);
  }

  render() {
    const {
      onRefresh,
      direction,
      selectedSortLabel,
      isPanelMinimum,
    } = this.props;
    let CommonImageCSS = {
      width: 15,
      height: 15,
      cursor: "pointer",
    };
    return (
      <div>
        {isPanelMinimum && (
          <div className={styles.NewHeaderFontCSS}>
            {Properties.All_open_worklabel}
          </div>
        )}
        {!isPanelMinimum && (
          <div className={styles.ListHeaderDivCSS}>
            <div className={styles.ListDivCSS}>
              <div
                onClick={(e) => this.chnageState()}
                title={
                  !this.state.showExpand
                    ? Properties.Expand_label
                    : Properties.Collapse_label
                }
              >
                <ImageComponent
                  url={
                    !this.state.showExpand
                      ? "images/button_expand_section.svg"
                      : "images/button_collapse_section.svg"
                  }
                  styleObject={CommonImageCSS}
                />
              </div>
              {!isPanelMinimum && (
                <div className={styles.HeaderFontCSS}>
                  {Properties.All_open_worklabel}
                </div>
              )}
            </div>
            <div style={{ display: "flex" }}>
              {/* <div title={Properties.Filter_by_label}>
              <ImageComponent
                url={"images/icon_filterby_small.svg"}
                styleObject={CommonImageCSS}
              />
            </div> */}
              <div
                onClick={(e) => onRefresh()}
                className={styles.PaddingActionItemCSS}
                title={Properties.Refresh_label}
              >
                <ImageComponent
                  url={"images/icon_refresh_blue.svg"}
                  styleObject={CommonImageCSS}
                />
              </div>
              <div
                title={Properties.Setting_label}
                onClick={(e) =>
                  this.showPopup(ApplicationConstants.SETTING_OBJECT)
                }
              >
                <ImageComponent
                  url={"images/icon_settings_small.svg"}
                  styleObject={CommonImageCSS}
                />
              </div>
            </div>
          </div>
        )}
        {isPanelMinimum && (
          <div
            style={{ justifyContent: "space-between" }}
            className={styles.ListHeaderDivCSS}
          >
            <div className={styles.NewListDivCSS}>
              <div
                onClick={(e) => this.chnageState()}
                title={
                  !this.state.showExpand
                    ? Properties.Expand_label
                    : Properties.Collapse_label
                }
              >
                <ImageComponent
                  url={
                    !this.state.showExpand
                      ? "images/button_expand_section.svg"
                      : "images/button_collapse_section.svg"
                  }
                  styleObject={CommonImageCSS}
                />
              </div>
            </div>

            <div
              onClick={(e) => onRefresh()}
              className={styles.PaddingActionItemCSS}
              title={Properties.Refresh_label}
            >
              <ImageComponent
                url={"images/icon_refresh_blue.svg"}
                styleObject={CommonImageCSS}
              />
            </div>
            <div
              title={Properties.Setting_label}
              onClick={(e) =>
                this.showPopup(ApplicationConstants.SETTING_OBJECT)
              }
            >
              <ImageComponent
                url={"images/icon_settings_small.svg"}
                styleObject={CommonImageCSS}
              />
            </div>
          </div>
        )}
        <div className={styles.DividerActionItemCSS}></div>
        <div style={{ display: "flex", cursor: "pointer" }}>
          <div
            style={{ display: "flex" }}
            onClick={(e) => this.showPopup(ApplicationConstants.SORT_OBJECT)}
          >
            <div>
              <ImageComponent
                url={"images/icon_sort_black.svg"}
                styleObject={CommonImageCSS}
              />
            </div>
            <div className={styles.HeaderFontCSS}>
              {selectedSortLabel
                ? selectedSortLabel.columnName
                : Properties.Sort_by_label}
            </div>
            <div style={{ marginLeft: "3px" }}>
              <ImageComponent
                url={
                  direction === ApplicationConstants.ASC
                    ? "images/icon_sort_arrow_up_grey.svg"
                    : "images/icon_sort_arrow_down_grey.svg"
                }
                styleObject={{
                  width: 12,
                  height: 12,
                }}
              />
            </div>
          </div>
        </div>
        <div className={styles.ActionItemTopCSS}></div>
      </div>
    );
  }
}

module.exports = ListHeaderBars;
