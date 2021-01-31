/*
Copyright (c) 2019 Fin.Design LLC <contact@fin.design>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

const reactShim = require("./react-shim");
const style = require("./styles.css");
const React = require("react");
const ReactDOM = require("react-dom");
const exportAssets = require("./exportAssets");

class UI extends React.Component {
    constructor(props) {
        super(props);

        this.state = { packageName: props.packageName };

        this.onInputScaleChange = (e) => {
            this.setState({ packageName: e.target.value })
        }

        this.onExportClick = (e) => {
            //default behaviour
            //closes the dialog right away.
            e.preventDefault();

            //export assets
            this.export();
        }

        this.onCancelClick = (e) => {
            e.preventDefault();
            this.props.dialog.close();
        }

        this.export = async() => {
          console.log('exporting...');

          var exp = await exportAssets( this.props.selection,
                                        this.props.root,
                                        this.state.packageName ); //true | false

          this.props.dialog.close();
        }
    }

    componentDidMount() {
        
    }
    
    render() {
        return (
            <form id="custom-exporter">

                <div className="header">                                        
                    <div className="title">
                        <h1>Export Flutter Icons</h1>
                        <p>Export SVG icons from the selected Artboard to the TTF font with accompanied Flutter wrapper-class.</p>
                    </div>     
                    <div className="title">
                        <label>
                            <span>Flutter Font Package Name (Optional)</span>
                            <input value={this.state.packageName} onChange={this.onInputScaleChange} type="text" placeholder="common-ui"/>
                        </label>  
                    </div>                  
                </div>                

                <footer>
                    <button uxp-variant="primary"
                            onClick={this.onCancelClick}>Cancel</button>
                    <button uxp-variant="cta"
                            onClick={this.onExportClick}>Export</button>                                           
                </footer>
                <br/>
                <hr />
                <div className="link">                                              
                    <a href="https://fin.design">Powered by Fin.Design</a>
                </div>
            </form>
        );
    }
}

let dialog;
function getDialog(selection,root) {
    if (dialog == null) {
        dialog = document.createElement("dialog");
        ReactDOM.render(<UI dialog={dialog} selection={selection} root={root}/>, dialog);
    }
    else {
      //re-rendering..
      ReactDOM.render(<UI dialog={dialog} selection={selection} root={root}/>, dialog);
    }
    return dialog
}

module.exports = {
    commands: {
        menuCommand: function (selection,root) {
            document.body.appendChild(getDialog(selection,root)).showModal();
        }
    }
};
