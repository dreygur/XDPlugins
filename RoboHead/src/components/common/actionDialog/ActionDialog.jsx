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
class ActionDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortIndex: -1,
      sortDirection: "",
      sortColumn: "",
      selectedSortItems: [],
    };
  }

  componentDidMount() {}

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
    const { selectedSortItems } = this.state;
    const currentIndex = selectedSortItems.indexOf(record.dataIndex);

    let newShownColumn = [...selectedSortItems];

    if (currentIndex === -1) {
      newShownColumn.push(record.dataIndex);
    } else {
      newShownColumn.splice(currentIndex, 1);
    }
    this.setState(
      {
        selectedSortItems: newShownColumn.filter((e) => e !== ""),
      },
      () => {
        console.log(this.state.selectedSortItems);
      }
    );
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
    const { handleSortApply, dialog } = this.props;
    if (type == ApplicationConstants.SORT_OBJECT) {
      handleSortApply();
    }
    if (type == ApplicationConstants.SETTING_OBJECT) {
      handleSettingApply();
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
    } = this.props;
    const { sortIndex, sortDirection } = this.state;

    return (
      <div style={{ padding: "0px" }}>
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
          </div>
        </div>
        <div className={styles.ActionListViewCSS}>
          {dropdownList.map((record, i) => {
            return (
              <ActionItemRowView
                defaultSort={defaultSort}
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
    );
  }
}

module.exports = ActionDialog;
