const { Artboard, Rectangle, Ellipse, Text, Color } = require("scenegraph");


let panel;

function longestCommonPrefix(a) 
{ 
    let size = a.length; 

    /* if size is 0, return empty string */
    if (size == 0) 
        return ""; 

    if (size == 1) 
        return a[0]; 

    /* sort the array of strings */
    a.sort(); 

    /* find the minimum length from first and last string */
    let end = Math.min(a[0].length, a[size-1].length); 

    /* find the common prefix between the first and 
       last string */
    let i = 0; 
    while (i < end && a[0].charAt(i) == a[size-1].charAt(i) ) 
        i++; 

    let pre = a[0].substring(0, i); 
    return pre; 
} 

function addPrefix() {
    const HTML =
        `<style>
        .title {
            color: #000000;
            width: 100%;
            text-align: left;
            font-size: 12px;
        }
        .checkboxlabel {
            font-size: 10px;
        }
        .break {
            flex-wrap: wrap;
        }
        label.row > span {
            
        }
        label.row input {
            flex: 1 1 auto;
        }
        .show {
            display: block;
        }
        .hide {
            display: none;
        }
        .light {
            background-color: #FFFFFF;
            border: 0.5px solid #ccc !important;
            border-style: solid none none none;
        }
        .default {
            border: 0.5px solid #ccc !important;
            border-style: solid none none none;
        }
    </style>
    <div id="toolPanel" class="show">
        <p class="title"> Change text prefix</p>
        <div class="row break">
            <label class="row">
                <input type="string" uxp-quiet="true" id="txtV" value="" placeholder="Prefix" />
            </label>
        </div>
        <footer>
            <button id="removePrefix" uxp-variant="secondary">Remove</button>
            <button id="addPrefix" uxp-variant="primary">Add</button>
        </footer>
    </div>
        
    `;

    panel = document.createElement("div");
    panel.innerHTML = HTML;
    
    const addButton = panel.querySelector("#addPrefix");
    const removeButton = panel.querySelector("#removePrefix");

    addButton.addEventListener("click", _onAddPrefixButton);
    removeButton.addEventListener("click", _onRemovePrefixButton);

    function _onAddPrefixButton(e) {
        const { editDocument } = require("application");
        const prefix = document.querySelector("#txtV").value;

        editDocument({ editLabel: "Increase rectangle size" }, function (selection) {
            selection.items.forEach(node => {                              // [1]
            
                if(node instanceof Text) {

                    let lines = node.text.split('\n');

                    for(let i = 0; i < lines.length; i++) {
                        lines[i] = prefix + lines[i];
                    }
                    
                    node.text = lines.join('\n');
                }
            });
        });
    }

    function _onRemovePrefixButton(e) {
        const { editDocument } = require("application");
        const prefix = document.querySelector("#txtV").value;

        editDocument({ editLabel: "Increase rectangle size" }, function (selection) {
            if(prefix && prefix.length > 0) {
                
                selection.items.forEach(node => {     

                    let lines = node.text.split('\n');

                    for(let i = 0; i < lines.length; i++) {
                        if(lines[i].indexOf(prefix) == 0) {
                            lines[i] = lines[i].substring(prefix.length);    
                        }
                    }

                    node.text = lines.join('\n');

                });
            }
            else {
                
                selection.items.forEach(node => {                              // [1]

                    if(node instanceof Text) {
                        let lines = node.text.split('\n');

                        for(let i = 0; i < lines.length; i++) {
                            lines[i] = lines[i].substring(prefixLength);
                            if(lines[i].length == 0) lines[i] = ' ';
                        }
    
                        node.text = lines.join('\n');
                        
                    }
                });
            }
            
        });
    }

    return panel;
}

