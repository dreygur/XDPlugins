/**
 *
 * Copyright: Copyright (c) 2020 by AQUENT, L.L.C.
 * Company: AQUENT, L.L.C.
 * @created 08-09-2020
 */
const React = require("react");
const Properties = require("../../../properties/Properties");
const styles = require("../../../App.css");
function FileListView(props) {
  return (
    <div style={{ paddingTop: "10px" }}>
      <div style={{ marginLeft: "8px", paddingBottom: "5px" }}>
        {Properties.Select_file_label}
      </div>
      <div
        style={{
          height: props.height,
        }}
        className={styles.FileListViewCSS}
      >
        {props.list && props.list.length > 0 ? (
          props.list.map((record, i) => {
            return (
              <div
                className={
                  i == props.selectedObjectIndex
                    ? styles.SelectedObjectCSS
                    : styles.MainDiv
                }
                key={i}
                onClick={(e) => props.fileSelection(record, i)}
              >
                <div className={i == 0 ? styles.RowFirst : styles.RowView}>
                  <span>{record.title}</span>
                </div>
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
      </div>
    </div>
  );
}
module.exports = FileListView;
