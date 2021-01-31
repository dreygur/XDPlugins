// [1]
const React = require("react");
// [2]
const { Text, Color } = require("scenegraph");

// [3]
class HelloForm extends React.Component {
  // [4]
  constructor(props) {
    super(props);
    this.state = { name: "" }; // [5]

    // [6]
    this.onInputChange = e => {
      this.setState({ name: e.target.value });
    };

    // [7]
    this.onDoneClick = e => {
      // [8]
      const selection = this.props.selection;
      // [9]
      const newText = new Text();
      newText.text = this.state.name;
      // [10]
      newText.styleRanges = [
        {
          length: newText.text.length,
          fill: new Color("#00F"),
          fontSize: 50
        }
      ];

      // [11]
      selection.insertionParent.addChild(newText);
      // [12]
      newText.moveInParentCoordinates(100, 100);
      // [13]
      props.dialog.close();
    };
  }

  // [14]
  render() {
    return (
      <form style={{ width: 300 }} onSubmit={this.onDoneClick}>
        <h1>React with JSX Components</h1>
        <label>
          <span>What is your name?</span>
          <input onChange={this.onInputChange} />
        </label>
        <p>{`Hello ${this.state.name}`}</p>
        <footer>
          <button type="submit" uxp-variant="cta">
            Done
          </button>
        </footer>
      </form>
    );
  }
}

module.exports = HelloForm;
