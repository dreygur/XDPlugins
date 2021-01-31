/**
 *
 * Copyright: Copyright (c) 2020 by AQUENT, L.L.C.
 * Company: AQUENT, L.L.C.
 * @created 08-09-2020
 */
const React = require("react");
const ReactDOM = require("react-dom");
const Properties = require("../../../properties/Properties");
const Progress = require("react-progressbar").default;
const styles = require("../../../App.css");
const ImageComponent = require("../image/ImageComponent");
const ModifyTodoView = require("./ModifyTodoView");
const ApplicationConstants = require("../../../constants/ApplicationConstants");
const CustomSnackbar = require("../snackbar/CustomSnackbar");
const DateUtil = require("../../../util/DateUtil");
const ApplicationUtil = require("../../../util/ApplicationUtil");
class ModifyToDoDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isToDoComplete: false,
      todoName: "",
      todoDescription: "",
      day: "",
      month: "",
      year: "",
      showMessage: false,
      message: "",
      messageType: "",
      todoDate: "",
      dueDateValue: "",
    };
  }

  /**
   *TO append values in case of modify to-do
   */
  componentDidMount() {
    const { todo } = this.props.record;
    if (todo.title) {
      this.setState({ todoName: todo.title });
    }
    if (todo.description) {
      this.setState({ todoDescription: todo.description });
    }
    if (todo.dueDate) {
      if (todo.dueDate != "")
        this.getUserViewDate(ApplicationUtil.stringToDate(todo.dueDate, true));
    }
  }
  /**
   * To show date with respect to User date format
   * @param {*} date
   */
  getUserViewDate(date) {
    let userFormat = ApplicationUtil.homeBeanData.dateFormat;
    let dateArray = date.split("/");

    if (userFormat == ApplicationConstants.DDMMYYYY_FORMAT) {
      this.setState({
        day: dateArray[0],
        month: dateArray[1],
        year: dateArray[2],
      });
    } else {
      this.setState({
        day: dateArray[1],
        month: dateArray[0],
        year: dateArray[2],
      });
    }
  }

  /**
   * To handle complete todo event
   */
  HandleCheckboxEvent() {
    this.setState({ isToDoComplete: !this.state.isToDoComplete });
  }

  /**
   * To store description
   */
  handleDescription(e) {
    this.setState({ todoDescription: e });
  }

  /**
   * To close dialog
   */
  cancel() {
    this.props.dialog.close();
  }

  /**
   * To perform action dialog submit callback
   */
  onSubmit() {
    let validataion = this.validateFields();
    if (validataion && validataion.isValid) {
      const { dialog, handleSave, record } = this.props;
      const {
        todoName,
        todoDescription,
        todoDate,
        isToDoComplete,
      } = this.state;
      let requestParams = {
        title: todoName,
        description: todoDescription,
        dueDate: todoDate != "" ? todoDate : validataion.date,
        markAsComplete: isToDoComplete
          ? ApplicationConstants.TRUE
          : ApplicationConstants.FALSE,
        todoId: record.todo.id,
      };
      handleSave(requestParams);
      dialog.close();
    }
  }

  resetMessage() {
    /**
     * To hide message automatically
     */
    let me = this;
    setTimeout(function () {
      me.setState({ showMessage: false });
    }, 3000);
  }

  /**
   * To validate to-do required field on submit
   */
  validateFields() {
    let validationObject = {};
    const { todoName, day, month, year } = this.state;
    if (todoName == "") {
      this.setError(Properties.Enter_todo_name_label);
    } else if (day != "" || month != "" || year != "") {
      if (this.validateDate()) {
        let dateOject = DateUtil.isvalid(year + "-" + month + "-" + day);
        if (dateOject.error) {
          this.setError(dateOject.message);
        } else {
          validationObject.isValid = true;
          validationObject.date = month + "/" + day + "/" + year;
          this.setState({ todoDate: month + "/" + day + "/" + year });
          return validationObject;
        }
      }
    } else {
      validationObject.isValid = true;
      return validationObject;
    }
  }

  /**
   * Common error function
   * @param {*} message
   */
  setError(message) {
    this.setState({
      message: message,
      messageType: "error",
      showMessage: true,
    });
    this.resetMessage();
  }

  /**
   * To Set error on date validation
   */
  validateDate() {
    const { day, month, year } = this.state;
    if (day == "") {
      this.setError(Properties.Valid_days_error_message);
    } else if (month == "") {
      this.setError(Properties.Valid_month_error_message);
    } else if (year == "") {
      this.setError(Properties.Valid_year_error_message);
    } else {
      return true;
    }
  }

  /**
   * To handle To-do name
   * @param {*} value
   */
  handleTodoName(value) {
    this.setState({ todoName: value });
  }
  /**
   * To handle day name
   * @param {*} value
   */
  handleTodoDay(e) {
    this.setState({ day: e });
  }
  /**
   * To handle month name
   * @param {*} value
   */
  handleTodoMonth(e) {
    this.setState({ month: e });
  }
  /**
   * To handle year name
   * @param {*} value
   */
  handleTodoYear(e) {
    this.setState({ year: e });
  }

  render() {
    const { type, headerLabel, headerIcon, buttonLabel, record } = this.props;
    const {
      isToDoComplete,
      showMessage,
      message,
      messageType,
      todoName,
      todoDescription,
      dueDateValue,
      day,
      month,
      year,
    } = this.state;
    return (
      <div style={{ padding: "0px", position: "relative" }}>
        <div>
          <div className={styles.ActionDialogCSS}>
            <div className={styles.HeaderDivCSS}>
              <div className={styles.DivMarginCss}>
                <ImageComponent
                  url={headerIcon}
                  styleObject={{
                    width: 18,
                    height: 18,
                    cursor: "pointer",
                  }}
                />
              </div>
              <div style={{ fontWeight: "bold" }}>{headerLabel}</div>
            </div>
          </div>
        </div>
        <div className={styles.MyWorkMainDivCSS}></div>
        <div className={styles.ActionListViewCSS}>
          <ModifyTodoView
            day={day}
            month={month}
            year={year}
            record={record}
            dueDate={dueDateValue}
            todoName={todoName}
            todoDescription={todoDescription}
            isToDoComplete={isToDoComplete}
            handleName={(e) => this.handleTodoName(e)}
            handleDesc={(e) => this.handleDescription(e)}
            handleCheckbox={(e) => this.HandleCheckboxEvent(e)}
            handleDay={(e) => this.handleTodoDay(e)}
            handleMonth={(e) => this.handleTodoMonth(e)}
            handleYear={(e) => this.handleTodoYear(e)}
          />
        </div>
        <footer>
          <button uxp-variant="primary" onClick={(e) => this.cancel()}>
            {Properties.Cancel_button}
          </button>
          <button
            type="submit"
            uxp-variant="cta"
            onClick={(e) => this.onSubmit(type)}
          >
            {buttonLabel}
          </button>
        </footer>
        {showMessage && <CustomSnackbar view={messageType} message={message} />}
      </div>
    );
  }
}

module.exports = ModifyToDoDialog;
