/**
 *
 * Copyright: Copyright (c) 2020 by AQUENT, L.L.C.
 * Company: AQUENT, L.L.C.
 * @created 014-10-2020
 */
const React = require("react");
const ReactDOM = require("react-dom");
const SpinnerComp = require("../../common/Spinner");
const styles = require("./MyWork.css");
const AuthenticationPanel = require("../login/AuthenticationPanel");
const ApplicationUtil = require("../../../util/ApplicationUtil");
const ApplicationConstants = require("../../../constants/ApplicationConstants");
const Properties = require("../../../properties/Properties");
const FileSave = require("../../common/FileSave");
const Footer = require("../../common/footer/footer");
const MyWorkView = require("./MyWorkView");
const { Fragment } = require("react");
const HeaderBar = require("../../common/header/HeaderBar");
const ListHeaderBars = require("../../common/listHeaderBar/ListHeaderBars");
const ListViewDialog = require("../../common/actionDialog/ListViewDialog");
const MyWorkUtil = require("./MyWorkUtil");
const {
  getLocalAllOpenPreferenceData,
  getLocalUserPreferenceData,
} = require("../../../services/LocalStorageService");
const CustomSnackbar = require("../../common/snackbar/CustomSnackbar");
const getLocalPreferenceData = require("../../../services/LocalStorageService")
  .getLocalPreferenceData;

