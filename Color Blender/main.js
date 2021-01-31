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
const {Rectangle, Color} = require("scenegraph"); 
const commands = require("commands");

const DIALOG_CANCELED = "reasonCanceled";

var lastNumSteps = 3;


function menuHandler(selection) {
    if (selection.items.length < 2) {
        return showOnboarding();

    } else if (selection.items.length === 2) {
        if (!checkFillType(selection.items[0].fill, selection.items[1].fill)) { return; }

        return showCloneSettings().then(function (nCopies) {
            if (nCopies) {
                lastNumSteps = nCopies;
                cloneAndBlend(selection, nCopies);
            } // else dialog was canceled or input wasn't a number
        });

    } else {
        blendColors(selection);
    }
}

function blend(color1, color2, percent) {
    return new Color({
        r: Math.round(color1.r + percent*(color2.r - color1.r)),
        g: Math.round(color1.g + percent*(color2.g - color1.g)),
        b: Math.round(color1.b + percent*(color2.b - color1.b)),
        a: Math.round(color1.a + percent*(color2.a - color1.a))
    });
}

function sortSiblings(items, presumedParent) {
    presumedParent.children.forEach((node, i) => {
        node._zIndex = i;
    });
    items.sort((a, b) => {
        return a._zIndex - b._zIndex;
    });
    return items;
}

function sortByZ(selection) {
    if (selection.editContext.parent) {
        // Edit context is a container node, so all nodes have that container as their parent
        return sortSiblings(selection.items, selection.items[0].parent);

    } else {
        // Root edit context: selection may be spread across multiple artboards and the pasteboard
        // First, bucket selection by parent
        var selectionByParent = new Map();
        selection.items.forEach(node => {
            if (!selectionByParent.has(node.parent)) {
                selectionByParent.set(node.parent, []);
            }
            selectionByParent.get(node.parent).push(node);
        });

        // Sort the buckets themselves by parent z-order
        selection.editContext._zIndex = -1;  // treat pasteboard content as lowest in z order, below all artboards
        var sortedParents = sortSiblings(Array.from(selectionByParent.keys()), selection.editContext);

        // Sort the set of siblings in each bucket & join together
        var result = [];
        sortedParents.forEach(parent => {
            var itemsInParent = selectionByParent.get(parent);
            result = result.concat(sortSiblings(itemsInParent, parent));
        });

        return result;
    }
}

function blendColors(selection) {
    // Sort items by Z order for predictability, since marquee selection order depends on which nodes the marquee drag touched first, which is pretty arbitrary
    var items = sortByZ(selection);

    var color1 = items[0].fill;
    var color2 = items[items.length - 1].fill;
    if (!checkFillType(color1, color2)) { return; }

    for (var i = 1; i < items.length - 1; i++) {
        var percent = i / (items.length - 1);
        items[i].fill = blend(color1, color2, percent);
    }
}

function cloneAndBlend(selection, nCopies) {
    var original = selection.items[0];
    var final = selection.items[selection.items.length - 1];
    var dx = final.boundsInParent.x - original.boundsInParent.x;
    var dy = final.boundsInParent.y - original.boundsInParent.y;

    var color1 = selection.items[0].fill;
    var color2 = selection.items[selection.items.length - 1].fill;
    // (fill type is checked before clone settings dialog)

    var clones = [];

    for (var i = nCopies; i > 0; i--) {  // clone last to first so Z order is nicer
        selection.items = [original];
        commands.duplicate();
        var clone = selection.items[0];

        var percent = i / (nCopies + 1);
        clone.fill = blend(color1, color2, percent);
        clone.moveInParentCoordinates(dx*percent, dy*percent);
        clones.push(clone);
    }

    selection.items = [original, ...clones, final];
}

function showOnboarding() {
    var dialog = document.createElement("dialog");
    dialog.innerHTML = `
        <form method="dialog">
            <h1>Color Blender</h1>
            <hr>
            <ul>
                <li>• Select two items to create a series of clones with colors blended between them, or</li>
                <li>• Select more items to apply the blend to existing objects</li>
            </ul>
            <footer>
                <button id="ok" type="submit" uxp-variant="cta">OK</button>
            </footer>
        </form>`;
    document.appendChild(dialog);

    return dialog.showModal().then(function () {
        dialog.remove();
    });
}

function checkFillType(color1, color2) {
    if (!(color1 instanceof Color) || !(color2 instanceof Color)) {
        var dialog = document.createElement("dialog");
        dialog.innerHTML = `
            <form method="dialog">
                <h1>Color Blender</h1>
                <hr>
                <div>Start and end must both have a solid-color fill.</div>
                <footer>
                    <button id="ok" type="submit" uxp-variant="cta">OK</button>
                </footer>
            </form>`;
        document.appendChild(dialog);

        dialog.showModal().then(function () {
            dialog.remove();
        });
        return false;
    }
    return true;
}

function showCloneSettings() {
    var dialog = document.createElement("dialog");
    dialog.innerHTML = `
        <style>
        .row {
            display: flex;
            align-items: center;
        }
        </style>
        <form method="dialog">
            <h1>Color Blender</h1>
            <hr>
            <div class="row">
                <label>Number of steps:</label>
                <input type="text" uxp-quiet="true" id="numSteps" value="${lastNumSteps}" />
            </div>
            <footer>
                <button id="cancel" type="reset" uxp-variant="primary">Cancel</button>
                <button id="ok" type="submit" uxp-variant="cta">OK</button>
            </footer>
        </form>`;
    document.appendChild(dialog);

    // Ok button & Enter key automatically 'submit' the form
    // Esc key automatically cancels
    // Cancel button has no default behavior
    document.getElementById("cancel").onclick = () => dialog.close(DIALOG_CANCELED);

    return dialog.showModal().then(function (reason) {
        dialog.remove();

        if (reason === DIALOG_CANCELED) {
            return null;
        } else {
            return parseInt(dialog.querySelector("#numSteps").value);
        }
    });
}

module.exports = {
    commands: {
        blendCommand: menuHandler
    }
};