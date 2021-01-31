const styles = require("./styles.css");
const Vue = require("vue").default;
const hello = require("./hello.vue").default
const { Text, Color } = require("scenegraph");

let dialog;
function getDialog() {
    if (dialog == null) {
        document.body.innerHTML = `<dialog><div id="container"></div></dialog>`
        dialog = document.querySelector("dialog");
        var app4 = new Vue({
            el: "#container",
            components: { hello },
            render(h) {
                return h(hello, { props: { dialog } })
            }
        })
    }
    return dialog
}

function itemPI(num) {
    return num / 255;
}
function maxFun(r, g, b) {
    return Math.max(r, g, b);
}
function minFun(r, g, b) {
    return Math.min(r, g, b);
}
function delta(max, min) {
    let diff = max - min;
    return Math.abs(diff);
}
function hueFun(r, g, b, delt) {
    let r_ = 60 * ((g - b) / delt % 6);
    let g_ = 60 * ((b - r) / delt + 2);
    let b_ = 60 * ((r - g) / delt + 4);
    let max = maxFun(r_, g_, b_);
    let min = minFun(r_, g_, b_);
    return delta(max, min);
}
function saturationFun(delt, cMax) {
    if (cMax != 0) {
        return delt / cMax;
    } else {
        return 0;
    }
}
function valueFun(r, g, b) {
    return Math.max(r, g, b);
}
function rgbToHSV(r, g, b) {
    /*ronald */
    let r_, g_, b_, max, min, delt, hue, saturation, value;
    r_ = itemPI(r);
    g_ = itemPI(g);
    b_ = itemPI(b);
    cMax = maxFun(r_, g_, b_);
    Cmin = minFun(r_, g_, b_);
    delt = delta(cMax, Cmin)
    hue = hueFun(r_, g_, b_, delt);
    saturation = saturationFun(delt, cMax);
    value = valueFun(r_, g_, b_);
    return [hue, saturation, value];
}
rgbToHSV(255, 0, 0);


function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h, s, l];
}
function hslToRgb(h, s, l) {
    var r, g, b;
    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return [r * 255, g * 255, b * 255];
}
function rgbToHsv(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max;
    var d = max - min;
    s = max == 0 ? 0 : d / max;
    if (max == min) {
        h = 0; // achromatic
    } else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h, s, v];
}
function hsvToRgb(h, s, v) {
    var r, g, b;
    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return [r * 255, g * 255, b * 255];
}
module.exports = {
    commands: {
        menuCommand: function () {
            getDialog().showModal();
        }
    }
};