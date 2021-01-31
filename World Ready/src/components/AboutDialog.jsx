const React = require('react');
const { appLanguage } = require("application");
const Strings = require('../Dictionaries/'+appLanguage+'.json');
const styles = require('../UIDialog.css');
const AboutDialog = (props) => {
    const dialog = props.dialog;
    return (
        <form method="dialog" width = "750px" height = "600px">
            <div id = "content" className={styles.aboutDiv}></div>
            <footer>
                <button uxp-variant="cta" onClick={() => { dialog.close() }}>{Strings.OK_BUTTON}</button>
            </footer>
        </form>
    )

}

module.exports = AboutDialog;