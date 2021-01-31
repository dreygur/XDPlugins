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
const styles = require("../../../App.css");
const ApplicationConstants = require("../../../constants/ApplicationConstants");
const MyWorkUtil = require("../../views/myWork/MyWorkUtil");
class ReviewRowView extends React.Component {
  /**
   * To open review View in robohead
   */
  openLinkView(isLink, objectType, id) {
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
            {": "}{" "}
          </div>
          <div
            onClick={(e) => this.openLinkView(isLink, objectType, id)}
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
  }

  render() {
    const { record, expanded } = this.props;
    return (
      <div style={{ width: "100%", display: "flex" }}>
        <div
          style={{
            width: "100%",
            display: "flex",
            wordBreak: "break-all",
            flexWrap: "wrap",
          }}
        >
          {this.getLabelValueView(
            Properties.Review_label,
            record.review.reviewName,
            true,
            ApplicationConstants.OBJECT_TYPE_REVIEW,
            record.review.id,
            "name"
          )}
          {record.review.project &&
            this.getLabelValueView(
              Properties.Project_label,
              record.review.project.name,
              true,
              ApplicationConstants.OBJECT_TYPE_PROJECT,
              record.review.project.id,
              "projectName"
            )}
          {expanded &&
            this.getLabelValueView(
              Properties.Project_formattedNumber_label,
              record.review.project
                ? record.review.project.formattedProjectNumber
                : "",
              "",
              "",
              "",
              "projectNumber"
            )}
          {expanded &&
            record.review.project &&
            record.review.project.fieldOptionByProjectStatusId &&
            this.getLabelValueView(
              Properties.Project_status_label,
              record.review.project.fieldOptionByProjectStatusId
                ? record.review.project.fieldOptionByProjectStatusId
                    .displayValue
                : "",
              "",
              "",
              "",
              "projectStatus"
            )}
          {expanded &&
            record.review.project &&
            record.review.project.campaignName &&
            this.getLabelValueView(
              Properties.Campaign_label,
              record.review.project ? record.review.project.campaignName : "",
              "",
              "",
              "",
              "campaignName"
            )}
          {expanded &&
            record.review.project &&
            this.getLabelValueView(
              Properties.Client_label,
              record.review.project.client
                ? record.review.project.client.name
                : "",
              "",
              "",
              "",
              "clientName"
            )}
          {expanded &&
            this.getLabelValueView(
              Properties.Review_status_label,
              record.review.statusString,
              "",
              "",
              "",
              "status"
            )}
          {expanded &&
            record.review.endDate != null &&
            this.getLabelValueView(
              Properties.Start_date_label,
              ApplicationUtil.stringToDate(record.review.startDate, true),
              "",
              "",
              "",
              "startDate"
            )}
          {record.review.endDate != null &&
            this.getLabelValueView(
              Properties.Due_date_label,
              ApplicationUtil.stringToDate(record.review.endDate, true),
              "",
              "",
              "",
              "dueDate"
            )}
          {expanded &&
            record.review.reviewSummary &&
            record.review.reviewSummary.numComments > 0 &&
            this.getLabelValueView(
              Properties.Comments_label,
              record.review.reviewSummary
                ? record.review.reviewSummary.numComments
                : "",
              "",
              "",
              "",
              "numComments"
            )}
          {expanded &&
            record.review.reviewSummary &&
            record.review.reviewSummary.numNotes > 0 &&
            this.getLabelValueView(
              Properties.Notes_label,
              record.review.reviewSummary
                ? record.review.reviewSummary.numNotes
                : "",
              "",
              "",
              "",
              "numNotes"
            )}
          {expanded &&
            this.getLabelValueView(
              Properties.Created_by_label,
              record.review.creatorDisplayName,
              "",
              "",
              "",
              "createdBy"
            )}
          {expanded &&
            this.getLabelValueView(
              Properties.Created_on_label,
              ApplicationUtil.stringToDate(record.review.createdOn, true),
              "",
              "",
              "",
              "createdOn"
            )}
          {expanded &&
            this.getLabelValueView(
              Properties.Review_owner_label,
              ApplicationUtil.getUserStringNameFromList(
                record.review.reviewOwners
              ),
              "",
              "",
              "",
              "reviewOwners"
            )}
          {expanded &&
            this.getLabelValueView(
              Properties.Review_type_label,
              record.review.reviewTypeString,
              "",
              "",
              "",
              "reviewTypeString"
            )}
          {expanded &&
            record.review.reviewSummary &&
            record.review.reviewSummary.numStages > 0 &&
            this.getLabelValueView(
              Properties.Stages_label,
              record.review.reviewSummary
                ? record.review.reviewSummary.numStages
                : "",
              "",
              "",
              "",
              "numStages"
            )}
          {expanded &&
            record.review.currentReviewStage &&
            this.getLabelValueView(
              Properties.Current_stage_name,
              record.review.currentReviewStage.stageName,
              "",
              "",
              "",
              "currentStageName"
            )}
          {expanded &&
            record.review.currentReviewStage &&
            this.getLabelValueView(
              Properties.Current_stage_due_date,
              ApplicationUtil.stringToDate(
                record.review.currentReviewStage.dueDate,
                true
              ),
              "",
              "",
              "",
              "currentStageDueDate"
            )}
          {expanded &&
            this.getLabelValueView(
              Properties.Modified_by_label,
              record.review.modifierDisplayName,
              "",
              "",
              "",
              "modifiedByUser"
            )}
          {expanded &&
            record.review.reviewPredecessorNames &&
            this.getLabelValueView(
              Properties.Predeccessors_label,
              record.review.reviewPredecessorNames,
              "",
              "",
              "",
              "predecessors"
            )}
          {expanded &&
            record.review.reviewSuccessorNames &&
            this.getLabelValueView(
              Properties.Successors_label,
              record.review.reviewSuccessorNames,
              "",
              "",
              "",
              "successors"
            )}
          {expanded &&
            record.review.tags &&
            this.getLabelValueView(
              Properties.Tags_label,
              ApplicationUtil.getTagsNameFromList(record.review.tags),
              "",
              "",
              "",
              "tags"
            )}
        </div>
      </div>
    );
  }
}

module.exports = ReviewRowView;
