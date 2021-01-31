const React = require('react');
const { Component } = require('react');
const styles = require('../UIDialog.css');
const { appLanguage } = require("application");
const Strings = require('../Dictionaries/'+appLanguage+'.json');

const Mode = (props) => {
  return (
    <div className={styles.modeMainDiv}>
      <label className={styles.modeLabel}>{Strings.MODE_LABEL}</label>
      <div className={`${styles.modeDiv} row`}>
        <div className={styles.highlightModeDiv} id="highMode" onClick={() => props.onModeClick('highMode')} ><h2 className={styles.modeHeader}>{Strings.HIGHLIGHT_LABEL}</h2><p className={styles.paraTag}>{Strings.HIGHLIGHT_DETAIL}<br /><img src="../../img/new-highlight-crop.gif" height="50px" width="215px" className={styles.center} /><br /></p>
        </div>
        <div className={styles.translateModeDiv} id="transMode" onClick={() => props.onModeClick('transMode')} ><h2 className={styles.modeHeader}>{Strings.TRANSLATE_LABEL}</h2><p className={styles.paraTag}>{Strings.TRANSLATE_DETAIL}<br /><img src="../../img/new-translate-crop.gif" height="50px" width="215px" className={styles.center} /><br /></p>
        </div>

      </div>
    </div>
  )
}

module.exports = Mode;
