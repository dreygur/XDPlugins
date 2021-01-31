const React = require('react');
const { Component } = require('react');
const styles = require('../UIDialog.css');
const { appLanguage } = require("application");
const Strings = require('../Dictionaries/'+appLanguage+'.json');

const Langs = (props) => {
    let isUxp3 = props.isUxp3;
    return (
        <div>
            <label className={styles.langLabel}>{Strings.LANGUAGES_LABEL}</label>
            <div id="supportedLangs" className={styles.suppLangMainDiv}>
                <div className={`${styles.langSetDiv} row`}>
                    <div className={`${styles.langSetDiv} ${styles.langSetCol} row`}>
                        <input className={isUxp3 ? null : styles.langInput} id="de_DE" type="checkbox" onChange={() => { props.onCheckedChange('de_DE', 'German', true); }} />
                        <label className={isUxp3 ? styles.textAlignLeft : styles.langSetLabel} onClick={() => props.onCheckedChange('de_DE', 'German', false)}>German</label>
                    </div>
                    <div className={`${styles.langSetDiv} ${styles.langSetCol} row`}>
                        <input className={isUxp3 ? null : styles.langInput} id="fr_FR" type="checkbox" onChange={() => { props.onCheckedChange('fr_FR', 'French', true); }} />
                        <label className={isUxp3 ? styles.textAlignLeft : styles.langSetLabel} onClick={() => { props.onCheckedChange('fr_FR', 'French', false) }}>French</label>
                    </div>
                    <div className={`${styles.langSetDiv} ${styles.langSetCol} row`}>
                        <input className={isUxp3 ? null : styles.langInput} id="ja_JP" type="checkbox" onChange={() => { props.onCheckedChange('ja_JP', 'Japanese', true); }} />
                        <label className={isUxp3 ? styles.textAlignLeft : styles.langSetLabel} onClick={() => { props.onCheckedChange('ja_JP', 'Japanese', false) }}>Japanese</label>
                    </div>
                </div>
                <div className={`${styles.langSetDiv} row`}>
                    <div className={`${styles.langSetDiv} ${styles.langSetCol} row`}>
                        <input className={isUxp3 ? null : styles.langInput} id="es_ES" type="checkbox" onChange={() => { props.onCheckedChange('es_ES', 'Spanish', true); }} />
                        <label className={isUxp3 ? styles.textAlignLeft : styles.langSetLabel} onClick={() => { props.onCheckedChange('es_ES', 'Spanish', false) }}>Spanish</label>
                    </div>
                    <div className={`${styles.langSetDiv} ${styles.langSetCol} row`}>
                        <input className={isUxp3 ? null : styles.langInput} id="it_IT" type="checkbox" onChange={() => { props.onCheckedChange('it_IT', 'Italian', true); }} />
                        <label className={isUxp3 ? styles.textAlignLeft : styles.langSetLabel} onClick={() => { props.onCheckedChange('it_IT', 'Italian', false) }} >Italian</label>
                    </div>
                    <div className={`${styles.langSetDiv} ${styles.langSetCol} row`}>
                        <input className={isUxp3 ? null : styles.langInput} id="zh_CN" type="checkbox" onChange={() => { props.onCheckedChange('zh_CN', 'Chinese Simplified', true); }} />
                        <label className={isUxp3 ? styles.textAlignLeft : styles.langSetLabel} onClick={() => { props.onCheckedChange('zh_CN', 'Chinese Simplified', false) }}>Chinese Simplified</label>
                    </div>
                </div>
                <div className={`${styles.langSetDiv} row`}>
                    <div className={`${styles.langSetDiv} ${styles.langSetCol} row`}>
                        <input className={isUxp3 ? null : styles.langInput} id="ko_KR" type="checkbox" onChange={() => { props.onCheckedChange('ko_KR', 'Korean', true); }} />
                        <label className={isUxp3 ? styles.textAlignLeft : styles.langSetLabel} onClick={() => { props.onCheckedChange('ko_KR', 'Korean', false) }}>Korean</label>
                    </div>
                    <div className={`${styles.langSetDiv} ${styles.langSetCol} row`}>
                        <input className={isUxp3 ? null : styles.langInput} id="ru_RU" type="checkbox" onChange={() => { props.onCheckedChange('ru_RU', 'Russian', true); }} />
                        <label className={isUxp3 ? styles.textAlignLeft : styles.langSetLabel} onClick={() => { props.onCheckedChange('ru_RU', 'Russian', false) }}>Russian</label>
                    </div>
                    <div className={`${styles.langSetDiv} ${styles.langSetCol} row`}>
                        <input className={isUxp3 ? null : styles.langInput} id="tr_TR" type="checkbox" onChange={() => { props.onCheckedChange('tr_TR', 'Turkish', true); }} />
                        <label className={isUxp3 ? styles.textAlignLeft : styles.langSetLabel} onClick={() => { props.onCheckedChange('tr_TR', 'Turkish', false) }}>Turkish</label>
                    </div>
                </div>
                <div className={`${styles.langSetDiv} row`}>
                    <div className={`${styles.langSetDiv} ${styles.langSetCol} row`}>
                        <input className={isUxp3 ? null : styles.langInput} id="uk_UA" type="checkbox" onChange={() => { props.onCheckedChange('uk_UA', 'Ukrainian', true); }} />
                        <label className={isUxp3 ? styles.textAlignLeft : styles.langSetLabel} onClick={() => { props.onCheckedChange('uk_UA', 'Ukrainian', false) }}>Ukrainian</label>
                    </div>
                    <div className={`${styles.langSetDiv} ${styles.langSetCol} row`}>
                        <input className={isUxp3 ? null : styles.langInput} id="fi_FI" type="checkbox" onChange={() => { props.onCheckedChange('fi_FI', 'Finnish', true); }} />
                        <label className={isUxp3 ? styles.textAlignLeft : styles.langSetLabel} onClick={() => { props.onCheckedChange('fi_FI', 'Finnish', false) }}>Finnish</label>
                    </div>
                    <div className={`${styles.langSetDiv} ${styles.langSetCol} row`}>
                        <input className={isUxp3 ? null : styles.langInput} id="pt_BR" type="checkbox" onChange={() => { props.onCheckedChange('pt_BR', 'Brazilian Portuguese', true); }} />
                        <label className={isUxp3 ? styles.textAlignLeft : styles.langSetLabel} onClick={() => { props.onCheckedChange('pt_BR', 'Brazilian Portuguese', false) }}>Brazilian Portuguese</label>
                    </div>
                </div>
                <div className={`${styles.langSetDiv} row`}>
                    <div className={`${styles.langSetDiv} ${styles.langSetCol} row`}>
                        <input className={isUxp3 ? null : styles.langInput} id="nl_NL" type="checkbox" onChange={() => { props.onCheckedChange('nl_NL', 'Dutch', true); }} />
                        <label className={isUxp3 ? styles.textAlignLeft : styles.langSetLabel} onClick={() => { props.onCheckedChange('nl_NL', 'Dutch', false) }}>Dutch</label>
                    </div>
                    <div className={`${styles.langSetDiv} ${styles.langSetCol} row`}>
                        <input className={isUxp3 ? null : styles.langInput} id="sv_SE" type="checkbox" onChange={() => { props.onCheckedChange('sv_SE', 'Swedish', true); }} />
                        <label className={isUxp3 ? styles.textAlignLeft : styles.langSetLabel} onClick={() => { props.onCheckedChange('sv_SE', 'Swedish', false) }}>Swedish</label>
                    </div>
                    <div className={`${styles.langSetDiv} ${styles.langSetCol} row`}>
                        <input className={isUxp3 ? null : styles.langInput} id="en_US" type="checkbox" onChange={() => { props.onCheckedChange('en_US', 'English', true); }} />
                        <label className={isUxp3 ? styles.textAlignLeft : styles.langSetLabel} onClick={() => { props.onCheckedChange('en_US', 'English', false) }}>English</label>
                    </div>
                </div>
            </div>
        </div>
    )
}

module.exports = Langs;
