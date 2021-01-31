/**
 *
 * Copyright: Copyright (c) 2020 by AQUENT, L.L.C.
 * Company: AQUENT, L.L.C.
 * @created 27-10-2020
 */
const React = require("react");
const Properties = require("../../../properties/Properties");
const styles = require("../../../App.css");
const InputFileName = require("../InputFileName");
const CheckboxView = require("../checkbox/CheckboxComponent");
const DateComponent = require("../date/DateComponent");
const ApplicationUtil = require("../../../util/ApplicationUtil");
class ModifyTodoView extends React.Component {
  render() {
    const {
      isToDoComplete,
      handleName,
      handleDesc,
      handleCheckbox,
      todoName,
      handleDay,
      handleMonth,
      handleYear,
      todoDescription,
      record,
      day,
      month,
      year,
    } = this.props;
    return (
      <div>
        <div>
          <div>
            {Properties.To_do_name_label}
            {":"}
            <span style={{ color: "red" }}>*</span>
          </div>
          <InputFileName
            typeString="text"
            styleObject={{ width: "100%", marginLeft: "0px" }}
            valueString={todoName}
            placeholderValue={Properties.Enter_todo_date_label}
            onInputChange={(e) => handleName(e.target.value)}
          />
        </div>
        <div>
          <div>
            {Properties.Due_date_label}
            {":"}
          </div>
          <DateComponent
            record={record}
            day={day}
            month={month}
            year={year}
            handleDay={(e) => handleDay(e)}
            handleMonth={(e) => handleMonth(e)}
            handleYear={(e) => handleYear(e)}
          />
        </div>
        <div>
          <div>
            {Properties.To_Do_description}
            {":"}
          </div>
          <textarea
            style={{ marginLeft: "0px", height: "70px", width: "100%" }}
            placeholder={Properties.Add_description_label}
            onChange={(e) => handleDesc(e.target.value)}
            value={todoDescription}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div>{Properties.Is_ToDo_ocmplete_label}</div>
          <div style={{ marginLeft: "5px" }}>
            <CheckboxView
              isCheked={isToDoComplete}
              chnageEvent={(e) => handleCheckbox(e)}
            />
          </div>
        </div>
      </div>
    );
  }
}

module.exports = ModifyTodoView;
