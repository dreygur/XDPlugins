/**
 *
 * Copyright: Copyright (c) 2020 by AQUENT, L.L.C.
 * Company: AQUENT, L.L.C.
 * @created 08-09-2020
 */
const React = require("react");
const Properties = require("../../../properties/Properties");
const Progress = require("react-progressbar").default;
const styles = require("../../../App.css");
class ProgressBar extends React.Component {
  render() {
    const { percentCompleted } = this.props;
    return (
      <div style={{ paddingBottom: "3px" }}>
        <div>{Properties.File_upload_progress_label}</div>
        <div className={styles.ProgressBarCSS}>
          <Progress color={"#3598EC"} completed={percentCompleted} />
        </div>
      </div>
    );
  }
}

module.exports = ProgressBar;
