
const { alert, error } = require("./lib/dialogs.js");
var {Color} = require("scenegraph");



const palette =[
    ["white", '#ffffff'],
    ["grey-4", '#f8f8f8'],
    ["grey-3", '#dee0e2'],
    ["grey-2", '#bfc1c3'],
    ["grey-1", '#6f777b'],
    ["black", '#0b0c0c'],
    ["blue", '#005ea5'],
    ["light-blue", '#2b8cc4'],
    ["turquoise", '#28a197'],
    ["green", '#006435'],
    ["green (button)", '#00823b'],
    ["light-green", '#85994b'],
    ["yellow", '#ffbf47'],
    ["brown", '#b58840'],
    ["orange", '#f47738'],
    ["bright-red", '#df3034'],
    ["red", '#b10e1e'],
    ["light-pink", '#f499be'],
    ["pink", '#d53880'],
    ["bright-purple", '#912b88'],
    ["light-purple", '#6f72af'],
    ["purple", '#2e358b'],
    ["purple (visited link)", '#4c2c92']
];

function addPalette() {
    var i = 0;
    var len = palette.length;
    for (i=0; i<len; i++){
        addColor(palette[i])
    }
}



function addColor(array) {
    var assets = require("assets");
    var label = array[0] + ' ('+array[1]+')';
    var color = new Color(array[1]);
    assets.colors.add([
        { name: label, color: color }
    ]);

}

module.exports = {
    commands: {
        addPalette
    }
};
