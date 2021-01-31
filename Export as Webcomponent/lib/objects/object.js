const {toRGB, deleteSpaces} = require("../helper.js");

class Object {

    constructor(object) {
        this.name = object.constructor.name;
        this.id = object.name;
        this.fill = object.fill.value;
        this.stroke = object.stroke.value;
        this.width = object.width;
        this.height = object.height;
    }

    getName() {
        return this.name;
    }

    getID(){
        return this.id;
    }

    getFillColor() {
        return toRGB(this.fill);
    }

    getStrokeColor() {
        return toRGB(this.stroke);
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
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
    Object
}
