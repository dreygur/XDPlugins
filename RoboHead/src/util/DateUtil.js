/**
 *
 * Copyright: Copyright (c) 2020 by AQUENT, L.L.C.
 * Company: AQUENT, L.L.C.
 * @created 26-10-2020
 * Date Util. All date related function are here
 *
 */
const React = require("react");
var moment = require("moment");
const Properties = require("../properties/Properties");

const DateUtil = {
  /**
   * this fucntion validate the passwd date and return appropriate error message
   * @param {*} date
   */
  isvalid(date) {
    var dateObject = {};
    var exactDate = moment(date + "T00:00:00");
    if (exactDate.isValid()) {
      return (dateObject.success = true);
    } else {
      if (exactDate.invalidAt()) {
        dateObject.message = DateUtil.getDateValidError(exactDate);
        dateObject.error = true;
        return dateObject;
      }
    }
  },
  /**
   * Returns error message based on date invalid condition
   * @param {*} exactDate
   */
  getDateValidError(exactDate) {
    if (exactDate.invalidAt() == 0) {
      return Properties.Valid_year_error_message;
    } else if (exactDate.invalidAt() == 1) {
      return Properties.Valid_month_error_message;
    } else if (exactDate.invalidAt() == 2) {
      return Properties.Valid_days_error_message;
    } else {
      return Properties.Valid_year_error_message;
    }
  },
  /**
   * To get date which i srequired to pass API -> MM/dd/yyyy
   * @param {*} date
   */
  getRequestDate(date) {
    let dateArray = date.split("T");
    let newdate = dateArray[0];
    let d = newdate.split("-");
    return d[1] + "/" + d[2] + "/" + d[0];
  },
};
module.exports = DateUtil;
