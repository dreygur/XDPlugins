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
/*globals module, require, exports, console, document */

const sg = require("scenegraph");

function showDialog(content, buttons) {
    var dialog = document.createElement("dialog");
    dialog.innerHTML = `
        <style>
        .space-below { margin-bottom: 12px; }
        </style>
        <form method="dialog">
            <h1>TrimIt</h1>
            <hr>
            ${content}
            <footer>${buttons}</footer>
        </form>`;
    document.appendChild(dialog);

    return dialog.showModal().then(function () {
        dialog.remove();
    });
}


function trimArtboard(artboard) {
    var minX, minY, maxX, maxY;
    artboard.children.forEach(function (node) {
        var bounds = node.boundsInParent;  // might be a tad faster to work in terms of globalBounds, but whatever
        if (bounds.x < minX || minX === undefined) { minX = bounds.x; }
        if (bounds.y < minY || minY === undefined) { minY = bounds.y; }

        // This is actually 1px past the max, which is why we don't need to +1 when computing the new artboard width below
        if (bounds.x + bounds.width > maxX || maxX === undefined) { maxX = bounds.x + bounds.width; }
        if (bounds.y + bounds.height > maxY || maxY === undefined) { maxY = bounds.y + bounds.height; }
    });

    if (!maxX || !maxY) {
        // If artboard is empty (0 children, or only empty groups), leave it untouched
        return;
    }

    // Upper-left crop
    artboard.moveInParentCoordinates(minX, minY);
    artboard.children.forEach(function (node) {
        node.moveInParentCoordinates(-minX, -minY);
    });

    // Bottom-right crop
    artboard.width = maxX - minX;
    artboard.height = maxY - minY;
}

function trimText(node) {
    // Converge on perfect height by performing the following with progressively smaller increments:
    // - If clippedByArea, expand until not
    // - If not clippedByArea, shrink until is
    var style = node.styleRanges[0];
    var increment = style.lineSpacing || style.fontSize;

    if (!node.clippedByArea) { increment = -increment; }

    var height = node.areaBox.height;

    for (; Math.abs(increment) >= 1; increment = -Math.trunc(increment / 2)) {
        var origValue = node.clippedByArea;

        while (node.clippedByArea === origValue) {
            height += increment;
            console.log(height);
            node.resize(node.areaBox.width, height);
        }
    }

    if (node.clippedByArea) {
        node.resize(node.areaBox.width, height + 1);
    }
}

function trimRepeatGrid(rgrid) {
    // Proper snapped width is cellSize.width*N + rgrid.paddingX*(N-1) -- for some integer N
    // So N = (width + paddingX) / (cellSize.width + paddingX)
    var cellSize = rgrid.cellSize;
    var paddingX = rgrid.paddingX;
    var paddingY = rgrid.paddingY;
    var cols = Math.round((rgrid.localBounds.width + paddingX) / (cellSize.width + paddingX));
    var rows = Math.round((rgrid.localBounds.height + paddingY) / (cellSize.height + paddingY));
    rgrid.resize(cols*cellSize.width + (cols-1)*paddingX, rows*cellSize.height + (rows-1)*paddingY);
}

function trimSelection(selection, root) {
    var didSomething = false;

    selection.items.forEach(function (node) {
        if (node instanceof sg.Artboard) {
            didSomething = true;
            trimArtboard(node);
        } else if (node instanceof sg.Text && node.areaBox) {
            didSomething = true;
            trimText(node);
        } else if (node instanceof sg.RepeatGrid) {
            didSomething = true;
            trimRepeatGrid(node);
        }
    });

    if (!didSomething) {
        showDialog(`<div class="space-below">Select one or more items to trim:</div>
            <ul>
                <li>• Artboard &ndash; snap to size of contents, eliminating any margin</li>
                <li>• Repeat Grid &ndash; snap to nearest whole number of grid cells</li>
                <li>• Area Text &ndash; snap height to fit text perfectly with no clipping</li>
            </ul>`,
            `<button id="ok" type="submit" uxp-variant="cta">OK</button>`);
        // (note: due to UXP bug, can't dismiss this dialog via Enter key...)
    }
}

exports.commands = {
    trimSelection: trimSelection
};