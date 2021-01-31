const clipboard = require("clipboard");
const { Color, selection } = require("scenegraph")
let panel;
let flutterCodes = "";
let selectedPaths = [];

function create() {
    const HTML = `
    <style>
    .break {
        flex-wrap: wrap;
    }

    label.row>span {
        color: #8E8E8E;
        width: 5px;
        text-align: right;
        font-size: 12px;
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

    .codeView {
        height: 500px;
        border: 1px solid #ccc;
        font-size: 140%;
        overflow: auto;
        padding: 10px;
    }
    </style>
    <form method="dialog" id="main">
        <h5>Area</h5>
        <div class="row break">
            <label class="row">
                <span>↔︎</span>
                <input type="number" uxp-quiet="true" id="txtW" value="10" size=10 placeholder="Width" />
            </label>
            <label class="row">
                <span>↕︎</span>
                <input type="number" uxp-quiet="true" id="txtH" value="10" size=10 placeholder="Height" />
            </label>
        </div>
        <label>
            <input type="checkbox" id="cb_artboard" checked>Match artboard size<br>
        </label>
        <br>
        <label>
            <input type="checkbox" id="cb_style" checked>Generate style code<br>
        </label>
        <br><br>
        <button id="ok" type="submit" uxp-variant="cta">Copy</button><br>
        <h5>Flutter Code</h5><br>
        <div id="flutter_code" uxp-quiet="true" class="codeView"></div>
    </form>
    <h5 id="warning">Need to select path to work with this plugin</h5>
        `

    panel = document.createElement("div");
    panel.innerHTML = HTML;
    panel.querySelector("form").addEventListener("submit", function () {
        clipboard.copyText(flutterCodes);
        console.log("Code generated and copied to clipboard");
        // console.log(flutterCodes);
    });
    panel.querySelector("#cb_artboard").addEventListener("change", updateAreaInfo);
    panel.querySelector("#cb_style").addEventListener("change", updateAreaInfo);

    return panel;
}

function updateAreaInfo() {
    let width = panel.querySelector("#txtW");
    let height = panel.querySelector("#txtH");
    let isArtboardChecked = panel.querySelector("#cb_artboard").checked;

    width.readOnly = isArtboardChecked;
    height.readOnly = isArtboardChecked;

    let area = isArtboardChecked ? selection.focusedArtboard.localBounds : selection.items[0].localBounds;

    console.log(area);

    width.value = round(area.width);
    height.value = round(area.height);

    generatePathData(selectedPaths);
    document.querySelector("#flutter_code").innerHTML = flutterCodes.trim().replace(/\n/g, "<br>");
}

function show(event) {
    if (!panel) event.node.appendChild(create());
}

function update() {
    const { Path } = require("scenegraph");
    let form = document.querySelector("form");
    let warning = document.querySelector("#warning");

    if (!selection || selection.items.length == 0) {
        form.className = "hide";
        warning.className = "show";
    }

    // if (selection.items.length > 1) {
    //     form.className = "hide";
    //     warning.className = "show";
    //     warning.innerHTML = "You should not select mulltiple paths!";
    // }

    selectedPaths = [];
    selection.items.forEach(element => {
        if (element instanceof Path) selectedPaths.push(element);
    });

    if (selectedPaths.length == 0) {
        form.className = "hide";
        warning.className = "show";
    } else {
        form.className = "show";
        warning.className = "hide";
        updateAreaInfo();
    }
}

function generatePathData(selectedPaths) {
    flutterCodes = "";
    let inputWidth = panel.querySelector("#txtW").value;
    let inputHeight = panel.querySelector("#txtH").value;
    let isStyleChecked = panel.querySelector("#cb_style").checked;
    let isArtboardChecked = panel.querySelector("#cb_artboard").checked;

    selectedPaths.forEach(path => {
        let f = new Color(path.fill);
        let fillColor = "0x" + f.a.toString(16) + f.toHex().slice(1);
        let s = new Color(path.stroke);
        let strokeColor = "0x" + s.a.toString(16) + s.toHex().slice(1);

        let style = {
            "enabled": isStyleChecked,
            "fillEnabled": path.fillEnabled,
            "fill": fillColor,
            "strokeEnabled": path.strokeEnabled,
            "stroke": strokeColor,
            "strokeWidth": path.strokeWidth,
            "strokeCap": path.strokeEndCaps,
            "strokeJoin": path.strokeJoins
        }
        // console.log(style);

        let segments = extractedPathData(path.pathData);
        let offset = findOffsetPoint(segments);

        let normalized = normalizePoints(segments, offset);
        let code = generateCode(normalized, {
            "reposition": isArtboardChecked,
            "x": path.topLeftInParent.x,
            "y": path.topLeftInParent.y,
            "name": path.name.toLowerCase().replace(/ /g, "_"),
            "width": isArtboardChecked ? inputWidth : round(path.localBounds.width),
            "height": isArtboardChecked ? inputHeight : round(path.localBounds.height),
            "style": style
        });

        // console.log(code);
        flutterCodes += (code + "\n\n");
    });
}

