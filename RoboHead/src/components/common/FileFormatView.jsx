/**
 *
 * Copyright: Copyright (c) 2020 by AQUENT, L.L.C.
 * Company: AQUENT, L.L.C.
 * @created 08-09-2020
 */
const React = require("react");
const ApplicationConstants = require("../../constants/ApplicationConstants");
const Properties = require("../../properties/Properties");
class FileFormatView extends React.Component {
  render() {
    const { formatType, changeFormatType, isPanelMinimum } = this.props;
    return (
      <React.Fragment>
        <div
          style={
            isPanelMinimum
              ? { width: "100%" }
              : {
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                }
          }
        >
          <div style={{ fontSize: "12px !important" }}>
            {Properties.Format_label}
          </div>

          <select
            style={
              isPanelMinimum
                ? { width: "100%", marginTop: "0px", marginLeft: "0px" }
                : { width: "65%", marginTop: "10px", marginLeft: "2px" }
            }
            value={formatType}
            onChange={changeFormatType}
          >
            <option value={ApplicationConstants.EXPORT_TYPE_PNG}>
              {Properties.PNG_label}
            </option>
            <option value={ApplicationConstants.EXPORT_TYPE_SVG}>
              {Properties.SVG_label}
            </option>
            <option value={ApplicationConstants.EXPORT_TYPE_PDF}>
              {Properties.PDF_label}
            </option>
            <option value={ApplicationConstants.EXPORT_TYPE_JPG}>
              {Properties.JPG_label}
            </option>
          </select>
        </div>
      </React.Fragment>
    );
  }
}

module.exports = FileFormatView;
