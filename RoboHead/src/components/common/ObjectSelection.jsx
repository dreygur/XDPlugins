/**
 *
 * Copyright: Copyright (c) 2020 by AQUENT, L.L.C.
 * Company: AQUENT, L.L.C.
 * @created 08-09-2020
 */
const React = require("react");
const Properties = require("../../properties/Properties");
const ApplicationConstants = require("../../constants/ApplicationConstants");
class ObjectSelection extends React.Component {
  render() {
    const { objectType, changeObjectType, refreshList } = this.props;
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          marginLeft: "0px",
        }}
      >
        <select
          style={{ width: "100%", marginLeft: "0px", wordBreak: "break-all" }}
          value={objectType}
          onChange={changeObjectType}
        >
          <option value={ApplicationConstants.OBJECT_TYPE_PROJECT}>
            {Properties.Project_label}
          </option>
          <option value={ApplicationConstants.OBJECT_TYPE_CAMPAIGN}>
            {Properties.Campaign_label}
          </option>
        </select>
      </div>
    );
  }
}

module.exports = ObjectSelection;
