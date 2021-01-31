const React = require('react');
const { appLanguage } = require("application");
const Strings = require('../Dictionaries/'+appLanguage+'.json');

const MessageDialog = (props) => {
    const dialog = props.dialog;
    return (
        <form method="dialog">
            <h1>{props.title}</h1>
            <p>{props.msg}</p>
            <footer>
                <button uxp-variant="cta" onClick={() => { dialog.close() }}>{Strings.OK_BUTTON}</button>
            </footer>
        </form>
    )

}

module.exports = MessageDialog;