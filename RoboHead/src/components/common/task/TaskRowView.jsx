/**
 *
 * Copyright: Copyright (c) 2020 by AQUENT, L.L.C.
 * Company: AQUENT, L.L.C.
 * @created 15-10-2020
 */
const React = require("react");
const ApplicationConstants = require("../../../constants/ApplicationConstants");
const Properties = require("../../../properties/Properties");
const ApplicationUtil = require("../../../util/ApplicationUtil");
const ImageComponent = require("../image/ImageComponent");
const MyWorkUtil = require("../../../components/views/myWork/MyWorkUtil");
class TaskRowView extends React.Component {
  /**
   * To open link View in robohead
   */
  openView(isLink, objectType, id) {
    if (isLink) {
      MyWorkUtil.openLinkView(objectType, id);
    }
  }

  /**
   * To show/hide div label view on basis of output columns
   *
   */
  getLabelValueView(label, name, isLink, objectType, id, column) {
    const { outputColumns, isPanelMinimum } = this.props;
    if (
      outputColumns.includes(column) &&
      name != "" &&
      name != null &&
      name != undefined
    ) {
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
                  flexWrap: "wrap",
                }
          }
        >
          <div style={{ fontWeight: "bold" }}>
            {label}
            {": "}
          </div>
          <div
            onClick={(e) => this.openView(isLink, objectType, id)}
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
                : {
                    marginLeft: "1px",
                  }
            }
          >
            {name}
          </div>
        </div>
      );
    }
  }

  render() {
    const { record, expanded, updateStatus, isPanelMinimum } = this.props;
    return (
      <div
        style={
          isPanelMinimum
            ? { width: "100%" }
            : { width: "100%", display: "flex" }
        }
      >
        {isPanelMinimum && (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div
              style={{ marginRight: "10px", cursor: "pointer" }}
              onClick={(event) => {
                event.stopPropagation();
                updateStatus(record);
              }}
            >
              <ImageComponent
                url={ApplicationUtil.getTaskStatusObject(
                  record.task.globalList.id
                )}
                styleObject={{ height: 17, width: 17 }}
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
                  display: "flex",
                  //wordBreak: "break-all",
                  flexWrap: "wrap",
                }
          }
        >
          <div style={{ display: "flex" }}>
            <div style={{ fontWeight: "bold" }}>
              {Properties.Task_label}
              {": "}{" "}
            </div>
            <div style={{ marginLeft: "2px" }}>
              {record.task.taskSummary && record.task.taskSummary.progress && (
                <React.Fragment>
                  <span>
                    <img
                      alt="progressImg"
                      src={ApplicationUtil.getProgressIcon(
                        record.task.taskSummary
                          ? record.task.taskSummary.progress
                          : ""
                      )}
                      style={{ height: 15, width: 15 }}
                    />
                  </span>
                </React.Fragment>
              )}
            </div>
            <div
              onClick={(e) =>
                this.openView(
                  true,
                  ApplicationConstants.OBJECT_TYPE_TASK,
                  record.task.id
                )
              }
              style={{ marginLeft: "2px", color: "#296DFA", cursor: "pointer" }}
            >
              {record.task.name}
            </div>
          </div>
          {expanded &&
            this.getLabelValueView(
              Properties.Task_ID_label,
              record.task.taskOrderId,
              "",
              "",
              "",
              "taskOrderId"
            )}
          {expanded &&
            record.task.taskGroup &&
            this.getLabelValueView(
              Properties.Task_group_label,
              record.task.taskGroup.value,
              "",
              "",
              "",
              "taskGroup"
            )}
          {expanded &&
            this.getLabelValueView(
              Properties.Description_label,
              record.task.description,
              "",
              "",
              "",
              "description"
            )}
          {expanded &&
            this.getLabelValueView(
              Properties.Client_label,
              record.task.project.client ? record.task.project.client.name : "",
              "",
              "",
              "clientName"
            )}
          {this.getLabelValueView(
            Properties.Project_label,
            record.task.project ? record.task.project.name : "",
            true,
            ApplicationConstants.OBJECT_TYPE_PROJECT,
            record.task.project ? record.task.project.id : 0,
            "projectName"
          )}
          {expanded &&
            this.getLabelValueView(
              Properties.Project_formattedNumber_label,
              record.task.project
                ? record.task.project.formattedProjectNumber
                : "",
              "",
              "",
              "",
              "projectNumber"
            )}
          {expanded &&
            this.getLabelValueView(
              Properties.Project_status_label,
              record.task.project &&
                record.task.project.fieldOptionByProjectStatusId
                ? record.task.project.fieldOptionByProjectStatusId.displayValue
                : "",
              "",
              "",
              "",
              "projectStatus"
            )}
          {expanded &&
            record.task.project.campaignName &&
            this.getLabelValueView(
              Properties.Campaign_label,
              record.task.project ? record.task.project.campaignName : "",
              "",
              "",
              "",
              "campaignName"
            )}
          {expanded &&
            record.task.project.formattedCampaignNumber &&
            this.getLabelValueView(
              Properties.Campaign_number_label,
              record.task.project
                ? record.task.project.formattedCampaignNumber
                : "",
              "",
              "",
              "",
              "formattedCampaignNumber"
            )}
          {expanded &&
            this.getLabelValueView(
              Properties.Start_date_label,
              ApplicationUtil.stringToDate(record.task.startDate, true),
              "",
              "",
              "",
              "startDate"
            )}
          {this.getLabelValueView(
            Properties.Due_date_label,
            ApplicationUtil.stringToDate(record.task.dueDate, true),
            "",
            "",
            "",
            "dueDate"
          )}
          {expanded &&
            this.getLabelValueView(
              Properties.Assignees_label,
              ApplicationUtil.getUserStringNameFromList(record.task.taskUsers),
              "",
              "",
              "",
              "taskUsers"
            )}
          {expanded &&
            this.getLabelValueView(
              Properties.Created_by_label,
              record.task.createdByUser,
              "",
              "",
              "",
              "createdBy"
            )}
          {expanded &&
            this.getLabelValueView(
              Properties.Created_on_label,
              ApplicationUtil.stringToDate(record.task.createdOn, true),
              "",
              "",
              "",
              "createdOn"
            )}
          {expanded &&
            this.getLabelValueView(
              Properties.Modified_by_label,
              record.task.modifiedByUser,
              "",
              "",
              "",
              "modifiedByUser"
            )}
          {expanded &&
            this.getLabelValueView(
              Properties.Predeccessors_label,
              record.task.taskPredecessorNames,
              "",
              "",
              "",
              "predecessors"
            )}
          {expanded &&
            this.getLabelValueView(
              Properties.Successors_label,
              record.task.taskSuccessorNames,
              "",
              "",
              "",
              "successors"
            )}
          {expanded &&
            record.task.taskRole &&
            this.getLabelValueView(
              Properties.Task_role_label,
              record.task.taskRole.displayValue,
              "",
              "",
              "",
              "taskRole"
            )}
          {expanded &&
            this.getLabelValueView(
              Properties.Duration_label,
              record.task.taskSummary
                ? record.task.taskSummary.duration + " day(s)"
                : "" + " day(s)",
              "",
              "",
              "",
              "duration"
            )}
          {expanded &&
            this.getLabelValueView(
              Properties.Estimated_hours_label,
              ApplicationUtil.getTimeFormat(record.task.estimatedTime),
              "",
              "",
              "",
              "estimatedTime"
            )}
          {expanded &&
            this.getLabelValueView(
              Properties.Hours_worked_label,
              ApplicationUtil.getTimeFormat(record.task.actualTime),
              "",
              "",
              "",
              "actualTime"
            )}
          {expanded &&
            record.task.tags &&
            this.getLabelValueView(
              Properties.Tags_label,
              ApplicationUtil.getTagsNameFromList(record.task.tags),
              "",
              "",
              "",
              "tags"
            )}
        </div>
        {!isPanelMinimum && (
          <div style={{ marginTop: "5px" }}>
            <div
              onClick={(event) => {
                event.stopPropagation();
                updateStatus(record);
              }}
            >
              <ImageComponent
                url={ApplicationUtil.getTaskStatusObject(
                  record.task.globalList.id
                )}
                styleObject={{ height: 17, width: 17 }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

module.exports = TaskRowView;
