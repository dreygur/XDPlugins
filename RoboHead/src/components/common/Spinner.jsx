/**
 *
 * Copyright: Copyright (c) 2020 by AQUENT, L.L.C.
 * Company: AQUENT, L.L.C.
 * @created 08-09-2020
 */
const React = require("react");
class Spinner extends React.Component {
  constructor() {
    super();
    this.SpinnerEle = React.createRef();
  }

  render() {
    Spinner.SpinnerEle = this.SpinnerEle;
    return (
      <div
        id="spinnerDiv"
        ref={this.SpinnerEle}
        style={{
          position: "fixed",
          width: "100%",
          height: "100%",
          zIndex: "9999",
          display: "none",
          background: "#7169694a",
        }}
      >
        <img
          style={{
            top: "calc(50% - 27px)",
            left: "calc(50% - 27px)",
            position: "absolute",
            background: "#fff",
            borderRadius: 30,
            padding: 7,
            boxShadow:
              "0 2px 5px 0 rgba(0, 0, 0, 0.44), 0 2px 7px 0 rgba(0, 0, 0, 0.44)",
          }}
          src={"images/loading.gif"}
          alt="loading..."
        />
      </div>
    );
  }
}
module.exports = Spinner;
