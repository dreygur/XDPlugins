module.exports = {
    exportWindowContent: `
<style>
    form {
        width: 450px;
    }
    p {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
    }
    .row {
        align-items: center;
    }
    #changeExportPath {
        font-size: 12pt;
        color: grey;
        text-align: left;
    }
    label {
        margin-top: 10px;
    }
    .inline-button:hover {
        background: #e7e7e7;
    }
</style>

<form method="dialog">

<h1>Export Settings</h1>

<label class="inline-button">
    <div class="row" style="padding-left:5px">
        <img src="/assets/folder@3x.png" style="width:16px;height:13px" />
        <span id="changeExportPath" style="font-size: 14pt;">Select export folder...</span>
    </div>
</label>

<label class="row" title="Slashes in the name of your exports will automatically arrange exports in sub-directories in the export folder">
    <input type="checkbox" id="createSubDirectories" checked />
    <span>Slashes for sub-directories</span>
</label>

<label>
    <span>Export Mode:</span>
    <select id="modeSelection">
        <option value="selection">Selected only</option>
        <option value="markedFromSelection">Marked for export (from selected)</option>
        <option value="markedFromRoot">Marked for export (from root)</option>
    </select>
</label>

<label class="row">
    <span>Export Type:</span>
    <select id="typeSelection">
        <option value="PNG">PNG</option>
        <option value="JPG">JPG</option>
        <option value="PDF">PDF</option>
        <option value="SVG">SVG</option>
    </select>
</label>

<label class="row">
    <span>Scale:</span>
    <div><input type="number" name="scale" value="3" id="scaleInput"></div>
</label>

<footer>
    <button id="cancel">Cancel</button>
    <button type="submit" id="export" uxp-variant="cta" autofocus>Export</button>
</footer>

</form>
`
}


/*


*/