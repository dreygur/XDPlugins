const React = require('react');
const { Component } = require('react');
const styles = require('../UIDialog.css');
const { appLanguage } = require("application");
const Strings = require('../Dictionaries/'+appLanguage+'.json');

const Footer = (props) => {
    const dialog = props.dialog;

    return (
        <div className={styles.footerMainDiv}>
            <div className={styles.footerDiv}>
                <div className={styles.footerDiv}>
                    <button className={styles.cancel} id="cancel" uxp-variant="primary" onClick={() => { return new Promise((resolve, reject) => {dialog.close();  resolve("reasonCanceled") }) }}>{Strings.CANCEL_BUTTON}</button>
                    <button id="undoButton" className={styles.undo} uxp-variant="primary" onClick={async () => { await props.onButtonClick(dialog, true);  dialog.close();}}>{Strings.UNDO_TRANSLATIONS}</button>
                    <button className={styles.transButton} uxp-variant="cta" id="runButton" onClick={async () => { await props.onButtonClick(dialog, false);  }}>{Strings.TRANSLATE_LABEL}</button>
                </div>
            </div>
        </div>
    )
}

module.exports = Footer;
