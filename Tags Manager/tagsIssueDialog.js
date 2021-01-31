let ourDialog;
function showOurDialog(tag, artboardsList, componentCount, cancelFunction, okFunction) {

    let para1 = "The tag '" + tag + "' is currently assigned to artboards: '" + artboardsList + "' and '" + componentCount.toString() + "' other objects. ";
    let para2 = "Please remove the tag from either all artboards or all other objects for the plugin to work correctly.";

    if (!ourDialog) {
        ourDialog = document.createElement("dialog");
        ourDialog.innerHTML = `
<style>
    form {
        width: 360px;
    }
    .h1 {
        align-items: center;
        justify-content: space-between;
        display: flex;
        flex-direction: row;
    }
    .icon {
        border-radius: 4px;
        width: 24px;
        height: 24px;
        overflow: hidden;
    }
</style>
<form method="dialog">
    <h1 class="h1">
        <span>Selection Issue</span>
        <img class="icon" src="./assets/icon@1x.png" />
    </h1>
    <hr />
    <p>${para1}</p>
    <p>${para2}</p>
    <p>Clean up the tags assignment. Select 'artboard' option to delete tag:'${tag}' from artboard. Select 'object option to delete tag:'${tag} from other objects</p>
    <label>
        <input type="checkbox" uxp-quiet="true" selected id="artboardOption" name="artboardOption"/><label class="checkboxlabel" for="artboardOption">artboard</label>
        <input type="checkbox" uxp-quiet="true" id="objectOption" name="objectOption"/><label class="checkboxlabel" for="objectOption">object</label>
    </label>
    <footer>
        <button id="selectionIssueCancel" uxp-variant="primary">Cancel</button>
        <button id="selectionIssueOk" type="submit" uxp-variant="cta">Ok</button>
    </footer>
</form>
        `;
        document.appendChild(ourDialog);

        let selectionIssueCancel = document.querySelector("#selectionIssueCancel");
        let selectionIssueOk = document.querySelector("#selectionIssueOk");

        selectionIssueCancel.addEventListener("click", e => {ourDialog.close("reasonCanceled"); cancelFunction();});
        selectionIssueOk.addEventListener("click", e => {
            ourDialog.close("reasonOk"); 
            let inputVal = (artboardOption.checked)?'artboard':'object';
            okFunction(inputVal);});
        let artboardOption = document.querySelector("#artboardOption");
        let objectOption = document.querySelector("#objectOption");
        
        artboardOption.addEventListener('change', _onArtboardCheckListener);
        objectOption.addEventListener('change', _onObjectCheckListener);

        function _onArtboardCheckListener(e) {
            let artboardOption = document.querySelector("#artboardOption");
            let objectOption = document.querySelector("#objectOption");
            
            objectOption.checked = !e.target.checked;
        }
    
        function _onObjectCheckListener(e) {

            console.log(e.target.checked);
            let artboardOption = document.querySelector("#artboardOption");
            let objectOption = document.querySelector("#objectOption");
        
            artboardOption.checked = !e.target.checked;
        }
    }
    return ourDialog.showModal();
}

module.exports.showOurDialog = showOurDialog;