/**
 *
 * Copyright: Copyright (c) 2020 by AQUENT, L.L.C.
 * Company: AQUENT, L.L.C.
 * @created 22-10-2020
 * My Work Util..
 *
 */
const React = require("react");
const { shell } = require("uxp");
const ApplicationConstants = require("../../../constants/ApplicationConstants");
const {
  setLocalAllOpenPreferenceData,
  getLocalAllOpenPreferenceData,
} = require("../../../services/LocalStorageService");
const {
  getTaskLink,
  getReviewLink,
  getProjectLink,
} = require("../../../services/MyWorkService");
const ApplicationUtil = require("../../../util/ApplicationUtil");
const MyWorkUtil = {
  defaultAllOpnWorkColumns:
    "name,projectName,projectNumber,dueDate,status,tags,workType",
  /**
   * To open robohead view on project,review,task name click
   * @param {*} objectType
   * @param {*} id
   */
  openLinkView(objectType, id) {
    switch (objectType) {
      case ApplicationConstants.OBJECT_TYPE_PROJECT:
        getProjectLink(id).then((res) => {
          return shell.openExternal(res.customParams.url);
        });
      case ApplicationConstants.OBJECT_TYPE_TASK:
        getTaskLink(id).then((res) => {
          return shell.openExternal(res.customParams.url);
        });
      case ApplicationConstants.OBJECT_TYPE_REVIEW:
        getReviewLink(id).then((res) => {
          return shell.openExternal(res.customParams.url);
        });
    }
  },
  /**
   * To store All open work preference data
   * @param {*} data
   * @param {*} view
   */
  StorePrefrenceData(data, view) {
    let userId = ApplicationUtil.homeBeanData.loginUserId;
    getLocalAllOpenPreferenceData(userId).then((prefs) => {
      let dataObject = {};
      dataObject[userId] = {};

      if (view == "settings") {
        if (prefs && prefs[userId] && prefs[userId].sort) {
          dataObject[userId].sort = prefs[userId].sort;
        } else {
          dataObject[userId].sort = {
            sortColumn: "workType",
            sortDirection: "ASC",
          };
        }
        if (prefs && prefs[userId] && prefs[userId].filter) {
          dataObject[userId].filter = prefs[userId].filter;
        }
        dataObject[userId].outputColumns = data;
      } else if (view == "sort") {
        if (prefs && prefs[userId] && prefs[userId].outputColumns) {
          dataObject[userId].outputColumns = prefs[userId].outputColumns;
        } else {
          dataObject[userId].outputColumns =
            MyWorkUtil.defaultAllOpnWorkColumns;
        }
        if (prefs && prefs[userId] && prefs[userId].filter) {
          dataObject[userId].filter = prefs[userId].filter;
        }
        dataObject[userId].sort = data;
      } else {
        if (prefs && prefs[userId] && prefs[userId].outputColumns) {
          dataObject[userId].outputColumns = prefs[userId].outputColumns;
        } else {
          dataObject[userId].outputColumns =
            MyWorkUtil.defaultAllOpnWorkColumns;
        }
        if (prefs && prefs[userId] && prefs[userId].sort) {
          dataObject[userId].sort = prefs[userId].sort;
        } else {
          dataObject[userId].sort = {
            sortColumn: "workType",
            sortDirection: "ASC",
          };
        }
      }
      setLocalAllOpenPreferenceData(dataObject, userId);
      if (ApplicationUtil.MyWorkListView) {
        ApplicationUtil.MyWorkListView.getListWithPreferences(dataObject);
      }
    });
  },
  /**
   * To get sort option list on basis of outputcolumns
   * @param {*} columns
   */
  getSortOptionList(columns) {
    let mainList = ApplicationUtil.getAllOpenWorkListSortColumns();

    let outputColumns = columns.split(",");
    outputColumns.forEach((element) => {
      let ele = MyWorkUtil.getOptionWithIndexFromList(
        ApplicationUtil.getAllOpenWorkListSettingColumns(),
        element
      );
      if (ele.dataIndex) {
        mainList.push(ele);
      }
    });
    mainList.push({
      columnName: "Work Type",
      dataIndex: "workType",
    });
    return mainList;
  },
  /**
   * To get [rovided option object from list]
   * @param {*} list
   * @param {*} index
   */
  getOptionWithIndexFromList(list, index) {
    var e = {};
    for (var i = 0; i < list.length; i++) {
      if (list[i].dataIndex === index) {
        e = list[i];
      }
    }
    return e;
  },
  /**
   * All open work sort list with all options
   */
  getAllOpenWorkListSortList() {
    return [
      {
        columnName: "Item Name",
        dataIndex: "name",
      },
      {
        columnName: "Project",
        dataIndex: "projectName",
      },
      {
        columnName: "Project #",
        dataIndex: "projectNumber",
      },
      {
        columnName: "Due Date",
        dataIndex: "dueDate",
      },
      {
        columnName: "Status",
        dataIndex: "status",
      },

      {
        columnName: "Tags",
        dataIndex: "tags",
      },
      { columnName: "# of Comments", dataIndex: "numComments" },
      { columnName: "# of Notes", dataIndex: "numNotes" },
      {
        dataIndex: "numStages",
        columnName: "# of Stages",
      },
      {
        columnName: "Assignee(s)",
        dataIndex: "taskUsers",
      },
      {
        columnName: "Campaign",
        dataIndex: "campaignName",
      },
      {
        columnName: "Campaign #",
        dataIndex: "formattedCampaignNumber",
      },

      {
        columnName: "Client",
        dataIndex: "clientName",
      },
      {
        columnName: "Created By",
        dataIndex: "createdBy",
      },
      {
        columnName: "Created On",
        dataIndex: "createdOn",
      },
      {
        dataIndex: "currentStageDueDate",
        columnName: "Current Stage Due Date",
      },
      {
        dataIndex: "currentStageName",
        columnName: "Current Stage name",
      },
      {
        columnName: "Description",
        dataIndex: "description",
      },

      {
        columnName: "Duration Day(s)",
        dataIndex: "duration",
      },

      {
        columnName: "Estimated Hours",
        dataIndex: "estimatedTime",
      },
      {
        columnName: "Hours Worked",
        dataIndex: "actualTime",
      },
      {
        columnName: "Modified By",
        dataIndex: "modifiedByUser",
      },

      {
        columnName: "Predecessor(s)",
        dataIndex: "predecessors",
      },
      { columnName: "Progress", dataIndex: "progress" },

      {
        columnName: "Project Status",
        dataIndex: "projectStatus",
      },
      { columnName: "Review Owners", dataIndex: "reviewOwners" },
      { columnName: "Review Type", dataIndex: "reviewTypeString" },
      {
        columnName: "Start Date",
        dataIndex: "startDate",
      },
      {
        columnName: "Successor(s)",
        dataIndex: "successors",
      },
      {
        columnName: "Task Group",
        dataIndex: "taskGroup",
      },
      {
        columnName: "Task ID",
        dataIndex: "taskOrderId",
      },
      {
        columnName: "Task Role",
        dataIndex: "taskRole",
      },
      {
        columnName: "Work Type",
        dataIndex: "workType",
      },
    ];
  },
};
module.exports = MyWorkUtil;