class MyWorkPanelView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAPIKeyPresent: false,
      isAccontUrlPresent: false,
      showLoginView: false,
      showAPIKeyView: false,
      showMessage: false,
      selectedSort: "workType",
      selectedSortDirection: ApplicationConstants.ASC,
      message: "",
      showCustomMessage: false,
      messageType: "",
      outputColumns: MyWorkUtil.defaultAllOpnWorkColumns,
      isPanelMinimum: false,
    };
  }

  /**
   * To check account name or User API token is present or not.
   */

  componentDidMount() {
    ApplicationUtil.MyWorkPanel = this;
    getLocalPreferenceData().then((data) => this.setPreferences(data));
    this.getAllOpenWorkPrefs();
    this.checkPanelResize(true);
  }

  /**
   * Event Listner to check panel width on resize
   * @param {*} value
   * @param {*} url
   */
  checkPanelResize(isDidMount) {
    let panelElement = document.getElementById(
      ApplicationConstants.ALL_OPEN_WORK_PANEL_ID
    );
    let me = this;
    panelElement.addEventListener("resize", function () {
      me.resizePanelHeighthandle(me, panelElement.offsetHeight, isDidMount);
      if (panelElement.offsetWidth < 160) {
        me.setState({ isPanelMinimum: true });
      } else {
        me.setState({ isPanelMinimum: false });
      }
    });
  }

  /**
   * Function which calculate visible plugin UI height.
   * @param {*} me
   * @param {*} height
   */
  resizePanelHeighthandle(me, height) {}
  /**
   * Unmount events
   */
  componentWillUnmount() {
    let panelElement = document.getElementById(
      ApplicationConstants.ALL_OPEN_WORK_PANEL_ID
    );
    panelElement.removeEventListener("resize", function () {});
  }

  /**
   * Get all open work preference data
   * @param {*} value
   * @param {*} url
   */
  getAllOpenWorkPrefs() {
    getLocalUserPreferenceData().then((data) => {
      if (data) {
        ApplicationUtil.homeBeanData = data;
      }
      let userId = ApplicationUtil.homeBeanData.loginUserId;
      getLocalAllOpenPreferenceData(userId).then((prefs) => {
        if (prefs && prefs[userId] != undefined) {
          if (prefs[userId] && prefs[userId].outputColumns) {
            this.setState({ outputColumns: prefs[userId].outputColumns });
          } else {
            this.setState({
              outputColumns: MyWorkUtil.defaultAllOpnWorkColumns,
            });
          }
          if (prefs[userId] && prefs[userId].sort) {
            this.setState({
              selectedSort: prefs[userId].sort.sortColumn,
              selectedSortDirection: prefs[userId].sort.sortDirection,
            });
          }
        } else {
          this.setState({
            outputColumns: MyWorkUtil.defaultAllOpnWorkColumns,
          });
        }
      });
    });
  }

  /**
   * To change state on user login
   * @param {*} value
   * @param {*} url
   */
  ChnageState(value, url) {
    this.setState({
      isAccontUrlPresent: true,
      accountUrl: url,
      showAPIKeyView: value == ApplicationConstants.FALSE ? false : true,
      showLoginView: value == ApplicationConstants.FALSE ? true : false,
    });
  }

  /**
   * T o check preferences on refresh
   * @param {*} preferenceData
   */
  setPreferences(preferenceData) {
    if (preferenceData.accountUrl) {
      ApplicationUtil.applicationUrl = preferenceData.accountUrl;

      this.setState({ isAccontUrlPresent: true });
    }
    if (preferenceData.apiKey) {
      ApplicationUtil.userToken = preferenceData.apiKey;
    }
    if (preferenceData.apiKey) {
      this.changeView();
    }
  }
  calculateHeightOnLogin() {
    let panelElement = document.getElementById(
      ApplicationConstants.ALL_OPEN_WORK_PANEL_ID
    );
    this.resizePanelHeighthandle(this, panelElement.offsetHeight);
  }

  /**
   * To chane login view to Copy to RH view
   */
  changeView() {
    this.setState({ isAPIKeyPresent: true }, () => {
      this.calculateHeightOnLogin();
    });
  }

  /**
   * To logout the user
   */
  logoutMyWork() {
    let me = this;
    ApplicationUtil.applicationUrl = "";
    me.setState({
      isAPIKeyPresent: false,
      isAccontUrlPresent: false,
      showLoginView: false,
      showAPIKeyView: false,
      showMessage: true,
    });

    /**
     * To hide message automatically
     */
    setTimeout(function () {
      me.setState({ showMessage: false });
    }, 5000);
  }

  /**
   * Reset View on cancel
   */
  resetView() {
    this.setState({
      isAccontUrlPresent: false,
      showLoginView: false,
      showAPIKeyView: false,
    });
  }

  /**
   * It returns authentication UI .Functional component
   */
  getView() {
    const {
      isAccontUrlPresent,
      showLoginView,
      showAPIKeyView,
      accountUrl,
      isPanelMinimum,
    } = this.state;
    return (
      <AuthenticationPanel
        isPanelMinimum={isPanelMinimum}
        isAccontUrlPresent={isAccontUrlPresent}
        showLoginView={showLoginView}
        accountUrl={accountUrl}
        showAPIKeyView={showAPIKeyView}
        onLoginSuccess={(e) => this.changeView()}
        chnageStates={(val, url) => this.ChnageState(val, url)}
        resetView={(e) => this.resetView()}
      />
    );
  }

  /**
   * To logout user
   */
  logout() {
    ApplicationUtil.logout();
  }

  /**
   * To handle All open work list refresh
   */
  handleRefresh() {
    if (ApplicationUtil.MyWorkListView) {
      ApplicationUtil.MyWorkListView.getList();
    }
  }

  /**
   * To Apply sorting to list view
   * @param {*} type
   */
  ApplySort(sortColumn, sortDirection) {
    let sortObject = {};
    sortObject.sortColumn = sortColumn;
    sortObject.sortDirection = sortDirection;
    this.setState({
      selectedSort: sortColumn,
      selectedSortDirection: sortDirection,
    });
    MyWorkUtil.StorePrefrenceData(sortObject, "sort");
  }

  /**
   * To apply settings to list view
   * @param {*} type
   */
  ApplySettings(columns) {
    let cols = columns.toString();
    MyWorkUtil.StorePrefrenceData(cols, "settings");
    this.setState({ outputColumns: cols });
  }

  /**
   * To handle expand view props
   * @param {*} message
   * @param {*} type
   */
  handleExpandViewProps() {
    this.getAllOpenWorkPrefs();
  }
  /**
   *
   */
  handleShowMessage(message, type) {
    let me = this;
    me.setState({
      message: message,
      showCustomMessage: true,
      messageType: type,
    });
    /**
     * To hide message automatically
     */
    setTimeout(function () {
      me.setState({ showCustomMessage: false });
    }, 3000);
  }

  /**
   * To show dialog view for settings and Sorting
   * @param {*} type
   */
  showListDialog(type) {
    let dialog;
    let me = this;

    let requestParams = {};
    getLocalUserPreferenceData().then((data) => {
      if (data) {
        ApplicationUtil.homeBeanData = data;
      }
      let userId = ApplicationUtil.homeBeanData.loginUserId;
      getLocalAllOpenPreferenceData(userId).then((prefs) => {
        if (prefs && prefs[userId] != undefined) {
          if (prefs[userId] && prefs[userId].outputColumns) {
            requestParams.outputColumns = prefs[userId].outputColumns;
          } else {
            requestParams.outputColumns = MyWorkUtil.defaultAllOpnWorkColumns;
          }
          if (prefs[userId] && prefs[userId].sort) {
            requestParams.sortDirection = prefs[userId].sort.sortDirection;
            requestParams.sortColumn = prefs[userId].sort.sortColumn;
          }
        } else {
          requestParams.outputColumns = MyWorkUtil.defaultAllOpnWorkColumns;
        }
        function getDialog(requestParamData) {
          if (dialog == null) {
            dialog = document.createElement("dialog");
            ReactDOM.render(
              <ListViewDialog
                viewType={ApplicationConstants.OBJECT_TYPE_ALL_OPEN_WORK}
                viewObject={me}
                handleSortApply={(e) => this.ApplySort()}
                handleSettingApply={(columns) => this.ApplySettings(columns)}
                preferences={requestParamData}
                defaultSort={{
                  sortColumn: "workType",
                  sortDirection: "ASC",
                }}
                dropdownList={
                  type == ApplicationConstants.SETTING_OBJECT
                    ? ApplicationUtil.getAllOpenWorkListSettingColumns()
                    : MyWorkUtil.getSortOptionList(
                        requestParamData.outputColumns
                      )
                }
                headerLabel={
                  type == ApplicationConstants.SETTING_OBJECT
                    ? Properties.Setting_label
                    : Properties.Sort_by_label
                }
                headerIcon={
                  type == ApplicationConstants.SETTING_OBJECT
                    ? "images/icon_settings_small.svg"
                    : "images/icon_sort_black.svg"
                }
                type={type}
                dialog={dialog}
              />,
              dialog
            );
          }
          return dialog;
        }
        return document.body.appendChild(getDialog(requestParams)).showModal();
      });
    });
  }

  render() {
    const {
      isAPIKeyPresent,
      showMessage,
      selectedSort,
      selectedSortDirection,
      message,
      showCustomMessage,
      messageType,
      outputColumns,
      isPanelMinimum,
    } = this.state;
    return (
      <panel className={styles.panel + " " + styles.MainPanelDivHeight}>
        <div id={ApplicationConstants.ALL_OPEN_WORK_PANEL_ID}>
          <div className={styles.MainPanelDiv}>
            <SpinnerComp />
            {isAPIKeyPresent && (
              <Fragment>
                <HeaderBar
                  headerLabel={Properties.My_work_label}
                  handleLogout={(e) => this.logout()}
                />
                <ListHeaderBars
                  isPanelMinimum={isPanelMinimum}
                  direction={selectedSortDirection}
                  selectedSortLabel={MyWorkUtil.getOptionWithIndexFromList(
                    MyWorkUtil.getAllOpenWorkListSortList(),
                    selectedSort
                  )}
                  onRefresh={(e) => this.handleRefresh()}
                  ShowDialog={(type) => this.showListDialog(type)}
                />
              </Fragment>
            )}
            <div
              style={
                isAPIKeyPresent
                  ? {
                      height: "calc(100vh - 250px)",
                      overflow: "auto",
                    }
                  : {
                      height: "calc(100vh - 180px)",
                      overflow: "auto",
                    }
              }
            >
              {!isAPIKeyPresent && this.getView()}
              {isAPIKeyPresent && (
                <MyWorkView
                  isPanelMinimum={isPanelMinimum}
                  handleExpandView={(e) => this.handleExpandViewProps()}
                  outputColumns={outputColumns}
                  showOverlayMessage={(msg, type) =>
                    this.handleShowMessage(msg, type)
                  }
                />
              )}
              {showMessage && <FileSave message={Properties.Logout_message} />}
            </div>
            {showCustomMessage && (
              <CustomSnackbar view={messageType} message={message} />
            )}
            <Footer
              showPadding={true}
              showAccountOption={
                ApplicationUtil.applicationUrl == "" ? false : true
              }
            />
          </div>
        </div>
      </panel>
    );
  }
}

module.exports = MyWorkPanelView;
