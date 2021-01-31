const scenegraph = require("scenegraph");
var assets = require("assets");

class NodeUtils {

    constructor(selection, root) {
        this.selection = selection;
        this.root = root;
        this.properties = {
            localization: [],
            image: [],
            color: [],
            appicon: []
        }
    }

    getProperties(fromRoot, interestedInResources) {
        this.interestedInResources = interestedInResources;
        if (fromRoot) {
            this.getPropertiesRecursively(this.root.children, "");
        } else {
            this.getPropertiesRecursively(this.selection.items, "");
        }

        this.getColor();
        return this.properties;
    }

    getPropertiesRecursively(nodeList, hierarchyPath) {
        nodeList.forEach((node) => {
            if (node.markedForExport && (this.interestedInResources.image || (this.interestedInResources.appicon && this.isAppicon(node))) && !(node instanceof scenegraph.Text)) {
                this.properties.image.push(node);
            }
            else if (node.children.length > 0) {
                if (hierarchyPath.length > 0) hierarchyPath += "_"
                hierarchyPath += node.name;
                this.getPropertiesRecursively(node.children, hierarchyPath);
            }
            else {
                this.getLocalization(node, hierarchyPath);
            }
        })
    }

    getColor() {
        if (!this.interestedInResources.color) return;

        assets.colors.get().forEach(color => {
            if (this.isColorAsset(color)) {
                const hexa = color.color.value;
                var components = {
                    a: 255,
                    r: (hexa & 0xff0000) >> 16,
                    g: (hexa & 0x00ff00) >> 8,
                    b: (hexa & 0x0000ff)
                };

                this.properties.color.push({ key: color.name, argb: components });
            }
            else if (this.isGradientAsset(color)) {
                const name = color.name;
                color.colorStops.forEach(stop => {
                    const hexa = stop.color.value
                    var components = {
                        a: 255,
                        r: (hexa & 0xff0000) >> 16,
                        g: (hexa & 0x00ff00) >> 8,
                        b: (hexa & 0x0000ff)
                    };

                    this.properties.color.push({ key: `${name}${stop.stop}`, argb: components });
                });
            }
        })
    }

    argb(color) {
        return { argb: [color.a, color.r, color.g, color.b] };
    }

    isColorAsset(color) {
        if (typeof color !== "object" || color === null) return false;
        return typeof color.color === "object" && typeof color.color.value === "number";
    }

    isGradientAsset(color) {
        if (typeof color !== "object" || color === null) return false;
        return typeof color.gradientType === "string" && typeof color.colorStops === "object";
    }

    getLocalization(node, key) {
        if (!this.interestedInResources.localization) return;

        if (node instanceof scenegraph.Text) {
            if (!this.isPushlocalization(node.name)) return;
            this.properties.localization.push({ id: `adobexd_${node.guid}`, key: `${node.name}`, value: node.text });
        }
    }

    isPushlocalization(localization) {
        if(localization.toString().includes('#respresso-ignore')) return false;
        return localization && !this.properties.localization.some(loc => localization === loc.key);
    }

    isAppicon(node) {
        return node.name === "App icon single" || node.name === "App icon background" || node.name === "App icon foreground"
    }
}

module.exports = NodeUtils;