function addLineNumbers() {
    const HTML =
        `
    <div id="changeLineNumberPanel" class="show light">
        <p class="title"> Change Line Numbers</p>
        <div class="row break">
            <label class="row">
                <input type="string" uxp-quiet="true" id="delim" value="" placeholder="Delimiter" />
            </label>
            <label class="row">
                <input type="number" uxp-quiet="true" id="startWith" value="" placeholder="Start with (0, 1 etc.)" />
            </label>
        </div>
        <footer>
            <button id="removeLineNumber" uxp-variant="secondary">Remove</button>
            <button id="addLineNumber" uxp-variant="primary">Add</button>
        </footer>
    </div>
    `;
    
    panel = document.createElement("div");
    panel.innerHTML = HTML;

    const addLineNumber = panel.querySelector("#addLineNumber");
    const removeLineNumber = panel.querySelector("#removeLineNumber");

    addLineNumber.addEventListener('click', _onAddLineNumber);
    removeLineNumber.addEventListener('click', _onRemoveLineNumber);

    function _onAddLineNumber(e) {
        const { editDocument } = require("application");
        const delim = document.querySelector("#delim").value;
        const startWith = Number(document.querySelector("#startWith").value);

        editDocument({ editLabel: "Add line Number" }, function (selection) {
            selection.items.forEach(node => {                              // [1]
            
                if(node instanceof Text) {

                    let lines = node.text.split('\n');

                    for(let i = 0; i < lines.length; i++) {
                        lines[i] = startWith + i + delim + lines[i];
                    }
                    
                    node.text = lines.join('\n');
                }
            });
        });
    }

    function _onRemoveLineNumber(e) {
        const { editDocument } = require("application");
        const delim = document.querySelector("#delim").value;
        const startWith = Number(document.querySelector("#startWith").value);

        editDocument({ editLabel: "Add line Number" }, function (selection) {
            let regexp = new RegExp('^\\d+'+delim, 'gm');
        
            selection.items.forEach(node => {                              // [1]
                
                if(node instanceof Text) {

                    let lines = node.text.split('\n');

                    for(let i = 0; i < lines.length; i++) {
                        lines[i] = lines[i].replace(regexp, '');
                    }
                    
                    node.text = lines.join('\n');
                }
            });
        });
    }

    return panel;
}

function regExp() {
    const HTML =
        `
    <p id="warning">This plugin requires text selection</p>
    <form class="light" method="dialog" id="main">
        <p class="title">Modify Text</p>
        <div class="row break">
            <label class="row">
                <input type="string" uxp-quiet="true" id="pattern" value="" placeholder="Pattern  eg. dog" />
            </label>
            <label class="row">
                <input type="string" uxp-quiet="true" id="flags" value="" placeholder="Flags eg. gm" />
            </label>
            <label class="row">
                <input type="string" uxp-quiet="true" id="repW" value="" placeholder="Replacement eg. ferret" />
            </label>
        </div>
        <footer><button id="ok" type="submit" uxp-variant="cta">Run regular expression</button></footer>
    </form>
    `;
    function modifyText() {
        const { editDocument } = require("application");

        const pattern = document.querySelector("#pattern").value;
        const flags = document.querySelector("#flags").value;
        const repWith = document.querySelector("#repW").value;

        console.log(regExp);
        console.log(repWith);
        
        editDocument({ editLabel: "Increase rectangle size" }, function (selection) {
            
            selection.items.forEach(node => {                              // [1]
                
                if(node instanceof Text) {
                    var regExpActual = new RegExp(pattern, flags);
                    node.text = node.text.replace(regExpActual, repWith);
                }
            });
        })
    }

    panel = document.createElement("div");
    panel.innerHTML = HTML;
    panel.querySelector("form").addEventListener("submit", modifyText);

    return panel;
}

function addNewLine() {
    const HTML =
        `
        <div id="changeNewLinesPanel" class="show default">
            <p class="title"> Change Newlines</p>
            <div class="row break">
                <label class="row">
                    <input type="string" uxp-quiet="true" id="delim3" value="" placeholder="After" />
                </label>
            </div>
            <footer>
                <button id="removeNewLines" uxp-variant="secondary">Remove</button>
                <button id="addNewLines" uxp-variant="primary">Add</button>
            </footer>
        </div>
    `;

    panel = document.createElement("div");
    panel.innerHTML = HTML;
    
    const addNewLines = panel.querySelector('#addNewLines');
    const removeNewLines = panel.querySelector('#removeNewLines');

    addNewLines.addEventListener('click', _onAddListener);
    removeNewLines.addEventListener('click', _onRemoveListener);

    function _onAddListener(e) {
        const { editDocument } = require("application");
        const delim = document.querySelector("#delim3").value;

        editDocument({ editLabel: "Add new line" }, function (selection) {
            selection.items.forEach(node => {                              // [1]
                
                if(node instanceof Text) {

                    let lines = node.text.split(delim);

                    for(let i = 0; i < lines.length; i++) {
                        if(i > 0)
                            lines[i] = '\n' + lines[i];
                    }
                    
                    node.text = lines.join(delim);
                }
            });
        });

    }

    function _onRemoveListener(e) {
        const { editDocument } = require("application");
        const delim = document.querySelector("#delim3").value;

        editDocument({ editLabel: "Remove new line" }, function (selection) {
            selection.items.forEach(node => {                              // [1]
                
                if(delim.length == 0) {
                    if(node instanceof Text) {
                        node.text = node.text.split('\n').join('');
                    }
                }
                else {
                    let lines = node.text.split(delim);

                    for(let i = 0; i < lines.length; i++) {
                        if(lines[i].indexOf('\n') == 0) lines[i] = lines[i].substring('\n'.length);
                    }                        

                    node.text = lines.join(delim);
                }
            });
        });
    }

    return panel;
}

