class Group {

    constructor(group){
        this.name = group.constructor.name;
        this.id = group.name;
        this.x = group.globalDrawBounds.x;
        this.y = group.globalDrawBounds.y;
        this.children = group.children;
    }

    getName() {
        return this.name;
    }

    getID() {
        return this.id;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    printGroup(){
        return `Name: ${this.getName()}
                ID: ${this.getID().trim()}
                x-Achse: ${this.getX()}
                y-Achse: ${this.getY()}
                 Kinder: ${this.children.length}`;
    }

    getChildren(children) {
        if (children.length !== null) {
            let childrenlist = [];
            children.forEach(child => {
                childrenlist.push(child);
            });
            return childrenlist;
        }
    }
}

module.exports = {
    Group
}