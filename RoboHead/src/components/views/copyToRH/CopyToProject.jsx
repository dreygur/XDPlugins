/**
 *
 * Copyright: Copyright (c) 2020 by AQUENT, L.L.C.
 * Company: AQUENT, L.L.C.
 * @created 08-09-2020
 */
const React = require("react");
const Properties = require("../../../properties/Properties");
const ObjectListView = require("../../common/ObjectListView");
const FileFormatView = require("../../common/FileFormatView");
const getActiveProjectList = require("../../../services/ProjectService")
  .getActiveProjectList;
const showSpinner = require("../../../util/ApplicationUtil").showSpinner;
const hideSpinner = require("../../../util/ApplicationUtil").hideSpinner;
const getFilename = require("../../../util/ApplicationUtil").getFilename;
const checkInternetConnection = require("../../../util/ApplicationUtil")
  .checkInternetConnection;
const SpinnerComp = require("../../common/Spinner");
const styles = require("../../../App.css");
const getLocalPreferenceData = require("../../../services/LocalStorageService")
  .getLocalPreferenceData;
const { Text, Color, selection } = require("scenegraph");
const ApplicationConstants = require("../../../constants/ApplicationConstants");
const ProgressBar = require("../../common/progressBar/Progress");
const FileSave = require("../../common/FileSave");
const {
  getTempLocation,
  setLocalPreferenceData,
} = require("../../../services/LocalStorageService");
const ApplicationUtil = require("../../../util/ApplicationUtil");
const importFile = require("../../../services/FileService").importFile;
const AddFile = require("../../../services/FileService").AddFile;
const addFiles = require("../../../services/FileService").addFiles;
const scenegraph = require("scenegraph");
const CheckboxComponent = require("../../common/checkbox/CheckboxComponent");
class CopyToProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultFormatView: "pdf",
      list: [],
      searchString: "",
      fileName: "",
      selectedObject: "",
      showError: false,
      errorMessage: "",
      selectedObjectIndex: -1,
      percentCompleted: 0,
      showUploadProgress: false,
      showMessage: false,
      addNewVersion: false,
    };
  }
  componentDidMount() {
    ApplicationUtil.copyToProjectRef = this;
    this.getList();
    ApplicationUtil.setXDFileName(this);
    getLocalPreferenceData().then((data) => this.setPreferences(data));
  }

  setPreferences(preferenceData) {
    if (preferenceData.accountUrl) {
      ApplicationUtil.applicationUrl = preferenceData.accountUrl;
    }
    if (preferenceData.projectAddVersionSelected) {
      this.setState({
        addNewVersion:
          preferenceData.projectAddVersionSelected == "true" ? true : false,
      });
    }
  }

  /**
   * Store selected export file format.
   */
  changeFormat(e) {
    this.setState({ defaultFormatView: e.target.value });
  }
  /**
   * Loads Active project List
   */
  getList() {
    if (checkInternetConnection()) {
      showSpinner();
      getActiveProjectList()
        .then((res) => {
          this.setState({ list: res.List });
          hideSpinner();
        })
        .catch((err) => {
          hideSpinner();
        });
    }
  }
  /**
   * Stores search string
   */
  setSearchString(e) {
    this.setState({ searchString: e.target.value });
  }
  /**
   * Stores export file name
   */
  fileNameChange(e) {
    this.setState({ fileName: e.target.value, showError: false });
  }
  /**
   * To check validation before file export.
   */
  handleCopy() {
    const { selectedObject, fileName } = this.state;
    const { defaultView } = this.props;
    let isArtboardSelected = scenegraph.root.children.length;
    let newFileName = getFilename(fileName);
    let objectTypeMessage = Properties.Project_select_label;
    if (selectedObject == "") {
      this.setState({ showError: true, errorMessage: objectTypeMessage });
    } else if (newFileName == "") {
      this.setState({
        showError: true,
        errorMessage: Properties.Enter_file_name,
      });
    } else if (isArtboardSelected == 0) {
      this.setState({
        showError: true,
        errorMessage: Properties.ArtBoard_not_selected_error,
      });
    } else {
      this.setState({ showError: false });
      getTempLocation().then((folderData) => {
        this.copyFileToRH(folderData.folder, newFileName);
      });
    }
  }
  /**
   * To show progress indicator on file upload
   */
  showprogress() {
    this.setState({ showUploadProgress: true, showMessage: false });
  }
  /**
   * It copies file to RH
   */
  copyFileToRH(folder, fileName) {
    let requestParams = {};
    const { defaultFormatView, selectedObject, addNewVersion } = this.state;
    const { defaultView } = this.props;
    requestParams.folder = folder;
    requestParams.name = fileName;
    requestParams.mode = defaultFormatView;
    requestParams.selection = selection;
    requestParams.id = selectedObject.id;
    requestParams.addVersionByFileName = addNewVersion
      ? ApplicationConstants.TRUE
      : ApplicationConstants.FALSE;
    requestParams.objectType = ApplicationConstants.OBJECT_TYPE_PROJECT;
    if (checkInternetConnection()) {
      importFile(requestParams).then((result) => {
        if (result) {
          this.showprogress();
          let me = this;
          let config = {
            onUploadProgress: function (progressEvent) {
              let percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              if (percentCompleted >= 95) {
                percentCompleted = 95;
              }
              me.setState({
                percentCompleted: percentCompleted,
              });
            },
          };
          requestParams.result = result;
          addFiles(config, requestParams)
            .then((res) => {
              this.setState({
                percentCompleted: 100,
                showUploadProgress: false,
                showMessage: true,
              });
              /**
               * To hide message automatically
               */
              setTimeout(function () {
                me.setState({ showMessage: false });
              }, 5000);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    }
  }
  /**
   * Stores selected Project
   */
  selectedObject(record, index) {
    this.setState({
      selectedObject: record,
      selectedObjectIndex: index,
      showError: false,
    });
  }
  /**
   * It refresh list view
   */
  refreshListView() {
    ApplicationUtil.getList(ApplicationConstants.OBJECT_TYPE_PROJECT);
  }

  /**
   * To handle checkbox chnage event and store checkbox state
   * @param {*} e
   */
  HandleCheckboxEvent(e) {
    this.setState({ addNewVersion: !this.state.addNewVersion }, () => {
      getLocalPreferenceData().then((data) => {
        let prefernceData = {};
        if (data.accountUrl) {
          prefernceData.accountUrl = data.accountUrl;
        }
        if (data.userName) {
          prefernceData.email = data.userName;
        }
        if (data.password) {
          prefernceData.password = data.password;
        }
        if (data.apiKey) {
          prefernceData.userApiToken = data.apiKey;
        }
        if (data.campaignAddVersionSelected) {
          prefernceData.campaignCheckBoxValue =
            data.campaignAddVersionSelected == "true" ? "true" : "false";
          prefernceData.isCampaignView = true;
        }
        prefernceData.isProjectView = true;
        prefernceData.projectCheckBoxValue = this.state.addNewVersion
          ? "true"
          : "false";
        setLocalPreferenceData(prefernceData);
      });
    });
  }

  render() {
    const {
      list,
      searchString,
      defaultFormatView,
      showError,
      errorMessage,
      selectedObjectIndex,
      percentCompleted,
      showUploadProgress,
      showMessage,
      fileName,
      addNewVersion,
    } = this.state;
    const { defaultView, isPanelMinimum, isPanelHeightLess } = this.props;
    return (
      <React.Fragment>
        <SpinnerComp />
        <ObjectListView
          height={isPanelMinimum ? (isPanelHeightLess ? 75 : 200) : 250}
          isPanelMinimum={isPanelMinimum}
          selectedType={defaultView}
          showFileName={true}
          fileName={fileName}
          isNotFromCampaign={true}
          selectedObjectIndex={selectedObjectIndex}
          list={ApplicationUtil.getListWithProjectNumberAppend(list)}
          handleSearchInputChange={(e) => this.setSearchString(e)}
          searchString={searchString}
          handleFileNameInputChange={(e) => this.fileNameChange(e)}
          selectedFormat={defaultFormatView}
          refreshList={(e) => this.refreshListView(e)}
          objectSelection={(record, index) =>
            this.selectedObject(record, index)
          }
        />
        <CheckboxComponent
          labelString={Properties.Add_new_version}
          isCheked={addNewVersion}
          chnageEvent={(e) => this.HandleCheckboxEvent(e)}
        />
        <FileFormatView
          isPanelMinimum={isPanelMinimum}
          formatType={defaultFormatView}
          changeFormatType={(e) => this.changeFormat(e)}
        />
        <div>
          <button
            style={{ marginLeft: "0px", marginTop: "0px" }}
            uxp-variant="cta"
            onClick={(e) => this.handleCopy()}
          >
            {Properties.Export_label}
          </button>
        </div>
        {showUploadProgress && (
          <ProgressBar percentCompleted={percentCompleted} />
        )}
        {showError && (
          <div className={styles.ErrorTextMargin}>
            <span className={styles.ErrorCss}>{errorMessage}</span>
          </div>
        )}
        {showMessage && (
          <FileSave
            isPanelMinimum={isPanelMinimum}
            message={Properties.File_saved_message}
          />
        )}
      </React.Fragment>
    );
  }
}

module.exports = CopyToProject;
