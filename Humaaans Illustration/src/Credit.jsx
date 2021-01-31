const React = require("react");

class Credit extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <div className="pablo">
          <div className="header-item">
            <span>Humaaans by</span>
            <a className="" href="https://twitter.com/pablostanley">
              Pablo Stanley
            </a>
          </div>
          <button
            uxp-variant="secondary"
            onClick={() => {
              this.props.dialog.close();
            }}
          >
            Close
          </button>
        </div>
        <p>
          Use the premade people illustrations or mix-&-match illustrations to
          create your own unique work.
        </p>
        <p className="tkmadeit">
          Plugin by ― <a href="https://twitter.com/tkmadeit"> @tkmadeit</a>
        </p>
      </div>
    );
  }
}
module.exports = Credit;
