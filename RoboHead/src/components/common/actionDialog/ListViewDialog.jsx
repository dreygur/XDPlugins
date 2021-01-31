/**
 *
 * Copyright: Copyright (c) 2020 by AQUENT, L.L.C.
 * Company: AQUENT, L.L.C.
 * @created 08-09-2020
 */
const React = require("react");
const ReactDOM = require("react-dom");
const Properties = require("../../../properties/Properties");
const Progress = require("react-progressbar").default;
const styles = require("../../../App.css");
const ActionItemRowView = require("./ActionItemRowView");
const ApplicationConstants = require("../../../constants/ApplicationConstants");
const ImageComponent = require("../image/ImageComponent");
class ListViewDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortIndex: -1,
      sortDirection: "",
      sortColumn: "",
      selectedSortItems: [],
    };
  }

  /**
   * To get preferences for sorting and settings
   */
  componentDidMount() {
    const { defaultSort, preferences, dropdownList } = this.props;
    let index;
    let column = preferences.sortColumn
      ? preferences.sortColumn
      : defaultSort.sortColumn;
    dropdownList.forEach((element, i) => {
      if (element.dataIndex == column) {
        index = i;
      }
    });
    this.setState({
      selectedSortItems: preferences.outputColumns.split(","),
      sortIndex: index,
      sortColumn: preferences.sortColumn
        ? preferences.sortColumn
        : defaultSort.sortColumn,
      sortDirection: preferences.sortDirection
        ? preferences.sortDirection
        : defaultSort.sortDirection,
    });
  }

  /**
   * This function keep record of selected index and sets sort direction
   * @param {*} i
   * @param {*} record
   */
  setIndex(e, i, record) {
    this.setState({
      sortIndex: i,
      sortDirection:
        this.state.sortIndex != i
          ? ApplicationConstants.ASC
          : this.state.sortDirection == ApplicationConstants.ASC
          ? ApplicationConstants.DESC
          : ApplicationConstants.ASC,
      sortColumn: record.dataIndex,
    });
  }

  /**
   * To store or remove sort index
   */
  handleSettingIndex(e, i, record) {
    if (record) {
      const { selectedSortItems } = this.state;
      const currentIndex = selectedSortItems.indexOf(record.dataIndex);

      let newShownColumn = [...selectedSortItems];

      if (currentIndex === -1) {
        newShownColumn.push(record.dataIndex);
      } else {
        newShownColumn.splice(currentIndex, 1);
      }
      this.setState({
        selectedSortItems: newShownColumn.filter((e) => e !== ""),
      });
    }
  }
  /**
   * To close dialog
   */
  cancel() {
    this.props.dialog.close();
  }

  /**
   * To perform action dialog submit callback
   */
  onSubmit(type) {
    const { viewObject, dialog } = this.props;
    const { sortColumn, sortDirection } = this.state;
    if (type == ApplicationConstants.SORT_OBJECT) {
      viewObject.ApplySort(sortColumn, sortDirection);
    }
    if (type == ApplicationConstants.SETTING_OBJECT) {
      viewObject.ApplySettings(this.state.selectedSortItems);
    }
    dialog.close();
  }

  render() {
    const {
      dropdownList,
      type,
      headerLabel,
      headerIcon,
      defaultSort,
      preferences,
    } = this.props;
    const { sortIndex, sortDirection } = this.state;

    return (
      <div style={{ padding: "0px" }}>
        <div style={{ overflowY: "auto" }}>
          <div>
            <div className={styles.ActionDialogCSS}>
              <div className={styles.HeaderDivCSS}>
                <div className={styles.DivMarginCss}>
                  <ImageComponent
                    url={headerIcon}
                    styleObject={{
                      width: 15,
                      height: 15,
                      cursor: "pointer",
                    }}
                  />
                </div>
                <div>{headerLabel}</div>
              </div>
              {type == ApplicationConstants.SETTING_OBJECT && (
                <div>
                  {Properties.Show_label}
                  {":"}
                </div>
              )}
              {type == ApplicationConstants.SORT_OBJECT && (
                <div style={{ marginLeft: "8px" }}>
                  <ImageComponent
                    url={"images/sort_up_down_grey.svg"}
                    styleObject={{
                      width: 15,
                      height: 15,
                      cursor: "pointer",
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          <div className={styles.ActionListViewCSS}>
            {dropdownList.map((record, i) => {
              return (
                <ActionItemRowView
                  defaultSort={defaultSort}
                  prefs={preferences}
                  key={i}
                  type={type}
                  i={i}
                  record={record}
                  sortIndex={sortIndex}
                  sortDirection={sortDirection}
                  setSortIndex={(e, i, record) => this.setIndex(e, i, record)}
                  setSettingIndex={(e, i, record) =>
                    this.handleSettingIndex(e, i, record)
                  }
                />
              );
            })}
          </div>
          <footer>
            <button uxp-variant="primary" onClick={(e) => this.cancel()}>
              {Properties.Cancel_button}
            </button>
            <button
              type="submit"
              uxp-variant="cta"
              onClick={(e) => this.onSubmit(type)}
            >
              {Properties.Apply_label}
            </button>
          </footer>
        </div>
      </div>
    );
  }
}

module.exports = ListViewDialog;
