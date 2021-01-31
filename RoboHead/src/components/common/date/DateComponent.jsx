/**
 *
 * Copyright: Copyright (c) 2020 by AQUENT, L.L.C.
 * Company: AQUENT, L.L.C.
 * @created 28-10-2020
 */
const React = require("react");
const Properties = require("../../../properties/Properties");
const styles = require("../../../App.css");
const ApplicationUtil = require("../../../util/ApplicationUtil");
const ApplicationConstants = require("../../../constants/ApplicationConstants");
class DateComponent extends React.Component {
  /**
   * To handle day value
   * @param {*} e
   */
  handleDayValue(e) {
    this.props.handleDay(e.target.value);
  }
  /**
   * To handle month value
   * @param {*} e
   */
  handleMonthValue(e) {
    this.props.handleMonth(e.target.value);
  }
  /**
   * To handle year value
   * @param {*} e
   */
  handleYearValue(e) {
    this.props.handleYear(e.target.value);
  }
  render() {
    let userFormat = ApplicationUtil.homeBeanData.dateFormat;
    const { day, month, year } = this.props;
    return (
      <div className={styles.MainDateComponent}>
        {userFormat == ApplicationConstants.DDMMYYYY_FORMAT && (
          <React.Fragment>
            <div>
              <input
                value={day}
                className={styles.DayCss}
                type={"text"}
                placeholder={Properties.Day_label}
                onChange={(e) => this.handleDayValue(e)}
              />
            </div>
            <div>
              <input
                value={month}
                className={styles.MonthComponentCss}
                type={"text"}
                placeholder={Properties.Month_label}
                onChange={(e) => this.handleMonthValue(e)}
              />
            </div>
            <div>
              <input
                value={year}
                className={styles.YearComponentCss}
                type={"text"}
                placeholder={Properties.Year_label}
                onChange={(e) => this.handleYearValue(e)}
              />
            </div>
          </React.Fragment>
        )}
        {userFormat == ApplicationConstants.MMDDYYYY_FORMAT && (
          <React.Fragment>
            <div>
              <input
                value={month}
                className={styles.NewMonthCss}
                type={"text"}
                placeholder={Properties.Month_label}
                onChange={(e) => this.handleMonthValue(e)}
              />
            </div>
            <div>
              <input
                value={day}
                className={styles.NewDayComponent}
                type={"text"}
                placeholder={Properties.Day_label}
                onChange={(e) => this.handleDayValue(e)}
              />
            </div>
            <div>
              <input
                value={year}
                className={styles.YearComponentCss}
                type={"text"}
                placeholder={Properties.Year_label}
                onChange={(e) => this.handleYearValue(e)}
              />
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}

module.exports = DateComponent;
