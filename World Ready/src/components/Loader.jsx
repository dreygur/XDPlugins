const React = require('react');
const { Component } = require('react');
const styles = require('../UIDialog.css');
const { appLanguage } = require("application");
const Strings = require('../Dictionaries/'+appLanguage+'.json');

const Loader = (props) => {
  return (
    <div className = {styles.loader} onClick ={() => {props.onLoaderClick()}}>
        <img className = {styles.roller} src="../../img/Rolling.gif" width="56" height="56"></img>
    </div>
  )
}

module.exports = Loader;
