class Constant {
    constructor(){}

    static get baseUrl() {
        return "/api/integration/v1";
    }

    static get info() {
        return `${this.baseUrl}/info`;
    }

    static get config() {
        return `${this.baseUrl}/config`;
    }

    static get preview() {
        return `${this.baseUrl}/import/preview`;
    }

    static get export() {
        return `${this.baseUrl}/import`;
    }
}

module.exports = Constant;