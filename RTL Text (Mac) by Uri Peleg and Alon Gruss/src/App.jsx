//TODO - fix styleToMarkup

const React = require("react");
const styles = require("./App.css");
/*const { useState, useCallback, useEffect } = require("react");

const { editDocument } = require("application");
const { selection, Text, Color } = require("scenegraph");
const assets = require("assets");*/

//let VERBOSE = true;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isTextSelected: false,
      changeWasInput: false,
      textFromInputDocument: "",
      textFromInputTextarea: "",
      markupConvertedToStyle: { text: "", styleArray: "null" },
      color: {
        r: 255,
        g: 0,
        b: 0,
        a: 1,
      },
    };

    this.panel = React.createRef();
    this.documentStateChanged = this.documentStateChanged.bind(this);
    this.setTextFromInputTextarea = this.setTextFromInputTextarea.bind(this);
    this.markupToStyle = this.markupToStyle.bind(this);
    this.styleToMarkup = this.styleToMarkup.bind(this);
  }

  documentStateChanged(selection) {
    if (this.state.changeWasInput) {
      this.setState({
        changeWasInput: false,
      });
    } else {
      if (selection.items.length > 0) {
        const { Text } = require("scenegraph");
        const text = selection.items[0];
        if (text instanceof Text) {
          this.setState({
            isTextSelected: true,
            textFromInputDocument: text.text,
            textFromInputTextarea: this.styleToMarkup(text),
          });
        } else {
          this.setState({
            isTextSelected: false,
          });
        }
      } else {
        this.setState({
          isTextSelected: false,
        });
      }
    }
  }

  setTextFromInputTextarea(input) {
    this.setState(
      {
        changeWasInput: true,
        textFromInputTextarea: input,
        markupConvertedToStyle: this.markupToStyle(input),
      },
      () => {
        const { text, styleArray } = this.state.markupConvertedToStyle;
        const { editDocument } = require("application");
        const { selection, Text } = require("scenegraph");
        if (text) {
          editDocument({ editLabel: "Write text" }, () =>
            selection.items.forEach((item) => {
              item.text = text;
              item.styleRanges = styleArray;
            })
          );
        }
      }
    );
  }

  styleToMarkup(input) {
    let textBuffer = "";
    let currentIndex = 0;
    // run over the styles
    for (let i = 0; i < input.styleRanges.length; i++) {
      // if we find a style with underline
      if (input.styleRanges[i].underline) textBuffer += "~";
      if (input.styleRanges[i].fontStyle === "Italic") textBuffer += "_";
      if (input.styleRanges[i].fontStyle === "Bold") textBuffer += "*";
      textBuffer += input.text.substr(
        currentIndex,
        input.styleRanges[i].length
      );
      if (input.styleRanges[i].fontStyle === "Bold") textBuffer += "*";
      if (input.styleRanges[i].fontStyle === "Italic") textBuffer += "_";
      if (input.styleRanges[i].underline) textBuffer += "~";
      currentIndex += input.styleRanges[i].length;
    }
    return this.beautifyMarkup(textBuffer);
  }

  beautifyMarkup(input) {
    let result = input;
    result = result.replace(/__/g, "");
    result = result.replace(/~~/g, "");
    result = result.replace(/\*\*/g, "");
    return result;
  }

  markupToStyle(markup) {
    let underscoreFlag = false;
    let italicFlag = false;
    let boldFlag = false;
    let textBuffer = "";
    let styleArray = [];
    let styleBuffer;

    function resetStyleBuffer() {
      styleBuffer = {
        length: 0,
        //fontFamily: string,
        fontStyle: italicFlag ? "Italic" : boldFlag ? "Bold" : "Regular",
        //fontSize: number,
        //fill: !Color,
        //charSpacing: number,
        underline: underscoreFlag,
        //strikethrough: boolean,
        //textTransform: string,
        //textScript: string
      };
    }

    // we get a markup text
    // reset style buffer
    resetStyleBuffer();

    // for each letter
    for (let i = 0; i < markup.length; i++) {
      //if we find an underscore
      if (markup.substr(i, 1) === "~") {
        underscoreFlag = !underscoreFlag;

        //push current style buffer to array
        styleArray.push(styleBuffer);

        //reset styleBuffer
        resetStyleBuffer();
      } else if (markup.substr(i, 1) === "_") {
        italicFlag = !italicFlag;

        //push current style buffer to array
        styleArray.push(styleBuffer);

        //reset styleBuffer
        resetStyleBuffer();
      } else if (markup.substr(i, 1) === "*") {
        boldFlag = !boldFlag;

        //push current style buffer to array
        styleArray.push(styleBuffer);

        //reset styleBuffer
        resetStyleBuffer();
      } else {
        // we push text chars only when faced with non-markup chars
        textBuffer += markup[i];
        styleBuffer.length++;
      }
    }

    //push final style buffer to array
    styleArray.push(styleBuffer);

    return { text: textBuffer, styleArray: styleArray };
  }

  render() {
    const { selection } = this.props;
    const {
      color: { r, g, b, a },
    } = this.state;

    return (
      <panel>
        <form onSubmit={() => {}}>
          <h4>Edit your text here:</h4>
          <textarea
            id={"textInput"}
            onSelect={() => {}}
            value={this.state.textFromInputTextarea || ""}
            onChange={(e) => this.setTextFromInputTextarea(e.target.value)}
            disabled={!this.state.isTextSelected}
          />
          <br></br>
          <div>
            <h4>
              <span className={"icon"}>&#128214;</span> Guide
            </h4>
            <p id={"guide"}>
              *text* becomes <span className={"bold"}>text</span>
              <br></br>
              _text_ becomes <span className={"italic"}>text</span>
              <br></br>
              ~text~ becomes <span className={"underline"}>text</span>
            </p>
          </div>
          <footer> </footer>

          {this.state.isTextSelected ? (
            <p></p>
          ) : (
            <div>
              {" "}
              <hr></hr>
              <h4>
                <span className={"icon"}>&#9888;</span> Remember
              </h4>
              <p id={"warning"}>
                This plugin requires you to select a Text object in the
                document. Please select a Text object.
              </p>
            </div>
          )}
          <br></br>
          {/*<h4>Debug</h4>
          {this.state.textFromInputDocument}
          <hr></hr>
          {this.state.textFromInputTextarea}
          <hr></hr>
          {this.state.markupConvertedToStyle.text}*/}
        </form>
      </panel>
    );
  }
}

module.exports = App;
