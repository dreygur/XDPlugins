/*
 * Copyright (c) 2018 Peter Flynn
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

/*jshint esnext: true */
/*globals console, require, exports */

var sg = require("scenegraph");
var clipboard = require("clipboard");

function styleToWeight(fontStyle) {
    if (fontStyle.match(/\bBold\b/i)) {
        return "bold";
    } else if (fontStyle.match(/\bBlack\b/i) || fontStyle.match(/\bHeavy\b/i)) {  // TODO: "extra bold"? (move precedence higher if so)
        return 900;
    } else if (fontStyle.match(/\bSemi[- ]?bold\b/i) || fontStyle.match(/\bDemi[- ]?bold\b/i)) {
        return 600;
    } else if (fontStyle.match(/\bMedium\b/i)) {
        return 500;
    } else if (fontStyle.match(/\bLight\b/i)) {
        return 300;
    } else if (fontStyle.match(/\bUltra[- ]light\b/i)) {
        return 200;
    } else {
        return "normal";
    }
}

function styleIsItalic(fontStyle) {
    return (fontStyle.match(/\bItalic\b/i) || fontStyle.match(/\bOblique\b/i));
}

function colorToCSS(solidColor) {
    if (solidColor.a !== 255) {
        return `rgba(${solidColor.r}, ${solidColor.g}, ${solidColor.b}, ${num(solidColor.a/255)})`;
    } else {
        return solidColor.toHex();
    }
}

function num(value) {
    return Math.round(value * 100) / 100;
}
// TODO: omit "px" suffix from 0s

function eq(num1, num2) {
    return (Math.abs(num1 - num2) < 0.001);
}

function copy(selection) {
    var node = selection.items[0];
    if (!node) {
        return;
    }

    var css = "";

    // Size - for anything except point text
    if (!(node instanceof sg.Text && !node.areaBox)) {
        var bounds = node.localBounds;
        css += `width: ${num(bounds.width)}px;\n`;
        css += `height: ${num(bounds.height)}px;\n`;
    }

    // Corner metrics
    if (node.hasRoundedCorners) {
        var corners = node.effectiveCornerRadii;
        var tlbr = eq(corners.topLeft, corners.bottomRight);
        var trbl = eq(corners.topRight, corners.bottomLeft);
        if (tlbr && trbl) {
            if (eq(corners.topLeft, corners.topRight)) {
                css += `border-radius: ${num(corners.topLeft)}px;\n`;
            } else {
                css += `border-radius: ${num(corners.topLeft)}px ${num(corners.topRight)}px;\n`;
            }
        } else {
            css += `border-radius: ${num(corners.topLeft)}px ${num(corners.topRight)}px ${num(corners.bottomRight)}px ${num(corners.bottomLeft)}px;\n`;
        }
    }

    // Text styles
    if (node instanceof sg.Text) {
        var textStyles = node.styleRanges[0];
        if (textStyles.fontFamily.includes(" ")) {
            css += `font-family: "${textStyles.fontFamily}";\n`;
        } else {
            css += `font-family: ${textStyles.fontFamily};\n`;
        }
        css += `font-weight: ${styleToWeight(textStyles.fontStyle)};\n`;
        if (styleIsItalic(textStyles.fontStyle)) {
            css += `font-style: italic;\n`;
        }
        if (textStyles.underline) {
            css += `text-decoration: underline;\n`;
        }
        css += `font-size: ${num(textStyles.fontSize)}px;\n`;
        if (textStyles.charSpacing !== 0) {
            css += `letter-spacing: ${num(textStyles.charSpacing / 1000)}em;\n`;
        }
        if (node.lineSpacing !== 0) {
            css += `line-height: ${num(node.lineSpacing)}px;\n`;
        }
        css += `text-align: ${node.textAlign};\n`;
    }

    // Fill
    var hasBgBlur = (node.blur && node.blur.visible && node.blur.isBackgroundEffect);
    var fillName = (node instanceof sg.Text)? "color" : "background";
    if (node.fill && node.fillEnabled && !hasBgBlur) {
        var fill = node.fill;
        if (fill instanceof sg.Color) {
            css += `${fillName}: ${colorToCSS(fill)};\n`;
        } else if (fill.colorStops) {
            var stops = fill.colorStops.map(stop => {
                return colorToCSS(stop.color) + " " + num(stop.stop * 100) + "%";
            });
            css += `${fillName}: linear-gradient(${ stops.join(", ") });\n`;  // TODO: gradient direction!
        } else if (fill instanceof sg.ImageFill) {
            css += `/* background: url(...); */\n`;
        }
    } else {
        css += `${fillName}: transparent;\n`;
    }

    // Stroke
    if (node.stroke && node.strokeEnabled) {
        var stroke = node.stroke;
        css += `border: ${num(node.strokeWidth)}px solid ${colorToCSS(stroke)};\n`;
        // TODO: dashed lines!
    }

    // Opacity
    if (node.opacity !== 1) {
        css += `opacity: ${num(node.opacity)};\n`;
    }

    // Dropshadow
    if (node.shadow && node.shadow.visible) {
        var shadow = node.shadow;
        var shadowSettings = `${num(shadow.x)}px ${num(shadow.y)}px ${num(shadow.blur)}px ${colorToCSS(shadow.color)}`;
        if (node instanceof sg.Text) {
            css += `text-shadow: ${shadowSettings};\n`;
        } else if (node instanceof sg.Rectangle) {
            css += `box-shadow: ${shadowSettings};\n`;
        } else {
            css += `filter: drop-shadow(${shadowSettings});\n`;
        }
    }

    // Blur
    if (node.blur && node.blur.visible) {
        var blur = node.blur;
        if (blur.isBackgroundEffect) {
            // Blur itself
            var backdropCSS = `backdrop-filter: blur(${blur.blurAmount}px);\n`;
            css += `/* Note: currently only Safari supports backdrop-filter */\n`;
            css += backdropCSS;
            css += `--webkit-` + backdropCSS;

            // Brightness slider
            // XD background blur brightness setting is essentially blending black/white with the blurred background: equivalent to translucent
            // background-color in CSS. (Can't use 'backdrop-filter: brightness()', which just multiplies each RGB value & also causes hue
            // shifts when some channels become saturated).
            if (blur.brightnessAmount > 0) {
                css += `background-color: rgba(255, 255, 255, ${num(blur.brightnessAmount / 100)});\n`;
            } else if (blur.brightnessAmount < 0) {
                css += `background-color: rgba(0, 0, 0, ${-num(blur.brightnessAmount / 100)});\n`;
            }

            // Fill opacity
            if (blur.fillOpacity > 0) {
                // This blends the shape's fill on top of the blurred background (fill itself is unblurred).
                // TODO: support this for solid & gradient fills by baking alpha (& brightnessAmount color) into fill!
                css += `/* (plus shape's fill blended on top as a separate layer with ${num(blur.fillOpacity * 100)}% opacity) */\n`;
            }
        } else {
            css += `filter: ${blur.blurAmount}px;\n`;
        }
    }

    clipboard.copyText(css);
//    console.log(css);
}

exports.commands = {
    copy: copy
};