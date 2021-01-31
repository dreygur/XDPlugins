/**
 *
 * Copyright: Copyright (c) 2020 by AQUENT, L.L.C.
 * Company: AQUENT, L.L.C.
 * @created 08-09-2020
 */
const React = require("react");
const Properties = require("../../properties/Properties");
const InputFileName = require("./InputFileName");
const styles = require("../../App.css");
const ApplicationConstants = require("../../constants/ApplicationConstants");

function ListComp(props) {
  const { isPanelMinimum } = props;
  return (
    <div style={{ marginTop: "-5px" }}>
      {isPanelMinimum && (
        <div className={styles.FileNameCSS}>
          {props.selectedType == ApplicationConstants.OBJECT_TYPE_PROJECT
            ? Properties.Project_name
            : Properties.Campaign_name}
          {":"}
        </div>
      )}
      <div style={{ display: "flex", marginTop: "0px" }}>
        <InputFileName
          typeString="text"
          styleObject={{ width: "100%", marginLeft: "0px", marginTop: "0px" }}
          value={props.searchString}
          placeholderValue={
            isPanelMinimum
              ? ""
              : props.selectedType == ApplicationConstants.OBJECT_TYPE_PROJECT
              ? Properties.Enter_search_project_text
              : Properties.Enter_search_campaign_text
          }
          onInputChange={(e) => props.handleSearchInputChange(e)}
        />
      </div>

      <div
        style={{
          cursor: "pointer",
          height: props.height,
          overflow: "scroll",
          border: "1px solid #D3D3D3",
        }}
      >
        {props.list && props.list.length > 0 ? (
          props.searchString != "" ? (
            props.list
              .filter((record) =>
                record.nameWithNumber
                  .toLowerCase()
                  .includes(props.searchString.toLowerCase())
              )
              .map((record, i) => {
                return (
                  <div
                    className={
                      i == props.selectedObjectIndex
                        ? styles.SelectedObjectCSS
                        : styles.MainDiv
                    }
                    key={i}
                    onClick={(e) => props.objectSelection(record, i)}
                  >
                    <div
                      className={
                        i == props.selectedObjectIndex
                          ? styles.SelectedObjectRowCSS
                          : i == 0
                          ? styles.RowFirst
                          : styles.RowView
                      }
                    >
                      <span>{record.name}</span>
                      {props.isNotFromCampaign &&
                        record.formattedProjectNumber != "" && (
                          <span>
                            {" ("}
                            {record.formattedProjectNumber}
                            {")"}
                          </span>
                        )}
                    </div>
                  </div>
                );
              })
          ) : (
            props.list.map((record, i) => {
              return (
                <div
                  className={
                    i == props.selectedObjectIndex
                      ? styles.SelectedObjectCSS
                      : styles.MainDiv
                  }
                  key={i}
                  onClick={(e) => props.objectSelection(record, i)}
                >
                  <div
                    className={
                      i == props.selectedObjectIndex
                        ? styles.SelectedObjectRowCSS
                        : i == 0
                        ? styles.RowFirst
                        : styles.RowView
                    }
                  >
                    <span>{record.name}</span>
                    {props.isNotFromCampaign &&
                      record.formattedProjectNumber != "" && (
                        <span>
                          {" ("}
                          {record.formattedProjectNumber}
                          {")"}
                        </span>
                      )}
                  </div>
                </div>
              );
            })
          )
        ) : (
          <React.Fragment>
            <div style={{ padding: "15px 8px 15px 8px" }}>
              {Properties.Grid_emptyText}
            </div>
          </React.Fragment>
        )}
      </div>
      {props.showFileName && (
        <React.Fragment>
          <div className={styles.FileNameCSS}>
            {Properties.File_name_label}:
          </div>
          <div style={{ marginTop: "5px" }} className={styles.FlexCSS}>
            <InputFileName
              typeString="text"
              valueString={isPanelMinimum ? "" : props.fileName}
              styleObject={{
                width: "90%",
                marginLeft: "0px",
                marginTop: "0px",
              }}
              placeholderValue={
                isPanelMinimum ? "" : Properties.Enter_file_name_label
              }
              onInputChange={(e) => props.handleFileNameInputChange(e)}
            />
            <div style={{ marginLeft: "-5px" }}>
              {"."}
              {props.selectedFormat}
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}
module.exports = ListComp;