const extractedPathData = (rawPathStr) => {
    const segments = rawPathStr.split(" ");
    const output = [];
    let last = -1;
    for (let i = 0; i < segments.length; i++) {
        if (isNaN(segments[i])) {
            output.push([segments[i]]);
            last++;
        } else {
            output[last].push(parseFloat(segments[i]));
        }
    }
    return output;
}

const findOffsetPoint = (pathSegments) => {
    let offset = [9999, 9999];
    for (var id in pathSegments) {
        let segment = pathSegments[id];
        switch (segment[0]) {
            case "M":
                if (segment[1] < offset[0]) offset[0] = segment[1];
                if (segment[2] < offset[1]) offset[1] = segment[2];
                break;
            case "L":
                if (segment[1] < offset[0]) offset[0] = segment[1];
                if (segment[2] < offset[1]) offset[1] = segment[2];
                break;
            case "C":
                if (segment[5] < offset[0]) offset[0] = segment[5];
                if (segment[6] < offset[1]) offset[1] = segment[6];
                break;
        }
    }
    return offset;
}

const normalizePoints = (pathData, offsetPoint) => {
    let data = [];
    for (var id in pathData) {
        var segment = pathData[id];
        data.push(segment);
        if (segment.length < 2) continue;
        for (let i = 1; i < segment.length; i++) {
            let v = segment[i] - offsetPoint[i % 2 != 0 ? 0 : 1];
            data[id][i] = Math.round(v * 100) / 100;
        }
    }
    return data;
}

const round = (number) => { return Math.round(number * 100) / 100; }

function generateCode(path, props) {
    let xs = props.name + "_xs";
    let ys = props.name + "_ys";
    var code = [
        ["    // " + props.name, 0],
        ["double " + xs + " = size.width / " + round(props.width) + ";", 1],
        ["double " + ys + " = size.height / " + round(props.height) + ";", 1],
        ["Path " + props.name + " = Path()", 2]
    ];

    for (var segmentId in path) {
        var segment = path[segmentId];
        switch (segment[0]) {
            case "M":
                code.push([
                    "    ..moveTo("
                    + segment[1] + " * " + xs + ", " + segment[2] + " * " + ys + ""
                    + ")"
                    , 1]);
                break;
            case "L":
                code.push([
                    "    ..lineTo("
                    + segment[1] + " * " + xs + ", " + segment[2] + " * " + ys + ""
                    + ")"
                    , 1]);
                break;
            case "C":
                code.push([
                    "    ..cubicTo("
                    + segment[1] + " * " + xs + ", " + segment[2] + " * " + ys + ","
                    + segment[3] + " * " + xs + ", " + segment[4] + " * " + ys + ","
                    + segment[5] + " * " + xs + ", " + segment[6] + " * " + ys + ""
                    + ")"
                    , 1]);
                break;
            case "Z":
                code.push(["    ..close()", 1]);
                break;
        }
    }

    code[code.length - 1][0] += ";";

    let ox = round(props.x);
    let oy = round(props.y);
    if (props.reposition && (ox != 0.0 || oy != 0.0)) code.push([
        props.name + " = " + props.name + ".shift(Offset(" + ox + " * " + xs + ", " + oy + " * " + ys + "));"
        , 2]);

    if (props.style.enabled && props.style.fillEnabled) code.push([
        "Paint " + props.name + "_fillPaint = Paint()..style = PaintingStyle.fill..color = Color(" + props.style.fill + ");"
        , 2]);

    if (props.style.enabled && props.style.strokeEnabled) {
        code.push(["Paint " + props.name + "_strokePaint = Paint()", 2]);
        code.push(["    ..style = PaintingStyle.stroke", 1]);
        code.push(["    ..color = Color(" + props.style.stroke + ")", 1]);
        code.push(["    ..strokeWidth = " + props.style.strokeWidth, 1]);
        if (props.style.strokeCap != "butt") code.push(["    ..strokeCap = StrokeCap." + props.style.strokeCap, 1]);
        if (props.style.strokeJoin != "miter") code.push(["    ..strokeJoin = StrokeJoin." + props.style.strokeJoin, 1]);
        code.push([";", 0]);
    }

    var returnCode = "";
    for (var lineId in code) {
        var line = code[lineId];
        for (var i = 0; i < line[1]; i++) returnCode += "\n";
        returnCode += line[0];
    }

    return returnCode;
}

module.exports = {
    panels: {
        generatePathData: {
            show,
            update
        }
    }
};