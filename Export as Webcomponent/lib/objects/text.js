const {toRGB, deleteSpaces} = require("../helper.js");

class Text {

    constructor(text) {
        this.name = text.constructor.name;
        this.id = text.name;
        this.fill = text.fill.value;
        this.x = text.globalDrawBounds.x + 4;
        this.y = text.globalDrawBounds.y -19;
        this.fontstyle = text.fontStyle;
        this.fontfamily = text.fontFamily;
        this.fontsize = text.fontSize;
        this.fontweight = text.fontWeight;
        this.aligment = text.textAlign;
    }

    getID(){
     return this.id;
    }

    getName() {
        return this.name;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getFontColor() {
        return toRGB(this.fill);
    }

    getFontStyle() {
        return this.fontstyle;
    }

    getFontFamily() {
        return this.fontfamily;
    }

    getFontSize() {
        return this.fontsize;
    }

    getFontWeight() {
        return this.fontweight;
    }

    getAlignment() {
        return this.aligment;
    }

    printText() {
        return `Name: ${this.getName()}
                ID: ${deleteSpaces(this.getID())}
                TextFarbe: ${this.getFontColor()}
                TextStyle: ${this.getFontStyle()}
                TextFamilie: ${this.getFontFamily()}
                TextGröße: ${this.getFontSize()}
                TextGewicht: ${this.getFontWeight()}
                Ausrichtung: ${this.getAlignment()}
                x-Achse: ${this.getX()}
                y-Achse: ${this.getY()}`;
    }

}

module.exports = {
    Text
}