const {selection} = require("scenegraph");
const {createHTML} = require("./createHTMLstructur");
const {getStyleText} = require("./createCss");

//string with first letter as uppercase
function getClassName(componentname) {
    let compname = getCssName(componentname);
    const upper = compname.replace(/^\w/, c => c.toUpperCase());
    return upper;
}

function getCssName(componentname) {
    let compname = componentname;
    let array = compname.split('-');
    let substring1 = array[0];
    let substring2 = array[1];
    let cssname = substring1 + substring2;
    return cssname;
}

function createJSfile(componentname, sortedArray,itemMap,startTag) {

    return `//TODO: Folgendes in das HTML Dokument einpflegen: <script src="${componentname}.js"></script> und den tag mit in die custom tags aufnehmen

    const template = document.createElement('template'); 
    template.innerHTML = \`
    <link rel="stylesheet" href="${componentname.split("-")[0] + componentname.split("-")[1]}-style.css">
    
    ${createHTML(sortedArray,itemMap,startTag)}
    \`;

    class ${getClassName(componentname)} extends HTMLElement {
        constructor() {
            super();
    
            this.attachShadow({mode: 'open'});
            this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
    
    function(){
    window.alert("dummy-function. Please give me a good name and do something great here!");
    }

    connectedCallback() {
        this.shadowRoot.querySelector('#id-name').addEventListener('click',() => this.function());
    }

    disconnectedCallback() {
        this.shadowRoot.querySelector('#id-name').removeEventListener();
    }
}

customElements.define('${componentname}', ${getClassName(componentname)});`
}

module.exports = {
    createJSfile,
    getStyleText
};