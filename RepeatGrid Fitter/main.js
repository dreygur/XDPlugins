const {Path, Color, Group,RepeatGrid} = require("scenegraph");
const commands = require("commands");
const {error} = require("./libs/dialogs.js");
async function mainFunction(selection, root) {
    // find RepeatGrids
    const grids = findRepeatGrid(selection);
    if (grids.length==0) {
        error("リピートグリッドを選択してください。");
        return;
    }
    const gridInfoList = [];
    createDialog();
    let elemNumColums, elemNumItems, elemIndexGrid;
    elemIndexGrid = dialog.querySelector("#indexGrid");
    elemNumColums = dialog.querySelector("#settingColumns");
    elemNumItems = dialog.querySelector("#settingItems");
    for (let i=0;i<grids.length;i++){
        let grid = grids[i];
        selection.items = [grid];
        // getRepeatGridInformation(grids[i]);
        // let columnsNum = await prompt("RepeatGrid ユーティリティ","列数は？",3);
        // let celLength = await prompt("RepeatGrid ユーティリティ","要素の数は？",7);
        // console.log(columnsNum, celLength);
        // let resultColumns = (columnsNum.which==1)? parseInt(columnsNum.value): 3;
        // let resultItems = (celLength.which==1)? parseInt(celLength.value):7;
        // setCellNum(selection, grids[i], resultColumns,resultItems);
        elemIndexGrid.innerHTML = (i+1) + "番目のグリッド";
        elemNumColums.value = grid.numColumns;
        elemNumItems.value = grid.numRows * grid.numColumns;
        
        await dialog.showModal().then(function(){
            var valueColumns = elemNumColums.value;
            var valueItems = elemNumItems.value;
            fitSizeGird(grid, valueColumns, Math.ceil(valueItems/valueColumns));
            if(grid.numColumns*grid.numRows>valueItems) {
                setCellNum(selection, grid, valueColumns, valueItems);
            }
    
        });
        
    }

}
function fitSizeGird(rg, columns, rows) {
    console.log("fitSizeGrid");
    if (!columns) columns = rg.numColumns;
    if (!rows) rows = rg.numRows;
    rg.width = rg.cellSize.width * columns + rg.paddingX*(columns-1);
    // const newRows =  Math.ceil(length/columns);
    rg.height = rg.cellSize.height * rows + rg.paddingY*(rows-1);

}
function setCellNum(selection, rg, columns,length) {
    selection.items = [rg];
    const maskPath = new Path();
    selection.insertionParent.addChild(maskPath);
    const basePoint = {x:rg.boundsInParent.x, y:rg.boundsInParent.y};
    basePoint.right = basePoint.x + rg.width;
    basePoint.bottom = basePoint.y + rg.height;
    const exceptRect = {};
    const exceptCell = columns - (length % columns);
    exceptRect.right = basePoint.right;
    exceptRect.bottom = basePoint.bottom;
    exceptRect.y = exceptRect.bottom - rg.cellSize.height - rg.paddingY;
    exceptRect.x = exceptRect.right - (rg.cellSize.width*exceptCell + rg.paddingX*exceptCell);
    console.log(exceptRect);
    const start = "M"+basePoint.x + " " + basePoint.y;
    const end = " L"+basePoint.x + " " + basePoint.y;
    const path = " H " + basePoint.right
                + " V " + exceptRect.y
                + " H " + exceptRect.x
                + " V " + exceptRect.bottom
                + " H " + basePoint.x;
                console.log(path);
    maskPath.pathData = start + path + end;
    maskPath.fill = new Color("#666");

    selection.items = [rg, maskPath];
    commands.createMaskGroup();
}
function findRepeatGrid(selection) {
    const result = [];
    for(let i=0;i<selection.items.length;i++) {
        console.log(selection.items[i].constructor.name);
        if (selection.items[i] instanceof RepeatGrid) {
            result.push(selection.items[i]);
        }
    }
    return result;
}
function getRepeatGridInformation(rd) {
    console.log("セル数横: "+ rd.numColumns + "/セル数縦: " + rd.numRows);
    console.log("width: "+ rd.width + "/height: " + rd.height);
    console.log("paddingX: "+ rd.paddingX + "/paddingY: " + rd.paddingY);
    console.log("セルの幅: "+ rd.cellSize.width + "/セルの高さ: " + rd.cellSize.height);
    getNodeInformation(rd.children.at(0).children);

}
function getNodeInformation(nodeList) {
    console.log("セルの要素数" + nodeList.length);
    for (let i=0;i<nodeList.length;i++) {
        let node = nodeList.at(i);
        console.log(node.constructor.name);
        if(node instanceof Group) {
            getNodeInformation(node);
            continue;
        } else if (node instanceof RepeatGrid) {//とりあえずネストしたオブジェクトは無視する
            continue;
        }
    }
}
let dialog;
function createDialog() {
    if(dialog) return;
    dialog = document.createElement("dialog");
    dialog.innerHTML = `
    <style>
        .row {
            display: flex;
        }
        .col {
            display: flex;
            flex-direction: column;
        }
        label{
            text-align: left;
            display: block;
            padding:5px;
        }

    </style>
    <div class="col">
        <h2>Setting for <span id="indexGrid"></span></h2>
        <form method="dialog">
            <div class="row">
                <label>
                    Number of Columns(列)
                    <input type="number" name="numColumns" id="settingColumns" value="">
                </label>
                <label>
                    Number of Items(アイテム数)
                    <input type="number" name="newNumItems" id="settingItems" value="">
                </label>
            </div>
            <div>
            <button id="ok" type="submit" uxp-variant="cta">to Fit</button> 
            </div>
        </form>
    </div>
    `;
    document.body.appendChild(dialog);
    return;
}
module.exports = {
    commands: {
        "mainCommand": mainFunction
    }
}
