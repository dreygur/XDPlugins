/**
 *
 * Copyright: Copyright (c) 2020 by AQUENT, L.L.C.
 * Company: AQUENT, L.L.C.
 * @created 15-10-2020
 */
const React = require("react");
const Properties = require("../../../properties/Properties");
const Progress = require("react-progressbar").default;
const styles = require("../../../App.css");
class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowRow: false,
    };
  }

  /**
   * To show dropdown on click and close on away click
   */
  showDropDown() {
    this.setState({ isShowRow: !this.state.isShowRow });
    let me = this;
    var specifiedElement = document.getElementById(
      "dropdownBtn" + this.props.id
    );
    document.addEventListener("click", function (event) {
      var isClickInside = specifiedElement.contains(event.target);
      if (!isClickInside) {
        me.setState({ isShowRow: false });
      }
    });
  }
  render() {
    const { dropdownList, clickedAction, isPanelMinimum } = this.props;
    return (
      <div id={"dropdownBtn" + this.props.id} className={styles.dropdown}>
        <div onClick={(e) => this.showDropDown()}>
          <img
            src={"images/pulldown.svg"}
            style={{ height: 17, width: 17 }}
            alt="status"
          />
        </div>
        {this.state.isShowRow && (
          <div
            className={
              isPanelMinimum
                ? styles.SmalldropdownContentCSS
                : styles.dropdownContentCSS
            }
            style={{ backgroundColor: "#ffffff", border: "1px solid #CECECE" }}
          >
            {dropdownList.map((record, i) => {
              return (
                <div
                  key={i}
                  className={
                    isPanelMinimum
                      ? styles.MainActionDivLess
                      : styles.MainActionDiv
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    clickedAction(record);
                    this.setState({ isShowRow: false });
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div>
                      <img
                        src={record.icon}
                        style={{ height: 17, width: 17 }}
                        alt="status"
                      />
                    </div>
                    <div style={{ marginLeft: "3px", marginTop: "0px" }}>
                      {record.name}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}

module.exports = Dropdown;
