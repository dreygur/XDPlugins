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
const {Artboard} = require("scenegraph");
const Viewport = require("viewport");

const DIALOG_CANCELED = "reasonCanceled";

var origViewport;
var candidates;
var filtered;
var selectedI;

// General behavior:
// - Type to filter artboards by name; top 5 hits are shown (dialogs can't resize yet)
// - Top item semi-highlighted to indicate pressing Enter will go to it
// - Arrow keys to select: pans to artboard immediately (then nothing more happens on Enter)
//    - Editing filter text after using arrows to select tries to keep the same item selected if it's still in the top results
// - If only one result after filtering, select & go to it automatically
// - Closing dialog via Escape reverts viewport to original position


function escape(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;");
}

function gatherCandidates(root) {
    candidates = root.children.filter(node => node instanceof Artboard);
}

function rerenderList() {
    var listItemsHTML = "";
    filtered.forEach((node, i) => {
        var cssClass = (i === selectedI)? "selected" : (i === 0 && selectedI === -1)? "onDeck" : "";
        listItemsHTML +=  `<div class="${cssClass}">${escape(node.name)}</div>`;
    });
    document.getElementById("list").innerHTML = listItemsHTML;
}

function updateList(filterText) {
    var selectedArtboard = filtered[selectedI];  // undefined if nothing selected

    filterText = filterText.toLowerCase();
    filtered = candidates.filter(node => node.name.toLowerCase().indexOf(filterText) !== -1);
    filtered = filtered.slice(0, 5);

    if (filtered.length === 1) {
        selectedI = 0;
        gotoArtboard(filtered[0]);
    } else {
        // If last selected artboard is still in filtered results, keep it selected if possible
        selectedI = filtered.indexOf(selectedArtboard);
        // (will be -1 if nothing was selected before, or if selected artboard no longer in filtered results)
    }
    rerenderList();
}

function quickNav(selection, root) {
    filtered = [];
    selectedI = -1;

    var dialog = document.createElement("dialog");
    dialog.innerHTML = `
        <style>
        .row {
            display: flex;
            align-items: center;
        }
        #list {
            padding-top: 8px;
            width: 300px;
        }
        #list div {
            height: 35px;
            padding: 9px 5px 2px 5px;
            font-size: 12px;
        }
        #list div.selected {
            background: #d8d8d8;
            border-radius: 5px;
        }
        #list div.onDeck {
            border: 1px solid #a0a0a0;
            padding: 8px 4px 1px 4px; /* compensate for border */
            border-radius: 5px;
        }
        </style>
        <form method="dialog">
            <h1>Artboard Quick Navigate</h1>
            <hr>
            <div class="row">
                <input type="text" uxp-quiet="true" id="input" />
            </div>
            <div id="list"></div>
        </form>`;
    document.appendChild(dialog);

    origViewport = Viewport.bounds;
    gatherCandidates(root);
    updateList("");

    var input = document.getElementById("input");
    input.addEventListener("input", function () {
        updateList(input.value);
    });
    input.addEventListener("keydown", function (event) {
        if (event.code === "ArrowDown") {
            if (filtered.length && selectedI < filtered.length - 1) {
                selectedI++;
                gotoArtboard(filtered[selectedI]);
                rerenderList();
            }
        } else if (event.code === "ArrowUp") {
            if (filtered.length && selectedI > 0) {
                selectedI--;
                gotoArtboard(filtered[selectedI]);
                rerenderList();
            }
        }
    });

    // Enter key automatically 'submits' the form
    // Esc key automatically cancels
    return dialog.showModal().then(function (reason) {
        dialog.remove();

        if (reason === DIALOG_CANCELED) {
            Viewport.scrollToCenter(origViewport.x + origViewport.width / 2, origViewport.y + origViewport.height / 2);
        } else if (filtered.length > 0 && selectedI === -1) {
            gotoArtboard(filtered[0]);
        }
    });
}

function gotoArtboard(artboard) {
    var bounds = artboard.globalBounds;
    var viewport = Viewport.bounds;

    // Include artboard title label in bounds we're centering
    const LABEL_HT = 18 / Viewport.zoomFactor;
    bounds.y -= LABEL_HT;
    bounds.height += LABEL_HT;

    if (bounds.width <= viewport.width && bounds.height <= viewport.height) {
        // If entire bounds fits, center it
        Viewport.scrollToCenter(
            bounds.x + bounds.width / 2,
            bounds.y + bounds.height / 2
        );
    } else {
        // Otherwise, place UL of bounds in UL of viewport
        Viewport.scrollToCenter(
            bounds.x - 13 + viewport.width / 2,
            bounds.y - 10 + viewport.height / 2
        );
    }
}

module.exports = {
    commands: {
        quickNav: quickNav
    }
};