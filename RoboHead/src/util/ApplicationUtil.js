/**
 *
 * Copyright: Copyright (c) 2020 by AQUENT, L.L.C.
 * Company: AQUENT, L.L.C.
 * @created 08-09-2020
 * Application level Util..
 *
 */
const React = require("react");
const ApplicationConstants = require("../constants/ApplicationConstants");
const showInternetErrorAlert = require("../components/common/AlertComponents")
  .showInternetErrorAlert;
const application = require("application");
const {
  deletePrefences,
  getLocalUserPreferenceData,
} = require("../services/LocalStorageService");
// const { shell } = require("uxp");
// const { getTaskLink } = require("../services/MyWorkService");
const ApplicationUtil = {
  copyToRH: "",
  copyFromRH: "",
  copyToRHPanel: "",
  copyFromRHPanel: "",
  copyToProjectRef: "",
  copyToCampaignRef: "",
  MyWorkListView: "",
  copyFromRHRef: "",
  libraryRef: "",
  applicationUrl: "",
  userToken: "",
  storageFolder: "",
  MyWorkPanel: "",
  homeBeanData: "",

  /**
   * To show spinner on API calls
   */
  showSpinner() {
    document.getElementById("spinnerDiv").style.display = "block";
  },
  /**
   * To hide spinner currently visible.
   */
  hideSpinner() {
    document.getElementById("spinnerDiv").style.display = "hide";
  },
  /**
   * It will excludes .file extensions if we have in filename
   * @param {*} fileName
   */
  getFilename(fileName) {
    if (fileName.includes(".png")) {
      return fileName.replace(".png", "");
    } else if (fileName.includes(".svg")) {
      return fileName.replace(".svg", "");
    } else if (fileName.includes(".pdf")) {
      return fileName.replace(".pdf", "");
    } else if (fileName.includes(".jpg")) {
      return fileName.replace(".jpg", "");
    } else {
      return fileName;
    }
  },
  /**
   * To check internet is working or not for user.
   */
  checkInternetConnection() {
    if (navigator.onLine) {
      return true;
    } else {
      showInternetErrorAlert();
    }
  },
  /**
   * Loads respective list on refresh icon.
   * @param {*} defaultView
   */
  getList(defaultView) {
    if (defaultView == ApplicationConstants.OBJECT_TYPE_CAMPAIGN) {
      if (ApplicationUtil.copyToCampaignRef) {
        ApplicationUtil.copyToCampaignRef.getList();
      }
    } else if (defaultView == ApplicationConstants.OBJECT_TYPE_PROJECT) {
      if (ApplicationUtil.copyToProjectRef)
        ApplicationUtil.copyToProjectRef.getList();
    } else {
      if (ApplicationUtil.libraryRef) ApplicationUtil.libraryRef.getList();
    }
  },
  /**
   * This function gets file information of opened file in XD
   * @param {*} object
   */
  setXDFileName(object) {
    let documentInfo = application.activeDocument;
    object.setState({ fileName: documentInfo.name });
  },
  /**
   * To Logout user from plugin and remove all saved preferences.
   */
  logout() {
    deletePrefences();
    let copyToRHObject = ApplicationUtil.copyToRH;
    let myWorkObejct = ApplicationUtil.MyWorkPanel;
    if (copyToRHObject) {
      copyToRHObject.logout();
    }
    if (myWorkObejct) {
      myWorkObejct.logoutMyWork();
    }
  },
  /**
   * To get list with project number appened to name for search functionality
   * @param {*} list
   */
  getListWithProjectNumberAppend(list) {
    list.forEach((element) => {
      if (
        element.formattedProjectNumber &&
        element.formattedProjectNumber != ""
      ) {
        element.nameWithNumber =
          element.name + " (" + element.formattedProjectNumber + ")";
      } else {
        element.nameWithNumber = element.name;
      }
    });
    return list;
  },
  /**
   * Too convert date into DD/MM/YYYY format
   * @param {*} date
   * @param {*} dateOnly
   * @param {*} timeOnly
   */
  stringToDate(date, dateOnly, timeOnly) {
    if (dateOnly && date) {
      return date.split(" ")[0];
    } else if (timeOnly && date) {
      return date.split(" ")[1] + " " + date.split(" ")[2];
    } else {
      return date
        ? date.split(" ")[0] +
            " " +
            date.split(" ")[1] +
            " " +
            date.split(" ")[2]
        : "";
    }
  },
  /**
   * To get Task progress icon
   * @param {*} progress
   */
  getProgressIcon(progress) {
    switch (progress) {
      case ApplicationConstants.TASK_OVERDUE:
        return "images/icon_overdue.svg";
        break;
      case ApplicationConstants.TASK_ACTIVE:
        return "images/icon_active.svg";
        break;
      case ApplicationConstants.TASK_UPCOMING:
        return "images/icon_upcoming.svg";
        break;
      case ApplicationConstants.TASK_OVERDUE_AND_BLOCKED:
        return "images/icon_overdue_and_blocked.svg";
        break;
      case ApplicationConstants.TASK_BLOCKED:
        return "images/icon_blocked.svg";
        break;
      case ApplicationConstants.TASK_COMPLETE:
        return "images/icon_completed.svg";
        break;
      case ApplicationConstants.TASK_NOT_READY:
      case ApplicationConstants.TASK_ON_HOLD:
        return "images/icon_not_ready.svg";
        break;
      default:
      // do nothing
    }
  },
  /**
   * To get task status icon
   * @param {*} id
   */
  getTaskStatusObject(id) {
    if (id === ApplicationConstants.TASK_STATUS_NOT_STARTED) {
      return "images/icon_annotation_not_started_gry.svg";
    } else if (id === ApplicationConstants.TASK_STATUS_IN_PROGRESS) {
      return "images/indicator_in_progress_grey.svg";
    } else if (id === ApplicationConstants.TASK_STATUS_COMPLETE) {
      return "images/icon_Timesheet_Task_completed_blue.svg";
    } else if (id === ApplicationConstants.TASK_STATUS_ONHOLD) {
      return "images/icon_annotation_on_hold_gray.svg";
    }
  },
  /**
   *get task status
   * @param {*} value
   * @param {*} isfromMywork
   */
  getNewStatusId(value, isfromMywork) {
    if (value === ApplicationConstants.TASK_STATUS_NOT_STARTED) {
      return ApplicationConstants.TASK_STATUS_IN_PROGRESS;
    } else if (value === ApplicationConstants.TASK_STATUS_IN_PROGRESS) {
      return ApplicationConstants.TASK_STATUS_COMPLETE;
    } else if (
      value === ApplicationConstants.TASK_STATUS_COMPLETE &&
      !isfromMywork
    ) {
      return ApplicationConstants.TASK_STATUS_ONHOLD;
    } else {
      return ApplicationConstants.TASK_STATUS_NOT_STARTED;
    }
  },
  /**
   * All open work review action list
   */
  getAllOpenReviewActionList() {
    return [
      {
        icon: "images/icon_view_review_blk.svg",
        name: "View Review",
        dataIndex: "ModifyTodo",
      },
      {
        icon: "images/icon_email_black.svg",
        name: "Send Reminder",
        dataIndex: "ModifyTodo",
      },
      {
        icon: "images/icon_set_review_status_blk.svg",
        name: "Set Review Status",
        dataIndex: "ModifyTodo",
      },
      {
        icon: "images/icon_link_blk.svg",
        name: "Get Link",
        dataIndex: "ModifyTodo",
      },
      {
        icon: "images/icon_add_favorites_blk.svg",
        name: "Add To Favorites",
        dataIndex: "ModifyTodo",
      },
      {
        icon: "images/icon_archived_reviews_black.svg",
        name: "Archive Review",
        dataIndex: "ModifyTodo",
      },
      {
        icon: "images/icon_pdf_blk.svg",
        name: "Save As PDF",
        dataIndex: "ModifyTodo",
      },
      {
        icon: "images/icon_delete_trash_blk.svg",
        name: "Delete Review",
        dataIndex: "ModifyTodo",
      },
    ];
  },
  /**
   * All open work task action list
   */
  getAllOpenTaskActionList() {
    return [
      {
        icon: "images/icon_task_details_black.svg",
        name: "View Details",
        dataIndex: "ModifyTodo",
      },
      {
        icon: "images/icon_set_task_status_black.svg",
        name: "Set Status",
        dataIndex: "ModifyTodo",
      },
      {
        icon: "images/icon_link_blk.svg",
        name: "Get Link",
        dataIndex: "ModifyTodo",
      },
      {
        icon: "images/icon_add_favorites_blk.svg",
        name: "Add To Favorites",
        dataIndex: "ModifyTodo",
      },
    ];
  },
  /**
   * All open work todo actions list
   */
  getAllOpenTodoActionList() {
    return [
      {
        icon: "images/icon_modify_to-do_black.svg",
        name: "Modify",
        dataIndex: "ModifyTodo",
      },
      {
        icon: "images/icon_mark_complete_black.svg",
        name: "Mark Complete",
        dataIndex: "CompleteTodo",
      },
      {
        icon: "images/icon_add_favorites_blk.svg",
        name: "Add To Favorites",
        dataIndex: "AddToFavorites",
      },
      {
        icon: "images/icon_delete_trash_blk.svg",
        name: "Delete To-Do",
        dataIndex: "DeleteTodo",
      },
    ];
  },
  /**
   * All open work settings columns
   */
  getAllOpenWorkListSettingColumns() {
    return [
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
    ];
  },
  /**
   * All open work sort columns
   */
  getAllOpenWorkListSortColumns() {
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
    ];
  },
  /**
   * To check Account To-Do module enabled or not
   */
  isTaskModuleEnabled() {
    if (
      ApplicationUtil.homeBeanData.enableTaskModule == ApplicationConstants.TRUE
    ) {
      return true;
    } else {
      return false;
    }
  },
  /**
   * To check Account Review module enabled or not
   */
  isReviewModuleEnabled() {
    if (
      ApplicationUtil.homeBeanData.enableReviewModule ==
      ApplicationConstants.TRUE
    ) {
      return true;
    } else {
      return false;
    }
  },
  /**
   * To check Account Task module enabled or not
   */
  isTodoModuleEnabled() {
    if (
      ApplicationUtil.homeBeanData.enablePersonalTodos ==
      ApplicationConstants.TRUE
    ) {
      return true;
    } else {
      return false;
    }
  },
  /**
   * To get Homebean data
   */
  getHomeBeanData() {
    getLocalUserPreferenceData().then((data) => {
      if (data) ApplicationUtil.homeBeanData = data;
    });
  },
  /**
   * To ge comma seperated user sting from provided list
   * @param {*} list
   * @param {*} index
   */
  getUserStringNameFromList(list, index) {
    var e = "";
    if (list) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].dataIndex === index) {
          e =
            e != ""
              ? e + ", " + list[i].user.userDisplayName
              : e + list[i].user.userDisplayName;
        }
      }
    }
    return e;
  },
  /**
   * To ge comma seperated tags
   * @param {*} list
   * @param {*} index
   */
  getTagsNameFromList(list) {
    var e = "";
    if (list) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].name) {
          e = e != "" ? e + ", " + list[i].name : e + list[i].name;
        }
      }
    }
    return e;
  },
  /**
   * Hours and minute separated by colon.
   */
  getTimeFormat(value) {
    if (value != undefined && value != null) {
      var checkString = parseFloat(value);
      if (isNaN(checkString)) return value;
      value = new String(value);
      if (value.indexOf(".") != -1) {
        try {
          var values = value.split(".");
          if (parseInt(values[0]) < 10 && values[0].length <= 1) {
            values[0] = "0" + values[0];
          }
          if (parseInt(values[1]) < 10 && values[1].length <= 1) {
            values[1] = values[1] + "0";
          }
          return values[0] + ":" + values[1];
        } catch (e) {
          if (parseInt(value) < 10 && value.length <= 1) {
            value = "0" + value;
          }
          return value + ":00";
        }
      } else {
        if (parseInt(value) < 10 && value.length <= 1) {
          value = "0" + value;
        }
        return value + ":00";
      }
    } else {
      return value;
    }
  },
};
module.exports = ApplicationUtil;
