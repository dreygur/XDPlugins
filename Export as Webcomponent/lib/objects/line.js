const {toRGB, deleteSpaces} = require("../helper.js");

class Line {

    constructor(line) {
        this.name = line.constructor.name;
        this.id = line.name;
        this.stroke = line.stroke.value;
        this.width = line.boundsInParent.width;
    }

    getName() {
        return this.name;
    }

    getID(){
        return this.id;
    }

    getStrokeColor() {
        return toRGB(this.stroke);
    }

    getWidth() {
        return this.width;
    }

    printObject(){
        return `Name: ${this.getName()}
                ID: ${deleteSpaces(this.getID())}
                Höhe: ${this.getHeight()}
                Breite: ${this.getWidth()}
                Farbe: ${this.getFillColor()}
                Rahmenfarbe: ${this.getStrokeColor()}
                x-Achse: ${this.getX()}
                y-Achse: ${this.getY()}`;
    }

}

module.exports = {
    Line
}