function addTrailingSpaces() {
    
    const HTML =
        `
        <div id="changeNewLinesPanel" class="show light">
            <p class="title"> Change trailing spaces</p>
            <div class="row break">
                <label class="row">
                <input type="number" uxp-quiet="true" id="delim123" value="" placeholder="Length, if adding space" />
                </label>
                <div class="row">
                    <input type="checkbox" uxp-quiet="true" id="tsbegin" name="add"/><label class="checkboxlabel" for="tsbegin">Beginning</label>
                    <input type="checkbox" uxp-quiet="true" id="tsend" name="add"/><label class="checkboxlabel" for="tsend">End</label>
                </div>
            </div>
            <footer>
                <button id="removeSpaces" uxp-variant="secondary">Remove</button>
                <button id="addSpaces" uxp-variant="primary">Add</button>
            </footer>
        </div>
    `;

    panel = document.createElement("div");
    panel.innerHTML = HTML;
    
    const addSpaces = panel.querySelector('#addSpaces');
    const removeSpaces = panel.querySelector('#removeSpaces');

    const beginningCheck = panel.querySelector('#tsbegin');
    const endCheck = panel.querySelector('#tsend');

    addSpaces.addEventListener('click', _onAddSpaceListener);
    removeSpaces.addEventListener('click', _onRemoveSpacesListener);

    beginningCheck.addEventListener('click', _onBeginningCheckListener);
    endCheck.addEventListener('click', _onEndCheckListener);
    
    function _onAddSpaceListener(e) {

        console.log('here');
        const { editDocument } = require("application");
        const delim = Number(document.querySelector("#delim123").value);
        
        const tsbegin = document.querySelector("#tsbegin").checked;
        const tsend = document.querySelector("#tsend").checked;


        console.log('delim',delim);
        console.log('tsbegin',tsbegin);
        console.log('tsend',tsend);

        if(delim == 0) delim++;

        editDocument({ editLabel: "Add Space" }, function (selection) {
            let toadd = ' '.repeat(delim);

            selection.items.forEach(node => {                              // [1]
                if(node instanceof Text) {

                    let lines = node.text.split('\n');

                    for(let i = 0; i < lines.length; i++) {
                        if(tsbegin) {
                            lines[i] = toadd + lines[i];
                        }
    
                        if(tsend) {
                            lines[i] = lines[i] + toadd;
                        }
                    }
                    
                    node.text = lines.join('\n');
                }
            });
        });
    }

    function _onRemoveSpacesListener(e) {
        
        const { editDocument } = require("application");
        const delim = Number(document.querySelector("#delim123").value);
        
        const tsbegin = document.querySelector("#tsbegin").checked;
        const tsend = document.querySelector("#tsend").checked;

        if(delim == 0) delim++;

        let toremove = ' '.repeat(delim);

        editDocument({ editLabel: "Add Space" }, function (selection) {
            
            selection.items.forEach(node => {                              // [1]
                if(node instanceof Text) {

                    let lines = node.text.split('\n');

                    for(let i = 0; i < lines.length; i++) {
                        if(tsbegin && lines[i].indexOf(toremove) == 0) {
                            lines[i] = lines[i].substring(toremove.length);
                        }
    
                        if(tsend && lines[i].endsWith(toremove)) {
                            lines[i] = lines[i].substring(0, lines[i].length - toremove.length);
                        }
                    }
                    
                    node.text = lines.join('\n');
                }
            });
        });
    }

    function _onBeginningCheckListener(e) {

        const tsbegin = document.querySelector("#tsbegin");
        const tsend = document.querySelector("#tsend");

        tsend.checked = !tsbegin.checked;
    }


    function _onEndCheckListener(e) {
        const tsbegin = document.querySelector("#tsbegin");
        const tsend = document.querySelector("#tsend");

        tsbegin.checked = !tsend.checked;
    }

    return panel;
}

function show(event) {
    if (!panel) 
        {
            event.node.appendChild(regExp());
            event.node.appendChild(addPrefix());
            event.node.appendChild(addLineNumbers());
            event.node.appendChild(addNewLine());
            event.node.appendChild(addTrailingSpaces());
            
        }
}

module.exports = {
    panels: {
        modifyText: {
            show
        }
    }
};