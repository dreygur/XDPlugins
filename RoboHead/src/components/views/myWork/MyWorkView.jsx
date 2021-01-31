/**
 *
 * Copyright: Copyright (c) 2020 by AQUENT, L.L.C.
 * Company: AQUENT, L.L.C.
 * @created 14-10-2020
 */
const React = require("react");
const ReactDOM = require("react-dom");
const Properties = require("../../../properties/Properties");
const SpinnerComp = require("../../common/Spinner");
const ApplicationUtil = require("../../../util/ApplicationUtil");
const {
  getAllOpenWorkList,
  markTodoAsComplete,
  updateTaskStatus,
  addToFavorites,
} = require("../../../services/MyWorkService");
const { showSpinner, hideSpinner } = require("../../../util/ApplicationUtil");
const TaskRowView = require("../../common/task/TaskRowView");
const ReviewRowView = require("../../common/review/ReviewRowView");
const TodoRowView = require("../../common/todo/TodoRowView");
const styles = require("./MyWork.css");
const {
  getLocalUserPreferenceData,
  getLocalAllOpenPreferenceData,
} = require("../../../services/LocalStorageService");
const MyWorkUtil = require("./MyWorkUtil");
const ApplicationConstants = require("../../../constants/ApplicationConstants");
const { deleteTodo, updateTodo } = require("../../../services/TodoService");
const ModifyToDoDialog = require("../../common/todo/modifyToDoDialog");
var moment = require("moment");
class MyWorkView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allOpenWorkList: [],
      expanded: false,
    };
  }

  /**
   * To load All open work list on component did mount
   */
  componentDidMount() {
    ApplicationUtil.MyWorkListView = this;
    this.getList();
    this.getHomeBeanData();
  }

  /**
   * To get Homebean data on screen refresh
   */
  getHomeBeanData() {
    getLocalUserPreferenceData().then((data) => {
      if (data) ApplicationUtil.homeBeanData = data;
    });
  }
  /**
   * Common get list function
   */
  getList() {
    let requestParams = {};
    getLocalUserPreferenceData().then((data) => {
      if (data) {
        ApplicationUtil.homeBeanData = data;
      }
      let userId = ApplicationUtil.homeBeanData.loginUserId;
      getLocalAllOpenPreferenceData(userId).then((prefs) => {
        if (prefs && prefs[userId] != undefined) {
          if (prefs[userId] && prefs[userId].sort) {
            requestParams.sortDirection = prefs[userId].sort.sortDirection;
            requestParams.sortColumn = prefs[userId].sort.sortColumn;
          }
        } else {
          requestParams.sortColumn = "workType";
          requestParams.sortDirection = "ASC";
        }
        this.loadList(requestParams);
      });
    });
  }

  /**
   * Get list API call
   * @param {*} prefs
   */
  loadList(requestParams) {
    requestParams.outputColumns = this.props.outputColumns;
    showSpinner();
    getAllOpenWorkList(requestParams).then((res) => {
      this.setState({ allOpenWorkList: res.List });
      hideSpinner();
    });
  }

  /**
   * To get list on preferences store
   * @param {*} value
   */
  getListWithPreferences(prefs) {
    let requestParams = {};
    let userId = ApplicationUtil.homeBeanData.loginUserId;
    if (prefs && prefs[userId] && prefs[userId].sort) {
      requestParams.sortDirection = prefs[userId].sort.sortDirection;
      requestParams.sortColumn = prefs[userId].sort.sortColumn;
    }
    this.loadList(requestParams);
  }

  /**
   * handle list expand state
   * @param {*} value
   */
  handleExpand(value) {
    this.setState({ expanded: value });
    this.props.handleExpandView();
  }

  /**
   * To mark To=Do as complete
   * @param {*} record
   */
  completeToDOAction(record) {
    showSpinner();
    let requestParams = {};
    requestParams.id = record.todo.id;
    markTodoAsComplete(requestParams).then((res) => {
      this.props.showOverlayMessage(res.detailedMessage, "success");
      hideSpinner();
      this.getList();
    });
  }

  /**
   * handle task status update
   * @param {*} record
   */
  handleUpdateTaskStatus(record) {
    let newId = ApplicationUtil.getNewStatusId(record.task.globalList.id, true);
    let params = {
      taskIds: record.task.id,
      taskStatus: newId,
    };

    showSpinner();
    updateTaskStatus(params).then((responce) => {
      hideSpinner();
      this.getList();
    });
  }

  /**
   *To handle All To-Do actions
   */
  handleActions(rec, record) {
    switch (rec.dataIndex) {
      case "CompleteTodo":
        return this.completeToDOAction(record);
      case "AddToFavorites":
        let requestParams = {
          userId: ApplicationUtil.homeBeanData.loginUserId,
          objectType: ApplicationConstants.OBJECT_TYPE_TODO,
          objectId: record.todo.id,
        };
        showSpinner();
        return addToFavorites(requestParams)
          .then((res) => {
            this.props.showOverlayMessage(res.detailedMessage, "success");
            hideSpinner();
            this.getList();
          })
          .catch((err) => {
            hideSpinner();
          });
      case "ModifyTodo":
        return this.showModifyTodo(record);
      case "DeleteTodo":
        let params = {
          ids: record.todo.id,
        };
        showSpinner();
        return deleteTodo(params)
          .then((res) => {
            hideSpinner();
            this.props.showOverlayMessage(res.detailedMessage, "success");
            this.getList();
          })
          .catch((err) => {
            hideSpinner();
          });
    }
  }

  /**
   * Modify To-Do APi call
   * @param {*} params
   */
  modifyToDo(params) {
    showSpinner();
    updateTodo(params)
      .then((res) => {
        hideSpinner();
        this.props.showOverlayMessage(res.detailedMessage, "success");
        this.getList();
      })
      .catch((err) => {
        hideSpinner();
      });
  }

  /**
   * To opn modify todo UI
   */
  showModifyTodo(record) {
    let dialog;
    let me = this;
    function getDialog() {
      if (dialog == null) {
        dialog = document.createElement("dialog");
        ReactDOM.render(
          <ModifyToDoDialog
            record={record}
            handleSave={(params) => me.modifyToDo(params)}
            headerLabel={Properties.Modify_ToDo_label}
            headerIcon={"images/icon_modify_to-do_black.svg"}
            buttonLabel={"Save"}
            dialog={dialog}
          />,
          dialog
        );
      }
      return dialog;
    }
    return document.body.appendChild(getDialog()).showModal();
  }

  /**
   * To get All open work view on EP permissions
   */
  getView() {
    ApplicationUtil.getHomeBeanData();
    const { allOpenWorkList, expanded } = this.state;
    const { outputColumns, isPanelMinimum } = this.props;
    if (
      ApplicationUtil.homeBeanData &&
      !ApplicationUtil.isTaskModuleEnabled() &&
      !ApplicationUtil.isReviewModuleEnabled() &&
      !ApplicationUtil.isTodoModuleEnabled()
    ) {
      return (
        <div style={{ padding: "15px 8px 15px 8px", color: "red" }}>
          {Properties.All_open_work_enable_error}
        </div>
      );
    } else {
      return (
        <React.Fragment>
          {allOpenWorkList && allOpenWorkList.length > 0 ? (
            allOpenWorkList.map((record, i) => {
              return (
                <div key={i}>
                  {record.task != null &&
                    ApplicationUtil.isTaskModuleEnabled() && (
                      <TaskRowView
                        isPanelMinimum={isPanelMinimum}
                        outputColumns={outputColumns}
                        record={record}
                        expanded={expanded}
                        updateStatus={(record) =>
                          this.handleUpdateTaskStatus(record)
                        }
                      />
                    )}
                  {record.review != null &&
                    ApplicationUtil.isReviewModuleEnabled() && (
                      <ReviewRowView
                        isPanelMinimum={isPanelMinimum}
                        outputColumns={outputColumns}
                        record={record}
                        expanded={expanded}
                      />
                    )}
                  {record.todo != null &&
                    ApplicationUtil.isTodoModuleEnabled() && (
                      <TodoRowView
                        isPanelMinimum={isPanelMinimum}
                        outputColumns={outputColumns}
                        record={record}
                        expanded={expanded}
                        completeToDO={(record) =>
                          this.completeToDOAction(record)
                        }
                        handleToDoActions={(rec, record) =>
                          this.handleActions(rec, record)
                        }
                      />
                    )}
                  <div className={styles.MyWorkMainDivCSS}></div>
                </div>
              );
            })
          ) : (
            <React.Fragment>
              <div style={{ padding: "15px 8px 15px 8px" }}>
                {Properties.Grid_emptyText}
              </div>
            </React.Fragment>
          )}
        </React.Fragment>
      );
    }
  }

  render() {
    return (
      <React.Fragment>
        <SpinnerComp />
        <div style={{ width: "100%" }}>{this.getView()}</div>
      </React.Fragment>
    );
  }
}

module.exports = MyWorkView;
