/**
 *
 * Copyright: Copyright (c) 2020 by AQUENT, L.L.C.
 * Company: AQUENT, L.L.C.
 * @created 15-10-2020
 */
const React = require("react");
const Properties = require("../../../properties/Properties");
const ApplicationUtil = require("../../../util/ApplicationUtil");
const Dropdown = require("../dropdown/Dropdown");
const ImageComponent = require("../image/ImageComponent");
class TodoRowView extends React.Component {
  /**
   * To handle props callback of checkbox event
   * @param {*} record
   */
  HandleCheckboxEvent(record) {
    this.props.completeToDO(record);
  }

  /**
   * To show/hide div label view on basis of output columns
   *
   */
  getLabelValueView(label, name, isLink, column) {
    const { outputColumns } = this.props;
    if (column != undefined) {
      if (outputColumns.includes(column))
        return this.getView(label, name, isLink);
    } else {
      return this.getView(label, name, isLink);
    }
  }

  getView(label, name, isLink) {
    const { isPanelMinimum } = this.props;
    return (
      <div
        style={
          isPanelMinimum
            ? {
                width: "100%",
                display: "flex",
                flexDirection: "column",
                flexWrap: "wrap",
              }
            : {
                width: "100%",
                display: "flex",
              }
        }
      >
        <div style={{ fontWeight: "bold" }}>
          {label}
          {": "}
        </div>
        <div
          style={
            isLink
              ? isPanelMinimum
                ? {
                    marginLeft: "1px",
                    cursor: "pointer",
                    color: "#296DFA",
                    width: "100%",
                  }
                : {
                    marginLeft: "1px",
                    cursor: "pointer",
                    color: "#296DFA",
                  }
              : isPanelMinimum
              ? {
                  marginLeft: "1px",
                  width: "100%",
                }
              : { marginLeft: "1px" }
          }
        >
          {name}
        </div>
      </div>
    );
  }

  /**
   * To apply selection action
   */
  handleAction(rec) {
    this.props.handleToDoActions(rec, this.props.record);
  }

  render() {
    const { record, isPanelMinimum } = this.props;
    return (
      <div
        style={
          isPanelMinimum
            ? { width: "100%" }
            : { width: "100%", display: "flex" }
        }
      >
        {isPanelMinimum && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            <div style={{ marginTop: "0px", marginRight: "5px" }}>
              <div onClick={(e) => this.HandleCheckboxEvent(record)}>
                <ImageComponent
                  url={"images/checkbox.svg"}
                  styleObject={{
                    height: 17,
                    width: 17,
                  }}
                />
              </div>
            </div>
            <div>
              <Dropdown
                isPanelMinimum={isPanelMinimum}
                id={record.todo.id}
                dropdownList={ApplicationUtil.getAllOpenTodoActionList()}
                clickedAction={(rec) => this.handleAction(rec)}
              />
            </div>
          </div>
        )}
        <div
          style={
            isPanelMinimum
              ? {
                  width: "100%",
                  display: "flex",
                  wordBreak: "break-all",
                  flexWrap: "wrap",
                }
              : {
                  width: "88%",
                }
          }
        >
          {this.getLabelValueView(Properties.To_do_label, record.todo.title)}
          {this.getLabelValueView(
            Properties.Created_on_label,
            ApplicationUtil.stringToDate(record.todo.createdOn, true),
            "",
            "createdOn"
          )}
          {record.todo.dueDate != null &&
            this.getLabelValueView(
              Properties.Due_date_label,
              ApplicationUtil.stringToDate(record.todo.dueDate, true),
              "",
              "dueDate"
            )}
          {record.todo.description != null &&
            record.todo.description != "" &&
            this.getLabelValueView(
              Properties.Description_label,
              record.todo.description,
              "",
              "description"
            )}
        </div>
        {!isPanelMinimum && (
          <div style={{ marginTop: "0px" }}>
            <div>
              <Dropdown
                isPanelMinimum={false}
                id={record.todo.id}
                dropdownList={ApplicationUtil.getAllOpenTodoActionList()}
                clickedAction={(rec) => this.handleAction(rec)}
              />
            </div>
            <div style={{ marginTop: "5px" }}>
              <div onClick={(e) => this.HandleCheckboxEvent(record)}>
                <ImageComponent
                  url={"images/checkbox.svg"}
                  styleObject={{
                    height: 17,
                    width: 17,
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

module.exports = TodoRowView;
