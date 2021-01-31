// import React, { Component } from 'react';
const React = require("react");
const { Component } = require('react');
const styles = require('../UIDialog.css');
const { appLanguage } = require("application");
const Strings = require('../Dictionaries/'+appLanguage+'.json');
const englishStrings = require('../Dictionaries/en.json');

const Header = (props) => {
  const xyz = (e) => {
    props.onHookChange(e.target.selectedIndex);
  }
  return (
    <div className={`${styles.header} row`}>
      <img className={styles.logo} src="../../img/white-logo.png" width="156" height="36" />
      <div className={`${styles.mainDiv} row`}>
        <span className={styles.translateLabel}>{Strings.TRANSLATE_WITH_LABEL} </span>
        <select className={styles.translateDropdown} id="modeOptions" onChange={xyz}>
          <option value={englishStrings.DEFAULT_TRANSLATOR}>{englishStrings.DEFAULT_TRANSLATOR}</option>
          <option value={englishStrings.GOOGLE_TRANSLATE}>{englishStrings.GOOGLE_TRANSLATE}</option>
          <option value={englishStrings.MICROSOFT_TRANSLATE}>{englishStrings.MICROSOFT_TRANSLATE}</option>
        </select>
      </div>
    </div>
  );
}

module.exports = Header;