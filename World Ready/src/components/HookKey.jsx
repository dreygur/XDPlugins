const React = require('react');
const { Component } = require('react');
const styles = require('../UIDialog.css');
var shell = require("uxp").shell;
const { appLanguage } = require("application");
const Strings = require('../Dictionaries/'+appLanguage+'.json');

const HookKey = (props) => {
    return (
        <div className={styles.hookKeyDiv}>
            <div id="noteLabel" className={`${styles.noteLabelDiv} row`} onClick={() => { shell.openExternal("https://www.microsoft.com/en-us/translator/attribution.aspx") }}>
                <span className={styles.noteLabelLine}>{Strings.ADOBE_TRANSLATION_LIMIT}</span>
                <img src="../../img/micro_logo.png" height="20" className={styles.adobeImage} />
            </div>
            <div id="apiLabel" className={styles.keyInput}>
                <div className={`${styles.hookLogo} row`}>
                    <img className={styles.googleLogo} id="googleLogo" src="../../img/google_logo.png" height="18" />
                    <img className={styles.googleLogo} id="microLogo" src="../../img/micro_logo.png" height="18" />
                    <label className={styles.apiKeyLabel}>{Strings.API_KEY_LABEL}</label>
                </div>
                <div className={`${styles.apiKeyDiv} row`}>
                    <input className={styles.apiKeyInput} type="text" id="apiKeyInput" onInput={(e) => props.onHookInput(e.target.value)} />
                    <a id="apiLink" className={styles.apiLink}><img src="../../img/ques.png" width="20" height="20" /></a>
                </div>
            </div>
        </div>
    )
}

module.exports = HookKey;
